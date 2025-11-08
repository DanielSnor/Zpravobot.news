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
