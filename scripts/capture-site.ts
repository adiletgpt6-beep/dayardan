/**
 * capture-site.ts — РЕАЛЬНЫЕ скриншоты, координаты элементов и записи экрана https://www.dayardan.com
 * (Playwright, профиль iPhone 13: 390×844 CSS px, DPR 3 → PNG 1170×2532; записи 780×1688).
 *
 * Usage:  PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npx tsx scripts/capture-site.ts
 * Результат: screenshots/*.png, recordings/*.mp4 (+ .webm), recordings/manifest.json
 * (Playwright пишет страницу 390×844 в левый верхний угол кадра 780×1688 — поэтому mp4 получается crop + upscale ×2.)
 *   manifest[key] = { type, file, url, capturedAt, note, boxes: { name: {x,y,w,h} } }  // boxes — доли viewport
 * Посещаются только ПУБЛИЧНЫЕ страницы; формы не отправляются; авторизация не обходится.
 */
import { chromium, devices, Page, BrowserContext } from "playwright";
import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";

const BASE = process.env.DAYARDAN_BASE_URL || "https://www.dayardan.com";
const ROOT = path.resolve(__dirname, "..");
const SHOTS = path.join(ROOT, "screenshots");
const RECS = path.join(ROOT, "recordings");
fs.mkdirSync(SHOTS, { recursive: true });
fs.mkdirSync(RECS, { recursive: true });
const VP = { width: 390, height: 844 };

type Box = { x: number; y: number; w: number; h: number };
type Entry = { type: "image" | "video"; file: string; url: string; capturedAt: string; note?: string; boxes?: Record<string, Box>; durationSec?: number };
const manifest: Record<string, Entry> = {};
const failures: { url: string; error: string }[] = [];
const pageTexts: Record<string, string> = {};

const now = () => new Date().toISOString();
const box = async (page: Page, selector: string | (() => Promise<any>), name: string, boxes: Record<string, Box>) => {
  try {
    const loc = typeof selector === "string" ? page.locator(selector).first() : await selector();
    const b = await loc.boundingBox();
    if (b) boxes[name] = { x: +(b.x / VP.width).toFixed(4), y: +(b.y / VP.height).toFixed(4), w: +(b.width / VP.width).toFixed(4), h: +(b.height / VP.height).toFixed(4) };
  } catch (e) { console.warn("box miss", name, (e as Error).message.split("\n")[0]); }
};
const byText = (page: Page, text: string, tag = "a, button") => page.locator(tag, { hasText: text }).first();
const shot = async (page: Page, key: string, note: string, boxes: Record<string, Box> = {}) => {
  await page.waitForTimeout(600);
  const file = `${key}.png`;
  await page.screenshot({ path: path.join(SHOTS, file) });
  manifest[key] = { type: "image", file: `screenshots/${file}`, url: page.url(), capturedAt: now(), note, boxes };
  console.log("shot", key, Object.keys(boxes).join(","));
};
const scrollTo = async (page: Page, text: string, offset = 90) => {
  await page.evaluate(({ text, offset }) => {
    const els = [...document.querySelectorAll("h1,h2,h3,p,span,div,a,button")].filter((e) => (e.textContent || "").trim().startsWith(text));
    const el = els.sort((a, b) => a.textContent!.length - b.textContent!.length)[0];
    if (el) { const y = el.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior }); }
  }, { text, offset });
  await page.waitForTimeout(500);
};
const smoothScroll = async (page: Page, to: number, step = 14, delay = 16) => {
  const from = await page.evaluate(() => window.scrollY);
  for (let y = from; y < to; y += step) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(delay); }
};
const goto = async (page: Page, p: string) => {
  await page.goto(BASE + p, { waitUntil: "networkidle", timeout: 60000 }).catch((e) => console.warn("goto", p, e.message.split("\n")[0]));
  await page.waitForTimeout(800);
  pageTexts[p] = await page.evaluate(() => document.body.innerText);
};

async function screenshots(ctx: BrowserContext) {
  const page = await ctx.newPage();
  page.on("requestfailed", (r) => failures.push({ url: r.url(), error: r.failure()?.errorText || "" }));

  // ---- home ----
  await goto(page, "/ky");
  { const b: Record<string, Box> = {}; await box(page, () => Promise.resolve(byText(page, "Сынамык тестти баштоо")), "cta", b); await box(page, () => Promise.resolve(byText(page, "Кантип иштейт?")), "how", b);
    await box(page, "header button, header a[href*='menu']", "menu", b); await box(page, "header", "header", b); await shot(page, "home", "Башкы бет (верх): заголовок, кнопки «Сынамык тестти баштоо» и «Кантип иштейт?»", b); }
  await scrollTo(page, "Тесттин жыйынтыгы", 60);
  { const b: Record<string, Box> = {}; await box(page, () => Promise.resolve(page.locator("div", { hasText: /^Мисал/ }).first()), "example", b); await shot(page, "home-result-demo", "Башкы бет: пример экрана результата (72 %, 144/200, Туура/Ката/Жоопсуз, Көңүл буруучу темалар)", b); }
  await scrollTo(page, "Даярдануу үчүн керектүүнүн", 110);
  await shot(page, "home-features", "Башкы бет: «Даярдануу үчүн керектүүнүн баары бир жерде» + демо вопроса с таймером");
  await scrollTo(page, "01 / СЫНАМЫК ТЕСТ", 70);
  { const b: Record<string, Box> = {}; await box(page, () => Promise.resolve(byText(page, "В) 30", "button, div, label")), "optC", b); await box(page, () => Promise.resolve(page.locator("text=24:35").first()), "timer", b); await shot(page, "home-demo-question", "Башкы бет: демо вопроса ЖРТ-формата (Математика · 4-суроо, таймер 24:35, варианты А–Г)", b); }
  await scrollTo(page, "02 / АНАЛИЗ", 70);
  await shot(page, "home-analysis", "Башкы бет: «Кайсы темаларга көңүл буруу керек?» — слабые темы (Пайыздар 40 %, Аналогиялар 55 %)");
  await scrollTo(page, "03 / ПРОГРЕСС", 70);
  await shot(page, "home-progress", "Башкы бет: «Өнүгүүңүздү байкап туруңуз» — график прогресса по тестам (+12 балл)");
  await scrollTo(page, "Dayardan кантип иштейт?", 120);
  await shot(page, "home-steps", "Башкы бет: «Жөнөкөй 3 кадам» — Тестти тандаңыз / Тесттен өтүңүз / Жыйынтыкты көрүңүз");
  await scrollTo(page, "Максатыңызга бир кадам", 160);
  { const b: Record<string, Box> = {}; await box(page, () => Promise.resolve(byText(page, "Сынамык тестти баштоо").last()), "cta", b); await shot(page, "home-final-cta", "Башкы бет: финальный блок «Максатыңызга бир кадам жакындаңыз!»", b); }

  // ---- menu ----
  await goto(page, "/ky/menu?from=%2F");
  { const b: Record<string, Box> = {}; await box(page, () => Promise.resolve(byText(page, "Аккаунтка кирүү")), "login", b); await box(page, () => Promise.resolve(byText(page, "Сынамык ЖРТ")), "tests", b); await box(page, () => Promise.resolve(byText(page, "Кантип иштейт?")), "how", b); await box(page, () => Promise.resolve(byText(page, "Башкы бет")), "home", b); await shot(page, "menu", "Мобильное меню: Аккаунтка кирүү, Башкы бет, Сынамык ЖРТ, Кантип иштейт?, Биз жөнүндө, Байланыш", b); }

  // ---- tests hub ----
  await goto(page, "/ky/tests");
  { const b: Record<string, Box> = {}; await box(page, () => Promise.resolve(byText(page, "Тестти тандоо")), "full", b); await shot(page, "tests-hub", "Страница «Максатыңа карай даярдан!»: карточка «Толук ЖРТ тести» + кнопка «Тестти тандоо»", b); }
  await scrollTo(page, "Тематикалык машыгуу", 300);
  { const b: Record<string, Box> = {}; await box(page, () => Promise.resolve(byText(page, "Теманы тандоо")), "thematic", b); await shot(page, "tests-hub-thematic", "Страница выбора: карточка «Тематикалык машыгуу» + кнопка «Теманы тандоо»", b); }
  await goto(page, "/ky/tests/ort");
  await shot(page, "tests-ort", "Список полных ЖРТ-тестов (в среде рендера API заблокирован — показана ошибка загрузки; НЕ используется в роликах)");
  await goto(page, "/ky/tests/subjects");
  await shot(page, "tests-subjects", "Выбор предмета для тематических тестов (API заблокирован — пустой список; НЕ используется)");

  // ---- how it works ----
  await goto(page, "/ky/how-it-works");
  { const b: Record<string, Box> = {}; await box(page, () => Promise.resolve(byText(page, "Сынамык тесттерди көрүү")), "cta", b); await shot(page, "how-it-works", "«Dayardan кантип иштейт?» — верх страницы-руководства", b); }
  await scrollTo(page, "Даярдык жолуңуз", 80);
  await shot(page, "how-steps", "Руководство: «Даярдык жолуңуз — 3 кадам»");
  await scrollTo(page, "Кайсы тесттен баштасаңыз болот?", 90);
  await shot(page, "how-choose", "Руководство: «01 / Тестти тандоо» — полный тест vs тематический");
  await scrollTo(page, "Тест кандай өтөт?", 90);
  await shot(page, "how-take", "Руководство: «02 / Тесттен өтүү» — как проходит тест");
  await scrollTo(page, "Тесттин интерфейси", 60);
  { const b: Record<string, Box> = {}; for (const [n, t] of [["optA", "А"], ["optB", "Б"], ["optC", "В"], ["optD", "Г"], ["next", "Кийинки"], ["back", "Артка"]] as const) await box(page, () => Promise.resolve(page.locator("button", { hasText: new RegExp(`^\\s*${t}\\b`) }).first()), n, b);
    await box(page, () => Promise.resolve(page.locator("text=24:35").first()), "timer", b); await shot(page, "how-demo-question", "Руководство: ДЕМО интерфейса теста — вопрос 1/2, таймер, варианты А–Г, кнопки Артка/Кийинки", b); }
  await page.locator("button", { hasText: /^\s*В\b/ }).first().click().catch(() => {});
  await shot(page, "how-demo-answered", "ДЕМО: выбран вариант В) 30");
  await page.locator("button", { hasText: "Кийинки" }).first().click().catch(() => {});
  await page.waitForTimeout(500);
  { const b: Record<string, Box> = {}; await box(page, () => Promise.resolve(page.locator("button", { hasText: "Кийинки" }).first()), "next", b); await box(page, () => Promise.resolve(page.locator("button", { hasText: "Артка" }).first()), "back", b); await shot(page, "how-demo-next", "ДЕМО: второй вопрос после нажатия «Кийинки»", b); }
  await scrollTo(page, "Тесттен кийин эмне болот?", 90);
  await shot(page, "how-after", "Руководство: «03 / Жыйынтыкты талдоо» — что после теста");
  await scrollTo(page, "Тесттин жыйынтыгы", 60);
  await shot(page, "how-result-demo", "Руководство: МИСАЛ результата — 72 %, 18/25 туура, Туура/Ката/Жоопсуз, Көңүл буруучу темалар");
  await scrollTo(page, "Көңүл буруучу темалар", 120);
  await shot(page, "how-result-topics", "Руководство: блок «Көңүл буруучу темалар» (Пайыздар 40 %, Аналогиялар 55 %)");
  await scrollTo(page, "Көп берилүүчү суроолор", 90);
  await shot(page, "how-faq", "Руководство: FAQ");

  // ---- auth (формы не отправляются) ----
  await goto(page, "/ky/login");
  { const b: Record<string, Box> = {}; await box(page, "input[type=email], input[name=email]", "email", b); await box(page, "input[type=password]", "password", b); await box(page, () => Promise.resolve(page.locator("button", { hasText: /^Кирүү$/ }).first()), "submit", b); await box(page, () => Promise.resolve(byText(page, "Google")), "google", b); await box(page, () => Promise.resolve(page.locator("a", { hasText: "Катталуу" }).first()), "register", b); await shot(page, "login", "Страница «Кирүү»: Google, e-mail, сырсөз, кнопка Кирүү, ссылка Катталуу", b); }
  await goto(page, "/ky/register");
  { const b: Record<string, Box> = {}; const inputs = page.locator("input"); const n = await inputs.count();
    for (let i = 0; i < n; i++) { const bb = await inputs.nth(i).boundingBox(); if (bb) b[["name", "email", "password", "confirm"][i] || `input${i}`] = { x: +(bb.x / VP.width).toFixed(4), y: +(bb.y / VP.height).toFixed(4), w: +(bb.width / VP.width).toFixed(4), h: +(bb.height / VP.height).toFixed(4) }; }
    await box(page, () => Promise.resolve(page.locator("button", { hasText: /^Катталуу$/ }).first()), "submit", b); await box(page, () => Promise.resolve(byText(page, "Google")), "google", b); await shot(page, "register", "Страница «Катталуу»: Google, Атыңыз, e-mail, сырсөз ×2, кнопка Катталуу", b); }
  // register with sample text typed (not submitted)
  await page.locator("input").nth(0).fill("Айгерим").catch(() => {});
  await page.locator("input").nth(1).fill("aigerim@example.com").catch(() => {});
  await page.locator("input").nth(2).fill("Daiardan2027!").catch(() => {});
  await page.locator("input").nth(3).fill("Daiardan2027!").catch(() => {});
  await shot(page, "register-filled", "Страница «Катталуу» с примером заполнения (форма НЕ отправлялась)");

  await goto(page, "/ky/about"); await shot(page, "about", "Биз жөнүндө");
  await goto(page, "/ky/contact"); await shot(page, "contact", "Байланыш: WhatsApp, Telegram, e-mail, Instagram");
  await page.close();
}

async function recordings(browser: any) {
  const rec = async (key: string, note: string, fn: (page: Page) => Promise<void>) => {
    const ctx = await browser.newContext({ ...devices["iPhone 13"], viewport: VP, locale: "ky-KG", recordVideo: { dir: RECS, size: { width: 780, height: 1688 } } });
    const page = await ctx.newPage();
    const v = page.video();
    try { await fn(page); } catch (e) { console.warn("rec", key, (e as Error).message.split("\n")[0]); }
    await page.waitForTimeout(400);
    await ctx.close();
    const webm = await v!.path();
    const target = path.join(RECS, `${key}.webm`); fs.renameSync(webm, target);
    const mp4 = path.join(RECS, `${key}.mp4`);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", target, "-vf", `crop=${VP.width}:${VP.height}:0:0,scale=${VP.width * 2}:${VP.height * 2}:flags=lanczos`, "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", "-an", "-movflags", "+faststart", mp4]);
    const dur = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4]).toString());
    manifest[key] = { type: "video", file: `recordings/${key}.mp4`, url: BASE, capturedAt: now(), note, durationSec: +dur.toFixed(2) };
    console.log("rec", key, dur.toFixed(1) + "s");
  };
  await rec("rec-home-scroll", "Запись: плавный скролл главной страницы (верх → пример результата → возможности)", async (page) => {
    await page.goto(BASE + "/ky", { waitUntil: "networkidle", timeout: 60000 }); await page.waitForTimeout(1200); await smoothScroll(page, 2600, 10, 16); await page.waitForTimeout(600);
  });
  await rec("rec-home-menu", "Запись: главная → открытие мобильного меню", async (page) => {
    await page.goto(BASE + "/ky", { waitUntil: "networkidle", timeout: 60000 }); await page.waitForTimeout(1500);
    await page.locator("header button, header a[href*='menu']").first().click(); await page.waitForTimeout(2500);
  });
  await rec("rec-tests-hub", "Запись: страница выбора типа теста (полный / тематический), скролл", async (page) => {
    await page.goto(BASE + "/ky/tests", { waitUntil: "networkidle", timeout: 60000 }); await page.waitForTimeout(1500); await smoothScroll(page, 900, 8, 16); await page.waitForTimeout(800);
  });
  await rec("rec-demo-answer", "Запись: ДЕМО интерфейса теста на странице «Кантип иштейт?» — выбор варианта В и нажатие «Кийинки»", async (page) => {
    await page.goto(BASE + "/ky/how-it-works", { waitUntil: "networkidle", timeout: 60000 }); await scrollTo(page, "Тесттин интерфейси", 60); await page.waitForTimeout(1500);
    await page.locator("button", { hasText: /^\s*В\b/ }).first().click(); await page.waitForTimeout(1500);
    await page.locator("button", { hasText: "Кийинки" }).first().click(); await page.waitForTimeout(2200);
  });
  await rec("rec-how-result", "Запись: скролл к примеру результата и слабым темам на странице «Кантип иштейт?»", async (page) => {
    await page.goto(BASE + "/ky/how-it-works", { waitUntil: "networkidle", timeout: 60000 }); await scrollTo(page, "Тесттен кийин эмне болот?", 90); await page.waitForTimeout(1000);
    const y = await page.evaluate(() => window.scrollY); await smoothScroll(page, y + 1500, 8, 16); await page.waitForTimeout(800);
  });
  await rec("rec-register-typing", "Запись: заполнение формы «Катталуу» примером (форма НЕ отправляется)", async (page) => {
    await page.goto(BASE + "/ky/register", { waitUntil: "networkidle", timeout: 60000 }); await page.waitForTimeout(1200);
    await page.locator("input").nth(0).pressSequentially("Айгерим", { delay: 90 }); await page.waitForTimeout(400);
    await page.locator("input").nth(1).pressSequentially("aigerim@example.com", { delay: 60 }); await page.waitForTimeout(400);
    await page.locator("input").nth(2).pressSequentially("Daiardan2027!", { delay: 70 }); await page.waitForTimeout(300);
    await page.locator("input").nth(3).pressSequentially("Daiardan2027!", { delay: 70 }); await page.waitForTimeout(1200);
  });
}

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
  const ctx = await browser.newContext({ ...devices["iPhone 13"], viewport: VP, locale: "ky-KG" });
  await screenshots(ctx);
  await ctx.close();
  await recordings(browser);
  await browser.close();
  fs.writeFileSync(path.join(RECS, "manifest.json"), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(SHOTS, "network-failures.json"), JSON.stringify([...new Map(failures.map((f) => [f.url.split("?")[0], f])).values()], null, 2));
  fs.writeFileSync(path.join(SHOTS, "page-texts.json"), JSON.stringify(pageTexts, null, 2));
  console.log(`manifest: ${Object.keys(manifest).length} entries; failed requests: ${failures.length}`);
}
main().catch((e) => { console.error("CAPTURE FAILED:", e.message); process.exit(1); });
