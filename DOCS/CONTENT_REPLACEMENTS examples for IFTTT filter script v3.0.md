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
