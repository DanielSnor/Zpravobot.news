///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋 webhook settings - St. Daniel's Day rev, Dec 17th, 2025
///////////////////////////////////////////////////////////////////////////////

// Application settings definition 
interface AppSettings {
  // CONTENT FILTERING & VALIDATION //
  PHRASES_BANNED: (string | FilterRule)[]; // Banned phrases. Supports strings, regex, logic.
  PHRASES_REQUIRED: (string | FilterRule)[]; // Required keywords. Supports strings, regex, logic.
  REPOST_ALLOWED: boolean; // Allow reposts (retweets) to be published.
  // CONTENT PROCESSING & TRANSFORMATION //
  AMPERSAND_SAFE_CHAR: string; // Character replacing ampersands (&) to avoid encoding issues.
  CONTENT_REPLACEMENTS: { pattern: string;replacement: string;flags ? : string;literal ? : boolean } []; // Regex for content manipulation.
  POST_LENGTH: number; // Max post length after processing (0-500 chars).
  POST_LENGTH_TRIM_STRATEGY: "sentence" | "word" | "smart"; // Truncation strategy: word, sentence, or smart hybrid.
  SMART_TOLERANCE_PERCENT: number; // Smart trim: % for sentence preservation (5-25, rec. 12).
  TCO_REPLACEMENT: string; // Placeholder for t.co shortened links.
  // URL CONFIGURATION //
  FORCE_SHOW_FEEDURL: boolean; // Show feed URL as fallback when URL processing yields empty string.
  FORCE_SHOW_ORIGIN_POSTURL: boolean; // Always include original post URL regardless of other conditions.
  SHOW_IMAGEURL: boolean; // Include image URLs in output (using PREFIX_IMAGE_URL).
  URL_DOMAIN_FIXES: string[]; // Domains to add https:// if missing (e.g. "rspkt.cz").
  URL_NO_TRIM_DOMAINS: string[]; // URLs to skip trimUrlQuery but still URL-encode in processAmpersands.
  URL_REPLACE_FROM: string | string[]; // URL base(s) to replace. String or array.
  URL_REPLACE_TO: string; // Target URL base for replacement.
  // OUTPUT FORMATTING & PREFIXES //
  MENTION_FORMATTING: { [platform: string]: { type: "prefix" | "suffix" | "none";value: string } }; // @mention format per platform.
  PREFIX_IMAGE_URL: string; // Prefix before image URL.
  PREFIX_POST_URL: string; // Prefix/suffix formatting for final post URL.
  PREFIX_QUOTE: string; // Prefix for quote posts (Bluesky, Twitter).
  PREFIX_REPOST: string; // Prefix for reposts (retweets).
  PREFIX_SELF_REFERENCE: string; // Text pro self-quotes a self-reposts (např. "svůj příspěvek")
  // PLATFORM-SPECIFIC SETTINGS //
  MOVE_URL_TO_END: boolean; // Move URLs from content start to end (useful for RSS).
  POST_FROM: "BS" | "RSS" | "TW" | "YT"; // Source platform identifier.
  SHOW_REAL_NAME: boolean; // Use author's real name instead of username (reposts, quotes).
  SHOW_TITLE_AS_CONTENT: boolean; // Prioritize entryTitle over entryContent.
  // CONTENT COMBINATION (RSS & YOUTUBE) //
  COMBINE_TITLE_AND_CONTENT: boolean; // Combine entryTitle and entryContent (RSS and YT only).
  CONTENT_TITLE_SEPARATOR: string; // Title and Content Separator
  RSS_MAX_INPUT_CHARS: number; // Max RSS input length before processing (0 = no limit).
}

// Application settings configuration
const SETTINGS: AppSettings = {
  // CONTENT FILTERING & VALIDATION //
  PHRASES_BANNED: [], // E.g. ["advertisement", {type:"regex",pattern:"\\bsale\\b",flags:"i"}]
  PHRASES_REQUIRED: [], // E.g. ["news", {type:"and",keywords:["tech","innovation"]}]
  REPOST_ALLOWED: true, // true | false. Determines if reposts are processed or skipped.
  // CONTENT PROCESSING & TRANSFORMATION //
  AMPERSAND_SAFE_CHAR: `⅋`, // Replacement for & char to prevent encoding issues in URLs or text.
  CONTENT_REPLACEMENTS: [], // E.g.: { pattern: "what", replacement: "by_what", flags: "gi", literal: false }
  POST_LENGTH: 333, // 0 - 500 chars. Adjust based on target platform's character limit.
  POST_LENGTH_TRIM_STRATEGY: "smart", // "sentence" | "word" | "smart". Preserve meaningful content.
  SMART_TOLERANCE_PERCENT: 12, // 5-25, rec. 12. % of POST_LENGTH for sentence boundaries.
  TCO_REPLACEMENT: "", // "" | "↗" | "🔗↗️" | "[url]". Placeholder for t.co links (Twitter/X).
  // URL CONFIGURATION //
  FORCE_SHOW_ORIGIN_POSTURL: true, // Always show original post URL.
  FORCE_SHOW_FEEDURL: false, // Use feed URL as fallback when URL processing fails.
  SHOW_IMAGEURL: false, // true | false. Include image URLs in output if available.
  URL_DOMAIN_FIXES: [], // Domains that are automatically prefixed with https:// if the protocol is missing.
  URL_NO_TRIM_DOMAINS: [
    "facebook.com", "www.facebook.com", "instagram.com", "www.instagram.com", // Facebook and Instagram
    "bit.ly", "goo.gl", "ift.tt", "ow.ly", "t.co", "tinyurl.com", // URL shorteners
    "youtu.be", "youtube.com", // Youtube
  ], // URLs in this list are excluded from trimming but still encoded.  
  URL_REPLACE_FROM: "", // Source URL pattern(s) to replace. String or array.
  URL_REPLACE_TO: "", // Target URL pattern for replacement.
  // OUTPUT FORMATTING & PREFIXES //
  MENTION_FORMATTING: { "BS": { type: "prefix", value: "https://bsky.app/profile/" }, }, // Prefix for BlueSky mentions
  PREFIX_IMAGE_URL: "", // E.g., "" | "🖼️ ". Prefix for image URLs if shown.
  PREFIX_POST_URL: "\n", // E.g., "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 ". Formatting for post URLs.
  PREFIX_QUOTE: " 🦋📝💬", // E.g., "" | "comments post from" | "🦋📝💬" | "𝕏📝💬". Formatting for quoted content.
  PREFIX_REPOST: "", // E.g., "" | "shares" | "𝕏📤". Formatting prefix for reposts.
  PREFIX_SELF_REFERENCE: "", // Text for self-quotes a self-reposts
  // PLATFORM-SPECIFIC SETTINGS //
  MOVE_URL_TO_END: true, // Move URLs from beginning to end (useful for RSS).
  POST_FROM: "BS", // "BS" | "RSS" | "TW" | "YT". Set this based on the IFTTT trigger used for the applet.
  SHOW_REAL_NAME: true, // true | false. Prefer real name over username if available.
  SHOW_TITLE_AS_CONTENT: false, // true | false. Use title as content (lower priority than COMBINE).
  // CONTENT COMBINATION (RSS & YOUTUBE) //
  COMBINE_TITLE_AND_CONTENT: false, // Merge title + content for enhanced posts (RSS, YT only).
  CONTENT_TITLE_SEPARATOR: "", // Title and Content Separator when COMBINE_TITLE_AND_CONTENT: true
  RSS_MAX_INPUT_CHARS: 1000, // Limit input to 1000 characters for RSS before HTML processing.
};