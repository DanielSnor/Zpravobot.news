/// Only for DEV - Everyting in this section will be delete and replaced by builder.ts content
import { type Connector, type Settings, Checker, Builder } from './builder'

// Constant Data represent injected data from IFTTT
// Rename the constant and change the strukture according to the current data
const Data = {
}
///DEV

const connector: Connector = {
    entry: {
        title: String(Data),
        content: String(Data),
        url: String(Data),
        imageUrl: String(Data),
        author: String(Data),
    },
    feed: {
        title: String(Data),
        url: String(Data),
    }
}

// If you need to change some settings
const settings: Settings = {
}

// If you need to add or change some checks
class CustomChecker extends Checker {
}

// If you need to change some functionality
class CustomBuilder extends Builder {
    UserInstance: string = '.bsky.social.com'
    RepostSentence: string = '📤🦋'
    QuoteSentence: string = '📝💬🦋'

    setup(): void {
        // call parent setup as first
        super.setup()

        let entryAutor = this.entry.author
        let feedAuthor = this.feed.title.substring(this.feed.title.indexOf('(') + 1, this.feed.title.indexOf(')'))

        // adding custom content middlewares
        this.addContentMiddlewares(
            this._removePostBy,
            this._replaceReposted.bind(this, feedAuthor, entryAutor),
            this._replaceQuoted.bind(this, feedAuthor, entryAutor),
        )
    }

    /** Utilities **/


    /** Content middlewares **/

    _removePostBy(content: string): string {
        return content.replace(
            new RegExp('Post by[^>]+:', 'gi'),
            ''
        )
    }

    _replaceReposted(feedAuthor: string, entryAuthor: string, content: string): string {
        const sentence = this.RepostSentence ? ` ${this.RepostSentence} ` : ' '

        return content.replace(
            new RegExp('^Repost ([^>]+): '),
            `${feedAuthor}${sentence}${entryAuthor}:\n\n`
        )
    }

    _replaceQuoted(feedAuthor: string, entryAuthor: string, content: string): string {
        const sentence = this.QuoteSentence ? ` ${this.QuoteSentence} ` : ' '

        return content.replace(
            new RegExp('(\\[quote\\])'),
            `${feedAuthor}${sentence}${entryAuthor}:\n\n`
        )
    }
}

// At the end of the file, the Builder instance must be stored in "export const builder"
export const builder = new CustomBuilder(connector, settings, new CustomChecker())
