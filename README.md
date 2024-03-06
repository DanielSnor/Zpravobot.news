# Zpravobot.news
Zpravobot.news 📰🤖 (means Newsbot.news in Czech) is run by Daniel Šnor as a public utility 🖥️⌨️, which🪞popular and majority 🇨🇿 X/🐦 accounts bringing to 🐘 otherwise missing 📰, ⚽️🏒🏎️, information about 📱⌚️💻📡, 🎞️🎶🎭, and sometimes 🤣🤪.

This project is focused on developing the IFTTT applet code used on the IFTTT server for bots (applets), fulfilling Mastodon server users with content.

The server used is a standard Mastodon server with several hundred users. Bot farm at IFTTT fulfils users, where every bot (custom IFTTT applet) has its script, which manages the source of information, proceeding and the final state of posts published on the Mastodon server.

The original target was to have the only script for the following sources:
- BlueSky
- ~~Nitter~~
- RSS
- X/Twitter
- YouTube

Due to limitations on the IFTTT side, you cannot have, ie. YouTube connectors in the Twitter applet, but the code should be the same for all sources, so I divided this script into several parts.

The final script for applying it in code in the IFTTT applet is composed from three files:
- main.ts
- builder.ts
- builder-???.ts

## main.ts
Works with the `MarkerWebhooks` class that is available in the IFTTT code. For development, it contains a _/// Only for dev_ section, where a specific `builder-????.ts` import and a mock of `MarkerWebhooks`. The entire section is replaced by the code of the selected `builder-???.ts` when code is generated (selected by CLI argument, not by import in the dev section).

## builder.ts
Contains default settings and basic logic that is the same for all applets. The script contains several types and classes.

### Type Connector
Contains the data provided to the applet by IFTTT.

### Type DefaultSettings
Defines which values are needed for the Builder, and the Builder sets their values itself.

### Type Settings
Is an optional version of `DefaultSettings` that can be used to redefine (some or all) values in individual `builder-???.ts`.

### Class Checker
Is used to check some facts (is ad, repost...). This class is inherited in `builder-???.ts` and checks can be modified according to the specific situation.

### Class Builder
Processes the data from `Connector` and modifies it depending on `Settings` and prepares the content for publication using content middlewares. The output is a text intended for `MarkerWebhooks`. `Builder` also decides whether to skip the post.

## builder-????.ts
Modifies `Builder` data processing. It contains sections _// Only for dev_, where `builder.ts` is import and IFTTT data is mocked. This section is replaced by `builder.ts` during code generation.

The template for creating a custom `builder-???.ts` is `builder-template.ts`.

In this script, you need to create `Connector` and possibly set custom values for `Settings` and modify the checks in `Checker` (in `CustomChecker`).

Since each source has its own specifics, the behavior of `Builder` can be modified here. Content modification is done using custom content middlewares.

## Content middleware
This is a function that accepts string parameter with content and returns string with content that the function may or may not have modified. These functions are defined in a class that extends `Builder` (named `CustomBuilder` in the template).

Middlewares are called in `Builder` when the content is being prepared. When they are called, the middlewares defined in `CustomBuilder` take precedence, and only then come the shared middlewares defined in `Builder`.

Middlewares are registered using the `Builder.addContentMiddleware()` funkcion, to which they are added as consecutive parameters. If the middleware needs additional parameters, they must precede `content` parameter. When registering, you must then use the `bind()` function and pass the parameters to it.

## Builder & Custom builder
The custom modifications is done in the `CustomBuilder.setup()` function. This override `Builder.setup()` function, which is called at the end of the initialization of `Builder` (at the end of the script).

## Development
When developing a new builder, it is necessary to import `builder-????.ts` in `main.ts` in dev section. To fully simulate IFTTT, you must modify `Data` in `builder-???.ts` in dev section to name and structure with values provided by IFTTT to code for applet.

Then call `tsc main.ts && node main.js` in console to run the code locally.

## IFTTT code generation
The resulting code is compiled by bash script `create.sh`. Before running it, you need to set its execution rights. To do this, use console command `chmod +x ./create.sh`. Then can script be run using console command `./create.sh`.

The script sequentially reads the `main.ts`, `builder.ts` and `builder-????.ts` files, replaces the dev sections and merges them together.

The script requires at least one argument. This is the name of source to be generated. Source is the part of filename after `builder-` that is the source. For example, `./create.sh twitter` will generate code from `builder-twitter.ts`.

If only one source is entered, the code will be copied to clipboard. Multiple sources will generate one file for each source.

## Ready to use
The project includes builders for Twitter, YouTube, BlueSky and RSS. These can be used directly or taken as a template for specific cases.

For more information about settings on the Mastodon user side, please look at https://hyperborea.org/journal/2017/12/mastodon-iftt/.
