# Zpravobot.news

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org)
[![Mastodon](https://img.shields.io/badge/Mastodon-Instance-6364FF?logo=mastodon&logoColor=white)](https://zpravobot.news)
[![Version](https://img.shields.io/badge/version-3.1.0-blue)](https://github.com/zpravobot/zpravobot-news/releases)

![Zpravobot.news mascot](https://zpravobot.news/system/site_uploads/files/000/000/002/@2x/49c4aa7df6b81d4a.png 'Zpravobot.news mascot')

**Zprávobot.news** 📰🤖 (Newsbot.news in Czech) is run by Daniel Šnor as a public utility server 🖥️⌨️ that mirrors 🪞 popular primarily Czech 🇨🇿 and Slovak 🇸🇰 X/Twitter 🐦 accounts, bringing to Mastodon 🐘 otherwise missing news 📰, sports ⚽️🏒🏎️, tech info 📱⌚️💻📡, entertainment 🎞️🎶🎭, and sometimes humor 🤣🤪.

**🌉 BlueSky Bridge**: Since September 2025, most bots are also available on BlueSky via [Brid.gy](https://fed.brid.gy/), expanding the reach of Czech content across federated platforms.

## Table of Contents

- [About](#about)
- [The Mission](#the-mission)
- [Current Version](#current-version)
- [Technical Architecture](#technical-architecture)
  - [Technical Limitations](#technical-limitations)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Choosing the Right Example](#choosing-the-right-example)
  - [Setting Up BlueSky Bots](#setting-up-bluesky-bots)
  - [Setting Up RSS Bots](#setting-up-rss-bots)
  - [Setting Up Twitter/X Bots](#setting-up-twitterx-bots)
  - [Setting Up YouTube Bots](#setting-up-youtube-bots)
- [Configuration](#configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [Support](#support)
- [Acknowledgments](#acknowledgments)

## About

The Czech Mastodon community is relatively small and often overlooked by newspaper publishers and other information sources. **Zpravobot.news** was created to bridge this gap by providing Czech Mastodon users with timely access to news and information from various platforms.

The project is run by [Daniel Šnor](https://zpravobot.news) and operates as a public utility, mirroring content from popular Czech sources across multiple platforms including Twitter/X, RSS feeds, BlueSky, and YouTube.

### Multi-Platform Availability

Since **September 2025**, the majority of Zpravobot bots have been bridged to **BlueSky** using [Brid.gy](https://fed.brid.gy/), a service that connects Mastodon accounts with the BlueSky network. This means Czech content is now accessible to both Mastodon and BlueSky users, significantly expanding the reach of news and information across the fediverse and AT Protocol networks.

## The Mission

This open-source project focuses on developing and maintaining IFTTT applet filter scripts that automate content aggregation and posting to Mastodon. The goal is to create a unified, efficient system for content mirroring that serves the Czech Mastodon community.

### Supported Platforms

**Content Sources:**
- ✅ **BlueSky** - Social media posts
- ✅ **RSS** - Various news feeds and blogs
- ✅ **Twitter/X** - Tweets and threads
- ✅ **YouTube** - Video updates from subscriptions
- ❌ **Nitter** - Discontinued (service shutdown in February 2024)

**Distribution Networks:**
- 🐘 **Mastodon** - Primary platform via Zpravobot.news instance
- 🦋 **BlueSky** - Available since September 2025 via Brid.gy federation

## Current Version

**Current Version:** v3.1.0
**Stable Release:** v3.0.3  

### What's New in v3.1.0

Version 3.1.0 consolidates five major improvements into a comprehensive update:

1. **MOVE_URL_TO_END User Configuration** - New option to automatically move URLs to the end of posts for cleaner formatting
2. **FORCE_SHOW_ORIGIN_POSTURL Bug Fixes** - Resolved issues with origin URL display logic
3. **NOT/COMPLEX Filter Operations** - Enhanced filtering capabilities with logical NOT operations and complex filter combinations
4. **Unified Filter Structure with Regex Support** - Streamlined filter architecture with powerful regular expression matching
5. **Anchor Tag Fix for HTML Processing** - Critical bug fix for proper HTML anchor tag handling in RSS feeds

**Status:** 100% test success rate across 85+ comprehensive test cases

### Version History

For detailed release notes and migration guides, see the [Changelog](#changelog) section below.

## Technical Architecture

The solution uses a standard Mastodon server as the frontend, combined with IFTTT (If This Then That) as the backend automation layer. This approach was inspired by the **Press.coop** server but adapted to use IFTTT's infrastructure instead of custom backend code.

### Key Components

1. **Mastodon Server** - Standard installation hosting bot accounts
2. **IFTTT Applets** - Individual bots that monitor various sources
3. **Filter Scripts** - PRO+ subscription feature that processes and formats content
4. **Unified Output** - Consistent formatting across all content sources

### Technical Limitations

**IFTTT Platform Constraints:**
- **Runtime Environment**: ES5 JavaScript (TypeScript 2.9.2 compilation target)
- **Script Size Limit**: Maximum 65,536 bytes per filter script
- **Single Platform per Applet**: Each IFTTT applet supports only one content source connector
- **No External Dependencies**: All functionality must be self-contained within the script

**Quality Assurance:**
- **Test Coverage**: 85+ comprehensive test cases
- **Test Success Rate**: 100% (maintained across all releases)
- **Beta Testing**: Dedicated @betabot account for real-world content validation

### Why Multiple Scripts?

Due to IFTTT limitations, different connectors (YouTube, RSS, Twitter) cannot be mixed in a single applet. However, the core filtering logic should remain consistent. This led to a modular architecture where filter scripts are composed of three parts:

1. **Settings** - Source-specific configuration
2. **Connector** - Platform-specific data handling
3. **Universal Filter** - Common processing logic

For example, a BlueSky bot would use: BlueSky settings + RSS connector + universal filter script.

## Project Structure

```
.
├── CONNECTORS/     # Platform-specific connectors
│   ├── connector-ifttt-bluesky-rss.ts (for BlueSky and RSS feeds)
│   ├── connector-ifttt-x-twitter.ts
│   └── connector-ifttt-youtube.ts
├── DOCS/           # Detailed documentation for configuration options
│   ├── CONTENT_REPLACEMENTS_examples_for_IFTTT_filter_script_v3_0.md
│   └── [Additional configuration guides]
├── EXAMPLES/       # Complete working examples for each service
│   ├── example-ifttt-filter-bluesky-3.x.x.ts
│   ├── example-ifttt-filter-fb-ig-via-rss.app-3.x.x.ts (for FB and IG via RSS.app)
│   ├── example-ifttt-filter-rss-3.x.x.ts
│   ├── example-ifttt-filter-x-xcom-3.x.x.ts (for X.com)
│   ├── example-ifttt-filter-x-xcancel-3.x.x.ts (for Xcancel.com)
│   ├── example-ifttt-filter-x-rss.app-xcom-3.x.x.ts (for X.com via RSS.app)
│   ├── example-ifttt-filter-x-rss.app-xcancel-3.x.x.ts (for Xcancel.com via RSS.app)
│   └── example-ifttt-filter-youtube-3.x.x.ts
├── SETTINGS/       # Default configurations for each platform
│   ├── settings-ifttt-bluesky.ts
│   ├── settings-ifttt-rss.ts
│   ├── settings-ifttt-x-twitter.ts
│   └── settings-ifttt-youtube.ts
└── TESTS/          # Automated testing scripts
    └── [Unit and integration tests]
```

## Getting Started

### Prerequisites

- A Mastodon server account for your bot
- An IFTTT PRO+ subscription (required for filter scripts)
- Access to the platform you want to mirror (Twitter, YouTube subscription, etc.)

### Choosing the Right Example

Select the appropriate example script based on your content source:

| Content Source | Example Script | Use Case |
|---------------|---------------|----------|
| **BlueSky** | `example-ifttt-filter-bluesky-3.x.x.ts` | Mirror BlueSky profiles |
| **RSS Feeds** | `example-ifttt-filter-rss-3.x.x.ts` | Generic RSS feed aggregation |
| **X (Native)** | `example-ifttt-filter-x-xcom-3.x.x.ts` | Direct Twitter API integration |
| **X (Native)** | `example-ifttt-filter-x-xcancel-3.x.x.ts` | Direct Twitter API integration with Xcancel support |
| **X (via RSS.app)** | `example-ifttt-filter-x-rss.app-xcom-3.x.x.ts` | Twitter via RSS.app service |
| **X (via RSS.app)** | `example-ifttt-filter-x-rss.app-xcancel-3.x.x.ts` | Twitter via RSS.app service with Xcancel support |
| **Facebook/Instagram** | `example-ifttt-filter-fb-ig-via-rss.app-3.x.x.ts` | FB/IG via RSS.app service |
| **YouTube** | `example-ifttt-filter-youtube-3.x.x.ts` | YouTube channel subscriptions |

**Note:** For detailed configuration options and advanced customization, see the `/DOCS` folder, particularly `CONTENT_REPLACEMENTS_examples_for_IFTTT_filter_script_v3_0.md`.

### Setting Up BlueSky Bots

1. Navigate to IFTTT and click **Create** at **My Applets**
2. Select **RSS Feed** service
3. Choose **New feed item** trigger
4. Enter the BlueSky user feed URL:
   ```
   https://bsky.app/profile/username.bsky.social/rss
   ```
5. Add the corresponding filter script from `example-ifttt-filter-bluesky-3.x.x.ts`

### Setting Up RSS Bots

1. Create new IFTTT applet
2. Select **RSS Feed** service
3. Choose **New feed item** trigger
4. Enter your RSS feed URL:
   ```
   https://example.com/rss
   ```
5. Apply the RSS filter script from `example-ifttt-filter-rss-3.x.x.ts`

### Setting Up Twitter/X Bots

1. Create new IFTTT applet
2. Select **Twitter** service
3. Choose **New tweet from search** trigger
4. Configure search query based on your needs:

   **Basic (excludes replies to others):**
   ```
   from:twitterUsername -is:reply OR from:twitterUsername to:twitterUsername
   ```

   **Exclude retweets and quotes:**
   ```
   from:twitterUsername -is:reply -is:retweet -is:quote OR from:twitterUsername to:twitterUsername
   ```

   **Hashtag tracking:**
   ```
   #specifichashtag -is:reply -is:retweet
   ```
5. Apply the Twitter filter script from `example-ifttt-filter-x-twitter-3.x.x.ts`

### Setting Up YouTube Bots

1. Create new IFTTT applet
2. Select **YouTube** service
3. Choose **New public video from subscriptions** trigger
4. Select the desired YouTube subscription
5. Apply the YouTube filter script from `example-ifttt-filter-youtube-3.x.x.ts`

## Configuration

### Mastodon Integration

For detailed information about configuring the Mastodon side of the integration, refer to the comprehensive guide at:
https://hyperborea.org/journal/2017/12/mastodon-iftt/

### Customizing Filter Scripts

Each filter script can be customized by adjusting the settings component. Key configuration areas include:

- **CONTENT_REPLACEMENTS** - Pattern-based text manipulation with regex and literal string support
- **FILTER rules** - Content filtering with NOT/COMPLEX operations (v3.1.0+)
- **MOVE_URL_TO_END** - Automatic URL repositioning (v3.1.0+)
- **FORCE_SHOW_ORIGIN_POSTURL** - Origin URL display control

See the `/DOCS` folder for detailed documentation on all available configuration options.

## Testing

The project maintains a comprehensive test suite with 85+ test cases covering:

- **Unit Tests** - Individual function validation
- **Integration Tests** - End-to-end content processing
- **Real-World Content Tests** - Validation against actual social media posts
- **Edge Case Testing** - HTML anchor tags, complex filtering, Unicode handling

**Current Test Status:** 100% success rate (v3.1.0)

**Beta Testing:** Critical updates are tested using the dedicated `@betabot` account with real-world content before production deployment.

## Troubleshooting

### Common Issues

**Issue: Anchor tags appearing as `<a href="...">` instead of proper links**
- **Solution:** Ensure you're using v3.0.3+ which includes the anchor tag fix
- **Context:** RSS feeds from sources like ČT24 require proper HTML anchor tag processing
- **Verification:** Test with real RSS feed content before deployment

**Issue: Script size exceeds 65,536 bytes**
- **Solution:** Review and optimize CONTENT_REPLACEMENTS patterns
- **Context:** Current v3.1.0 uses 58,651 bytes (89.5% of limit)
- **Prevention:** Use literal string matching (`literal: true`) when possible for efficiency

**Issue: Filter not working as expected**
- **Solution:** Check the order of CONTENT_REPLACEMENTS patterns - they apply sequentially
- **Verification:** Use the test suite to validate pattern behavior
- **Debugging:** Test patterns individually before combining

**Issue: Unicode emoji handling problems**
- **Solution:** Use `\u` escape sequences for emoji in patterns
- **Example:** See CONTENT_REPLACEMENTS documentation for emoji handling examples

**Issue: Performance degradation with complex regex**
- **Solution:** Simplify patterns or use literal string matching when possible
- **Optimization:** Place more specific patterns before general ones

### Getting Help

For additional support:
1. Check the `/DOCS` folder for detailed configuration guides
2. Review test cases in `/TESTS` for working examples
3. Contact via social networks or About.me page (links in Acknowledgments)

## Changelog

### v3.1.0
**Release Date:** Oct 16th, 2025
**Focus:** Consolidated feature improvements and critical bug fixes

**New Features:**
- MOVE_URL_TO_END user configuration option
- NOT/COMPLEX filter operations support
- Unified Filter Structure with regex support
- Enhanced filtering capabilities

**Bug Fixes:**
- FORCE_SHOW_ORIGIN_POSTURL logic corrections
- Anchor Tag Fix for HTML processing in RSS feeds

**Testing:**
- 85+ test cases with 100% success rate
- Real-world content validation via @betabot

**Migration Notes:**
- 100% backward compatible with v3.0.0
- No configuration changes required for existing users

### v3.0.3
**Release Date:** October 2025  
**Focus:** HTML processing improvements

**Bug Fixes:**
- Fixed anchor tag rendering in RSS feeds

### v3.0.0
**Release Date:** October 2025  
**Focus:** Major architectural update

**New Features:**
- Renamed CONTENT_HACK_PATTERNS to CONTENT_REPLACEMENTS
- New `literal` parameter for exact string matching
- Improved flexibility mixing literal and regex replacements
- Enhanced performance with literal string optimization

**Breaking Changes:**
- Configuration setting renamed (backward compatible)

**Migration:**
- See `CONTENT_REPLACEMENTS_examples_for_IFTTT_filter_script_v3_0.md` for migration guide

## Contributing

Contributions are welcome! This project is released under the [Unlicense license](https://unlicense.org), making it truly public domain.

If you have improvements, bug fixes, or new features to suggest, please feel free to submit a pull request or open an issue.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Test** your changes using the test suite
4. **Validate** with real-world content via beta testing
5. **Submit** a pull request with detailed description

### Coding Standards

- Maintain ES5 compatibility
- Keep script size under 65,536 bytes
- Achieve 100% test success rate
- Document all configuration options
- Provide examples for new features

## Support

If you find Zprávobot.news useful and would like to support its continued operation, you can contribute through:

- 🏦 **Bank Transfer**: IBAN CZ8830300000001001612070
- 💳 **Revolut**: [revolut.me/zpravobot](https://revolut.me/zpravobot)
- ☕ **Ko-fi**: [ko-fi.com/zpravobot](https://ko-fi.com/zpravobot)
- 🖥️ **Forendors**: [forendors.cz/zpravobot](https://forendors.cz/zpravobot)

![QR code for bank transfer](https://zpravobot.news/system/media_attachments/files/113/069/699/996/938/723/original/824504de17667be7.jpeg 'QR Code for Bank Transfer')

Your support helps keep this public utility running and accessible to the Czech Mastodon community.

## Acknowledgments

This project wouldn't exist without:

- **My Family** - My beloved wife [Greticzka](https://mastodon.social/@greticzka) and our daughters for their unwavering support
- **[Marvoqs](https://github.com/marvoqs)** - For coding the foundational script architecture
- **[Lawondyss](https://github.com/Lawondyss)** - For extensive development and feature additions
- **The Czech Mastodon Community** - For making this all worthwhile
- **Beta Testers** - For helping validate updates with real-world content

---

**Maintained by Daniel Šnor** | Prague, Czech Republic | [zpravobot.news](https://zpravobot.news)

**Connect:**
- 🐘 Mastodon: [@zpravobot@zpravobot.news](https://zpravobot.news/@zpravobot)
- 🦋 BlueSky: [@zpravobot.news](https://bsky.app/profile/zpravobot.news)
- 🐦 Twitter/X: [@zpravobot](https://twitter.com/zpravobot)

*Last updated: November 16, 2025*
