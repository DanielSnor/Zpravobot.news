# IFTTT Filter Script v3.1.0 - Unified Filter Structure

## What's New in v3.1.0

### Unified Filter Structure for OR, AND, NOT Operations

Version 3.1.0 introduces a **unified filter structure** that provides consistent and powerful filtering capabilities across all three logical operations: `OR`, `AND`, and `NOT`.

**Key Features:**
- **Content filtering** with literal strings and regex patterns
- **Username filtering** with literal strings and regex patterns  
- **Domain filtering** with literal strings and regex patterns
- **Full backward compatibility** with v3.0.x and v3.1.x syntax
- **Consistent interface** across all logical operations

---

## Filter Structure Reference

### Unified Filter Object

Each of the three logical operations (`OR`, `AND`, `NOT`) now supports the same set of filter fields:

```typescript
{
  type: "or" | "and" | "not",
  
  // Content filters
  content?: string[],           // Literal string matches (case-insensitive)
  contentRegex?: string[],      // Regular expression patterns
  
  // Username filters
  username?: string[],          // Literal username matches (case-insensitive)
  usernameRegex?: string[],     // Regular expression patterns for usernames
  
  // Domain filters
  domain?: string[],            // Literal domain matches (case-insensitive)
  domainRegex?: string[]        // Regular expression patterns for domains
}
```

### How Each Operation Works

#### OR Operation
**At least ONE condition must match** across all defined filters.

```javascript
PHRASES_BANNED: [
  {
	type: "or",
	content: ["spam", "advertisement"],
	contentRegex: ["\\b(buy|sale)\\b"],
	domain: ["spam-site.com"]
  }
]
```

This will block posts that contain:
- "spam" OR
- "advertisement" OR
- match the regex pattern `\b(buy|sale)\b` OR
- contain domain "spam-site.com"

#### AND Operation  
**ALL conditions must match** across all defined filters.

```javascript
PHRASES_REQUIRED: [
  {
	type: "and",
	content: ["tech", "2025"],
	contentRegex: ["\\bAI\\b"],
	username: ["@techcrunch"]
  }
]
```

This will only accept posts that contain:
- "tech" AND
- "2025" AND  
- match the regex pattern `\bAI\b` AND
- username "@techcrunch"

#### NOT Operation
**NONE of the conditions should match**.

```javascript
PHRASES_BANNED: [
  {
	type: "not",
	content: ["verified", "official"],
	usernameRegex: ["^@news"]
  }
]
```

This will accept posts only if they:
- do NOT contain "verified" AND
- do NOT contain "official" AND
- do NOT have username starting with "@news"

---

## Practical Examples

### Example 1: OR Filter - Block Multiple Spam Patterns

**Use Case:** Block posts containing any spam-related content or from known spam domains.

```javascript
PHRASES_BANNED: [
  {
	type: "or",
	content: ["click here", "limited time", "act now"],
	contentRegex: ["\\b(discount|sale|offer)s?\\b", "\\d+%\\s+off"],
	domain: ["spam.com", "ads.example.com"],
	domainRegex: ["bit\\.ly", "tinyurl"]
  }
]
```

**Blocks:**
- ✅ "Click here for amazing deals!"
- ✅ "50% off today only!"
- ✅ "Limited time offer ends soon"
- ✅ Links to "https://spam.com/product"
- ✅ Shortened URLs like "bit.ly/xyz123"

**Allows:**
- ✅ "Regular news article without promotional content"

---

### Example 2: AND Filter - Require Specific Topic Combinations

**Use Case:** Only allow posts about AI technology from verified tech news sources in 2025.

```javascript
PHRASES_REQUIRED: [
  {
	type: "and",
	content: ["AI", "2025"],
	contentRegex: ["\\b(technology|innovation|breakthrough)\\b"],
	username: ["@techcrunch", "@verge", "@wired"],
	domain: ["techcrunch.com", "theverge.com", "wired.com"]
  }
]
```

**Allows only:**
- ✅ "AI breakthrough in 2025 changes technology" from @techcrunch
- ✅ "Major innovation: AI systems in 2025" from @verge with link to theverge.com

**Blocks:**
- ❌ "AI technology" (missing 2025)
- ❌ "2025 innovations" (missing AI)
- ❌ "AI 2025 technology" from @randomuser (wrong username)

---

### Example 3: NOT Filter - Exclude Automated/Bot Content

**Use Case:** Filter out automated reposts and bot-generated content.

```javascript
PHRASES_BANNED: [
  {
	type: "not",
	content: ["automated", "bot-generated"],
	contentRegex: ["\\[bot\\]", "\\bRT\\s+@\\w+:", "automatically posted"],
	username: ["@autorepost", "@newsbot"],
	usernameRegex: ["bot$", "^auto"]
  }
]
```

**Blocks:**
- ✅ Any username ending with "bot" (e.g., "@weatherbot")
- ✅ Any username starting with "auto" (e.g., "@autopost")
- ✅ Content with "[bot]" tag
- ✅ Retweet patterns "RT @user: message"
- ✅ Posts from @autorepost or @newsbot

**Allows:**
- ✅ Human-written original content from regular users

---

### Example 4: Mixed Content and Domain Filtering

**Use Case:** Allow only COVID-related news from trusted health organizations.

```javascript
PHRASES_REQUIRED: [
  {
	type: "and",
	contentRegex: ["\\b(covid|pandemic|vaccine|health)\\b"],
	domain: ["who.int", "cdc.gov", "nih.gov"],
	usernameRegex: ["^@(who|cdc|nih)"]
  }
]
```

**Allows only:**
- ✅ Posts about COVID/pandemic/vaccine/health from WHO/CDC/NIH domains
- ✅ Posted by official accounts (@who, @cdc, @nih)

---

### Example 5: Advanced Regex Patterns

**Use Case:** Filter technical content with specific version numbers and keywords.

```javascript
PHRASES_REQUIRED: [
  {
	type: "and",
	content: ["python", "release"],
	contentRegex: ["\\d+\\.\\d+\\.\\d+", "\\b(feature|improvement|bugfix)s?\\b"]
  }
]
```

**Allows only:**
- ✅ "Python 3.12.1 release includes new features"
- ✅ "Python release 3.11.0 with improvements"

**Blocks:**
- ❌ "Python release notes" (no version number)
- ❌ "Version 3.12.1 is out" (no "python" keyword)

---

### Example 6: Username Pattern Filtering

**Use Case:** Only allow posts from official news accounts.

```javascript
PHRASES_REQUIRED: [
  {
	type: "or",
	username: ["@bbc", "@cnn", "@reuters"],
	usernameRegex: ["^@news", "^@official", "verified$"]
  }
]
```

**Allows:**
- ✅ @bbc, @cnn, @reuters (exact matches)
- ✅ @newstoday, @newshour (starts with "news")
- ✅ @bbcverified, @cnnverified (ends with "verified")

---

### Example 7: Complex NOT Filter for Quality Control

**Use Case:** Reject low-quality or suspicious content.

```javascript
PHRASES_BANNED: [
  {
	type: "not",
	contentRegex: [
	  "\\b(clickbait|fake news|unverified)\\b",
	  "\\d+\\s+(weird|shocking|amazing)\\s+tricks?",
	  "you won't believe"
	],
	domain: ["suspicious-site.com", "fake-news.net"],
	domainRegex: ["\\d{4,}\\.", "random-string"]
  }
]
```

**Blocks:**
- ✅ "10 shocking tricks you won't believe"
- ✅ "This weird trick..." 
- ✅ "Unverified claims about..."
- ✅ Domains like "site12345.com" or "abc-random-string-xyz.com"

---

## Backward Compatibility

### Legacy Syntax Still Supported

All previous filter syntax from v3.0.x and v3.1.x continues to work:

```javascript
// ✅ Simple string (still works)
PHRASES_BANNED: ["spam", "advertisement"]

// ✅ Legacy OR with keywords (still works)
PHRASES_REQUIRED: [
  { type: "or", keywords: ["tech", "science"] }
]

// ✅ Legacy AND with keywords (still works)
PHRASES_REQUIRED: [
  { type: "and", keywords: ["AI", "2025"] }
]

// ✅ Legacy NOT with nested rule (still works)
PHRASES_BANNED: [
  { 
	type: "not", 
	rule: { type: "regex", pattern: "\\bbot\\b", flags: "i" }
  }
]

// ✅ COMPLEX rules (still works)
PHRASES_REQUIRED: [
  {
	type: "complex",
	operator: "and",
	rules: [
	  { type: "literal", pattern: "tech" },
	  { type: "regex", pattern: "\\d{4}", flags: "i" }
	]
  }
]
```

---

## Combining with COMPLEX Rules

The unified filter structure works seamlessly with COMPLEX rules:

```javascript
PHRASES_REQUIRED: [
  {
	type: "complex",
	operator: "and",
	rules: [
	  // Use new unified OR structure
	  {
		type: "or",
		content: ["tech", "science"],
		contentRegex: ["\\binnovation\\b"]
	  },
	  // Use new unified AND structure
	  {
		type: "and",
		content: ["2025"],
		domain: ["trusted-source.com"]
	  }
	]
  }
]
```

This requires:
- (tech OR science OR matches "innovation") AND
- (contains "2025" AND from "trusted-source.com")

---

## Best Practices

### 1. Start Simple, Add Complexity
```javascript
// Start with simple content filter
{ type: "or", content: ["keyword1", "keyword2"] }

// Add regex when needed
{ type: "or", content: ["keyword1"], contentRegex: ["\\bpattern\\b"] }

// Add more dimensions as needed
{ 
  type: "or", 
  content: ["keyword1"],
  contentRegex: ["\\bpattern\\b"],
  username: ["@trusted"]
}
```

### 2. Use Regex for Precision
```javascript
// ❌ Broad: will match "MAIL", "DAILY", etc.
{ type: "or", content: ["AI"] }

// ✅ Precise: matches only "AI" as a word
{ type: "or", contentRegex: ["\\bAI\\b"] }
```

### 3. Combine Multiple Filter Types
```javascript
// Block both literal terms and regex patterns
{
  type: "or",
  content: ["spam", "phishing"],
  contentRegex: ["\\b(scam|fraud)s?\\b"],
  domain: ["suspicious.com"],
  domainRegex: ["\\d{5,}\\."]
}
```

### 4. Test Regex Patterns Thoroughly
```javascript
// Remember to escape special characters
{
  type: "or",
  // ❌ Wrong: will fail
  contentRegex: ["domain.com"]
  
  // ✅ Correct: escape the dot
  contentRegex: ["domain\\.com"]
}
```

---

## Migration Guide from v3.0.x / v3.1.x

### Old Style → New Style

**OR Filter:**
```javascript
// Old (still works)
{ type: "or", keywords: ["tech", "science"] }

// New (more powerful)
{ 
  type: "or", 
  content: ["tech", "science"],
  contentRegex: ["\\binnovation\\b"]
}
```

**AND Filter:**
```javascript
// Old (still works)
{ type: "and", keywords: ["AI", "2025"] }

// New (more powerful)
{ 
  type: "and", 
  content: ["AI", "2025"],
  username: ["@techcrunch"],
  domain: ["techcrunch.com"]
}
```

**NOT Filter:**
```javascript
// Old (still works)
{ 
  type: "not", 
  rule: { type: "literal", pattern: "spam" }
}

// New (more powerful)
{ 
  type: "not", 
  content: ["spam", "bot"],
  contentRegex: ["\\[ad\\]"],
  usernameRegex: ["bot$"]
}
```

---

## Technical Notes

### Regex Flags
- All regex patterns use case-insensitive matching by default (flag `"i"`)
- You don't need to specify flags separately - they're handled automatically

### Performance
- Literal string matching (`content`, `username`, `domain`) is faster than regex
- Use literal matching when possible, regex only when pattern matching is needed
- The unified structure is optimized for performance with internal caching

### Size Limit
- Version 3.1.0: **58,651 bytes (89.5% of 65,536 byte limit)**
- Approximately **10% headroom** remaining for future features

---

## Common Use Cases

### 1. News Bot Quality Filter
```javascript
PHRASES_REQUIRED: [
  {
	type: "and",
	content: ["breaking", "news"],
	usernameRegex: ["^@(bbc|cnn|reuters)"],
	domain: ["bbc.com", "cnn.com", "reuters.com"]
  }
]

PHRASES_BANNED: [
  {
	type: "or",
	content: ["opinion", "editorial"],
	contentRegex: ["\\b(rumor|unconfirmed)\\b"]
  }
]
```

### 2. Tech Content Curator
```javascript
PHRASES_REQUIRED: [
  {
	type: "or",
	content: ["AI", "machine learning", "python", "javascript"],
	contentRegex: ["\\b(tech|technology|software|developer)\\b"]
  }
]

PHRASES_BANNED: [
  {
	type: "or",
	content: ["cryptocurrency", "blockchain", "NFT"],
	contentRegex: ["\\bcrypto\\b"]
  }
]
```

### 3. Verified Sources Only
```javascript
PHRASES_REQUIRED: [
  {
	type: "and",
	usernameRegex: ["^@official", "verified$"],
	domain: [".gov", ".edu", ".org"]
  }
]

PHRASES_BANNED: [
  {
	type: "not",
	content: ["verified"],
	usernameRegex: ["^@fake", "parody$"]
  }
]
```

---

## Troubleshooting

### Filter Not Working?

1. **Check regex escaping**
   ```javascript
   // ❌ Wrong
   contentRegex: ["domain.com"]
   
   // ✅ Correct
   contentRegex: ["domain\\.com"]
   ```

2. **Verify logic type**
   ```javascript
   // OR: At least ONE must match
   { type: "or", content: ["a", "b"] }
   
   // AND: ALL must match
   { type: "and", content: ["a", "b"] }
   
   // NOT: NONE should match
   { type: "not", content: ["a", "b"] }
   ```

3. **Test with simple patterns first**
   ```javascript
   // Start simple
   { type: "or", content: ["test"] }
   
   // Add complexity gradually
   { type: "or", content: ["test"], contentRegex: ["pattern"] }
   ```

---

## Support & Feedback

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Full reference at project repository
- **Version**: 3.1.0 (Button Day, November 16th, 2025)

---

## Summary

Version 3.1.0 provides a **unified, consistent, and powerful filtering system** that works across OR, AND, and NOT operations with support for:

✅ Content filtering (literal + regex)
✅ Username filtering (literal + regex)  
✅ Domain filtering (literal + regex)
✅ Full backward compatibility
✅ Seamless COMPLEX rule integration

**Upgrade today** to take advantage of more sophisticated filtering capabilities while maintaining 100% compatibility with your existing configurations!