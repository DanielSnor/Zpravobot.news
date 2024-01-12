# Zpravobot.news
Repo for Zpravobot.news filter code

Zpravobot.news 📰🤖 (means Newsbot.news in Czech) is run by Daniel Šnor as a public utility 🖥️⌨️, which🪞popular and majority 🇨🇿 X/🐦 accounts bringing to 🐘 otherwise missing 📰, ⚽️🏒🏎️, information about 📱⌚️💻📡, 🎞️🎶🎭, and sometimes 🤣🤪.

The server used is a standard Mastodon server with several hundred users. Bot farm at IFTTT fulfils users, where every bot (custom IFTTT applet) has its filter script, which manages the source of information, proceeding and the final state of posts published on the Mastodon server.

The original target was to have the only script for the following sources:
- BlueSky
- Nitter
- RSS
- X/Twitter
- YouTube

Due to limitations on the IFTTT side, it is not possible. You cannot have ie. YouTube connectors in the Twitter applet, but the filter code should be the same for all sources.

The final filter script for applying it in filter code in the IFTTT applet is composed of three parts:
- settings
- connector
- filter

Even if the filter is written as universal, you still have to choose the proper settings and connector based on the type of source, so if you want to use it for the BlueSky applet, you have to compose it from settings for Bluesky, a connector for BlueSky and universal filter. The final code is then pasted to your applet into the filter.

For more information about settings on the Mastodon user side, please look at https://hyperborea.org/journal/2017/12/mastodon-iftt/.

(Prague, Jan 12, 2024)
