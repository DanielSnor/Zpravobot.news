///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 📺 webhook v0.8.12 - 28.12.2023
///////////////////////////////////////////////////////////////////////////////
const entryContent = String(Youtube.newPublicVideoFromSubscriptions.Description);
const entryTitle = String(Youtube.newPublicVideoFromSubscriptions.Title);
const entryUrl = String(Youtube.newPublicVideoFromSubscriptions.Url);
const entryImageUrl = String();
const entryAuthor = String(Youtube.newPublicVideoFromSubscriptions.AuthorName);
const feedTitle = String(Youtube.newPublicVideoFromSubscriptions.Title);
const feedUrl = String();
