import type { WordTiming } from "../types";

export interface Chunk { words: WordTiming[]; start: number; end: number; }

/** Разбивает слова на короткие строки субтитров (до ~30 символов / 5 слов); границы — по знакам препинания; без «сиротских» слов. */
export const chunkWords = (words: WordTiming[], maxChars = 30, maxWords = 5): Chunk[] => {
  const sentences: WordTiming[][] = [];
  let cur: WordTiming[] = [];
  for (const w of words) { cur.push(w); if (/[.!?…]$/.test(w.w)) { sentences.push(cur); cur = []; } }
  if (cur.length) sentences.push(cur);
  const chunks: Chunk[] = [];
  for (const s of sentences) {
    const total = s.reduce((a, b) => a + b.w.length + 1, 0) - 1;
    const parts = Math.max(1, Math.ceil(total / maxChars), Math.ceil(s.length / maxWords));
    const per = Math.ceil(s.length / parts);
    for (let i = 0; i < s.length; i += per) {
      let slice = s.slice(i, i + per);
      // сирота в конце предложения — прикрепить к предыдущему, если влезает
      if (slice.length === 1 && chunks.length && chunks[chunks.length - 1].words.reduce((a, b) => a + b.w.length + 1, 0) + slice[0].w.length <= maxChars + 6 && i > 0) {
        chunks[chunks.length - 1].words.push(slice[0]); chunks[chunks.length - 1].end = slice[0].e; continue;
      }
      chunks.push({ words: slice, start: slice[0].s, end: slice[slice.length - 1].e });
    }
  }
  for (let i = 0; i < chunks.length; i++) {
    const next = chunks[i + 1];
    const hold = next ? Math.min(next.start, chunks[i].end + 1.2) : chunks[i].end + 1.5;
    chunks[i].end = Math.max(chunks[i].end, hold);
  }
  return chunks;
};
