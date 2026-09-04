import {
  normalizePattern,
  validateFiveLetterFilters,
  findFiveLetterWords,
  formatFiveLetterWordsForClipboard,
} from './fiveLetterFinder.ts';
import { dictionaryService, WordDictionary } from './dictionary.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('=== Running 5-Letter Word Finder Test Suite ===\n');

// 1. Pattern normalization
console.log('Test 1: Pattern normalization');
assert(normalizePattern(['s', 'a', '', 'e', '']).pattern === 'sa_e_', 'Array ["s", "a", "", "e", ""] -> "sa_e_"');
assert(normalizePattern('_ A _ E _').pattern === '_a_e_', 'String "_ A _ E _" -> "_a_e_"');
assert(normalizePattern('s?a?e').pattern === 's_a_e', 'Wildcards "?" converted to "_"');
assert(normalizePattern('').pattern === '_____', 'Empty pattern defaults to "_____"');
assert(normalizePattern(undefined).pattern === '_____', 'Undefined pattern defaults to "_____"');

// 2. Exact 5-letter results
console.log('\nTest 2: Exact 5-letter results guarantee');
const allFiveResult = findFiveLetterWords({});
assert(allFiveResult.totalWords > 1000, `Found ${allFiveResult.totalWords} 5-letter words in initial core lexicon`);
assert(allFiveResult.words.every((w) => w.length === 5), 'Every single word returned has length exactly equal to 5');

// 3. Pattern matching: _ A _ E _
console.log('\nTest 3: Pattern matching "_ A _ E _"');
const patternResult = findFiveLetterWords({ pattern: '_a_e_' });
assert(patternResult.totalWords > 0, `Pattern "_a_e_" matched ${patternResult.totalWords} words`);
assert(
  patternResult.words.every((w) => w[1] === 'a' && w[3] === 'e'),
  'All matched words have "a" at index 1 and "e" at index 3'
);
assert(patternResult.words.includes('baker') || patternResult.words.includes('dates') || patternResult.words.includes('water'), 'Includes typical words like baker, dates, water');

// 4. Pattern matching: S A _ E _
console.log('\nTest 4: Pattern matching "S A _ E _"');
const saeResult = findFiveLetterWords({ pattern: ['s', 'a', '', 'e', ''] });
assert(saeResult.totalWords > 0, `Pattern "S A _ E _" matched ${saeResult.totalWords} words`);
assert(
  saeResult.words.every((w) => w[0] === 's' && w[1] === 'a' && w[3] === 'e'),
  'All matched words have "s" at index 0, "a" at index 1, "e" at index 3'
);

// 5. Starts-with filter
console.log('\nTest 5: Starts-with filter');
const startsResult = findFiveLetterWords({ startsWith: 'st' });
assert(startsResult.totalWords > 0, `Starts with "st" found ${startsResult.totalWords} words`);
assert(startsResult.words.every((w) => w.startsWith('st')), 'Every word starts with "st"');
assert(startsResult.words.every((w) => w.length === 5), 'Every word is 5 letters');

// 6. Ends-with filter
console.log('\nTest 6: Ends-with filter');
const endsResult = findFiveLetterWords({ endsWith: 'er' });
assert(endsResult.totalWords > 0, `Ends with "er" found ${endsResult.totalWords} words`);
assert(endsResult.words.every((w) => w.endsWith('er')), 'Every word ends with "er"');

// 7. Contains letters filter
console.log('\nTest 7: Contains letters filter');
const containsResult = findFiveLetterWords({ containsLetters: 'qz' });
assert(containsResult.words.every((w) => w.includes('q') && w.includes('z')), 'Every word contains both "q" and "z"');

// 8. Excluded letters filter
console.log('\nTest 8: Excluded letters filter');
const excludeResult = findFiveLetterWords({ startsWith: 'st', endsWith: 'e', excludeLetters: 'ar' });
assert(
  excludeResult.words.every((w) => !w.includes('a') && !w.includes('r')),
  'None of the results contain excluded letters "a" or "r"'
);
assert(!excludeResult.words.includes('stare'), '"stare" correctly excluded because "a" and "r" are excluded');

// 9. Conflict validation: Letter in both contains and exclude
console.log('\nTest 9: Conflict validation detection');
const conflictResult = findFiveLetterWords({ containsLetters: 'a', excludeLetters: 'a' });
assert(conflictResult.validationError !== null, 'Conflict between contains and excluded letters returns error');
assert(conflictResult.totalWords === 0, 'Conflict returns 0 words');

// 10. Conflict validation: Letter in pattern and exclude
console.log('\nTest 10: Pattern vs excluded conflict');
const patternConflict = findFiveLetterWords({ pattern: 's____', excludeLetters: 's' });
assert(patternConflict.validationError !== null, 'Letter in pattern and excluded returns error');

// 11. Empty input / clearing
console.log('\nTest 11: Empty input returns all 5-letter words safely');
const emptyResult = findFiveLetterWords({ pattern: '', startsWith: '', endsWith: '', containsLetters: '', excludeLetters: '' });
assert(emptyResult.validationError === null, 'No validation error on empty inputs');
assert(emptyResult.totalWords === allFiveResult.totalWords, 'Returns all 5-letter words');

// 12. Invalid input handling
console.log('\nTest 12: Invalid input validation');
const invalidStart = findFiveLetterWords({ startsWith: 'toolongword' });
assert(invalidStart.validationError !== null, 'Starts-with longer than 5 letters triggers validation error');

// 13. Available letters with wildcards
console.log('\nTest 13: Available letters / rack with wildcards');
const rackResult = findFiveLetterWords({ availableLetters: 'arest?' });
assert(rackResult.totalWords > 0, `Available letters "arest?" found ${rackResult.totalWords} words`);
assert(rackResult.words.includes('rates'), 'Finds "rates"');
assert(rackResult.words.includes('tears'), 'Finds "tears"');
assert(rackResult.words.includes('aster'), 'Finds "aster"');

// 14. No results scenario
console.log('\nTest 14: No results scenario handled gracefully');
const noMatchResult = findFiveLetterWords({ startsWith: 'zq', endsWith: 'xj' });
assert(noMatchResult.totalWords === 0, 'Returns 0 words for impossible combination');
assert(noMatchResult.validationError === null, 'No validation error for legitimate 0-result search');

// 15. Alphabetical sorting
console.log('\nTest 15: Alphabetical sorting');
const ascResult = findFiveLetterWords({ startsWith: 'st', sortBy: 'alpha-asc' });
const descResult = findFiveLetterWords({ startsWith: 'st', sortBy: 'alpha-desc' });
assert(ascResult.words[0] <= ascResult.words[1], 'alpha-asc sorts ascending');
assert(descResult.words[0] >= descResult.words[1], 'alpha-desc sorts descending');
assert(ascResult.words[0] === descResult.words[descResult.words.length - 1], 'First of asc is last of desc');

// 16. Copy formatting
console.log('\nTest 16: Copy formatting');
const sampleWords = ['apple', 'beach', 'crane'];
const formatted = formatFiveLetterWordsForClipboard(sampleWords);
assert(formatted === 'APPLE\nBEACH\nCRANE', 'Formats words to uppercase newline-separated string');
assert(formatFiveLetterWordsForClipboard([]) === '', 'Handles empty array safely');

console.log('\n🎉 ALL 16 FIVE-LETTER FINDER TESTS PASSED FLAWLESSLY!\n');
