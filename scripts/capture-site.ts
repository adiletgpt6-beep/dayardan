/**
 * capture-site.ts — Records REAL screenshots and screen recordings of https://www.dayardan.com
 * with Playwright (mobile viewport 390x844 @ 3x) and writes recordings/manifest.json.
 *
 * Usage:  npx tsx scripts/capture-site.ts            (requires network access to www.dayardan.com)
 *
 * The Remotion compositions read recordings/manifest.json; every capture key that exists
 * is shown inside the PhoneMockup. Missing keys fall back to a neutral motion-graphics card
 * (never a drawn imitation of the real interface).
 *
 * This script only visits PUBLIC pages. It never bypasses authentication.
 */
import { chromium, devices, Page } from "playwright";
import * as fs from "fs";
import * as path from "path";

const BASE = process.env.DAYARDAN_BASE_URL || "https://www.dayardan.com";
const ROOT = path.resolve(__dirname, "..");
const SHOTS = path.join(ROOT, "screenshots");
const RECS = path.join(ROOT, "recordings");
fs.mkdirSync(SHOTS, { recursive: true });
fs.mkdirSync(RECS, { recursive: true });

type Manifest = Record<string, { type: "image" | "video"; file: string; url: string; capturedAt: string; note?: string }>;
const manifestPath = path.join(RECS, "manifest.json");
const manifest: Manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : {};

async function shot(page: Page, key: string, url: string, note?: string) {
  const file = `${key}.png`;
  await page.screenshot({ path: path.join(SHOTS, file), fullPage: false });
  manifest[key] = { type: "image", file: `screenshots/${file}`, url, capturedAt: new Date().toISOString(), note };
  console.log("screenshot", key, url);
}

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROMIUM_PATH || undefined });
  const context = await browser.newContext({
    ...devices["iPhone 13"],
    locale: "ky-KG",
    recordVideo: { dir: RECS, size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();
  const log: string[] = [];
  page.on("console", (m) => log.push(`[console:${m.type()}] ${m.text()}`));

  // 1. Home page (Kyrgyz)
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1500);
  await shot(page, "home", page.url(), "Главная страница, мобильная версия");
  fs.writeFileSync(path.join(SHOTS, "home.html"), await page.content());

  // Collect navigation links for SITE_RESEARCH.md
  const links = await page.$$eval("a[href]", (as) => as.map((a) => ({ text: (a.textContent || "").trim(), href: (a as HTMLAnchorElement).href })));
  fs.writeFileSync(path.join(SHOTS, "links.json"), JSON.stringify(links, null, 2));

  // 2. Known public page
  for (const [key, p] of [["how-it-works", "/ky/how-it-works"], ["how-it-works-ru", "/ru/how-it-works"]] as const) {
    try {
      await page.goto(BASE + p, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1000);
      await shot(page, key, page.url());
    } catch (e) { console.warn("skip", p, (e as Error).message); }
  }

  // 3. Discover test-related pages from the home page links (public only)
  const candidates = links.filter((l) => /test|тест|login|кир|register|катт|signup|result|жыйынтык/i.test(l.href + l.text)).slice(0, 12);
  let i = 0;
  for (const c of candidates) {
    try {
      await page.goto(c.href, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(1000);
      await shot(page, `discovered-${i++}`, page.url(), c.text);
    } catch (e) { console.warn("skip", c.href, (e as Error).message); }
  }

  // 4. Scroll recording of home page (for ScreenRecording component)
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 60000 });
  for (let y = 0; y < 3000; y += 150) { await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "smooth" }), y); await page.waitForTimeout(120); }
  await page.waitForTimeout(800);

  await context.close(); // flushes the video
  const vids = fs.readdirSync(RECS).filter((f) => f.endsWith(".webm")).sort();
  if (vids.length) {
    const last = vids[vids.length - 1];
    manifest["home-scroll"] = { type: "video", file: `recordings/${last}`, url: BASE, capturedAt: new Date().toISOString(), note: "Скролл главной страницы" };
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(SHOTS, "console.log"), log.join("\n"));
  await browser.close();
  console.log("manifest written", manifestPath);
}

main().catch((e) => { console.error("CAPTURE FAILED:", e.message); process.exit(1); });
