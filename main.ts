/// Only for DEV
// Everyting in this section will be delete and replaced by builder-???.ts content depends on selected source
import { builder } from './builder-rss'

// Mock of injected IFTTT webhook
const MakerWebhooks = {
    makeWebRequest: {
        skip() {
            console.log('SKIP')
        },
        setBody(body: string) {
            console.log('TO SEND:', body)
        },
    }
}
///DEV

builder.skip()
    ? MakerWebhooks.makeWebRequest.skip()
    : MakerWebhooks.makeWebRequest.setBody(builder.makeStatus())
