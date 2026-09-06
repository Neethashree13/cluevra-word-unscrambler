import {
  getLetterFrequency,
  canBuildWord,
  canBuildWordWithWildcards,
  sortResults,
  groupResultsByLength,
  findWordsFromLetters,
  formatGroupsForClipboard,
} from './unscrambler.ts';
import { normalizeWord } from './dictionary.ts';
import { calculateWordScore, SCRABBLE_LETTER_VALUES } from './scoring.ts';
import { buildShareUrl, parseShareUrl } from './share.ts';
import { getRecentSearches, saveRecentSearch, clearRecentSearches } from './recentSearches.ts';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ TEST FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('\n=============================================');
console.log('--- RUNNING PHASE 4 UNSCRAMBLER TEST SUITE ---');
console.log('=============================================\n');

// 1. "aret" finds RATE, TARE, and TEAR
console.log('Test 1: "aret" finds RATE, TARE, TEAR');
const res1 = findWordsFromLetters('aret');
const words1Lower = res1.allWords.map((w) => w.toLowerCase());
assert(words1Lower.includes('rate'), '"aret" finds "rate"');
assert(words1Lower.includes('tare'), '"aret" finds "tare"');
assert(words1Lower.includes('tear'), '"aret" finds "tear"');
assert(words1Lower.includes('are'), '"aret" finds 3-letter word "are"');
assert(words1Lower.includes('art'), '"aret" finds 3-letter word "art"');
assert(words1Lower.includes('ear'), '"aret" finds 3-letter word "ear"');
assert(words1Lower.includes('eat'), '"aret" finds 3-letter word "eat"');
assert(words1Lower.includes('rat'), '"aret" finds 3-letter word "rat"');
assert(words1Lower.includes('tea'), '"aret" finds 3-letter word "tea"');

// 2. Duplicate letters are respected
console.log('\nTest 2: Duplicate letters are respected');
const freqAaret = getLetterFrequency('A A R E T');
assert(freqAaret['a'] === 2, 'Input "A A R E T" has a = 2');
assert(freqAaret['r'] === 1, 'Input "A A R E T" has r = 1');
const freqSingleA = getLetterFrequency('A R E T');
assert(canBuildWord('rate', freqSingleA) === true, '"rate" needs one A -> valid');
assert(canBuildWord('area', freqSingleA) === false, '"area" needs two A\'s from single-A input -> rejected');
assert(canBuildWord('area', freqAaret) === true, '"area" needs two A\'s from double-A input -> valid');

// 3. Minimum length works
console.log('\nTest 3: Minimum length works');
const resMin4 = findWordsFromLetters('aret', { minLength: 4 });
assert(
  resMin4.allWords.every((w) => w.length >= 4),
  `All words have length >= 4 (Found lengths: ${Array.from(new Set(resMin4.allWords.map((w) => w.length))).join(', ')})`
);
assert(resMin4.allWords.includes('rate'), 'Contains "rate" (len 4)');
assert(!resMin4.allWords.includes('tea'), 'Does NOT contain "tea" (len 3)');
assert(!resMin4.allWords.includes('at'), 'Does NOT contain "at" (len 2)');

// 4. Maximum length works
console.log('\nTest 4: Maximum length works');
const resMax3 = findWordsFromLetters('aret', { minLength: 2, maxLength: 3 });
assert(
  resMax3.allWords.every((w) => w.length <= 3),
  `All words have length <= 3`
);
assert(!resMax3.allWords.includes('rate'), 'Does NOT contain "rate" (len 4)');
assert(resMax3.allWords.includes('tea'), 'Contains "tea" (len 3)');

// 5. Invalid input works
console.log('\nTest 5: Invalid input works');
const resEmpty = findWordsFromLetters('');
assert(resEmpty.totalWords === 0, 'Empty string returns 0 words');
assert(!!resEmpty.validationError, 'Empty string returns friendly validation error');

const resSpaces = findWordsFromLetters('     ');
assert(resSpaces.totalWords === 0, 'Whitespace returns 0 words');
assert(!!resSpaces.validationError, 'Whitespace returns validation error');

const resPunct = findWordsFromLetters('!@#$%^&*()');
assert(resPunct.totalWords === 0, 'Punctuation-only returns 0 words');
assert(!!resPunct.validationError, 'Punctuation-only returns validation error');

// 6. Dirty input normalization works
console.log('\nTest 6: Dirty input normalization works');
assert(normalizeWord('A R-E T!') === 'aret', 'Normalizes "A R-E T!" -> "aret"');
const resDirty = findWordsFromLetters('A R-E T! 123');
assert(resDirty.allWords.includes('rate'), 'Dirty input still finds "rate"');
assert(resDirty.validationError === null, 'No validation error for valid dirty input');

// 7. Results contain no duplicates
console.log('\nTest 7: Results contain no duplicates');
const testDupeResults = findWordsFromLetters('aret');
const uniqueSet = new Set(testDupeResults.allWords);
assert(uniqueSet.size === testDupeResults.allWords.length, 'findWordsFromLetters produces zero duplicate results');

// 8. Sorting remains correct
console.log('\nTest 8: Sorting remains correct');
const unsorted = ['art', 'tear', 'tea', 'rate', 'eat', 'tare', 'are'];
const sorted = sortResults(unsorted, 'length-desc');
assert(
  JSON.stringify(sorted) === JSON.stringify(['rate', 'tare', 'tear', 'are', 'art', 'eat', 'tea']),
  'Length-desc sorts longer words first, then alphabetically'
);

// 9. Words requiring unavailable letters are rejected
console.log('\nTest 9: Words requiring unavailable letters are rejected');
const freqAret = getLetterFrequency('aret');
assert(canBuildWord('rate', freqAret) === true, '"rate" accepted');
assert(canBuildWord('roast', freqAret) === false, '"roast" rejected');
assert(canBuildWord('zebra', freqAret) === false, '"zebra" rejected');

// 10. Words requiring too many copies of a letter are rejected
console.log('\nTest 10: Words requiring too many copies of a letter are rejected');
assert(canBuildWord('rare', freqAret) === false, '"rare" (2 r\'s) rejected from 1-r input');
assert(canBuildWord('teat', freqAret) === false, '"teat" (2 t\'s) rejected from 1-t input');
assert(canBuildWord('tree', freqAret) === false, '"tree" (2 e\'s) rejected from 1-e input');

// 11. One wildcard works
console.log('\nTest 11: One wildcard works');
const resWildcard1 = findWordsFromLetters('are?');
assert(resWildcard1.wildcardCount === 1, 'Correctly detected 1 wildcard');
assert(resWildcard1.allWords.includes('rate'), '"are?" finds "rate" (wildcard acts as t)');
assert(resWildcard1.allWords.includes('tear'), '"are?" finds "tear" (wildcard acts as t)');
assert(resWildcard1.allWords.includes('area'), '"are?" finds "area" (wildcard acts as 2nd a)');
assert(resWildcard1.allWords.includes('rare'), '"are?" finds "rare" (wildcard acts as 2nd r)');
assert(!resWildcard1.allWords.includes('tree'), '"are?" does NOT find "tree" (needs 2 extra letters t & e)');

// 12. Multiple wildcards work
console.log('\nTest 12: Multiple wildcards work');
const resWildcard2 = findWordsFromLetters('a??', { minLength: 3, maxLength: 3 });
assert(resWildcard2.wildcardCount === 2, 'Correctly detected 2 wildcards');
assert(resWildcard2.allWords.includes('art'), '"a??" finds 3-letter word "art" (wildcards as r and t)');
assert(resWildcard2.allWords.includes('all'), '"a??" finds 3-letter word "all" (wildcards as l and l)');
assert(!resWildcard2.allWords.includes('rare'), '"a??" cannot form 4-letter word when total tiles is 3');

// 13. Wildcards respect existing letter frequencies
console.log('\nTest 13: Wildcards respect existing letter frequencies');
const freqAre = getLetterFrequency('are');
// Input 'are' with 1 wildcard
assert(canBuildWordWithWildcards('rate', freqAre, 1) === true, '"rate" needs 1 missing letter (t) with 1 wildcard -> true');
assert(canBuildWordWithWildcards('roast', freqAre, 1) === false, '"roast" needs 2 missing letters (o, s) with 1 wildcard -> false');

// 14. Duplicate letters plus wildcard work
console.log('\nTest 14: Duplicate letters plus wildcard work');
const freqDoubleA = getLetterFrequency('aa');
// Candidate requiring 3 A's
assert(canBuildWordWithWildcards('aaa', freqDoubleA, 1) === true, 'Candidate needing 3 A\'s is valid with 2 A\'s + 1 wildcard');
assert(canBuildWordWithWildcards('aaaa', freqDoubleA, 1) === false, 'Candidate needing 4 A\'s is rejected with 2 A\'s + 1 wildcard');
assert(canBuildWordWithWildcards('area', freqDoubleA, 1) === false, '"area" needs r & e (2 missing letters), only 1 wildcard -> rejected');

// 15. Longest-first sorting works
console.log('\nTest 15: Longest-first sorting works');
const testWords = ['art', 'tear', 'tea', 'rate', 'eat', 'tare', 'are'];
const sortedLongest = sortResults(testWords, 'length-desc');
assert(
  sortedLongest[0].length === 4 && sortedLongest[sortedLongest.length - 1].length === 3,
  'Longest words appear first'
);
assert(
  JSON.stringify(sortedLongest) === JSON.stringify(['rate', 'tare', 'tear', 'are', 'art', 'eat', 'tea']),
  'Length-desc orders correctly'
);

// 16. Shortest-first sorting works
console.log('\nTest 16: Shortest-first sorting works');
const sortedShortest = sortResults(testWords, 'length-asc');
assert(
  sortedShortest[0].length === 3 && sortedShortest[sortedShortest.length - 1].length === 4,
  'Shortest words appear first'
);
assert(
  JSON.stringify(sortedShortest) === JSON.stringify(['are', 'art', 'eat', 'tea', 'rate', 'tare', 'tear']),
  'Length-asc orders correctly'
);

// 17. Alphabetical sorting works
console.log('\nTest 17: Alphabetical sorting works');
const sortedAlpha = sortResults(testWords, 'alpha-asc');
assert(
  JSON.stringify(sortedAlpha) === JSON.stringify(['are', 'art', 'eat', 'rate', 'tare', 'tea', 'tear']),
  'Alpha-asc orders strictly alphabetically'
);

// 18. Word scoring works
console.log('\nTest 18: Word scoring works');
assert(calculateWordScore('RATE') === 4, 'RATE score is 4 (R:1 + A:1 + T:1 + E:1)');
assert(calculateWordScore('rate') === 4, 'rate lowercase score is 4');
assert(calculateWordScore('APPLE') === 9, 'APPLE score is 9 (A:1 + P:3 + P:3 + L:1 + E:1)');
assert(calculateWordScore('QUIZ') === 22, 'QUIZ score is 22 (Q:10 + U:1 + I:1 + Z:10)');
assert(calculateWordScore('') === 0, 'Empty word score is 0');
assert(SCRABBLE_LETTER_VALUES['z'] === 10, 'Z letter value is 10');

// 19. Share URL generation works
console.log('\nTest 19: Share URL generation works');
const shareUrl1 = buildShareUrl('aret', { minLength: 3, maxLength: 4, sortBy: 'length-desc' }, 'https://cluevra.com/');
assert(shareUrl1.includes('letters=aret'), 'Share URL contains letters=aret');
assert(shareUrl1.includes('min=3'), 'Share URL contains min=3');
assert(shareUrl1.includes('max=4'), 'Share URL contains max=4');

const shareUrlWildcard = buildShareUrl('are?', { minLength: 2, maxLength: 15, sortBy: 'alpha-asc' }, 'https://cluevra.com/');
assert(shareUrlWildcard.includes('letters=are%3F'), 'Share URL properly encodes ? as %3F');
assert(shareUrlWildcard.includes('sort=alpha-asc'), 'Share URL includes custom sort option');

// 20. Share URL parsing works
console.log('\nTest 20: Share URL parsing works');
const parsed1 = parseShareUrl('https://cluevra.com/?letters=are%3F&min=3&max=4&sort=length-asc');
assert(parsed1.letters === 'are?', 'Parsed letters decodes to "are?"');
assert(parsed1.minLength === 3, 'Parsed minLength is 3');
assert(parsed1.maxLength === 4, 'Parsed maxLength is 4');
assert(parsed1.sortBy === 'length-asc', 'Parsed sortBy is "length-asc"');
assert(parsed1.hasParams === true, 'Parsed hasParams is true');

// 21. Invalid share URL parameters are handled safely
console.log('\nTest 21: Invalid share URL parameters are handled safely');
const parsedInvalid = parseShareUrl('https://cluevra.com/?letters=<b>test</b>123!&min=invalid&max=-5&sort=malicious');
assert(parsedInvalid.letters === 'btestb', 'Special characters and tags stripped safely');
assert(parsedInvalid.minLength === 2, 'Default minLength (2) used for invalid min');
assert(parsedInvalid.maxLength === 15, 'Default maxLength (15) used for invalid max');
assert(parsedInvalid.sortBy === 'length-desc', 'Default sort used for invalid sort');

// 22. Recent searches are limited to 5
console.log('\nTest 22: Recent searches are limited to 5');
clearRecentSearches();
saveRecentSearch({ letters: 'ONE', minLength: 2, maxLength: 15, sortBy: 'length-desc' });
saveRecentSearch({ letters: 'TWO', minLength: 2, maxLength: 15, sortBy: 'length-desc' });
saveRecentSearch({ letters: 'THREE', minLength: 2, maxLength: 15, sortBy: 'length-desc' });
saveRecentSearch({ letters: 'FOUR', minLength: 2, maxLength: 15, sortBy: 'length-desc' });
saveRecentSearch({ letters: 'FIVE', minLength: 2, maxLength: 15, sortBy: 'length-desc' });
saveRecentSearch({ letters: 'SIX', minLength: 2, maxLength: 15, sortBy: 'length-desc' });

const recentList = getRecentSearches();
assert(recentList.length === 5, `Recent searches capped at 5 (got ${recentList.length})`);
assert(recentList[0].letters === 'SIX', 'Most recent search is at the top');
assert(!recentList.some((item) => item.letters === 'ONE'), 'Oldest search dropped beyond 5 items');

// 23. Copy-all formatting works where testable
console.log('\nTest 23: Copy-all formatting works where testable');
const sampleGroups = groupResultsByLength(['rate', 'tare', 'tear', 'are', 'art', 'eat', 'tea']);
const clipboardText = formatGroupsForClipboard(sampleGroups);
assert(clipboardText.includes('4 Letter Words\nRATE\nTARE\nTEAR'), 'Includes 4 Letter Words section');
assert(clipboardText.includes('3 Letter Words\nARE\nART\nEAT\nTEA'), 'Includes 3 Letter Words section');

// 24. SEO: /word-unscrambler URL parsing works seamlessly
console.log('\nTest 24: SEO /word-unscrambler URL parsing works');
const parsedWordUnscrambler = parseShareUrl('https://cluevra.com/word-unscrambler?letters=are%3F&min=3&max=4&sort=length-desc');
assert(parsedWordUnscrambler.letters === 'are?', 'Parses letters from /word-unscrambler path');
assert(parsedWordUnscrambler.minLength === 3, 'Parses minLength from /word-unscrambler path');
assert(parsedWordUnscrambler.maxLength === 4, 'Parses maxLength from /word-unscrambler path');
assert(parsedWordUnscrambler.sortBy === 'length-desc', 'Parses sortBy from /word-unscrambler path');
assert(parsedWordUnscrambler.hasParams === true, 'hasParams is true for /word-unscrambler path');

// 25. SEO: buildShareUrl with /word-unscrambler base preserves path
console.log('\nTest 25: SEO buildShareUrl preserves /word-unscrambler path');
const seoShareUrl = buildShareUrl('aret', { minLength: 3, maxLength: 6, sortBy: 'alpha-asc' }, 'https://cluevra.com/word-unscrambler');
assert(seoShareUrl.startsWith('https://cluevra.com/word-unscrambler?'), 'Share URL retains /word-unscrambler path');
assert(seoShareUrl.includes('letters=aret'), 'Share URL contains letters=aret');
assert(seoShareUrl.includes('min=3'), 'Share URL contains min=3');
assert(seoShareUrl.includes('max=6'), 'Share URL contains max=6');
assert(seoShareUrl.includes('sort=alpha-asc'), 'Share URL contains sort=alpha-asc');

// 26. SEO: SITE_CONFIG canonical URL is properly structured
console.log('\nTest 26: SITE_CONFIG canonical URL is structured correctly');
import { SITE_CONFIG } from '../config/site.ts';
assert(SITE_CONFIG.canonicalUrl === 'https://cluevra.com/word-unscrambler', 'Canonical URL is https://cluevra.com/word-unscrambler');
assert(SITE_CONFIG.productionPath === '/word-unscrambler', 'Production path is /word-unscrambler');
assert(SITE_CONFIG.title.includes('Word Unscrambler'), 'Title includes Word Unscrambler');
assert(SITE_CONFIG.description.length >= 140 && SITE_CONFIG.description.length <= 165, 'Description is 140-165 chars');

// 27. SEO: FAQ data contains all 7 required search intent items
console.log('\nTest 27: FAQ data has all search intent Q&As');
import { FAQ_DATA } from '../data/faqData.ts';
assert(FAQ_DATA.length >= 7, `FAQ contains at least 7 questions (got ${FAQ_DATA.length})`);
assert(FAQ_DATA.some((q) => q.question.toLowerCase().includes('what is a word unscrambler')), 'Has "What is a word unscrambler?"');
assert(FAQ_DATA.some((q) => q.question.toLowerCase().includes('how do i unscramble')), 'Has "How do I unscramble letters?"');
assert(FAQ_DATA.some((q) => q.question.toLowerCase().includes('duplicate letters')), 'Has "Can I use duplicate letters?"');
assert(FAQ_DATA.some((q) => q.question.toLowerCase().includes('blank or wildcard')), 'Has "Can I use blank or wildcard tiles?"');
assert(FAQ_DATA.some((q) => q.question.toLowerCase().includes('filter words by length')), 'Has "Can I filter words by length?"');
assert(FAQ_DATA.some((q) => q.question.toLowerCase().includes('work on mobile')), 'Has "Does the tool work on mobile?"');
assert(FAQ_DATA.some((q) => q.question.toLowerCase().includes('is the word unscrambler free')), 'Has "Is the Word Unscrambler free?"');

// 28. Router: Route resolution from pathname
console.log('\nTest 28: Router maps paths correctly to AppRoute');
import { getRouteFromPath, getPathFromRoute } from './router.ts';
assert(getRouteFromPath('/') === 'home', 'Path / maps to home');
assert(getRouteFromPath('/word-unscrambler') === 'home', 'Path /word-unscrambler maps to home');
assert(getRouteFromPath('/word-unscrambler/') === 'home', 'Path /word-unscrambler/ maps to home');
assert(getRouteFromPath('/about') === 'about', 'Path /about maps to about');
assert(getRouteFromPath('/about/') === 'about', 'Path /about/ maps to about');
assert(getRouteFromPath('/privacy-policy') === 'privacy', 'Path /privacy-policy maps to privacy');
assert(getRouteFromPath('/terms') === 'terms', 'Path /terms maps to terms');
assert(getRouteFromPath('/contact') === 'contact', 'Path /contact maps to contact');
assert(getRouteFromPath('/unknown-path') === 'home', 'Unknown path defaults to home');

// 29. Router: Path mapping from AppRoute
console.log('\nTest 29: Router maps AppRoute back to canonical paths');
assert(getPathFromRoute('home') === '/word-unscrambler', 'home maps to /word-unscrambler');
assert(getPathFromRoute('about') === '/about', 'about maps to /about');
assert(getPathFromRoute('privacy') === '/privacy-policy', 'privacy maps to /privacy-policy');
assert(getPathFromRoute('terms') === '/terms', 'terms maps to /terms');
assert(getPathFromRoute('contact') === '/contact', 'contact maps to /contact');

// 30. Site Config: Pages config has valid metadata for all essential pages
console.log('\nTest 30: Site Config defines valid metadata for all pages');
assert(SITE_CONFIG.pages.home.title.includes('Word Unscrambler'), 'Home page title');
assert(SITE_CONFIG.pages.about.title.includes('About'), 'About page title');
assert(SITE_CONFIG.pages.privacy.title.includes('Privacy'), 'Privacy page title');
assert(SITE_CONFIG.pages.terms.title.includes('Terms'), 'Terms page title');
assert(SITE_CONFIG.pages.contact.title.includes('Contact'), 'Contact page title');
assert(SITE_CONFIG.pages.sixLetterUnscrambler.title.includes('6 Letter Word Unscrambler'), '6-letter page title');
assert(SITE_CONFIG.pages.sevenLetterUnscrambler.title.includes('7 Letter Word Unscrambler'), '7-letter page title');
assert(SITE_CONFIG.pages.about.description.length > 50, 'About page description');
assert(SITE_CONFIG.pages.privacy.description.length > 50, 'Privacy page description');
assert(SITE_CONFIG.pages.terms.description.length > 50, 'Terms page description');
assert(SITE_CONFIG.pages.contact.description.length > 50, 'Contact page description');

// 31. Site Config: Support contact email is properly configured
console.log('\nTest 31: Support contact email configured');
assert(SITE_CONFIG.contactEmail === 'neethashree13@gmail.com', 'Contact email is configured with actual support email');

// 32. Sitemap XML file contains all 5 valid pages and no invalid ones
console.log('\nTest 32: Sitemap contains all 5 existing pages');
import fs from 'node:fs';
import path from 'node:path';
const sitemapContent = fs.readFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), 'utf-8');
assert(sitemapContent.includes('<loc>https://cluevra.com/word-unscrambler</loc>'), 'Sitemap includes /word-unscrambler');
assert(sitemapContent.includes('<loc>https://cluevra.com/about</loc>'), 'Sitemap includes /about');
assert(sitemapContent.includes('<loc>https://cluevra.com/privacy-policy</loc>'), 'Sitemap includes /privacy-policy');
assert(sitemapContent.includes('<loc>https://cluevra.com/terms</loc>'), 'Sitemap includes /terms');
assert(sitemapContent.includes('<loc>https://cluevra.com/contact</loc>'), 'Sitemap includes /contact');

// 33. Alphabetical A-Z sorting orders all matching words globally without length grouping
console.log('\nTest 33: Alphabetical A-Z sorting orders all words globally');
const resAlphaTest = findWordsFromLetters('AARET', { minLength: 3, maxLength: 4, sortBy: 'alpha-asc' });
const expected16Words = [
  'are',
  'area',
  'art',
  'ate',
  'ear',
  'eat',
  'era',
  'eta',
  'rat',
  'rate',
  'ret',
  'tae',
  'tar',
  'tare',
  'tea',
  'tear',
];
assert(resAlphaTest.totalWords === 16, `Found exactly 16 words (got ${resAlphaTest.totalWords})`);
assert(
  JSON.stringify(resAlphaTest.allWords) === JSON.stringify(expected16Words),
  'allWords matches the exact 16-word global alphabetical list'
);
assert(resAlphaTest.groups.length === 1, 'groups has exactly 1 group for alpha-asc');
assert(
  JSON.stringify(resAlphaTest.groups[0].words) === JSON.stringify(expected16Words),
  'groups[0].words matches the exact 16-word global alphabetical list'
);
const alphaClipboard = formatGroupsForClipboard(resAlphaTest.groups);
assert(alphaClipboard.includes('Words (A to Z)'), 'Clipboard formatting includes Words (A to Z) header');
assert(alphaClipboard.includes('ARE\nAREA\nART\nATE'), 'Clipboard contains words in global alphabetical order');

// 34. SEO & Share: buildShareUrl uses canonical URL and no localhost
console.log('\nTest 34: buildShareUrl default fallback contains no localhost and uses canonical base');
const defaultShare = buildShareUrl('test', { minLength: 2, maxLength: 15, sortBy: 'length-desc' });
assert(!defaultShare.includes('localhost'), 'buildShareUrl does not use localhost in SSR/fallback');
assert(defaultShare.startsWith(SITE_CONFIG.canonicalUrl) || defaultShare.startsWith('http'), 'buildShareUrl uses valid base');

// 35. SEO: Each page has a unique title and no duplicate titles
console.log('\nTest 35: All pages have unique non-empty SEO titles and descriptions');
const pageKeys = Object.keys(SITE_CONFIG.pages) as (keyof typeof SITE_CONFIG.pages)[];
const titles = pageKeys.map((k) => SITE_CONFIG.pages[k].title);
const uniqueTitles = new Set(titles);
assert(uniqueTitles.size === pageKeys.length, 'Every page has a unique title');
for (const k of pageKeys) {
  assert(SITE_CONFIG.pages[k].description.length > 50, `${k} description is robust`);
}

// 36. Sitemap includes 6-letter, 7-letter, and 8-letter word unscramblers
console.log('\nTest 36: Sitemap includes 6-letter, 7-letter, and 8-letter word unscramblers');
assert(
  sitemapContent.includes('<loc>https://cluevra.com/6-letter-word-unscrambler</loc>'),
  'Sitemap includes /6-letter-word-unscrambler'
);
assert(
  sitemapContent.includes('<loc>https://cluevra.com/7-letter-word-unscrambler</loc>'),
  'Sitemap includes /7-letter-word-unscrambler'
);
assert(
  sitemapContent.includes('<loc>https://cluevra.com/8-letter-word-unscrambler</loc>'),
  'Sitemap includes /8-letter-word-unscrambler'
);

// 37. 6-Letter Word Unscrambler test cases
console.log('\nTest 37: 6-letter test queries (AARET?, PLANET, STREAM, GARDEN)');
// Load full dictionary to test live dictionary stats
const dictWords = fs.readFileSync(path.join(process.cwd(), 'public', 'dictionary.txt'), 'utf-8').split(/\r?\n/);
import { dictionaryService } from './dictionary.ts';
dictionaryService.initFromList(dictWords, 'full');

const sixLetterFilters: { minLength: number; maxLength: number; sortBy: 'alpha-asc' } = {
  minLength: 6,
  maxLength: 6,
  sortBy: 'alpha-asc',
};

const resAaretWild = findWordsFromLetters('AARET?', sixLetterFilters);
assert(resAaretWild.totalWords === 9, `AARET? returns exactly 9 6-letter words (got ${resAaretWild.totalWords})`);
assert(resAaretWild.allWords.includes('aerate'), 'AARET? includes aerate');
assert(resAaretWild.allWords.includes('karate'), 'AARET? includes karate');

const resPlanet = findWordsFromLetters('PLANET', sixLetterFilters);
assert(resPlanet.totalWords === 2, `PLANET returns exactly 2 6-letter words (got ${resPlanet.totalWords})`);
assert(resPlanet.allWords.includes('planet'), 'PLANET includes planet');
assert(resPlanet.allWords.includes('platen'), 'PLANET includes platen');

const resStream = findWordsFromLetters('STREAM', sixLetterFilters);
assert(resStream.totalWords === 7, `STREAM returns exactly 7 6-letter words (got ${resStream.totalWords})`);
assert(resStream.allWords.includes('stream'), 'STREAM includes stream');
assert(resStream.allWords.includes('master'), 'STREAM includes master');

const resGarden = findWordsFromLetters('GARDEN', sixLetterFilters);
assert(resGarden.totalWords === 4, `GARDEN returns exactly 4 6-letter words (got ${resGarden.totalWords})`);
assert(resGarden.allWords.includes('garden'), 'GARDEN includes garden');
assert(resGarden.allWords.includes('danger'), 'GARDEN includes danger');

// 38. 7-Letter preservation: ARETSL? must still show 57 words
console.log('\nTest 38: 7-letter preservation (ARETSL? returns 57 words)');
const sevenLetterFilters: { minLength: number; maxLength: number; sortBy: 'alpha-asc' } = {
  minLength: 7,
  maxLength: 7,
  sortBy: 'alpha-asc',
};
const resAretsl = findWordsFromLetters('ARETSL?', sevenLetterFilters);
assert(resAretsl.totalWords === 57, `ARETSL? returns exactly 57 words (got ${resAretsl.totalWords})`);

// 39. 8-Letter Word Unscrambler test cases (NOTEBOOK, COMPUTER, TREASURE, LANGUAGE, NOTEBOO?)
console.log('\nTest 39: 8-letter test queries (NOTEBOOK, COMPUTER, TREASURE, LANGUAGE, NOTEBOO?)');
const eightLetterFilters: { minLength: number; maxLength: number; sortBy: 'alpha-asc' } = {
  minLength: 8,
  maxLength: 8,
  sortBy: 'alpha-asc',
};

const resNotebook = findWordsFromLetters('NOTEBOOK', eightLetterFilters);
assert(resNotebook.totalWords === 1, `NOTEBOOK returns 1 word (got ${resNotebook.totalWords})`);
assert(resNotebook.allWords.includes('notebook'), 'NOTEBOOK includes notebook');

const resComputer = findWordsFromLetters('COMPUTER', eightLetterFilters);
assert(resComputer.totalWords === 1, `COMPUTER returns 1 word (got ${resComputer.totalWords})`);
assert(resComputer.allWords.includes('computer'), 'COMPUTER includes computer');

const resTreasure = findWordsFromLetters('TREASURE', eightLetterFilters);
assert(resTreasure.totalWords === 2, `TREASURE returns 2 words (got ${resTreasure.totalWords})`);
assert(resTreasure.allWords.includes('treasure'), 'TREASURE includes treasure');
assert(resTreasure.allWords.includes('austerer'), 'TREASURE includes austerer');

const resLanguage = findWordsFromLetters('LANGUAGE', eightLetterFilters);
assert(resLanguage.totalWords === 1, `LANGUAGE returns 1 word (got ${resLanguage.totalWords})`);
assert(resLanguage.allWords.includes('language'), 'LANGUAGE includes language');

const resNotebookWild = findWordsFromLetters('NOTEBOO?', eightLetterFilters);
assert(resNotebookWild.totalWords === 1, `NOTEBOO? returns 1 word (got ${resNotebookWild.totalWords})`);
assert(resNotebookWild.allWords.includes('notebook'), 'NOTEBOO? includes notebook');

// 40. 8-Letter wildcard constraints and validation
console.log('\nTest 40: 8-letter wildcard limits and validation');
import { parseAndValidateInput } from './unscrambler.ts';
const val3Wildcards = parseAndValidateInput('ABCDE???', eightLetterFilters);
assert(val3Wildcards.isValid === true, '3 wildcards are allowed');

const val4Wildcards = parseAndValidateInput('ABCD????', eightLetterFilters);
assert(val4Wildcards.isValid === false, '4 wildcards are rejected');
assert(val4Wildcards.validationError?.includes('limit wildcards') === true, 'Validation error mentions wildcard limit');

// 41. Router maps 8-letter route properly
console.log('\nTest 41: Router handles 8-letter route');
assert(getRouteFromPath('/8-letter-word-unscrambler') === 'eightLetterUnscrambler', 'Path /8-letter-word-unscrambler maps to eightLetterUnscrambler');
assert(getRouteFromPath('/8-letter-word-unscrambler/') === 'eightLetterUnscrambler', 'Path with trailing slash maps to eightLetterUnscrambler');
assert(getPathFromRoute('eightLetterUnscrambler') === '/8-letter-word-unscrambler', 'eightLetterUnscrambler maps back to /8-letter-word-unscrambler');

// 42. Router and Site Config handle /anagram-solver
console.log('\nTest 42: Router and Site Config handle /anagram-solver');
assert(getRouteFromPath('/anagram-solver') === 'anagramSolver', 'Path /anagram-solver maps to anagramSolver');
assert(getRouteFromPath('/anagram-solver/') === 'anagramSolver', 'Path /anagram-solver/ maps to anagramSolver');
assert(getPathFromRoute('anagramSolver') === '/anagram-solver', 'anagramSolver maps back to /anagram-solver');
assert(Boolean(SITE_CONFIG.pages.anagramSolver), 'Site config defines anagramSolver page');
assert(SITE_CONFIG.pages.anagramSolver.title.includes('Anagram Solver'), 'Title includes Anagram Solver');
assert(SITE_CONFIG.pages.anagramSolver.description.length > 50, 'Description is descriptive and robust');

// 43. Sitemap includes /anagram-solver
console.log('\nTest 43: Sitemap includes /anagram-solver');
assert(sitemapContent.includes('<loc>https://cluevra.com/anagram-solver</loc>'), 'Sitemap includes /anagram-solver');

console.log('\n🎉 ALL 43 UNIT AND INTEGRATION TESTS PASSED FLAWLESSLY!\n');

