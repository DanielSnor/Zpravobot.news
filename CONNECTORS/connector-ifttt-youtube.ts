///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 📺 webhook - World Wombat Day, Oct 22nd, 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// This connector processes data from various sources (e.g., RSS, Twitter, Bluesky)
// and provides it to the IFTTT webhook for publishing. The data is filtered and
// edited according to the settings in AppSettings.
//
///////////////////////////////////////////////////////////////////////////////

// Main text content from the source. For YouTube, this is the video description.
const entryContent = Youtube.newPublicVideoFromSubscriptions.Description || "";
// Title from the source. For YouTube, this is the video title.
const entryTitle = Youtube.newPublicVideoFromSubscriptions.Title || "";
// URL of the specific post/item. For YouTube, this is the direct link to the video.
const entryUrl = Youtube.newPublicVideoFromSubscriptions.Url || "";
// URL of the first image/media link found in the post. For YouTube, this is the empty string.
const entryImageUrl = "";
// Username of the post author. For YouTube, this is the AuthorName field (channel name).
const entryAuthor = Youtube.newPublicVideoFromSubscriptions.AuthorName || "";
// Title of the feed (can be username, feed name, etc.). For YouTube, this is the AuthorName (channel name).
const feedTitle = Youtube.newPublicVideoFromSubscriptions.Title || "";
// URL of the source feed/profile. For YouTube, this is the empty string.
const feedUrl = "";