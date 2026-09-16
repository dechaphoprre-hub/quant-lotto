/**
 * Turns a pasted news headline/description into candidate lottery numbers,
 * the same way Thai "เลขข่าว" sites read a plate number, an age, or a date
 * out of a story. This is plain, deterministic digit extraction — not an
 * AI reading the article for meaning — so it's honest to label it that way
 * in the UI: it surfaces the numbers already present in the text using
 * well-known folklore conventions (last two digits, reversed, digit-sum),
 * it does not understand or verify the story.
 */
export function extractNumbersFromText(text: string, maxCandidates = 12): string[] {
  const digitRuns = text.match(/\d{1,6}/g) ?? [];
  const candidates: string[] = [];
  const seen = new Set<string>();

  const add = (value: string) => {
    if (!seen.has(value)) {
      seen.add(value);
      candidates.push(value);
    }
  };

  digitRuns.forEach(run => {
    if (run.length >= 2) {
      add(run.slice(-2));
      add(run.slice(0, 2));
      add(run.slice(-2).split('').reverse().join(''));
    } else {
      add(run.padStart(2, '0'));
    }
    const digitSum = run.split('').reduce((sum, digit) => sum + Number(digit), 0);
    add(String(digitSum % 100).padStart(2, '0'));
  });

  return candidates.slice(0, maxCandidates);
}
