///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋 webhook settings - Black Friday rev, Nov 28th, 2025
///////////////////////////////////////////////////////////////////////////////
//
// Configuration settings for the IFTTT webhook filter.
// These settings define content rules, platform-specific behavior, and formatting options.
//
///////////////////////////////////////////////////////////////////////////////

// Application settings definition 
interface AppSettings {
  ///// CONTENT FILTERING & VALIDATION /////
  PHRASES_BANNED: (string | FilterRule)[]; // Banned content phrases/rules. Supports strings, regex, logical combinations.
  PHRASES_REQUIRED: (string | FilterRule)[]; // Required keywords/rules for publishing. Supports strings, regex, logical combinations.
  REPOST_ALLOWED: boolean; // Allow reposts (retweets) to be published.
  ///// CONTENT PROCESSING & TRANSFORMATION /////
  AMPERSAND_SAFE_CHAR: string; // Character replacing ampersands (&) to avoid encoding issues.
  CONTENT_REPLACEMENTS: { pattern: string;replacement: string;flags ? : string;literal ? : boolean } []; // Regex patterns for content manipulation (URLs, unwanted text).
  POST_LENGTH: number; // Max post length after processing (0-500 chars).
  POST_LENGTH_TRIM_STRATEGY: "sentence" | "word" | "smart"; // Truncation strategy: word, sentence, or smart hybrid.
  SMART_TOLERANCE_PERCENT: number; // Smart trim: % of POST_LENGTH for sentence preservation (5-25, recommended 12).
  ///// URL CONFIGURATION /////
  URL_REPLACE_FROM: string | string[]; // Original URL base(s) to replace. Single domain or array. Use escapeRegExp.
  URL_REPLACE_TO: string; // Target URL base for replacement.
  URL_NO_TRIM_DOMAINS: string[]; // URLs to skip trimUrlQuery but still URL-encode in processAmpersands.
  URL_DOMAIN_FIXES: string[]; // Domains to add https:// if missing (e.g. "rspkt.cz").
  FORCE_SHOW_ORIGIN_POSTURL: boolean; // Always include original post URL regardless of other conditions.
  FORCE_SHOW_FEEDURL: boolean; // Show feed URL as fallback when URL processing yields empty string.
  SHOW_IMAGEURL: boolean; // Include image URLs in output (using PREFIX_IMAGE_URL).
  ///// OUTPUT FORMATTING & PREFIXES /////
  PREFIX_REPOST: string; // Prefix for reposts (retweets).
  PREFIX_QUOTE: string; // Prefix for quote posts (Bluesky, Twitter).
  PREFIX_IMAGE_URL: string; // Prefix before image URL.
  PREFIX_POST_URL: string; // Prefix/suffix formatting for final post URL.
  PREFIX_SELF_REFERENCE: string; // Text pro self-quotes a self-reposts (např. "svůj příspěvek")
  MENTION_FORMATTING: { [platform: string]: { type: "prefix" | "suffix" | "none";value: string } }; // @mention formatting per platform.
  ///// PLATFORM-SPECIFIC SETTINGS /////
  MOVE_URL_TO_END: boolean; // Move URLs from content start to end (useful for RSS).
  POST_FROM: "BS" | "RSS" | "TW" | "YT"; // Source platform identifier.
  SHOW_REAL_NAME: boolean; // Use author's real name instead of username (reposts, quotes).
  SHOW_TITLE_AS_CONTENT: boolean; // Prioritize entryTitle over entryContent.
  ///// RSS-SPECIFIC SETTINGS /////
  RSS_MAX_INPUT_CHARS: number; // Max RSS input length before processing (0 = no limit).
}

// Application settings configuration
const SETTINGS: AppSettings = {
  ///// CONTENT FILTERING & VALIDATION /////
  PHRASES_BANNED: [], // E.g., ["advertisement", { type: "regex", pattern: "\\bsale\\b", flags: "i" }]. Leave empty to disable this filter.
  PHRASES_REQUIRED: [], // E.g., ["news", { type: "and", keywords: ["tech", "innovation"] }]. Leave empty to disable mandatory keyword filtering.
  REPOST_ALLOWED: true, // true | false. Determines if reposts are processed or skipped.
  ///// CONTENT PROCESSING & TRANSFORMATION /////
  AMPERSAND_SAFE_CHAR: `⅋`, // Replacement for & char to prevent encoding issues in URLs or text.
  CONTENT_REPLACEMENTS: [], // E.g.: { pattern: "what", replacement: "by_what", flags: "gi", literal: false }
  POST_LENGTH: 333, // 0 - 500 chars. Adjust based on target platform's character limit.
  POST_LENGTH_TRIM_STRATEGY: "smart", // "sentence" | "word" | "smart". Try to preserve meaningful content during trimming.
  SMART_TOLERANCE_PERCENT: 12, // 5-25, recommended 12. Percentage of POST_LENGTH that can be wasted to preserve sentence boundaries in smart trim mode.
  ///// URL CONFIGURATION /////
  URL_REPLACE_FROM: "", // E.g., "" | "https://x.com/" | ["https://x.com/", "https://twitter.com/"]. Source URL pattern(s) to be replaced. Can be string or array.
  URL_REPLACE_TO: "", // E.g., "" | `https://x.com/` | `https://xcancel.com/`. Target URL pattern for replacement.
  URL_NO_TRIM_DOMAINS: [
    "facebook.com", "www.facebook.com", "instagram.com", "www.instagram.com", // Facebook and Instagram
    "bit.ly", "goo.gl", "ift.tt", "ow.ly", "t.co", "tinyurl.com",             // Bit.ly, Google, IFTTT, Hootsuite, Twitter and TinyURL shortened links
    "youtu.be", "youtube.com",                                                // Youtube
  ], // URLs in this list are excluded from trimming but still encoded.  
  URL_DOMAIN_FIXES: [], // Domains that are automatically prefixed with https:// if the protocol is missing.
  FORCE_SHOW_ORIGIN_POSTURL: true, // true | false. Always show original post URL (works with other URL display logic).
  FORCE_SHOW_FEEDURL: false, // true | false. Use feed URL as fallback instead of post-specific URL when URL processing fails.
  SHOW_IMAGEURL: false, // true | false. Include image URLs in output if available.
  ///// OUTPUT FORMATTING & PREFIXES /////
  PREFIX_REPOST: "", // E.g., "" | "shares" | "𝕏📤". Formatting prefix for reposts.
  PREFIX_QUOTE: " 🦋📝💬", // E.g., "" | "comments post from" | "🦋📝💬" | "𝕏📝💬". Formatting for quoted content.
  PREFIX_IMAGE_URL: "", // E.g., "" | "🖼️ ". Prefix for image URLs if shown.
  PREFIX_POST_URL: "\n", // E.g., "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 ". Formatting for post URLs.
  PREFIX_SELF_REFERENCE: "", // Text for self-quotes a self-reposts
  MENTION_FORMATTING: { "BS": { type: "prefix", value: "https://bsky.app/profile/" }, }, // Prefix added to BlueSky mentions for clarity or linking.
  ///// PLATFORM-SPECIFIC SETTINGS /////
  MOVE_URL_TO_END: true, // true | false. Move URLs from beginning to end of content (useful for RSS feeds).
  POST_FROM: "BS", // "BS" | "RSS" | "TW" | "YT". Set this based on the IFTTT trigger used for the applet.
  SHOW_REAL_NAME: true, // true | false. Prefer real name over username if available.
  SHOW_TITLE_AS_CONTENT: false, // true | false. Use title as content if set to true.
  ///// RSS-SPECIFIC SETTINGS /////
  RSS_MAX_INPUT_CHARS: 1000, // Limit input to 1000 characters for RSS before HTML processing.
};
