///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 𝕏 webhook - 23.4.2025 rev
///////////////////////////////////////////////////////////////////////////////
// 
// This connector processes data from various sources (e.g. RSS, Twitter, Bluesky) 
// and provides it to the IFTTT webhook for publishing.
// 
// The data is filtered and edited according to the settings in AppSettings.
//
// This section defines the input variables coming from the IFTTT trigger.
// IMPORTANT: Adapt the source (e.g., Twitter.newTweetFromSearch or Feed.newFeedItem)
// based on the specific trigger used in your IFTTT applet.
// Use 'let' for variables that might be modified by the TREAT_RSS_AS_TW logic.
//
///////////////////////////////////////////////////////////////////////////////

let entryContent = String(Twitter.newTweetFromSearch.TweetEmbedCode || ""); 		// Main text content from the source. (TweetEmbedCode)
let entryTitle = String(Twitter.newTweetFromSearch.Text); 							// Title from the source (clean content without HTML for Twitter).
let entryUrl = String(Twitter.newTweetFromSearch.LinkToTweet); 						// URL of the specific post/item.
let entryImageUrl = String(Twitter.newTweetFromSearch.FirstLinkUrl); 				// URL of the first image/media link found.
let entryAuthor = String(Twitter.newTweetFromSearch.UserName); 						// Username of the post author.
let feedTitle = String(Twitter.newTweetFromSearch.UserName); 						// Title of the feed (can be username, feed name, etc.).
let feedUrl = String("https://twitter.com/" + Twitter.newTweetFromSearch.UserName); // URL of the source feed/profile.