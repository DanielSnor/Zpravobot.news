///////////////////////////////////////////////////////////////////////////////
// settings for IFTTT 📙📗📘 webhook filter - Pi Day 2025 rev
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
  EXCLUDED_URLS: string[]; // URLs excluded from trimUrl
  MANDATORY_KEYWORDS: string[]; // list of keywords that must appear in the post content or title for it to be published.
  POST_FROM: "BS" | "RSS" | "TW" | "YT"; // identifier for the source platform of the post (e.g., RSS feed, Twitter, YouTube).
  POST_LENGTH: number; // maximum post length (0-500 chars)
  POST_SOURCE: string; // original post URL format
  POST_TARGET: string; // target post URL format
  USER_INSTANCE: string; // user instance suffix
  QUOTE_SENTENCE: string; // quote indicator prefix
  REPOST_ALLOWED: boolean; // whether reposts are allowed
  REPOST_SENTENCE: string; // repost indicator prefix
  SHOULD_PREFER_REAL_NAME: boolean; // use real name instead of username
  SHOW_FEEDURL_INSTD_POSTURL: boolean; // show feed URL instead of post URL
  SHOW_IMAGEURL: boolean; // include image URLs in post
  SHOW_ORIGIN_POSTURL_PERM: boolean; // whether to always include the original post URL in the output, regardless of other conditions.
  SHOW_TITLE_AS_CONTENT: boolean; // use entryTitle as a content
  STATUS_IMAGEURL_SENTENCE: string; // image URL prefix
  STATUS_URL_SENTENCE: string; // URL prefix/suffix formatting
}

// application settings configuration
const SETTINGS: AppSettings = {
  AMPERSAND_REPLACEMENT: `and`, // replacement for & char
  BANNED_COMMERCIAL_PHRASES: [], // phrases array ["advertisement", "discount", "sale"] 
  CONTENT_HACK_PATTERNS: [ // content hack - content manipulation function
    // { pattern: "(?<!https?:\/\/)(example\.com\/)", replacement: "https:\/\/example\.com\/", flags: "gi" }, // hack for URLs without protocol
    // { pattern: "(ZZZZZ[^>]+KKKKK)", replacement: "", flags: "gim" }, // replaces parts of the string between ZZZZZ and KKKKK including them with an empty string.
    // { pattern: "what", replacement: "by_what", flags: "gi" }, // replaces pattern "what" by replacement "by_what" with flags 
  ],
  EXCLUDED_URLS: [], // array excluding URLs from trimUrl ["youtu.be", "youtube.com", "example.com"]
  MANDATORY_KEYWORDS: [], // keyword array ["news", "updates", "important"]
  POST_FROM: "RSS", // "BS" | "RSS" | "TW" | "YT"
  POST_LENGTH: 444, // 0 - 500 chars
  POST_SOURCE: "", // "" | `https://twitter.com/` | `https://x.com/`
  POST_TARGET: "", // "" | `https://twitter.com/` | `https://x.com/`
  USER_INSTANCE: "", // "" | ".bsky.social" | "@twitter.com" | "@x.com"
  QUOTE_SENTENCE: "", // "" | "comments post from" | "contains quote post or other embedded content" | "𝕏📝💬"
  REPOST_ALLOWED: true, // true | false
  REPOST_SENTENCE: "", // "" | "shares" | "𝕏📤"
  SHOULD_PREFER_REAL_NAME: true, // true | false
  SHOW_FEEDURL_INSTD_POSTURL: false, // true | false
  SHOW_IMAGEURL: false, // true | false
  SHOW_ORIGIN_POSTURL_PERM: true, // true | false
  SHOW_TITLE_AS_CONTENT: false, // true | false
  STATUS_IMAGEURL_SENTENCE: "", // "" | "🖼️"
  STATUS_URL_SENTENCE: "\n", // "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 " | "\n🗣️🎙️👇👇👇\n" | "\nYT 📺👇👇👇\n"
};

///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🦋📙📗📘 webhook - Pi Day 2025 rev
///////////////////////////////////////////////////////////////////////////////
// 
// This connector processes data from various sources (e.g. RSS, Twitter, Bluesky) 
// and provides it to the IFTTT webhook for publishing.
// 
// The data is filtered and edited according to the settings in AppSettings.
// 
// Sources:
// - entryContent: Entry content for post
// - entryTitle: Entry title for post
// - entryUrl: Post URL
// - entryImageUrl: URL of the first image in the post
// - entryAuthor: Name of the author of the post
// - feedTitle: Feed Title (username)
// - feedUrl: Feed URL
// 
///////////////////////////////////////////////////////////////////////////////

const entryContent = String(Feed.newFeedItem.EntryContent); // post content
const entryTitle = String(Feed.newFeedItem.EntryTitle); // post title
const entryUrl = String(Feed.newFeedItem.EntryUrl); // link to the post
const entryImageUrl = String(Feed.newFeedItem.EntryImageUrl); // URL to the user image
const entryAuthor = String(Feed.newFeedItem.EntryAuthor); // author's username
const feedTitle = String(Feed.newFeedItem.FeedTitle); // title of the feed (username)
const feedUrl = String(Feed.newFeedItem.FeedUrl); // feed URL

///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋📙📗📘𝕏📺 webhook filter v1.1.1 - Pi Day 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// Description:
// Processes and filters posts from various platforms for IFTTT webhook publishing.
//
// Key Features:
// - Content filtering (banned phrases, keywords, repost rules)
// - Multi-platform support with specific processing logic
// - Special character and HTML tag normalization
// - Customizable character mapping for language support
// - Content and URL shortening
//
///////////////////////////////////////////////////////////////////////////////

// type definitions for string manipulation
interface String {
  startsWith(searchString: string, position ? : number): boolean;
  endsWith(searchString: string, endPosition ? : number): boolean;
}

interface ObjectConstructor {
  entries < T > (o: {
    [s: string]: T
  } | ArrayLike < T > ): [string, T][];
}

// character mapping for text normalization
const characterMap: {
  [key: string]: string
} = {
  // basic text formatting replacement
  '(<br>|<br />|</p>)': '\n',
  // czech chars replacement
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
  // special chars replacement
  '(&#09;|&#009;|&#10;|&#010;|&#13;|&#013;|&#32;|&#032;|&#160;|&nbsp;|&#8192;|&#8193;|&#8194;|&#8195;|&#8196;|&#8197;|&#8198;|&#8199;|&#8200;|&#8201;|&#8202;|&#8203;|&#8204;|&#8205;|&#8206;|&#8207;|&#xA0;|&NonBreakingSpace;)': ' ',
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
const HTML_TAG_REGEX = /<(?!br|\/p|br\/)[^>]+>/gi; // matches all HTML tags except <br> and </p>, which are preserved as line breaks.
const RESPONSE_PREFIX_REGEX = /^R to (.*?): /; // response prefix detection
const REPOST_URL_REGEX = new RegExp('href="(?<url>https:\/\/twitter\.com[^"]+)"', 'gi'); // repost URL extraction
const REPOST_USER_REGEX = new RegExp('RT (@[a-z0-9_]+)', 'gi'); // extracts repost URLs from Twitter posts using named capture groups.
const QUOTE_REGEX = new RegExp(SETTINGS.QUOTE_SENTENCE, "gi"); // quote detection
const URL_REGEX = /https?:\/\//i; // URL validation

// content retrieval with fallback - get content from entryContent even if it is an empty (or is it in SETTINGS.SHOW_TITLE_AS_CONTENT) from entryTitle
function getContent(entryContent: any, entryTitle: any): string {
  // retrieves content from the post. if SETTINGS.SHOW_TITLE_AS_CONTENT is true,
  // it prioritizes the title over the content.
  if (SETTINGS.SHOW_TITLE_AS_CONTENT) {
    return entryTitle || "";
  } else {
    // returns content from entryContent, or entryTitle if entryContent is empty or contains only whitespace
    return (typeof entryContent === "string" && entryContent.trim().length === 0) || entryContent === "(none)" ? entryTitle : entryContent;
  }
}

// applies regex-based transformations to the input string based on patterns defined in SETTINGS.CONTENT_HACK_PATTERNS.
function contentHack(str: string): string {
  for (const pattern of SETTINGS.CONTENT_HACK_PATTERNS) {
    const regex = new RegExp(pattern.pattern, pattern.flags || "g");
    str = str.replace(regex, pattern.replacement);
  }
  return str;
}

// helper function for escaping special characters in regex
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// is quote in BS post? check
function isBsQuoteInPost(str: string): boolean {
  // checks if the string contains a quote post
  return SETTINGS.QUOTE_SENTENCE !== "" && QUOTE_REGEX.test(str);
}

// checks if the post contains any banned commercial phrases defined in SETTINGS.BANNED_COMMERCIAL_PHRASES.
function isCommercialInPost(str: string): boolean {
  // checks if the string contains at least one prohibited advertising phrase
  if (!SETTINGS.BANNED_COMMERCIAL_PHRASES || SETTINGS.BANNED_COMMERCIAL_PHRASES.length === 0) {
    return false; // if no banned phrases are defined, it is not considered as advertising
  }
  const lowerCaseStr = str.toLowerCase();
  for (const phrase of SETTINGS.BANNED_COMMERCIAL_PHRASES) {
    const regex = new RegExp(escapeRegExp(phrase), "i");
    if (regex.test(lowerCaseStr)) {
      return true; // if at least one banned phrase is found, it is considered advertising
    }
  }
  return false; // if no forbidden phrases are found, it is not considered as advertising
}

// image presence validation
function isImageInPost(str: string): boolean {
  // checks if the string is an image
  return str !== "https://ifttt.com/images/no_image_card.png";
}

// repost detection
function isRepost(str: string): boolean {
  // checks if the string starts with "RT @"
  return /^RT @[^:]+:/.test(str);
}

// self-repost detection
function isRepostOwn(str: string, authorName: string): boolean {
  // checks if the string is a repost of the same user
  const regex = new RegExp(`^(RT ${authorName}: )`);
  return regex.test(str);
};

// URL presence check - gives the possibility to modify status
function isUrlIncluded(str: string): boolean {
  // checks if the string contains a URL
  return URL_REGEX.test(str);
}

// function to move the URL to the end
function moveUrlToEnd(entryContent: string): string {
  const URL_REGEX = /https?:\/\//i;
  if (URL_REGEX.test(entryContent)) {
    const urlMatch = entryContent.match(URL_REGEX);
    if (urlMatch) {
      const url = entryContent.match(/https?:\/\/[^\s]+/)[0]; // extract the entire URL
      const contentWithoutUrl = entryContent.replace(url, '').trim();
      return contentWithoutUrl + ' ' + url;
    }
  }
  return entryContent;
}

// keywords validation in content
function mustContainKeywords(str: string, keywords: string[]): boolean {
  // checks if the string contains at least one of the specified keywords
  if (!keywords || keywords.length === 0) {
    return true; // if no keywords are defined, publish everything
  }
  var lowerCaseStr = str.toLowerCase();
  for (var i = 0; i < keywords.length; i++) {
    if (lowerCaseStr.indexOf(keywords[i].toLowerCase()) !== -1) {
      return true; // if at least one keyword is present, return true
    }
  }
  return false; // if no keywords were found, return false
}

// string replacement - utility replaces the substring specified by the key with a string of value
function replaceAll(str: string, replacements: Record < string, string > , caseSensitive = false): string {
  // replaces all occurrences of substrings in str with the values from the replacements object
  const regex = new RegExp(Object.keys(replacements).join('|'), caseSensitive ? 'g' : 'ig');
  return str.replace(regex, match => replacements[match]);
}

// ampersand replacement with URL preservation
function replaceAmpersands(str: string): string {
  // replaces ampersands (&) in text with a specified replacement character.
  // ensures URLs are preserved by encoding them appropriately.
  return str.replace(/(\S+)/g, word => {
    if (isUrlIncluded(word)) {
      if (SETTINGS.EXCLUDED_URLS.some(excludedUrl => word.toLowerCase().indexOf(excludedUrl.toLowerCase()) !== -1)) {
        // if URL is mentioned in EXCLUDED_URLS, encode it
        return encodeURIComponent(word);
      } else {
        // if URL is not in EXCLUDED_URLS, trim URL and encode it
        return encodeURI(trimUrl(word));
      }
    }
    // replaces ampersands in non-URL strings
    return word.replace(/&(amp;|#38;|#038;)?/g, SETTINGS.AMPERSAND_REPLACEMENT);
    // replaces ampersands (&) in non-URL strings with the specified character,
    // while preserving URLs by encoding them appropriately.
  });
}

// HTML and special character processing
function replaceAllSpecialCharactersAndHtml(str: string): string {
  // remove all HTML tags except <br> and </p>
  str = str.replace(HTML_TAG_REGEX, '');
  // replace <br> and </p> with \n
  str = str.replace(/<(br|br\/|\/p)[^>]*>/gi, "\n");
  // preserving line breaks - temporarily replaces \n chars with __NEWLINE__
  const tempNewline = "__NEWLINE__";
  str = str.replace(/\n/g, tempNewline);
  // special chars replacement
  for (const [pattern, replacement] of Object.entries(characterMap)) {
    const regex = new RegExp(pattern, "g");
    str = str.replace(regex, replacement);
  }
  // replace multiple spaces with one space
  str = str.replace(/\s+/g, ' ');
  // restore line breaks - returns \n chars instead of __NEWLINE__
  str = str.replace(new RegExp(tempNewline, "g"), "\n");
  // limit EOL characters to a maximum of two in a row for better text formatting.
  str = str.replace(/(\r?\n){3,}/g, "\n\n");
  return str;
}

// repost text formatting
function replaceReposted(
  str: string,
  resultFeedAuthor: string,
  entryAuthor: string
): string {
  // replaces "RT @..." with the repost sentence and author.
  const regex = new RegExp("^(RT ([^>]+): )");
  return str.replace(
    regex,
    `${resultFeedAuthor}${SETTINGS.REPOST_SENTENCE}${entryAuthor}:\n` // `${resultFeedAuthor}${SETTINGS.REPOST_SENTENCE}${entryAuthor}:\n`
  );
}

// thread response marker removal
function replaceResponseTo(str: string) {
  // removes "R to (.*?): " from the beginning of the string
  const regex = new RegExp("^R to (.*?): ");
  return str.replace(regex, "");
}

// adds the user instance suffix (e.g., ".bsky.social") to all @usernames,
// except for the feed author's username (skipName), as their info is stored elsewhere.
function replaceUserNames(
  str: string,
  skipName: string
): string {
  // adds POST_TARGET to all @usernames except the skipName
  const regex = new RegExp(
    `(?<![a-zA-Z0-9])(?!${skipName})(@.([a-zA-Z0-9_]+))`,
    "gi"
  );
  return str.replace(regex, `$1${SETTINGS.USER_INSTANCE}`);
}

// content length management - if content is longer than POST_LENGHT, it will be shorten to POST_LENGHT, then to last space + […]
function trimContent(str: string): string {
  // trims whitespace from the content and shortens it to SETTINGS.POST_LENGTH if necessary.
  // adds an ellipsis ("[…]") to indicate truncated text.
  str = str.trim();
  // replace existing elipses anywhere in the text
  str = str.replace(/(\s?\.{3}|\s?…)(?!\S)/g, " […]");
  // string lenght check
  if (str.length <= SETTINGS.POST_LENGTH) return str;
  // if content is long, short it to POST_LENGHT
  let trimmedText = str.slice(0, SETTINGS.POST_LENGTH).trim();
  // find the last space
  const lastSpaceIndex = trimmedText.lastIndexOf(" ");
  // add indicator […] for text continuing
  return lastSpaceIndex > 0 ?
    trimmedText.slice(0, lastSpaceIndex) + " […]" :
    trimmedText + " […]";
}

// URL shortening - if content continue behind ?, it will be shorten before ?
function trimUrl(str: string): string {
  // trims query parameters from URLs by removing everything after the "?" character.
  return str.indexOf("?") > -1 ?
    str.substring(0, str.lastIndexOf("?")) :
    str;
}

// repost URL extraction
function findRepostUrl(str: string): string | null {
  // finds the repost URL in a string using a regular expression
  const matches = REPOST_URL_REGEX.exec(str);
  return matches ? matches[1] : null;
}

// repost username extraction
function findRepostUser(str: string): string {
  // finds the repost username in a string using a regular expression
  const matches = REPOST_USER_REGEX.exec(str);
  return matches ? matches[1] : '';
}

// final content composition
function composeResultContent(
  entryTitle: string,
  entryAuthor: string,
  feedTitle: string
): string {
  // composes the final result content based on the source (POST_FROM)
  let resultContent = "";
  // getting user name and real name of feed author
  const feedAuthorUserName = feedTitle.substring(feedTitle.indexOf("@") - 1);
  const feedAuthorRealName = feedTitle.substring(0, feedTitle.indexOf("/") - 1);
  let resultFeedAuthor = "";
  // content blocks based on POST_FROM
  switch (SETTINGS.POST_FROM) {
    case "BS":
      // for Bluesky (BS) posts, extract the feed author's name from feedTitle.
      resultFeedAuthor = feedTitle.substring(0, feedTitle.indexOf(" "));
      resultContent = `${entryContent}`; // use entryContent directly for BS posts.
      break;
    case "TW":
      // for TW posts get resultFeedAuthor
      if (isRepost(entryTitle)) {
        entryAuthor = findRepostUser(entryTitle);
        resultFeedAuthor = feedAuthorUserName;
      } else {
        resultFeedAuthor = SETTINGS.SHOULD_PREFER_REAL_NAME ?
          feedAuthorRealName :
          feedAuthorUserName;
      }
      // for TW posts just entryTitle
      resultContent = entryTitle;
      resultContent = replaceReposted(resultContent, resultFeedAuthor, entryAuthor);
      resultContent = replaceResponseTo(resultContent);
      resultContent = replaceUserNames(resultContent, feedAuthorUserName);
      break;
    default:
      // for posts from RSS getContent
      // retrieves either entryContent or entryTitle based on availability and configuration.
      resultContent = getContent(entryContent, entryTitle);
  }
  // for all types of posts
  resultContent = replaceAllSpecialCharactersAndHtml(resultContent);
  resultContent = replaceAmpersands(resultContent);
  resultContent = contentHack(resultContent);
  resultContent = moveUrlToEnd(resultContent); //moves URL from the beginning to the end
  resultContent = trimContent(resultContent);
  return resultContent;
}

// composition of the status - content, picture, url + needed checks & entries from settings
function composeResultStatus(
  resultContent: string,
  entryImageUrl: string,
  entryTitle: string,
  entryAuthor: string
): string {
  // composes the final result status with content, image and URL
  // removing ampersands from image url
  const resultImageUrl = replaceAmpersands(entryImageUrl);
  // building of imageStatus based on existence of image URL and SHOW_IMAGEUR settings
  const imageStatus = (isImageInPost(entryImageUrl) && SETTINGS.SHOW_IMAGEURL) ?
    `${SETTINGS.STATUS_IMAGEURL_SENTENCE}${resultImageUrl}` :
    '';
  // conditions for showing the repost URL
  const repostUrl = findRepostUrl(resultContent);
  const shouldShowUrl = repostUrl || SETTINGS.SHOW_ORIGIN_POSTURL_PERM ||
    !(isUrlIncluded(resultContent) || isImageInPost(entryImageUrl)) ||
    (isRepost(entryTitle) && !isRepostOwn(entryTitle, entryAuthor));
  // replacing of source and target
  const urlToShow = repostUrl || (SETTINGS.SHOW_FEEDURL_INSTD_POSTURL ? feedUrl : entryUrl)
    .replace(new RegExp(SETTINGS.POST_SOURCE, "gi"), SETTINGS.POST_TARGET);
  // removing ampersands from url
  const urlStatus = shouldShowUrl ?
    `${SETTINGS.STATUS_URL_SENTENCE}${replaceAmpersands(urlToShow)}` :
    '';
  // composition of the final output from composeResultStatus
  return `${resultContent}${imageStatus}${urlStatus}`;
}

// determines whether a post should be skipped by checking various conditions:
// 1. quotes from Bluesky posts (if SETTINGS.QUOTE_SENTENCE is defined).
// 2. reposts not allowed by SETTINGS.REPOST_ALLOWED.
// 3. commercial content based on banned phrases in SETTINGS.BANNED_COMMERCIAL_PHRASES.
// 4. missing mandatory keywords defined in SETTINGS.MANDATORY_KEYWORDS.
function shouldSkipPost(): boolean {
  // if post is quote to other BS post, skip it
  if (isBsQuoteInPost(entryContent)) return true;
  if (isRepost(entryTitle) && !isRepostOwn(entryTitle, entryAuthor) && !SETTINGS.REPOST_ALLOWED) return true;
  // if post contains commercial based on SETTINGS.COMMERCIAL_SENTENCE
  if (isCommercialInPost(entryTitle) || isCommercialInPost(entryContent)) return true;
  // if keywords based on SETTINGS.MANDATORY_KEYWORDS aren't included in post, skip it
  if (!mustContainKeywords(entryTitle, SETTINGS.MANDATORY_KEYWORDS) && !mustContainKeywords(entryContent, SETTINGS.MANDATORY_KEYWORDS)) return true;
  return false;
}

// if the post meets skip conditions, it is ignored by IFTTT (MakerWebhooks.makeWebRequest.skip()).
// otherwise, it is processed and published using MakerWebhooks.makeWebRequest.setBody().
if (shouldSkipPost()) {
  // if any skip conditions are met, the post is ignored by IFTTT.
  MakerWebhooks.makeWebRequest.skip();
} else {
  // otherwise, compose and publish the post
  const resultContent = composeResultContent(entryTitle, entryAuthor, feedTitle);
  // composing of the result status
  const resultStatus = composeResultStatus(resultContent, entryImageUrl, entryTitle, entryAuthor);
  // return of the status to IFTTT
  const requestBody = `status=${resultStatus}`;
  // if no skip conditions are met, the post is processed and published via IFTTT webhook.
  MakerWebhooks.makeWebRequest.setBody(requestBody);
}
