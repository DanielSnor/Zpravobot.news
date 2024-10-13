/**
 * Script for posting from RSS
 * Set the URL with the target RSS as env variable RSS_URL when run in the terminal
 * The necessary env variables are in .env.example
 */

const { stop, env, PostsRepository, Mastodon } = require('./libs')
const RssParser = require('rss-parser')


class RssPost {
    guid
    title
    link
    enclosure // potencial source of media
    content

    static createFromItem(item) {
        const self = new RssPost()

        for (const attr in item) {
            if (Object.hasOwn(self, attr)) self[attr] = item[attr]
        }

        return self
    }
}

class RSS {
    _url
    _parser

    constructor() {
        this._url = env('RSS_URL')
        this._parser = new RssParser()
    }

    async feed() {
        const feed = await this._parser.parseURL(this._url)

        return feed.items.map(RssPost.createFromItem)
    }
}


(async () => {
    try {
        const rss = new RSS()
        const postsRepository = new PostsRepository()
        const mastodon = new Mastodon()

        const posts = await rss.feed()

        const unpostedGuids = await postsRepository.filterUnposted(posts.map(article => article.guid))
        const postedGuids = []

        // waits for all parallel requests to finish and for postedGuids to be filled
        await Promise.all(posts.map(art => unpostedGuids.includes(art.guid)
            ? mastodon.newPost(art.guid, `${art.title}\n${art.content}\n${art.link}`).then(post => post && postedGuids.push(art.guid))
            : Promise.resolve()
        ))

        await postsRepository.savePosted(postedGuids)
        stop.success(`Posted ${postedGuids.length} post${postedGuids.length !== 1 ? 's' : ''}`)

    } catch (error) {
        stop.failed(error)
    }
})()
