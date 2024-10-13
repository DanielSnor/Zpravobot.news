# NodeJS scripts

Scripts for posting from a specific source to Mastodon. Scripts require several env variables, all of which are listed in
`.env.example`.

For security reasons, it is better to pass them when the script is called, but if they are stored in `.env` it doesn't prevent anything.

Some env variables need to be set when the script is called in the terminal, as they define a resource or account, which is different.



## `rss.js`
Posts posts from RSS feeds.
Requires `RSS_URL` which contains the URL of the RSS feed.
