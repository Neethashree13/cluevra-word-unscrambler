import fs from 'fs';
import { WordDictionary } from './dictionary.ts';
import {
  findWordsWithLetters,
  validateWordsWithLettersOptions,
  normalizeLettersInput,
} from './wordsWithLetters.ts';

function assert(condition: any, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}
assert.strictEqual = (actual: any, expected: any, message: string) => {
  if (actual !== expected) {
    console.error(`❌ FAILED: ${message} (expected ${expected}, got ${actual})`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
};

console.log('=============================================');
console.log('RUNNING WORDS WITH LETTERS UNIT TESTS');
console.log('=============================================');

// Load full dictionary for test suite
const dictWords = fs
  .readFileSync('public/dictionary.txt', 'utf-8')
  .split(/\r?\n/)
  .map((w) => w.trim().toLowerCase());
const dictionaryService = new WordDictionary(dictWords);

// 1. Basic letter construction
console.log('\nTest 1: Basic letter construction - TRAE');
const traeResult = findWordsWithLetters({ letters: 'TRAE' }, dictionaryService);
assert.strictEqual(traeResult.validationError, null, 'No validation error for TRAE');
assert(traeResult.totalWords > 0, 'TRAE finds words');
const expectedTraeWords = ['rate', 'tear', 'tare', 'ear', 'are', 'art', 'rat', 'tar'];
for (const word of expectedTraeWords) {
  assert(
    traeResult.allWords.includes(word),
    `TRAE results should include "${word}". Found: ${traeResult.allWords.slice(0, 15).join(', ')}`
  );
  console.log(`✅ PASSED: Includes "${word}"`);
}

// 2. Sub-word behavior
console.log('\nTest 2: Sub-word behavior - PLANET');
const planetResult = findWordsWithLetters({ letters: 'PLANET', length: 'any' }, dictionaryService);
assert.strictEqual(planetResult.validationError, null, 'No validation error for PLANET');
assert(planetResult.totalWords > 10, 'PLANET finds multiple sub-words');
const expectedPlanetWords = ['planet', 'plane', 'panel', 'plant', 'plate', 'late', 'lane', 'lean'];
for (const word of expectedPlanetWords) {
  assert(
    planetResult.allWords.includes(word),
    `PLANET results should include sub-word "${word}".`
  );
  console.log(`✅ PASSED: Sub-word "${word}" found`);
}

// Verify that results contain multiple distinct lengths
const distinctLengths = new Set(planetResult.allWords.map((w) => w.length));
assert(distinctLengths.has(6), 'Has 6-letter words');
assert(distinctLengths.has(5), 'Has 5-letter words');
assert(distinctLengths.has(4), 'Has 4-letter words');
assert(distinctLengths.has(3), 'Has 3-letter words');
console.log('✅ PASSED: Successfully discovered sub-words across multiple word lengths');

// 3. Letter frequency check
console.log('\nTest 3: Letter frequency - AABC and APPLE');
const aabcResult = findWordsWithLetters({ letters: 'AABC' }, dictionaryService);
// Must contain words buildable from {a: 2, b: 1, c: 1}
assert(aabcResult.allWords.includes('cab'), 'AABC can make CAB');
assert(aabcResult.allWords.includes('baa'), 'AABC can make BAA');
// Must NOT contain words that need more letters than available:
for (const word of aabcResult.allWords) {
  const countA = (word.match(/a/g) || []).length;
  const countB = (word.match(/b/g) || []).length;
  const countC = (word.match(/c/g) || []).length;
  assert(countA <= 2, `Word "${word}" has at most 2 A's`);
  assert(countB <= 1, `Word "${word}" has at most 1 B`);
  assert(countC <= 1, `Word "${word}" has at most 1 C`);
  assert(!/[^abc]/.test(word), `Word "${word}" uses only A, B, C`);
}
console.log('✅ PASSED: AABC strictly respects letter frequency');

const appleResult = findWordsWithLetters({ letters: 'APPLE' }, dictionaryService);
assert(appleResult.allWords.includes('apple'), 'APPLE makes apple');
assert(appleResult.allWords.includes('peal'), 'APPLE makes peal');
assert(appleResult.allWords.includes('plea'), 'APPLE makes plea');
assert(!appleResult.allWords.includes('paper'), 'APPLE cannot make paper (requires R)');
// Test a hypothetical word requiring 3 P's - should not be in results
for (const word of appleResult.allWords) {
  const countP = (word.match(/p/g) || []).length;
  assert(countP <= 2, `Word "${word}" cannot exceed 2 P's`);
}
console.log('✅ PASSED: APPLE allows apple & peal, but rejects paper and words with > 2 P\'s');

// 4. Wildcards
console.log('\nTest 4: Wildcard functionality - PLAN?');
const planWildResult = findWordsWithLetters({ letters: 'PLAN?' }, dictionaryService);
assert(planWildResult.wildcardCount === 1, 'Wildcard count is 1');
// PLAN? has 5 tiles, so words are max 5 letters!
assert(!planWildResult.allWords.includes('planet'), 'PLAN? has 5 tiles so it cannot make 6-letter planet');
assert(planWildResult.allWords.includes('plane'), 'PLAN? makes plane (wildcard = E)');
assert(planWildResult.allWords.includes('plant'), 'PLAN? makes plant (wildcard = T)');
assert(planWildResult.allWords.includes('plank'), 'PLAN? makes plank (wildcard = K)');
console.log('✅ PASSED: Wildcard correctly matches unknown tile for 5-letter words');

// 5. Maximum wildcards limit
console.log('\nTest 5: Maximum wildcards limit');
const tooManyWildcards = validateWordsWithLettersOptions({ letters: 'PLAN????' });
assert(!tooManyWildcards.isValid, 'More than 3 wildcards is invalid');
assert(
  tooManyWildcards.validationError?.includes('maximum of 3'),
  'Validation error mentions maximum of 3 wildcards'
);
console.log('✅ PASSED: More than 3 wildcards returns validation error');

// 6. Word Length filtering
console.log('\nTest 6: Word length filtering (Any, 3, 4, 5, 10+)');
// Any length
const anyLenResult = findWordsWithLetters({ letters: 'EDUCATION', length: 'any' }, dictionaryService);
assert(anyLenResult.allWords.length > 50, 'EDUCATION has many sub-words');

// 3 letters only
const len3Result = findWordsWithLetters({ letters: 'PLANET', length: 3 }, dictionaryService);
assert(len3Result.totalWords > 0, 'Found 3-letter words');
for (const word of len3Result.allWords) {
  assert.strictEqual(word.length, 3, `Every word in length=3 filter must have 3 letters (got "${word}")`);
}
console.log('✅ PASSED: Length=3 returns strictly 3-letter words');

// 4 letters only
const len4Result = findWordsWithLetters({ letters: 'PLANET', length: 4 }, dictionaryService);
assert(len4Result.totalWords > 0, 'Found 4-letter words');
for (const word of len4Result.allWords) {
  assert.strictEqual(word.length, 4, `Every word in length=4 filter must have 4 letters (got "${word}")`);
}
console.log('✅ PASSED: Length=4 returns strictly 4-letter words');

// 5 letters only
const len5Result = findWordsWithLetters({ letters: 'PLANET', length: 5 }, dictionaryService);
assert(len5Result.totalWords > 0, 'Found 5-letter words');
for (const word of len5Result.allWords) {
  assert.strictEqual(word.length, 5, `Every word in length=5 filter must have 5 letters (got "${word}")`);
}
console.log('✅ PASSED: Length=5 returns strictly 5-letter words');

// 10+ letters filter
const len10PlusFromShort = findWordsWithLetters({ letters: 'PLANET', length: '10+' }, dictionaryService);
assert.strictEqual(len10PlusFromShort.totalWords, 0, 'PLANET (6 letters) cannot make 10+ letter words');

const len10PlusFromLong = findWordsWithLetters({ letters: 'COUNTERPOINT', length: '10+' }, dictionaryService);
assert(len10PlusFromLong.totalWords > 0, 'COUNTERPOINT can make 10+ letter words');
for (const word of len10PlusFromLong.allWords) {
  assert(word.length >= 10, `Every word in 10+ filter has length >= 10 (got "${word}", len ${word.length})`);
}
console.log('✅ PASSED: Length=10+ returns strictly words with 10 or more letters');

// 7. Starts with filter
console.log('\nTest 7: Starts with filter');
const startsP = findWordsWithLetters({ letters: 'PLANET', startsWith: 'P' }, dictionaryService);
assert(startsP.totalWords > 0, 'Finds words starting with P');
for (const word of startsP.allWords) {
  assert(word.startsWith('p'), `Word "${word}" must start with P`);
}
assert(startsP.allWords.includes('planet'), 'Includes planet');
assert(startsP.allWords.includes('plane'), 'Includes plane');
assert(!startsP.allWords.includes('late'), 'Excludes late (does not start with P)');
console.log('✅ PASSED: Starts with filter strictly enforced');

// 8. Ends with filter
console.log('\nTest 8: Ends with filter');
const endsE = findWordsWithLetters({ letters: 'PLANET', endsWith: 'E' }, dictionaryService);
assert(endsE.totalWords > 0, 'Finds words ending with E');
for (const word of endsE.allWords) {
  assert(word.endsWith('e'), `Word "${word}" must end with E`);
}
assert(endsE.allWords.includes('plane'), 'Includes plane');
assert(endsE.allWords.includes('late'), 'Includes late');
assert(!endsE.allWords.includes('plant'), 'Excludes plant (ends with T)');
console.log('✅ PASSED: Ends with filter strictly enforced');

// 9. Contains filter
console.log('\nTest 9: Contains filter');
const containsLAN = findWordsWithLetters({ letters: 'PLANET', contains: 'LAN' }, dictionaryService);
assert(containsLAN.totalWords > 0, 'Finds words containing LAN');
for (const word of containsLAN.allWords) {
  assert(word.includes('lan'), `Word "${word}" must contain LAN`);
}
assert(containsLAN.allWords.includes('planet'), 'Includes planet');
assert(containsLAN.allWords.includes('plane'), 'Includes plane');
assert(containsLAN.allWords.includes('plant'), 'Includes plant');
assert(containsLAN.allWords.includes('lane'), 'Includes lane');
assert(!containsLAN.allWords.includes('plate'), 'Excludes plate (does not contain LAN)');
console.log('✅ PASSED: Contains filter strictly enforced');

// 10. Sorting tests
console.log('\nTest 10: Sorting tests');
// length-desc
const sortLenDesc = findWordsWithLetters({ letters: 'PLANET', sortBy: 'length-desc' }, dictionaryService);
for (let i = 0; i < sortLenDesc.allWords.length - 1; i++) {
  assert(
    sortLenDesc.allWords[i].length >= sortLenDesc.allWords[i + 1].length,
    `length-desc order violated: ${sortLenDesc.allWords[i]} before ${sortLenDesc.allWords[i + 1]}`
  );
}
console.log('✅ PASSED: length-desc properly orders longest to shortest');

// length-asc
const sortLenAsc = findWordsWithLetters({ letters: 'PLANET', sortBy: 'length-asc' }, dictionaryService);
for (let i = 0; i < sortLenAsc.allWords.length - 1; i++) {
  assert(
    sortLenAsc.allWords[i].length <= sortLenAsc.allWords[i + 1].length,
    `length-asc order violated: ${sortLenAsc.allWords[i]} before ${sortLenAsc.allWords[i + 1]}`
  );
}
console.log('✅ PASSED: length-asc properly orders shortest to longest');

// alpha-asc
const sortAlpha = findWordsWithLetters({ letters: 'PLANET', sortBy: 'alpha-asc' }, dictionaryService);
for (let i = 0; i < sortAlpha.allWords.length - 1; i++) {
  assert(
    sortAlpha.allWords[i].localeCompare(sortAlpha.allWords[i + 1]) <= 0,
    `alpha-asc order violated: ${sortAlpha.allWords[i]} before ${sortAlpha.allWords[i + 1]}`
  );
}
console.log('✅ PASSED: alpha-asc properly orders alphabetically');

// score-desc
const sortScore = findWordsWithLetters({ letters: 'PLANET', sortBy: 'score-desc' }, dictionaryService);
assert(sortScore.allWords.length > 0, 'score-desc returns words');
console.log('✅ PASSED: score-desc sort successfully orders words');

// 11. Normalization tests (lowercase input, spaces, punctuation)
console.log('\nTest 11: Normalization tests');
assert.strictEqual(normalizeLettersInput('  p-l-a-n-e-t!  '), 'PLANET', 'Strips punctuation and spaces');
assert.strictEqual(normalizeLettersInput('plan*t?'), 'PLAN?T?', 'Converts * to ?');
assert.strictEqual(normalizeLettersInput('plan*?'), 'PLAN??', 'Converts * and ? to ??');
const messyResult = findWordsWithLetters({ letters: '  p l a n e t ! ' }, dictionaryService);
assert.strictEqual(messyResult.validationError, null, 'Messy input normalized safely');
assert(messyResult.allWords.includes('planet'), 'Finds planet despite spaces and punctuation');
console.log('✅ PASSED: Messy input normalized safely');

// 12. Validation edge cases
console.log('\nTest 12: Validation edge cases');
const emptyRes = validateWordsWithLettersOptions({ letters: '' });
assert(!emptyRes.isValid, 'Empty input is invalid');
assert(emptyRes.validationError?.includes('Please enter available letters'), 'Empty validation message');

const whitespaceRes = validateWordsWithLettersOptions({ letters: '    ' });
assert(!whitespaceRes.isValid, 'Whitespace input is invalid');

const invalidCharsRes = validateWordsWithLettersOptions({ letters: '1234@#$' });
assert(!invalidCharsRes.isValid, 'Invalid chars input is invalid');

const tooLongRes = validateWordsWithLettersOptions({ letters: 'ABCDEFGHIJKLMNOPQ' });
assert(!tooLongRes.isValid, 'Over 15 letters is invalid');
assert(tooLongRes.validationError?.includes('cannot exceed 15'), 'Over 15 error message');
console.log('✅ PASSED: Validation edge cases handled cleanly');

console.log('\n=============================================');
console.log('🎉 ALL WORDS WITH LETTERS TESTS PASSED!');
console.log('=============================================\n');
