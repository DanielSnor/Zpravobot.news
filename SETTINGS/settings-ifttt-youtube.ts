///////////////////////////////////////////////////////////////////////////////
// IFTTT 📺 webhook settings - World Wombat Day, Oct 22nd, 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// Configuration settings for the IFTTT webhook filter.
// These settings define content rules, platform-specific behavior, and formatting options.
//
///////////////////////////////////////////////////////////////////////////////

// Application settings definition
interface AppSettings {
  ///////////////////////////////////////////////////////////////////////////
  // CONTENT FILTERING & VALIDATION
  ///////////////////////////////////////////////////////////////////////////
  PHRASES_BANNED: (string | FilterRule)[]; // List of phrases or filter rules that indicate banned content. Posts containing these will be skipped. Supports literal strings, regex patterns, and logical combinations (and/or).
  PHRASES_REQUIRED: (string | FilterRule)[]; // List of keywords or filter rules that must appear in the post content or title for it to be published. Supports literal strings, regex patterns, and logical combinations (and/or).
  REPOST_ALLOWED: boolean; // Whether reposts (retweets) are allowed to be published.

  ///////////////////////////////////////////////////////////////////////////
  // CONTENT PROCESSING & TRANSFORMATION
  ///////////////////////////////////////////////////////////////////////////
  AMPERSAND_SAFE_CHAR: string; // Character used to replace ampersands (&) in text to avoid encoding issues.
  CONTENT_REPLACEMENTS: { pattern: string;replacement: string;flags ? : string;literal ? : boolean } []; // Array of regex patterns and replacements for manipulating post content (e.g., fixing URLs or removing unwanted text).
  POST_LENGTH: number; // Maximum post length (0-500 chars) after processing.
  POST_LENGTH_TRIM_STRATEGY: "sentence" | "word" | "smart"; // Strategy for truncation: word cut, sentence preservation, or smart hybrid approach with tolerance.
  SMART_TOLERANCE_PERCENT: number; // For smart trim strategy: percentage of POST_LENGTH that can be "wasted" to preserve sentence boundaries (5-25, recommended 12).

  ///////////////////////////////////////////////////////////////////////////
  // URL CONFIGURATION
  ///////////////////////////////////////////////////////////////////////////
  URL_REPLACE_FROM: string; // Original post URL base string to be replaced (e.g., "https://x.com/"). Use escapeRegExp with this.
  URL_REPLACE_TO: string; // Target post URL base string for replacement (e.g., "https://twitter.com/").
  URL_NO_TRIM_DOMAINS: string[]; // URLs that should NOT be trimmed by trimUrlQuery, but should still be URL-encoded in processAmpersands.
  URL_DOMAIN_FIXES: string[]; // A list of domains (e.g. "rspkt.cz", "example.com") to add the https:// protocol to, if missing.
  FORCE_SHOW_ORIGIN_POSTURL: boolean; // If true, always include the original post URL in the output, regardless of other conditions. Works in conjunction with other URL display logic.
  FORCE_SHOW_FEEDURL: boolean; // If true, show the feed's URL instead of the specific post's URL as a fallback when URL processing yields empty string.
  SHOW_IMAGEURL: boolean; // If true, include image URLs in the post output (using PREFIX_IMAGE_URL).

  ///////////////////////////////////////////////////////////////////////////
  // OUTPUT FORMATTING & PREFIXES
  ///////////////////////////////////////////////////////////////////////////
  PREFIX_REPOST: string; // Prefix used when formatting a repost (retweet).
  PREFIX_QUOTE: string; // Prefix used when formatting a quote post (mainly for Bluesky and Twitter).
  PREFIX_IMAGE_URL: string; // Prefix added before the image URL when included.
  PREFIX_POST_URL: string; // Prefix/suffix formatting added before/after the final post URL.
  PREFIX_SELF_REFERENCE: string; // Text pro self-quotes a self-reposts (např. "svůj příspěvek")
  MENTION_FORMATTING: { [platform: string]: { type: "prefix" | "suffix" | "none";value: string } }; // Defines how @mentions are formatted per platform (e.g., add suffix, prefix, or do nothing).

  ///////////////////////////////////////////////////////////////////////////
  // PLATFORM-SPECIFIC SETTINGS
  ///////////////////////////////////////////////////////////////////////////
  POST_FROM: "BS" | "RSS" | "TW" | "YT"; // Identifier for the source platform of the post (e.g., Bluesky, RSS feed, Twitter, YouTube).
  SHOW_REAL_NAME: boolean; // If true, use the author's real name (if available) instead of their username in certain contexts (e.g., reposts, quotes).
  SHOW_TITLE_AS_CONTENT: boolean; // If true, prioritize entryTitle over entryContent as the main post content.

  ///////////////////////////////////////////////////////////////////////////
  // RSS-SPECIFIC SETTINGS
  ///////////////////////////////////////////////////////////////////////////
  RSS_MAX_INPUT_CHARS: number; // Maximum input length for RSS feeds before processing (0 = no limit).
}

// Application settings configuration
const SETTINGS: AppSettings = {
  ///////////////////////////////////////////////////////////////////////////
  // CONTENT FILTERING & VALIDATION
  ///////////////////////////////////////////////////////////////////////////
  PHRASES_BANNED: [], // E.g., ["advertisement", "discount", "sale"]. Leave empty to disable this filter.
  PHRASES_REQUIRED: [], // E.g., ["news", "updates", "important"]. Leave empty to disable mandatory keyword filtering.
  REPOST_ALLOWED: true, // true | false. Determines if reposts are processed or skipped.
  
  ///////////////////////////////////////////////////////////////////////////
  // CONTENT PROCESSING & TRANSFORMATION
  ///////////////////////////////////////////////////////////////////////////
  AMPERSAND_SAFE_CHAR: `⅋`, // Replacement for & char to prevent encoding issues in URLs or text.
  CONTENT_REPLACEMENTS: [], // E.g.: { pattern: "what", replacement: "by_what", flags: "gi", literal: false }
  POST_LENGTH: 444, // 0 - 500 chars. Adjust based on target platform's character limit.
  POST_LENGTH_TRIM_STRATEGY: "sentence", // "sentence" | "word" | "smart". Try to preserve meaningful content during trimming.
  SMART_TOLERANCE_PERCENT: 12, // 5-25, recommended 12. Percentage of POST_LENGTH that can be wasted to preserve sentence boundaries in smart trim mode.
  
  ///////////////////////////////////////////////////////////////////////////
  // URL CONFIGURATION
  ///////////////////////////////////////////////////////////////////////////
  URL_REPLACE_FROM: "", // E.g., "" | `https://twitter.com/` | `https://x.com/`. Source URL pattern to be replaced.
  URL_REPLACE_TO: "", // E.g., "" | `https://twitter.com/` | `https://x.com/`. Target URL pattern for replacement.
  URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"], // E.g., ["youtu.be", "youtube.com", "example.com"]. URLs in this list are excluded from trimming but still encoded.
  URL_DOMAIN_FIXES: [], // E.g., ["example.com"]. Domains that are automatically prefixed with https:// if the protocol is missing.
  FORCE_SHOW_ORIGIN_POSTURL: true, // true | false. Always show original post URL (works with other URL display logic).
  FORCE_SHOW_FEEDURL: false, // true | false. Use feed URL as fallback instead of post-specific URL when URL processing fails.
  SHOW_IMAGEURL: false, // true | false. Include image URLs in output if available.
  
  ///////////////////////////////////////////////////////////////////////////
  // OUTPUT FORMATTING & PREFIXES
  ///////////////////////////////////////////////////////////////////////////
  PREFIX_REPOST: "", // E.g., "" | "shares" | "𝕏📤". Formatting prefix for reposts.
  PREFIX_QUOTE: "", // E.g., "" | "comments post from" | "🦋📝💬" | "𝕏📝💬". Formatting for quoted content.
  PREFIX_IMAGE_URL: "", // E.g., "" | "🖼️ ". Prefix for image URLs if shown.
  PREFIX_POST_URL: "\nYT 📺👇👇👇\n", // E.g., "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 ". Formatting for post URLs.
  PREFIX_SELF_REFERENCE: "", // Text for self-quotes a self-reposts
  MENTION_FORMATTING: { "YT": { type: "none", value: "" }, }, // Default behavior if platform-specific rule is missing.
  
  ///////////////////////////////////////////////////////////////////////////
  // PLATFORM-SPECIFIC SETTINGS
  ///////////////////////////////////////////////////////////////////////////
  POST_FROM: "YT", // "BS" | "RSS" | "TW" | "YT". Set this based on the IFTTT trigger used for the applet.
  SHOW_REAL_NAME: true, // true | false. Prefer real name over username if available.
  SHOW_TITLE_AS_CONTENT: false, // true | false. Use title as content if set to true.
  
  ///////////////////////////////////////////////////////////////////////////
  // RSS-SPECIFIC SETTINGS
  ///////////////////////////////////////////////////////////////////////////
  RSS_MAX_INPUT_CHARS: 1000, // Limit input to 1000 characters for RSS before HTML processing.
};