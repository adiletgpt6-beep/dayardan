/** Проверка готовых MP4: ffprobe (размер, fps, длительность, аудио), чёрные кадры, контрольные кадры → output/VERIFICATION.md */
import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";
const ROOT = path.resolve(__dirname, "..");
const out = path.join(ROOT, "output");
const only = process.argv.slice(2);
const files = fs.readdirSync(out).filter((f) => /^DAY-\d{3}\.mp4$/.test(f) && (!only.length || only.includes(f.replace(".mp4", "")))).sort();
const rows: any[] = [];
for (const f of files) {
  const p = path.join(out, f); const id = f.replace(".mp4", "");
  const probe = JSON.parse(execFileSync("ffprobe", ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", p]).toString());
  const v = probe.streams.find((s: any) => s.codec_type === "video"); const a = probe.streams.find((s: any) => s.codec_type === "audio");
  const fps = v ? eval(v.r_frame_rate) : 0; const dur = parseFloat(probe.format.duration);
  const black = execFileSync("ffmpeg", ["-v", "info", "-i", p, "-vf", "blackdetect=d=0.3:pix_th=0.10", "-an", "-f", "null", "-"], { stdio: ["ignore", "pipe", "pipe"] }).toString();
  const blackHits = (execFileSync("bash", ["-c", `ffmpeg -i "${p}" -vf blackdetect=d=0.3:pix_th=0.10 -an -f null - 2>&1 | grep -c black_start || true`]).toString().trim());
  const vol = execFileSync("bash", ["-c", `ffmpeg -i "${p}" -af volumedetect -vn -f null - 2>&1 | grep mean_volume | sed 's/.*mean_volume: //'`]).toString().trim();
  const qa = path.join(out, "qa", id); fs.mkdirSync(qa, { recursive: true });
  for (const t of [1, 12, 30, 45, dur - 2]) execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", String(Math.max(0, t)), "-i", p, "-frames:v", "1", "-vf", "scale=270:-1", path.join(qa, `t${Math.round(t)}.png`)]);
  const ok = v?.width === 1080 && v?.height === 1920 && Math.abs(fps - 30) < 0.01 && dur >= 55 && dur <= 60.5 && !!a && v?.codec_name === "h264" && blackHits === "0";
  rows.push({ id, file: f, sizeMB: +(fs.statSync(p).size / 1048576).toFixed(1), width: v?.width, height: v?.height, fps: +fps.toFixed(2), duration: +dur.toFixed(2), codec: v?.codec_name, audio: a ? `${a.codec_name} ${a.sample_rate}Hz` : "NONE", meanVolume: vol, blackSegments: +blackHits, ok });
  void black;
}
fs.writeFileSync(path.join(ROOT, "production/verification.json"), JSON.stringify({ at: new Date().toISOString(), rows }, null, 2));
const md = ["# Результаты проверки MP4 (ffprobe)", "", `Дата: ${new Date().toISOString()}`, "", "| ID | Файл | МБ | Разрешение | FPS | Длит., с | Видео | Аудио | Ср. громкость | Чёрные сегменты | OK |", "|---|---|---|---|---|---|---|---|---|---|---|",
  ...rows.map((r) => `| ${r.id} | ${r.file} | ${r.sizeMB} | ${r.width}×${r.height} | ${r.fps} | ${r.duration} | ${r.codec} | ${r.audio} | ${r.meanVolume} | ${r.blackSegments} | ${r.ok ? "✅" : "❌"} |`)].join("\n");
fs.writeFileSync(path.join(out, "VERIFICATION.md"), md + "\n");
console.log(md);
if (rows.some((r) => !r.ok)) process.exit(2);
