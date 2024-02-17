///////////////////////////////////////////////////////////////////////////////
// connector for IFTTT 🐦‍⬛ webhook - 17.2.2024
///////////////////////////////////////////////////////////////////////////////
const entryContent = String(Twitter.newTweetFromSearch.Text);
const entryTitle = String(Twitter.newTweetFromSearch.Text);
const entryUrl = String(Twitter.newTweetFromSearch.LinkToTweet);
const entryImageUrl = String(Twitter.newTweetFromSearch.UserImageUrl);
const entryAuthor = String(Twitter.newTweetFromSearch.UserName);
const feedTitle = String(Twitter.newTweetFromSearch.UserName);
const feedUrl = String();
