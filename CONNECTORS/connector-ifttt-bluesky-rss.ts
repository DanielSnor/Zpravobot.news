///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🦋📙📗📘 webhook - 23.4.2025 rev
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

let entryContent = String(Feed.newFeedItem.EntryContent); 	// Main text content (often includes HTML).
let entryTitle = String(Feed.newFeedItem.EntryTitle);     	// Title of the feed item.
let entryUrl = String(Feed.newFeedItem.EntryUrl);         	// URL of the specific item.
let entryImageUrl = String(Feed.newFeedItem.EntryImageUrl); // Image URL associated with the item (might be unreliable).
let entryAuthor = String(Feed.newFeedItem.EntryAuthor);   	// Author name/username if provided by the feed.
let feedTitle = String(Feed.newFeedItem.FeedTitle);       	// Title of the RSS feed itself.
let feedUrl = String(Feed.newFeedItem.FeedUrl);           	// URL of the RSS feed.