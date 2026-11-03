/** Подбор размера шрифта, чтобы длинные кыргызские слова не обрезались. */
export const fitFontSize = (text: string, maxWidth: number, base: number, min = 40) => {
  const longest = text.split(/\s+/).reduce((a, b) => (b.length > a.length ? b : a), "");
  const byWord = maxWidth / (Math.max(longest.length, 1) * 0.62);
  const byTotal = Math.sqrt((maxWidth * maxWidth * 1.9) / Math.max(text.length, 1)) ;
  return Math.max(min, Math.min(base, byWord, byTotal));
};
