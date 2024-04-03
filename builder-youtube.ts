/// Only for DEV - Everyting in this section will be delete and replaced by builder.ts content
import { Connector, Settings, Checker, Builder, WITHOUT_IMAGE } from './builder'

// Constant Data represent injected data from IFTTT
// Rename the constant and change the strukture according to the current data
const Youtube = {
    /**
    newPublicVideoFromSubscriptions: {
        Title: 'Kecy a politika 150: Putin, Klaus a Zeman - paralelní životy',
        Url: 'https://youtu.be/c9OsdUSlQFI',
        CreatedAt: 'March 5, 2024 at 06:00AM',
        AlternativeUrl: 'https://www.youtube.com/watch/c9OsdUSlQFI',
        HttpsEmbedCode: '<div style = "width: 480px; height: 270px; overflow: hidden; position: relative;">< iframe frameborder = "0" scrolling = "no" seamless = "seamless" webkitallowfullscreen = "webkitAllowFullScreen" mozallowfullscreen = "mozallowfullscreen" allowfullscreen = "allowfullscreen" id = "okplayer" width = "480" height = "270" src = "https://youtube.com/embed/c9OsdUSlQFI" style = "position: absolute; top: 0px; left: 0px; width: 480px; height: 270px;" > </></div >',
        AuthorName: 'Kecy a politika',
        Description: 'Americký deník Wall Street Journal zveřejnil návrh mírové smlouvy, o níž dva měsíce po začátku války jednaly politické reprezentace Ukrajiny a Ruska. Vyplývá z toho, že Rusko požadovalo, aby se Ukrajina stala „permanentně neutrálním státem“ a drasticky omezila počty svých vojáků, tanků a dělostřeleckých systémů. To by znamenalo naopak permanentní ohrožení suverenity Ukrajiny. Text potvrdilo i Rusko. Otázkou je, proč v takové atmosféře napadení jednoho státu stále v Česku, ale i jinde, vznikají představy, že je možné pěstovat ve střední Evropě neutralitu. Ještě dál jde slovenský premiér Fico, který říká, že plánem EU je „podporovat vzájemné zabíjení Slovanů.“ Zvnějšku to vypadá, že Fico zahájil proces odstupování z EU i NATO. Ve skutečnosti rozjel diplomatickou akci, kterou nemá pod kontrolou. A co chce Tomio Okamura, který říká, že v příští Babišově vládě chce vnitro, zahraničí a spravedlnost a současně ve sněmovně říká, že „nemůžeme spoléhat na dnes již zdegenerovaný takzvaný Západ, reprezentovaný Německem a Francií?“ Podcast Kecy a politika, ve kterém Bohumil Pečinka, Petros Michopulos rozebírají aktuální politická témata. Občas z režie glosuje i Martin Bartkovský. Jedná se o zkrácenou verzi. Celých 90 minut mohou předplatitelé poslouchat a sledovat na https://www.forendors.cz/kecyapolitika Staňte se členem skupiny Kecy & politika na Facebooku: https://www.facebook.com/groups/kecyapolitika Instagram Petrose Michopulose: https://www.instagram.com/petrosmichopulos/ Instagram Bohumila Pečinky: https://www.instagram.com/bohumilpecinka/ Instagram Kecy a politika: https://www.instagram.com/kecy_a_politika/ TikTok Kecy a politika: https://www.tiktok.com/@kecy_a_politika',
    }
    /**
    newPublicVideoFromSubscriptions: {
        Title: 'Tieto vety by ste od GPS-ky naozaj počuť nechceli! Ďalší Jam už v marci!',
        Url: 'https://youtu.be/9DvOd9mtigU',
        CreatedAt: 'March 6, 2024 at 12:05PM',
        AlternativeUrl: 'https://www.youtube.com/watch/9DvOd9mtigU',
        HttpsEmbedCode: '<div style="width: 480px; height: 270px; overflow: hidden; position: relative;"><iframe frameborder="0" scrolling="no" seamless="seamless" webkitallowfullscreen="webkitAllowFullScreen" mozallowfullscreen="mozallowfullscreen" allowfullscreen="allowfullscreen" id="okplayer" width="480" height="270" src="https://youtube.com/embed/9DvOd9mtigU" style="position: absolute; top: 0px; left: 0px; width: 480px; height: 270px;"></iframe></div>',
        AuthorName: 'Silné reči stand-up comedy show',
        Description: null,
    }
    /**/
    newPublicVideoFromSubscriptions: {
        Title: 'Nevymýšlejte, jak udělat přes noc z koruny milion. Podvodů přibývá, ale bez rizika to nejde',
        Url: 'https://youtu.be/GvZgrHeTNKs',
        CreatedAt: 'March 7, 2024 at 02:41PM',
        AlternativeUrl: 'https://www.youtube.com/watch/GvZgrHeTNKs',
        HttpsEmbedCode: '<div style="width: 480px; height: 270px; overflow: hidden; position: relative;"><iframe frameborder="0" scrolling="no" seamless="seamless" webkitallowfullscreen="webkitAllowFullScreen" mozallowfullscreen="mozallowfullscreen" allowfullscreen="allowfullscreen" id="okplayer" width="480" height="270" src="https://youtube.com/embed/GvZgrHeTNKs" style="position: absolute; top: 0px; left: 0px; width: 480px; height: 270px;"></iframe></div>',
        AuthorName: 'DVTV',
        Description: '💬| „V investování je vždy nějaké riziko, nárůsty podvodů jsou ve stovkách procent, napomáhají tomu technologie. Člověk se divokého západu nemusí bát, ale měl by o něm vědět. Fungují na to takové pranostiky našich babiček jako Ráno moudřejší večera nebo Víc hlav víc ví. Podívejte se na to, jestli se vám někdo nesnaží vnutit něco hned nebo neslibuje zázračné zhodnocení, nechtějte udělat z koruny přes noc milion,“ říká ekonom a člen NERV Dominik Stroukal v dalším dílu série Bořiči investičních mýtů. #komercnispoluprace Partner: XTB / https://www.xtb.com/cz',
    }
    /**/
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
