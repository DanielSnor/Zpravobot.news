# Settings for IFTTT filter script

This document is focused on explaining all settings possibilities for the IFTTT filter script, including the default behaviours.

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

### AMPERSAND_REPLACEMENT
Appearance of char ampersand in IFTTT filter code means for you that exactly on this place 

### COMMERCIAL_SENTENCE

### POST_FROM

### POST_LENGTH

### POST_SOURCE

### POST_TARGET

### USER_INSTANCE

### QUOTE_SENTENCE

### REPOST_ALLOWED

### REPOST_SENTENCE

### SHOULD_PREFER_REAL_NAME

### SHOW_FEEDURL_INSTD_POSTURL

### SHOW_IMAGEURL

### SHOW_ORIGIN_POSTURL_PERM

### STATUS_IMAGEURL_SENTENCE

### STATUS_URL_SENTENCE
