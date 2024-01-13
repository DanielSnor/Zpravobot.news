# Settings for IFTTT filter script

This document is focused on providing the explanation of all settings possibilities for the IFTTT filter script, including the default behaviours. 

## Basic Information
Filter scripts in IFTTT are run as "scrips in script over script", so you have to be very careful with using special chars and very often to manage them with escape chars.  

The Settings for the final script are available in the ./SETTINGS/ folder and look like at the following lines:

```
///////////////////////////////////////////////////////////////////////////////
// settings for IFTTT 🦋 webhook filter v0.9.2 - 12.1.2024
///////////////////////////////////////////////////////////////////////////////
const SETTINGS = {
  AMPERSAND_REPLACEMENT: ` a `, // replacement for & char
  COMMERCIAL_SENTENCE: "", // "" | "Komerční sdělení:"
  POST_FROM: "BS", // "BS" | "NT" | "RSS" | "TW" | "YT"
  POST_LENGTH: 4750, // 0 - 5000 chars
  POST_SOURCE: "", // "" | `https://nitter.cz/` | `https://twitter.com/`
  POST_TARGET: "", //  "" | `https://nitter.cz/` | `https://twitter.com/`
  USER_INSTANCE: ".bsky.social", // "" | ".bsky.social" | "instagram.com" | "twitter.com" | "x.com" | "youtube.com"
  QUOTE_SENTENCE: "📝💬🦋", // "" | "komentoval příspěvek od" | "📝💬🦋" | "📝💬🐦‍⬛"
  REPOST_ALLOWED: true, // true | false
  REPOST_SENTENCE: "📤🦋", // "" | "sdílí" | "📤🦋" | "📤🐦‍⬛"
  SHOULD_PREFER_REAL_NAME: true, // true | false
  SHOW_FEEDURL_INSTD_POSTURL: false, // true | false
  SHOW_IMAGEURL: false, // true | false
  SHOW_ORIGIN_POSTURL_PERM: true, // true | false
  STATUS_IMAGEURL_SENTENCE: "🖼️", // "" | "🖼️"
  STATUS_URL_SENTENCE: "🔗", // "" | "🔗" | "\n🗣️🎙️👇👇👇\n" | "\nYT 📺👇👇👇\n"
};

// content hack - replace ZZZZZ and KKKKK with the beginning and the end of content designated to remove
function contentHack(str: string): string {
  return str.replace(/(ZZZZZ[^>]+KKKKK)/gi, "");
}
```

### AMPERSAND_REPLACEMENT - string
Appearance of char ampersand in IFTTT filter code means for you that exactly on that place will your filter script end the proceeding and if don't want it, you have to manage it. For this reason script contains function replaceAmpersands() and SETTINGS.REPLACE_AMPERSANDS defines string used for this replacement.
```
AMPERSAND_REPLACEMENT: ` a `
```
Your replacement have to stay between those apostroph chars.

### COMMERCIAL_SENTENCE - string
TBD
```
COMMERCIAL_SENTENCE: "Advertisement:"
```
### POST_FROM - string
TBD
```
POST_FROM: "BS", // "BS" | "NT" | "RSS" | "TW" | "YT"
```
Your replacement have to stay between those apostroph chars.

### POST_LENGTH - number
TBD
```
POST_LENGTH: 4750, // 0 - 5000 chars
```
Your replacement have to stay between those apostroph chars.

### POST_SOURCE - string
TBD
```
POST_SOURCE: ""
```
Your replacement have to stay between those apostroph chars.

### POST_TARGET - string
TBD
```
POST_TARGET: ""
```
Your replacement have to stay between those apostroph chars.

### USER_INSTANCE - string
TBD
```
USER_INSTANCE: "twitter.com"
```
Your replacement have to stay between those apostroph chars.

### QUOTE_SENTENCE - string
TBD
```
QUOTE_SENTENCE: "📝💬🦋"
```
Your replacement have to stay between those apostroph chars.

### REPOST_ALLOWED - boolean
TBD
```
REPOST_ALLOWED: true
```
Your replacement have to stay between those apostroph chars.

### REPOST_SENTENCE - string
TBD
```
REPOST_SENTENCE: "📤🦋"
```
Your replacement have to stay between those apostroph chars.

### SHOULD_PREFER_REAL_NAME - boolean
TBD
```
SHOULD_PREFER_REAL_NAME: true
```

### SHOW_FEEDURL_INSTD_POSTURL - boolean
TBD
```
SHOW_FEEDURL_INSTD_POSTURL: false
```

### SHOW_IMAGEURL - boolean
TBD
```
SHOW_IMAGEURL: false
```

### SHOW_ORIGIN_POSTURL_PERM - boolean
TBD
```
SHOW_ORIGIN_POSTURL_PERM: true
```

### STATUS_IMAGEURL_SENTENCE - string
TBD
```
STATUS_IMAGEURL_SENTENCE: "🖼️"
```
Your replacement have to stay between those apostroph chars.

### STATUS_URL_SENTENCE - string
TBD
```
STATUS_URL_SENTENCE: "🔗"
```
Your replacement have to stay between those apostroph chars.

## Content Hack
In case when source has some specific outputs (i.e. text "Published by Someone, Somewhere"), you have the possibility to use content hact to filter those unwanted outputs. When you replace chars ZZZZZ with the beginning and KKKKK with the end of unwanted text block, it will disapear from the final output. You can also create a chain of those replacements in case you want to block more variants, as you can see in the following example:

```
// content hack - replace ZZZZZ and KKKKK with the beginning and the end of content designated to remove
function contentHack(str: string): string {
  return str.replace(/(New comic[^>]+Read here)/gi, "").replace(/(Read full[^>]+comic here)/gi, "").replace(/(New comic[^>]+on Tapas)/gi, "");
}
```

## Thats all, folks
Thats all, folks. I hope provided explanation clarified all of the configuration possibilities for modifying the output and everything is crystal clear now. Otherwise, you still can contact me via social networks or via for at About.me page.