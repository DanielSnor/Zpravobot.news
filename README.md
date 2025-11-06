# Zpravobot.news

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org)
[![Mastodon](https://img.shields.io/badge/Mastodon-Instance-6364FF?logo=mastodon&logoColor=white)](https://zpravobot.news)

![Zpravobot.news mascot](https://zpravobot.news/system/site_uploads/files/000/000/002/@2x/49c4aa7df6b81d4a.png 'Zpravobot.news mascot')

**Zprávobot.news** 📰🤖 (Newsbot.news in Czech) is run by Daniel Šnor as a public utility 🖥️⌨️ that mirrors 🪞 popular primarily Czech 🇨🇿 and Slovak 🇸🇰 X/Twitter 🐦 accounts, bringing to Mastodon 🐘 otherwise missing news 📰, sports ⚽️🏒🏎️, tech info 📱⌚️💻📡, entertainment 🎞️🎶🎭, and sometimes humor 🤣🤪.

**🌉 BlueSky Bridge**: Since September 2025, most bots are also available on BlueSky via [Brid.gy](https://fed.brid.gy/), expanding the reach of Czech content across federated platforms.

## Table of Contents

- [About](#about)
- [The Mission](#the-mission)
- [Technical Architecture](#technical-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setting Up BlueSky Bots](#setting-up-bluesky-bots)
  - [Setting Up RSS Bots](#setting-up-rss-bots)
  - [Setting Up Twitter/X Bots](#setting-up-twitterx-bots)
  - [Setting Up YouTube Bots](#setting-up-youtube-bots)
- [Configuration](#configuration)
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

## Technical Architecture

The solution uses a standard Mastodon server as the frontend, combined with IFTTT (If This Then That) as the backend automation layer. This approach was inspired by the **Press.coop** server but adapted to use IFTTT's infrastructure instead of custom backend code.

### Key Components

1. **Mastodon Server** - Standard installation hosting bot accounts
2. **IFTTT Applets** - Individual bots that monitor various sources
3. **Filter Scripts** - PRO+ subscription feature that processes and formats content
4. **Unified Output** - Consistent formatting across all content sources

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
├── EXAMPLES/       # Complete working examples for each service
│   ├── example-ifttt-filter-bluesky-3.x.x.ts
│   ├── example-ifttt-filter-fb-ig-via-rss.app-3.x.x.ts (for FB and IG via RSS.app)
│   ├── example-ifttt-filter-rss-3.x.x.ts
│   ├── example-ifttt-filter-x-twitter-3.x.x.ts
│   ├── example-ifttt-filter-x-twitter-via-rss.app-3.x.x.ts (for X/TW via RSS.app)
│   └── example-ifttt-filter-youtube-3.x.x.ts
├── SETTINGS/       # Default configurations for each platform
│   ├── settings-ifttt-bluesky.ts
│   ├── settings-ifttt-rss.ts
│   ├── settings-ifttt-x-twitter.ts
│   └── settings-ifttt-youtube.ts
└── TESTS/          # Automated testing scripts
```

## Getting Started

### Prerequisites

- A Mastodon server account for your bot
- An IFTTT PRO+ subscription (required for filter scripts)
- Access to the platform you want to mirror (Twitter, YouTube subscription, etc.)

### Setting Up BlueSky Bots

1. Navigate to IFTTT and click **Create** at **My Applets**
2. Select **RSS Feed** service
3. Choose **New feed item** trigger
4. Enter the BlueSky user feed URL:
   ```
   https://bsky.app/profile/username.bsky.social/rss
   ```
5. Add the corresponding filter script from the EXAMPLES folder

### Setting Up RSS Bots

1. Create new IFTTT applet
2. Select **RSS Feed** service
3. Choose **New feed item** trigger
4. Enter your RSS feed URL:
   ```
   https://example.com/rss
   ```
5. Apply the RSS filter script

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
5. Apply the Twitter filter script

### Setting Up YouTube Bots

1. Create new IFTTT applet
2. Select **YouTube** service
3. Choose **New public video from subscriptions** trigger
4. Select the desired YouTube subscription
5. Apply the YouTube filter script

## Configuration

### Mastodon Integration

For detailed information about configuring the Mastodon side of the integration, refer to the comprehensive guide at:
https://hyperborea.org/journal/2017/12/mastodon-iftt/

### Customizing Filter Scripts

Each filter script can be customized by adjusting the settings component. See the `/DOCS` folder for detailed documentation on all available configuration options.

## Contributing

Contributions are welcome! This project is released under the [Unlicense license](https://unlicense.org), making it truly public domain.

If you have improvements, bug fixes, or new features to suggest, please feel free to submit a pull request or open an issue.

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

---

**Maintained by Daniel Šnor** | Prague, Czech Republic | [zpravobot.news](https://zpravobot.news)

*Last updated: October 10, 2025*
