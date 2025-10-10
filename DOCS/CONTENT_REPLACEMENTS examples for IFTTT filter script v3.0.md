# CONTENT_REPLACEMENTS examples for IFTTT filter script v3.0

This document provides several examples of the `CONTENT_REPLACEMENTS` settings for the IFTTT filter script v3.0. 

These patterns give you a potent tool for operating on/modifying the text of subsequent posts, as you can use both literal string replacements and regular expressions.

---

## What's New in v3.0
- **Renamed from CONTENT_HACK_PATTERNS**: The setting is now called `CONTENT_REPLACEMENTS` for better clarity.
- **New `literal` parameter**: You can now specify whether a pattern should be treated as a literal string (`literal: true`) or as a regular expression (`literal: false`, default).
- **Improved flexibility**: Mix literal and regex replacements in the same configuration for optimal control.

---

## Basic Information
Filter scripts in IFTTT are run as "scripts in script over the script," so you have to be very careful when using special characters and often manage them with escape characters.  

The whole Settings for the final script are available in the ./SETTINGS/, but here we will focus only on setting patterns which look like the following lines:

```javascript
CONTENT_REPLACEMENTS: [ // content manipulation patterns
  // Literal string replacement (exact match)
  // { pattern: "example.com", replacement: "https://example.com", flags: "g", literal: true },
  
  // Regex replacement (pattern matching)
  // { pattern: "(ZZZZZ[^>]+KKKKK)", replacement: "", flags: "gim", literal: false },
  
  // Simple replacement (regex by default if literal not specified)
  // { pattern: "what", replacement: "by_what", flags: "gi" }
],
```

---

## Settings options

### CONTENT_REPLACEMENTS - array of objects
This setting allows you to manipulate content by replacing or removing specific patterns. Each object in the array should contain:
- `pattern` (required): The text or regex pattern to search for
- `replacement` (required): The text to replace matches with
- `flags` (optional): Regex flags like "gi", "gim", etc.
- `literal` (optional): Boolean flag (default: `false`)
  - `true`: Pattern is treated as literal string (no regex)
  - `false`: Pattern is treated as regular expression

**Example:**
```javascript
CONTENT_REPLACEMENTS: [
  // Literal string replacement - faster, safer for exact matches
  { pattern: "example.com", replacement: "https://example.com", flags: "g", literal: true },
  
  // Regex replacement - powerful pattern matching
  { pattern: "(ZZZZZ[^>]+KKKKK)", replacement: "", flags: "gim", literal: false },
  
  // Default behavior (literal: false is assumed if not specified)
  { pattern: "what", replacement: "by_what", flags: "gi" }
]
```

Your patterns must stay between bracket chars. Every pattern, replacement, flags, and literal must be between quotation marks (strings) or as boolean (for literal) and divided by a comma; more patterns must be divided by a comma, too.

---

## Useful examples for use with CONTENT_REPLACEMENTS

### Literal String Replacements (Fast & Safe)

These examples use `literal: true` for exact string matching without regex interpretation.

#### Simple domain fix
```javascript
{ pattern: "example.com", replacement: "https://example.com", flags: "g", literal: true }
```
Replaces all instances of "example.com" with "https://example.com" (case-sensitive).

#### Case-insensitive brand name replacement
```javascript
{ pattern: "twitter", replacement: "X", flags: "gi", literal: true }
```
Replaces "twitter", "Twitter", "TWITTER" etc. with "X" (case-insensitive due to "i" flag).

#### Remove specific phrase
```javascript
{ pattern: "Sponsored content: ", replacement: "", flags: "g", literal: true }
```
Removes the exact phrase "Sponsored content: " from the beginning of text.

---

### Regex Pattern Replacements (Powerful & Flexible)

These examples use `literal: false` (or omit it entirely) for regex pattern matching.

#### Box brackets - text in box brackets
```javascript
{ pattern: "(\\[[^>]+\\])", replacement: "", flags: "gim", literal: false }
```
Box brackets are considered as special chars, so you have to escape them with backslash chars. This pattern removes all text within square brackets including the brackets themselves (works globally, case-insensitive, multiline).

#### One paragraph only
```javascript
{ pattern: "(^.*?\n).*", replacement: "$1", flags: "gim" }
```
Shows only the first paragraph until `\n` char is found in the processed text.

Alternative approach:
```javascript
{ pattern: "\\n\\n[\\s\\S]*$", replacement: "", flags: "gms" }
```
Removes all text after the first paragraph (works globally, multiline, and uses `.` as a sign for the new line => new paragraph).

#### Simple word replacement
```javascript
{ pattern: "what", replacement: "by_what", flags: "gi" }
```
Replaces the word "what" with the string "by_what" (searches the whole content, case-insensitive).

#### Delete text between markers
```javascript
{ pattern: "(from[^>]+til_this)", replacement: "", flags: "gim" }
```
Deletes longer text starting with "from" and continuing until the string "til_this" (searches whole content, case-insensitive, multiline).

#### URL protocol fix (negative lookbehind)
```javascript
{ pattern: "(?<!https?:\\/\\/)(example\\.com\\/)", replacement: "https:\\/\\/example.com\\/", flags: "gi" }
```
Searches for the string "example.com/" without http or https protocol and replaces it with "https://example.com/" (global, case-insensitive).

**Note:** Be careful with special regex characters. You need to escape:
- `.` as `\\.`
- `/` as `\\/`
- `[` as `\\[`
- `]` as `\\]`
- etc.

#### Remove email addresses
```javascript
{ pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b", replacement: "[email hidden]", flags: "g" }
```
Replaces all email addresses with "[email hidden]" placeholder.

#### Normalize multiple spaces
```javascript
{ pattern: "\\s{2,}", replacement: " ", flags: "g" }
```
Replaces multiple consecutive spaces with a single space.

---

## Advanced Examples: Combining Literal and Regex

You can combine both approaches in a single configuration for optimal performance and flexibility:

```javascript
CONTENT_REPLACEMENTS: [
  // First, fix domain without protocol (literal, fast)
  { pattern: "example.com", replacement: "https://example.com", flags: "g", literal: true },
  
  // Then, remove unwanted markers (regex, flexible)
  { pattern: "\\[AD\\]|\\[SPONSORED\\]", replacement: "", flags: "gi", literal: false },
  
  // Fix common typos (literal, exact matches)
  { pattern: "teh ", replacement: "the ", flags: "g", literal: true },
  { pattern: "recieve", replacement: "receive", flags: "gi", literal: true },
  
  // Clean up formatting (regex, pattern matching)
  { pattern: "\\n{3,}", replacement: "\\n\\n", flags: "g", literal: false }
]
```

---

## Real-World Use Case: Smart Bullet Point Formatting

This advanced example shows how to automatically format bullet points in text, ensuring consistency even when the source content is inconsistent.

### Problem
You want to:
1. Convert various bullet symbols (`•`, `**`) to a unified symbol (`♦️`)
2. Add line breaks before bullet points
3. Ensure text always starts with a bullet point if it contains any
4. Remove unwanted brackets at the beginning

### Solution
```javascript
CONTENT_REPLACEMENTS: [
  // Step 1: Normalize bullet symbols to ♦️
  { pattern: "•", replacement: "♦️", flags: "gi", literal: false }, 
  { pattern: "\\*\\*", replacement: "♦️", flags: "gi", literal: false },
  
  // Step 2: If text contains ♦️ but doesn't start with it, add it at the beginning
  { pattern: "^(?!♦️)(.+♦️)", replacement: "♦️ $1", flags: "s", literal: false },
  
  // Step 3: Add line breaks before all bullet points
  { pattern: "♦️|🔸|🔹", replacement: "\\n## Advanced Examples: Combining Literal and Regex

You can combine both approaches in a single configuration for optimal performance and flexibility:

```javascript
CONTENT_REPLACEMENTS: [
  // First, fix domain without protocol (literal, fast)
  { pattern: "example.com", replacement: "https://example.com", flags: "g", literal: true },
  
  // Then, remove unwanted markers (regex, flexible)
  { pattern: "\\[AD\\]|\\[SPONSORED\\]", replacement: "", flags: "gi", literal: false },
  
  // Fix common typos (literal, exact matches)
  { pattern: "teh ", replacement: "the ", flags: "g", literal: true },
  { pattern: "recieve", replacement: "receive", flags: "gi", literal: true },
  
  // Clean up formatting (regex, pattern matching)
  { pattern: "\\n{3,}", replacement: "\\n\\n", flags: "g", literal: false }
]
```", flags: "gim", literal: false },
  
  // Step 4: Remove brackets at the beginning
  { pattern: "^\\[.*", replacement: "", flags: "s", literal: false }
]
```

### How it works

**Pattern breakdown for Step 2:**
```javascript
{ pattern: "^(?!♦️)(.+♦️)", replacement: "♦️ $1", flags: "s", literal: false }
```

- `^(?!♦️)` - Start of text that does NOT begin with `♦️` (negative lookahead)
- `(.+♦️)` - Captures any text that contains `♦️` somewhere inside
- `replacement: "♦️ $1"` - Adds `♦️` at the beginning and preserves the rest ($1)
- `flags: "s"` - Dotall mode, so `.` includes newlines

### Alternative: Detect original symbols before replacement

If you want to catch the original `•` symbol before it's converted to `♦️`:

```javascript
CONTENT_REPLACEMENTS: [
  { pattern: "•", replacement: "♦️", flags: "gi", literal: false }, 
  { pattern: "\\*\\*", replacement: "♦️", flags: "gi", literal: false },
  
  // Detect both ♦️ and original • symbol
  { pattern: "^(?!♦️|•)(.*(♦️|•))", replacement: "♦️ $1", flags: "s", literal: false },
  
  { pattern: "♦️|🔸|🔹", replacement: "\\n## Advanced Examples: Combining Literal and Regex

You can combine both approaches in a single configuration for optimal performance and flexibility:

```javascript
CONTENT_REPLACEMENTS: [
  // First, fix domain without protocol (literal, fast)
  { pattern: "example.com", replacement: "https://example.com", flags: "g", literal: true },
  
  // Then, remove unwanted markers (regex, flexible)
  { pattern: "\\[AD\\]|\\[SPONSORED\\]", replacement: "", flags: "gi", literal: false },
  
  // Fix common typos (literal, exact matches)
  { pattern: "teh ", replacement: "the ", flags: "g", literal: true },
  { pattern: "recieve", replacement: "receive", flags: "gi", literal: true },
  
  // Clean up formatting (regex, pattern matching)
  { pattern: "\\n{3,}", replacement: "\\n\\n", flags: "g", literal: false }
]
```", flags: "gim", literal: false },
  { pattern: "^\\[.*", replacement: "", flags: "s", literal: false }
]
```

### Important: Order matters!

⚠️ The pattern that adds `♦️` at the beginning must come BEFORE the pattern that adds line breaks (`\n`), otherwise the `♦️` would be added on the second line instead of the first.

**Example transformation:**

**Input:**
```
Some text with • bullet points in the middle
```

**After applying patterns:**
```
♦️ Some text with 
♦️ bullet points in the middle
```

---

## Real-World Use Case: Social Media Content Cleanup

This comprehensive example shows how to clean up content from social media platforms (Twitter/X, news sites) by removing unwanted URLs, fixing formatting, and normalizing text structure.

### Problem
When importing content from social media, you often encounter:
- Missing line breaks before emoji
- Unwanted tracking URLs and image links
- Thread indicators (1/2, 1/3, etc.)
- Retweet markers
- Site-specific URLs that add no value
- Links that should be removed from the end of posts

### Solution
```javascript
CONTENT_REPLACEMENTS: [
  // Fix line breaks before emoji (Unicode format)
  { pattern: "([^\n])(\\uD83D\\uDCAC|\\uD83D\\uDCF7|\\u27A1\\uFE0F|\\uD83D\\uDD17|\\u2139\\uFE0F|\\u2139|\\uD83D\\uDC49|\\u25AA\\uFE0F|\\uD83C\\uDF10|\\uD83D\\uDD34|\\uD83D\\uDFE1|\\uD83D\\uDFE2|\\uD83D\\uDD35|\\u26C8|\\u26A1\\uFE0F|\\u25AA)", replacement: "$1\n$2", flags: "gim", literal: false },
  
  // Remove specific site URLs (Czech Television)
  { pattern: "(?:https?:\\/\\/)?ceskatelevize\\.cz\\/.*?(…|\\.\\.\\.)", replacement: "", flags: "gim", literal: false },
  { pattern: "(?:https?:\\/\\/)?ct24\\.ceskatelevize\\.cz\\/.*?(…|\\.\\.\\.)", replacement: "", flags: "gim", literal: false },
  
  // Remove Twitter/X shortened URLs (t.co)
  { pattern: "([.,:;!?]?\\s*)(?:https?:\\/\\/)?t\\.co\\/\\S+(?=\\s|$)", replacement: "$1", flags: "gi", literal: false },
  
  // Remove Twitter/X image URLs
  { pattern: "(?:https?:\\/\\/)?pic\\.twitter\\.com\\/[^\\s]+", replacement: "", flags: "gim", literal: false },
  
  // Remove headliner.cz URLs with preceding emoji
  { pattern: "(?:\\u270D\\uFE0F|[\\u2600-\\u26FF\\u2700-\\u27BF\\uFE00-\\uFE0F\\uD83C\\uDF00-\\uDFFF\\uD83D\\uDC00-\\uDE4F\\uD83D\\uDE80-\\uDEFF\\uD83E\\uDD00-\\uDDFF])\\s*https:\\/\\/(www\\.)?headliner\\.cz\\/[^\\s]+", replacement: "", flags: "gim", literal: false },
  
  // Remove any remaining headliner.cz URLs
  { pattern: "https://www\\.headliner\\.cz[^\\s]*", replacement: "", flags: "gim", literal: false },
  
  // Remove title with Czech date format (e.g., "Title - 15. ledna ")
  { pattern: "^.*?\\s+[-–—]\\s+\\d{1,2}\\.\\s+(ledna|února|března|dubna|května|června|července|srpna|září|října|listopadu|prosince)\\s+", replacement: "", flags: "i", literal: false },
  
  // Remove speedwaya-z.cz URLs
  { pattern: "https://www\\.speedwaya-z\\.cz[^\\s]*", replacement: "", flags: "gim", literal: false },
  
  // Add line breaks before specific phrases
  { pattern: "Sledujte #ČT24", replacement: "\n\n---

## Migration from v2.0 CONTENT_HACK_PATTERNS", flags: "gim", literal: false },
  { pattern: "Rychlý přehled zpráv", replacement: "\n\n---

## Migration from v2.0 CONTENT_HACK_PATTERNS", flags: "gim", literal: false },
  
  // Convert em-dash to line break
  { pattern: "— ", replacement: "\n", flags: "gim", literal: false },
  
  // Remove retweet markers
  { pattern: "^RT by @([^:]+):\\s*", replacement: "", flags: "gi", literal: false },
  
  // Remove thread indicators
  { pattern: "1/2\\s*", replacement: "", flags: "gim", literal: false },
  { pattern: "1/3\\s*", replacement: "", flags: "gim", literal: false },
  { pattern: "1/4\\s*", replacement: "", flags: "gim", literal: false },
  { pattern: "1/5\\s*", replacement: "", flags: "gim", literal: false },
  
  // Remove everything from 🔗 emoji to end of line
  { pattern: "🔗.*$", replacement: "", flags: "u", literal: false }
]
```

### Pattern explanations

#### Fix line breaks before emoji
```javascript
{ pattern: "([^\n])(\\uD83D\\uDCAC|...)", replacement: "$1\n$2", flags: "gim" }
```
- `([^\n])` - Captures any character that's not a newline
- `(\\uD83D\\uDCAC|...)` - Matches specific emoji in Unicode format (💬📷➡️🔗ℹ️👉▪️🌐🔴🟡🟢🔵⛈⚡)
- `$1\n$2` - Preserves the character before emoji, adds newline, then the emoji
- **Why Unicode?** Emoji are represented as Unicode escape sequences for better compatibility in JavaScript

#### Remove t.co URLs while preserving punctuation
```javascript
{ pattern: "([.,:;!?]?\\s*)(?:https?:\\/\\/)?t\\.co\\/\\S+(?=\\s|$)", replacement: "$1" }
```
- `([.,:;!?]?\\s*)` - Captures optional punctuation and whitespace before URL
- `(?:https?:\\/\\/)?` - Optional protocol (non-capturing group)
- `t\\.co\\/\\S+` - Matches t.co followed by any non-whitespace characters
- `(?=\\s|$)` - Positive lookahead: ensures URL ends at whitespace or end of text
- `replacement: "$1"` - Keeps the punctuation, removes the URL

#### Remove thread indicators
```javascript
{ pattern: "1/2\\s*", replacement: "", flags: "gim" }
```
- Removes common thread indicators like "1/2", "1/3", "1/4", "1/5"
- `\\s*` - Also removes any trailing whitespace
- Can be extended for higher numbers if needed

#### Remove content after link emoji
```javascript
{ pattern: "🔗.*$", replacement: "", flags: "u" }
```
- `🔗.*# CONTENT_REPLACEMENTS examples for IFTTT filter script v3.0

This document provides several examples of the `CONTENT_REPLACEMENTS` settings for the IFTTT filter script v3.0. 

These patterns give you a potent tool for operating on/modifying the text of subsequent posts, as you can use both literal string replacements and regular expressions.

---

## What's New in v3.0
- **Renamed from CONTENT_HACK_PATTERNS**: The setting is now called `CONTENT_REPLACEMENTS` for better clarity.
- **New `literal` parameter**: You can now specify whether a pattern should be treated as a literal string (`literal: true`) or as a regular expression (`literal: false`, default).
- **Improved flexibility**: Mix literal and regex replacements in the same configuration for optimal control.

---

## Basic Information
Filter scripts in IFTTT are run as "scripts in script over the script," so you have to be very careful when using special characters and often manage them with escape characters.  

The whole Settings for the final script are available in the ./SETTINGS/, but here we will focus only on setting patterns which look like the following lines:

```javascript
CONTENT_REPLACEMENTS: [ // content manipulation patterns
  // Literal string replacement (exact match)
  // { pattern: "example.com", replacement: "https://example.com", flags: "g", literal: true },
  
  // Regex replacement (pattern matching)
  // { pattern: "(ZZZZZ[^>]+KKKKK)", replacement: "", flags: "gim", literal: false },
  
  // Simple replacement (regex by default if literal not specified)
  // { pattern: "what", replacement: "by_what", flags: "gi" }
],
```

---

## Settings options

### CONTENT_REPLACEMENTS - array of objects
This setting allows you to manipulate content by replacing or removing specific patterns. Each object in the array should contain:
- `pattern` (required): The text or regex pattern to search for
- `replacement` (required): The text to replace matches with
- `flags` (optional): Regex flags like "gi", "gim", etc.
- `literal` (optional): Boolean flag (default: `false`)
  - `true`: Pattern is treated as literal string (no regex)
  - `false`: Pattern is treated as regular expression

**Example:**
```javascript
CONTENT_REPLACEMENTS: [
  // Literal string replacement - faster, safer for exact matches
  { pattern: "example.com", replacement: "https://example.com", flags: "g", literal: true },
  
  // Regex replacement - powerful pattern matching
  { pattern: "(ZZZZZ[^>]+KKKKK)", replacement: "", flags: "gim", literal: false },
  
  // Default behavior (literal: false is assumed if not specified)
  { pattern: "what", replacement: "by_what", flags: "gi" }
]
```

Your patterns must stay between bracket chars. Every pattern, replacement, flags, and literal must be between quotation marks (strings) or as boolean (for literal) and divided by a comma; more patterns must be divided by a comma, too.

---

## Useful examples for use with CONTENT_REPLACEMENTS

### Literal String Replacements (Fast & Safe)

These examples use `literal: true` for exact string matching without regex interpretation.

#### Simple domain fix
```javascript
{ pattern: "example.com", replacement: "https://example.com", flags: "g", literal: true }
```
Replaces all instances of "example.com" with "https://example.com" (case-sensitive).

#### Case-insensitive brand name replacement
```javascript
{ pattern: "twitter", replacement: "X", flags: "gi", literal: true }
```
Replaces "twitter", "Twitter", "TWITTER" etc. with "X" (case-insensitive due to "i" flag).

#### Remove specific phrase
```javascript
{ pattern: "Sponsored content: ", replacement: "", flags: "g", literal: true }
```
Removes the exact phrase "Sponsored content: " from the beginning of text.

---

### Regex Pattern Replacements (Powerful & Flexible)

These examples use `literal: false` (or omit it entirely) for regex pattern matching.

#### Box brackets - text in box brackets
```javascript
{ pattern: "(\\[[^>]+\\])", replacement: "", flags: "gim", literal: false }
```
Box brackets are considered as special chars, so you have to escape them with backslash chars. This pattern removes all text within square brackets including the brackets themselves (works globally, case-insensitive, multiline).

#### One paragraph only
```javascript
{ pattern: "(^.*?\n).*", replacement: "$1", flags: "gim" }
```
Shows only the first paragraph until `\n` char is found in the processed text.

Alternative approach:
```javascript
{ pattern: "\\n\\n[\\s\\S]*$", replacement: "", flags: "gms" }
```
Removes all text after the first paragraph (works globally, multiline, and uses `.` as a sign for the new line => new paragraph).

#### Simple word replacement
```javascript
{ pattern: "what", replacement: "by_what", flags: "gi" }
```
Replaces the word "what" with the string "by_what" (searches the whole content, case-insensitive).

#### Delete text between markers
```javascript
{ pattern: "(from[^>]+til_this)", replacement: "", flags: "gim" }
```
Deletes longer text starting with "from" and continuing until the string "til_this" (searches whole content, case-insensitive, multiline).

#### URL protocol fix (negative lookbehind)
```javascript
{ pattern: "(?<!https?:\\/\\/)(example\\.com\\/)", replacement: "https:\\/\\/example.com\\/", flags: "gi" }
```
Searches for the string "example.com/" without http or https protocol and replaces it with "https://example.com/" (global, case-insensitive).

**Note:** Be careful with special regex characters. You need to escape:
- `.` as `\\.`
- `/` as `\\/`
- `[` as `\\[`
- `]` as `\\]`
- etc.

#### Remove email addresses
```javascript
{ pattern: "\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b", replacement: "[email hidden]", flags: "g" }
```
Replaces all email addresses with "[email hidden]" placeholder.

#### Normalize multiple spaces
```javascript
{ pattern: "\\s{2,}", replacement: " ", flags: "g" }
```
Replaces multiple consecutive spaces with a single space.

---

## Advanced Examples: Combining Literal and Regex

You can combine both approaches in a single configuration for optimal performance and flexibility:

```javascript
CONTENT_REPLACEMENTS: [
  // First, fix domain without protocol (literal, fast)
  { pattern: "example.com", replacement: "https://example.com", flags: "g", literal: true },
  
  // Then, remove unwanted markers (regex, flexible)
  { pattern: "\\[AD\\]|\\[SPONSORED\\]", replacement: "", flags: "gi", literal: false },
  
  // Fix common typos (literal, exact matches)
  { pattern: "teh ", replacement: "the ", flags: "g", literal: true },
  { pattern: "recieve", replacement: "receive", flags: "gi", literal: true },
  
  // Clean up formatting (regex, pattern matching)
  { pattern: "\\n{3,}", replacement: "\\n\\n", flags: "g", literal: false }
]
```

---

## Real-World Use Case: Smart Bullet Point Formatting

This advanced example shows how to automatically format bullet points in text, ensuring consistency even when the source content is inconsistent.

### Problem
You want to:
1. Convert various bullet symbols (`•`, `**`) to a unified symbol (`♦️`)
2. Add line breaks before bullet points
3. Ensure text always starts with a bullet point if it contains any
4. Remove unwanted brackets at the beginning

### Solution
```javascript
CONTENT_REPLACEMENTS: [
  // Step 1: Normalize bullet symbols to ♦️
  { pattern: "•", replacement: "♦️", flags: "gi", literal: false }, 
  { pattern: "\\*\\*", replacement: "♦️", flags: "gi", literal: false },
  
  // Step 2: If text contains ♦️ but doesn't start with it, add it at the beginning
  { pattern: "^(?!♦️)(.+♦️)", replacement: "♦️ $1", flags: "s", literal: false },
  
  // Step 3: Add line breaks before all bullet points
  { pattern: "♦️|🔸|🔹", replacement: "\\n## Advanced Examples: Combining Literal and Regex

You can combine both approaches in a single configuration for optimal performance and flexibility:

```javascript
CONTENT_REPLACEMENTS: [
  // First, fix domain without protocol (literal, fast)
  { pattern: "example.com", replacement: "https://example.com", flags: "g", literal: true },
  
  // Then, remove unwanted markers (regex, flexible)
  { pattern: "\\[AD\\]|\\[SPONSORED\\]", replacement: "", flags: "gi", literal: false },
  
  // Fix common typos (literal, exact matches)
  { pattern: "teh ", replacement: "the ", flags: "g", literal: true },
  { pattern: "recieve", replacement: "receive", flags: "gi", literal: true },
  
  // Clean up formatting (regex, pattern matching)
  { pattern: "\\n{3,}", replacement: "\\n\\n", flags: "g", literal: false }
]
```", flags: "gim", literal: false },
  
  // Step 4: Remove brackets at the beginning
  { pattern: "^\\[.*", replacement: "", flags: "s", literal: false }
]
```

### How it works

**Pattern breakdown for Step 2:**
```javascript
{ pattern: "^(?!♦️)(.+♦️)", replacement: "♦️ $1", flags: "s", literal: false }
```

- `^(?!♦️)` - Start of text that does NOT begin with `♦️` (negative lookahead)
- `(.+♦️)` - Captures any text that contains `♦️` somewhere inside
- `replacement: "♦️ $1"` - Adds `♦️` at the beginning and preserves the rest ($1)
- `flags: "s"` - Dotall mode, so `.` includes newlines

### Alternative: Detect original symbols before replacement

If you want to catch the original `•` symbol before it's converted to `♦️`:

```javascript
CONTENT_REPLACEMENTS: [
  { pattern: "•", replacement: "♦️", flags: "gi", literal: false }, 
  { pattern: "\\*\\*", replacement: "♦️", flags: "gi", literal: false },
  
  // Detect both ♦️ and original • symbol
  { pattern: "^(?!♦️|•)(.*(♦️|•))", replacement: "♦️ $1", flags: "s", literal: false },
  
  { pattern: "♦️|🔸|🔹", replacement: "\\n## Advanced Examples: Combining Literal and Regex

You can combine both approaches in a single configuration for optimal performance and flexibility:

```javascript
CONTENT_REPLACEMENTS: [
  // First, fix domain without protocol (literal, fast)
  { pattern: "example.com", replacement: "https://example.com", flags: "g", literal: true },
  
  // Then, remove unwanted markers (regex, flexible)
  { pattern: "\\[AD\\]|\\[SPONSORED\\]", replacement: "", flags: "gi", literal: false },
  
  // Fix common typos (literal, exact matches)
  { pattern: "teh ", replacement: "the ", flags: "g", literal: true },
  { pattern: "recieve", replacement: "receive", flags: "gi", literal: true },
  
  // Clean up formatting (regex, pattern matching)
  { pattern: "\\n{3,}", replacement: "\\n\\n", flags: "g", literal: false }
]
```", flags: "gim", literal: false },
  { pattern: "^\\[.*", replacement: "", flags: "s", literal: false }
]
```

### Important: Order matters!

⚠️ The pattern that adds `♦️` at the beginning must come BEFORE the pattern that adds line breaks (`\n`), otherwise the `♦️` would be added on the second line instead of the first.

**Example transformation:**

**Input:**
```
Some text with • bullet points in the middle
```

**After applying patterns:**
```
♦️ Some text with 
♦️ bullet points in the middle
```

 - Matches 🔗 emoji and everything after it until end of line
- `flags: "u"` - Unicode flag for proper emoji handling
- Useful for removing "Read more at..." type suffixes

### Example transformation

**Input (raw social media post):**
```
Důležitá zpráva – 15. ledna 2025
RT by @user: Breaking news!💬Follow this link https://t.co/abc123 for more info https://t.co/xyz789 pic.twitter.com/image123

✍️ https://www.headliner.cz/article-name
More at: https://www.speedwaya-z.cz/page

Read more: https://ceskatelevize.cz/article...

1/3
```

**After applying patterns:**
```
2025
Breaking news!
💬Follow this link for more info
```

### Tips for social media cleanup

1. **Order of patterns matters**: Apply URL removal before formatting to avoid issues with text flow

2. **Test with real content**: Social media platforms change their URL formats, so test regularly

3. **Unicode emoji handling**: Use `\u` escape sequences for emoji in patterns for better cross-platform compatibility

4. **Preserve punctuation**: When removing URLs, consider whether preceding punctuation should be kept (as in the t.co example)

5. **Thread indicators**: Add more patterns if you need to handle longer threads (1/6, 1/7, etc.)

6. **Emoji ranges**: When detecting emoji, use comprehensive Unicode ranges to catch all variations. The headliner.cz pattern demonstrates this with multiple emoji ranges

7. **Two-step URL removal**: For sites commonly preceded by emoji (like headliner.cz), use two patterns - one for emoji+URL combinations, and one fallback for standalone URLs

8. **Localized content**: For non-English content (like Czech dates), use patterns with localized month names or other language-specific elements

9. **Site-specific patterns**: Create dedicated patterns for frequently appearing domains to keep your content clean and focused

---

## Migration from v2.0 CONTENT_HACK_PATTERNS

If you're upgrading from v2.0, here's how to migrate:

**Old v2.0 format:**
```javascript
CONTENT_HACK_PATTERNS: [
  { pattern: "what", replacement: "by_what", flags: "gi" }
]
```

**New v3.0 format (backward compatible):**
```javascript
CONTENT_REPLACEMENTS: [
  { pattern: "what", replacement: "by_what", flags: "gi" }  // literal: false is default
]
```

**New v3.0 format (optimized with literal flag):**
```javascript
CONTENT_REPLACEMENTS: [
  { pattern: "what", replacement: "by_what", flags: "gi", literal: true }  // faster for exact matches
]
```

---

## Performance Tips

1. **Use `literal: true` when possible**: Literal string matching is significantly faster than regex matching. Use it for exact string replacements.

2. **Order matters**: Place more specific patterns before general ones, as replacements are applied sequentially.

3. **Avoid overly complex regex**: While powerful, complex regex patterns can slow down processing. Keep them as simple as possible.

4. **Test your patterns**: Always test your patterns with sample content to ensure they work as expected and don't accidentally match unwanted text.

---

## That's all, folks
That's all, folks. I hope the explanation clarifies the configuration possibilities for modifying the output and everything is crystal clear now. The new `literal` flag gives you better control over performance while maintaining the powerful regex capabilities when you need them.

If you have questions, you can contact me via social networks or the About.me page.

(Updated: October 2025)
