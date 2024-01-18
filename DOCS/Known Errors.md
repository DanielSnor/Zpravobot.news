# Known errors

## Current errors

### Fix-2024-01: trimContentEndEllipsis()
Function trimContentEndEllipsis() does not work at this moment.

### Fix-2024-02: Ampersands in URLs
Even though this problem was solved, it returns - at minimum in image URLs.

### Fix-2024-03: BlueSky quotes
Quotes from BlueSky don't show the proper author of the original post

### Fix-2024-04: Nitter quotes
Quotes from Nitter don't show a snippet of the original post
(podmínka pokud je v contentu URL obsahující twitter/nitter, nahradit post URL tímto URL?)

### Fix-2024-06: Twitter replies and quotes
Replies and quotes from Twitter don't work. As they previously worked, DS probably caused it when the universal script was composed, and some functions weren't included in the Twitter branch. We have to compare the current script with the historical one. This fix has low priority as Twitter isn't currently used at Zpravobot.news.

---

## Already solved errors

### Fix-2024-05: isCommercialInPost()
Function isCommercialInPost() works fine for Nitter, but not for RSS. Need to rewrite.
(musíme to vymyslet jinak - možná getContent a změna proměnné?!, potom isCommerciaInPost?)

Millions of old bugs before the repo was started...d8-D

(2024-01-17)
