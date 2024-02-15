import { Feed, MakerWebhooks } from "./core";

export const SETTINGS = {
  AMPERSAND_REPLACEMENT: ` a `, // replacement for & char
  POST_LENGTH: 4750, // 0 - 5000 chars
  POST_SOURCE: `https://nitter.cz/`, // ""
  POST_TARGET: `https://twitter.com/`, // ""
  USER_INSTANCE: "twitter.com", // "twitter.com"|"x.com"
  REPOST_ALLOWED: true, // true|false
  REPOST_SENTENCE: "📤🐦🟦", // "sdílí příspěvek od"
  SHOULD_PREFER_REAL_NAME: false, // true|false
  SHOW_FEEDURL_INSTD_POSTURL: false, // true|false
  SHOW_IMAGEURL: false, // true|false
  SHOW_ORIGIN_POSTURL_PERM: false, // true|false
};

// content hack - replace ZZZZZ and KKKKK with the beginning and the end of content designated to remove
export function contentHack(str: string): string {
  return str.replace(/(ZZZZZ[^>]+KKKKK)/gi, "");
}

///////////////////////////////////////////////////////////////////////////////
// IFTTT 🐦📓 webhook entryTitle filter for nitter v0.7.7 - 16.12.2023
///////////////////////////////////////////////////////////////////////////////

// is image in post?
export function isImageInPost(str: string): boolean {
  const regex = new RegExp(`https://ifttt.com/images/no_image_card.png`, "gi");
  if (regex.test(str)) return false;
  return true;
}

export const isRepost = (str: string) => {
  const regex = new RegExp("^(RT ([^>]+): )");
  return regex.test(str);
};

export const isRepostOwn = (str: string, authorName: string) => {
  const regex = new RegExp(`^(RT ${authorName}: )`);
  return regex.test(str);
};

// is it response to someone else?
export function isResponseToSomeoneElse(
  str: string,
  authorName: string
): boolean {
  const regex = new RegExp(`^R to (?!${authorName}: ).*?: `, "gi");
  if (regex.test(str)) return true;
  return false;
}

// is URL link included? - gives the possibility to modify status
export function isUrlIncluded(str: string): boolean {
  const regex = new RegExp("((https|http)://)", "gi");
  if (regex.test(str)) return true;
  return false;
}

// AT char replacement
export function replaceAmpersands(str: string, replacement: string): string {
  const words = str.split(" ");

  return words
    .map((word) => {
      const regex = new RegExp("((https|http)://)", "gi");
      if (regex.test(word)) return encodeURI(word);
      return word.replace(/(&amp;|&#38;|&#038;|&)/gi, replacement);
    })
    .join(" ");
}

// replacement of the source by target
export function replaceSourceWithTarget(
  str: string,
  source: string,
  target: string
): string {
  const regex = new RegExp(source, "gi");
  return str.replace(regex, target);
}

// repost text replacement
export function replaceReposted(
  str: string,
  resultFeedAuthor: string,
  entryAuthor: string,
  sentence: string
): string {
  const regex = new RegExp("^(RT ([^>]+): )");
  return str.replace(
    regex,
    `${resultFeedAuthor} ${sentence} ${entryAuthor}:\n`
  );
}

// removal of R mark for threads
export function replaceResponseTo(str: string) {
  const regex = new RegExp("^R to (.*?): ");
  return str.replace(regex, "");
}

// special chars replacement
export function replaceSpecialCharacters(str: string): string {
  return str
    .replace(/&#09;/g, " ")
    .replace(/&#009;/g, " ")
    .replace(/&#10;/g, " ")
    .replace(/&#010;/g, " ")
    .replace(/&#13;/g, " ")
    .replace(/&#013;/g, " ")
    .replace(/&#32;/g, " ")
    .replace(/&#032;/g, " ")
    .replace(/&#33;/g, "!")
    .replace(/&#033;/g, "!")
    .replace(/&excl;/gi, "!")
    .replace(/&#34;/g, '"')
    .replace(/&#034;/g, '"')
    .replace(/&quot;/gi, '"')
    .replace(/&#37;/g, "%")
    .replace(/&#037;/g, "%")
    .replace(/&percnt;/gi, "%")
    .replace(/&#39;/g, "‘")
    .replace(/&#039;/g, "‘")
    .replace(/&apos;/gi, "‘")
    .replace(/&#40;/g, "(")
    .replace(/&#040;/g, "(")
    .replace(/&lpar;/gi, "(")
    .replace(/&#41;/g, ")")
    .replace(/&#041;/g, ")")
    .replace(/&rpar;/gi, ")")
    .replace(/&#46;/g, ".")
    .replace(/&#046;/g, ".")
    .replace(/&period;/gi, ".")
    .replace(/&#60;/g, "<")
    .replace(/&#060;/g, "<")
    .replace(/&lt;/gi, "<")
    .replace(/&#61;/g, "=")
    .replace(/&#061;/g, "=")
    .replace(/&equals;/gi, "=")
    .replace(/&#62;/g, ">")
    .replace(/&#062;/g, ">")
    .replace(/&gt;/gi, ">")
    .replace(/&#160;/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#173;/g, "")
    .replace(/&#xAD;/gi, "")
    .replace(/&shy;/gi, "")
    .replace(/&#8192;/g, " ")
    .replace(/&#8193;/g, " ")
    .replace(/&#8194;/g, " ")
    .replace(/&#8195;/g, " ")
    .replace(/&#8196;/g, " ")
    .replace(/&#8197;/g, " ")
    .replace(/&#8198;/g, " ")
    .replace(/&#8199;/g, " ")
    .replace(/&#8200;/g, " ")
    .replace(/&#8201;/g, " ")
    .replace(/&#8202;/g, " ")
    .replace(/&#8203;/g, " ")
    .replace(/&#8204;/g, " ")
    .replace(/&#8205;/g, " ")
    .replace(/&#8206;/g, " ")
    .replace(/&#8207;/g, " ")
    .replace(/&#8208;/g, "-")
    .replace(/&#x2010;/g, "-")
    .replace(/&hyphen;/gi, "-")
    .replace(/&#8209;/g, "-")
    .replace(/&#x2011;/g, "-")
    .replace(/&#8211;/g, "–")
    .replace(/&ndash;/gi, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&mdash;/gi, "—")
    .replace(/&#8216;/g, "‘")
    .replace(/&lsquo;/gi, "‘")
    .replace(/&#8217;/g, "’")
    .replace(/&rsquo;/gi, "’")
    .replace(/&#8218;/g, "‚")
    .replace(/&sbquo;/gi, "‚")
    .replace(/&#8219;/g, "‛")
    .replace(/&#8220;/g, "“")
    .replace(/&ldquo;/gi, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&rdquo;/gi, "”")
    .replace(/&#8222;/g, "„")
    .replace(/&bdquo;/gi, "„")
    .replace(/&#8223;/g, "‟")
    .replace(/&#8230;/g, "…")
    .replace(/&hellip;/gi, "…")
    .replace(/&#8242;/g, "′")
    .replace(/&prime;/gi, "′")
    .replace(/&#8243;/g, "″")
    .replace(/&Prime;/gi, "″")
    .replace(/&#8722;/g, "-")
    .replace(/&minus;/gi, "-");
}

// user names extension for POST_TARGET
export function replaceUserNames(
  str: string,
  skipName: string,
  postTarget: string
): string {
  // Adds POST_TARGET to all @usernames except the skipName
  const regex = new RegExp(
    `(?<![a-zA-Z0-9])(?!${skipName})(@([a-zA-Z0-9_]+))`,
    "gi"
  );
  return str.replace(regex, `$1@${postTarget}`);
}

// content shortening - if content is longer than POST_LENGHT, it will be shorten to POST_LENGHT, then to last space + […]
export function trimContent(str: string, length: number): string {
  if (str.length <= length) return str;
  const trimmedText = str.substring(0, length);
  return str.substring(0, trimmedText.lastIndexOf(" ")) + " […]";
}

// image  URL shortening - if image ends with ==, it will be shorten for this two chars
export function trimImageUrl(str: string): string {
  const regex = new RegExp("==" + "$");
  if (regex.test(str)) return str.substring(0, str.length - 2);
  return str;
}

export function composeResultContent(
  entryTitle: string,
  entryAuthor: string,
  feedTitle: string
): string {
  let resultContent = "";

  const feedAuthorUserName = feedTitle.substring(feedTitle.indexOf("@") - 1);
  const feedAuthorRealName = feedTitle.substring(0, feedTitle.indexOf("/") - 1);
  const resultFeedAuthor = SETTINGS.SHOULD_PREFER_REAL_NAME
    ? feedAuthorRealName
    : feedAuthorUserName;

  resultContent = replaceSpecialCharacters(entryTitle);
  resultContent = replaceAmpersands(
    resultContent,
    SETTINGS.AMPERSAND_REPLACEMENT
  );
  resultContent = replaceReposted(
    resultContent,
    resultFeedAuthor,
    entryAuthor,
    SETTINGS.REPOST_SENTENCE
  );
  resultContent = replaceResponseTo(resultContent);
  resultContent = replaceUserNames(
    resultContent,
    feedAuthorUserName,
    SETTINGS.USER_INSTANCE
  );
  resultContent = contentHack(resultContent);
  resultContent = trimContent(resultContent, SETTINGS.POST_LENGTH);

  return resultContent;
}

export function composeResultStatus(
  resultContent: string,
  entryImageUrl: string
): string {
  let resultStatus = `${resultContent}\n`;

  const resultImageUrl = trimImageUrl(entryImageUrl);

  // modification of status in case when showing the image is enabled
  if (isImageInPost(entryImageUrl) && SETTINGS.SHOW_IMAGEURL === true) {
    resultStatus = resultStatus + `\n🖼️${resultImageUrl}`;
  }

  if (
    !isUrlIncluded(resultContent) ||
    SETTINGS.SHOW_ORIGIN_POSTURL_PERM === true
  ) {
    resultStatus = resultStatus + `\n🔗${resultUrl}`;
  }

  return resultStatus;
}

const entryTitle = String(Feed.newFeedItem.EntryTitle);
const entryUrl = String(Feed.newFeedItem.EntryUrl);
const entryImageUrl = String(Feed.newFeedItem.EntryImageUrl);
const entryAuthor = String(Feed.newFeedItem.EntryAuthor);
const feedTitle = String(Feed.newFeedItem.FeedTitle);
const feedUrl = String(Feed.newFeedItem.FeedUrl);

const resultUrl = replaceSourceWithTarget(
  SETTINGS.SHOW_FEEDURL_INSTD_POSTURL ? feedUrl : entryUrl,
  SETTINGS.POST_SOURCE,
  SETTINGS.POST_TARGET
);

if (entryTitle === "Image" || entryTitle === "Gif" || entryTitle === "Video") {
  const requestBody = `status=${resultUrl}`;
  MakerWebhooks.makeWebRequest.setBody(requestBody);
} else if (
  isResponseToSomeoneElse(entryTitle, entryAuthor) ||
  (isRepost(entryTitle) &&
    !isRepostOwn(entryTitle, entryAuthor) &&
    SETTINGS.REPOST_ALLOWED === false)
) {
  MakerWebhooks.makeWebRequest.skip();
} else {
  const resultContent = composeResultContent(
    entryTitle,
    entryAuthor,
    feedTitle
  );

  const resultStatus = composeResultStatus(resultContent, entryImageUrl);

  const requestBody = `status=${resultStatus}`;
  MakerWebhooks.makeWebRequest.setBody(requestBody);
}
