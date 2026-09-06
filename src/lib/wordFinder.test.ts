import { findWords, normalizeSearchInput, type WordFinderFilterOptions } from './wordFinder.ts';
import { dictionaryService } from './dictionary.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('\n=============================================');
console.log('--- RUNNING WORD FINDER UNIT TEST SUITE ---');
console.log('=============================================\n');

// 1. Available Letters Search
console.log('Test 1: Available Letters Search ("aret")');
const res1 = findWords({ letters: 'aret', sortBy: 'alpha-asc' }, dictionaryService);
const lower1 = res1.allWords.map((w) => w.toLowerCase());
assert(lower1.includes('rate'), '"aret" contains "rate"');
assert(lower1.includes('tare'), '"aret" contains "tare"');
assert(lower1.includes('tear'), '"aret" contains "tear"');
assert(lower1.includes('tea'), '"aret" contains "tea"');
assert(!lower1.includes('area'), '"aret" cannot build "area" because it only has 1 A');

// 2. Starts With Filter
console.log('\nTest 2: Starts With Filter ("TR")');
const resStarts = findWords({ startsWith: 'TR', length: 5 }, dictionaryService);
assert(resStarts.allWords.length > 0, 'Found 5-letter words starting with TR');
assert(
  resStarts.allWords.every((w) => w.toUpperCase().startsWith('TR')),
  'Every returned word starts with "TR"'
);
assert(
  resStarts.allWords.every((w) => w.length === 5),
  'Every returned word is exactly 5 letters long'
);
const lowerStarts = resStarts.allWords.map((w) => w.toLowerCase());
assert(lowerStarts.includes('track') || lowerStarts.includes('train') || lowerStarts.includes('trace'), 'Contains expected word like track/train/trace');

// 3. Ends With Filter
console.log('\nTest 3: Ends With Filter ("ING")');
const resEnds = findWords({ endsWith: 'ING', length: 6 }, dictionaryService);
assert(resEnds.allWords.length > 0, 'Found 6-letter words ending with ING');
assert(
  resEnds.allWords.every((w) => w.toUpperCase().endsWith('ING')),
  'Every returned word ends with "ING"'
);
assert(
  resEnds.allWords.every((w) => w.length === 6),
  'Every returned word is 6 letters long'
);

// 4. Contains Substring Filter
console.log('\nTest 4: Contains Substring Filter ("TION")');
const resContains = findWords({ contains: 'TION', length: 6 }, dictionaryService);
assert(resContains.allWords.length > 0, 'Found 6-letter words containing TION');
assert(
  resContains.allWords.every((w) => w.toUpperCase().includes('TION')),
  'Every returned word contains "TION"'
);
const lowerContains = resContains.allWords.map((w) => w.toLowerCase());
assert(lowerContains.includes('action') || lowerContains.includes('motion') || lowerContains.includes('nation'), 'Contains action/motion/nation');

// 5. Length "10+" Filter
console.log('\nTest 5: Length "10+" Filter');
const resTenPlus = findWords({ startsWith: 'INTER', length: '10+' }, dictionaryService);
assert(resTenPlus.allWords.length > 0, 'Found 10+ letter words starting with INTER');
assert(
  resTenPlus.allWords.every((w) => w.length >= 10),
  'Every returned word has length >= 10'
);

// 6. Combined Search: Available Letters + Starts With + Exact Length
console.log('\nTest 6: Combined Available Letters ("ARETS") + Starts With ("T") + Length 5');
const resCombined = findWords(
  {
    letters: 'ARETS',
    startsWith: 'T',
    length: 5,
  },
  dictionaryService
);
assert(resCombined.allWords.length > 0, 'Found matching words starting with T');
assert(
  resCombined.allWords.every((w) => w.toUpperCase().startsWith('T') && w.length === 5),
  'Every word starts with T and has length 5'
);
const lowerCombined = resCombined.allWords.map((w) => w.toLowerCase());
assert(lowerCombined.includes('tears'), 'Contains "tears"');
assert(!lowerCombined.includes('rates'), 'Does not contain "rates" because it starts with R');

// 7. Wildcards in Available Letters
console.log('\nTest 7: Wildcards in Available Letters ("ARET?")');
const resWildcard = findWords({ letters: 'ARET?', length: 5 }, dictionaryService);
assert(resWildcard.wildcardCount === 1, 'Wildcard count recognized as 1');
assert(resWildcard.allWords.length > 0, 'Found 5-letter words with wildcard');

// 8. Sorting Verification
console.log('\nTest 8: Sorting by Length Descending and Alphabetical');
const resSortDesc = findWords({ letters: 'PLANET', sortBy: 'length-desc' }, dictionaryService);
assert(
  resSortDesc.groups.length > 1,
  'Multiple word groups created'
);
assert(
  resSortDesc.groups[0].length > resSortDesc.groups[resSortDesc.groups.length - 1].length,
  'First group has higher length than last group'
);

const resSortAlpha = findWords({ startsWith: 'BA', length: 4, sortBy: 'alpha-asc' }, dictionaryService);
let isAlpha = true;
for (let i = 0; i < resSortAlpha.allWords.length - 1; i++) {
  if (resSortAlpha.allWords[i].localeCompare(resSortAlpha.allWords[i + 1]) > 0) {
    isAlpha = false;
    break;
  }
}
assert(isAlpha, 'Words are sorted alphabetically A-Z');

// 9. Input normalization and validation
console.log('\nTest 9: Input Normalization & Validation');
const norm = normalizeSearchInput('  A R e t ? *  ');
assert(norm === 'ARET?*', 'Normalized cleanly to uppercase letters and wildcards');

const resTooManyWildcards = findWords({ letters: '????' }, dictionaryService);
assert(
  Boolean(resTooManyWildcards.validationError),
  'Validation error caught for more than 3 wildcards'
);

// 10. Prompt Test 1: Letters AARET
console.log('\nTest 10: Specific Prompt Test 1 (Letters AARET)');
const resAARET = findWords({ letters: 'AARET' }, dictionaryService);
assert(resAARET.allWords.length > 0, 'Found words from AARET');
const lowerAARET = resAARET.allWords.map((w) => w.toLowerCase());
assert(lowerAARET.includes('area'), 'AARET builds "area" (has 2 As)');
assert(lowerAARET.includes('rate'), 'AARET builds "rate"');

// 11. Prompt Test 2: Letters AARET?
console.log('\nTest 11: Specific Prompt Test 2 (Letters AARET?)');
const resAARETWild = findWords({ letters: 'AARET?' }, dictionaryService);
assert(
  resAARETWild.allWords.length > resAARET.allWords.length,
  'AARET? yields more words than AARET due to wildcard expansion'
);

// 12. Prompt Test 3: Letters PLANET, Length 6
console.log('\nTest 12: Specific Prompt Test 3 (Letters PLANET, Length 6)');
const resPLANET = findWords({ letters: 'PLANET', length: 6 }, dictionaryService);
assert(resPLANET.allWords.length > 0, 'Found 6-letter words from PLANET');
assert(
  resPLANET.allWords.every((w) => w.length === 6),
  'All returned words are exactly 6 letters long'
);
const lowerPLANET = resPLANET.allWords.map((w) => w.toLowerCase());
assert(lowerPLANET.includes('planet'), 'Includes "planet"');

// 13. Prompt Test 7: Combine Letters + length + starts with
console.log('\nTest 13: Specific Prompt Test 7 (Letters PLANET + length 6 + starts with P)');
const resCombineStarts = findWords(
  { letters: 'PLANET', length: 6, startsWith: 'P' },
  dictionaryService
);
assert(resCombineStarts.allWords.length > 0, 'Found words starting with P');
assert(
  resCombineStarts.allWords.every((w) => w.toUpperCase().startsWith('P') && w.length === 6),
  'All returned words start with P and have length 6'
);
assert(
  resCombineStarts.allWords.map((w) => w.toLowerCase()).includes('planet'),
  'Includes "planet"'
);

// 14. Prompt Test 8: Combine Letters + length + ends with
console.log('\nTest 14: Specific Prompt Test 8 (Letters PLANET + length 6 + ends with T)');
const resCombineEnds = findWords(
  { letters: 'PLANET', length: 6, endsWith: 'T' },
  dictionaryService
);
assert(resCombineEnds.allWords.length > 0, 'Found words ending with T');
assert(
  resCombineEnds.allWords.every((w) => w.toUpperCase().endsWith('T') && w.length === 6),
  'All returned words end with T and have length 6'
);
assert(
  resCombineEnds.allWords.map((w) => w.toLowerCase()).includes('planet'),
  'Includes "planet"'
);

// 15. Prompt Test 9: Wildcard + prefix/suffix
console.log('\nTest 15: Specific Prompt Test 9 (Letters PLANE? + length 6 + ends with T)');
const resWildSuffix = findWords(
  { letters: 'PLANE?', length: 6, endsWith: 'T' },
  dictionaryService
);
assert(resWildSuffix.allWords.length > 0, 'Found words matching PLANE? ending with T');
assert(
  resWildSuffix.allWords.map((w) => w.toLowerCase()).includes('planet'),
  'Wildcard ? successfully substituted for T to form "planet"'
);

// 16. Edge Cases: Empty search and No results
console.log('\nTest 16: Empty Search and No Results Edge Cases');
const resEmpty = findWords({}, dictionaryService);
assert(!resEmpty.validationError === false, 'Empty search returns validation error');

const resNoResults = findWords({ letters: 'QQZZJJ', length: 6 }, dictionaryService);
assert(resNoResults.allWords.length === 0, 'Returns 0 results gracefully without crashing');
assert(resNoResults.validationError === null, 'No validation error for valid but empty query');

console.log('\n=============================================');
console.log('🎉 ALL WORD FINDER UNIT TESTS PASSED!');
console.log('=============================================\n');
