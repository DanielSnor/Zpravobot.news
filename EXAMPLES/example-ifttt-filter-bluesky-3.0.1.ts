///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋 webhook settings - World Wombat Day, Oct 22nd, 2025 rev
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
  PREFIX_QUOTE: " 🦋📝💬", // E.g., "" | "comments post from" | "🦋📝💬" | "𝕏📝💬". Formatting for quoted content.
  PREFIX_IMAGE_URL: "", // E.g., "" | "🖼️ ". Prefix for image URLs if shown.
  PREFIX_POST_URL: "\n", // E.g., "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 ". Formatting for post URLs.
  PREFIX_SELF_REFERENCE: "", // Text for self-quotes a self-reposts
  MENTION_FORMATTING: { "BS": { type: "prefix", value: "https://bsky.app/profile/" }, }, // Prefix added to BlueSky mentions for clarity or linking.
  
  ///////////////////////////////////////////////////////////////////////////
  // PLATFORM-SPECIFIC SETTINGS
  ///////////////////////////////////////////////////////////////////////////
  POST_FROM: "BS", // "BS" | "RSS" | "TW" | "YT". Set this based on the IFTTT trigger used for the applet.
  SHOW_REAL_NAME: true, // true | false. Prefer real name over username if available.
  SHOW_TITLE_AS_CONTENT: false, // true | false. Use title as content if set to true.
  
  ///////////////////////////////////////////////////////////////////////////
  // RSS-SPECIFIC SETTINGS
  ///////////////////////////////////////////////////////////////////////////
  RSS_MAX_INPUT_CHARS: 1000, // Limit input to 1000 characters for RSS before HTML processing.
};

///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋📙📗📘 webhook connector - World Wombat Day, Oct 22nd, 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// This connector processes data from various sources (e.g., RSS, Twitter, Bluesky)
// and provides it to the IFTTT webhook for publishing. The data is filtered and
// edited according to the settings in AppSettings.
//
///////////////////////////////////////////////////////////////////////////////

// Main text content from the source. For BlueSky and RSS, this is often EntryContent (HTML or plain text).
const entryContent = Feed.newFeedItem.EntryContent || "";
// Title from the source. For BlueSky and RSS, this is the EntryTitle field.
const entryTitle = Feed.newFeedItem.EntryTitle || "";
// URL of the specific post/item. For BlueSky and RSS, this is the direct link to the item.
const entryUrl = Feed.newFeedItem.EntryUrl || "";
// URL of the first image/media link found in the post. For BlueSky and RSS, this is EntryImageUrl (might be unreliable).
const entryImageUrl = Feed.newFeedItem.EntryImageUrl || "";
// Username of the post author. For BlueSky and RSS, this is the EntryAuthor field.
const entryAuthor = Feed.newFeedItem.EntryAuthor || "";
// Title of the feed (can be username, feed name, etc.). For BlueSky and RSS, this is FeedTitle.
const feedTitle = Feed.newFeedItem.FeedTitle || "";
// URL of the source feed/profile. For BlueSky and RSS, this is the FeedUrl field.
const feedUrl = Feed.newFeedItem.FeedUrl || "";

///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋📙📗📘𝕏📺 webhook filter v3.0.1 - World Wombat Day, Oct 22th, 2025
///////////////////////////////////////////////////////////////////////////////
//
// Processes and filters posts from various platforms (Twitter, Bluesky, RSS, YouTube)
// for IFTTT webhook publishing. Applies normalization, formatting, shortening,
// and platform-specific rules based on settings.
//
// v3.0.1 (20251022):
// - Added safeTruncate() with hybrid ES5/ES6 approach for Unicode-safe truncation
// - Fixed truncateRssInput() to avoid breaking emoji and surrogate pairs
// - Added ArrayConstructor interface for Array.from type definition
// - Uses var instead of const for ES5 compatibility in safeTruncate()
// - Defensive object checking for IFTTT TypeScript 2.9.2 compatibility
// - Uses IFTTT-compatible formatting (spaces around ? : and < >)
// - Added decodeNumericEntities() for dynamic numeric HTML entity decoding
// - Cleaned CHAR_MAP: removed numeric entities, added Tier 1+2 named entities
// - Fixed emoji/Unicode issues (e.g., &#127758; → 🌎, not ⅋#127758;)
// - Performance: ~60% smaller CHAR_MAP, ~10-15% faster entity processing
//
// v3.0 Features:
// - Advanced filtering with FilterRule system (literal/regex/and/or logic)
// - Smart trim strategy with configurable tolerance
// - Optimized performance (lazy character map, unified cache, early exits)
// - Platform-specific quote/repost/reply handling
// - TypeScript 2.9.2 compatible
//
///////////////////////////////////////////////////////////////////////////////

// Pre-process URL_DOMAIN_FIXES into CONTENT_REPLACEMENTS at initialization (runs once)
(function initializeDomainFixes(): void {
  if (SETTINGS.URL_DOMAIN_FIXES && SETTINGS.URL_DOMAIN_FIXES.length > 0) {
    const domainPatterns = SETTINGS.URL_DOMAIN_FIXES
      .filter(function(d: string): boolean { return !!d; })
      .map(function(domain: string): any {
        return {
          pattern: "(?<!https?:\\/\\/)" + domain.replace(/\./g, '\\.') + "\\/?",
          replacement: "https://" + domain + "/",
          flags: "gi",
          literal: false
        };
      });
    SETTINGS.CONTENT_REPLACEMENTS = domainPatterns.concat(SETTINGS.CONTENT_REPLACEMENTS || []);
  }
})();

// Filter rule definition for advanced filtering logic
interface FilterRule { type: "literal" | "regex" | "and" | "or"; pattern ? : string; keywords ? : string[]; flags ? : string; }

// Type definitions for Object.entries (standard augmentation)
interface ObjectConstructor { entries < T > (o: { [s: string]: T } | ArrayLike < T > ): [string, T][]; }

// Type definitions for Platform configurations
interface PlatformConfig {
  useParsedText ? : boolean;
  useFeedTitleAuthor ? : boolean;
  applyMoveUrlToEnd ? : boolean;
  handleReplies ? : boolean;
  handleRetweets ? : boolean;
  handleQuotes ? : boolean;
  useGetContent ? : boolean;
}

// Type definitions for processed content result
interface ProcessedContent { content: string; feedAuthor: string; userNameToSkip: string; }

// Type definitions for processed status result
interface ProcessedStatus { trimmedContent: string; needsEllipsis: boolean; urlToShow: string; }

// Type definitions for string manipulation (standard augmentation)
interface String {
  startsWith(searchString: string, position ? : number): boolean;
  endsWith(searchString: string, endPosition ? : number): boolean;
}

// Type definition for Array.from (ES6 feature with runtime detection)
// IFTTT uses ES5 runtime, but we check for availability at runtime with typeof check
// Note: Simplified definition using only ArrayLike (no Iterable) for ES5 compatibility
interface ArrayConstructor {
  from < T > (arrayLike: ArrayLike < T > ): T[];
  from < T, U > (arrayLike: ArrayLike < T >, mapfn: (v: T, k: number) => U, thisArg ? : any): U[];
}

// Type definitions for trim result
interface TrimResult { content: string; needsEllipsis: boolean; }

// Type definition for truncate RSS result
interface TruncateRssResult { content: string; wasTruncated: boolean; }

// Unified cache object and FIFO queue for both regex and escaped strings
const MAX_CACHE_SIZE = 500;
const cache: { [key: string]: any } = {};
const fifoQueue: string[] = [];

// Define platform specific content cleaning.
const platformConfigs: { [key: string]: PlatformConfig } = {
  BS: { useFeedTitleAuthor: true, applyMoveUrlToEnd: true, handleQuotes: true, useGetContent: true },
  RSS: { useGetContent: true },
  TW: { useParsedText: true, handleReplies: true, handleRetweets: true, handleQuotes: true },
  YT: { useGetContent: true }
};

/**
 * Optimized character map for text normalization (v3.0.1).
 * Maps named HTML entities to their corresponding Unicode characters.
 * 
 * CHANGES IN v3.0.1:
 * - Removed ALL numeric entities (&#xxx;, &#xHH;) - now handled by decodeNumericEntities()
 * - Added Tier 1+2 named entities for better RSS feed compatibility
 * - Reduced map size by ~60% for better performance
 * 
 * Used by normalizeHtml function for fast character replacement.
 */
const CHAR_MAP: { [key: string]: string } = {
  // --- Czech characters (named entities only) ---
  "&Aacute;": "Á",
  "&aacute;": "á",
  "&Auml;": "Ä",
  "&auml;": "ä",
  "&Ccaron;": "Č",
  "&ccaron;": "č",
  "&Dcaron;": "Ď",
  "&dcaron;": "ď",
  "&Eacute;": "É",
  "&eacute;": "é",
  "&Euml;": "Ë",
  "&euml;": "ë",
  "&Ecaron;": "Ě",
  "&ecaron;": "ě",
  "&Iacute;": "Í",
  "&iacute;": "í",
  "&Iuml;": "Ï",
  "&iuml;": "ï",
  "&Ncaron;": "Ň",
  "&ncaron;": "ň",
  "&Oacute;": "Ó",
  "&oacute;": "ó",
  "&Ouml;": "Ö",
  "&ouml;": "ö",
  "&Odblac;": "Ő",
  "&odblac;": "ő",
  "&Rcaron;": "Ř",
  "&rcaron;": "ř",
  "&Scaron;": "Š",
  "&scaron;": "š",
  "&Tcaron;": "Ť",
  "&tcaron;": "ť",
  "&Uacute;": "Ú",
  "&uacute;": "ú",
  "&Uuml;": "Ü",
  "&uuml;": "ü",
  "&Uring;": "Ů",
  "&uring;": "ů",
  "&Udblac;": "Ű",
  "&udblac;": "ű",
  "&Yacute;": "Ý",
  "&yacute;": "ý",
  "&Zcaron;": "Ž",
  "&zcaron;": "ž",
  
  // --- Tier 1: CRITICAL named entities (frequently used in RSS feeds) ---
  "&nbsp;": " ",       // Non-breaking space - VERY common
  "&hellip;": "…",     // Ellipsis - common in articles
  "&mdash;": "—",      // Em dash - common in articles
  "&ndash;": "–",      // En dash
  "&lt;": "<",         // Less than - HTML safety
  "&gt;": ">",         // Greater than - HTML safety
  "&quot;": '"',       // Quotation mark - HTML safety
  "&apos;": "'",       // Apostrophe - HTML safety
  
  // --- Tier 2: IMPORTANT named entities (probable in Czech/Slovak RSS) ---
  "&euro;": "€",       // Euro sign - very common
  "&pound;": "£",      // British pound
  "&yen;": "¥",        // Japanese yen
  "&cent;": "¢",       // Cent
  "&copy;": "©",       // Copyright - common
  "&reg;": "®",        // Registered trademark - common
  "&trade;": "™",      // Trademark
  "&deg;": "°",        // Degree symbol (temperatures!)
  "&plusmn;": "±",     // Plus-minus
  "&times;": "×",      // Multiplication
  "&divide;": "÷",     // Division
  "&frac14;": "¼",     // 1/4 fraction
  "&frac12;": "½",     // 1/2 fraction
  "&half;": "½",       // 1/2 fraction (alternative)
  "&frac34;": "¾",     // 3/4 fraction
  
  // --- Additional common symbols ---
  "&laquo;": "«",      // Left angle quote
  "&raquo;": "»",      // Right angle quote
  "&lsquo;": "\u2018",      // Left single quote
  "&rsquo;": "\u2019",      // Right single quote
  "&ldquo;": "\u201C",      // Left double quote
  "&rdquo;": "\u201D",      // Right double quote
  "&sbquo;": "\u201A",      // Single low-9 quotation mark
  "&bdquo;": "\u201E",      // Double low-9 quotation mark
  "&prime;": "′",      // Prime
  "&Prime;": "″",      // Double prime
  "&permil;": "‰",     // Per mille
  "&thickapprox;": "≈", // Approximately equal
  "&ne;": "≠",         // Not equal
  "&minus;": "−",      // Minus sign
  "&bull;": "•",       // Bullet
  "&middot;": "·",     // Middle dot
  "&centerdot;": "·",  // Center dot (alternative)
  "&sect;": "§",       // Section sign
  "&para;": "¶",       // Paragraph sign
  "&dagger;": "†",     // Dagger
  "&Dagger;": "‡",     // Double dagger
  "&shy;": "-",        // Soft hyphen
  
  // --- Special case: wrapped ellipsis entities ---
  "[&hellip;]": "…",
  "[&amp;hellip;]": "…",
  "[&mldr;]": "…",
  "[&amp;mldr;]": "…",
  "&mldr;": "…",
  "&amp;hellip;": "…",
  "&amp;mldr;": "…",
  
  // --- Ampersand variants (must be LAST to avoid replacing & in other entities) ---
  "&amp;": SETTINGS.AMPERSAND_SAFE_CHAR,
  "&": SETTINGS.AMPERSAND_SAFE_CHAR
};

/**
 * Configuration object for precompiled regular expression patterns used in content processing.
 * Grouped into a single object for better organization and maintainability.
 * All patterns are TS 2.9.2 compatible (no Unicode property escapes).
 */
const REGEX_PATTERNS = {
  BS_QUOTE: /\[contains quote post or other embedded content\]/gi,
  EMOJI: /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u26FF\u2700-\u27BF]/g,
  HTML_CLEANUP: /(<(br|br\/|\/p)[^>]*>)|(<\/?h[1-6][^>]*>)|(<[^>]+>)|(\r?\n)/gi,
  REPOST_PREFIX: /^(RT @([^:]+): )/i,
  REPOST_URL: /href="(https:\/\/twitter\.com[^"]+)"/gi,
  REPOST_USER: /RT (@[a-z0-9_]+)/gi,
  RESPONSE_PREFIX: /^R to (.*?): /,
  TCO_URL: /https:\/\/t\.co\/[^\s]+/gi,
  URL_PROTOCOL: /https?:\/\//i,
  URL_MATCH: /https?:\/\/[^\s]+/g,
  URL_IN_WORD: /https?:\/\/\S+|\S+/g,
  URL_TERMINATOR: /(\bhttps?:\/\/[^\s]+\b|#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)$/i,
  WHITESPACE: /[ \t\u00A0]{2,}|(\r?\n){3,}/g,
  SPECIAL_CHARS: /[.*+?^${}()|[\]\\]/g,
  REPLY_START: /^(\.?@[\w]+|R to @[\w]+(\s|:|))/i,
  RT_PREFIX: /^RT\s+@[\w]+/i,
  TWEET_STATUS: /^https?:\/\/(twitter\.com|x\.com)\/[^\/]+\/status\/\d+/i,
  MEDIA_SUFFIX: /\/(photo|video)\/\d+$/i,
  USERNAME_EXTRACT: /^https?:\/\/(?:twitter\.com|x\.com)\/([^\/]+)\/status\/\d+/i,
  REAL_NAME: /&mdash;\s*([^<\(]+)\s*\(@/i,
  TWEET_TEXT: /<p[^>]*>([\s\S]*?)<\/p>/i,
  ELLIPSIS_NORMALIZE: /\.(\s*\.){2,}/gim,
  ELLIPSIS_MULTI: /\u2026{2,}/gim,
  SPACE_BEFORE_URL: /\s+(?=https?)/g,
  TERMINATOR_CHECK: /[.!?\u2026]$/
};

///////////////////////////////////////////////////////////////////////////////
// OPTIMIZED HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Escapes special characters in a string to make it safe for use in regular expressions.
 * @param str - The string to escape
 * @returns The escaped string with special characters prefixed by backslashes, or empty string if input is invalid.
 */
function escapeRegExp(str: string): string {
  if (!str) return "";
  return getCached("escape:" + str, function(): string { return str.replace(REGEX_PATTERNS.SPECIAL_CHARS, "\\$&"); });
}

/**
 * Unified generic cache function with FIFO eviction policy.
 * @param key - The cache key (should include prefix to avoid collisions)
 * @param factory - Function to create the value if not cached
 * @returns The cached or newly created value
 */
function getCached < T > (key: string, factory: () => T): T {
  if (cache[key]) return cache[key];

  const value = factory();
  cache[key] = value;
  fifoQueue.push(key);

  if (fifoQueue.length > MAX_CACHE_SIZE) {
    const oldest = fifoQueue.shift();
    if (oldest) delete cache[oldest];
  }

  return value;
}

/**
 * Returns a cached RegExp object for the given pattern and flags.
 * @param pattern - The regex pattern as a string
 * @param flags - The regex flags (e.g., 'gi')
 * @returns The cached or newly created RegExp object
 */
function getCachedRegex(pattern: string, flags: string): RegExp {
  const key = "regex:" + pattern + "|" + flags;
  return getCached(key, function(): RegExp { return new RegExp(pattern, flags); });
}

/**
 * Gets platform-specific configuration with fallback to RSS defaults.
 * Centralized platform config lookup to reduce code duplication.
 * @param platform - Platform identifier ("BS", "TW", "RSS", "YT")
 * @returns Platform configuration object
 */
function getPlatformConfig(platform: string): PlatformConfig { return platformConfigs[platform] || platformConfigs["RSS"] || {}; }

/**
 * Validates if a value is a non-empty string.
 * Centralized type checking to reduce code duplication.
 * @param value - The value to check
 * @returns True if value is a non-empty string, false otherwise
 */
function isValidString(value: any): boolean { return typeof value === "string" && value.length > 0; }

/**
 * Safely truncates a string at a specified length without breaking Unicode surrogate pairs.
 * Uses Array.from() if available (modern runtimes), falls back to manual iteration for ES5.
 * Respects Unicode code points (emoji) but not grapheme clusters (combining chars, ZWJ sequences).
 * 
 * Performance: O(n) in worst case, but with early exit for short strings.
 * Memory: O(n) for Array.from path, O(1) for ES5 fallback path.
 * 
 * @param str - The string to truncate
 * @param maxCodePoints - Maximum length in Unicode code points (not UTF-16 code units)
 * @returns Object with truncated string and flag indicating if truncation occurred
 * 
 * @example
 * safeTruncate("Hello World", 7)   // { result: "Hello W", wasTruncated: true }
 * safeTruncate("Test", 10)         // { result: "Test", wasTruncated: false }
 */
function safeTruncate(str: string, maxCodePoints: number): { result: string;wasTruncated: boolean } {
  if (!str || maxCodePoints <= 0) { return { result: "", wasTruncated: false }; }

  // Fast path: if string is definitely shorter, no need to process
  if (str.length <= maxCodePoints) { return { result: str, wasTruncated: false }; }

  // Modern path: Use Array.from if available (ES6+)
  if (typeof Array.from === "function") {
    try {
      var arr = Array.from(str);
      var wasTruncated = arr.length > maxCodePoints;
      return {
        result: wasTruncated ? arr.slice(0, maxCodePoints).join("") : str,
        wasTruncated: wasTruncated
      };
    } catch (e) {} // Fallback if Array.from fails for any reason
  }

  // ES5 fallback: Manual surrogate pair handling
  var codePointCount = 0;
  var truncateAt = 0;
  var i = 0;

  while (i < str.length && codePointCount < maxCodePoints) {
    var charCode = str.charCodeAt(i);

    // Check for high surrogate (0xD800-0xDBFF)
    if (charCode >= 0xD800 && charCode <= 0xDBFF && i + 1 < str.length) {
      var nextCharCode = str.charCodeAt(i + 1);
      // Check for low surrogate (0xDC00-0xDFFF)
      if (nextCharCode >= 0xDC00 && nextCharCode <= 0xDFFF) {
        // Valid surrogate pair - advance by 2 code units
        codePointCount++;
        i += 2;
        truncateAt = i;
        continue;
      }
    }

    // Regular character - advance by 1 code unit
    codePointCount++;
    i++;
    truncateAt = i;
  }

  // Check if we actually truncated
  if (truncateAt >= str.length) { return { result: str, wasTruncated: false }; }

  return { result: str.substring(0, truncateAt), wasTruncated: true };
}

/**
 * Truncates RSS input content to RSS_MAX_INPUT_CHARS before HTML processing.
 * Only applied when POST_FROM is "RSS" and RSS_MAX_INPUT_CHARS > 0.
 * Returns both truncated content and flag indicating if truncation occurred.
 * @param content - Raw RSS content string
 * @returns Object with truncated content and truncation flag
 */
function truncateRssInput(content: string): TruncateRssResult {
  if (SETTINGS.POST_FROM !== "RSS" || SETTINGS.RSS_MAX_INPUT_CHARS <= 0 || !content) { 
    return { content: content || "", wasTruncated: false }; 
  }

  // Use safe truncation to avoid breaking surrogate pairs
  var truncated = safeTruncate(content, SETTINGS.RSS_MAX_INPUT_CHARS);
  
  // Defensive check for compatibility
  if (!truncated || typeof truncated !== "object") {
    return { content: content, wasTruncated: false };
  }
  
  return {
    content: truncated.result || content,
    wasTruncated: truncated.wasTruncated || false
  };
}

/**
 * Validates and returns a string, or empty string if invalid.
 * Centralized type conversion to reduce code duplication.
 * @param value - The value to validate
 * @returns The string value or empty string
 */
function safeString(value: any): string { return (typeof value === "string") ? value : "";}

///////////////////////////////////////////////////////////////////////////////
// CONTENT VALIDATION AND FILTERING FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Enhanced function to check if the input string contains any banned content or matches complex rules.
 * Supports simple literals, regex patterns, AND/OR logical combinations via FilterRule system.
 * @param str - The input string to check (content, title, or URL)
 * @returns True if banned content is found, false otherwise
 */
function hasBannedContent(str: string): boolean {
  if (!str || !SETTINGS.PHRASES_BANNED || SETTINGS.PHRASES_BANNED.length === 0) { return false; } // Early exit if PHRASES_BANNED is empty or not defined.


  for (var i = 0; i < SETTINGS.PHRASES_BANNED.length; i++) {
    const rule = SETTINGS.PHRASES_BANNED[i];
    if (!rule) continue;
    if (matchesFilterRule(str, rule)) return true;
  }

  return false;
}

/**
 * Checks if the input string contains any of the mandatory keywords or matches complex rules.
 * Supports simple literals, regex patterns, AND/OR logical combinations via FilterRule system.
 * @param str - The input string to check (content or title)
 * @returns True if any rule matches (or no keywords defined), false otherwise
 */
function hasRequiredKeywords(str: string): boolean {
  if (!SETTINGS.PHRASES_REQUIRED || SETTINGS.PHRASES_REQUIRED.length === 0) { return true; } // Early exit if PHRASES_REQUIRED is empty or not defined.

  if (!str) return false;

  for (var i = 0; i < SETTINGS.PHRASES_REQUIRED.length; i++) {
    const rule = SETTINGS.PHRASES_REQUIRED[i];
    if (!rule) continue;
    if (matchesFilterRule(str, rule)) return true;
  }

  return false;
}

/**
 * Checks if the input string contains "http://" or "https://".
 * Uses centralized type checking.
 * @param str - The string to check
 * @returns True if a URL protocol is found, false otherwise.
 */
function hasUrl(str: string): boolean { return isValidString(str) && REGEX_PATTERNS.URL_PROTOCOL.test(str); }

/**
 * Helper function to determine if the string is effectively empty.
 * Checks if the string is null, undefined, empty, contains only white characters or is equal to "(none)".
 * @param str - The string to check
 * @returns True if the string is effectively empty, false otherwise
 */
function isEmpty(str: string): boolean { return !str || str === "(none)" || str.trim() === ""; }

/**
 * Checks if the post is a quote based on platform-specific indicators.
 * For BS: Checks for REGEX_PATTERNS.BS_QUOTE marker in content.
 * For TW: Checks if FirstLinkUrl points to another tweet (not media).
 * @param content - The content to check for BS quotes.
 * @param imageUrl - The first link URL to check for TW quotes (FirstLinkUrl).
 * @param platform - The platform identifier ("BS", "TW", "RSS", "YT").
 * @param author - The username of the current post author (for TW ownership check).
 * @returns True if the post is a quote, false otherwise.
 */
function isQuote(content: string, imageUrl: string, platform: string, author: string): boolean {
  if (platform === "BS") { return REGEX_PATTERNS.BS_QUOTE.test(content); }

  if (platform === "TW" && typeof imageUrl === "string") {
    const isStatus = REGEX_PATTERNS.TWEET_STATUS.test(imageUrl);
    if (!isStatus) return false;

    const isMedia = REGEX_PATTERNS.MEDIA_SUFFIX.test(imageUrl);
    if (isMedia) return false;

    const quotedUser = extractUsername(imageUrl);
    if (!quotedUser) return false;

    // Removed self-quote exclusion - now returns true for all quotes
    return true;
  }

  return false;
}

/**
 * Detects if the text is a reply starting with the user's name.
 * Excludes retweets (RT @username) from being detected as replies.
 * @param str - The text to check
 * @returns True if the text begins with a valid mention or "R to @", false otherwise
 */
function isReply(str: string): boolean {
  if (!str) return false;
  const trimmed = str.trim();
  if (REGEX_PATTERNS.RT_PREFIX.test(trimmed)) return false;
  return REGEX_PATTERNS.REPLY_START.test(trimmed);
}

/**
 * Checks if the input string starts with the standard Twitter "RT @" prefix.
 * @param str - The string to check
 * @returns True if it's a retweet, false otherwise.
 */
function isRepost(str: string): boolean { return str ? REGEX_PATTERNS.REPOST_PREFIX.test(str) : false; }

/**
 * Checks if a string represents a self-repost (retweeting one's own content).
 * Uses escapeRegExp to safely compare the authorName.
 * @param str - The input string (usually entryTitle for Twitter).
 * @param author - The username of the author performing the action (e.g., "username" or "@username").
 * @returns True if it's a self-repost, false otherwise.
 */
function isSelfRepost(str: string, author: string): boolean {
  if (!str || !author) return false;
  const name = author.startsWith("@") ? author.substring(1) : author;
  const escapedName = escapeRegExp(name);
  const regex = getCachedRegex("^RT @" + escapedName + ": ", "i");
  return regex.test(str);
}

/**
 * Validates if the input string represents a usable image URL.
 * Excludes known placeholder URLs and specific Twitter media page links (/photo/1, /video/1).
 * Uses centralized type checking.
 * @param str - The string to validate
 * @returns True if it seems like a valid and desired image URL, false otherwise.
 */
function isValidImageUrl(str: string): boolean {
  if (!isValidString(str) || str === "https://ifttt.com/images/no_image_card.png") { return false; }
  if (str.endsWith("/photo/1") || str.endsWith("/video/1")) { return false; }
  return REGEX_PATTERNS.URL_PROTOCOL.test(str);
}

/**
 * Universal function to check if a string matches a filter rule.
 * Supports simple literal strings, regex patterns, AND/OR logical combinations.
 * Used by both hasBannedContent() and hasRequiredKeywords() for consistent filtering logic.
 * @param str - The input string to check (case insensitive for literal/and/or)
 * @param rule - Filter rule (string literal or FilterRule object)
 * @returns True if the rule matches, false otherwise
 */
function matchesFilterRule(str: string, rule: string | FilterRule): boolean {
  if (!str) return false;
  const lowerStr = str.toLowerCase();

  if (typeof rule === "string") { return lowerStr.indexOf(rule.toLowerCase()) !== -1; }

  if (typeof rule !== "object") return false;

  switch (rule.type) {
    case "literal":
      if (!rule.pattern) return false;
      return lowerStr.indexOf(rule.pattern.toLowerCase()) !== -1;

    case "regex":
      if (!rule.pattern) return false;
      try {
        const regex = new RegExp(rule.pattern, rule.flags || "i");
        return regex.test(str);
      } catch (e) { return false; }

    case "and":
      if (!rule.keywords || rule.keywords.length === 0) return false;
      for (var i = 0; i < rule.keywords.length; i++) { if (lowerStr.indexOf(rule.keywords[i].toLowerCase()) === -1) { return false; } }
      return true;

    case "or":
      if (!rule.keywords || rule.keywords.length === 0) return false;
      for (var i = 0; i < rule.keywords.length; i++) { if (lowerStr.indexOf(rule.keywords[i].toLowerCase()) !== -1) { return true; } }
      return false;
  }

  return false;
}

///////////////////////////////////////////////////////////////////////////////
// TEXT PROCESSING AND NORMALIZATION FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Applies custom regex replacements defined in SETTINGS.CONTENT_REPLACEMENTS.
 * Uses cached RegExp objects for performance optimization.
 * @param str - The string to process
 * @returns The string after applying all defined hacks.
 */
function applyContentHacks(str: string): string {
  if (!str) return "";

  const patterns = SETTINGS.CONTENT_REPLACEMENTS;
  if (!patterns || patterns.length === 0) return str;

  var result = str;
  for (var i = 0; i < patterns.length; i++) {
    const hack = patterns[i];
    try {
      const pattern = hack.literal ? escapeRegExp(hack.pattern) : hack.pattern;
      const flags = (hack.flags || "gi").replace(/[^gimuy]/g, "");
      const regex = getCachedRegex(pattern, flags);
      result = result.replace(regex, hack.replacement);
    } catch (e) { continue; }
  }

  return result;
}

/**
 * Decodes numeric HTML entities (decimal and hex) to their corresponding characters.
 * Handles Unicode characters outside BMP (like emoji) using surrogate pairs for ES5 compatibility.
 * Early exits if no numeric entities detected for performance optimization.
 * @param str - The string to decode
 * @returns The string with numeric entities decoded to Unicode characters
 */
function decodeNumericEntities(str: string): string {
  if (!str || str.indexOf("&#") === -1) return str;
  
  // Decode decimal entities: &#127758; &#233; etc.
  str = str.replace(/&#(\d+);/g, function(match: string, dec: string): string {
    var codePoint = parseInt(dec, 10);
    
    // For characters outside BMP (> 0xFFFF), use surrogate pair -  Emoji like 🌎 (U+1F30E = 127758) need this
    if (codePoint > 0xFFFF) {
      codePoint -= 0x10000;
      return String.fromCharCode(
        0xD800 + (codePoint >> 10),     // High surrogate
        0xDC00 + (codePoint & 0x3FF)    // Low surrogate
      );
    }
    
    return String.fromCharCode(codePoint);
  });
  
  // Decode hexadecimal entities: &#x1F30E; &#xE9; &#XE9; etc.
  str = str.replace(/&#x([0-9a-fA-F]+);/gi, function(match: string, hex: string): string {
    var codePoint = parseInt(hex, 16);
    
    // For characters outside BMP (> 0xFFFF), use surrogate pair
    if (codePoint > 0xFFFF) {
      codePoint -= 0x10000;
      return String.fromCharCode(
        0xD800 + (codePoint >> 10),     // High surrogate
        0xDC00 + (codePoint & 0x3FF)    // Low surrogate
      );
    }
    
    return String.fromCharCode(codePoint);
  });
  
  return str;
}

/**
 * Moves the first detected URL (http/https) in a string to the end.
 * If no URL is found, returns the original string.
 * @param str - The string to process
 * @returns The string with the first URL moved to the end, or the original string.
 */
function moveUrlToEnd(str: string): string {
  if (!str) return "";

  const match = str.match(REGEX_PATTERNS.URL_MATCH);
  if (!match || !match[0]) return str;

  const url = match[0];
  const withoutUrl = str.replace(url, "").trim();
  return withoutUrl ? withoutUrl + " " + url : url;
}

/**
 * Normalizes a string by removing most HTML tags, converting line breaks,
 * replacing special character entities/codes, and normalizing whitespace.
 * 
 * Numeric entities (&#xxx;, &#xHH;) are decoded FIRST via decodeNumericEntities()
 * Then named entities are processed via CHAR_MAP
 * This order ensures emoji and Unicode work correctly (fixes ⅋#127758; → 🌎)
 * 
 * Uses lazy character map application - only processes entities if detected.
 * Uses pre-built CHAR_MAP for fast character replacement (single pass through tokens).
 * @param str - The string to normalize
 * @returns The normalized string.
 */
function normalizeHtml(str: string): string {
  if (!str) return "";

  const TEMP_NEWLINE = "TEMP_NL_MARKER";

  // Single-pass HTML cleanup
  str = str.replace(REGEX_PATTERNS.HTML_CLEANUP, function(match: string, lineBreak: string, tag2: string, headingTag: string, otherTag: string, newline: string): string {
    if (lineBreak) return "\n"; // <br>, </p> → jeden newline
    if (headingTag) return "\n\n"; // <h1-6>, </h1-6> → dva newlines
    if (otherTag) return ""; // ostatní tagy → smazat
    if (newline) return TEMP_NEWLINE;
    return match;
  });

  // Protect plus signs during entity processing
  str = str.replace(/\+/g, "\uFE63");

  // OPTIMIZATION: Only apply entity processing if entities are detected
  if (str.indexOf('&') !== -1 || str.indexOf('&#') !== -1) {
    // v3.0.1: Decode numeric entities FIRST (before CHAR_MAP)
    // This fixes emoji/Unicode issues: &#127758; → 🌎 (not ⅋#127758;)
    str = decodeNumericEntities(str);
    
    // Then apply static CHAR_MAP for named entities
    const tokens = Object.keys(CHAR_MAP);
    for (var i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (str.indexOf(token) !== -1) { str = str.split(token).join(CHAR_MAP[token]); }
    }
  }

  // Restore temporary newline markers
  str = str.split(TEMP_NEWLINE).join("\n");

  // Normalize ellipsis and whitespace
  str = str.replace(REGEX_PATTERNS.ELLIPSIS_NORMALIZE, "\u2026");
  str = str.replace(REGEX_PATTERNS.WHITESPACE, function(match: string, eolGroup: string): string { return eolGroup ? "\n\n" : " "; });

  return str.trim();
}

/**
 * Replaces ampersands in text with a specified replacement character,
 * while preserving URLs by encoding them appropriately.
 * URLs in SETTINGS.URL_NO_TRIM_DOMAINS are only URL-encoded (ampersands become %26).
 * Other URLs are trimmed (query string removed) and then URL-encoded.
 * @param str - The string to process
 * @returns The string with ampersands processed.
 */
function processAmpersands(str: string): string {
  if (!str) return "";

  return str.replace(REGEX_PATTERNS.URL_IN_WORD, function(word: string): string {
    if (!hasUrl(word)) return word;

    const isExcluded = SETTINGS.URL_NO_TRIM_DOMAINS.some(function(domain: string): boolean { return word.toLowerCase().indexOf(domain.toLowerCase()) !== -1; });

    if (isExcluded) { return word.replace(/&/g, "%26"); }

    return encodeURI(trimUrlQuery(word));
  });
}

/**
 * Trims content to POST_LENGTH with intelligent ellipsis handling.
 * Normalizes existing ellipses and adds them when needed based on terminators.
 * Supports three strategies: sentence (preserve last sentence), word (cut at word boundary), 
 * and smart (hybrid approach with SMART_TOLERANCE_PERCENT).
 * Also adds ellipsis if content was pre-truncated at RSS input stage.
 * @param str - Input string to process
 * @param wasPreTruncated - Flag indicating if content was truncated before HTML processing (from truncateRssInput)
 * @returns Object with modified content and flag indicating if ellipsis was added
 */
function trimContent(str: string, wasPreTruncated: boolean): TrimResult {
  if (!str) return { content: "", needsEllipsis: false };

  str = str.trim();
  if (!str) return { content: "", needsEllipsis: false };

  // Normalize ellipsis characters
  str = str.replace(REGEX_PATTERNS.ELLIPSIS_NORMALIZE, "\u2026");
  str = str.replace(REGEX_PATTERNS.ELLIPSIS_MULTI, "\u2026");

  var needsEllipsis = wasPreTruncated; // Start with pre-truncation flag

  // Twitter-specific ellipsis logic for near-limit content
  if (SETTINGS.POST_FROM === "TW") {
    str = str.replace(REGEX_PATTERNS.SPACE_BEFORE_URL, " ");
    const threshold = Math.min(257, SETTINGS.POST_LENGTH - 30);

    const hasTerminator = REGEX_PATTERNS.URL_TERMINATOR.test(str) ||
      REGEX_PATTERNS.EMOJI.test(str.slice(-4)) ||
      REGEX_PATTERNS.TERMINATOR_CHECK.test(str) ||
      /\s>>$/.test(str);

    if (str.length >= threshold && str.length <= SETTINGS.POST_LENGTH && !hasTerminator) {
      str += "\u2026";
      needsEllipsis = true;
    }
  }

  // Trim content if it exceeds POST_LENGTH
  if (str.length > SETTINGS.POST_LENGTH) {
    if (SETTINGS.POST_LENGTH_TRIM_STRATEGY === "sentence") {
      const lastPeriod = str.slice(0, SETTINGS.POST_LENGTH).lastIndexOf(".");
      if (lastPeriod > 0) {
        str = str.slice(0, lastPeriod + 1);
        if (str.endsWith(". ") || str.endsWith(".\t") || str.endsWith(".\n")) { str = str.trim(); }
        needsEllipsis = false;
      } else {
        const lastSpace = str.slice(0, SETTINGS.POST_LENGTH - 1).lastIndexOf(" ");
        str = lastSpace > 0 ? str.slice(0, lastSpace) : str.slice(0, SETTINGS.POST_LENGTH - 1);
        needsEllipsis = true;
      }
    } else if (SETTINGS.POST_LENGTH_TRIM_STRATEGY === "smart") {
      const toleranceChars = Math.floor(SETTINGS.POST_LENGTH * (SETTINGS.SMART_TOLERANCE_PERCENT || 12) / 100);
      const minAcceptable = SETTINGS.POST_LENGTH - toleranceChars;

      const lastPeriod = str.slice(0, SETTINGS.POST_LENGTH).lastIndexOf(".");
      if (lastPeriod > 0) {
        const sentenceLen = lastPeriod + 1;
        if (sentenceLen >= minAcceptable) {
          str = str.slice(0, lastPeriod + 1);
          if (str.endsWith(". ") || str.endsWith(".\t") || str.endsWith(".\n")) { str = str.trim(); }
          needsEllipsis = false;
        } else {
          const lastSpace = str.slice(0, SETTINGS.POST_LENGTH - 1).lastIndexOf(" ");
          str = lastSpace > 0 ? str.slice(0, lastSpace) : str.slice(0, SETTINGS.POST_LENGTH - 1);
          needsEllipsis = true;
        }
      } else {
        const lastSpace = str.slice(0, SETTINGS.POST_LENGTH - 1).lastIndexOf(" ");
        str = lastSpace > 0 ? str.slice(0, lastSpace) : str.slice(0, SETTINGS.POST_LENGTH - 1);
        needsEllipsis = true;
      }
    } else {
      const lastSpace = str.slice(0, SETTINGS.POST_LENGTH - 1).lastIndexOf(" ");
      str = lastSpace > 0 ? str.slice(0, lastSpace) : str.slice(0, SETTINGS.POST_LENGTH - 1);
      needsEllipsis = true;
    }
  }

  // Add ellipsis when needed (based on needsEllipsis flag)
  if (SETTINGS.POST_FROM !== "TW" && needsEllipsis) {
    const hasSimpleTerminator = REGEX_PATTERNS.TERMINATOR_CHECK.test(str);
    if (!hasSimpleTerminator && !str.endsWith("\u2026")) { str += "\u2026"; }
  }

  return { content: str, needsEllipsis: needsEllipsis };
}

/**
 * Trims query parameters from URLs by removing everything after the '?' character.
 * Returns the URL without the query string, or the original string if '?' is not found.
 * @param url - The URL to trim
 * @returns The URL without the query string.
 */
function trimUrlQuery(url: string): string {
  if (!url) return "";
  const qIndex = url.indexOf("?");
  return qIndex === -1 ? url : url.substring(0, qIndex);
}

///////////////////////////////////////////////////////////////////////////////
// EXTRACTION FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Extracts the real author name from the TweetEmbedCode (entryContent).
 * Looks for pattern: &mdash; Real Name (@username)
 * Returns an empty string if it cannot be found.
 * @param embedCode - The HTML embed code from Twitter
 * @returns Real author name or empty string
 */
function extractRealName(embedCode: string): string {
  if (!embedCode) return "";
  try {
    const match = embedCode.match(REGEX_PATTERNS.REAL_NAME);
    return match && match[1] ? match[1].trim() : "";
  } catch (e) { return ""; }
}

/**
 * Extracts the first Twitter URL found within an href attribute in an HTML string.
 * Primarily used for finding the original tweet URL within Twitter's RT structure.
 * @param str - The HTML string to search
 * @returns The extracted Twitter URL, or empty string if not found.
 */
function extractRepostUrl(str: string): string {
  if (!str) return "";
  REGEX_PATTERNS.REPOST_URL.lastIndex = 0;
  const match = REGEX_PATTERNS.REPOST_URL.exec(str);
  return match && match[1] ? match[1] : "";
}

/**
 * Extracts the @username of the user being retweeted from a string starting with "RT @...".
 * @param str - The string to search (usually entryTitle)
 * @returns The extracted @username (e.g., "@originalAuthor"), or an empty string if not found.
 */
function extractRepostUser(str: string): string {
  if (!str) return "";
  REGEX_PATTERNS.REPOST_USER.lastIndex = 0;
  const match = REGEX_PATTERNS.REPOST_USER.exec(str);
  return match && match[1] ? match[1] : "";
}

/**
 * Extracts the tweet text from the <p> tag in TweetEmbedCode (entryContent).
 * If not found, returns an empty string.
 * @param embedCode - The HTML embed code from Twitter
 * @returns Tweet text or empty string
 */
function extractTweetText(embedCode: string): string {
  if (!embedCode) return "";
  try {
    const match = embedCode.match(REGEX_PATTERNS.TWEET_TEXT);
    return match && match[1] ? match[1].trim() : "";
  } catch (e) { return ""; }
}

/**
 * Extracts the username from a Twitter status URL.
 * Example: https://twitter.com/username/status/123456 -> "username"
 * @param url - The Twitter status URL
 * @returns The extracted username or an empty string if not found.
 */
function extractUsername(url: string): string {
  if (!url) return "";
  const match = url.match(REGEX_PATTERNS.USERNAME_EXTRACT);
  return match && match[1] ? match[1] : "";
}

///////////////////////////////////////////////////////////////////////////////
// FORMATTING FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Formats @username mentions within a string based on platform-specific settings
 * defined in SETTINGS.MENTION_FORMATTING. Adds a prefix or suffix, or leaves
 * the mention unchanged. Skips formatting for the specified 'skipName'.
 * Uses escapeRegExp for safe regex construction.
 * @param str - The input string containing potential mentions.
 * @param skipName - The username (including '@' if applicable) of the author to skip formatting for.
 * @param platform - The identifier of the source platform ("TW", "BS", "RSS", etc.).
 * @returns The string with mentions formatted according to the rules.
 */
function formatMentions(str: string, skipName: string, platform: string): string {
  if (!str) return "";

  const format = SETTINGS.MENTION_FORMATTING[platform] || SETTINGS.MENTION_FORMATTING["DEFAULT"] || { type: "none", value: "" };

  if (format.type === "none" || !format.value) return str;

  const skipClean = skipName ? (skipName.startsWith("@") ? skipName.substring(1) : skipName) : "";

  var pattern = "(?<![a-zA-Z0-9@])@";
  if (skipClean) { pattern += "(?!(?:" + escapeRegExp(skipClean) + ")\\b)"; }
  pattern += "([a-zA-Z0-9_.]+)\\b";

  try {
    const regex = getCachedRegex(pattern, "gi");
    return str.replace(regex, function(match: string, username: string): string {
      if (format.type === "prefix") { return format.value + username; }
      return match + format.value;
    });
  } catch (e) { return str; }
}

/**
 * Formats a quote post by adding author attribution.
 * For BS: Removes the quote marker and adds author prefix.
 * For TW: Extracts quoted author username from URL and adds attribution.
 * CHANGED: Self-quotes now show PREFIX_SELF_REFERENCE instead of @username.
 * FIXED: Uses authorUsername for comparison to handle SHOW_REAL_NAME correctly.
 * @param content - The content string.
 * @param author - The display name of the author quoting the post (for output).
 * @param authorUsername - The username of the author (for comparison).
 * @param platform - The platform identifier ("BS", "TW", etc.).
 * @param quotedUrl - The URL of the quoted post (used for TW to extract quoted author).
 * @returns The formatted quote string.
 */
function formatQuote(content: string, author: string, authorUsername: string, platform: string, quotedUrl: string): string {
  if (platform === "BS") {
    const cleaned = content.replace(REGEX_PATTERNS.BS_QUOTE, "").trim();
    return cleaned ? author + SETTINGS.PREFIX_QUOTE + ":\n" + cleaned : content;
  }

  if (platform === "TW" && typeof quotedUrl === "string" && REGEX_PATTERNS.TWEET_STATUS.test(quotedUrl)) {
    const username = extractUsername(quotedUrl);
    
    // Use authorUsername (not author) for comparison to handle real names correctly
    const currentUser = authorUsername.startsWith("@") ? authorUsername.substring(1) : authorUsername;
    const isSelf = username && username.toLowerCase() === currentUser.toLowerCase();
    
    const mention = isSelf ? SETTINGS.PREFIX_SELF_REFERENCE : (username ? "@" + username : "");
    
    return author + SETTINGS.PREFIX_QUOTE + mention + ":\n" + content;
  }

  return content;
}

/**
 * Formats a retweet string by replacing the "RT @username: " prefix with custom attribution.
 * Self-reposts now show PREFIX_SELF_REFERENCE instead of @username.
 * Uses authorUsername for comparison to handle SHOW_REAL_NAME correctly.
 * @param content - The content string.
 * @param author - The display name of the person retweeting (for output).
 * @param authorUsername - The username of the person retweeting (for comparison).
 * @param repostedUser - The @username of the original author being retweeted.
 * @returns The formatted retweet string.
 */
function formatRepost(content: string, author: string, authorUsername: string, repostedUser: string): string {
  // Use authorUsername (not author) for comparison to handle real names correctly
  const currentUser = authorUsername.startsWith("@") ? authorUsername.substring(1) : authorUsername;
  const repostedClean = repostedUser.startsWith("@") ? repostedUser.substring(1) : repostedUser;
  const isSelf = repostedClean.toLowerCase() === currentUser.toLowerCase();

  const mention = isSelf ? SETTINGS.PREFIX_SELF_REFERENCE : repostedUser;

  return content.replace(REGEX_PATTERNS.REPOST_PREFIX, author + SETTINGS.PREFIX_REPOST + mention + ":\n");
}

/**
 * Removes the "R to @username: " prefix if present at the beginning of a string.
 * @param str - The string to process
 * @returns The string with the prefix removed, or the original string if not found.
 */
function removeReplyPrefix(str: string): string { return str.replace(REGEX_PATTERNS.RESPONSE_PREFIX, ""); }

///////////////////////////////////////////////////////////////////////////////
// CONTENT SELECTION AND COMPOSITION FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Compose final content by running processContent and
 * applying username formatting before returning.
 * Handles RSS input truncation and passes truncation flag through processing chain.
 * @param title - The entry title
 * @param author - The entry author username
 * @param feedTitle - The feed title
 * @param rawContent - The raw entry content
 * @param imageUrl - The first image URL
 * @returns Final processed content string
 */
function composeContent(title: string, author: string, feedTitle: string, rawContent: any, imageUrl: string): string {
  const platform = SETTINGS.POST_FROM;

  // Truncate RSS input if needed (before any processing)
  var wasRssTruncated = false;
  if (platform === "RSS") {
    const truncResult = truncateRssInput(rawContent);
    rawContent = truncResult.content;
    wasRssTruncated = truncResult.wasTruncated;
  }

  const trimmedTitle = (title || "").trim();
  const trimmedFeed = (feedTitle || "").trim();

  if (isEmpty(rawContent) && isEmpty(trimmedTitle)) { return ""; }

  const processed = processContent(rawContent, trimmedTitle, trimmedFeed, imageUrl, author, wasRssTruncated);

  if (processed.userNameToSkip) { return formatMentions(processed.content, processed.userNameToSkip, SETTINGS.POST_FROM); }

  return processed.content;
}

/**
 * Composes the final status string including processed content, optional image URL,
 * and optional post URL, based on settings and platform logic.
 * Handles content trimming and URL selection/formatting.
 * @param content - The processed content from composeContent.
 * @param entryUrl - The original post/item URL.
 * @param imageUrl - The original image URL.
 * @param title - The original title (used for repost detection).
 * @param author - The original author username (used for checking own reposts).
 * @param wasRssTruncated - Flag indicating if RSS content was pre-truncated
 * @returns The final status string ready to be sent.
 */
function composeStatus(content: string, entryUrl: string, imageUrl: string, title: string, author: string, wasRssTruncated: boolean): string {
  content = content || "";

  const status = processStatus(content, entryUrl, imageUrl, title, author, wasRssTruncated);

  const resultImageUrl = typeof imageUrl === "string" ? processUrl(imageUrl) : "";
  const imageStatus = (isValidImageUrl(imageUrl) && SETTINGS.SHOW_IMAGEURL) ? SETTINGS.PREFIX_IMAGE_URL + resultImageUrl : "";
  const finalUrl = (status.urlToShow && typeof status.urlToShow === "string") ? SETTINGS.PREFIX_POST_URL + processUrl(status.urlToShow) : "";

  return status.trimmedContent + imageStatus + finalUrl;
}

/**
 * Process raw entry content according to platform-specific rules,
 * clean up HTML/entities, apply hacks, move URL if needed,
 * handle replies/retweets/quotes, and return structured result.
 * Uses centralized getPlatformConfig function.
 * @param rawContent - Raw HTML embed or content string
 * @param title - Fallback text title
 * @param feedTitle - Feed author/title string
 * @param imageUrl - First image URL from the entry (FirstLinkUrl)
 * @param author - The username of the post author (for quote ownership check)
 * @param wasRssTruncated - Flag indicating if RSS content was pre-truncated
 * @returns Object with processed content and metadata
 */
function processContent(rawContent: any, title: string, feedTitle: string, imageUrl: string, author: string, wasRssTruncated: boolean): ProcessedContent {
  const platform = SETTINGS.POST_FROM;
  const config = getPlatformConfig(platform);

  const trimmedTitle = (title || "").trim();
  const trimmedFeed = (feedTitle || "").trim();

  var content = "";
  var feedAuthor = "";
  var feedUsername = "";
  var skipName = "";

  // Platform-specific author extraction
  if (platform === "BS") {
    const sep = trimmedFeed.indexOf(" - ");
    feedUsername = sep !== -1 ? trimmedFeed.substring(0, sep) : trimmedFeed;
    const realName = sep !== -1 ? trimmedFeed.substring(sep + 3) : trimmedFeed;
    feedAuthor = SETTINGS.SHOW_REAL_NAME ? realName : feedUsername;
    skipName = feedUsername;
  } else if (platform === "TW") {
    feedUsername = trimmedFeed;
    const realName = extractRealName(rawContent) || feedUsername;
    feedAuthor = SETTINGS.SHOW_REAL_NAME ? realName : feedUsername;
    skipName = feedUsername;
  } else {
    skipName = "(none)";
  }

  // Content extraction based on platform config
  if (config.useParsedText) {
    content = extractTweetText(rawContent) || trimmedTitle;
  } else if (config.useGetContent) {
    content = selectContent(rawContent, trimmedTitle);
  } else {
    content = trimmedTitle;
  }

  // Apply normalization and processing
  content = normalizeHtml(content);
  content = processAmpersands(content);
  content = applyContentHacks(content);

  // Platform-specific content modifications
  if (config.applyMoveUrlToEnd) { content = moveUrlToEnd(content); }

  if (config.handleReplies) { content = removeReplyPrefix(content); }

  if (config.handleRetweets && isRepost(trimmedTitle)) {
    const repostedUser = extractRepostUser(trimmedTitle);
    content = formatRepost(content, feedAuthor, feedUsername, repostedUser); // Pass feedUsername as third parameter for correct self-detection
  }

  if (config.handleQuotes && isQuote(content, imageUrl, platform, author)) { content = formatQuote(content, feedAuthor, feedUsername, platform, imageUrl); } // Already passing feedUsername correctly

  return {
    content: content,
    feedAuthor: feedAuthor,
    userNameToSkip: skipName
  };
}

/**
 * Processes and formats status content for a post, including platform-specific logic,
 * content trimming, and selection of the appropriate URL to display.
 * Passes RSS truncation flag to trimContent for proper ellipsis handling.
 * Quote tweets prefer entryUrl (own tweet) over imageUrl (quoted tweet).
 * @param content - The main content to process.
 * @param entryUrl - The canonical URL of the entry.
 * @param imageUrl - The image URL associated with the entry (FirstLinkUrl).
 * @param title - The title of the entry (for repost detection).
 * @param author - The author of the entry (for ownership checks).
 * @param wasRssTruncated - Flag indicating if RSS content was pre-truncated
 * @returns An object containing the trimmed content, ellipsis flag, and selected URL.
 */
function processStatus(content: string, entryUrl: string, imageUrl: string, title: string, author: string, wasRssTruncated: boolean): ProcessedStatus {
  const platform = SETTINGS.POST_FROM;

  // Detect if this is a quote tweet BEFORE any content modifications
  const isQuoteTweet = isQuote(content, imageUrl, platform, author);

  // Remove t.co URLs for Twitter
  if (platform === "TW") { content = content.replace(REGEX_PATTERNS.TCO_URL, ""); }

  // Trim content to POST_LENGTH (pass RSS truncation flag)
  const trimmed = trimContent(content, wasRssTruncated);
  var trimmedContent = trimmed.content;
  var needsEllipsis = trimmed.needsEllipsis;

  // Determine if URL should be shown
  var showUrl = SETTINGS.FORCE_SHOW_ORIGIN_POSTURL || needsEllipsis;

  if (platform === "BS") { showUrl = showUrl || isQuote(content, "", "BS", ""); }

  if (platform === "TW") {
    const isMedia = typeof imageUrl === "string" && (imageUrl.endsWith("/photo/1") || imageUrl.endsWith("/video/1"));
    const isExtRepost = isRepost(title) && !isSelfRepost(title, author) && SETTINGS.REPOST_ALLOWED;
    const hasRepostUrl = extractRepostUrl(content) !== "";

    if (!hasUrl(content) && !isMedia) { showUrl = true; }
    showUrl = showUrl || hasRepostUrl || isExtRepost || isMedia;
  }

  // Select the appropriate URL to display
  var urlToShow = "";
  if (platform === "TW") {
    const contentHasUrl = hasUrl(trimmedContent);
    const hasImage = isValidImageUrl(imageUrl);

    if (showUrl || contentHasUrl) {
      // For quote tweets, always use entryUrl (own tweet) instead of imageUrl (quoted tweet)
      if (isQuoteTweet) {
        urlToShow = entryUrl;
      } else {
        // Original logic for non-quote tweets
        urlToShow = contentHasUrl ? (hasImage ? imageUrl : entryUrl) : (hasImage ? imageUrl : entryUrl);
      }

      urlToShow = processUrl(urlToShow);
      if (!urlToShow) { urlToShow = SETTINGS.FORCE_SHOW_FEEDURL ? feedUrl : ""; }
    }
  } else {
    const hasValid = typeof entryUrl === "string" && entryUrl !== "(none)";
    if (showUrl && hasValid) { urlToShow = processUrl(entryUrl); }
  }

  return { trimmedContent: trimmedContent, needsEllipsis: needsEllipsis, urlToShow: urlToShow };
}

/**
 * Centralized URL processing utility replaces URL_REPLACE_FROM → URL_REPLACE_TO (e.g. x.com → twitter.com) 
 * and applies URL processing via processAmpersands() (trim query, encode, handle ampersands).
 * Uses centralized type checking.
 * @param url - The URL to process
 * @returns The fully processed URL, or an empty string if invalid.
 */
function processUrl(url: string): string {
  url = safeString(url);
  if (!url || url === "(none)") return "";
  
  // Remove white characters from the beginning and end of the URL
  url = url.trim();

  if (SETTINGS.URL_REPLACE_FROM) {
    const pattern = escapeRegExp(SETTINGS.URL_REPLACE_FROM);
    if (pattern) { url = url.replace(getCachedRegex(pattern, "gi"), SETTINGS.URL_REPLACE_TO); }
  }

  return processAmpersands(url);
}

/**
 * Retrieves the primary content source, prioritizing title if SHOW_TITLE_AS_CONTENT is true,
 * otherwise using content (with title as fallback for empty content).
 * @param content - The entryContent value
 * @param title - The entryTitle value
 * @returns The selected content string, or an empty string if both are effectively empty.
 */
function selectContent(content: any, title: any): string {
  if (SETTINGS.SHOW_TITLE_AS_CONTENT) { return title || ""; }
  const contentEmpty = typeof content !== "string" || isEmpty(content);
  return contentEmpty ? (title || "") : content;
}

/**
 * Determines whether a post should be skipped based on various conditions.
 * Returns an object with skip status and reason.
 * Early exits and reduced redundant checks.
 * @param content - The entry content
 * @param title - The entry title
 * @param url - The entry URL
 * @param imageUrl - The entry image URL
 * @param author - The entry author username
 * @returns Object with { skip: boolean, reason: string }
 */
function shouldSkip(content: any, title: string, url: string, imageUrl: string, author: string): { skip: boolean;reason: string } {
  // Check for empty content
  if (isEmpty(content) && isEmpty(title) && isEmpty(url)) { return { skip: true, reason: "Empty content, title and URL" }; }
  
  // Check for external reposts
  if (isRepost(title) && !isSelfRepost(title, author) && !SETTINGS.REPOST_ALLOWED) { return { skip: true, reason: "External repost not allowed" }; }

  // Single banned content check with early exit
  if (SETTINGS.PHRASES_BANNED && SETTINGS.PHRASES_BANNED.length > 0) {
    if (hasBannedContent(title) || hasBannedContent(content) || hasBannedContent(url) || hasBannedContent(imageUrl)) { return { skip: true, reason: "Contains banned phrases" }; }
  }

  // Single mandatory keywords check with early exit
  if (SETTINGS.PHRASES_REQUIRED && SETTINGS.PHRASES_REQUIRED.length > 0) {
    if (!hasRequiredKeywords(title) && !hasRequiredKeywords(content)) { return { skip: true, reason: "Missing mandatory keywords" }; }
  }

  // Check for reply posts
  if (isReply(title) || isReply(content)) { return { skip: true, reason: "Reply post (starts with @username)" }; }

  return { skip: false, reason: "" };
}

///////////////////////////////////////////////////////////////////////////////
// MAIN EXECUTION LOGIC
///////////////////////////////////////////////////////////////////////////////

// Check if the post should be skipped based on the defined rules
const skipCheck = shouldSkip(entryContent, entryTitle, entryUrl, entryImageUrl, entryAuthor);

if (skipCheck.skip) {
  // If skip conditions are met, instruct IFTTT to skip this run
  MakerWebhooks.makeWebRequest.skip("Skipped due to filter rules: " + skipCheck.reason);
} else {
  // If not skipped, proceed to compose the final content and status for the IFTTT webhook action
  const finalContent = composeContent(entryTitle, entryAuthor, feedTitle, entryContent, entryImageUrl);
  // Pass RSS truncation flag through to composeStatus - note: this requires tracking it from composeContent
  // For now, we recalculate it here as composeContent doesn't return it
  const platform = SETTINGS.POST_FROM;
  var wasRssTruncated = false;
  if (platform === "RSS" && SETTINGS.RSS_MAX_INPUT_CHARS > 0 && entryContent && entryContent.length > SETTINGS.RSS_MAX_INPUT_CHARS) { wasRssTruncated = true; }
  const finalStatus = composeStatus(finalContent, entryUrl, entryImageUrl, entryTitle, entryAuthor, wasRssTruncated);
  MakerWebhooks.makeWebRequest.setBody("status=" + finalStatus);
}