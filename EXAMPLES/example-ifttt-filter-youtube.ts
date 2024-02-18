///////////////////////////////////////////////////////////////////////////////
// settings for IFTTT 📺 webhook filter - 17.2.2024
///////////////////////////////////////////////////////////////////////////////
const SETTINGS = {
  AMPERSAND_REPLACEMENT: ` a `, // replacement for & char
  COMMERCIAL_SENTENCE: "", // "" | "Komerční sdělení:"
  POST_FROM: "YT", // "BS" | "NT" | "RSS" | "TW" | "YT"
  POST_LENGTH: 4750, // 0 - 5000 chars
  POST_SOURCE: `https://twitter.com/`, // "" | `https://nitter.cz/` | `https://twitter.com/`
  POST_TARGET: `https://twitter.com/`, //  "" | `https://nitter.cz/` | `https://twitter.com/`
  USER_INSTANCE: "youtube.com", // "" | ".bsky.social" | "instagram.com" | "twitter.com" | "x.com" | "youtube.com"
  QUOTE_SENTENCE: "", // "" | "komentoval příspěvek od" | "📝💬🦋" | "📝💬🐦‍⬛"
  REPOST_ALLOWED: false, // true | false
  REPOST_SENTENCE: "", // "" | "sdílí" | "📤🦋" | "📤🐦‍⬛"
  SHOULD_PREFER_REAL_NAME: true, // true | false
  SHOW_FEEDURL_INSTD_POSTURL: false, // true | false
  SHOW_IMAGEURL: false, // true | false
  SHOW_ORIGIN_POSTURL_PERM: true, // true | false
  STATUS_IMAGEURL_SENTENCE: "", // "" | "🖼️"
  STATUS_URL_SENTENCE: "\nYT 📺👇👇👇\n", // "" | "🔗" | "\n🗣️🎙️👇👇👇\n" | "\nYT 📺👇👇👇\n"
};

// content hack - replace ZZZZZ and KKKKK with the beginning and the end of content designated to remove
function contentHack(str: string): string {
  return str.replace(/(ZZZZZ[^>]+KKKKK)/gi, "");
}

///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 📺 webhook - 17.1.2024
///////////////////////////////////////////////////////////////////////////////
const entryContent = String(Youtube.newPublicVideoFromSubscriptions.Description);
const entryTitle = String(Youtube.newPublicVideoFromSubscriptions.Title);
const entryUrl = String(Youtube.newPublicVideoFromSubscriptions.Url);
const entryImageUrl = String();
const entryAuthor = String(Youtube.newPublicVideoFromSubscriptions.AuthorName);
const feedTitle = String(Youtube.newPublicVideoFromSubscriptions.Title);
const feedUrl = String();

///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋🐦‍⬛📙📘🐦📺 webhook filter v0.9.4 - 17.2.2024
///////////////////////////////////////////////////////////////////////////////

// BS content hack
function contentHackBS(str: string): string {
  return str.replace(/(Post by[^>]+:)/gi, "");
}

// get content from entryContent even if it is an empty from entryTitle
function getContent(entryContent: any, entryTitle: any): string {
  if (typeof entryContent === "string" && entryContent.length > 0) {
    return entryContent;
  }
  if (typeof entryTitle === "string" && entryTitle.length > 0) {
    return entryTitle;
  }
  throw Error("Missing content")
}

// is commercial in post? check
function isCommercialInPost(str: string): boolean {
  if (SETTINGS.COMMERCIAL_SENTENCE === "") return false;
  const regex = new RegExp(SETTINGS.COMMERCIAL_SENTENCE, "gi");
  return regex.test(str)
}

// is image in post? check
function isImageInPost(str: string): boolean {
  return str !== "https://ifttt.com/images/no_image_card.png";
}

// is it repost? check
function isRepost(str: string): boolean {
  const regex = new RegExp("^(RT ([^>]+): )");
  return regex.test(str);
};

// is it own repost? check
function isRepostOwn(str: string, authorName: string): boolean {
  const regex = new RegExp(`^(RT ${authorName}: )`);
  return regex.test(str);
};

// is it response to someone else? check
function isResponseToSomeoneElse(
  str: string,
  authorName: string
): boolean {
  const regex = new RegExp(`^R to (?!${authorName}: ).*?: `, "gi");
  return regex.test(str);
}

// is URL link included? check - gives the possibility to modify status
function isUrlIncluded(str: string): boolean {
  const regex = new RegExp("((https|http)://)", "gi");
  return regex.test(str);
}

// Replaces the substring specified by the key with a string of value
function replaceAll(str: string, replacements: Record<string, string>, caseSensitive = false): string {
  for (const find in replacements) {
    const regex = new RegExp(find, caseSensitive ? 'g' : 'ig')
    const replaceValue = replacements[find];
    str = str.replace(regex, replaceValue);
  }
  return str
}

// & char replacement
function replaceAmpersands(str: string): string {
  const words = str.split(" ");

  return words
    .map((word: string) => {
      return isUrlIncluded(word)
        ? encodeURI(word).replace(/\&amp;/g, '%26').replace(/\&/g, '%26')
        : replaceAll(word, {
          '&amp;': SETTINGS.AMPERSAND_REPLACEMENT,
          '&#38;': SETTINGS.AMPERSAND_REPLACEMENT,
          '&#038;': SETTINGS.AMPERSAND_REPLACEMENT,
          '&': SETTINGS.AMPERSAND_REPLACEMENT,
        });
    })
    .join(" ");
}

// basic text formatting replacement
function replaceBasicFormatting(str: string): string {
  return replaceAll(str, {
    '<br>': '\n',
    '</p>': '\n',
  })
}

// czech chars replacement
function replaceCzechCharacters(str: string): string {
  return replaceAll(str, {
    '&#193;': 'Á',
    '&Aacute;': 'Á',
    'A&#769;': 'Á',
    '&#196;': 'Ä',
    '&Auml;': 'Ä',
    'A&#776;': 'Ä',
    '&#201;': 'É',
    '&Eacute;': 'É',
    'E&#769;': 'É',
    '&#203;': 'Ë',
    '&Euml;': 'Ë',
    'E&#776;': 'Ë',
    '&#205;': 'Í',
    '&Lacute;': 'Í',
    'I&#769;': 'Í',
    '&#207;': 'Ï',
    '&Luml;': 'Ï',
    'I&#776;': 'Ï',
    '&#211;': 'Ó',
    '&Oacute;': 'Ó',
    'O&#769;': 'Ó',
    '&#214;': 'Ö',
    '&Ouml;': 'Ö',
    'O&#776;': 'Ö',
    '&#218;': 'Ú',
    '&Uacute;': 'Ú',
    'U&#769;': 'Ú',
    '&#220;': 'Ü',
    '&Uuml;': 'Ü',
    'U&#776;': 'Ü',
    '&#221;': 'Ý',
    '&Yacute;': 'Ý',
    'Y&#769;': 'Ý',
    '&#225;': 'á',
    '&aacute;': 'á',
    'a&#769;': 'á',
    '&#228;': 'ä',
    '&auml;': 'ä',
    'a&#776;': 'ä',
    '&#233;': 'é',
    '&eacute;': 'é',
    'e&#769;': 'é',
    '&#235;': 'ë',
    '&euml;': 'ë',
    'e&#776;': 'ë',
    '&#237;': 'í',
    '&iacute;': 'í',
    'i&#769;': 'í',
    '&#239;': 'ï',
    '&iuml;': 'ï',
    'i&#776;': 'ï',
    '&#243;': 'ó',
    '&oacute;': 'ó',
    'o&#769;': 'ó',
    '&#246;': 'ö',
    '&ouml;': 'ö',
    'o&#776;': 'ö',
    '&#250;': 'ú',
    '&uacute;': 'ú',
    'u&#769;': 'ú',
    '&#252;': 'ü',
    '&uuml;': 'ü',
    'u&#776;': 'ü',
    '&#253;': 'ý',
    '&yacute;': 'ý',
    'y&#769;': 'ý',
    '&#268;': 'Č',
    '&Ccaron;': 'Č',
    'C&#780;': 'Č',
    '&#269;': 'č',
    '&ccaron;': 'č',
    'c&#780;': 'č',
    '&#270;': 'Ď',
    '&Dcaron;': 'Ď',
    'D&#780;': 'Ď',
    '&#271;': 'ď',
    '&dcaron;': 'ď',
    'd&#780;': 'ď',
    '&#282;': 'Ě',
    '&Ecaron;': 'Ě',
    'E&#780;': 'Ě',
    '&#283;': 'ě',
    '&ecaron;': 'ě',
    'e&#780;': 'ě',
    '&#327;': 'Ň',
    '&Ncaron;': 'Ň',
    'N&#780;': 'Ň',
    '&#328;': 'ň',
    '&ncaron;': 'ň',
    'n&#780;': 'ň',
    '&#336;': 'Ő',
    '&Odblac;': 'Ő',
    'O&#778;': 'Ő',
    '&#337;': 'ő',
    '&odblac;': 'ő',
    'o&#778;': 'ő',
    '&#344;': 'Ř',
    '&Rcaron;': 'Ř',
    'R&#780;': 'Ř',
    '&#345;': 'ř',
    '&rcaron;': 'ř',
    'r&#780;': 'ř',
    '&#352;': 'Š',
    '&Scaron;': 'Š',
    'S&#780;': 'Š',
    '&#353;': 'š',
    '&scaron;': 'š',
    's&#780;': 'š',
    '&#356;': 'Ť',
    '&Tcaron;': 'Ť',
    'T&#780;': 'Ť',
    '&#357;': 'ť',
    '&tcaron;': 'ť',
    't&#780;': 'ť',
    '&#366;': 'Ů',
    '&Uring;': 'Ů',
    'U&#778;': 'Ů',
    '&#367;': 'ů',
    '&uring;': 'ů',
    'u&#778;': 'ů',
    '&#368;': 'Ű',
    '&Udblac;': 'Ű',
    'U&#369;': 'Ű',
    '&#369;': 'ű',
    '&udblac;': 'ű',
    'u&#369;': 'ű',
    '&#381;': 'Ž',
    '&Zcaron;': 'Ž',
    'Z&#780;': 'Ž',
    '&#382;': 'ž',
    '&zcaron;': 'ž',
    'z&#780;': 'ž',
  }, true)
}

// html removal
function replaceHtml(str: string): string {
  return str.replace(/<[^<>]+>/ig, "");
}

// quote text replacement for BS
function replaceQuotedBS(
  str: string,
  resultFeedAuthor: string,
  entryAuthor: string
): string {
  const regex = new RegExp("(\\[quote\\])");
  return str.replace(
    regex,
    `${resultFeedAuthor} ${SETTINGS.QUOTE_SENTENCE} ${entryAuthor}:\n\n`
  );
}

// repost text replacement
function replaceReposted(
  str: string,
  resultFeedAuthor: string,
  entryAuthor: string
): string {
  const regex = new RegExp("^(RT ([^>]+): )");
  return str.replace(
    regex,
    `${resultFeedAuthor} ${SETTINGS.REPOST_SENTENCE} ${entryAuthor}:\n\n`
  );
}

// repost text replacement for BS
function replaceRepostedBS(
  str: string,
  resultFeedAuthor: string,
  entryAuthor: string
): string {
  const regex = new RegExp("^(Repost ([^>]+): )");
  return str.replace(
    regex,
    `${resultFeedAuthor} ${SETTINGS.REPOST_SENTENCE} ${entryAuthor}:\n\n`
  );
}

// removal of R mark for threads
function replaceResponseTo(str: string) {
  const regex = new RegExp("^R to (.*?): ");
  return str.replace(regex, "");
}

// special chars replacement
function replaceSpecialCharacters(str: string): string {
  return replaceAll(str, {
    '&#09;': ' ',
    '&#009;': ' ',
    '&#10;': ' ',
    '&#010;': ' ',
    '&#13;': ' ',
    '&#013;': ' ',
    '&#32;': ' ',
    '&#032;': ' ',
    '&#33;': '!',
    '&#033;': '!',
    '&excl;': '!',
    '&#34;': '"',
    '&#034;': '"',
    '&quot;': '"',
    '&#37;': '%',
    '&#037;': '%',
    '&percnt;': '%',
    '&#39;': '‘',
    '&#039;': '‘',
    '&apos;': '‘',
    '&#40;': '(',
    '&#040;': '(',
    '&lpar;': '(',
    '&#41;': ')',
    '&#041;': ')',
    '&rpar;': ')',
    '&#46;': '.',
    '&#046;': '.',
    '&period;': '.',
    '&#60;': '<',
    '&#060;': '<',
    '&lt;': '<',
    '&#61;': '=',
    '&#061;': '=',
    '&equals;': '=',
    '&#62;': '>',
    '&#062;': '>',
    '&gt;': '>',
    '&#160;': ' ',
    '&nbsp;': ' ',
    '&#173;': '',
    '&#xAD;': '',
    '&shy;': '',
    '&#8192;': ' ',
    '&#8193;': ' ',
    '&#8194;': ' ',
    '&#8195;': ' ',
    '&#8196;': ' ',
    '&#8197;': ' ',
    '&#8198;': ' ',
    '&#8199;': ' ',
    '&#8200;': ' ',
    '&#8201;': ' ',
    '&#8202;': ' ',
    '&#8203;': ' ',
    '&#8204;': ' ',
    '&#8205;': ' ',
    '&#8206;': ' ',
    '&#8207;': ' ',
    '&#8208;': '-',
    '&#x2010;': '-',
    '&hyphen;': '-',
    '&#8209;': '-',
    '&#x2011;': '-',
    '&#8211;': '–',
    '&ndash;': '–',
    '&#8212;': '—',
    '&mdash;': '—',
    '&#8216;': '‘',
    '&lsquo;': '‘',
    '&#8217;': '’',
    '&rsquo;': '’',
    '&#8218;': '‚',
    '&sbquo;': '‚',
    '&#8219;': '‛',
    '&#8220;': '“',
    '&ldquo;': '“',
    '&#8221;': '”',
    '&rdquo;': '”',
    '&#8222;': '„',
    '&bdquo;': '„',
    '&#8223;': '‟',
    '&#8230;': '…',
    '&hellip;': '…',
    '&#8242;': '′',
    '&prime;': '′',
    '&#8243;': '″',
    '&Prime;': '″',
    '&#8722;': '-',
    '&minus;': '-',
  });
}

// user names extension for POST_TARGET
function replaceUserNames(
  str: string,
  skipName: string
): string {
  // Adds POST_TARGET to all @usernames except the skipName
  const regex = new RegExp(
    `(?<![a-zA-Z0-9])(?!${skipName})(@([a-zA-Z0-9_]+))`,
    "gi"
  );
  return str.replace(regex, `$1@${SETTINGS.USER_INSTANCE}`);
}

// content shortening - if content is longer than POST_LENGHT, it will be shorten to POST_LENGHT, then to last space + […]
function trimContent(str: string): string {
  if (str.substring(str.length - 2) === " …") {
    str = str.substring(0, str.length - 1) + "[…]";
  } else if (str.substring(str.length - 1) === "…") {
    str = str.substring(0, str.length - 1) + " […]";
  }

  if (str.length <= SETTINGS.POST_LENGTH) return str;

  const trimmedText = str.substring(0, SETTINGS.POST_LENGTH - 1).trim();

  return str.substring(0, trimmedText.lastIndexOf(" ")) + " […]"
}

// image  URL shortening - if image ends with ==, it will be shorten for this two chars
function trimImageUrl(str: string): string {
  return str.substring(str.length - 2) === "=="
    ? str.substring(0, str.length - 2)
    : str;
}

function findRepostUrl(str: string): string | null {
  const regex = new RegExp('href="(?<url>https:\/\/(nitter\.cz|twitter\.com)[^"]+)"', 'gi')
  const matches = regex.exec(str)
  return matches ? matches[1] : null
}

// resultContent composition
function composeResultContent(
  entryTitle: string,
  entryAuthor: string,
  feedTitle: string
): string {
  let resultContent = "";
  // getting user name and real name of feed author
  const feedAuthorUserName = feedTitle.substring(feedTitle.indexOf("@") - 1);
  const feedAuthorRealName = feedTitle.substring(0, feedTitle.indexOf("/") - 1);
  let resultFeedAuthor = "";

  // content blocks based on POST_FROM
  if (SETTINGS.POST_FROM === "BS"){
    // for BS posts get resultFeedAuthor from feedTitle
  resultFeedAuthor = feedTitle.substring(feedTitle.indexOf("(") + 1, feedTitle.indexOf(")"));
  // for BS posts resultContent entryTitle + entryContent
  resultContent = `${entryTitle}:\n${entryContent}`;
  resultContent = replaceRepostedBS(
    resultContent,
    resultFeedAuthor,
    entryAuthor
  );
  resultContent = replaceQuotedBS(
    resultContent,
    resultFeedAuthor,
    entryAuthor
  );
  resultContent = contentHackBS(resultContent);
  } else if (SETTINGS.POST_FROM === "NT"){
    // ⬇️ ☠️ dead zone - don't touch it ⬇️
    // for NT & TW posts get resultFeedAuthor
    resultFeedAuthor = SETTINGS.SHOULD_PREFER_REAL_NAME
      ? feedAuthorRealName
      : feedAuthorUserName;
    // for NT & TW posts just entryTitle
    resultContent = entryTitle;
    resultContent = replaceReposted(
      resultContent,
      resultFeedAuthor,
      entryAuthor
    );
    resultContent = replaceResponseTo(resultContent);
    resultContent = replaceUserNames(
      resultContent,
      feedAuthorUserName,
    );
    // ⬆️ ☠️ dead zone - don't touch it ⬆️
    } else if (SETTINGS.POST_FROM === "TW"){
    // for NT & TW posts get resultFeedAuthor
    resultFeedAuthor = SETTINGS.SHOULD_PREFER_REAL_NAME
      ? feedAuthorRealName
      : feedAuthorUserName;
    // for NT & TW posts just entryTitle
    resultContent = entryTitle;
    resultContent = replaceReposted(
      resultContent,
      resultFeedAuthor,
      entryAuthor
    );
    resultContent = replaceResponseTo(resultContent);
    resultContent = replaceUserNames(
      resultContent,
      feedAuthorUserName,
    );
  } else {
    // for posts from RSS getContent
    resultContent = getContent(entryContent, entryTitle);
  }

  resultContent = replaceBasicFormatting(resultContent);
  resultContent = replaceHtml(resultContent);
  resultContent = replaceCzechCharacters(resultContent);
  resultContent = replaceSpecialCharacters(resultContent);
  resultContent = replaceAmpersands(resultContent);
  resultContent = contentHack(resultContent);
  resultContent = trimContent(resultContent);

  return resultContent;
}

// composition of the status - content, picture, url + needed checks & entries from settings
function composeResultStatus(
  resultContent: string,
  entryImageUrl: string
): string {
  let resultStatus = `${resultContent}\n`;
  let resultImageUrl = trimImageUrl(entryImageUrl);

  // removing ampersands from image url
  resultImageUrl = replaceAmpersands(resultImageUrl);

  // modification of status in case when showing the image is enabled
  if (isImageInPost(entryImageUrl) && SETTINGS.SHOW_IMAGEURL) {
    resultStatus = `${resultStatus}\n${SETTINGS.STATUS_IMAGEURL_SENTENCE} ${resultImageUrl}`;
  }

  const repostUrl = findRepostUrl(resultContent)
  if (repostUrl) {
    resultUrl = repostUrl
  } else if (
    SETTINGS.SHOW_ORIGIN_POSTURL_PERM
    || !(isUrlIncluded(resultContent) || isImageInPost(entryImageUrl))
  ) {
    resultStatus = `${resultStatus}\n${SETTINGS.STATUS_URL_SENTENCE} ${resultUrl}`;
  }

  return resultStatus;
}

// replacing of source and target
let resultUrl = (SETTINGS.SHOW_FEEDURL_INSTD_POSTURL ? feedUrl : entryUrl)
  .replace(new RegExp(SETTINGS.POST_SOURCE, "gi"), SETTINGS.POST_TARGET);

// removing ampersands from url
resultUrl = replaceAmpersands(resultUrl);

// images from nitter need some special care
if (["Image", "Gif", "Video"].indexOf(entryTitle) !== -1) {
  const requestBody = `status=${resultUrl}`;
  MakerWebhooks.makeWebRequest.setBody(requestBody);
} else if (
  // if post is response to someone else or repost are not allowed, skip it
  isResponseToSomeoneElse(entryTitle, entryAuthor)
  || (
    isRepost(entryTitle)
    && !isRepostOwn(entryTitle, entryAuthor)
    && !SETTINGS.REPOST_ALLOWED
  )
  // if post contains commercial based on SETTINGS.COMMERCIAL_SENTENCE
  || isCommercialInPost(entryTitle)
  || isCommercialInPost(entryContent)
) {
  MakerWebhooks.makeWebRequest.skip();
} else {
  // otherwise start with composing the result content
  const resultContent = composeResultContent(
    entryTitle,
    entryAuthor,
    feedTitle
  );

  // composing of the result status
  const resultStatus = composeResultStatus(
    resultContent,
    entryImageUrl
  );

  // return of the status to IFTTT
  const requestBody = `status=${resultStatus}`;
  MakerWebhooks.makeWebRequest.setBody(requestBody);
}