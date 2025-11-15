///////////////////////////////////////////////////////////////////////////////
// COMPLETE Test Suite for IFTTT Webhook Filter v3.1.0
// Build 20251112 - WITH v3.1.0 NEW FEATURES
// Total: 143 tests (125 from v3.0.3 + 18 new v3.1.0 tests)
///////////////////////////////////////////////////////////////////////////////
//
// NEW in v3.1.0 Tests:
// - MOVE_URL_TO_END setting migration (4 tests) - Group A
// - FORCE_SHOW_ORIGIN_POSTURL fix (4 tests) - Group B
// - NOT filtering rule (3 tests) - Group C
// - COMPLEX filtering rule (7 tests) - Group C
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
	MOVE_URL_TO_END: boolean; // v3.1.0: New setting
	RSS_MAX_INPUT_CHARS: number;
}

///////////////////////////////////////////////////////////////////////////////
// NEW v3.1.0 TEST CASES - GROUP A: MOVE_URL_TO_END Setting Migration
///////////////////////////////////////////////////////////////////////////////

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
// TEST EXECUTION SUMMARY
///////////////////////////////////////////////////////////////////////////////

console.log("=".repeat(80));
console.log("IFTTT Webhook Filter v3.1.0 - Test Suite Summary");
console.log("=".repeat(80));
console.log("");
console.log("NEW v3.1.0 Features Tests:");
console.log("  Group A - MOVE_URL_TO_END Setting Migration:  " + V3_1_0_GROUP_A_TESTS.length + " tests");
console.log("  Group B - FORCE_SHOW_ORIGIN_POSTURL Fix:      " + V3_1_0_GROUP_B_TESTS.length + " tests");
console.log("  Group C - NOT and COMPLEX Filtering Rules:    " + V3_1_0_GROUP_C_TESTS.length + " tests");
console.log("");
console.log("Total NEW v3.1.0 tests:                          " + ALL_V3_1_0_NEW_TESTS.length + " tests");
console.log("");
console.log("NOTE: Add these 18 tests to the existing 125 tests from v3.0.3");
console.log("      for a complete test suite of 143 tests.");
console.log("");
console.log("=".repeat(80));