import {
  normalizeWord,
  getWordSignature,
  isValidDictionaryWord,
  WordDictionary,
  dictionaryService,
} from './dictionary.ts';
import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('\n--- 1. Testing Word Normalization ---');
assert(normalizeWord('A R E T') === 'aret', 'Normalizes "A R E T" -> "aret"');
assert(normalizeWord('AreT') === 'aret', 'Normalizes "AreT" -> "aret"');
assert(normalizeWord('a-r-e-t') === 'aret', 'Normalizes "a-r-e-t" -> "aret"');
assert(normalizeWord('a1r2e3t!') === 'aret', 'Strips numbers and punctuation "a1r2e3t!" -> "aret"');
assert(normalizeWord('  HELLO  ') === 'hello', 'Trims and lowercases "  HELLO  " -> "hello"');
assert(normalizeWord('') === '', 'Handles empty input safely');

console.log('\n--- 2. Testing Required Words Existence in Dictionary ---');
assert(dictionaryService.hasWord('rate'), '"rate" exists in dictionary');
assert(dictionaryService.hasWord('tear'), '"tear" exists in dictionary');
assert(dictionaryService.hasWord('tare'), '"tare" exists in dictionary');
assert(dictionaryService.hasWord('apple'), '"apple" exists in dictionary');
assert(dictionaryService.hasWord('RATE'), 'Case-insensitive check: "RATE" exists');
assert(dictionaryService.hasWord('T-E-A-R'), 'Special characters stripped: "T-E-A-R" exists');

console.log('\n--- 3. Testing Precomputed Signatures & Anagrams ---');
assert(getWordSignature('rate') === 'aert', '"rate" signature is "aert"');
assert(getWordSignature('tear') === 'aert', '"tear" signature is "aert"');
assert(getWordSignature('tare') === 'aert', '"tare" signature is "aert"');
assert(getWordSignature('apple') === 'aelpp', '"apple" signature is "aelpp"');

const anagramsOfRate = dictionaryService.getExactAnagrams('rate');
assert(
  anagramsOfRate.includes('rate') &&
  anagramsOfRate.includes('tear') &&
  anagramsOfRate.includes('tare'),
  `Exact anagrams of "rate" contains "rate", "tear", "tare" (found: ${anagramsOfRate.join(', ')})`
);

console.log('\n--- 4. Testing Duplicate Words Removal ---');
const testDictWithDuplicates = new WordDictionary(['apple', 'Apple', 'apple', 'APPLE', 'rate', 'RATE']);
assert(
  testDictWithDuplicates.getWordCount() === 2,
  `Duplicates properly deduplicated: expected 2 unique words, got ${testDictWithDuplicates.getWordCount()}`
);
assert(testDictWithDuplicates.hasWord('apple'), 'Retained "apple"');
assert(testDictWithDuplicates.hasWord('rate'), 'Retained "rate"');

console.log('\n--- 5. Testing Invalid Dictionary Entries Filtering ---');
const invalidSamples = [
  '<p>html</p>',
  'random sentence with spaces',
  '12345',
  '!@#$%',
  '',
  'a', // single letter below length 2
  'supercalifragilisticexpialidocious', // >15 letters
];
for (const sample of invalidSamples) {
  assert(!isValidDictionaryWord(sample), `Identified invalid dictionary entry: "${sample}"`);
}

const testDictWithInvalid = new WordDictionary([
  'apple',
  '<script>alert("hack")</script>',
  'a',
  'two words',
  '12345',
  'rate',
]);
assert(
  testDictWithInvalid.getWordCount() === 2,
  `Invalid entries ignored: expected 2 valid words, got ${testDictWithInvalid.getWordCount()}`
);
assert(testDictWithInvalid.hasWord('apple'), 'Valid word "apple" preserved');
assert(testDictWithInvalid.hasWord('rate'), 'Valid word "rate" preserved');

console.log('\n--- 6. Testing Local Dictionary File public/dictionary.txt ---');
const dictPath = path.resolve(process.cwd(), 'public/dictionary.txt');
assert(fs.existsSync(dictPath), 'public/dictionary.txt exists on disk');

const fileContent = fs.readFileSync(dictPath, 'utf-8');
const lines = fileContent.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
assert(lines.length > 150000, `public/dictionary.txt contains comprehensive word list (${lines.length} words)`);
assert(lines.includes('rate'), '"rate" found in public/dictionary.txt');
assert(lines.includes('tear'), '"tear" found in public/dictionary.txt');
assert(lines.includes('tare'), '"tare" found in public/dictionary.txt');
assert(lines.includes('apple'), '"apple" found in public/dictionary.txt');

console.log('\n🎉 ALL PHASE 2 DICTIONARY VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
