#!/usr/bin/env bash
# Нормализация громкости готовых MP4 до -16 LUFS (стандарт для Reels/TikTok/Shorts). Видео не перекодируется.
# Usage: bash scripts/master-audio.sh [DAY-001 ...]
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${OUT_DIR:-output}"
IDS=("$@"); if [ ${#IDS[@]} -eq 0 ]; then IDS=($(ls "$OUT" | grep -E '^DAY-[0-9]{3}\.mp4$' | sed 's/.mp4//')); fi
for id in "${IDS[@]}"; do
  in="$OUT/$id.mp4"; tmp="$OUT/$id.master.mp4"
  ffmpeg -v error -y -i "$in" -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 160k -ar 48000 -movflags +faststart "$tmp"
  mv "$tmp" "$in"
  echo "$id mastered: $(ffmpeg -i "$in" -af volumedetect -vn -f null - 2>&1 | grep mean_volume | sed 's/.*mean_volume: //')"
done
