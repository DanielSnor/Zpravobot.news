///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 📺 webhook - rev 5.3.2025
///////////////////////////////////////////////////////////////////////////////
const entryContent = String(Youtube.newPublicVideoFromSubscriptions.Description); // post content
const entryTitle = String(Youtube.newPublicVideoFromSubscriptions.Title); // post title
const entryUrl = String(Youtube.newPublicVideoFromSubscriptions.Url); // link to the post
const entryImageUrl = String();
const entryAuthor = String(Youtube.newPublicVideoFromSubscriptions.AuthorName); // author's username
const feedTitle = String(Youtube.newPublicVideoFromSubscriptions.Title); // title of the feed (username)
const feedUrl = String();
