# Settings for IFTTT filter script v3.1.0

This document explains all settings possibilities for the IFTTT filter script version 3.1.0 (Button Day, Nov 16th, 2025 rev), including default behaviors and examples of use. The script is designed to process posts from various platforms (e.g., Twitter, Bluesky, RSS, YouTube) and publish them via an IFTTT webhook.

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

## What's New in v3.1.0

- **Unified Filtering System with Regex Support** (merged from v3.2.0): Revolutionary enhancement to filter rules enabling granular content matching across multiple dimensions:
  - **New filter fields**: `content`, `contentRegex`, `username`, `usernameRegex`, `domain`, `domainRegex`
  - **Content filtering**: Match literal keywords or regex patterns in post content
  - **Username filtering**: Filter by author usernames with literal or regex matching
  - **Domain filtering**: Filter by URL domains with literal or regex patterns
  - **Flexible combinations**: Mix literal and regex patterns in the same filter
  - **Full backward compatibility**: Legacy `keywords` syntax still works

- **Anchor Tag HTML Processing** (merged from v3.2.0 hotfix): Fixes RSS feed HTML anchor tag handling:
  - Properly extracts URLs from `<a href="...">text</a>` tags
  - Prevents duplicate `https://` protocols (e.g., from `pic.twitter.com`)
  - Removes anchor link text while preserving URLs
  - Handles multiple anchor tags correctly
  - Works seamlessly with `CONTENT_REPLACEMENTS` and `URL_DOMAIN_FIXES`

- **Advanced NOT/COMPLEX filtering rules**: New `FilterRule` types enabling sophisticated logical combinations:
  - `not`: Negates any filter rule (string, regex, and, or, or even nested complex rules)
  - `complex`: Combines multiple rules using AND/OR operators for multi-level filtering logic

- **MOVE_URL_TO_END setting**: Migrated from platform-specific hardcoded behavior to user-configurable setting. Allows users to control whether URLs at the beginning of content should be moved to the end (useful for RSS feeds).

- **Enhanced FORCE_SHOW_ORIGIN_POSTURL**: Now properly handles quote tweets by preferring `entryUrl` (the user's own tweet) over `imageUrl` (the quoted tweet URL).

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
  // CONTENT FILTERING & VALIDATION /////////////////////////////////////////
  PHRASES_BANNED: [], 
  PHRASES_REQUIRED: [], 
  REPOST_ALLOWED: true,

  // CONTENT PROCESSING & TRANSFORMATION ////////////////////////////////////
  AMPERSAND_SAFE_CHAR: `⅋`,
  CONTENT_REPLACEMENTS: [],
  POST_LENGTH: 444,
  POST_LENGTH_TRIM_STRATEGY: "smart",
  SMART_TOLERANCE_PERCENT: 12,

  // URL CONFIGURATION //////////////////////////////////////////////////////
  URL_REPLACE_FROM: ["https://twitter.com/", "https://x.com/"],
  URL_REPLACE_TO: "https://xcancel.com/",
  URL_NO_TRIM_DOMAINS: ["youtu.be", "youtube.com"],
  URL_DOMAIN_FIXES: [],
  FORCE_SHOW_ORIGIN_POSTURL: false,
  FORCE_SHOW_FEEDURL: false,
  SHOW_IMAGEURL: false,

  // OUTPUT FORMATTING & PREFIXES ///////////////////////////////////////////
  PREFIX_REPOST: " 𝕏🔤 ",
  PREFIX_QUOTE: " 𝕏🔖💬 ",
  PREFIX_IMAGE_URL: "",
  PREFIX_POST_URL: "\n",
  PREFIX_SELF_REFERENCE: "his post",
  MENTION_FORMATTING: { "TW": { type: "suffix", value: "@twitter.com" } },

  // PLATFORM-SPECIFIC SETTINGS /////////////////////////////////////////////
  MOVE_URL_TO_END: false,
  POST_FROM: "TW",
  SHOW_REAL_NAME: true,
  SHOW_TITLE_AS_CONTENT: false,

  // RSS-SPECIFIC SETTINGS //////////////////////////////////////////////////
  RSS_MAX_INPUT_CHARS: 1000,
};
```

---

## Detailed Settings Description

### CONTENT FILTERING & VALIDATION

#### PHRASES_BANNED - (string | FilterRule)[]
Advanced filtering system for banned content. Supports simple strings, regex patterns, and logical combinations including NOT and COMPLEX rules (new in v3.1.0).

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

// NOT logic - negates any rule (NEW in v3.1.0)
PHRASES_BANNED: [
  { type: "not", rule: "breaking news" }  // Block posts that DON'T contain "breaking news"
]

// NOT with regex (NEW in v3.1.0)
PHRASES_BANNED: [
  { type: "not", rule: { type: "regex", pattern: "\\d{4}", flags: "g" } }  // Block posts without any 4-digit numbers
]

// COMPLEX logic - multi-level combinations (NEW in v3.1.0)
PHRASES_BANNED: [
  { 
    type: "complex",
    operator: "and",
    rules: [
      "advertisement",
      { type: "or", keywords: ["sale", "discount", "offer"] }
    ]
  }
  // Blocks posts that contain "advertisement" AND (sale OR discount OR offer)
]

// Advanced COMPLEX example with NOT (NEW in v3.1.0)
PHRASES_BANNED: [
  {
    type: "complex",
    operator: "and",
    rules: [
      { type: "or", keywords: ["click", "here", "link"] },
      { type: "not", rule: "official" }
    ]
  }
  // Blocks posts with clickbait words but NOT containing "official"
]

// Mixed approach
PHRASES_BANNED: [
  "advertisement",
  { type: "regex", pattern: "\\d+% off", flags: "i" },
  { type: "and", keywords: ["limited", "offer"] },
  { type: "not", rule: { type: "or", keywords: ["news", "announcement"] } }
]
```

---

### Unified Filtering System (NEW in v3.1.0)

The unified filtering system extends filter rules with powerful new fields for matching content, usernames, and domains. These can be used in `PHRASES_BANNED` and `PHRASES_REQUIRED`.

#### New FilterRule Fields

Each filter rule can now include these optional fields:

- **content**: `string[]` - Array of literal strings to match in post content (OR logic)
- **contentRegex**: `string[]` - Array of regex patterns to match in content (OR logic)  
- **username**: `string[]` - Array of literal usernames to match (OR logic)
- **usernameRegex**: `string[]` - Array of regex patterns for usernames (OR logic)
- **domain**: `string[]` - Array of literal domains to match in URLs (OR logic)
- **domainRegex**: `string[]` - Array of regex patterns for domains (OR logic)

#### OR Filter with Unified Fields

OR filters pass if **ANY** condition is met:

```javascript
// OR: Content matching (literal)
PHRASES_REQUIRED: [
  {
    type: "or",
    content: ["breaking", "urgent", "alert"]
  }
  // Requires at least one of these keywords
]

// OR: Content matching (regex)
PHRASES_REQUIRED: [
  {
    type: "or",
    contentRegex: ["\\b(AI|ML)\\b", "machine\\s+learning", "neural\\s+network"]
  }
  // Matches if content contains AI, ML, machine learning, or neural network
]

// OR: Username matching (literal)
PHRASES_REQUIRED: [
  {
    type: "or",
    username: ["@techcrunch", "@verge", "@wired"]
  }
  // Only posts from these users
]

// OR: Username matching (regex)
PHRASES_REQUIRED: [
  {
    type: "or",
    usernameRegex: ["^@news", "^@media", "bot$"]
  }
  // Usernames starting with @news or @media, or ending with bot
]

// OR: Mixed content and username
PHRASES_REQUIRED: [
  {
    type: "or",
    content: ["technology", "science"],
    username: ["@techcrunch", "@verge"]
  }
  // Pass if content has technology/science OR from techcrunch/verge
]
```

#### AND Filter with Unified Fields

AND filters pass only if **ALL** conditions are met:

```javascript
// AND: Domain + keyword
PHRASES_REQUIRED: [
  {
    type: "and",
    domain: ["github.com"],
    content: ["release"]
  }
  // Requires BOTH github.com domain AND "release" keyword
]

// AND: Domain regex + protocol
PHRASES_REQUIRED: [
  {
    type: "and",
    domainRegex: ["\\.(com|org|net)", "https://"]
  }
  // Requires https:// AND .com/.org/.net TLD
]

// AND: Content + username
PHRASES_REQUIRED: [
  {
    type: "and",
    content: ["AI", "research"],
    username: ["@scientist"]
  }
  // Requires ALL: content has "AI" AND "research" AND from @scientist
]
```

#### NOT Filter with Unified Fields

NOT filters **reject** posts that match:

```javascript
// NOT: Block spam domains (literal)
PHRASES_BANNED: [
  {
    type: "not",
    domain: ["spam.com", "ads.example.com", "malicious.net"]
  }
  // Block posts from these domains
]

// NOT: Block URL shorteners (regex)
PHRASES_BANNED: [
  {
    type: "not",
    domainRegex: ["bit\\.ly", "tinyurl", "shortener"]
  }
  // Block bit.ly, tinyurl, and other shorteners
]

// NOT: Block low-quality sources
PHRASES_BANNED: [
  {
    type: "not",
    usernameRegex: ["spam", "bot", "fake"]
  }
  // Block usernames containing spam, bot, or fake
]
```

#### Complex Unified Filtering Examples

```javascript
// Complex: GitHub releases only
PHRASES_REQUIRED: [
  {
    type: "and",
    domain: ["github.com"],
    contentRegex: ["\\bv?\\d+\\.\\d+\\.\\d+\\b"]  // Version numbers
  }
  // Requires github.com AND version number pattern
]

// Complex: Trusted tech news only
PHRASES_REQUIRED: [
  {
    type: "or",
    username: ["@techcrunch", "@verge", "@arstechnica"],
    domain: ["techcrunch.com", "theverge.com", "arstechnica.com"]
  },
  {
    type: "and",
    content: ["tech", "news"],
    domainRegex: ["https://"]  // Require secure HTTPS
  }
]

// Complex: Block spam but allow official accounts
PHRASES_BANNED: [
  {
    type: "and",
    contentRegex: ["buy\\s+now", "limited\\s+offer", "act\\s+fast"],
    username: ["^(?!@official)"]  // Negative lookahead: NOT @official
  }
  // Block promotional language UNLESS from @official
]

// Complex: Multi-layer content filtering
PHRASES_REQUIRED: [
  {
    type: "or",
    contentRegex: [
      "\\b(AI|ML|GPT)\\b",              // AI terms
      "machine\\s+learning",             // ML phrase
      "neural\\s+network"                // NN phrase
    ]
  },
  {
    type: "and",
    domainRegex: ["https://", "\\.(com|org|edu)"],  // Secure + trusted TLD
    usernameRegex: ["^@(?!spam|bot)"]               // Not spam/bot users
  }
]
```

#### Backward Compatibility

Legacy `keywords` syntax still works and is equivalent to `content`:

```javascript
// LEGACY (still works):
PHRASES_REQUIRED: [
  { type: "or", keywords: ["AI", "ML"] }
]

// EQUIVALENT NEW SYNTAX:
PHRASES_REQUIRED: [
  { type: "or", content: ["AI", "ML"] }
]
```
// Complex combination of OR and AND rules
PHRASES_BANNED: [
  // Block posts containing "sale" OR "discount"
  { type: "or", keywords: ["sale", "discount"] },
  
  // Block posts containing "buy" AND "now" AND "limited" simultaneously
  { type: "and", keywords: ["buy", "now", "limited"] },
  
  // Multiple OR blocks
  { type: "or", keywords: ["advertisement", "sponsored", "promo"] },
  { type: "or", keywords: ["spam", "scam", "fake"] },
  
  // Multiple AND blocks
  { type: "and", keywords: ["click", "here", "link"] },
  { type: "and", keywords: ["free", "gift", "claim"] }
]

// Advanced combination with regex and logical operators
PHRASES_BANNED: [
  // Regex for percentage discounts
  { type: "regex", pattern: "\\d+%\\s*off", flags: "i" },
  
  // OR: Block affiliate or referral links
  { type: "or", keywords: ["affiliate", "referral", "ref="] },
  
  // AND: Block urgent sales messaging
  { type: "and", keywords: ["limited", "time", "offer"] },
  { type: "and", keywords: ["act", "now", "expires"] },
  
  // Simple string for specific hashtag
  "#ad"
]

// Extremely complex example: Multi-layer filtering
PHRASES_BANNED: [
  // Layer 1: General spam indicators
  { type: "or", keywords: ["spam", "scam", "phishing"] },
  
  // Layer 2: Commercial combinations
  { type: "and", keywords: ["buy", "now", "discount"] },
  { type: "and", keywords: ["limited", "time", "offer", "expires"] },
  { type: "and", keywords: ["free", "gift", "claim", "here"] },
  
  // Layer 3: Affiliate and tracking
  { type: "or", keywords: ["affiliate", "referral", "tracking"] },
  { type: "regex", pattern: "\\?ref=|\\?aff=|\\?utm_", flags: "i" },
  
  // Layer 4: Clickbait patterns
  { type: "or", keywords: ["you won't believe", "shocking truth", "doctors hate"] },
  { type: "regex", pattern: "number \\d+ will (shock|amaze|surprise)", flags: "i" },
  
  // Layer 5: Crypto spam
  { type: "and", keywords: ["crypto", "investment", "guaranteed"] },
  { type: "and", keywords: ["bitcoin", "profit", "easy"] }
]
```

**Logic notes:**
- Within `PHRASES_BANNED`: If **ANY** rule is satisfied → post is blocked
- Within `PHRASES_REQUIRED`: **ALL** rules must be satisfied → otherwise post is blocked
- `AND` operator: All keywords in the array must be present simultaneously
- `OR` operator: Any keyword from the array is sufficient
- `NOT` operator (v3.1.0): Negates the result of the inner rule
- `COMPLEX` operator (v3.1.0): Enables nested AND/OR combinations with multiple rules
- Regex: Enables complex pattern matching (e.g., "50% off" or "75% discount")

#### PHRASES_REQUIRED - (string | FilterRule)[]
Mandatory keywords or patterns that must appear in posts. Uses the same FilterRule system as `PHRASES_BANNED`, including NOT and COMPLEX rules (new in v3.1.0).

**Examples:**
```javascript
// At least one of these must be present
PHRASES_REQUIRED: ["news", "update"]

// Complex requirement
PHRASES_REQUIRED: [
  { type: "or", keywords: ["breaking", "urgent", "alert"] }
]

// NOT logic - post must NOT contain certain phrases (NEW in v3.1.0)
PHRASES_REQUIRED: [
  { type: "not", rule: "spam" }  // Only allow posts that don't contain "spam"
]

// COMPLEX logic example (NEW in v3.1.0)
PHRASES_REQUIRED: [
  {
    type: "complex",
    operator: "or",
    rules: [
      { type: "and", keywords: ["tech", "innovation"] },
      { type: "and", keywords: ["science", "research"] }
    ]
  }
  // Requires: (tech AND innovation) OR (science AND research)
]

// Combination for PHRASES_REQUIRED
PHRASES_REQUIRED: [
  // At least one of these terms must be present
  { type: "or", keywords: ["news", "breaking", "update", "announcement"] },
  
  // AND at least one of these technical terms
  { type: "or", keywords: ["technology", "AI", "software", "hardware"] }
  
  // Note: All rules in PHRASES_REQUIRED must be satisfied (AND between rules)
]

// Practical example: Tech news feed filter
PHRASES_REQUIRED: [
  // Must contain at least one tech category keyword
  { type: "or", keywords: ["technology", "tech", "software", "hardware", "AI", "machine learning"] },
  
  // AND must contain at least one news indicator
  { type: "or", keywords: ["announces", "launches", "releases", "unveils", "introduces"] }
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

**Note on Anchor Tag HTML Processing (NEW in v3.1.0):**

The script now intelligently handles HTML anchor tags in RSS feeds and other content sources. This feature works automatically and requires no configuration, but works particularly well with `CONTENT_REPLACEMENTS`:

```javascript
// Example: RSS feed with anchor tag
// Input: 'Article text. <a href="https://t.co/abc123">pic.twitter.com/xyz789</a>'

CONTENT_REPLACEMENTS: [
  // Remove t.co shortened URLs
  { pattern: "https?:\\/\\/t\\.co\\/[a-zA-Z0-9]+", replacement: "", flags: "g" },
  // Remove pic.twitter.com references
  { pattern: "pic\\.twitter\\.com\\/[a-zA-Z0-9]+", replacement: "", flags: "g" }
]

// Result: 'Article text.'
// The script extracts the href URL, then CONTENT_REPLACEMENTS removes it
```

**How Anchor Tag Processing Works:**

1. **Extracts URLs from href**: `<a href="https://example.com">text</a>` → `https://example.com`
2. **Removes link text**: The text between tags is removed to avoid duplication
3. **Handles edge cases**:
   - Empty href: `<a href="">text</a>` → `text` (keeps text, no URL)
   - No text: `<a href="URL"></a>` → `URL` (keeps URL only)
   - Multiple anchors: Each is processed independently
   - Nested HTML: `<a href="URL"><strong>text</strong></a>` → `URL`

4. **Prevents duplicate protocols**: 
   - Before: `<a href="https://t.co/abc">pic.twitter.com/xyz</a>` might become `https://pic.https://twitter.com/xyz`
   - After: Correctly becomes just `https://t.co/abc`

5. **Works with other features**:
   - Combines seamlessly with `CONTENT_REPLACEMENTS` (as shown above)
   - Respects `URL_DOMAIN_FIXES` for protocol replacement
   - Compatible with all platforms (RSS, Twitter, Bluesky, YouTube)

**Real-world example (ČT24 RSS feed):**

```javascript
// Input from RSS feed:
// 'V katedrále svatého Víta... <a href="https://t.co/xyz">pic.twitter.com/abc</a>'

CONTENT_REPLACEMENTS: [
  { pattern: "https?:\\/\\/t\\.co\\/[a-zA-Z0-9]+", replacement: "", flags: "g" },
  { pattern: "pic\\.twitter\\.com\\/[a-zA-Z0-9]+", replacement: "", flags: "g" }
]
URL_DOMAIN_FIXES: ["twitter.com|x.com"]
FORCE_SHOW_ORIGIN_POSTURL: true

// Processing steps:
// 1. Extract href: https://t.co/xyz
// 2. Remove anchor text: pic.twitter.com/abc
// 3. Apply CONTENT_REPLACEMENTS: Remove t.co URL
// 4. Add post URL from entryUrl: https://x.com/CT24zive/status/123
// Final output: 'V katedrále svatého Víta...\nhttps://x.com/CT24zive/status/123'
```
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
**Enhanced in v3.1.0**: Now properly handles quote tweets by preferring `entryUrl` (the user's own tweet) over `imageUrl` (the quoted tweet URL).

If true, always include the original post URL in the output, regardless of other conditions. Works in conjunction with other URL display logic.

**Example:**
```javascript
FORCE_SHOW_ORIGIN_POSTURL: false

// When set to true on quote tweets:
// v3.0.3: Might show the quoted tweet's URL (imageUrl)
// v3.1.0: Always shows the user's own tweet URL (entryUrl) ✓
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

#### MOVE_URL_TO_END - boolean
**New in v3.1.0.** If true, move URLs from the beginning of content to the end.

Previously, this behavior was hardcoded for Bluesky platform. Now it's a user-configurable setting that can be applied to any platform. This is particularly useful for RSS feeds where URLs often appear at the start of content.

**Migration from v3.0.x:**
- In v3.0.x: Automatic for `POST_FROM: "BS"` (hardcoded)
- In v3.1.0: User-controlled via `MOVE_URL_TO_END` setting

**Example:**
```javascript
MOVE_URL_TO_END: false  // Default - URLs stay in original position
MOVE_URL_TO_END: true   // URLs at content start are moved to end

// Example transformation when true:
// Before: "https://example.com/article This is the content text"
// After:  "This is the content text https://example.com/article"
```

**Common use cases:**
- RSS feeds with URLs at the start
- Bluesky posts (replaces old hardcoded behavior)
- Any platform where URL-first format is undesirable

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
- **BS**: Handles quote markers (URL positioning now controlled by `MOVE_URL_TO_END`)
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

## Migration Guide from v3.0.3 to v3.1.0

### New Settings

#### MOVE_URL_TO_END
**NEW in v3.1.0** - Now a user-configurable setting instead of hardcoded behavior.

**Before v3.1.0:**
```javascript
// Bluesky automatically moved URLs to end (hardcoded)
POST_FROM: "BS"  // URLs automatically moved to end
```

**v3.1.0:**
```javascript
// Now explicitly configurable for any platform
POST_FROM: "BS"
MOVE_URL_TO_END: true  // User controls URL positioning

// Or use with other platforms
POST_FROM: "RSS"
MOVE_URL_TO_END: true  // Also works for RSS feeds
```

**Default values:**
- `MOVE_URL_TO_END: false` - URLs stay in original position (default for TW, RSS, YT)
- For Bluesky users: Add `MOVE_URL_TO_END: true` to maintain v3.0.x behavior

### Enhanced Settings

#### FORCE_SHOW_ORIGIN_POSTURL
**Enhanced in v3.1.0** - Better quote tweet handling.

**Change:**
- Now properly prefers `entryUrl` (user's own tweet) over `imageUrl` (quoted tweet) for quote tweets
- Ensures correct URL is always shown when this setting is enabled

**Example:**
```javascript
// v3.0.3 behavior on quote tweets
FORCE_SHOW_ORIGIN_POSTURL: true
// Might show: https://twitter.com/other_user/status/123 (quoted tweet)

// v3.1.0 behavior on quote tweets
FORCE_SHOW_ORIGIN_POSTURL: true
// Always shows: https://twitter.com/your_user/status/456 (your tweet) ✓
```

### New Filter Rules

#### NOT and COMPLEX Rules
**NEW in v3.1.0** - Advanced logical filtering.

**NOT rule example:**
```javascript
// Block posts that DON'T contain "breaking"
PHRASES_BANNED: [
  { type: "not", rule: "breaking" }
]

// Block posts WITHOUT any 4-digit number
PHRASES_BANNED: [
  { type: "not", rule: { type: "regex", pattern: "\\d{4}", flags: "g" } }
]
```

**COMPLEX rule example:**
```javascript
// Requires: (tech AND innovation) OR (science AND research)
PHRASES_REQUIRED: [
  {
    type: "complex",
    operator: "or",
    rules: [
      { type: "and", keywords: ["tech", "innovation"] },
      { type: "and", keywords: ["science", "research"] }
    ]
  }
]

// Block: clickbait words but NOT from official sources
PHRASES_BANNED: [
  {
    type: "complex",
    operator: "and",
    rules: [
      { type: "or", keywords: ["click", "here", "link"] },
      { type: "not", rule: "official" }
    ]
  }
]
```

### No Breaking Changes
- All v3.0.3 configurations work without modification in v3.1.0
- Bluesky users should add `MOVE_URL_TO_END: true` to maintain previous behavior
- New filter rules (NOT, COMPLEX) are optional enhancements

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

### New Settings in v3.1.0

- `MOVE_URL_TO_END` - User-configurable URL positioning (previously hardcoded for Bluesky)
- `NOT` filter rule type - Negation logic for filtering
- `COMPLEX` filter rule type - Multi-level logical combinations
- **Unified Filtering fields** (merged from v3.2.0):
  - `content` - Array of literal strings for content matching
  - `contentRegex` - Array of regex patterns for content matching
  - `username` - Array of literal usernames for filtering
  - `usernameRegex` - Array of regex patterns for username matching
  - `domain` - Array of literal domains for URL filtering
  - `domainRegex` - Array of regex patterns for domain matching
- **Anchor Tag HTML Processing** (merged from v3.2.0 hotfix) - Automatic handling of `<a href>` tags in RSS and other content

### Enhanced Settings

- `PHRASES_BANNED` and `PHRASES_REQUIRED` now support:
  - `FilterRule` objects with regex, AND, OR, NOT, and COMPLEX logic
  - **Unified filtering fields**: `content`, `contentRegex`, `username`, `usernameRegex`, `domain`, `domainRegex` (v3.1.0)
  - Full backward compatibility with legacy `keywords` syntax
- `CONTENT_REPLACEMENTS` now supports `literal` flag for non-regex patterns
- `URL_REPLACE_FROM` now supports array format (v3.0.3+)
- `FORCE_SHOW_ORIGIN_POSTURL` now properly handles quote tweets (v3.1.0+)
- **Anchor tag HTML processing** now automatic for all content sources (v3.1.0)

### Behavior Changes

- **Self-quotes are now detected and formatted**: In v2.0, self-quotes were excluded. In v3.0, they are properly detected and formatted with `PREFIX_SELF_REFERENCE` instead of the user's @username.
- **Self-reposts always allowed**: The `REPOST_ALLOWED` setting now only affects external reposts. Self-reposts are always processed and formatted with `PREFIX_SELF_REFERENCE`.
- **Improved quote tweet URL selection**: Quote tweets now prefer `entryUrl` (the user's own tweet) over `imageUrl` (the quoted tweet) for the final URL (v3.1.0+).
- **RSS truncation tracking**: When RSS content is truncated at input stage (`RSS_MAX_INPUT_CHARS`), this is now tracked throughout processing to ensure proper ellipsis handling.
- **URL positioning now configurable**: Bluesky's automatic "move URL to end" is now a user setting `MOVE_URL_TO_END` (v3.1.0+).

---

## That's All, Folks

This documentation covers all configuration options for IFTTT filter script v3.1.0. For questions or support, contact via social networks or About.me page.

(Updated: November 2025)