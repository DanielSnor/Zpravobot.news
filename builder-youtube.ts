/// Only for DEV - Everyting in this section will be delete and replaced by builder.ts content
import { type Connector, type Settings, Checker, Builder } from './builder'

// Constant Data represent injected data from IFTTT
// Rename the constant and change the strukture according to the current data
const Data = {
}
///DEV

const connector: Connector = {
    entry: {
        title: Youtube.newPublicVideoFromSubscriptions.Description ? Youtube.newPublicVideoFromSubscriptions.Title : null,
        content: Youtube.newPublicVideoFromSubscriptions.Description ?? Youtube.newPublicVideoFromSubscriptions.Title,
        url: Youtube.newPublicVideoFromSubscriptions.Url,
        imageUrl: WITHOUT_IMAGE,
        author: Youtube.newPublicVideoFromSubscriptions.AuthorName,
    },
    feed: {
        title: Youtube.newPublicVideoFromSubscriptions.Title,
        url: null,
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
