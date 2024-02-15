interface IFeed {
  newFeedItem: {
    EntryAuthor: unknown;
    EntryContent: unknown;
    EntryImageUrl: unknown;
    EntryTitle: unknown;
    EntryUrl: unknown;
    FeedTitle: unknown;
    FeedUrl: unknown;
  };
}
interface IMakerWebhooks {
  makeWebRequest: {
    setBody: (body: string) => void;
    skip: () => void;
  };
}

let Feed: IFeed = {
  newFeedItem: {
    EntryAuthor: "marv",
    EntryContent: "Hello",
    EntryImageUrl: "https://nitter.cz/image.jpg",
    EntryTitle: "Hello title",
    EntryUrl: "https://nitter.cz",
    FeedTitle: "Daniel Šnor / @danielsnor",
    FeedUrl: "https://nitter.cz/danielsnor",
  },
};
let MakerWebhooks: IMakerWebhooks = {
  makeWebRequest: { setBody: (_body) => {}, skip: () => {} },
};

export { Feed, MakerWebhooks };
