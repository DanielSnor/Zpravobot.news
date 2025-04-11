# CONTENT_HACK_PATTERNS examples for IFTTT filter script

This document provides several examples of the possibility of CONTENT_HACK_PATTERNS settings for the IFTTT filter script. 

These patterns give you a potent tool for operating on/modifying the text of subsequent posts, as you can use regular expressions.

---

## Basic Information
Filter scripts in IFTTT are run as "scrips in script over the script," so you have to be very careful when using special characters and often manage them with escape characters.  

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
Your patterns have to stay between brackets chars. Every pattern, replacement, and flag must be between quotation marks and divided by a comma; more patterns must be divided by a comma, too. Patterns should be regular expressions.

## Useful examples for use with CONTENT_HACK_PATTERNS
These options will show you how it could be used for several different purposes of content modification to reach the best result.

### Box - text in box brackets

Example:
```
{ pattern: "(\\[[^>]+\\])", replacement: "", flags: "gim" },
```
Box brackets are considered as a special char, so you have to escape them with the backslash chars (it will search the whole content, is case insensitive and works multiline)

### One paragraph

Example:
```
{ pattern: "(^.*?\n).*", replacement: "$1", flags: "gim" }
```
will show only the first paragraph until \n char will be found in proceeded text.

Example:
```
{ pattern: "\\n\\n[\\s\\S]*$", replacement: "", flags: "gms" }
```
will remove all the text behind the first paragraph (works globally, multiline and uses . as a sign for the new line => new paragraph)

### Simple replacement or delete

Example:
```
  { pattern: "what", replacement: "by_what", flags: "gi" }
```
for replacing the word "what" with the string "by_what" (it will search the whole content and is case insensitive) 

or
```
  { pattern: "(from[^>]+til_this)", replacement: "", flags: "gim" },
```
for deleting longer text starting with "from" and continuing til the string "til_this" (it will search the whole content, is case insensitive and works multiline)

### URL hack

Example:
```
{ pattern: "(?<!https?:\/\/)(example\.com\/)", replacement: "https:\/\/example\.com\/", flags: "gi" },
```
will search for the string "example.com" without http or https protocol and replace it with "https://example.com" (it will search the whole content and is case insensitive)

### TBC - as soon as I will have more examples available

---

## That’s all, folks
That’s all, folks. I hope the explanation clarifies the configuration possibilities for modifying the output and everything is crystal clear now. Otherwise, you can still contact me via social networks or the About.me page.

(April Fool's Day 2025)
