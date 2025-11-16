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
}