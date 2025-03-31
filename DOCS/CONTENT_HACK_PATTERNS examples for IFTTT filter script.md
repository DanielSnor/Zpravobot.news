# Settings for IFTTT filter script

This document is focused on providing several examples of CONTENT_HACK_PATTERNS settings possibilities for the IFTTT filter script. 

These patterns give you a really powerful tool for operating on/modifying the text of subsequent posts, as you can use regular expressions.

---

## Basic Information
Filter scripts in IFTTT are run as "scrips in script over script," so you have to be very careful when using special characters and often manage them with escape characters.  

The whole Settings for the final script are available in the ./SETTINGS/, but here we will focus only on setting patterns which look like the following lines:

```
CONTENT_HACK_PATTERNS: [ // content hack - content manipulation function
  // { pattern: "(?<!https?:\/\/)(example\.com\/)", replacement: "https:\/\/example\.com\/", flags: "gi" }, // hack for URLs without protocol
  // { pattern: "(ZZZZZ[^>]+KKKKK)", replacement: "", flags: "gim" }, // replaces parts of the string between ZZZZZ and KKKKK including them with an empty string.
  // { pattern: "what", replacement: "by_what", flags: "gi" }, // replaces pattern "what" by replacement "by_what" with flags 
],
```

---

## Settings options

### CONTENT_HACK_PATTERNS - array of objects
This setting allows you to manipulate content by replacing or removing specific patterns. Each object in the array should contain `pattern`, `replacement`, and optionally `flags`.

Example:
```
CONTENT_HACK_PATTERNS: [
  // { pattern: "(?<!https?:\/\/)(example\.com\/)", replacement: "https:\/\/example\.com\/", flags: "g" }, // hack for URLs without protocol
  { pattern: "(ZZZZZ[^>]+KKKKK)", replacement: "", flags: "gi" },
  { pattern: "what", replacement: "by_what", flags: "gi" }
]
```
Your patterns has to stay between brackets chars. Every pattern, replacement and flags needs to be between quotation marks divided by comma; more patterns needs to be divided by comma too. Patterns should be regular expressions.

## Useful examples for use with CONTENT_HACK_PATTERNS
These options will show you how it could be used for several different purposes of content modification to reach the best result.

### Simple removement or replacement

Example:
```
  { pattern: "what", replacement: "by_what", flags: "gi" }
```
or
```
  { pattern: "(from[^>]+tilthis)", replacement: "", flags: "gi" },
```


TBD

---

## That’s all, folks
That’s all, folks. I hope the explanation clarifies the configuration possibilities for modifying the output and everything is crystal clear now. Otherwise, you can still contact me via social networks or the About.me page.

(April Fool's Day 2025)
