///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 📺 webhook v0.9.3 - 28.1.2024
///////////////////////////////////////////////////////////////////////////////
const entryContent = String(Youtube.newPublicVideoFromSubscriptions.Description);
const entryTitle = String(Youtube.newPublicVideoFromSubscriptions.Title);
const entryUrl = String(Youtube.newPublicVideoFromSubscriptions.Url);
const entryImageUrl = String();
const entryAuthor = String(Youtube.newPublicVideoFromSubscriptions.AuthorName);
const feedTitle = String(Youtube.newPublicVideoFromSubscriptions.Title);
const feedUrl = String();
