///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 📺 webhook - St. Daniel's Day rev, Dec 17th, 2025
///////////////////////////////////////////////////////////////////////////////

const entryContent = Youtube.newPublicVideoFromSubscriptions.Description || ""; // Video description.
const entryTitle = Youtube.newPublicVideoFromSubscriptions.Title || ""; // Video title.
const entryUrl = Youtube.newPublicVideoFromSubscriptions.Url || ""; // Video URL.
const entryImageUrl = ""; // Image URL (not available for YouTube).
const entryAuthor = Youtube.newPublicVideoFromSubscriptions.AuthorName || ""; // Channel name.
const feedTitle = Youtube.newPublicVideoFromSubscriptions.Title || ""; // Feed title (video title).
const feedUrl = ""; // Feed URL (not available for YouTube).