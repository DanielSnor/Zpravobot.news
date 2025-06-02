///////////////////////////////////////////////////////////////////////////////
// settings for IFTTT 📺 webhook filter - Children's Day 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// Configuration settings for the IFTTT webhook filter.
// These settings define content rules, platform-specific behavior, and formatting options.
//
///////////////////////////////////////////////////////////////////////////////

// Application settings definition
interface AppSettings {
  AMPERSAND_REPLACEMENT: string; // Character used to replace ampersands (&) in text to avoid encoding issues.
  BANNED_COMMERCIAL_PHRASES: string[]; // List of phrases that indicate commercial or banned content. Posts containing these will be skipped.
  CONTENT_HACK_PATTERNS: { pattern: string; replacement: string; flags?: string; literal?: boolean }[]; // Array of regex patterns and replacements for manipulating post content (e.g., fixing URLs or removing unwanted text).
  EXCLUDED_URLS: string[]; // URLs that should NOT be trimmed by trimUrl, but should still be URL-encoded in replaceAmpersands.
  MANDATORY_KEYWORDS: string[]; // List of keywords that must appear in the post content or title for it to be published.
  MENTION_FORMATTING: { [platform: string]: { type: "prefix" | "suffix" | "none";value: string; } }; // Defines how @mentions are formatted per platform (e.g., add suffix, prefix, or do nothing).
  POST_FROM: "BS" | "RSS" | "TW" | "YT"; // Identifier for the source platform of the post (e.g., Bluesky, RSS feed, Twitter, YouTube). This value might be overridden based on TREAT_RSS_AS_TW.
  POST_LENGTH: number; // Maximum post length (0-500 chars) after processing.
  POST_LENGTH_TRIM_STRATEGY: "sentence" | "word"; // Strategy for truncation: word cut or attempt to preserve whole last sentence.
  POST_SOURCE: string; // Original post URL base string to be replaced (e.g., "https://x.com/"). Use escapeRegExp with this.
  POST_TARGET: string; // Target post URL base string for replacement (e.g., "https://twitter.com/").
  QUOTE_SENTENCE: string; // Prefix used when formatting a quote post (mainly for Bluesky).
  REPOST_ALLOWED: boolean; // Whether reposts (retweets) are allowed to be published.
  REPOST_SENTENCE: string; // Prefix used when formatting a repost (retweet).
  RSS_INPUT_LIMIT: number; // Maximum input length for RSS feeds before processing (0 = no limit).
  RSS_INPUT_TRUNCATION_STRATEGY: "simple" | "preserve_content"; // Strategy for truncation: simple cut or attempt to preserve meaningful content.
  SHOULD_PREFER_REAL_NAME: boolean; // If true, use the author's real name (if available) instead of their username in certain contexts (e.g., reposts).
  SHOW_FEEDURL_INSTD_POSTURL: boolean; // If true, show the feed's URL instead of the specific post's URL as a fallback.
  SHOW_IMAGEURL: boolean; // If true, include image URLs in the post output (using STATUS_IMAGEURL_SENTENCE).
  SHOW_ORIGIN_POSTURL_PERM: boolean; // If true, always include the original post URL in the output, regardless of other conditions. This might be overridden dynamically.
  SHOW_TITLE_AS_CONTENT: boolean; // If true, prioritize entryTitle over entryContent as the main post content.
  STATUS_IMAGEURL_SENTENCE: string; // Prefix added before the image URL when included.
  STATUS_URL_SENTENCE: string; // Prefix/suffix formatting added before/after the final post URL.
  TREAT_RSS_AS_TW: boolean; // If true AND the initial POST_FROM is "RSS", treat the feed item as if it came from Twitter ("TW").
  URL_DOMAIN_FIXES: string[]; // A list of domains (e.g. "rspkt.cz", "example.com") to add the https:// protocol to, if missing.
}

// application settings configuration
const SETTINGS: AppSettings = {
  AMPERSAND_REPLACEMENT: `ꝸ`, // Replacement for & char to prevent encoding issues in URLs or text.
  BANNED_COMMERCIAL_PHRASES: [], // E.g., ["advertisement", "discount", "sale"]. Leave empty to disable this filter.
  CONTENT_HACK_PATTERNS: [], // E.g.: { pattern: "what", replacement: "by_what", flags: "gi", literal: false }, // Replaces pattern "what" by replacement "by_what" with flags.
  EXCLUDED_URLS: ["youtu.be", "youtube.com"], // E.g., ["youtu.be", "youtube.com", "example.com"]. URLs in this list are excluded from trimming but still encoded.
  MANDATORY_KEYWORDS: [], // E.g., ["news", "updates", "important"]. Leave empty to disable mandatory keyword filtering.
  MENTION_FORMATTING: { "DEFAULT": { type: "none", value: "" }, }, // Default behavior if platform-specific rule is missing.
  POST_FROM: "YT", // "BS" | "RSS" | "TW" | "YT"
  POST_LENGTH: 444, // 0 - 500 chars
  POST_LENGTH_TRIM_STRATEGY: "sentence", // "sentence" | "word" // Try to preserve meaningful content during trimming.
  POST_SOURCE: "", // "" | `https://twitter.com/` | `https://x.com/`
  POST_TARGET: "", // "" | `https://twitter.com/` | `https://x.com/`
  QUOTE_SENTENCE: "", // "" | "comments post from" | "🦋📝💬" | "𝕏📝💬"
  REPOST_ALLOWED: true, // true | false
  REPOST_SENTENCE: "", // "" | "shares" | "𝕏📤"
  RSS_INPUT_LIMIT: 1000, // Limit input to 1000 characters for RSS before HTML processing.
  RSS_INPUT_TRUNCATION_STRATEGY: "preserve_content", // "simple" | "preserve_content" // Try to preserve meaningful content during truncation.
  SHOULD_PREFER_REAL_NAME: true, // true | false
  SHOW_FEEDURL_INSTD_POSTURL: false, // true | false
  SHOW_IMAGEURL: false, // true | false
  SHOW_ORIGIN_POSTURL_PERM: true, // true | false
  SHOW_TITLE_AS_CONTENT: false, // true | false
  STATUS_IMAGEURL_SENTENCE: "", // "" | "🖼️"
  STATUS_URL_SENTENCE: "\nYT 📺👇👇👇\n", // "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 " | "\n🗣️🎙️👇👇👇\n" | "\nYT 📺👇👇👇\n"
  TREAT_RSS_AS_TW: false, // Default: false. Set to true ONLY in applets where an RSS feed (usually from RSS.app) should be processed using Twitter rules.
  URL_DOMAIN_FIXES: [], // E.g., "example.com" // Domains divided by , that are automatically added to https:// if the protocol is missing.
};
