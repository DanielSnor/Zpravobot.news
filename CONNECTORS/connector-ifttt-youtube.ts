///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 📺 webhook - Doctor Who Day rev, Nov 23rd, 2025
///////////////////////////////////////////////////////////////////////////////
//
// This connector processes data from various sources (e.g., RSS, Twitter, Bluesky)
// and provides it to the IFTTT webhook for publishing. The data is filtered and
// edited according to the settings in AppSettings.
//
///////////////////////////////////////////////////////////////////////////////

// Video description.
const entryContent = Youtube.newPublicVideoFromSubscriptions.Description || "";
// Video title.
const entryTitle = Youtube.newPublicVideoFromSubscriptions.Title || "";
// Video URL.
const entryUrl = Youtube.newPublicVideoFromSubscriptions.Url || "";
// Image URL (not available for YouTube).
const entryImageUrl = "";
// Channel name.
const entryAuthor = Youtube.newPublicVideoFromSubscriptions.AuthorName || "";
// Feed title (video title).
const feedTitle = Youtube.newPublicVideoFromSubscriptions.Title || "";
// Feed URL (not available for YouTube).
const feedUrl = "";