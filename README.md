# Zpravobot.news
Zpravobot.news 📰🤖 (means Newsbot.news in Czech) is run by Daniel Šnor as a public utility 🖥️⌨️, which🪞popular and majority 🇨🇿 X/🐦 accounts bringing to 🐘 otherwise missing 📰, ⚽️🏒🏎️, information about 📱⌚️💻📡, 🎞️🎶🎭, and sometimes 🤣🤪.

This project is focused on developing the IFTTT applet filter script used on the IFTTT server for bots (applets), fulfilling Mastodon server users with content.

The server used is a standard Mastodon server with several hundred users. Bot farm at IFTTT fulfils users, where every bot (custom IFTTT applet) has its filter script, which manages the source of information, proceeding and the final state of posts published on the Mastodon server.

The original target was to have the only script for the following sources:
- BlueSky
- Nitter
- RSS
- X/Twitter
- YouTube

Due to limitations on the IFTTT side, you cannot have, ie. YouTube connectors in the Twitter applet, but the filter code should be the same for all sources, so I divided this script into several parts.

The final filter script for applying it in filter code in the IFTTT applet is composed of three parts:
- settings
- connector
- filter

Even if the filter is written as universal, you still have to choose the proper settings and connector based on the type of source, so if you want to use it for the BlueSky applet, you have to compose it from settings for Bluesky, a connector for BlueSky and universal filter. The final code is then pasted to your applet into the filter.

Folder ./CONNECTORS contain - surprise surprise - connectors. You can find a special connector for X/Twitter and YouTube and an RSS connector, which is used for BlueSky, Nitter and RSS. ./SETTINGS folder contains "default" settings for all supported applet types. Example scripts are stored in the ./EXAMPLES folder, and the ./DOCS folder contains documentation for setting possibilities.

For more information about settings on the Mastodon user side, please look at https://hyperborea.org/journal/2017/12/mastodon-iftt/.

(Prague, Jan 17, 2024)
