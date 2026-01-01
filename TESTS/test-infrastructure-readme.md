# IFTTT Filter Test Infrastructure v2.0.0

## 📋 Přehled

Robustní testovací infrastruktura pro IFTTT webhook filter skripty umožňující opakované testování všech verzí. Aktuálně podporuje v4.0.0 se 141 testy a 100% úspěšností.

## 📦 Komponenty

### 1. **Universal Test Runner** (`universal-test-runner.js`)
- Univerzální runner pro spouštění testů
- Podporuje libovolnou verzi filter scriptu
- Automatické group testing podle kategorií
- JSON export výsledků
- Vizuální progress s emoji
- **Použití:**
  ```bash
  node universal-test-runner.js <filter-script.js> <test-suite.js>
  ```

### 2. **Test Suite v4.0.0** (`complete-test-suite-4_0_0.ts` / `.js`)
- **141 testů** pokrývajících baseline i v4.0.0 funkce
- 23 baseline testů (zděděné z v3.x)
- 118 testů pro nové/změněné funkce v4.0.0
- Kategorizované do 25 skupin (A-T + baseline)
- Připraveno pro TypeScript i JavaScript

### 3. **Test Report** (`TEST-REPORT-v4.0.0.md`)
- Kompletní přehled výsledků testování
- Breakdown podle kategorií
- Dokumentace klíčových poznatků

## 🚀 Rychlý start

### Krok 1: Spusťte testy

```bash
# Nejjednodušší - použijte předkompilované soubory
node universal-test-runner.js example-ifttt-filter-x-xcom-4_0_0.js complete-test-suite-4_0_0.js
```

### Krok 2 (volitelné): Kompilace z TypeScript

```bash
# Pokud chcete kompilovat z .ts
tsc --target ES5 --module commonjs --skipLibCheck complete-test-suite-4_0_0.ts
```

## 📊 Výstup testování

### Konzole output:
```
================================================================================
UNIVERSAL IFTTT FILTER TEST RUNNER v1.0.0
================================================================================

Filter script: example-ifttt-filter-x-xcom-4_0_0.js
Test suite:    complete-test-suite-4_0_0.js

✓ Soubory načteny
✓ Filter funkce načtena
✓ Test suite načtena: 141 testů

================================================================================
SPOUŠTÍM TESTY
================================================================================

📦 Baseline - Basic Tweets (4 testů)
────────────────────────────────────────────────────────────────────────────────
✓✓✓✓ 4/4 passed

📦 v4.0.0 - URL_REPLACE_FROM Array (4 testů)
────────────────────────────────────────────────────────────────────────────────
✓✓✓✓ 4/4 passed

...

================================================================================
VÝSLEDKY TESTOVÁNÍ
================================================================================
✓ Úspěšné:   141/141
✗ Neúspěšné: 0/141
📊 Úspěšnost: 100.00%
================================================================================

📄 Výsledky uloženy do: test-results-1767281417666.json
```

### JSON output:
Výsledky se automaticky ukládají do `test-results-[timestamp].json`:

```json
{
  "timestamp": "2026-01-01T12:30:17.666Z",
  "filterScript": "example-ifttt-filter-x-xcom-4_0_0.js",
  "testSuite": "complete-test-suite-4_0_0.js",
  "total": 141,
  "passed": 141,
  "failed": 0,
  "successRate": "100.00%",
  "failures": []
}
```

## 📝 Struktura testů v4.0.0

### Baseline kategorie (23 testů):
| Kategorie | Počet | Popis |
|-----------|-------|-------|
| Basic Tweets | 4 | Základní tweety |
| URLs | 4 | Zpracování URL |
| Reposts & Quotes | 5 | Retweety a citace |
| HTML Entities | 6 | HTML entity dekódování |
| Filtering | 4 | Filtrování obsahu |

### v4.0.0 kategorie (118 testů):
| Skupina | Kategorie | Počet | Popis |
|---------|-----------|-------|-------|
| A | URL_REPLACE_FROM Array | 4 | Breaking change - pole URL |
| B | Unified FilterRule | 8 | 'content' nahrazuje 'keywords' |
| C | TCO_REPLACEMENT | 6 | t.co URL nahrazení |
| D | PREFIX_SELF_REFERENCE | 4 | Self-quote/repost prefix |
| E | COMBINE_TITLE_AND_CONTENT | 5 | Kombinace title + content |
| F | CHAR_MAP_REGEX | 5 | Pre-compiled regex (100x faster) |
| G | safeTruncate Unicode | 4 | Unicode/emoji truncation |
| H | RSS_MAX_INPUT_CHARS | 3 | RSS input truncation |
| I | Deduplication | 5 | URL deduplikace |
| J | Platform Configs | 4 | Twitter/Bluesky/RSS/YouTube |
| K | URL_DOMAIN_FIXES | 5 | Domain prefix fixing |
| L | RSS RT Normalization | 3 | Duplicate RT prefix |
| M | Edge Cases | 10 | Hraniční případy |
| N | URL Whitespace | 7 | Whitespace v URL |
| O | URL Edge Cases | 7 | URL hraniční případy |
| P | Anchor Text | 8 | RSS anchor text extraction |
| Q | Advanced Dedup | 8 | Pokročilá deduplikace |
| R | Real-World | 6 | Produkční scénáře (ČT24, HN) |
| S | FilterRule Logic | 8 | Regex, AND/OR logika |
| T | Edge Cases Empty | 8 | Prázdný obsah |

## 🔧 Testování nové verze

### Pro novou verzi (např. v4.1.0):

1. **Připravte filter script:**
   - Script musí exportovat `MastodonFilter` funkci
   - Nebo být ve wrapped formátu

2. **Přidejte nové testy** (pokud jsou nové funkce):
   ```typescript
   const V4_1_NEW_FEATURE: TestCase[] = [
       {
           id: "V410-NEW-001",
           category: "v4.1.0 - New Feature",
           description: "Test new functionality",
           priority: "HIGH",
           input: { ... },
           expected: { output: "...", shouldSkip: false },
           settings: { ... }
       }
   ];
   ```

3. **Spusťte regression testy:**
   ```bash
   node universal-test-runner.js new-filter.js complete-test-suite-4_0_0.js
   ```

4. **Ověřte 100% pass rate**

## ⚠️ Známé problémy a řešení

### Problem 1: "MastodonFilter is not defined"
**Řešení:** Filter script musí definovat globální funkci `MastodonFilter`

### Problem 2: Type errors při kompilaci
**Řešení:** Použijte `--skipLibCheck` flag:
```bash
tsc --target ES5 --module commonjs --skipLibCheck your-file.ts
```

### Problem 3: Nesprávné expected values
**Řešení:** Spusťte filter manuálně a porovnejte výstup:
```javascript
const result = MastodonFilter(input.TweetEmbedCode, input.Text, ...);
console.log(result);
```

### Problem 4: Unicode/emoji problémy
**Řešení:** Ověřte UTF-8 encoding souborů a použijte safeTruncate

## 📚 Příklady použití

### Testování konkrétní kategorie:
```javascript
// V test runneru přidejte filter:
const categoriesToTest = ['v4.0.0 - URL_REPLACE_FROM Array'];
const filteredTests = allTests.filter(t => categoriesToTest.includes(t.category));
```

### Testování pouze HIGH priority testů:
```javascript
const highPriorityTests = allTests.filter(t => t.priority === 'HIGH');
```

### Export do CI/CD:
```bash
#!/bin/bash
node universal-test-runner.js filter.js tests.js

# Zkontrolujte exit code
if [ $? -ne 0 ]; then
    echo "Tests failed!"
    exit 1
fi

# Nebo parsujte JSON výsledky
FAILED=$(cat test-results-*.json | jq '.failed')
if [ "$FAILED" -gt 0 ]; then
    echo "❌ $FAILED tests failed"
    exit 1
fi
echo "✅ All tests passed"
```

### Porovnání verzí:
```bash
# Spusťte testy pro obě verze
node universal-test-runner.js filter-v3.js tests.js
mv test-results-*.json results-v3.json

node universal-test-runner.js filter-v4.js tests.js
mv test-results-*.json results-v4.json

# Porovnejte
diff <(jq '.failures[].id' results-v3.json) <(jq '.failures[].id' results-v4.json)
```

## 🎯 Best Practices

1. **Vždy spusťte regression testy** před release nové verze
2. **Udržujte test suite aktuální** - přidávejte testy pro nové funkce
3. **Dokumentujte očekávané chování** v test descriptions
4. **Používejte priority levels** (HIGH/MEDIUM/LOW) pro kritické testy
5. **Ukládejte test results** pro porovnání mezi verzemi
6. **Testujte real-world scénáře** - přidejte testy z produkčních dat

## 📖 Dokumentace test formátu

### Test structure:
```typescript
interface TestCase {
    id: string;                    // Unikátní ID (např. "V400-A001")
    category: string;              // Kategorie testu
    description: string;           // Popis co test dělá
    priority: "HIGH" | "MEDIUM" | "LOW";
    input: {
        TweetEmbedCode?: string;   // HTML embed (Twitter)
        Text?: string;             // Plain text
        LinkToTweet?: string;      // URL tweetu
        FirstLinkUrl?: string;     // První URL v tweetu
        UserName?: string;         // Username autora
        EntryContent?: string;     // RSS content
        EntryUrl?: string;         // RSS URL
        EntryTitle?: string;       // RSS title
        FeedTitle?: string;        // RSS feed name
    };
    expected: {
        output: string;            // Očekávaný výstup
        shouldSkip: boolean;       // Má se přeskočit?
    };
    settings: AppSettings;         // Konfigurace filtru
}
```

### Settings structure:
```typescript
interface AppSettings {
    PHRASES_BANNED: FilterRule[];
    PHRASES_REQUIRED: FilterRule[];
    REPOST_ALLOWED: boolean;
    AMPERSAND_SAFE_CHAR: string;
    CONTENT_REPLACEMENTS: ContentReplacement[];
    POST_LENGTH: number;
    POST_LENGTH_TRIM_STRATEGY: string;
    SMART_TOLERANCE_PERCENT: number;
    TCO_REPLACEMENT: string;
    FORCE_SHOW_FEEDURL: boolean;
    FORCE_SHOW_ORIGIN_POSTURL: boolean;
    SHOW_IMAGEURL: boolean;
    URL_DOMAIN_FIXES: string[];
    URL_NO_TRIM_DOMAINS: string[];
    URL_REPLACE_FROM: string[];    // v4.0.0: array!
    URL_REPLACE_TO: string;
    MENTION_FORMATTING: MentionConfig;
    PREFIX_IMAGE_URL: string;
    PREFIX_POST_URL: string;
    PREFIX_QUOTE: string;
    PREFIX_REPOST: string;
    PREFIX_SELF_REFERENCE: string;
    MOVE_URL_TO_END: boolean;
    POST_FROM: string;
    SHOW_REAL_NAME: boolean;
    SHOW_TITLE_AS_CONTENT: boolean;
    COMBINE_TITLE_AND_CONTENT: boolean;
    CONTENT_TITLE_SEPARATOR: string;
    RSS_MAX_INPUT_CHARS: number;
}
```

## 🗂️ Soubory v infrastruktuře

| Soubor | Popis |
|--------|-------|
| `universal-test-runner.js` | Test runner |
| `complete-test-suite-4_0_0.ts` | Test suite (TypeScript) |
| `complete-test-suite-4_0_0.js` | Test suite (JavaScript) |
| `TEST-REPORT-v4.0.0.md` | Kompletní test report |
| `quickstart-testing.md` | Rychlý průvodce |
| `test-infrastructure-readme.md` | Tato dokumentace |

## 🤝 Přispívání

Při přidávání nových testů:
1. Vytvořte novou kategorii nebo přidejte do existující
2. Použijte konzistentní ID schema (např. V410-X001, V410-X002...)
3. Přidejte popis a priority
4. Otestujte že nový test prochází
5. Aktualizujte dokumentaci

## 📞 Podpora

Pro otázky nebo problémy:
- Zkontrolujte sekci "Známé problémy"
- Prohlédněte test results JSON pro detaily
- Použijte manuální test pro debug

---

**Verze:** 2.0.0  
**Datum:** 2026-01-01  
**Test Suite:** v4.0.0 (141 testů)  
**Úspěšnost:** 100%  
**Autor:** Zprávobot.news Team