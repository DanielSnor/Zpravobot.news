///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🦋📙📗📘 webhook - April's Fool Day 2025 rev
///////////////////////////////////////////////////////////////////////////////
// 
// This connector processes data from various sources (e.g. RSS, Twitter, Bluesky) 
// and provides it to the IFTTT webhook for publishing.
// 
// The data is filtered and edited according to the settings in AppSettings.
// 
// Sources:
// - entryContent: Entry content for post
// - entryTitle: Entry title for post
// - entryUrl: Post URL
// - entryImageUrl: URL of the first image in the post
// - entryAuthor: Name of the author of the post
// - feedTitle: Feed Title (username)
// - feedUrl: Feed URL
// 
///////////////////////////////////////////////////////////////////////////////

const entryContent = String(Feed.newFeedItem.EntryContent); // post content
const entryTitle = String(Feed.newFeedItem.EntryTitle); // post title
const entryUrl = String(Feed.newFeedItem.EntryUrl); // link to the post
const entryImageUrl = String(Feed.newFeedItem.EntryImageUrl); // URL to the user image
const entryAuthor = String(Feed.newFeedItem.EntryAuthor); // author's username
const feedTitle = String(Feed.newFeedItem.FeedTitle); // title of the feed (username)
const feedUrl = String(Feed.newFeedItem.FeedUrl); // feed URL
