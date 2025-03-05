///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 𝕏 webhook - rev 5.3.2025
///////////////////////////////////////////////////////////////////////////////
const entryContent = String(Twitter.newTweetFromSearch.Text); // tweet content
const entryTitle = String(Twitter.newTweetFromSearch.Text); // tweet title
const entryUrl = String(Twitter.newTweetFromSearch.LinkToTweet); // link to the tweet
const entryImageUrl = String(Twitter.newTweetFromSearch.UserImageUrl); // URL to the user image
const entryAuthor = String(Twitter.newTweetFromSearch.UserName); // author's username
const feedTitle = String(Twitter.newTweetFromSearch.UserName); // title of the feed (username)
const feedUrl = String("https://twitter.com/" + Twitter.newTweetFromSearch.UserName); // feed URL
