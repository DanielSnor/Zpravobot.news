import {
  replaceAmpersands,
  replaceSourceWithTarget,
  isResponseToSomeoneElse,
  replaceUserNames,
  replaceResponseTo,
  replaceReposted,
  isRepost,
  isRepostOwn,
  trimImageUrl,
  trimContent,
} from "./nitterScript";

// replaceNitterWithTwitter
describe("replaceSourceWithTarget", () => {
  const source = "https://nitter.cz/";
  const target = "https://twitter.com/";

  test(`replaces "${source}" with "${target}"`, () => {
    expect(replaceSourceWithTarget(`${source}`, source, target)).toBe(
      `${target}`
    );
  });

  test(`replaces "${source}" with "${target}" further in the text`, () => {
    expect(
      replaceSourceWithTarget(
        `You can find something on ${source}.`,
        source,
        target
      )
    ).toBe(`You can find something on ${target}.`);
  });
});

// isResponseToSomeoneElse
describe("isResponseToSomeoneElse", () => {
  test('returns true when string contains "R to @nemarv" and authorName is "@marv"', () => {
    expect(isResponseToSomeoneElse("R to @nemarv: ", "@marv")).toBe(true);
  });

  test('returns false when string contains "R to @marv" and authorName is "@marv"', () => {
    expect(isResponseToSomeoneElse("R to @marv: ", "@marv")).toBe(false);
  });
});

// isRepost
describe("isRepost", () => {
  test('returns true when string contains "RT @marv: "', () => {
    expect(isRepost("RT @marv: ")).toBe(true);
  });
});

// isRepostOwn
describe("isRepostOwn", () => {
  test('returns true when string contains "RT @marv: " and authorName is "@marv"', () => {
    expect(isRepostOwn("RT @marv: ", "@marv")).toBe(true);
  });

  test('returns false when string contains "RT @marv: " and authorName is "@nemarv"', () => {
    expect(isRepostOwn("RT @marv: ", "@nemarv")).toBe(false);
  });
});

// replaceAmpersands
describe("replaceAmpersands", () => {
  const ampersandReplacement = " a ";

  test(`replaces "&#38;" with "${ampersandReplacement}"`, () => {
    expect(replaceAmpersands("&#38;", ampersandReplacement)).toBe(
      `${ampersandReplacement}`
    );
  });

  test(`replaces "&#038;" with "${ampersandReplacement}"`, () => {
    expect(replaceAmpersands("&#038;", ampersandReplacement)).toBe(
      `${ampersandReplacement}`
    );
  });

  test(`replaces "&amp;" with "${ampersandReplacement}"`, () => {
    expect(replaceAmpersands("&amp;", ampersandReplacement)).toBe(
      `${ampersandReplacement}`
    );
  });

  test(`replaces "&" with "${ampersandReplacement}"`, () => {
    expect(replaceAmpersands("&", ampersandReplacement)).toBe(
      `${ampersandReplacement}`
    );
  });

  test('does not replace "&" if it is part of a link', () => {
    expect(
      replaceAmpersands(
        "https://example.com?param=value&param2=value2",
        ampersandReplacement
      )
    ).toBe("https://example.com?param=value&param2=value2");
  });

  test('replaces "&" in a text but does not replace "&" in a following link', () => {
    expect(
      replaceAmpersands(
        `Some text with & and then https://example.com?param=value&param2=value2&`,
        ampersandReplacement
      )
    ).toBe(
      `Some text with ${ampersandReplacement} and then https://example.com?param=value&param2=value2&`
    );
  });
});

// trimContent
describe("trimContent", () => {
  test("trims content to 15 characters and does not break words", () => {
    expect(trimContent("This is some longer text", 15)).toBe(
      "This is some […]"
    );
  });
});

// replaceResponseTo
describe("replaceResponseTo", () => {
  test('replaces "R to @marv: " with ""', () => {
    expect(replaceResponseTo("R to @marv: ")).toBe("");
  });

  test('replaces "R to @marv: " with "" on the beginning of the text', () => {
    expect(replaceResponseTo("R to @marv: some text")).toBe("some text");
  });

  test('does not replace "R to @marv: " further in the text', () => {
    expect(
      replaceResponseTo(
        "There is some text and then there is R to @marv: and some more text"
      )
    ).toBe(
      "There is some text and then there is R to @marv: and some more text"
    );
  });
});

// replaceReposted
describe("replaceReposted", () => {
  const repostSentence = "📤🐦🟦";

  test(`replaces "RT @marv: " with "@nemarv ${repostSentence} @marv: "`, () => {
    expect(
      replaceReposted("RT @marv: ", "@nemarv", "@marv", repostSentence)
    ).toBe(`@nemarv ${repostSentence} @marv:\n`);
  });

  test(`replaces "RT @marv: " with "@nemarv ${repostSentence} @marv: " on the beginning of the text`, () => {
    expect(
      replaceReposted("RT @marv: some text", "@nemarv", "@marv", repostSentence)
    ).toBe(`@nemarv ${repostSentence} @marv:\nsome text`);
  });

  test('does not replace "RT @marv: " in the middle of text', () => {
    expect(
      replaceReposted(
        "There is some text and then there is RT @marv: and some more text",
        "@nemarv",
        "@marv",
        repostSentence
      )
    ).toBe("There is some text and then there is RT @marv: and some more text");
  });
});

describe("trimImageUrl", () => {
  test('trims image not to have "==" on end', () => {
    expect(trimImageUrl("https://nitter.cz/image.jpg==")).toBe(
      "https://nitter.cz/image.jpg"
    );
  });
});

// replaceUserNames
describe("replaceUserNames", () => {
  const postInstance = "nitter.cz";

  test(`replaces "@marv" with "@marv@${postInstance}"`, () => {
    expect(replaceUserNames("@marv", "@nemarv", postInstance)).toBe(
      `@marv@${postInstance}`
    );
  });

  test(`does not replace "@marv" if "@marv" is an author`, () => {
    expect(replaceUserNames("@marv", "@marv", postInstance)).toBe("@marv");
  });

  test(`replaces "@marv" with "@marv@${postInstance}" further in the text`, () => {
    expect(
      replaceUserNames(
        "There is some text and then there is @marv and some more text",
        "@nemarv",
        postInstance
      )
    ).toBe(
      `There is some text and then there is @marv@${postInstance} and some more text`
    );
  });

  test('does not replace "@marv" further in the text if "@marv" is an author', () => {
    expect(
      replaceUserNames(
        "There is some text and then there is @marv and some more text",
        "@marv",
        postInstance
      )
    ).toBe("There is some text and then there is @marv and some more text");
  });

  test("replaces multiple user names with appropriate links", () => {
    expect(
      replaceUserNames(
        "There is some text and then there is @marv and @nemarv and some more text",
        "@someonelse",
        postInstance
      )
    ).toBe(
      `There is some text and then there is @marv@${postInstance} and @nemarv@${postInstance} and some more text`
    );
  });

  test("does not replace email addresses", () => {
    expect(
      replaceUserNames(
        "There is some text and then there is email@address.com and some more text",
        "@nemarv",
        postInstance
      )
    ).toBe(
      "There is some text and then there is email@address.com and some more text"
    );
  });
});
