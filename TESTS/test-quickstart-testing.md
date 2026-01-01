# Quick Start Guide - IFTTT Filter Testing

## 🚀 Pro otestování v4.0.0 (nebo jakékoliv verze)

### Krok 1: Stáhněte soubory
```bash
# Z Claude artifacts nebo z vašeho projektu:
# - universal-test-runner.js
# - example-ifttt-filter-x-xcom-4_0_0.js (váš filter script)
# - complete-test-suite-4_0_0.js (nebo .ts verze)
```

### Krok 2: Zkompilujte test suite (pokud máte .ts)
```bash
# Varianta A: TypeScript kompilace
npm install -g typescript@2.9.2
tsc --target ES5 --module commonjs --skipLibCheck complete-test-suite-4_0_0.ts

# Varianta B: Použijte předkompilovanou .js verzi
# (complete-test-suite-4_0_0.js je již připravená)
```

### Krok 3: Spusťte testy
```bash
node universal-test-runner.js example-ifttt-filter-x-xcom-4_0_0.js complete-test-suite-4_0_0.js
```

### Krok 4: Prohlédněte výsledky
```bash
# Konzole zobrazí souhrn
# Detaily v test-results-[timestamp].json
cat test-results-*.json | jq .
```

## 📊 Aktuální stav v4.0.0

### ✅ Celkové výsledky: 141/141 (100% PASS)

| Kategorie | Počet | Status |
|-----------|-------|--------|
| **Baseline testy** | 23 | ✅ 23/23 |
| **v4.0.0 nové funkce** | 118 | ✅ 118/118 |

### 🎯 Kritické testované oblasti:

- ✅ URL_REPLACE_FROM jako string[] (BREAKING CHANGE)
- ✅ Unified FilterRule s 'content' (nahrazuje 'keywords')
- ✅ TCO_REPLACEMENT s deduplikací
- ✅ PREFIX_SELF_REFERENCE pro self-quotes/reposts
- ✅ COMBINE_TITLE_AND_CONTENT s CONTENT_TITLE_SEPARATOR
- ✅ Pre-compiled CHAR_MAP_REGEX (100x rychlejší)
- ✅ safeTruncate s Unicode/emoji podporou
- ✅ RSS_MAX_INPUT_CHARS truncation
- ✅ URL/Prefix/Placeholder deduplikace
- ✅ Real-world scénáře (ČT24, Deník N, HN)

## 🎯 Pro testování nové verze

### Rychlý workflow:

```bash
# 1. Připravte filter script (musí exportovat MastodonFilter funkci)
# Script je automaticky načten test runnerem

# 2. Spusťte testy
node universal-test-runner.js your-filter-script.js complete-test-suite-4_0_0.js

# 3. Zkontrolujte výsledky
cat test-results-*.json | jq '{total, passed, failed, successRate}'
```

## 🔍 Debug failed tests

```bash
# Zobrazit jen selhané testy
cat test-results-*.json | jq '.failures[] | {id, category, description}'

# Filtrovat podle kategorie
cat test-results-*.json | jq '.failures[] | select(.category | contains("v4.0.0"))'

# Zobrazit expected vs got
cat test-results-*.json | jq '.failures[] | {id, expected, got}'

# Exportovat do CSV
cat test-results-*.json | jq -r '.failures[] | [.id,.category,.description] | @csv' > failures.csv
```

## 📦 Struktura test suite v4.0.0

### Baseline (23 testů):
- Basic Tweets (4)
- URLs (4)
- Reposts & Quotes (5)
- HTML Entities (6)
- Filtering (4)

### v4.0.0 nové funkce (118 testů):
| Skupina | Kategorie | Počet |
|---------|-----------|-------|
| A | URL_REPLACE_FROM Array | 4 |
| B | Unified FilterRule | 8 |
| C | TCO_REPLACEMENT | 6 |
| D | PREFIX_SELF_REFERENCE | 4 |
| E | COMBINE_TITLE_AND_CONTENT | 5 |
| F | CHAR_MAP_REGEX | 5 |
| G | safeTruncate Unicode | 4 |
| H | RSS_MAX_INPUT_CHARS | 3 |
| I | Deduplication | 5 |
| J | Platform Configs | 4 |
| K | URL_DOMAIN_FIXES | 5 |
| L | RSS RT Normalization | 3 |
| M | Edge Cases | 10 |
| N | URL Whitespace | 7 |
| O | URL Edge Cases | 7 |
| P | Anchor Text | 8 |
| Q | Advanced Dedup | 8 |
| R | Real-World | 6 |
| S | FilterRule Logic | 8 |
| T | Edge Cases Empty | 8 |

## ⚡ Pro rychlé ověření

```bash
# Spusťte kompletní test suite
node universal-test-runner.js example-ifttt-filter-x-xcom-4_0_0.js complete-test-suite-4_0_0.js

# Očekávaný výstup:
# ================================================================================
# VÝSLEDKY TESTOVÁNÍ
# ================================================================================
# ✓ Úspěšné:   141/141
# ✗ Neúspěšné: 0/141
# 📊 Úspěšnost: 100.00%
# ================================================================================
```

## 📝 Poznámky k v4.0.0

### Breaking changes:
1. **URL_REPLACE_FROM** - Nyní string[] místo string
2. **FilterRule** - Používá 'content' místo 'keywords'
3. **CHAR_MAP_REGEX** - Pre-compiled pro 100x rychlejší processing

### Klíčové poznatky z testování:
- **FORCE_SHOW_ORIGIN_POSTURL: true** přidává origin URL ke všem výstupům
- **Mention formatting** vždy převádí `@user` na `https://x.com/user`
- **TweetEmbedCode** má prioritu nad Text fieldem
- **POST_LENGTH: 444** je výchozí pro RSS (ne 500)

## 🆘 Potřebujete pomoct?

1. Zkontrolujte `test-infrastructure-readme.md` pro detailní dokumentaci
2. Prohlédněte JSON výsledky pro specifické chyby
3. Ověřte že používáte správné verze (TypeScript 2.9.2, ES5 target)
4. Zkontrolujte `TEST-REPORT-v4.0.0.md` pro kompletní přehled

---

**Tip:** Vytvořte si alias pro rychlé testování:
```bash
alias test-ifttt="node /path/to/universal-test-runner.js"
test-ifttt my-filter.js complete-test-suite-4_0_0.js
```

---

**Aktualizováno:** 2026-01-01  
**Verze test suite:** v4.0.0  
**Celkem testů:** 141