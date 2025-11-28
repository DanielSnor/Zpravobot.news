#!/usr/bin/env node
/**
 * Universal IFTTT Filter Test Runner
 * Version: 1.0.0
 * 
 * Runs complete test suite for any version of IFTTT filter script
 * 
 * Usage:
 *   node universal-test-runner.js <filter-script.js> <test-suite.js>
 * 
 * Example:
 *   node universal-test-runner.js filter-script-wrapped.js complete-test-suite-3_1_4-fixed.js
 */

const fs = require('fs');
const vm = require('vm');

// Parse command line arguments
const args = process.argv.slice(2);
const filterScriptPath = args[0] || './filter-script-wrapped.js';
const testSuitePath = args[1] || './complete-test-suite-3_1_4-fixed.js';

console.log('='.repeat(80));
console.log('UNIVERSAL IFTTT FILTER TEST RUNNER v1.0.0');
console.log('='.repeat(80));
console.log('');
console.log('Filter script: ' + filterScriptPath);
console.log('Test suite:    ' + testSuitePath);
console.log('');

// Check if files exist
if (!fs.existsSync(filterScriptPath)) {
    console.error('✗ CHYBA: Filter script nenalezen: ' + filterScriptPath);
    process.exit(1);
}

if (!fs.existsSync(testSuitePath)) {
    console.error('✗ CHYBA: Test suite nenalezena: ' + testSuitePath);
    process.exit(1);
}

// Read files
const filterJS = fs.readFileSync(filterScriptPath, 'utf8');
const testSuiteJS = fs.readFileSync(testSuitePath, 'utf8');

console.log('✓ Soubory načteny');
console.log('');

// Create sandbox for filter script
const filterSandbox = {
    console: {log: function() {}, error: function() {}},
    Twitter: {
        newTweetFromSearch: {
            TweetEmbedCode: '',
            Text: '',
            LinkToTweet: '',
            FirstLinkUrl: '',
            UserName: ''
        }
    },
    MakerWebhooks: {
        setEventName: function() {},
        setEventProperty: function() {},
        makeWebRequest: {
            skip: function(msg) { return ''; }
        }
    }
};

// Execute filter script
vm.createContext(filterSandbox);
try {
    vm.runInContext(filterJS, filterSandbox);
} catch (error) {
    console.error('✗ CHYBA při načítání filter scriptu:');
    console.error(error.message);
    process.exit(1);
}

const MastodonFilter = filterSandbox.MastodonFilter;

if (!MastodonFilter) {
    console.error('✗ CHYBA: MastodonFilter funkce nebyla nalezena v filter scriptu');
    console.error('   Ujistěte se, že používáte wrapped verzi skriptu.');
    process.exit(1);
}

console.log('✓ Filter funkce načtena');

// Create sandbox for test suite
const testSandbox = {
    console: console,
    module: { exports: {} },
    e: undefined  // Fix for undefined 'e' in test suite
};

// Execute test suite
vm.createContext(testSandbox);
try {
    vm.runInContext(testSuiteJS, testSandbox);
} catch (error) {
    console.error('✗ CHYBA při načítání test suite:');
    console.error(error.message);
    console.error('');
    console.error('Řádek:', error.stack.split('\\n')[1]);
    process.exit(1);
}

// Extract testCases from sandbox
const testCasesScript = new vm.Script('testCases');
let testCases;
try {
    testCases = testCasesScript.runInContext(testSandbox);
} catch (error) {
    console.error('✗ CHYBA: Nepodařilo se extrahovat testCases z test suite');
    console.error(error.message);
    process.exit(1);
}

if (!testCases || !Array.isArray(testCases)) {
    console.error('✗ CHYBA: testCases není pole');
    process.exit(1);
}

console.log('✓ Test suite načtena: ' + testCases.length + ' testů');
console.log('');

// Group tests by category
const testsByCategory = {};
testCases.forEach(test => {
    const category = test.category || 'Uncategorized';
    if (!testsByCategory[category]) {
        testsByCategory[category] = [];
    }
    testsByCategory[category].push(test);
});

console.log('='.repeat(80));
console.log('SPOUŠTÍM TESTY');
console.log('='.repeat(80));
console.log('');

let totalPassed = 0;
let totalFailed = 0;
let totalSkipped = 0;
const failures = [];
const categories = Object.keys(testsByCategory).sort();

// Run tests by category
categories.forEach(category => {
    const categoryTests = testsByCategory[category];
    console.log(`\n📦 ${category} (${categoryTests.length} testů)`);
    console.log('─'.repeat(80));
    
    let categoryPassed = 0;
    let categoryFailed = 0;
    
    categoryTests.forEach(test => {
        try {
            // Prepare input - handle both Twitter and RSS formats
            const input = test.input || {};
            
            // Merge test settings with defaults to prevent undefined errors
            const defaultSettings = {
                PHRASES_BANNED: [],
                PHRASES_REQUIRED: [],
                REPOST_ALLOWED: true,
                AMPERSAND_SAFE_CHAR: "⅋",
                CONTENT_REPLACEMENTS: [],
                POST_LENGTH: 444,
                POST_LENGTH_TRIM_STRATEGY: "smart",
                SMART_TOLERANCE_PERCENT: 12,
                URL_REPLACE_FROM: ["https://x.com/", "https://twitter.com/"],
                URL_REPLACE_TO: "https://x.com/",
                URL_NO_TRIM_DOMAINS: [],
                URL_DOMAIN_FIXES: [],
                FORCE_SHOW_ORIGIN_POSTURL: false,
                FORCE_SHOW_FEEDURL: false,
                SHOW_IMAGEURL: false,
                PREFIX_REPOST: " 𝕏📤 ",
                PREFIX_QUOTE: " 𝕏📝💬 ",
                PREFIX_IMAGE_URL: "",
                PREFIX_POST_URL: "\n",
                PREFIX_SELF_REFERENCE: "svůj post",
                MENTION_FORMATTING: { "TW": { type: "prefix", value: "https://x.com/" } },
                MOVE_URL_TO_END: false,
                POST_FROM: "TW",
                SHOW_REAL_NAME: true,
                SHOW_TITLE_AS_CONTENT: false,
                RSS_MAX_INPUT_CHARS: 1000
            };
            
            const mergedSettings = { ...defaultSettings, ...(test.settings || {}) };
            
            // For Twitter tests, wrap TweetEmbedCode in <p> if not already
            let tweetEmbedCode = input.TweetEmbedCode || '';
            if (tweetEmbedCode && !tweetEmbedCode.includes('<p>') && !tweetEmbedCode.includes('<blockquote')) {
                // Only wrap if it looks like plain text with anchor tags
                if (tweetEmbedCode.includes('<a href=')) {
                    tweetEmbedCode = '<p>' + tweetEmbedCode + '</p>';
                }
            }
            
            // Run the filter
            const result = MastodonFilter(
                tweetEmbedCode,
                input.Text || '',
                input.LinkToTweet || '',
                input.FirstLinkUrl || '',
                input.UserName || '',
                mergedSettings,
                input.EntryContent || '',
                input.EntryUrl || '',
                input.EntryTitle || '',
                input.FeedTitle || ''
            );
            
            // Check expected output
            const expected = test.expected || {};
            
            if (expected.shouldSkip) {
                // Test should be skipped
                if (result === '') {
                    categoryPassed++;
                    totalPassed++;
                    process.stdout.write('✓');
                } else {
                    categoryFailed++;
                    totalFailed++;
                    process.stdout.write('✗');
                    failures.push({
                        id: test.id,
                        category: category,
                        description: test.description,
                        expected: '[SKIP]',
                        got: result.substring(0, 100)
                    });
                }
            } else {
                // Test should produce output
                // Normalize for comparison (remove status= prefix if present)
                let normalizedResult = result.replace(/^status=/, '').trim();
                let normalizedExpected = (expected.output || '').replace(/^status=/, '').trim();
                
                if (normalizedResult === normalizedExpected) {
                    categoryPassed++;
                    totalPassed++;
                    process.stdout.write('✓');
                } else {
                    categoryFailed++;
                    totalFailed++;
                    process.stdout.write('✗');
                    failures.push({
                        id: test.id,
                        category: category,
                        description: test.description,
                        expected: normalizedExpected.substring(0, 150),
                        got: normalizedResult.substring(0, 150)
                    });
                }
            }
            
        } catch (error) {
            categoryFailed++;
            totalFailed++;
            process.stdout.write('E');
            failures.push({
                id: test.id,
                category: category,
                description: test.description,
                error: error.message
            });
        }
    });
    
    console.log(` ${categoryPassed}/${categoryTests.length} passed`);
});

// Print summary
console.log('\n\n' + '='.repeat(80));
console.log('VÝSLEDKY TESTOVÁNÍ');
console.log('='.repeat(80));
console.log(`✓ Úspěšné:   ${totalPassed}/${testCases.length}`);
console.log(`✗ Neúspěšné: ${totalFailed}/${testCases.length}`);
console.log(`📊 Úspěšnost: ${((totalPassed / testCases.length) * 100).toFixed(2)}%`);
console.log('='.repeat(80));

// Print failures if any (max 50)
if (failures.length > 0) {
    console.log('\n❌ SELHANÉ TESTY (prvních 50):');
    console.log('─'.repeat(80));
    
    failures.slice(0, 50).forEach((failure, index) => {
        console.log(`\n${index + 1}. ${failure.id} [${failure.category}]`);
        console.log(`   ${failure.description}`);
        if (failure.error) {
            console.log(`   ERROR: ${failure.error}`);
        } else {
            console.log(`   Expected: ${failure.expected}${failure.expected.length >= 150 ? '...' : ''}`);
            console.log(`   Got:      ${failure.got}${failure.got.length >= 150 ? '...' : ''}`);
        }
    });
    
    if (failures.length > 50) {
        console.log(`\n... a ${failures.length - 50} dalších selhání`);
    }
}

// Save results to file
const resultsFile = 'test-results-' + Date.now() + '.json';
const results = {
    timestamp: new Date().toISOString(),
    filterScript: filterScriptPath,
    testSuite: testSuitePath,
    total: testCases.length,
    passed: totalPassed,
    failed: totalFailed,
    successRate: (totalPassed / testCases.length * 100).toFixed(2) + '%',
    failures: failures
};

fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
console.log('\n📄 Výsledky uloženy do: ' + resultsFile);
console.log('');

// Exit with appropriate code
process.exit(totalFailed > 0 ? 1 : 0);
