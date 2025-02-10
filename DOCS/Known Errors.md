# Known errors

## Current errors

---

## Errors putted on hold

---

## Already solved errors

### Fix-2024-07: Empty spaces in EntryContent
Sometimes post contains several or many empty spaces at the end of EntryContent followed by […]. Empty spaces could be also in front of the URL.
example: https://zpravobot.news/@Pocketlint/111855317689168502

### Fix-2024-03: BlueSky quotes
Quotes from BlueSky don't show the proper author of the original post (BSky poskytuje oficiální RSS, které quoty spíše nepodporuje. Ošetřeno.)

### Fix-2024-04: Nitter quotes - Ignored as Nitter is no more in scope of this project
Quotes from Nitter don't show a snippet of the original post
(podmínka pokud je v contentu URL obsahující twitter/nitter, nahradit post URL tímto URL?)
> Příklad hodnot:
> * EntryUrl: https://nitter.cz/JakubSzanto/status/1755532277436580328#m
> * EntryPublished: February 08, 2024 at 11:01AM
> * FeedTitle: Jakub Szántó / @JakubSzanto
> * EntryAuthor: @JakubSzanto
> * EntryContent: `<p>🙏🏽</p> <p><a href="https://nitter.cz/Torchcz/status/1736172268969926969#m">nitter.cz/Torchcz/status/1736172268969926969#m</a></p>`
> * EntryImageUrl: https://ifttt.com/images/no_image_card.png
> * EntryTitle: 🙏🏽
> * FeedUrl: https://nitter.cz/JakubSzanto

### Fix-2024-06: Twitter replies and quotes
Replies and quotes from Twitter don't work. As they previously worked, DS probably caused it when the universal script was composed, and some functions weren't included in the Twitter branch. We have to compare the current script with the historical one. This fix has low priority as Twitter isn't currently used at Zpravobot.news.

### Fix-2024-08: Text post only also contains URL to original post
If post contains only simple text without any URL or added picture, it doesn't make sense to show there also link to the original post. User can comment it in original location when will use way Avatar-link to original profile-post.
(pokud zpracovavany post neobsahuje URL ani link na obrazek, URL na originalni post se nezobrazi podobne jako v pripade, kdy post obsahuje URL)

### Fix-2024-02: Ampersands in URLs
Even though this problem was solved, it returns - at minimum in image URLs.
(Problém identifikován: v URL obrázku je místo znaku & řetězec `&amp;`. Asi by stačilo tento řetězec v URL nahradit řetězcem `%26`)

### Fix-2024-01: trimContentEndEllipsis()
Function trimContentEndEllipsis() does not work at this moment.

### Fix-2024-05: isCommercialInPost()
Function isCommercialInPost() works fine for Nitter, but not for RSS. Need to rewrite.
(musíme to vymyslet jinak - možná getContent a změna proměnné?!, potom isCommerciaInPost?)

### Millions of old bugs before the repo was started...d8-D

(2024-02-15)
