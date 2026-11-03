/**
 * Временная фирменная палитра Dayardan.
 * ВНИМАНИЕ: сайт был недоступен из среды (сетевая политика), реальные цвета не получены.
 * После захвата сайта (scripts/capture-site.ts) сверьте значения со скриншотами и обновите здесь.
 */
export const theme = {
  colors: {
    primary: "#2563EB", // основной синий
    primaryDark: "#1E3A8A",
    navy: "#0B1437", // тёмный фон
    navy2: "#101C4D",
    accent: "#FACC15", // жёлтый акцент (кнопки, выделение слов)
    accent2: "#F97316",
    success: "#22C55E",
    danger: "#EF4444",
    white: "#FFFFFF",
    offWhite: "#EEF2FF",
    muted: "#9DB0E8",
    screenBg: "#F5F7FF",
    screenText: "#0F172A",
  },
  fonts: {
    body: "Inter, 'DejaVu Sans', sans-serif",
  },
  layout: {
    width: 1080,
    height: 1920,
    safeTop: 200,
    safeBottom: 320,
    subtitleY: 1500,
  },
  brand: {
    name: "Dayardan",
    url: "dayardan.com",
    tagline: "ЖРТга ишенимдүү даярдан",
  },
} as const;
