/// Only for DEV - Everyting in this section will be delete and replaced by builder.ts content
import { type Connector, type Settings, Checker, Builder } from './builder'

// Constant Data represent injected data from IFTTT
// Rename the constant and change the strukture according to the current data
const Feed = {
    /**
    newFeedItem: {
        EntryUrl: 'https://www.facebook.com/687057223214894/posts/910330967554184',
        EntryPublished: 'March 07, 2024 at 09:06AM',
        FeedTitle: 'Kraje ČR - Ústecký kraj',
        EntryAuthor: 'Ústecký kraj',
        EntryContent: 'Skvělá zpráva❗️<br> Robot sestavený týmem ROBUL míří do Ameriky🥳🇺🇸<br> <br> <iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F1502719007316724%2F&amp;width=640&amp;height=480&amp;show_text=false" width="640" height="480" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allow="encrypted-media" allowTransparency="true" allowFullScreen="true"></iframe>',
        EntryImageUrl: 'https://scontent-dus1-1.xx.fbcdn.net/v/t15.5256-10/423473723_416336387556114_679661949638261358_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=7swAX6I8DLsAX_tAnGy&_nc_ht=scontent-dus1-1.xx&edm=AJdBtusEAAAA&oh=00_AfBhyeLXqdrEvROMPx0QNUbOU1tE7WgdKaQtSJNSmiKE_w&oe=65EE8781',
        EntryTitle: 'Skvělá zpráva❗️ Robot sestavený týmem ROBUL míří do Ameriky🥳🇺🇸',
        FeedUrl: 'https://www.facebook.com/usteckykrajzive',
    }
    /**/
    newFeedItem: {
        EntryUrl: 'https://www.facebook.com/783740063762291/posts/882683360534627',
        EntryPublished: 'March 07, 2024 at 04:15PM',
        FeedTitle: 'Headliner',
        EntryAuthor: 'Headliner',
        EntryContent: 'Frontman Guns N\' Roses byl v listopadu minulého roku obviněn ze sexuálního napadení bývalou modelkou Sheilou Kennedyovou. Nyní se zpěvákův právní tým braní.< br > <br> ✍️ https://www.headliner.cz/novinky/axl-rose-se-brani-vuci-zalujici-modelce-pozaduje-sankce<br> <br> <img src="https://scontent-dus1-1.xx.fbcdn.net/v/t39.30808-6/431133209_882681590534804_2772262738556538763_n.jpg?stp=dst-jpg_p720x720&amp;_nc_cat=104&amp;ccb=1-7&amp;_nc_sid=5f2048&amp;_nc_ohc=thkKyxSrtYYAX8n-gFA&amp;_nc_ht=scontent-dus1-1.xx&amp;edm=AJdBtusEAAAA&amp;oh=00_AfD6XJgbdGjSyFGuJU8X8oWPTlqCNpLBDX-wDLzkGI5ilg&amp;oe=65EF865B">',
        EntryImageUrl: 'https://scontent-dus1-1.xx.fbcdn.net/v/t39.30808-6/431133209_882681590534804_2772262738556538763_n.jpg?stp=dst-jpg_p720x720&_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_ohc=thkKyxSrtYYAX8n-gFA&_nc_ht=scontent-dus1-1.xx&edm=AJdBtusEAAAA&oh=00_AfD6XJgbdGjSyFGuJU8X8oWPTlqCNpLBDX-wDLzkGI5ilg&oe=65EF865B',
        EntryTitle: 'Frontman Guns N\' Roses byl v listopadu minulého roku obviněn ze sexuálního napadení bývalou modelkou Sheilou Kennedyovou.Nyní s...',
        FeedUrl: 'https://www.facebook.com/headliner.cz',
    }
    /**/
}
///DEV

const connector: Connector = {
    entry: {
        title: null,
        content: Feed.newFeedItem.EntryContent,
        url: Feed.newFeedItem.EntryUrl,
        imageUrl: Feed.newFeedItem.EntryImageUrl,
        author: Feed.newFeedItem.EntryAuthor,
    },
    feed: {
        title: Feed.newFeedItem.FeedTitle,
        url: Feed.newFeedItem.FeedUrl,
    }
}

// If you need to change some settings
const settings: Settings = {
    RepostAllowed: false,
    ShowStatusUrlPerm: false,
}

// If you need to add or change some checks
class CustomChecker extends Checker {
}

// If you need to change some functionality
class CustomBuilder extends Builder {
    setup(): void {
        // call parent setup as first
        super.setup()

        // adding custom content middlewares
        this.addContentMiddlewares()
    }

    /** Utilities **/


    /** Content middlewares **/

}

// At the end of the file, the Builder instance must be stored in "export const builder"
export const builder = new CustomBuilder(connector, settings, new CustomChecker())
