///////////////////////////////////////////////////////////////////////////////
// settings for IFTTT 𝕏 webhook filter - rev 25.2.2025
///////////////////////////////////////////////////////////////////////////////
interface AppSettings {
  AMPERSAND_REPLACEMENT: string; // character to replace ampersands with
  COMMERCIAL_SENTENCE: string; // prefix for commercial content, e.g. "Commercial:"
  MANDATORY_KEYWORDS: string[]; // keywords that must be present in post
  POST_FROM: "BS" | "RSS" | "TW" | "YT"; // source platform identifier
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
  SHOW_ORIGIN_POSTURL_PERM: boolean; // always show original post URL?
  STATUS_IMAGEURL_SENTENCE: string; // image URL prefix
  STATUS_URL_SENTENCE: string; // URL prefix/suffix formatting
}

// Application settings configuration
const SETTINGS: AppSettings = {
  AMPERSAND_REPLACEMENT: `a`, // replacement for & char
  COMMERCIAL_SENTENCE: "", // "" | "Komerční sdělení:"
  MANDATORY_KEYWORDS: [], // keyword array ["news", "updates", "important"]
  POST_FROM: "TW", // "BS" | "RSS" | "TW" | "YT"
  POST_LENGTH: 444, // 0 - 500 chars
  POST_SOURCE: `https://twitter.com/`, // "" | `https://twitter.com/` | `https://x.com/`
  POST_TARGET: `https://x.com/`, // "" | `https://twitter.com/` | `https://x.com/`
  USER_INSTANCE: "@twitter.com", // "" | ".bsky.social" | "@twitter.com" | "@x.com"
  QUOTE_SENTENCE: "𝕏📝💬 ", // "" | "komentoval příspěvek od" | "contains quote post or other embedded content" | "𝕏📝💬"
  REPOST_ALLOWED: true, // true | false
  REPOST_SENTENCE: "𝕏📤 ", // "" | "sdílí" | "𝕏📤"
  SHOULD_PREFER_REAL_NAME: true, // true | false
  SHOW_FEEDURL_INSTD_POSTURL: false, // true | false
  SHOW_IMAGEURL: false, // true | false
  SHOW_ORIGIN_POSTURL_PERM: false, // true | false
  STATUS_IMAGEURL_SENTENCE: "", // "" | "🖼️"
  STATUS_URL_SENTENCE: "\n", // "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 " | "\n🗣️🎙️👇👇👇\n" | "\nYT 📺👇👇👇\n"
};

// content hack - content manipulation function - removes content between ZZZZZ and KKKKK markers
function contentHack(str: string): string {
  // replaces parts of the string between ZZZZZ and KKKKK including them with an empty string.
  return str.replace(/(ZZZZZ[^>]+KKKKK)/gi, "");
}
