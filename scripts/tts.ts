/**
 * tts.ts — кыргызская озвучка через ElevenLabs (eleven_v3, нативные кыргызские голоса аккаунта)
 * с посимвольными таймингами → audio/, subtitles/, production/DAY-xxx/timing.json.
 *
 * Usage: npx tsx scripts/tts.ts [DAY-001 ...]   (без аргументов — все)
 * Кэш: если production/DAY-xxx/timing.json существует и хеш текста совпадает — запрос НЕ повторяется (без списаний).
 * Ключ берётся из ELEVENLABS_API_KEY (никогда не сохраняется в репозитории).
 */
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { execFileSync } from "child_process";

const ROOT = path.resolve(__dirname, "..");
const FPS = 30;
const LEAD = 0.6; // сек тишины до речи
const TAIL_MIN = 3.5; // минимум после речи (CTA)
const TARGET = 55, MIN = 55, MAX = 60;
const MODEL = process.env.ELEVEN_MODEL || "eleven_v3";
const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.error("ELEVENLABS_API_KEY is not set"); process.exit(1); }

const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(path.join(ROOT, "production")).filter((d) => /^DAY-\d{3}$/.test(d)).sort();
const costsPath = path.join(ROOT, "production/costs.json");
const costs: { requests: { id: string; chars: number; model: string; voice: string; at: string }[] } = fs.existsSync(costsPath) ? JSON.parse(fs.readFileSync(costsPath, "utf8")) : { requests: [] };

const wordsFromAlignment = (chars: string[], st: number[], en: number[]) => {
  const words: { w: string; s: number; e: number }[] = [];
  let cur = "", ws = 0, we = 0;
  chars.forEach((c, i) => {
    if (/\s/.test(c)) { if (cur) { words.push({ w: cur, s: ws, e: we }); cur = ""; } }
    else { if (!cur) ws = st[i]; cur += c; we = en[i]; }
  });
  if (cur) words.push({ w: cur, s: ws, e: we });
  return words;
};
const srtTime = (t: number) => { const ms = Math.round(t * 1000); const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000), x = ms % 1000; return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(x).padStart(3, "0")}`; };

async function one(id: string) {
  const dir = path.join(ROOT, "production", id);
  const cfg = JSON.parse(fs.readFileSync(path.join(dir, "script.json"), "utf8"));
  const sayParts: string[] = cfg.scenes.map((s: any) => String(s.say).trim());
  const text = sayParts.join(" ");
  const hash = crypto.createHash("sha1").update(MODEL + cfg.voice + text).digest("hex").slice(0, 12);
  const tPath = path.join(dir, "timing.json");
  if (fs.existsSync(tPath) && JSON.parse(fs.readFileSync(tPath, "utf8")).hash === hash && fs.existsSync(path.join(ROOT, "audio", `${id}.mp3`))) {
    console.log(id, "cached"); return;
  }
  console.log(id, `TTS ${text.length} chars, voice ${cfg.voice}, model ${MODEL}`);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${cfg.voice}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST", headers: { "xi-api-key": KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true } }),
  });
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status} ${await res.text()}`);
  const data: any = await res.json();
  costs.requests.push({ id, chars: text.length, model: MODEL, voice: cfg.voice, at: new Date().toISOString() });
  fs.writeFileSync(costsPath, JSON.stringify(costs, null, 2));
  const raw = path.join(ROOT, "audio", `${id}.raw.mp3`);
  fs.mkdirSync(path.join(ROOT, "audio"), { recursive: true });
  fs.writeFileSync(raw, Buffer.from(data.audio_base64, "base64"));
  const a = data.alignment;
  const chars: string[] = a.characters, st: number[] = a.character_start_times_seconds, en: number[] = a.character_end_times_seconds;
  const joined = chars.join("");
  if (joined.replace(/\s+/g, " ").trim() !== text.replace(/\s+/g, " ").trim()) console.warn(id, "WARNING: alignment text differs from input; scene boundaries use best-effort search");

  // границы сцен — по смещению первого символа каждой сцены в тексте
  let offset = 0; const starts: number[] = [];
  for (const part of sayParts) { const idx = joined.indexOf(part, offset); const i = idx >= 0 ? idx : offset; starts.push(st[Math.min(i, st.length - 1)]); offset = (idx >= 0 ? idx : offset) + part.length; }
  let speechEnd = en[en.length - 1];
  let tempo = 1;
  // укладываемся в 55–60 с: lead + speech + tail
  if (LEAD + speechEnd + TAIL_MIN > MAX) { tempo = (LEAD + speechEnd + TAIL_MIN) / (MAX - 0.3) ; tempo = +(Math.min(tempo, 1.25)).toFixed(4); }
  const finalMp3 = path.join(ROOT, "audio", `${id}.mp3`);
  if (tempo !== 1) execFileSync("ffmpeg", ["-v", "error", "-y", "-i", raw, "-filter:a", `atempo=${tempo}`, "-b:a", "128k", finalMp3]);
  else fs.copyFileSync(raw, finalMp3);
  const scale = 1 / tempo;
  speechEnd *= scale;
  const words = wordsFromAlignment(chars, st, en).map((w) => ({ w: w.w, s: +(w.s * scale + LEAD).toFixed(3), e: +(w.e * scale + LEAD).toFixed(3) }));
  let total = Math.max(MIN, Math.min(MAX, Math.max(TARGET, LEAD + speechEnd + TAIL_MIN)));
  const sceneBounds = starts.map((s, i) => ({ start: +(i === 0 ? 0 : s * scale + LEAD).toFixed(3), end: 0 }));
  sceneBounds.forEach((b, i) => { b.end = i < sceneBounds.length - 1 ? sceneBounds[i + 1].start : +total.toFixed(3); });
  const timing = { hash, audio: `audio/${id}.mp3`, fps: FPS, leadSec: LEAD, speechEndSec: +speechEnd.toFixed(3), totalSec: +total.toFixed(3), totalFrames: Math.round(total * FPS), tempo, words, scenes: sceneBounds, chars: text.length, model: MODEL, voice: cfg.voice };
  fs.writeFileSync(tPath, JSON.stringify(timing, null, 2));
  fs.mkdirSync(path.join(ROOT, "public/audio"), { recursive: true });
  fs.copyFileSync(finalMp3, path.join(ROOT, "public/audio", `${id}.mp3`));
  // субтитры
  fs.mkdirSync(path.join(ROOT, "subtitles"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, "subtitles", `${id}.json`), JSON.stringify({ id, text, words }, null, 2));
  const { chunkWords } = await import("../src/lib/subtitles");
  const chunks = chunkWords(words);
  const srt = chunks.map((c, i) => `${i + 1}\n${srtTime(c.start)} --> ${srtTime(Math.min(c.end, total))}\n${c.words.map((w) => w.w).join(" ")}\n`).join("\n");
  fs.writeFileSync(path.join(ROOT, "subtitles", `${id}.srt`), srt);
  console.log(id, `speech ${speechEnd.toFixed(1)}s, tempo ${tempo}, total ${total.toFixed(1)}s, ${words.length} words`);
}

(async () => { for (const id of ids) await one(id); })().catch((e) => { console.error(e); process.exit(1); });
