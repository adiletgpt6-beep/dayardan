/** Собирает production/DAY-xxx/script.json + timing.json в src/generated/videos.json и копирует захваты в public/captures/. */
import * as fs from "fs";
import * as path from "path";
const ROOT = path.resolve(__dirname, "..");
const prod = path.join(ROOT, "production");
const ids = fs.readdirSync(prod).filter((d) => /^DAY-\d{3}$/.test(d)).sort();
const videos = ids.map((id) => {
  const config = JSON.parse(fs.readFileSync(path.join(prod, id, "script.json"), "utf8"));
  const tPath = path.join(prod, id, "timing.json");
  const timing = fs.existsSync(tPath) ? JSON.parse(fs.readFileSync(tPath, "utf8")) : null;
  return { config, timing };
});
fs.mkdirSync(path.join(ROOT, "src/generated"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "src/generated/videos.json"), JSON.stringify(videos, null, 2));
// captures
const mPath = path.join(ROOT, "recordings/manifest.json");
const manifest = fs.existsSync(mPath) ? JSON.parse(fs.readFileSync(mPath, "utf8")) : {};
const capDir = path.join(ROOT, "public/captures");
fs.mkdirSync(capDir, { recursive: true });
for (const k of Object.keys(manifest)) {
  const src = path.join(ROOT, manifest[k].file);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(capDir, path.basename(src)));
  else { console.warn("capture missing:", k, manifest[k].file); delete manifest[k]; }
}
fs.writeFileSync(path.join(ROOT, "src/generated/captures.json"), JSON.stringify(manifest, null, 2));
console.log(`videos: ${videos.length} (${videos.filter((v) => v.timing).length} with timing), captures: ${Object.keys(manifest).length}`);
