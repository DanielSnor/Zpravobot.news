# IFTTT Filter Script v4.0.0 - Unified Filter Structure

## What's New in v4.0.0

### Breaking Changes from v3.x

Version 4.0.0 removes legacy backward compatibility layers to provide a cleaner, more efficient codebase:

**⚠️ REMOVED Legacy Features:**
- ❌ `keywords` property in FilterRule (use `content` instead)
- ❌ Single string format for `URL_REPLACE_FROM` (use array)
- ❌ Legacy `rule` property in NOT filters (use direct field matching)

**✨ New Features:**
- ✅ Enhanced RSS retweet formatting from rss.app feeds
- ✅ 100x faster entity processing
- ✅ ~7KB smaller file size (more room for features)

**📦 Maintained Features:**
- ✅ Unified filter structure with content/username/domain matching
- ✅ Full regex support across all filter types
- ✅ COMPLEX rule combinations

---

## Filter Structure Reference

### Unified Filter Object

Each of the three logical operations (`OR`, `AND`, `NOT`) supports the same set of filter fields:

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

## Simple String Syntax

For basic filtering, you can still use simple string arrays:

```javascript
// ✅ Simple strings (works for basic filtering)
PHRASES_BANNED: ["spam", "advertisement"]

PHRASES_REQUIRED: ["tech", "AI", "2025"]
```

This is equivalent to an OR filter:
```javascript
PHRASES_BANNED: [
  { type: "or", content: ["spam", "advertisement"] }
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
      // Use unified OR structure
      {
        type: "or",
        content: ["tech", "science"],
        contentRegex: ["\\binnovation\\b"]
      },
      // Use unified AND structure
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

## Migration Guide from v3.x

### ⚠️ Breaking Change: keywords → content

The `keywords` property is **no longer supported** in v4.0.0. You must update your filter rules:

**OR Filter:**
```javascript
// ❌ v3.x (NO LONGER WORKS)
{ type: "or", keywords: ["tech", "science"] }

// ✅ v4.0.0 (REQUIRED)
{ 
  type: "or", 
  content: ["tech", "science"]
}
```

**AND Filter:**
```javascript
// ❌ v3.x (NO LONGER WORKS)
{ type: "and", keywords: ["AI", "2025"] }

// ✅ v4.0.0 (REQUIRED)
{ 
  type: "and", 
  content: ["AI", "2025"]
}
```

**Enhanced with unified structure:**
```javascript
// ✅ v4.0.0 (RECOMMENDED - more powerful)
{ 
  type: "and", 
  content: ["AI", "2025"],
  username: ["@techcrunch"],
  domain: ["techcrunch.com"]
}
```

### Migration Steps

1. **Find all `keywords` usage:**
   ```bash
   # Search your configuration file
   grep -n "keywords" your-ifttt-filter.ts
   ```

2. **Replace with `content`:**
   - Change `keywords:` to `content:`
   - Keep array structure the same

3. **Test thoroughly:**
   - Deploy to test account first
   - Monitor 50-100 posts
   - Verify filtering works as expected

---

## Technical Notes

### Regex Flags
- All regex patterns use case-insensitive matching by default (flag `"i"`)
- You don't need to specify flags separately - they're handled automatically

### Performance
- Literal string matching (`content`, `username`, `domain`) is faster than regex
- Use literal matching when possible, regex only when pattern matching is needed
- v4.0.0 includes optimized filter matching (~100x faster entity processing)

### Size Limit
- **Version 4.0.0**: ~56 KB (85.9% of 65 KB limit)
- **Available space**: ~9 KB headroom for future features
- **Improvement**: -7 KB from v3.2.1 (-11% reduction)

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

1. **Check for legacy `keywords` usage**
   ```javascript
   // ❌ This will NOT work in v4.0.0
   { type: "or", keywords: ["test"] }
   
   // ✅ Use this instead
   { type: "or", content: ["test"] }
   ```

2. **Check regex escaping**
   ```javascript
   // ❌ Wrong
   contentRegex: ["domain.com"]
   
   // ✅ Correct
   contentRegex: ["domain\\.com"]
   ```

3. **Verify logic type**
   ```javascript
   // OR: At least ONE must match
   { type: "or", content: ["a", "b"] }
   
   // AND: ALL must match
   { type: "and", content: ["a", "b"] }
   
   // NOT: NONE should match
   { type: "not", content: ["a", "b"] }
   ```

4. **Test with simple patterns first**
   ```javascript
   // Start simple
   { type: "or", content: ["test"] }
   
   // Add complexity gradually
   { type: "or", content: ["test"], contentRegex: ["pattern"] }
   ```

---

## Support & Feedback

- **GitHub Repository**: https://github.com/danielsnor/zpravobot.news
- **GitHub Issues**: Report bugs or request features
- **Documentation**: Full reference at project repository
- **Version**: 4.0.0 (December 30th, 2025)

---

## Summary

Version 4.0.0 provides a **unified, consistent, and powerful filtering system** that works across OR, AND, and NOT operations with support for:

✅ Content filtering (literal + regex)
✅ Username filtering (literal + regex)  
✅ Domain filtering (literal + regex)
✅ Optimized performance (100x faster)
✅ Smaller file size (-11% reduction)
✅ Seamless COMPLEX rule integration

**⚠️ Note:** This is a major version with breaking changes. Legacy `keywords` syntax is no longer supported - use `content` instead.

**Upgrade today** to take advantage of enhanced performance and features while maintaining clean, modern code!
