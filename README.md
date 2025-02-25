# Zpravobot.news
[Zprávobot.news](https://zpravobot.news) 📰🤖 (means Newsbot.news in Czech) is run by Daniel Šnor as a public utility 🖥️⌨️, which🪞popular and majority 🇨🇿 X/🐦 accounts bringing to 🐘 otherwise missing 📰, ⚽️🏒🏎️, information about 📱⌚️💻📡, 🎞️🎶🎭, and sometimes 🤣🤪.

## The mission
This project is focused on developing the IFTTT applet filter script, which is used on the IFTTT server for bots (applets) and fulfils content for standard Mastodon server users.

The server used is a standard Mastodon server with several hundred users. The bot farm at IFTTT fulfils users, where every bot (custom IFTTT applet) has its filter script, which manages the source of information, the process, and the final state of posts published on the Mastodon server.

The original target was to have the only script for the following sources:
- BlueSky
- ~~Nitter~~
- RSS
- X/Twitter
- YouTube

Twitter/X limited Nitter's activities, an open and privacy-oriented front end, by cancelling the hosting accounts it relied on in January 2024, leading to its complete shutdown in February 2024. After this, code parts related to Nitter/IFTTT cooperation were removed and remained focused on the other four services.

## Why is it split?
Due to limitations on the IFTTT side, you cannot have YouTube or RSS connectors in the Twitter applet, but the filter code should be the same for all sources, so I divided this script into several parts.

The final filter script for applying it in filter code in the IFTTT applet is composed of three parts:
- settings
- connector
- IFTTT applet filter script

Even if the filter is written as universal, you still have to choose the proper settings and connector based on the type of source, so if you want to use it for the BlueSky applet, you have to compose it from settings for Bluesky, a connector for BlueSky and universal filter. The final code is then pasted to your IFTTT applet into the filter.

## Folders
- ./CONNECTORS contains connectors. A special connector is used for X/Twitter and YouTube, and an RSS connector is used for BlueSky and RSS. 
- ./SETTINGS - contains "default" settings for all supported applet types. 
- ./EXAMPLES - contains complete IFTTT filter script examples for every supported service 
- ./DOCS - contains documentation for the appropriate setting of all IFTTT applet filter script possibilities.

## Configuration

### Mastodon vs IFTTT communication
For more information about settings on the Mastodon user side, please look at https://hyperborea.org/journal/2017/12/mastodon-iftt/.

### IFTTT applets
For X/Twitter and YouTube, the applet uses specific settings.

#### X/Twitter
- use the "New tweet from search" trigger
- as a "Search for" phrase use "from:twitterUsername -is:reply OR from:twitterUsername to:twitterUsername" (this will filter replies to other Twitter users)
- if you want to filter also retweets and quotes, use "from:twitterUsername -is:reply -is:retweet -is:quote OR from:twitterUsername to:twitterUsername"
- you can also search for some specific hashtag - use "#specifichashtag -is:reply -is:retweet"

#### YouTube
- use the "New public video from subscriptions" trigger
- in "Which subscription?" select the appropriate YT subscription

### That's all!
If you like [Zprávobot.news](https://zpravobot.news) server or this repo and want me support in my activities related to Zpravobot.news, you can do that via following ways:

* 🏦 IBAN: CZ8830300000001001612070
* 🖥️ [https://forendors.cz/zpravobot](https://forendors.cz/zpravobot)
* ☕️ [https://ko-fi.com/zpravobot](https://ko-fi.com/zpravobot)
* 💳 [https://revolut.me/zpravobot](https://revolut.me/zpravobot)

![QR code for bank transfer](https://zpravobot.news/system/media_attachments/files/113/069/699/996/938/723/original/824504de17667be7.jpeg 'QR Kód')

Thank you for your support.

(Prague, Feb 25, 2025)
