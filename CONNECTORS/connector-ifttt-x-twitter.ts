///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 𝕏 webhook - April's Fool Day 2025 rev
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
const entryContent = String(Twitter.newTweetFromSearch.Text); // tweet content
const entryTitle = String(Twitter.newTweetFromSearch.Text); // tweet title
const entryUrl = String(Twitter.newTweetFromSearch.LinkToTweet); // link to the tweet
const entryImageUrl = String(Twitter.newTweetFromSearch.FirstLinkUrl); // firstLinkURL in tweet
const entryAuthor = String(Twitter.newTweetFromSearch.UserName); // author's username
const feedTitle = String(Twitter.newTweetFromSearch.UserName); // title of the feed (username)
const feedUrl = String("https://twitter.com/" + Twitter.newTweetFromSearch.UserName); // feed URL
