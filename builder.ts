
type ContentMiddleware = (content: string) => string

// Data about author's post from IFTTT
type Entry = {
    title: string | null,
    content: string,
    url: string,
    imageUrl: string,
    author: string,
}

// Data about feed from IFTTT
type Feed = {
    title: string,
    url: string | null,
}

// Data from IFTTT
export type Connector = {
    entry: Entry,
    feed: Feed,
}

type DefaultSettings = {
    AmpersantReplacement: string,
    MaxPostLength: number,
    RepostAllowed: boolean,
    ShouldPreferRealName: boolean,
    ShowFeedUrlInsteadPostUrl: boolean,
    ShowImageUrl: boolean,
    ShowStatusUrlPerm: boolean,
    StatusUrlSentence: string | null,
    StatusImageUrlSentence: string | null,
}

export type Settings = Partial<DefaultSettings>

// IFTTT send always this URL, if image is not contain or use for no entry image
export const WITHOUT_IMAGE = 'https://ifttt.com/images/no_image_card.png'

export class Checker {
    valid(regex: RegExp, str: string): boolean {
        return regex.test(str)
    }

    imageIncluded(str: string): boolean {
        return str !== WITHOUT_IMAGE
    }

    urlIncluded(str: string): boolean {
        return this.valid(new RegExp('https?://', 'i'), str)
    }

    commercialIncluded(str: string): boolean {
        // Default false, implementation in a custom builder
        return false
    }

    repost(str: string): boolean {
        // Default false, implementation in a custom builder
        return false
    }

    repostOwn(str: string, authorName: string): boolean {
        // Default false, implementation in a custom builder
        return false
    }

    responseToSomeoneElse(str: string, authorName: string): boolean {
        // Default false, implementation in a custom builder
        return false
    }

    quote(str: string): boolean {
        // Default false, implementation in a custom builder
        return false
    }
}

export class Builder {
    _connector: Connector
    _settings: DefaultSettings
    _checker: Checker

    _statusUrl: string

    _contentMiddlewares: ContentMiddleware[] = []

    feedAuthorUserName: string | null = null
    feedAuthorRealName: string | null = null

    constructor(connector: Connector, settings: Settings, checker: Checker) {
        this._connector = connector
        this._checker = checker
        this._settings = {
            AmpersantReplacement: ' a ',
            MaxPostLength: 4750,
            RepostAllowed: true,
            ShouldPreferRealName: true,
            ShowFeedUrlInsteadPostUrl: false,
            ShowImageUrl: true,
            ShowStatusUrlPerm: true,
            StatusImageUrlSentence: null,
            StatusUrlSentence: null,
            ...settings
        } as DefaultSettings

        this.setup()
    }

    entry(): Entry {
        return this._connector.entry
    }

    feed(): Feed {
        return this._connector.feed
    }

    is(): Checker {
        return this._checker
    }

    opt(): DefaultSettings {
        return this._settings
    }

    skip(): boolean {
        // if post is response to someone, skip it
        if (this.is().responseToSomeoneElse(this.entry().content, this.entry().author))
            return true

        // if repost is not allowed and is not own post, skip it
        if (!this.opt().RepostAllowed && this.is().repost(this.entry().content) && !this.is().repostOwn(this.entry().content, this.entry().author))
            return true

        // if post contains commercial
        if (this.is().commercialIncluded(this.entry().title || '') || this.is().commercialIncluded(this.entry().content))
            return true

        return false
    }

    makeStatus(): string {
        const status = this._composeStatus()

        // status for IFTTT webhook
        return `status=${status}`
    }

    /** For custom builders. Starts as the last step in the constructor. */
    setup(): void {
        this._statusUrl = this.opt().ShowFeedUrlInsteadPostUrl ? (this.feed().url || this.entry().url) : this.entry().url

        this.feedAuthorUserName = this.feed().title.substring(this.feed().title.indexOf('@') - 1)
        this.feedAuthorRealName = this.feed().title.substring(0, this.feed().title.indexOf('/') - 1)
    }

    addContentMiddlewares(...middlewares: ContentMiddleware[]): void {
        this._contentMiddlewares.push(...middlewares)
    }

    _composeStatus(): string {
        const content = this._getModifedContent()
        let status = `${content.trim()}\n`

        // modification of status in case when showing the image is enabled
        if (this.opt().ShowImageUrl && this.is().imageIncluded(this.entry().imageUrl)) {
            const imageUrl = this._replaceAmpersands(this.entry().imageUrl)
            const sentence = this.opt().StatusImageUrlSentence ? `${this.opt().StatusImageUrlSentence} ` : ''

            status = `${status}${sentence}${imageUrl}`
        }

        // adding status URL to end
        if (
            // is set as permanent
            this.opt().ShowStatusUrlPerm

            // no other URLs
            || (!this.is().urlIncluded(content) && !this.is().imageIncluded(this.entry().imageUrl))

            // is repost URL
            || (this.is().repost(this.entry().content) && !this.is().repostOwn(this.entry().content, this.entry().author))
        ) {
            const sentence = this.opt().StatusUrlSentence ? `${this.opt().StatusUrlSentence} ` : ''
            status = `${status}${sentence}${this._statusUrl}`
        }

        return status
    }

    _getModifedContent(): string {
        // applies all content editing functions sequentially
        return [
            // custom middlewares
            ...this._contentMiddlewares,
            // basic middlewares
            this._replaceBasicFormatting,
            this._removeHtml,
            this._replaceCzechCharacters,
            this._replaceSpecialCharacters,
            this._replaceAmpersands,
            this._contentHack,
            this._trimContent,
        ].reduce(
            (content: string, callback: ContentMiddleware) => callback.call(this, content),
            this._getContent()
        )
    }

    _getContent(): string {
        let content: string | null = null

        if (this.entry().content && this.entry().content.length) {
            content = this.entry().content
        }

        if (this.entry().title && this.entry().title.length) {
            content = `${this.entry().title || ''}${content ? ':\n' : ''}${content || ''}`
        }

        if (!content) throw Error('Empty content')

        return content
    }

    /** Replace ZZZZZ and KKKKK with the beginning and the end of content designated to remove */
    _contentHack(str: string): string {
        return str.replace(/(ZZZZZ[^>]+KKKKK)/g, '')
    }

    _trimContent(str: string): string {
        if (str.substring(str.length - 2) === ' …') {
            str = str.substring(0, str.length - 1) + '[…]'
        } else if (str.substring(str.length - 1) === '…') {
            const lastSpace = str.lastIndexOf(' ')
            str = str.substring(0, lastSpace) + ' […]'
        }

        if (str.length <= this.opt().MaxPostLength) return str

        const trimmedText = str.substring(0, this.opt().MaxPostLength - 1).trim()

        return str.substring(0, trimmedText.lastIndexOf(' ')) + ' […]'
    }

    _removeHtml(str: string): string {
        return str.replace(/<[^<>]+>/g, '')
    }

    /** Replacing the substring specified by the key with a string in value */
    _replaceAll(str: string, replacements: Record<string, string>, caseSensitive: boolean = false): string {
        for (const find in replacements) {
            const regex = new RegExp(find, caseSensitive ? 'g' : 'ig')
            const replaceValue = replacements[find]
            str = str.replace(regex, replaceValue)
        }

        return str
    }

    _replaceAmpersands(str: string): string {
        return str
            .split(' ')
            .map((word: string) => this.is().urlIncluded(word)
                ? encodeURI(word).replace(/\&amp;/g, '%26').replace(/\&/g, '%26')
                : this._replaceAll(word, {
                    '&amp;': this.opt().AmpersantReplacement,
                    '&#38;': this.opt().AmpersantReplacement,
                    '&#038;': this.opt().AmpersantReplacement,
                    '&': this.opt().AmpersantReplacement,
                })
            )
            .join(' ')
    }

    _replaceBasicFormatting(str: string): string {
        return this
            ._replaceAll(str, {
                '<br>': '\n',
                '</p>': '\n',
            })
            .replace(/\n{2,}/g, '\n')
            .replace(/ {2,}/g, ' ')
    }

    _replaceCzechCharacters(str: string): string {
        return this._replaceAll(str, {
            '&#193;': 'Á',
            '&Aacute;': 'Á',
            'A&#769;': 'Á',
            '&#196;': 'Ä',
            '&Auml;': 'Ä',
            'A&#776;': 'Ä',
            '&#201;': 'É',
            '&Eacute;': 'É',
            'E&#769;': 'É',
            '&#203;': 'Ë',
            '&Euml;': 'Ë',
            'E&#776;': 'Ë',
            '&#205;': 'Í',
            '&Lacute;': 'Í',
            'I&#769;': 'Í',
            '&#207;': 'Ï',
            '&Luml;': 'Ï',
            'I&#776;': 'Ï',
            '&#211;': 'Ó',
            '&Oacute;': 'Ó',
            'O&#769;': 'Ó',
            '&#214;': 'Ö',
            '&Ouml;': 'Ö',
            'O&#776;': 'Ö',
            '&#218;': 'Ú',
            '&Uacute;': 'Ú',
            'U&#769;': 'Ú',
            '&#220;': 'Ü',
            '&Uuml;': 'Ü',
            'U&#776;': 'Ü',
            '&#221;': 'Ý',
            '&Yacute;': 'Ý',
            'Y&#769;': 'Ý',
            '&#225;': 'á',
            '&aacute;': 'á',
            'a&#769;': 'á',
            '&#228;': 'ä',
            '&auml;': 'ä',
            'a&#776;': 'ä',
            '&#233;': 'é',
            '&eacute;': 'é',
            'e&#769;': 'é',
            '&#235;': 'ë',
            '&euml;': 'ë',
            'e&#776;': 'ë',
            '&#237;': 'í',
            '&iacute;': 'í',
            'i&#769;': 'í',
            '&#239;': 'ï',
            '&iuml;': 'ï',
            'i&#776;': 'ï',
            '&#243;': 'ó',
            '&oacute;': 'ó',
            'o&#769;': 'ó',
            '&#246;': 'ö',
            '&ouml;': 'ö',
            'o&#776;': 'ö',
            '&#250;': 'ú',
            '&uacute;': 'ú',
            'u&#769;': 'ú',
            '&#252;': 'ü',
            '&uuml;': 'ü',
            'u&#776;': 'ü',
            '&#253;': 'ý',
            '&yacute;': 'ý',
            'y&#769;': 'ý',
            '&#268;': 'Č',
            '&Ccaron;': 'Č',
            'C&#780;': 'Č',
            '&#269;': 'č',
            '&ccaron;': 'č',
            'c&#780;': 'č',
            '&#270;': 'Ď',
            '&Dcaron;': 'Ď',
            'D&#780;': 'Ď',
            '&#271;': 'ď',
            '&dcaron;': 'ď',
            'd&#780;': 'ď',
            '&#282;': 'Ě',
            '&Ecaron;': 'Ě',
            'E&#780;': 'Ě',
            '&#283;': 'ě',
            '&ecaron;': 'ě',
            'e&#780;': 'ě',
            '&#327;': 'Ň',
            '&Ncaron;': 'Ň',
            'N&#780;': 'Ň',
            '&#328;': 'ň',
            '&ncaron;': 'ň',
            'n&#780;': 'ň',
            '&#336;': 'Ő',
            '&Odblac;': 'Ő',
            'O&#778;': 'Ő',
            '&#337;': 'ő',
            '&odblac;': 'ő',
            'o&#778;': 'ő',
            '&#344;': 'Ř',
            '&Rcaron;': 'Ř',
            'R&#780;': 'Ř',
            '&#345;': 'ř',
            '&rcaron;': 'ř',
            'r&#780;': 'ř',
            '&#352;': 'Š',
            '&Scaron;': 'Š',
            'S&#780;': 'Š',
            '&#353;': 'š',
            '&scaron;': 'š',
            's&#780;': 'š',
            '&#356;': 'Ť',
            '&Tcaron;': 'Ť',
            'T&#780;': 'Ť',
            '&#357;': 'ť',
            '&tcaron;': 'ť',
            't&#780;': 'ť',
            '&#366;': 'Ů',
            '&Uring;': 'Ů',
            'U&#778;': 'Ů',
            '&#367;': 'ů',
            '&uring;': 'ů',
            'u&#778;': 'ů',
            '&#368;': 'Ű',
            '&Udblac;': 'Ű',
            'U&#369;': 'Ű',
            '&#369;': 'ű',
            '&udblac;': 'ű',
            'u&#369;': 'ű',
            '&#381;': 'Ž',
            '&Zcaron;': 'Ž',
            'Z&#780;': 'Ž',
            '&#382;': 'ž',
            '&zcaron;': 'ž',
            'z&#780;': 'ž',
        }, true)
    }

    _replaceSpecialCharacters(str: string): string {
        return this._replaceAll(str, {
            '&#09;': ' ',
            '&#009;': ' ',
            '&#10;': ' ',
            '&#010;': ' ',
            '&#13;': ' ',
            '&#013;': ' ',
            '&#32;': ' ',
            '&#032;': ' ',
            '&#33;': '!',
            '&#033;': '!',
            '&excl;': '!',
            '&#34;': '"',
            '&#034;': '"',
            '&quot;': '"',
            '&#37;': '%',
            '&#037;': '%',
            '&percnt;': '%',
            '&#39;': '‘',
            '&#039;': '‘',
            '&apos;': '‘',
            '&#40;': '(',
            '&#040;': '(',
            '&lpar;': '(',
            '&#41;': ')',
            '&#041;': ')',
            '&rpar;': ')',
            '&#46;': '.',
            '&#046;': '.',
            '&period;': '.',
            '&#60;': '<',
            '&#060;': '<',
            '&lt;': '<',
            '&#61;': '=',
            '&#061;': '=',
            '&equals;': '=',
            '&#62;': '>',
            '&#062;': '>',
            '&gt;': '>',
            '&#160;': ' ',
            '&nbsp;': ' ',
            '&#173;': '',
            '&#xAD;': '',
            '&shy;': '',
            '&#8192;': ' ',
            '&#8193;': ' ',
            '&#8194;': ' ',
            '&#8195;': ' ',
            '&#8196;': ' ',
            '&#8197;': ' ',
            '&#8198;': ' ',
            '&#8199;': ' ',
            '&#8200;': ' ',
            '&#8201;': ' ',
            '&#8202;': ' ',
            '&#8203;': ' ',
            '&#8204;': ' ',
            '&#8205;': ' ',
            '&#8206;': ' ',
            '&#8207;': ' ',
            '&#8208;': '-',
            '&#x2010;': '-',
            '&hyphen;': '-',
            '&#8209;': '-',
            '&#x2011;': '-',
            '&#8211;': '–',
            '&ndash;': '–',
            '&#8212;': '—',
            '&mdash;': '—',
            '&#8216;': '‘',
            '&lsquo;': '‘',
            '&#8217;': '’',
            '&rsquo;': '’',
            '&#8218;': '‚',
            '&sbquo;': '‚',
            '&#8219;': '‛',
            '&#8220;': '“',
            '&ldquo;': '“',
            '&#8221;': '”',
            '&rdquo;': '”',
            '&#8222;': '„',
            '&bdquo;': '„',
            '&#8223;': '‟',
            '&#8230;': '…',
            '&hellip;': '…',
            '&#8242;': '′',
            '&prime;': '′',
            '&#8243;': '″',
            '&Prime;': '″',
            '&#8722;': '-',
            '&minus;': '-',
        })
    }
}
