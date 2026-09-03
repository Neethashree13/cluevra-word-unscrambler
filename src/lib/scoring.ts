/**
 * Scrabble-style word scoring utility.
 *
 * Provides point calculations based on standard English Scrabble-style letter values.
 * Note: This application is an independent word tool and is not affiliated with,
 * sponsored by, or endorsed by Hasbro, Mattel, or Scrabble.
 */

export const SCRABBLE_LETTER_VALUES: Readonly<Record<string, number>> = Object.freeze({
  a: 1,
  b: 3,
  c: 3,
  d: 2,
  e: 1,
  f: 4,
  g: 2,
  h: 4,
  i: 1,
  j: 8,
  k: 5,
  l: 1,
  m: 3,
  n: 1,
  o: 1,
  p: 3,
  q: 10,
  r: 1,
  s: 1,
  t: 1,
  u: 1,
  v: 4,
  w: 4,
  x: 8,
  y: 4,
  z: 10,
});

/**
 * Calculates the Scrabble-style score for an individual word.
 * Treats uppercase, lowercase, and mixed-case words identically.
 * Ignores any non-alphabetic characters.
 *
 * Example:
 * calculateWordScore("RATE") -> 4
 * calculateWordScore("QUIZ") -> 22
 */
export function calculateWordScore(word: string): number {
  if (!word || typeof word !== 'string') {
    return 0;
  }

  const lower = word.toLowerCase();
  let totalScore = 0;

  for (let i = 0; i < lower.length; i++) {
    const letter = lower[i];
    const value = SCRABBLE_LETTER_VALUES[letter];
    if (value !== undefined) {
      totalScore += value;
    }
  }

  return totalScore;
}
