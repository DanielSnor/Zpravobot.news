///////////////////////////////////////////////////////////////////////////////
// settings for IFTTT 🦋 webhook filter - 2.1.2025
///////////////////////////////////////////////////////////////////////////////
const SETTINGS = {
  AMPERSAND_REPLACEMENT: `a`, // replacement for & char
  COMMERCIAL_SENTENCE: "", // "" | "Komerční sdělení:"
  POST_FROM: "BS", // "BS" | "RSS" | "TW" | "YT"
  POST_LENGTH: 475, // 0 - 5000 chars
  POST_SOURCE: "", // "" | `https://twitter.com/`
  POST_TARGET: "", //  "" | `https://twitter.com/`
  USER_INSTANCE: ".bsky.social", // "" | ".bsky.social" | "instagram.com" | "twitter.com" | "x.com" | "youtube.com"
  QUOTE_SENTENCE: "contains quote post or other embedded content", // "" | "komentoval příspěvek od" | "contains quote post or other embedded content" | "📝💬🐦‍⬛"
  REPOST_ALLOWED: false, // true | false
  REPOST_SENTENCE: "", // "" | "sdílí" | "📤🐦‍⬛"
  SHOULD_PREFER_REAL_NAME: true, // true | false
  SHOW_FEEDURL_INSTD_POSTURL: false, // true | false
  SHOW_IMAGEURL: false, // true | false
  SHOW_ORIGIN_POSTURL_PERM: false, // true | false
  STATUS_IMAGEURL_SENTENCE: "", // "" | "🖼️"
  STATUS_URL_SENTENCE: "", // "" | "🔗" | "\n🗣️🎙️👇👇👇\n" | "\nYT 📺👇👇👇\n"
};

// content hack - replace ZZZZZ and KKKKK with the beginning and the end of content designated to remove
function contentHack(str: string): string {
  return str.replace(/(ZZZZZ[^>]+KKKKK)/gi, "");
}
