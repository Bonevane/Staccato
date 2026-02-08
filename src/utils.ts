/** Compute the anchor-letter index: floor(length / 2) - 1, min 0 */
export function getAnchorIndex(word: string): number {
  if (word.length <= 1) return 0;
  if (word.length <= 3) return 1;
  return Math.floor(word.length / 2) - 1;
}

/** Naïve extractive summariser — pulls sentences that look "important" */
export function extractSummary(text: string, maxBullets = 6): string[] {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 20);

  if (sentences.length === 0) return ["No text to summarise."];

  // Score sentences by avg word length + position bonus
  const scored = sentences.map((s, i) => {
    const words = s.split(/\s+/);
    const avgLen = words.reduce((a, w) => a + w.length, 0) / words.length;
    const posBonus = i < 3 ? 2 : i > sentences.length - 3 ? 1.5 : 0;
    const hasKeySignal =
      /key|important|significant|discover|found|implicat|insight|radical|profound/i.test(
        s,
      )
        ? 3
        : 0;
    return { text: s.trim(), score: avgLen + posBonus + hasKeySignal };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxBullets).map((s) => s.text);
}
