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