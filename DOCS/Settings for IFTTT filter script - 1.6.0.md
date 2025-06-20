# Settings for IFTTT filter script v1.6.0

This document explains all settings possibilities for the IFTTT filter script version 1.6.0, including default behaviors and examples of use. The script is designed to process posts from various platforms (e.g., Twitter, Bluesky, RSS, YouTube) and publish them via an IFTTT webhook. The output is composed of several parts:

- Content: Text from the original post, including hashtags.
- Image URL: URL link to the first picture attached to the original post.
- Post URL: URL link to the original post.

These parts are combined in the output format, for example:

> This is an example of output.
> 
> #zpravobot
>
> 🖼️ https://example.com/image/link-to-image
> 
> 🔗 https://example.com/post/link-to-post

Note: Filter scripts in IFTTT run as “scripts in scripts over scripts,” so special care must be taken with special characters, often requiring escape sequences.

---

## Overview of Settings
The Settings for the final script are available in the ./SETTINGS/ folder and look like the following lines:

```
// Application settings configuration
const SETTINGS: AppSettings = {
  AMPERSAND_REPLACEMENT: `ꝸ`, // Replacement for & char to prevent encoding issues in URLs or text.
  BANNED_COMMERCIAL_PHRASES: [], // E.g., ["advertisement", "discount", "sale"]. Leave empty to disable this filter.
  CONTENT_HACK_PATTERNS: [], // E.g.: { pattern: "what", replacement: "by_what", flags: "gi", literal: false }, // Replaces pattern "what" by replacement "by_what" with flags.
  EXCLUDED_URLS: ["youtu.be", "youtube.com"], // E.g., ["youtu.be", "youtube.com", "example.com"]. URLs in this list are excluded from trimming but still encoded.
  MANDATORY_KEYWORDS: [], // E.g., ["news", "updates", "important"]. Leave empty to disable mandatory keyword filtering.
  MENTION_FORMATTING: { "TW": { type: "suffix", value: "@twitter.com" }, }, // Suffix added to Twitter mentions for clarity or linking.
  POST_FROM: "TW", // "BS" | "RSS" | "TW" | "YT". Set this based on the IFTTT trigger used for the applet.
  POST_LENGTH: 444, // 0 - 500 chars. Adjust based on target platform's character limit.
  POST_LENGTH_TRIM_STRATEGY: "sentence", // "sentence" | "word" // Try to preserve meaningful content during trimming.
  POST_SOURCE: `https://x.com/`, // E.g., "" | `https://twitter.com/` | `https://x.com/`. Source URL pattern to be replaced.
  POST_TARGET: `https://twitter.com/`, // E.g., "" | `https://twitter.com/` | `https://x.com/`. Target URL pattern for replacement.
  QUOTE_SENTENCE: " 𝕏📝💬 ", // E.g., "" | "comments post from" | "🦋📝💬" | "𝕏📝💬". Formatting for quoted content.
  REPOST_ALLOWED: true, // true | false. Determines if reposts are processed or skipped.
  REPOST_SENTENCE: " 𝕏📤 ", // E.g., "" | "shares" | "𝕏📤". Formatting prefix for reposts.
  RSS_INPUT_LIMIT: 1000, // Limit input to 1000 characters for RSS before HTML processing.
  RSS_INPUT_TRUNCATION_STRATEGY: "preserve_content", // "simple" | "preserve_content" // Try to preserve meaningful content during truncation.
  SHOULD_PREFER_REAL_NAME: true, // true | false. Prefer real name over username if available.
  SHOW_FEEDURL_INSTD_POSTURL: false, // true | false. Use feed URL as fallback instead of post-specific URL.
  SHOW_IMAGEURL: false, // true | false. Include image URLs in output if available.
  SHOW_ORIGIN_POSTURL_PERM: false, // true | false. Always show original post URL (can be overridden dynamically).
  SHOW_TITLE_AS_CONTENT: false, // true | false. Use title as content if set to true.
  STATUS_IMAGEURL_SENTENCE: "", // E.g., "" | "🖼️ ". Prefix for image URLs if shown.
  STATUS_URL_SENTENCE: "\n", // E.g., "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 " | "\n🗣️🎙️👇👇👇\n" | "\nYT 📺👇👇👇\n". Formatting for post URLs.
  URL_DOMAIN_FIXES: [], // E.g., "example.com" // Domains divided by , that are automatically added to https:// if the protocol is missing.
};
```

Below is a detailed description of all available configuration options in the `SETTINGS` object for version 1.5.0, as defined in the script file .

### AMPERSAND_REPLACEMENT - string
The appearance of char ampersand in the IFTTT filter code means that your filter script ends the proceeding exactly in that place, and if you don't want it, you have to replace that ampersand with something else. For this reason, the script contains function replaceAmpersands() and SETTINGS.REPLACE_AMPERSANDS defines the string used for this replacement.

Example:
```
AMPERSAND_REPLACEMENT: `ꝸ`
```
Your replacement has to stay between those apostrophe chars; without that, the whole script will fail.

### BANNED_COMMERCIAL_PHRASES - string array
This option allows you to specify phrases that indicate commercial content or the other content you want to ban. If a post contains any of these phrases, it will be skipped.

Example:
```
BANNED_COMMERCIAL_PHRASES: []
```
or
```
BANNED_COMMERCIAL_PHRASES: ["advertisement", "discount", "sale"]
```
Your phrases has to stay between brackets chars. Every phrase needs to be between quotation marks; more keywords needs to be divided by comma.

### CONTENT_HACK_PATTERNS - array of objects
This setting allows you to manipulate content by replacing or removing specific patterns. Each object in the array should contain `pattern`, `replacement`, and optionally `flags`.

Example:
```
CONTENT_HACK_PATTERNS: [
  { pattern: "(?<!https?:\/\/)(example\.com\/)", replacement: "https:\/\/example\.com\/", flags: "g", literal: false }, // hack for URLs without protocol
  { pattern: "(ZZZZZ[^>]+KKKKK)", replacement: "", flags: "gi" },
  { pattern: "what", replacement: "by_what", flags: "gi" }
]
```
Patterns should be regular expressions.

### EXCLUDED_URLS - string array
An array of URLs that will not be shortened by the `trimUrl` function but will still be URL-encoded.

Example:
```
EXCLUDED_URLS: ["youtube.com", "example.com"]
```
Your URLs should be between quotation marks and separated by commas.

### MANDATORY_KEYWORDS - string array
This option allows you to specify keywords that must be present in the post for it to be published. If no keywords are specified, left the brackets empty and all posts will be published.

Example:
```
MANDATORY_KEYWORDS: []
```
or
```
MANDATORY_KEYWORDS: ["news", "updates", "important"]
```
Your replacement has to stay between brackets chars. Every keyword needs to be between quotation marks; more keywords needs to be divided by comma.

### MENTION_FORMATTING - platform: string
An object defining how `@mentions` are formatted for each platform. Default value: `{"TW": { type: "suffix", value: "@twitter.com" }}`

Example:
```
MENTION_FORMATTING: { "BS": { type: "prefix", value: "https://bsky.app/profile/" }, }
```
or
```
MENTION_FORMATTING: { "TW": { type: "suffix", value: "@twitter.com" } }
```

### POST_FROM - string
This option gives the script information about the post source. The filter script will fail without proper settings in this option, so be careful with it.

Example:
```
POST_FROM: "NT"
```
You have to use only one of the following options: 
- "BS" for BlueSky
- "RSS" for RSS
- "TW" for X/Twitter
- "YT" for YouTube

Replacement has to stay between quotation marks.

### POST_LENGTH - number
This value is the definition of length. Based on Mastodon post length settings, it can be between 0 and up to 5000 chars (if your server supports it).

Example:
```
POST_LENGTH: 444
```
It is good to consider this length, as the post URL will also be included, so you have to think of it.

### POST_LENGTH_TRIM_STRATEGY - string
Truncation strategy for content: `"sentence"` (attempts to preserve the last whole sentence) or `"word"` (cuts at the word boundary). Default value: `"sentence"` [2].

Example:
```
POST_LENGTH_TRIM_STRATEGY: "sentence"
```
You have to use only one of the following options: 
- "sentence" for preserve the last whole sentence
- "word" for the word boundary

Your replacement has to stay between quotation marks.

### POST_SOURCE - string
POST_SOURCE and POST_TARGET are used together when your source is on server A, but you want to target your link to server B. I am using it, i.e. for tweets. As Twitter limits the number of requests, it is easier and more reliable to use the Nitter server as a source but Twitter as a target because almost all Mastodon clients can show the Twitter links as a snippet, but almost no one does the same with the Nitter link.

Example:
```
POST_SOURCE: `https://twitter.com/`
```
Your replacement has to stay between apostrophes or as two empty quotation marks.

### POST_TARGET - string
POST_SOURCE and POST_TARGET are used together when your source is on server A, but you want to target your link to server B. I am using it, i.e. for tweets. As Twitter limits the number of requests, it is easier and more reliable to use the Nitter server as a source but Twitter as a target because almost all Mastodon clients can show the Twitter links as a snippet, but almost no one does the same with the Nitter link. 

Example:
```
POST_TARGET: `https://x.com/`
```
Your replacement has to stay between apostrophes or as two empty quotation marks.

### USER_INSTANCE - string
If someone is mentioned in the original post from Nitter or X/Twitter, it is usually as **@someone**, which is pretty enough there, but on Mastodon, it isn't as clients expect **@username@userserver**. USER_INSTANCE contains the name of the user server, and if the script proceeding finds @someone's username, it will change it from **@username** to expected **@username@userserver**. Initially, it is for Twitter; I can imagine using it, i.e. for Instagram.

Example:
```
USER_INSTANCE: "@twitter.com"
```
Your replacement has to stay between quotation marks.

### QUOTE_SENTENCE - string
A quote sentence replaces QUOTE: textation for marking quotes from someone else's posts.

Example:
```
QUOTE_SENTENCE: "𝕏📝💬 "
```
Output:
```
@danielsnor 𝕏📝💬 @zpravobot@twitter.com:
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
REPOST_SENTENCE: "𝕏📤 "
```
Output:
```
@danielsnor 𝕏📤 @zpravobotnews@twitter.com:
```
Your replacement has to stay between quotation marks. You can also use emojis or formatting.


### RSS_INPUT_LIMIT - number
Maximum input length for RSS feeds before processing (0 = no limit). Default value: `1000`

Example:
```
RSS_INPUT_LIMIT: 1000
```

### RSS_INPUT_TRUNCATION_STRATEGY** - string
Truncation strategy for RSS input: `"simple"` (basic cut) or `"preserve_content"` (attempts to preserve meaningful content). Default value: `"preserve_content"` [2].

Example:
```
RSS_INPUT_TRUNCATION_STRATEGY: "preserve_content"`
```
You have to use only one of the following options: 
- "simple" for basic cut
- "preserve_content" for meaningful content

Your replacement has to stay between quotation marks.

### SHOULD_PREFER_REAL_NAME - boolean
You can use the actual author's name instead of **@username**. In that case, you can set SHOULD_PREFER_REAL_NAME to true, and every mention of the post author's username will be changed to his real name, i.e. **@danielsnor** will be changed to **Daniel Šnor**.

Example:
```
SHOULD_PREFER_REAL_NAME: true
```
Output:
```
Daniel Šnor 𝕏📤 @zpravobotnews@twitter.com:
```
Only true or false values are valid.

### SHOW_FEEDURL_INSTD_POSTURL - boolean
In some exceptional cases, you should prefer to link not directly to the post but to the feed (it doesn't matter if Twitter names it Posts or another word); just set SHOW_FEEDURL_INSTD_POSTURL to true.

Example:
```
SHOW_FEEDURL_INSTD_POSTURL: false
```
Only true or false values are valid.

### SHOW_IMAGEURL - boolean
By default, images are shown as part of a snippet made by a post URL link, but in some special cases, you should prefer to show the image URL separately. If so, set SHOW_IMAGEURL to true.

Example:
```
SHOW_IMAGEURL: false
```
Only true or false values are valid.

### SHOW_ORIGIN_POSTURL_PERM - boolean
By default, if some URL appears in the content, the post URL is not shown to avoid confusion among Mastodon clients during the rendering timeline. If you will need to show it permanently, set SHOW_IMAGEURL to true.

Example:
```
SHOW_ORIGIN_POSTURL_PERM: true
```
Only true or false values are valid.

### SHOW_TITLE_AS_CONTENT - boolean
If this option is set to true, the script will use the entry title as the content instead of the entry content. This is useful if the title contains the main information.

Example:
```
SHOW_TITLE_AS_CONTENT: false
```
Only true or false values are valid.

### STATUS_IMAGEURL_SENTENCE - string
STATUS_URL_SENTENCE is used as an introduction for the image URL. Typically, I have here "🖼️".

Example:
```
STATUS_IMAGEURL_SENTENCE: "🖼️ "
```
Output:
```
🖼️ https://example.com/image/link-to-image
```
Your replacement has to stay between quotation marks. You can also use emojis or formatting.

### STATUS_URL_SENTENCE - string
STATUS_URL_SENTENCE is used as an introduction for the post URL. Typically, I have here "\n" just for a new line with the URL, but I am also using "\n🗣️🎙️👇👇👇\n" for some podcasts and "\nYT 📺👇👇👇\n" for YouTube.

Example:
```
STATUS_URL_SENTENCE: "🔗 "
```
Output:
```
🔗 https://example.com/post/link-to-post
```
Your replacement has to stay between quotation marks. You can also use emojis or formatting.

### URL_DOMAIN_FIXES - string[]
List of domains to automatically prepend with `https://` if the protocol is missing. Default value: `[]`

Example: 
```
URL_DOMAIN_FIXES: ["example.com"]
```
Output:
```
https://example.com
```
Your replacement has to stay between quotation marks.

---

## Additional Notes

### Special Characters and Escape Sequences
When configuring strings like `AMPERSAND_REPLACEMENT`, `QUOTE_SENTENCE`, or `REPOST_SENTENCE`, ensure special characters are properly escaped to avoid processing errors in IFTTT.

### Dynamic Settings Adjustments
Some settings, such as `SHOW_ORIGIN_POSTURL_PERM`, may be dynamically adjusted during post processing based on specific conditions (e.g., absence of other URLs in content).

### Platform-Specific Processing
The script includes tailored logic for different platforms (`TW`, `BS`, `RSS`, `YT`), affecting content processing, mention formatting, and URL display decisions.

---

## That’s all, folks
That’s all, folks. I hope the explanation clarifies the configuration possibilities for modifying the output and everything is crystal clear now. Otherwise, you can still contact me via social networks or the About.me page.

(Children's Day 2025)
