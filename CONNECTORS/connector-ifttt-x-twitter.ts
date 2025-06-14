///////////////////////////////////////////////////////////////////////////////
// Connector for IFTTT 𝕏 webhook - June's Friday the 13th, 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// This connector processes data from various sources (e.g., RSS, Twitter, Bluesky)
// and provides it to the IFTTT webhook for publishing. The data is filtered and
// edited according to the settings in AppSettings.
//
// This section defines the input variables coming from the IFTTT trigger.
// IMPORTANT: Adapt the source (e.g., Twitter.newTweetFromSearch or Feed.newFeedItem)
// based on the specific trigger used in your IFTTT applet. 
//
///////////////////////////////////////////////////////////////////////////////

// Main text content from the source. For Twitter, this is often TweetEmbedCode (HTML embed code).
const entryContent = Twitter.newTweetFromSearch.TweetEmbedCode || '';
// Title from the source. For Twitter, this is clean content without HTML (Text field).
const entryTitle = Twitter.newTweetFromSearch.Text || '';
// URL of the specific post/item. For Twitter, this is the direct link to the tweet.
const entryUrl = Twitter.newTweetFromSearch.LinkToTweet || '';
// URL of the first image/media link found in the post. For Twitter, this is FirstLinkUrl.
const entryImageUrl = Twitter.newTweetFromSearch.FirstLinkUrl || '';
// Username of the post author. For Twitter, this is the UserName field.
const entryAuthor = Twitter.newTweetFromSearch.UserName || '';
// Title of the feed (can be username, feed name, etc.). For Twitter, this is often UserName.
const feedTitle = Twitter.newTweetFromSearch.UserName || '';
// URL of the source feed/profile. For Twitter, this is constructed from the username.
const feedUrl = "https://twitter.com/" + (Twitter.newTweetFromSearch.UserName || '');