///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🐦‍⬛ webhook v0.9.3 - 17.1.2024
///////////////////////////////////////////////////////////////////////////////
const entryContent = String(Twitter.newTweetFromSearch.Text);
const entryTitle = String();
const entryUrl = String(Twitter.newTweetFromSearch.LinkToTweet);
const entryImageUrl = String(Twitter.newTweetFromSearch.UserImageUrl);
const entryAuthor = String(Twitter.newTweetFromSearch.UserName);
const feedTitle = String(Twitter.newTweetFromSearch.CreatedAt);
const feedUrl = String();
