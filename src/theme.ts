/**
 * Фирменная палитра Dayardan — снята с реального сайта (2026-11-04, Playwright, getComputedStyle + скриншоты):
 *  кнопки #16A34A, знак DAYARDAN #166534, тёмный CTA-блок #10482C, фон страницы #F9FAFB, текст #111827, шрифт Inter,
 *  логотип — public/brand/logo.png (MainLogo.png с сайта), светлые mint-подложки #F0FDF4 / #DCFCE7.
 */
export const theme = {
  colors: {
    primary: "#16A34A", // кнопки сайта
    primaryDark: "#166534", // знак DAYARDAN / тёмные кнопки форм
    navy: "#06241A", // тёмный фон роликов (глубокий зелёный)
    navy2: "#10482C", // тёмно-зелёный CTA-блок сайта
    accent: "#4ADE80", // подсветка (активное слово субтитров, кольцо кнопки) — светлый зелёный
    accent2: "#86EFAC",
    mint: "#DCFCE7",
    mintLight: "#F0FDF4",
    success: "#22C55E",
    danger: "#EF4444",
    white: "#FFFFFF",
    offWhite: "#ECFDF5",
    muted: "#A7F3D0",
    screenBg: "#F9FAFB",
    screenText: "#111827",
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
    name: "DAYARDAN",
    url: "dayardan.com",
    tagline: "ЖРТга ишенимдүү даярдан",
    logo: "brand/logo.png",
  },
} as const;
