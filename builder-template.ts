/// Only for DEV - Everyting in this section will be delete and replaced by builder.ts content
import { type Connector, type Settings, Checker, Builder } from './builder'

// Constant Data represent injected data from IFTTT
// Rename the constant and change the strukture according to the current data
const Data = {
}
///DEV

const connector: Connector = {
    entry: {
        title: Data,
        content: Data,
        url: Data,
        imageUrl: Data,
        author: Data,
    },
    feed: {
        title: Data,
        url: Data,
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
