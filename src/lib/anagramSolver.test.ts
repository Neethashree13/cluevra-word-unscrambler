import fs from 'fs';
import { WordDictionary } from './dictionary.ts';
import {
  solveAnagrams,
  validateAnagramSolverOptions,
  normalizeAnagramInput,
} from './anagramSolver.ts';
import { calculateWordScore } from './scoring.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

console.log('=============================================');
console.log('--- RUNNING ANAGRAM SOLVER UNIT TEST SUITE ---');
console.log('=============================================');

// Load full dictionary for complete tests
const dictWords = fs
  .readFileSync('public/dictionary.txt', 'utf-8')
  .split(/\r?\n/)
  .map((w) => w.trim().toLowerCase());
const fullDict = new WordDictionary(dictWords);

// 1. Exact Anagrams Test: LISTEN
console.log('\nTest 1: Exact Anagrams - LISTEN');
const resListen = solveAnagrams({ letters: 'LISTEN', length: 'exact' }, fullDict);
assert(resListen.validationError === null, 'No validation error for LISTEN');
assert(resListen.isExactOnly === true, 'Exact mode is true');
assert(resListen.totalWords >= 5, 'Finds at least 5 anagrams of LISTEN');
const listenWords = resListen.allWords.map((w) => w.toLowerCase());
assert(listenWords.includes('listen'), 'Includes "listen"');
assert(listenWords.includes('silent'), 'Includes "silent"');
assert(listenWords.includes('enlist'), 'Includes "enlist"');
assert(listenWords.includes('inlets'), 'Includes "inlets"');
assert(listenWords.includes('tinsel'), 'Includes "tinsel"');
assert(
  resListen.allWords.every((w) => w.length === 6),
  'Every word in exact mode has length 6'
);

// 2. Exact Anagrams Test: PLANET
console.log('\nTest 2: Exact Anagrams - PLANET');
const resPlanet = solveAnagrams({ letters: 'PLANET' }, fullDict);
assert(resPlanet.allWords.map((w) => w.toLowerCase()).includes('planet'), 'Includes "planet"');
assert(resPlanet.allWords.map((w) => w.toLowerCase()).includes('platen'), 'Includes "platen"');
assert(
  resPlanet.allWords.every((w) => w.length === 6),
  'Every word has length 6'
);

// 3. Exact Anagrams Test: EARTH
console.log('\nTest 3: Exact Anagrams - EARTH');
const resEarth = solveAnagrams({ letters: 'EARTH' }, fullDict);
const earthWords = resEarth.allWords.map((w) => w.toLowerCase());
assert(earthWords.includes('earth'), 'Includes "earth"');
assert(earthWords.includes('heart'), 'Includes "heart"');
assert(earthWords.includes('hater'), 'Includes "hater"');
assert(earthWords.includes('rathe'), 'Includes "rathe"');
assert(
  resEarth.allWords.every((w) => w.length === 5),
  'Every word has length 5'
);

// 4. Exact Anagrams Test: CARE
console.log('\nTest 4: Exact Anagrams - CARE');
const resCare = solveAnagrams({ letters: 'CARE' }, fullDict);
const careWords = resCare.allWords.map((w) => w.toLowerCase());
assert(careWords.includes('care'), 'Includes "care"');
assert(careWords.includes('race'), 'Includes "race"');
assert(careWords.includes('acre'), 'Includes "acre"');
assert(
  resCare.allWords.every((w) => w.length === 4),
  'Every word has length 4'
);

// 5. Wildcard Anagrams: LISTE?
console.log('\nTest 5: Wildcard Anagrams - LISTE?');
const resListeWild = solveAnagrams({ letters: 'LISTE?' }, fullDict);
assert(resListeWild.wildcardCount === 1, 'Wildcard count is 1');
assert(resListeWild.totalWords > resListen.totalWords, 'LISTE? finds more than LISTEN alone');
const listeWords = resListeWild.allWords.map((w) => w.toLowerCase());
assert(listeWords.includes('listen'), 'LISTE? with N makes "listen"');
assert(listeWords.includes('silent'), 'LISTE? with N makes "silent"');
assert(listeWords.includes('elites'), 'LISTE? with E makes "elites"');
assert(
  resListeWild.allWords.every((w) => w.length === 6),
  'All returned words are 6 letters'
);

// 6. Wildcard Anagrams: PLAN?T
console.log('\nTest 6: Wildcard Anagrams - PLAN?T');
const resPlanWild = solveAnagrams({ letters: 'PLAN?T' }, fullDict);
const planWords = resPlanWild.allWords.map((w) => w.toLowerCase());
assert(planWords.includes('planet'), 'Includes "planet"');
assert(planWords.includes('platen'), 'Includes "platen"');
assert(planWords.includes('plaint'), 'Includes "plaint"');
assert(
  resPlanWild.allWords.every((w) => w.length === 6),
  'All returned words are 6 letters'
);

// 7. Sub-anagrams (Length: Any): LISTEN
console.log('\nTest 7: Sub-anagrams (Length: any) - LISTEN');
const resAny = solveAnagrams({ letters: 'LISTEN', length: 'any' }, fullDict);
assert(resAny.totalWords > resListen.totalWords, 'Any length returns more words than exact');
assert(resAny.groups.length > 1, 'Creates multiple length groups for sub-anagrams');
const minLengthWord = Math.min(...resAny.allWords.map((w) => w.length));
assert(minLengthWord >= 2, 'Words are at least 2 letters long');

// 8. Specific Length Filter: LISTEN, length 5
console.log('\nTest 8: Specific Length Filter - LISTEN, length 5');
const resLen5 = solveAnagrams({ letters: 'LISTEN', length: 5 }, fullDict);
assert(resLen5.totalWords > 0, 'Found 5-letter sub-anagrams');
assert(
  resLen5.allWords.every((w) => w.length === 5),
  'Every returned word is 5 letters'
);
assert(resLen5.allWords.map((w) => w.toLowerCase()).includes('inlet'), 'Includes "inlet"');

// 9. Sorting Tests
console.log('\nTest 9: Sorting Tests');
const resAlpha = solveAnagrams({ letters: 'LISTEN', length: 'exact', sortBy: 'alpha-asc' }, fullDict);
for (let i = 0; i < resAlpha.allWords.length - 1; i++) {
  assert(
    resAlpha.allWords[i].localeCompare(resAlpha.allWords[i + 1]) <= 0,
    'Alphabetical sort is correctly ordered A-Z'
  );
}

const resScore = solveAnagrams({ letters: 'LISTEN', length: 'any', sortBy: 'score-desc' }, fullDict);
for (let i = 0; i < resScore.allWords.length - 1; i++) {
  const scoreA = calculateWordScore(resScore.allWords[i]);
  const scoreB = calculateWordScore(resScore.allWords[i + 1]);
  assert(scoreA >= scoreB, 'Score sort orders higher score before lower score');
}

// 10. Phrase handling: THE EYES
console.log('\nTest 10: Phrase Handling - "THE EYES"');
const resPhrase = solveAnagrams({ letters: 'THE EYES', length: 'any' }, fullDict);
assert(resPhrase.validationError === null, 'No validation error for phrase with spaces');
assert(resPhrase.lettersNormalized === 'THEEYES', 'Spaces stripped and normalized to THEEYES');
assert(resPhrase.totalWords > 0, 'Found sub-anagrams from phrase letters');
const phraseWords = resPhrase.allWords.map((w) => w.toLowerCase());
assert(phraseWords.includes('eyes'), 'Phrase letters build "eyes"');
assert(phraseWords.includes('these'), 'Phrase letters build "these"');
assert(phraseWords.includes('sheet'), 'Phrase letters build "sheet"');

// 11. Validation and Edge Cases
console.log('\nTest 11: Validation and Edge Cases');
const resEmpty = solveAnagrams({ letters: '' }, fullDict);
assert(resEmpty.validationError !== null, 'Empty string returns validation error');

const resSpaces = solveAnagrams({ letters: '    ' }, fullDict);
assert(resSpaces.validationError !== null, 'Whitespace-only returns validation error');

const resInvalidChars = solveAnagrams({ letters: '12345!@#' }, fullDict);
assert(resInvalidChars.validationError !== null, 'Non-alphabetic characters return validation error');

const resTooManyWildcards = solveAnagrams({ letters: 'ABC????' }, fullDict);
assert(resTooManyWildcards.validationError !== null, '4 wildcards return validation error');

const resTooLong = solveAnagrams({ letters: 'ABCDEFGHIJKLMNOPQ' }, fullDict);
assert(resTooLong.validationError !== null, 'Over 15 letters returns validation error');

const resSingleLetter = solveAnagrams({ letters: 'A' }, fullDict);
assert(resSingleLetter.validationError !== null, 'Single letter returns validation error (< 2)');

// 12. No Results Graceful Handling
console.log('\nTest 12: No Results Handling');
const resNoMatch = solveAnagrams({ letters: 'QQZZJJ' }, fullDict);
assert(resNoMatch.totalWords === 0, 'Returns 0 results for non-matching letters');
assert(resNoMatch.validationError === null, 'No validation error for valid letters with 0 matches');

console.log('\n=============================================');
console.log('🎉 ALL ANAGRAM SOLVER UNIT TESTS PASSED!');
console.log('=============================================\n');
