///////////////////////////////////////////////////////////////////////////////
// Connector for IFTTT 𝕏 webhook - Black Friday rev, Nov 28th, 2025
///////////////////////////////////////////////////////////////////////////////
//
// This connector processes data from various sources (e.g., RSS, Twitter, Bluesky)
// and provides it to the IFTTT webhook for publishing. The data is filtered and
// edited according to the settings in AppSettings.
//
///////////////////////////////////////////////////////////////////////////////

// Main text content (TweetEmbedCode - HTML embed).
const entryContent = Twitter.newTweetFromSearch.TweetEmbedCode || "";
// Title (Text - clean content without HTML).
const entryTitle = Twitter.newTweetFromSearch.Text || "";
// Tweet URL.
const entryUrl = Twitter.newTweetFromSearch.LinkToTweet || "";
// First image/media URL (FirstLinkUrl).
const entryImageUrl = Twitter.newTweetFromSearch.FirstLinkUrl || "";
// Post author username.
const entryAuthor = Twitter.newTweetFromSearch.UserName || "";
// Feed title/username.
const feedTitle = Twitter.newTweetFromSearch.UserName || "";
// Source profile URL (constructed from username).
const feedUrl = "https://x.com/" + (Twitter.newTweetFromSearch.UserName || "");
