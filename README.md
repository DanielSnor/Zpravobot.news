# Zpravobot.news
Zpravobot.news 📰🤖 (means Newsbot.news in Czech) is run by Daniel Šnor as a public utility 🖥️⌨️, which🪞popular and majority 🇨🇿 X/🐦 accounts bringing to 🐘 otherwise missing 📰, ⚽️🏒🏎️, information about 📱⌚️💻📡, 🎞️🎶🎭, and sometimes 🤣🤪.

## The mission
This project is focused on developing the IFTTT applet filter script, which is used on the IFTTT server for bots (applets) and fulfils Mastodon server users with content.

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
- ./CONNECTORS contains connectors. There is a special connector for X/Twitter and YouTube and an RSS connector, which is used for BlueSky and RSS. 
- ./SETTINGS - contains "default" settings for all supported applet types. 
- ./EXAMPLES - contains complete IFTTT filter script examples for every supported service 
- ./DOCS - contains documentation for the appropriate setting of all IFTTT applet filter script possibilities.

## Configuration of Mastodon vs IFTTT communication
For more information about settings on the Mastodon user side, please look at https://hyperborea.org/journal/2017/12/mastodon-iftt/.

(Prague, Feb 25, 2025)
