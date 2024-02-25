import { Feed, MakerWebhooks } from "./core";

// IFTTT 📙📘 Webhook entryContent filter v0.5.0 - 22.10.2023

function contentHack(str: string): string {
  return str.replace(/(Zacatek[^>]+Konec)/gi, "");
}

function getContent(entryContent: any, entryTitle: any): string {
  if (typeof entryContent === "string" && entryContent.length > 0) {
    return entryContent;
  }
  if (typeof entryTitle === "string" && entryTitle.length > 0) {
    return entryTitle;
  }
}

function replaceAmperdsands(str: string): string {
  return str
    .replace(/&#38;/g, "′n′")
    .replace(/&#038;/g, "′n′")
    .replace(/&amp;/gi, "′n′")
    .replace(/&/g, "′n′");
}

function replaceBasicFormatting(str: string): string {
  return str.replace(/<br>/gi, "\n").replace(/<\/p>/gi, "\n\n");
}

function replaceCzechCharacters(str: string): string {
  return str
    .replace(/&#193;/g, "Á")
    .replace(/&Aacute;/g, "Á")
    .replace(/A&#769;/g, "Á")
    .replace(/&#196;/g, "Ä")
    .replace(/&Auml;/g, "Ä")
    .replace(/A&#776;/g, "Ä")
    .replace(/&#201;/g, "É")
    .replace(/&Eacute;/g, "É")
    .replace(/E&#769;/g, "É")
    .replace(/&#203;/g, "Ë")
    .replace(/&Euml;/g, "Ë")
    .replace(/E&#776;/g, "Ë")
    .replace(/&#205;/g, "Í")
    .replace(/&Lacute;/g, "Í")
    .replace(/I&#769;/g, "Í")
    .replace(/&#207;/g, "Ï")
    .replace(/&Luml;/g, "Ï")
    .replace(/I&#776;/g, "Ï")
    .replace(/&#211;/g, "Ó")
    .replace(/&Oacute;/g, "Ó")
    .replace(/O&#769;/g, "Ó")
    .replace(/&#214;/g, "Ö")
    .replace(/&Ouml;/g, "Ö")
    .replace(/O&#776;/g, "Ö")
    .replace(/&#218;/g, "Ú")
    .replace(/&Uacute;/g, "Ú")
    .replace(/U&#769;/g, "Ú")
    .replace(/&#220;/g, "Ü")
    .replace(/&Uuml;/g, "Ü")
    .replace(/U&#776;/g, "Ü")
    .replace(/&#221;/g, "Ý")
    .replace(/&Yacute;/g, "Ý")
    .replace(/Y&#769;/g, "Ý")
    .replace(/&#225;/g, "á")
    .replace(/&aacute;/g, "á")
    .replace(/a&#769;/g, "á")
    .replace(/&#228;/g, "ä")
    .replace(/&auml;/g, "ä")
    .replace(/a&#776;/g, "ä")
    .replace(/&#233;/g, "é")
    .replace(/&eacute;/g, "é")
    .replace(/e&#769;/g, "é")
    .replace(/&#235;/g, "ë")
    .replace(/&euml;/g, "ë")
    .replace(/e&#776;/g, "ë")
    .replace(/&#237;/g, "í")
    .replace(/&iacute;/g, "í")
    .replace(/i&#769;/g, "í")
    .replace(/&#239;/g, "ï")
    .replace(/&iuml;/g, "ï")
    .replace(/i&#776;/g, "ï")
    .replace(/&#243;/g, "ó")
    .replace(/&oacute;/g, "ó")
    .replace(/o&#769;/g, "ó")
    .replace(/&#246;/g, "ö")
    .replace(/&ouml;/g, "ö")
    .replace(/o&#776;/g, "ö")
    .replace(/&#250;/g, "ú")
    .replace(/&uacute;/g, "ú")
    .replace(/u&#769;/g, "ú")
    .replace(/&#252;/g, "ü")
    .replace(/&uuml;/g, "ü")
    .replace(/u&#776;/g, "ü")
    .replace(/&#253;/g, "ý")
    .replace(/&yacute;/g, "ý")
    .replace(/y&#769;/g, "ý")
    .replace(/&#268;/g, "Č")
    .replace(/&Ccaron;/g, "Č")
    .replace(/C&#780;/g, "Č")
    .replace(/&#269;/g, "č")
    .replace(/&ccaron;/g, "č")
    .replace(/c&#780;/g, "č")
    .replace(/&#270;/g, "Ď")
    .replace(/&Dcaron;/g, "Ď")
    .replace(/D&#780;/g, "Ď")
    .replace(/&#271;/g, "ď")
    .replace(/&dcaron;/g, "ď")
    .replace(/d&#780;/g, "ď")
    .replace(/&#282;/g, "Ě")
    .replace(/&Ecaron;/g, "Ě")
    .replace(/E&#780;/g, "Ě")
    .replace(/&#283;/g, "ě")
    .replace(/&ecaron;/g, "ě")
    .replace(/e&#780;/g, "ě")
    .replace(/&#327;/g, "Ň")
    .replace(/&Ncaron;/g, "Ň")
    .replace(/N&#780;/g, "Ň")
    .replace(/&#328;/g, "ň")
    .replace(/&ncaron;/g, "ň")
    .replace(/n&#780;/g, "ň")
    .replace(/&#336;/g, "Ő")
    .replace(/&Odblac;/g, "Ő")
    .replace(/O&#778;/g, "Ő")
    .replace(/&#337;/g, "ő")
    .replace(/&odblac;/g, "ő")
    .replace(/o&#778;/g, "ő")
    .replace(/&#344;/g, "Ř")
    .replace(/&Rcaron;/g, "Ř")
    .replace(/R&#780;/g, "Ř")
    .replace(/&#345;/g, "ř")
    .replace(/&rcaron;/g, "ř")
    .replace(/r&#780;/g, "ř")
    .replace(/&#352;/g, "Š")
    .replace(/&Scaron;/g, "Š")
    .replace(/S&#780;/g, "Š")
    .replace(/&#353;/g, "š")
    .replace(/&scaron;/g, "š")
    .replace(/s&#780;/g, "š")
    .replace(/&#356;/g, "Ť")
    .replace(/&Tcaron;/g, "Ť")
    .replace(/T&#780;/g, "Ť")
    .replace(/&#357;/g, "ť")
    .replace(/&tcaron;/g, "ť")
    .replace(/t&#780;/g, "ť")
    .replace(/&#366;/g, "Ů")
    .replace(/&Uring;/g, "Ů")
    .replace(/U&#778;/g, "Ů")
    .replace(/&#367;/g, "ů")
    .replace(/&uring;/g, "ů")
    .replace(/U&#778;/g, "ů")
    .replace(/&#368;/g, "Ű")
    .replace(/&Udblac;/g, "Ű")
    .replace(/U&#778;/g, "Ű")
    .replace(/&#369;/g, "ű")
    .replace(/&udblac;/g, "ű")
    .replace(/u&#778;/g, "u")
    .replace(/&#381;/g, "Ž")
    .replace(/&Zcaron;/g, "Ž")
    .replace(/Z&#780;/g, "Ž")
    .replace(/&#382;/g, "ž")
    .replace(/&zcaron;/g, "ž")
    .replace(/z&#780;/g, "ž");
}

function replaceHtml(str: string): string {
  return str.replace(/(<([^>]+)>)/gi, "");
}

function replaceSpecialCharacters(str: string): string {
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

function trimContent(str: string): string {
  return str;
  if (content.length >= 4750) {
    content = content.substring(0, 4749) + "…";
  }
}

const entryContent = Feed.newFeedItem.EntryContent;
const entryTitle = Feed.newFeedItem.EntryTitle;
const entryUrl = Feed.newFeedItem.EntryUrl;
const newContent = getContent(entryContent, entryTitle);

let content = newContent;
let url = String(entryUrl);

content = replaceBasicFormatting(content);
content = replaceHtml(content);
content = replaceCzechCharacters(content);
content = replaceSpecialCharacters(content);
content = replaceAmperdsands(content);
content = contentHack(content);
content = trimContent(content);

// Create a variable to store the content of the request
const requestBody = `status=${content}\n\n${url}`;

// Send a web request
MakerWebhooks.makeWebRequest.setBody(requestBody);
