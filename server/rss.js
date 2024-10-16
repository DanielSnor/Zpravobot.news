require('dotenv').config({ path: '.env.rss' })
const { stop, env, PostsRepository, Mastodon, Feed, Entry, Post, Validator, Middlewares, Settings } = require('./libs')
const RssParser = require('rss-parser')

class RSS {
    _url
    _parser

    constructor() {
        this._url = env('RSS_URL')
        this._parser = new RssParser()
    }

    /**
     * Fetches RSS and returns
     * @returns {Post[]}
     */
    async posts() {
        const feed = await this._parser.parseURL(this._url)

        return feed.items.map(item => this._createPost(item, feed))
    }


    _createPost(item, feed) {
        const postFeed = new Feed()
        postFeed.link = feed.feedUrl
        postFeed.title = feed.title
        postFeed.image = feed.image.url

        // removes utm_* parameters from post URL
        const postUrl = new URL(item.link)
        const params = postUrl.searchParams
        for (const name of [...params.keys()]) {
            if (name.startsWith('utm')) {
                params.delete(name)
            }
        }

        const postEntry = new Entry()
        postEntry.guid = item.guid
        postEntry.link = postUrl.toString()
        postEntry.title = item.title
        postEntry.creator = item.creator
        postEntry.content = item.content
        postEntry.image = item.enclosure.url

        const self = new Post()
        self.feed = postFeed
        self.entry = postEntry

        return self
    }
}

/**
 * @param {Post} post
 * @returns {string}
 */
function createStatus(post) {
    let status = null

    if (post.entry.content && post.entry.content.length) {
        status = post.entry.content
    }

    if (post.entry.title && post.entry.title.length) {
        status = `${post.entry.title || ''}${status ? ':\n' : ''}${status || ''}`
    }

    if (!status) throw Error('Empty content')

    // applies all content editing functions sequentially
    status = [
        Middlewares.replaceBasicFormatting,
        Middlewares.removeHtml,
        Middlewares.replaceCzechCharacters,
        Middlewares.replaceSpecialCharacters,
        Middlewares.replaceAmpersands,
        Middlewares.trim,
        (str) => `${str}\n`,
    ].reduce((content, callback) => callback(content), status)

    // modification of status in case when showing the image is enabled
    if (Settings.ShowImageUrl && post.entry.image) {
        const imageUrl = Middlewares.replaceAmpersands(post.entry.image)
        const sentence = Settings.StatusImageUrlSentence ? `${Settings.StatusImageUrlSentence} ` : ''

        status = `${status}${sentence}${imageUrl}`
    }

    // adding status URL to end
    if (
        // is set as permanent
        Settings.ShowStatusUrlPerm

        // no other URLs
        || (!Validator.containsUrl(status) && !post.entry.image)
    ) {
        const sentence = Settings.StatusUrlSentence ? `${Settings.StatusUrlSentence} ` : '\n'
        const statusUrl = Settings.ShowFeedUrlInsteadPostUrl ? (post.feed.link || post.entry.link) : post.entry.link
        status = `${status}${sentence}${statusUrl}`
    }

    return status
}


// runs process
(async () => {
    try {
        const rss = new RSS()
        const postsRepository = new PostsRepository()
        const mastodon = new Mastodon()

        const posts = await rss.posts()

        const unpostedGuids = await postsRepository.filterUnposted(posts.map(post => post.entry.guid))
        const postedGuids = []

        // waits for all parallel requests to finish and for postedGuids to be filled
        await Promise.all(posts.map(post => unpostedGuids.includes(post.guid)
            ? mastodon.newPost(post.guid, createStatus(post)).then(post => post && postedGuids.push(post.guid))
            : Promise.resolve()
        ))

        await postsRepository.savePosted(postedGuids)
        stop.success(`Posted ${postedGuids.length} post${postedGuids.length !== 1 ? 's' : ''}`)

    } catch (error) {
        stop.failed(error)
    }
})()
