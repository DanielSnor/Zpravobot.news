///////////////////////////////////////////////////////////////////////////////
// Connector for IFTTT 𝕏 webhook - Z Day rev, Jan 1st, 2026
///////////////////////////////////////////////////////////////////////////////

const entryContent = Twitter.newTweetFromSearch.TweetEmbedCode || ""; // Main text content (TweetEmbedCode - HTML embed).
const entryTitle = Twitter.newTweetFromSearch.Text || ""; // Title (Text - clean content without HTML).
const entryUrl = Twitter.newTweetFromSearch.LinkToTweet || ""; // Tweet URL.
const entryImageUrl = Twitter.newTweetFromSearch.FirstLinkUrl || ""; // First image/media URL (FirstLinkUrl).
const entryAuthor = Twitter.newTweetFromSearch.UserName || ""; // Post author username.
const feedTitle = Twitter.newTweetFromSearch.UserName || ""; // Feed title/username.
const feedUrl = "https://x.com/" + (Twitter.newTweetFromSearch.UserName || ""); // Source profile URL (constructed from username).