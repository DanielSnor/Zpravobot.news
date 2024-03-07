/// Only for DEV - Everyting in this section will be delete and replaced by builder.ts content
import { type Connector, type Settings, Checker, Builder } from './builder'

// Constant Data represent injected data from IFTTT
// Rename the constant and change the strukture according to the current data
const Feed = {
    newFeedItem: {
        EntryTitle: 'AMD FSR přináší podporu pro upscaling videa',
        EntryContent: '<img src="https://diit.cz/sites/default/files/style/teaser/public/amd_fsr_video_02.jpg?itok=s8Er6&amp;c=3485e" width="268" height="201" alt="" title="AMD FSR video 02" /> Při ohlášení Radeonu RX 7600 XT uvedla AMD na CES, že poslední verze ovladačů Radeon Adrenaline Softwaree podporuje upscaling videa pres FidelityFXSuper Resolution…',
        EntryUrl: 'https://diit.cz/clanek/amd-fsr-prinasi-podporu-pro-upscaling-videa',
        EntryImageUrl: 'https://diit.cz/sites/default/files/style/teaser/public/amd_fsr_video_02.jpg?itok=s8Er6&amp;c=3485e',
        EntryAuthor: 'no-X',
        FeedTitle: 'Diit.cz',
        FeedUrl: 'https://diit.cz',
    }
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
