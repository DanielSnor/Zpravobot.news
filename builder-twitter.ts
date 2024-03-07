/// Only for DEV - Everyting in this section will be delete and replaced by builder.ts content
import { type Connector, type Settings, Checker, Builder } from './builder'

// Constant Data represent injected data from IFTTT
// Rename the constant and change the strukture according to the current data
const Twitter = {
    newTweetFromSearch: {
        Text: 'RT @andreofpolesia: Momentálně jsme na 55.555,- Kč. Čas je do čtvrtka 19:00.',
        LinkToTweet: 'https://twitter.com/JakubSzanto/status/1759222145622622404',
        UserImageUrl: 'https://pbs.twimg.com/profile_images/1590290926278156288/sqn4fpTf_normal.jpg',
        UserName: 'JakubSzanto',
    }
}
///DEV

const connector: Connector = {
    entry: {
        title: null,
        content: Twitter.newTweetFromSearch.Text,
        url: Twitter.newTweetFromSearch.LinkToTweet,
        imageUrl: Twitter.newTweetFromSearch.UserImageUrl,
        author: Twitter.newTweetFromSearch.UserName,
    },
    feed: {
        title: Twitter.newTweetFromSearch.UserName,
        url: `https://twitter.com/${Twitter.newTweetFromSearch.UserName}`,
    }
}

// If you need to change some settings
const settings: Settings = {
    ShowImageUrl: false,
    ShowStatusUrlPerm: false,
    StaturUrlReplaceSource: 'https://twitter.com/',
    StatusUrlReplaceTarget: 'https://twitter.com/',
    StatusUrlSentence: '🔗',
}

// If you need to add or change some checks
class CustomChecker extends Checker {
    repost(str: string): boolean {
        return new RegExp('^RT [^>]+: ').test(str)
    }

    repostOwn(str: string, authorName: string): boolean {
        return new RegExp(`^RT ${authorName}: `).test(str)
    }

    responseToSomeoneElse(str: string, authorName: string): boolean {
        return new RegExp(`^R to (?!${authorName}: ).*?: `).test(str)
    }
 }

// If you need to change some functionality
class CustomBuilder extends Builder {
    UserInstance: string = 'twitter.com'
    RepostSentence: string = '📤🐦‍⬛'


    setup(): void {
        // call parent setup as first
        super.setup()

        let entryAutor = this.entry.author
        let feedAuthor = ''

        if (this.is.repost(this.entry.content)) {
            entryAutor = this._findRepostUser(this.entry.content) ?? entryAutor
            feedAuthor = this.feedAuthorUserName ?? ''
        } else {
            feedAuthor = this.opt.ShouldPreferRealName
                ? this.feedAuthorRealName ?? ''
                : this.feedAuthorUserName ?? ''
        }

        // adding custom content middlewares
        this.addContentMiddlewares(
            this._changeStatusUrl,
            this._replaceResponseTo,
            this._replaceReposted.bind(this, feedAuthor, entryAutor),
            this._replaceUserNames.bind(this, this.feedAuthorUserName),
        )
    }


    /** Utilities **/

    _findRepostUser(content: string): string | null {
        const matches = new RegExp('RT (@[a-z0-9_]+)', 'gi').exec(content)

        return matches ? matches[1] : null
    }

    _findRepostUrl(content: string): string | null {
        const matches = new RegExp('href="(?:https:\/\/twitter\.com[^"]+)"', 'gi').exec(content)

        return matches ? matches[1] : null
    }


    /** Content middlewares **/

    _changeStatusUrl(content: string): string {
        // changing URL for the repost
        this._statusUrl = this._findRepostUrl(content) ?? this._statusUrl

        return content
    }

    _replaceResponseTo(content: string) {
        return content.replace(
            new RegExp('^R to (.*?): '),
            ''
        )
    }

    _replaceReposted(accountName: string, postAutor: string, content: string): string {
        const sentence = this.RepostSentence ? ` ${this.RepostSentence} ` : ' '
        return content.replace(
            new RegExp('^RT [^>]+: '),
            `${accountName}${sentence}${postAutor}:\n\n`
        )
    }

    _replaceUserNames(skipName: string, content: string): string {
        // Adds link in Settings.UserInstance to all @usernames except the skipName
        return content.replace(
            new RegExp(`(?<![a-z0-9])(?!${skipName})(@([a-z0-9_]+))`, 'gi'),
            `$1@${this.UserInstance}`
        )
    }
}

// At the end of the file, the Builder instance must be stored in "export const builder"
export const builder = new CustomBuilder(connector, settings, new CustomChecker())
