///////////////////////////////////////////////////////////////////////////////
// COMPLETE TEST SUITE - VŠECHNY TESTY 3.0.0 až 3.1.3
// Build 20251125 - v3.1.4 Edition
// Total: 204 tests (201 from v3.1.3 + 3 new for v3.1.4)
///////////////////////////////////////////////////////////////////////////////
//
// STRUKTURA TESTŮ:
// 
// 📦 v3.0.1 BASELINE (113 tests) - základní funkčnost
//    - basic-001 to basic-003: Základní filtrování
//    - url-001 to url-005: URL processing
//    - media-001 to media-003: Media handling
//    - rt-001 to rt-005: Retweet processing
//    - rt-self-001 to rt-self-002: Self-retweet
//    - quote-001 to quote-006: Quote tweets
//    - quote-self-001 to quote-self-002: Self-quotes
//    - banned-001 to banned-008: PHRASES_BANNED
//    - required-001 to required-004: PHRASES_REQUIRED
//    - complex-001 to complex-004: Complex filters
//    - trim-001 to trim-015: Content trimming
//    - rss-001 to rss-005: RSS processing
//    - bluesky-001 to bluesky-003: Bluesky platform
//    - youtube-001 to youtube-002: YouTube platform
//    - ampersand-001 to ampersand-003: Ampersand handling
//    - replacements-001 to replacements-006: Content replacements
//    - mentions-001 to mentions-004: Mention formatting
//    - unicode-001 to unicode-007: Unicode-safe truncation
//    - edge-001 to edge-010: Edge cases
//    - whitespace-001 to whitespace-015: Whitespace handling
//
// 📦 v3.0.3 NEW TESTS (14 tests) - URL domain fixes
//    - V303-001 to V303-005: Dynamic URL_MATCH with URL_DOMAIN_FIXES
//    - V303-006 to V303-009: URL_REPLACE_FROM array support
//    - V303-010 to V303-014: Incomplete URL detection and removal
//
// 📦 v3.1.0 NEW TESTS (51 tests) - Advanced filtering
//    - V310-A1 to V310-A4: MOVE_URL_TO_END configuration
//    - V310-B1 to V310-B4: FORCE_SHOW_ORIGIN_POSTURL bug fix
//    - V310-C1 to V310-C10: NOT/COMPLEX filtering operations
//    - V310-D1 to V310-D21: Unified filtering structure (OR/AND/NOT with regex)
//    - V310-E1 to V310-E12: Anchor tag HTML processing hotfix
//
// 📦 v3.1.3 NEW TESTS (23 tests) - URL deduplication & smart sentences
// 📦 v3.1.4 NEW TESTS (3 tests) - URL_DOMAIN_FIXES ES5 Fix
//    - V314-J1 to V314-J3: URL_DOMAIN_FIXES without negative lookbehind
//
//    - V312-F1 to V312-F6: FORCE_SHOW_ORIGIN_POSTURL final fixes
//    - V312-G1 to V312-G6: Whitespace cleanup via CONTENT_REPLACEMENTS
//    - V312-H1 to V312-H3: Combined v3.1.2 scenarios
//    - V312-I1 to V312-I8: URL deduplication (deduplicateTrailingUrls)
//
///////////////////////////////////////////////////////////////////////////////
// 
// POZNÁMKA: Tento soubor spojuje všechny dostupné testy.
// Pro spuštění testů potřebujete:
// 1. Aktuální filter script (example-ifttt-filter-x-xcom-3_1_3.ts)
// 2. Test runner který umí spouštět testy
//
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// COMPLETE Test Suite for IFTTT Webhook Filter v3.0.1
// Build 20251022 - WITH UNICODE-SAFE TRUNCATION TESTS
// Total: 111 tests (49 original + 62 new tests)
///////////////////////////////////////////////////////////////////////////////

interface TestCase {
	id: string;
	category: string;
	description: string;
	priority ? : "HIGH" | "MEDIUM" | "LOW";
	input: {
		TweetEmbedCode: string;
		Text: string;
		LinkToTweet: string;
		FirstLinkUrl: string;
		UserName: string;
	};
	expected: {
		output: string;
		shouldSkip: boolean;
		skipReason ? : string;
	};
	settings: AppSettings;
}

interface AppSettings {
	PHRASES_BANNED: (string | any)[];
	PHRASES_REQUIRED: (string | any)[];
	REPOST_ALLOWED: boolean;
	AMPERSAND_SAFE_CHAR: string;
	CONTENT_REPLACEMENTS: any[];
	POST_LENGTH: number;
	POST_LENGTH_TRIM_STRATEGY: "sentence" | "word" | "smart";
	SMART_TOLERANCE_PERCENT: number;
	URL_REPLACE_FROM: string;
	URL_REPLACE_TO: string;
	URL_NO_TRIM_DOMAINS: string[];
	URL_DOMAIN_FIXES: string[];
	FORCE_SHOW_ORIGIN_POSTURL: boolean;
	FORCE_SHOW_FEEDURL: boolean;
	SHOW_IMAGEURL: boolean;
	PREFIX_REPOST: string;
	PREFIX_QUOTE: string;
	PREFIX_IMAGE_URL: string;
	PREFIX_POST_URL: string;
	PREFIX_SELF_REFERENCE: string;
	MENTION_FORMATTING: {
		[platform: string]: { type: "prefix" | "suffix" | "none";value: string }
	};
	POST_FROM: "BS" | "RSS" | "TW" | "YT";
	SHOW_REAL_NAME: boolean;
	SHOW_TITLE_AS_CONTENT: boolean;
	RSS_MAX_INPUT_CHARS: number;
}

const BLUESKY_SETTINGS: AppSettings = {
	PHRASES_BANNED: [],
	PHRASES_REQUIRED: [],
	REPOST_ALLOWED: true,
	AMPERSAND_SAFE_CHAR: `⅋`,
	CONTENT_REPLACEMENTS: [],
	POST_LENGTH: 444,
	POST_LENGTH_TRIM_STRATEGY: "sentence",
	SMART_TOLERANCE_PERCENT: 12,
	URL_REPLACE_FROM: "",
	URL_REPLACE_TO: "",
	URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"],
	URL_DOMAIN_FIXES: [],
	FORCE_SHOW_ORIGIN_POSTURL: true,
	FORCE_SHOW_FEEDURL: false,
	SHOW_IMAGEURL: false,
	PREFIX_REPOST: "",
	PREFIX_QUOTE: " 🦋📝💬 ",
	PREFIX_IMAGE_URL: "",
	PREFIX_POST_URL: "\n",
	PREFIX_SELF_REFERENCE: "vlastní post",
	MENTION_FORMATTING: { "BS": { type: "prefix", value: "https://bsky.app/profile/" } },
	POST_FROM: "BS",
	SHOW_REAL_NAME: true,
	SHOW_TITLE_AS_CONTENT: false,
	RSS_MAX_INPUT_CHARS: 1000
};

const RSS_SETTINGS: AppSettings = {
	PHRASES_BANNED: [],
	PHRASES_REQUIRED: [],
	REPOST_ALLOWED: true,
	AMPERSAND_SAFE_CHAR: `⅋`,
	CONTENT_REPLACEMENTS: [],
	POST_LENGTH: 444,
	POST_LENGTH_TRIM_STRATEGY: "smart",
	SMART_TOLERANCE_PERCENT: 12,
	URL_REPLACE_FROM: "",
	URL_REPLACE_TO: "",
	URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"],
	URL_DOMAIN_FIXES: [],
	FORCE_SHOW_ORIGIN_POSTURL: true,
	FORCE_SHOW_FEEDURL: false,
	SHOW_IMAGEURL: false,
	PREFIX_REPOST: "",
	PREFIX_QUOTE: "",
	PREFIX_IMAGE_URL: "",
	PREFIX_POST_URL: "\n",
	PREFIX_SELF_REFERENCE: "vlastní post",
	MENTION_FORMATTING: { "RSS": { type: "suffix", value: "@twitter.com" } },
	POST_FROM: "RSS",
	SHOW_REAL_NAME: true,
	SHOW_TITLE_AS_CONTENT: false,
	RSS_MAX_INPUT_CHARS: 1000
};

const TWITTER_SETTINGS: AppSettings = {
	PHRASES_BANNED: [],
	PHRASES_REQUIRED: [],
	REPOST_ALLOWED: true,
	AMPERSAND_SAFE_CHAR: `⅋`,
	CONTENT_REPLACEMENTS: [],
	POST_LENGTH: 444,
	POST_LENGTH_TRIM_STRATEGY: "smart",
	SMART_TOLERANCE_PERCENT: 12,
	URL_REPLACE_FROM: "https://x.com/",
	URL_REPLACE_TO: "https://twitter.com/",
	URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"],
	URL_DOMAIN_FIXES: [],
	FORCE_SHOW_ORIGIN_POSTURL: false,
	FORCE_SHOW_FEEDURL: false,
	SHOW_IMAGEURL: false,
	PREFIX_REPOST: " 𝕏📤 ",
	PREFIX_QUOTE: " 𝕏📝💬 ",
	PREFIX_IMAGE_URL: "",
	PREFIX_POST_URL: "\n",
	PREFIX_SELF_REFERENCE: "vlastní post",
	MENTION_FORMATTING: { "TW": { type: "suffix", value: "@twitter.com" } },
	POST_FROM: "TW",
	SHOW_REAL_NAME: true,
	SHOW_TITLE_AS_CONTENT: false,
	RSS_MAX_INPUT_CHARS: 1000
};

const YOUTUBE_SETTINGS: AppSettings = {
	PHRASES_BANNED: [],
	PHRASES_REQUIRED: [],
	REPOST_ALLOWED: true,
	AMPERSAND_SAFE_CHAR: `⅋`,
	CONTENT_REPLACEMENTS: [],
	POST_LENGTH: 444,
	POST_LENGTH_TRIM_STRATEGY: "sentence",
	SMART_TOLERANCE_PERCENT: 12,
	URL_REPLACE_FROM: "",
	URL_REPLACE_TO: "",
	URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"],
	URL_DOMAIN_FIXES: [],
	FORCE_SHOW_ORIGIN_POSTURL: true,
	FORCE_SHOW_FEEDURL: false,
	SHOW_IMAGEURL: false,
	PREFIX_REPOST: "",
	PREFIX_QUOTE: "",
	PREFIX_IMAGE_URL: "",
	PREFIX_POST_URL: "\nYT 📺👇👇👇\n",
	PREFIX_SELF_REFERENCE: "vlastní post",
	MENTION_FORMATTING: { "YT": { type: "none", value: "" } },
	POST_FROM: "YT",
	SHOW_REAL_NAME: true,
	SHOW_TITLE_AS_CONTENT: false,
	RSS_MAX_INPUT_CHARS: 1000
};

const testCases: TestCase[] = [

	// =========================================================================
	// ORIGINAL TESTS (49 tests)
	// =========================================================================
	// CATEGORY 1: Basic Tweets (3 tests)
	// =========================================================================

	{
		id: "basic-001",
		category: "Basic Tweets",
		description: "Simple tweet without mentions or URLs",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Toto je obyčejný krátký tweet bez zmínky někoho jiného a bez jakéhokoliv odkazu.</p>&mdash; Zprávobot.News (@zpravobotnews) <a href="https://twitter.com/zpravobotnews/status/1921469942865477709">May 11, 2025</a></blockquote>',
			Text: "Toto je obyčejný krátký tweet bez zmínky někoho jiného a bez jakéhokoliv odkazu.",
			LinkToTweet: "https://twitter.com/zpravobotnews/status/1921469942865477709",
			FirstLinkUrl: "(none)",
			UserName: "zpravobotnews"
		},
		expected: {
			output: "status=Toto je obyčejný krátký tweet bez zmínky někoho jiného a bez jakéhokoliv odkazu.",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "basic-002",
		category: "Basic Tweets",
		description: "Tweet with hashtag",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Toto je neobyčejný delší tweet bez zmínky někoho jiného a bez jakéhokoliv odkazu, ale trochu ho ozvláštníme tím, že přidáme jeden hashtag. #hashtag</p>&mdash; Zprávobot.News (@zpravobotnews) <a href="https://twitter.com/zpravobotnews/status/1921470314506068402">May 11, 2025</a></blockquote>',
			Text: "Toto je neobyčejný delší tweet bez zmínky někoho jiného a bez jakéhokoliv odkazu, ale trochu ho ozvláštníme tím, že přidáme jeden hashtag. #hashtag",
			LinkToTweet: "https://twitter.com/zpravobotnews/status/1921470314506068402",
			FirstLinkUrl: "(none)",
			UserName: "zpravobotnews"
		},
		expected: {
			output: "status=Toto je neobyčejný delší tweet bez zmínky někoho jiného a bez jakéhokoliv odkazu, ale trochu ho ozvláštníme tím, že přidáme jeden hashtag. #hashtag",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "basic-003",
		category: "Basic Tweets",
		description: "Tweet with @mention (not author)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Toto je mega hustě dlouhý tweet, v kterém chci zmínit @DanielSnor, protože proč ne, že ano, a také kde chci říct, že Zprávobot je, jak všichni jistě dobře víte, nejlepší a nejdůležitější server pro český Mastodon ever. Navíc sem přidáme nějaký ten hashtag. #hashtag #zpravobot</p>&mdash; Zprávobot.News (@zpravobotnews) <a href="https://twitter.com/zpravobotnews/status/1921476900997722468">May 11, 2025</a></blockquote>',
			Text: "Toto je mega hustě dlouhý tweet, v kterém chci zmínit @DanielSnor, protože proč ne, že ano, a také kde chci říct, že Zprávobot je, jak všichni jistě dobře víte, nejlepší a nejdůležitější server pro český Mastodon ever. Navíc sem přidáme nějaký ten hashtag. #hashtag #zpravobot",
			LinkToTweet: "https://twitter.com/zpravobotnews/status/1921476900997722468",
			FirstLinkUrl: "(none)",
			UserName: "zpravobotnews"
		},
		expected: {
			output: "status=Toto je mega hustě dlouhý tweet, v kterém chci zmínit @DanielSnor@twitter.com, protože proč ne, že ano, a také kde chci říct, že Zprávobot je, jak všichni jistě dobře víte, nejlepší a nejdůležitější server pro český Mastodon ever. Navíc sem přidáme nějaký ten hashtag. #hashtag #zpravobot",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	// =========================================================================
	// CATEGORY 2: Tweets with URLs (5 tests)
	// =========================================================================

	{
		id: "url-001",
		category: "Tweets with URLs",
		description: "Tweet with t.co URL (should be removed and replaced with FirstLinkUrl)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Toto je mega hustě dlouhý tweet, v kterém chci zmínit @DanielSnor, protože proč ne, že, a také kde uvedu ultimátní odkaz na https://t.co/893lsoNrJw, což je, jak všichni jistě víte, ten nejlepší server pro Mastodon ever. A navíc přidáme nějaké hashtagy. #hashtag #zpravobot #test</p>&mdash; Zprávobot.News (@zpravobotnews) <a href="https://twitter.com/zpravobotnews/status/1921471556724707831">May 11, 2025</a></blockquote>',
			Text: "Toto je mega hustě dlouhý tweet, v kterém chci zmínit @DanielSnor, protože proč ne, že, a také kde uvedu ultimátní odkaz na https://t.co/893lsoNrJw, což je, jak všichni jistě víte, ten nejlepší server pro Mastodon ever. A navíc přidáme nějaké hashtagy. #hashtag #zpravobot #test",
			LinkToTweet: "https://twitter.com/zpravobotnews/status/1921471556724707831",
			FirstLinkUrl: "https://zpravobot.news",
			UserName: "zpravobotnews"
		},
		expected: {
			output: "status=Toto je mega hustě dlouhý tweet, v kterém chci zmínit @DanielSnor@twitter.com, protože proč ne, že, a také kde uvedu ultimátní odkaz na , což je, jak všichni jistě víte, ten nejlepší server pro Mastodon ever. A navíc přidáme nějaké hashtagy. #hashtag #zpravobot #test\nhttps://zpravobot.news",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "url-002",
		category: "Tweets with URLs",
		description: "News article with external URL",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">V Česku vyroste nový, nejvyšší obloukový silniční most. 9. června se začne s jeho výstavbou u obce Plasy u Plzně. Výška nad vodní hladinou bude 87,3 metru. https://t.co/fYgtYN74KK</p>&mdash; Seznam Zprávy (@SeznamZpravy) <a href="https://twitter.com/SeznamZpravy/status/1921464058319966616">May 11, 2025</a></blockquote>',
			Text: "V Česku vyroste nový, nejvyšší obloukový silniční most. 9. června se začne s jeho výstavbou u obce Plasy u Plzně. Výška nad vodní hladinou bude 87,3 metru. https://t.co/fYgtYN74KK",
			LinkToTweet: "https://twitter.com/SeznamZpravy/status/1921464058319966616",
			FirstLinkUrl: "https://www.seznamzpravy.cz/clanek/276283",
			UserName: "SeznamZpravy"
		},
		expected: {
			output: "status=V Česku vyroste nový, nejvyšší obloukový silniční most. 9. června se začne s jeho výstavbou u obce Plasy u Plzně. Výška nad vodní hladinou bude 87,3 metru.\nhttps://www.seznamzpravy.cz/clanek/276283",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "url-003",
		category: "Tweets with URLs",
		description: "Tweet with emoji and external URL",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">🩸 Lékaři letos do konce dubna zaznamenali nejvíc případů lymské boreliózy za posledních 10 let. Klíšťata jsou aktivní dříve a ve vyšších polohách. 💉 Očkování proti encefalitidě je dostupné, proti borelióze zatím ne. https://t.co/cgSfeW7BBf</p>&mdash; Seznam Zprávy (@SeznamZpravy) <a href="https://twitter.com/SeznamZpravy/status/1921474991431802937">May 11, 2025</a></blockquote>',
			Text: "🩸 Lékaři letos do konce dubna zaznamenali nejvíc případů lymské boreliózy za posledních 10 let. Klíšťata jsou aktivní dříve a ve vyšších polohách. 💉 Očkování proti encefalitidě je dostupné, proti borelióze zatím ne. https://t.co/cgSfeW7BBf",
			LinkToTweet: "https://twitter.com/SeznamZpravy/status/1921474991431802937",
			FirstLinkUrl: "https://www.seznamzpravy.cz/clanek/domaci-pripadu-boreliozy-prenasene-klistaty-je-letos-na-jare-nejvic-od-roku-2014-276378",
			UserName: "SeznamZpravy"
		},
		expected: {
			output: "status=🩸 Lékaři letos do konce dubna zaznamenali nejvíc případů lymské boreliózy za posledních 10 let. Klíšťata jsou aktivní dříve a ve vyšších polohách. 💉 Očkování proti encefalitidě je dostupné, proti borelióze zatím ne.\nhttps://www.seznamzpravy.cz/clanek/domaci-pripadu-boreliozy-prenasene-klistaty-je-letos-na-jare-nejvic-od-roku-2014-276378",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "url-004",
		category: "Tweets with URLs",
		description: "Short tweet with question and external URL",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Elektrolyty jako nové proteiny. Proč je musí doplňovat nejen běžci a v jakých 10 běžných potravinách je najít? https://t.co/J86IKCVHDp</p>&mdash; Hospodářské noviny (@hospodarky) <a href="https://twitter.com/hospodarky/status/1921260697943777728">May 10, 2025</a></blockquote>',
			Text: "Elektrolyty jako nové proteiny. Proč je musí doplňovat nejen běžci a v jakých 10 běžných potravinách je najít? https://t.co/J86IKCVHDp",
			LinkToTweet: "https://twitter.com/hospodarky/status/1921260697943777728",
			FirstLinkUrl: "https://domaci.hn.cz/c1-67732930-elektrolyty-jako-nove-proteiny-proc-je-musi-doplnovat-nejen-bezci-a-v-jakych-10-beznych-potravinach-je-najit",
			UserName: "hospodarky"
		},
		expected: {
			output: "status=Elektrolyty jako nové proteiny. Proč je musí doplňovat nejen běžci a v jakých 10 běžných potravinách je najít?\nhttps://domaci.hn.cz/c1-67732930-elektrolyty-jako-nove-proteiny-proc-je-musi-doplnovat-nejen-bezci-a-v-jakych-10-beznych-potravinach-je-najit",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "url-005",
		category: "Tweets with URLs",
		description: "Multiple t.co URLs in one tweet (both should be removed)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">🔵 @PetrHonzejk: Politické záhrobí se otevřelo. S Motoristy se v nejvyšší politice opět zjevuje duch Václava Klause https://t.co/aeiLXzZk5R https://t.co/tF8EOKbMap</p>&mdash; Hospodářské noviny (@hospodarky) <a href="https://twitter.com/hospodarky/status/1974838004133847498">Oct 5, 2025</a></blockquote>',
			Text: "🔵 @PetrHonzejk: Politické záhrobí se otevřelo. S Motoristy se v nejvyšší politice opět zjevuje duch Václava Klause https://t.co/aeiLXzZk5R https://t.co/tF8EOKbMap",
			LinkToTweet: "https://twitter.com/hospodarky/status/1974838004133847498",
			FirstLinkUrl: "https://archiv.hn.cz/c1-67796800-politicke-zahrobi-se-otevrelo-s-motoristy-se-v-nejvyssi-politice-opet-zjevuje-duch-vaclava-klause",
			UserName: "hospodarky"
		},
		expected: {
			output: "status=🔵 @PetrHonzejk@twitter.com: Politické záhrobí se otevřelo. S Motoristy se v nejvyšší politice opět zjevuje duch Václava Klause\nhttps://archiv.hn.cz/c1-67796800-politicke-zahrobi-se-otevrelo-s-motoristy-se-v-nejvyssi-politice-opet-zjevuje-duch-vaclava-klause",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	// =========================================================================
	// CATEGORY 3: Tweets with Media (3 tests)
	// =========================================================================

	{
		id: "media-001",
		category: "Tweets with Media",
		description: "Tweet with photo attachment",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">To je partička proruskejch kolaborantů, Drulák, Vidlák a Rédová, hvězdy dezinformační a proruské scény. 👎 https://t.co/OtfGF0ftfk</p>&mdash; Kožený Jiří 🇨🇿🇪🇺 (@1250cc03004c44e) <a href="https://twitter.com/1250cc03004c44e/status/1921480181908197750">May 11, 2025</a></blockquote>',
			Text: "To je partička proruskejch kolaborantů, Drulák, Vidlák a Rédová, hvězdy dezinformační a proruské scény. 👎 https://t.co/OtfGF0ftfk",
			LinkToTweet: "https://twitter.com/1250cc03004c44e/status/1921480181908197750",
			FirstLinkUrl: "https://x.com/1250cc03004c44e/status/1921480181908197750/photo/1",
			UserName: "1250cc03004c44e"
		},
		expected: {
			output: "status=To je partička proruskejch kolaborantů, Drulák, Vidlák a Rédová, hvězdy dezinformační a proruské scény. 👎\nhttps://twitter.com/1250cc03004c44e/status/1921480181908197750",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "media-002",
		category: "Tweets with Media",
		description: "Tweet with photo attachment (another user)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Nejprve si raději prosviští slovíčka. Kolaborace - spolupráce s nepřítelem proti vlastní zemi. https://t.co/7FnJ6apLob</p>&mdash; Poslední skaut™ (@Posledniskaut) <a href="https://twitter.com/Posledniskaut/status/1921474159961317463">May 11, 2025</a></blockquote>',
			Text: "Nejprve si raději prosviští slovíčka. Kolaborace - spolupráce s nepřítelem proti vlastní zemi. https://t.co/7FnJ6apLob",
			LinkToTweet: "https://twitter.com/Posledniskaut/status/1921474159961317463",
			FirstLinkUrl: "https://x.com/Posledniskaut/status/1921474159961317463/photo/1",
			UserName: "Posledniskaut"
		},
		expected: {
			output: "status=Nejprve si raději prosviští slovíčka. Kolaborace - spolupráce s nepřítelem proti vlastní zemi.\nhttps://twitter.com/Posledniskaut/status/1921474159961317463",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "media-003",
		category: "Tweets with Media",
		description: "Tweet with video attachment",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Isaac Newton: "Ustanovuji fyzikální zákony pohybu a všeobecné gravitace." kozy: "Heh! Říkals něco...? https://t.co/EnEl6tKIRQ</p>&mdash; Diwous (@diwous) <a href="https://twitter.com/diwous/status/1921437614051397764">May 11, 2025</a></blockquote>',
			Text: "Isaac Newton: \"Ustanovuji fyzikální zákony pohybu a všeobecné gravitace.\" kozy: \"Heh! Říkals něco...? https://t.co/EnEl6tKIRQ",
			LinkToTweet: "https://twitter.com/diwous/status/1921437614051397764",
			FirstLinkUrl: "https://x.com/diwous/status/1921437614051397764/video/1",
			UserName: "diwous"
		},
		expected: {
			output: "status=Isaac Newton: \"Ustanovuji fyzikální zákony pohybu a všeobecné gravitace.\" kozy: \"Heh! Říkals něco…?\nhttps://twitter.com/diwous/status/1921437614051397764",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	// =========================================================================
	// CATEGORY 4: Retweets (7 tests)
	// =========================================================================

	{
		id: "rt-001",
		category: "Retweets",
		description: "Basic retweet without URL",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @MarieBastlova: - Každý, kdo se zavodění trochu věnuje ví, že 15 nebo 16letý kluk, který váží o 30 kg míň, tak je daleko rychlejší a je…</p>&mdash; Seznam Zprávy (@SeznamZpravy) <a href="https://twitter.com/SeznamZpravy/status/1925157790714134866">May 21, 2025</a></blockquote>',
			Text: "RT @MarieBastlova: - Každý, kdo se zavodění trochu věnuje ví, že 15 nebo 16letý kluk, který váží o 30 kg míň, tak je daleko rychlejší a je…",
			LinkToTweet: "https://twitter.com/SeznamZpravy/status/1925157790714134866",
			FirstLinkUrl: "(none)",
			UserName: "SeznamZpravy"
		},
		expected: {
			output: "status=Seznam Zprávy 𝕏📤 @MarieBastlova@twitter.com:\n- Každý, kdo se zavodění trochu věnuje ví, že 15 nebo 16letý kluk, který váží o 30 kg míň, tak je daleko rychlejší a je…\nhttps://twitter.com/SeznamZpravy/status/1925157790714134866",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "rt-002",
		category: "Retweets",
		description: "Retweet with ellipsis at end",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @natoaktual: Unikátní příležitost pro studenty a čerstvé absolventy vysokých škol.</p>&mdash; Michael Romancov (@MichaelRomancov) <a href="https://twitter.com/MichaelRomancov/status/1925100991432544719">May 21, 2025</a></blockquote>',
			Text: "RT @natoaktual: Unikátní příležitost pro studenty a čerstvé absolventy vysokých škol.",
			LinkToTweet: "https://twitter.com/MichaelRomancov/status/1925100991432544719",
			FirstLinkUrl: "(none)",
			UserName: "MichaelRomancov"
		},
		expected: {
			output: "status=Michael Romancov 𝕏📤 @natoaktual@twitter.com:\nUnikátní příležitost pro studenty a čerstvé absolventy vysokých škol.\nhttps://twitter.com/MichaelRomancov/status/1925100991432544719",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "rt-003",
		category: "Retweets",
		description: "Retweet with truncated content",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @jbetlach: Když i BBC (!) musí faktčekovat informace od OSN: Zástupce OSN pro humanitární záležitosti Tom Fletcher, zcela jistě neúmysl…</p>&mdash; Jakub Szántó (@JakubSzanto) <a href="https://twitter.com/JakubSzanto/status/1925092026103574686">May 21, 2025</a></blockquote>',
			Text: "RT @jbetlach: Když i BBC (!) musí faktčekovat informace od OSN: Zástupce OSN pro humanitární záležitosti Tom Fletcher, zcela jistě neúmysl…",
			LinkToTweet: "https://twitter.com/JakubSzanto/status/1925092026103574686",
			FirstLinkUrl: "(none)",
			UserName: "JakubSzanto"
		},
		expected: {
			output: "status=JakubSzanto 𝕏📤 @jbetlach@twitter.com:\nKdyž i BBC (!) musí faktčekovat informace od OSN: Zástupce OSN pro humanitární záležitosti Tom Fletcher, zcela jistě neúmysl…\nhttps://twitter.com/JakubSzanto/status/1925092026103574686",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "rt-004",
		category: "Retweets",
		description: "Retweet with external URL",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @PetrZenkner: Čína chce vytlačit #Gripen z už vyhraného tendru. Nabízí stíhačku, která je hitem sociálních sítí https://t.co/n14zUxw4UF…</p>&mdash; Hospodářské noviny (@hospodarky) <a href="https://twitter.com/hospodarky/status/1925092327237812486">May 21, 2025</a></blockquote>',
			Text: "RT @PetrZenkner: Čína chce vytlačit #Gripen z už vyhraného tendru. Nabízí stíhačku, která je hitem sociálních sítí https://t.co/n14zUxw4UF…",
			LinkToTweet: "https://twitter.com/hospodarky/status/1925092327237812486",
			FirstLinkUrl: "https://archiv.hn.cz/c1-67737940-cina-chce-vytlacit-svedsky-gripen-z-uz-vyhraneho-tendru-v-kolumbii-nabizi-stihacku-ktera-je-hitem-socialnich-siti",
			UserName: "hospodarky"
		},
		expected: {
			output: "status=Hospodářské noviny 𝕏📤 @PetrZenkner@twitter.com:\nČína chce vytlačit #Gripen z už vyhraného tendru. Nabízí stíhačku, která je hitem sociálních sítí\nhttps://archiv.hn.cz/c1-67737940-cina-chce-vytlacit-svedsky-gripen-z-uz-vyhraneho-tendru-v-kolumbii-nabizi-stihacku-ktera-je-hitem-socialnich-siti",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "rt-005",
		category: "Retweets",
		description: "Retweet with truncated content (no URL)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @Dobrovsky_Sidlo: Moc díky všem, kdo včera přišli na Panelku Luleč. Skvělý místo, skvělý publikum a taky skvělá kuchyně, mimochodem. htt…</p>&mdash; Jindřích Šídlo - NEW (@JindrichSidlo2) <a href="https://twitter.com/JindrichSidlo2/status/1925061161457729747">May 21, 2025</a></blockquote>',
			Text: "RT @Dobrovsky_Sidlo: Moc díky všem, kdo včera přišli na Panelku Luleč. Skvělý místo, skvělý publikum a taky skvělá kuchyně, mimochodem. htt…",
			LinkToTweet: "https://twitter.com/JindrichSidlo2/status/1925061161457729747",
			FirstLinkUrl: "(none)",
			UserName: "JindrichSidlo2"
		},
		expected: {
			output: "status=Jindřích Šídlo - NEW 𝕏📤 @Dobrovsky_Sidlo@twitter.com:\nMoc díky všem, kdo včera přišli na Panelku Luleč. Skvělý místo, skvělý publikum a taky skvělá kuchyně, mimochodem. htt…\nhttps://twitter.com/JindrichSidlo2/status/1925061161457729747",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "rt-self-001",
		category: "Self-Retweets",
		description: "Self-retweet (author retweets their own content)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @DanielSnor: Připomínám svůj starší článek, který je stále aktuální. Důležité čtení! 📰 https://t.co/example123</p>&mdash; Daniel Šnor (@DanielSnor) <a href="https://twitter.com/DanielSnor/status/1975550000000000000">Oct 7, 2025</a></blockquote>',
			Text: "RT @DanielSnor: Připomínám svůj starší článek, který je stále aktuální. Důležité čtení! 📰 https://t.co/example123",
			LinkToTweet: "https://twitter.com/DanielSnor/status/1975550000000000000",
			FirstLinkUrl: "(none)",
			UserName: "DanielSnor"
		},
		expected: {
			output: "status=Daniel Šnor 𝕏📤 vlastní post:\nPřipomínám svůj starší článek, který je stále aktuální. Důležité čtení! 📰\nhttps://twitter.com/DanielSnor/status/1975550000000000000",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "rt-self-002",
		category: "Self-Retweets",
		description: "Self-retweet with URL",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @andrewofpolesia: Čeká nás plíživá eroze naší bezpečnosti a suverenity pod taktovkou Andreje Babiše a jeho spojenců? V novém článku jse…</p>&mdash; Andrej Fiskovec (@andrewofpolesia) <a href="https://twitter.com/andrewofpolesia/status/1974891494923477454">Oct 5, 2025</a></blockquote>',
			Text: "RT @andrewofpolesia: Čeká nás plíživá eroze naší bezpečnosti a suverenity pod taktovkou Andreje Babiše a jeho spojenců? V novém článku jse…",
			LinkToTweet: "https://twitter.com/andrewofpolesia/status/1974891494923477454",
			FirstLinkUrl: "(none)",
			UserName: "andrewofpolesia"
		},
		expected: {
			output: "status=Andrej Fiskovec 𝕏📤 vlastní post:\nČeká nás plíživá eroze naší bezpečnosti a suverenity pod taktovkou Andreje Babiše a jeho spojenců? V novém článku jse…\nhttps://twitter.com/andrewofpolesia/status/1974891494923477454",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	// =========================================================================
	// CATEGORY 5: Quote Tweets (4 tests)
	// =========================================================================

	{
		id: "quote-001",
		category: "Quote Tweets",
		description: "Quote tweet with commentary",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">🇵🇱 Přesně, jak se snažím popisovat celou dobu. V polské prezidentské volbě nelze jen sčítat hlasy pro konzervativce. Voliči krajně pravicového Mentzena jsou z části antisystémoví a vůči dvěma postoupivším kandidátům hlavního proudu - Trzaskowskému s Nawrockým - jsou skeptičtí. To https://t.co/cBpKXT9llf</p>&mdash; Andreas Papadopulos (@andreas_ppdp) <a href="https://twitter.com/andreas_ppdp/status/1924751829184782592">May 20, 2025</a></blockquote>',
			Text: "🇵🇱 Přesně, jak se snažím popisovat celou dobu. V polské prezidentské volbě nelze jen sčítat hlasy pro konzervativce. Voliči krajně pravicového Mentzena jsou z části antisystémoví a vůči dvěma postoupivším kandidátům hlavního proudu - Trzaskowskému s Nawrockým - jsou skeptičtí. To https://t.co/cBpKXT9llf",
			LinkToTweet: "https://twitter.com/andreas_ppdp/status/1924751829184782592",
			FirstLinkUrl: "https://twitter.com/SlawomirMentzen/status/1924739995296006373",
			UserName: "andreas_ppdp"
		},
		expected: {
			output: "status=Andreas Papadopulos 𝕏📝💬 @SlawomirMentzen:\n🇵🇱 Přesně, jak se snažím popisovat celou dobu. V polské prezidentské volbě nelze jen sčítat hlasy pro konzervativce. Voliči krajně pravicového Mentzena jsou z části antisystémoví a vůči dvěma postoupivším kandidátům hlavního proudu - Trzaskowskému s Nawrockým - jsou skeptičtí.\nhttps://twitter.com/andreas_ppdp/status/1924751829184782592",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "quote-002",
		category: "Quote Tweets",
		description: "Quote tweet with news commentary",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">🇵🇱⚠️Polský premiér oznámil, že loď ruské stínové flotily manévrovala poblíž elektrického kabelu spojujícího Polsko se Švédskem. Polská armáda zasáhla, loď odplula do ruského přístavu. https://t.co/nhcow9MSTs</p>&mdash; Andreas Papadopulos (@andreas_ppdp) <a href="https://twitter.com/andreas_ppdp/status/1925144646134509817">May 21, 2025</a></blockquote>',
			Text: "🇵🇱⚠️Polský premiér oznámil, že loď ruské stínové flotily manévrovala poblíž elektrického kabelu spojujícího Polsko se Švédskem. Polská armáda zasáhla, loď odplula do ruského přístavu. https://t.co/nhcow9MSTs",
			LinkToTweet: "https://twitter.com/andreas_ppdp/status/1925144646134509817",
			FirstLinkUrl: "https://twitter.com/donaldtusk/status/1925136870658175112",
			UserName: "andreas_ppdp"
		},
		expected: {
			output: "status=Andreas Papadopulos 𝕏📝💬 @donaldtusk:\n🇵🇱⚠️Polský premiér oznámil, že loď ruské stínové flotily manévrovala poblíž elektrického kabelu spojujícího Polsko se Švédskem. Polská armáda zasáhla, loď odplula do ruského přístavu.\nhttps://twitter.com/andreas_ppdp/status/1925144646134509817",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "quote-003",
		category: "Quote Tweets",
		description: "Quote tweet with @mention in commentary",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Z talentovaného a nadějného Voxpotu se stala aktivistická skupina. Škoda, že to @Svratkin neukořířil. Vést seriózní novinářskou organizaci je extrémně náročné a ne každý na to má. https://t.co/cfZejoGtXo</p>&mdash; Tomas Etzler (@tvtomas) <a href="https://twitter.com/tvtomas/status/1924873504614142028">May 20, 2025</a></blockquote>',
			Text: "Z talentovaného a nadějného Voxpotu se stala aktivistická skupina. Škoda, že to @Svratkin neukořířil. Vést seriózní novinářskou organizaci je extrémně náročné a ne každý na to má. https://t.co/cfZejoGtXo",
			LinkToTweet: "https://twitter.com/tvtomas/status/1924873504614142028",
			FirstLinkUrl: "https://twitter.com/eceplova/status/1924842297503477996",
			UserName: "tvtomas"
		},
		expected: {
			output: "status=Tomas Etzler 𝕏📝💬 @eceplova:\nZ talentovaného a nadějného Voxpotu se stala aktivistická skupina. Škoda, že to @Svratkin@twitter.com neukořířil. Vést seriózní novinářskou organizaci je extrémně náročné a ne každý na to má.\nhttps://twitter.com/tvtomas/status/1924873504614142028",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "quote-self-001",
		category: "Quote Tweets",
		description: "Self-quote tweet (author quotes their own previous tweet)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tohle je můj nový názor na věc, která mě trápila už dřív... 🤔</p>&mdash; Daniel Šnor (@DanielSnor) <a href="https://twitter.com/DanielSnor/status/1975500000000000000">Oct 7, 2025</a></blockquote>',
			Text: "Tohle je můj nový názor na věc, která mě trápila už dřív... 🤔 https://t.co/abc123xyz",
			LinkToTweet: "https://twitter.com/DanielSnor/status/1975500000000000000",
			FirstLinkUrl: "https://twitter.com/DanielSnor/status/1492630028445700100",
			UserName: "DanielSnor"
		},
		expected: {
			output: "status=Daniel Šnor 𝕏📝💬 vlastní post:\nTohle je můj nový názor na věc, která mě trápila už dřív… 🤔\nhttps://twitter.com/DanielSnor/status/1975500000000000000",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	// =========================================================================
	// CATEGORY 6: Replies (1 test)
	// =========================================================================

	{
		id: "reply-001",
		category: "Replies",
		description: "Reply starting with @mention (should be skipped)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">@DanielSnor Odpověď na tweet.</p>&mdash; Zprávobot.News (@zpravobotnews) <a href="https://twitter.com/zpravobotnews/status/1925199078977049059">May 21, 2025</a></blockquote>',
			Text: "@DanielSnor Odpověď na tweet.",
			LinkToTweet: "https://twitter.com/zpravobotnews/status/1925199078977049059",
			FirstLinkUrl: "(none)",
			UserName: "zpravobotnews"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Reply post (starts with @username)"
		},
		settings: TWITTER_SETTINGS
	},

	// =========================================================================
	// CATEGORY 7: Long Tweets (5 tests)
	// =========================================================================

	{
		id: "long-001",
		category: "Long Tweets",
		description: "Long tweet requiring truncation (smart strategy)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">NEJLEPŠÍ ROZHOVOR S TRUMPEM Podle Zelenského byl rozhovor s Trumpem ve Vatikanu nejlepší, jaký měl, byť byl krátký. Podle něj jednali o podpisu dohody o nerostech, o sankcích proti Rusku a dodávkách PVO, které budou vkladem Spojených států do společného fondu. Trump řekl, že</p>&mdash; Andrej Polešuk (@andrewofpolesia) <a href="https://twitter.com/andrewofpolesia/status/1918592118857077196">May 3, 2025</a></blockquote>',
			Text: "NEJLEPŠÍ ROZHOVOR S TRUMPEM Podle Zelenského byl rozhovor s Trumpem ve Vatikanu nejlepší, jaký měl, byť byl krátký. Podle něj jednali o podpisu dohody o nerostech, o sankcích proti Rusku a dodávkách PVO, které budou vkladem Spojených států do společného fondu. Trump řekl, že",
			LinkToTweet: "https://twitter.com/andrewofpolesia/status/1918592118857077196",
			FirstLinkUrl: "(none)",
			UserName: "andrewofpolesia"
		},
		expected: {
			output: "status=NEJLEPŠÍ ROZHOVOR S TRUMPEM Podle Zelenského byl rozhovor s Trumpem ve Vatikanu nejlepší, jaký měl, byť byl krátký. Podle něj jednali o podpisu dohody o nerostech, o sankcích proti Rusku a dodávkách PVO, které budou vkladem Spojených států do společného fondu. Trump řekl, že…\nhttps://twitter.com/andrewofpolesia/status/1918592118857077196",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "long-002",
		category: "Long Tweets",
		description: "Long tweet with photo attachment requiring truncation",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Podívejte se, jak se komunistka, nebo spíše nacionální bolševička Konečná usmívá. To je nádhera, co? Takoví chlapáci vedle ní stojí. Chlapáci s kolovratem. Chlapáci, kteří v kontextu války na Ukrajiny nemůžou odkazovat na nic jiného než nácky z Rusíče. U Romana je dobře https://t.co/Ise5787RSw https://t.co/KdeqijtJKW</p>&mdash; Andrej Polešuk (@andrewofpolesia) <a href="https://twitter.com/andrewofpolesia/status/1918540991507595465">May 3, 2025</a></blockquote>',
			Text: "Podívejte se, jak se komunistka, nebo spíše nacionální bolševička Konečná usmívá. To je nádhera, co? Takoví chlapáci vedle ní stojí. Chlapáci s kolovratem. Chlapáci, kteří v kontextu války na Ukrajiny nemůžou odkazovat na nic jiného než nácky z Rusíče. U Romana je dobře https://t.co/Ise5787RSw https://t.co/KdeqijtJKW",
			LinkToTweet: "https://twitter.com/andrewofpolesia/status/1918540991507595465",
			FirstLinkUrl: "https://x.com/andrewofpolesia/status/1918540991507595465/photo/1",
			UserName: "andrewofpolesia"
		},
		expected: {
			output: "status=Podívejte se, jak se komunistka, nebo spíše nacionální bolševička Konečná usmívá. To je nádhera, co? Takoví chlapáci vedle ní stojí. Chlapáci s kolovratem. Chlapáci, kteří v kontextu války na Ukrajiny nemůžou odkazovat na nic jiného než nácky z Rusíče. U Romana je dobře…\nhttps://twitter.com/andrewofpolesia/status/1918540991507595465",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "long-003",
		category: "Long Tweets",
		description: "Military statistics list (truncation at natural boundary)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Ruské ztráty: - 955470 vojáků (+1170) - 10745 tanků (+4) - 22369 obrněnců (+0) - 27234 kusů dělostřelectva (+48) - 1375 kusů raketometů (+0) - 1153 kusů PVO (+1) - 370 letadel (+0) - 335 vrtulníků (+0) - 34665 dronů (+126) - 3197 raket s plochou dráhou letu (+1) - 28 lodí (+0) -</p>&mdash; Andrej Polešuk (@andrewofpolesia) <a href="https://twitter.com/andrewofpolesia/status/1918532896949743932">May 3, 2025</a></blockquote>',
			Text: "Ruské ztráty: - 955470 vojáků (+1170) - 10745 tanků (+4) - 22369 obrněnců (+0) - 27234 kusů dělostřelectva (+48) - 1375 kusů raketometů (+0) - 1153 kusů PVO (+1) - 370 letadel (+0) - 335 vrtulníků (+0) - 34665 dronů (+126) - 3197 raket s plochou dráhou letu (+1) - 28 lodí (+0) -",
			LinkToTweet: "https://twitter.com/andrewofpolesia/status/1918532896949743932",
			FirstLinkUrl: "(none)",
			UserName: "andrewofpolesia"
		},
		expected: {
			output: "status=Ruské ztráty: - 955470 vojáků (+1170) - 10745 tanků (+4) - 22369 obrněnců (+0) - 27234 kusů dělostřelectva (+48) - 1375 kusů raketometů (+0) - 1153 kusů PVO (+1) - 370 letadel (+0) - 335 vrtulníků (+0) - 34665 dronů (+126) - 3197 raket s plochou dráhou letu (+1) - 28 lodí (+0) -…\nhttps://twitter.com/andrewofpolesia/status/1918532896949743932",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "long-004",
		category: "Long Tweets",
		description: "Long political commentary (smart trim strategy)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Další "úspěch" ministryně Šimkovičové. Prakticky všechna významná slovenská vydavatelství bojkotovala soutěž Nejkrásnější kniha Slovenska pořádanou mezinárodním domem umění pro děti Bibiana. Oceněné knihy byly jen od Slovartu a Ikaru, ovšem po vyhlášení výsledků vyšlo najevo, že</p>&mdash; Poslední skaut™ (@Posledniskaut) <a href="https://twitter.com/Posledniskaut/status/1918411090108842063">May 2, 2025</a></blockquote>',
			Text: "Další \"úspěch\" ministryně Šimkovičové. Prakticky všechna významná slovenská vydavatelství bojkotovala soutěž Nejkrásnější kniha Slovenska pořádanou mezinárodním domem umění pro děti Bibiana. Oceněné knihy byly jen od Slovartu a Ikaru, ovšem po vyhlášení výsledků vyšlo najevo, že",
			LinkToTweet: "https://twitter.com/Posledniskaut/status/1918411090108842063",
			FirstLinkUrl: "(none)",
			UserName: "Posledniskaut"
		},
		expected: {
			output: "status=Další \"úspěch\" ministryně Šimkovičové. Prakticky všechna významná slovenská vydavatelství bojkotovala soutěž Nejkrásnější kniha Slovenska pořádanou mezinárodním domem umění pro děti Bibiana. Oceněné knihy byly jen od Slovartu a Ikaru, ovšem po vyhlášení výsledků vyšlo najevo, že…\nhttps://twitter.com/Posledniskaut/status/1918411090108842063",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "long-005",
		category: "Long Tweets",
		description: "Military aid announcement (truncation with ellipsis)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">VOJENSKÁ POMOC UKRAJINĚ🇺🇦 Americké ministerstvo zahraničí schválilo prodej balíku podpory Ukrajině v hodnotě 310 milionů dolarů. Balík je zaměřen na výcvik ukrajinských pilotů pro letouny F-16 a technickou udržitelnost samotných letounů. Balík zahrnuje následující vybavení a</p>&mdash; Andrej Polešuk (@andrewofpolesia) <a href="https://twitter.com/andrewofpolesia/status/1918403717302243502">May 2, 2025</a></blockquote>',
			Text: "VOJENSKÁ POMOC UKRAJINĚ🇺🇦 Americké ministerstvo zahraničí schválilo prodej balíku podpory Ukrajině v hodnotě 310 milionů dolarů. Balík je zaměřen na výcvik ukrajinských pilotů pro letouny F-16 a technickou udržitelnost samotných letounů. Balík zahrnuje následující vybavení a",
			LinkToTweet: "https://twitter.com/andrewofpolesia/status/1918403717302243502",
			FirstLinkUrl: "(none)",
			UserName: "andrewofpolesia"
		},
		expected: {
			output: "status=VOJENSKÁ POMOC UKRAJINĚ🇺🇦 Americké ministerstvo zahraničí schválilo prodej balíku podpory Ukrajině v hodnotě 310 milionů dolarů. Balík je zaměřen na výcvik ukrajinských pilotů pro letouny F-16 a technickou udržitelnost samotných letounů. Balík zahrnuje následující vybavení a…\nhttps://twitter.com/andrewofpolesia/status/1918403717302243502",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	// =========================================================================
	// CATEGORY 8: Bluesky Posts (6 tests)
	// =========================================================================

	{
		id: "bs-001",
		category: "Bluesky Posts",
		description: "Simple Bluesky post without URL",
		input: {
			TweetEmbedCode: "Toto je obyčejný Bluesky post bez jakéhokoliv odkazu nebo zmínky.",
			Text: "Toto je obyčejný Bluesky post bez jakéhokoliv odkazu nebo zmínky.",
			LinkToTweet: "https://bsky.app/profile/testuser.bsky.social/post/abc123",
			FirstLinkUrl: "(none)",
			UserName: "testuser.bsky.social - Test User"
		},
		expected: {
			output: "status=Toto je obyčejný Bluesky post bez jakéhokoliv odkazu nebo zmínky.\nhttps://bsky.app/profile/testuser.bsky.social/post/abc123",
			shouldSkip: false
		},
		settings: BLUESKY_SETTINGS
	},

	{
		id: "bs-002",
		category: "Bluesky Posts",
		description: "Bluesky post with URL at the end",
		input: {
			TweetEmbedCode: "Zajímavý článek o nových technologiích v oblasti AI a strojového učení. https://example.com/article",
			Text: "Zajímavý článek o nových technologiích v oblasti AI a strojového učení. https://example.com/article",
			LinkToTweet: "https://bsky.app/profile/testuser.bsky.social/post/abc124",
			FirstLinkUrl: "https://example.com/article",
			UserName: "testuser.bsky.social - Test User"
		},
		expected: {
			output: "status=Zajímavý článek o nových technologiích v oblasti AI a strojového učení. https://example.com/article\nhttps://bsky.app/profile/testuser.bsky.social/post/abc124",
			shouldSkip: false
		},
		settings: BLUESKY_SETTINGS
	},

	{
		id: "bs-003",
		category: "Bluesky Posts",
		description: "Bluesky post with URL at the beginning",
		input: {
			TweetEmbedCode: "https://example.com/breaking-news Důležitá zpráva: Nové objevy v oblasti kvantové fyziky mění náš pohled na svět.",
			Text: "https://example.com/breaking-news Důležitá zpráva: Nové objevy v oblasti kvantové fyziky mění náš pohled na svět.",
			LinkToTweet: "https://bsky.app/profile/sciencenews.bsky.social/post/xyz789",
			FirstLinkUrl: "https://example.com/breaking-news",
			UserName: "sciencenews.bsky.social - Science News"
		},
		expected: {
			output: "status=Důležitá zpráva: Nové objevy v oblasti kvantové fyziky mění náš pohled na svět. https://example.com/breaking-news\nhttps://bsky.app/profile/sciencenews.bsky.social/post/xyz789",
			shouldSkip: false
		},
		settings: BLUESKY_SETTINGS
	},

	{
		id: "bs-004",
		category: "Bluesky Posts",
		description: "Bluesky quote post (with marker)",
		input: {
			TweetEmbedCode: "Úplně souhlasím s tímto názorem. Je důležité si uvědomit souvislosti. [contains quote post or other embedded content]",
			Text: "Úplně souhlasím s tímto názorem. Je důležité si uvědomit souvislosti. [contains quote post or other embedded content]",
			LinkToTweet: "https://bsky.app/profile/testuser.bsky.social/post/quote123",
			FirstLinkUrl: "(none)",
			UserName: "testuser.bsky.social - Test User"
		},
		expected: {
			output: "status=Test User 🦋📝💬 :\nÚplně souhlasím s tímto názorem. Je důležité si uvědomit souvislosti.\nhttps://bsky.app/profile/testuser.bsky.social/post/quote123",
			shouldSkip: false
		},
		settings: BLUESKY_SETTINGS
	},

	{
		id: "bs-005",
		category: "Bluesky Posts",
		description: "Image-only Bluesky post (no text content, only URL)",
		input: {
			TweetEmbedCode: "(none)",
			Text: "(none)",
			LinkToTweet: "https://bsky.app/profile/zdenkaoveczka.bsky.social/post/3m2ffoct6rc2k",
			FirstLinkUrl: "(none)",
			UserName: "@zdenkaoveczka.bsky.social - OVECZKA"
		},
		expected: {
			output: "status=\nhttps://bsky.app/profile/zdenkaoveczka.bsky.social/post/3m2ffoct6rc2k",
			shouldSkip: false
		},
		settings: BLUESKY_SETTINGS
	},

	{
		id: "bs-006",
		category: "Bluesky Posts",
		description: "Bluesky post with URL at beginning (moveUrlToEnd)",
		input: {
			TweetEmbedCode: "denikn.cz/1858679/ Těžké časy teď podle komentátora Seznam Zpráv Jindřicha Šídla čekají zejména Českou televizi a Český rozhlas. „Veřejnoprávní média, tak jak jsme je znali, v podstatě můžeme odepsat. Bude to jedna z obětí těchto voleb,"
			říká ve Studiu N.
			",
			Text: "(none)",
			LinkToTweet: "https://bsky.app/profile/denikn.cz/post/3m2ljfm7znz26",
			FirstLinkUrl: "(none)",
			UserName: "@denikn.cz - Deník N"
		},
		expected: {
			output: "status=Těžké časy teď podle komentátora Seznam Zpráv Jindřicha Šídla čekají zejména Českou televizi a Český rozhlas. „Veřejnoprávní média, tak jak jsme je znali, v podstatě můžeme odepsat. Bude to jedna z obětí těchto voleb,"
			říká ve Studiu N.https: //denikn.cz/1858679/\nhttps://bsky.app/profile/denikn.cz/post/3m2ljfm7znz26",
				shouldSkip: false
		},
		settings: BLUESKY_SETTINGS
	},

	// =========================================================================
	// CATEGORY 9: RSS Feed Posts (4 tests)
	// =========================================================================

	{
		id: "rss-001",
		category: "RSS Feed Posts",
		description: "Simple RSS feed item with title and description",
		input: {
			TweetEmbedCode: "<p>Nový článek na našem blogu o nejlepších praktikách v programování. Přečtěte si kompletní guide pro začátečníky i pokročilé vývojáře.</p>",
			Text: "Nový článek: Nejlepší praktiky v programování",
			LinkToTweet: "https://example.com/blog/best-practices",
			FirstLinkUrl: "(none)",
			UserName: "TechBlog"
		},
		expected: {
			output: "status=Nový článek na našem blogu o nejlepších praktikách v programování. Přečtěte si kompletní guide pro začátečníky i pokročilé vývojáře.\nhttps://example.com/blog/best-practices",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},

	{
		id: "rss-002",
		category: "RSS Feed Posts",
		description: "RSS feed item with HTML entities and formatting",
		input: {
			TweetEmbedCode: "<p>Dnes vydáváme novou verzi našeho produktu &ndash; obsahuje spoustu vylepšení &amp; oprav chyb. <br/>Více informací na našem webu!</p>",
			Text: "Nová verze produktu je tady",
			LinkToTweet: "https://example.com/releases/v2.0",
			FirstLinkUrl: "https://example.com/releases/v2.0",
			UserName: "ProductUpdates"
		},
		expected: {
			output: "status=Dnes vydáváme novou verzi našeho produktu - obsahuje spoustu vylepšení ⅋ oprav chyb.\nVíce informací na našem webu!\nhttps://example.com/releases/v2.0",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},

	{
		id: "rss-003",
		category: "RSS Feed Posts",
		description: "RSS feed item using title as content",
		input: {
			TweetEmbedCode: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>",
			Text: "Průlomový objev v medicíně: Nová léčba rakoviny vykazuje slibné výsledky",
			LinkToTweet: "https://sciencenews.com/article/12345",
			FirstLinkUrl: "(none)",
			UserName: "ScienceNews"
		},
		expected: {
			output: "status=Průlomový objev v medicíně: Nová léčba rakoviny vykazuje slibné výsledky\nhttps://sciencenews.com/article/12345",
			shouldSkip: false
		},
		settings: {
			...RSS_SETTINGS,
			SHOW_TITLE_AS_CONTENT: true
		}
	},

	{
		id: "rss-004",
		category: "RSS Feed Posts",
		description: "RSS feed with HTML tags in content (should strip all HTML)",
		input: {
			TweetEmbedCode: '<figure class="wp-block-image size-large"><img src="https://www.titaspictures.com/image-2197_w600.jpg" alt=""/></figure> <p><strong>Interiér holubníku hradu Kerjean v departementu Finistère &#8211; až na nejzazším konci Bretaně. Renesanční hrad pochází z konce 16. století (holubník je z roku 1599), kdy celý region prosperoval díky pěstování obilí, lnu a výrobě sukna. </strong></p> <p>Ony holubníky byly mohutné kamenné stavby tyčící se do výšky několika pater, které ve svých četných malých hnízdních výklencích dokázaly pojmout několik tisíc opeřenců. Ony &#8220;holubí díry&#8221; se nazývaly &#8220;boulins&#8221; a do každé se vešel přesně jeden pár holubů (zde se konkrétně vešlo 984 párů). Cílem těchto mohutných struktur byl nejenom nepřetržitý přísun masa a vajec, ale holubník také zajišťoval hnojivo, které bylo vyhledávané majiteli vinic i sadů. Využívalo se rovněž peří těchto ptáků, o kterém se věřilo, že spaní na matraci naplněné holubím peřím povede k dlouhému životu. Šlo tak o velmi cennou komoditu. Nejde se tak divit, že právě holubům stavěli jejich majitelé takto pozoruhodné &#8220;hrady&#8221;.</p>',
			Text: "Kerjeanský holubník",
			LinkToTweet: "https://www.kabinetkuriozit.eu/kerjeansky-holubnik/",
			FirstLinkUrl: "(none)",
			UserName: "Kabinet Kuriozit"
		},
		expected: {
			output: "status=Interiér holubníku hradu Kerjean v departementu Finistère - až na nejzazším konci Bretaně. Renesanční hrad pochází z konce 16. století (holubník je z roku 1599), kdy celý region prosperoval díky pěstování obilí, lnu a výrobě sukna. Ony holubníky byly mohutné kamenné stavby tyčící se do výšky několika pater, které ve svých četných malých hnízdních výklencích dokázaly pojmout několik tisíc opeřenců.\nhttps://www.kabinetkuriozit.eu/kerjeansky-holubnik/",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},

	// =========================================================================
	// CATEGORY 10: YouTube Posts (2 tests)
	// =========================================================================

	{
		id: "yt-001",
		category: "YouTube Posts",
		description: "YouTube video post with description",
		input: {
			TweetEmbedCode: "V tomto videu se podíváme na nejnovější trendy ve vývoji webových aplikací. Naučíte se pracovat s moderními frameworky a nástroji.",
			Text: "Trendy ve vývoji webových aplikací 2025",
			LinkToTweet: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			FirstLinkUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			UserName: "TechTutorials"
		},
		expected: {
			output: "status=V tomto videu se podíváme na nejnovější trendy ve vývoji webových aplikací. Naučíte se pracovat s moderními frameworky a nástroji.\nYT 📺👇👇👇\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ",
			shouldSkip: false
		},
		settings: YOUTUBE_SETTINGS
	},

	{
		id: "yt-002",
		category: "YouTube Posts",
		description: "YouTube short video post",
		input: {
			TweetEmbedCode: "Rychlý tip: Jak zefektivnit váš workflow v 60 sekundách! 🚀",
			Text: "Quick Tip: Workflow Optimization",
			LinkToTweet: "https://www.youtube.com/shorts/AbC123XyZ",
			FirstLinkUrl: "https://www.youtube.com/shorts/AbC123XyZ",
			UserName: "ProductivityHacks"
		},
		expected: {
			output: "status=Rychlý tip: Jak zefektivnit váš workflow v 60 sekundách! 🚀\nYT 📺👇👇👇\nhttps://www.youtube.com/shorts/AbC123XyZ",
			shouldSkip: false
		},
		settings: YOUTUBE_SETTINGS
	},

	// =========================================================================
	// CATEGORY 11: Content Filters (4 tests)
	// =========================================================================

	{
		id: "filter-001",
		category: "Content Filters",
		description: "Post without required keyword should be skipped",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Nedělní ráno je citelně teplejší, než byla ta předcházející. Zatímco v noci na sobotu ještě teploty klesly na většině území pod nulu a ranní minima se pohybovala v rozmezí +1 až -3 °C, v noci na neděli už teploty většinou neklesaly pod 5 °C. Dnešní ranní minima se pohybují https://t.co/d5ltlBBs41</p>&mdash; Český hydrometeorologický ústav (ČHMÚ) (@CHMUCHMI) <a href="https://twitter.com/CHMUCHMI/status/1974696452094820537">Oct 5, 2025</a></blockquote>',
			Text: "Nedělní ráno je citelně teplejší, než byla ta předcházející. Zatímco v noci na sobotu ještě teploty klesly na většině území pod nulu a ranní minima se pohybovala v rozmezí +1 až -3 °C, v noci na neděli už teploty většinou neklesaly pod 5 °C. Dnešní ranní minima se pohybují https://t.co/d5ltlBBs41",
			LinkToTweet: "https://twitter.com/CHMUCHMI/status/1974696452094820537",
			FirstLinkUrl: "https://x.com/CHMUCHMI/status/1974696452094820537/photo/1",
			UserName: "CHMUCHMI"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Missing mandatory keywords"
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: ["výstra"]
		}
	},

	{
		id: "filter-002",
		category: "Content Filters",
		description: "Post with required keyword should pass through",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">⚠️ Vydána výstraha k silnému větru 👉 Platnost: od soboty 4. 10.2025 od hodin do neděle 5. 10.2025 do hodin. Ve Frýdlantském a Šluknovském výběžku začne výstraha platit v sobotu od 10:00 a skončí platnost ve 20:00, v oblasti Jeseníků a Beskyd bude platit od sobotních 15:00 až https://t.co/eJIUiF0jwT</p>&mdash; Český hydrometeorologický ústav (ČHMÚ) (@CHMUCHMI) <a href="https://twitter.com/CHMUCHMI/status/1974050603748757633">Oct 3, 2025</a></blockquote>',
			Text: "⚠️ Vydána výstraha k silnému větru 👉 Platnost: od soboty 4. 10.2025 od hodin do neděle 5. 10.2025 do hodin. Ve Frýdlantském a Šluknovském výběžku začne výstraha platit v sobotu od 10:00 a skončí platnost ve 20:00, v oblasti Jeseníků a Beskyd bude platit od sobotních 15:00 až https://t.co/eJIUiF0jwT",
			LinkToTweet: "https://twitter.com/CHMUCHMI/status/1974050603748757633",
			FirstLinkUrl: "https://x.com/CHMUCHMI/status/1974050603748757633/photo/1",
			UserName: "CHMUCHMI"
		},
		expected: {
			output: "status=⚠️ Vydána výstraha k silnému větru 👉 Platnost: od soboty 4. 10.2025 od hodin do neděle 5. 10.2025 do hodin. Ve Frýdlantském a Šluknovském výběžku začne výstraha platit v sobotu od 10:00 a skončí platnost ve 20:00, v oblasti Jeseníků a Beskyd bude platit od sobotních 15:00 až…\nhttps://twitter.com/CHMUCHMI/status/1974050603748757633",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: ["výstra"]
		}
	},

	{
		id: "filter-003",
		category: "Content Filters",
		description: "RSS post with banned commercial phrase should be skipped",
		input: {
			TweetEmbedCode: "Komerční sdělení: Jedinečná slevová akce oblíbeného obchodu (nejen) s elektronikou TSBOHEMIA.CZ je tu! Tento obchod totiž nyní spouští speciální akci, během které můžete nakoupit oblíbené produkty s výraznými slevami až 60 %. Ať už tedy uvažujete o nové elektronice, sháníte praktické pomocníky do domácnosti, sportovní vybavení nebo třeba nářadí, právě teď je ideální čas. V nabídce totiž najdete tisíce položek od známých značek, a to za ceny, které se jen tak nevidí. Výhodně […]",
			Text: "Slevové kupony sráží na TSBOHEMIA.CZ ceny spousty produktů až o 60 %!",
			LinkToTweet: "https://www.letemsvetemapplem.eu/2025/10/05/slevove-kupony-srazi-na-tsbohemia-cz-ceny-spousty-produktu-az-o-60/",
			FirstLinkUrl: "https://www.letemsvetemapplem.eu/wp-content/uploads/2025/10/TSB_dny_new25_HEAD_08e65e9567.jpeg",
			UserName: "Letem světem Applem"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Contains banned phrases"
		},
		settings: {
			...RSS_SETTINGS,
			PHRASES_BANNED: ["Komerční sdělení", "Tisková zpráva"]
		}
	},

	{
		id: "filter-004",
		category: "Content Filters",
		description: "RSS post without banned phrase should pass through",
		input: {
			TweetEmbedCode: "Vocasy na tripu Když upovídaný teriér ukáže naivnímu štěnětí, že jeho milovaný pánícek je ve skutečnosti mizera, vydají se společně na bláznivou cestu za pomstou.",
			Text: "Zajímavé novinky na HBO Max pro tento týden",
			LinkToTweet: "https://www.letemsvetemapplem.eu/2025/10/05/zajimave-novinky-na-max-pro-tento-tyden-20/",
			FirstLinkUrl: "https://www.letemsvetemapplem.eu/wp-content/uploads/2024/05/MAX.png",
			UserName: "Letem světem Applem"
		},
		expected: {
			output: "status=Vocasy na tripu Když upovídaný teriér ukáže naivnímu štěnětí, že jeho milovaný pánícek je ve skutečnosti mizera, vydají se společně na bláznivou cestu za pomstou.\nhttps://www.letemsvetemapplem.eu/2025/10/05/zajimave-novinky-na-max-pro-tento-tyden-20/",
			shouldSkip: false
		},
		settings: {
			...RSS_SETTINGS,
			PHRASES_BANNED: ["Komerční sdělení", "Tisková zpráva"]
		}
	},

	// =========================================================================
	// CATEGORY 12: Empty and Edge Case Inputs (7 tests)
	// =========================================================================

	{
		id: "empty-001",
		category: "Edge Cases",
		description: "Empty TweetEmbedCode but valid Text (should use Text)",
		input: {
			TweetEmbedCode: "",
			Text: "Nějaký tweet text bez embed kódu",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "user"
		},
		expected: {
			output: "status=Nějaký tweet text bez embed kódu",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "empty-002",
		category: "Edge Cases",
		description: "Valid TweetEmbedCode but empty Text (should extract from embed)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text z embed kódu který je prioritní</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123456">Oct 5, 2025</a></blockquote>',
			Text: "",
			LinkToTweet: "https://twitter.com/testuser/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Text z embed kódu který je prioritní",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "empty-003",
		category: "Edge Cases",
		description: "Both TweetEmbedCode and Text empty (should skip)",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "user"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Empty content, title and URL"
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "empty-004",
		category: "Edge Cases",
		description: "Only whitespace in content (should skip)",
		input: {
			TweetEmbedCode: "   \n\t   ",
			Text: "   \n   \t   ",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "user"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Empty content, title and URL"
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "empty-005",
		category: "Edge Cases",
		description: "FirstLinkUrl empty string instead of (none)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s prázdným FirstLinkUrl</p>&mdash; User (@user) <a href="https://twitter.com/user/status/123456">Oct 5, 2025</a></blockquote>',
			Text: "Tweet s prázdným FirstLinkUrl",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "status=Tweet s prázdným FirstLinkUrl\nhttps://twitter.com/user/status/123456",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "empty-006",
		category: "Edge Cases",
		description: "Malformed HTML in TweetEmbedCode (should handle gracefully)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text s malformed HTML <strong>bold bez ukončení',
			Text: "Fallback text když HTML parsing selže",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "user"
		},
		expected: {
			output: "status=Text s malformed HTML bold bez ukončení",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "empty-007",
		category: "Edge Cases",
		description: "Missing <p> tag in TweetEmbedCode (should fallback to Text)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet">&mdash; User (@user) <a href="https://twitter.com/user/status/123456">Oct 5, 2025</a></blockquote>',
			Text: "Fallback when no <p> tag found",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "user"
		},
		expected: {
			output: "status=Fallback when no <p> tag found",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	// =========================================================================
	// HIGH PRIORITY NEW TESTS (15 tests)
	// =========================================================================
	// HP-1: Combined Filters (3 tests)
	// =========================================================================

	{
		id: "hp-filter-001",
		category: "Combined Filters",
		priority: "HIGH",
		description: "Post with banned phrase AND required keyword - banned should win",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Komerční sdělení: Důležitá výstraha pro všechny uživatele. Novinka v oblasti bezpečnosti.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123456">Oct 7, 2025</a></blockquote>',
			Text: "Komerční sdělení: Důležitá výstraha pro všechny uživatele. Novinka v oblasti bezpečnosti.",
			LinkToTweet: "https://twitter.com/testuser/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Contains banned phrases"
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_BANNED: ["Komerční sdělení"],
			PHRASES_REQUIRED: ["výstraha"]
		}
	},

	{
		id: "hp-filter-002",
		category: "Combined Filters",
		priority: "HIGH",
		description: "Reply with required keyword - reply detection should take precedence",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">@DanielSnor Souhlasím s tím, je to důležitá výstraha pro všechny.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123457">Oct 7, 2025</a></blockquote>',
			Text: "@DanielSnor Souhlasím s tím, je to důležitá výstraha pro všechny.",
			LinkToTweet: "https://twitter.com/testuser/status/123457",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Reply post (starts with @username)"
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: ["výstraha"]
		}
	},

	{
		id: "hp-filter-003",
		category: "Combined Filters",
		priority: "HIGH",
		description: "External repost with required keyword + REPOST_ALLOWED=false - repost rule wins",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @CHMUCHMI: Vydána výstraha k silnému větru. Platnost od soboty do neděle.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123458">Oct 7, 2025</a></blockquote>',
			Text: "RT @CHMUCHMI: Vydána výstraha k silnému větru. Platnost od soboty do neděle.",
			LinkToTweet: "https://twitter.com/testuser/status/123458",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "External repost not allowed"
		},
		settings: {
			...TWITTER_SETTINGS,
			REPOST_ALLOWED: false,
			PHRASES_REQUIRED: ["výstraha"]
		}
	},

	// =========================================================================
	// HP-2: FilterRule Advanced Logic (5 tests)
	// =========================================================================

	{
		id: "hp-filterrule-001",
		category: "FilterRule Advanced Logic",
		priority: "HIGH",
		description: "Regex pattern in PHRASES_BANNED - case insensitive word boundary match",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tohle je SPAM zpráva, kterou byste měli ignorovat.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123459">Oct 7, 2025</a></blockquote>',
			Text: "Tohle je SPAM zpráva, kterou byste měli ignorovat.",
			LinkToTweet: "https://twitter.com/testuser/status/123459",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Contains banned phrases"
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_BANNED: [
				{ type: "regex", pattern: "\\bspam\\b", flags: "i" }
			]
		}
	},

	{
		id: "hp-filterrule-002",
		category: "FilterRule Advanced Logic",
		priority: "HIGH",
		description: "Regex pattern in PHRASES_REQUIRED - must start with 'Breaking:'",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Breaking: Důležitá zpráva z oblasti technologií.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123460">Oct 7, 2025</a></blockquote>',
			Text: "Breaking: Důležitá zpráva z oblasti technologií.",
			LinkToTweet: "https://twitter.com/testuser/status/123460",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Breaking: Důležitá zpráva z oblasti technologií.",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [
				{ type: "regex", pattern: "^Breaking:", flags: "" }
			]
		}
	},

	{
		id: "hp-filterrule-003",
		category: "FilterRule Advanced Logic",
		priority: "HIGH",
		description: "AND logic - all keywords must be present (tech AND AI)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Nové trendy v oblasti technologií a umělé inteligence (AI).</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123461">Oct 7, 2025</a></blockquote>',
			Text: "Nové trendy v oblasti technologií a umělé inteligence (AI).",
			LinkToTweet: "https://twitter.com/testuser/status/123461",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Nové trendy v oblasti technologií a umělé inteligence (AI).",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [
				{ type: "and", keywords: ["tech", "AI"] }
			]
		}
	},

	{
		id: "hp-filterrule-004",
		category: "FilterRule Advanced Logic",
		priority: "HIGH",
		description: "OR logic - any keyword must be present (news OR breaking)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Aktuální zprávy z domova a ze světa.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123462">Oct 7, 2025</a></blockquote>',
			Text: "Aktuální zprávy z domova a ze světa.",
			LinkToTweet: "https://twitter.com/testuser/status/123462",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Aktuální zprávy z domova a ze světa.",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [
				{ type: "or", keywords: ["zprávy", "breaking"] }
			]
		}
	},

	{
		id: "hp-filterrule-005",
		category: "FilterRule Advanced Logic",
		priority: "HIGH",
		description: "Invalid regex pattern - should not crash, treat as no match",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Normální tweet bez speciálních znaků.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123463">Oct 7, 2025</a></blockquote>',
			Text: "Normální tweet bez speciálních znaků.",
			LinkToTweet: "https://twitter.com/testuser/status/123463",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Missing mandatory keywords"
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [
				{ type: "regex", pattern: "[invalid(regex", flags: "i" }
			]
		}
	},

	// =========================================================================
	// HP-3: Content Replacements (4 tests)
	// =========================================================================

	{
		id: "hp-replacement-001",
		category: "Content Replacements",
		priority: "HIGH",
		description: "Simple literal replacement - 'starý' → 'nový'",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Toto je starý text, který potřebuje aktualizaci.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123464">Oct 7, 2025</a></blockquote>',
			Text: "Toto je starý text, který potřebuje aktualizaci.",
			LinkToTweet: "https://twitter.com/testuser/status/123464",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Toto je nový text, který potřebuje aktualizaci.",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			CONTENT_REPLACEMENTS: [
				{ pattern: "starý", replacement: "nový", literal: true }
			]
		}
	},

	{
		id: "hp-replacement-002",
		category: "Content Replacements",
		priority: "HIGH",
		description: "Regex replacement - replace all URLs with [ODKAZ]",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Podívejte se na tento článek: https://example.com/clanek a také https://test.com/stranka</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123465">Oct 7, 2025</a></blockquote>',
			Text: "Podívejte se na tento článek: https://example.com/clanek a také https://test.com/stranka",
			LinkToTweet: "https://twitter.com/testuser/status/123465",
			FirstLinkUrl: "https://example.com/clanek",
			UserName: "testuser"
		},
		expected: {
			output: "status=Podívejte se na tento článek: [ODKAZ] a také [ODKAZ]\nhttps://example.com/clanek",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			CONTENT_REPLACEMENTS: [
				{ pattern: "https?://[^\\s]+", replacement: "[ODKAZ]", flags: "gi", literal: false }
			]
		}
	},

	{
		id: "hp-replacement-003",
		category: "Content Replacements",
		priority: "HIGH",
		description: "Multiple replacements in sequence - order matters",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet tweet tweet o tweetu.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123466">Oct 7, 2025</a></blockquote>',
			Text: "Tweet tweet tweet o tweetu.",
			LinkToTweet: "https://twitter.com/testuser/status/123466",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=příspěvek příspěvek příspěvek o příspěvku.",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			CONTENT_REPLACEMENTS: [
				{ pattern: "[Tt]weet", replacement: "příspěvek", flags: "gi", literal: false },
				{ pattern: "tweetu", replacement: "příspěvku", literal: true }
			]
		}
	},

	{
		id: "hp-replacement-004",
		category: "Content Replacements",
		priority: "HIGH",
		description: "Invalid regex in replacement - should not crash, skip that replacement",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Normální text bez změn.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123467">Oct 7, 2025</a></blockquote>',
			Text: "Normální text bez změn.",
			LinkToTweet: "https://twitter.com/testuser/status/123467",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Normální text bez změn.",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			CONTENT_REPLACEMENTS: [
				{ pattern: "[invalid(regex", replacement: "nahrazeno", flags: "gi", literal: false }
			]
		}
	},

	// =========================================================================
	// HP-4: URL Domain Fixes (3 tests)
	// =========================================================================

	{
		id: "hp-domainfixes-001",
		category: "URL Domain Fixes",
		priority: "HIGH",
		description: "Domain without protocol - should add https://",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Podívejte se na můj web: rspkt.cz pro více informací.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123468">Oct 7, 2025</a></blockquote>',
			Text: "Podívejte se na můj web: rspkt.cz pro více informací.",
			LinkToTweet: "https://twitter.com/testuser/status/123468",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Podívejte se na můj web: https://rspkt.cz/ pro více informací.",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			URL_DOMAIN_FIXES: ["rspkt.cz"]
		}
	},

	{
		id: "hp-domainfixes-002",
		category: "URL Domain Fixes",
		priority: "HIGH",
		description: "Domain with protocol already - should NOT double-add",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Odkaz na: https://example.com/stranka je už s protokolem.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123469">Oct 7, 2025</a></blockquote>',
			Text: "Odkaz na: https://example.com/stranka je už s protokolem.",
			LinkToTweet: "https://twitter.com/testuser/status/123469",
			FirstLinkUrl: "https://example.com/stranka",
			UserName: "testuser"
		},
		expected: {
			output: "status=Odkaz na: https://example.com/stranka je už s protokolem.\nhttps://example.com/stranka",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			URL_DOMAIN_FIXES: ["example.com"]
		}
	},

	{
		id: "hp-domainfixes-003",
		category: "URL Domain Fixes",
		priority: "HIGH",
		description: "Multiple domains in URL_DOMAIN_FIXES - all should be processed",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Naše weby: rspkt.cz a test-site.com mají důležité informace.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123470">Oct 7, 2025</a></blockquote>',
			Text: "Naše weby: rspkt.cz a test-site.com mají důležité informace.",
			LinkToTweet: "https://twitter.com/testuser/status/123470",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Naše weby: https://rspkt.cz/ a https://test-site.com/ mají důležité informace.",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			URL_DOMAIN_FIXES: ["rspkt.cz", "test-site.com"]
		}
	},

	// =========================================================================
	// MEDIUM PRIORITY NEW TESTS (21 tests)
	// =========================================================================
	// MP-1: Reply Detection Variations (3 tests)
	// =========================================================================

	{
		id: "mp-reply-001",
		category: "Reply Detection Variations",
		priority: "MEDIUM",
		description: "Tweet with 'R to @username:' prefix (should skip)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">R to @DanielSnor: Souhlasím s vaším názorem.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123471">Oct 7, 2025</a></blockquote>',
			Text: "R to @DanielSnor: Souhlasím s vaším názorem.",
			LinkToTweet: "https://twitter.com/testuser/status/123471",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Reply post (starts with @username)"
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "mp-reply-002",
		category: "Reply Detection Variations",
		priority: "MEDIUM",
		description: "Tweet with '.@username' at start (NOT a reply, should process)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">.@DanielSnor má zajímavý pohled na tuto věc.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123472">Oct 7, 2025</a></blockquote>',
			Text: ".@DanielSnor má zajímavý pohled na tuto věc.",
			LinkToTweet: "https://twitter.com/testuser/status/123472",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=.@DanielSnor@twitter.com má zajímavý pohled na tuto věc.",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "mp-reply-003",
		category: "Reply Detection Variations",
		priority: "MEDIUM",
		description: "removeReplyPrefix functionality - removes 'R to @user:' prefix",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">R to @testuser: Toto je odpověď na tweet.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123473">Oct 7, 2025</a></blockquote>',
			Text: "R to @testuser: Toto je odpověď na tweet.",
			LinkToTweet: "https://twitter.com/testuser/status/123473",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Reply post (starts with @username)"
		},
		settings: TWITTER_SETTINGS
	},

	// =========================================================================
	// MP-2: URL Processing Edge Cases (5 tests)
	// =========================================================================

	{
		id: "mp-url-001",
		category: "URL Processing Edge Cases",
		priority: "MEDIUM",
		description: "URL with ampersand in query - proper encoding to %26",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Odkaz s parametry: https://example.com/page?foo=1&bar=2&baz=3</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123474">Oct 7, 2025</a></blockquote>',
			Text: "Odkaz s parametry: https://example.com/page?foo=1&bar=2&baz=3",
			LinkToTweet: "https://twitter.com/testuser/status/123474",
			FirstLinkUrl: "https://example.com/page?foo=1&bar=2&baz=3",
			UserName: "testuser"
		},
		expected: {
			output: "status=Odkaz s parametry: https://example.com/page\nhttps://example.com/page",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "mp-url-002",
		category: "URL Processing Edge Cases",
		priority: "MEDIUM",
		description: "URL in URL_NO_TRIM_DOMAINS - keep query string, encode ampersands",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">YouTube video: https://youtube.com/watch?v=abc123&feature=share</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123475">Oct 7, 2025</a></blockquote>',
			Text: "YouTube video: https://youtube.com/watch?v=abc123&feature=share",
			LinkToTweet: "https://twitter.com/testuser/status/123475",
			FirstLinkUrl: "https://youtube.com/watch?v=abc123&feature=share",
			UserName: "testuser"
		},
		expected: {
			output: "status=YouTube video: https://youtube.com/watch?v=abc123%26feature=share\nhttps://youtube.com/watch?v=abc123%26feature=share",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "mp-url-003",
		category: "URL Processing Edge Cases",
		priority: "MEDIUM",
		description: "URL with fragment (#section)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Odkaz na sekci: https://example.com/page#important-section</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123476">Oct 7, 2025</a></blockquote>',
			Text: "Odkaz na sekci: https://example.com/page#important-section",
			LinkToTweet: "https://twitter.com/testuser/status/123476",
			FirstLinkUrl: "https://example.com/page#important-section",
			UserName: "testuser"
		},
		expected: {
			output: "status=Odkaz na sekci: https://example.com/page#important-section\nhttps://example.com/page#important-section",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "mp-url-004",
		category: "URL Processing Edge Cases",
		priority: "MEDIUM",
		description: "Very long URL (>500 chars)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Dlouhý odkaz: https://example.com/very/long/path/with/many/segments/and/parameters?param1=value1&param2=value2&param3=value3&param4=value4&param5=value5&param6=value6&param7=value7&param8=value8&param9=value9&param10=value10&param11=value11&param12=value12&param13=value13&param14=value14&param15=value15&param16=value16&param17=value17&param18=value18&param19=value19&param20=value20&very_long_parameter_name_that_makes_this_url_even_longer=some_value</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123477">Oct 7, 2025</a></blockquote>',
			Text: "Dlouhý odkaz: https://example.com/very/long/path/with/many/segments/and/parameters?param1=value1&param2=value2&param3=value3&param4=value4&param5=value5&param6=value6&param7=value7&param8=value8&param9=value9&param10=value10&param11=value11&param12=value12&param13=value13&param14=value14&param15=value15&param16=value16&param17=value17&param18=value18&param19=value19&param20=value20&very_long_parameter_name_that_makes_this_url_even_longer=some_value",
			LinkToTweet: "https://twitter.com/testuser/status/123477",
			FirstLinkUrl: "https://example.com/very/long/path/with/many/segments/and/parameters?param1=value1&param2=value2&param3=value3&param4=value4&param5=value5&param6=value6&param7=value7&param8=value8&param9=value9&param10=value10&param11=value11&param12=value12&param13=value13&param14=value14&param15=value15&param16=value16&param17=value17&param18=value18&param19=value19&param20=value20&very_long_parameter_name_that_makes_this_url_even_longer=some_value",
			UserName: "testuser"
		},
		expected: {
			output: "status=Dlouhý odkaz: https://example.com/very/long/path/with/many/segments/and/parameters\nhttps://example.com/very/long/path/with/many/segments/and/parameters",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "mp-url-005",
		category: "URL Processing Edge Cases",
		priority: "MEDIUM",
		description: "Case variations in URL_REPLACE - X.com vs x.com",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Odkazy: https://X.com/user/status/123 a https://x.com/other/status/456</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123478">Oct 7, 2025</a></blockquote>',
			Text: "Odkazy: https://X.com/user/status/123 a https://x.com/other/status/456",
			LinkToTweet: "https://twitter.com/testuser/status/123478",
			FirstLinkUrl: "https://X.com/user/status/123",
			UserName: "testuser"
		},
		expected: {
			output: "status=Odkazy: https://twitter.com/user/status/123 a https://twitter.com/other/status/456\nhttps://twitter.com/user/status/123",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	// =========================================================================
	// MP-2.5: URL Whitespace Handling (7 tests - MEDIUM priority)
	// =========================================================================
	
	{
		id: "mp-url-ws-001",
		category: "URL Whitespace Handling",
		priority: "MEDIUM",
		description: "Leading whitespace in LinkToTweet (postUrl)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s whitespace před URL</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123500">Oct 13, 2025</a></blockquote>',
			Text: "Tweet s whitespace před URL",
			LinkToTweet: "   https://twitter.com/testuser/status/123500",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Tweet s whitespace před URL\nhttps://twitter.com/testuser/status/123500",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	
	{
		id: "mp-url-ws-002",
		category: "URL Whitespace Handling",
		priority: "MEDIUM",
		description: "Trailing whitespace in LinkToTweet (postUrl)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s whitespace za URL</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123501">Oct 13, 2025</a></blockquote>',
			Text: "Tweet s whitespace za URL",
			LinkToTweet: "https://twitter.com/testuser/status/123501   ",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Tweet s whitespace za URL\nhttps://twitter.com/testuser/status/123501",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	
	{
		id: "mp-url-ws-003",
		category: "URL Whitespace Handling",
		priority: "MEDIUM",
		description: "Leading and trailing whitespace in LinkToTweet (postUrl)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s whitespace před i za URL</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123502">Oct 13, 2025</a></blockquote>',
			Text: "Tweet s whitespace před i za URL",
			LinkToTweet: "  https://twitter.com/testuser/status/123502  ",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Tweet s whitespace před i za URL\nhttps://twitter.com/testuser/status/123502",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	
	{
		id: "mp-url-ws-004",
		category: "URL Whitespace Handling",
		priority: "MEDIUM",
		description: "Leading whitespace in FirstLinkUrl (imageUrl)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s obrázkem - leading whitespace v imageUrl</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123503">Oct 13, 2025</a></blockquote>',
			Text: "Tweet s obrázkem - leading whitespace v imageUrl",
			LinkToTweet: "https://twitter.com/testuser/status/123503",
			FirstLinkUrl: "   https://pbs.twimg.com/media/example-ws-001.jpg",
			UserName: "testuser"
		},
		expected: {
			output: "status=Tweet s obrázkem - leading whitespace v imageUrl\nhttps://pbs.twimg.com/media/example-ws-001.jpg",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	
	{
		id: "mp-url-ws-005",
		category: "URL Whitespace Handling",
		priority: "MEDIUM",
		description: "Trailing whitespace in FirstLinkUrl (imageUrl)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s obrázkem - trailing whitespace v imageUrl</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123504">Oct 13, 2025</a></blockquote>',
			Text: "Tweet s obrázkem - trailing whitespace v imageUrl",
			LinkToTweet: "https://twitter.com/testuser/status/123504",
			FirstLinkUrl: "https://pbs.twimg.com/media/example-ws-002.jpg   ",
			UserName: "testuser"
		},
		expected: {
			output: "status=Tweet s obrázkem - trailing whitespace v imageUrl\nhttps://pbs.twimg.com/media/example-ws-002.jpg",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	
	{
		id: "mp-url-ws-006",
		category: "URL Whitespace Handling",
		priority: "MEDIUM",
		description: "Leading and trailing whitespace in FirstLinkUrl (imageUrl)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s obrázkem - whitespace před i za imageUrl</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123505">Oct 13, 2025</a></blockquote>',
			Text: "Tweet s obrázkem - whitespace před i za imageUrl",
			LinkToTweet: "https://twitter.com/testuser/status/123505",
			FirstLinkUrl: "  https://pbs.twimg.com/media/example-ws-003.jpg  ",
			UserName: "testuser"
		},
		expected: {
			output: "status=Tweet s obrázkem - whitespace před i za imageUrl\nhttps://pbs.twimg.com/media/example-ws-003.jpg",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	
	{
		id: "mp-url-ws-007",
		category: "URL Whitespace Handling",
		priority: "MEDIUM",
		description: "Whitespace in both LinkToTweet and FirstLinkUrl simultaneously",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s whitespace v obou URL současně</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123506">Oct 13, 2025</a></blockquote>',
			Text: "Tweet s whitespace v obou URL současně",
			LinkToTweet: "  https://twitter.com/testuser/status/123506  ",
			FirstLinkUrl: "  https://pbs.twimg.com/media/example-ws-004.jpg  ",
			UserName: "testuser"
		},
		expected: {
			output: "status=Tweet s whitespace v obou URL současně\nhttps://pbs.twimg.com/media/example-ws-004.jpg",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	// =========================================================================
	// MP-3: SHOW_IMAGEURL Feature (3 tests)
	// =========================================================================

	{
		id: "mp-imageurl-001",
		category: "SHOW_IMAGEURL Feature",
		priority: "MEDIUM",
		description: "SHOW_IMAGEURL=true with valid imageUrl",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s obrázkem. https://t.co/abc123</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123479">Oct 7, 2025</a></blockquote>',
			Text: "Tweet s obrázkem. https://t.co/abc123",
			LinkToTweet: "https://twitter.com/testuser/status/123479",
			FirstLinkUrl: "https://pbs.twimg.com/media/example.jpg",
			UserName: "testuser"
		},
		expected: {
			output: "status=Tweet s obrázkem.🖼️ https://pbs.twimg.com/media/example.jpg\nhttps://pbs.twimg.com/media/example.jpg",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			SHOW_IMAGEURL: true,
			PREFIX_IMAGE_URL: "🖼️ "
		}
	},

	{
		id: "mp-imageurl-002",
		category: "SHOW_IMAGEURL Feature",
		priority: "MEDIUM",
		description: "SHOW_IMAGEURL=false - should not include image",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s obrázkem. https://t.co/abc123</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123480">Oct 7, 2025</a></blockquote>',
			Text: "Tweet s obrázkem. https://t.co/abc123",
			LinkToTweet: "https://twitter.com/testuser/status/123480",
			FirstLinkUrl: "https://pbs.twimg.com/media/example.jpg",
			UserName: "testuser"
		},
		expected: {
			output: "status=Tweet s obrázkem.\nhttps://pbs.twimg.com/media/example.jpg",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			SHOW_IMAGEURL: false
		}
	},

	{
		id: "mp-imageurl-003",
		category: "SHOW_IMAGEURL Feature",
		priority: "MEDIUM",
		description: "Custom PREFIX_IMAGE_URL formatting",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Fotka z výletu. https://t.co/xyz789</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123481">Oct 7, 2025</a></blockquote>',
			Text: "Fotka z výletu. https://t.co/xyz789",
			LinkToTweet: "https://twitter.com/testuser/status/123481",
			FirstLinkUrl: "https://pbs.twimg.com/media/photo.jpg",
			UserName: "testuser"
		},
		expected: {
			output: "status=Fotka z výletu.\n📷 Obrázek: https://pbs.twimg.com/media/photo.jpg\nhttps://pbs.twimg.com/media/photo.jpg",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			SHOW_IMAGEURL: true,
			PREFIX_IMAGE_URL: "\n📷 Obrázek: "
		}
	},

	// =========================================================================
	// MP-4: FORCE_SHOW_FEEDURL (2 tests)
	// =========================================================================

	{
		id: "mp-feedurl-001",
		category: "FORCE_SHOW_FEEDURL",
		priority: "MEDIUM",
		description: "Empty entryUrl with FORCE_SHOW_FEEDURL=true - should show feedUrl",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet bez validního odkazu na konkrétní příspěvek.</p>&mdash; Test User (@testuser) <a href="">Invalid</a></blockquote>',
			Text: "Tweet bez validního odkazu na konkrétní příspěvek.",
			LinkToTweet: "",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Tweet bez validního odkazu na konkrétní příspěvek…\nhttps://twitter.com/testuser",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			FORCE_SHOW_FEEDURL: true
		}
	},

	{
		id: "mp-feedurl-002",
		category: "FORCE_SHOW_FEEDURL",
		priority: "MEDIUM",
		description: "Empty entryUrl with FORCE_SHOW_FEEDURL=false - should show empty",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet bez odkazu.</p>&mdash; Test User (@testuser) <a href="">Invalid</a></blockquote>',
			Text: "Tweet bez odkazu.",
			LinkToTweet: "",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Tweet bez odkazu.",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			FORCE_SHOW_FEEDURL: false
		}
	},

	// =========================================================================
	// MP-5: Czech Characters & Entities (4 tests)
	// =========================================================================

	{
		id: "mp-czech-001",
		category: "Czech Characters & Entities",
		priority: "MEDIUM",
		description: "Numeric entities - &#193; → Á",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">&#193;&#269;kov&#253; text s &#269;esk&#253;mi znaky: &#283;&#353;&#269;&#345;&#382;&#253;&#225;&#237;&#233;&#250;&#367;</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123482">Oct 7, 2025</a></blockquote>',
			Text: "&#193;&#269;kov&#253; text s &#269;esk&#253;mi znaky: &#283;&#353;&#269;&#345;&#382;&#253;&#225;&#237;&#233;&#250;&#367;",
			LinkToTweet: "https://twitter.com/testuser/status/123482",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Áčkový text s českými znaky: ěščřžýáíéúů",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "mp-czech-002",
		category: "Czech Characters & Entities",
		priority: "MEDIUM",
		description: "Named entities - &Aacute; → Á",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text s named entities: &Aacute;&ccaron;kov&yacute; text m&aacute; &ecaron;&scaron;&ccaron;&rcaron;&zcaron;&yacute;&aacute;&iacute;&eacute;&uacute;&uring;</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123483">Oct 7, 2025</a></blockquote>',
			Text: "Text s named entities: &Aacute;&ccaron;kov&yacute; text m&aacute; &ecaron;&scaron;&ccaron;&rcaron;&zcaron;&yacute;&aacute;&iacute;&eacute;&uacute;&uring;",
			LinkToTweet: "https://twitter.com/testuser/status/123483",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Text s named entities: Áčkový text má ěščřžýáíéúů",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "mp-czech-003",
		category: "Czech Characters & Entities",
		priority: "MEDIUM",
		description: "Common Czech chars in UTF-8",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Běžné české znaky: ěščřžýáíéúůťďň ĚŠČŘŽÝÁÍÉÚŮŤĎŇ</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123484">Oct 7, 2025</a></blockquote>',
			Text: "Běžné české znaky: ěščřžýáíéúůťďň ĚŠČŘŽÝÁÍÉÚŮŤĎŇ",
			LinkToTweet: "https://twitter.com/testuser/status/123484",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Běžné české znaky: ěščřžýáíéúůťďň ĚŠČŘŽÝÁÍÉÚŮŤĎŇ",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "mp-czech-004",
		category: "Czech Characters & Entities",
		priority: "MEDIUM",
		description: "Mixed entity types in single content",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">M&iacute;chan&eacute; entity: &#268;esk&#253; text s &ecaron;&scaron;&#269;&#345;&#382;&#253;&aacute;&iacute;&#233;&uacute;&uring;</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123485">Oct 7, 2025</a></blockquote>',
			Text: "M&iacute;chan&eacute; entity: &#268;esk&#253; text s &ecaron;&scaron;&#269;&#345;&#382;&#253;&aacute;&iacute;&#233;&uacute;&uring;",
			LinkToTweet: "https://twitter.com/testuser/status/123485",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Míchané entity: Český text s ěščřžýáíéúů",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	// =========================================================================
	// MP-6: Mention Formatting Variations (4 tests)
	// =========================================================================

	{
		id: "mp-mention-001",
		category: "Mention Formatting Variations",
		priority: "MEDIUM",
		description: "Multiple @mentions in one tweet",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Diskuze mezi @DanielSnor, @testuser2 a @testuser3 o důležitém tématu.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123486">Oct 7, 2025</a></blockquote>',
			Text: "Diskuze mezi @DanielSnor, @testuser2 a @testuser3 o důležitém tématu.",
			LinkToTweet: "https://twitter.com/testuser/status/123486",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Diskuze mezi @DanielSnor@twitter.com, @testuser2@twitter.com a @testuser3@twitter.com o důležitém tématu.",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "mp-mention-002",
		category: "Mention Formatting Variations",
		priority: "MEDIUM",
		description: "Tweet author mentioned - should skip formatting for author",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Zmínka @DanielSnor a @testuser v jednom tweetu.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123487">Oct 7, 2025</a></blockquote>',
			Text: "Zmínka @DanielSnor a @testuser v jednom tweetu.",
			LinkToTweet: "https://twitter.com/testuser/status/123487",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Zmínka @DanielSnor@twitter.com a @testuser v jednom tweetu.",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "mp-mention-003",
		category: "Mention Formatting Variations",
		priority: "MEDIUM",
		description: "Bluesky prefix formatting - https://bsky.app/profile/",
		input: {
			TweetEmbedCode: "Zmínka @username.bsky.social v Bluesky postu.",
			Text: "Zmínka @username.bsky.social v Bluesky postu.",
			LinkToTweet: "https://bsky.app/profile/testuser.bsky.social/post/abc123",
			FirstLinkUrl: "(none)",
			UserName: "testuser.bsky.social - Test User"
		},
		expected: {
			output: "status=Zmínka https://bsky.app/profile/username.bsky.social v Bluesky postu.\nhttps://bsky.app/profile/testuser.bsky.social/post/abc123",
			shouldSkip: false
		},
		settings: BLUESKY_SETTINGS
	},

	{
		id: "mp-mention-004",
		category: "Mention Formatting Variations",
		priority: "MEDIUM",
		description: "Mention formatting with type='none'",
		input: {
			TweetEmbedCode: "Zmínka @someuser v YouTube popisu.",
			Text: "Zmínka @someuser v YouTube popisu.",
			LinkToTweet: "https://www.youtube.com/watch?v=abc123",
			FirstLinkUrl: "https://www.youtube.com/watch?v=abc123",
			UserName: "YouTubeChannel"
		},
		expected: {
			output: "status=Zmínka @someuser v YouTube popisu.\nYT 📺👇👇👇\nhttps://www.youtube.com/watch?v=abc123",
			shouldSkip: false
		},
		settings: YOUTUBE_SETTINGS
	},

	// =========================================================================
	// LOW PRIORITY NEW TESTS (12 tests)
	// =========================================================================
	// LP-1: Trim Strategy Variations (4 tests)
	// =========================================================================

	{
		id: "lp-trim-001",
		category: "Trim Strategy Variations",
		priority: "LOW",
		description: "Sentence strategy with no periods - falls back to word",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Velmi dlouhý text bez teček který potřebuje zkrácení pomocí sentence strategie ale protože nejsou žádné tečky tak se použije word strategy a text bude zkrácen na hranici slov nikoliv vět což je záložní chování když sentence strategy nenajde vhodné místo pro ukončení</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123488">Oct 7, 2025</a></blockquote>',
			Text: "Velmi dlouhý text bez teček který potřebuje zkrácení pomocí sentence strategie ale protože nejsou žádné tečky tak se použije word strategy a text bude zkrácen na hranici slov nikoliv vět což je záložní chování když sentence strategy nenajde vhodné místo pro ukončení",
			LinkToTweet: "https://twitter.com/testuser/status/123488",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Velmi dlouhý text bez teček který potřebuje zkrácení pomocí sentence strategie ale protože nejsou žádné tečky tak se použije word strategy a text bude zkrácen na hranici slov nikoliv vět což je záložní chování když sentence strategy nenajde vhodné místo pro…\nhttps://twitter.com/testuser/status/123488",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			POST_LENGTH_TRIM_STRATEGY: "sentence"
		}
	},

	{
		id: "lp-trim-002",
		category: "Trim Strategy Variations",
		priority: "LOW",
		description: "Word strategy explicit test",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Dlouhý text. S více větami. Které budou zkráceny. Word strategy zkracuje text přesně na posledním slově před limitem znaků. Ignoruje hranice vět a zastaví se na posledním celém slově které se vejde do limitu. To zajišťuje že text nebude rozdělen uprostřed slova</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123489">Oct 7, 2025</a></blockquote>',
			Text: "Dlouhý text. S více větami. Které budou zkráceny. Word strategy zkracuje text přesně na posledním slově před limitem znaků. Ignoruje hranice vět a zastaví se na posledním celém slově které se vejde do limitu. To zajišťuje že text nebude rozdělen uprostřed slova",
			LinkToTweet: "https://twitter.com/testuser/status/123489",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Dlouhý text. S více větami. Které budou zkráceny. Word strategy zkracuje text přesně na posledním slově před limitem znaků. Ignoruje hranice vět a zastaví se na posledním celém slově které se vejde do limitu. To zajišťuje že text nebude rozdělen uprostřed…\nhttps://twitter.com/testuser/status/123489",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			POST_LENGTH_TRIM_STRATEGY: "word"
		}
	},

	{
		id: "lp-trim-003",
		category: "Trim Strategy Variations",
		priority: "LOW",
		description: "Smart strategy at exact tolerance boundary",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text který má přesně 391 znaků což je minimální akceptovatelná délka pro smart strategii s POST_LENGTH 444 a SMART_TOLERANCE_PERCENT 12. Toto je test edge case kdy je text právě na hranici tolerance a měl by být zkrácen na poslední větu pokud se vejde do tolerance jinak použije word strategii. Poslednítext.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123490">Oct 7, 2025</a></blockquote>',
			Text: "Text který má přesně 391 znaků což je minimální akceptovatelná délka pro smart strategii s POST_LENGTH 444 a SMART_TOLERANCE_PERCENT 12. Toto je test edge case kdy je text právě na hranici tolerance a měl by být zkrácen na poslední větu pokud se vejde do tolerance jinak použije word strategii. Poslednítext.",
			LinkToTweet: "https://twitter.com/testuser/status/123490",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Text který má přesně 391 znaků což je minimální akceptovatelná délka pro smart strategii s POST_LENGTH 444 a SMART_TOLERANCE_PERCENT 12. Toto je test edge case kdy je text právě na hranici tolerance a měl by být zkrácen na poslední větu pokud se vejde do tolerance jinak použije word strategii.\nhttps://twitter.com/testuser/status/123490",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12
		}
	},

	{
		id: "lp-trim-004",
		category: "Trim Strategy Variations",
		priority: "LOW",
		description: "Smart strategy with different SMART_TOLERANCE_PERCENT (5%)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Test smart strategie s malou tolerancí 5 procent. První věta je relativně krátká. Druhá věta je trochu delší a obsahuje více informací. Třetí věta má ještě více detailů a snaží se být co nejdelší aby otestovala chování smart strategie s nízkou tolerancí kdy by měla být preferována word strategie před sentence strategií pokud by sentence strategie plýtvala příliš mnoho znaků mimo toleranci</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123491">Oct 7, 2025</a></blockquote>',
			Text: "Test smart strategie s malou tolerancí 5 procent. První věta je relativně krátká. Druhá věta je trochu delší a obsahuje více informací. Třetí věta má ještě více detailů a snaží se být co nejdelší aby otestovala chování smart strategie s nízkou tolerancí kdy by měla být preferována word strategie před sentence strategií pokud by sentence strategie plýtvala příliš mnoho znaků mimo toleranci",
			LinkToTweet: "https://twitter.com/testuser/status/123491",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Test smart strategie s malou tolerancí 5 procent. První věta je relativně krátká. Druhá věta je trochu delší a obsahuje více informací. Třetí věta má ještě více detailů a snaží se být co nejdelší aby otestovala chování smart strategie s nízkou tolerancí kdy by měla být preferována word…\nhttps://twitter.com/testuser/status/123491",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 5
		}
	},

	// =========================================================================
	// LP-2: RSS Edge Cases (3 tests)
	// =========================================================================

	{
		id: "lp-rss-001",
		category: "RSS Edge Cases",
		priority: "LOW",
		description: "RSS_MAX_INPUT_CHARS = 0 (disabled, no truncation)",
		input: {
			TweetEmbedCode: "A".repeat(2000), // Very long content
			Text: "RSS článek s velmi dlouhým obsahem",
			LinkToTweet: "https://example.com/rss/article",
			FirstLinkUrl: "(none)",
			UserName: "RSSFeed"
		},
		expected: {
			output: "status=" + "A".repeat(444) + "…\nhttps://example.com/rss/article",
			shouldSkip: false
		},
		settings: {
			...RSS_SETTINGS,
			RSS_MAX_INPUT_CHARS: 0 // Disabled
		}
	},

	{
		id: "lp-rss-002",
		category: "RSS Edge Cases",
		priority: "LOW",
		description: "Content exactly at RSS_MAX_INPUT_CHARS boundary (1000 chars)",
		input: {
			TweetEmbedCode: "B".repeat(1000), // Exactly 1000 chars
			Text: "RSS článek na hranici",
			LinkToTweet: "https://example.com/rss/boundary",
			FirstLinkUrl: "(none)",
			UserName: "RSSFeed"
		},
		expected: {
			output: "status=" + "B".repeat(444) + "…\nhttps://example.com/rss/boundary",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},

	{
		id: "lp-rss-003",
		category: "RSS Edge Cases",
		priority: "LOW",
		description: "Very long RSS content (>5000 chars)",
		input: {
			TweetEmbedCode: "C".repeat(5500),
			Text: "Extrémně dlouhý RSS článek",
			LinkToTweet: "https://example.com/rss/very-long",
			FirstLinkUrl: "(none)",
			UserName: "RSSFeed"
		},
		expected: {
			output: "status=" + "C".repeat(444) + "…\nhttps://example.com/rss/very-long",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},

	// =========================================================================
	// LP-3: Empty PREFIX Values (2 tests)
	// =========================================================================

	{
		id: "lp-prefix-001",
		category: "Empty PREFIX Values",
		priority: "LOW",
		description: "PREFIX_REPOST = '' (empty string)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @otheruser: Obsah retweetu bez prefixu.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123492">Oct 7, 2025</a></blockquote>',
			Text: "RT @otheruser: Obsah retweetu bez prefixu.",
			LinkToTweet: "https://twitter.com/testuser/status/123492",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Test User@otheruser@twitter.com:\nObsah retweetu bez prefixu.\nhttps://twitter.com/testuser/status/123492",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PREFIX_REPOST: ""
		}
	},

	{
		id: "lp-prefix-002",
		category: "Empty PREFIX Values",
		priority: "LOW",
		description: "All prefixes empty (minimal formatting)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @otheruser: Tweet bez jakýchkoliv prefixů a formátování.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123493">Oct 7, 2025</a></blockquote>',
			Text: "RT @otheruser: Tweet bez jakýchkoliv prefixů a formátování.",
			LinkToTweet: "https://twitter.com/testuser/status/123493",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Test User@otheruser@twitter.com:\nTweet bez jakýchkoliv prefixů a formátování.https://twitter.com/testuser/status/123493",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_POST_URL: "",
			PREFIX_IMAGE_URL: ""
		}
	},

	// =========================================================================
	// LP-4: Whitespace Normalization (3 tests)
	// =========================================================================

	{
		id: "lp-whitespace-001",
		category: "Whitespace Normalization",
		priority: "LOW",
		description: "Multiple consecutive spaces",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text   s    mnoha     mezerami      mezi       slovy.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123494">Oct 7, 2025</a></blockquote>',
			Text: "Text   s    mnoha     mezerami      mezi       slovy.",
			LinkToTweet: "https://twitter.com/testuser/status/123494",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Text s mnoha mezerami mezi slovy.",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "lp-whitespace-002",
		category: "Whitespace Normalization",
		priority: "LOW",
		description: "Mixed tabs and newlines",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text\ts\ttabulátory\n\na\n\n\nmnoha\n\n\n\nřádky.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123495">Oct 7, 2025</a></blockquote>',
			Text: "Text\ts\ttabulátory\n\na\n\n\nmnoha\n\n\n\nřádky.",
			LinkToTweet: "https://twitter.com/testuser/status/123495",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Text s tabulátory\n\na\n\nmnoha\n\nřádky.",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},

	{
		id: "lp-whitespace-003",
		category: "Whitespace Normalization",
		priority: "LOW",
		description: "Non-breaking spaces (&#160;)",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text&#160;s&#160;non-breaking&#160;spaces&#160;mezi&#160;slovy.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123496">Oct 7, 2025</a></blockquote>',
			Text: "Text&#160;s&#160;non-breaking&#160;spaces&#160;mezi&#160;slovy.",
			LinkToTweet: "https://twitter.com/testuser/status/123496",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "status=Text s non-breaking spaces mezi slovy.",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	}

];

///////////////////////////////////////////////////////////////////////////////
// NOVÉ TESTY pro v3.0.1 Minimal Change Build
// Testy pro safeTruncate() a Unicode-safe RSS truncation
///////////////////////////////////////////////////////////////////////////////

// Test kategorie: "Unicode-Safe Truncation"
const unicodeSafeTruncationTests: TestCase[] = [
	// TEST 105: Basic emoji preservation
	{
		id: "T105",
		category: "Unicode-Safe Truncation",
		description: "RSS truncation preserves emoji at boundary",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "Hello 🌎🌍🌏 World! This is a long RSS feed content with emoji that should be preserved correctly when truncated.",
			LinkToTweet: "https://example.com/feed/1",
			FirstLinkUrl: "",
			UserName: "TestUser"
		},
		expected: {
			output: "Hello 🌎🌍🌏 World! This is a long RSS feed content with emoji that should be preserved cor\nhttps://example.com/feed/1",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 500,
			POST_LENGTH_TRIM_STRATEGY: "word",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: " RT ",
			PREFIX_QUOTE: " QT ",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "own post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: true,
			RSS_MAX_INPUT_CHARS: 100  // Truncate at 100 code points
		}
	},

	// TEST 106: Emoji at exact truncation boundary
	{
		id: "T106",
		category: "Unicode-Safe Truncation",
		description: "Emoji at exact boundary is preserved or removed completely",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "12345678🌎A",  // 8 chars + emoji (2 code units) + A = 11 code units total
			LinkToTweet: "https://example.com/feed/2",
			FirstLinkUrl: "",
			UserName: "TestUser"
		},
		expected: {
			output: "12345678🌎\nhttps://example.com/feed/2",  // Should include emoji if within limit
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 500,
			POST_LENGTH_TRIM_STRATEGY: "word",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: " RT ",
			PREFIX_QUOTE: " QT ",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "own post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: true,
			RSS_MAX_INPUT_CHARS: 9  // 9 code points (8 chars + 1 emoji)
		}
	},

	// TEST 107: Multiple emoji in sequence
	{
		id: "T107",
		category: "Unicode-Safe Truncation",
		description: "Multiple emoji preserved correctly",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "Test 🎉🎊🎈🎁🎀 celebration!",
			LinkToTweet: "https://example.com/feed/3",
			FirstLinkUrl: "",
			UserName: "TestUser"
		},
		expected: {
			output: "Test 🎉🎊🎈\nhttps://example.com/feed/3",  // First 3 emoji
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 500,
			POST_LENGTH_TRIM_STRATEGY: "word",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: " RT ",
			PREFIX_QUOTE: " QT ",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "own post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: true,
			RSS_MAX_INPUT_CHARS: 8  // "Test " (5) + 3 emoji (3 code points)
		}
	},

	// TEST 108: No truncation needed - emoji preserved
	{
		id: "T108",
		category: "Unicode-Safe Truncation",
		description: "Short content with emoji is not truncated",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "Short 🌎",
			LinkToTweet: "https://example.com/feed/4",
			FirstLinkUrl: "",
			UserName: "TestUser"
		},
		expected: {
			output: "Short 🌎\nhttps://example.com/feed/4",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 500,
			POST_LENGTH_TRIM_STRATEGY: "word",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: " RT ",
			PREFIX_QUOTE: " QT ",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "own post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: true,
			RSS_MAX_INPUT_CHARS: 100  // Much larger than content
		}
	},

	// TEST 109: RSS_MAX_INPUT_CHARS disabled (0)
	{
		id: "T109",
		category: "Unicode-Safe Truncation",
		description: "RSS_MAX_INPUT_CHARS=0 disables truncation",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "This is a very long RSS feed content with emoji 🌎🌍🌏 that should not be truncated when RSS_MAX_INPUT_CHARS is set to 0.",
			LinkToTweet: "https://example.com/feed/5",
			FirstLinkUrl: "",
			UserName: "TestUser"
		},
		expected: {
			output: "This is a very long RSS feed content with emoji 🌎🌍🌏 that should not be truncated when RSS_MAX_INPUT_CHARS is set to 0.\nhttps://example.com/feed/5",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 500,
			POST_LENGTH_TRIM_STRATEGY: "word",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: " RT ",
			PREFIX_QUOTE: " QT ",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "own post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: true,
			RSS_MAX_INPUT_CHARS: 0  // Disabled
		}
	},

	// TEST 110: Non-RSS platform ignores RSS_MAX_INPUT_CHARS
	{
		id: "T110",
		category: "Unicode-Safe Truncation",
		description: "Twitter posts ignore RSS_MAX_INPUT_CHARS",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "<blockquote>This is a very long tweet content with emoji 🌎🌍🌏 that should not be truncated by RSS_MAX_INPUT_CHARS on Twitter platform.</blockquote>",
			Text: "This is a very long tweet content with emoji 🌎🌍🌏 that should not be truncated by RSS_MAX_INPUT_CHARS on Twitter platform.",
			LinkToTweet: "https://twitter.com/user/status/123",
			FirstLinkUrl: "",
			UserName: "TestUser"
		},
		expected: {
			output: "This is a very long tweet content with emoji 🌎🌍🌏 that should not be truncated by RSS_MAX_INPUT_CHARS on Twitter platform.\nhttps://twitter.com/user/status/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 500,
			POST_LENGTH_TRIM_STRATEGY: "word",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "https://x.com/",
			URL_REPLACE_TO: "https://twitter.com/",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: " RT ",
			PREFIX_QUOTE: " QT ",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "own post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",  // Twitter, not RSS
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 10  // Should be ignored for Twitter
		}
	},

	// TEST 111: Mixed ASCII and emoji
	{
		id: "T111",
		category: "Unicode-Safe Truncation",
		description: "Mixed ASCII text and emoji truncation",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "Hello 🌎 World 🌍 Test 🌏 End",
			LinkToTweet: "https://example.com/feed/6",
			FirstLinkUrl: "",
			UserName: "TestUser"
		},
		expected: {
			output: "Hello 🌎 World 🌍\nhttps://example.com/feed/6",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 500,
			POST_LENGTH_TRIM_STRATEGY: "word",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: " RT ",
			PREFIX_QUOTE: " QT ",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "own post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: true,
			RSS_MAX_INPUT_CHARS: 15  // "Hello " (6) + emoji (1) + " World " (7) + emoji (1) = 15 code points
		}
	}
];

// Export pro integraci do main test suite
console.log("=== NEW TESTS FOR safeTruncate() ===");
console.log(`Total new tests: ${unicodeSafeTruncationTests.length}`);
console.log("\nTests:");
unicodeSafeTruncationTests.forEach(test => {
	console.log(`  ${test.id}: ${test.description} [${test.priority}]`);
});

///////////////////////////////////////////////////////////////////////////////
// TEST SUITE METADATA & UTILITIES
///////////////////////////////////////////////////////////////////////////////

const testSuiteMetadata = {
  version: "3.0.1",
  buildDate: "20251022",  // <-- ZMĚNIT
  totalTests: 111,  // <-- ZMĚNIT (bylo 104)
  originalTests: 49,
  newTests: 62,  // <-- ZMĚNIT (bylo 55)
  breakdown: {
	highPriority: 50,  // <-- ZMĚNIT (přidat 4 HIGH testy)
	mediumPriority: 34,  // <-- ZMĚNIT (přidat 3 MEDIUM testy)
	lowPriority: 9,
	original: 18
  },
	categories: {
		"Basic Tweets": 3,
		"Tweets with URLs": 5,
		"Tweets with Media": 3,
		"Retweets": 5,
		"Self-Retweets": 2,
		"Quote Tweets": 4,
		"Replies": 1,
		"Long Tweets": 5,
		"Bluesky Posts": 6,
		"RSS Feed Posts": 4,
		"YouTube Posts": 2,
		"Content Filters": 4,
		"Edge Cases": 7,
		"Combined Filters": 3,
		"FilterRule Advanced Logic": 5,
		"Content Replacements": 4,
		"URL Domain Fixes": 3,
		"Reply Detection Variations": 3,
		"URL Processing Edge Cases": 5,
		"URL Whitespace Handling": 7,
		"SHOW_IMAGEURL Feature": 3,
		"FORCE_SHOW_FEEDURL": 2,
		"Czech Characters & Entities": 4,
		"Mention Formatting Variations": 4,
		"Trim Strategy Variations": 4,
		"RSS Edge Cases": 3,
		"Empty PREFIX Values": 2,
		"Whitespace Normalization": 3
		"Unicode-Safe Truncation": 7  // <-- PŘIDAT NOVOU KATEGORII
	}
};

function exportTestSummary(): void {
	console.log("═══════════════════════════════════════════════════════════");
	console.log(`  COMPLETE Test Suite v${testSuiteMetadata.version}`);
	console.log(`  Build Date: ${testSuiteMetadata.buildDate}`);
	console.log("═══════════════════════════════════════════════════════════\n");
	console.log(`Total Tests: ${testSuiteMetadata.totalTests}`);
	console.log(`  Original Tests: ${testSuiteMetadata.originalTests}`);
	console.log(`  New Tests: ${testSuiteMetadata.newTests}`);
	console.log(`\nPriority Breakdown:`);
	console.log(`  HIGH Priority: ${testSuiteMetadata.breakdown.highPriority} tests`);
	console.log(`  MEDIUM Priority: ${testSuiteMetadata.breakdown.mediumPriority} tests`);
	console.log(`  LOW Priority: ${testSuiteMetadata.breakdown.lowPriority} tests`);
	console.log(`  Original (no priority): ${testSuiteMetadata.breakdown.original} tests`);
	console.log(`\nCategories: ${Object.keys(testSuiteMetadata.categories).length}`);
	Object.entries(testSuiteMetadata.categories).forEach(([cat, count]) => {
		console.log(`  - ${cat}: ${count}`);
	});
}

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		testCases,
		testSuiteMetadata,
		TWITTER_SETTINGS,
		BLUESKY_SETTINGS,
		RSS_SETTINGS,
		YOUTUBE_SETTINGS,
		exportTestSummary
	};
}

/*
═══════════════════════════════════════════════════════════════════════════
COMPLETE TEST SUITE v3.0.1 - COMPREHENSIVE COVERAGE
═══════════════════════════════════════════════════════════════════════════

TOTAL: 104 TESTS
- Original: 49 tests (fully working baseline)
- High Priority: 15 tests (critical functionality gaps)
- Medium Priority: 28 tests (recommended for production)
- Low Priority: 12 tests (nice to have, comprehensive coverage)

TESTING APPROACH:
1. Run original 49 tests first to verify baseline functionality
2. Add and test high priority tests (15 tests) - MUST PASS
3. Optionally add medium priority tests (21 tests) - RECOMMENDED
4. Optionally add low priority tests (12 tests) - COMPREHENSIVE

COVERAGE SUMMARY:
✓ Basic tweet processing
✓ URLs and media handling
✓ Retweets (regular and self)
✓ Quote tweets (regular and self)
✓ Reply detection and filtering
✓ Content truncation strategies
✓ Multi-platform support (TW, BS, RSS, YT)
✓ Content filtering (banned/required phrases)
✓ FilterRule system (regex, AND, OR logic)
✓ Content replacements
✓ URL domain fixes
✓ Czech character entities
✓ Mention formatting
✓ Whitespace normalization
✓ Edge cases and error handling

═══════════════════════════════════════════════════════════════════════════
*/-e 

///////////////////////////////////////////////////////////////////////////////
// v3.0.3 NEW TESTS (14 tests)
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// COMPLETE Test Suite for IFTTT Webhook Filter v3.0.3
// Build 20251106 - WITH v3.0.3 NEW FEATURES
// Total: 125 tests (111 from v3.0.1 + 14 new v3.0.3 tests)
///////////////////////////////////////////////////////////////////////////////
//
// NEW in v3.0.3 Tests:
// - Dynamic URL_MATCH with URL_DOMAIN_FIXES (5 tests)
// - URL_REPLACE_FROM array support (4 tests)
// - Incomplete URL detection and removal (5 tests)
//
///////////////////////////////////////////////////////////////////////////////

interface TestCase {
	id: string;
	category: string;
	description: string;
	priority?: "HIGH" | "MEDIUM" | "LOW";
	input: {
		TweetEmbedCode: string;
		Text: string;
		LinkToTweet: string;
		FirstLinkUrl: string;
		UserName: string;
	};
	expected: {
		output: string;
		shouldSkip: boolean;
		skipReason?: string;
	};
	settings: AppSettings;
}

interface AppSettings {
	PHRASES_BANNED: (string | any)[];
	PHRASES_REQUIRED: (string | any)[];
	REPOST_ALLOWED: boolean;
	AMPERSAND_SAFE_CHAR: string;
	CONTENT_REPLACEMENTS: any[];
	POST_LENGTH: number;
	POST_LENGTH_TRIM_STRATEGY: "sentence" | "word" | "smart";
	SMART_TOLERANCE_PERCENT: number;
	URL_REPLACE_FROM: string | string[]; // v3.0.3: Now supports array
	URL_REPLACE_TO: string;
	URL_NO_TRIM_DOMAINS: string[];
	URL_DOMAIN_FIXES: string[];
	FORCE_SHOW_ORIGIN_POSTURL: boolean;
	FORCE_SHOW_FEEDURL: boolean;
	SHOW_IMAGEURL: boolean;
	PREFIX_REPOST: string;
	PREFIX_QUOTE: string;
	PREFIX_IMAGE_URL: string;
	PREFIX_POST_URL: string;
	PREFIX_SELF_REFERENCE: string;
	MENTION_FORMATTING: {
		[platform: string]: { type: "prefix" | "suffix" | "none"; value: string }
	};
	POST_FROM: "BS" | "RSS" | "TW" | "YT";
	SHOW_REAL_NAME: boolean;
	SHOW_TITLE_AS_CONTENT: boolean;
	RSS_MAX_INPUT_CHARS: number;
}

///////////////////////////////////////////////////////////////////////////////
// NEW v3.0.3 TEST CASES
///////////////////////////////////////////////////////////////////////////////

const V3_0_3_NEW_TESTS: TestCase[] = [
	// =========================================================================
	// CATEGORY: Dynamic URL_MATCH with URL_DOMAIN_FIXES (5 tests)
	// =========================================================================
	{
		id: "V303-001",
		category: "Dynamic URL_MATCH",
		description: "moveUrlToEnd should detect domain without protocol (denikn.cz)",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "denikn.cz/1885568/ Metropolita Ilarion je jednou z nejvlivnějších postav ruského pravoslaví.",
			LinkToTweet: "https://bsky.app/profile/denikcz.bsky.social/post/abc123",
			FirstLinkUrl: "",
			UserName: "denikcz.bsky.social"
		},
		expected: {
			output: "Metropolita Ilarion je jednou z nejvlivnějších postav ruského pravoslaví. https://denikn.cz/1885568/\nhttps://bsky.app/profile/denikcz.bsky.social/post/abc123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: ["denikn.cz"], // v3.0.3: Dynamic URL_MATCH
			FORCE_SHOW_ORIGIN_POSTURL: true,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: " 🦋📝💬 ",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "BS",
			SHOW_REAL_NAME: true,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V303-002",
		category: "Dynamic URL_MATCH",
		description: "Multiple domains in URL_DOMAIN_FIXES",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "denikn.cz/article Článek a rspkt.cz/news Zpráva",
			LinkToTweet: "https://bsky.app/profile/user/post/123",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Článek a Zpráva https://denikn.cz/article https://rspkt.cz/news\nhttps://bsky.app/profile/user/post/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: ["denikn.cz", "rspkt.cz"], // Multiple domains
			FORCE_SHOW_ORIGIN_POSTURL: true,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "BS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V303-003",
		category: "Dynamic URL_MATCH",
		description: "URL_DOMAIN_FIXES with URL already having protocol",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "https://denikn.cz/1885568/ Článek s protokolem",
			LinkToTweet: "https://bsky.app/profile/user/post/123",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Článek s protokolem https://denikn.cz/1885568/\nhttps://bsky.app/profile/user/post/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: ["denikn.cz"],
			FORCE_SHOW_ORIGIN_POSTURL: true,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "BS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V303-004",
		category: "Dynamic URL_MATCH",
		description: "Domain NOT in URL_DOMAIN_FIXES should not be moved",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "twitter.com/user/status Text tweetu",
			LinkToTweet: "https://bsky.app/profile/user/post/123",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "twitter.com/user/status Text tweetu\nhttps://bsky.app/profile/user/post/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: ["denikn.cz"], // twitter.com NOT in list
			FORCE_SHOW_ORIGIN_POSTURL: true,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "BS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V303-005",
		category: "Dynamic URL_MATCH",
		description: "Empty URL_DOMAIN_FIXES should not affect URL detection",
		priority: "LOW",
		input: {
			TweetEmbedCode: "",
			Text: "https://example.com/path Normální URL",
			LinkToTweet: "https://bsky.app/profile/user/post/123",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Normální URL https://example.com/path\nhttps://bsky.app/profile/user/post/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [], // Empty array
			FORCE_SHOW_ORIGIN_POSTURL: true,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "BS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},

	// =========================================================================
	// CATEGORY: URL_REPLACE_FROM Array Support (4 tests)
	// =========================================================================
	{
		id: "V303-006",
		category: "URL_REPLACE_FROM Array",
		description: "Replace both x.com and twitter.com with xcancel.com",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "<p>Test tweet</p>",
			Text: "Test tweet",
			LinkToTweet: "https://x.com/user/status/123456",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Test tweet\nhttps://xcancel.com/user/status/123456",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"], // v3.0.3: Array
			URL_REPLACE_TO: "https://xcancel.com/",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V303-007",
		category: "URL_REPLACE_FROM Array",
		description: "Replace twitter.com URL with array config",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "<p>Test tweet</p>",
			Text: "Test tweet",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Test tweet\nhttps://xcancel.com/user/status/123456",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"],
			URL_REPLACE_TO: "https://xcancel.com/",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V303-008",
		category: "URL_REPLACE_FROM Array",
		description: "Backward compatibility: single string still works",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "<p>Test tweet</p>",
			Text: "Test tweet",
			LinkToTweet: "https://x.com/user/status/123456",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Test tweet\nhttps://xcancel.com/user/status/123456",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "https://x.com/", // v3.0.3: Still supports string
			URL_REPLACE_TO: "https://xcancel.com/",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V303-009",
		category: "URL_REPLACE_FROM Array",
		description: "Multiple domain replacements in FirstLinkUrl",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "<p>Test tweet</p>",
			Text: "Test tweet",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "https://x.com/other/status/789",
			UserName: "user"
		},
		expected: {
			output: "Test tweet\nhttps://xcancel.com/other/status/789",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"],
			URL_REPLACE_TO: "https://xcancel.com/",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},

	// =========================================================================
	// CATEGORY: Incomplete URL Detection and Removal (5 tests)
	// =========================================================================
	{
		id: "V303-010",
		category: "Incomplete URL Protection",
		description: "Remove incomplete URL ending with dot",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "<p>Very long tweet text that gets cut off and URL at end gets truncated https://www.instagram.</p>",
			Text: "Very long tweet text that gets cut off and URL at end gets truncated https://www.instagram.",
			LinkToTweet: "https://twitter.com/user/status/123",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Very long tweet text that gets cut off and URL at end gets truncated…\nhttps://twitter.com/user/status/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 100, // Short to trigger trimming
			POST_LENGTH_TRIM_STRATEGY: "word",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V303-011",
		category: "Incomplete URL Protection",
		description: "Remove incomplete URL with short TLD",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "<p>Text with @mention and long URL https://xcancel.com/username formatted nicely https://instagram.c</p>",
			Text: "Text with @mention and long URL https://xcancel.com/username formatted nicely https://instagram.c",
			LinkToTweet: "https://twitter.com/user/status/123",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Text with @mention and long URL https://xcancel.com/username formatted nicely…\nhttps://twitter.com/user/status/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 100,
			POST_LENGTH_TRIM_STRATEGY: "word",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V303-012",
		category: "Incomplete URL Protection",
		description: "Keep complete URL even if it looks suspicious",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "<p>Short text https://domain.com/us</p>",
			Text: "Short text https://domain.com/us",
			LinkToTweet: "https://twitter.com/user/status/123",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Short text https://domain.com/us\nhttps://twitter.com/user/status/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "word",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V303-013",
		category: "Incomplete URL Protection",
		description: "Remove URL with incomplete www subdomain",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "<p>Very long text about something interesting that needs to be trimmed down because it's way too long https://www.inst</p>",
			Text: "Very long text about something interesting that needs to be trimmed down because it's way too long https://www.inst",
			LinkToTweet: "https://twitter.com/user/status/123",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Very long text about something interesting that needs to be trimmed down because it's way too…\nhttps://twitter.com/user/status/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 100,
			POST_LENGTH_TRIM_STRATEGY: "word",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V303-014",
		category: "Incomplete URL Protection",
		description: "MENTION_FORMATTING URL protection - don't cut Instagram link in half",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "<p>Check out @someuser's awesome content on Instagram!</p>",
			Text: "Check out @someuser's awesome content on Instagram!",
			LinkToTweet: "https://twitter.com/user/status/123",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Check out awesome content on Instagram!…\nhttps://twitter.com/user/status/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 80, // Short to trigger incomplete URL detection
			POST_LENGTH_TRIM_STRATEGY: "word",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {
				"TW": { type: "prefix", value: "https://www.instagram.com/" }
			},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	}
];

///////////////////////////////////////////////////////////////////////////////
// SIMPLE TEST RUNNER (for quick validation)
///////////////////////////////////////////////////////////////////////////////

console.log("╔═══════════════════════════════════════════════════════════╗");
console.log("║  IFTTT Filter v3.0.3 - NEW FEATURES TEST SUITE          ║");
console.log("╚═══════════════════════════════════════════════════════════╝\n");

console.log("📋 Test Suite Summary:");
console.log(`   - Total new tests: ${V3_0_3_NEW_TESTS.length}`);
console.log(`   - Dynamic URL_MATCH tests: 5`);
console.log(`   - URL_REPLACE_FROM array tests: 4`);
console.log(`   - Incomplete URL protection tests: 5`);
console.log("");

console.log("✅ Test suite v3.0.3 loaded successfully!");
console.log("");
console.log("📝 Note: This is a test case definition file.");
console.log("   To run tests, load example-ifttt-filter-x-twitter-3_0_3.ts");
console.log("   and execute tests against it.");
console.log("");
console.log("🎯 Key v3.0.3 features tested:");
console.log("   1. Dynamic URL_MATCH with URL_DOMAIN_FIXES");
console.log("   2. URL_REPLACE_FROM array support (backward compatible)");
console.log("   3. Incomplete URL detection and removal (hasIncompleteUrlAtEnd)");
console.log("");
-e 

///////////////////////////////////////////////////////////////////////////////
// v3.1.0 NEW TESTS (51 tests)
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// COMPLETE Test Suite for IFTTT Webhook Filter v3.1.0 MERGED FINAL
// Build 20251116 - ALL FEATURES INCLUDING v3.2.0 MERGED
// Total: ~205 tests (143 original + 50 unified filtering + 12 anchor tag)
///////////////////////////////////////////////////////////////////////////////
//
// INCLUDED TESTS:
// - 125 tests from v3.0.3 baseline
// - 18 tests from original v3.1.0 (MOVE_URL_TO_END, FORCE_SHOW_ORIGIN_POSTURL, NOT/COMPLEX)
// - 50+ tests for Unified Filtering (OR/AND/NOT with regex) - NEW from v3.2.0
// - 12 tests for Anchor Tag Hotfix - NEW from v3.2.0
//
///////////////////////////////////////////////////////////////////////////////

interface TestCase {
	id: string;
	category: string;
	description: string;
	priority?: "HIGH" | "MEDIUM" | "LOW";
	input: {
		TweetEmbedCode: string;
		Text: string;
		LinkToTweet: string;
		FirstLinkUrl: string;
		UserName: string;
		EntryTitle?: string;
		EntryContent?: string;
		EntryUrl?: string;
		ImageUrl?: string;
	};
	expected: {
		output: string;
		shouldSkip: boolean;
		skipReason?: string;
	};
	settings: AppSettings;
}

interface FilterRule {
	// Legacy types (v3.0.x and v3.1.0)
	type: "literal" | "regex" | "and" | "or" | "not" | "complex";
	pattern?: string;
	flags?: string;
	keywords?: string[];
	rule?: FilterRule;
	rules?: FilterRule[];
	operator?: "and" | "or";
	
	// NEW v3.2.0 Unified Filtering fields
	content?: string[];          // Literal content matching (OR logic)
	contentRegex?: string[];     // Regex content matching (OR logic)
	username?: string[];         // Literal username matching (OR logic)
	usernameRegex?: string[];    // Regex username matching (OR logic)
	domain?: string[];           // Literal domain matching (OR logic)
	domainRegex?: string[];      // Regex domain matching (OR logic)
}

interface AppSettings {
	PHRASES_BANNED: (string | FilterRule)[];
	PHRASES_REQUIRED: (string | FilterRule)[];
	REPOST_ALLOWED: boolean;
	AMPERSAND_SAFE_CHAR: string;
	CONTENT_REPLACEMENTS: any[];
	POST_LENGTH: number;
	POST_LENGTH_TRIM_STRATEGY: "sentence" | "word" | "smart";
	SMART_TOLERANCE_PERCENT: number;
	URL_REPLACE_FROM: string | string[];
	URL_REPLACE_TO: string;
	URL_NO_TRIM_DOMAINS: string[];
	URL_DOMAIN_FIXES: string[];
	FORCE_SHOW_ORIGIN_POSTURL: boolean;
	FORCE_SHOW_FEEDURL: boolean;
	SHOW_IMAGEURL: boolean;
	PREFIX_REPOST: string;
	PREFIX_QUOTE: string;
	PREFIX_IMAGE_URL: string;
	PREFIX_POST_URL: string;
	PREFIX_SELF_REFERENCE: string;
	MENTION_FORMATTING: {
		[platform: string]: { type: "prefix" | "suffix" | "none"; value: string }
	};
	POST_FROM: "BS" | "RSS" | "TW" | "YT";
	SHOW_REAL_NAME: boolean;
	SHOW_TITLE_AS_CONTENT: boolean;
	MOVE_URL_TO_END: boolean;
	RSS_MAX_INPUT_CHARS: number;
}

const V3_1_0_GROUP_A_TESTS: TestCase[] = [
	{
		id: "V310-A1",
		category: "MOVE_URL_TO_END Setting",
		description: "RSS feed, MOVE_URL_TO_END disabled (default behavior)",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Zajímavý článek o technologii",
			EntryUrl: "https://example.com/clanek"
		},
		expected: {
			output: "Zajímavý článek o technologii https://example.com/clanek",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false, // Default
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-A2",
		category: "MOVE_URL_TO_END Setting",
		description: "RSS feed, MOVE_URL_TO_END enabled - URL moved to end",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "https://example.com/clanek Zajímavý článek o technologii",
			EntryUrl: "https://example.com/clanek"
		},
		expected: {
			output: "Zajímavý článek o technologii\n\nhttps://example.com/clanek",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: true, // Enabled
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-A3",
		category: "MOVE_URL_TO_END Setting",
		description: "Bluesky, MOVE_URL_TO_END enabled - URL moved to end",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "https://example.com/image Post o AI",
			LinkToTweet: "https://bsky.app/profile/user/post/123",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Post o AI\n\nhttps://example.com/image\nhttps://bsky.app/profile/user/post/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: true,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "BS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: true, // Enabled
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-A4",
		category: "MOVE_URL_TO_END Setting",
		description: "Twitter, MOVE_URL_TO_END should be ignored (Twitter-specific logic)",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "Tweet s odkazem https://t.co/xyz",
			LinkToTweet: "https://twitter.com/user/status/123",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Tweet s odkazem\nhttps://twitter.com/user/status/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: true,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: true, // Should be ignored for Twitter
			RSS_MAX_INPUT_CHARS: 1000
		}
	}
];

///////////////////////////////////////////////////////////////////////////////
// NEW v3.1.0 TEST CASES - GROUP B: FORCE_SHOW_ORIGIN_POSTURL Fix
///////////////////////////////////////////////////////////////////////////////

const V3_1_0_GROUP_B_TESTS: TestCase[] = [
	{
		id: "V310-B1",
		category: "FORCE_SHOW_ORIGIN_POSTURL Fix",
		description: "Twitter embed, origin URL should be displayed with FORCE_SHOW_ORIGIN_POSTURL=true",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "<blockquote class=\"twitter-tweet\">Tweet</blockquote>",
			Text: "Tweet text s obrázkem",
			LinkToTweet: "https://twitter.com/user/status/1987168689456562433",
			FirstLinkUrl: "http://www.example.com/",
			UserName: "user",
			ImageUrl: "https://pbs.twimg.com/profile_images/123.png"
		},
		expected: {
			output: "Tweet text s obrázkem http://www.example.com/\nhttps://xcancel.com/user/status/1987168689456562433",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: ["https://twitter.com/", "https://x.com/"],
			URL_REPLACE_TO: "https://xcancel.com/",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: true,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-B2",
		category: "FORCE_SHOW_ORIGIN_POSTURL Fix",
		description: "Quote tweet should show origin URL with FORCE_SHOW_ORIGIN_POSTURL=true",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "RT @user: Original tweet text",
			LinkToTweet: "https://x.com/user/status/123",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "RT @user: Original tweet text\nhttps://xcancel.com/user/status/123",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "https://x.com/",
			URL_REPLACE_TO: "https://xcancel.com/",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: true,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: " 🦋📝💬 ",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-B3",
		category: "FORCE_SHOW_ORIGIN_POSTURL Fix",
		description: "Twitter without FORCE_SHOW_ORIGIN_POSTURL should show imageUrl, not linkToTweet",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "Tweet text",
			LinkToTweet: "https://twitter.com/user/status/123",
			FirstLinkUrl: "http://www.example.com/",
			UserName: "user",
			ImageUrl: "https://pbs.twimg.com/image.png"
		},
		expected: {
			output: "Tweet text http://www.example.com/\nhttps://pbs.twimg.com/image.png",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: true,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "TW",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-B4",
		category: "FORCE_SHOW_ORIGIN_POSTURL Fix",
		description: "RSS with FORCE_SHOW_ORIGIN_POSTURL should always show entryUrl",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "RSS článek",
			EntryUrl: "https://example.com/article",
			ImageUrl: "https://example.com/image.jpg"
		},
		expected: {
			output: "RSS článek\nhttps://example.com/article",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: true,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "\n",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	}
];

///////////////////////////////////////////////////////////////////////////////
// NEW v3.1.0 TEST CASES - GROUP C: NOT and COMPLEX Filtering Rules
///////////////////////////////////////////////////////////////////////////////

const V3_1_0_GROUP_C_TESTS: TestCase[] = [
	// NOT Tests
	{
		id: "V310-C1",
		category: "NOT Filtering Rule",
		description: "NOT rule - post WITHOUT 'reklama' should pass",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Zajímavý technologický článek"
		},
		expected: {
			output: "Zajímavý technologický článek",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [{
				type: "not",
				rule: { type: "literal", pattern: "reklama" }
			}],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-C1b",
		category: "NOT Filtering Rule",
		description: "NOT rule - post WITH 'reklama' should be filtered out",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Toto je reklama na produkt"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_REQUIRED not satisfied"
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [{
				type: "not",
				rule: { type: "literal", pattern: "reklama" }
			}],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-C5",
		category: "NOT Filtering Rule",
		description: "NOT with regex - filter out posts with email addresses",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Kontaktujte nás na info@example.com"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_BANNED matched"
		},
		settings: {
			PHRASES_BANNED: [{
				type: "not",
				rule: { 
					type: "regex", 
					pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
					flags: "i"
				}
			}],
			PHRASES_REQUIRED: [],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	
	// COMPLEX Tests
	{
		id: "V310-C2",
		category: "COMPLEX Filtering Rule",
		description: "COMPLEX AND - must contain both 'AI' AND 'technologie'",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "AI a moderní technologie mění svět"
		},
		expected: {
			output: "AI a moderní technologie mění svět",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [{
				type: "complex",
				operator: "and",
				rules: [
					{ type: "literal", pattern: "AI" },
					{ type: "literal", pattern: "technologie" }
				]
			}],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-C2b",
		category: "COMPLEX Filtering Rule",
		description: "COMPLEX AND - missing 'technologie' should be filtered",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "AI mění svět"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_REQUIRED not satisfied"
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [{
				type: "complex",
				operator: "and",
				rules: [
					{ type: "literal", pattern: "AI" },
					{ type: "literal", pattern: "technologie" }
				]
			}],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-C3",
		category: "COMPLEX Filtering Rule",
		description: "COMPLEX OR - must contain 'AI' OR 'robotika'",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Pokroky v robotice jsou fascinující"
		},
		expected: {
			output: "Pokroky v robotice jsou fascinující",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [{
				type: "complex",
				operator: "or",
				rules: [
					{ type: "literal", pattern: "AI" },
					{ type: "literal", pattern: "robotika" }
				]
			}],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-C4",
		category: "COMPLEX Filtering Rule",
		description: "Nested COMPLEX - (AI OR tech) AND NOT reklama - should pass",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Tech startup představuje novou AI platformu"
		},
		expected: {
			output: "Tech startup představuje novou AI platformu",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [{
				type: "complex",
				operator: "and",
				rules: [
					{
						type: "complex",
						operator: "or",
						rules: [
							{ type: "literal", pattern: "AI" },
							{ type: "literal", pattern: "tech" }
						]
					},
					{
						type: "not",
						rule: { type: "literal", pattern: "reklama" }
					}
				]
			}],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-C4b",
		category: "COMPLEX Filtering Rule",
		description: "Nested COMPLEX - with 'reklama' should be filtered",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Tech reklama na AI nástroj"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_REQUIRED not satisfied"
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [{
				type: "complex",
				operator: "and",
				rules: [
					{
						type: "complex",
						operator: "or",
						rules: [
							{ type: "literal", pattern: "AI" },
							{ type: "literal", pattern: "tech" }
						]
					},
					{
						type: "not",
						rule: { type: "literal", pattern: "reklama" }
					}
				]
			}],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-C6",
		category: "COMPLEX Filtering Rule",
		description: "Deep nesting (3 levels) - complex filter should pass",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Nové trendy ve strojovém učení"
		},
		expected: {
			output: "Nové trendy ve strojovém učení",
			shouldSkip: false
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [{
				type: "complex",
				operator: "and",
				rules: [
					{
						type: "complex",
						operator: "or",
						rules: [
							{ type: "literal", pattern: "AI" },
							{ type: "literal", pattern: "strojové učení" }
						]
					},
					{
						type: "not",
						rule: {
							type: "complex",
							operator: "or",
							rules: [
								{ type: "literal", pattern: "reklama" },
								{ type: "literal", pattern: "spam" }
							]
						}
					}
				]
			}],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	},
	{
		id: "V310-C6b",
		category: "COMPLEX Filtering Rule",
		description: "Deep nesting (3 levels) - with spam should be filtered",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "AI spam zpráva"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_REQUIRED not satisfied"
		},
		settings: {
			PHRASES_BANNED: [],
			PHRASES_REQUIRED: [{
				type: "complex",
				operator: "and",
				rules: [
					{
						type: "complex",
						operator: "or",
						rules: [
							{ type: "literal", pattern: "AI" },
							{ type: "literal", pattern: "strojové učení" }
						]
					},
					{
						type: "not",
						rule: {
							type: "complex",
							operator: "or",
							rules: [
								{ type: "literal", pattern: "reklama" },
								{ type: "literal", pattern: "spam" }
							]
						}
					}
				]
			}],
			REPOST_ALLOWED: true,
			AMPERSAND_SAFE_CHAR: "⅋",
			CONTENT_REPLACEMENTS: [],
			POST_LENGTH: 444,
			POST_LENGTH_TRIM_STRATEGY: "smart",
			SMART_TOLERANCE_PERCENT: 12,
			URL_REPLACE_FROM: "",
			URL_REPLACE_TO: "",
			URL_NO_TRIM_DOMAINS: [],
			URL_DOMAIN_FIXES: [],
			FORCE_SHOW_ORIGIN_POSTURL: false,
			FORCE_SHOW_FEEDURL: false,
			SHOW_IMAGEURL: false,
			PREFIX_REPOST: "",
			PREFIX_QUOTE: "",
			PREFIX_IMAGE_URL: "",
			PREFIX_POST_URL: "",
			PREFIX_SELF_REFERENCE: "vlastní post",
			MENTION_FORMATTING: {},
			POST_FROM: "RSS",
			SHOW_REAL_NAME: false,
			SHOW_TITLE_AS_CONTENT: false,
			MOVE_URL_TO_END: false,
			RSS_MAX_INPUT_CHARS: 1000
		}
	}
];

///////////////////////////////////////////////////////////////////////////////
// COMBINE ALL NEW v3.1.0 TESTS
///////////////////////////////////////////////////////////////////////////////

const ALL_V3_1_0_NEW_TESTS = [
	...V3_1_0_GROUP_A_TESTS,
	...V3_1_0_GROUP_B_TESTS,
	...V3_1_0_GROUP_C_TESTS
];

///////////////////////////////////////////////////////////////////////////////
// NEW v3.2.0 MERGED TESTS - GROUP D: Unified Filtering with Regex Support
///////////////////////////////////////////////////////////////////////////////

const DEFAULT_SETTINGS: AppSettings = {
	PHRASES_BANNED: [],
	PHRASES_REQUIRED: [],
	REPOST_ALLOWED: true,
	AMPERSAND_SAFE_CHAR: "⅋",
	CONTENT_REPLACEMENTS: [],
	POST_LENGTH: 444,
	POST_LENGTH_TRIM_STRATEGY: "smart",
	SMART_TOLERANCE_PERCENT: 12,
	URL_REPLACE_FROM: "",
	URL_REPLACE_TO: "",
	URL_NO_TRIM_DOMAINS: [],
	URL_DOMAIN_FIXES: [],
	FORCE_SHOW_ORIGIN_POSTURL: false,
	FORCE_SHOW_FEEDURL: false,
	SHOW_IMAGEURL: false,
	PREFIX_REPOST: "",
	PREFIX_QUOTE: "",
	PREFIX_IMAGE_URL: "",
	PREFIX_POST_URL: "\n",
	PREFIX_SELF_REFERENCE: "vlastní post",
	MENTION_FORMATTING: {},
	POST_FROM: "RSS",
	SHOW_REAL_NAME: false,
	SHOW_TITLE_AS_CONTENT: false,
	MOVE_URL_TO_END: false,
	RSS_MAX_INPUT_CHARS: 1000
};

const V3_2_0_GROUP_D_TESTS: TestCase[] = [
	// D1-D2: OR Filter - Content Literal
	{
		id: "V320-D1",
		category: "Unified Filtering - OR Content",
		description: "OR filter content literal - pass with 'breaking'",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "This is breaking news about technology"
		},
		expected: {
			output: "This is breaking news about technology",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "or",
				content: ["breaking", "urgent", "alert"]
			}]
		}
	},
	{
		id: "V320-D2",
		category: "Unified Filtering - OR Content",
		description: "OR filter content literal - reject without keywords",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Regular update about technology"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_REQUIRED not satisfied"
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "or",
				content: ["breaking", "urgent", "alert"]
			}]
		}
	},
	
	// D3-D4: OR Filter - Content Regex
	{
		id: "V320-D3",
		category: "Unified Filtering - OR ContentRegex",
		description: "OR filter contentRegex - match AI pattern",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "New AI research breakthrough"
		},
		expected: {
			output: "New AI research breakthrough",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "or",
				contentRegex: ["\\b(AI|ML)\\b", "machine\\s+learning"]
			}]
		}
	},
	{
		id: "V320-D4",
		category: "Unified Filtering - OR ContentRegex",
		description: "OR filter contentRegex - reject without match",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Regular technology update"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_REQUIRED not satisfied"
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "or",
				contentRegex: ["\\b(AI|ML)\\b", "machine\\s+learning"]
			}]
		}
	},
	
	// D5-D6: OR Filter - Username Literal
	{
		id: "V320-D5",
		category: "Unified Filtering - OR Username",
		description: "OR filter username literal - match @techcrunch",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "Post by @techcrunch about AI",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "techcrunch"
		},
		expected: {
			output: "Post by @techcrunch about AI",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "or",
				username: ["@techcrunch", "@verge", "@wired"]
			}]
		}
	},
	{
		id: "V320-D6",
		category: "Unified Filtering - OR Username",
		description: "OR filter username literal - reject other users",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "Random user @johndoe posting",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "johndoe"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_REQUIRED not satisfied"
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "or",
				username: ["@techcrunch", "@verge", "@wired"]
			}]
		}
	},
	
	// D7-D8: OR Filter - Username Regex
	{
		id: "V320-D7",
		category: "Unified Filtering - OR UsernameRegex",
		description: "OR filter usernameRegex - match ^@news pattern",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "@newstoday breaking story",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "newstoday"
		},
		expected: {
			output: "@newstoday breaking story",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "or",
				usernameRegex: ["^@news", "^@media", "bot$"]
			}]
		}
	},
	{
		id: "V320-D8",
		category: "Unified Filtering - OR UsernameRegex",
		description: "OR filter usernameRegex - reject non-matching",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "@randomuser personal post",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "randomuser"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_REQUIRED not satisfied"
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "or",
				usernameRegex: ["^@news", "^@media", "bot$"]
			}]
		}
	},
	
	// D9-D10: AND Filter - Domain Literal
	{
		id: "V320-D9",
		category: "Unified Filtering - AND Domain",
		description: "AND filter domain literal - match github.com + release",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "New release at https://github.com/repo/release"
		},
		expected: {
			output: "New release at https://github.com/repo/release",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "and",
				domain: ["github.com", "release"]
			}]
		}
	},
	{
		id: "V320-D10",
		category: "Unified Filtering - AND Domain",
		description: "AND filter domain literal - reject without release",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Issues at https://github.com/repo/issues"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_REQUIRED not satisfied"
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "and",
				domain: ["github.com", "release"]
			}]
		}
	},
	
	// D11-D12: AND Filter - Domain Regex
	{
		id: "V320-D11",
		category: "Unified Filtering - AND DomainRegex",
		description: "AND filter domainRegex - match https + .com",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Check https://example.com/page"
		},
		expected: {
			output: "Check https://example.com/page",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "and",
				domainRegex: ["\\.(com|org|net)", "https://"]
			}]
		}
	},
	{
		id: "V320-D12",
		category: "Unified Filtering - AND DomainRegex",
		description: "AND filter domainRegex - reject without https",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Visit http://example.com/page"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_REQUIRED not satisfied"
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "and",
				domainRegex: ["\\.(com|org|net)", "https://"]
			}]
		}
	},
	
	// D13-D14: NOT Filter - Domain Literal
	{
		id: "V320-D13",
		category: "Unified Filtering - NOT Domain",
		description: "NOT filter domain literal - pass trusted domains",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Article from https://trusted.com/article"
		},
		expected: {
			output: "Article from https://trusted.com/article",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_BANNED: [{
				type: "not",
				domain: ["spam.com", "ads.example.com"]
			}]
		}
	},
	{
		id: "V320-D14",
		category: "Unified Filtering - NOT Domain",
		description: "NOT filter domain literal - reject spam domains",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Offer at https://spam.com/deal"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_BANNED matched"
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_BANNED: [{
				type: "not",
				domain: ["spam.com", "ads.example.com"]
			}]
		}
	},
	
	// D15-D16: NOT Filter - Domain Regex
	{
		id: "V320-D15",
		category: "Unified Filtering - NOT DomainRegex",
		description: "NOT filter domainRegex - pass full URLs",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Read https://example.com/full-article"
		},
		expected: {
			output: "Read https://example.com/full-article",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_BANNED: [{
				type: "not",
				domainRegex: ["bit\\.ly", "tinyurl"]
			}]
		}
	},
	{
		id: "V320-D16",
		category: "Unified Filtering - NOT DomainRegex",
		description: "NOT filter domainRegex - reject URL shorteners",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "Check bit.ly/abc123"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_BANNED matched"
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_BANNED: [{
				type: "not",
				domainRegex: ["bit\\.ly", "tinyurl"]
			}]
		}
	},
	
	// D17: Mixed OR Filter
	{
		id: "V320-D17",
		category: "Unified Filtering - OR Mixed",
		description: "OR filter with content + username - pass with either",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "Post about technology",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Post about technology",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "or",
				content: ["technology", "science"],
				username: ["@techcrunch", "@verge"]
			}]
		}
	},
	
	// D18-D19: Mixed AND Filter
	{
		id: "V320-D18",
		category: "Unified Filtering - AND Mixed",
		description: "AND filter content + domain - pass with both",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "New release at https://github.com/repo/v2.0"
		},
		expected: {
			output: "New release at https://github.com/repo/v2.0",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "and",
				content: ["release"],
				domain: ["github.com"]
			}]
		}
	},
	{
		id: "V320-D19",
		category: "Unified Filtering - AND Mixed",
		description: "AND filter content + domain - reject with only one",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "New release at https://gitlab.com/repo/v2.0"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "PHRASES_REQUIRED not satisfied"
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "and",
				content: ["release"],
				domain: ["github.com"]
			}]
		}
	},
	
	// D20-D21: Backward Compatibility
	{
		id: "V320-D20",
		category: "Unified Filtering - Backward Compatibility",
		description: "Legacy OR syntax with keywords still works",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "AI research breakthrough"
		},
		expected: {
			output: "AI research breakthrough",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "or",
				keywords: ["AI", "ML", "technology"]
			}]
		}
	},
	{
		id: "V320-D21",
		category: "Unified Filtering - Backward Compatibility",
		description: "Legacy AND syntax with keywords still works",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "AI machine learning"
		},
		expected: {
			output: "AI machine learning",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "and",
				keywords: ["AI", "machine"]
			}]
		}
	}
];


///////////////////////////////////////////////////////////////////////////////
// NEW v3.2.0 MERGED TESTS - GROUP E: Anchor Tag Hotfix
///////////////////////////////////////////////////////////////////////////////

const V3_2_0_GROUP_E_TESTS: TestCase[] = [
	{
		id: "V320-E1",
		category: "Anchor Tag Hotfix",
		description: "Basic anchor with pic.twitter.com - extract href URL",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "https://x.com/CT24zive/status/123",
			FirstLinkUrl: "",
			UserName: "CT24zive",
			EntryContent: 'Článek o technologii. <a href="https://t.co/abc123">pic.twitter.com/xyz789</a>'
		},
		expected: {
			output: "Článek o technologii.\nhttps://x.com/CT24zive/status/123",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			FORCE_SHOW_ORIGIN_POSTURL: true,
			CONTENT_REPLACEMENTS: [
				{ pattern: "https?:\\/\\/t\\.co\\/[a-zA-Z0-9]+", replacement: "", flags: "g" }
			]
		}
	},
	{
		id: "V320-E2",
		category: "Anchor Tag Hotfix",
		description: "Multiple anchor tags - extract all href URLs",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "https://example.com/post",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Article <a href="https://example.com/link1">text1</a> and <a href="https://example.com/link2">text2</a>'
		},
		expected: {
			output: "Article https://example.com/link1 and https://example.com/link2\nhttps://example.com/post",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			FORCE_SHOW_ORIGIN_POSTURL: true
		}
	},
	{
		id: "V320-E3",
		category: "Anchor Tag Hotfix",
		description: "Anchor without protocol in text - extract href",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Check <a href="https://github.com/repo">github.com/repo</a>'
		},
		expected: {
			output: "Check https://github.com/repo",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS"
		}
	},
	{
		id: "V320-E4",
		category: "Anchor Tag Hotfix",
		description: "pic.twitter.com - NO duplicate https://",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Image: <a href="https://t.co/abc">pic.twitter.com/xyz</a>'
		},
		expected: {
			output: "Image: https://t.co/abc",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS"
		}
	},
	{
		id: "V320-E5",
		category: "Anchor Tag Hotfix",
		description: "Anchor with nested HTML elements",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: '<p>Article <a href="https://example.com/article"><strong>link</strong></a> here</p>'
		},
		expected: {
			output: "Article https://example.com/article here",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS"
		}
	},
	{
		id: "V320-E6",
		category: "Anchor Tag Hotfix",
		description: "Anchor with empty href - remove tag keep text",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Text with <a href="">empty link</a> here'
		},
		expected: {
			output: "Text with empty link here",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS"
		}
	},
	{
		id: "V320-E7",
		category: "Anchor Tag Hotfix",
		description: "Anchor with no text content - keep URL only",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Check: <a href="https://example.com/page"></a>'
		},
		expected: {
			output: "Check: https://example.com/page",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS"
		}
	},
	{
		id: "V320-E8",
		category: "Anchor Tag Hotfix",
		description: "Anchor where href matches text - no duplicate",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Visit <a href="https://example.com">https://example.com</a>'
		},
		expected: {
			output: "Visit https://example.com",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS"
		}
	},
	{
		id: "V320-E9",
		category: "Anchor Tag Hotfix",
		description: "Anchor + URL_DOMAIN_FIXES together",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'News: <a href="https://twitter.com/user/status/123">pic.twitter.com/abc</a>'
		},
		expected: {
			output: "News: https://x.com/user/status/123",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			URL_DOMAIN_FIXES: ["twitter.com|x.com"]
		}
	},
	{
		id: "V320-E10",
		category: "Anchor Tag Hotfix",
		description: "Anchor + t.co removal via CONTENT_REPLACEMENTS",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "https://example.com/post",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Article <a href="https://t.co/xyz">link</a> here'
		},
		expected: {
			output: "Article here\nhttps://example.com/post",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			FORCE_SHOW_ORIGIN_POSTURL: true,
			CONTENT_REPLACEMENTS: [
				{ pattern: "https?:\\/\\/t\\.co\\/[a-zA-Z0-9]+", replacement: "", flags: "g" }
			]
		}
	},
	{
		id: "V320-E11",
		category: "Anchor Tag Hotfix",
		description: "Mixed anchors and regular URLs",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Check <a href="https://example.com/p1">link</a> and https://example.com/p2'
		},
		expected: {
			output: "Check https://example.com/p1 and https://example.com/p2",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS"
		}
	},
	{
		id: "V320-E12",
		category: "Anchor Tag Hotfix",
		description: "Real-world ČT24 RSS feed - complete pipeline",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "https://x.com/CT24zive/status/1989694033896124710",
			FirstLinkUrl: "",
			UserName: "CT24zive",
			EntryContent: 'V katedrále svatého Víta na Pražském hradě se v sobotu lidé naposledy rozloučili s kardinálem Dominikem Dukou. <a href="https://t.co/CSwiEUZe9Q">pic.twitter.com/CSwiEUZe9Q</a>',
			EntryUrl: "https://x.com/CT24zive/status/1989694033896124710"
		},
		expected: {
			output: "V katedrále svatého Víta na Pražském hradě se v sobotu lidé naposledy rozloučili s kardinálem Dominikem Dukou.\nhttps://x.com/CT24zive/status/1989694033896124710",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			FORCE_SHOW_ORIGIN_POSTURL: true,
			URL_DOMAIN_FIXES: ["twitter.com|x.com"],
			CONTENT_REPLACEMENTS: [
				{ pattern: "https?:\\/\\/t\\.co\\/[a-zA-Z0-9]+", replacement: "", flags: "g" },
				{ pattern: "pic\\.twitter\\.com\\/[a-zA-Z0-9]+", replacement: "", flags: "g" }
			]
		}
	}
];


///////////////////////////////////////////////////////////////////////////////
// COMBINE ALL TESTS
///////////////////////////////////////////////////////////////////////////////

const ALL_V3_1_0_MERGED_TESTS = [
	...V3_1_0_GROUP_A_TESTS,  // 4 tests - MOVE_URL_TO_END
	...V3_1_0_GROUP_B_TESTS,  // 4 tests - FORCE_SHOW_ORIGIN_POSTURL
	...V3_1_0_GROUP_C_TESTS,  // 10 tests - NOT & COMPLEX
	...V3_2_0_GROUP_D_TESTS,  // 21 tests - Unified Filtering
	...V3_2_0_GROUP_E_TESTS   // 12 tests - Anchor Tag Hotfix
];

///////////////////////////////////////////////////////////////////////////////
// TEST EXECUTION SUMMARY
///////////////////////////////////////////////////////////////////////////////

console.log("=".repeat(80));
console.log("IFTTT Webhook Filter v3.1.0 MERGED FINAL - Complete Test Suite");
console.log("=".repeat(80));
console.log("");
console.log("ORIGINAL v3.0.3 Baseline Tests:                  125 tests");
console.log("");
console.log("NEW v3.1.0 Features:");
console.log("  Group A - MOVE_URL_TO_END Setting:             " + V3_1_0_GROUP_A_TESTS.length + " tests");
console.log("  Group B - FORCE_SHOW_ORIGIN_POSTURL Fix:       " + V3_1_0_GROUP_B_TESTS.length + " tests");
console.log("  Group C - NOT & COMPLEX Filtering:             " + V3_1_0_GROUP_C_TESTS.length + " tests");
console.log("");
console.log("NEW v3.2.0 MERGED Features:");
console.log("  Group D - Unified Filtering (Regex):           " + V3_2_0_GROUP_D_TESTS.length + " tests");
console.log("  Group E - Anchor Tag Hotfix:                   " + V3_2_0_GROUP_E_TESTS.length + " tests");
console.log("");
console.log("─".repeat(80));
console.log("TOTAL NEW v3.1.0 MERGED tests:                   " + ALL_V3_1_0_MERGED_TESTS.length + " tests");
console.log("TOTAL INCLUDING v3.0.3 baseline:                 " + (125 + ALL_V3_1_0_MERGED_TESTS.length) + " tests");
console.log("─".repeat(80));
console.log("");
console.log("✅ All merged features from v3.1.0 and v3.2.0 are covered!");
console.log("");
console.log("=".repeat(80));

// Export for test runner
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		ALL_V3_1_0_MERGED_TESTS,
		V3_1_0_GROUP_A_TESTS,
		V3_1_0_GROUP_B_TESTS,
		V3_1_0_GROUP_C_TESTS,
		V3_2_0_GROUP_D_TESTS,
		V3_2_0_GROUP_E_TESTS
	};
}-e 

///////////////////////////////////////////////////////////////////////////////
// v3.1.3 NEW TESTS (23 tests)
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// COMPLETE Test Suite for IFTTT Webhook Filter v3.1.3
// Build 20251122 - COMPREHENSIVE TESTING INCLUDING URL DEDUPLICATION
// Total: 166 tests (158 from v3.1.2 + 8 new v3.1.3 specific tests)
///////////////////////////////////////////////////////////////////////////////
//
// INCLUDED TESTS:
// - 125 tests from v3.0.3 baseline
// - 18 tests from v3.1.0 (MOVE_URL_TO_END, FORCE_SHOW_ORIGIN_POSTURL, NOT/COMPLEX)
// - 21 tests for Unified Filtering (OR/AND/NOT with regex)
// - 12 tests for Anchor Tag Hotfix  
// - 15 tests from v3.1.2 (FORCE_SHOW_ORIGIN_POSTURL bug fixes + whitespace)
// - 8 NEW tests for v3.1.3 (URL deduplication - deduplicateTrailingUrls)
//
///////////////////////////////////////////////////////////////////////////////

interface TestCase {
	id: string;
	category: string;
	description: string;
	priority?: "HIGH" | "MEDIUM" | "LOW";
	input: {
		TweetEmbedCode: string;
		Text: string;
		LinkToTweet: string;
		FirstLinkUrl: string;
		UserName: string;
		EntryTitle?: string;
		EntryContent?: string;
		EntryUrl?: string;
		ImageUrl?: string;
	};
	expected: {
		output: string;
		shouldSkip: boolean;
		skipReason?: string;
	};
	settings: AppSettings;
}

interface FilterRule {
	type: "literal" | "regex" | "and" | "or" | "not" | "complex";
	pattern?: string;
	flags?: string;
	keywords?: string[];
	rule?: FilterRule;
	rules?: FilterRule[];
	operator?: "and" | "or";
	
	// Unified Filtering fields
	content?: string[];
	contentRegex?: string[];
	username?: string[];
	usernameRegex?: string[];
	domain?: string[];
	domainRegex?: string[];
}

interface AppSettings {
	PHRASES_BANNED: (string | FilterRule)[];
	PHRASES_REQUIRED: (string | FilterRule)[];
	REPOST_ALLOWED: boolean;
	AMPERSAND_SAFE_CHAR: string;
	CONTENT_REPLACEMENTS: any[];
	POST_LENGTH: number;
	POST_LENGTH_TRIM_STRATEGY: "sentence" | "word" | "smart";
	SMART_TOLERANCE_PERCENT: number;
	URL_REPLACE_FROM: string | string[];
	URL_REPLACE_TO: string;
	URL_NO_TRIM_DOMAINS: string[];
	URL_DOMAIN_FIXES: string[];
	FORCE_SHOW_ORIGIN_POSTURL: boolean;
	FORCE_SHOW_FEEDURL: boolean;
	SHOW_IMAGEURL: boolean;
	PREFIX_REPOST: string;
	PREFIX_QUOTE: string;
	PREFIX_IMAGE_URL: string;
	PREFIX_POST_URL: string;
	PREFIX_SELF_REFERENCE: string;
	MENTION_FORMATTING: {
		[platform: string]: { type: "prefix" | "suffix" | "none"; value: string }
	};
	POST_FROM: "BS" | "RSS" | "TW" | "YT";
	SHOW_REAL_NAME: boolean;
	SHOW_TITLE_AS_CONTENT: boolean;
	MOVE_URL_TO_END: boolean;
	RSS_MAX_INPUT_CHARS: number;
}

const DEFAULT_SETTINGS: AppSettings = {
	PHRASES_BANNED: [],
	PHRASES_REQUIRED: [],
	REPOST_ALLOWED: true,
	AMPERSAND_SAFE_CHAR: "⅋",
	CONTENT_REPLACEMENTS: [],
	POST_LENGTH: 444,
	POST_LENGTH_TRIM_STRATEGY: "smart",
	SMART_TOLERANCE_PERCENT: 12,
	URL_REPLACE_FROM: "",
	URL_REPLACE_TO: "",
	URL_NO_TRIM_DOMAINS: [],
	URL_DOMAIN_FIXES: [],
	FORCE_SHOW_ORIGIN_POSTURL: false,
	FORCE_SHOW_FEEDURL: false,
	SHOW_IMAGEURL: false,
	PREFIX_REPOST: "",
	PREFIX_QUOTE: "",
	PREFIX_IMAGE_URL: "",
	PREFIX_POST_URL: "\n",
	PREFIX_SELF_REFERENCE: "vlastní post",
	MENTION_FORMATTING: {},
	POST_FROM: "RSS",
	SHOW_REAL_NAME: false,
	SHOW_TITLE_AS_CONTENT: false,
	MOVE_URL_TO_END: false,
	RSS_MAX_INPUT_CHARS: 1000
};

///////////////////////////////////////////////////////////////////////////////
// NEW v3.1.2 TEST CASES - GROUP F: FORCE_SHOW_ORIGIN_POSTURL BUG FIXES
///////////////////////////////////////////////////////////////////////////////

const V3_1_2_GROUP_F_TESTS: TestCase[] = [
	{
		id: "V312-F1",
		category: "FORCE_SHOW_ORIGIN_POSTURL v3.1.2 Fix",
		description: "Twitter quote tweet - FORCE_SHOW_ORIGIN_POSTURL must use entryUrl (not imageUrl)",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "RT @otheruser: Quote tweet content",
			LinkToTweet: "https://twitter.com/user/status/123",
			FirstLinkUrl: "https://twitter.com/otheruser/status/456/photo/1",
			UserName: "user"
		},
		expected: {
			output: "RT @otheruser: Quote tweet content\nhttps://twitter.com/user/status/123",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "TW",
			FORCE_SHOW_ORIGIN_POSTURL: true
		}
	},
	{
		id: "V312-F2",
		category: "FORCE_SHOW_ORIGIN_POSTURL v3.1.2 Fix",
		description: "Twitter regular tweet with image - when FORCE enabled, use entryUrl NOT imageUrl",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "Regular tweet with image",
			LinkToTweet: "https://twitter.com/user/status/789",
			FirstLinkUrl: "https://twitter.com/user/status/789/photo/1",
			UserName: "user"
		},
		expected: {
			output: "Regular tweet with image\nhttps://twitter.com/user/status/789",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "TW",
			FORCE_SHOW_ORIGIN_POSTURL: true
		}
	},
	{
		id: "V312-F3",
		category: "FORCE_SHOW_ORIGIN_POSTURL v3.1.2 Fix",
		description: "Twitter video tweet - FORCE enabled should prioritize entryUrl",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "Check out this video",
			LinkToTweet: "https://twitter.com/user/status/999",
			FirstLinkUrl: "https://twitter.com/user/status/999/video/1",
			UserName: "user"
		},
		expected: {
			output: "Check out this video\nhttps://twitter.com/user/status/999",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "TW",
			FORCE_SHOW_ORIGIN_POSTURL: true
		}
	},
	{
		id: "V312-F4",
		category: "FORCE_SHOW_ORIGIN_POSTURL v3.1.2 Fix",
		description: "Twitter repost with external URL - FORCE enabled uses entryUrl",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "RT @someone: Shared post with link https://example.com",
			LinkToTweet: "https://twitter.com/user/status/111",
			FirstLinkUrl: "https://example.com/article",
			UserName: "user"
		},
		expected: {
			output: "RT @someone: Shared post with link https://example.com\nhttps://twitter.com/user/status/111",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "TW",
			FORCE_SHOW_ORIGIN_POSTURL: true,
			REPOST_ALLOWED: true
		}
	},
	{
		id: "V312-F5",
		category: "FORCE_SHOW_ORIGIN_POSTURL v3.1.2 Fix",
		description: "Twitter media tweet - FORCE disabled uses imageUrl as before",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "Tweet with media",
			LinkToTweet: "https://twitter.com/user/status/222",
			FirstLinkUrl: "https://twitter.com/user/status/222/photo/1",
			UserName: "user"
		},
		expected: {
			output: "Tweet with media\nhttps://twitter.com/user/status/222/photo/1",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "TW",
			FORCE_SHOW_ORIGIN_POSTURL: false // DISABLED - should use old logic
		}
	},
	{
		id: "V312-F6",
		category: "FORCE_SHOW_ORIGIN_POSTURL v3.1.2 Fix",
		description: "RSS feed post - FORCE enabled should show entryUrl",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: "RSS article about tech",
			EntryUrl: "https://example.com/article/123"
		},
		expected: {
			output: "RSS article about tech\nhttps://example.com/article/123",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			FORCE_SHOW_ORIGIN_POSTURL: true
		}
	}
];

///////////////////////////////////////////////////////////////////////////////
// NEW v3.1.2 TEST CASES - GROUP G: WHITESPACE CLEANUP via CONTENT_REPLACEMENTS
///////////////////////////////////////////////////////////////////////////////

const V3_1_2_GROUP_G_TESTS: TestCase[] = [
	{
		id: "V312-G1",
		category: "Whitespace Cleanup v3.1.2",
		description: "Remove extra space before URL after anchor tag removal",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "https://x.com/CT24zive/status/123",
			FirstLinkUrl: "",
			UserName: "CT24zive",
			EntryContent: 'Bilance se může zvýšit.<br><br> <a href="https://ct24.ceskatelevize.cz/clanek">ct24.ceskatelevize.cz/clanek…</a>',
			EntryUrl: "https://x.com/CT24zive/status/123"
		},
		expected: {
			output: "Bilance se může zvýšit. https://ct24.ceskatelevize.cz/clanek\nhttps://x.com/CT24zive/status/123",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			FORCE_SHOW_ORIGIN_POSTURL: true,
			CONTENT_REPLACEMENTS: [
				{ pattern: "\\s+(https?:\\/\\/)", replacement: " $1", flags: "gi", literal: false }
			]
		}
	},
	{
		id: "V312-G2",
		category: "Whitespace Cleanup v3.1.2",
		description: "Multiple spaces before URL - normalize to single space",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Text content     https://example.com/page'
		},
		expected: {
			output: "Text content https://example.com/page",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			CONTENT_REPLACEMENTS: [
				{ pattern: "\\s+(https?:\\/\\/)", replacement: " $1", flags: "gi", literal: false }
			]
		}
	},
	{
		id: "V312-G3",
		category: "Whitespace Cleanup v3.1.2",
		description: "Tab character before URL - normalize to single space",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Check this\t\thttps://example.com/article'
		},
		expected: {
			output: "Check this https://example.com/article",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			CONTENT_REPLACEMENTS: [
				{ pattern: "\\s+(https?:\\/\\/)", replacement: " $1", flags: "gi", literal: false }
			]
		}
	},
	{
		id: "V312-G4",
		category: "Whitespace Cleanup v3.1.2",
		description: "Newline before URL after anchor removal",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Article text<br><br>\nhttps://example.com/article'
		},
		expected: {
			output: "Article text https://example.com/article",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			CONTENT_REPLACEMENTS: [
				{ pattern: "\\s+(https?:\\/\\/)", replacement: " $1", flags: "gi", literal: false }
			]
		}
	},
	{
		id: "V312-G5",
		category: "Whitespace Cleanup v3.1.2",
		description: "Real-world ČT24 case - anchor removal + whitespace cleanup + FORCE_SHOW",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "https://x.com/CT24zive/status/1990157173666758836",
			FirstLinkUrl: "",
			UserName: "CT24zive",
			EntryContent: 'Nejméně 32 horníků zahynulo v sobotu při zřícení mostu v kobaltovém dole na jihovýchodě Konga, informovala agentura AFP s odvoláním na místní úřady. Bilance se může zvýšit.<br><br> <a href="https://ct24.ceskatelevize.cz/clanek/svet/v-kongu-zahynuly-desitky-horniku-pri-nestesti-v-kobaltovem-dole-367254">ct24.ceskatelevize.cz/clanek…</a>',
			EntryUrl: "https://x.com/CT24zive/status/1990157173666758836"
		},
		expected: {
			output: "Nejméně 32 horníků zahynulo v sobotu při zřícení mostu v kobaltovém dole na jihovýchodě Konga, informovala agentura AFP s odvoláním na místní úřady. Bilance se může zvýšit. https://ct24.ceskatelevize.cz/clanek/svet/v-kongu-zahynuly-desitky-horniku-pri-nestesti-v-kobaltovem-dole-367254\nhttps://x.com/CT24zive/status/1990157173666758836",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			FORCE_SHOW_ORIGIN_POSTURL: true,
			URL_DOMAIN_FIXES: ["twitter.com|x.com"],
			CONTENT_REPLACEMENTS: [
				{ pattern: "\\s+(https?:\\/\\/)", replacement: " $1", flags: "gi", literal: false },
				{ pattern: "(?:https?:\\/\\/)?(?:ct24\\.)?ceskatelevize\\.cz\\/.*?(…|\\.\\.\\.)", replacement: "", flags: "gim", literal: false }
			]
		}
	},
	{
		id: "V312-G6",
		category: "Whitespace Cleanup v3.1.2",
		description: "Multiple URLs with various whitespace issues",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Check   https://example1.com and\t\thttps://example2.com or  \n  https://example3.com'
		},
		expected: {
			output: "Check https://example1.com and https://example2.com or https://example3.com",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			CONTENT_REPLACEMENTS: [
				{ pattern: "\\s+(https?:\\/\\/)", replacement: " $1", flags: "gi", literal: false }
			]
		}
	}
];

///////////////////////////////////////////////////////////////////////////////
// NEW v3.1.2 TEST CASES - GROUP H: COMBINED SCENARIOS (FORCE + WHITESPACE + ANCHORS)
///////////////////////////////////////////////////////////////////////////////

const V3_1_2_GROUP_H_TESTS: TestCase[] = [
	{
		id: "V312-H1",
		category: "Combined v3.1.2 Scenarios",
		description: "Quote tweet + FORCE + anchor removal + whitespace cleanup",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "Quote of post",
			LinkToTweet: "https://twitter.com/user/status/123",
			FirstLinkUrl: "https://twitter.com/quoted/status/456/photo/1",
			UserName: "user",
			EntryContent: 'Quote of <a href="https://example.com/article">article</a>  with spaces',
			EntryUrl: "https://twitter.com/user/status/123"
		},
		expected: {
			output: "Quote of https://example.com/article with spaces\nhttps://twitter.com/user/status/123",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "TW",
			FORCE_SHOW_ORIGIN_POSTURL: true,
			CONTENT_REPLACEMENTS: [
				{ pattern: "\\s+(https?:\\/\\/)", replacement: " $1", flags: "gi", literal: false }
			]
		}
	},
	{
		id: "V312-H2",
		category: "Combined v3.1.2 Scenarios",
		description: "RSS + pic.twitter.com removal + FORCE + whitespace",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "CT24zive",
			EntryContent: 'V katedrále svatého Víta na Pražském hradě se v sobotu lidé naposledy rozloučili s kardinálem Dominikem Duką. <a href="https://t.co/CSwiEUZe9Q">pic.twitter.com/CSwiEUZe9Q</a>',
			EntryUrl: "https://x.com/CT24zive/status/1989694033896124710"
		},
		expected: {
			output: "V katedrále svatého Víta na Pražském hradě se v sobotu lidé naposledy rozloučili s kardinálem Dominikem Dukou.\nhttps://x.com/CT24zive/status/1989694033896124710",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			FORCE_SHOW_ORIGIN_POSTURL: true,
			URL_DOMAIN_FIXES: ["twitter.com|x.com"],
			CONTENT_REPLACEMENTS: [
				{ pattern: "\\s+(https?:\\/\\/)", replacement: " $1", flags: "gi", literal: false },
				{ pattern: "https?:\\/\\/t\\.co\\/[a-zA-Z0-9]+", replacement: "", flags: "g", literal: false },
				{ pattern: "pic\\.twitter\\.com\\/[a-zA-Z0-9]+", replacement: "", flags: "g", literal: false }
			]
		}
	},
	{
		id: "V312-H3",
		category: "Combined v3.1.2 Scenarios",
		description: "Complex content with multiple anchors, URLs, and whitespace issues",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "user",
			EntryContent: 'Article about <a href="https://example.com/topic">tech</a>   with another  <a href="https://example.com/detail">link</a> and  more text   https://example.com/third'
		},
		expected: {
			output: "Article about https://example.com/topic with another https://example.com/detail and more text https://example.com/third",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS,
			POST_FROM: "RSS",
			CONTENT_REPLACEMENTS: [
				{ pattern: "\\s+(https?:\\/\\/)", replacement: " $1", flags: "gi", literal: false }
			]
		}
	}
];

///////////////////////////////////////////////////////////////////////////////
// COMBINE ALL v3.1.2 TESTS
///////////////////////////////////////////////////////////////////////////////

const ALL_V3_1_2_NEW_TESTS = [
	...V3_1_2_GROUP_F_TESTS,  // 6 tests - FORCE_SHOW_ORIGIN_POSTURL bug fixes
	...V3_1_2_GROUP_G_TESTS,  // 6 tests - Whitespace cleanup
	...V3_1_2_GROUP_H_TESTS   // 3 tests - Combined scenarios
];

///////////////////////////////////////////////////////////////////////////////
// COMPLETE v3.1.2 TEST SUITE (includes all previous tests)
///////////////////////////////////////////////////////////////////////////////

// Note: In real implementation, you would import previous test groups:
// - V3_1_0_GROUP_A_TESTS (4 tests - MOVE_URL_TO_END)
// - V3_1_0_GROUP_B_TESTS (4 tests - FORCE_SHOW_ORIGIN_POSTURL original)
// - V3_1_0_GROUP_C_TESTS (10 tests - NOT & COMPLEX)
// - V3_2_0_GROUP_D_TESTS (21 tests - Unified Filtering)
// - V3_2_0_GROUP_E_TESTS (12 tests - Anchor Tag Hotfix)

///////////////////////////////////////////////////////////////////////////////
// TEST EXECUTION SUMMARY
///////////////////////////////////////////////////////////////////////////////

console.log("=".repeat(80));
console.log("IFTTT Webhook Filter v3.1.2 - Complete Test Suite");
console.log("=".repeat(80));
console.log("");
console.log("PREVIOUS VERSIONS (baseline):");
console.log("  v3.0.3 Baseline Tests:                         125 tests");
console.log("  v3.1.0 Group A - MOVE_URL_TO_END:              4 tests");
console.log("  v3.1.0 Group B - FORCE_SHOW (original):        4 tests");
console.log("  v3.1.0 Group C - NOT & COMPLEX:                10 tests");
console.log("  v3.2.0 Group D - Unified Filtering:            21 tests");
console.log("  v3.2.0 Group E - Anchor Tag Hotfix:            12 tests");
console.log("");
console.log("NEW v3.1.2 Features:");
console.log("  Group F - FORCE_SHOW_ORIGIN_POSTURL Fixes:     " + V3_1_2_GROUP_F_TESTS.length + " tests");
console.log("  Group G - Whitespace Cleanup:                  " + V3_1_2_GROUP_G_TESTS.length + " tests");
console.log("  Group H - Combined Scenarios:                  " + V3_1_2_GROUP_H_TESTS.length + " tests");
console.log("");
console.log("─".repeat(80));
console.log("TOTAL NEW v3.1.2 tests:                          " + ALL_V3_1_2_NEW_TESTS.length + " tests");
console.log("TOTAL INCLUDING all previous versions:           " + (125 + 4 + 4 + 10 + 21 + 12 + ALL_V3_1_2_NEW_TESTS.length) + " tests");
console.log("─".repeat(80));
console.log("");
console.log("🎯 CRITICAL v3.1.2 TEST AREAS:");
console.log("   ✅ FORCE_SHOW_ORIGIN_POSTURL prioritization (entryUrl over imageUrl)");
console.log("   ✅ Whitespace normalization before URLs");
console.log("   ✅ Anchor tag removal + whitespace + FORCE combined");
console.log("   ✅ Real-world ČT24 RSS feed scenarios");
console.log("");
console.log("=".repeat(80));

///////////////////////////////////////////////////////////////////////////////
// NEW IN v3.1.3 - URL DEDUPLICATION TESTS
///////////////////////////////////////////////////////////////////////////////

const V3_1_3_GROUP_I_TESTS: TestCase[] = [
	{
		id: "V313-I1",
		name: "Deníku N - RSS feed with duplicate URL at end",
		category: "URL Deduplication v3.1.3",
		priority: "HIGH",
		description: "Real-world RSS feed from Deníku N with content URL + FORCE_SHOW URL",
		settings: {
			POST_FROM: "RSS",
			FORCE_SHOW_ORIGIN_POSTURL: true,
			PREFIX_POST_URL: "\n",
			POST_LENGTH: 500,
			POST_LENGTH_TRIM_STRATEGY: "smart"
		},
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "DenikN",
			EntryContent: "Pražský primátor Bohuslav Svoboda chce, aby byl nový most u Troji postaven \"nejpozději\" do roku 2031. https://denikn.cz/1501773/praha-chce-postavit-most-u-troji-nejpozdeji-do-roku-2031-vyjde-na-2-5-miliardy/",
			EntryUrl: "https://denikn.cz/1501773/praha-chce-postavit-most-u-troji-nejpozdeji-do-roku-2031-vyjde-na-2-5-miliardy/",
			EntryTitle: "",
			FeedTitle: "Deníku N"
		},
		expected: {
			output: "Pražský primátor Bohuslav Svoboda chce, aby byl nový most u Troji postaven \"nejpozději\" do roku 2031.\nhttps://denikn.cz/1501773/praha-chce-postavit-most-u-troji-nejpozdeji-do-roku-2031-vyjde-na-2-5-miliardy/",
			shouldSkip: false
		}
	},
	{
		id: "V313-I2",
		name: "Twitter/X tweet with URL matching LinkToTweet",
		category: "URL Deduplication v3.1.3",
		priority: "HIGH",
		description: "Tweet containing its own URL in text + FORCE_SHOW adds same URL",
		settings: {
			POST_FROM: "TW",
			FORCE_SHOW_ORIGIN_POSTURL: true,
			PREFIX_POST_URL: "\n",
			POST_LENGTH: 500
		},
		input: {
			TweetEmbedCode: "",
			Text: "Important announcement https://x.com/user/status/123456",
			LinkToTweet: "https://x.com/user/status/123456",
			FirstLinkUrl: "",
			UserName: "testuser"
		},
		expected: {
			output: "Important announcement\nhttps://x.com/user/status/123456",
			shouldSkip: false
		}
	},
	{
		id: "V313-I3",
		name: "Generic RSS/YouTube with duplicate URL",
		category: "URL Deduplication v3.1.3",
		priority: "HIGH",
		description: "YouTube RSS feed with content URL + FORCE_SHOW URL",
		settings: {
			POST_FROM: "RSS",
			FORCE_SHOW_ORIGIN_POSTURL: true,
			PREFIX_POST_URL: "\n",
			POST_LENGTH: 500
		},
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Nové video o programování v TypeScript https://youtube.com/watch?v=abc123",
			EntryUrl: "https://youtube.com/watch?v=abc123",
			EntryTitle: "TypeScript Tutorial",
			FeedTitle: "Dev Channel"
		},
		expected: {
			output: "Nové video o programování v TypeScript\nhttps://youtube.com/watch?v=abc123",
			shouldSkip: false
		}
	},
	{
		id: "V313-I4",
		name: "Duplicate with trailing slash difference",
		category: "URL Deduplication v3.1.3",
		priority: "MEDIUM",
		description: "Two URLs differing only by trailing slash",
		settings: {
			POST_FROM: "RSS",
			FORCE_SHOW_ORIGIN_POSTURL: true,
			PREFIX_POST_URL: "\n",
			POST_LENGTH: 500
		},
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Článek o Praze https://example.com/article/",
			EntryUrl: "https://example.com/article",
			EntryTitle: "",
			FeedTitle: ""
		},
		expected: {
			output: "Článek o Praze\nhttps://example.com/article/",
			shouldSkip: false
		}
	},
	{
		id: "V313-I5",
		name: "Multiple URLs - deduplication only at the end",
		category: "URL Deduplication v3.1.3",
		priority: "MEDIUM",
		description: "Three URLs where only last two are duplicates",
		settings: {
			POST_FROM: "RSS",
			PREFIX_POST_URL: "\n",
			POST_LENGTH: 500
		},
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Odkaz na https://example.com/first a také https://example.com/second https://example.com/second",
			EntryUrl: "",
			EntryTitle: "",
			FeedTitle: ""
		},
		expected: {
			output: "Odkaz na https://example.com/first a také\nhttps://example.com/second",
			shouldSkip: false
		}
	},
	{
		id: "V313-I6",
		name: "No duplicates - should remain unchanged",
		category: "URL Deduplication v3.1.3",
		priority: "LOW",
		description: "Control test - no duplicates present",
		settings: {
			POST_FROM: "RSS",
			PREFIX_POST_URL: "\n",
			POST_LENGTH: 500
		},
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "První odkaz https://example.com/one a druhý https://example.com/two",
			EntryUrl: "",
			EntryTitle: "",
			FeedTitle: ""
		},
		expected: {
			output: "První odkaz https://example.com/one a druhý\nhttps://example.com/two",
			shouldSkip: false
		}
	},
	{
		id: "V313-I7",
		name: "Single URL - no deduplication needed",
		category: "URL Deduplication v3.1.3",
		priority: "LOW",
		description: "Edge case - only one URL in text",
		settings: {
			POST_FROM: "RSS",
			PREFIX_POST_URL: "\n",
			POST_LENGTH: 500
		},
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Text s jediným odkazem https://example.com/single",
			EntryUrl: "",
			EntryTitle: "",
			FeedTitle: ""
		},
		expected: {
			output: "Text s jediným odkazem\nhttps://example.com/single",
			shouldSkip: false
		}
	},
	{
		id: "V313-I8",
		name: "Three identical URLs in sequence",
		category: "URL Deduplication v3.1.3",
		priority: "MEDIUM",
		description: "Stress test - multiple consecutive duplicates",
		settings: {
			POST_FROM: "RSS",
			PREFIX_POST_URL: "\n",
			POST_LENGTH: 500
		},
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Text https://example.com/test https://example.com/test https://example.com/test",
			EntryUrl: "",
			EntryTitle: "",
			FeedTitle: ""
		},
		expected: {
			output: "Text\nhttps://example.com/test",
			shouldSkip: false
		}
	}
];

const ALL_V3_1_3_NEW_TESTS = V3_1_3_GROUP_I_TESTS;

///////////////////////////////////////////////////////////////////////////////
// UPDATED TEST EXECUTION SUMMARY FOR v3.1.3
///////////////////////////////////////////////////////////////////////////////

console.log("");
console.log("=".repeat(80));
console.log("IFTTT Webhook Filter v3.1.3 - Complete Test Suite");
console.log("=".repeat(80));
console.log("");
console.log("PREVIOUS VERSIONS (baseline):");
console.log("  v3.0.3 Baseline Tests:                         125 tests");
console.log("  v3.1.0 Group A - MOVE_URL_TO_END:              4 tests");
console.log("  v3.1.0 Group B - FORCE_SHOW (original):        4 tests");
console.log("  v3.1.0 Group C - NOT & COMPLEX:                10 tests");
console.log("  v3.2.0 Group D - Unified Filtering:            21 tests");
console.log("  v3.2.0 Group E - Anchor Tag Hotfix:            12 tests");
console.log("  v3.1.2 Group F - FORCE_SHOW Fixes:             " + V3_1_2_GROUP_F_TESTS.length + " tests");
console.log("  v3.1.2 Group G - Whitespace Cleanup:           " + V3_1_2_GROUP_G_TESTS.length + " tests");
console.log("  v3.1.2 Group H - Combined Scenarios:           " + V3_1_2_GROUP_H_TESTS.length + " tests");
console.log("");
console.log("NEW v3.1.3 Features:");
console.log("  Group I - URL Deduplication:                   " + V3_1_3_GROUP_I_TESTS.length + " tests");
console.log("");
console.log("─".repeat(80));
console.log("TOTAL NEW v3.1.3 tests:                          " + ALL_V3_1_3_NEW_TESTS.length + " tests");
console.log("TOTAL INCLUDING all previous versions:           " + (125 + 4 + 4 + 10 + 21 + 12 + ALL_V3_1_2_NEW_TESTS.length + ALL_V3_1_3_NEW_TESTS.length) + " tests");
console.log("─".repeat(80));
console.log("");
console.log("🎯 CRITICAL v3.1.3 TEST AREAS:");
console.log("   ✅ URL deduplication (deduplicateTrailingUrls function)");
console.log("   ✅ Trailing slash normalization");
console.log("   ✅ Multiple duplicate URL handling");
console.log("   ✅ Real-world RSS feed scenarios (Deníku N)");
console.log("   ✅ Inherited: Smart sentence detection (findLastSentenceEnd)");
console.log("");
console.log("=".repeat(80));

// Export for test runner
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		ALL_V3_1_2_NEW_TESTS,
		V3_1_2_GROUP_F_TESTS,
		V3_1_2_GROUP_G_TESTS,
		V3_1_2_GROUP_H_TESTS,
		ALL_V3_1_3_NEW_TESTS,
		V3_1_3_GROUP_I_TESTS
	};
}
///////////////////////////////////////////////////////////////////////////////
// NEW TESTS FOR v3.1.4: URL_DOMAIN_FIXES ES5-Compatible Fix
// Build 20251125
// Total: 3 tests (V314-J1 to V314-J3)
///////////////////////////////////////////////////////////////////////////////

// Test Group J: URL_DOMAIN_FIXES Real-World Validation
const V3_1_4_GROUP_J_TESTS: TestCase[] = [
	{
		id: "V314-J1",
		category: "v3.1.4 URL_DOMAIN_FIXES",
		description: "ČT24 RSS: Valid https://ct24.ceskatelevize.cz URL must remain unchanged",
		priority: "HIGH",
		input: {
			TweetEmbedCode: 'Nemyslím, že je BBC zaujatá, řekl autor interní zprávy. Má ale podle něj nedostatky:  <a href="https://ct24.ceskatelevize.cz/clanek/svet/nemyslim-ze-is-bbc-zaujata-rekl-autor-interni-zpravy-ma-ale-podle-nej-nedostatky-367531">ct24.ceskatelevize.cz/clanek…</a>',
			Text: "Nemyslím, že je BBC zaujatá, řekl autor interní zprávy. Má ale podle něj nedostatky:",
			LinkToTweet: "https://x.com/CT24zive/status/1993065830729613668",
			FirstLinkUrl: "",
			UserName: "CT24zive"
		},
		expected: {
			output: "Nemyslím, že je BBC zaujatá, řekl autor interní zprávy. Má ale podle něj nedostatky:\nhttps://ct24.ceskatelevize.cz/clanek/svet/nemyslim-ze-is-bbc-zaujata-rekl-autor-interni-zpravy-ma-ale-podle-nej-nedostatky-367531",
			shouldSkip: false
		},
		settings: DEFAULT_SETTINGS_WITH_URL_DOMAIN_FIXES
	},
	{
		id: "V314-J2",
		category: "v3.1.4 URL_DOMAIN_FIXES",
		description: "ČT RSS: Valid https://www.ceskatelevize.cz URL must remain unchanged",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '🔴 Kdo jsou sponzoři Motoristů a jaké mají zájmy?<br>🔴 Co řešil podnikatel Chlad se zločincem Krejčířem?<br>🔴 Proč se Češi stěhují do německé Žitavy?<br>🟣 Jaká jsou rizika dovozu opuštěných psů z Balkánu?<br>▶️ Naše nejnovější reportáže už jsou v iVysílání:  <a href="https://www.ceskatelevize.cz/porady/1142743803-reporteri-ct/">ceskatelevize.cz/porady/1142…</a>',
			Text: "🔴 Kdo jsou sponzoři Motoristů a jaké mají zájmy? 🔴 Co řešil podnikatel Chlad se zločincem Krejčířem? 🔴 Proč se Češi stěhují do německé Žitavy? 🟣 Jaká jsou rizika dovozu opuštěných psů z Balkánu? ▶️ Naše nejnovější reportáže už jsou v iVysílání:",
			LinkToTweet: "https://x.com/ReporteriCT/status/1993213280630772053",
			FirstLinkUrl: "",
			UserName: "ReporteriCT"
		},
		expected: {
			output: "🔴 Kdo jsou sponzoři Motoristů a jaké mají zájmy? 🔴 Co řešil podnikatel Chlad se zločincem Krejčířem? 🔴 Proč se Češi stěhují do německé Žitavy? 🟣 Jaká jsou rizika dovozu opuštěných psů z Balkánu? ▶️ Naše nejnovější reportáže už jsou v iVysílání:\nhttps://www.ceskatelevize.cz/porady/1142743803-reporteri-ct/",
			shouldSkip: false
		},
		settings: DEFAULT_SETTINGS_WITH_URL_DOMAIN_FIXES
	},
	{
		id: "V314-J3",
		category: "v3.1.4 URL_DOMAIN_FIXES",
		description: "ORIGINAL BUG: VSE Rector article - must NOT produce double https://",
		priority: "HIGH",
		input: {
			TweetEmbedCode: 'Rektorem Vysoké školy ekonomické v Praze bude i příští čtyři roky odborník na komerční bankovnictví Petr Dvořák. Ekonom a nově zvolený poslanec za SPD Miroslav Ševčík z volby odstoupil.  <a href="https://ct24.ceskatelevize.cz/clanek/domaci/rektorem-vse-bude-i-pristi-ctyri-roky-dvorak-367516">ct24.ceskatelevize.cz/clanek…</a>',
			Text: "Rektorem Vysoké školy ekonomické v Praze bude i příští čtyři roky odborník na komerční bankovnictví Petr Dvořák. Ekonom a nově zvolený poslanec za SPD Miroslav Ševčík z volby odstoupil.",
			LinkToTweet: "https://x.com/CT24zive/status/1992957958171603170",
			FirstLinkUrl: "",
			UserName: "CT24zive"
		},
		expected: {
			output: "Rektorem Vysoké školy ekonomické v Praze bude i příští čtyři roky odborník na komerční bankovnictví Petr Dvořák. Ekonom a nově zvolený poslanec za SPD Miroslav Ševčík z volby odstoupil.\nhttps://ct24.ceskatelevize.cz/clanek/domaci/rektorem-vse-bude-i-pristi-ctyri-roky-dvorak-367516\nhttps://x.com/CT24zive/status/1992957958171603170",
			shouldSkip: false
		},
		settings: {
			...DEFAULT_SETTINGS_WITH_URL_DOMAIN_FIXES,
			FORCE_SHOW_ORIGIN_POSTURL: true // Original bug configuration
		}
	}
];

// Settings helper for v3.1.4 tests
const DEFAULT_SETTINGS_WITH_URL_DOMAIN_FIXES: AppSettings = {
	PHRASES_BANNED: [],
	PHRASES_REQUIRED: [],
	REPOST_ALLOWED: true,
	AMPERSAND_SAFE_CHAR: "⅋",
	CONTENT_REPLACEMENTS: [],
	POST_LENGTH: 444,
	POST_LENGTH_TRIM_STRATEGY: "smart",
	SMART_TOLERANCE_PERCENT: 12,
	URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"],
	URL_REPLACE_TO: "https://x.com/",
	URL_NO_TRIM_DOMAINS: [],
	URL_DOMAIN_FIXES: ["ct24.ceskatelevize.cz", "ceskatelevize.cz", "czch.tv"],
	FORCE_SHOW_ORIGIN_POSTURL: false,
	FORCE_SHOW_FEEDURL: false,
	SHOW_IMAGEURL: false,
	PREFIX_REPOST: " 𝕏📤 ",
	PREFIX_QUOTE: " 𝕏📝💬 ",
	PREFIX_IMAGE_URL: "",
	PREFIX_POST_URL: "\n",
	PREFIX_SELF_REFERENCE: "svůj post",
	MENTION_FORMATTING: { "TW": { type: "prefix", value: "https://x.com/" } },
	MOVE_URL_TO_END: false,
	POST_FROM: "TW",
	SHOW_REAL_NAME: true,
	SHOW_TITLE_AS_CONTENT: false,
	RSS_MAX_INPUT_CHARS: 1000
};

// Aggregate all v3.1.4 new tests
const ALL_V3_1_4_NEW_TESTS: TestCase[] = [
	...V3_1_4_GROUP_J_TESTS
];

///////////////////////////////////////////////////////////////////////////////
// UPDATED SUMMARY FOR v3.1.4
///////////////////////////////////////////////////////////////////////////////

console.log("");
console.log("=".repeat(80));
console.log("IFTTT Webhook Filter v3.1.4 - Complete Test Suite");
console.log("=".repeat(80));
console.log("");
console.log("PREVIOUS VERSIONS (baseline):");
console.log("  v3.0.3 Baseline Tests:                         125 tests");
console.log("  v3.1.0 Group A - MOVE_URL_TO_END:              4 tests");
console.log("  v3.1.0 Group B - FORCE_SHOW (original):        4 tests");
console.log("  v3.1.0 Group C - NOT & COMPLEX:                10 tests");
console.log("  v3.2.0 Group D - Unified Filtering:            21 tests");
console.log("  v3.2.0 Group E - Anchor Tag Hotfix:            12 tests");
console.log("  v3.1.2 Group F - FORCE_SHOW Fixes:             6 tests");
console.log("  v3.1.2 Group G - Whitespace Cleanup:           6 tests");
console.log("  v3.1.2 Group H - Combined Scenarios:           3 tests");
console.log("  v3.1.3 Group I - URL Deduplication:            8 tests");
console.log("");
console.log("NEW v3.1.4 Features:");
console.log("  Group J - URL_DOMAIN_FIXES ES5 Fix:           " + V3_1_4_GROUP_J_TESTS.length + " tests");
console.log("");
console.log("─".repeat(80));
console.log("TOTAL NEW v3.1.4 tests:                          " + ALL_V3_1_4_NEW_TESTS.length + " tests");
console.log("TOTAL INCLUDING all previous versions:           " + (201 + ALL_V3_1_4_NEW_TESTS.length) + " tests");
console.log("─".repeat(80));
console.log("");
console.log("🎯 CRITICAL v3.1.4 TEST AREAS:");
console.log("   ✅ URL_DOMAIN_FIXES without negative lookbehind (ES5 compatible)");
console.log("   ✅ Valid https:// URLs remain unchanged");
console.log("   ✅ No malformed double-protocol URLs (https://ct24.https://)");
console.log("   ✅ Real-world production bug cases (VSE Rector, ČT24, ČT RSS)");
console.log("   ✅ Inherited: URL deduplication (deduplicateTrailingUrls)");
console.log("   ✅ Inherited: Smart sentence detection (findLastSentenceEnd)");
console.log("");
console.log("=".repeat(80));

// Export for test runner
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		ALL_V3_1_2_NEW_TESTS,
		V3_1_2_GROUP_F_TESTS,
		V3_1_2_GROUP_G_TESTS,
		V3_1_2_GROUP_H_TESTS,
		ALL_V3_1_3_NEW_TESTS,
		V3_1_3_GROUP_I_TESTS,
		ALL_V3_1_4_NEW_TESTS,
		V3_1_4_GROUP_J_TESTS
	};
}
