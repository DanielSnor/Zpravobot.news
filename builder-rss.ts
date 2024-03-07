/// Only for DEV - Everyting in this section will be delete and replaced by builder.ts content
import { type Connector, type Settings, Checker, Builder } from './builder'

// Constant Data represent injected data from IFTTT
// Rename the constant and change the strukture according to the current data
const Feed = {
    /**
    newFeedItem: {
        EntryTitle: 'AMD FSR přináší podporu pro upscaling videa',
        EntryContent: '<img src="https://diit.cz/sites/default/files/style/teaser/public/amd_fsr_video_02.jpg?itok=s8Er6&amp;c=3485e" width="268" height="201" alt="" title="AMD FSR video 02" /> Při ohlášení Radeonu RX 7600 XT uvedla AMD na CES, že poslední verze ovladačů Radeon Adrenaline Softwaree podporuje upscaling videa pres FidelityFXSuper Resolution…',
        EntryUrl: 'https://diit.cz/clanek/amd-fsr-prinasi-podporu-pro-upscaling-videa',
        EntryImageUrl: 'https://diit.cz/sites/default/files/style/teaser/public/amd_fsr_video_02.jpg?itok=s8Er6&amp;c=3485e',
        EntryAuthor: 'no-X',
        FeedTitle: 'Diit.cz',
        FeedUrl: 'https://diit.cz',
    }
    /**
    newFeedItem: {
        EntryUrl: 'https://www.mediaguru.cz/clanky/2024/03/nova-vyznamne-rozsiruje-pokryti-svych-tv-na-severu-cech/',
        EntryPublished: 'March 07, 2024 at 06:10PM',
        FeedTitle: 'MediaGuru',
        EntryContent: '<p><img src="https://mediagurucdneu.azureedge.net/media/26379/usti-nad-labem_pixabay.jpg?v=1" alt="Nova v&#253;znamně rozšiřuje pokryt&#237; sv&#253;ch TV na severu Čech" style="width: 100%; max-width: 400px;" /></p> Společnost Digital Broadcast, operátor DVB-T2 multiplexu 24, spustila výkonem 10 kW vysílání z kóty Ústí nad Labem – Kukla. Signl pokryje až milion obyvatel.',
        EntryImageUrl: 'https://mediagurucdneu.azureedge.net/media/26379/usti-nad-labem_pixabay.jpg?v=1',
        EntryTitle: 'Nova významně rozšiřuje pokrytí svých TV na severu Čech',
        EntryAuthor: 'MediaGuru',
        FeedUrl: 'https://www.mediaguru.cz',
    }
    /**
    newFeedItem: {
        EntryUrl: 'https://www.irozhlas.cz/veda-technologie/veda/zemetreseni-v-jiznich-cechach-nezpusobi-skody-sila-39-stupnu-je-obvykla-jen-na_2403071742_job',
        EntryPublished: 'March 07, 2024 at 05:42PM',
        FeedTitle: 'iROZHLAS.cz',
        EntryContent: 'Jižní Čechy zasáhlo zemětřesení, u Mirotic na Písecku seizmografy zaznamenaly otřesy o síle skoro čtyři stupně. Lidé na sociálních sítích psali, že zemětřesení pocítili až na Šumavě. Žádné velké škody ale nezpůsobilo. „V tomto případě mimo jiné díky tomu, že se odehrálo v relativně větší hloubce, než bývají třeba zemětřesní na západě Čech,“ vysvětluje na Radiožurnálu Aleš Špičák, ředitel Geofyzikálního ústavu Akademie věd.',
        EntryImageUrl: 'https://www.irozhlas.cz/sites/default/files/styles/zpravy_maly_nahled/public/uploader/snimek_obrazovky_2_240307-171557_job.png?itok=8eJYNtQK',
        EntryTitle: 'Zemětřesení v jižních Čechách nezpůsobí škody. Síla 3,9 stupňů je obvyklá jen na Chebsku, vysvětluje vědec',
        EntryAuthor: undefined,
        FeedUrl: 'https://www.irozhlas.cz',
    }
    /**/
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
}
///DEV

const connector: Connector = {
    entry: {
        title: Feed.newFeedItem.EntryTitle,
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
