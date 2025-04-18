///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 📺 webhook - Good Friday 2025 rev
///////////////////////////////////////////////////////////////////////////////
// 
// This connector processes data from various sources (e.g. RSS, Twitter, Bluesky) 
// and provides it to the IFTTT webhook for publishing.
// 
// The data is filtered and edited according to the settings in AppSettings.
//
// This section defines the input variables coming from the IFTTT trigger.
// IMPORTANT: Adapt the source (e.g., Twitter.newTweetFromSearch or Feed.newFeedItem)
// based on the specific trigger used in your IFTTT applet.
// Use 'let' for variables that might be modified by the TREAT_RSS_AS_TW logic.
//
///////////////////////////////////////////////////////////////////////////////

let entryContent = String(Youtube.newPublicVideoFromSubscriptions.Description); // post content
let entryTitle = String(Youtube.newPublicVideoFromSubscriptions.Title); 		// post title
let entryUrl = String(Youtube.newPublicVideoFromSubscriptions.Url); 			// link to the post
let entryImageUrl = String();
let entryAuthor = String(Youtube.newPublicVideoFromSubscriptions.AuthorName); 	// author's username
let feedTitle = String(Youtube.newPublicVideoFromSubscriptions.Title); 			// title of the feed (username)
let feedUrl = String();
