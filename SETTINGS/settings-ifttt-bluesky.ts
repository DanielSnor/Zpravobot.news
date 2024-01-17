///////////////////////////////////////////////////////////////////////////////
// settings for IFTTT 🦋 webhook filter v0.9.3 - 17.1.2024
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
