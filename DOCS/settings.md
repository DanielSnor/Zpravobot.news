# Settings for IFTTT filter script

This document is focused on explaining all settings possibilities for the IFTTT filter script, including the default behaviours. 

You need to understand the output is composed of several parts:

- content (text which came from the original post)
- image URL (URL link to the first picture attached to the original post)
- post URL (URL link to the original post)

Those three parts will be included in the output:

> This is an example of output.
> 
> #zpravobot
>
> 🖼️ https://server.com/image/link-to-image
> 
> 🔗 https://server.com/post/link-to-post


---

## Basic Information
Filter scripts in IFTTT are run as "scrips in script over script", so you have to be very careful with using special chars and very often manage them with escape chars.  

The Settings for the final script are available in the ./SETTINGS/ folder and look like the following lines:

```
///////////////////////////////////////////////////////////////////////////////
// settings for IFTTT 🐦‍⬛ webhook filter v0.9.2 - 12.1.2024
///////////////////////////////////////////////////////////////////////////////
const SETTINGS = {
  AMPERSAND_REPLACEMENT: ` a `, // replacement for & char
  COMMERCIAL_SENTENCE: "", // "" | "Komerční sdělení:"
  POST_FROM: "NT", // "BS" | "NT" | "RSS" | "TW" | "YT"
  POST_LENGTH: 4750, // 0 - 5000 chars
  POST_SOURCE: `https://nitter.cz/`, // "" | `https://nitter.cz/` | `https://twitter.com/`
  POST_TARGET: `https://twitter.com/`, //  "" | `https://nitter.cz/` | `https://twitter.com/`
  USER_INSTANCE: "twitter.com", // "" | ".bsky.social" | "instagram.com" | "twitter.com" | "x.com" | "youtube.com"
  QUOTE_SENTENCE: "📝💬🐦‍⬛", // "" | "komentoval příspěvek od" | "📝💬🦋" | "📝💬🐦‍⬛"
  REPOST_ALLOWED: true, // true | false
  REPOST_SENTENCE: "📤🐦‍⬛", // "" | "sdílí" | "📤🦋" | "📤🐦‍⬛"
  SHOULD_PREFER_REAL_NAME: true, // true | false
  SHOW_FEEDURL_INSTD_POSTURL: false, // true | false
  SHOW_IMAGEURL: false, // true | false
  SHOW_ORIGIN_POSTURL_PERM: false, // true | false
  STATUS_IMAGEURL_SENTENCE: "🖼️", // "" | "🖼️"
  STATUS_URL_SENTENCE: "🔗", // "" | "🔗" | "\n🗣️🎙️👇👇👇\n" | "\nYT 📺👇👇👇\n"
};

// content hack - replace ZZZZZ and KKKKK with the beginning and the end of content designated to remove
function contentHack(str: string): string {
  return str.replace(/(ZZZZZ[^>]+KKKKK)/gi, "");
}
```

---

## Settings options

### AMPERSAND_REPLACEMENT - string
The appearance of char ampersand in the IFTTT filter code means that your filter script ends the proceeding exactly in that place, and if you don't want it, you have to replace that ampersand with something else. For this reason, the script contains function replaceAmpersands() and SETTINGS.REPLACE_AMPERSANDS defines the string used for this replacement.

Example:
```
AMPERSAND_REPLACEMENT: ` a `
```

Your replacement has to stay between those apostrophe chars; without that, the whole script will fail.


### COMMERCIAL_SENTENCE - string
In case some of the original posts are commercial, you can use this option to eliminate them. Insert Commercial notification (i.e. "Advertisement:"), and if that post begins with text Advertisement:, the proceeding will be skipped.

Example:
```
COMMERCIAL_SENTENCE: "Advertisement:"
```

Your replacement has to stay between quotation marks.


### POST_FROM - string
This option gives the script information about the post source. The filter script will fail without proper settings in this option, so be careful with it.

Example:
```
POST_FROM: "NT"
```

You have to use only one of the following options: 
- "BS" for BlueSky
- "NT" for Nitter
- "RSS" for RSS
- "TW" for X/Twitter
- "YT" for YouTube

Replacement has to stay between quotation marks.


### POST_LENGTH - number
This value is the definition of length. Based on Mastodon post length settings, it can be between 0 and up to 5000 chars (if your server supports it).

Example:
```
POST_LENGTH: 4750
```

It is good to consider this length, as the post URL will also be included, so you have to think of it.


### POST_SOURCE - string
POST_SOURCE and POST_TARGET are used together when your source is on server A, but you want to target your link to server B. I am using it, i.e. for tweets. As Twitter limits the number of requests, it is easier and more reliable to use the Nitter server as a source but Twitter as a target because almost all Mastodon clients can show the Twitter links as a snippet, but almost no one does the same with the Nitter link.

Example:
```
POST_SOURCE: `https://nitter.cz/`
```

Your replacement has to stay between apostrophes or as two empty quotation marks.


### POST_TARGET - string
POST_SOURCE and POST_TARGET are used together when your source is on server A, but you want to target your link to server B. I am using it, i.e. for tweets. As Twitter limits the number of requests, it is easier and more reliable to use the Nitter server as a source but Twitter as a target because almost all Mastodon clients can show the Twitter links as a snippet, but almost no one does the same with the Nitter link. 

Example:
```
POST_TARGET: `https://twitter.com/`
```

Your replacement has to stay between apostrophes or as two empty quotation marks.


### USER_INSTANCE - string
If someone is mentioned in the original post from Nitter or X/Twitter, it is usually as **@someone**, which is pretty enough there, but on Mastodon, it isn't as clients expect **@username@userserver**. USER_INSTANCE contains the name of the user server, and if the script proceeding finds @someone's username, it will change it from **@username** to expected **@username@userserver**. Initially, it is for Twitter; I can imagine using it, i.e. for Instagram.

Example:
```
USER_INSTANCE: "twitter.com"
```

Your replacement has to stay between quotation marks.


### QUOTE_SENTENCE - string
A quote sentence replaces QUOTE: textation for marking quotes from someone else's posts.

Example:
```
QUOTE_SENTENCE: "📝💬🦋"
```

Output:
```
danielsnor.bsky.social 📝💬🦋 zpravobot.news:
```

Your replacement has to stay between quotation marks. You can also use emojis or formatting.


### REPOST_ALLOWED - boolean
REPOST_ALLOWED option is a boolean and changes the behaviour of the filter script. If this is true, reposts of someone else's are allowed and will be reposted. If this is not wanted because you are interested only in original posts and not reposting, you can just set it to false, and all reposts will be skipped.

Example:
```
REPOST_ALLOWED: true
```

Only true or false values are valid.

### REPOST_SENTENCE - string
The repost sentence replaces RE: textation for marking reposts from someone else's posts.

Example:
```
REPOST_SENTENCE: "📤🐦‍⬛"
```

Output:
```
@danielsnor 📤🐦‍⬛ @zpravobotnews@twitter.com:
```

Your replacement has to stay between quotation marks. You can also use emojis or formatting.

### SHOULD_PREFER_REAL_NAME - boolean
You can use the real author's name instead of **@username**. In that case, you can set SHOULD_PREFER_REAL_NAME to true, and every mention of the post author's username will be changed to his real name, i.e. **@danielsnor** will be changed to **Daniel Šnor**.

Example:
```
SHOULD_PREFER_REAL_NAME: true
```

Output:
```
Daniel Šnor 📤🐦‍⬛ @zpravobotnews@twitter.com:
```

Only true or false values are valid.


### SHOW_FEEDURL_INSTD_POSTURL - boolean
In some special cases, you should prefer to link not directly to the post but to the feed (it doesn't matter if Twitter names it Posts or another word); just set SHOW_FEEDURL_INSTD_POSTURL to true.

Example:
```
SHOW_FEEDURL_INSTD_POSTURL: false
```

Only true or false values are valid.


### SHOW_IMAGEURL - boolean
By default, images are shown as a part of a snippet made by a post URL link, but in some special cases, you should prefer to show the image URL separately. If so  set SHOW_IMAGEURL to true.

Example:
```
SHOW_IMAGEURL: false
```

Only true or false values are valid.


### SHOW_ORIGIN_POSTURL_PERM - boolean
By default, if some URL appears in the content, the post URL is not shown to avoid the confusion of Mastodon clients during the rendering timeline. If you will need to show it permanently, set SHOW_IMAGEURL to true.

Example:
```
SHOW_ORIGIN_POSTURL_PERM: true
```

Only true or false values are valid.


### STATUS_IMAGEURL_SENTENCE - string
STATUS_URL_SENTENCE is used as an introduction for the image URL. Normally, I have here "🖼️".

Example:
```
STATUS_IMAGEURL_SENTENCE: "🖼️"
```

Output:
```
🖼️ https://server.cz/obrazek/link-na-obrazek…
```

Your replacement has to stay between quotation marks. You can also use emojis or formatting.


### STATUS_URL_SENTENCE - string
STATUS_URL_SENTENCE is used as an introduction for the post URL. Normally, I have here "🔗", but I am also using "\n🗣️🎙️👇👇👇\n" for podcasts and "\nYT 📺👇👇👇\n" for YouTube.

Example:
```
STATUS_URL_SENTENCE: "🔗"
```

Output:
```
🔗 https://server.cz/clanek/link-na-clanek…
```

Your replacement has to stay between quotation marks. You can also use emojis or formatting.

---

## Content Hack
In case the source has some specific outputs (i.e. text "Published by Someone, Somewhere"), you can use the content hack to filter those unwanted outputs. When you replace chars ZZZZZ with the beginning and KKKKK with the end of the unwanted text block, it will disappear from the final output. You can also create a chain of those replacements in case you want to block more variants, as you can see in the following example:

Example:
```
// content hack - replace ZZZZZ and KKKKK with the beginning and the end of content designated to remove
function contentHack(str: string): string {
  return str.replace(/(New comic[^>]+Read here)/gi, "").replace(/(Read full[^>]+comic here)/gi, "").replace(/(New comic[^>]+on Tapas)/gi, "");
}
```

---

## That's all, folks
That's all, folks. I hope the explanation clarifies the configuration possibilities for modifying the output and everything is crystal clear now. Otherwise, you can still contact me via social networks or the About.me page.
