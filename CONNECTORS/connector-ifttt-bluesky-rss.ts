///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🦋📙📗📘 webhook - World Wombat Day, Oct 22nd, 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// This connector processes data from various sources (e.g., RSS, Twitter, Bluesky)
// and provides it to the IFTTT webhook for publishing. The data is filtered and
// edited according to the settings in AppSettings.
//
///////////////////////////////////////////////////////////////////////////////

// Main text content from the source. For BlueSky and RSS, this is often EntryContent (HTML or plain text).
const entryContent = Feed.newFeedItem.EntryContent || "";
// Title from the source. For BlueSky and RSS, this is the EntryTitle field.
const entryTitle = Feed.newFeedItem.EntryTitle || "";
// URL of the specific post/item. For BlueSky and RSS, this is the direct link to the item.
const entryUrl = Feed.newFeedItem.EntryUrl || "";
// URL of the first image/media link found in the post. For BlueSky and RSS, this is EntryImageUrl (might be unreliable).
const entryImageUrl = Feed.newFeedItem.EntryImageUrl || "";
// Username of the post author. For BlueSky and RSS, this is the EntryAuthor field.
const entryAuthor = Feed.newFeedItem.EntryAuthor || "";
// Title of the feed (can be username, feed name, etc.). For BlueSky and RSS, this is FeedTitle.
const feedTitle = Feed.newFeedItem.FeedTitle || "";
// URL of the source feed/profile. For BlueSky and RSS, this is the FeedUrl field.
const feedUrl = Feed.newFeedItem.FeedUrl || "";