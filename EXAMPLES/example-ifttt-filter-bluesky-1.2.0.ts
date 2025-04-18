///////////////////////////////////////////////////////////////////////////////
// settings for IFTTT 🦋 webhook filter - Good Friday 2025 rev
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
  BANNED_COMMERCIAL_PHRASES: [], // phrases array ["advertisement", "discount", "sale"] 
  CONTENT_HACK_PATTERNS: [ // content hack - content manipulation function
    // { pattern: "(?<!https?:\/\/)(example\.com\/)", replacement: "https:\/\/example\.com\/", flags: "gi" }, // hack for URLs without protocol
    // { pattern: "(ZZZZZ[^>]+KKKKK)", replacement: "", flags: "gim" }, // replaces parts of the string between ZZZZZ and KKKKK including them with an empty string.
    // { pattern: "what", replacement: "by_what", flags: "gi" }, // replaces pattern "what" by replacement "by_what" with flags 
  ],
  EXCLUDED_URLS: ["youtu.be", "youtube.com"], // array excluding URLs from trimUrl ["youtu.be", "youtube.com", "example.com"]
  MANDATORY_KEYWORDS: [], // keyword array ["news", "updates", "important"]
  MENTION_FORMATTING: {
    // Define platform-specific mention formats. Keys should match POST_FROM values or "DEFAULT".
    "DEFAULT": { type: "none", value: "" }, // Default behavior if platform-specific rule is missing.
    "BS": { type: "suffix", value: ".bsky.social" }, // Example for Bluesky
    // "RSS": { type: "suffix", value: "@twitter.com" }, // Example for RSS (no change)
    // "TW": { type: "suffix", value: "@twitter.com" }, // Example for X/Twitter
    // "IG": { type: "prefix", value: "https://instagram.com/" }, // Example for Instagram
    // "YT": { type: "none", value: "" }, // Example for YouTube
  },
  POST_FROM: "BS", // "BS" | "RSS" | "TW" | "YT"
  POST_LENGTH: 444, // 0 - 500 chars
  POST_SOURCE: "", // "" | `https://twitter.com/` | `https://x.com/`
  POST_TARGET: "", // "" | `https://twitter.com/` | `https://x.com/`
  QUOTE_SENTENCE: " 🦋📝💬", // e.g., "" | "comments post from" | "🦋📝💬" | "𝕏📝💬"
  REPOST_ALLOWED: true, // true | false
  REPOST_SENTENCE: "", // "" | "shares" | "𝕏📤"
  SHOULD_PREFER_REAL_NAME: true, // true | false
  SHOW_FEEDURL_INSTD_POSTURL: false, // true | false
  SHOW_IMAGEURL: false, // true | false
  SHOW_ORIGIN_POSTURL_PERM: true, // true | false
  SHOW_TITLE_AS_CONTENT: false, // true | false
  STATUS_IMAGEURL_SENTENCE: "", // "" | "🖼️"
  STATUS_URL_SENTENCE: "\n", // "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 " | "\n🗣️🎙️👇👇👇\n" | "\nYT 📺👇👇👇\n"
  TREAT_RSS_AS_TW: false, // Default: false. Set to true ONLY in applets where an RSS feed (usually from RSS.app) should be processed using Twitter rules.
};

///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🦋📙📗📘 webhook - Good Friday 2025 rev
///////////////////////////////////////////////////////////////////////////////
// 
// This connector processes data from various sources (e.g. RSS, Twitter, Bluesky) 
// and provides it to the IFTTT webhook for publishing.
// 
// The data is filtered and edited according to the settings in AppSettings.
//
// This section defines the input variables coming from the IFTTT trigger.
// IMPORTANT: Adapt the source (e.g., Twitter.newTweetFromSearch or Feed.newFeedItem)
// based on the specific trigger used in your IFTTT applet.
// Use 'let' for variables that might be modified by the TREAT_RSS_AS_TW logic.
//
///////////////////////////////////////////////////////////////////////////////

let entryContent = String(Feed.newFeedItem.EntryContent); 	// Main text content (often includes HTML).
let entryTitle = String(Feed.newFeedItem.EntryTitle);     	// Title of the feed item.
let entryUrl = String(Feed.newFeedItem.EntryUrl);         	// URL of the specific item.
let entryImageUrl = String(Feed.newFeedItem.EntryImageUrl); // Image URL associated with the item (might be unreliable).
let entryAuthor = String(Feed.newFeedItem.EntryAuthor);   	// Author name/username if provided by the feed.
let feedTitle = String(Feed.newFeedItem.FeedTitle);       	// Title of the RSS feed itself.
let feedUrl = String(Feed.newFeedItem.FeedUrl);           	// URL of the RSS feed.

///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋📙📗📘𝕏📺 webhook filter v1.3.0 - Good Friday 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// Description:
// Processes and filters posts from various platforms (Twitter, Bluesky, RSS, YouTube)
// for IFTTT webhook publishing. Applies normalization, formatting, shortening,
// and platform-specific rules based on settings.
// Includes special handling for RSS feeds treated as Twitter feeds via TREAT_RSS_AS_TW.
//
///////////////////////////////////////////////////////////////////////////////

// type definitions for string manipulation (standard augmentation)
interface String {
  startsWith(searchString: string, position ? : number): boolean;
  endsWith(searchString: string, endPosition ? : number): boolean;
}

// type definitions for Object.entries (standard augmentation)
interface ObjectConstructor {
  entries < T > (o: {
    [s: string]: T
  } | ArrayLike < T > ): [string, T][];
}

// --- START: Logic to potentially treat RSS as TW ---
// Check if the source is configured as RSS but the flag demands treating it as TW.
// This allows using RSS feeds (e.g., from RSS.app aggregating Twitter) with Twitter processing rules.
if (SETTINGS.POST_FROM === "RSS" && SETTINGS.TREAT_RSS_AS_TW === true) {
  // Temporarily override the POST_FROM setting for this specific run to "TW".
  SETTINGS.POST_FROM = "TW";

  // Remap/adjust input variables to match expectations of the "TW" processing logic.
  entryTitle = entryContent; // Use the main content from RSS as the primary text, like a tweet.
  if (entryAuthor) { // Reconstruct feedTitle to resemble "Real Name / @username" format expected by TW logic.
    feedTitle = `${entryAuthor.replace('@','')} / ${entryAuthor}`; // Use author name if available.
  }
  entryImageUrl = ""; // Clear image URL as RSS.app might provide unreliable or irrelevant images (like feed avatar).
  SETTINGS.SHOW_IMAGEURL = false; // Forcefully disable image display for this mode.
  SETTINGS.SHOW_ORIGIN_POSTURL_PERM = true; // Force showing the link to the original tweet (entryUrl) because content might lack context otherwise.
}
// --- END: Logic to potentially treat RSS as TW ---


// character mapping for text normalization
// Keys are regex patterns, values are their replacements. Used by replaceAllSpecialCharactersAndHtml.
const characterMap: {
  [key: string]: string
} = {
  // basic text formatting replacement (HTML line breaks to newline chars)
  '(<br>|<br />|</p>)': '\n',
  // czech chars replacement (HTML entities/codes to actual characters)
  '(&#193;|&Aacute;|A&#769;)': 'Á',
  '(&#225;|&aacute;|a&#769;)': 'á',
  '(&#196;|&Auml;|A&#776;)': 'Ä',
  '(&#228;|&auml;|a&#776;)': 'ä',
  '(&#268;|&Ccaron;|C&#780;)': 'Č',
  '(&#269;|&ccaron;c&#780;)': 'č',
  '(&#270;|&Dcaron;|D&#780;)': 'Ď',
  '(&#271;|&dcaron;|d&#780;)': 'ď',
  '(&#201;|&Eacute;|E&#769;)': 'É',
  '(&#233;|&eacute;|e&#769;)': 'é',
  '(&#203;|&Euml;|E&#776;)': 'Ë',
  '(&#235;|&euml;|e&#776;)': 'ë',
  '(&#282;|&Ecaron;|E&#780;)': 'Ě',
  '(&#283;|&ecaron;|e&#780;)': 'ě',
  '(&#205;|&Iacute;|I&#769;)': 'Í',
  '(&#237;|&iacute;|i&#769;)': 'í',
  '(&#207;|&Luml;|I&#776;)': 'Ï',
  '(&#239;|&iuml;|i&#776;)': 'ï',
  '(&#327;|&Ncaron;|N&#780;)': 'Ň',
  '(&#328;|&ncaron;|n&#780;)': 'ň',
  '(&#211;|&Oacute;|O&#769;)': 'Ó',
  '(&#243;|&oacute;|o&#769;)': 'ó',
  '(&#214;|&Ouml;|O&#776;)': 'Ö',
  '(&#246;|&ouml;|o&#776;)': 'ö',
  '(&#336;|&Odblac;|O&#778;)': 'Ő',
  '(&#337;|&odblac;|o&#778;)': 'ő',
  '(&#344;|&Rcaron;|R&#780;)': 'Ř',
  '(&#345;|&rcaron;|r&#780;)': 'ř',
  '(&#352;|&Scaron;|S&#780;)': 'Š',
  '(&#353;|&scaron;|s&#780;)': 'š',
  '(&#356;|&Tcaron;|T&#780;)': 'Ť',
  '(&#357;|&tcaron;|t&#780;)': 'ť',
  '(&#218;|&Uacute;|U&#769;)': 'Ú',
  '(&#250;|&uacute;|u&#769;)': 'ú',
  '(&#220;|&Uuml;|U&#776;)': 'Ü',
  '(&#252;|&uuml;|u&#776;)': 'ü',
  '(&#366;|&Uring;|U&#778;)': 'Ů',
  '(&#367;|&uring;|u&#778;)': 'ů',
  '(&#368;|&Udblac;|U&#369;)': 'Ű',
  '(&#369;|&udblac;|u&#369;)': 'ű',
  '(&#221;|&Yacute;|Y&#769;)': 'Ý',
  '(&#253;|&yacute;|y&#769;)': 'ý',
  '(&#381;|&Zcaron;|Z&#780;)': 'Ž',
  '(&#382;|&zcaron;|z&#780;)': 'ž',
  // special chars replacement (HTML entities/codes to actual characters or normalized forms)
  '(&#09;|&#009;|&#10;|&#010;|&#13;|&#013;|&#32;|&#032;|&#160;|&nbsp;|&#8192;|&#8193;|&#8194;|&#8195;|&#8196;|&#8197;|&#8198;|&#8199;|&#8200;|&#8201;|&#8202;|&#8203;|&#8204;|&#8205;|&#8206;|&#8207;|&#xA0;|&NonBreakingSpace;)': ' ', // various spaces to standard space
  '(&#33;|&#033;|&excl;|&#x21;)': '!',
  '(&#34;|&#034;|&quot;|&#x22;)': '"',
  '(&#36;|&#036;|&dollar;|&#x24;|&#65284;|&#xFF04;)': '$',
  '(&#37;|&#037;|&percnt;|&#x25;)': '%',
  '(&#39;|&#039;|&apos;|&#x27;)': '‘',
  '(&#40;|&#040;|&lpar;|&#x28;)': '(',
  '(&#41;|&#041;|&rpar;|&#x29;)': ')',
  '(&#43;|&#043;|&plus;|&#x2B;|&#x2b;)': '+',
  '(&#46;|&#046;|&period;)': '.',
  '(&#60;|&#060;|&lt;|&#x3c;)': '<',
  '(&#61;|&#061;|&equals;|&#x3d;)': '=',
  '(&#62;|&#062;|&gt;|&#x3e;)': '>',
  '(&#63;|&#063;|&quest;|&#x3f;)': '?',
  '(&#91;|&#091;|&lbrack;|&#x5b;)': '[',
  '(&#93;|&#093;|&rbrack;|&#x5d;)': ']',
  '(&#95;|&#095;|&lowbar;|&#x5f;)': '_',
  '(&#123;|&lbrace;|&#x7b;)': '{',
  '(&#124;|&vert;|&#x7c;|&VerticalLine;)': '|',
  '(&#125;|&rbrace;|&#x7d;)': '}',
  '(&#137;|&permil;|&#x89;)': '‰',
  '(&#139;|&#x8B;|&#x8b;)': '‹',
  '(&#155;|&#x9B;|&#x9b;)': '›',
  '(&#162;|&cent;|&#xa2;|&#65504;|&#xFFE0;)': '¢',
  '(&#163;|&pound;|&#xa3;|&#65505;|&#xFFE1;)': '£',
  '(&#165;|&yen;|&#xa5;|&#65509;|&#xFFE5;)': '¥',
  '(&#169;|&copy;|&#xA9;|&#xa9;)': '©',
  '(&#173;|&#xAD;|&shy;)': '',
  '(&#174;|&reg;|&#xAE;|&#xae;)': '®',
  '(&#176;|&deg;|&#xb0;)': '°',
  '(&#177;|&plusmn;|&#xb1;)': '±',
  '(&#183;|&centerdot;|&#xB7;)': '·',
  '(&#188;|&frac14;|&#xBC;)': '¼',
  '(&#189;|&half;|&#xBD;)': '½',
  '(&#190;|&frac34;|&#xBE;)': '¾',
  '(&#215;|&times;|&#xd7;)': '×',
  '(&#247;|&divide;|&#xf7;)': '÷',
  '(&#8208;|&hyphen;|&#x2010;|&#8209;|&#x2011;|&#8210;|&#x2012;|&#8211;|&ndash;|&#x2013;|&#8212;|&mdash;|&#x2014;|&#8213;|&horbar;|&#x2015;)': '-',
  '(&#8216;|&lsquo;|&OpenCurlyQuote;|&#x2018;)': '‘',
  '(&#8217;|&rsquo;|&CloseCurlyQuote;|&#x2019;)': '’',
  '(&#8218;|&sbquo;|&#x201A;|&#x201a;)': '‚',
  '(&#8219;|&#x201B;|&#x201b;)': '‛',
  '(&#8220;|&ldquo;|&OpenCurlyDoubleQuote;|&#x201C;|&#x201c;)': '“',
  '(&#8221;|&rdquo;|&CloseCurlyDoubleQuote;|&#x201D;|&#x201d;)': '”',
  '(&#8222;|&bdquo;|&#x201E;|&#x201e;)': '„',
  '(&#8223;|&#x201F;|&#x201f;)': '‟',
  '(&#8230;|&hellip;|&mldr;|&#x2026;)': '…',
  '(&#8241;|&pertenk;|&#x2031;)': '‱',
  '(&#8242;|&prime;|&#x2032;)': '′',
  '(&#8243;|&Prime;&#x2033;)': '″',
  '(&#8364;|&euro;|&#x20AC;)': '€',
  '(&#8451;|&#x2103;)': '℃',
  '(&#8482;|&trade;|&#x2122;)': '™',
  '(&#8722;|&minus;|&#x2212;)': '-',
  '(&#8776;|&thickapprox;|&#x2248;)': '≈',
  '(&#8800;|&ne;|&#x2260;)': '≠',
  '(&#9001;|&#x2329;)': '⟨',
  '(&#9002;|&#x232A;|&#x232a;)': '⟩',
};

// precompiled regular expression patterns for content processing
const BS_QUOTE_REGEX = new RegExp("\\[contains quote post or other embedded content\\]", "gi"); // Pattern indicating a Bluesky quote post.
const HTML_LINE_BREAKS_REGEX = /<(br|br\/|\/p)[^>]*>/gi; // Matches various HTML line break tags. Used in replaceAllSpecialCharactersAndHtml.
const HTML_TAG_REGEX = /<(?!br|\/p|br\/)[^>]+>/gi; // Matches all HTML tags EXCEPT line break tags. Used in replaceAllSpecialCharactersAndHtml.
const MULTIPLE_EOL_REGEX = /(\r?\n){3,}/g; // Matches 3 or more consecutive newline characters. Used to limit excessive line breaks.
const MULTIPLE_SPACES_REGEX = /\s+/g; // Matches one or more whitespace characters. Used to normalize spacing.
const REPOST_PREFIX_REGEX = /^(RT @([^:]+): )/i; // Matches the standard Twitter "RT @username: " prefix.
const REPOST_URL_REGEX = new RegExp('href="(?<url>https:\/\/twitter\.com[^"]+)"', 'gi'); // Extracts the original tweet URL from Twitter RT structure (often embedded in HTML). Note: Named capture group `<url>` is not used in current logic, only index 1.
const REPOST_USER_REGEX = new RegExp('RT (@[a-z0-9_]+)', 'gi'); // Extracts the @username being retweeted.
const RESPONSE_PREFIX_REGEX = /^R to (.*?): /; // Matches the "R to @username: " prefix used in some contexts for replies.
const TCO_URL_REGEX = /https:\/\/t\.co\/[^\s]+/gi; // Matches Twitter's shortened t.co URLs.
const URL_REGEX = /https?:\/\//i; // Simple check for the presence of "http://" or "https://".

/**
 * Retrieves the primary content source, prioritizing title if SHOW_TITLE_AS_CONTENT is true,
 * otherwise using content (with title as fallback for empty content).
 * @param entryContent - The main content field.
 * @param entryTitle - The title field.
 * @returns The selected content string, or an empty string if both are effectively empty.
 */
function getContent(entryContent: any, entryTitle: any): string {
  if (SETTINGS.SHOW_TITLE_AS_CONTENT) {
    return entryTitle || ""; // Return title if preferred, or empty string if title is null/undefined.
  } else {
    // Return content if it's a non-empty string, otherwise return title (or empty string if title is also null/undefined).
    const contentIsEffectivelyEmpty = (typeof entryContent !== "string" || entryContent.trim().length === 0 || entryContent === "(none)");
    return contentIsEffectivelyEmpty ? (entryTitle || "") : entryContent;
  }
}

/**
 * Applies custom regex replacements defined in SETTINGS.CONTENT_HACK_PATTERNS.
 * @param str - The input string.
 * @returns The string after applying all defined hacks.
 */
function contentHack(str: string): string {
  if (!SETTINGS.CONTENT_HACK_PATTERNS) return str; // Skip if no patterns defined
  for (const pattern of SETTINGS.CONTENT_HACK_PATTERNS) {
    try {
      const regex = new RegExp(pattern.pattern, pattern.flags || "g");
      str = str.replace(regex, pattern.replacement);
    } catch (e) {
      // Log error if regex is invalid, but continue processing
      // console.error(`Invalid regex pattern in CONTENT_HACK_PATTERNS: ${pattern.pattern}`, e);
    }
  }
  return str;
}

// Cache for memoizing escapeRegExp results using a plain object.
const escapeRegExpCache: {
  [key: string]: string
} = {}; // Use plain object type annotation

/**
 * Escapes characters with special meaning in regular expressions.
 * Uses memoization (caching) for performance optimization on repeated inputs.
 * @param str - The input string potentially containing regex metacharacters.
 * @returns The string with metacharacters escaped (e.g., '.' becomes '\.').
 */
function escapeRegExp(str: string): string {
  // Check cache first using 'in' operator or hasOwnProperty
  if (str in escapeRegExpCache) { // Check if property exists in the object
    return escapeRegExpCache[str];
  }
  // If not in cache, compute, store, and return
  const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  escapeRegExpCache[str] = escaped; // Store in the object
  return escaped;
}

/**
 * Checks if the input string contains the Bluesky quote post marker.
 * @param str - The input string.
 * @returns True if the marker is found, false otherwise.
 */
function isBsQuoteInPost(str: string): boolean {
  return str ? BS_QUOTE_REGEX.test(str) : false; // Add check for null/undefined str
}

/**
 * Checks if the post is a quote based on platform-specific indicators.
 * For BS: Checks for BS_QUOTE_REGEX in content.
 * For TW: Checks if FirstLinkUrl points to another tweet.
 * @param entryContent - The content to check for BS quotes.
 * @param entryFirstLinkUrl - The first link URL to check for TW quotes.
 * @param postFrom - The platform identifier.
 * @returns True if the post is a quote, false otherwise.
 */
function isQuoteInPost(entryContent: string, entryFirstLinkUrl: string, postFrom: string): boolean {
  // BS: Check for quote marker in content
  if (postFrom === 'BS' && typeof entryContent === 'string') {
    return BS_QUOTE_REGEX.test(entryContent);
  }
  // TW: Check if FirstLinkUrl points to a tweet
  if (postFrom === 'TW' && typeof entryFirstLinkUrl === 'string') {
    return /^https?:\/\/(twitter\.com|x\.com)\/[^\/]+\/status\/\d+/i.test(entryFirstLinkUrl);
  }
  return false;
}

/**
 * Checks if the input string contains any banned commercial phrases from settings.
 * Uses escapeRegExp to treat banned phrases literally. Case-insensitive.
 * @param str - The input string (content or title).
 * @returns True if a banned phrase is found, false otherwise.
 */
function isCommercialInPost(str: string): boolean {
  if (!str || !SETTINGS.BANNED_COMMERCIAL_PHRASES || SETTINGS.BANNED_COMMERCIAL_PHRASES.length === 0) {
    return false;
  }
  const lowerCaseStr = str.toLowerCase();
  for (const phrase of SETTINGS.BANNED_COMMERCIAL_PHRASES) {
    if (!phrase) continue; // Skip empty phrases in the settings array
    try {
      // Escape the phrase to treat it literally in the regex
      const regex = new RegExp(escapeRegExp(phrase), "i");
      if (regex.test(lowerCaseStr)) {
        return true;
      }
    } catch (e) {
      // Log error for invalid phrase regex, but continue checking others
      // console.error(`Invalid regex pattern created from phrase: ${phrase}`, e);
    }
  }
  return false;
}

/**
 * Validates if the input string represents a usable image URL.
 * Excludes known placeholder URLs and specific Twitter media page links (/photo/1, /video/1).
 * @param str - The input string (potential image URL).
 * @returns True if it seems like a valid and desired image URL, false otherwise.
 */
function isImageInPost(str: string): boolean {
  // Check for null, undefined, empty string, or known invalid values first.
  if (!str || str === "(none)" || str === "https://ifttt.com/images/no_image_card.png") {
    return false;
  }
  // Exclude specific Twitter/X media page links which aren't direct image files.
  if (str.endsWith('/photo/1') || str.endsWith('/video/1')) {
    return false;
  }
  // Basic check if it looks like a URL.
  return URL_REGEX.test(str);
}

/**
 * Checks if the input string starts with the standard Twitter "RT @" prefix.
 * @param str - The input string (usually entryTitle for Twitter).
 * @returns True if it's a retweet, false otherwise.
 */
function isRepost(str: string): boolean {
  return str ? REPOST_PREFIX_REGEX.test(str) : false; // Check for null/undefined str
}

/**
 * Checks if a string represents a self-repost (retweeting one's own content).
 * Uses escapeRegExp to safely compare the authorName.
 * @param str - The input string (usually entryTitle for Twitter).
 * @param authorName - The username of the author performing the action (e.g., "@username").
 * @returns True if it's a self-repost, false otherwise.
 */
function isRepostOwn(str: string, authorName: string): boolean {
  if (!str || !authorName) return false; // Cannot be a self-repost if inputs are missing
  // Escape the author name for safe inclusion in the regex.
  const escapedAuthorName = escapeRegExp(authorName.startsWith('@') ? authorName.substring(1) : authorName); // Escape only the name part without '@'
  // Regex checks for "RT @escapedAuthorName:" at the beginning.
  const regex = new RegExp(`^RT @${escapedAuthorName}: `, "i"); // Added 'i' flag for case-insensitivity
  return regex.test(str);
};

/**
 * Checks if the input string contains "http://" or "https://".
 * @param str - The input string.
 * @returns True if a URL protocol is found, false otherwise.
 */
function isUrlIncluded(str: string): boolean {
  return str ? URL_REGEX.test(str) : false; // Check for null/undefined str
}

/**
 * Moves the first detected URL (http/https) in a string to the end.
 * If no URL is found, returns the original string.
 * @param entryContent - The input string.
 * @returns The string with the first URL moved to the end, or the original string.
 */
function moveUrlToEnd(entryContent: string): string {
  if (!entryContent || !URL_REGEX.test(entryContent)) {
    return entryContent || ""; // Return original or empty if no content or no URL
  }
  // More robust URL extraction matching non-whitespace characters after protocol.
  const urlMatch = entryContent.match(/https?:\/\/[^\s]+/);
  if (urlMatch && urlMatch[0]) {
    const url = urlMatch[0];
    // Remove the first occurrence of the URL and trim whitespace.
    const contentWithoutUrl = entryContent.replace(url, '').trim();
    // Append the URL back, separated by a space.
    return contentWithoutUrl + ' ' + url;
  }
  return entryContent; // Return original if regex match failed unexpectedly
}

/**
 * Checks if the input string contains at least one of the mandatory keywords (case-insensitive).
 * @param str - The input string (content or title).
 * @param keywords - An array of mandatory keywords from SETTINGS.
 * @returns True if at least one keyword is found or if no keywords are defined, false otherwise.
 */
function mustContainKeywords(str: string, keywords: string[]): boolean {
  if (!keywords || keywords.length === 0) {
    return true; // If no keywords are mandatory, the condition is always met.
  }
  if (!str) return false; // If the string is empty/null, it cannot contain keywords.
  const lowerCaseStr = str.toLowerCase();
  for (const keyword of keywords) { // Use for...of for better readability
    if (!keyword) continue; // Skip empty keywords in the settings array
    // Use indexOf !== -1 instead of includes
    if (lowerCaseStr.indexOf(keyword.toLowerCase()) !== -1) {
      return true; // Found at least one keyword.
    }
  }
  return false; // No mandatory keywords were found.
}

/**
 * Extracts the real author name from the TweetEmbedCode (entryContent).
 * Returns an empty string if it cannot be found.
 * @param embedCode - HTML embed code of the tweet
 * @returns Real author name or empty string
 */
function parseRealNameFromEntryContent(embedCode: string): string { // <-- Přidáno : string
  if (!embedCode) return "";
  // Looking for a pattern: &mdash; Real Name (@username)
  let match = embedCode.match(/&mdash;\s*([^<\(]+)\s*\(@/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return "";
}

/**
 * Extracts the tweet text from the <p> tag in TweetEmbedCode (entryContent).
 * If not found, returns an empty string.
 * @param embedCode - HTML embed code of the tweet
 * @returns Tweet text or empty string
 */
function parseTextFromEntryContent(embedCode: string): string { // <-- Přidáno : string
  if (!embedCode) return "";
  // Searches for the contents of the <p ...>...</p> tag
  let match = embedCode.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (match && match[1]) {
    // Returns text (HTML entities will be removed later)
    return match[1].trim();
  }
  return ""; // Return empty string if <p> not found
}

/**
 * Extracts the username from a Twitter status URL.
 * @param url - The Twitter status URL (e.g., https://twitter.com/username/status/123)
 * @returns The extracted username or an empty string if not found.
 */
function parseUsernameFromTweetUrl(url: string): string {
  if (!url) return "";
  // Regex to capture username between domain and /status/
  const match = url.match(/^https?:\/\/(?:twitter\.com|x\.com)\/([^\/]+)\/status\/\d+/i);
  // Return the captured group (username) or an empty string
  return match && match[1] ? match[1] : "";
}

/**
 * Replaces ampersands (&) in a string, preserving URLs.
 * URLs listed in SETTINGS.EXCLUDED_URLS are only URL-encoded.
 * Other URLs are trimmed (query string removed) and then URL-encoded.
 * Ampersands in non-URL parts are replaced with SETTINGS.AMPERSAND_REPLACEMENT.
 * @param str - The input string.
 * @returns The string with ampersands processed.
 */
function replaceAmpersands(str: string): string {
  if (!str) return ""; // Handle null/undefined input
  // Process the string word by word (or URL by URL) separated by spaces.
  return str.replace(/(\S+)/g, word => {
    if (isUrlIncluded(word)) {
      // Check if the URL is in the exclusion list (case-insensitive) using indexOf.
      const isExcluded = SETTINGS.EXCLUDED_URLS.some(excludedUrl =>
        // Use indexOf !== -1 instead of includes
        word.toLowerCase().indexOf(excludedUrl.toLowerCase()) !== -1
      );
      if (isExcluded) {
        // If excluded, just encode the whole URL.
        try {
          return encodeURIComponent(word);
        } catch (e) { return word; } // Fallback if encoding fails
      } else {
        // If not excluded, trim the query string and then encode.
        try {
          return encodeURI(trimUrl(word)); // encodeURI is usually sufficient for non-query parts.
        } catch (e) { return trimUrl(word); } // Fallback if encoding fails
      }
    } else {
      // If it's not a URL, replace all forms of ampersand with the setting.
      return word.replace(/&(amp;|#38;|#038;)?/g, SETTINGS.AMPERSAND_REPLACEMENT);
    }
  });
}

/**
 * Normalizes a string by removing most HTML tags, converting line breaks,
 * replacing special character entities/codes, and normalizing whitespace.
 * @param str - The input string (often containing HTML).
 * @returns The normalized string.
 */
function replaceAllSpecialCharactersAndHtml(str: string): string {
  if (!str) return ""; // Handle null/undefined input
  // 1. Remove all HTML tags except <br>, <br />, </p>
  str = str.replace(HTML_TAG_REGEX, '');
  // 2. Replace <br>, <br />, </p> with newline characters.
  str = str.replace(HTML_LINE_BREAKS_REGEX, "\n");
  // 3. Temporarily replace newlines to protect them during character replacement.
  const tempNewline = "__TEMP_NEWLINE_MARKER__"; // Use a more unique marker
  str = str.replace(/\n/g, tempNewline);
  // 4. Replace special character entities/codes using the characterMap.
  // Ensure characterMap keys are properly escaped if they contain regex metacharacters NOT intended as such.
  // Assuming keys in characterMap are valid regex patterns.
  for (const [pattern, replacement] of Object.entries(characterMap)) {
    try {
      const regex = new RegExp(pattern, "g");
      str = str.replace(regex, replacement);
    } catch (e) {
      // console.error(`Invalid regex pattern in characterMap: ${pattern}`, e);
    }
  }
  // 5. Replace multiple spaces (including those from nbsp replacements) with a single space.
  str = str.replace(MULTIPLE_SPACES_REGEX, ' ');
  // 6. Restore newline characters.
  str = str.replace(new RegExp(tempNewline, "g"), "\n");
  // 7. Limit consecutive newline characters to a maximum of two.
  str = str.replace(MULTIPLE_EOL_REGEX, "\n\n");
  return str.trim(); // Trim leading/trailing whitespace from the final result.
}

/**
 * Formats a quote post by adding author attribution.
 * @param str - The content string.
 * @param resultFeedAuthor - The username/name of the author quoting the post.
 * @param entryAuthor - The username/name of the *quoting* author (used as fallback for BS).
 * @param postFrom - The platform identifier.
 * @param entryFirstLinkUrl - The URL of the quoted post (used for TW).
 * @returns The formatted quote string.
 */
function replaceQuoted(
  str: string,
  resultFeedAuthor: string, // Name/username of the QUOTING author
  entryAuthor: string, // Username of the QUOTING author (used for BS fallback)
  postFrom: string,
  entryFirstLinkUrl: string // URL of the QUOTED post
): string {
  // For BS quotes, remove the marker and format
  if (postFrom === 'BS') {
    const bsQuoteRegex = BS_QUOTE_REGEX;
    // Use entryAuthor (quoting author) for BS quotes, as original author might not be available reliably
    const authorToDisplay = ""; // Now empty string but once maybe potentially parse from content if a standard exists? Sticking with quoting author for now.
    const cleanedContent = str.replace(bsQuoteRegex, '').trim();
    return cleanedContent ?
      `${resultFeedAuthor}${SETTINGS.QUOTE_SENTENCE}${authorToDisplay}:\n${cleanedContent}` :
      str;
  }
  // For TW quotes, extract QUOTED author username from URL, prepend '@', and add the prefix
  if (postFrom === 'TW' && typeof entryFirstLinkUrl === 'string' &&
    /^https?:\/\/(twitter\.com|x\.com)\/[^\/]+\/status\/\d+/i.test(entryFirstLinkUrl)) {
    const quotedAuthorUsername = parseUsernameFromTweetUrl(entryFirstLinkUrl); // Extract username of QUOTED author
    const quotedAuthorMention = quotedAuthorUsername ? `@${quotedAuthorUsername}` : ""; // Add '@' if username exists
    // Use the mention (@username) of the quoted author
    return `${resultFeedAuthor}${SETTINGS.QUOTE_SENTENCE}${quotedAuthorMention}:\n${str}`;
  }
  // Otherwise, return unchanged
  return str;
}

/**
 * Formats a retweet string by replacing the "RT @username: " prefix with custom attribution.
 * @param str - The input string (tweet content starting with RT).
 * @param resultFeedAuthor - The user performing the retweet (not currently used in replacement string).
 * @param entryAuthor - The original author being retweeted (extracted by findRepostUser).
 * @returns The formatted retweet string.
 */
function replaceReposted(
  str: string,
  resultFeedAuthor: string, // Currently unused in the replacement logic below.
  entryAuthor: string
): string {
  // Replaces the matched "RT @username: " prefix.
  return str.replace(
    REPOST_PREFIX_REGEX, // Matches "RT @username: "
    `${resultFeedAuthor}${SETTINGS.REPOST_SENTENCE}${entryAuthor}:\n` // Prepends custom repost sentence and original author.
  );
}

/**
 * Removes the "R to @username: " prefix if present at the beginning of a string.
 * @param str - The input string.
 * @returns The string with the prefix removed, or the original string if not found.
 */
function replaceResponseTo(str: string): string {
  return str.replace(RESPONSE_PREFIX_REGEX, "");
}

/**
 * Formats @username mentions within a string based on platform-specific settings
 * defined in SETTINGS.MENTION_FORMATTING. Adds a prefix or suffix, or leaves
 * the mention unchanged. Skips formatting for the specified 'skipName'.
 * Uses escapeRegExp for safe regex construction.
 *
 * @param str - The input string containing potential mentions.
 * @param skipName - The username (including '@' if applicable) of the author to skip formatting for.
 * @param postFrom - The identifier of the source platform ("TW", "BS", "RSS", etc.).
 * @returns The string with mentions formatted according to the rules.
 */
function replaceUserNames(
  str: string,
  skipName: string, // e.g., "@OriginalAuthor" or "username.bsky.social"
  postFrom: string
): string {
  if (!str) return ""; // Handle null/undefined input

  // Get the formatting configuration for the current platform, falling back to DEFAULT or "none".
  const platformFormat = SETTINGS.MENTION_FORMATTING[postFrom] ||
    SETTINGS.MENTION_FORMATTING["DEFAULT"] || { type: "none", value: "" };

  // If no formatting action is defined for this platform, return the original string immediately.
  if (platformFormat.type === "none" || !platformFormat.value) { // Also check if value is empty
    return str;
  }

  // Prepare the username to skip. Remove leading '@' if present, as the regex captures the name without it.
  // Also handle potential null/undefined skipName.
  const skipNameClean = skipName ? (skipName.startsWith('@') ? skipName.substring(1) : skipName) : "";

  // Regex to find "@username".
  // - (?<![a-zA-Z0-9@]) - Lookbehind: Ensure '@' is not preceded by alphanumeric or another '@' (prevents matching emails or partial handles). Adjusted to include '@'.
  // - @ - Match the literal '@' symbol.
  // - (?!(?:${escapedSkipName})\b) - Negative Lookahead: Ensure the captured username IS NOT the skipped username (whole word match). Only apply if skipNameClean is not empty.
  // - ([a-zA-Z0-9_.]+) - Capture Group 1: The username itself (letters, numbers, underscore, period).
  // - \b - Word Boundary: Ensure we match the full username.
  let regexPattern = `(?<![a-zA-Z0-9@])@`;
  if (skipNameClean) {
    const escapedSkipName = escapeRegExp(skipNameClean); // Escape the name to skip
    regexPattern += `(?!(?:${escapedSkipName})\\b)`;
  }
  regexPattern += `([a-zA-Z0-9_.]+)\\b`;

  try {
    const regex = new RegExp(regexPattern, "gi");

    return str.replace(regex, (match, capturedUsername) => {
      // 'match' is the full "@username" (e.g., "@exampleUser")
      // 'capturedUsername' is just the name part (e.g., "exampleUser")

      switch (platformFormat.type) {
        case "prefix":
          // Prepend the prefix value to the captured username (without '@').
          return platformFormat.value + capturedUsername;
        case "suffix":
          // Append the suffix value to the original full "@username" match.
          return match + platformFormat.value;
        default: // Should not happen due to filter above, but acts as safety net.
          return match; // Return the original mention unchanged.
      }
    });
  } catch (e) {
    // console.error("Error during replaceUserNames regex execution:", e);
    return str; // Return original string if regex fails
  }
}

/**
 * Trims whitespace, replaces triple dots with ellipsis, and potentially adds an ellipsis
 * if the content is between 257 and POST_LENGTH chars and doesn't end with punctuation/emoji/URL.
 * Truncates content exceeding POST_LENGTH, ensuring truncation happens at a word boundary
 * and adds an ellipsis.
 *
 * @param str - The input string.
 * @returns An object { content: string, needsEllipsis: boolean }.
 */
function trimContent(str: string): { content: string;needsEllipsis: boolean } {
  if (!str) return { content: "", needsEllipsis: false }; // Handle null/undefined input

  str = str.trim();
  if (str === "") return { content: "", needsEllipsis: false };

  let needsEllipsis = false;

  // Normalize existing triple dots to ellipsis
  str = str.replace(/\.{3,}/g, "…"); // Match 3 or more dots

  // Condition 1: Add ellipsis if content is > 256, <= POST_LENGTH, AND doesn't end with specific terminators.
  if (
    str.length > 256 &&
    str.length <= SETTINGS.POST_LENGTH &&
    !/[.!?:)"…]$/.test(str) && // Check for common punctuation endings including ellipsis
    !/[\u{1F600}-\u{1F64F}]$|[\u{1F300}-\u{1F5FF}]$|[\u{1F680}-\u{1F6FF}]$|[\u{2600}-\u{26FF}]$/u.test(str) && // Emoji detection
    !/https?:\/\/[^\s]+$/.test(str) && // Check if it doesn't end with a URL
    !/\s>>$/.test(str) // Check if it doesn't end with " >>"
  ) {
    str += '…';
    needsEllipsis = true;
  }

  // Condition 2: Truncate if content exceeds POST_LENGTH.
  if (str.length > SETTINGS.POST_LENGTH) {
    // Slice to max length minus 1 for the ellipsis, then trim potential trailing space.
    let trimmedText = str.slice(0, SETTINGS.POST_LENGTH - 1).trim();

    // Find the last space to avoid cutting mid-word.
    const lastSpaceIndex = trimmedText.lastIndexOf(" ");

    // Truncate at the last space if found and makes sense, otherwise truncate at limit. Add ellipsis.
    str = (lastSpaceIndex > 0) ?
      trimmedText.slice(0, lastSpaceIndex) + "…" : // Truncate at last space
      trimmedText + "…"; // Or truncate at limit if no space found early enough

    needsEllipsis = true; // Mark that truncation occurred.
  }

  return { content: str, needsEllipsis };
}

/**
 * Removes the query string (everything after and including '?') from a URL.
 * @param str - The input URL string.
 * @returns The URL without the query string, or the original string if '?' is not found.
 */
function trimUrl(str: string): string {
  if (!str) return ""; // Handle null/undefined input
  const queryIndex = str.indexOf("?");
  return queryIndex > -1 ? str.substring(0, queryIndex) : str;
}

/**
 * Extracts the first Twitter URL found within an href attribute in an HTML string.
 * Primarily used for finding the original tweet URL within Twitter's RT structure.
 * @param str - The input HTML string.
 * @returns The extracted Twitter URL, or null if not found.
 */
function findRepostUrl(str: string): string | null {
  if (!str) return null;
  // Reset the regex state for global searches
  REPOST_URL_REGEX.lastIndex = 0;
  const matches = REPOST_URL_REGEX.exec(str);
  // Access group by index (more compatible than named group potentially)
  return matches ? matches[1] : null;
}

/**
 * Extracts the @username of the user being retweeted from a string starting with "RT @...".
 * @param str - The input string (typically the tweet content).
 * @returns The extracted @username (e.g., "@originalAuthor"), or an empty string if not found.
 */
function findRepostUser(str: string): string {
  if (!str) return "";
  // Reset the regex state
  REPOST_USER_REGEX.lastIndex = 0;
  const matches = REPOST_USER_REGEX.exec(str);
  // Access group by index
  return matches ? matches[1] : '';
}

/**
 * Composes the core content string by applying platform-specific logic (BS, TW, default),
 * cleaning HTML, normalizing characters, applying hacks, handling quotes/reposts,
 * and finally formatting mentions based on settings.
 * @param entryTitle - The title input (original Text for TW).
 * @param entryAuthor - The author username from the trigger (quoting user).
 * @param feedTitle - The feed title input (used for author names).
 * @returns The processed content string ready for final status composition.
 */
function composeResultContent(
  entryTitle: string,
  entryAuthor: string, // Quoting author username for TW/BS trigger
  feedTitle: string
): string {
  // Ensure inputs are strings, fallback to empty string if null/undefined
  entryTitle = entryTitle || "";
  // entryAuthor is the QUOTING user's username from the trigger (e.g., "zpravobotnews")
  entryAuthor = entryAuthor || "";
  feedTitle = feedTitle || "";
  // entryContent contains TweetEmbedCode for TW, HTML content for BS/RSS
  entryContent = entryContent || "";

  if (!entryContent && !entryTitle) return ""; // Return early if both main inputs are empty.

  let resultContent = "";
  let resultFeedAuthor = ""; // Real name or username of the QUOTING author
  let feedAuthorUserName = ""; // Username of the QUOTING author
  let feedAuthorRealName = ""; // Real name of the QUOTING author
  let userNameToSkip = ""; // Username to exclude from mention formatting (usually the quoting author)

  // Platform-specific initial content selection and processing
  switch (SETTINGS.POST_FROM) {
    case "BS":
      // BS uses EntryContent (HTML post content)
      resultContent = entryContent;

      // Extract username and real name of the QUOTING author from feedTitle ("username.bsky.social - Real Name")
      const bsSeparatorIndex = feedTitle.indexOf(" - ");
      if (bsSeparatorIndex !== -1) {
        feedAuthorUserName = feedTitle.substring(0, bsSeparatorIndex).trim();
        feedAuthorRealName = feedTitle.substring(bsSeparatorIndex + 3).trim();
      } else {
        feedAuthorUserName = feedTitle.trim(); // Fallback
        feedAuthorRealName = feedTitle.trim(); // Fallback
      }
      // Set username to skip for mention formatting
      userNameToSkip = feedAuthorUserName;
      resultFeedAuthor = SETTINGS.SHOULD_PREFER_REAL_NAME ? feedAuthorRealName : feedAuthorUserName;

      // Handle Bluesky quote posts.
      if (isQuoteInPost(resultContent, "", "BS")) {
        // For BS, entryAuthor from trigger is often "(none)". Pass quoting author's username.
        resultContent = replaceQuoted(resultContent, resultFeedAuthor, feedAuthorUserName, "BS", "");
      }

      // Apply common cleaning steps + moveUrlToEnd for BS.
      resultContent = replaceAllSpecialCharactersAndHtml(resultContent);
      resultContent = replaceAmpersands(resultContent);
      resultContent = contentHack(resultContent);
      resultContent = moveUrlToEnd(resultContent); // Move URL to end for BS.
      // DO NOT call replaceUserNames here.
      break;

    case "TW":
      // Extract tweet text from TweetEmbedCode (in entryContent)
      let tweetText = parseTextFromEntryContent(entryContent);
      // Use extracted text or fall back to entryTitle (original Text) if extraction fails
      resultContent = tweetText || entryTitle;

      // Extract username and real name of the QUOTING author
      feedAuthorUserName = feedTitle.trim(); // Username from trigger (e.g., "zpravobotnews")
      feedAuthorRealName = parseRealNameFromEntryContent(entryContent) || feedAuthorUserName; // Real name from embed code
      // Set username to skip for mention formatting
      userNameToSkip = feedAuthorUserName;
      resultFeedAuthor = SETTINGS.SHOULD_PREFER_REAL_NAME ? feedAuthorRealName : feedAuthorUserName;

      // Handle retweets (RT) - use entryTitle (original Text) for detection
      if (isRepost(entryTitle)) {
        const repostedUser = findRepostUser(entryTitle); // Get the @username being retweeted.
        resultContent = replaceReposted(resultContent, resultFeedAuthor, repostedUser); // Apply RT formatting. Adds "@repostedUser"
      }
      // Handle quotes - check if FirstLinkUrl (entryImageUrl) points to a tweet
      else if (isQuoteInPost("", entryImageUrl, "TW")) {
        // Pass quoting author's username as 3rd arg for consistency, though not used in TW formatting part of replaceQuoted
        resultContent = replaceQuoted(resultContent, resultFeedAuthor, feedAuthorUserName, "TW", entryImageUrl); // Adds "@quotedUser"
      }
      // Handle replies (R to).
      resultContent = replaceResponseTo(resultContent); // Remove reply prefix.

      // Apply common cleaning steps + moveUrlToEnd for TW.
      resultContent = replaceAllSpecialCharactersAndHtml(resultContent);
      resultContent = replaceAmpersands(resultContent);
      resultContent = contentHack(resultContent);
      resultContent = moveUrlToEnd(resultContent); // Move URL to end for TW.
      // DO NOT call replaceUserNames here.
      break;

    default: // Includes RSS, YT, etc.
      resultContent = getContent(entryContent, entryTitle); // Use standard content/title selection.
      userNameToSkip = ""; // Don't skip any username by default for RSS/other.

      // Apply common cleaning steps BUT NOT moveUrlToEnd for default/RSS.
      resultContent = replaceAllSpecialCharactersAndHtml(resultContent);
      resultContent = replaceAmpersands(resultContent);
      resultContent = contentHack(resultContent);
      // moveUrlToEnd is intentionally skipped for RSS/default.
      // DO NOT call replaceUserNames here.
      break;
  }

  // --- Common step after switch ---
  // Apply username formatting (@username -> @username@suffix) for relevant platforms
  // (where userNameToSkip was set, i.e., BS and TW).
  // This now correctly handles mentions potentially added by replaceQuoted/replaceReposted.
  if (userNameToSkip) {
    resultContent = replaceUserNames(resultContent, userNameToSkip, SETTINGS.POST_FROM);
  }

  return resultContent;
}

/**
 * Composes the final status string including processed content, optional image URL,
 * and optional post URL, based on settings and platform logic.
 * Handles content trimming and URL selection/formatting.
 * Uses escapeRegExp for safe URL source replacement.
 * Includes logic for breaking down 'shouldShowUrl' conditions for readability.
 *
 * @param resultContent - The processed content from composeResultContent.
 * @param entryUrl - The original post/item URL.
 * @param entryImageUrl - The original image URL.
 * @param entryTitle - The original title (used for isRepost check).
 * @param entryAuthor - The original author username (used for isRepostOwn check).
 * @returns The final status string ready to be sent.
 */
function composeResultStatus(
  resultContent: string,
  entryUrl: string,
  entryImageUrl: string,
  entryTitle: string,
  entryAuthor: string
): string {
  // Initialize variables
  let urlToShow = '';
  let urlStatus = '';
  let repostUrl = null;
  let shouldShowUrl = false;
  let trimmedContent = '';
  let needsEllipsis = false;

  // Ensure inputs are strings or default to empty
  resultContent = resultContent || "";
  entryUrl = entryUrl || "";
  entryImageUrl = entryImageUrl || "";
  entryTitle = entryTitle || "";
  entryAuthor = entryAuthor || "";

  // Check if the image URL points to a specific Twitter/X media page (not a direct file).
  const isTwitterMediaPageLink = typeof entryImageUrl === 'string' && (entryImageUrl.endsWith('/photo/1') || entryImageUrl.endsWith('/video/1'));

  // Platform-specific logic for trimming, URL visibility, and URL selection.
  switch (SETTINGS.POST_FROM) {
    case "BS": // Bluesky-specific actions
      // 1. Trim content.
      const bsTrimmedResult = trimContent(resultContent);
      trimmedContent = bsTrimmedResult.content;
      needsEllipsis = bsTrimmedResult.needsEllipsis;

      // 2. Determine URL visibility: Show URL if forced, if content was truncated, OR if it's a BS quote post.
      // Pass original entryContent to isBsQuoteInPost as trimming might remove the marker.
      shouldShowUrl = SETTINGS.SHOW_ORIGIN_POSTURL_PERM || needsEllipsis || isBsQuoteInPost(entryContent);

      // 3. Select URL: Use entryUrl if shouldShowUrl is true.
      if (shouldShowUrl) {
        if (typeof entryUrl === 'string') {
          // No POST_SOURCE/POST_TARGET replacement typically needed for BS URLs, but apply if configured.
          const sourcePattern = SETTINGS.POST_SOURCE ? escapeRegExp(SETTINGS.POST_SOURCE) : '';
          if (sourcePattern) {
            urlToShow = entryUrl.replace(new RegExp(sourcePattern, "gi"), SETTINGS.POST_TARGET);
          } else {
            urlToShow = entryUrl; // Use original BS URL
          }
        } else {
          urlToShow = ''; // Safety net
        }
      } else {
        urlToShow = ''; // Ensure empty if not needed.
      }
      break; // End case "BS"

    case "TW": // Twitter-specific actions
      // 1. Clean content: Remove t.co URLs before trimming.
      const cleanedContent = resultContent.replace(TCO_URL_REGEX, '').trim();

      // 2. Trim content: Apply length constraints and ellipsis logic.
      const trimmedResult = trimContent(cleanedContent);
      trimmedContent = trimmedResult.content;
      needsEllipsis = trimmedResult.needsEllipsis;

      // 3. Dynamic URL visibility override: Force showing origin URL if no other URLs remain after cleaning
      //    (unless the missing image was just a /photo/1 or /video/1 link).
      if (!isUrlIncluded(cleanedContent) && !isTwitterMediaPageLink) {
        SETTINGS.SHOW_ORIGIN_POSTURL_PERM = true;
      }

      // 4. Find repost URL (if any) from the original content structure.
      repostUrl = findRepostUrl(resultContent);

      // 5. Determine if *any* URL should be shown based on multiple factors.
      // --- Breakdown of conditions for showing URL ---
      const isRepostUrlDetected = repostUrl !== null;
      const wasContentTruncated = needsEllipsis === true;
      const isPermittedExternalRepost = isRepost(entryTitle) && !isRepostOwn(entryTitle, entryAuthor) && SETTINGS.REPOST_ALLOWED === true;
      // isTwitterMediaPageLink is already defined.
      // SETTINGS.SHOW_ORIGIN_POSTURL_PERM is used directly below.
      // --- End Breakdown ---
      shouldShowUrl =
        isRepostUrlDetected ||
        SETTINGS.SHOW_ORIGIN_POSTURL_PERM || // Use potentially updated value
        wasContentTruncated ||
        isPermittedExternalRepost ||
        isTwitterMediaPageLink;

      // 6. Select the specific URL to show (urlToShow).
      const contentHasUrl = isUrlIncluded(cleanedContent); // Check cleaned content for non-t.co URLs.
      const postHasImage = isImageInPost(entryImageUrl); // Check if it's a valid image URL (not /photo/1 etc.)

      if (shouldShowUrl || contentHasUrl) { // Only proceed if a URL needs to be shown.
        if (contentHasUrl) { // If cleaned content still has a URL...
          urlToShow = postHasImage ? entryImageUrl : entryUrl; // Prefer valid image URL, fallback to entry URL.
        } else { // If cleaned content has no URL...
          urlToShow = postHasImage ? entryImageUrl : (shouldShowUrl ? entryUrl : ''); // Use valid image URL, or entry URL if forced, else empty.
        }

        // 7. Format urlToShow: Replace source/target, handle fallback.
        if (urlToShow && urlToShow !== '(none)') {
          if (typeof urlToShow === 'string') {
            const sourcePattern = SETTINGS.POST_SOURCE ? escapeRegExp(SETTINGS.POST_SOURCE) : '';
            if (sourcePattern) {
              urlToShow = urlToShow.replace(new RegExp(sourcePattern, "gi"), SETTINGS.POST_TARGET);
            }
          } else {
            urlToShow = ''; // Safety net for non-string values.
          }
        } else { // If urlToShow is empty or "(none)"...
          urlToShow = SETTINGS.SHOW_FEEDURL_INSTD_POSTURL ? feedUrl : ''; // Use feed URL as fallback if enabled.
        }
      } else {
        urlToShow = ''; // Ensure empty if no URL should be shown
      }
      break; // End case "TW"

    default: // Default behavior for other platforms (RSS, YT, etc.)
      // 1. Trim content.
      const defaultTrimmedResult = trimContent(resultContent);
      trimmedContent = defaultTrimmedResult.content;
      needsEllipsis = defaultTrimmedResult.needsEllipsis;

      // 2. Determine URL visibility: Show URL only if forced or if content was truncated.
      shouldShowUrl = SETTINGS.SHOW_ORIGIN_POSTURL_PERM || needsEllipsis;

      // 3. Select URL: Use entryUrl if shouldShowUrl is true.
      if (shouldShowUrl) {
        if (typeof entryUrl === 'string') {
          const sourcePattern = SETTINGS.POST_SOURCE ? escapeRegExp(SETTINGS.POST_SOURCE) : '';
          if (sourcePattern) {
            urlToShow = entryUrl.replace(new RegExp(sourcePattern, "gi"), SETTINGS.POST_TARGET);
          } else {
            urlToShow = entryUrl; // Use original if no source pattern
          }
        } else {
          urlToShow = ''; // Safety net
        }
      } else {
        urlToShow = ''; // Ensure empty if not needed.
      }
      break; // End default case
  } // End switch (SETTINGS.POST_FROM)

  // --- Common final steps for all platforms ---

  // Process image URL (handle ampersands).
  const resultImageUrl = typeof entryImageUrl === 'string' ? replaceAmpersands(entryImageUrl) : '';

  // Build image status string if applicable.
  const imageStatus = (isImageInPost(entryImageUrl) && SETTINGS.SHOW_IMAGEURL) ?
    `${SETTINGS.STATUS_IMAGEURL_SENTENCE}${resultImageUrl}` :
    '';

  // Build final URL status string if applicable (handle ampersands in urlToShow).
  urlStatus = (urlToShow && typeof urlToShow === 'string') ?
    `${SETTINGS.STATUS_URL_SENTENCE}${replaceAmpersands(urlToShow)}` :
    '';

  // Compose the final output string.
  return `${trimmedContent}${imageStatus}${urlStatus}`;
}

/**
 * Determines whether a post should be skipped based on various conditions:
 * - Empty content AND title.
 * - Disallowed external reposts.
 * - Presence of banned commercial phrases.
 * - Absence of mandatory keywords.
 * @returns True if the post should be skipped, false otherwise.
 */
function shouldSkipPost(): boolean {
  // Ensure inputs are strings or default to empty
  entryTitle = entryTitle || "";
  entryAuthor = entryAuthor || "";
  entryContent = entryContent || "";

  // 1. Skip if both content and title are effectively empty.
  if ((!entryContent || entryContent.trim() === "" || entryContent === "(none)") &&
    (!entryTitle || entryTitle.trim() === "" || entryTitle === "(none)")) {
    return true;
  }

  // 2. Skip if it's an external repost and reposts are disallowed.
  // Note: isRepost/isRepostOwn primarily check entryTitle for TW context. Adjust if needed for other sources.
  if (isRepost(entryTitle) && !isRepostOwn(entryTitle, entryAuthor) && !SETTINGS.REPOST_ALLOWED) {
    return true;
  }

  // 3. Skip if content or title contains banned commercial phrases.
  if (isCommercialInPost(entryTitle) || isCommercialInPost(entryContent)) {
    return true;
  }

  // 4. Skip if mandatory keywords are defined BUT none are found in title or content.
  if (SETTINGS.MANDATORY_KEYWORDS && SETTINGS.MANDATORY_KEYWORDS.length > 0 &&
    !mustContainKeywords(entryTitle, SETTINGS.MANDATORY_KEYWORDS) &&
    !mustContainKeywords(entryContent, SETTINGS.MANDATORY_KEYWORDS)) {
    return true;
  }

  // If none of the above skip conditions are met, don't skip.
  return false;
}

// --- Main Execution Logic ---
// Check if the post should be skipped based on the defined rules.
if (shouldSkipPost()) {
  // If skip conditions are met, instruct IFTTT to skip this run.
  MakerWebhooks.makeWebRequest.skip("Post skipped due to filter rules."); // Optional skip message
} else {
  // If not skipped, proceed to compose the final content and status.
  // 1. Compose the core content string.
  const resultContent = composeResultContent(entryTitle, entryAuthor, feedTitle);
  // 2. Compose the final status string (including content, image URL, post URL).
  const resultStatus = composeResultStatus(resultContent, entryUrl, entryImageUrl, entryTitle, entryAuthor);
  // 3. Prepare the request body for the IFTTT webhook action.
  const requestBody = `status=${resultStatus}`;
  // 4. Set the body for the webhook request.
  MakerWebhooks.makeWebRequest.setBody(requestBody);
}
