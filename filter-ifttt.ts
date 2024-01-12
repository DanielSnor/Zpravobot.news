///////////////////////////////////////////////////////////////////////////////
// IFTTT 🦋🐦‍⬛📙📘🐦📺 webhook filter v0.9.1 - 2.1.2024
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
}

// is commercial in post? check
function isCommercialInPost(str: string): boolean {
  const regex = new RegExp(SETTINGS.COMMERCIAL_SENTENCE, "gi");
  if (regex.test(str)) return true;
  return false;
}

// is image in post? check
function isImageInPost(str: string): boolean {
  const regex = new RegExp(`https://ifttt.com/images/no_image_card.png`, "gi");
  if (regex.test(str)) return false;
  return true;
}

// is it repost? check
const isRepost = (str: string) => {
  const regex = new RegExp("^(RT ([^>]+): )");
  return regex.test(str);
};

// is it own repost? check
const isRepostOwn = (str: string, authorName: string) => {
  const regex = new RegExp(`^(RT ${authorName}: )`);
  return regex.test(str);
};

// is it response to someone else? check
function isResponseToSomeoneElse(
  str: string,
  authorName: string
): boolean {
  const regex = new RegExp(`^R to (?!${authorName}: ).*?: `, "gi");
  if (regex.test(str)) return true;
  return false;
}

// is URL link included? check - gives the possibility to modify status
function isUrlIncluded(str: string): boolean {
  const regex = new RegExp("((https|http)://)", "gi");
  if (regex.test(str)) return true;
  return false;
}

// & char replacement
function replaceAmpersands(str: string, replacement: string): string {
  const words = str.split(" ");

  return words
	.map((word) => {
	  const regex = new RegExp("((https|http)://)", "gi");
	  if (regex.test(word)) return encodeURI(word);
	  return word.replace(/(&amp;|&#38;|&#038;|&)/gi, replacement);
	})
	.join(" ");
}

// basic text formatting replacement
function replaceBasicFormatting(str: string): string {
  return str
	.replace(/<br>/ig, '\n').replace(/<\/p>/ig, '\n');
}

// czech chars replacement
function replaceCzechCharacters(str: string): string {
  return str
	.replace(/&#193;/g, 'Á').replace(/&Aacute;/g, 'Á').replace(/A&#769;/g, 'Á').replace(/&#196;/g, 'Ä').replace(/&Auml;/g, 'Ä').replace(/A&#776;/g, 'Ä').replace(/&#201;/g, 'É').replace(/&Eacute;/g, 'É').replace(/E&#769;/g, 'É').replace(/&#203;/g, 'Ë').replace(/&Euml;/g, 'Ë').replace(/E&#776;/g, 'Ë').replace(/&#205;/g, 'Í').replace(/&Lacute;/g, 'Í').replace(/I&#769;/g, 'Í').replace(/&#207;/g, 'Ï').replace(/&Luml;/g, 'Ï').replace(/I&#776;/g, 'Ï').replace(/&#211;/g, 'Ó').replace(/&Oacute;/g, 'Ó').replace(/O&#769;/g, 'Ó').replace(/&#214;/g, 'Ö').replace(/&Ouml;/g, 'Ö').replace(/O&#776;/g, 'Ö').replace(/&#218;/g, 'Ú').replace(/&Uacute;/g, 'Ú').replace(/U&#769;/g, 'Ú').replace(/&#220;/g, 'Ü').replace(/&Uuml;/g, 'Ü').replace(/U&#776;/g, 'Ü').replace(/&#221;/g, 'Ý').replace(/&Yacute;/g, 'Ý').replace(/Y&#769;/g, 'Ý').replace(/&#225;/g, 'á').replace(/&aacute;/g, 'á').replace(/a&#769;/g, 'á').replace(/&#228;/g, 'ä').replace(/&auml;/g, 'ä').replace(/a&#776;/g, 'ä').replace(/&#233;/g, 'é').replace(/&eacute;/g, 'é').replace(/e&#769;/g, 'é').replace(/&#235;/g, 'ë').replace(/&euml;/g, 'ë').replace(/e&#776;/g, 'ë').replace(/&#237;/g, 'í').replace(/&iacute;/g, 'í').replace(/i&#769;/g, 'í').replace(/&#239;/g, 'ï').replace(/&iuml;/g, 'ï').replace(/i&#776;/g, 'ï').replace(/&#243;/g, 'ó').replace(/&oacute;/g, 'ó').replace(/o&#769;/g, 'ó').replace(/&#246;/g, 'ö').replace(/&ouml;/g, 'ö').replace(/o&#776;/g, 'ö').replace(/&#250;/g, 'ú').replace(/&uacute;/g, 'ú').replace(/u&#769;/g, 'ú').replace(/&#252;/g, 'ü').replace(/&uuml;/g, 'ü').replace(/u&#776;/g, 'ü').replace(/&#253;/g, 'ý').replace(/&yacute;/g, 'ý').replace(/y&#769;/g, 'ý').replace(/&#268;/g, 'Č').replace(/&Ccaron;/g, 'Č').replace(/C&#780;/g, 'Č').replace(/&#269;/g, 'č').replace(/&ccaron;/g, 'č').replace(/c&#780;/g, 'č').replace(/&#270;/g, 'Ď').replace(/&Dcaron;/g, 'Ď').replace(/D&#780;/g, 'Ď').replace(/&#271;/g, 'ď').replace(/&dcaron;/g, 'ď').replace(/d&#780;/g, 'ď').replace(/&#282;/g, 'Ě').replace(/&Ecaron;/g, 'Ě').replace(/E&#780;/g, 'Ě').replace(/&#283;/g, 'ě').replace(/&ecaron;/g, 'ě').replace(/e&#780;/g, 'ě').replace(/&#327;/g, 'Ň').replace(/&Ncaron;/g, 'Ň').replace(/N&#780;/g, 'Ň').replace(/&#328;/g, 'ň').replace(/&ncaron;/g, 'ň').replace(/n&#780;/g, 'ň').replace(/&#336;/g, 'Ő').replace(/&Odblac;/g, 'Ő').replace(/O&#778;/g, 'Ő').replace(/&#337;/g, 'ő').replace(/&odblac;/g, 'ő').replace(/o&#778;/g, 'ő').replace(/&#344;/g, 'Ř').replace(/&Rcaron;/g, 'Ř').replace(/R&#780;/g, 'Ř').replace(/&#345;/g, 'ř').replace(/&rcaron;/g, 'ř').replace(/r&#780;/g, 'ř').replace(/&#352;/g, 'Š').replace(/&Scaron;/g, 'Š').replace(/S&#780;/g, 'Š').replace(/&#353;/g, 'š').replace(/&scaron;/g, 'š').replace(/s&#780;/g, 'š').replace(/&#356;/g, 'Ť').replace(/&Tcaron;/g, 'Ť').replace(/T&#780;/g, 'Ť').replace(/&#357;/g, 'ť').replace(/&tcaron;/g, 'ť').replace(/t&#780;/g, 'ť').replace(/&#366;/g, 'Ů').replace(/&Uring;/g, 'Ů').replace(/U&#778;/g, 'Ů').replace(/&#367;/g, 'ů').replace(/&uring;/g, 'ů').replace(/U&#778;/g, 'ů').replace(/&#368;/g, 'Ű').replace(/&Udblac;/g, 'Ű').replace(/U&#778;/g, 'Ű').replace(/&#369;/g, 'ű').replace(/&udblac;/g, 'ű').replace(/u&#778;/g, 'u').replace(/&#381;/g, 'Ž').replace(/&Zcaron;/g, 'Ž').replace(/Z&#780;/g, 'Ž').replace(/&#382;/g, 'ž').replace(/&zcaron;/g, 'ž').replace(/z&#780;/g, 'ž');
}

// html removal
function replaceHtml(str: string): string {
  return str
	.replace(/<[^<>]+>/ig, "");
}

// quote text replacement for BS
function replaceQuotedBS(
  str: string,
  resultFeedAuthor: string,
  entryAuthor: string,
  sentence: string
): string {
  const regex = new RegExp("(\\[quote\\])");
  return str.replace(
  regex,
  `${resultFeedAuthor} ${sentence} ${entryAuthor}:\n\n`
  );
}

// repost text replacement
function replaceReposted(
  str: string,
  resultFeedAuthor: string,
  entryAuthor: string,
  sentence: string
): string {
  const regex = new RegExp("^(RT ([^>]+): )");
  return str.replace(
	regex,
	`${resultFeedAuthor} ${sentence} ${entryAuthor}:\n\n`
  );
}

// repost text replacement for BS
function replaceRepostedBS(
  str: string,
  resultFeedAuthor: string,
  entryAuthor: string,
  sentence: string
): string {
  const regex = new RegExp("^(Repost ([^>]+): )");
  return str.replace(
	regex,
	`${resultFeedAuthor} ${sentence} ${entryAuthor}:\n\n`
  );
}

// removal of R mark for threads
function replaceResponseTo(str: string) {
  const regex = new RegExp("^R to (.*?): ");
  return str.replace(regex, "");
}

// replacement of the source by target
function replaceSourceWithTarget(
  str: string,
  source: string,
  target: string
): string {
  const regex = new RegExp(source, "gi");
  return str.replace(regex, target);
}

// special chars replacement
function replaceSpecialCharacters(str: string): string {
  return str
	.replace(/&#09;/g, " ").replace(/&#009;/g, " ").replace(/&#10;/g, " ").replace(/&#010;/g, " ").replace(/&#13;/g, " ").replace(/&#013;/g, " ").replace(/&#32;/g, " ").replace(/&#032;/g, " ").replace(/&#33;/g, "!").replace(/&#033;/g, "!").replace(/&excl;/gi, "!").replace(/&#34;/g, '"').replace(/&#034;/g, '"').replace(/&quot;/gi, '"').replace(/&#37;/g, "%").replace(/&#037;/g, "%").replace(/&percnt;/gi, "%").replace(/&#39;/g, "‘").replace(/&#039;/g, "‘").replace(/&apos;/gi, "‘").replace(/&#40;/g, "(").replace(/&#040;/g, "(").replace(/&lpar;/gi, "(").replace(/&#41;/g, ")").replace(/&#041;/g, ")").replace(/&rpar;/gi, ")").replace(/&#46;/g, ".").replace(/&#046;/g, ".").replace(/&period;/gi, ".").replace(/&#60;/g, "<").replace(/&#060;/g, "<").replace(/&lt;/gi, "<").replace(/&#61;/g, "=").replace(/&#061;/g, "=").replace(/&equals;/gi, "=").replace(/&#62;/g, ">").replace(/&#062;/g, ">").replace(/&gt;/gi, ">").replace(/&#160;/g, " ").replace(/&nbsp;/gi, " ").replace(/&#173;/g, "").replace(/&#xAD;/gi, "").replace(/&shy;/gi, "").replace(/&#8192;/g, " ").replace(/&#8193;/g, " ").replace(/&#8194;/g, " ").replace(/&#8195;/g, " ").replace(/&#8196;/g, " ").replace(/&#8197;/g, " ").replace(/&#8198;/g, " ").replace(/&#8199;/g, " ").replace(/&#8200;/g, " ").replace(/&#8201;/g, " ").replace(/&#8202;/g, " ").replace(/&#8203;/g, " ").replace(/&#8204;/g, " ").replace(/&#8205;/g, " ").replace(/&#8206;/g, " ").replace(/&#8207;/g, " ").replace(/&#8208;/g, "-").replace(/&#x2010;/g, "-").replace(/&hyphen;/gi, "-").replace(/&#8209;/g, "-").replace(/&#x2011;/g, "-").replace(/&#8211;/g, "–").replace(/&ndash;/gi, "–").replace(/&#8212;/g, "—").replace(/&mdash;/gi, "—").replace(/&#8216;/g, "‘").replace(/&lsquo;/gi, "‘").replace(/&#8217;/g, "’").replace(/&rsquo;/gi, "’").replace(/&#8218;/g, "‚").replace(/&sbquo;/gi, "‚").replace(/&#8219;/g, "‛").replace(/&#8220;/g, "“").replace(/&ldquo;/gi, "“").replace(/&#8221;/g, "”").replace(/&rdquo;/gi, "”").replace(/&#8222;/g, "„").replace(/&bdquo;/gi, "„").replace(/&#8223;/g, "‟").replace(/&#8230;/g, "…").replace(/&hellip;/gi, "…").replace(/&#8242;/g, "′").replace(/&prime;/gi, "′").replace(/&#8243;/g, "″").replace(/&Prime;/gi, "″").replace(/&#8722;/g, "-").replace(/&minus;/gi, "-");
}

// user names extension for POST_TARGET
function replaceUserNames(
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
function trimContent(str: string, length: number): string {
  if (str.length <= length) return str;
  const trimmedText = str.substring(0, length);
  return str.substring(0, trimmedText.lastIndexOf(" ")) + " […]";
}

// image  URL shortening - if image ends with ==, it will be shorten for this two chars
function trimImageUrl(str: string): string {
  const regex = new RegExp("==" + "$");
  if (regex.test(str)) return str.substring(0, str.length - 2);
  return str;
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
  if (SETTINGS.POST_FROM === "NT" || SETTINGS.POST_FROM === "TW") {
    // for NT & TW posts get resultFeedAuthor
    resultFeedAuthor = SETTINGS.SHOULD_PREFER_REAL_NAME
      ? feedAuthorRealName
      : feedAuthorUserName;
    // for NT & TW posts just entryTitle
    resultContent = entryTitle;
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
  } else if (SETTINGS.POST_FROM === "BS"){
    // for BS posts get resultFeedAuthor from feedTitle
    resultFeedAuthor = feedTitle.substring(feedTitle.indexOf("(") + 1, feedTitle.indexOf(")"));
    // for BS posts resultContent entryTitle + entryContent
    resultContent = entryTitle + `: \n` + entryContent;
    resultContent = replaceRepostedBS(
      resultContent,
      resultFeedAuthor,
      entryAuthor,
      SETTINGS.REPOST_SENTENCE
      );
    resultContent = replaceQuotedBS(
      resultContent,
      resultFeedAuthor,
      entryAuthor,
      SETTINGS.QUOTE_SENTENCE
      );
      resultContent = contentHackBS(resultContent);
  } else {
  // for posts from RSS getContent
	resultContent = getContent(entryContent, entryTitle);	  
  }
  
  resultContent = replaceBasicFormatting(resultContent);
  resultContent = replaceHtml(resultContent);
  resultContent = replaceCzechCharacters(resultContent);
  resultContent = replaceSpecialCharacters(resultContent);
  resultContent = replaceAmpersands(
	resultContent,
	SETTINGS.AMPERSAND_REPLACEMENT
    );
  resultContent = contentHack(resultContent);
  resultContent = trimContent(resultContent, SETTINGS.POST_LENGTH);

  return resultContent;
}

// composition of the status - content, picture, url + needed checks & entries from settings
function composeResultStatus(
  resultContent: string,
  entryImageUrl: string,
  statusImageUrlSentence: string,
  statusResultUrlSentence: string
): string {
  let resultStatus = `${resultContent}\n`;
  let resultImageUrl = trimImageUrl(entryImageUrl);
  
  // removing ampersands from image url
  resultImageUrl = replaceAmpersands(
	resultImageUrl,
	SETTINGS.AMPERSAND_REPLACEMENT
  );

  // modification of status in case when showing the image is enabled
  if (isImageInPost(entryImageUrl) && SETTINGS.SHOW_IMAGEURL === true) {
    resultStatus = resultStatus + `\n${statusImageUrlSentence} ${resultImageUrl}`;
  }

  if (
	!isUrlIncluded(resultContent) ||
	SETTINGS.SHOW_ORIGIN_POSTURL_PERM === true
  ) {
    resultStatus = resultStatus + `\n${statusResultUrlSentence} ${resultUrl}`;
  }

  return resultStatus;
}

// replacing of source and target
let resultUrl = replaceSourceWithTarget(
  SETTINGS.SHOW_FEEDURL_INSTD_POSTURL ? feedUrl : entryUrl,
  SETTINGS.POST_SOURCE,
  SETTINGS.POST_TARGET
);
  
// removing ampersands from url
resultUrl = replaceAmpersands(
  resultUrl,
  SETTINGS.AMPERSAND_REPLACEMENT
);

// images from nitter need some special care
if (entryTitle === "Image" || entryTitle === "Gif" || entryTitle === "Video") {
  const requestBody = `status=${resultUrl}`;
  MakerWebhooks.makeWebRequest.setBody(requestBody);
} else if (
  // if post is response to someone else or repost are not allowed, skip it
  isResponseToSomeoneElse(entryTitle, entryAuthor) ||
  (isRepost(entryTitle) &&
	!isRepostOwn(entryTitle, entryAuthor) &&
	SETTINGS.REPOST_ALLOWED === false)
  // if post contains commercial based on SETTINGS.COMMERCIAL_SENTENCE
  // isCommercialInPost(resultContent) === true
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
    entryImageUrl,
    SETTINGS.STATUS_IMAGEURL_SENTENCE,
    SETTINGS.STATUS_URL_SENTENCE
  );

  // return of the status to IFTTT
  const requestBody = `status=${resultStatus}`;
  MakerWebhooks.makeWebRequest.setBody(requestBody);
}
