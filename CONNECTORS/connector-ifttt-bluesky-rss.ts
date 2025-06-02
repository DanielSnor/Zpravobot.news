///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🦋📙📗📘 webhook - Children's Day 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// This connector processes data from various sources (e.g., RSS, Twitter, Bluesky)
// and provides it to the IFTTT webhook for publishing. The data is filtered and
// edited according to the settings in AppSettings.
//
// This section defines the input variables coming from the IFTTT trigger.
// IMPORTANT: Adapt the source (e.g., Twitter.newTweetFromSearch or Feed.newFeedItem)
// based on the specific trigger used in your IFTTT applet. Use 'let' for variables
// that might be modified by the TREAT_RSS_AS_TW logic.
//
///////////////////////////////////////////////////////////////////////////////

// Main text content from the source. For BlueSky and RSS, this is often EntryContent (HTML or plain text).
let entryContent = String(Feed.newFeedItem.EntryContent);
// Title from the source. For BlueSky and RSS, this is the EntryTitle field.
let entryTitle = String(Feed.newFeedItem.EntryTitle);
// URL of the specific post/item. For BlueSky and RSS, this is the direct link to the item.
let entryUrl = String(Feed.newFeedItem.EntryUrl);
// URL of the first image/media link found in the post. For BlueSky and RSS, this is EntryImageUrl (might be unreliable).
let entryImageUrl = String(Feed.newFeedItem.EntryImageUrl);
// Username of the post author. For BlueSky and RSS, this is the EntryAuthor field.
let entryAuthor = String(Feed.newFeedItem.EntryAuthor);
// Title of the feed (can be username, feed name, etc.). For BlueSky and RSS, this is FeedTitle.
let feedTitle = String(Feed.newFeedItem.FeedTitle);
// URL of the source feed/profile. For BlueSky and RSS, this is the FeedUrl field.
let feedUrl = String(Feed.newFeedItem.FeedUrl);
