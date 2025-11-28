# IFTTT Filter Test Infrastructure v1.0.0

## 📋 Přehled

Robustní testovací infrastruktura pro IFTTT webhook filter skripty umožňující opakované testování všech verzí.

## 📦 Komponenty

### 1. **Universal Test Runner** (`universal-test-runner.js`)
- Univerzální runner pro spouštění testů
- Podporuje libovolnou verzi filter scriptu
- Automatické group testing podle kategorií
- JSON export výsledků
- **Použití:**
  ```bash
  node universal-test-runner.js <filter-script.js> <test-suite.js>
  ```

### 2. **Test Suite** (`complete-test-suite-3_1_4-fixed.ts`)
- 204 testů pokrývajících všechny verze (v3.0.0 - v3.1.4)
- Opravené syntaktické chyby
- Kategorizované testy
- Připraveno pro TypeScript kompilaci

### 3. **Wrapped Filter Script** (`filter-script-wrapped.js`)
- Testovatelná verze filter scriptu
- Exportuje `MastodonFilter` funkci
- Kompatibilní s test runnerem

## 🚀 Rychlý start

### Krok 1: Příprava

```bash
# Zkompilujte filter script do testovatelné podoby
tsc --target ES5 --module commonjs your-filter-script.ts

# Nebo použijte wrapper creator
node create-wrapper.js
```

### Krok 2: Zkompilujte test suite

```bash
tsc --target ES5 --module commonjs --skipLibCheck complete-test-suite-3_1_4-fixed.ts
```

### Krok 3: Spusťte testy

```bash
node universal-test-runner.js filter-script-wrapped.js complete-test-suite-3_1_4-fixed.js
```

## 📊 Výstup testování

### Konzole output:
```
================================================================================
UNIVERSAL IFTTT FILTER TEST RUNNER v1.0.0
================================================================================

Filter script: filter-script-wrapped.js
Test suite:    complete-test-suite-3_1_4-fixed.js

✓ Soubory načteny
✓ Filter funkce načtena
✓ Test suite načtena: 204 testů

================================================================================
SPOUŠTÍM TESTY
================================================================================

📦 Basic Tweets (3 testů)
────────────────────────────────────────────────────────────────────────────────
✓✓✓ 3/3 passed

📦 URL Processing (5 testů)
────────────────────────────────────────────────────────────────────────────────
✓✓✓✓✓ 5/5 passed

...

================================================================================
VÝSLEDKY TESTOVÁNÍ
================================================================================
✓ Úspěšné:   XXX/204
✗ Neúspěšné: YYY/204
📊 Úspěšnost: ZZ.ZZ%
================================================================================
```

### JSON output:
Výsledky se automaticky ukládají do `test-results-[timestamp].json`:

```json
{
  "timestamp": "2025-11-25T11:33:53.182Z",
  "filterScript": "filter-script-wrapped.js",
  "testSuite": "complete-test-suite-3_1_4-fixed.js",
  "total": 204,
  "passed": XXX,
  "failed": YYY,
  "successRate": "ZZ.ZZ%",
  "failures": [...]
}
```

## 📝 Struktura testů

### Test kategorie:
- **Basic Tweets** (3 testy) - Základní tweety
- **URL Processing** (5 testů) - Zpracování URL
- **Media Handling** (3 testy) - Práce s médii
- **Retweet Processing** (5 testů) - Retweety
- **Quote Tweets** (6 testů) - Citované tweety
- **Content Filtering** (12 testů) - Filtrování obsahu
- **Content Trimming** (15 testů) - Zkracování obsahu
- **RSS Processing** (5 testů) - RSS feedy
- **Bluesky Platform** (3 testy) - Bluesky podpora
- **YouTube Platform** (2 testy) - YouTube podpora
- **v3.0.3 Features** (14 testů) - URL_DOMAIN_FIXES
- **v3.1.0 Features** (51 testů) - Unified filtering
- **v3.1.2 Features** (15 testů) - FORCE_SHOW fixes
- **v3.1.3 Features** (8 testů) - URL deduplication
- **v3.1.4 Features** (3 testy) - ES5 fix

## 🔧 Testování nové verze

### Pro novou verzi (např. v3.1.5):

1. **Vytvořte wrapped verzi:**
   ```bash
   node create-wrapper.js
   tsc --target ES5 --module commonjs filter-script-wrapped.ts
   ```

2. **Přidejte nové testy do test suite** (pokud jsou nové funkce)

3. **Spusťte regression testy:**
   ```bash
   node universal-test-runner.js filter-script-wrapped.js complete-test-suite-3_1_4-fixed.js
   ```

4. **Ověřte 100% pass rate pro critical testy**

## ⚠️ Známé problémy a řešení

### Problem 1: "e is not defined"
**Řešení:** Test runner obsahuje fix - `e: undefined` v sandbox

### Problem 2: Type errors při kompilaci
**Řešení:** Použijte `--skipLibCheck` flag:
```bash
tsc --target ES5 --module commonjs --skipLibCheck your-file.ts
```

### Problem 3: Multi-line stringy s uvozovkami
**Řešení:** Escapujte uvozovky nebo použijte template literals

### Problem 4: Twitter embed format
**Řešení:** Test runner automaticky zabalí TweetEmbedCode do `<p>` tagů pokud chybí

## 📚 Příklady použití

### Testování konkrétní kategorie:
```javascript
// Upravte universal-test-runner.js a přidejte filter:
const categoriesToTest = ['v3.1.4 URL_DOMAIN_FIXES'];
// ... filter testsByCategory
```

### Testování pouze HIGH priority testů:
```javascript
// Před spuštěním testů:
testCases = testCases.filter(t => t.priority === 'HIGH');
```

### Export do CI/CD:
```bash
node universal-test-runner.js filter.js tests.js > results.log
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
    echo "Tests failed!"
    exit 1
fi
```

## 🎯 Best Practices

1. **Vždy spusťte regression testy** před release nové verze
2. **Udržujte test suite aktuální** - přidávejte testy pro nové funkce
3. **Dokumentujte očekávané chování** v test descriptions
4. **Používejte priority levels** (HIGH/MEDIUM/LOW) pro kritické testy
5. **Ukládejte test results** pro porovnání mezi verzemi

## 📖 Dokumentace test formátu

### Test structure:
```typescript
{
    id: "test-id",
    category: "Test Category",
    description: "What this test does",
    priority: "HIGH" | "MEDIUM" | "LOW",
    input: {
        TweetEmbedCode: "<p>...</p>",  // HTML embed
        Text: "...",                    // Plain text
        LinkToTweet: "https://...",
        FirstLinkUrl: "...",
        UserName: "..."
    },
    expected: {
        output: "Expected output text",
        shouldSkip: false
    },
    settings: {
        // AppSettings configuration
        ...
    }
}
```

## 🤝 Přispívání

Při přidávání nových testů:
1. Vytvořte novou kategorii nebo přidejte do existující
2. Použijte konzistentní ID schema (např. V315-K1, V315-K2...)
3. Přidejte popis a priority
4. Otestujte že nový test prochází
5. Aktualizujte tuto dokumentaci

## 📞 Podpora

Pro otázky nebo problémy:
- Zkontrolujte sekci "Známé problémy"
- Prohlédněte test results JSON pro detaily
- Použijte verbose mode v test runneru

---

**Verze:** 1.0.0  
**Datum:** 2025-11-25  
**Autor:** Zprávobot.news Team  
**License:** Public Domain
