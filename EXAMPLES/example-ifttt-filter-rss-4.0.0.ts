///////////////////////////////////////////////////////////////////////////////
// IFTTT 📙📗📘 webhook settings - Z Day rev, Jan 1st, 2026
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
  URL_REPLACE_FROM: string[]; // URL base(s) to replace. Array only.
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
  COMBINE_TITLE_AND_CONTENT: boolean; // Combine entryTitle and entryContent (RSS only).
  CONTENT_TITLE_SEPARATOR: string; // Title and Content Separator
  RSS_MAX_INPUT_CHARS: number; // Max RSS input length before processing (0 = no limit).
}

// Application settings configuration
const SETTINGS: AppSettings = {
  // CONTENT FILTERING & VALIDATION //
  PHRASES_BANNED: [], // E.g. [{type:"regex",pattern:"\\bsale\\b"}]. See FilterRule docs for more.
  PHRASES_REQUIRED: [], // E.g. [{type:"and",content:["tech","AI"]}]. See FilterRule docs for more.
  REPOST_ALLOWED: true, // true | false. Determines if reposts are processed or skipped.
  // CONTENT PROCESSING & TRANSFORMATION //
  AMPERSAND_SAFE_CHAR: `⅋`, // Replacement for & char to prevent encoding issues in URLs or text.
  CONTENT_REPLACEMENTS: [], // E.g.: { pattern: "what", replacement: "by_what", flags: "gi", literal: false }
  POST_LENGTH: 200, // 0 - 500 chars. Adjust based on target platform's character limit.
  POST_LENGTH_TRIM_STRATEGY: "smart", // "sentence" | "word" | "smart". Preserve meaningful content.
  SMART_TOLERANCE_PERCENT: 12, // 5-25, rec. 12. % of POST_LENGTH for sentence boundaries.
  TCO_REPLACEMENT: "", // "" | "↗" | "🔗↗️" | "[url]". Placeholder for t.co links (Twitter/X).
  // URL CONFIGURATION //
  FORCE_SHOW_ORIGIN_POSTURL: false, // Always show original post URL.
  FORCE_SHOW_FEEDURL: false, // Use feed URL as fallback when URL processing fails.
  SHOW_IMAGEURL: false, // true | false. Include image URLs in output if available.
  URL_DOMAIN_FIXES: [], // Domains that are automatically prefixed with https:// if the protocol is missing.
  URL_NO_TRIM_DOMAINS: [
    "facebook.com", "www.facebook.com", "instagram.com", "www.instagram.com", // Facebook and Instagram
    "bit.ly", "goo.gl", "ift.tt", "ow.ly", "t.co", "tinyurl.com", // URL shorteners
    "youtu.be", "youtube.com", // Youtube
  ], // URLs in this list are excluded from trimming but still encoded.  
  URL_REPLACE_FROM: [], // Array of URL patterns to replace.
  URL_REPLACE_TO: "", // Target URL pattern for replacement.
  // OUTPUT FORMATTING & PREFIXES //
  MENTION_FORMATTING: { "RSS": { type: "prefix", value: "https://xcancel.com/" }, }, // Prefix for Twitter mentions
  PREFIX_IMAGE_URL: "", // E.g., "" | "🖼️ ". Prefix for image URLs if shown.
  PREFIX_POST_URL: "\n", // E.g., "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 ". Formatting for post URLs.
  PREFIX_QUOTE: "", // E.g., "" | "comments post from" | "🦋📝💬" | "𝕏📝💬". Formatting for quoted content.
  PREFIX_REPOST: "", // E.g., "" | "shares" | "𝕏📤". Formatting prefix for reposts.
  PREFIX_SELF_REFERENCE: "", // Text for self-quotes a self-reposts
  // PLATFORM-SPECIFIC SETTINGS //
  MOVE_URL_TO_END: false, // Move URLs from beginning to end (useful for RSS).
  POST_FROM: "RSS", // "BS" | "RSS" | "TW" | "YT". Set this based on the IFTTT trigger used for the applet.
  SHOW_REAL_NAME: true, // true | false. Prefer real name over username if available.
  SHOW_TITLE_AS_CONTENT: false, // true | false. Use title as content (lower priority than COMBINE).
  // CONTENT COMBINATION (RSS & YOUTUBE) //
  COMBINE_TITLE_AND_CONTENT: false, // Merge title + content for enhanced posts (RSS, YT only).
  CONTENT_TITLE_SEPARATOR: " — ", // Title and Content Separator when COMBINE_TITLE_AND_CONTENT: true
  RSS_MAX_INPUT_CHARS: 1000, // Limit input to 1000 characters for RSS before HTML processing.
};

///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🦋📙📗📘 webhook - Z Day rev, Jan 1st, 2026
///////////////////////////////////////////////////////////////////////////////

const entryContent = Feed.newFeedItem.EntryContent || ""; // Main text content (EntryContent for BlueSky/RSS).
const entryTitle = Feed.newFeedItem.EntryTitle || ""; // Title (EntryTitle for BlueSky/RSS).
const entryUrl = Feed.newFeedItem.EntryUrl || ""; // Post/item URL (direct link for BlueSky/RSS).
const entryImageUrl = Feed.newFeedItem.EntryImageUrl || ""; // First image/media URL (EntryImageUrl for BlueSky/RSS, may be unreliable).
const entryAuthor = Feed.newFeedItem.EntryAuthor || ""; // Post author username (EntryAuthor for BlueSky/RSS).
const feedTitle = Feed.newFeedItem.FeedTitle || ""; // Feed title/username (FeedTitle for BlueSky/RSS).
const feedUrl = Feed.newFeedItem.FeedUrl || ""; // Source feed/profile URL (FeedUrl for BlueSky/RSS).

///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋📙📗📘𝕏📺 webhook filter v4.0.0 - Z Day, Jan 1st, 2026
///////////////////////////////////////////////////////////////////////////////

// Filter rule definition for advanced filtering logic
interface FilterRule {
  type: "literal" | "regex" | "and" | "or" | "not" | "complex"; pattern ? : string; flags ? : string; operator ? : "and" | "or";
  rules ? : FilterRule[]; // For COMPLEX rule
  content ? : string[];contentRegex ? : string[]; // Literal content matches and Regex content patterns
  username ? : string[];usernameRegex ? : string[]; // Literal username matches and Regex username patterns
  domain ? : string[];domainRegex ? : string[]; // Literal domain matches and Regex domain patterns
}

// Type definitions for Object.entries (standard augmentation)
interface ObjectConstructor { entries < T > (o: { [s: string]: T } | ArrayLike < T > ): [string, T][]; }
// Type definitions for ES6 String methods (runtime confirmed, TS needs declarations)
interface String { startsWith(searchString: string, position?: number): boolean;  endsWith(searchString: string, endPosition?: number): boolean; includes(searchString: string, position?: number): boolean; }
// Type definitions for ES6 Array methods (runtime confirmed, TS needs declarations)
interface ArrayConstructor { from<T>(arrayLike: ArrayLike<T>): T[]; from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): U[]; }
// Type definitions for Platform configurations
interface PlatformConfig { useParsedText ? : boolean; useFeedTitleAuthor ? : boolean; handleReplies ? : boolean; handleRetweets ? : boolean; handleQuotes ? : boolean; useGetContent ? : boolean; }
// Type definitions for processed content result
interface ProcessedContent { content: string; feedAuthor: string; userNameToSkip: string; wasRssTruncated: boolean; }
// Type definitions for processed status result
interface ProcessedStatus { trimmedContent: string; needsEllipsis: boolean; urlToShow: string; }
// Type definitions for trim result
interface TrimResult { content: string; needsEllipsis: boolean; }
// Type definition for truncate RSS result
interface TruncateRssResult { content: string; wasTruncated: boolean; }

// Platform-specific content cleaning configuration
const platformConfigs: { [key: string]: PlatformConfig } = {
  BS: { handleQuotes: true, useFeedTitleAuthor: true, useGetContent: true },
  RSS: { handleRetweets: true, useGetContent: true },
  TW: { handleQuotes: true, handleReplies: true, handleRetweets: true, useFeedTitleAuthor: true, useParsedText: true },
  YT: { useGetContent: true }
};

/** Character map: HTML entities → Unicode */
const CHAR_MAP: { [key: string]: string } = {
  // Czech characters (named entities only)
  "&Aacute;": "Á", "&aacute;": "á", "&Auml;": "Ä", "&auml;": "ä",
  "&Ccaron;": "Č", "&ccaron;": "č",
  "&Dcaron;": "Ď", "&dcaron;": "ď",
  "&Eacute;": "É", "&eacute;": "é", "&Euml;": "Ë", "&euml;": "ë", "&Ecaron;": "Ě", "&ecaron;": "ě",
  "&Iacute;": "Í", "&iacute;": "í", "&Iuml;": "Ï", "&iuml;": "ï",
  "&Ncaron;": "Ň", "&ncaron;": "ň",
  "&Oacute;": "Ó", "&oacute;": "ó", "&Ouml;": "Ö", "&ouml;": "ö", "&Odblac;": "Ő", "&odblac;": "ő",
  "&Rcaron;": "Ř", "&rcaron;": "ř",
  "&Scaron;": "Š", "&scaron;": "š",
  "&Tcaron;": "Ť", "&tcaron;": "ť",
  "&Uacute;": "Ú", "&uacute;": "ú", "&Uuml;": "Ü", "&uuml;": "ü", "&Uring;": "Ů", "&uring;": "ů", "&Udblac;": "Ű", "&udblac;": "ű",
  "&Yacute;": "Ý", "&yacute;": "ý",
  "&Zcaron;": "Ž", "&zcaron;": "ž",
  // CRITICAL entities
  "&nbsp;": " ", // Non-breaking space
  "&hellip;": "…", // Ellipsis
  "&mdash;": "—", "&ndash;": "–", // Dash
  "&lt;": "<", "&gt;": ">", // Less than and Greater than
  "&quot;": '"', // Quotation mark
  "&apos;": "'", // Apostrophe
  // IMPORTANT named entities
  "&euro;": "€", "&pound;": "£", // Euro sign, British pound
  "&yen;": "¥", "&cent;": "¢", // Japanese yen, Cent
  "&copy;": "©", // Copyright - common
  "&reg;": "®", "&trade;": "™", // Registered trademark, Trademark
  "&deg;": "°", // Degree symbol
  "&plusmn;": "±", // Plus-minus
  "&times;": "×", // Multiplication
  "&divide;": "÷", // Division
  "&frac14;": "¼", "&frac34;": "¾", // 1/4 and 3/4 fraction
  "&frac12;": "½", "&half;": "½", // 1/2 fraction and alternative
  // Additional common symbols
  "&laquo;": "«", "&raquo;": "»", // Left and Right angle quote
  "&lsquo;": "\u2018", "&rsquo;": "\u2019", // Left and Right single quote
  "&ldquo;": "\u201C", "&rdquo;": "\u201D", // Left and Right double quote
  "&sbquo;": "\u201A", "&bdquo;": "\u201E", // Single and Double low-9 quotation mark
  "&prime;": "′", "&Prime;": "″", // Prime and Double prime
  "&permil;": "‰", // Per mille
  "&thickapprox;": "≈", // Approximately equal
  "&ne;": "≠", // Not equal
  "&minus;": "−", // Minus sign
  "&bull;": "•", // Bullet
  "&middot;": "·", "&centerdot;": "·", // Middle and Center dot
  "&sect;": "§", "&para;": "¶", // Section and Paragraph sign
  "&dagger;": "†", "&Dagger;": "‡", // Dagger and Double dagger
  "&shy;": "-", // Soft hyphen
  // Special cases: wrapped ellipsis entities
  "[&hellip;]": "…", "[&amp;hellip;]": "…", "&amp;hellip;": "…", "[&mldr;]": "…", "[&amp;mldr;]": "…", "&mldr;": "…", "&amp;mldr;": "…",
  // Ampersand variants (must be LAST to avoid replacing & in other entities)
  "&amp;": SETTINGS.AMPERSAND_SAFE_CHAR,
  "&": SETTINGS.AMPERSAND_SAFE_CHAR
};

// Pre-compile CHAR_MAP regex for efficient single-pass replacement
const CHAR_MAP_REGEX = (function(): RegExp {
  var keys = Object.keys(CHAR_MAP);
  // Sort by length (longest first) to match longer patterns before shorter ones
  keys.sort(function(a: string, b: string): number { return b.length - a.length; });
  // Escape special regex characters in entity keys
  var escapedKeys = keys.map(function(key: string): string {
    return key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  });
  // Create alternation pattern: (&entity1;|&entity2;|...)
  return new RegExp(escapedKeys.join("|"), "g");
})();

/** Precompiled regex patterns */
const REGEX_PATTERNS = {
  ANCHOR_TAG: /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi,
  BS_QUOTE: /\[contains quote post or other embedded content\]/gi,
  ELLIPSIS_MULTI: /\u2026{2,}/gim,
  ELLIPSIS_NORMALIZE: /\.(\s*\.){2,}/gim,
  EMOJI: /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u26FF\u2700-\u27BF]/g,
  HTML_CLEANUP: /(<(br|br\/|\/p)[^>]*>)|(<\/?h[1-6][^>]*>)|(<[^>]+>)|(\r?\n)/gi,
  MEDIA_SUFFIX: /\/(photo|video)\/\d+$/i,
  REAL_NAME: /&mdash;\s*([^<\(]+)\s*\(@/i,
  REPLY_START: /^(\.?@[\w]+|R to @[\w]+(\s|:|))/i,
  REPOST_PREFIX: /^(RT (?:by )?@([^:]+): )/i,
  REPOST_URL: /href="(https:\/\/twitter\.com[^"]+)"/gi,
  REPOST_USER: /RT (?:by )?(@[a-z0-9_]+)/gi,
  RESPONSE_PREFIX: /^R to (.*?): /,
  RT_PREFIX: /^RT\s+(?:by\s+)?@[\w]+/i,
  SPACE_BEFORE_URL: /[ \t]+(?=https?)/g,
  SPECIAL_CHARS: /[.*+?^${}()|[\]\\]/g,
  TCO_URL: /https:\/\/t\.co\/[^\s]+/gi,
  TERMINATOR_CHECK: /[.!?\u2026]$/,
  TWEET_STATUS: /^https?:\/\/(twitter\.com|x\.com)\/[^\/]+\/status\/\d+/i,
  TWEET_TEXT: /<p[^>]*>([\s\S]*?)<\/p>/i,
  URL_FRAG: /\s+h(tt?p(s)?[:\/]*|tt?|t)?\u2026$/,
  URL_IN_WORD: /https?:\/\/\S+|\S+/g,
  URL_MATCH: /https?:\/\/[^\s]+/g,
  URL_PROTOCOL: /https?:\/\//i,
  URL_TERMINATOR: /(\bhttps?:\/\/[^\s]+\b|#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)$/i,
  USERNAME_EXTRACT: /^https?:\/\/(?:twitter\.com|x\.com)\/([^\/]+)\/status\/\d+/i,
  WHITESPACE: /[ \t\u00A0]{2,}|(\r?\n){3,}/g
};

// Pre-process URL_DOMAIN_FIXES: add https:// prefix + update URL_MATCH regex
(function initializeDomainFixes(): void {
  if (SETTINGS.URL_DOMAIN_FIXES && SETTINGS.URL_DOMAIN_FIXES.length > 0) {
    const domainPatterns: any[] = [];

    SETTINGS.URL_DOMAIN_FIXES
      .filter(function(d: string): boolean { return !!d; })
      .forEach(function(domain: string): void {
        const escapedDomain = domain.replace(/\./g, '\\.');
        // Process in specific order to avoid double-processing
        domainPatterns.push({ // Protect valid URLs (no modification)
          pattern: "(https?:\\/\\/)" + escapedDomain + "(\\/[^\\s]*|[\\s]|$)",
          replacement: "$1" + domain + "$2",
          flags: "gm",
          literal: false
        });
        domainPatterns.push({ // Add https:// to bare domains
          pattern: "(^|[\\s\\(\\[\\{<\"'])" + escapedDomain + "(\\/[^\\s\\)\\]\\}>\"',;]*|[\\s\\)\\]\\}>\"',;]|$)",
          replacement: "$1https://" + domain + "$2",
          flags: "gm",
          literal: false
        });
      });

    SETTINGS.CONTENT_REPLACEMENTS = domainPatterns.concat(SETTINGS.CONTENT_REPLACEMENTS || []);

    // Update URL_MATCH to detect domains without protocol
    const escapedDomains = SETTINGS.URL_DOMAIN_FIXES
      .filter(function(d: string): boolean { return !!d; })
      .map(function(domain: string): string { return domain.replace(/\./g, '\\.'); })
      .join("|");

    // Matches: URLs with protocol OR listed domains without protocol
    const pattern = "(?:https?:\\/\\/[^\\s]+|(?:" + escapedDomains + ")(?:\\/[^\\s]*)?)";
    REGEX_PATTERNS.URL_MATCH = new RegExp(pattern, "g");
  }
})();

// OPTIMIZED HELPER FUNCTIONS //
/** Converts code point to character (handles surrogate pairs for BMP+) */
function codePointToChar(cp: number): string {
  if (cp > 0xFFFF) { cp -= 0x10000; return String.fromCharCode(0xD800 + (cp >> 10), 0xDC00 + (cp & 0x3FF)); }
  return String.fromCharCode(cp);
}

/** Escapes special chars for regex use */
function escapeRegExp(str: string): string {
  if (!str) return "";
  return str.replace(REGEX_PATTERNS.SPECIAL_CHARS, "\\$&");
}

/** Finds last valid period (excludes dates, abbreviations) */
function findLastSentenceEnd(str: string, maxLength: number): number {
  var len = Math.min(str.length, maxLength);
  var i = len - 1;

  while (i >= 0) {
    if (str.charAt(i) === ".") {
      // Find next non-whitespace character
      var nextCharIndex = i + 1;
      var charAfterPeriod = "";
      while (nextCharIndex < str.length) {
        var c = str.charAt(nextCharIndex);
        if (c !== " " && c !== "\t" && c !== "\n") {
          charAfterPeriod = c;
          break;
        }
        nextCharIndex++;
      }

      // Check for date pattern (1-31 before period) using charAt
      var isDate = false;
      if (i >= 1) {
        var c1 = str.charAt(i - 1);
        var c2 = i >= 2 ? str.charAt(i - 2) : "";
        if (c1 >= "0" && c1 <= "9") {
          var num = parseInt(c1, 10);
          if (c2 >= "0" && c2 <= "9") { num = parseInt(c2 + c1, 10); }
          if (num >= 1 && num <= 31) { isDate = true; }
        }
      }

      // Nothing after period (end of text)
      if (!charAfterPeriod) {
        if (!isDate) { return i; }
        i--;
        continue;
      }

      // Lowercase follows - abbreviation or date continuation
      if (charAfterPeriod === charAfterPeriod.toLowerCase() && charAfterPeriod !== charAfterPeriod.toUpperCase()) {
        if (isDate) { i--; continue; }
        i--;
        continue;
      }

      // Uppercase follows - valid sentence end
      if (charAfterPeriod === charAfterPeriod.toUpperCase() && charAfterPeriod !== charAfterPeriod.toUpperCase().toLowerCase()) { return i; }
      i--;
      continue;
    }
    i--;
  }
  return -1;
}

/** Gets platform config with RSS fallback */
function getPlatformConfig(platform: string): PlatformConfig { return platformConfigs[platform] || platformConfigs["RSS"] || {}; }

/** Validates non-empty string */
function isValidString(value: any): boolean { return typeof value === "string" && value.length > 0; }

/** Safely truncates string respecting Unicode code points (ES6+) */
function safeTruncate(str: string, maxCodePoints: number): { result: string;wasTruncated: boolean } {
  if (!str || maxCodePoints <= 0) { return { result: "", wasTruncated: false }; }

  // Fast path: if string is definitely shorter, no need to process
  if (str.length <= maxCodePoints) { return { result: str, wasTruncated: false }; }

  // Use Array.from to properly handle surrogate pairs and emoji
  var arr = Array.from(str);
  var wasTruncated = arr.length > maxCodePoints;
  return { result: wasTruncated ? arr.slice(0, maxCodePoints).join("") : str, wasTruncated: wasTruncated };
}

/** Truncates RSS input before HTML processing */
function truncateRssInput(content: string): TruncateRssResult {
  if (SETTINGS.POST_FROM !== "RSS" || SETTINGS.RSS_MAX_INPUT_CHARS <= 0 || !content) { return { content: content || "", wasTruncated: false }; }
  var truncated = safeTruncate(content, SETTINGS.RSS_MAX_INPUT_CHARS);
  return { content: truncated.result || content, wasTruncated: truncated.wasTruncated || false };
}

/** Detects truncated URLs (call before processAmpersands) */
function hasTruncatedUrl(text: any): boolean {
  if (!text || typeof text !== "string") return false;
  if (/https?:\/\/[^\s]*\u2026/i.test(text)) return true; // Detection of URLs with ellipsis: "https://domain/…" or "https://domain/…/path…"  
  if (/https?:\/\/[^\s]*\/\u2026/i.test(text)) return true; // Detecting URLs with /… somewhere in the path
  return false;
}

/** Removes truncated URLs, replaces with ellipsis */
function removeTruncatedUrl(text: any): string {
  if (!text || typeof text !== "string") return text;
  var result = text;
  result = result.replace(/https?:\/\/[^\s]*\u2026[^\s]*/gi, "\u2026"); // Removing the complete URL with ellipsis anywhere in it
  result = result.replace(/(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z0-9][^\s]*\u2026[^\s]*/gi, "\u2026"); // Removing incomplete URLs without protocol: "www.example.…rest"
  result = result.replace(/\u2026+/g, "\u2026"); // Normalization of multiple ellipses
  return result.trim();
}

/** Returns string or empty string if invalid */
function safeString(value: any): string { return (typeof value === "string") ? value : ""; }

// CONTENT VALIDATION AND FILTERING FUNCTIONS //
/** Checks for banned content using FilterRule system */
function hasBannedContent(str: string): boolean {
  if (!str || !SETTINGS.PHRASES_BANNED || SETTINGS.PHRASES_BANNED.length === 0) { return false; }
  for (var i = 0; i < SETTINGS.PHRASES_BANNED.length; i++) {
    const rule = SETTINGS.PHRASES_BANNED[i];
    if (!rule) continue;
    if (matchesFilterRule(str, rule)) return true;
  }
  return false;
}

/** Checks for required keywords using FilterRule system */
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

/** Checks if string contains http:// or https:// */
function hasUrl(str: string): boolean { return isValidString(str) && REGEX_PATTERNS.URL_PROTOCOL.test(str); }

/** Checks if string is empty or "(none)" */
function isEmpty(str: string): boolean { return !str || str === "(none)" || str.trim() === ""; }

/** Checks if post is a quote (platform-specific) */
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

/** Detects replies starting with @username (excludes RT) */
function isReply(str: string): boolean {
  if (!str) return false;
  const trimmed = str.trim();
  if (REGEX_PATTERNS.RT_PREFIX.test(trimmed)) return false;
  return REGEX_PATTERNS.REPLY_START.test(trimmed);
}

/** Checks if string starts with "RT @" */
function isRepost(str: string): boolean { return str ? REGEX_PATTERNS.REPOST_PREFIX.test(str) : false; }

/** Checks if repost is self-repost */
function isSelfRepost(str: string, author: string): boolean {
  if (!str || !author) return false;
  const name = author.startsWith("@") ? author.substring(1) : author;
  const escapedName = escapeRegExp(name);
  const regex = new RegExp("^RT (?:by )?@" + escapedName + ": ", "i");
  return regex.test(str);
}

/** Validates usable image URL */
function isValidImageUrl(str: string): boolean {
  if (!isValidString(str) || str === "https://ifttt.com/images/no_image_card.png") { return false; }
  if (str.endsWith("/photo/1") || str.endsWith("/video/1")) { return false; }
  return REGEX_PATTERNS.URL_PROTOCOL.test(str);
}

/** Evaluates unified filter (content/username/domain with regex) */
function matchesUnifiedFilter(str: string, rule: FilterRule, matchType: "or" | "and" | "not"): boolean {
  if (!str) return false;
  const lowerStr = str.toLowerCase();
  var results: boolean[] = [];

  // Process literal arrays (content, username, domain)
  var literalArrays = [rule.content, rule.username, rule.domain];
  for (var a = 0; a < literalArrays.length; a++) {
    var arr = literalArrays[a];
    if (arr && arr.length > 0) { for (var i = 0; i < arr.length; i++) { results.push(lowerStr.includes(arr[i].toLowerCase())); } }
  }

  // Process regex arrays (contentRegex, usernameRegex, domainRegex)
  var regexArrays = [rule.contentRegex, rule.usernameRegex, rule.domainRegex];
  for (var a = 0; a < regexArrays.length; a++) {
    var arr = regexArrays[a];
    if (arr && arr.length > 0) {
      for (var i = 0; i < arr.length; i++) {
        try { results.push(new RegExp(arr[i], "i").test(str)); }
        catch (e) { results.push(false); }
      }
    }
  }

  if (results.length === 0) return false;

  // Evaluate based on match type
  if (matchType === "or") { for (var i = 0; i < results.length; i++) { if (results[i]) return true; } return false; }
  if (matchType === "and") { for (var i = 0; i < results.length; i++) { if (!results[i]) return false; } return true; }
  // "not": none should be true
  for (var i = 0; i < results.length; i++) { if (results[i]) return false; } return true;
}

/** Checks if string matches FilterRule */
function matchesFilterRule(str: string, rule: string | FilterRule): boolean {
  if (!str) return false; // An empty input never matches
  const lowerStr = str.toLowerCase();
  if (typeof rule === "string") { return lowerStr.includes(rule.toLowerCase()); } // SIMPLE STRING - case-insensitive substring match
  if (typeof rule !== "object") return false; // OBJECT VALIDATION

  switch (rule.type) { // PROCESSING BY RULE TYPE
    case "literal": // LITERAL: Case-insensitive substring match
      if (!rule.pattern) return false;
      return lowerStr.includes(rule.pattern.toLowerCase());
    case "regex": // REGEX: Regular expression matching
      if (!rule.pattern) return false;
      try {
        const regex = new RegExp(rule.pattern, rule.flags || "i");
        return regex.test(str);
      } catch (e) { return false; }
    case "and": return matchesUnifiedFilter(str, rule, "and"); // AND: All conditions in unified structure must match
    case "or": return matchesUnifiedFilter(str, rule, "or"); // OR: At least one condition in unified structure must match
    case "not": return matchesUnifiedFilter(str, rule, "not"); // NOT: Inverts unified structure result
    case "complex": // COMPLEX: Combines multiple rules using AND/OR
      if (!rule.rules || rule.rules.length === 0) return false;
      if (!rule.operator) return false;
      if (rule.operator === "and") { // AND logic: All nested rules must be satisfied
        for (var i = 0; i < rule.rules.length; i++) { if (!matchesFilterRule(str, rule.rules[i])) { return false; } }
        return true;
      }
      if (rule.operator === "or") { // OR logic: At least one nested rule must be satisfied
        for (var i = 0; i < rule.rules.length; i++) { if (matchesFilterRule(str, rule.rules[i])) { return true; } }
        return false;
      }
      return false;
  }
  return false;
}

// TEXT PROCESSING AND NORMALIZATION FUNCTIONS //
/** Applies CONTENT_REPLACEMENTS regex rules */
function applyContentReplacements(str: string): string {
  if (!str) return "";
  const patterns = SETTINGS.CONTENT_REPLACEMENTS;
  if (!patterns || patterns.length === 0) return str;

  var result = str;
  for (var i = 0; i < patterns.length; i++) {
    const replacementRule = patterns[i];
    try {
      const pattern = replacementRule.literal ? escapeRegExp(replacementRule.pattern) : replacementRule.pattern;
      const flags = (replacementRule.flags || "gi").replace(/[^gimuy]/g, "");
      const regex = new RegExp(pattern, flags);
      result = result.replace(regex, replacementRule.replacement);
    } catch (e) { continue; }
  }
  return result;
}

/** Decodes numeric HTML entities */
function decodeNumericEntities(str: string): string {
  if (!str || !str.includes("&#")) return str;
  return str.replace(/&#(?:x([0-9a-fA-F]+)|(\d+));/gi, function(m: string, hex: string, dec: string): string { return codePointToChar(parseInt(hex || dec, hex ? 16 : 10)); });
}

/** Finds all pattern occurrences with positions */
function findAllOccurrences(text: string, pattern: RegExp): Array < { value: string;start: number;end: number } > {
  if (!text) return [];
  const results: Array < { value: string;start: number;end: number } > = [];
  var match;
  pattern.lastIndex = 0;
  while ((match = pattern.exec(text)) !== null) { results.push({ value: match[0], start: match.index, end: match.index + match[0].length }); } return results;
}

/** Removes duplicate placeholders */
function deduplicatePlaceholder(text: string, placeholder: string): string {
  if (!text || !placeholder) return text;
  const escapedPlaceholder = escapeRegExp(placeholder);
  const dedupPattern = new RegExp("(" + escapedPlaceholder + ")(\\s+" + escapedPlaceholder + ")+", "g");
  return text.replace(dedupPattern, "$1");
}

/** Removes duplicate PREFIX_POST_URL, normalizes whitespace */
function deduplicatePrefix(text: string, prefix: string): string {
  if (!text || !prefix) return text;
  const urls = findAllOccurrences(text, REGEX_PATTERNS.URL_MATCH);
  if (urls.length === 0) return text;

  const lastUrl = urls[urls.length - 1];
  const beforeLastUrl = text.substring(0, lastUrl.start);
  const afterLastUrl = text.substring(lastUrl.start);
  var textPart = beforeLastUrl;

  // Remove consecutive PREFIX_POST_URL (before trimming whitespace)
  while (textPart.length >= prefix.length && textPart.substring(textPart.length - prefix.length) === prefix) { textPart = textPart.substring(0, textPart.length - prefix.length); }
  // NOW remove any remaining trailing whitespace
  textPart = textPart.replace(/\s+$/, "");
  // Add exactly one PREFIX_POST_URL
  return textPart + prefix + afterLastUrl;
}

/** Removes duplicate URLs from the end of the status text */
function deduplicateUrls(text: string): string {
  if (!text) return text;
  const urls = findAllOccurrences(text, REGEX_PATTERNS.URL_MATCH);
  if (urls.length < 2) return text;

  function normalizeUrl(url: string): string { return url.replace(/\/$/, ""); }

  // Work backwards from the end, removing duplicate URLs
  var result = text;
  var changed = true;

  while (changed) {
    changed = false;
    const currentUrls = findAllOccurrences(result, REGEX_PATTERNS.URL_MATCH);
    if (currentUrls.length < 2) break;

    // Get last two URLs
    const lastUrl = currentUrls[currentUrls.length - 1];
    const secondLastUrl = currentUrls[currentUrls.length - 2];

    // Check if they are identical (after normalization)
    if (normalizeUrl(lastUrl.value) === normalizeUrl(secondLastUrl.value)) {
      const betweenText = result.substring(secondLastUrl.end, lastUrl.start);
      if (/^\s*$/.test(betweenText)) {
        result = result.substring(0, secondLastUrl.end); // Remove whitespace + last URL
        changed = true;
      }
    }
  }
  return result;
}

/** Moves first URL to end of string */
function moveUrlToEnd(str: string): string {
  if (!str) return "";
  const match = str.match(REGEX_PATTERNS.URL_MATCH);
  if (!match || !match[0]) return str;
  const url = match[0];
  const withoutUrl = str.replace(url, "").trim();
  return withoutUrl ? withoutUrl + " " + url : url;
}

/** Removes HTML, decodes entities, normalizes whitespace */
function normalizeHtml(str: string): string {
  if (!str) return "";
  const TEMP_NEWLINE = "TEMP_NL_MARKER";

  // Extract text from anchor tags, discard href URLs (prevents URL duplication, preserves readable text)
  str = str.replace(REGEX_PATTERNS.ANCHOR_TAG, function(match: string, hrefUrl: string, linkText: string): string { const cleanText = linkText.replace(/<[^>]+>/g, "").trim(); return cleanText || ""; }); // Remove nested HTML, return clean text

  // Single-pass HTML cleanup
  str = str.replace(REGEX_PATTERNS.HTML_CLEANUP, function(match: string, lineBreak: string, tag2: string, headingTag: string, otherTag: string, newline: string): string {
    if (lineBreak) return "\n";
    if (headingTag) return "\n\n";
    if (otherTag) return "";
    if (newline) return TEMP_NEWLINE;
    return match;
  });

  str = str.replace(/\+/g, "\uFE62");  // Protect plus signs during entity processing

  // Only apply entity processing if entities are detected
  if (str.includes('&') || str.includes('&#')) {
    str = decodeNumericEntities(str); // Decode numeric entities FIRST (before CHAR_MAP)
    // Single-pass replacement using pre-compiled regex (replaces 70+ iterations)
    str = str.replace(CHAR_MAP_REGEX, function(match: string): string { return CHAR_MAP[match] || match; });
  }

  // Restore temporary newline markers
  str = str.split(TEMP_NEWLINE).join("\n");
  // Normalize ellipsis and whitespace
  str = str.replace(REGEX_PATTERNS.ELLIPSIS_NORMALIZE, "\u2026");
  str = str.replace(REGEX_PATTERNS.WHITESPACE, function(match: string, eolGroup: string): string { return eolGroup ? "\n\n" : " "; });
  return str.trim();
}

/** Replaces & with safe char, preserves URLs */
function processAmpersands(str: string): string {
  if (!str) return "";

  return str.replace(REGEX_PATTERNS.URL_IN_WORD, function(word: string): string {
    if (!hasUrl(word)) return word;
    const isExcluded = SETTINGS.URL_NO_TRIM_DOMAINS.some(function(domain: string): boolean { return word.toLowerCase().includes(domain.toLowerCase()); });
    if (isExcluded) { return word.replace(/&/g, "%26"); }
    return encodeURI(trimUrlQuery(word));
  });
}

/** Detects incomplete URL at end */
function hasIncompleteUrlAtEnd(str: string): boolean {
  if (!str) return false;
  if (/https?:\/\/[^\s]*\.$/.test(str)) return true; // URL ending with dot: "https://www.instagram."
  if (/https?:\/\/[a-zA-Z]{1,4}$/.test(str)) return true; // Very short domain: "https://www" or "https://in"
  if (/https?:\/\/[a-zA-Z0-9-]+\.[a-zA-Z]{1,2}$/.test(str)) return true; // Incomplete TLD (1-2 chars): "https://instagram.c"
  if (/https?:\/\/www\.[a-zA-Z0-9-]{1,10}$/.test(str)) return true; // Incomplete after www: "https://www.inst"
  if (/https?:\/\/[^\s]+\/[a-zA-Z]{1,2}$/.test(str)) return true; // Short path segment: "https://domain.com/ab"
  if (REGEX_PATTERNS.URL_FRAG.test(str)) return true; // Protocol fragments: "h…" "ht…" "http…" "https…"
  return false;
}

/** Removes incomplete URL from end after trimming */
function removeIncompleteUrlFromEnd(str: string): string {
  if (!str) return "";
  str = str.replace(REGEX_PATTERNS.URL_FRAG, ""); // Remove protocol fragments with ellipsis first

  // Find last URL protocol
  const httpIndex = str.lastIndexOf("http://");
  const httpsIndex = str.lastIndexOf("https://");
  const urlStartIndex = Math.max(httpIndex, httpsIndex);
  // If no URL protocol found, return original string
  if (urlStartIndex === -1) return str;
  // Check if URL is preceded by space or is at start
  const hasSpaceBefore = urlStartIndex === 0 || /\s/.test(str.charAt(urlStartIndex - 1));
  if (!hasSpaceBefore) { return str; } // URL is embedded in text without space (unlikely but handle it)
  // Extract everything from URL start to end
  const potentialUrl = str.substring(urlStartIndex);
  // Complete URL ends with alphanumeric, slash, hyphen, underscore, or tilde
  const isLikelyComplete = /https?:\/\/[a-zA-Z0-9-]+\.[a-zA-Z]{3,}(?:\/[^\s]*)?[a-zA-Z0-9\/_\-~]$/.test(potentialUrl);
  if (isLikelyComplete) { return str; } // URL looks complete, keep it
  // Remove incomplete URL
  const textBeforeUrl = str.substring(0, urlStartIndex).trim();
  return textBeforeUrl;
}

/** Trims to POST_LENGTH with smart ellipsis + URL protection */
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

    // Remove trailing TCO_REPLACEMENT for terminator check
    var strForCheck = str;
    if (SETTINGS.TCO_REPLACEMENT) {
      const escapedPlaceholder = escapeRegExp(SETTINGS.TCO_REPLACEMENT);
      const trailingPlaceholderRegex = new RegExp(escapedPlaceholder + "$");
      strForCheck = str.replace(trailingPlaceholderRegex, "").trim();
    }
    const hasTerminator = REGEX_PATTERNS.URL_TERMINATOR.test(strForCheck) || REGEX_PATTERNS.EMOJI.test(strForCheck.slice(-4)) || REGEX_PATTERNS.TERMINATOR_CHECK.test(strForCheck) || /\s>>$/.test(strForCheck);
    if (str.length >= threshold && str.length <= SETTINGS.POST_LENGTH && !hasTerminator) {
      str += "\u2026";
      needsEllipsis = true;
    }
  }

  // Trim content if it exceeds POST_LENGTH
  if (str.length > SETTINGS.POST_LENGTH) {
    if (SETTINGS.POST_LENGTH_TRIM_STRATEGY === "sentence") {
      const lastPeriod = findLastSentenceEnd(str, SETTINGS.POST_LENGTH);
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
      const lastPeriod = findLastSentenceEnd(str, SETTINGS.POST_LENGTH);
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
    } else { // "word" strategy
      const lastSpace = str.slice(0, SETTINGS.POST_LENGTH - 1).lastIndexOf(" ");
      str = lastSpace > 0 ? str.slice(0, lastSpace) : str.slice(0, SETTINGS.POST_LENGTH - 1);
      needsEllipsis = true;
    }
  }

  if (hasIncompleteUrlAtEnd(str)) { // Remove incomplete URLs that may result from trimming long links
    str = removeIncompleteUrlFromEnd(str);
    str = str.trim();
    needsEllipsis = true; // Mark that we need ellipsis since we removed content
  }

  if (SETTINGS.POST_FROM !== "TW" && needsEllipsis) { // Add ellipsis if needed
    const hasSimpleTerminator = REGEX_PATTERNS.TERMINATOR_CHECK.test(str);
    if (!hasSimpleTerminator && !str.endsWith("\u2026")) { str += "\u2026"; }
  }
  return { content: str, needsEllipsis: needsEllipsis };
}

/** Removes query string from URL */
function trimUrlQuery(url: string): string {
  if (!url) return "";
  const qIndex = url.indexOf("?");
  return qIndex === -1 ? url : url.substring(0, qIndex);
}

// EXTRACTION FUNCTIONS //
/** Extracts real author name from TweetEmbedCode */
function extractRealName(embedCode: string): string {
  if (!embedCode) return "";
  try {
    const match = embedCode.match(REGEX_PATTERNS.REAL_NAME);
    return match && match[1] ? match[1].trim() : "";
  } catch (e) { return ""; }
}

/** Extracts first Twitter URL from href attribute */
function extractRepostUrl(str: string): string {
  if (!str) return "";
  REGEX_PATTERNS.REPOST_URL.lastIndex = 0;
  const match = REGEX_PATTERNS.REPOST_URL.exec(str);
  return match && match[1] ? match[1] : "";
}

/** Extracts @username from "RT @..." */
function extractRepostUser(str: string): string {
  if (!str) return "";
  REGEX_PATTERNS.REPOST_USER.lastIndex = 0;
  const match = REGEX_PATTERNS.REPOST_USER.exec(str);
  return match && match[1] ? match[1] : "";
}

/** Extracts tweet text from <p> tag */
function extractTweetText(embedCode: string): string {
  if (!embedCode) return "";
  try {
    const match = embedCode.match(REGEX_PATTERNS.TWEET_TEXT);
    return match && match[1] ? match[1].trim() : "";
  } catch (e) { return ""; }
}

/** Extracts username from Twitter status URL */
function extractUsername(url: string): string {
  if (!url) return "";
  const match = url.match(REGEX_PATTERNS.USERNAME_EXTRACT);
  return match && match[1] ? match[1] : "";
}

// FORMATTING FUNCTIONS //
/** Formats @mentions per platform */
function formatMentions(str: string, skipName: string, platform: string): string {
  if (!str) return "";
  const format = SETTINGS.MENTION_FORMATTING[platform] || SETTINGS.MENTION_FORMATTING["DEFAULT"] || { type: "none", value: "" };
  if (format.type === "none" || !format.value) return str;
  const skipClean = skipName ? (skipName.startsWith("@") ? skipName.substring(1) : skipName) : "";

  // Captures character before @ (if any) and username
  var pattern = "(^|[^a-zA-Z0-9@])@";
  if (skipClean) { pattern += "(?!(?:" + escapeRegExp(skipClean) + ")\\b)"; }
  pattern += "([a-zA-Z0-9_.]+)\\b";

  try {
    const regex = new RegExp(pattern, "gi");
    return str.replace(regex, function(match: string, prefix: string, username: string, offset: number, fullStr: string): string {
      if (format.type === "prefix") {
        var result = prefix + format.value + username;
        var nextCharIndex = offset + match.length;
        if (nextCharIndex < fullStr.length) {
          var nextChar = fullStr.charAt(nextCharIndex);
          if (nextChar === 'h' && fullStr.substring(nextCharIndex).match(/^https?:\/\//)) { result += " "; }
        }
        return result;
      }
      return prefix + match.substring(prefix.length) + format.value;
    });
  } catch (e) { return str; }
}

/** Formats quote post with author attribution */
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

/** Formats retweet by replacing "RT @..." prefix */
function formatRepost(content: string, author: string, authorUsername: string, repostedUser: string): string {
  const currentUser = authorUsername.startsWith("@") ? authorUsername.substring(1) : authorUsername;
  const repostedClean = repostedUser.startsWith("@") ? repostedUser.substring(1) : repostedUser;
  const isSelf = repostedClean.toLowerCase() === currentUser.toLowerCase();  
  var mention = isSelf ? SETTINGS.PREFIX_SELF_REFERENCE : repostedUser;
  
  // For RSS: swap author and mention (display retweeter + link to original author)
  var displayAuthor = author;
  if (SETTINGS.POST_FROM === "RSS") { displayAuthor = repostedClean; mention = isSelf ? SETTINGS.PREFIX_SELF_REFERENCE : ("@" + currentUser); }
  
  return content.replace(REGEX_PATTERNS.REPOST_PREFIX, displayAuthor + SETTINGS.PREFIX_REPOST + mention + ":\n");
}

/** Removes "R to @username: " prefix */
function removeReplyPrefix(str: string): string { return str.replace(REGEX_PATTERNS.RESPONSE_PREFIX, ""); }

// CONTENT SELECTION AND COMPOSITION FUNCTIONS //
/** Composes final content: processContent + formatMentions */
function composeContent(title: string, author: string, feedTitle: string, rawContent: any, imageUrl: string): ProcessedContent {
  const platform = SETTINGS.POST_FROM;

  var wasRssTruncated = false;
  if (platform === "RSS") {
    const truncResult = truncateRssInput(rawContent);
    rawContent = truncResult.content;
    wasRssTruncated = truncResult.wasTruncated;
  }

  const trimmedTitle = (title || "").trim();
  const trimmedFeed = (feedTitle || "").trim();
  
  // Normalize duplicate RT prefixes for RSS (rss.app bug)
  var normalizedTitle = trimmedTitle;
  if (platform === "RSS" && isRepost(trimmedTitle)) { normalizedTitle = trimmedTitle.replace(/^(RT (?:by )?@[^:]+:\s*)(RT (?:by )?@[^:]+:\s*)+/i, "$1"); }
  
  if (isEmpty(rawContent) && isEmpty(normalizedTitle)) { return { content: "", feedAuthor: "", userNameToSkip: "", wasRssTruncated: false }; }
  const processed = processContent(rawContent, normalizedTitle, trimmedFeed, imageUrl, author, wasRssTruncated);

  if (processed.userNameToSkip) {
    return {
      content: formatMentions(processed.content, processed.userNameToSkip, SETTINGS.POST_FROM),
      feedAuthor: processed.feedAuthor,
      userNameToSkip: processed.userNameToSkip,
      wasRssTruncated: wasRssTruncated
    };
  }
  return { content: processed.content, feedAuthor: processed.feedAuthor, userNameToSkip: processed.userNameToSkip, wasRssTruncated: wasRssTruncated };
}

/** Composes final status with deduplication */
function composeStatus(content: string, entryUrl: string, imageUrl: string, title: string, author: string, wasRssTruncated: boolean): string {
  content = content || "";
  const status = processStatus(content, entryUrl, imageUrl, title, author, wasRssTruncated);
  const resultImageUrl = typeof imageUrl === "string" ? processUrl(imageUrl) : "";

  // Display imageUrl based on platform and type
  var imageStatus = "";
  if (SETTINGS.POST_FROM === "TW") { // Twitter platform
    if (!isValidImageUrl(imageUrl) && typeof imageUrl === "string" && (imageUrl.endsWith("/photo/1") || imageUrl.endsWith("/video/1"))) { // Twitter media
      imageStatus = SETTINGS.SHOW_IMAGEURL ? SETTINGS.PREFIX_IMAGE_URL + resultImageUrl : "";
    } else if (isValidImageUrl(imageUrl)) { // Twitter external link - display with FORCE_SHOW_ORIGIN_POSTURL
      if (SETTINGS.FORCE_SHOW_ORIGIN_POSTURL) { imageStatus = SETTINGS.PREFIX_POST_URL + resultImageUrl; }
    }
  } else { // Other platforms (BS, RSS, YT)
    if (isValidImageUrl(imageUrl)) { imageStatus = SETTINGS.SHOW_IMAGEURL ? SETTINGS.PREFIX_IMAGE_URL + resultImageUrl : ""; }
  }
  const finalUrl = (status.urlToShow && typeof status.urlToShow === "string") ? SETTINGS.PREFIX_POST_URL + processUrl(status.urlToShow) : "";

  var finalContent = status.trimmedContent;
  // Compose the final status
  const composedStatus = finalContent + imageStatus + finalUrl;
  // Apply all deduplications in correct order on the complete status
  var result = composedStatus;
  // Deduplicate URLs at the end (without normalizing prefix)
  result = deduplicateUrls(result);
  // Deduplicate TCO_REPLACEMENT placeholders (Twitter only)
  if (SETTINGS.POST_FROM === "TW" && SETTINGS.TCO_REPLACEMENT) { result = deduplicatePlaceholder(result, SETTINGS.TCO_REPLACEMENT); }
  // Deduplicate PREFIX_POST_URL and normalize whitespace before last URL
  if (SETTINGS.PREFIX_POST_URL) { result = deduplicatePrefix(result, SETTINGS.PREFIX_POST_URL); }
  return result;
}

/** Processes raw content: platform rules, HTML cleanup, URL handling */
function processContent(rawContent: any, title: string, feedTitle: string, imageUrl: string, author: string, wasRssTruncated: boolean): ProcessedContent {
  const platform = SETTINGS.POST_FROM;
  const config = getPlatformConfig(platform);
  const trimmedTitle = (title || "").trim();
  const trimmedFeed = (feedTitle || "").trim();

  var content = "";
  var feedAuthor = "";
  var feedUsername = "";
  var skipName = "";

  if (config.useFeedTitleAuthor) {
    if (platform === "BS") {
      const sep = trimmedFeed.indexOf(" - ");
      feedUsername = sep !== -1 ? trimmedFeed.substring(0, sep) : trimmedFeed;
      const realName = sep !== -1 ? trimmedFeed.substring(sep + 3) : trimmedFeed;
      feedAuthor = SETTINGS.SHOW_REAL_NAME ? realName : feedUsername;
    } else {
      feedUsername = trimmedFeed;
      const realName = extractRealName(rawContent) || feedUsername;
      feedAuthor = SETTINGS.SHOW_REAL_NAME ? realName : feedUsername;
    }
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

  // This ensures ellipsis (…) is detected before URL encoding turns it into %E2%80%A6
  if (hasTruncatedUrl(content)) { content = removeTruncatedUrl(content); }
  content = processAmpersands(content);
  // Platform-specific content modifications
  if (SETTINGS.MOVE_URL_TO_END) { content = moveUrlToEnd(content); }
  if (config.handleReplies) { content = removeReplyPrefix(content); }
  if (config.handleRetweets && isRepost(trimmedTitle)) {
    const repostedUser = extractRepostUser(trimmedTitle);
    content = formatRepost(content, feedAuthor, feedUsername || author, repostedUser);
  }
  if (config.handleQuotes && isQuote(content, imageUrl, platform, author)) { content = formatQuote(content, feedAuthor, feedUsername, platform, imageUrl); }
  // Replace t.co shortened links with placeholder (Twitter only) - must be before applyContentReplacements
  if (platform === "TW" && SETTINGS.TCO_REPLACEMENT) {
    // Get first character of TCO_REPLACEMENT (handling surrogate pairs for emoji)
    const firstCharMatch = SETTINGS.TCO_REPLACEMENT.match(/^(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.)/);
    const firstChar = firstCharMatch ? firstCharMatch[0] : "";
    if (firstChar) { content = content.replace(new RegExp(escapeRegExp(firstChar) + "\\s+(?=https?:\\/\\/t\\.co\\/)", "g"), ""); }
    // Then replace t.co shortened links with placeholder
    content = content.replace(REGEX_PATTERNS.TCO_URL, SETTINGS.TCO_REPLACEMENT);
  }
  // Apply content replacements as final step to work on fully processed output
  content = applyContentReplacements(content);
  return { content: content, feedAuthor: feedAuthor, userNameToSkip: skipName, wasRssTruncated: wasRssTruncated };
}

/** Processes status: platform logic, trimming, URL selection */
function processStatus(content: string, entryUrl: string, imageUrl: string, title: string, author: string, wasRssTruncated: boolean): ProcessedStatus {
  const platform = SETTINGS.POST_FROM;
  const isQuoteTweet = isQuote(content, imageUrl, platform, author);
  const trimmed = trimContent(content, wasRssTruncated);
  var trimmedContent = trimmed.content;
  var needsEllipsis = trimmed.needsEllipsis;
  var showUrl = SETTINGS.FORCE_SHOW_ORIGIN_POSTURL || needsEllipsis;

  if (platform === "BS") { showUrl = showUrl || isQuote(content, "", "BS", ""); }

  if (platform === "RSS") { showUrl = true; }

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
      // Prioritize entryUrl when FORCE_SHOW_ORIGIN_POSTURL is enabled
      if (SETTINGS.FORCE_SHOW_ORIGIN_POSTURL || isQuoteTweet) {
        urlToShow = entryUrl;
      } else {
        urlToShow = hasImage ? imageUrl : entryUrl;
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

/** URL processing: replaces domains, trims/encodes */
function processUrl(url: string): string {
  url = safeString(url);
  if (!url || url === "(none)") return "";
  url = url.trim();
  // URL domain replacement logic (array of domains)
  if (SETTINGS.URL_REPLACE_FROM && SETTINGS.URL_REPLACE_FROM.length > 0) {
    for (var i = 0; i < SETTINGS.URL_REPLACE_FROM.length; i++) {
      const domain = SETTINGS.URL_REPLACE_FROM[i];
      if (domain && typeof domain === "string") {
        const pattern = escapeRegExp(domain);
        if (pattern) {
          const regex = new RegExp(pattern, "gi");
          url = url.replace(regex, SETTINGS.URL_REPLACE_TO);
        }
      }
    }
  }
  return processAmpersands(url);
}

/** Selects primary content source */
function selectContent(content: any, title: any): string {
  // For RSS AND YOUTUBE: combine title and content if enabled
  if ((SETTINGS.POST_FROM === "RSS" || SETTINGS.POST_FROM === "YT") && SETTINGS.COMBINE_TITLE_AND_CONTENT) {
    const titleStr = safeString(title);
    const contentStr = normalizeHtml(safeString(content));
    if (titleStr && contentStr) { return titleStr + SETTINGS.CONTENT_TITLE_SEPARATOR + contentStr; }
    return titleStr || contentStr || "";
  }
  if (SETTINGS.SHOW_TITLE_AS_CONTENT) { return title || ""; }
  const contentEmpty = typeof content !== "string" || isEmpty(content);
  return contentEmpty ? (title || "") : content;
}

/** Determines if post should be skipped */
function shouldSkip(content: any, title: string, url: string, imageUrl: string, author: string): { skip: boolean;reason: string } {
  if (isEmpty(content) && isEmpty(title) && isEmpty(url)) { return { skip: true, reason: "Empty content, title and URL" }; }
  if (isRepost(title) && !isSelfRepost(title, author) && !SETTINGS.REPOST_ALLOWED) { return { skip: true, reason: "External repost not allowed" }; }
  if (SETTINGS.PHRASES_BANNED && SETTINGS.PHRASES_BANNED.length > 0) { if (hasBannedContent(title) || hasBannedContent(content) || hasBannedContent(url) || hasBannedContent(imageUrl)) { return { skip: true, reason: "Contains banned phrases" }; } }
  if (SETTINGS.PHRASES_REQUIRED && SETTINGS.PHRASES_REQUIRED.length > 0) { if (!hasRequiredKeywords(title) && !hasRequiredKeywords(content)) { return { skip: true, reason: "Missing mandatory keywords" }; } }
  if (isReply(title) || isReply(content)) { return { skip: true, reason: "Reply post (starts with @username)" }; }
  return { skip: false, reason: "" };
}

// MAIN EXECUTION LOGIC //
const skipCheck = shouldSkip(entryContent, entryTitle, entryUrl, entryImageUrl, entryAuthor);
if (skipCheck.skip) {
  MakerWebhooks.makeWebRequest.skip("Skipped due to filter rules: " + skipCheck.reason);
} else {
  const processed = composeContent(entryTitle, entryAuthor, feedTitle, entryContent, entryImageUrl);
  const finalStatus = composeStatus(processed.content, entryUrl, entryImageUrl, (SETTINGS.POST_FROM === "RSS" && SETTINGS.COMBINE_TITLE_AND_CONTENT) ? "" : entryTitle, entryAuthor, processed.wasRssTruncated);
  MakerWebhooks.makeWebRequest.setBody("status=" + finalStatus);
}