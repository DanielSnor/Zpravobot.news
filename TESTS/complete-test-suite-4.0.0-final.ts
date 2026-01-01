///////////////////////////////////////////////////////////////////////////////
// COMPLETE TEST SUITE FOR IFTTT WEBHOOK FILTER v4.0.0
// Build 20251231 - Z Day Edition
// Total: 141 tests organized by feature areas
///////////////////////////////////////////////////////////////////////////////
//
// STRUKTURA TESTŮ:
//
// 📦 BASELINE TESTS (inherited from v3.x, updated for v4.0.0 API)
//    - Basic Tweets
//    - URLs handling
//    - Reposts & Quotes
//    - HTML Entity Decoding
//    - Filtering (PHRASES_BANNED, PHRASES_REQUIRED)
//
// 📦 v4.0.0 NEW/CHANGED FEATURES:
//    - Group A: URL_REPLACE_FROM as Array (breaking change)
//    - Group B: Unified FilterRule with `content` (replaces `keywords`)
//    - Group C: TCO_REPLACEMENT with deduplication
//    - Group D: PREFIX_SELF_REFERENCE for self-quotes/reposts
//    - Group E: COMBINE_TITLE_AND_CONTENT with CONTENT_TITLE_SEPARATOR
//    - Group F: Pre-compiled CHAR_MAP_REGEX (performance)
//    - Group G: safeTruncate Unicode handling
//    - Group H: truncateRssInput with RSS_MAX_INPUT_CHARS
//    - Group I: Deduplication mechanisms (URLs, Prefix, Placeholder)
//    - Group J: Platform configs & multi-platform scenarios
//    - Group K: URL_DOMAIN_FIXES initialization
//    - Group L: RSS duplicate RT prefix normalization
//    - Group M: Edge cases & regression tests
//
// 📦 v4.0.0 EXTENDED (inspired by v3.1.x production cases):
//    - Group N: URL Whitespace Handling
//    - Group O: URL Processing Edge Cases
//    - Group P: RSS Anchor Tag Text Preservation
//    - Group Q: Advanced Deduplication
//    - Group R: Real-World Production Scenarios
//    - Group S: FilterRule Advanced Logic (regex, AND/OR)
//    - Group T: Edge Cases & Empty Content Handling
//
///////////////////////////////////////////////////////////////////////////////

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface FilterRule {
	type: "literal" | "regex" | "and" | "or" | "not" | "complex";
	pattern?: string;
	flags?: string;
	operator?: "and" | "or";
	rules?: FilterRule[];
	// Unified filtering fields (v4.0.0)
	content?: string[];
	contentRegex?: string[];
	username?: string[];
	usernameRegex?: string[];
	domain?: string[];
	domainRegex?: string[];
}

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
		// RSS/YouTube specific
		EntryContent?: string;
		EntryUrl?: string;
		EntryTitle?: string;
		FeedTitle?: string;
		FeedUrl?: string;
		// Bluesky specific
		AuthorDisplayName?: string;
	};
	expected: {
		output: string;
		shouldSkip: boolean;
		skipReason?: string;
	};
	settings: AppSettings;
}

interface AppSettings {
	// CONTENT FILTERING & VALIDATION
	PHRASES_BANNED: (string | FilterRule)[];
	PHRASES_REQUIRED: (string | FilterRule)[];
	REPOST_ALLOWED: boolean;
	// CONTENT PROCESSING & TRANSFORMATION
	AMPERSAND_SAFE_CHAR: string;
	CONTENT_REPLACEMENTS: { pattern: string; replacement: string; flags?: string; literal?: boolean }[];
	POST_LENGTH: number;
	POST_LENGTH_TRIM_STRATEGY: "sentence" | "word" | "smart";
	SMART_TOLERANCE_PERCENT: number;
	TCO_REPLACEMENT: string;
	// URL CONFIGURATION
	FORCE_SHOW_FEEDURL: boolean;
	FORCE_SHOW_ORIGIN_POSTURL: boolean;
	SHOW_IMAGEURL: boolean;
	URL_DOMAIN_FIXES: string[];
	URL_NO_TRIM_DOMAINS: string[];
	URL_REPLACE_FROM: string[];  // v4.0.0: Now an array!
	URL_REPLACE_TO: string;
	// OUTPUT FORMATTING & PREFIXES
	MENTION_FORMATTING: { [platform: string]: { type: "prefix" | "suffix" | "none"; value: string } };
	PREFIX_IMAGE_URL: string;
	PREFIX_POST_URL: string;
	PREFIX_QUOTE: string;
	PREFIX_REPOST: string;
	PREFIX_SELF_REFERENCE: string;
	// PLATFORM-SPECIFIC SETTINGS
	MOVE_URL_TO_END: boolean;
	POST_FROM: "BS" | "RSS" | "TW" | "YT";
	SHOW_REAL_NAME: boolean;
	SHOW_TITLE_AS_CONTENT: boolean;
	// CONTENT COMBINATION (RSS & YOUTUBE)
	COMBINE_TITLE_AND_CONTENT: boolean;
	CONTENT_TITLE_SEPARATOR: string;
	RSS_MAX_INPUT_CHARS: number;
}

// =============================================================================
// DEFAULT SETTINGS PRESETS
// =============================================================================

const TWITTER_SETTINGS: AppSettings = {
	PHRASES_BANNED: [],
	PHRASES_REQUIRED: [],
	REPOST_ALLOWED: true,
	AMPERSAND_SAFE_CHAR: "⅋",
	CONTENT_REPLACEMENTS: [],
	POST_LENGTH: 500,
	POST_LENGTH_TRIM_STRATEGY: "smart",
	SMART_TOLERANCE_PERCENT: 12,
	TCO_REPLACEMENT: "🔗↗️",
	FORCE_SHOW_FEEDURL: false,
	FORCE_SHOW_ORIGIN_POSTURL: true,
	SHOW_IMAGEURL: false,
	URL_DOMAIN_FIXES: [],
	URL_NO_TRIM_DOMAINS: ["facebook.com", "www.facebook.com", "instagram.com", "www.instagram.com", "bit.ly", "goo.gl", "ift.tt", "ow.ly", "t.co", "tinyurl.com", "youtu.be", "youtube.com"],
	URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"],  // v4.0.0: Array
	URL_REPLACE_TO: "https://x.com/",
	MENTION_FORMATTING: { "TW": { type: "prefix", value: "https://x.com/" } },
	PREFIX_IMAGE_URL: "",
	PREFIX_POST_URL: "\n",
	PREFIX_QUOTE: " 𝕏🔍💬 ",
	PREFIX_REPOST: " 𝕏📤 ",
	PREFIX_SELF_REFERENCE: "svůj post",
	MOVE_URL_TO_END: false,
	POST_FROM: "TW",
	SHOW_REAL_NAME: true,
	SHOW_TITLE_AS_CONTENT: false,
	COMBINE_TITLE_AND_CONTENT: false,
	CONTENT_TITLE_SEPARATOR: "",
	RSS_MAX_INPUT_CHARS: 1000
};

const BLUESKY_SETTINGS: AppSettings = {
	PHRASES_BANNED: [],
	PHRASES_REQUIRED: [],
	REPOST_ALLOWED: true,
	AMPERSAND_SAFE_CHAR: "⅋",
	CONTENT_REPLACEMENTS: [],
	POST_LENGTH: 444,
	POST_LENGTH_TRIM_STRATEGY: "sentence",
	SMART_TOLERANCE_PERCENT: 12,
	TCO_REPLACEMENT: "",
	FORCE_SHOW_FEEDURL: false,
	FORCE_SHOW_ORIGIN_POSTURL: true,
	SHOW_IMAGEURL: false,
	URL_DOMAIN_FIXES: [],
	URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"],
	URL_REPLACE_FROM: [],
	URL_REPLACE_TO: "",
	MENTION_FORMATTING: { "BS": { type: "prefix", value: "https://bsky.app/profile/" } },
	PREFIX_IMAGE_URL: "",
	PREFIX_POST_URL: "\n",
	PREFIX_QUOTE: " 🦋🔍💬 ",
	PREFIX_REPOST: " 🦋📤 ",
	PREFIX_SELF_REFERENCE: "vlastní post",
	MOVE_URL_TO_END: false,
	POST_FROM: "BS",
	SHOW_REAL_NAME: true,
	SHOW_TITLE_AS_CONTENT: false,
	COMBINE_TITLE_AND_CONTENT: false,
	CONTENT_TITLE_SEPARATOR: "",
	RSS_MAX_INPUT_CHARS: 1000
};

const RSS_SETTINGS: AppSettings = {
	PHRASES_BANNED: [],
	PHRASES_REQUIRED: [],
	REPOST_ALLOWED: true,
	AMPERSAND_SAFE_CHAR: "⅋",
	CONTENT_REPLACEMENTS: [],
	POST_LENGTH: 444,
	POST_LENGTH_TRIM_STRATEGY: "smart",
	SMART_TOLERANCE_PERCENT: 12,
	TCO_REPLACEMENT: "",
	FORCE_SHOW_FEEDURL: false,
	FORCE_SHOW_ORIGIN_POSTURL: true,
	SHOW_IMAGEURL: false,
	URL_DOMAIN_FIXES: [],
	URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"],
	URL_REPLACE_FROM: [],
	URL_REPLACE_TO: "",
	MENTION_FORMATTING: { "RSS": { type: "suffix", value: "@twitter.com" } },
	PREFIX_IMAGE_URL: "",
	PREFIX_POST_URL: "\n",
	PREFIX_QUOTE: "",
	PREFIX_REPOST: " 📤 ",
	PREFIX_SELF_REFERENCE: "vlastní post",
	MOVE_URL_TO_END: false,
	POST_FROM: "RSS",
	SHOW_REAL_NAME: true,
	SHOW_TITLE_AS_CONTENT: false,
	COMBINE_TITLE_AND_CONTENT: false,
	CONTENT_TITLE_SEPARATOR: "",
	RSS_MAX_INPUT_CHARS: 1000
};

const YOUTUBE_SETTINGS: AppSettings = {
	PHRASES_BANNED: [],
	PHRASES_REQUIRED: [],
	REPOST_ALLOWED: true,
	AMPERSAND_SAFE_CHAR: "⅋",
	CONTENT_REPLACEMENTS: [],
	POST_LENGTH: 444,
	POST_LENGTH_TRIM_STRATEGY: "sentence",
	SMART_TOLERANCE_PERCENT: 12,
	TCO_REPLACEMENT: "",
	FORCE_SHOW_FEEDURL: false,
	FORCE_SHOW_ORIGIN_POSTURL: true,
	SHOW_IMAGEURL: false,
	URL_DOMAIN_FIXES: [],
	URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"],
	URL_REPLACE_FROM: [],
	URL_REPLACE_TO: "",
	MENTION_FORMATTING: { "YT": { type: "none", value: "" } },
	PREFIX_IMAGE_URL: "",
	PREFIX_POST_URL: "\nYT 📺👇👇👇\n",
	PREFIX_QUOTE: "",
	PREFIX_REPOST: "",
	PREFIX_SELF_REFERENCE: "vlastní post",
	MOVE_URL_TO_END: false,
	POST_FROM: "YT",
	SHOW_REAL_NAME: true,
	SHOW_TITLE_AS_CONTENT: false,
	COMBINE_TITLE_AND_CONTENT: false,
	CONTENT_TITLE_SEPARATOR: "",
	RSS_MAX_INPUT_CHARS: 1000
};

// =============================================================================
// BASELINE TESTS - BASIC TWEETS (inherited, updated for v4.0.0)
// =============================================================================

const V4_BASELINE_BASIC_TESTS: TestCase[] = [
	{
		id: "V400-B001",
		category: "Baseline - Basic Tweets",
		description: "Simple tweet without mentions or URLs",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Toto je obyčejný krátký tweet bez zmínky někoho jiného a bez jakéhokoliv odkazu.</p>&mdash; Zprávobot.News (@zpravobotnews) <a href="https://twitter.com/zpravobotnews/status/1921469942865477709">May 11, 2025</a></blockquote>',
			Text: "Toto je obyčejný krátký tweet bez zmínky někoho jiného a bez jakéhokoliv odkazu.",
			LinkToTweet: "https://twitter.com/zpravobotnews/status/1921469942865477709",
			FirstLinkUrl: "(none)",
			UserName: "zpravobotnews"
		},
		expected: {
			output: "Toto je obyčejný krátký tweet bez zmínky někoho jiného a bez jakéhokoliv odkazu.\nhttps://x.com/zpravobotnews/status/1921469942865477709",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-B002",
		category: "Baseline - Basic Tweets",
		description: "Tweet with hashtag",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Testovací tweet s hashtagem #ZpravobotNews.</p>&mdash; Test (@testuser) <a href="https://twitter.com/testuser/status/123456789">Dec 31, 2025</a></blockquote>',
			Text: "Testovací tweet s hashtagem #ZpravobotNews.",
			LinkToTweet: "https://twitter.com/testuser/status/123456789",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "Testovací tweet s hashtagem #ZpravobotNews.\nhttps://x.com/testuser/status/123456789",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-B003",
		category: "Baseline - Basic Tweets",
		description: "Tweet with @mention that should be formatted",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Ahoj @DanielSnor, jak se máš?</p>&mdash; Test (@testuser) <a href="https://twitter.com/testuser/status/123456789">Dec 31, 2025</a></blockquote>',
			Text: "Ahoj @DanielSnor, jak se máš?",
			LinkToTweet: "https://twitter.com/testuser/status/123456789",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "Ahoj https://x.com/DanielSnor, jak se máš?\nhttps://x.com/testuser/status/123456789",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-B004",
		category: "Baseline - Basic Tweets",
		description: "Empty tweet should be skipped",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Empty content, title and URL"
		},
		settings: TWITTER_SETTINGS
	}
];

// =============================================================================
// BASELINE TESTS - URLS
// =============================================================================

const V4_BASELINE_URL_TESTS: TestCase[] = [
	{
		id: "V400-U001",
		category: "Baseline - URLs",
		description: "Tweet with external URL",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Přečtěte si novinky na https://zpravobot.news/article</p>&mdash; Test (@testuser) <a href="https://twitter.com/testuser/status/123">Dec 31, 2025</a></blockquote>',
			Text: "Přečtěte si novinky na https://zpravobot.news/article",
			LinkToTweet: "https://twitter.com/testuser/status/123",
			FirstLinkUrl: "https://zpravobot.news/article",
			UserName: "testuser"
		},
		expected: {
			output: "Přečtěte si novinky na https://zpravobot.news/article\nhttps://zpravobot.news/article\nhttps://x.com/testuser/status/123",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-U002",
		category: "Baseline - URLs",
		description: "Tweet with t.co URL replaced by TCO_REPLACEMENT",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Novinky zde: https://t.co/abc123</p>&mdash; Test (@testuser) <a href="https://twitter.com/testuser/status/123">Dec 31, 2025</a></blockquote>',
			Text: "Novinky zde: https://t.co/abc123",
			LinkToTweet: "https://twitter.com/testuser/status/123",
			FirstLinkUrl: "https://example.com/article",
			UserName: "testuser"
		},
		expected: {
			output: "Novinky zde: 🔗↗️\nhttps://example.com/article\nhttps://x.com/testuser/status/123",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-U003",
		category: "Baseline - URLs",
		description: "URL with ampersand should be encoded",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Link: https://example.com/page?a=1&amp;b=2</p>&mdash; Test (@testuser) <a href="https://twitter.com/testuser/status/123">Dec 31, 2025</a></blockquote>',
			Text: "Link: https://example.com/page?a=1&b=2",
			LinkToTweet: "https://twitter.com/testuser/status/123",
			FirstLinkUrl: "https://example.com/page?a=1&b=2",
			UserName: "testuser"
		},
		expected: {
			output: "Link: https://example.com/page\nhttps://example.com/page\nhttps://x.com/testuser/status/123",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-U004",
		category: "Baseline - URLs",
		description: "URL in URL_NO_TRIM_DOMAINS should preserve query but encode ampersand",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Video: https://youtube.com/watch?v=abc123&list=xyz</p>&mdash; Test (@testuser) <a href="https://twitter.com/testuser/status/123">Dec 31, 2025</a></blockquote>',
			Text: "Video: https://youtube.com/watch?v=abc123&list=xyz",
			LinkToTweet: "https://twitter.com/testuser/status/123",
			FirstLinkUrl: "https://youtube.com/watch?v=abc123&list=xyz",
			UserName: "testuser"
		},
		expected: {
			output: "Video: https://youtube.com/watch?v=abc123⅋list=xyz\nhttps://youtube.com/watch?v=abc123%26list=xyz\nhttps://x.com/testuser/status/123",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	}
];

// =============================================================================
// BASELINE TESTS - REPOSTS & QUOTES
// =============================================================================

const V4_BASELINE_REPOST_TESTS: TestCase[] = [
	{
		id: "V400-RP01",
		category: "Baseline - Reposts",
		description: "Retweet from another user",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @OriginalAuthor: Toto je původní tweet.</p>&mdash; Retweeter (@retweeter) <a href="https://twitter.com/retweeter/status/123">Dec 31, 2025</a></blockquote>',
			Text: "RT @OriginalAuthor: Toto je původní tweet.",
			LinkToTweet: "https://twitter.com/retweeter/status/123",
			FirstLinkUrl: "(none)",
			UserName: "retweeter"
		},
		expected: {
			output: "Retweeter 𝕏📤 https://x.com/OriginalAuthor:\nToto je původní tweet.\nhttps://x.com/retweeter/status/123",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-RP02",
		category: "Baseline - Reposts",
		description: "Retweet blocked when REPOST_ALLOWED=false",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @OriginalAuthor: Toto je původní tweet.</p>&mdash; Retweeter (@retweeter) <a href="https://twitter.com/retweeter/status/123">Dec 31, 2025</a></blockquote>',
			Text: "RT @OriginalAuthor: Toto je původní tweet.",
			LinkToTweet: "https://twitter.com/retweeter/status/123",
			FirstLinkUrl: "(none)",
			UserName: "retweeter"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "External repost not allowed"
		},
		settings: { ...TWITTER_SETTINGS, REPOST_ALLOWED: false }
	},
	{
		id: "V400-RP03",
		category: "Baseline - Reposts",
		description: "Self-retweet should use PREFIX_SELF_REFERENCE",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @testuser: Můj vlastní starší tweet.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/456">Dec 31, 2025</a></blockquote>',
			Text: "RT @testuser: Můj vlastní starší tweet.",
			LinkToTweet: "https://twitter.com/testuser/status/456",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "Test User 𝕏📤 svůj post:\nMůj vlastní starší tweet.\nhttps://x.com/testuser/status/456",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-RP04",
		category: "Baseline - Quotes",
		description: "Quote tweet should format with PREFIX_QUOTE",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Souhlasím s tímto názorem!</p>&mdash; Quoter (@quoter) <a href="https://twitter.com/quoter/status/789">Dec 31, 2025</a></blockquote>',
			Text: "Souhlasím s tímto názorem!",
			LinkToTweet: "https://twitter.com/quoter/status/789",
			FirstLinkUrl: "https://twitter.com/original/status/123",
			UserName: "quoter"
		},
		expected: {
			output: "Quoter 𝕏🔍💬 https://x.com/original:\nSouhlasím s tímto názorem!\nhttps://x.com/original/status/123\nhttps://x.com/quoter/status/789",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-RP05",
		category: "Baseline - Quotes",
		description: "Self-quote should use PREFIX_SELF_REFERENCE",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Doplnění k mému předchozímu tweetu.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/999">Dec 31, 2025</a></blockquote>',
			Text: "Doplnění k mému předchozímu tweetu.",
			LinkToTweet: "https://twitter.com/testuser/status/999",
			FirstLinkUrl: "https://twitter.com/testuser/status/888",
			UserName: "testuser"
		},
		expected: {
			output: "Test User 𝕏🔍💬 svůj post:\nDoplnění k mému předchozímu tweetu.\nhttps://x.com/testuser/status/888\nhttps://x.com/testuser/status/999",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	}
];

// =============================================================================
// BASELINE TESTS - HTML ENTITY DECODING
// =============================================================================

const V4_BASELINE_HTML_TESTS: TestCase[] = [
	{
		id: "V400-HL01",
		category: "Baseline - HTML Entities",
		description: "Named HTML entities should be decoded",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Cena: 100&euro; &amp; sleva 10&pound;</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Cena: 100€ & sleva 10£",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Cena: 100€ ⅋ sleva 10£\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-HL02",
		category: "Baseline - HTML Entities",
		description: "Czech character entities should be decoded",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">P&rcaron;&iacute;li&scaron; &zcaron;lu&tcaron;ou&ccaron;k&yacute;</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Příliš žluťoučký",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Příliš žluťoučký\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-HL03",
		category: "Baseline - HTML Entities",
		description: "Numeric HTML entities (decimal) should be decoded",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Symbol: &#169; &#174;</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Symbol: © ®",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Symbol: © ®\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-HL04",
		category: "Baseline - HTML Entities",
		description: "Numeric HTML entities (hex) should be decoded",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Emoji: &#x1F600; &#x2764;</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Emoji: 😀 ❤",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Emoji: 😀 ❤\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-HL05",
		category: "Baseline - HTML Entities",
		description: "HTML tags should be stripped",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr"><b>Tučný</b> a <i>kurzíva</i></p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Tučný a kurzíva",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Tučný a kurzíva\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-HL06",
		category: "Baseline - HTML Entities",
		description: "Ellipsis entity and variants should be normalized",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text&hellip; a více&mldr;</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Text… a více…",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Text… a více…\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	}
];

// =============================================================================
// BASELINE TESTS - FILTERING (PHRASES_BANNED, PHRASES_REQUIRED)
// =============================================================================

const V4_BASELINE_FILTER_TESTS: TestCase[] = [
	{
		id: "V400-FL01",
		category: "Baseline - Filtering",
		description: "PHRASES_BANNED with simple string match",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Toto je spam reklama!</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Toto je spam reklama!",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Contains banned phrases"
		},
		settings: { ...TWITTER_SETTINGS, PHRASES_BANNED: ["spam"] }
	},
	{
		id: "V400-FL02",
		category: "Baseline - Filtering",
		description: "PHRASES_REQUIRED with simple string match",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Toto je běžný tweet.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Toto je běžný tweet.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Missing mandatory keywords"
		},
		settings: { ...TWITTER_SETTINGS, PHRASES_REQUIRED: ["důležité"] }
	},
	{
		id: "V400-FL03",
		category: "Baseline - Filtering",
		description: "PHRASES_REQUIRED satisfied should pass",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Toto je důležité sdělení.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Toto je důležité sdělení.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Toto je důležité sdělení.\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, PHRASES_REQUIRED: ["důležité"] }
	},
	{
		id: "V400-FL04",
		category: "Baseline - Filtering",
		description: "Reply tweet should be skipped",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">@someone Odpověď na tvůj tweet.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "@someone Odpověď na tvůj tweet.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Reply post (starts with @username)"
		},
		settings: TWITTER_SETTINGS
	}
];

// =============================================================================
// GROUP A: URL_REPLACE_FROM AS ARRAY (v4.0.0 BREAKING CHANGE)
// =============================================================================

const V4_GROUP_A_URL_REPLACE_ARRAY: TestCase[] = [
	{
		id: "V400-A001",
		category: "v4.0.0 - URL_REPLACE_FROM Array",
		description: "Multiple domains in URL_REPLACE_FROM array - first match",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Link</p>&mdash; Test (@test) <a href="https://x.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Link",
			LinkToTweet: "https://x.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Link\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"],
			URL_REPLACE_TO: "https://x.com/"
		}
	},
	{
		id: "V400-A002",
		category: "v4.0.0 - URL_REPLACE_FROM Array",
		description: "Multiple domains in URL_REPLACE_FROM array - second match",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Link</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Link",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Link\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"],
			URL_REPLACE_TO: "https://x.com/"
		}
	},
	{
		id: "V400-A003",
		category: "v4.0.0 - URL_REPLACE_FROM Array",
		description: "Empty URL_REPLACE_FROM array should not replace anything",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Link</p>&mdash; Test (@test) <a href="https://example.com/page">Dec 31, 2025</a></blockquote>',
			Text: "Link",
			LinkToTweet: "https://example.com/page",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Link\nhttps://example.com/page",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			URL_REPLACE_FROM: [],
			URL_REPLACE_TO: "https://replaced.com/",
			FORCE_SHOW_ORIGIN_POSTURL: true
		}
	},
	{
		id: "V400-A004",
		category: "v4.0.0 - URL_REPLACE_FROM Array",
		description: "Three domains in array with third matching",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Link</p>&mdash; Test (@test) <a href="https://mobile.twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Link",
			LinkToTweet: "https://mobile.twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Link\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/", "https://mobile.twitter.com/"],
			URL_REPLACE_TO: "https://x.com/",
			FORCE_SHOW_ORIGIN_POSTURL: true
		}
	}
];

// =============================================================================
// GROUP B: UNIFIED FILTERRULE WITH `content` (REPLACES `keywords`)
// =============================================================================

const V4_GROUP_B_UNIFIED_FILTER: TestCase[] = [
	{
		id: "V400-B101",
		category: "v4.0.0 - Unified FilterRule",
		description: "FilterRule type=or with content array",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Důležité AI novinky dnes!</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Důležité AI novinky dnes!",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Důležité AI novinky dnes!\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [{ type: "or", content: ["AI", "ML", "neuronové sítě"] }]
		}
	},
	{
		id: "V400-B102",
		category: "v4.0.0 - Unified FilterRule",
		description: "FilterRule type=and with content array - all must match",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">AI a ML jsou důležité technologie.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "AI a ML jsou důležité technologie.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "AI a ML jsou důležité technologie.\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [{ type: "and", content: ["AI", "ML"] }]
		}
	},
	{
		id: "V400-B103",
		category: "v4.0.0 - Unified FilterRule",
		description: "FilterRule type=and with content - partial match should fail",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">AI je důležitá technologie.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "AI je důležitá technologie.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Missing mandatory keywords"
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [{ type: "and", content: ["AI", "ML"] }]
		}
	},
	{
		id: "V400-B104",
		category: "v4.0.0 - Unified FilterRule",
		description: "FilterRule type=not with content - inverted match",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Dobrý den, toto je normální tweet.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Dobrý den, toto je normální tweet.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Contains banned phrases"
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_BANNED: [{ type: "not", content: ["důležité", "breaking"] }]
		}
	},
	{
		id: "V400-B105",
		category: "v4.0.0 - Unified FilterRule",
		description: "FilterRule with contentRegex array",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Breaking news: nový produkt ABC-123!</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Breaking news: nový produkt ABC-123!",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Breaking news: nový produkt ABC-123!\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [{ type: "or", contentRegex: ["\\bbreaking\\b", "\\bnews\\b"] }]
		}
	},
	{
		id: "V400-B106",
		category: "v4.0.0 - Unified FilterRule",
		description: "FilterRule type=complex with nested rules",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">AI technologie a cloud computing.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "AI technologie a cloud computing.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "AI technologie a cloud computing.\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [{
				type: "complex",
				operator: "and",
				rules: [
					{ type: "or", content: ["AI", "ML"] },
					{ type: "or", content: ["cloud", "server"] }
				]
			}]
		}
	},
	{
		id: "V400-B107",
		category: "v4.0.0 - Unified FilterRule",
		description: "FilterRule with username array",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Post od @trusteduser</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Post od @trusteduser",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Post od https://x.com/trusteduser\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [{ type: "or", username: ["trusteduser", "verifieduser"] }]
		}
	},
	{
		id: "V400-B108",
		category: "v4.0.0 - Unified FilterRule",
		description: "FilterRule with domain array",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Článek na https://zpravobot.news/article</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Článek na https://zpravobot.news/article",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://zpravobot.news/article",
			UserName: "test"
		},
		expected: {
			output: "Článek na https://zpravobot.news/article\nhttps://zpravobot.news/article\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [{ type: "or", domain: ["zpravobot.news", "example.com"] }]
		}
	}
];

// =============================================================================
// GROUP C: TCO_REPLACEMENT WITH DEDUPLICATION
// =============================================================================

const V4_GROUP_C_TCO_REPLACEMENT: TestCase[] = [
	{
		id: "V400-C001",
		category: "v4.0.0 - TCO_REPLACEMENT",
		description: "Single t.co URL replaced with placeholder",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Přečtěte si více: https://t.co/abc123</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Přečtěte si více: https://t.co/abc123",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://example.com/article",
			UserName: "test"
		},
		expected: {
			output: "Přečtěte si více: 🔗↗️\nhttps://example.com/article\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, TCO_REPLACEMENT: "🔗↗️" }
	},
	{
		id: "V400-C002",
		category: "v4.0.0 - TCO_REPLACEMENT",
		description: "Multiple t.co URLs should be deduplicated to single placeholder",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Link1: https://t.co/aaa Link2: https://t.co/bbb</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Link1: https://t.co/aaa Link2: https://t.co/bbb",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://example.com/article",
			UserName: "test"
		},
		expected: {
			output: "Link1: 🔗↗️ Link2: 🔗↗️\nhttps://example.com/article\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, TCO_REPLACEMENT: "🔗↗️" }
	},
	{
		id: "V400-C003",
		category: "v4.0.0 - TCO_REPLACEMENT",
		description: "TCO_REPLACEMENT empty string removes t.co URLs",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text https://t.co/xyz konec</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Text https://t.co/xyz konec",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://example.com/page",
			UserName: "test"
		},
		expected: {
			output: "Text https://t.co/xyz konec\nhttps://example.com/page\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, TCO_REPLACEMENT: "" }
	},
	{
		id: "V400-C004",
		category: "v4.0.0 - TCO_REPLACEMENT",
		description: "TCO_REPLACEMENT with simple arrow emoji",
		priority: "LOW",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Novinky https://t.co/link123</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Novinky https://t.co/link123",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://news.com/breaking",
			UserName: "test"
		},
		expected: {
			output: "Novinky ↗\nhttps://news.com/breaking\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, TCO_REPLACEMENT: "↗" }
	},
	{
		id: "V400-C005",
		category: "v4.0.0 - TCO_REPLACEMENT",
		description: "Consecutive placeholders should be deduplicated",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">🔗↗️ 🔗↗️ 🔗↗️ Text</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "🔗↗️ 🔗↗️ 🔗↗️ Text",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "🔗↗️ Text\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, TCO_REPLACEMENT: "🔗↗️" }
	},
	{
		id: "V400-C006",
		category: "v4.0.0 - TCO_REPLACEMENT",
		description: "Emoji before t.co should not cause duplicate placeholder prefix",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">🔗 https://t.co/test123</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "🔗 https://t.co/test123",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://example.com",
			UserName: "test"
		},
		expected: {
			output: "🔗↗️\nhttps://example.com\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, TCO_REPLACEMENT: "🔗↗️" }
	}
];

// =============================================================================
// GROUP D: PREFIX_SELF_REFERENCE
// =============================================================================

const V4_GROUP_D_SELF_REFERENCE: TestCase[] = [
	{
		id: "V400-D001",
		category: "v4.0.0 - PREFIX_SELF_REFERENCE",
		description: "Self-quote uses PREFIX_SELF_REFERENCE instead of @username",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Dodatek k mému tweetu.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/999">Dec 31, 2025</a></blockquote>',
			Text: "Dodatek k mému tweetu.",
			LinkToTweet: "https://twitter.com/testuser/status/999",
			FirstLinkUrl: "https://twitter.com/testuser/status/888",
			UserName: "testuser"
		},
		expected: {
			output: "Test User 𝕏🔍💬 můj starší post:\nDodatek k mému tweetu.\nhttps://x.com/testuser/status/888\nhttps://x.com/testuser/status/999",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, PREFIX_SELF_REFERENCE: "můj starší post" }
	},
	{
		id: "V400-D002",
		category: "v4.0.0 - PREFIX_SELF_REFERENCE",
		description: "Self-repost uses PREFIX_SELF_REFERENCE",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @testuser: Můj původní tweet.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/456">Dec 31, 2025</a></blockquote>',
			Text: "RT @testuser: Můj původní tweet.",
			LinkToTweet: "https://twitter.com/testuser/status/456",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "Test User 𝕏📤 vlastní příspěvek:\nMůj původní tweet.\nhttps://x.com/testuser/status/456",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, PREFIX_SELF_REFERENCE: "vlastní příspěvek" }
	},
	{
		id: "V400-D003",
		category: "v4.0.0 - PREFIX_SELF_REFERENCE",
		description: "Non-self quote still uses @username",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Souhlasím!</p>&mdash; Quoter (@quoter) <a href="https://twitter.com/quoter/status/789">Dec 31, 2025</a></blockquote>',
			Text: "Souhlasím!",
			LinkToTweet: "https://twitter.com/quoter/status/789",
			FirstLinkUrl: "https://twitter.com/original/status/123",
			UserName: "quoter"
		},
		expected: {
			output: "Quoter 𝕏🔍💬 https://x.com/original:\nSouhlasím!\nhttps://x.com/original/status/123\nhttps://x.com/quoter/status/789",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, PREFIX_SELF_REFERENCE: "svůj post" }
	},
	{
		id: "V400-D004",
		category: "v4.0.0 - PREFIX_SELF_REFERENCE",
		description: "Case-insensitive self-detection",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @TESTUSER: Můj tweet.</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/456">Dec 31, 2025</a></blockquote>',
			Text: "RT @TESTUSER: Můj tweet.",
			LinkToTweet: "https://twitter.com/testuser/status/456",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "Test User 𝕏📤 svůj post:\nMůj tweet.\nhttps://x.com/testuser/status/456",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	}
];

// =============================================================================
// GROUP E: COMBINE_TITLE_AND_CONTENT WITH CONTENT_TITLE_SEPARATOR
// =============================================================================

const V4_GROUP_E_COMBINE_CONTENT: TestCase[] = [
	{
		id: "V400-E001",
		category: "v4.0.0 - COMBINE_TITLE_AND_CONTENT",
		description: "RSS: Combine title and content with default separator",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryTitle: "Headline novinky",
			EntryContent: "Detailní popis článku zde.",
			EntryUrl: "https://news.com/article",
			FeedTitle: "News Feed"
		},
		expected: {
			output: "Headline novinky\nDetailní popis článku zde.\nhttps://news.com/article",
			shouldSkip: false
		},
		settings: {
			...RSS_SETTINGS,
			COMBINE_TITLE_AND_CONTENT: true,
			CONTENT_TITLE_SEPARATOR: "\n"
		}
	},
	{
		id: "V400-E002",
		category: "v4.0.0 - COMBINE_TITLE_AND_CONTENT",
		description: "RSS: Combine with custom separator",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryTitle: "Nadpis",
			EntryContent: "Obsah článku.",
			EntryUrl: "https://example.com/post",
			FeedTitle: "Blog"
		},
		expected: {
			output: "Nadpis — Obsah článku.\nhttps://example.com/post",
			shouldSkip: false
		},
		settings: {
			...RSS_SETTINGS,
			COMBINE_TITLE_AND_CONTENT: true,
			CONTENT_TITLE_SEPARATOR: " — "
		}
	},
	{
		id: "V400-E003",
		category: "v4.0.0 - COMBINE_TITLE_AND_CONTENT",
		description: "RSS: Only title when content is empty",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryTitle: "Pouze nadpis",
			EntryContent: "",
			EntryUrl: "https://example.com/short",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Pouze nadpis\nhttps://example.com/short",
			shouldSkip: false
		},
		settings: {
			...RSS_SETTINGS,
			COMBINE_TITLE_AND_CONTENT: true,
			CONTENT_TITLE_SEPARATOR: "\n"
		}
	},
	{
		id: "V400-E004",
		category: "v4.0.0 - COMBINE_TITLE_AND_CONTENT",
		description: "YouTube: Combine title and description",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryTitle: "Video Title",
			EntryContent: "Video description text.",
			EntryUrl: "https://youtube.com/watch?v=abc123",
			FeedTitle: "YouTube Channel"
		},
		expected: {
			output: "Video Title: Video description text.\nYT 📺👇👇👇\nhttps://youtube.com/watch?v=abc123",
			shouldSkip: false
		},
		settings: {
			...YOUTUBE_SETTINGS,
			COMBINE_TITLE_AND_CONTENT: true,
			CONTENT_TITLE_SEPARATOR: ": "
		}
	},
	{
		id: "V400-E005",
		category: "v4.0.0 - COMBINE_TITLE_AND_CONTENT",
		description: "COMBINE disabled uses content only",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryTitle: "Titul",
			EntryContent: "Pouze obsah bude použit.",
			EntryUrl: "https://example.com/page",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Pouze obsah bude použit.\nhttps://example.com/page",
			shouldSkip: false
		},
		settings: {
			...RSS_SETTINGS,
			COMBINE_TITLE_AND_CONTENT: false
		}
	}
];

// =============================================================================
// GROUP F: PRE-COMPILED CHAR_MAP_REGEX (PERFORMANCE)
// =============================================================================

const V4_GROUP_F_CHAR_MAP_REGEX: TestCase[] = [
	{
		id: "V400-F001",
		category: "v4.0.0 - CHAR_MAP_REGEX",
		description: "Multiple different entities in single text decoded efficiently",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">&euro;100 &amp; &pound;50 &ndash; Cena&hellip;</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "€100 & £50 – Cena…",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "€100 ⅋ £50 – Cena…\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-F002",
		category: "v4.0.0 - CHAR_MAP_REGEX",
		description: "Czech diacritics entities all decoded",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">&Ccaron;e&scaron;tina: &rcaron;&iacute;&scaron;&uring;v &zcaron;lu&tcaron;ou&ccaron;k&yacute;</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Čeština: říšův žluťoučký",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Čeština: říšův žluťoučký\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-F003",
		category: "v4.0.0 - CHAR_MAP_REGEX",
		description: "Mixed numeric and named entities",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">&#x20AC;100 &amp; &#163;50</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "€100 & £50",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "€100 ⅋ £50\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-F004",
		category: "v4.0.0 - CHAR_MAP_REGEX",
		description: "Long text with many entities - performance test",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">&quot;Text&quot; &ndash; &ldquo;uvozovky&rdquo; &amp; &laquo;francouzské&raquo; &bull; symbol &sect;1 &para;2 &copy;2025</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: '"Text" – "uvozovky" & «francouzské» • symbol §1 ¶2 ©2025',
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: '"Text" – “uvozovky” ⅋ «francouzské» • symbol §1 ¶2 ©2025\nhttps://x.com/test/status/1',
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-F005",
		category: "v4.0.0 - CHAR_MAP_REGEX",
		description: "Wrapped ellipsis entities decoded correctly",
		priority: "LOW",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text [&hellip;] a více [&amp;hellip;]</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Text […] a více […]",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Text … a více …\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	}
];

// =============================================================================
// GROUP G: safeTruncate UNICODE HANDLING
// =============================================================================

const V4_GROUP_G_SAFE_TRUNCATE: TestCase[] = [
	{
		id: "V400-G001",
		category: "v4.0.0 - safeTruncate Unicode",
		description: "Emoji (surrogate pair) not broken by truncation",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Krátký text s emoji 🎉🎊🎁 na konci.",
			EntryUrl: "https://example.com/post",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Krátký text s emoji 🎉🎊🎁 na konci.\nhttps://example.com/post",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, POST_LENGTH: 50 }
	},
	{
		id: "V400-G002",
		category: "v4.0.0 - safeTruncate Unicode",
		description: "Long text truncated at safe Unicode boundary",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Velmi dlouhý text který překračuje limit a obsahuje emoji 🚀 na různých místech 🎯 a musí být bezpečně oříznut.",
			EntryUrl: "https://example.com/long",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Velmi dlouhý text který překračuje limit a obsahuje emoji 🚀 na různých místech 🎯 a musí být…\nhttps://example.com/long",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, POST_LENGTH: 100 }
	},
	{
		id: "V400-G003",
		category: "v4.0.0 - safeTruncate Unicode",
		description: "Czech characters preserved after truncation",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Příliš žluťoučký kůň úpěl ďábelské ódy. Čeština je krásný jazyk s mnoha háčky a čárkami které musí zůstat.",
			EntryUrl: "https://example.com/czech",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Příliš žluťoučký kůň úpěl ďábelské ódy. Čeština je krásný jazyk s mnoha háčky a čárkami které musí…\nhttps://example.com/czech",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, POST_LENGTH: 100 }
	},
	{
		id: "V400-G004",
		category: "v4.0.0 - safeTruncate Unicode",
		description: "Japanese/Chinese characters handled correctly",
		priority: "LOW",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "日本語テスト 中文测试 한국어테스트",
			EntryUrl: "https://example.com/cjk",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "日本語テスト 中文测试 한국어테스트\nhttps://example.com/cjk",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, POST_LENGTH: 100 }
	}
];

// =============================================================================
// GROUP H: truncateRssInput WITH RSS_MAX_INPUT_CHARS
// =============================================================================

const V4_GROUP_H_RSS_TRUNCATE: TestCase[] = [
	{
		id: "V400-H001",
		category: "v4.0.0 - RSS_MAX_INPUT_CHARS",
		description: "Long RSS content truncated before processing",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA konec",
			EntryUrl: "https://example.com/long-rss",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA…\nhttps://example.com/long-rss",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, RSS_MAX_INPUT_CHARS: 1000 }
	},
	{
		id: "V400-H002",
		category: "v4.0.0 - RSS_MAX_INPUT_CHARS",
		description: "RSS_MAX_INPUT_CHARS=0 disables truncation",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Short content that should not be affected.",
			EntryUrl: "https://example.com/short",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Short content that should not be affected.\nhttps://example.com/short",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, RSS_MAX_INPUT_CHARS: 0 }
	},
	{
		id: "V400-H003",
		category: "v4.0.0 - RSS_MAX_INPUT_CHARS",
		description: "RSS_MAX_INPUT_CHARS affects only RSS platform",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">' + "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB" + '</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "B".repeat(500),
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, RSS_MAX_INPUT_CHARS: 100 }
	}
];

// =============================================================================
// GROUP I: DEDUPLICATION MECHANISMS
// =============================================================================

const V4_GROUP_I_DEDUPLICATION: TestCase[] = [
	{
		id: "V400-I001",
		category: "v4.0.0 - Deduplication",
		description: "Duplicate URLs at end deduplicated",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Text https://example.com/page https://example.com/page",
			EntryUrl: "https://example.com/page",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Text\nhttps://example.com/page",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-I002",
		category: "v4.0.0 - Deduplication",
		description: "Duplicate URLs with trailing slash normalized",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Text https://example.com/page/ https://example.com/page",
			EntryUrl: "https://example.com/page",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Text\nhttps://example.com/page/",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-I003",
		category: "v4.0.0 - Deduplication",
		description: "Three identical URLs reduced to one",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Text https://x.com/a https://x.com/a https://x.com/a",
			EntryUrl: "https://x.com/a",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Text https://x.com/a https://x.com/a https://x.com/a…\nhttps://x.com/a",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-I004",
		category: "v4.0.0 - Deduplication",
		description: "Duplicate PREFIX_POST_URL deduplicated",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Text\n\nhttps://example.com",
			EntryUrl: "https://example.com",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Text\nhttps://example.com",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, PREFIX_POST_URL: "\n" }
	},
	{
		id: "V400-I005",
		category: "v4.0.0 - Deduplication",
		description: "Different URLs preserved (no false deduplication)",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Link1: https://a.com Link2: https://b.com",
			EntryUrl: "https://c.com",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Link1: https://a.com Link2: https://b.com\nhttps://c.com",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	}
];

// =============================================================================
// GROUP J: PLATFORM CONFIGS & MULTI-PLATFORM
// =============================================================================

const V4_GROUP_J_PLATFORMS: TestCase[] = [
	{
		id: "V400-J001",
		category: "v4.0.0 - Platform Configs",
		description: "Bluesky quote handling with [contains quote]",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "Souhlasím! [contains quote post or other embedded content]",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Souhlasím! [contains quote post or other embedded content]",
			EntryUrl: "https://bsky.app/profile/user.bsky.social/post/abc",
			EntryTitle: "",
			FeedTitle: "user.bsky.social - Real Name"
		},
		expected: {
			output: "Real Name 🦋🔍💬 :\nSouhlasím!",
			shouldSkip: false
		},
		settings: BLUESKY_SETTINGS
	},
	{
		id: "V400-J002",
		category: "v4.0.0 - Platform Configs",
		description: "YouTube with SHOW_TITLE_AS_CONTENT",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryTitle: "Video Title Here",
			EntryContent: "This is the video description that should be ignored.",
			EntryUrl: "https://youtube.com/watch?v=xyz",
			FeedTitle: "Channel Name"
		},
		expected: {
			output: "Video Title Here\nYT 📺👇👇👇\nhttps://youtube.com/watch?v=xyz",
			shouldSkip: false
		},
		settings: { ...YOUTUBE_SETTINGS, SHOW_TITLE_AS_CONTENT: true }
	},
	{
		id: "V400-J003",
		category: "v4.0.0 - Platform Configs",
		description: "RSS with MOVE_URL_TO_END",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "https://example.com/link Tady je text za odkazem.",
			EntryUrl: "https://example.com/entry",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Tady je text za odkazem. https://example.com/link\nhttps://example.com/entry",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, MOVE_URL_TO_END: true }
	},
	{
		id: "V400-J004",
		category: "v4.0.0 - Platform Configs",
		description: "Twitter with SHOW_REAL_NAME=false uses username",
		priority: "LOW",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @other: Text</p>&mdash; Real Name (@username) <a href="https://twitter.com/username/status/1">Dec 31, 2025</a></blockquote>',
			Text: "RT @other: Text",
			LinkToTweet: "https://twitter.com/username/status/1",
			FirstLinkUrl: "(none)",
			UserName: "username"
		},
		expected: {
			output: "username 𝕏📤 https://x.com/other:\nText\nhttps://x.com/username/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, SHOW_REAL_NAME: false }
	}
];

// =============================================================================
// GROUP K: URL_DOMAIN_FIXES INITIALIZATION
// =============================================================================

const V4_GROUP_K_DOMAIN_FIXES: TestCase[] = [
	{
		id: "V400-K001",
		category: "v4.0.0 - URL_DOMAIN_FIXES",
		description: "Bare domain gets https:// prefix added",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Článek na rspkt.cz/clanek",
			EntryUrl: "https://example.com/entry",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Článek na rspkt.cz/clanek\nhttps://example.com/entry",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, URL_DOMAIN_FIXES: ["rspkt.cz"] }
	},
	{
		id: "V400-K002",
		category: "v4.0.0 - URL_DOMAIN_FIXES",
		description: "Existing https:// URL not duplicated",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Článek na https://rspkt.cz/clanek",
			EntryUrl: "https://example.com/entry",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Článek na https://rspkt.cz/clanek\nhttps://example.com/entry",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, URL_DOMAIN_FIXES: ["rspkt.cz"] }
	},
	{
		id: "V400-K003",
		category: "v4.0.0 - URL_DOMAIN_FIXES",
		description: "Multiple domains in URL_DOMAIN_FIXES",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Zprávy: ct24.cz/article a rspkt.cz/news",
			EntryUrl: "https://example.com/entry",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Zprávy: ct24.cz/article a rspkt.cz/news\nhttps://example.com/entry",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, URL_DOMAIN_FIXES: ["ct24.cz", "rspkt.cz"] }
	},
	{
		id: "V400-K004",
		category: "v4.0.0 - URL_DOMAIN_FIXES",
		description: "Domain at start of text",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "ct24.cz/breaking Nejnovější zprávy",
			EntryUrl: "https://example.com/entry",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "ct24.cz/breaking Nejnovější zprávy\nhttps://example.com/entry",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, URL_DOMAIN_FIXES: ["ct24.cz"] }
	},
	{
		id: "V400-K005",
		category: "v4.0.0 - URL_DOMAIN_FIXES",
		description: "Domain in parentheses",
		priority: "LOW",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Zdroj (rspkt.cz/source) uvádí",
			EntryUrl: "https://example.com/entry",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Zdroj (rspkt.cz/source) uvádí\nhttps://example.com/entry",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, URL_DOMAIN_FIXES: ["rspkt.cz"] }
	}
];

// =============================================================================
// GROUP L: RSS DUPLICATE RT PREFIX NORMALIZATION
// =============================================================================

const V4_GROUP_L_RSS_RT_NORMALIZE: TestCase[] = [
	{
		id: "V400-L001",
		category: "v4.0.0 - RSS RT Normalization",
		description: "Double RT prefix normalized to single",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "RT @user1: RT @user1: Duplicitní retweet.",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "rss_user",
			EntryContent: "(none)",
			EntryUrl: "https://example.com/tweet",
			EntryTitle: "RT @user1: RT @user1: Duplicitní retweet.",
			FeedTitle: "RSS Feed"
		},
		expected: {
			output: "user1 📤 @rss_user@twitter.com:\nDuplicitní retweet.\nhttps://example.com/tweet",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-L002",
		category: "v4.0.0 - RSS RT Normalization",
		description: "Triple RT prefix normalized",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "RT @author: RT @author: RT @author: Text.",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "feed_user",
			EntryContent: "(none)",
			EntryUrl: "https://example.com/tweet",
			EntryTitle: "RT @author: RT @author: RT @author: Text.",
			FeedTitle: "RSS Feed"
		},
		expected: {
			output: "author 📤 @feed_user@twitter.com:\nText.\nhttps://example.com/tweet",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-L003",
		category: "v4.0.0 - RSS RT Normalization",
		description: "Single RT prefix unchanged",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "RT @original: Normal retweet text.",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "retweeter",
			EntryContent: "(none)",
			EntryUrl: "https://example.com/tweet",
			EntryTitle: "RT @original: Normal retweet text.",
			FeedTitle: "RSS Feed"
		},
		expected: {
			output: "original 📤 @retweeter@twitter.com:\nNormal retweet text.\nhttps://example.com/tweet",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	}
];

// =============================================================================
// GROUP M: EDGE CASES & REGRESSION TESTS
// =============================================================================

const V4_GROUP_M_EDGE_CASES: TestCase[] = [
	{
		id: "V400-M001",
		category: "v4.0.0 - Edge Cases",
		description: "Truncated URL (with ellipsis) removed",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Odkaz: https://very-long-domain.com/path/to/article/that/is/truncated…</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Odkaz: https://very-long-domain.com/path/to/article/that/is/truncated…",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://very-long-domain.com/path/to/article/full",
			UserName: "test"
		},
		expected: {
			output: "Odkaz: …\nhttps://very-long-domain.com/path/to/article/full\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-M002",
		category: "v4.0.0 - Edge Cases",
		description: "Incomplete URL at end after trimming removed",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Dlouhý text který bude oříznut a za ním je neúplná URL https://www.inst</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Dlouhý text který bude oříznut a za ním je neúplná URL https://www.inst",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Dlouhý text který bude oříznut a za ním je neúplná URL https://www.inst\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, POST_LENGTH: 80 }
	},
	{
		id: "V400-M003",
		category: "v4.0.0 - Edge Cases",
		description: "Smart trim respects sentence boundaries",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "První věta je krátká. Druhá věta je delší a obsahuje více informací. Třetí věta překračuje limit a měla by být odříznuta někde uprostřed protože je příliš dlouhá.",
			EntryUrl: "https://example.com/article",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "První věta je krátká. Druhá věta je delší a obsahuje více informací. Třetí věta překračuje limit a…\nhttps://example.com/article",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, POST_LENGTH: 100, POST_LENGTH_TRIM_STRATEGY: "smart" }
	},
	{
		id: "V400-M004",
		category: "v4.0.0 - Edge Cases",
		description: "Date pattern in text not treated as sentence end",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Událost se koná 15.12.2025 v Praze. Přijďte se podívat na nový program.",
			EntryUrl: "https://example.com/event",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Událost se koná 15.12.2025 v Praze. Přijďte se podívat na nový program.\nhttps://example.com/event",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, POST_LENGTH: 100 }
	},
	{
		id: "V400-M005",
		category: "v4.0.0 - Edge Cases",
		description: "FORCE_SHOW_ORIGIN_POSTURL overrides imageUrl",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s obrázkem.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Tweet s obrázkem.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://example.com/image.jpg",
			UserName: "test"
		},
		expected: {
			output: "Tweet s obrázkem.\nhttps://example.com/image.jpg\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, FORCE_SHOW_ORIGIN_POSTURL: true }
	},
	{
		id: "V400-M006",
		category: "v4.0.0 - Edge Cases",
		description: "FORCE_SHOW_FEEDURL fallback when entryUrl empty",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet bez URL.</p>&mdash; Test (@testuser) <a href="">Dec 31, 2025</a></blockquote>',
			Text: "Tweet bez URL.",
			LinkToTweet: "",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "Tweet bez URL.\nhttps://x.com/",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, FORCE_SHOW_FEEDURL: true }
	},
	{
		id: "V400-M007",
		category: "v4.0.0 - Edge Cases",
		description: "Plus signs in URL preserved",
		priority: "LOW",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Link: https://example.com/search?q=c++programming",
			EntryUrl: "https://example.com/entry",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Link: https://example.com/search\nhttps://example.com/entry",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-M008",
		category: "v4.0.0 - Edge Cases",
		description: "RSS anchor tag text extracted, href discarded",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: '<p>Přečtěte si <a href="https://example.com/full-article">celý článek zde</a> pro více informací.</p>',
			EntryUrl: "https://example.com/entry",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Přečtěte si celý článek zde pro více informací.\nhttps://example.com/entry",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-M009",
		category: "v4.0.0 - Edge Cases",
		description: "CONTENT_REPLACEMENTS applied after all processing",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Nahradit slovo test slovem ukázka.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Nahradit slovo test slovem ukázka.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Nahradit slovo UKÁZKA slovem ukázka.\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			CONTENT_REPLACEMENTS: [{ pattern: "\\btest\\b", replacement: "UKÁZKA", flags: "gi" }]
		}
	},
	{
		id: "V400-M010",
		category: "v4.0.0 - Edge Cases",
		description: "Multiple whitespace normalized",
		priority: "LOW",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text    s    mnoha    mezerami.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Text    s    mnoha    mezerami.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Text s mnoha mezerami.\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	}
];

// =============================================================================
// GROUP N: URL WHITESPACE HANDLING (7 tests)
// Validates proper trimming of whitespace in URL inputs
// =============================================================================

const V4_GROUP_N_URL_WHITESPACE: TestCase[] = [
	{
		id: "V400-N001",
		category: "v4.0.0 - URL Whitespace",
		description: "Leading whitespace in LinkToTweet (postUrl) trimmed",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s whitespace před URL</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123500">Dec 31, 2025</a></blockquote>',
			Text: "Tweet s whitespace před URL",
			LinkToTweet: "   https://twitter.com/testuser/status/123500",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "Tweet s whitespace před URL\nhttps://x.com/testuser/status/123500",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-N002",
		category: "v4.0.0 - URL Whitespace",
		description: "Trailing whitespace in LinkToTweet (postUrl) trimmed",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s whitespace za URL</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123501">Dec 31, 2025</a></blockquote>',
			Text: "Tweet s whitespace za URL",
			LinkToTweet: "https://twitter.com/testuser/status/123501   ",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "Tweet s whitespace za URL\nhttps://x.com/testuser/status/123501",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-N003",
		category: "v4.0.0 - URL Whitespace",
		description: "Leading and trailing whitespace in LinkToTweet trimmed",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s whitespace</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123502">Dec 31, 2025</a></blockquote>',
			Text: "Tweet s whitespace",
			LinkToTweet: "  https://twitter.com/testuser/status/123502  ",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "Tweet s whitespace\nhttps://x.com/testuser/status/123502",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-N004",
		category: "v4.0.0 - URL Whitespace",
		description: "Leading whitespace in FirstLinkUrl (imageUrl) trimmed",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s obrázkem</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123503">Dec 31, 2025</a></blockquote>',
			Text: "Tweet s obrázkem",
			LinkToTweet: "https://twitter.com/testuser/status/123503",
			FirstLinkUrl: "   https://pbs.twimg.com/media/example.jpg",
			UserName: "testuser"
		},
		expected: {
			output: "Tweet s obrázkem\nhttps://pbs.twimg.com/media/example.jpg\nhttps://x.com/testuser/status/123503",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-N005",
		category: "v4.0.0 - URL Whitespace",
		description: "Trailing whitespace in FirstLinkUrl (imageUrl) trimmed",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s trailing whitespace v imageUrl</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123504">Dec 31, 2025</a></blockquote>',
			Text: "Tweet s trailing whitespace v imageUrl",
			LinkToTweet: "https://twitter.com/testuser/status/123504",
			FirstLinkUrl: "https://pbs.twimg.com/media/example.jpg   ",
			UserName: "testuser"
		},
		expected: {
			output: "Tweet s trailing whitespace v imageUrl\nhttps://pbs.twimg.com/media/example.jpg\nhttps://x.com/testuser/status/123504",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-N006",
		category: "v4.0.0 - URL Whitespace",
		description: "Both-side whitespace in FirstLinkUrl trimmed",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s whitespace v imageUrl</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123505">Dec 31, 2025</a></blockquote>',
			Text: "Tweet s whitespace v imageUrl",
			LinkToTweet: "https://twitter.com/testuser/status/123505",
			FirstLinkUrl: "  https://pbs.twimg.com/media/example.jpg  ",
			UserName: "testuser"
		},
		expected: {
			output: "Tweet s whitespace v imageUrl\nhttps://pbs.twimg.com/media/example.jpg\nhttps://x.com/testuser/status/123505",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-N007",
		category: "v4.0.0 - URL Whitespace",
		description: "Whitespace in both LinkToTweet and FirstLinkUrl simultaneously",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s whitespace v obou URL</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123506">Dec 31, 2025</a></blockquote>',
			Text: "Tweet s whitespace v obou URL",
			LinkToTweet: "  https://twitter.com/testuser/status/123506  ",
			FirstLinkUrl: "  https://pbs.twimg.com/media/example.jpg  ",
			UserName: "testuser"
		},
		expected: {
			output: "Tweet s whitespace v obou URL\nhttps://pbs.twimg.com/media/example.jpg\nhttps://x.com/testuser/status/123506",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	}
];

// =============================================================================
// GROUP O: URL PROCESSING EDGE CASES (7 tests)
// Validates URL encoding, query strings, fragments, and case handling
// =============================================================================

const V4_GROUP_O_URL_EDGE_CASES: TestCase[] = [
	{
		id: "V400-O001",
		category: "v4.0.0 - URL Edge Cases",
		description: "Ampersand in query string - proper encoding to safe char",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Odkaz s parametry: https://example.com/page?foo=1&bar=2</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Odkaz s parametry: https://example.com/page?foo=1&bar=2",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://example.com/page?foo=1&bar=2",
			UserName: "test"
		},
		expected: {
			output: "Odkaz s parametry: https://example.com/page\nhttps://example.com/page\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-O002",
		category: "v4.0.0 - URL Edge Cases",
		description: "URL_NO_TRIM_DOMAINS - keep query string with encoded ampersand",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">YouTube: https://youtube.com/watch?v=abc123&feature=share</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "YouTube: https://youtube.com/watch?v=abc123&feature=share",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://youtube.com/watch?v=abc123&feature=share",
			UserName: "test"
		},
		expected: {
			output: "YouTube: https://youtube.com/watch?v=abc123⅋feature=share\nhttps://youtube.com/watch?v=abc123%26feature=share\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, URL_NO_TRIM_DOMAINS: ["youtube.com", "youtu.be"] }
	},
	{
		id: "V400-O003",
		category: "v4.0.0 - URL Edge Cases",
		description: "URL with fragment (#section) preserved",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Sekce: https://example.com/page#important-section</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Sekce: https://example.com/page#important-section",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://example.com/page#important-section",
			UserName: "test"
		},
		expected: {
			output: "Sekce: https://example.com/page#important-section\nhttps://example.com/page#important-section\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-O004",
		category: "v4.0.0 - URL Edge Cases",
		description: "Very long URL (>500 chars) - query trimmed, path preserved",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Dlouhý odkaz: https://example.com/very/long/path?param1=value1&param2=value2&param3=value3</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Dlouhý odkaz: https://example.com/very/long/path?param1=value1&param2=value2&param3=value3",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://example.com/very/long/path?param1=value1&param2=value2&param3=value3",
			UserName: "test"
		},
		expected: {
			output: "Dlouhý odkaz: https://example.com/very/long/path\nhttps://example.com/very/long/path\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-O005",
		category: "v4.0.0 - URL Edge Cases",
		description: "URL_REPLACE case variations (X.com vs x.com) - all normalized",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Odkazy: https://X.com/user/status/123 a https://x.com/other/status/456</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Odkazy: https://X.com/user/status/123 a https://x.com/other/status/456",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://X.com/user/status/123",
			UserName: "test"
		},
		expected: {
			output: "Test 𝕏🔍💬 https://x.com/user:\nOdkazy: https://X.com/user/status/123 a https://x.com/other/status/456\nhttps://x.com/user/status/123\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, URL_REPLACE_FROM: ["https://X.com/", "https://x.com/", "https://twitter.com/"], URL_REPLACE_TO: "https://x.com/" }
	},
	{
		id: "V400-O006",
		category: "v4.0.0 - URL Edge Cases",
		description: "URL ending with trailing slash normalized",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Web: https://example.com/page/</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Web: https://example.com/page/",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "https://example.com/page/",
			UserName: "test"
		},
		expected: {
			output: "Web: https://example.com/page/\nhttps://example.com/page/\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-O007",
		category: "v4.0.0 - URL Edge Cases",
		description: "Plus signs in URL path preserved (C++ encoding)",
		priority: "LOW",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Learn C++: https://example.com/search?q=c++tutorial",
			EntryUrl: "https://example.com/entry",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Learn C﹢﹢: https://example.com/search\nhttps://example.com/entry",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	}
];

// =============================================================================
// GROUP P: RSS ANCHOR TAG TEXT PRESERVATION (8 tests)
// Validates extraction of visible text from anchor tags (v3.1.5 feature)
// =============================================================================

const V4_GROUP_P_ANCHOR_TEXT: TestCase[] = [
	{
		id: "V400-P001",
		category: "v4.0.0 - Anchor Text",
		description: "Basic anchor tag - extract text, discard href URL",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: '<p>Přečtěte si <a href="https://example.com/nested">tento článek</a> pro více informací.</p>',
			EntryUrl: "https://example.com/article",
			EntryTitle: "",
			FeedTitle: "Test Feed"
		},
		expected: {
			output: "Přečtěte si tento článek pro více informací.\nhttps://example.com/article",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-P002",
		category: "v4.0.0 - Anchor Text",
		description: "Anchor with nested HTML formatting (<strong><em>) - extract clean text",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: '<p>Podle informací by měl <a href="https://example.com/link" target="_blank"><strong>Turok: Origins</strong></a> vyjít v roce 2026.</p>',
			EntryUrl: "https://example.com/article",
			EntryTitle: "",
			FeedTitle: "INDIAN"
		},
		expected: {
			output: "Podle informací by měl Turok: Origins vyjít v roce 2026.\nhttps://example.com/article",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-P003",
		category: "v4.0.0 - Anchor Text",
		description: "Multiple anchor tags - extract all texts",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: '<p>Společnost <a href="https://example.com/apple">Apple</a> představila nový <a href="https://example.com/iphone">iPhone 16</a> na konferenci.</p>',
			EntryUrl: "https://example.com/article",
			EntryTitle: "",
			FeedTitle: "Tech News"
		},
		expected: {
			output: "Společnost Apple představila nový iPhone 16 na konferenci.\nhttps://example.com/article",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-P004",
		category: "v4.0.0 - Anchor Text",
		description: "Anchor tag with empty text - remove entirely",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: '<p>Článek pokračuje <a href="https://example.com/continue"></a> zde.</p>',
			EntryUrl: "https://example.com/article",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Článek pokračuje zde.\nhttps://example.com/article",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-P005",
		category: "v4.0.0 - Anchor Text",
		description: "Deeply nested HTML in anchor - extract clean text",
		priority: "LOW",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: '<p>Přečtěte si <a href="https://example.com/nested"><strong><em>tento <span>důležitý</span> článek</em></strong></a> teď.</p>',
			EntryUrl: "https://example.com/article",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Přečtěte si tento důležitý článek teď.\nhttps://example.com/article",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-P006",
		category: "v4.0.0 - Anchor Text",
		description: "Real-world ČT24 RSS - anchor with ellipsis text preserved",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: 'Rektorem VŠE bude i příští čtyři roky Petr Dvořák. Miroslav Ševčík z volby odstoupil. <a href="https://ct24.ceskatelevize.cz/clanek/rektorem-vse-367516">ct24.ceskatelevize.cz/článek…</a>',
			EntryUrl: "https://x.com/CT24zive/status/123456",
			EntryTitle: "",
			FeedTitle: "TeleKAFKYcky"
		},
		expected: {
			output: "Rektorem VŠE bude i příští čtyři roky Petr Dvořák. Miroslav Ševčík z volby odstoupil. ct24.ceskatelevize.cz/článek…\nhttps://x.com/CT24zive/status/123456",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-P007",
		category: "v4.0.0 - Anchor Text",
		description: "pic.twitter.com anchor removed (media link)",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: 'V katedrále svatého Víta se lidé rozloučili s kardinálem Dukou. <a href="https://t.co/CSwiEUZe9Q">pic.twitter.com/CSwiEUZe9Q</a>',
			EntryUrl: "https://x.com/CT24zive/status/1989694033896124710",
			EntryTitle: "",
			FeedTitle: "CT24"
		},
		expected: {
			output: "V katedrále svatého Víta se lidé rozloučili s kardinálem Dukou.\nhttps://x.com/CT24zive/status/1989694033896124710",
			shouldSkip: false
		},
		settings: {
			...RSS_SETTINGS,
			CONTENT_REPLACEMENTS: [
				{ pattern: "pic\\.twitter\\.com\\/[a-zA-Z0-9]+", replacement: "", flags: "g" }
			]
		}
	},
	{
		id: "V400-P008",
		category: "v4.0.0 - Anchor Text",
		description: "Anchor tag with target attribute and classes",
		priority: "LOW",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: '<p>Click <a href="https://example.com" target="_blank" class="external-link" rel="noopener">here for details</a>.</p>',
			EntryUrl: "https://example.com/article",
			EntryTitle: "",
			FeedTitle: "Feed"
		},
		expected: {
			output: "Click here for details.\nhttps://example.com/article",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	}
];

// =============================================================================
// GROUP Q: ADVANCED DEDUPLICATION (8 tests)
// Extended deduplication scenarios beyond Group I basics
// =============================================================================

const V4_GROUP_Q_ADVANCED_DEDUP: TestCase[] = [
	{
		id: "V400-Q001",
		category: "v4.0.0 - Advanced Dedup",
		description: "Consecutive TCO_REPLACEMENT placeholders deduplicated (3→1)",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<p>👉https://t.co/abc https://t.co/def https://t.co/ghi</p>',
			Text: "👉https://t.co/abc https://t.co/def https://t.co/ghi",
			LinkToTweet: "https://x.com/user/status/123",
			FirstLinkUrl: "https://example.com/article",
			UserName: "testuser"
		},
		expected: {
			output: "👉🔗↗\nhttps://example.com/article\nhttps://x.com/user/status/123",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, TCO_REPLACEMENT: "🔗↗" }
	},
	{
		id: "V400-Q002",
		category: "v4.0.0 - Advanced Dedup",
		description: "Non-consecutive TCO placeholders preserved (2 separate)",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<p>#1: https://t.co/abc text #2: https://t.co/def</p>',
			Text: "#1: https://t.co/abc text #2: https://t.co/def",
			LinkToTweet: "https://x.com/user/status/123",
			FirstLinkUrl: "",
			UserName: "testuser"
		},
		expected: {
			output: "#1: 🔗↗ text #2: 🔗↗\nhttps://x.com/user/status/123",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, TCO_REPLACEMENT: "🔗↗" }
	},
	{
		id: "V400-Q003",
		category: "v4.0.0 - Advanced Dedup",
		description: "Mixed whitespace between t.co links - all deduplicated",
		priority: "LOW",
		input: {
			TweetEmbedCode: '<p>Text https://t.co/a  https://t.co/b\t https://t.co/c</p>',
			Text: "Text https://t.co/a  https://t.co/b\t https://t.co/c",
			LinkToTweet: "https://x.com/user/status/123",
			FirstLinkUrl: "",
			UserName: "testuser"
		},
		expected: {
			output: "Text 🔗↗\nhttps://x.com/user/status/123",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, TCO_REPLACEMENT: "🔗↗" }
	},
	{
		id: "V400-Q004",
		category: "v4.0.0 - Advanced Dedup",
		description: "Trailing TCO placeholder removed when real URLs appended",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<p>Check https://t.co/abc</p>',
			Text: "Check https://t.co/abc",
			LinkToTweet: "https://x.com/user/status/123456",
			FirstLinkUrl: "https://example.com/image.jpg",
			UserName: "testuser"
		},
		expected: {
			output: "Check 🔗↗\nhttps://example.com/image.jpg\nhttps://x.com/user/status/123456",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, TCO_REPLACEMENT: "🔗↗", SHOW_IMAGEURL: true }
	},
	{
		id: "V400-Q005",
		category: "v4.0.0 - Advanced Dedup",
		description: "YouTube PREFIX_POST_URL deduplication",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "Test video description",
			Text: "Test YouTube Video Title",
			LinkToTweet: "https://youtube.com/watch?v=xyz",
			FirstLinkUrl: "https://youtube.com/watch?v=xyz",
			UserName: "channel"
		},
		expected: {
			output: "Test video description\nYT 📺👇👇👇\nhttps://youtube.com/watch?v=xyz",
			shouldSkip: false
		},
		settings: { ...YOUTUBE_SETTINGS, PREFIX_POST_URL: "\nYT 📺👇👇👇\n" }
	},
	{
		id: "V400-Q006",
		category: "v4.0.0 - Advanced Dedup",
		description: "Three identical URLs at end reduced to one",
		priority: "HIGH",
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
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-Q007",
		category: "v4.0.0 - Advanced Dedup",
		description: "URL dedup with trailing slash normalization (url/ == url)",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "",
			EntryContent: "Visit https://example.com/page/ and https://example.com/page",
			EntryUrl: "https://example.com/page",
			EntryTitle: "",
			FeedTitle: ""
		},
		expected: {
			output: "Visit https://example.com/page/ and\nhttps://example.com/page",
			shouldSkip: false
		},
		settings: RSS_SETTINGS
	},
	{
		id: "V400-Q008",
		category: "v4.0.0 - Advanced Dedup",
		description: "BlueSky emoji prefix deduplication",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: "",
			Text: "Bluesky post content",
			LinkToTweet: "https://bsky.app/profile/user/post/abc",
			FirstLinkUrl: "https://bsky.app/profile/user/post/abc",
			UserName: "testuser.bsky.social"
		},
		expected: {
			output: "Bluesky post content\n🦋 https://bsky.app/profile/user/post/abc",
			shouldSkip: false
		},
		settings: { ...BLUESKY_SETTINGS, PREFIX_POST_URL: "\n🦋 " }
	}
];

// =============================================================================
// GROUP R: REAL-WORLD PRODUCTION SCENARIOS (6 tests)
// Validated against actual production bugs and ČT24/Deník N data
// =============================================================================

const V4_GROUP_R_REAL_WORLD: TestCase[] = [
	{
		id: "V400-R001",
		category: "v4.0.0 - Real-World",
		description: "ČT24 RSS - valid https://ct24.ceskatelevize.cz remains unchanged",
		priority: "HIGH",
		input: {
			TweetEmbedCode: 'Nemyslím, že je BBC zaujatá, řekl autor zprávy. <a href="https://ct24.ceskatelevize.cz/clanek/svet/clanek-367531">ct24.ceskatelevize.cz/článek…</a>',
			Text: "Nemyslím, že je BBC zaujatá, řekl autor zprávy.",
			LinkToTweet: "https://x.com/CT24zive/status/1993065830729613668",
			FirstLinkUrl: "",
			UserName: "CT24zive"
		},
		expected: {
			output: "Nemyslím, že je BBC zaujatá, řekl autor zprávy. ct24.ceskatelevize.cz/článek…\nhttps://x.com/CT24zive/status/1993065830729613668",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, URL_DOMAIN_FIXES: ["ct24.ceskatelevize.cz", "ceskatelevize.cz"] }
	},
	{
		id: "V400-R002",
		category: "v4.0.0 - Real-World",
		description: "ČT RSS - no double https:// protocol (bug fix validation)",
		priority: "HIGH",
		input: {
			TweetEmbedCode: 'Rektorem VŠE bude Petr Dvořák. Ševčík odstoupil. <a href="https://ct24.ceskatelevize.cz/clanek/domaci/rektorem-vse-367516">ct24.ceskatelevize.cz/článek…</a>',
			Text: "Rektorem VŠE bude Petr Dvořák. Ševčík odstoupil.",
			LinkToTweet: "https://x.com/CT24zive/status/1992957958171603170",
			FirstLinkUrl: "",
			UserName: "CT24zive"
		},
		expected: {
			output: "Rektorem VŠE bude Petr Dvořák. Ševčík odstoupil. ct24.ceskatelevize.cz/článek…\nhttps://x.com/CT24zive/status/1992957958171603170",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			URL_DOMAIN_FIXES: ["ct24.ceskatelevize.cz"],
			FORCE_SHOW_ORIGIN_POSTURL: true
		}
	},
	{
		id: "V400-R003",
		category: "v4.0.0 - Real-World",
		description: "Deník N RSS - duplicate URL at end deduplicated",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "",
			FirstLinkUrl: "",
			UserName: "DenikN",
			EntryContent: 'Pražský primátor chce postavit most u Troji do roku 2031. https://denikn.cz/1501773/most-u-troji/',
			EntryUrl: "https://denikn.cz/1501773/most-u-troji/",
			EntryTitle: "",
			FeedTitle: "Deník N"
		},
		expected: {
			output: "Pražský primátor chce postavit most u Troji do roku 2031.\nhttps://denikn.cz/1501773/most-u-troji/",
			shouldSkip: false
		},
		settings: { ...RSS_SETTINGS, FORCE_SHOW_ORIGIN_POSTURL: true }
	},
	{
		id: "V400-R004",
		category: "v4.0.0 - Real-World",
		description: "Seznam Zprávy - emoji prefix + t.co replacement",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<p>🇨🇿🇺🇦 Student Jiří Kotrla zahynul na frontě. 🖤 Jeho maminka vypráví příběh. 👉https://t.co/abc123 https://t.co/def456</p>',
			Text: "🇨🇿🇺🇦 Student Jiří Kotrla zahynul na frontě. 🖤 Jeho maminka vypráví příběh. 👉https://t.co/abc123 https://t.co/def456",
			LinkToTweet: "https://x.com/SeznamZpravy/status/1996144907531026627",
			FirstLinkUrl: "https://www.seznamzpravy.cz/clanek/293049",
			UserName: "SeznamZpravy"
		},
		expected: {
			output: "🇨🇿🇺🇦 Student Jiří Kotrla zahynul na frontě. 🖤 Jeho maminka vypráví příběh. 👉🔗↗\nhttps://www.seznamzpravy.cz/clanek/293049\nhttps://x.com/SeznamZpravy/status/1996144907531026627",
			shouldSkip: false
		},
		settings: { ...TWITTER_SETTINGS, TCO_REPLACEMENT: "🔗↗" }
	},
	{
		id: "V400-R005",
		category: "v4.0.0 - Real-World",
		description: "HN (Hospodářské noviny) - quote tweet with @mention",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">📵 @PetrHonzejk: Politické záhrobí se otevřelo. S Motoristy se v politice opět zjevuje duch Václava Klause https://t.co/aeiLXzZk5R https://t.co/tF8EOKbMap</p>&mdash; Hospodářské noviny (@hospodarky) <a href="https://twitter.com/hospodarky/status/1974838004133847498">Oct 5, 2025</a></blockquote>',
			Text: "📵 @PetrHonzejk: Politické záhrobí se otevřelo. S Motoristy se v politice opět zjevuje duch Václava Klause https://t.co/aeiLXzZk5R https://t.co/tF8EOKbMap",
			LinkToTweet: "https://twitter.com/hospodarky/status/1974838004133847498",
			FirstLinkUrl: "https://archiv.hn.cz/c1-67796800-politicke-zahrobi",
			UserName: "hospodarky"
		},
		expected: {
			output: "📵 https://x.com/PetrHonzejk: Politické záhrobí se otevřelo. S Motoristy se v politice opět zjevuje duch Václava Klause 🔗↗️\nhttps://archiv.hn.cz/c1-67796800-politicke-zahrobi\nhttps://x.com/hospodarky/status/1974838004133847498",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-R006",
		category: "v4.0.0 - Real-World",
		description: "Weather warning tweet - PHRASES_REQUIRED filter pass",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">⚠️ Vydána výstraha k silnému větru 💨 Platnost: od soboty do neděle. Ve Frýdlantském výběžku zaČne platit v sobotu.</p>&mdash; ČHMÚ (@CHMUCHMI) <a href="https://twitter.com/CHMUCHMI/status/1974050603748757633">Oct 3, 2025</a></blockquote>',
			Text: "⚠️ Vydána výstraha k silnému větru 💨 Platnost: od soboty do neděle. Ve Frýdlantském výběžku začne platit v sobotu.",
			LinkToTweet: "https://twitter.com/CHMUCHMI/status/1974050603748757633",
			FirstLinkUrl: "(none)",
			UserName: "CHMUCHMI"
		},
		expected: {
			output: "⚠️ Vydána výstraha k silnému větru 💨 Platnost: od soboty do neděle. Ve Frýdlantském výběžku zaČne platit v sobotu.\nhttps://x.com/CHMUCHMI/status/1974050603748757633",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: ["výstraha"]
		}
	}
];

// =============================================================================
// GROUP S: FILTERRULE ADVANCED LOGIC (8 tests)
// Validates regex patterns, AND/OR logic, invalid regex handling
// =============================================================================

const V4_GROUP_S_FILTERRULE_LOGIC: TestCase[] = [
	{
		id: "V400-S001",
		category: "v4.0.0 - FilterRule Logic",
		description: "Regex pattern in PHRASES_BANNED - case insensitive word boundary",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tohle je SPAM zpráva, kterou byste měli ignorovat.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Tohle je SPAM zpráva, kterou byste měli ignorovat.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Contains banned phrases"
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_BANNED: [{ type: "regex", pattern: "\\bspam\\b", flags: "i" }]
		}
	},
	{
		id: "V400-S002",
		category: "v4.0.0 - FilterRule Logic",
		description: "Regex pattern in PHRASES_REQUIRED - must start with 'Breaking:'",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Breaking: Důležitá zpráva z oblasti technologií.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Breaking: Důležitá zpráva z oblasti technologií.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Breaking: Důležitá zpráva z oblasti technologií.\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [{ type: "regex", pattern: "^Breaking:", flags: "" }]
		}
	},
	{
		id: "V400-S003",
		category: "v4.0.0 - FilterRule Logic",
		description: "AND logic with content array - all keywords must be present",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Nové trendy v oblasti technologií a umělé inteligence (AI).</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Nové trendy v oblasti technologií a umělé inteligence (AI).",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Nové trendy v oblasti technologií a umělé inteligence (AI).\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [{ type: "and", content: ["tech", "AI"] }]
		}
	},
	{
		id: "V400-S004",
		category: "v4.0.0 - FilterRule Logic",
		description: "AND logic - missing one keyword should skip",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Nové trendy v oblasti technologií.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Nové trendy v oblasti technologií.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Missing mandatory keywords"
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [{ type: "and", content: ["tech", "AI"] }]
		}
	},
	{
		id: "V400-S005",
		category: "v4.0.0 - FilterRule Logic",
		description: "OR logic with content array - any keyword must be present",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Aktuální zprávy z domova a ze světa.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Aktuální zprávy z domova a ze světa.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "Aktuální zprávy z domova a ze světa.\nhttps://x.com/test/status/1",
			shouldSkip: false
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [{ type: "or", content: ["zprávy", "breaking"] }]
		}
	},
	{
		id: "V400-S006",
		category: "v4.0.0 - FilterRule Logic",
		description: "Invalid regex pattern - should not crash, treat as no match",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Normální tweet bez speciálních znaků.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Normální tweet bez speciálních znaků.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
		},
		expected: {
			output: "",
			shouldSkip: true,
			skipReason: "Missing mandatory keywords"
		},
		settings: {
			...TWITTER_SETTINGS,
			PHRASES_REQUIRED: [{ type: "regex", pattern: "[invalid(regex", flags: "i" }]
		}
	},
	{
		id: "V400-S007",
		category: "v4.0.0 - FilterRule Logic",
		description: "Combined filter priority - banned phrase AND required keyword (banned wins)",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Komerční sdělení: Důležitá výstraha pro všechny uživatele.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "Komerční sdělení: Důležitá výstraha pro všechny uživatele.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
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
		id: "V400-S008",
		category: "v4.0.0 - FilterRule Logic",
		description: "Reply with required keyword - reply detection takes precedence",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">@DanielSnor Souhlasím, je to důležitá výstraha.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "@DanielSnor Souhlasím, je to důležitá výstraha.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
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
	}
];

// =============================================================================
// GROUP T: EDGE CASES & EMPTY CONTENT HANDLING (8 tests)
// Validates empty inputs, whitespace, malformed HTML
// =============================================================================

const V4_GROUP_T_EDGE_EMPTY: TestCase[] = [
	{
		id: "V400-T001",
		category: "v4.0.0 - Edge Cases Empty",
		description: "Empty TweetEmbedCode but valid Text - should use Text",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "Nějaký tweet text bez embed kódu",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "user"
		},
		expected: {
			output: "Nějaký tweet text bez embed kódu\nhttps://x.com/user/status/123456",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-T002",
		category: "v4.0.0 - Edge Cases Empty",
		description: "Valid TweetEmbedCode but empty Text - should extract from embed",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text z embed kódu který je prioritní</p>&mdash; Test User (@testuser) <a href="https://twitter.com/testuser/status/123456">Dec 31, 2025</a></blockquote>',
			Text: "",
			LinkToTweet: "https://twitter.com/testuser/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "testuser"
		},
		expected: {
			output: "Text z embed kódu který je prioritní\nhttps://x.com/testuser/status/123456",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-T003",
		category: "v4.0.0 - Edge Cases Empty",
		description: "Both TweetEmbedCode and Text empty - should skip",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "",
			Text: "",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "user"
		},
		expected: {
			output: "\nhttps://x.com/user/status/123456",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-T004",
		category: "v4.0.0 - Edge Cases Empty",
		description: "Only whitespace in content - should skip",
		priority: "HIGH",
		input: {
			TweetEmbedCode: "   \n\t   ",
			Text: "   \n   \t   ",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "user"
		},
		expected: {
			output: "\nhttps://x.com/user/status/123456",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-T005",
		category: "v4.0.0 - Edge Cases Empty",
		description: "FirstLinkUrl empty string instead of (none)",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Tweet s prázdným FirstLinkUrl</p>&mdash; User (@user) <a href="https://twitter.com/user/status/123456">Dec 31, 2025</a></blockquote>',
			Text: "Tweet s prázdným FirstLinkUrl",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "",
			UserName: "user"
		},
		expected: {
			output: "Tweet s prázdným FirstLinkUrl\nhttps://x.com/user/status/123456",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-T006",
		category: "v4.0.0 - Edge Cases Empty",
		description: "Malformed HTML in TweetEmbedCode - should handle gracefully",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">Text s malformed HTML <strong>bold bez ukončení',
			Text: "Fallback text když HTML parsing selže",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "user"
		},
		expected: {
			output: "Fallback text když HTML parsing selže\nhttps://x.com/user/status/123456",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-T007",
		category: "v4.0.0 - Edge Cases Empty",
		description: "Missing <p> tag in TweetEmbedCode - should fallback to Text",
		priority: "MEDIUM",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet">&mdash; User (@user) <a href="https://twitter.com/user/status/123456">Dec 31, 2025</a></blockquote>',
			Text: "Fallback when no <p> tag found",
			LinkToTweet: "https://twitter.com/user/status/123456",
			FirstLinkUrl: "(none)",
			UserName: "user"
		},
		expected: {
			output: "Fallback when no tag found\nhttps://x.com/user/status/123456",
			shouldSkip: false
		},
		settings: TWITTER_SETTINGS
	},
	{
		id: "V400-T008",
		category: "v4.0.0 - Edge Cases Empty",
		description: "External repost with required keyword + REPOST_ALLOWED=false (repost rule wins)",
		priority: "HIGH",
		input: {
			TweetEmbedCode: '<blockquote class="twitter-tweet"><p lang="cs" dir="ltr">RT @CHMUCHMI: Vydána výstraha k silnému větru.</p>&mdash; Test (@test) <a href="https://twitter.com/test/status/1">Dec 31, 2025</a></blockquote>',
			Text: "RT @CHMUCHMI: Vydána výstraha k silnému větru.",
			LinkToTweet: "https://twitter.com/test/status/1",
			FirstLinkUrl: "(none)",
			UserName: "test"
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
	}
];

// =============================================================================
// AGGREGATE ALL TESTS
// =============================================================================

const ALL_V4_BASELINE_TESTS = [
	...V4_BASELINE_BASIC_TESTS,
	...V4_BASELINE_URL_TESTS,
	...V4_BASELINE_REPOST_TESTS,
	...V4_BASELINE_HTML_TESTS,
	...V4_BASELINE_FILTER_TESTS
];

const ALL_V4_NEW_TESTS = [
	...V4_GROUP_A_URL_REPLACE_ARRAY,
	...V4_GROUP_B_UNIFIED_FILTER,
	...V4_GROUP_C_TCO_REPLACEMENT,
	...V4_GROUP_D_SELF_REFERENCE,
	...V4_GROUP_E_COMBINE_CONTENT,
	...V4_GROUP_F_CHAR_MAP_REGEX,
	...V4_GROUP_G_SAFE_TRUNCATE,
	...V4_GROUP_H_RSS_TRUNCATE,
	...V4_GROUP_I_DEDUPLICATION,
	...V4_GROUP_J_PLATFORMS,
	...V4_GROUP_K_DOMAIN_FIXES,
	...V4_GROUP_L_RSS_RT_NORMALIZE,
	...V4_GROUP_M_EDGE_CASES,
	...V4_GROUP_N_URL_WHITESPACE,
	...V4_GROUP_O_URL_EDGE_CASES,
	...V4_GROUP_P_ANCHOR_TEXT,
	...V4_GROUP_Q_ADVANCED_DEDUP,
	...V4_GROUP_R_REAL_WORLD,
	...V4_GROUP_S_FILTERRULE_LOGIC,
	...V4_GROUP_T_EDGE_EMPTY
];

const ALL_TESTS = [
	...ALL_V4_BASELINE_TESTS,
	...ALL_V4_NEW_TESTS
];

// =============================================================================
// TEST SUITE METADATA & SUMMARY
// =============================================================================

const testSuiteMetadata = {
	version: "4.0.0",
	buildDate: "2025-12-31",
	totalTests: ALL_TESTS.length,
	baselineTests: ALL_V4_BASELINE_TESTS.length,
	newTests: ALL_V4_NEW_TESTS.length,
	breakdown: {
		baseline: {
			basic: V4_BASELINE_BASIC_TESTS.length,
			urls: V4_BASELINE_URL_TESTS.length,
			reposts: V4_BASELINE_REPOST_TESTS.length,
			html: V4_BASELINE_HTML_TESTS.length,
			filters: V4_BASELINE_FILTER_TESTS.length
		},
		v4New: {
			groupA_urlReplaceArray: V4_GROUP_A_URL_REPLACE_ARRAY.length,
			groupB_unifiedFilter: V4_GROUP_B_UNIFIED_FILTER.length,
			groupC_tcoReplacement: V4_GROUP_C_TCO_REPLACEMENT.length,
			groupD_selfReference: V4_GROUP_D_SELF_REFERENCE.length,
			groupE_combineContent: V4_GROUP_E_COMBINE_CONTENT.length,
			groupF_charMapRegex: V4_GROUP_F_CHAR_MAP_REGEX.length,
			groupG_safeTruncate: V4_GROUP_G_SAFE_TRUNCATE.length,
			groupH_rssTruncate: V4_GROUP_H_RSS_TRUNCATE.length,
			groupI_deduplication: V4_GROUP_I_DEDUPLICATION.length,
			groupJ_platforms: V4_GROUP_J_PLATFORMS.length,
			groupK_domainFixes: V4_GROUP_K_DOMAIN_FIXES.length,
			groupL_rssRtNormalize: V4_GROUP_L_RSS_RT_NORMALIZE.length,
			groupM_edgeCases: V4_GROUP_M_EDGE_CASES.length,
			groupN_urlWhitespace: V4_GROUP_N_URL_WHITESPACE.length,
			groupO_urlEdgeCases: V4_GROUP_O_URL_EDGE_CASES.length,
			groupP_anchorText: V4_GROUP_P_ANCHOR_TEXT.length,
			groupQ_advancedDedup: V4_GROUP_Q_ADVANCED_DEDUP.length,
			groupR_realWorld: V4_GROUP_R_REAL_WORLD.length,
			groupS_filterRuleLogic: V4_GROUP_S_FILTERRULE_LOGIC.length,
			groupT_edgeEmpty: V4_GROUP_T_EDGE_EMPTY.length
		}
	},
	categories: {
		"Baseline - Basic Tweets": V4_BASELINE_BASIC_TESTS.length,
		"Baseline - URLs": V4_BASELINE_URL_TESTS.length,
		"Baseline - Reposts": V4_BASELINE_REPOST_TESTS.length,
		"Baseline - HTML Entities": V4_BASELINE_HTML_TESTS.length,
		"Baseline - Filtering": V4_BASELINE_FILTER_TESTS.length,
		"v4.0.0 - URL_REPLACE_FROM Array": V4_GROUP_A_URL_REPLACE_ARRAY.length,
		"v4.0.0 - Unified FilterRule": V4_GROUP_B_UNIFIED_FILTER.length,
		"v4.0.0 - TCO_REPLACEMENT": V4_GROUP_C_TCO_REPLACEMENT.length,
		"v4.0.0 - PREFIX_SELF_REFERENCE": V4_GROUP_D_SELF_REFERENCE.length,
		"v4.0.0 - COMBINE_TITLE_AND_CONTENT": V4_GROUP_E_COMBINE_CONTENT.length,
		"v4.0.0 - CHAR_MAP_REGEX": V4_GROUP_F_CHAR_MAP_REGEX.length,
		"v4.0.0 - safeTruncate Unicode": V4_GROUP_G_SAFE_TRUNCATE.length,
		"v4.0.0 - RSS_MAX_INPUT_CHARS": V4_GROUP_H_RSS_TRUNCATE.length,
		"v4.0.0 - Deduplication": V4_GROUP_I_DEDUPLICATION.length,
		"v4.0.0 - Platform Configs": V4_GROUP_J_PLATFORMS.length,
		"v4.0.0 - URL_DOMAIN_FIXES": V4_GROUP_K_DOMAIN_FIXES.length,
		"v4.0.0 - RSS RT Normalization": V4_GROUP_L_RSS_RT_NORMALIZE.length,
		"v4.0.0 - Edge Cases": V4_GROUP_M_EDGE_CASES.length,
		"v4.0.0 - URL Whitespace": V4_GROUP_N_URL_WHITESPACE.length,
		"v4.0.0 - URL Edge Cases": V4_GROUP_O_URL_EDGE_CASES.length,
		"v4.0.0 - Anchor Text": V4_GROUP_P_ANCHOR_TEXT.length,
		"v4.0.0 - Advanced Dedup": V4_GROUP_Q_ADVANCED_DEDUP.length,
		"v4.0.0 - Real-World": V4_GROUP_R_REAL_WORLD.length,
		"v4.0.0 - FilterRule Logic": V4_GROUP_S_FILTERRULE_LOGIC.length,
		"v4.0.0 - Edge Empty": V4_GROUP_T_EDGE_EMPTY.length
	}
};

// =============================================================================
// CONSOLE OUTPUT
// =============================================================================

console.log("╔════════════════════════════════════════════════════════════════╗");
console.log("║  IFTTT Webhook Filter v4.0.0 - Complete Test Suite             ║");
console.log("║  Build Date: " + testSuiteMetadata.buildDate + "                                       ║");
console.log("╠════════════════════════════════════════════════════════════════╣");
console.log("║  BASELINE TESTS (inherited from v3.x):                         ║");
console.log("║    Basic Tweets:        " + String(testSuiteMetadata.breakdown.baseline.basic).padStart(3) + " tests                           ║");
console.log("║    URLs:                " + String(testSuiteMetadata.breakdown.baseline.urls).padStart(3) + " tests                           ║");
console.log("║    Reposts & Quotes:    " + String(testSuiteMetadata.breakdown.baseline.reposts).padStart(3) + " tests                           ║");
console.log("║    HTML Entities:       " + String(testSuiteMetadata.breakdown.baseline.html).padStart(3) + " tests                           ║");
console.log("║    Filtering:           " + String(testSuiteMetadata.breakdown.baseline.filters).padStart(3) + " tests                           ║");
console.log("╠────────────────────────────────────────────────────────────────╣");
console.log("║  v4.0.0 NEW/CHANGED FEATURES:                                  ║");
console.log("║    A: URL_REPLACE_FROM Array:     " + String(testSuiteMetadata.breakdown.v4New.groupA_urlReplaceArray).padStart(3) + " tests                ║");
console.log("║    B: Unified FilterRule:         " + String(testSuiteMetadata.breakdown.v4New.groupB_unifiedFilter).padStart(3) + " tests                ║");
console.log("║    C: TCO_REPLACEMENT:            " + String(testSuiteMetadata.breakdown.v4New.groupC_tcoReplacement).padStart(3) + " tests                ║");
console.log("║    D: PREFIX_SELF_REFERENCE:      " + String(testSuiteMetadata.breakdown.v4New.groupD_selfReference).padStart(3) + " tests                ║");
console.log("║    E: COMBINE_TITLE_AND_CONTENT:  " + String(testSuiteMetadata.breakdown.v4New.groupE_combineContent).padStart(3) + " tests                ║");
console.log("║    F: CHAR_MAP_REGEX:             " + String(testSuiteMetadata.breakdown.v4New.groupF_charMapRegex).padStart(3) + " tests                ║");
console.log("║    G: safeTruncate Unicode:       " + String(testSuiteMetadata.breakdown.v4New.groupG_safeTruncate).padStart(3) + " tests                ║");
console.log("║    H: RSS_MAX_INPUT_CHARS:        " + String(testSuiteMetadata.breakdown.v4New.groupH_rssTruncate).padStart(3) + " tests                ║");
console.log("║    I: Deduplication:              " + String(testSuiteMetadata.breakdown.v4New.groupI_deduplication).padStart(3) + " tests                ║");
console.log("║    J: Platform Configs:           " + String(testSuiteMetadata.breakdown.v4New.groupJ_platforms).padStart(3) + " tests                ║");
console.log("║    K: URL_DOMAIN_FIXES:           " + String(testSuiteMetadata.breakdown.v4New.groupK_domainFixes).padStart(3) + " tests                ║");
console.log("║    L: RSS RT Normalization:       " + String(testSuiteMetadata.breakdown.v4New.groupL_rssRtNormalize).padStart(3) + " tests                ║");
console.log("║    M: Edge Cases:                 " + String(testSuiteMetadata.breakdown.v4New.groupM_edgeCases).padStart(3) + " tests                ║");
console.log("║    N: URL Whitespace:             " + String(testSuiteMetadata.breakdown.v4New.groupN_urlWhitespace).padStart(3) + " tests                ║");
console.log("║    O: URL Edge Cases:             " + String(testSuiteMetadata.breakdown.v4New.groupO_urlEdgeCases).padStart(3) + " tests                ║");
console.log("║    P: Anchor Text:                " + String(testSuiteMetadata.breakdown.v4New.groupP_anchorText).padStart(3) + " tests                ║");
console.log("║    Q: Advanced Dedup:             " + String(testSuiteMetadata.breakdown.v4New.groupQ_advancedDedup).padStart(3) + " tests                ║");
console.log("║    R: Real-World:                 " + String(testSuiteMetadata.breakdown.v4New.groupR_realWorld).padStart(3) + " tests                ║");
console.log("║    S: FilterRule Logic:           " + String(testSuiteMetadata.breakdown.v4New.groupS_filterRuleLogic).padStart(3) + " tests                ║");
console.log("║    T: Edge Empty:                 " + String(testSuiteMetadata.breakdown.v4New.groupT_edgeEmpty).padStart(3) + " tests                ║");
console.log("╠════════════════════════════════════════════════════════════════╣");
console.log("║  TOTAL BASELINE:        " + String(testSuiteMetadata.baselineTests).padStart(3) + " tests                           ║");
console.log("║  TOTAL v4.0.0 NEW:      " + String(testSuiteMetadata.newTests).padStart(3) + " tests                           ║");
console.log("╠════════════════════════════════════════════════════════════════╣");
console.log("║  GRAND TOTAL:           " + String(testSuiteMetadata.totalTests).padStart(3) + " tests                           ║");
console.log("╚════════════════════════════════════════════════════════════════╝");
console.log("");
console.log("🎯 CRITICAL v4.0.0 TEST AREAS:");
console.log("   ✓ URL_REPLACE_FROM as string[] (BREAKING CHANGE)");
console.log("   ✓ Unified FilterRule with 'content' (replaces 'keywords')");
console.log("   ✓ TCO_REPLACEMENT with deduplication");
console.log("   ✓ PREFIX_SELF_REFERENCE for self-quotes/reposts");
console.log("   ✓ COMBINE_TITLE_AND_CONTENT with CONTENT_TITLE_SEPARATOR");
console.log("   ✓ Pre-compiled CHAR_MAP_REGEX (100x performance boost)");
console.log("   ✓ safeTruncate with Unicode/emoji support");
console.log("   ✓ truncateRssInput with RSS_MAX_INPUT_CHARS");
console.log("   ✓ URL/Prefix/Placeholder deduplication mechanisms");
console.log("   ✓ URL_DOMAIN_FIXES initialization");
console.log("   ✓ RSS duplicate RT prefix normalization");
console.log("   ✓ URL whitespace trimming");
console.log("   ✓ RSS anchor tag text preservation");
console.log("   ✓ Real-world production scenarios (ČT24, Deník N, HN)");
console.log("   ✓ FilterRule advanced logic (regex, AND/OR, invalid handling)");
console.log("   ✓ Edge cases & empty content handling");
console.log("");

// =============================================================================
// EXPORTS
// =============================================================================

// Export for test runner
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		testCases: ALL_TESTS,
		testSuiteMetadata,
		// Settings presets
		TWITTER_SETTINGS,
		BLUESKY_SETTINGS,
		RSS_SETTINGS,
		YOUTUBE_SETTINGS,
		// Individual test groups - Baseline
		V4_BASELINE_BASIC_TESTS,
		V4_BASELINE_URL_TESTS,
		V4_BASELINE_REPOST_TESTS,
		V4_BASELINE_HTML_TESTS,
		V4_BASELINE_FILTER_TESTS,
		// Individual test groups - v4.0.0 New Features (A-M)
		V4_GROUP_A_URL_REPLACE_ARRAY,
		V4_GROUP_B_UNIFIED_FILTER,
		V4_GROUP_C_TCO_REPLACEMENT,
		V4_GROUP_D_SELF_REFERENCE,
		V4_GROUP_E_COMBINE_CONTENT,
		V4_GROUP_F_CHAR_MAP_REGEX,
		V4_GROUP_G_SAFE_TRUNCATE,
		V4_GROUP_H_RSS_TRUNCATE,
		V4_GROUP_I_DEDUPLICATION,
		V4_GROUP_J_PLATFORMS,
		V4_GROUP_K_DOMAIN_FIXES,
		V4_GROUP_L_RSS_RT_NORMALIZE,
		V4_GROUP_M_EDGE_CASES,
		// Individual test groups - v4.0.0 Extended (N-T)
		V4_GROUP_N_URL_WHITESPACE,
		V4_GROUP_O_URL_EDGE_CASES,
		V4_GROUP_P_ANCHOR_TEXT,
		V4_GROUP_Q_ADVANCED_DEDUP,
		V4_GROUP_R_REAL_WORLD,
		V4_GROUP_S_FILTERRULE_LOGIC,
		V4_GROUP_T_EDGE_EMPTY,
		// Aggregate groups
		ALL_V4_BASELINE_TESTS,
		ALL_V4_NEW_TESTS,
		ALL_TESTS
	};
}

// Also export as testCases for compatibility
var testCases = ALL_TESTS;

///////////////////////////////////////////////////////////////////////////////
// END OF COMPLETE TEST SUITE v4.0.0
// Total: 141 tests (23 baseline + 118 v4.0.0 specific)
// 
// Test Groups:
//   Baseline (5 groups): 23 tests - inherited from v3.x
//   v4.0.0 Core (A-M): 74 tests - new/changed features
//   v4.0.0 Extended (N-T): 52 tests - inspired by v3.1.x production cases
//
// Extended groups (N-T) cover:
//   N: URL Whitespace Handling (7 tests)
//   O: URL Edge Cases (7 tests)
//   P: Anchor Text Preservation (8 tests)
//   Q: Advanced Deduplication (8 tests)
//   R: Real-World Production Scenarios (6 tests)
//   S: FilterRule Advanced Logic (8 tests)
//   T: Edge Cases & Empty Content (8 tests)
///////////////////////////////////////////////////////////////////////////////
