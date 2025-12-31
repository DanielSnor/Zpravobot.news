///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🦋📙📗📘 webhook - Z Day rev, Jan 1st, 2026
///////////////////////////////////////////////////////////////////////////////

const entryContent = Feed.newFeedItem.EntryContent || ""; // Main text content (EntryContent for BlueSky/RSS).
const entryTitle = Feed.newFeedItem.EntryTitle || ""; // Title (EntryTitle for BlueSky/RSS).
const entryUrl = Feed.newFeedItem.EntryUrl || ""; // Post/item URL (direct link for BlueSky/RSS).
const entryImageUrl = Feed.newFeedItem.EntryImageUrl || ""; // First image/media URL (EntryImageUrl for BlueSky/RSS, may be unreliable).
const entryAuthor = Feed.newFeedItem.EntryAuthor || ""; // Post author username (EntryAuthor for BlueSky/RSS).
const feedTitle = Feed.newFeedItem.FeedTitle || ""; // Feed title/username (FeedTitle for BlueSky/RSS).
const feedUrl = Feed.newFeedItem.FeedUrl || ""; // Source feed/profile URL (FeedUrl for BlueSky/RSS).