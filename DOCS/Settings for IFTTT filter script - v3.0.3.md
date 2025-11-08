# Settings for IFTTT filter script v3.0.3

This document explains all settings possibilities for the IFTTT filter script version 3.0.3 (Chaos Never Dies Day, Nov 9th, 2025 rev), including default behaviors and examples of use. The script is designed to process posts from various platforms (e.g., Twitter, Bluesky, RSS, YouTube) and publish them via an IFTTT webhook.

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

Note: Filter scripts in IFTTT run as "scripts in scripts over scripts," so special care must be taken with special characters, often requiring escape sequences.

---

## What's New in v3.0.3

- **Multiple domain replacement**: `URL_REPLACE_FROM` now supports array format to replace multiple source domains with a single target domain
- **Example use case**: Replace both `twitter.com` AND `x.com` URLs with `xcancel.com` in one configuration
- **Backward compatibility**: Single string format still works exactly as before
- **Simplified configuration**: No need for complex regex patterns to handle multiple domains

---

## What's New in v3.0

- **Advanced filtering system**: Support for literal strings, regex patterns, and logical combinations (AND/OR) via `FilterRule` objects
- **Smart trim strategy**: New intelligent content trimming with configurable tolerance for preserving sentence boundaries
- **Self-reference handling**: New PREFIX_SELF_REFERENCE setting for self-quotes and self-reposts (e.g., "vlastní post")
- **Improved quote detection**: Self-quotes are now properly detected and formatted (no longer skipped)
- **Performance optimizations**: Lazy character map application, unified caching system, and early exit conditions
- **Enhanced type safety**: Full TypeScript 2.9.2 compatibility with proper type definitions
- **Improved URL handling**: Automatic protocol fixes for specified domains via `URL_DOMAIN_FIXES`
- **RSS truncation tracking**: Proper ellipsis handling when RSS content is pre-truncated at input stage

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
  URL_REPLACE_FROM: ["https://twitter.com/", "https://x.com/"],
  URL_REPLACE_TO: "https://xcancel.com/",
  URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"],
  URL_DOMAIN_FIXES: [],
  FORCE_SHOW_ORIGIN_POSTURL: false,
  FORCE_SHOW_FEEDURL: false,
  SHOW_IMAGEURL: false,

  ///////////////////////////////////////////////////////////////////////////
  // OUTPUT FORMATTING & PREFIXES
  ///////////////////////////////////////////////////////////////////////////
  PREFIX_REPOST: " 𝕏🔤 ",
  PREFIX_QUOTE: " 𝕏🔖💬 ",
  PREFIX_IMAGE_URL: "",
  PREFIX_POST_URL: "\n",
  PREFIX_SELF_REFERENCE: "vlastní post",
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
Determines whether reposts (retweets) are processed or skipped. Only affects external reposts; self-reposts are always allowed and formatted with `PREFIX_SELF_REFERENCE`.

**Example:**
```javascript
REPOST_ALLOWED: true  // Allow external reposts
REPOST_ALLOWED: false // Skip external reposts (self-reposts still allowed)
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
SMART_TOLERANCE_PERCENT: 12
```

---

### URL CONFIGURATION

#### URL_REPLACE_FROM - string | string[]
**Updated in v3.0.3**: Now supports both single string and array of strings.

Original post URL base string(s) to be replaced. Can be:
- **Single domain** (string): `"https://x.com/"`
- **Multiple domains** (array): `["https://x.com/", "https://twitter.com/"]`

When using array format, all specified domains will be replaced with `URL_REPLACE_TO`.

**Examples:**
```javascript
// Single domain (backward compatible)
URL_REPLACE_FROM: "https://x.com/"

// Multiple domains (NEW in v3.0.3)
URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"]

// Replace both twitter.com and x.com with xcancel.com
URL_REPLACE_FROM: ["https://twitter.com/", "https://x.com/"]
URL_REPLACE_TO: "https://xcancel.com/"
```

**Common use cases:**
- Redirect both official Twitter domains to alternative frontend
- Handle URL inconsistencies across different IFTTT triggers
- Centralize domain replacement without complex regex patterns

#### URL_REPLACE_TO - string
Target post URL base string for replacement.

**Example:**
```javascript
URL_REPLACE_TO: "https://xcancel.com/"
```

#### URL_NO_TRIM_DOMAINS - string[]
URLs that should NOT be trimmed by `trimUrlQuery`, but should still be URL-encoded in `processAmpersands`.

**Example:**
```javascript
URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com", "example.com"]
```

#### URL_DOMAIN_FIXES - string[]
**New in v3.0.** A list of domains (e.g., "rspkt.cz", "example.com") to add the `https://` protocol to if missing.

**Example:**
```javascript
URL_DOMAIN_FIXES: ["rspkt.cz", "example.com"]

// Input:  "rspkt.cz/article"
// Output: "https://rspkt.cz/article"
```

#### FORCE_SHOW_ORIGIN_POSTURL - boolean
If true, always include the original post URL in the output, regardless of other conditions. Works in conjunction with other URL display logic.

**Example:**
```javascript
FORCE_SHOW_ORIGIN_POSTURL: false
```

#### FORCE_SHOW_FEEDURL - boolean
If true, show the feed's URL instead of the specific post's URL as a fallback when URL processing yields empty string.

**Example:**
```javascript
FORCE_SHOW_FEEDURL: false
```

#### SHOW_IMAGEURL - boolean
If true, include image URLs in the post output (using `PREFIX_IMAGE_URL`).

**Example:**
```javascript
SHOW_IMAGEURL: false
```

---

### OUTPUT FORMATTING & PREFIXES

#### PREFIX_REPOST - string
Prefix used when formatting a repost (retweet).

**Example:**
```javascript
PREFIX_REPOST: " 𝕏🔤 "

// Output: "Daniel Šnor 𝕏🔤 ..."
```

#### PREFIX_QUOTE - string
Prefix used when formatting a quote post (mainly for Bluesky and Twitter).

**Example:**
```javascript
PREFIX_QUOTE: " 𝕏🔖💬 "

// Output: "Daniel Šnor 𝕏🔖💬 ..."
```

#### PREFIX_IMAGE_URL - string
Prefix added before the image URL when included.

**Example:**
```javascript
PREFIX_IMAGE_URL: ""

// Or with emoji:
PREFIX_IMAGE_URL: "🖼️ "
```

#### PREFIX_POST_URL - string
Prefix/suffix formatting added before/after the final post URL.

**Example:**
```javascript
PREFIX_POST_URL: "\n"

// Or with emoji:
PREFIX_POST_URL: "\n🔗 "
```

#### PREFIX_SELF_REFERENCE - string
**New in v3.0.** Text for self-quotes and self-reposts (e.g., "vlastní post", "svůj příspěvek").

Used when the author quotes or reposts their own content, providing cleaner output instead of showing "@username".

**Example:**
```javascript
PREFIX_SELF_REFERENCE: "vlastní post"

// Output: "Daniel Šnor 𝕏🔤 vlastní post: ..."
// Instead of: "Daniel Šnor 𝕏🔤 @danielsnor: ..."
```

#### MENTION_FORMATTING - object
Defines how @mentions are formatted per platform (e.g., add suffix, prefix, or do nothing).

**Example:**
```javascript
MENTION_FORMATTING: {
  "TW": { type: "suffix", value: "@twitter.com" }
}

// Input:  "@username"
// Output: "@username@twitter.com"
```

---

### PLATFORM-SPECIFIC SETTINGS

#### POST_FROM - string
Identifier for the source platform of the post.

**Options:**
- `"BS"` - Bluesky
- `"RSS"` - RSS feed
- `"TW"` - Twitter/X
- `"YT"` - YouTube

**Example:**
```javascript
POST_FROM: "TW"
```

#### SHOW_REAL_NAME - boolean
If true, use the author's real name (if available) instead of their username in certain contexts (e.g., reposts, quotes).

**Example:**
```javascript
SHOW_REAL_NAME: true

// Output: "Daniel Šnor 𝕏🔤 ..." (instead of "@danielsnor 𝕏🔤 ...")
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
Maximum input length for RSS feeds before processing (0 = no limit). Formerly `RSS_INPUT_LIMIT`. When content is truncated at this stage, the script automatically tracks this and ensures proper ellipsis handling in the final output.

**Example:**
```javascript
RSS_MAX_INPUT_CHARS: 1000
```

---

## Advanced Platform Detection

### TypeScript Compatibility
The script is fully compatible with TypeScript 2.9.2 (IFTTT's JavaScript environment). All type definitions are included for better code validation.

### Platform Detection
The script automatically adapts its behavior based on `POST_FROM`:
- **TW**: Handles replies, retweets, quotes, self-quotes, self-reposts, t.co URL removal
- **BS**: Handles quote markers, moves URLs to end
- **RSS**: Uses content selection logic, applies RSS-specific limits
- **YT**: Minimal processing, content-focused

### Self-Quote and Self-Repost Handling
**New in v3.0**: The script now properly detects and formats self-quotes and self-reposts:

- Self-quotes are detected by comparing the quoted user's username with the current author
- Self-reposts are detected by checking if the RT @username matches the current author
- Both use `PREFIX_SELF_REFERENCE` instead of displaying the user's @username
- This provides cleaner, more natural output (e.g., "vlastní post" instead of "@username")
- The comparison uses `authorUsername` (not display name) to work correctly with `SHOW_REAL_NAME`

---

## Migration Guide from v3.0.0 to v3.0.3

### Updated Settings

#### URL_REPLACE_FROM
The setting now supports both string and array formats:

**v3.0.0 format (still supported):**
```javascript
URL_REPLACE_FROM: "https://x.com/"
```

**v3.0.3 format (new):**
```javascript
URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"]
```

**Migration example:**
```javascript
// Before v3.0.3 - needed complex workarounds
URL_REPLACE_FROM: "https://x.com/"
// Could only replace one domain at a time

// v3.0.3 - simple array
URL_REPLACE_FROM: ["https://twitter.com/", "https://x.com/"]
URL_REPLACE_TO: "https://xcancel.com/"
// Now replaces both domains with single configuration
```

### No Breaking Changes
- All v3.0.0 configurations work without modification in v3.0.3
- Single string format is fully backward compatible
- No other settings were changed or renamed

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

- `PREFIX_SELF_REFERENCE` - Text for self-quotes and self-reposts
- `SMART_TOLERANCE_PERCENT` - For smart trim strategy
- `URL_DOMAIN_FIXES` - Automatic protocol addition
- New trim strategy: `"smart"` for `POST_LENGTH_TRIM_STRATEGY`

### Enhanced Settings

- `PHRASES_BANNED` and `PHRASES_REQUIRED` now support `FilterRule` objects with regex, AND, and OR logic
- `CONTENT_REPLACEMENTS` now supports `literal` flag for non-regex patterns
- `URL_REPLACE_FROM` now supports array format (v3.0.3+)

### Behavior Changes

- **Self-quotes are now detected and formatted**: In v2.0, self-quotes were excluded. In v3.0, they are properly detected and formatted with `PREFIX_SELF_REFERENCE` instead of the user's @username.
- **Self-reposts always allowed**: The `REPOST_ALLOWED` setting now only affects external reposts. Self-reposts are always processed and formatted with `PREFIX_SELF_REFERENCE`.
- **Improved quote tweet URL selection**: Quote tweets now prefer `entryUrl` (the user's own tweet) over `imageUrl` (the quoted tweet) for the final URL.
- **RSS truncation tracking**: When RSS content is truncated at input stage (`RSS_MAX_INPUT_CHARS`), this is now tracked throughout processing to ensure proper ellipsis handling.

---

## That's All, Folks

This documentation covers all configuration options for IFTTT filter script v3.0.3. For questions or support, contact via social networks or About.me page.

(Updated: November 2025)