# Settings for IFTTT filter script v3.0.0

This document explains all settings possibilities for the IFTTT filter script version 3.0.0 (Nightly Build 20251004), including default behaviors and examples of use. The script is designed to process posts from various platforms (e.g., Twitter, Bluesky, RSS, YouTube) and publish them via an IFTTT webhook.

The output is composed of several parts:

- Content: Text from the original post, including hashtags.
- Image URL: URL link to the first picture attached to the original post.
- Post URL: URL link to the original post.

These parts are combined in the output format, for example:

> This is an example of output.
> 
> #zpravobot
>
> 🖼️ https://example.com/image/link-to-image
> 
> 🔗 https://example.com/post/link-to-post

Note: Filter scripts in IFTTT run as “scripts in scripts over scripts,” so special care must be taken with special characters, often requiring escape sequences.

---

## What's New in v3.0

- **Advanced filtering system**: Support for literal strings, regex patterns, and logical combinations (AND/OR) via `FilterRule` objects
- **Smart trim strategy**: New intelligent content trimming with configurable tolerance for preserving sentence boundaries
- **Performance optimizations**: Lazy character map application, unified caching system, and early exit conditions
- **Enhanced type safety**: Full TypeScript 2.9.2 compatibility with proper type definitions
- **Improved URL handling**: Automatic protocol fixes for specified domains via `URL_DOMAIN_FIXES`

---

## Overview of Settings

The Settings for the final script look like the following:

```javascript
const SETTINGS: AppSettings = {
  ///////////////////////////////////////////////////////////////////////////
  // CONTENT FILTERING & VALIDATION
  ///////////////////////////////////////////////////////////////////////////
  PHRASES_BANNED: [], 
  PHRASES_REQUIRED: [], 
  REPOST_ALLOWED: true,

  ///////////////////////////////////////////////////////////////////////////
  // CONTENT PROCESSING & TRANSFORMATION
  ///////////////////////////////////////////////////////////////////////////
  AMPERSAND_SAFE_CHAR: `⅋`,
  CONTENT_REPLACEMENTS: [],
  POST_LENGTH: 444,
  POST_LENGTH_TRIM_STRATEGY: "smart",
  SMART_TOLERANCE_PERCENT: 12,

  ///////////////////////////////////////////////////////////////////////////
  // URL CONFIGURATION
  ///////////////////////////////////////////////////////////////////////////
  URL_REPLACE_FROM: "https://x.com/",
  URL_REPLACE_TO: "https://twitter.com/",
  URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"],
  URL_DOMAIN_FIXES: [],
  FORCE_SHOW_ORIGIN_POSTURL: false,
  FORCE_SHOW_FEEDURL: false,
  SHOW_IMAGEURL: false,

  ///////////////////////////////////////////////////////////////////////////
  // OUTPUT FORMATTING & PREFIXES
  ///////////////////////////////////////////////////////////////////////////
  PREFIX_REPOST: " 𝕏📤 ",
  PREFIX_QUOTE: " 𝕏📝💬 ",
  PREFIX_IMAGE_URL: "",
  PREFIX_POST_URL: "\n",
  MENTION_FORMATTING: { "TW": { type: "suffix", value: "@twitter.com" } },

  ///////////////////////////////////////////////////////////////////////////
  // PLATFORM-SPECIFIC SETTINGS
  ///////////////////////////////////////////////////////////////////////////
  POST_FROM: "TW",
  SHOW_REAL_NAME: true,
  SHOW_TITLE_AS_CONTENT: false,

  ///////////////////////////////////////////////////////////////////////////
  // RSS-SPECIFIC SETTINGS
  ///////////////////////////////////////////////////////////////////////////
  RSS_MAX_INPUT_CHARS: 1000,
  RSS_INPUT_TRUNCATION_STRATEGY: "preserve_content",
};
```

---

## Detailed Settings Description

### CONTENT FILTERING & VALIDATION

#### PHRASES_BANNED - (string | FilterRule)[]
Advanced filtering system for banned content. Supports simple strings, regex patterns, and logical combinations.

**Examples:**
```javascript
// Simple string matching (case-insensitive)
PHRASES_BANNED: ["advertisement", "spam"]

// Regex pattern matching
PHRASES_BANNED: [
  { type: "regex", pattern: "\\bsale\\b", flags: "i" }
]

// AND logic - all keywords must be present
PHRASES_BANNED: [
  { type: "and", keywords: ["buy", "now", "discount"] }
]

// OR logic - any keyword triggers the filter
PHRASES_BANNED: [
  { type: "or", keywords: ["ad", "sponsored", "promo"] }
]

// Mixed approach
PHRASES_BANNED: [
  "advertisement",
  { type: "regex", pattern: "\\d+% off", flags: "i" },
  { type: "and", keywords: ["limited", "offer"] }
]
```

#### PHRASES_REQUIRED - (string | FilterRule)[]
Mandatory keywords or patterns that must appear in posts. Uses the same FilterRule system as `PHRASES_BANNED`.

**Examples:**
```javascript
// At least one of these must be present
PHRASES_REQUIRED: ["news", "update"]

// Complex requirement
PHRASES_REQUIRED: [
  { type: "or", keywords: ["breaking", "urgent", "alert"] }
]
```

#### REPOST_ALLOWED - boolean
Determines whether reposts (retweets) are processed or skipped.

**Example:**
```javascript
REPOST_ALLOWED: true  // Allow reposts
REPOST_ALLOWED: false // Skip all reposts
```

---

### CONTENT PROCESSING & TRANSFORMATION

#### AMPERSAND_SAFE_CHAR - string
Character used to replace ampersands (&) to prevent encoding issues in IFTTT filters.

**Example:**
```javascript
AMPERSAND_SAFE_CHAR: `⅋`  // Unicode character that won't break IFTTT
```

#### CONTENT_REPLACEMENTS - object[]
Array of regex patterns and replacements for content manipulation. Replaces the former `CONTENT_HACK_PATTERNS`.

**Example:**
```javascript
CONTENT_REPLACEMENTS: [
  { 
	pattern: "what", 
	replacement: "by_what", 
	flags: "gi", 
	literal: false 
  },
  {
	pattern: "example.com",
	replacement: "https://example.com",
	flags: "g",
	literal: true  // Treat pattern as literal string, not regex
  }
]
```

#### POST_LENGTH - number
Maximum post length in characters (0-500). Content exceeding this will be trimmed according to `POST_LENGTH_TRIM_STRATEGY`.

**Example:**
```javascript
POST_LENGTH: 444  // 444 characters maximum
```

#### POST_LENGTH_TRIM_STRATEGY - string
Strategy for content truncation. **New in v3.0**: `"smart"` strategy.

**Options:**
- `"word"` - Cut at word boundary
- `"sentence"` - Preserve last complete sentence
- `"smart"` - Hybrid approach using `SMART_TOLERANCE_PERCENT`

**Example:**
```javascript
POST_LENGTH_TRIM_STRATEGY: "smart"
```

#### SMART_TOLERANCE_PERCENT - number
**New in v3.0.** Percentage of `POST_LENGTH` that can be "wasted" to preserve sentence boundaries when using smart trim strategy. Range: 5-25, recommended: 12.

**Example:**
```javascript
SMART_TOLERANCE_PERCENT: 12  // Allow 12% tolerance (53 chars for POST_LENGTH=444)
```

**How it works:**
- With `POST_LENGTH: 444` and `SMART_TOLERANCE_PERCENT: 12`
- Minimum acceptable length: 391 chars (444 - 12%)
- If last sentence ends between 391-444 chars, preserve it
- Otherwise, fall back to word boundary trimming

---

### URL CONFIGURATION

#### URL_REPLACE_FROM - string
Source URL pattern to be replaced. Formerly `POST_SOURCE`.

**Example:**
```javascript
URL_REPLACE_FROM: "https://x.com/"
```

#### URL_REPLACE_TO - string
Target URL pattern for replacement. Formerly `POST_TARGET`.

**Example:**
```javascript
URL_REPLACE_TO: "https://twitter.com/"
```

#### URL_NO_TRIM_DOMAINS - string[]
Domains whose URLs should NOT have query strings trimmed, but will still be URL-encoded. Formerly `EXCLUDED_URLS`.

**Example:**
```javascript
URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"]
```

#### URL_DOMAIN_FIXES - string[]
**New in v3.0.** Domains to automatically prepend with `https://` if protocol is missing. Pre-processed into `CONTENT_REPLACEMENTS` at initialization.

**Example:**
```javascript
URL_DOMAIN_FIXES: ["rspkt.cz", "example.com"]

// Input:  "Check out example.com/page"
// Output: "Check out https://example.com/page"
```

#### FORCE_SHOW_ORIGIN_POSTURL - boolean
Always include original post URL in output, regardless of other conditions. Formerly `SHOW_ORIGIN_POSTURL_PERM`.

**Example:**
```javascript
FORCE_SHOW_ORIGIN_POSTURL: false
```

#### FORCE_SHOW_FEEDURL - boolean
Show feed URL instead of post-specific URL when URL processing yields empty string. Formerly `SHOW_FEEDURL_INSTD_POSTURL`.

**Example:**
```javascript
FORCE_SHOW_FEEDURL: false
```

#### SHOW_IMAGEURL - boolean
Include image URLs in post output using `PREFIX_IMAGE_URL`.

**Example:**
```javascript
SHOW_IMAGEURL: false
```

---

### OUTPUT FORMATTING & PREFIXES

#### PREFIX_REPOST - string
Prefix for repost (retweet) formatting. Formerly `REPOST_SENTENCE`.

**Example:**
```javascript
PREFIX_REPOST: " ð•ðŸ"¤ "

// Output: "Daniel Šnor ð•ðŸ"¤ @zpravobot@twitter.com: ..."
```

#### PREFIX_QUOTE - string
Prefix for quote post formatting. Formerly `QUOTE_SENTENCE`.

**Example:**
```javascript
PREFIX_QUOTE: " ð•ðŸ"ðŸ'¬ "

// Output: "Daniel Šnor ð•ðŸ"ðŸ'¬ @otheruser@twitter.com: ..."
```

#### PREFIX_IMAGE_URL - string
Prefix added before image URLs when `SHOW_IMAGEURL` is true. Formerly `STATUS_IMAGEURL_SENTENCE`.

**Example:**
```javascript
PREFIX_IMAGE_URL: "ðŸ–¼ï¸ "

// Output: "ðŸ–¼ï¸ https://example.com/image.jpg"
```

#### PREFIX_POST_URL - string
Prefix/formatting added before the final post URL. Formerly `STATUS_URL_SENTENCE`.

**Example:**
```javascript
PREFIX_POST_URL: "\n"          // Simple newline
PREFIX_POST_URL: "\n\nð• "     // Newline with X emoji
PREFIX_POST_URL: "\nðŸ"— "      // Newline with link emoji
```

#### MENTION_FORMATTING - object
Platform-specific formatting for @mentions. Supports `prefix`, `suffix`, or `none`.

**Example:**
```javascript
MENTION_FORMATTING: {
  "TW": { type: "suffix", value: "@twitter.com" },
  "BS": { type: "prefix", value: "https://bsky.app/profile/" }
}

// Twitter output: "@username@twitter.com"
// Bluesky output: "https://bsky.app/profile/username"
```

---

### PLATFORM-SPECIFIC SETTINGS

#### POST_FROM - string
Source platform identifier. Formerly `POST_FROM` (unchanged).

**Options:** `"BS"` (Bluesky), `"RSS"`, `"TW"` (Twitter/X), `"YT"` (YouTube)

**Example:**
```javascript
POST_FROM: "TW"
```

#### SHOW_REAL_NAME - boolean
Use author's real name instead of username. Formerly `SHOULD_PREFER_REAL_NAME`.

**Example:**
```javascript
SHOW_REAL_NAME: true

// Output: "Daniel Šnor ð•ðŸ"¤ ..." (instead of "@danielsnor ð•ðŸ"¤ ...")
```

#### SHOW_TITLE_AS_CONTENT - boolean
Prioritize entry title over entry content as main post content.

**Example:**
```javascript
SHOW_TITLE_AS_CONTENT: false
```

---

### RSS-SPECIFIC SETTINGS

#### RSS_MAX_INPUT_CHARS - number
Maximum input length for RSS feeds before processing (0 = no limit). Formerly `RSS_INPUT_LIMIT`.

**Example:**
```javascript
RSS_MAX_INPUT_CHARS: 1000
```

#### RSS_INPUT_TRUNCATION_STRATEGY - string
Strategy for RSS input truncation.

**Options:**
- `"simple"` - Basic cut
- `"preserve_content"` - Attempt to preserve meaningful content

**Example:**
```javascript
RSS_INPUT_TRUNCATION_STRATEGY: "preserve_content"
```

---

## Migration Guide from v2.0 to v3.0

### Renamed Settings

| v2.0 Name | v3.0 Name |
|-----------|-----------|
| `AMPERSAND_REPLACEMENT` | `AMPERSAND_SAFE_CHAR` |
| `BANNED_COMMERCIAL_PHRASES` | `PHRASES_BANNED` |
| `CONTENT_HACK_PATTERNS` | `CONTENT_REPLACEMENTS` |
| `EXCLUDED_URLS` | `URL_NO_TRIM_DOMAINS` |
| `MANDATORY_KEYWORDS` | `PHRASES_REQUIRED` |
| `POST_SOURCE` | `URL_REPLACE_FROM` |
| `POST_TARGET` | `URL_REPLACE_TO` |
| `QUOTE_SENTENCE` | `PREFIX_QUOTE` |
| `REPOST_SENTENCE` | `PREFIX_REPOST` |
| `RSS_INPUT_LIMIT` | `RSS_MAX_INPUT_CHARS` |
| `SHOULD_PREFER_REAL_NAME` | `SHOW_REAL_NAME` |
| `SHOW_FEEDURL_INSTD_POSTURL` | `FORCE_SHOW_FEEDURL` |
| `SHOW_ORIGIN_POSTURL_PERM` | `FORCE_SHOW_ORIGIN_POSTURL` |
| `STATUS_IMAGEURL_SENTENCE` | `PREFIX_IMAGE_URL` |
| `STATUS_URL_SENTENCE` | `PREFIX_POST_URL` |
| `USER_INSTANCE` | Removed (use `MENTION_FORMATTING`) |

### New Settings in v3.0

- `SMART_TOLERANCE_PERCENT` - For smart trim strategy
- `URL_DOMAIN_FIXES` - Automatic protocol addition
- New trim strategy: `"smart"` for `POST_LENGTH_TRIM_STRATEGY`

### Enhanced Settings

- `PHRASES_BANNED` and `PHRASES_REQUIRED` now support `FilterRule` objects with regex, AND, and OR logic
- `CONTENT_REPLACEMENTS` now supports `literal` flag for non-regex patterns

---

## Advanced Examples

### Complex Filtering Setup

```javascript
PHRASES_BANNED: [
  // Block any post with "advertisement"
  "advertisement",
  
  // Block posts with sale percentages (e.g., "50% off")
  { type: "regex", pattern: "\\d+%\\s*off", flags: "i" },
  
  // Block posts that have BOTH "limited" AND "offer"
  { type: "and", keywords: ["limited", "offer"] },
  
  // Block posts with any commercial trigger words
  { type: "or", keywords: ["buy now", "shop", "deal", "discount"] }
],

PHRASES_REQUIRED: [
  // Require at least one tech-related keyword
  { type: "or", keywords: ["technology", "software", "hardware", "coding"] }
]
```

### Platform-Specific Configurations

```javascript
// For Twitter bot
POST_FROM: "TW",
SHOW_REAL_NAME: true,
URL_REPLACE_FROM: "https://x.com/",
URL_REPLACE_TO: "https://twitter.com/",
MENTION_FORMATTING: {
  "TW": { type: "suffix", value: "@twitter.com" }
},
PREFIX_REPOST: " ð•ðŸ"¤ ",
PREFIX_QUOTE: " ð•ðŸ"ðŸ'¬ ",

// For Bluesky bot
POST_FROM: "BS",
SHOW_REAL_NAME: true,
MENTION_FORMATTING: {
  "BS": { type: "none", value: "" }
},
PREFIX_REPOST: " ðŸ¦‹ðŸ"¤ ",
PREFIX_QUOTE: " ðŸ¦‹ðŸ"ðŸ'¬ "
```

---

## Performance Notes

v3.0 includes significant performance optimizations:

- **Lazy character map**: HTML entities are only processed when detected in content
- **Unified caching**: Regex patterns and escaped strings share a FIFO cache (max 500 entries)
- **Early exits**: Filter checks return immediately when conditions are met
- **Pre-compilation**: `URL_DOMAIN_FIXES` patterns are compiled at initialization

---

## Additional Notes

### Special Characters and Escape Sequences
When configuring strings, ensure special characters are properly escaped to avoid processing errors in IFTTT. The script handles most common cases automatically.

### TypeScript Compatibility
The script is fully compatible with TypeScript 2.9.2 (IFTTT's JavaScript environment). All type definitions are included for better code validation.

### Platform Detection
The script automatically adapts its behavior based on `POST_FROM`:
- **TW**: Handles replies, retweets, quotes, t.co URL removal
- **BS**: Handles quote markers, moves URLs to end
- **RSS**: Uses content selection logic, applies RSS-specific limits
- **YT**: Minimal processing, content-focused

---

## That's All, Folks

This documentation covers all configuration options for IFTTT filter script v3.0.0. For questions or support, contact via social networks or About.me page.

(Updated: October 2025)