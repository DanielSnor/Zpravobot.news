///////////////////////////////////////////////////////////////////////////////
// settings for IFTTT 𝕏 webhook filter - Good Friday 2025 rev
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
  EXCLUDED_URLS: string[]; // URLs that should NOT be trimmed by trimUrl, but should still be URL-encoded in replaceAmpersands.
  MANDATORY_KEYWORDS: string[]; // list of keywords that must appear in the post content or title for it to be published.
  MENTION_FORMATTING: {
    [platform: string]: { type: "prefix" | "suffix" | "none";value: string; }
  }; // Defines how @mentions are formatted per platform (e.g., add suffix, prefix, or do nothing).
  POST_FROM: "BS" | "RSS" | "TW" | "YT"; // Identifier for the source platform of the post (e.g., RSS feed, Twitter, YouTube). This value might be overridden based on TREAT_RSS_AS_TW.
  POST_LENGTH: number; // Maximum post length (0-500 chars) after processing.
  POST_SOURCE: string; // Original post URL base string to be replaced (e.g., "https://x.com/"). Use escapeRegExp with this.
  POST_TARGET: string; // Target post URL base string for replacement (e.g., "https://twitter.com/").
  QUOTE_SENTENCE: string; // Prefix used when formatting a quote post (mainly for Bluesky).
  REPOST_ALLOWED: boolean; // Whether reposts (retweets) are allowed to be published.
  REPOST_SENTENCE: string; // Prefix used when formatting a repost (retweet).
  SHOULD_PREFER_REAL_NAME: boolean; // If true, use the author's real name (if available) instead of their username in certain contexts (e.g., reposts).
  SHOW_FEEDURL_INSTD_POSTURL: boolean; // If true, show the feed's URL instead of the specific post's URL as a fallback.
  SHOW_IMAGEURL: boolean; // If true, include image URLs in the post output (using STATUS_IMAGEURL_SENTENCE).
  SHOW_ORIGIN_POSTURL_PERM: boolean; // If true, always include the original post URL in the output, regardless of other conditions. This might be overridden dynamically.
  SHOW_TITLE_AS_CONTENT: boolean; // If true, prioritize entryTitle over entryContent as the main post content.
  STATUS_IMAGEURL_SENTENCE: string; // Prefix added before the image URL when included.
  STATUS_URL_SENTENCE: string; // Prefix/suffix formatting added before/after the final post URL.
  TREAT_RSS_AS_TW: boolean; // If true AND the initial POST_FROM is "RSS", treat the feed item as if it came from Twitter ("TW").
}

// application settings configuration
const SETTINGS: AppSettings = {
  AMPERSAND_REPLACEMENT: `n`, // replacement for & char
  BANNED_COMMERCIAL_PHRASES: [], // e.g., ["advertisement", "discount", "sale"]
  CONTENT_HACK_PATTERNS: [ // Used by contentHack function for custom string manipulations.
    // Example: { pattern: "(?<!https?:\/\/)(example\.com\/)", replacement: "https:\/\/example\.com\/", flags: "gi" }, // hack for URLs without protocol
    // Example: { pattern: "(ZZZZZ[^>]+KKKKK)", replacement: "", flags: "gim" }, // replaces parts of the string between ZZZZZ and KKKKK including them with an empty string.
    // Example: { pattern: "what", replacement: "by_what", flags: "gi" }, // replaces pattern "what" by replacement "by_what" with flags
  ],
  EXCLUDED_URLS: ["youtu.be", "youtube.com"], // e.g., ["youtu.be", "youtube.com", "example.com"]
  MANDATORY_KEYWORDS: [], // e.g., ["news", "updates", "important"]
  MENTION_FORMATTING: {
    // Define platform-specific mention formats. Keys should match POST_FROM values or "DEFAULT".
    "DEFAULT": { type: "none", value: "" }, // Default behavior if platform-specific rule is missing.
    // "BS": { type: "suffix", value: ".bsky.social" }, // Example for Bluesky
    // "RSS": { type: "suffix", value: "@twitter.com" }, // Example for RSS (no change)
    "TW": { type: "suffix", value: "@twitter.com" }, // Example for X/Twitter
    // "IG": { type: "prefix", value: "https://instagram.com/" }, // Example for Instagram
    // "YT": { type: "none", value: "" }, // Example for YouTube
  },
  POST_FROM: "TW", // "BS" | "RSS" | "TW" | "YT" // Set this based on the IFTTT trigger used for the applet.
  POST_LENGTH: 280, // 0 - 500 chars
  POST_SOURCE: `https://x.com/`, // e.g., "" | `https://twitter.com/` | `https://x.com/`
  POST_TARGET: `https://twitter.com/`, // e.g., "" | `https://twitter.com/` | `https://x.com/`
  QUOTE_SENTENCE: " 𝕏📝💬 ", // e.g., "" | "comments post from" | "🦋📝💬" | "𝕏📝💬"
  REPOST_ALLOWED: true, // true | false
  REPOST_SENTENCE: " 𝕏📤 ", // e.g., "" | "shares" | "𝕏📤"
  SHOULD_PREFER_REAL_NAME: true, // true | false
  SHOW_FEEDURL_INSTD_POSTURL: false, // true | false
  SHOW_IMAGEURL: false, // true | false
  SHOW_ORIGIN_POSTURL_PERM: false, // true | false // Can be dynamically set to true later.
  SHOW_TITLE_AS_CONTENT: false, // true | false
  STATUS_IMAGEURL_SENTENCE: "", // e.g., "" | "🖼️ "
  STATUS_URL_SENTENCE: "\n", // e.g., "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 " | "\n🗣️🎙️👇👇👇\n" | "\nYT 📺👇👇👇\n"
  TREAT_RSS_AS_TW: false, // Default: false. Set to true ONLY in applets where an RSS feed (usually from RSS.app) should be processed using Twitter rules.
};
