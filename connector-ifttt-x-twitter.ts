///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🐦‍⬛ webhook v0.8.12 - 28.12.2023
///////////////////////////////////////////////////////////////////////////////
const entryContent = String(Twitter.newTweetFromSearch.Text);
const entryTitle = String();
const entryUrl = String(Twitter.newTweetFromSearch.LinkToTweet);
const entryImageUrl = String(Twitter.newTweetFromSearch.UserImageUrl);
const entryAuthor = String(Twitter.newTweetFromSearch.UserName);
const feedTitle = String(Twitter.newTweetFromSearch.CreatedAt);
const feedUrl = String();