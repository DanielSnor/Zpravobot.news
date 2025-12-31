# Settings for IFTTT filter script v4.0.0

This document explains all settings possibilities for the IFTTT filter script version 4.0.0 (Z Day, Dec 30th, 2025 rev), including default behaviors and examples of use. The script is designed to process posts from various platforms (e.g., Twitter, Bluesky, RSS, YouTube) and publish them via an IFTTT webhook.

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

## What's New in v4.0.0

### Breaking Changes

Version 4.0.0 removes legacy compatibility layers:

- **FilterRule keywords removed**: Use content instead
- **URL_REPLACE_FROM array required**: Single string no longer supported  
- **Cache system removed**: Replaced with optimized algorithms

### New Features

- **RSS Retweet Formatting**: Full rss.app support with RT by @ format
- **Performance**: 100x faster entity processing, -11% code size
- **Bug Fixes**: Plus sign Unicode, RSS author fallback, duplicate RT cleanup

### Code Metrics: v3.2.1 vs v4.0.0
- File Size: 63 KB → 56 KB (-11%)
- Functions: 42+ → 30 (-29%)
- Available Space: 2 KB → 9 KB (+350%)

---

## What's New in v3.2.0

- **TCO_REPLACEMENT Feature**: Visual placeholder for removed t.co shortened links:
  - Configurable placeholder string (e.g., "🔗↗️", "↗", "[url]")
  - Prevents empty spaces where t.co links were removed
  - Improves user understanding that links were present
  - Automatic deduplication of consecutive placeholders
  - Cleanup of trailing placeholders when real URLs are added

- **RSS Anchor Tag Text Preservation**: Enhanced HTML anchor tag handling:
  - Extracts readable text from `<a href="...">text</a>` tags
  - Discards nested URLs to prevent duplication
  - Preserves link text for better user experience
  - Works seamlessly with CONTENT_REPLACEMENTS and URL_DOMAIN_FIXES
  - Handles complex nested HTML formatting

- **Universal Deduplication Mechanisms**: Three new deduplication functions:
  - **deduplicatePlaceholder()**: Removes consecutive TCO_REPLACEMENT duplicates (Twitter-specific)
  - **deduplicatePrefix()**: Removes duplicate PREFIX_POST_URL occurrences
  - **deduplicateUrls()**: Removes duplicate URLs from end of content
  - ES5-compatible implementation
  - Intelligent whitespace handling
  - URL normalization (removes trailing slashes)

- **RSS Content Combination Feature**: New settings for combining title and content in RSS feeds:
  - **COMBINE_TITLE_AND_CONTENT**: Toggle to combine or separate title and content
  - **CONTENT_TITLE_SEPARATOR**: Customizable separator between title and content
  - Flexible RSS content handling for different feed formats

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
// Application settings configuration
const SETTINGS: AppSettings = {
  // CONTENT FILTERING & VALIDATION //
  PHRASES_BANNED: [], // E.g. ["advertisement", {type:"regex",pattern:"\\bsale\\b",flags:"i"}]
  PHRASES_REQUIRED: [], // E.g. ["news", {type:"and",keywords:["tech","innovation"]}]
  REPOST_ALLOWED: true, // true | false. Determines if reposts are processed or skipped.
  // CONTENT PROCESSING & TRANSFORMATION //
  AMPERSAND_SAFE_CHAR: `⅋`, // Replacement for & char to prevent encoding issues in URLs or text.
  CONTENT_REPLACEMENTS: [], // E.g.: { pattern: "what", replacement: "by_what", flags: "gi", literal: false }
  POST_LENGTH: 444, // 0 - 500 chars. Adjust based on target platform's character limit.
  POST_LENGTH_TRIM_STRATEGY: "smart", // "sentence" | "word" | "smart". Preserve meaningful content.
  SMART_TOLERANCE_PERCENT: 12, // 5-25, rec. 12. % of POST_LENGTH for sentence boundaries.
  TCO_REPLACEMENT: "🔗↗️", // "" | "↗" | "🔗↗️" | "[url]". Placeholder for t.co links (Twitter/X).
  // URL CONFIGURATION //
  FORCE_SHOW_ORIGIN_POSTURL: false, // Always show original post URL.
  FORCE_SHOW_FEEDURL: false, // Use feed URL as fallback when URL processing fails.
  SHOW_IMAGEURL: false, // true | false. Include image URLs in output if available.
  URL_DOMAIN_FIXES: [], // Domains that are automatically prefixed with https:// if the protocol is missing.
  URL_NO_TRIM_DOMAINS: [
    "facebook.com", "www.facebook.com", "instagram.com", "www.instagram.com", // Facebook and Instagram
    "bit.ly", "goo.gl", "ift.tt", "ow.ly", "tinyurl.com", // URL shorteners
    "youtu.be", "youtube.com", // Youtube
  ], // URLs in this list are excluded from trimming but still encoded.
  URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"], // Source URL pattern(s) to replace. String or array.
  URL_REPLACE_TO: "https://xcancel.com/", // Target URL pattern for replacement.
  // OUTPUT FORMATTING & PREFIXES //
  MENTION_FORMATTING: { "TW": { type: "prefix", value: "https://xcancel.com/" }, }, // Prefix for Twitter mentions
  PREFIX_IMAGE_URL: "", // E.g., "" | "🖼️ ". Prefix for image URLs if shown.
  PREFIX_POST_URL: "\n", // E.g., "" | "\n\n🦋 " | "\n\n𝕏 " | "\n🔗 ". Formatting for post URLs.
  PREFIX_QUOTE: " 𝕏📝💬 ", // E.g., "" | "comments post from" | "🦋📝💬" | "𝕏📝💬". Formatting for quoted content.
  PREFIX_REPOST: " 𝕏📤 ", // E.g., "" | "shares" | "𝕏📤". Formatting prefix for reposts.
  PREFIX_SELF_REFERENCE: "svůj post", // Text for self-quotes a self-reposts
  // PLATFORM-SPECIFIC SETTINGS //
  MOVE_URL_TO_END: false, // Move URLs from beginning to end (useful for RSS).
  POST_FROM: "TW", // "BS" | "RSS" | "TW" | "YT". Set this based on the IFTTT trigger used for the applet.
  SHOW_REAL_NAME: true, // true | false. Prefer real name over username if available.
  SHOW_TITLE_AS_CONTENT: false, // true | false. Use title as content (lower priority than COMBINE).
  // CONTENT COMBINATION (RSS & YOUTUBE) //
  COMBINE_TITLE_AND_CONTENT: false, // Merge title + content for enhanced posts (RSS, YT only).
  CONTENT_TITLE_SEPARATOR: "", // Title and Content Separator when COMBINE_TITLE_AND_CONTENT: true
  RSS_MAX_INPUT_CHARS: 1000, // Limit input to 1000 characters for RSS before HTML processing.
};
```

---

## Detailed Settings Description

### CONTENT FILTERING & VALIDATION

#### PHRASES_BANNED - (string | FilterRule)[]
Banned phrases or advanced filtering rules for content. Supports simple strings, regex patterns, and logical combinations including NOT and COMPLEX rules (new in v3.1.0).

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
  { type: "and", content: ["buy", "now", "discount"] }
]

// OR logic - any keyword triggers the filter
PHRASES_BANNED: [
  { type: "or", content: ["ad", "sponsored", "promo"] }
]

// NOT logic - negates any rule (NEW in v3.1.0)
PHRASES_BANNED: [
  { type: "not", rule: "breaking news" }  // Block posts that DON'T contain "breaking news"
]

// COMPLEX logic - multi-level combinations (NEW in v3.1.0)
PHRASES_BANNED: [
  { 
    type: "complex",
    operator: "and",
    rules: [
      "advertisement",
      { type: "or", content: ["sale", "discount", "offer"] }
    ]
  }
]
```

**Unified Filtering (v3.1.0):**
Supports advanced filtering with `content`, `contentRegex`, `username`, `usernameRegex`, `domain`, `domainRegex` fields:

```javascript
// Content + Domain filtering
PHRASES_BANNED: [
  {
    type: "or",
    content: ["spam", "advertisement"],
    domain: ["spam-site.com", "fake-news.net"]
  }
]

// Username filtering
PHRASES_BANNED: [
  {
    type: "not",
    usernameRegex: ["^@verified", "official$"]
  }
]
```

**Default:** `[]` (empty array - no banned phrases)

---

#### PHRASES_REQUIRED - (string | FilterRule)[]
Required keywords or advanced filtering rules for content. Posts MUST match at least one rule to be published. Identical structure to `PHRASES_BANNED` but inverted logic.

**Examples:**
```javascript
// Simple keyword requirement
PHRASES_REQUIRED: ["news"]

// Multiple options (OR logic)
PHRASES_REQUIRED: ["tech", "science", "innovation"]

// AND logic - all keywords must be present
PHRASES_REQUIRED: [
  { type: "and", content: ["breaking", "news"] }
]

// Unified filtering with content + username
PHRASES_REQUIRED: [
  {
    type: "and",
    content: ["breaking"],
    username: ["@reuters", "@bbc", "@ap"]
  }
]
```

**Default:** `[]` (empty array - no keyword filtering, all posts pass)

---

#### REPOST_ALLOWED - boolean
Controls whether reposts (retweets/reshares) of other users' content should be published or skipped.

**Important Note:** Self-reposts (where the author reposts their own content) are **always allowed** regardless of this setting. This setting only affects reposts of other users' content.

**Examples:**
```javascript
REPOST_ALLOWED: true   // Publish all reposts (external and self)
REPOST_ALLOWED: false  // Skip external reposts, but allow self-reposts
```

**Default:** `true` (reposts are published)

---

### CONTENT PROCESSING & TRANSFORMATION

#### AMPERSAND_SAFE_CHAR - string
Character used to replace ampersands (`&`) in content to avoid URL encoding issues and IFTTT webhook problems.

**Why needed:** The `&` character has special meaning in URLs and can cause:
- Incorrect parameter parsing in webhooks
- Content truncation at `&` boundaries
- Malformed Mastodon posts

**Examples:**
```javascript
AMPERSAND_SAFE_CHAR: `⅋`      // Recommended: Unicode "commercial minus" (U+204B)
AMPERSAND_SAFE_CHAR: `+`      // Alternative: simple plus sign
AMPERSAND_SAFE_CHAR: ` and `  // Alternative: word "and" with spaces
```

**Default:** `⅋` (Unicode U+204B)

---

#### CONTENT_REPLACEMENTS - { pattern: string; replacement: string; flags?: string; literal?: boolean }[]
Array of find-and-replace patterns applied to content. Supports both regex patterns and literal string matching.

**Structure:**
- `pattern`: String to find (regex pattern or literal string)
- `replacement`: String to replace with
- `flags`: Regex flags (e.g., "gi" for global case-insensitive)
- `literal`: If `true`, treat pattern as literal string instead of regex

**Examples:**
```javascript
// Regex replacement (default)
CONTENT_REPLACEMENTS: [
  { pattern: "what", replacement: "by_what", flags: "gi" }
]

// Literal string replacement
CONTENT_REPLACEMENTS: [
  { pattern: "https://x.com/", replacement: "https://twitter.com/", literal: true }
]

// Multiple replacements
CONTENT_REPLACEMENTS: [
  { pattern: "\\bAI\\b", replacement: "Artificial Intelligence", flags: "g" },
  { pattern: "ML", replacement: "Machine Learning", flags: "g" }
]
```

**Default:** `[]` (no replacements)

---

#### POST_LENGTH - number
Maximum length of the final post content in characters (0-500). Content exceeding this limit will be trimmed according to `POST_LENGTH_TRIM_STRATEGY`.

**Important Notes:**
- Length includes text content only (before URLs and prefixes are added)
- URLs, image URLs, and post URLs are added AFTER trimming and don't count toward this limit
- Setting to `0` disables trimming (not recommended)

**Examples:**
```javascript
POST_LENGTH: 444   // Recommended for Mastodon (500 char default minus space for URLs)
POST_LENGTH: 256   // Conservative limit
POST_LENGTH: 500   // Maximum, leaves no room for URLs
```

**Default:** `444`

---

#### POST_LENGTH_TRIM_STRATEGY - "sentence" | "word" | "smart"
Strategy used when content exceeds `POST_LENGTH`. Determines how content is trimmed to preserve readability.

**Strategies:**

1. **"sentence"** - Trim at sentence boundary
   - Finds the last complete sentence within limit
   - Preserves grammatical structure
   - May significantly undershoot limit
   - Best for: News articles, formal content

2. **"word"** - Trim at word boundary  
   - Cuts at last complete word within limit
   - Maximizes character usage
   - May break mid-sentence
   - Best for: Maximizing content, casual posts

3. **"smart"** - Hybrid sentence/word trimming (RECOMMENDED)
   - Tries sentence boundary first
   - Falls back to word boundary if sentence trim wastes too much space
   - Uses `SMART_TOLERANCE_PERCENT` to determine acceptable waste
   - Best for: Most use cases, balances readability and efficiency

**Examples:**
```javascript
POST_LENGTH_TRIM_STRATEGY: "smart"     // Recommended default
POST_LENGTH_TRIM_STRATEGY: "sentence"  // Prioritize grammar
POST_LENGTH_TRIM_STRATEGY: "word"      // Maximize content
```

**Default:** `"smart"`

---

#### SMART_TOLERANCE_PERCENT - number
Percentage of `POST_LENGTH` that can be "wasted" (left unused) when using "smart" trim strategy to preserve sentence boundaries.

**Range:** 5-25 (recommended: 10-15)

**Examples:**
```javascript
SMART_TOLERANCE_PERCENT: 12  // Recommended default (12% tolerance)
SMART_TOLERANCE_PERCENT: 5   // Strict (prefer word boundary)
SMART_TOLERANCE_PERCENT: 20  // Relaxed (prefer sentence boundary)
```

**Practical Impact (POST_LENGTH: 444):**
```javascript
SMART_TOLERANCE_PERCENT: 5   // Accepts up to 22 chars waste (444 * 0.05)
SMART_TOLERANCE_PERCENT: 12  // Accepts up to 53 chars waste (444 * 0.12)  ← Recommended
SMART_TOLERANCE_PERCENT: 20  // Accepts up to 89 chars waste (444 * 0.20)
```

**Default:** `12` (12% tolerance)

---

#### TCO_REPLACEMENT - string (NEW in v3.2.0)
Visual placeholder text to replace removed t.co shortened links. Helps users understand that a link was present in the original post.

**Why needed:** Twitter/X uses t.co URL shortener for all links. These shortened links are removed during processing to show actual destination URLs. Without a placeholder, this can leave confusing empty spaces or missing context.

**Examples:**
```javascript
TCO_REPLACEMENT: "🔗↗️"     // Recommended: link icon + arrow (visual indicator)
TCO_REPLACEMENT: "↗"        // Minimal: arrow only
TCO_REPLACEMENT: "🔗"       // Link icon only
TCO_REPLACEMENT: "[url]"    // Text-based placeholder
TCO_REPLACEMENT: ""         // Disabled: silent removal (v3.1.x behavior)
```

**Processing Behavior:**
1. All t.co URLs are replaced with TCO_REPLACEMENT
2. Consecutive duplicate placeholders are automatically deduplicated
3. Trailing placeholder is removed if real URLs are added to the post
4. Non-consecutive placeholders are preserved

**Real-World Example:**
```javascript
// Original tweet
"Check this article 👉https://t.co/abc123 and this one https://t.co/def456"

// With TCO_REPLACEMENT: "🔗↗️"
"Check this article 👉🔗↗️ and this one 🔗↗️"
// Then actual URLs are added at the end
```

**Platform Compatibility:**
- **Twitter/X**: Active (t.co links are common)
- **Bluesky**: Not applicable (no URL shortening)
- **RSS**: Not applicable (usually full URLs)
- **YouTube**: Not applicable (no t.co links)

**Default:** `"🔗↗️"` (link icon + arrow)

**Note:** Only affects Twitter/X posts (`POST_FROM: "TW"`). Has no effect on other platforms.

---

### URL CONFIGURATION

#### FORCE_SHOW_ORIGIN_POSTURL - boolean
Forces the original post URL to always be included in output, regardless of other URL display conditions.

**Enhanced in v3.1.0:** Now properly handles quote tweets by preferring `entryUrl` (the user's own tweet) over `imageUrl` (the quoted tweet URL).

**Examples:**
```javascript
FORCE_SHOW_ORIGIN_POSTURL: true   // Always show original post URL
FORCE_SHOW_ORIGIN_POSTURL: false  // Show based on other conditions (default)
```

**Behavior:**
- When `true`: Original post URL is ALWAYS added to output
- When `false`: URL shown based on platform logic and other settings
- Quote tweets: Prefers your tweet URL over quoted tweet URL
- Reposts: Shows the original post URL, not the repost URL

**Default:** `false`

---

#### FORCE_SHOW_FEEDURL - boolean
When URL processing results in an empty string, use the feed URL as a fallback instead of showing no URL at all.

**Examples:**
```javascript
FORCE_SHOW_FEEDURL: true   // Show feed URL when post URL is empty
FORCE_SHOW_FEEDURL: false  // No fallback (may result in posts without URLs)
```

**When it activates:**
- Post URL is empty after all processing
- URL_REPLACE operations result in empty string
- Content processing removed all URLs

**Default:** `false`

---

#### SHOW_IMAGEURL - boolean
Controls whether image URLs should be included in the output. Uses `PREFIX_IMAGE_URL` for formatting.

**Examples:**
```javascript
SHOW_IMAGEURL: true   // Include image URL in output
SHOW_IMAGEURL: false  // Omit image URL (image still visible in feed)
```

**Behavior:**
- When `true`: Image URL is added to output with `PREFIX_IMAGE_URL` prefix
- When `false`: Image URL is omitted (Mastodon still shows image inline)
- Only first image URL is included
- Empty image URLs are never shown

**Default:** `false` (images display inline without explicit URL)

---

#### URL_DOMAIN_FIXES - string[]
Array of domains that should automatically have `https://` protocol prepended if missing. Useful for fixing incomplete URLs from certain RSS feeds or services.

**Why needed:** Some RSS feeds or content sources provide URLs without protocols, which can break link parsing and cause display issues.

**Examples:**
```javascript
URL_DOMAIN_FIXES: ["rspkt.cz", "ct24.ceskatelevize.cz"]

// Incomplete URL in content
"Check out rspkt.cz/article/123"

// After processing
"Check out https://rspkt.cz/article/123"
```

**Important Notes:**
- ES5-compatible implementation (no negative lookbehind)
- Won't create double protocols (e.g., `https://https://`)
- Applied AFTER anchor tag processing (v3.1.5+)
- Works with CONTENT_REPLACEMENTS

**Default:** `[]` (no automatic protocol fixes)

---

#### URL_NO_TRIM_DOMAINS - string[]
Array of domains that should be excluded from `trimUrlQuery()` function but still have ampersands encoded. Useful for URLs where query parameters are essential.

**Why needed:** By default, the script removes URL query parameters (everything after `?`) to shorten URLs. Some services require these parameters to function correctly.

**Examples:**
```javascript
URL_NO_TRIM_DOMAINS: [
  "youtu.be", "youtube.com",                                           // YouTube video IDs
  "bit.ly", "goo.gl", "ift.tt", "ow.ly", "tinyurl.com",               // URL shorteners
  "facebook.com", "www.facebook.com",                                  // Facebook posts
  "instagram.com", "www.instagram.com"                                 // Instagram posts
]
```

**Processing:**
```javascript
// URL with query parameters
"https://youtu.be/VIDEO_ID?t=123&feature=share"

// Without exemption (default behavior)
"https://youtu.be/VIDEO_ID"  // Query removed

// With exemption (youtu.be in URL_NO_TRIM_DOMAINS)
"https://youtu.be/VIDEO_ID?t=123⅋feature=share"  // Query preserved, & encoded
```

**Default:** `["youtu.be", "youtube.com"]` (YouTube video timestamps preserved)

---

#### URL_REPLACE_FROM - string | string[]
Source URL pattern(s) to be replaced in content. Supports both single string and array format for multiple source domains.

**Single Domain (v3.0.0 format):**
```javascript
URL_REPLACE_FROM: "https://x.com/"
```

**Multiple Domains (v3.0.3+ format):**
```javascript
URL_REPLACE_FROM: ["https://twitter.com/", "https://x.com/"]
```

**How it works:**
- Replaces the URL base/domain while preserving the path
- Applied to all URLs found in content
- Case-sensitive matching
- Works with `URL_REPLACE_TO` to define target domain

**Examples:**
```javascript
// Replace Twitter/X domain with alternative frontend
URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"]
URL_REPLACE_TO: "https://xcancel.com/"
// Result: https://x.com/user/status/123 → https://xcancel.com/user/status/123
```

**Default:** `["https://twitter.com/", "https://x.com/"]`

---

#### URL_REPLACE_TO - string
Target URL base/domain for URL replacement. Works with `URL_REPLACE_FROM` to define the replacement operation.

**Examples:**
```javascript
URL_REPLACE_TO: "https://xcancel.com/"        // Alternative Twitter frontend
URL_REPLACE_TO: "https://nitter.net/"         // Nitter instance
URL_REPLACE_TO: "https://twitter.com/"        // Back to original Twitter
URL_REPLACE_TO: ""                            // Disable replacement
```

**Important Notes:**
- Must include protocol (https://)
- Should end with `/` for clean URL joining
- Applied to ALL matching URLs in content

**Default:** `"https://xcancel.com/"`

---

### OUTPUT FORMATTING & PREFIXES

#### MENTION_FORMATTING - { [platform: string]: { type: "prefix" | "suffix" | "none"; value: string } }
Configures how @mentions should be formatted per platform. Allows adding prefixes or suffixes to usernames for better clarity or linking.

**Structure:**
```typescript
{
  [platform: string]: {
    type: "prefix" | "suffix" | "none",
    value: string
  }
}
```

**Platform codes:**
- `"TW"`: Twitter/X
- `"BS"`: Bluesky
- `"RSS"`: RSS feeds
- `"YT"`: YouTube

**Examples:**
```javascript
// Twitter - prefix with URL
MENTION_FORMATTING: {
  "TW": { type: "prefix", value: "https://x.com/" }
}
// Result: @username → https://x.com/username

// Mastodon-style - suffix with domain
MENTION_FORMATTING: {
  "TW": { type: "suffix", value: "@twitter.com" }
}
// Result: @username → @username@twitter.com
```

**Default:** `{ "TW": { type: "prefix", value: "https://x.com/" } }`

---

#### PREFIX_IMAGE_URL - string
Prefix text added before image URLs when `SHOW_IMAGEURL: true`. Only used if image URL is present and not empty.

**Examples:**
```javascript
PREFIX_IMAGE_URL: "🖼️ "         // Picture frame emoji + space
PREFIX_IMAGE_URL: "\n📷 "       // New line + camera emoji + space
PREFIX_IMAGE_URL: ""            // No prefix
```

**Default:** `""` (empty - no prefix)

---

#### PREFIX_POST_URL - string
Prefix text added before the final post URL. Typically includes newline characters for proper formatting.

**Examples:**
```javascript
PREFIX_POST_URL: "\n"             // Single newline (minimal)
PREFIX_POST_URL: "\n\n𝕏 "        // Double newline + Twitter icon
PREFIX_POST_URL: "\n🔗 "         // Newline + link icon
```

**Deduplication (v3.2.0):**
Consecutive duplicate PREFIX_POST_URL strings are automatically removed to prevent formatting issues.

**Default:** `"\n"` (single newline)

---

#### PREFIX_QUOTE - string
Prefix text added before content when the post is a quote post (post with a quoted post attached). Not used for self-quotes (see `PREFIX_SELF_REFERENCE`).

**Examples:**
```javascript
PREFIX_QUOTE: " 𝕏📝💬 "      // Twitter/X icon + note + speech bubble
PREFIX_QUOTE: " 🦋📝💬 "     // Bluesky icon + note + speech bubble
PREFIX_QUOTE: " comments: "   // Text-based
PREFIX_QUOTE: ""              // No prefix (minimal style)
```

**When it's used:**
- Post contains a quoted post (Twitter quote tweet, Bluesky quote post)
- Post is NOT a self-quote (author ≠ quoted author)
- Applied BEFORE content

**Default:** `" 𝕏📝💬 "` (Twitter/X styled with note emoji)

---

#### PREFIX_REPOST - string
Prefix text added before content when the post is a repost/retweet of another user's content. Not used for self-reposts (see `PREFIX_SELF_REFERENCE`).

**Examples:**
```javascript
PREFIX_REPOST: " 𝕏📤 "        // Twitter/X icon + outbox symbol
PREFIX_REPOST: " 🦋🔁 "      // Bluesky icon + repost symbol  
PREFIX_REPOST: " shares "    // Text-based
PREFIX_REPOST: ""            // No prefix (minimal style)
```

**When it's used:**
- Post is a repost/retweet (`REPOST_ALLOWED: true`)
- Post is NOT a self-repost (author ≠ original author)
- Applied BEFORE content, AFTER author attribution

**Default:** `" 𝕏📤 "` (Twitter/X styled with outbox emoji)

---

#### PREFIX_SELF_REFERENCE - string
Text used to reference the author when they quote or repost their own content. Replaces `PREFIX_QUOTE` and `PREFIX_REPOST` for self-references.

**Why needed:** Saying "Alice retweeted Alice's post" is redundant and awkward. This setting provides a cleaner alternative like "Alice retweeted her own post" or "Alice's own post".

**Examples:**
```javascript
PREFIX_SELF_REFERENCE: "his post"          // English (gender-neutral works for all)
PREFIX_SELF_REFERENCE: "vlastní post"      // Czech
PREFIX_SELF_REFERENCE: "svůj post"         // Czech (vlastní vs. svůj)
PREFIX_SELF_REFERENCE: "previous post"     // Temporal reference
PREFIX_SELF_REFERENCE: ""                  // Silent (no self-reference text)
```

**When it's used:**
- Author quotes their own previous post
- Author reposts/retweets their own content
- Detected by comparing author username with quoted/retweeted username

**Default:** `"svůj post"` (Czech - "one's own post")

---

### PLATFORM-SPECIFIC SETTINGS

#### MOVE_URL_TO_END - boolean (NEW in v3.1.0)
Controls whether URLs at the beginning of content should be moved to the end. Useful for RSS feeds where URLs often appear first.

**Previously:** This was hardcoded behavior for Bluesky (`POST_FROM: "BS"`). Now user-configurable for all platforms.

**Examples:**
```javascript
MOVE_URL_TO_END: true   // Move leading URLs to end
MOVE_URL_TO_END: false  // Leave URLs in original position
```

**Platform recommendations:**
```javascript
// Bluesky - URLs often at start
POST_FROM: "BS"
MOVE_URL_TO_END: true

// Twitter - URLs usually contextual
POST_FROM: "TW"
MOVE_URL_TO_END: false
```

**Default:** `false` (URLs stay in original position)

---

#### POST_FROM - "BS" | "RSS" | "TW" | "YT"
Platform identifier that determines source-specific processing behavior. Must match the IFTTT trigger type.

**Platform codes:**
- `"TW"`: Twitter/X
- `"BS"`: Bluesky  
- `"RSS"`: RSS feeds
- `"YT"`: YouTube

**Platform-specific behaviors:**

**Twitter/X ("TW"):**
- Handles retweets ("RT @username:")
- Processes quote tweets
- Removes t.co shortened URLs
- Applies TCO_REPLACEMENT (v3.2.0)
- Self-quote and self-repost detection

**Bluesky ("BS"):**
- Detects repost markers in RSS
- Quote post detection
- Self-reference handling
- URL positioning based on MOVE_URL_TO_END

**RSS ("RSS"):**
- HTML content processing
- Anchor tag text extraction (v3.2.0)
- Entry title vs. content selection
- RSS-specific character limits
- Title/content combination (v3.2.0)

**YouTube ("YT"):**
- Minimal processing
- Title-focused output
- Video URL handling
- No repost/quote detection

**Default:** `"TW"` (Twitter/X)

---

#### SHOW_REAL_NAME - boolean
Controls whether to use the author's real name (display name) instead of username in repost and quote attributions.

**Examples:**
```javascript
SHOW_REAL_NAME: true   // Use display name (e.g., "Jan Novák")
SHOW_REAL_NAME: false  // Use username (e.g., "@jannovak")
```

**When it's used:**
- Repost attribution: "Alice reposts Bob's post"
- Quote attribution: "Alice quotes Bob's post"
- Self-reference: Works with PREFIX_SELF_REFERENCE

**Default:** `true` (use display names)

---

#### SHOW_TITLE_AS_CONTENT - boolean
Controls whether to prioritize entry title over entry content for post text. Mainly used for RSS feeds and YouTube.

**Examples:**
```javascript
SHOW_TITLE_AS_CONTENT: true   // Use title as main content
SHOW_TITLE_AS_CONTENT: false  // Use content/description as main text
```

**Content selection logic:**
1. If `SHOW_TITLE_AS_CONTENT: true`: Use title, fallback to content if empty
2. If `SHOW_TITLE_AS_CONTENT: false`: Use content, fallback to title if empty
3. Final fallback: Empty string (post may be skipped)

**Default:** `false` (prioritize content)

---

### RSS-SPECIFIC SETTINGS

#### COMBINE_TITLE_AND_CONTENT - boolean (NEW in v3.2.0)
Controls whether to combine both entry title and entry content for RSS feeds, or use them separately based on `SHOW_TITLE_AS_CONTENT`.

**Why needed:** Some RSS feeds have valuable information in both title and content. This setting allows you to preserve both by combining them into a single post.

**Examples:**
```javascript
COMBINE_TITLE_AND_CONTENT: true   // Combine title and content
COMBINE_TITLE_AND_CONTENT: false  // Use only one (based on SHOW_TITLE_AS_CONTENT)
```

**Behavior:**
- When `true`: Concatenates title and content with `CONTENT_TITLE_SEPARATOR`
- When `false`: Uses standard selection logic (SHOW_TITLE_AS_CONTENT)
- Title is always first, content is always second
- Empty strings are handled gracefully (no double separators)

**Processing example:**
```javascript
COMBINE_TITLE_AND_CONTENT: true
CONTENT_TITLE_SEPARATOR: " — "

// RSS data
entryTitle: "Breaking News"
entryContent: "Scientists discover new planet in distant galaxy"

// Result
"Breaking News — Scientists discover new planet in distant galaxy"
```

**Use cases:**
```javascript
// News feeds - preserve headline + summary
COMBINE_TITLE_AND_CONTENT: true
CONTENT_TITLE_SEPARATOR: " — "

// Blogs - content is usually enough
COMBINE_TITLE_AND_CONTENT: false

// YouTube - title is sufficient
COMBINE_TITLE_AND_CONTENT: false
```

**Default:** `false` (use standard selection logic)

---

#### CONTENT_TITLE_SEPARATOR - string (NEW in v3.2.0)
Separator string placed between title and content when `COMBINE_TITLE_AND_CONTENT: true`. Allows customization of how title and content are joined.

**Examples:**
```javascript
CONTENT_TITLE_SEPARATOR: " — "      // Em dash with spaces (elegant)
CONTENT_TITLE_SEPARATOR: ": "       // Colon with space (classic)
CONTENT_TITLE_SEPARATOR: "\n\n"     // Double newline (paragraph separation)
CONTENT_TITLE_SEPARATOR: " | "      // Pipe with spaces
CONTENT_TITLE_SEPARATOR: ""         // No separator (direct concatenation)
```

**Processing:**
```javascript
// Configuration
COMBINE_TITLE_AND_CONTENT: true
CONTENT_TITLE_SEPARATOR: " — "

// RSS data
entryTitle: "Article Title"
entryContent: "Article content here"

// Result
"Article Title — Article content here"
```

**Best practices:**
```javascript
// For news/formal content
CONTENT_TITLE_SEPARATOR: " — "      // Professional, clear separation

// For casual/blog content
CONTENT_TITLE_SEPARATOR: ": "       // Simple and clean

// For distinct sections
CONTENT_TITLE_SEPARATOR: "\n\n"     // Visual paragraph break
```

**Note:** Only used when `COMBINE_TITLE_AND_CONTENT: true`. Has no effect when set to `false`.

**Default:** `""` (empty string - direct concatenation)

---

#### RSS_MAX_INPUT_CHARS - number
Maximum length of RSS content before HTML processing and trimming. Limits input to prevent processing very long articles.

**Why needed:** Some RSS feeds contain complete article text (thousands of characters). Processing this much text is:
- Inefficient (slow processing)
- Unnecessary (will be trimmed to POST_LENGTH anyway)
- May cause IFTTT timeouts

**Examples:**
```javascript
RSS_MAX_INPUT_CHARS: 1000   // Recommended default
RSS_MAX_INPUT_CHARS: 500    // Conservative (shorter previews)
RSS_MAX_INPUT_CHARS: 2000   // Generous (longer content)
RSS_MAX_INPUT_CHARS: 0      // Disabled (process all content)
```

**Processing flow:**
1. RSS content arrives (potentially thousands of chars)
2. If length > RSS_MAX_INPUT_CHARS: truncate to limit
3. If truncated: mark for proper ellipsis handling
4. Process HTML, apply CONTENT_REPLACEMENTS
5. Trim to POST_LENGTH using trim strategy
6. Add ellipsis if content was truncated at any stage

**Performance considerations:**
- Higher values: More accurate content selection, slower processing
- Lower values: Faster processing, may cut important context
- 1000 chars: Good balance for most news feeds

**Default:** `1000` (1000 characters)

**Note:** This is applied BEFORE POST_LENGTH trimming. Final output will be POST_LENGTH chars max.

---

## Advanced Platform Detection

### TypeScript Compatibility
The script is fully compatible with TypeScript 2.9.2 (IFTTT's JavaScript environment). All type definitions are included for better code validation.

### Platform Detection
The script automatically adapts its behavior based on `POST_FROM`:
- **TW**: Handles replies, retweets, quotes, self-quotes, self-reposts, t.co URL removal, TCO_REPLACEMENT
- **BS**: Handles quote markers, URL positioning controlled by `MOVE_URL_TO_END`
- **RSS**: Uses content selection logic, applies RSS-specific limits, anchor tag processing, title/content combination
- **YT**: Minimal processing, content-focused

### Self-Quote and Self-Repost Handling
**New in v3.0**: The script now properly detects and formats self-quotes and self-reposts:

- Self-quotes are detected by comparing the quoted user's username with the current author
- Self-reposts are detected by checking if the RT @username matches the current author
- Both use `PREFIX_SELF_REFERENCE` instead of displaying the user's @username
- This provides cleaner, more natural output (e.g., "vlastní post" instead of "@username")
- The comparison uses `authorUsername` (not display name) to work correctly with `SHOW_REAL_NAME`

---

## Deduplication Features (NEW in v3.2.0)

Version 3.2.0 introduces three universal deduplication functions that automatically clean up duplicate elements in the final output:

### deduplicatePlaceholder()
Removes consecutive duplicate TCO_REPLACEMENT placeholders (Twitter-specific).

**When it runs:**
- Only for Twitter posts (`POST_FROM: "TW"`)
- After TCO_REPLACEMENT has been applied
- Before final output composition

**Example:**
```javascript
TCO_REPLACEMENT: "🔗↗️"

// Before deduplication
"Link: 🔗↗️🔗↗️🔗↗️ text"

// After deduplication
"Link: 🔗↗️ text"
```

**Behavior:**
- Preserves first occurrence
- Removes consecutive duplicates only
- Non-consecutive placeholders are kept

---

### deduplicatePrefix()
Removes consecutive duplicate PREFIX_POST_URL occurrences.

**When it runs:**
- For all platforms
- After status composition
- Before trimming whitespace

**Example:**
```javascript
PREFIX_POST_URL: "\n🔗 "

// Before deduplication
"Content\n🔗 \n🔗 https://example.com/post"

// After deduplication
"Content\n🔗 https://example.com/post"
```

**Behavior:**
- Checks for duplicate prefix at end of content
- Removes prefix BEFORE trimming whitespace
- Handles complex prefixes with emojis and newlines

---

### deduplicateUrls()
Removes duplicate URLs from the end of content.

**When it runs:**
- For all platforms
- After URL processing
- Before other deduplication functions

**Example:**
```javascript
// Before deduplication
"Content https://example.com/article https://example.com/article"

// After deduplication
"Content https://example.com/article"
```

**Behavior:**
- Normalizes URLs (removes trailing slashes)
- Works backwards from end of content
- Only removes if URLs are separated by whitespace
- Preserves URLs with text between them

**Processing order:**
1. deduplicateUrls() - clean up URL duplicates first
2. deduplicatePlaceholder() - clean TCO placeholders (TW only)
3. deduplicatePrefix() - normalize PREFIX_POST_URL

---

## New Settings in v3.2.0

### TCO_REPLACEMENT
**NEW in v3.2.0** - Visual placeholder for removed t.co links.

**Before v3.2.0:**
```javascript
// t.co links removed silently
"Check this article https://t.co/abc123"
// Result: "Check this article " (empty space)
```

**v3.2.0:**
```javascript
// Configurable placeholder
TCO_REPLACEMENT: "🔗↗️"
"Check this article https://t.co/abc123"
// Result: "Check this article 🔗↗️"
```

**Default value:** `"🔗↗️"` (link icon + arrow)

**To disable:**
```javascript
TCO_REPLACEMENT: ""  // Restore v3.1.x behavior
```

---

### COMBINE_TITLE_AND_CONTENT
**NEW in v3.2.0** - Toggle to combine or separate title and content in RSS feeds.

**Before v3.2.0:**
```javascript
// Could only use title OR content (based on SHOW_TITLE_AS_CONTENT)
SHOW_TITLE_AS_CONTENT: false
// Result: Uses only content, title is ignored
```

**v3.2.0:**
```javascript
// Can combine both title and content
COMBINE_TITLE_AND_CONTENT: true
CONTENT_TITLE_SEPARATOR: " — "
// Result: "Title — Content"
```

**Default value:** `false` (use standard selection logic)

---

### CONTENT_TITLE_SEPARATOR
**NEW in v3.2.0** - Customizable separator between title and content.

**Usage:**
```javascript
COMBINE_TITLE_AND_CONTENT: true
CONTENT_TITLE_SEPARATOR: " — "  // Professional separator

// RSS data
entryTitle: "Breaking News"
entryContent: "Full story here"

// Result
"Breaking News — Full story here"
```

**Common separators:**
```javascript
CONTENT_TITLE_SEPARATOR: " — "      // Em dash (recommended)
CONTENT_TITLE_SEPARATOR: ": "       // Colon
CONTENT_TITLE_SEPARATOR: "\n\n"     // Paragraph break
CONTENT_TITLE_SEPARATOR: " | "      // Pipe
```

**Default value:** `""` (empty - direct concatenation)

---

### Enhanced Features in v3.2.0

#### RSS Anchor Tag Text Extraction
**Enhanced in v3.2.0** - Now extracts readable link text instead of just URLs.

**Before v3.2.0:**
```javascript
// RSS content with anchor tag
"<a href=\"https://example.com/article\">Read more</a>"
// Result: "https://example.com/article"
```

**v3.2.0:**
```javascript
// Extracts text, discards nested URL
"<a href=\"https://example.com/article\">Read more</a>"
// Result: "Read more"
// URL preserved separately for linking
```

**Benefits:**
- More readable output
- Prevents URL duplication
- Preserves link context
- Handles nested HTML formatting

---

#### Universal Deduplication
**NEW in v3.2.0** - Three automatic deduplication functions:

1. **deduplicatePlaceholder()** - Removes consecutive TCO_REPLACEMENT
2. **deduplicatePrefix()** - Removes duplicate PREFIX_POST_URL
3. **deduplicateUrls()** - Removes duplicate trailing URLs

**Examples:**
```javascript
// TCO placeholder deduplication (Twitter only)
"Link 🔗↗️🔗↗️🔗↗️" → "Link 🔗↗️"

// Prefix deduplication (all platforms)
"Content\n🔗 \n🔗 URL" → "Content\n🔗 URL"

// URL deduplication (all platforms)
"Text URL1 URL1" → "Text URL1"
```

---

### No Breaking Changes
- All v3.1.0 configurations work without modification in v3.2.0
- TCO_REPLACEMENT defaults to visible placeholder (can be set to `""` for v3.1.x behavior)
- Anchor tag processing is automatic and transparent
- Deduplication functions are automatic and transparent
- New RSS settings are optional enhancements

---

## Migration Guide from v3.2.0 to v4.0.0

### Breaking Changes

#### 1. FilterRule: keywords → content

```javascript
// NO LONGER WORKS (v3.x)
{ type: "and", keywords: ["tech", "AI"] }

// REQUIRED (v4.0.0)
{ type: "and", content: ["tech", "AI"] }
```

**Migration:** Replace all `keywords:` with `content:`

#### 2. URL_REPLACE_FROM: Array Required

```javascript
// NO LONGER WORKS (v3.x)
URL_REPLACE_FROM: "https://twitter.com/"

// REQUIRED (v4.0.0)  
URL_REPLACE_FROM: ["https://twitter.com/"]
```

**Migration:** Wrap string in array brackets `[ ]`

### New Features (Automatic)

- RSS retweet formatting for rss.app feeds
- 100x faster entity processing
- Optimized filter matching

### Deployment Checklist

- [ ] Replace keywords with content in all filters
- [ ] Convert URL_REPLACE_FROM to array
- [ ] Test with beta account (50-100 posts)
- [ ] Deploy to production

---

## Migration Guide from v3.1.0 to v3.2.0

### New Settings

#### TCO_REPLACEMENT
**NEW in v3.2.0** - Visual placeholder for removed t.co links.

**Migration:**
```javascript
// v3.1.0 - no setting available
// t.co links removed silently

// v3.2.0 - configurable placeholder
TCO_REPLACEMENT: "🔗↗️"  // New default

// To restore v3.1.0 behavior
TCO_REPLACEMENT: ""
```

#### COMBINE_TITLE_AND_CONTENT
**NEW in v3.2.0** - Combine title and content for RSS feeds.

**Migration:**
```javascript
// v3.1.0 - could only use one
SHOW_TITLE_AS_CONTENT: false  // Use content only

// v3.2.0 - can combine both
COMBINE_TITLE_AND_CONTENT: true
CONTENT_TITLE_SEPARATOR: " — "
// Now uses both title and content
```

#### CONTENT_TITLE_SEPARATOR
**NEW in v3.2.0** - Separator for combined title/content.

**Migration:**
```javascript
// v3.1.0 - no separator needed (could only use one)

// v3.2.0 - customize separator
COMBINE_TITLE_AND_CONTENT: true
CONTENT_TITLE_SEPARATOR: " — "  // Your choice
```

### Enhanced Features

#### RSS Anchor Tag Text Extraction
**Enhanced in v3.2.0** - Now extracts readable text.

**No configuration needed** - enhancement is automatic:
```javascript
// v3.1.0 behavior
"<a href='URL'>Read more</a>" → "URL"

// v3.2.0 behavior (automatic)
"<a href='URL'>Read more</a>" → "Read more"
```

#### Universal Deduplication
**NEW in v3.2.0** - Automatic deduplication functions.

**No configuration needed** - deduplication is automatic:
- Consecutive TCO_REPLACEMENT duplicates removed (Twitter only)
- Duplicate PREFIX_POST_URL occurrences removed
- Duplicate trailing URLs removed

### No Breaking Changes
All v3.1.0 configurations work in v3.2.0 without modification. New features are:
- TCO_REPLACEMENT defaults to visible placeholder (set to `""` to disable)
- RSS title/content combination is opt-in (COMBINE_TITLE_AND_CONTENT)
- Deduplication functions work automatically

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
```

**Default values:**
- `MOVE_URL_TO_END: false` - URLs stay in original position (default for TW, RSS, YT)
- For Bluesky users: Add `MOVE_URL_TO_END: true` to maintain v3.0.x behavior

### Enhanced Settings

#### FORCE_SHOW_ORIGIN_POSTURL
**Enhanced in v3.1.0** - Better quote tweet handling.

**Change:**
- Now properly prefers `entryUrl` (user's own tweet) over `imageUrl` (quoted tweet)
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
```

**COMPLEX rule example:**
```javascript
// Requires: (tech AND innovation) OR (science AND research)
PHRASES_REQUIRED: [
  {
    type: "complex",
    operator: "or",
    rules: [
      { type: "and", content: ["tech", "innovation"] },
      { type: "and", content: ["science", "research"] }
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

### Enhanced Settings

- `PHRASES_BANNED` and `PHRASES_REQUIRED` now support `FilterRule` objects with regex, AND, OR logic
- `CONTENT_REPLACEMENTS` now supports `literal` flag for non-regex patterns

### Behavior Changes

- **Self-quotes are now detected and formatted**: In v2.0, self-quotes were excluded. In v3.0, they are properly detected and formatted with `PREFIX_SELF_REFERENCE`.
- **Self-reposts always allowed**: The `REPOST_ALLOWED` setting now only affects external reposts. Self-reposts are always processed.
- **RSS truncation tracking**: When RSS content is truncated at input stage (`RSS_MAX_INPUT_CHARS`), this is now tracked for proper ellipsis handling.

---

## That's All, Folks

This documentation covers all configuration options for IFTTT filter script v4.0.0. For questions or support, contact via social networks or About.me page.

(Updated: December 30, 2025)