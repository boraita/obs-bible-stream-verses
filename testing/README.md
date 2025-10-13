# 🧪 Testing Suite# 🧪 Algorithm Consistency Testing



Automated tests for the OBS Bible Plugin to ensure algorithm consistency and proper configuration.This folder contains specific tools to test the consistency of the font adjustment algorithm with user-provided verses, as well as tests to verify Bible configuration and title construction.



## 📁 Test Files## 📁 Files



| File | Purpose | Runtime |- **`index.html`** - Web interface to run the tests

|------|---------|---------|- **`testDirect.js`** - Direct algorithm testing (main test suite)

| `testAlgorithm.js` | Algorithm consistency & differentiation testing | ~30s |- **`testAdvanced.js`** - Advanced testing with different text lengths

| `testBibleSelection.js` | Bible configuration & title construction | ~1s |- **`testBibleSelection.js`** - Bible selection and title construction test

- **`testFinal.js`** - Final dynamic behavior test with database

## 🚀 Quick Start- **`README.md`** - This documentation file



Run all tests:## 🚀 How to Use

```bash

node testing/testAlgorithm.js### Command Line Tests

node testing/testBibleSelection.js

```Run the main consistency test:

```bash

Quick test (faster):node testing/testDirect.js

```bash```

node testing/testAlgorithm.js --quick

```Run advanced differentiation test:

```bash

## 📖 Test Detailsnode testing/testAdvanced.js

```

### 1. Algorithm Test (`testAlgorithm.js`)

Run Bible selection test:

Tests the font sizing algorithm for:```bash

- **Consistency**: Same text always produces same font sizenode testing/testBibleSelection.js

- **Differentiation**: Different text lengths get appropriate sizes```

- **Range validation**: Font sizes stay within expected bounds

Run final integration test:

**Usage:**```bash

```bashnode testing/testFinal.js

node testing/testAlgorithm.js              # Standard (10 iterations)```

node testing/testAlgorithm.js --quick      # Quick (3 iterations)

node testing/testAlgorithm.js --verbose    # Detailed output### Web Interface Tests

```

1. **Start the development server:**

**Success criteria:**```bash

- ✅ 100% consistency rate across all versespnpm start

- ✅ Font sizes within expected ranges per text length```

- ✅ Exit code 0

2. **Open the testing page:**

**Sample output:**Navigate to: `http://localhost:8080/testing/`

```

🚀 ALGORITHM CONSISTENCY TEST SUITE3. **Run tests:**

════════════════════════════════════════════════════════════════════- Open developer tools (F12)

- Go to the Console tab

✅ ALL TESTS PASSED- Use the interface buttons or execute commands directly



Summary:## 🧪 Test Suites

- Total verses: 21

- Consistent: 21 (100.0%)### 1. `testDirect.js` - Main Consistency Test

- Success rate: 100.0%Tests algorithm consistency across multiple runs of the same verse.

```

**Features:**

### 2. Bible Selection Test (`testBibleSelection.js`)- Tests 21 common verses with 10 iterations each

- Verifies deterministic behavior

Validates Bible version configuration and title construction.- Measures execution time

- Provides detailed consistency reports

**What it tests:**

1. All Bibles are configured correctly**Exit codes:**

2. `name` and `displayName` properties exist- `0` - All tests passed (100% consistency)

3. BIBLE_MAP structure is valid- `1` - Some tests failed (inconsistencies detected)

4. Titles are constructed properly (e.g., "Juan 3:16 - NVI")

5. Compatibility with `sendMessage.js`### 2. `testAdvanced.js` - Differentiation Test

Verifies that the algorithm properly differentiates font sizes based on text length.

**Usage:**

```bash**Features:**

node testing/testBibleSelection.js- Tests texts of varying lengths (5 to 400+ characters)

```- Validates size ranges for each length category

- Checks consistency within each category

**Success criteria:**- Provides diagnosis of range issues

- ✅ All 6 Bible versions configured

- ✅ Title format: "Book Chapter:Verse - VERSION"### 3. `testBibleSelection.js` - Configuration Test

- ✅ All assertions passValidates Bible version configuration and title construction.



**Sample output:****Features:**

```- Verifies all Bibles are configured correctly

=== Bible Selection Test ===- Tests `name` and `displayName` properties

- Validates BIBLE_MAP structure

✅ Test 1 passed- Simulates title construction (e.g., "John 3:16 - NVI")

✅ Test 2 passed- Ensures compatibility with `sendMessage.js`

✅ Test 3 passed

✅ Test 4 passed### 4. `testFinal.js` - Integration Test

✅ Test 5 passedTests dynamic behavior with actual database queries.

✅ Test 6 passed

**Features:**

✅ ALL TESTS PASSED- Tests with real Bible database

```- Verifies no cache interference

- Tests verse repetition consistency

## 🔍 Understanding Results- Validates length-based differentiation



### Algorithm Test Results## 📋 Verse List



**Perfect (100% consistency):**The following 20 verses are configured for testing:

```

   ├─ Unique sizes: 45px1. Juan 3:16

   ├─ Consistency: ✅ PERFECT2. Salmos 23:1

   └─ Variations: None3. Romanos 8:28

```4. Filipenses 4:13

5. Proverbios 3:5-6

**Problem detected:**6. Mateo 5:14

```7. Salmos 119:105

   ├─ Unique sizes: 43, 44, 45px8. Isaías 40:31

   ├─ Consistency: ❌ INCONSISTENT9. Efesios 2:8-9

   └─ Variations: 3 different10. 1 Corintios 13:4-7

```11. Salmos 46:1

12. Gálatas 5:22-23

### Common Issues13. 2 Timoteo 1:7

14. Hebreos 11:1

| Issue | Cause | Solution |15. Salmos 37:4

|-------|-------|----------|16. Mateo 6:33

| Inconsistent sizes | Non-deterministic factors | Clear memory before each calculation |17. 1 Pedro 5:7

| Wrong size ranges | Character thresholds incorrect | Adjust min/max size per range |18. Salmos 121:1-2

| All same size | Not differentiating by length | Review range configuration |19. Romanos 12:2

20. Colosenses 3:2

## 🎯 Success Criteria

## 🔍 Interpreting Results

Both tests must pass:

1. ✅ Algorithm test: 100% consistency, appropriate differentiation### ✅ Perfect Consistency

2. ✅ Bible test: All 6 versions configured, titles formatted correctly- All calculations return the same font size

- Indicates that the algorithm is stable and reliable

## 📊 Test Data

### ❌ Inconsistencies

**Algorithm test uses 21 verses:**- Different sizes across multiple runs of the same text

- Juan 3:16, Salmos 23:1, Romanos 8:28, Filipenses 4:13, Proverbios 3:5-6- Indicates that the algorithm needs adjustments

- Mateo 5:14, Salmos 119:105, Isaías 40:31, Efesios 2:8-9, 1 Corintios 13:4-7

- Salmos 46:1, Gálatas 5:22-23, 2 Timoteo 1:7, Hebreos 11:1, Salmos 37:4## 🛠️ Algorithm Corrections

- Mateo 6:33, 1 Pedro 5:7, Salmos 121:1-2, Romanos 12:2, Colosenses 3:2, Ester 8:9

If inconsistencies are detected, the algorithm in `src/core/browser_app.js` should be adjusted to:

**Differentiation test uses 4 text lengths:**

- Short (5 chars): Expected 70-90px1. **Improve determinism** - Remove random factors

- Medium (26 chars): Expected 40-60px  2. **Optimize contextual memory** - Ensure memory doesn't cause variations

- Long (144 chars): Expected 20-35px3. **Refine bidirectional search** - Guarantee it always finds the same optimal result

- Very long (397 chars): Expected 12-20px

## 📊 Quick Start

**Bible test validates 6 versions:**

- KDSH (Kadosh), LBLA (La Biblia de las Américas), NVI (Nueva Versión Internacional)```bash

- NTV (Nueva Traducción Viviente), BTX (Biblia Textual), RVR60 (Reina Valera 1960)# Run all tests in sequence

node testing/testDirect.js && \

## 🔧 Maintenancenode testing/testAdvanced.js && \

node testing/testBibleSelection.js

### Adding New Test Verses

# Run with npm scripts (recommended)

Edit `testAlgorithm.js`:pnpm test:consistency    # Run main consistency test

```javascriptpnpm test:advanced       # Run advanced differentiation test

const testVerses = [pnpm test:config         # Run configuration test

  "Juan 3:16",```

  "Your New Verse",  // Add here

  // ...## 🎯 Goal

];

```The goal is to achieve **100% consistency** across all verses, where each verse always produces exactly the same font size across multiple runs, while also properly differentiating sizes based on text length.



### Adding New Bible Versions## 📚 Bible Selection Test



1. Add to `src/config/bibleConfig.js`The `testBibleSelection.js` file verifies the correct configuration and selection of Bible versions.

2. Run `node testing/testBibleSelection.js` to verify

### Run the test

## 📝 Notes```bash

node testing/testBibleSelection.js

- Tests run in Node.js without browser requirement```

- No database connection needed for algorithm test

- Bible test uses ES modules (requires Node.js 14+)### What this test verifies

- Both tests provide clear exit codes for CI/CD integration

1. **Available Bible list** - Verifies that all Bibles are configured
2. **Display names** - Checks that each Bible has its `displayName` and `fullName`
3. **BIBLE_MAP structure** - Validates that the Bible map contains `name` and `loader`
4. **Title construction** - Simulates the creation of verse titles with the version
5. **"name" property** - Verifies that each Bible has its `name` property correctly configured
6. **sendMessage.js compatibility** - Ensures the code is compatible with the current implementation

### Expected result

```
✅ ALL TESTS PASSED

Summary:
- 6 Bibles available
- All Bibles have "name" property configured
- Titles are correctly constructed using name.toUpperCase()
- Compatibility with sendMessage.js verified
```

### Generated title example

When you select a verse, the title should be displayed like this:
- `Juan 3:16 - NVI`
- `Salmos 23:1 - KADOSH`
- `Génesis 1:1 - RVR60`
