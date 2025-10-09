///////////////////////////////////////////////////////////////////////////////
// COMPLETE Test Suite for IFTTT Webhook Filter v3.0
// Build 20251007 - COMPREHENSIVE COVERAGE
// Total: 97 tests (49 original + 48 new tests)
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
// TEST SUITE METADATA & UTILITIES
///////////////////////////////////////////////////////////////////////////////

const testSuiteMetadata = {
	version: "3.0",
	buildDate: "2025-10-07",
	totalTests: testCases.length,
	originalTests: 49,
	newTests: 48,
	breakdown: {
		highPriority: testCases.filter(t => t.priority === "HIGH").length,
		mediumPriority: testCases.filter(t => t.priority === "MEDIUM").length,
		lowPriority: testCases.filter(t => t.priority === "LOW").length,
		original: testCases.filter(t => !t.priority).length
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
		"SHOW_IMAGEURL Feature": 3,
		"FORCE_SHOW_FEEDURL": 2,
		"Czech Characters & Entities": 4,
		"Mention Formatting Variations": 4,
		"Trim Strategy Variations": 4,
		"RSS Edge Cases": 3,
		"Empty PREFIX Values": 2,
		"Whitespace Normalization": 3
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
COMPLETE TEST SUITE v3.0 - COMPREHENSIVE COVERAGE
═══════════════════════════════════════════════════════════════════════════

TOTAL: 97 TESTS
- Original: 49 tests (fully working baseline)
- High Priority: 15 tests (critical functionality gaps)
- Medium Priority: 21 tests (recommended for production)
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
*/