///////////////////////////////////////////////////////////////////////////////
// settings for IFTTT 📺 webhook filter - Pi Day 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// Configuration settings for the IFTTT webhook filter.
// These settings define content rules, platform-specific behavior, and formatting options.
//
///////////////////////////////////////////////////////////////////////////////

interface AppSettings {
  AMPERSAND_REPLACEMENT: string; // character used to replace ampersands (&) in text to avoid encoding issues.
  BANNED_COMMERCIAL_PHRASES: string[]; // list of phrases that indicate commercial or banned content. posts containing these will be skipped.
  CONTENT_HACK_PATTERNS: { pattern: string;replacement: string;flags ? : string; } []; // array of regex patterns and replacements for manipulating post content (e.g., fixing URLs or removing unwanted text).
  EXCLUDED_URLS: string[]; // URLs excluded from trimUrl
  MANDATORY_KEYWORDS: string[]; // list of keywords that must appear in the post content or title for it to be published.
  POST_FROM: "BS" | "RSS" | "TW" | "YT"; // identifier for the source platform of the post (e.g., RSS feed, Twitter, YouTube).
  POST_LENGTH: number; // maximum post length (0-500 chars)
  POST_SOURCE: string; // original post URL format
  POST_TARGET: string; // target post URL format
  USER_INSTANCE: string; // user instance suffix
  QUOTE_SENTENCE: string; // quote indicator prefix
  REPOST_ALLOWED: boolean; // whether reposts are allowed
  REPOST_SENTENCE: string; // repost indicator prefix
  SHOULD_PREFER_REAL_NAME: boolean; // use real name instead of username
  SHOW_FEEDURL_INSTD_POSTURL: boolean; // show feed URL instead of post URL
  SHOW_IMAGEURL: boolean; // include image URLs in post
  SHOW_ORIGIN_POSTURL_PERM: boolean; // whether to always include the original post URL in the output, regardless of other conditions.
  SHOW_TITLE_AS_CONTENT: boolean; // use entryTitle as a content
  STATUS_IMAGEURL_SENTENCE: string; // image URL prefix
  STATUS_URL_SENTENCE: string; // URL prefix/suffix formatting
}

// application settings configuration
const SETTINGS: AppSettings = {
  AMPERSAND_REPLACEMENT: `and`, // replacement for & char
  BANNED_COMMERCIAL_PHRASES: [], // phrases array ["advertisement", "discount", "sale"] 
  CONTENT_HACK_PATTERNS: [ // content hack - content manipulation function
    // { pattern: "(?<!https?:\/\/)(example\.com\/)", replacement: "https:\/\/example\.com\/", flags: "gi" }, // hack for URLs without protocol
    // { pattern: "(ZZZZZ[^>]+KKKKK)", replacement: "", flags: "gim" }, // replaces parts of the string between ZZZZZ and KKKKK including them with an empty string.
    // { pattern: "what", replacement: "by_what", flags: "gi" }, // replaces pattern "what" by replacement "by_what" with flags 
  ],
  EXCLUDED_URLS: ["youtu.be", "youtube.com"], // array excluding URLs from trimUrl ["youtu.be", "youtube.com", "example.com"]
  MANDATORY_KEYWORDS: [], // keyword array ["news", "updates", "important"]
  POST_FROM: "YT", // "BS" | "RSS" | "TW" | "YT"
  POST_LENGTH: 444, // 0 - 500 chars
  POST_SOURCE: "", // "" | `https://twitter.com/` | `https://x.com/`
  POST_TARGET: "", // "" | `https://twitter.com/` | `https://x.com/`
  USER_INSTANCE: "", // "" | ".bsky.social" | "@twitter.com" | "@x.com"
  QUOTE_SENTENCE: "", // "" | "comments post from" | "contains quote post or other embedded content" | "𝕏📝💬"
  REPOST_ALLOWED: true, // true | false
  REPOST_SENTENCE: "", // "" | "shares" | "𝕏📤"
  SHOULD_PREFER_REAL_NAME: true, // true | false
  SHOW_FEEDURL_INSTD_POSTURL: false, // true | false
  SHOW_IMAGEURL: false, // true | false
  SHOW_ORIGIN_POSTURL_PERM: true, // true | false
  SHOW_TITLE_AS_CONTENT: false, // true | false
  STATUS_IMAGEURL_SENTENCE: "", // "" | "🖼️"
  STATUS_URL_SENTENCE: "\nYT 📺👇👇👇\n", // "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 " | "\n🗣️🎙️👇👇👇\n" | "\nYT 📺👇👇👇\n"
};
