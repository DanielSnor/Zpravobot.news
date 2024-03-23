/// Only for DEV - Everyting in this section will be delete and replaced by builder.ts content
import { type Connector, type Settings, Checker, Builder } from './builder'

// Constant Data represent injected data from IFTTT
// Rename the constant and change the strukture according to the current data
const Twitter = {
    /**
    newTweetFromSearch: {
        Text: 'RT @andreofpolesia: Momentálně jsme na 55.555,- Kč. Čas je do čtvrtka 19:00.',
        LinkToTweet: 'https://twitter.com/JakubSzanto/status/1759222145622622404',
        UserImageUrl: 'https://pbs.twimg.com/profile_images/1590290926278156288/sqn4fpTf_normal.jpg',
        UserName: 'JakubSzanto',
    }
    /**
    newTweetFromSearch: {
        Text: 'Rozhovor s @JanLipavsky: "Když se někteří čeští politici zkoušeli bavit se Západem i Východem, tak většinou skončili pouze na Východě a ještě si z nich udělali užitečné idioty. Myslím, že příklad našeho bývalého prezidenta Miloše Zemana je toho důkazem." https://t.co/ASTObBncgv',
        CreatedAt: 'March 07, 2024 at 05:03PM',
        FirstLinkUrl: 'https://www.aktuality.sk/clanok/XceQsiT/sef-ceskej-diplomacie-lipavsky-nas-pohar-pretiekol-vzajomne-vztahy-ohrozuju-vyroky-fica-nie-my-rozhovor/',
        LinkToTweet: 'https://twitter.com/Posledniskaut/status/1765770363504660947',
        UserName: 'Posledniskaut',
        UserImageUrl: 'https://pbs.twimg.com/profile_images/1649100295820001299/LrmUmCFK_normal.jpg',
    }
    /**
    newTweetFromSearch: {
        Text: 'Očima Saši Mitrofanova: Výhra svobodného plebejství https://t.co/w6nk5YRCr9',
        CreatedAt: 'March 07, 2024 at 02:51PM',
        FirstLinkUrl: 'https://www.novinky.cz/clanek/komentare-ocima-sasi-mitrofanova-vyhra-svobodneho-plebejstvi-40463408',
        LinkToTweet: 'https://twitter.com/AlexandrMitrofa/status/1765736934251340172',
        UserName: 'AlexandrMitrofa',
        UserImageUrl: 'https://pbs.twimg.com/profile_images/1741819225373544448/pq5ypocj_normal.jpg',
    }
    /**
    newTweetFromSearch: {
        Text: 'RT @michalblaha: Vážení Pražané! Před Úřadem vlády je zdarma k odebrání kvalitní hnojivo pro Vaše zahrádky a květináče. Nezajíždějte sem au…',
        CreatedAt: 'March 07, 2024 at 12:25PM',
        FirstLinkUrl: undefined,
        LinkToTweet: 'https://twitter.com/AlexandrMitrofa/status/1765700190265086359',
        UserName: 'AlexandrMitrofa',
        UserImageUrl: 'https://pbs.twimg.com/profile_images/1741819225373544448/pq5ypocj_normal.jpg',
    }
    /**
    newTweetFromSearch: {
        Text: 'Na Letenské pláni jsme uhasili požár dvou balíků slámy. Událost se obešla bez škody a zranění. https://t.co/zczz08Y7Yu',
        CreatedAt: 'March 07, 2024 at 02:53PM',
        FirstLinkUrl: 'https://twitter.com/HasiciPraha/status/1765737527011373393/photo/1',
        LinkToTweet: 'https://twitter.com/HasiciPraha/status/1765737527011373393',
        UserName: 'HasiciPraha',
        UserImageUrl: 'https://pbs.twimg.com/profile_images/1738814993494085633/O9sbLzl7_normal.jpg',
    }
    /**
    newTweetFromSearch: {
        Text: 'Policisté zajistili před Úřadem vlády ČR jednoho muže, který se snažil přelezt přes oplocení. V tuto chvíli také v Letenském tunelu řešíme dopravní nehodu traktoru, který se v protisměru čelně střetl s osobním vozidlem. Jeden člověk z osobního auta je zraněný.',
        CreatedAt: 'March 07, 2024 at 02:09PM',
        FirstLinkUrl: undefined,
        LinkToTweet: 'https://twitter.com/PolicieCZ/status/1765726507488469424',
        UserName: 'PolicieCZ',
        UserImageUrl: 'https://pbs.twimg.com/profile_images/811493492568584194/vqzXE3Jt_normal.jpg',
    }
    /**
    newTweetFromSearch: {
        Text: 'RT @michalblaha: Data z online přihlášek na střední školy. Poprvé, co jsou taková data k dispozici a navíc pár dní po přijetí. https://t.c…',
        CreatedAt: 'March 07, 2024 at 02:20PM',
        FirstLinkUrl: undefined,
        LinkToTweet: 'https://twitter.com/HlidacStatu/status/1765729278547599670',
        UserName: 'HlidacStatu',
        UserImageUrl: 'https://pbs.twimg.com/profile_images/1496186762837823492/gFdr5NvZ_normal.jpg',
    }
    /**
    newTweetFromSearch: {
        Text: 'RT @iure_cz: Kdo nejvíc slídil v našem soukromí v roce 2023? My už výsledky známe, vy se je dozvíte ve středu 20. března v Unijazzu 🥳 Poro…',
        CreatedAt: 'March 07, 2024 at 02:13PM',
        FirstLinkUrl: undefined,
        LinkToTweet: 'https://twitter.com/HlidacStatu/status/1765727426271695071',
        UserName: 'HlidacStatu',
        UserImageUrl: 'https://pbs.twimg.com/profile_images/1496186762837823492/gFdr5NvZ_normal.jpg',
    }
    /**
    newTweetFromSearch: {
        Text: 'Tohle je fajn. https://t.co/e5h57oyHiR',
        CreatedAt: 'March 07, 2024 at 05:06PM',
        FirstLinkUrl: 'https://twitter.com/ct24zive/status/1765758334978654423',
        LinkToTweet: 'https://twitter.com/jindrichsidlo/status/1765770923548819684',
        UserName: 'jindrichsidlo',
        UserImageUrl: 'https://pbs.twimg.com/profile_images/1746259434291040257/vuCUrVdQ_normal.jpg',
    }
    /**/
    newTweetFromSearch: {
        Text: 'Česko-slovenské vztahy jsou skvělé, Ficem si je kazit rozhodně nedáme. https://t.co/mULfg6DFfc',
        CreatedAt: 'March 07, 2024 at 06:09PM',
        FirstLinkUrl: 'https://twitter.com/Pavel_Tomasek/status/1765777645768188127',
        LinkToTweet: 'https://twitter.com/janmolacek/status/1765786830929051757',
        UserName: 'janmolacek',
        UserImageUrl: 'https://pbs.twimg.com/profile_images/1699611625244770304/7I4mhw5__normal.jpg',
    }
    /**/
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
    StatusUrlSentence: '🔗',
}

// If you need to add or change some checks
class CustomChecker extends Checker {
    repost(str: string): boolean {
        return this.valid(new RegExp('^RT [^>]+: '), str)
    }

    repostOwn(str: string, authorName: string): boolean {
        return this.valid(new RegExp(`^RT ${authorName}: `), str)
    }

    responseToSomeoneElse(str: string, authorName: string): boolean {
        return this.valid(new RegExp(`^R to (?!${authorName}: ).*?: `), str)
    }

    quote(str: string): boolean {
        return this.valid(new RegExp('t\.co/[a-z0-9]+$', 'i'), str)
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
