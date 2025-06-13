///////////////////////////////////////////////////////////////////////////////
// settings for IFTTT 📺 webhook filter - June's Friday the 13th, 2025 rev
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
  POST_FROM: "BS" | "RSS" | "TW" | "YT"; // Identifier for the source platform of the post (e.g., Bluesky, RSS feed, Twitter, YouTube).
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
  URL_DOMAIN_FIXES: string[]; // A list of domains (e.g. "rspkt.cz", "example.com") to add the https:// protocol to, if missing.
}

// application settings configuration
const SETTINGS: AppSettings = {
  AMPERSAND_REPLACEMENT: `ꝸ`, // Replacement for & char to prevent encoding issues in URLs or text.
  BANNED_COMMERCIAL_PHRASES: [], // E.g., ["advertisement", "discount", "sale"]. Leave empty to disable this filter.
  CONTENT_HACK_PATTERNS: [], // E.g.: { pattern: "what", replacement: "by_what", flags: "gi", literal: false }, // Replaces pattern "what" by replacement "by_what" with flags.
  EXCLUDED_URLS: ["youtu.be", "youtube.com"], // E.g., ["youtu.be", "youtube.com", "example.com"]. URLs in this list are excluded from trimming but still encoded.
  MANDATORY_KEYWORDS: [], // E.g., ["news", "updates", "important"]. Leave empty to disable mandatory keyword filtering.
  MENTION_FORMATTING: { "YT": { type: "none", value: "" }, }, // Default behavior if platform-specific rule is missing.
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
  URL_DOMAIN_FIXES: [], // E.g., "example.com" // Domains divided by , that are automatically added to https:// if the protocol is missing.
};

///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 📺 webhook - June's Friday the 13th, 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// This connector processes data from various sources (e.g., RSS, Twitter, Bluesky)
// and provides it to the IFTTT webhook for publishing. The data is filtered and
// edited according to the settings in AppSettings.
//
// This section defines the input variables coming from the IFTTT trigger.
// IMPORTANT: Adapt the source (e.g., Twitter.newTweetFromSearch or Feed.newFeedItem)
// based on the specific trigger used in your IFTTT applet.
//
///////////////////////////////////////////////////////////////////////////////

// Main text content from the source. For YouTube, this is the video description.
const entryContent = Youtube.newPublicVideoFromSubscriptions.Description || '';
// Title from the source. For YouTube, this is the video title.
const entryTitle = Youtube.newPublicVideoFromSubscriptions.Title || '';
// URL of the specific post/item. For YouTube, this is the direct link to the video.
const entryUrl = Youtube.newPublicVideoFromSubscriptions.Url || '';
// URL of the first image/media link found in the post. For YouTube, this is the empty string.
const entryImageUrl = '';
// Username of the post author. For YouTube, this is the AuthorName field (channel name).
const entryAuthor = Youtube.newPublicVideoFromSubscriptions.AuthorName || '';
// Title of the feed (can be username, feed name, etc.). For YouTube, this is the AuthorName (channel name).
const feedTitle = Youtube.newPublicVideoFromSubscriptions.Title || '';
// URL of the source feed/profile. For YouTube, this is the empty string.
const feedUrl = '';

///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋📙📗📘𝕏📺 webhook filter v1.5.1 - June's Friday the 13th, 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// Description:
// Processes and filters posts from various platforms (Twitter, Bluesky, RSS, YouTube)
// for IFTTT webhook publishing. Applies normalization, formatting, shortening,
// and platform-specific rules based on settings.
//
///////////////////////////////////////////////////////////////////////////////

// type definitions for string manipulation (standard augmentation)
interface String { startsWith(searchString: string, position ? : number): boolean; endsWith(searchString: string, endPosition ? : number): boolean; }
// type definitions for Object.entries (standard augmentation)
interface ObjectConstructor { entries < T > (o: { [s: string]: T } | ArrayLike < T > ): [string, T][]; }

// Define the maximum number of items allowed in the cache to prevent unlimited memory growth.
const ESCAPE_REGEXP_CACHE_LIMIT = 200;
// Cache object to store escaped strings for quick lookup.
const escapeRegExpCache: { [key: string]: string } = {};
// Array to track the order of keys added to the cache for FIFO eviction strategy.
const cacheOrder: string[] = [];

// Creating domain fix patterns and adding them to CONTENT_HACK_PATTERNS
if (SETTINGS.URL_DOMAIN_FIXES && SETTINGS.URL_DOMAIN_FIXES.length) {
  const domainFixPatterns = createDomainFixPatterns(SETTINGS.URL_DOMAIN_FIXES);
  SETTINGS.CONTENT_HACK_PATTERNS = [...domainFixPatterns, ...(SETTINGS.CONTENT_HACK_PATTERNS || [])];
}

/**
 * Optimized maps for text normalization. Groups multiple patterns
 * (HTML entities, codes) for the same target character into one regular expression
 * with alternatives (|). Used by replaceAllSpecialCharactersAndHtml function.
 * Split into thematic groups for better readability and maintenance.
 */
// Czech characters map for normalization.
const czechCharacters: Record < string, string > = {
  // --- Czech characters (grouped representations) ---
  '&#193;|&Aacute;|A&#769;': 'Á', // Capital Á
  '&#225;|&aacute;|a&#769;': 'á', // Lower case á
  '&Auml;|&#196;|A&#776;': 'Ä', // Capital Ä
  '&auml;|&#228;|a&#776;': 'ä', // Lower case ä
  '&#268;|&Ccaron;|C&#780;': 'Č', // Capital Č
  '&#269;|&ccaron;|c&#780;': 'č', // Lower case č
  '&#270;|&Dcaron;|D&#780;': 'Ď', // Capital Ď
  '&#271;|&dcaron;|d&#780;': 'ď', // Lower case ď
  '&#201;|&Eacute;|E&#769;': 'É', // Capital É
  '&#233;|&eacute;|e&#769;': 'é', // Lower case é
  '&Euml;|&#203;|E&#776;': 'Ë', // Capital Ë
  '&euml;|&#235;|e&#776;': 'ë', // Lower case ë
  '&#282;|&Ecaron;|E&#780;': 'Ě', // Capital Ě
  '&#283;|&ecaron;|e&#780;': 'ě', // Lower case ě
  '&#205;|&Iacute;|I&#769;': 'Í', // Capital Í
  '&#237;|&iacute;|i&#769;': 'í', // Lower case í
  '&Iuml;|&#207;|I&#776;': 'Ï', // Capital Ï
  '&iuml;|&#239;|i&#776;': 'ï', // Lower case ï
  '&#327;|&Ncaron;|N&#780;': 'Ň', // Capital Ň
  '&#328;|&ncaron;|n&#780;': 'ň', // Lower case ň
  '&#211;|&Oacute;|O&#769;': 'Ó', // Capital Ó
  '&#243;|&oacute;|o&#769;': 'ó', // Lower case ó
  '&Ouml;|&#214;|O&#776;': 'Ö', // Capital Ö
  '&ouml;|&#246;|o&#776;': 'ö', // Lower case ö
  '&Odblac;|&#336;|O&#778;': 'Ő', // Capital Ő
  '&odblac;|&#337;|o&#778;': 'ő', // Lower case ő
  '&#344;|&Rcaron;|R&#780;': 'Ř', // Capital Ř
  '&#345;|&rcaron;|r&#780;': 'ř', // Lower case ř
  '&#352;|&Scaron;|S&#780;': 'Š', // Capital Š
  '&#353;|&scaron;|s&#780;': 'š', // Lower case š
  '&#356;|&Tcaron;|T&#780;': 'Ť', // Capital Ť
  '&#357;|&tcaron;|t&#780;': 'ť', // Lower case ť
  '&#218;|&Uacute;|U&#769;': 'Ú', // Capital Ú
  '&#250;|&uacute;|u&#769;': 'ú', // Lower case ú
  '&Uuml;|&#220;|U&#776;': 'Ü', // Capital Ü
  '&uuml;|&#252;|u&#776;': 'ü', // Lower case ü
  '&#366;|&Uring;|U&#778;': 'Ů', // Capital Ů
  '&#367;|&uring;|u&#778;': 'ů', // Lower case ů
  '&Udblac;|&#368;|U&#369;': 'Ű', // Capital Ű
  '&udblac;|&#369;|u&#369;': 'ű', // Lower case ű
  '&#221;|&Yacute;|Y&#769;': 'Ý', // Capital Ý
  '&#253;|&yacute;|y&#769;': 'ý', // Lower case ý
  '&#381;|&Zcaron;|Z&#780;': 'Ž', // Capital Ž
  '&#382;|&zcaron;|z&#780;': 'ž', // Lower case ž
};

// Special characters and symbols map for normalization.
const specialCharacters: Record < string, string > = {
  '&#33;|&excl;|&#x21;': '!',
  '&#36;|&dollar;|&#x24;|&#65284;|&#xFF04;': '$',
  '&#37;|&percnt;|&#x25;': '%',
  '&#40;|&lpar;|&#x28;': '(',
  '&#41;|&rpar;|&#x29;': ')',
  '&#43;|&plus;|&#x2B;|&#x2b;': '+', // replaced with Heavy Plus Sign emoji to avoid IFTTT processing issues
  '&#46;|&period;|&#046;|&#x2e;': '.', // Dot (046 added for sure)
  '&#60;|&lt;|&#x3c;': '<',
  '&#61;|&equals;|&#x3d;': '=',
  '&#62;|&gt;|&#x3e;': '>',
  '&#63;|&quest;|&#x3f;': '?',
  '&#91;|&lbrack;|&#x5b;': '[',
  '&#93;|&rbrack;|&#x5d;': ']',
  '&#95;|&lowbar;|&#x5f;': '_',
  '&#123;|&lbrace;|&#x7b;': '{',
  '&#124;|&vert;|&#x7c;|VerticalLine': '|', // VerticalLine added for security
  '&#125;|&rbrace;|&#x7d;': '}',
  '&#8230;|&hellip;|&mldr;|&#x2026;': '…', // Three dots to …
  '&#162;|&cent;|&#xa2;|&#65504;|&#xFFE0;': '¢',
  '&#163;|&pound;|&#xa3;|&#65505;|&#xFFE1;': '£',
  '&#165;|&yen;|&#xa5;|&#65509;|&#xFFE5;': '¥',
  '&#169;|&copy;|&#xA9;|&#xa9;': '©',
  '&#174;|&reg;|&#xAE;|&#xae;': '®',
  '&#176;|&deg;|&#xb0;': '°',
  '&#177;|&plusmn;|&#xb1;': '±',
  '&#183;|&centerdot;|&middot;|&#xB7;': '·',
  '&#188;|&frac14;|&#xBC;': '¼',
  '&#189;|&half;|&#xBD;': '½',
  '&#190;|&frac34;|&#xBE;': '¾',
  '&#215;|&times;|&#xd7;': '×',
  '&#247;|&divide;|&#xf7;': '÷',
  '&#8364;|&euro;|&#x20AC;': '€',
  '&#8482;|&trade;|&#x2122;': '™',
  '&#137;|&permil;|&#x89;|&#8241;|&#x2031;': '‰', // Per ten thousand sign
  '&#139;|&#x8B;': '‹', // Single left-pointing angle quotation mark
  '&#155;|&#x9B;': '›', // Single right-pointing angle quotation mark
  '&#8242;|&prime;|&#x2032;': '′', // Prime
  '&#8243;|&Prime;|&#x2033;': '″', // Double Prime
  '&#8451;|&#x2103;': '℃', // Celsius degree
  '&#8776;|&thickapprox;|&#x2248;': '≈', // Almost equal to
  '&#8800;|&ne;|&#x2260;': '≠', // Not equal to
  '&#9001;|&#x2329;': '〈', // Left-pointing angle bracket
  '&#9002;|&#x232A;|&#x232a;': '〉', // Right-pointing angle bracket
};

// Spaces, hyphens, quotes and ampersand map for normalization.
const spacesAndDashes: Record < string, string > = {
  '&#09;|&#009|&#10;|&#010|&#13;|&#013|&#32;|&#032|&#160;|&nbsp;|&#8192;|&#8193;|&#8194;|&#8195;|&#8196;|&#8197;|&#8198;|&#8199;|&#8200;|&#8201;|&#8202;|&#8203;|&#8204;|&#8205;|&#8206;|&#8207;|&#xA0;': ' ', // Grouped spaces (Note: \s+ is solved later by replace REGEX_PATTERNS.MULTIPLE_SPACES function)
  '&#173;|&shy;|&#8208;|&#x2010;|&#8209;|&#x2011;|&#8210;|&#x2012;|&#8211;|&ndash;|&#x2013;|&#8212;|&mdash;|&#x2014;|&#8213;|&#x2015;|&#8722;|&minus;|&#x2212;': '-', // Grouped hyphens/dashes
  '&#39;|&#039;|&apos;|&#x27;|&#8216;|&lsquo;|&#x2018;|&#8217;|&rsquo;|&#x2019;|&#8218;|&sbquo;|&#x201A;|&#x201a;|&#8219;|&#x201B;|&#x201b;': "'", // Grouped single quotes
  '&#34;|&quot;|&#x22;|&#8220;|&ldquo;|&#x201C;|&#x201c;|&#8221;|&rdquo;|&#x201D;|&#x201d;|&#8222;|&bdquo;|&#x201E;|&#x201e;|&#8223;|&#x201F;|&#x201f;': '"', // Grouped double quotes
  '&#38;|&#038;|&amp;|&': SETTINGS.AMPERSAND_REPLACEMENT, // Grouped ampersand in entryContent replacements - needs to be at the end of the map
};

// Combine all thematic maps into a single characterMap for processing.
const characterMap: Record < string, string > = { ...czechCharacters, ...specialCharacters, ...spacesAndDashes, };

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
 * Composes the core content string by applying platform-specific logic (BS, TW, default),
 * cleaning HTML, normalizing characters, applying hacks, handling quotes/reposts,
 * and finally formatting mentions based on settings.
 * @param entryTitle - The title input (original Text for TW).
 * @param entryAuthor - The author username from the trigger (quoting user).
 * @param feedTitle - The feed title input (used for author names).
 * @returns The processed content string ready for final status composition.
 */
function composeResultContent(entryTitle: string, entryAuthor: string, feedTitle: string): string {
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
      // Apply common cleaning steps + moveUrlToEnd for BS.
      resultContent = replaceAllSpecialCharactersAndHtml(resultContent);
      resultContent = replaceAmpersands(resultContent);
      resultContent = moveUrlToEnd(resultContent); // Move URL to end for BS.
      resultContent = contentHack(resultContent);
      // Handle Bluesky quote posts.
      if (isQuoteInPost(resultContent, "", "BS")) {
        // For BS, entryAuthor from trigger is often "(none)". Pass quoting author's username.
        resultContent = replaceQuoted(resultContent, resultFeedAuthor, feedAuthorUserName, "BS", "");
      }
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
      // Apply common cleaning steps + moveUrlToEnd for TW.
      resultContent = replaceAllSpecialCharactersAndHtml(resultContent);
      resultContent = replaceAmpersands(resultContent);
      resultContent = contentHack(resultContent);
      // resultContent = moveUrlToEnd(resultContent); // Move URL to end for TW.
      // Handle replies (R to).
      resultContent = replaceResponseTo(resultContent); // Remove reply prefix.
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
      break;
    default: // Includes RSS, YT, etc.
      resultContent = getContent(entryContent, entryTitle); // Use standard content/title selection.
      userNameToSkip = ""; // Don't skip any username by default for RSS/other.
      // Apply common cleaning steps BUT NOT moveUrlToEnd for default/RSS.
      resultContent = replaceAllSpecialCharactersAndHtml(resultContent);
      resultContent = replaceAmpersands(resultContent);
      resultContent = contentHack(resultContent);
      // moveUrlToEnd is intentionally skipped for RSS/default.
      break;
  }
  // --- Common step after switch ---
  // Apply username formatting (@username -> @username@suffix) for relevant platforms (where userNameToSkip was set, i.e., BS and TW).
  if (userNameToSkip) { resultContent = replaceUserNames(resultContent, userNameToSkip, SETTINGS.POST_FROM); }
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
function composeResultStatus(resultContent: string, entryUrl: string, entryImageUrl: string, entryTitle: string, entryAuthor: string): string {
  // Initialize variables
  let urlToShow = '';
  let urlStatus = '';
  let repostUrl = null;
  let shouldShowUrl = false;
  let trimmedContent = '';
  let needsEllipsis = false;
  // Ensure inputs are strings or default to empty
  resultContent = resultContent || "";
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
      // Pass original entryContent to isQuoteInPost as trimming might remove the marker.
      shouldShowUrl = SETTINGS.SHOW_ORIGIN_POSTURL_PERM || needsEllipsis || isQuoteInPost(resultContent, "", "BS");
      // 3. Select URL: Use entryUrl if shouldShowUrl is true.
      if (shouldShowUrl) {
        if (typeof entryUrl === 'string') {
          // No POST_SOURCE/POST_TARGET replacement typically needed for BS URLs, but apply if configured.
          const sourcePattern = SETTINGS.POST_SOURCE ? escapeRegExp(SETTINGS.POST_SOURCE) : '';
          if (sourcePattern) {
            urlToShow = entryUrl.replace(new RegExp(sourcePattern, "gi"), SETTINGS.POST_TARGET);
          } else { urlToShow = entryUrl; } // Use original BS URL
        } else { urlToShow = ''; } // Safety net
      } else { urlToShow = ''; } // Ensure empty if not needed.
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
      if (!isUrlIncluded(cleanedContent) && !isTwitterMediaPageLink) { SETTINGS.SHOW_ORIGIN_POSTURL_PERM = true; }
      // 4. Find repost URL (if any) from the original content structure.
      repostUrl = findRepostUrl(resultContent);
      // 5. Determine if *any* URL should be shown based on multiple factors.
      const isRepostUrlDetected = repostUrl !== null;
      const wasContentTruncated = needsEllipsis === true;
      const isPermittedExternalRepost = isRepost(entryTitle) && !isRepostOwn(entryTitle, entryAuthor) && SETTINGS.REPOST_ALLOWED === true;
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
          } else { urlToShow = entryUrl; } // Use original if no source pattern
        } else { urlToShow = ''; } // Safety net
      } else { urlToShow = ''; } // Ensure empty if not needed.
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
 * Applies custom substitution using regular expressions defined in SETTINGS.CONTENT_HACK_PATTERNS.
 * Processes domain fixes from URL_DOMAIN_FIXES first, then applies other defined hacks.
 * Supports the 'literal' flag for escaping special characters in patterns.
 * @param str - Input string to be modified.
 * @returns Modified string after applying all defined hacks.
 */
function contentHack(str: string): string {
  if (!str) return ""; // Treatment of empty or undefined input
  str = str.replace(/\+/g, "\uFE63"); // Replace the "+" character with its unicode equivalent "﹢" (hard-coded modification)
  const domainFixPatterns = createDomainFixPatterns(SETTINGS.URL_DOMAIN_FIXES || []); // Create domain repair patterns from URL_DOMAIN_FIXES
  // Processing domain fixes as the first priority
  let result = domainFixPatterns.reduce((acc, pattern) => {
    try {     
      const regex = new RegExp(pattern.pattern, pattern.flags); // Creating a regular expression from a pattern and its flags
      return acc.replace(regex, pattern.replacement); // Apply replacements to the current text
    } catch (e) { /* ignore */ } // Ignoring invalid regex errors
    return acc; // Return unchanged text on error
  }, str);
  // Processing of other defined CONTENT_HACK_PATTERNS
  if (SETTINGS.CONTENT_HACK_PATTERNS) {
    for (const pattern of SETTINGS.CONTENT_HACK_PATTERNS) {
      try {
        // If the 'literal' flag is set to true, special characters in the pattern are escaped
        const patternText = pattern.literal ? 
          escapeRegExp(pattern.pattern) : 
          pattern.pattern;        
        // Using defined flags or default 'gi' (global, case-insensitive)
        const flags = pattern.flags || 'gi';
        const regex = new RegExp(patternText, flags);
        // Apply replacements to the current text
        result = result.replace(regex, pattern.replacement);
      } catch (e) { /* ignore */ } // Ignoring invalid regex errors
    }
  }  
  return result; // Return of the final edited text
}

/**
 * Creates domain repair patterns from the URL_DOMAIN_FIXES field.
 * This function accepts a list of domains and creates a RegExp pattern for each,
 * which ensures that if a domain is not preceded by http:// or https://,
 * it will be prefixed with https://. Special characters in domains are escaped.
 * @param domains - An array of strings containing the domains to be modified by adding https://.
 * @returns An array of objects with RegExp patterns, replacement strings and flags, or an empty array if the input is not valid.
 */
function createDomainFixPatterns(domains: string[]) {
  return domains
    .filter(domain => !!domain) // Filtrování prázdných nebo nedefinovaných domén
    .map(domain => ({
      pattern: `(?<!https?:\\/\\/)${domain.replace(/\./g, '\\.')}\\/?`, // Pattern with negative lookbehind to check for absence of protocol
      replacement: `https://${domain}/`, // Replace by adding https:// before the domain
      flags: "gi", // Global replacement and case-insensitive flags
      literal: false // Explicitly set that pattern is a regular expression, not literal text
    }));
}

/**
 * Escapes special characters in a string to make it safe for use in regular expressions.
 * Uses memoization with a size-limited cache to optimize performance and manage memory usage.
 * @param str - The input string to be escaped.
 * @returns The escaped string with special characters prefixed by backslashes, or empty string if input is invalid.
 */
function escapeRegExp(str: string): string {
  if (!str) return '';  // Handle null or undefined input by returning an empty string
  // Check if the input string is already in the cache
  if (str in escapeRegExpCache) {
    return escapeRegExpCache[str];
  }
  // Perform escaping by replacing special regex characters with escaped versions
  const escaped = str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Add the new input and result to the cache
  escapeRegExpCache[str] = escaped;
  cacheOrder.push(str);
  // Remove oldest entry if cache exceeds the size limit
  if (cacheOrder.length > ESCAPE_REGEXP_CACHE_LIMIT) {
    const oldestKey = cacheOrder.shift();
    if (oldestKey) delete escapeRegExpCache[oldestKey];
  }
  return escaped;
}

/**
 * Extracts the first Twitter URL found within an href attribute in an HTML string.
 * Primarily used for finding the original tweet URL within Twitter's RT structure.
 * @param str - The input HTML string.
 * @returns The extracted Twitter URL, or null if not found.
 */
function findRepostUrl(str: string): string | null {
  if (!str) return null; // Handle null or undefined input by returning an empty string
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
  if (!str) return ""; // Handle null or undefined input by returning an empty string
  // Reset the regex state
  REPOST_USER_REGEX.lastIndex = 0;
  const matches = REPOST_USER_REGEX.exec(str);
  // Access group by index
  return matches ? matches[1] : '';
}

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
 * Checks if the input string contains any banned commercial phrases from settings.
 * Uses escapeRegExp to treat banned phrases literally. Case-insensitive.
 * @param str - The input string (content or title).
 * @returns True if a banned phrase is found, false otherwise.
 */
function isCommercialInPost(str: string): boolean {
  if (!str || !SETTINGS.BANNED_COMMERCIAL_PHRASES || SETTINGS.BANNED_COMMERCIAL_PHRASES.length === 0) { return false; }
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
      // Error is ignored, continue with other phrases
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
  if (!str || str === "(none)" || str === "https://ifttt.com/images/no_image_card.png") { return false; } // Check for null, undefined, empty string, or known invalid values first.
  if (str.endsWith('/photo/1') || str.endsWith('/video/1')) { return false; } // Exclude specific Twitter/X media page links which aren't direct image files.
  // Basic check if it looks like a URL.
  return URL_REGEX.test(str);
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
  // BS Check: Look for quote marker in content
  if (postFrom === 'BS') { return BS_QUOTE_REGEX.test(entryContent); }
  // TW: Check if FirstLinkUrl points to a tweet
  if (postFrom === 'TW' && typeof entryFirstLinkUrl === 'string') {
    // Check if it's a tweet status link
    const isStatusLink = /^https?:\/\/(twitter\.com|x\.com)\/[^\/]+\/status\/\d+/i.test(entryFirstLinkUrl);
    // Exclude media attachments to avoid false positives
    const isMediaAttachment = /\/(photo|video)\/\d+$/i.test(entryFirstLinkUrl);
    return isStatusLink && !isMediaAttachment;
  }
  return false;
}

/**
* Detects if the text is a reply starting with the user's name.
 * @param {string} str - Input text to parse
 * @returns {boolean} True if the text begins with a valid mention, false otherwise
 */
function isReply(str: string): boolean {
  if (!str) return false; // Handle null or undefined input by returning an empty string
  const trimmed = str.trim(); // Normalization - remove whitespace at the beginning/end
  if (/^RT\s+@[\w]+/i.test(trimmed)) return false; // Exclude the beginning of "RT " (retweet)
  return /^(\.?@[\w]+|R to @[\w]+(\s|:|))/i.test(trimmed); // We detect reply formats
}

/**
 * Checks if the input string starts with the standard Twitter "RT @" prefix.
 * @param str - The input string (usually entryTitle for Twitter).
 * @returns True if it's a retweet, false otherwise.
 */
function isRepost(str: string): boolean { return str ? REPOST_PREFIX_REGEX.test(str) : false; } // Check for null/undefined str

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
function isUrlIncluded(str: string): boolean { return str ? URL_REGEX.test(str) : false; } // Check for null/undefined str

/**
 * Moves the first detected URL (http/https) in a string to the end.
 * If no URL is found, returns the original string.
 * @param entryContent - The input string.
 * @returns The string with the first URL moved to the end, or the original string.
 */
function moveUrlToEnd(entryContent: string): string {
  if (!entryContent || !URL_REGEX.test(entryContent)) { return entryContent || ""; } // Return original or empty if no content or no URL
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
  if (!keywords || keywords.length === 0) { return true; } // If no keywords are mandatory, the condition is always met.
  if (!str) return false; // If the string is empty/null, it cannot contain keywords.
  const lowerCaseStr = str.toLowerCase();
  for (const keyword of keywords) { // Use for...of for better readability
    if (!keyword) continue; // Skip empty keywords in the settings array
    // Use indexOf !== -1 instead of includes
    if (lowerCaseStr.indexOf(keyword.toLowerCase()) !== -1) { return true; } // Found at least one keyword.
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
  if (!embedCode) return ""; // Handle null or undefined input by returning an empty string
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
  if (!embedCode) return ""; // Handle null or undefined input by returning an empty string
  // Searches for the contents of the <p ...>...</p> tag
  let match = embedCode.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (match && match[1]) { return match[1].trim(); } // Returns text (HTML entities will be removed later)
  return ""; // Return empty string if <p> not found
}

/**
 * Extracts the username from a Twitter status URL.
 * @param url - The Twitter status URL (e.g., https://twitter.com/username/status/123)
 * @returns The extracted username or an empty string if not found.
 */
function parseUsernameFromTweetUrl(url: string): string {
  if (!url) return ""; // Handle null or undefined input by returning an empty string
  // Regex to capture username between domain and /status/
  const match = url.match(/^https?:\/\/(?:twitter\.com|x\.com)\/([^\/]+)\/status\/\d+/i);
  // Return the captured group (username) or an empty string
  return match && match[1] ? match[1] : "";
}

/**
 * Normalizes a string by removing most HTML tags, converting line breaks,
 * replacing special character entities/codes, and normalizing whitespace.
 * @param str - The input string (often containing HTML).
 * @returns The normalized string.
 */
function replaceAllSpecialCharactersAndHtml(str: string): string {
  if (!str) return ''; // Handle null/undefined input
  // 1. Remove all HTML tags except <br>, <br/>, <p>
  str = str.replace(HTML_TAG_REGEX, '');
  // 2. Replace <br>, <br/>, <p> with newline characters
  str = str.replace(HTML_LINE_BREAKS_REGEX, '\n');
  // 3. Temporarily replace newlines to protect them during character replacement
  const tempNewline = 'TEMP_NEWLINE_MARKER';
  str = str.replace(/\r?\n/g, tempNewline);
  // 4. Replace special character entities/codes using the characterMap
  for (const [pattern, replacement] of Object.entries(characterMap)) {
    try {
      const regex = new RegExp(pattern, 'g');
      str = str.replace(regex, replacement);
    } catch (e) {} // Error ignored, continue with more phrases
  }
  // 5. Replace multiple spaces with a single space
  str = str.replace(MULTIPLE_SPACES_REGEX, ' ');
  // 6. Restore newline characters
  str = str.replace(new RegExp(tempNewline, 'g'), '\n');
  // 7. Limit consecutive newline characters to a maximum of two
  str = str.replace(MULTIPLE_EOL_REGEX, '\n\n');
  return str.trim(); // Trim leading/trailing whitespace
}

/**
 * Replaces ampersands in text with a specified replacement character,
 * while preserving URLs by encoding them appropriately.
 * URLs in SETTINGS.EXCLUDED_URLS are only URL-encoded.
 * Other URLs are trimmed (query string removed) and then URL-encoded.
 * Ampersands in non-URL parts are replaced with SETTINGS.AMPERSAND_REPLACEMENT.
 * @param str - The input string.
 * @returns The string with ampersands processed.
 */
function replaceAmpersands(str: string): string {
  if (!str) return ''; // Return empty string if input is null or undefined
  return str.replace(/\S+/g, (word) => {
    if (isUrlIncluded(word)) { // Check if the current word contains a URL (starts with http:// or https://)
      const isExcluded = SETTINGS.EXCLUDED_URLS.some(excludedUrl =>
        word.toLowerCase().indexOf(excludedUrl.toLowerCase()) !== -1
      ); // Check if the URL matches any domain in the EXCLUDED_URLS list (case-insensitive)
      return encodeURI(isExcluded ? word : trimUrl(word)); // Encode the URL using encodeURI; if not excluded, trim query parameters first
    }
    return word; // Return non-URL parts unchanged as ampersand replacement is handled in replaceAllSpecialCharactersAndHtml
  });
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
function replaceQuoted(str: string, resultFeedAuthor: string, entryAuthor: string, postFrom: string, entryFirstLinkUrl: string): string {
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
function replaceReposted(str: string, resultFeedAuthor: string, entryAuthor: string): string {
  return str.replace(REPOST_PREFIX_REGEX, `${resultFeedAuthor}${SETTINGS.REPOST_SENTENCE}${entryAuthor}:\n`); // Prepends custom repost sentence and original author.
}

/**
 * Removes the "R to @username: " prefix if present at the beginning of a string.
 * @param str - The input string.
 * @returns The string with the prefix removed, or the original string if not found.
 */
function replaceResponseTo(str: string): string { return str.replace(RESPONSE_PREFIX_REGEX, ""); }

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
function replaceUserNames(str: string, skipName: string, postFrom: string): string {
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
    // Error is ignored, continue with other usernames
    return str; // Return original string if regex fails
  }
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
  // 1. Skip if both content and title are effectively empty.
  if ((!entryContent || entryContent.trim() === "" || entryContent === "(none)") &&
    (!entryTitle || entryTitle.trim() === "" || entryTitle === "(none)")) {
    return true;
  }
  // 2. Skip if it's an external repost and reposts are disallowed.
  // Note: isRepost/isRepostOwn primarily check entryTitle for TW context. Adjust if needed for other sources.
  if (isRepost(entryTitle) && !isRepostOwn(entryTitle, entryAuthor) && !SETTINGS.REPOST_ALLOWED) { return true; }
  // 3. Skip if content title or URLs contains banned commercial phrases.
  if (isCommercialInPost(entryTitle) || isCommercialInPost(entryContent) || isCommercialInPost(entryUrl) || isCommercialInPost(entryImageUrl)) { return true; }
  // 4. Skip if mandatory keywords are defined BUT none are found in title or content.
  if (SETTINGS.MANDATORY_KEYWORDS && SETTINGS.MANDATORY_KEYWORDS.length > 0 &&
    !mustContainKeywords(entryTitle, SETTINGS.MANDATORY_KEYWORDS) &&
    !mustContainKeywords(entryContent, SETTINGS.MANDATORY_KEYWORDS)) {
    return true;
  }
  // 5. Skip if content or title starts with @username (reply)
  if (isReply(entryTitle) || isReply(entryContent)) { return true; }
  return false; // If none of the above skip conditions are met, don't skip.
}

/**
 * Improved trimContent function
 * - Detects and normalizes ellipses
 * - Identifies appropriate terminators (punctuation, emoji, URLs, hashtags, mentions)
 * - Intelligently adds ellipsis for long texts
 * - Trim content at word boundaries when possible
 *
 * @param str - Input string to process
 * @returns Object { content: string, needsEllipsis: boolean } with modified content and flag to add ellipsis
 */
function trimContent(str: string): { content: string, needsEllipsis: boolean } {
  // Handle null/undefined input
  if (!str) { return { content: '', needsEllipsis: false }; }
  str = str.trim();
  if (!str) { return { content: '', needsEllipsis: false }; }
  // Normalize existing triple dots and HTML ellipsis to a single ellipsis character
  str = str.replace(/\.(\s*\.){2,}/gim, '…');
  let needsEllipsis = false;
  // Twitter-specific logic
  if (SETTINGS.POST_FROM === 'TW') {
    str = str.replace(/\s+(https?:\/\/)/g, '$1'); // Remove leading spaces before URLs to ensure correct terminator detection
    const EMOJI_REGEX = /\p{Extended_Pictographic}/gu; // Unicode-aware regex for emoji including all skin tone modifiers
    const URL_HASHTAG_MENTION_REGEX = /(\bhttps?:\/\/[^\s]+\b|#[a-zA-Z0-9_]+|@[a-zA-Z0-9_]+)$/i; // Regex for hashtags, mentions and URLs as terminators (case-insensitive, word boundary, supports underscores and long paths)
    const TRUNCATE_THRESHOLD = Math.min(257, SETTINGS.POST_LENGTH - 30); // Dynamic threshold for shortening activation
    // Termination check priority: URL > Emoji/Punctuation > Mentions/Hashtags
    const hasTerminator =
      URL_HASHTAG_MENTION_REGEX.test(str) ||
      EMOJI_REGEX.test(str.slice(-4)) ||
      /[.!?;:)"'\]}…]$/.test(str) ||
      /\s>>$/.test(str);
    // Condition 1: Content needs truncation but lacks terminators - only for TW
    if (str.length > TRUNCATE_THRESHOLD && str.length <= SETTINGS.POST_LENGTH && !hasTerminator) {
      str += '…';
      needsEllipsis = true;
    }
  }
  // General truncation logic for all platforms
  if (str.length > SETTINGS.POST_LENGTH) {
    if (SETTINGS.POST_LENGTH_TRIM_STRATEGY === 'sentence') {
      // Find the last period within the limit
      const lastPeriodIndex = str.slice(0, SETTINGS.POST_LENGTH).lastIndexOf('.');
      if (lastPeriodIndex > 0) {
        str = str.slice(0, lastPeriodIndex + 1).trim();
        needsEllipsis = false;
      } else {
        // If no period, fallback to word strategy
        const lastSpaceIndex = str.slice(0, SETTINGS.POST_LENGTH - 1).lastIndexOf(' ');
        if (lastSpaceIndex > 0) { str = str.slice(0, lastSpaceIndex).trim(); 
        } else { str = str.slice(0, SETTINGS.POST_LENGTH - 1).trim(); }
        needsEllipsis = true;
      }
    } else {
      // Word strategy
      const lastSpaceIndex = str.slice(0, SETTINGS.POST_LENGTH - 1).lastIndexOf(' ');
      if (lastSpaceIndex > 0) { str = str.slice(0, lastSpaceIndex).trim();
      } else { str = str.slice(0, SETTINGS.POST_LENGTH - 1).trim(); }
      needsEllipsis = true;
    }
  }
  // Condition for all platforms: The content has exactly the maximum length and has no terminator
  if (SETTINGS.POST_FROM !== 'TW' && str.length === SETTINGS.POST_LENGTH) {
    // Simple terminator check for non-TW platforms
    const hasSimpleTerminator = /[.!?;:)"'\]}…]$/.test(str);
    if (!hasSimpleTerminator && !needsEllipsis) {
      str += '…';
      needsEllipsis = true;
    }
  }
  return { content: str, needsEllipsis: needsEllipsis };
}

/**
 * Trims query parameters from URLs by removing everything after the '?' character.
 * Returns the URL without the query string, or the original string if '?' is not found.
 * @param str - The input URL string.
 * @returns The URL without the query string.
 */
function trimUrl(str: string): string {
  if (!str) return ''; // Handle null or undefined input by returning an empty string
  const queryIndex = str.indexOf('?');
  return queryIndex === -1 ? str : str.substring(0, queryIndex);
}

// --- Main Execution Logic ---
// Check if the post should be skipped based on the defined rules. 
if (shouldSkipPost()) {
  MakerWebhooks.makeWebRequest.skip('Skipped due to filter rules.'); // If skip conditions are met, instruct IFTTT to skip this run.
} else {
  // If not skipped, proceed to compose the final content and status for the IFTTT webhook action.
  const finalStatus = composeResultStatus(composeResultContent(entryTitle, entryAuthor, feedTitle), entryUrl, entryImageUrl, entryTitle, entryAuthor);
  MakerWebhooks.makeWebRequest.setBody(`status=${finalStatus}`);
}