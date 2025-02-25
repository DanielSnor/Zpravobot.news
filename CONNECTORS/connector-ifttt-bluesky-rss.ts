///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🦋📙📗📘 webhook - rev 25.2.2025
///////////////////////////////////////////////////////////////////////////////
const entryContent = String(Feed.newFeedItem.EntryContent); // post content
const entryTitle = String(Feed.newFeedItem.EntryTitle); // post title
const entryUrl = String(Feed.newFeedItem.EntryUrl); // link to the post
const entryImageUrl = String(Feed.newFeedItem.EntryImageUrl); // URL to the user image
const entryAuthor = String(Feed.newFeedItem.EntryAuthor); // author's username
const feedTitle = String(Feed.newFeedItem.FeedTitle); // title of the feed (username)
const feedUrl = String(Feed.newFeedItem.FeedUrl); // feed URL
