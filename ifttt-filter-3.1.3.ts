///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋📙📗📘𝕏📺 webhook filter v3.1.3 - Doctor Who Day, Nov 23rd, 2025
///////////////////////////////////////////////////////////////////////////////
//
// Processes and filters posts from various platforms (Twitter, Bluesky, RSS, YouTube)
// for IFTTT webhook publishing. Applies normalization, formatting, shortening,
// and platform-specific rules based on settings.
//
///////////////////////////////////////////////////////////////////////////////

// Filter rule definition for advanced filtering logic
interface FilterRule { type: "literal" | "regex" | "and" | "or" | "not" | "complex"; pattern?: string; keywords?: string[]; flags?: string;
  rule?: FilterRule;                                // For NOT rule (legacy support)
  operator?: "and" | "or"; rules?: FilterRule[];    // For COMPLEX rule
  content?: string[]; contentRegex?: string[];      // Literal content matches and Regex content patterns
  username?: string[]; usernameRegex?: string[];    // Literal username matches and Regex username patterns
  domain?: string[]; domainRegex?: string[];        // Literal domain matches and Regex domain patterns
}

// Type definitions for Object.entries (standard augmentation)
interface ObjectConstructor { entries < T > (o: { [s: string]: T } | ArrayLike < T > ): [string, T][]; }

// Type definitions for Platform configurations
interface PlatformConfig { useParsedText ? : boolean; useFeedTitleAuthor ? : boolean; handleReplies ? : boolean; handleRetweets ? : boolean; handleQuotes ? : boolean; useGetContent ? : boolean; }

// Type definitions for processed content result
interface ProcessedContent { content: string; feedAuthor: string; userNameToSkip: string; }

// Type definitions for processed status result
interface ProcessedStatus { trimmedContent: string; needsEllipsis: boolean; urlToShow: string; }

// Type definitions for string manipulation (standard augmentation)
interface String { startsWith(searchString: string, position ? : number): boolean; endsWith(searchString: string, endPosition ? : number): boolean; }

// Array.from polyfill (ES6 feature, runtime check for ES5 compatibility)
interface ArrayConstructor { from < T > (arrayLike: ArrayLike < T > ): T[]; from < T, U > (arrayLike: ArrayLike < T >, mapfn: (v: T, k: number) => U, thisArg ? : any): U[]; }

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
  BS: { useFeedTitleAuthor: true, handleQuotes: true, useGetContent: true },
  RSS: { useGetContent: true },
  TW: { useParsedText: true, handleReplies: true, handleRetweets: true, handleQuotes: true },
  YT: { useGetContent: true }
};

/** Character map: HTML entities → Unicode */
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
   "&nbsp;": " ",                             // Non-breaking space - VERY common
   "&hellip;": "…",                           // Ellipsis - common in articles
   "&mdash;": "—", "&ndash;": "–",            // Em dash and En dash
   "&lt;": "<", "&gt;": ">",                  // Less than and Greater than - HTML safety
   "&quot;": '"',                             // Quotation mark - HTML safety
   "&apos;": "'",                             // Apostrophe - HTML safety
   
   // --- Tier 2: IMPORTANT named entities (probable in Czech/Slovak RSS) ---
   "&euro;": "€",                             // Euro sign - very common
   "&pound;": "£",                            // British pound
   "&yen;": "¥",                              // Japanese yen
   "&cent;": "¢",                             // Cent
   "&copy;": "©",                             // Copyright - common
   "&reg;": "®",                              // Registered trademark - common
   "&trade;": "™",                            // Trademark
   "&deg;": "°",                              // Degree symbol (temperatures!)
   "&plusmn;": "±",                           // Plus-minus
   "&times;": "×",                            // Multiplication
   "&divide;": "÷",                           // Division
   "&frac14;": "¼",                           // 1/4 fraction
   "&frac12;": "½",                           // 1/2 fraction
   "&half;": "½",                             // 1/2 fraction (alternative)
   "&frac34;": "¾",                           // 3/4 fraction
   
   // --- Additional common symbols ---
   "&laquo;": "«", "&raquo;": "»",            // Left and Right angle quote
   "&lsquo;": "\u2018", "&rsquo;": "\u2019",  // Left and Right single quote
   "&ldquo;": "\u201C", "&rdquo;": "\u201D",  // Left and Right double quote
   "&sbquo;": "\u201A", "&bdquo;": "\u201E",  // Single and Double low-9 quotation mark
   "&prime;": "′", "&Prime;": "″",            // Prime and Double prime
   "&permil;": "‰",                           // Per mille
   "&thickapprox;": "≈",                      // Approximately equal
   "&ne;": "≠",                               // Not equal
   "&minus;": "−",                            // Minus sign
   "&bull;": "•",                             // Bullet
   "&middot;": "·",                           // Middle dot
   "&centerdot;": "·",                        // Center dot (alternative)
   "&sect;": "§",                             // Section sign
   "&para;": "¶",                             // Paragraph sign
   "&dagger;": "†", "&Dagger;": "‡",          // Dagger and Double dagger
   "&shy;": "-",                              // Soft hyphen
   
   // --- Special case: wrapped ellipsis entities ---
   "[&hellip;]": "…", "[&amp;hellip;]": "…", "&amp;hellip;": "…",
   "[&mldr;]": "…", "[&amp;mldr;]": "…", "&mldr;": "…", "&amp;mldr;": "…",
   
   // --- Ampersand variants (must be LAST to avoid replacing & in other entities) ---
   "&amp;": SETTINGS.AMPERSAND_SAFE_CHAR, "&": SETTINGS.AMPERSAND_SAFE_CHAR
 };

/** Precompiled regex patterns (TS 2.9.2 compatible) */
const REGEX_PATTERNS = {
  ANCHOR_TAG: /<a\s+[^>]*href=["']([^"']+)["'][^>]*>.*?<\/a>/gi,
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
  SPACE_BEFORE_URL: /[ \t]+(?=https?)/g,
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

// Pre-process URL_DOMAIN_FIXES: add https:// prefix + update URL_MATCH regex
(function initializeDomainFixes(): void {
  if (SETTINGS.URL_DOMAIN_FIXES && SETTINGS.URL_DOMAIN_FIXES.length > 0) {
    // Add https:// prefix to domains in content
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
    
    // Update URL_MATCH to detect domains without protocol
    const escapedDomains = SETTINGS.URL_DOMAIN_FIXES
      .filter(function(d: string): boolean { return !!d; })
      .map(function(domain: string): string { return domain.replace(/\./g, '\\.'); })
      .join("|");
    
    // Matches: URLs with protocol OR listed domains without protocol
    const pattern = "(?:https?:\\/\\/[^\\s]+|(?:" + escapedDomains + ")(?:\\/[^\\s]*)?)";
    REGEX_PATTERNS.URL_MATCH = getCachedRegex(pattern, "g");
  }
})();

///// OPTIMIZED HELPER FUNCTIONS /////
/** Escapes special chars for regex use */
function escapeRegExp(str: string): string {
  if (!str) return "";
  return getCached("escape:" + str, function(): string { return str.replace(REGEX_PATTERNS.SPECIAL_CHARS, "\\$&"); });
}

/**
 * Finds last valid period within maxLength (excludes dates, abbreviations).
 * Valid: followed by uppercase or end. Invalid: 12. listopadu, např.  */
function findLastSentenceEnd(str: string, maxLength: number): number {
  var searchText = str.slice(0, maxLength);
  var i = searchText.length - 1;
  
  // Search backwards for periods
  while (i >= 0) {
    if (searchText.charAt(i) === ".") { // Check what's AFTER the period
      var nextCharIndex = i + 1;
      var charAfterPeriod = "";
      var foundChar = false;
      
      while (nextCharIndex < str.length) { // Skip whitespace to find next character
        var c = str.charAt(nextCharIndex);
        if (c !== " " && c !== "\t" && c !== "\n") {
          charAfterPeriod = c;
          foundChar = true;
          break;
        }
        nextCharIndex++;
      }
      
      // Nothing after period (end of text)
      if (!foundChar) {
        var beforePeriod = searchText.slice(Math.max(0, i - 2), i); // Check if this is a date period (number 1-31 before it)
        var isDate = false;
        
        if (/\d{1,2}$/.test(beforePeriod)) {
          var numMatch = beforePeriod.match(/\d{1,2}$/);
          if (numMatch) {
            var num = parseInt(numMatch[0], 10);
            if (num >= 1 && num <= 31) { isDate = true; }
          }
        }
        
        if (!isDate) { return i; } // Valid terminator if not a date
        i--; continue;
      }
      
      // Lowercase letter follows - likely abbreviation or date continuation
      if (charAfterPeriod === charAfterPeriod.toLowerCase() && charAfterPeriod !== charAfterPeriod.toUpperCase()) {
        var beforePeriod = searchText.slice(Math.max(0, i - 2), i); // Check if this is a date (number 1-31 before period)
        
        if (/\d{1,2}$/.test(beforePeriod)) {
          var numMatch = beforePeriod.match(/\d{1,2}$/);
          if (numMatch) {
            var num = parseInt(numMatch[0], 10);
            if (num >= 1 && num <= 31) { i--; continue; } // This is a date like "12. listopadu" - not a sentence end
          }
        }
        i--; continue; // Not a date, but lowercase follows - abbreviation like "např."
      }
      
      // Uppercase letter follows - potential sentence end
      if (charAfterPeriod === charAfterPeriod.toUpperCase() && charAfterPeriod !== charAfterPeriod.toUpperCase().toLowerCase()) { return i; } // This IS a valid sentence terminator (uppercase follows)
      
      i--; continue; // Other character (number, punctuation, etc.) - treat as not a sentence end
    }
    i--;
  }
  
  return -1; // No valid terminator found
}

/** Generic cache with FIFO eviction */
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

/** Returns cached RegExp */
function getCachedRegex(pattern: string, flags: string): RegExp {
  const key = "regex:" + pattern + "|" + flags;
  return getCached(key, function(): RegExp { return new RegExp(pattern, flags); });
}

/** Gets platform config with RSS fallback */
function getPlatformConfig(platform: string): PlatformConfig { return platformConfigs[platform] || platformConfigs["RSS"] || {}; }

/** Validates non-empty string */
function isValidString(value: any): boolean { return typeof value === "string" && value.length > 0; }

/** Safely truncates string without breaking Unicode pairs (ES5/ES6 compatible) */
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

/** Truncates RSS input to RSS_MAX_INPUT_CHARS before HTML processing */
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

/** Detects truncated/incomplete URLs (must be called BEFORE processAmpersands) */
function hasTruncatedUrl(text: any): boolean {
  if (!text || typeof text !== "string") return false;
  
  if (/https?:\/\/[^\s]*\u2026/i.test(text)) return true; // Detection of URLs with ellipsis: "https://domain/…" or "https://domain/…/path…"
  
  if (/https?:\/\/[^\s]*\/\u2026/i.test(text)) return true; // Detecting URLs with /… somewhere in the path
  
  return false;
}

/** Removes truncated URLs and replaces with ellipsis (call BEFORE processAmpersands) */
function removeTruncatedUrl(text: any): string {
  if (!text || typeof text !== "string") return text;
  
  var result = text;
  
  result = result.replace(/https?:\/\/[^\s]*\u2026[^\s]*/gi, "\u2026"); // Removing the complete URL with ellipsis anywhere in it

  result = result.replace(/(?:www\.)?[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z0-9][^\s]*\u2026[^\s]*/gi, "\u2026"); // Removing incomplete URLs without protocol: "www.example.…rest"
  
  result = result.replace(/\u2026+/g, "\u2026");  // Normalization of multiple ellipses
  
  return result.trim();
}

/** Checks if RSS input should be truncated based on settings */
function shouldTruncateRssInput(platform: string, content: any): boolean {
  return platform === "RSS" && 
         SETTINGS.RSS_MAX_INPUT_CHARS > 0 && 
         !!content && 
         typeof content === "string" &&
         content.length > SETTINGS.RSS_MAX_INPUT_CHARS;
}

/** Returns string or empty string if invalid */
function safeString(value: any): string { return (typeof value === "string") ? value : "";}

///// CONTENT VALIDATION AND FILTERING FUNCTIONS /////
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
  const regex = getCachedRegex("^RT @" + escapedName + ": ", "i");
  return regex.test(str);
}

/** Validates usable image URL */
function isValidImageUrl(str: string): boolean {
  if (!isValidString(str) || str === "https://ifttt.com/images/no_image_card.png") { return false; }
  if (str.endsWith("/photo/1") || str.endsWith("/video/1")) { return false; }
  return REGEX_PATTERNS.URL_PROTOCOL.test(str);
}

/** Helper: Evaluates unified filter structure (content/username/domain with regex support) - NEW in v3.1.0 */
function matchesUnifiedFilter(str: string, rule: FilterRule, matchType: "or" | "and" | "not"): boolean {
  if (!str) return false;
  const lowerStr = str.toLowerCase();
  var hasAnyCondition = false;
  var results: boolean[] = [];

  // Process content filters
  if (rule.content && rule.content.length > 0) {
    hasAnyCondition = true;
    for (var i = 0; i < rule.content.length; i++) { results.push(lowerStr.indexOf(rule.content[i].toLowerCase()) !== -1); }
  }

  // Process contentRegex filters
  if (rule.contentRegex && rule.contentRegex.length > 0) {
    hasAnyCondition = true;
    for (var i = 0; i < rule.contentRegex.length; i++) {
      try {
        const regex = new RegExp(rule.contentRegex[i], "i");
        results.push(regex.test(str));
      } catch (e) { results.push(false); }
    }
  }

  // Process username filters
  if (rule.username && rule.username.length > 0) {
    hasAnyCondition = true;
    for (var i = 0; i < rule.username.length; i++) { results.push(lowerStr.indexOf(rule.username[i].toLowerCase()) !== -1); }
  }

  // Process usernameRegex filters
  if (rule.usernameRegex && rule.usernameRegex.length > 0) {
    hasAnyCondition = true;
    for (var i = 0; i < rule.usernameRegex.length; i++) {
      try {
        const regex = new RegExp(rule.usernameRegex[i], "i");
        results.push(regex.test(str));
      } catch (e) { results.push(false); }
    }
  }

  // Process domain filters
  if (rule.domain && rule.domain.length > 0) {
    hasAnyCondition = true;
    for (var i = 0; i < rule.domain.length; i++) { results.push(lowerStr.indexOf(rule.domain[i].toLowerCase()) !== -1); }
  }

  // Process domainRegex filters
  if (rule.domainRegex && rule.domainRegex.length > 0) {
    hasAnyCondition = true;
    for (var i = 0; i < rule.domainRegex.length; i++) {
      try {
        const regex = new RegExp(rule.domainRegex[i], "i");
        results.push(regex.test(str));
      } catch (e) { results.push(false); }
    }
  }

  // If no conditions were defined, return false
  if (!hasAnyCondition) return false;

  // Evaluate results based on match type
  if (matchType === "or") { // OR: At least one condition must be true
    for (var i = 0; i < results.length; i++) { if (results[i]) return true; }
    return false;
  } else if (matchType === "and") { // AND: All conditions must be true
    for (var i = 0; i < results.length; i++) { if (!results[i]) return false; }
    return results.length > 0;
  } else if (matchType === "not") { // NOT: Invert OR logic (none of the conditions should be true)
    for (var i = 0; i < results.length; i++) { if (results[i]) return false; }
    return results.length > 0;
  }

  return false;
}

/** Checks if string matches FilterRule (literal/regex/AND/OR/NOT/COMPLEX) */
function matchesFilterRule(str: string, rule: string | FilterRule): boolean {
  if (!str) return false; // An empty input never matches
  
  const lowerStr = str.toLowerCase();

  if (typeof rule === "string") { return lowerStr.indexOf(rule.toLowerCase()) !== -1; } // SIMPLE STRING - case-insensitive substring match

  if (typeof rule !== "object") return false; // OBJECT VALIDATION

  switch (rule.type) { // PROCESSING BY RULE TYPE
    case "literal": // LITERAL: Case-insensitive substring match
      if (!rule.pattern) return false;
      return lowerStr.indexOf(rule.pattern.toLowerCase()) !== -1;

    case "regex": // REGEX: Regular expression matching
      if (!rule.pattern) return false;
      try {
        const regex = new RegExp(rule.pattern, rule.flags || "i");
        return regex.test(str);
      } catch (e) { return false; }
    
    case "and": // AND: All keywords must be present (legacy) OR unified structure (NEW in v3.1.0)
      // Check for unified structure first
      if (rule.content || rule.contentRegex || rule.username || rule.usernameRegex || rule.domain || rule.domainRegex) { return matchesUnifiedFilter(str, rule, "and"); }
      // Legacy: keywords array
      if (!rule.keywords || rule.keywords.length === 0) return false;
      for (var i = 0; i < rule.keywords.length; i++) { if (lowerStr.indexOf(rule.keywords[i].toLowerCase()) === -1) { return false; } }
      return true;
    
    case "or": // OR: At least one keyword must be present (legacy) OR unified structure (NEW in v3.1.0)
      // Check for unified structure first
      if (rule.content || rule.contentRegex || rule.username || rule.usernameRegex || rule.domain || rule.domainRegex) { return matchesUnifiedFilter(str, rule, "or"); }
      // Legacy: keywords array
      if (!rule.keywords || rule.keywords.length === 0) return false;
      for (var i = 0; i < rule.keywords.length; i++) { if (lowerStr.indexOf(rule.keywords[i].toLowerCase()) !== -1) { return true;  } }
      return false;

    case "not": // NOT: Inverts result (legacy/unified structure)
      // Check for unified structure first
      if (rule.content || rule.contentRegex || rule.username || rule.usernameRegex || rule.domain || rule.domainRegex) { return matchesUnifiedFilter(str, rule, "not"); }
      // Legacy: nested rule
      if (!rule.rule) return false;
      return !matchesFilterRule(str, rule.rule); // We recursively evaluate the nested rule and invert the result.
    
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

///// TEXT PROCESSING AND NORMALIZATION FUNCTIONS /////
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
      const regex = getCachedRegex(pattern, flags);
      result = result.replace(regex, replacementRule.replacement);
    } catch (e) { continue; }
  }

  return result;
}

/** Decodes numeric HTML entities (decimal/hex) with ES5 surrogate pair support */
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
      return String.fromCharCode( 0xD800 + (codePoint >> 10), 0xDC00 + (codePoint & 0x3FF) );
    }
    
    return String.fromCharCode(codePoint);
  });
  
  return str;
}

/** Removes duplicate URLs from the end of the status text */
function deduplicateTrailingUrls(text: string): string {
  if (!text) return text;
  
  // Extract all URLs from the text
  const urls: string[] = [];
  var match;
  REGEX_PATTERNS.URL_MATCH.lastIndex = 0;
  while ((match = REGEX_PATTERNS.URL_MATCH.exec(text)) !== null) { urls.push(match[0]); }
  
  if (urls.length < 2) return text; // If we have less than 2 URLs, no deduplication needed
  
  function normalizeUrl(url: string): string { return url.replace(/\/$/, ""); } // Normalize URL by removing trailing slash for comparison
  
  // Work backwards from the end, removing duplicate URLs
  var result = text;
  var changed = true;
  
  while (changed) {
    changed = false;
    
    // Re-extract URLs from current result
    const currentUrls: { url: string; index: number }[] = [];
    REGEX_PATTERNS.URL_MATCH.lastIndex = 0;
    while ((match = REGEX_PATTERNS.URL_MATCH.exec(result)) !== null) { currentUrls.push({ url: match[0], index: match.index }); }
    
    // Need at least 2 URLs to compare
    if (currentUrls.length < 2) break;
    
    // Get last two URLs
    const lastUrl = currentUrls[currentUrls.length - 1];
    const secondLastUrl = currentUrls[currentUrls.length - 2];
    
    // Check if they are identical (after normalization)
    if (normalizeUrl(lastUrl.url) === normalizeUrl(secondLastUrl.url)) {
      const betweenText = result.substring(secondLastUrl.index + secondLastUrl.url.length, lastUrl.index); // Check if there's only whitespace between them
      
      if (/^\s*$/.test(betweenText)) {
        result = result.substring(0, secondLastUrl.index + secondLastUrl.url.length); // Remove whitespace + last URL
        changed = true;
      }
    }
  }
  
  // Normalize whitespace before last URL to PREFIX_POST_URL
  const finalUrls: { url: string; index: number }[] = [];
  REGEX_PATTERNS.URL_MATCH.lastIndex = 0;
  while ((match = REGEX_PATTERNS.URL_MATCH.exec(result)) !== null) { finalUrls.push({ url: match[0], index: match.index }); }
  
  if (finalUrls.length > 0) {
    const lastFinalUrl = finalUrls[finalUrls.length - 1];
    const beforeLastUrl = result.substring(0, lastFinalUrl.index);
    const textPart = beforeLastUrl.replace(/\s+$/, ""); // Remove trailing whitespace
    result = textPart + SETTINGS.PREFIX_POST_URL + lastFinalUrl.url;
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

/** Removes HTML tags, decodes entities (numeric first, then named), normalizes whitespace */
function normalizeHtml(str: string): string {
  if (!str) return "";

  const TEMP_NEWLINE = "TEMP_NL_MARKER";

  // Extract href URLs from anchor tags before HTML cleanup (prevents URL duplication)
  str = str.replace(REGEX_PATTERNS.ANCHOR_TAG, function(match: string, hrefUrl: string): string {return hrefUrl || ""; }); // Replace entire <a href="URL">text</a> with just the URL from href attribute

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
    str = decodeNumericEntities(str); // Decode numeric entities FIRST (before CHAR_MAP)
    
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

/** Replaces & with safe char, preserves URLs (encodes/trims based on URL_NO_TRIM_DOMAINS) */
function processAmpersands(str: string): string {
  if (!str) return "";

  return str.replace(REGEX_PATTERNS.URL_IN_WORD, function(word: string): string {
    if (!hasUrl(word)) return word;

    const isExcluded = SETTINGS.URL_NO_TRIM_DOMAINS.some(function(domain: string): boolean { return word.toLowerCase().indexOf(domain.toLowerCase()) !== -1; });

    if (isExcluded) { return word.replace(/&/g, "%26"); }

    return encodeURI(trimUrlQuery(word));
  });
}

/** Detects incomplete URL at end (e.g. "https://www.insta", "https://domain.c") */
function hasIncompleteUrlAtEnd(str: string): boolean {
  if (!str) return false;
  
  if (/https?:\/\/[^\s]*\.$/.test(str)) return true; // URL ending with dot: "https://www.instagram."
  
  if (/https?:\/\/[a-zA-Z]{1,4}$/.test(str)) return true; // Very short domain: "https://www" or "https://in"
  
  if (/https?:\/\/[a-zA-Z0-9-]+\.[a-zA-Z]{1,2}$/.test(str)) return true; // Incomplete TLD (1-2 chars): "https://instagram.c"
  
  if (/https?:\/\/www\.[a-zA-Z0-9-]{1,10}$/.test(str)) return true; // Incomplete after www: "https://www.inst"
  
  if (/https?:\/\/[^\s]+\/[a-zA-Z]{1,2}$/.test(str)) return true; // Short path segment: "https://domain.com/ab"
  
  return false;
}

/** Removes incomplete URL from end after trimming */
function removeIncompleteUrlFromEnd(str: string): string {
  if (!str) return "";
  
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

/** Trims to POST_LENGTH with smart ellipsis (sentence/word/smart strategy) + incomplete URL protection */
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

  // Remove incomplete URLs that may result from trimming long links
  if (hasIncompleteUrlAtEnd(str)) {
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

///// EXTRACTION FUNCTIONS /////
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

///// FORMATTING FUNCTIONS /////
/** Formats @mentions per platform (adds prefix/suffix, skips specified name) */
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
    return str.replace(regex, function(match: string, username: string, offset: number, fullStr: string): string {
      if (format.type === "prefix") { 
        var result = format.value + username;
        var nextCharIndex = offset + match.length; // Check if next character after match is start of URL (h from http/https)
        if (nextCharIndex < fullStr.length) {
          var nextChar = fullStr.charAt(nextCharIndex);
          if (nextChar === 'h' && fullStr.substring(nextCharIndex).match(/^https?:\/\//)) { result += " "; } // If followed by 'h' (likely http/https), add space
        }
        return result;
      }
      return match + format.value;
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

  const mention = isSelf ? SETTINGS.PREFIX_SELF_REFERENCE : repostedUser;

  return content.replace(REGEX_PATTERNS.REPOST_PREFIX, author + SETTINGS.PREFIX_REPOST + mention + ":\n");
}

/** Removes "R to @username: " prefix */
function removeReplyPrefix(str: string): string { return str.replace(REGEX_PATTERNS.RESPONSE_PREFIX, ""); }

///// CONTENT SELECTION AND COMPOSITION FUNCTIONS /////
/** Composes final content: processContent + formatMentions */
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

/** Composes final status: trimmed content + optional image URL + optional post URL, with URL deduplication */
function composeStatus(content: string, entryUrl: string, imageUrl: string, title: string, author: string, wasRssTruncated: boolean): string {
  content = content || "";
  const status = processStatus(content, entryUrl, imageUrl, title, author, wasRssTruncated);
  const resultImageUrl = typeof imageUrl === "string" ? processUrl(imageUrl) : "";
  
  // Display imageUrl based on platform and type
  var imageStatus = "";
  
  if (SETTINGS.POST_FROM === "TW") { // Twitter platform
    if (!isValidImageUrl(imageUrl) && typeof imageUrl === "string" && (imageUrl.endsWith("/photo/1") || imageUrl.endsWith("/video/1"))) { // Twitter media (photo/video) - respect SHOW_IMAGEURL
      imageStatus = SETTINGS.SHOW_IMAGEURL ? SETTINGS.PREFIX_IMAGE_URL + resultImageUrl : "";
    } else if (isValidImageUrl(imageUrl)) { // Twitter external link - display with FORCE_SHOW_ORIGIN_POSTURL
      if (SETTINGS.FORCE_SHOW_ORIGIN_POSTURL) { imageStatus = SETTINGS.PREFIX_POST_URL + resultImageUrl; }
    }
  } else { // Other platforms (BS, RSS, YT)
    if (isValidImageUrl(imageUrl)) { imageStatus = SETTINGS.SHOW_IMAGEURL ? SETTINGS.PREFIX_IMAGE_URL + resultImageUrl : ""; }
  }
  
  const finalUrl = (status.urlToShow && typeof status.urlToShow === "string") ? SETTINGS.PREFIX_POST_URL + processUrl(status.urlToShow) : "";

  // Compose the final status and apply URL deduplication
  const composedStatus = status.trimmedContent + imageStatus + finalUrl;
  return deduplicateTrailingUrls(composedStatus);
}

/** Processes raw content: platform-specific rules, HTML cleanup, URL handling, replies/RT/quotes */
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

  // This ensures ellipsis (Ã¢â‚¬Â¦) is detected before URL encoding turns it into %E2%80%A6
  if (hasTruncatedUrl(content)) { content = removeTruncatedUrl(content); }

  content = processAmpersands(content);

  // Platform-specific content modifications
  if (SETTINGS.MOVE_URL_TO_END) { content = moveUrlToEnd(content); }

  if (config.handleReplies) { content = removeReplyPrefix(content); }

  if (config.handleRetweets && isRepost(trimmedTitle)) {
    const repostedUser = extractRepostUser(trimmedTitle);
    content = formatRepost(content, feedAuthor, feedUsername, repostedUser);
  }

  if (config.handleQuotes && isQuote(content, imageUrl, platform, author)) { content = formatQuote(content, feedAuthor, feedUsername, platform, imageUrl); }

  // Apply content replacements as final step to work on fully processed output
  content = applyContentReplacements(content);

  return { content: content, feedAuthor: feedAuthor, userNameToSkip: skipName };
}

/** Processes status: platform logic, trimming, URL selection (quote tweets prefer entryUrl) */
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
      // Prioritize entryUrl when FORCE_SHOW_ORIGIN_POSTURL is enabled
      if (SETTINGS.FORCE_SHOW_ORIGIN_POSTURL || isQuoteTweet) {
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

/** Centralized URL processing utility replaces URL_REPLACE_FROM → URL_REPLACE_TO (supports array), trim/encode via processAmpersands */
function processUrl(url: string): string {
  url = safeString(url);
  if (!url || url === "(none)") return "";
  
  url = url.trim();

  // URL domain replacement logic (supports both string and array)
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

/** Selects primary content source (title vs content based on SHOW_TITLE_AS_CONTENT) */
function selectContent(content: any, title: any): string {
  if (SETTINGS.SHOW_TITLE_AS_CONTENT) { return title || ""; }
  const contentEmpty = typeof content !== "string" || isEmpty(content);
  return contentEmpty ? (title || "") : content;
}

/** Determines if post should be skipped (empty, banned, missing keywords, reply, external RT) */
function shouldSkip(content: any, title: string, url: string, imageUrl: string, author: string): { skip: boolean;reason: string } {
  if (isEmpty(content) && isEmpty(title) && isEmpty(url)) { return { skip: true, reason: "Empty content, title and URL" }; }
  
  if (isRepost(title) && !isSelfRepost(title, author) && !SETTINGS.REPOST_ALLOWED) { return { skip: true, reason: "External repost not allowed" }; }

  if (SETTINGS.PHRASES_BANNED && SETTINGS.PHRASES_BANNED.length > 0) { if (hasBannedContent(title) || hasBannedContent(content) || hasBannedContent(url) || hasBannedContent(imageUrl)) { return { skip: true, reason: "Contains banned phrases" }; } }

  if (SETTINGS.PHRASES_REQUIRED && SETTINGS.PHRASES_REQUIRED.length > 0) { if (!hasRequiredKeywords(title) && !hasRequiredKeywords(content)) { return { skip: true, reason: "Missing mandatory keywords" }; } }

  if (isReply(title) || isReply(content)) { return { skip: true, reason: "Reply post (starts with @username)" }; }

  return { skip: false, reason: "" };
}

///// MAIN EXECUTION LOGIC /////
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