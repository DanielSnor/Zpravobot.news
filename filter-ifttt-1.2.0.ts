///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋📙📗📘𝕏📺 webhook filter v1.2.0 - April Fool's Day 2025 rev
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
const BS_QUOTE_REGEX = new RegExp("\\[contains quote post or other embedded content\\]", "gi"); // BSky quote detection
const HTML_LINE_BREAKS_REGEX = /<(br|br\/|\/p)[^>]*>/gi; // replace <br> and </p> with \n
const HTML_TAG_REGEX = /<(?!br|\/p|br\/)[^>]+>/gi; // matches all HTML tags except <br> and </p>, which are preserved as line breaks.
const MULTIPLE_EOL_REGEX = /(\r?\n){3,}/g; // limit EOL characters to a maximum of two in a row for better text formatting.
const MULTIPLE_SPACES_REGEX = /\s+/g; // replace multiple spaces with one space
const REPOST_PREFIX_REGEX = /^(RT @([^:]+): )/i;
const REPOST_URL_REGEX = new RegExp('href="(?<url>https:\/\/twitter\.com[^"]+)"', 'gi'); // repost URL extraction
const REPOST_USER_REGEX = new RegExp('RT (@[a-z0-9_]+)', 'gi'); // extracts repost URLs from Twitter posts using named capture groups.
const RESPONSE_PREFIX_REGEX = /^R to (.*?): /; // response prefix detection
const TCO_URL_REGEX = /https:\/\/t\.co\/[^\s]+/gi; // regular expression to match shortened Twitter URLs (t.co)
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
  return BS_QUOTE_REGEX.test(str);
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

// BS quote text formatting
function replaceBsQuote(
  str: string,
  resultFeedAuthor: string,
  entryAuthor: string
): string {
  // adds the resultFeedAuthor over QUOTE_SENTENCE to the top and removes BS_QUOTE_REGEX
  const updatedContent = str.replace(BS_QUOTE_REGEX, "").trim();
  return `${resultFeedAuthor}${SETTINGS.QUOTE_SENTENCE}${entryAuthor}:\n${updatedContent}\n`; // \n🦋👇👇👇\n
}

// HTML and special character processing
function replaceAllSpecialCharactersAndHtml(str: string): string {
  // remove all HTML tags except <br> and </p>
  str = str.replace(HTML_TAG_REGEX, '');
  // replace <br> and </p> with \n
  str = str.replace(HTML_LINE_BREAKS_REGEX, "\n");
  // preserving line breaks - temporarily replaces \n chars with __NEWLINE__
  const tempNewline = "__NEWLINE__";
  str = str.replace(/\n/g, tempNewline);
  // special chars replacement
  for (const [pattern, replacement] of Object.entries(characterMap)) {
    const regex = new RegExp(pattern, "g");
    str = str.replace(regex, replacement);
  }
  // replace multiple spaces with one space
  str = str.replace(MULTIPLE_SPACES_REGEX, ' ');
  // restore line breaks - returns \n chars instead of __NEWLINE__
  str = str.replace(new RegExp(tempNewline, "g"), "\n");
  // limit EOL characters to a maximum of two in a row for better text formatting.
  str = str.replace(MULTIPLE_EOL_REGEX, "\n\n");
  return str;
}

// repost text formatting
function replaceReposted(
  str: string,
  resultFeedAuthor: string,
  entryAuthor: string
): string {
  // replaces "RT @..." with the repost sentence and author.
  // const regex = new RegExp("^(RT @([^:]+): )");
  return str.replace(
    REPOST_PREFIX_REGEX,
    `${SETTINGS.REPOST_SENTENCE}${entryAuthor}:\n` // `${resultFeedAuthor}${SETTINGS.REPOST_SENTENCE}${entryAuthor}:\n`
  );
}

// thread response marker removal
function replaceResponseTo(str: string) {
  // removes "R to (.*?): " from the beginning of the string
  // const regex = new RegExp("^R to (.*?): ");
  return str.replace(RESPONSE_PREFIX_REGEX, "");
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
function trimContent(str: string, url ? : string): string {
  // trim whitespace from the beginning and end of the string
  str = str.trim();
  // Return original string if it is empty
  if (str === "") return str;
  // replace existing ellipses anywhere in the text
  str = str.replace(/(\s?\.{3}|\s?…)(?!\S)/g, " […]");
  // check if the content length exceeds the maximum allowed length
  if (str.length > SETTINGS.POST_LENGTH) {
    // if content is too long, truncate it to POST_LENGTH
    let trimmedText = str.slice(0, SETTINGS.POST_LENGTH).trim();
    // find the last space within the truncated text
    const lastSpaceIndex = trimmedText.lastIndexOf(" ");
    // add an indicator […] for truncated text
    const finalText =
      lastSpaceIndex > 0 ?
      trimmedText.slice(0, lastSpaceIndex) + " […]" :
      trimmedText + " […]";
    return finalText;
  }
  // return the original string if no truncation is needed
  return str;
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
  if (!entryContent && !entryTitle) return ""; // Return empty string if no content or title
  // composes the final result content based on the source (POST_FROM)
  let resultContent = "";
  let resultFeedAuthor = "";
  let feedAuthorUserName = "";
  let feedAuthorRealName = ""; // for TW posts get resultFeedAuthor
  // content blocks based on POST_FROM
  switch (SETTINGS.POST_FROM) {
    case "BS":
      // for BS posts just entryContent
      resultContent = entryContent;
      // getting user name and real name of BSky author
      feedAuthorUserName = feedTitle.substring(0, feedTitle.indexOf(" "));
      feedAuthorRealName = feedTitle.substring(feedTitle.indexOf(" - ") + 3);
      // for Bluesky (BS) posts, extract the feed author's name from feedTitle.
      resultFeedAuthor = feedAuthorUserName;
      if (isBsQuoteInPost(entryContent)) {
        resultFeedAuthor = SETTINGS.SHOULD_PREFER_REAL_NAME ?
          feedAuthorRealName :
          feedAuthorUserName;
        resultContent = replaceBsQuote(resultContent, resultFeedAuthor, entryAuthor);
      }
      break;
    case "TW":
      // getting user name and real name of feed author
      feedAuthorUserName = feedTitle.substring(feedTitle.indexOf("@") - 1);
      feedAuthorRealName = feedTitle.substring(0, feedTitle.indexOf("/") - 1); // for TW posts get resultFeedAuthor
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

// final content composition
function composeResultStatus(
  resultContent: string,
  entryUrl: string,
  entryImageUrl: string,
  entryTitle: string,
  entryAuthor: string
): string {
  // initialize variables for URL handling and status composition
  let urlToShow = ''; // ensures urlToShow is always a valid string to avoid undefined issues
  let urlStatus;
  let repostUrl;
  let shouldShowUrl;
  // check if the original content (entryContent) contains any URL
  const originalContentHasUrl = isUrlIncluded(entryContent);
  // check if the content was truncated or requires an ellipsis to be appended
  let contentNeedsEllipsis = false;
  // switch to specific actions
  switch (SETTINGS.POST_FROM) {
    case "TW": // Twitter-specific actions
      // remove all shortened t.co links from the content
      resultContent = resultContent.replace(TCO_URL_REGEX, '').trim();
      // if no URLs remain in the content after removing t.co links, set SHOW_ORIGIN_POSTURL_PERM to true
      if (!isUrlIncluded(resultContent)) {
        SETTINGS.SHOW_ORIGIN_POSTURL_PERM = true;
      }
      // check if the tweet is not truncated and doesn't end with specific punctuation (e.g., '.', '!', '?', '\"', '…')
      if (
        resultContent.length <= SETTINGS.POST_LENGTH &&
        !resultContent.endsWith('.') &&
        !resultContent.endsWith('!') &&
        !resultContent.endsWith('?') &&
        !resultContent.endsWith('…') &&
        !resultContent.endsWith('\"') && // check if the content ends with a quotation mark
        !resultContent.endsWith('[…]')
      ) {
        SETTINGS.SHOW_ORIGIN_POSTURL_PERM = true; // force inclusion of the original URL
        resultContent += ' […]'; // append ellipsis to indicate continuation
        contentNeedsEllipsis = true; // mark that ellipsis was added
      }
      // mark content as truncated if it exceeds the maximum allowed length
      if (resultContent.length > SETTINGS.POST_LENGTH) {
        contentNeedsEllipsis = true;
      }
      // find repost URL in the content, if available
      repostUrl = findRepostUrl(resultContent);
      // determine whether a URL should be included in the output based on multiple conditions
      shouldShowUrl =
        repostUrl || // a repost URL exists
        SETTINGS.SHOW_ORIGIN_POSTURL_PERM || // SHOW_ORIGIN_POSTURL_PERM is explicitly set to true
        (originalContentHasUrl || contentNeedsEllipsis) || // original content contains a URL or was truncated/modified with ellipsis
        (isRepost(entryTitle) && !isRepostOwn(entryTitle, entryAuthor)); // the post is a repost and not a self-repost
      // select the appropriate URL to display based on conditions and settings
      if (shouldShowUrl) {
        if (
          entryImageUrl && // check if an image URL exists and is valid
          entryImageUrl !== '(none)' &&
          entryImageUrl !== '' &&
          !entryImageUrl.endsWith('photo/1') && // exclude specific image suffixes (e.g., photo/1)
          !entryImageUrl.endsWith('video/1') // exclude specific video suffixes (e.g., video/1)
        ) {
          urlToShow = entryImageUrl; // use the image URL as the primary link
        } else if (entryUrl && entryUrl !== '(none)' && entryUrl !== '') {
          urlToShow = entryUrl; // use the main entry URL if no valid image URL exists
        } else {
          urlToShow = SETTINGS.SHOW_FEEDURL_INSTD_POSTURL ? feedUrl : ''; // use feed URL or fallback to an empty string
        }

        // ensure urlToShow is always a valid string before applying .replace()
        urlToShow = urlToShow || '';
        urlToShow = urlToShow.replace(new RegExp(SETTINGS.POST_SOURCE, "gi"), SETTINGS.POST_TARGET); // replace source URL with target format
      }
      break;
    default: // default behavior for other platforms
      // determine whether a URL should be included in the output based on settings and content
      // if SHOW_ORIGIN_POSTURL_PERM is true or the content includes a URL, set shouldShowUrl to true
      shouldShowUrl = SETTINGS.SHOW_ORIGIN_POSTURL_PERM || isUrlIncluded(resultContent);
      if (shouldShowUrl) {
        // use the entry URL as the primary URL to display
        urlToShow = entryUrl;
        // replace the source URL format with the target URL format for consistency
        urlToShow = urlToShow.replace(new RegExp(SETTINGS.POST_SOURCE, "gi"), SETTINGS.POST_TARGET);
      }
      break;
  }
  // process the image URL by replacing ampersands (&) with a safe character or encoding them
  const resultImageUrl = replaceAmpersands(entryImageUrl);
  // build the image status based on whether an image exists and SHOW_IMAGEURL setting is enabled
  const imageStatus = (isImageInPost(entryImageUrl) && SETTINGS.SHOW_IMAGEURL) ?
    `${SETTINGS.STATUS_IMAGEURL_SENTENCE}${resultImageUrl}` :
    '';
  // build the final URL status based on whether a URL should be shown and process it for safe output
  urlStatus = shouldShowUrl ?
    `${SETTINGS.STATUS_URL_SENTENCE}${replaceAmpersands(urlToShow)}` :
    '';
  // truncate the content to ensure it doesn't exceed maximum length and append ellipsis if necessary
  const truncatedContent = trimContent(resultContent);
  // compose the final output by combining truncated content, image status, and URL status
  return `${truncatedContent}${imageStatus}${urlStatus}`;
}

// determines whether a post should be skipped by checking various conditions:
// 1. reposts not allowed by SETTINGS.REPOST_ALLOWED.
// 2. commercial content based on banned phrases in SETTINGS.BANNED_COMMERCIAL_PHRASES.
// 3. missing mandatory keywords defined in SETTINGS.MANDATORY_KEYWORDS.
function shouldSkipPost(): boolean {
  // check if both content and title are empty or contain "(none)"
  if ((!entryContent || entryContent.trim() === "" || entryContent === "(none)") &&
    (!entryTitle || entryTitle.trim() === "" || entryTitle === "(none)")) {
    return true; // skip post if content is invalid
  }
  // if reposts not allowed by SETTINGS.REPOST_ALLOWED
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
  const resultStatus = composeResultStatus(resultContent, entryUrl, entryImageUrl, entryTitle, entryAuthor);
  // return of the status to IFTTT
  const requestBody = `status=${resultStatus}`;
  // if no skip conditions are met, the post is processed and published via IFTTT webhook.
  MakerWebhooks.makeWebRequest.setBody(requestBody);
}
