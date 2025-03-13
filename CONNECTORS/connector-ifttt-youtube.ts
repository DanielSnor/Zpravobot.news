///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 📺 webhook - Pi Day 2025 rev
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

const entryContent = String(Youtube.newPublicVideoFromSubscriptions.Description); // post content
const entryTitle = String(Youtube.newPublicVideoFromSubscriptions.Title); // post title
const entryUrl = String(Youtube.newPublicVideoFromSubscriptions.Url); // link to the post
const entryImageUrl = String();
const entryAuthor = String(Youtube.newPublicVideoFromSubscriptions.AuthorName); // author's username
const feedTitle = String(Youtube.newPublicVideoFromSubscriptions.Title); // title of the feed (username)
const feedUrl = String();
