///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🦋📙📗📘 webhook - Doctor Who Day rev, Nov 23rd, 2025
///////////////////////////////////////////////////////////////////////////////
//
// This connector processes data from various sources (e.g., RSS, Twitter, Bluesky)
// and provides it to the IFTTT webhook for publishing. The data is filtered and
// edited according to the settings in AppSettings.
//
///////////////////////////////////////////////////////////////////////////////

// Main text content (EntryContent for BlueSky/RSS).
const entryContent = Feed.newFeedItem.EntryContent || "";
// Title (EntryTitle for BlueSky/RSS).
const entryTitle = Feed.newFeedItem.EntryTitle || "";
// Post/item URL (direct link for BlueSky/RSS).
const entryUrl = Feed.newFeedItem.EntryUrl || "";
// First image/media URL (EntryImageUrl for BlueSky/RSS, may be unreliable).
const entryImageUrl = Feed.newFeedItem.EntryImageUrl || "";
// Post author username (EntryAuthor for BlueSky/RSS).
const entryAuthor = Feed.newFeedItem.EntryAuthor || "";
// Feed title/username (FeedTitle for BlueSky/RSS).
const feedTitle = Feed.newFeedItem.FeedTitle || "";
// Source feed/profile URL (FeedUrl for BlueSky/RSS).
const feedUrl = Feed.newFeedItem.FeedUrl || "";