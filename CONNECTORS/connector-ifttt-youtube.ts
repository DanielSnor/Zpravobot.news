///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 📺 webhook - Children's Day 2025 rev
///////////////////////////////////////////////////////////////////////////////
//
// This connector processes data from various sources (e.g., RSS, Twitter, Bluesky)
// and provides it to the IFTTT webhook for publishing. The data is filtered and
// edited according to the settings in AppSettings.
//
// This section defines the input variables coming from the IFTTT trigger.
// IMPORTANT: Adapt the source (e.g., Twitter.newTweetFromSearch or Feed.newFeedItem)
// based on the specific trigger used in your IFTTT applet. Use 'let' for variables
// that might be modified by the TREAT_RSS_AS_TW logic.
//
///////////////////////////////////////////////////////////////////////////////

// Main text content from the source. For YouTube, this is the video description.
let entryContent = String(Youtube.newPublicVideoFromSubscriptions.Description);
// Title from the source. For YouTube, this is the video title.
let entryTitle = String(Youtube.newPublicVideoFromSubscriptions.Title);
// URL of the specific post/item. For YouTube, this is the direct link to the video.
let entryUrl = String(Youtube.newPublicVideoFromSubscriptions.Url);
// URL of the first image/media link found in the post. For YouTube, this is the empty string.
let entryImageUrl = String();
// Username of the post author. For YouTube, this is the AuthorName field (channel name).
let entryAuthor = String(Youtube.newPublicVideoFromSubscriptions.AuthorName);
// Title of the feed (can be username, feed name, etc.). For YouTube, this is the AuthorName (channel name).
let feedTitle = String(Youtube.newPublicVideoFromSubscriptions.Title);
// URL of the source feed/profile. For YouTube, this is the empty string.
let feedUrl = String();
