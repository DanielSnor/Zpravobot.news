///////////////////////////////////////////////////////////////////////////////
// IFTTT 𝕏 webhook settings - World Wombat Day, Oct 22nd, 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// Configuration settings for the IFTTT webhook filter.
// These settings define content rules, platform-specific behavior, and formatting options.
//
///////////////////////////////////////////////////////////////////////////////

// Application settings definition
interface AppSettings {
  // CONTENT FILTERING & VALIDATION
  PHRASES_BANNED: (string | FilterRule)[]; // List of phrases or filter rules that indicate banned content. Posts containing these will be skipped. Supports literal strings, regex patterns, and logical combinations (and/or).
  PHRASES_REQUIRED: (string | FilterRule)[]; // List of keywords or filter rules that must appear in the post content or title for it to be published. Supports literal strings, regex patterns, and logical combinations (and/or).
  REPOST_ALLOWED: boolean; // Whether reposts (retweets) are allowed to be published.

  // CONTENT PROCESSING & TRANSFORMATION
  AMPERSAND_SAFE_CHAR: string; // Character used to replace ampersands (&) in text to avoid encoding issues.
  CONTENT_REPLACEMENTS: { pattern: string;replacement: string;flags ? : string;literal ? : boolean } []; // Array of regex patterns and replacements for manipulating post content (e.g., fixing URLs or removing unwanted text).
  POST_LENGTH: number; // Maximum post length (0-500 chars) after processing.
  POST_LENGTH_TRIM_STRATEGY: "sentence" | "word" | "smart"; // Strategy for truncation: word cut, sentence preservation, or smart hybrid approach with tolerance.
  SMART_TOLERANCE_PERCENT: number; // For smart trim strategy: percentage of POST_LENGTH that can be "wasted" to preserve sentence boundaries (5-25, recommended 12).

  // URL CONFIGURATION
  URL_REPLACE_FROM: string | string[]; // Original post URL base string(s) to be replaced. Can be single domain (e.g., "https://x.com/") or array of domains (e.g., ["https://x.com/", "https://twitter.com/"]). Use escapeRegExp with this.
  URL_REPLACE_TO: string; // Target post URL base string for replacement (e.g., "https://twitter.com/").
  URL_NO_TRIM_DOMAINS: string[]; // URLs that should NOT be trimmed by trimUrlQuery, but should still be URL-encoded in processAmpersands.
  URL_DOMAIN_FIXES: string[]; // A list of domains (e.g. "rspkt.cz", "example.com") to add the https:// protocol to, if missing.
  FORCE_SHOW_ORIGIN_POSTURL: boolean; // If true, always include the original post URL in the output, regardless of other conditions. Works in conjunction with other URL display logic.
  FORCE_SHOW_FEEDURL: boolean; // If true, show the feed's URL instead of the specific post's URL as a fallback when URL processing yields empty string.
  SHOW_IMAGEURL: boolean; // If true, include image URLs in the post output (using PREFIX_IMAGE_URL).

  // OUTPUT FORMATTING & PREFIXES
  PREFIX_REPOST: string; // Prefix used when formatting a repost (retweet).
  PREFIX_QUOTE: string; // Prefix used when formatting a quote post (mainly for Bluesky and Twitter).
  PREFIX_IMAGE_URL: string; // Prefix added before the image URL when included.
  PREFIX_POST_URL: string; // Prefix/suffix formatting added before/after the final post URL.
  PREFIX_SELF_REFERENCE: string; // Text pro self-quotes a self-reposts (např. "svůj příspěvek")
  MENTION_FORMATTING: { [platform: string]: { type: "prefix" | "suffix" | "none";value: string } }; // Defines how @mentions are formatted per platform (e.g., add suffix, prefix, or do nothing).

  // PLATFORM-SPECIFIC SETTINGS
  POST_FROM: "BS" | "RSS" | "TW" | "YT"; // Identifier for the source platform of the post (e.g., Bluesky, RSS feed, Twitter, YouTube).
  SHOW_REAL_NAME: boolean; // If true, use the author's real name (if available) instead of their username in certain contexts (e.g., reposts, quotes).
  SHOW_TITLE_AS_CONTENT: boolean; // If true, prioritize entryTitle over entryContent as the main post content.

  // RSS-SPECIFIC SETTINGS
  RSS_MAX_INPUT_CHARS: number; // Maximum input length for RSS feeds before processing (0 = no limit).
}

// Application settings configuration
const SETTINGS: AppSettings = {
  // CONTENT FILTERING & VALIDATION
  PHRASES_BANNED: [], // E.g., ["advertisement", { type: "regex", pattern: "\\bsale\\b", flags: "i" }]. Leave empty to disable this filter.
  PHRASES_REQUIRED: [], // E.g., ["news", { type: "and", keywords: ["tech", "innovation"] }]. Leave empty to disable mandatory keyword filtering.
  REPOST_ALLOWED: true, // true | false. Determines if reposts are processed or skipped.

  // CONTENT PROCESSING & TRANSFORMATION
  AMPERSAND_SAFE_CHAR: `⅋`, // Replacement for & char to prevent encoding issues in URLs or text.
  CONTENT_REPLACEMENTS: [], // E.g.: { pattern: "what", replacement: "by_what", flags: "gi", literal: false }
  POST_LENGTH: 444, // 0 - 500 chars. Adjust based on target platform's character limit.
  POST_LENGTH_TRIM_STRATEGY: "smart", // "sentence" | "word" | "smart". Try to preserve meaningful content during trimming.
  SMART_TOLERANCE_PERCENT: 12, // 5-25, recommended 12. Percentage of POST_LENGTH that can be wasted to preserve sentence boundaries in smart trim mode.

  // URL CONFIGURATION
  URL_REPLACE_FROM: ["https://twitter.com/", "https://x.com/"], // E.g., "" | "https://x.com/" | ["https://x.com/", "https://twitter.com/"]. Source URL pattern(s) to be replaced. Can be string or array.
  URL_REPLACE_TO: "https://xcancel.com/", // E.g., "" | `https://twitter.com/` | `https://x.com/`. Target URL pattern for replacement.
  URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"], // E.g., ["youtu.be", "youtube.com", "example.com"]. URLs in this list are excluded from trimming but still encoded.
  URL_DOMAIN_FIXES: [], // E.g., ["example.com", "rspkt.cz"]. Domains that are automatically prefixed with https:// if the protocol is missing.
  FORCE_SHOW_ORIGIN_POSTURL: false, // true | false. Always show original post URL (works with other URL display logic).
  FORCE_SHOW_FEEDURL: false, // true | false. Use feed URL as fallback instead of post-specific URL when URL processing fails.
  SHOW_IMAGEURL: false, // true | false. Include image URLs in output if available.

  // OUTPUT FORMATTING & PREFIXES
  PREFIX_REPOST: " 𝕏📤 ", // E.g., "" | "shares" | "𝕏📤". Formatting prefix for reposts.
  PREFIX_QUOTE: " 𝕏📝💬 ", // E.g., "" | "comments post from" | "🦋📝💬" | "𝕏📝💬". Formatting for quoted content.
  PREFIX_IMAGE_URL: "", // E.g., "" | "🖼️ ". Prefix for image URLs if shown.
  PREFIX_POST_URL: "\n", // E.g., "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 ". Formatting for post URLs.
  PREFIX_SELF_REFERENCE: "vlastní post", // Text for self-quotes a self-reposts
  MENTION_FORMATTING: { "TW": { type: "suffix", value: "@twitter.com" }, }, // Suffix added to Twitter mentions for clarity or linking.

  // PLATFORM-SPECIFIC SETTINGS
  POST_FROM: "TW", // "BS" | "RSS" | "TW" | "YT". Set this based on the IFTTT trigger used for the applet.
  SHOW_REAL_NAME: true, // true | false. Prefer real name over username if available.
  SHOW_TITLE_AS_CONTENT: false, // true | false. Use title as content if set to true.

  // RSS-SPECIFIC SETTINGS
  RSS_MAX_INPUT_CHARS: 1000, // Limit input to 1000 characters for RSS before HTML processing.
};

///////////////////////////////////////////////////////////////////////////////
// IFTTT 𝕏 webhook connector - World Wombat Day, Oct 22nd, 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// This connector processes data from various sources (e.g., RSS, Twitter, Bluesky)
// and provides it to the IFTTT webhook for publishing. The data is filtered and
// edited according to the settings in AppSettings.
//
///////////////////////////////////////////////////////////////////////////////

// Main text content from the source. For Twitter, this is often TweetEmbedCode (HTML embed code).
const entryContent = Twitter.newTweetFromSearch.TweetEmbedCode || "";
// Title from the source. For Twitter, this is clean content without HTML (Text field).
const entryTitle = Twitter.newTweetFromSearch.Text || "";
// URL of the specific post/item. For Twitter, this is the direct link to the tweet.
const entryUrl = Twitter.newTweetFromSearch.LinkToTweet || "";
// URL of the first image/media link found in the post. For Twitter, this is FirstLinkUrl.
const entryImageUrl = Twitter.newTweetFromSearch.FirstLinkUrl || "";
// Username of the post author. For Twitter, this is the UserName field.
const entryAuthor = Twitter.newTweetFromSearch.UserName || "";
// Title of the feed (can be username, feed name, etc.). For Twitter, this is often UserName.
const feedTitle = Twitter.newTweetFromSearch.UserName || "";
// URL of the source feed/profile. For Twitter, this is constructed from the username.
const feedUrl = "https://twitter.com/" + (Twitter.newTweetFromSearch.UserName || "");

///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋📙📗📘𝕏📺 webhook filter v3.0.3 - Nightly build 20251104
///////////////////////////////////////////////////////////////////////////////
//
// Processes and filters posts from various platforms (Twitter, Bluesky, RSS, YouTube)
// for IFTTT webhook publishing. Applies normalization, formatting, shortening,
// and platform-specific rules based on settings.
//
// v3.0.3 (20251104):
// - NEW: URL_REPLACE_FROM now supports multiple domains (array format)
// - NEW: Can replace both twitter.com AND x.com with a single target domain
// - Example: URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"]
// - Maintains 100% backward compatibility with single string format
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
 * Optimized character map for text normalization. Maps named HTML entities to their 
 * corresponding Unicode characters. Used by normalizeHtml function for fast character replacement.
 */
const CHAR_MAP: { [key: string]: string } = {
   // --- Czech characters (named entities only) ---
   "&Aacute;": "Á", "&aacute;": "á",
   "&Auml;": "Ä", "&auml;": "ä",
   "&Ccaron;": "Č", "&ccaron;": "č",
   "&Dcaron;": "Ď", "&dcaron;": "ď",
   "&Eacute;": "É", "&eacute;": "é",
   "&Euml;": "Ë", "&euml;": "ë",
   "&Ecaron;": "Ě", "&ecaron;": "ě",
   "&Iacute;": "Í", "&iacute;": "í",
   "&Iuml;": "Ï", "&iuml;": "ï",
   "&Ncaron;": "Ň", "&ncaron;": "ň",
   "&Oacute;": "Ó", "&oacute;": "ó",
   "&Ouml;": "Ö", "&ouml;": "ö",
   "&Odblac;": "Ő", "&odblac;": "ő",
   "&Rcaron;": "Ř", "&rcaron;": "ř",
   "&Scaron;": "Š", "&scaron;": "š",
   "&Tcaron;": "Ť", "&tcaron;": "ť",
   "&Uacute;": "Ú", "&uacute;": "ú",
   "&Uuml;": "Ü", "&uuml;": "ü",
   "&Uring;": "Ů", "&uring;": "ů",
   "&Udblac;": "Ű", "&udblac;": "ű",
   "&Yacute;": "Ý", "&yacute;": "ý",
   "&Zcaron;": "Ž", "&zcaron;": "ž",
   
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
   "&lsquo;": "\u2018", // Left single quote
   "&rsquo;": "\u2019", // Right single quote
   "&ldquo;": "\u201C", // Left double quote
   "&rdquo;": "\u201D", // Right double quote
   "&sbquo;": "\u201A", // Single low-9 quotation mark
   "&bdquo;": "\u201E", // Double low-9 quotation mark
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
   "[&hellip;]": "…", "[&amp;hellip;]": "…", "&amp;hellip;": "…",
   "[&mldr;]": "…", "[&amp;mldr;]": "…", "&mldr;": "…", "&amp;mldr;": "…",
   
   // --- Ampersand variants (must be LAST to avoid replacing & in other entities) ---
   "&amp;": SETTINGS.AMPERSAND_SAFE_CHAR,
   "&": SETTINGS.AMPERSAND_SAFE_CHAR
 };

/**
 * Configuration object for precompiled regular expression patterns used in content processing.
 * All patterns are TS 2.9.2 compatible (no Unicode property escapes).
 */
const REGEX_PATTERNS = {
  BS_QUOTE: /\[contains quote post or other embedded content\]/gi,
  ELLIPSIS_MULTI: /\u2026{2,}/gim,
  ELLIPSIS_NORMALIZE: /\.(\s*\.){2,}/gim,
  EMOJI: /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u26FF\u2700-\u27BF]/g,
  HTML_CLEANUP: /(<(br|br\/|\/p)[^>]*>)|(<\/?h[1-6][^>]*>)|(<[^>]+>)|(\r?\n)/gi,
  MEDIA_SUFFIX: /\/(photo|video)\/\d+$/i,
  REAL_NAME: /&mdash;\s*([^<\(]+)\s*\(@/i,
  REPLY_START: /^(\.?@[\w]+|R to @[\w]+(\s|:|))/i,
  REPOST_PREFIX: /^(RT @([^:]+): )/i,
  REPOST_URL: /href="(https:\/\/twitter\.com[^"]+)"/gi,
  REPOST_USER: /RT (@[a-z0-9_]+)/gi,
  RESPONSE_PREFIX: /^R to (.*?): /,
  RT_PREFIX: /^RT\s+@[\w]+/i,
  SPACE_BEFORE_URL: /\s+(?=https?)/g,
  SPECIAL_CHARS: /[.*+?^${}()|[\]\\]/g,
  TCO_URL: /https:\/\/t\.co\/[^\s]+/gi,
  TERMINATOR_CHECK: /[.!?\u2026]$/,
  TWEET_STATUS: /^https?:\/\/(twitter\.com|x\.com)\/[^\/]+\/status\/\d+/i,
  TWEET_TEXT: /<p[^>]*>([\s\S]*?)<\/p>/i,
  URL_IN_WORD: /https?:\/\/\S+|\S+/g,
  URL_MATCH: /https?:\/\/[^\s]+/g,
  URL_PROTOCOL: /https?:\/\//i,
  URL_TERMINATOR: /(\bhttps?:\/\/[^\s]+\b|#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)$/i,
  USERNAME_EXTRACT: /^https?:\/\/(?:twitter\.com|x\.com)\/([^\/]+)\/status\/\d+/i,
  WHITESPACE: /[ \t\u00A0]{2,}|(\r?\n){3,}/g
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
 * @param platform - Platform identifier ("BS", "TW", "RSS", "YT")
 * @returns Platform configuration object
 */
function getPlatformConfig(platform: string): PlatformConfig { return platformConfigs[platform] || platformConfigs["RSS"] || {}; }

/**
 * Validates if a value is a non-empty string.
 * @param value - The value to check
 * @returns True if value is a non-empty string, false otherwise
 */
function isValidString(value: any): boolean { return typeof value === "string" && value.length > 0; }

/**
 * Safely truncates a string at a specified length without breaking Unicode surrogate pairs.
 * Uses Array.from() if available (modern runtimes), falls back to manual iteration for ES5.
 * Respects Unicode code points (emoji) but not grapheme clusters (combining chars, ZWJ sequences).
 * @param str - The string to truncate
 * @param maxCodePoints - Maximum length in Unicode code points (not UTF-16 code units)
 * @returns Object with truncated string and flag indicating if truncation occurred
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
  if (SETTINGS.POST_FROM !== "RSS" || SETTINGS.RSS_MAX_INPUT_CHARS <= 0 || !content) { return { content: content || "", wasTruncated: false }; }

  // Use safe truncation to avoid breaking surrogate pairs
  var truncated = safeTruncate(content, SETTINGS.RSS_MAX_INPUT_CHARS);
  
  // Defensive check for compatibility
  if (!truncated || typeof truncated !== "object") { return { content: content, wasTruncated: false }; }
  
  return {
    content: truncated.result || content,
    wasTruncated: truncated.wasTruncated || false
  };
}

/**
 * Detects if the text contains a truncated or incomplete URL.
 * Checks for URLs with ellipsis (…), text ending with ellipsis, or incomplete URLs at the end.
 * Common in RSS feeds where long URLs are shortened with ellipsis.
 * Must be called BEFORE processAmpersands() to detect ellipsis before URL encoding.
 * @param text - The text to check for truncated URLs
 * @returns True if truncated URL is detected, false otherwise
 */
function hasTruncatedUrl(text: any): boolean {
  if (!text || typeof text !== "string") return false;
  
  // Detection of URLs with ellipsis: "https://domain/…" or "https://domain/…/path…"
  if (/https?:\/\/[^\s]*\u2026/i.test(text)) return true;
  
  // Detecting URLs with /… somewhere in the path
  if (/https?:\/\/[^\s]*\/\u2026/i.test(text)) return true;
  
  return false;
}

/**
 * Removes truncated or incomplete URLs from text and replaces them with ellipsis.
 * Handles multiple patterns: URLs with ellipsis in path, incomplete domains, and cut-off URLs.
 * Essential for cleaning RSS feed content where URLs are often truncated.
 * Must be called BEFORE processAmpersands() to work with raw ellipsis character.
 * @param text - The text containing potentially truncated URLs
 * @returns Text with truncated URLs removed and replaced with ellipsis
 */
function removeTruncatedUrl(text: any): string {
  if (!text || typeof text !== "string") return text;
  
  var result = text;
  
  // Removing the complete URL with ellipsis anywhere in it
  result = result.replace(/https?:\/\/[^\s]*\u2026[^\s]*/gi, "\u2026");
  
  // Removing incomplete URLs without protocol: "www.example.…rest"
  result = result.replace(/(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z0-9][^\s]*\u2026[^\s]*/gi, "\u2026");
  
  // Normalization of multiple ellipses
  result = result.replace(/\u2026+/g, "\u2026");
  
  return result.trim();
}

/**
 * Determines if RSS input content should be truncated based on platform and settings.
 * Only returns true when platform is "RSS", RSS_MAX_INPUT_CHARS is positive,
 * and content length exceeds the limit.
 * @param platform - The source platform identifier ("RSS", "TW", "BS", "YT")
 * @param content - The raw content to check for truncation need
 * @returns True if content should be truncated at RSS input stage, false otherwise
 */
function shouldTruncateRssInput(platform: string, content: any): boolean {
  return platform === "RSS" && 
         SETTINGS.RSS_MAX_INPUT_CHARS > 0 && 
         !!content && 
         typeof content === "string" &&
         content.length > SETTINGS.RSS_MAX_INPUT_CHARS;
}

/**
 * Validates and returns a string, or empty string if invalid.
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
  if (!str || !SETTINGS.PHRASES_BANNED || SETTINGS.PHRASES_BANNED.length === 0) { return false; }

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
  if (!SETTINGS.PHRASES_REQUIRED || SETTINGS.PHRASES_REQUIRED.length === 0) { return true; }

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
 * @param str - The string to check
 * @returns True if a URL protocol is found, false otherwise.
 */
function hasUrl(str: string): boolean { return isValidString(str) && REGEX_PATTERNS.URL_PROTOCOL.test(str); }

/**
 * Helper function to determine if the string is effectively empty.
 * @param str - The string to check
 * @returns True if the string is effectively empty, false otherwise
 */
function isEmpty(str: string): boolean { return !str || str === "(none)" || str.trim() === ""; }

/**
 * Checks if the post is a quote based on platform-specific indicators.
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
 * @param str - The string to process
 * @returns The string after applying all defined hacks.
 */
function applyContentReplacements(str: string): string {
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
 * @param str - The string to decode
 * @returns The string with numeric entities decoded to Unicode characters
 */
function decodeNumericEntities(str: string): string {
  if (!str || str.indexOf("&#") === -1) return str;
  
  // Decode decimal entities: &#127758; &#233; etc.
  str = str.replace(/&#(\d+);/g, function(match: string, dec: string): string {
    var codePoint = parseInt(dec, 10);
    
    // For characters outside BMP (> 0xFFFF), use surrogate pair
    if (codePoint > 0xFFFF) {
      codePoint -= 0x10000;
      return String.fromCharCode(
        0xD800 + (codePoint >> 10),
        0xDC00 + (codePoint & 0x3FF)
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
        0xD800 + (codePoint >> 10),
        0xDC00 + (codePoint & 0x3FF)
      );
    }
    
    return String.fromCharCode(codePoint);
  });
  
  return str;
}

/**
 * Moves the first detected URL (http/https) in a string to the end.
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
    if (lineBreak) return "\n";
    if (headingTag) return "\n\n";
    if (otherTag) return "";
    if (newline) return TEMP_NEWLINE;
    return match;
  });

  str = str.replace(/\+/g, "\uFE63");

  // Only apply entity processing if entities are detected
  if (str.indexOf('&') !== -1 || str.indexOf('&#') !== -1) {
    // Decode numeric entities FIRST (before CHAR_MAP)
    str = decodeNumericEntities(str);
    
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

  var needsEllipsis = wasPreTruncated;

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

  if (SETTINGS.POST_FROM !== "TW" && needsEllipsis) {
    const hasSimpleTerminator = REGEX_PATTERNS.TERMINATOR_CHECK.test(str);
    if (!hasSimpleTerminator && !str.endsWith("\u2026")) { str += "\u2026"; }
  }

  return { content: str, needsEllipsis: needsEllipsis };
}

/**
 * Trims query parameters from URLs by removing everything after the '?' character.
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
    
    const currentUser = authorUsername.startsWith("@") ? authorUsername.substring(1) : authorUsername;
    const isSelf = username && username.toLowerCase() === currentUser.toLowerCase();
    
    const mention = isSelf ? SETTINGS.PREFIX_SELF_REFERENCE : (username ? "@" + username : "");
    
    return author + SETTINGS.PREFIX_QUOTE + mention + ":\n" + content;
  }

  return content;
}

/**
 * Formats a retweet string by replacing the "RT @username: " prefix with custom attribution.
 * @param content - The content string.
 * @param author - The display name of the person retweeting (for output).
 * @param authorUsername - The username of the person retweeting (for comparison).
 * @param repostedUser - The @username of the original author being retweeted.
 * @returns The formatted retweet string.
 */
function formatRepost(content: string, author: string, authorUsername: string, repostedUser: string): string {
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
 * Process raw entry content according to platform-specific rules, clean up HTML/entities,
 * apply hacks, move URL if needed, handle replies/retweets/quotes, and return structured result.
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

  if (config.useParsedText) {
    content = extractTweetText(rawContent) || trimmedTitle;
  } else if (config.useGetContent) {
    content = selectContent(rawContent, trimmedTitle);
  } else {
    content = trimmedTitle;
  }

  content = normalizeHtml(content);
  content = applyContentReplacements(content);

  // This ensures ellipsis (…) is detected before URL encoding turns it into %E2%80%A6
  if (hasTruncatedUrl(content)) { content = removeTruncatedUrl(content); }

  content = processAmpersands(content);

  // Platform-specific content modifications
  if (config.applyMoveUrlToEnd) { content = moveUrlToEnd(content); }

  if (config.handleReplies) { content = removeReplyPrefix(content); }

  if (config.handleRetweets && isRepost(trimmedTitle)) {
    const repostedUser = extractRepostUser(trimmedTitle);
    content = formatRepost(content, feedAuthor, feedUsername, repostedUser);
  }

  if (config.handleQuotes && isQuote(content, imageUrl, platform, author)) { content = formatQuote(content, feedAuthor, feedUsername, platform, imageUrl); }

  return { content: content, feedAuthor: feedAuthor, userNameToSkip: skipName };
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

  const isQuoteTweet = isQuote(content, imageUrl, platform, author);

  if (platform === "TW") { content = content.replace(REGEX_PATTERNS.TCO_URL, ""); }

  const trimmed = trimContent(content, wasRssTruncated);
  var trimmedContent = trimmed.content;
  var needsEllipsis = trimmed.needsEllipsis;

  var showUrl = SETTINGS.FORCE_SHOW_ORIGIN_POSTURL || needsEllipsis;

  if (platform === "BS") { showUrl = showUrl || isQuote(content, "", "BS", ""); }

  if (platform === "TW") {
    const isMedia = typeof imageUrl === "string" && (imageUrl.endsWith("/photo/1") || imageUrl.endsWith("/video/1"));
    const isExtRepost = isRepost(title) && !isSelfRepost(title, author) && SETTINGS.REPOST_ALLOWED;
    const hasRepostUrl = extractRepostUrl(content) !== "";

    if (!hasUrl(content) && !isMedia) { showUrl = true; }
    showUrl = showUrl || hasRepostUrl || isExtRepost || isMedia;
  }

  var urlToShow = "";
  if (platform === "TW") {
    const contentHasUrl = hasUrl(trimmedContent);
    const hasImage = isValidImageUrl(imageUrl);

    if (showUrl || contentHasUrl) {
      if (isQuoteTweet) {
        urlToShow = entryUrl;
      } else {
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
 * Centralized URL processing utility replaces URL_REPLACE_FROM → URL_REPLACE_TO (e.g. x.com → xcancel.com or both x.com and twitter.com URLs → xcancel.com) 
 * and applies URL processing via processAmpersands() (trim query, encode, handle ampersands).
 * Now supports multiple source domains in URL_REPLACE_FROM.
 * @param url - The URL to process
 * @returns The fully processed URL, or an empty string if invalid.
 */
function processUrl(url: string): string {
  url = safeString(url);
  if (!url || url === "(none)") return "";
  
  url = url.trim();

  // URL domain replacement logic (v3.0.3: supports both string and array)
  if (SETTINGS.URL_REPLACE_FROM) {
    // Check if URL_REPLACE_FROM is an array (multiple domains)
    if (typeof SETTINGS.URL_REPLACE_FROM === "object" && SETTINGS.URL_REPLACE_FROM.length > 0) {
      // Process each domain in the array
      for (var i = 0; i < SETTINGS.URL_REPLACE_FROM.length; i++) {
        const domain = SETTINGS.URL_REPLACE_FROM[i];
        if (domain && typeof domain === "string") {
          const pattern = escapeRegExp(domain);
          if (pattern) {
            const regex = getCachedRegex(pattern, "gi");
            url = url.replace(regex, SETTINGS.URL_REPLACE_TO);
          }
        }
      }
    } 
    // Single string domain (backward compatible)
    else if (typeof SETTINGS.URL_REPLACE_FROM === "string") {
      const pattern = escapeRegExp(SETTINGS.URL_REPLACE_FROM);
      if (pattern) { url = url.replace(getCachedRegex(pattern, "gi"), SETTINGS.URL_REPLACE_TO); }
    }
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
 * @param content - The entry content
 * @param title - The entry title
 * @param url - The entry URL
 * @param imageUrl - The entry image URL
 * @param author - The entry author username
 * @returns Object with { skip: boolean, reason: string }
 */
function shouldSkip(content: any, title: string, url: string, imageUrl: string, author: string): { skip: boolean;reason: string } {
  if (isEmpty(content) && isEmpty(title) && isEmpty(url)) { return { skip: true, reason: "Empty content, title and URL" }; }
  
  if (isRepost(title) && !isSelfRepost(title, author) && !SETTINGS.REPOST_ALLOWED) { return { skip: true, reason: "External repost not allowed" }; }

  if (SETTINGS.PHRASES_BANNED && SETTINGS.PHRASES_BANNED.length > 0) {
    if (hasBannedContent(title) || hasBannedContent(content) || hasBannedContent(url) || hasBannedContent(imageUrl)) { return { skip: true, reason: "Contains banned phrases" }; }
  }

  if (SETTINGS.PHRASES_REQUIRED && SETTINGS.PHRASES_REQUIRED.length > 0) {
    if (!hasRequiredKeywords(title) && !hasRequiredKeywords(content)) { return { skip: true, reason: "Missing mandatory keywords" }; }
  }

  if (isReply(title) || isReply(content)) { return { skip: true, reason: "Reply post (starts with @username)" }; }

  return { skip: false, reason: "" };
}

///////////////////////////////////////////////////////////////////////////////
// MAIN EXECUTION LOGIC
///////////////////////////////////////////////////////////////////////////////

const skipCheck = shouldSkip(entryContent, entryTitle, entryUrl, entryImageUrl, entryAuthor);

if (skipCheck.skip) {
  MakerWebhooks.makeWebRequest.skip("Skipped due to filter rules: " + skipCheck.reason);
} else {
  const finalContent = composeContent(entryTitle, entryAuthor, feedTitle, entryContent, entryImageUrl);
  const platform = SETTINGS.POST_FROM;
  var wasRssTruncated = shouldTruncateRssInput(platform, entryContent);
  const finalStatus = composeStatus(finalContent, entryUrl, entryImageUrl, entryTitle, entryAuthor, wasRssTruncated);
  MakerWebhooks.makeWebRequest.setBody("status=" + finalStatus);
}