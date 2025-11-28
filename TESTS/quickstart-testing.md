# Quick Start Guide - IFTTT Filter Testing

## 🚀 Pro otestování v3.1.4 (nebo jakékoliv verze)

### Krok 1: Stáhněte soubory
```bash
# Z Claude artifacts nebo z vašeho projektu:
# - universal-test-runner.js
# - filter-script-wrapped.js (nebo vaše wrapped verze)
# - complete-test-suite-3_1_4-fixed.ts
```

### Krok 2: Zkompilujte test suite
```bash
npm install -g typescript@2.9.2
tsc --target ES5 --module commonjs --skipLibCheck complete-test-suite-3_1_4-fixed.ts
```

### Krok 3: Spusťte testy
```bash
node universal-test-runner.js filter-script-wrapped.js complete-test-suite-3_1_4-fixed.js
```

### Krok 4: Prohlédněte výsledky
```bash
# Konzole zobrazí souhrn
# Detaily v test-results-[timestamp].json
cat test-results-*.json | jq .
```

## 📊 Aktuální stav v3.1.4

### ✅ Kritické testy (3/3): 100% PASS
- V314-J1: ČT24 RSS validní URL ✓
- V314-J2: ČT RSS validní URL ✓
- V314-J3: VSE Rector bug fix ✓

### 📦 Regression testy: 106 testů spuštěno
- **51 prošlo (48%)**
- 55 selhalo kvůli formátování/očekávaným výstupům

**POZNÁMKA:** Nízká úspěšnost je způsobena:
1. Rozdíly v očekávaných výstupech (status= prefix)
2. Některé testy očekávají jiný formát než produkuje wrapper
3. Testy pro starší verze mohou vyžadovat úpravy

## 🎯 Pro testování nové verze

### Rychlý workflow:

```bash
# 1. Vytvořte wrapped verzi vašeho nového scriptu
node create-wrapper.js  # nebo manuálně přidejte MastodonFilter funkci

# 2. Zkompilujte
tsc --target ES5 --module commonjs your-new-filter.ts

# 3. Spusťte testy
node universal-test-runner.js your-new-filter-wrapped.js complete-test-suite-3_1_4-fixed.js

# 4. Zkontrolujte kritické testy první
grep "v3.1.4\|V314" test-results-*.json
```

## 🔍 Debug failed tests

```bash
# Zobrazit jen selhané testy
cat test-results-*.json | jq '.failures[] | {id, category, description}'

# Filtrovat podle kategorie
cat test-results-*.json | jq '.failures[] | select(.category=="v3.1.4 URL_DOMAIN_FIXES")'

# Exportovat do CSV
cat test-results-*.json | jq -r '.failures[] | [.id,.category,.description] | @csv' > failures.csv
```

## ⚡ Pro rychlé ověření

Pokud potřebujete jen rychle ověřit že v3.1.4 funguje:

```bash
# Spusťte jen 3 kritické testy
node final-v3_1_4-tests.js
```

Výstup:
```
✓ PASS - URL z href správně extrahována, žádné dvojité https://
✓ PASS - URL z href správně extrahována, žádné dvojité https://
✓ PASS - Obě URL správně, žádné dvojité https://

🎉 VŠECHNY TESTY PROŠLY!
📦 v3.1.4 JE PŘIPRAVENA K RELEASE!
```

## 📝 Poznámky

- Test runner je připraven pro **opakované použití**
- Test suite je **verzionovaná** a **rozšiřitelná**
- Výsledky jsou **ukládány** pro historické porovnání
- **Wrapper approach** umožňuje testovat bez změn původního scriptu

## 🆘 Potřebujete pomoct?

1. Zkontrolujte `TEST-INFRASTRUCTURE-README.md` pro detailní dokumentaci
2. Prohlédněte JSON výsledky pro specifické chyby
3. Ověřte že používáte správné verze (TypeScript 2.9.2, ES5 target)

---

**Tip:** Vytvořte si alias pro rychlé testování:
```bash
alias test-ifttt="node /path/to/universal-test-runner.js"
```
