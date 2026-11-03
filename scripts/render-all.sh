#!/usr/bin/env bash
# Рендер всех (или указанных) роликов: ./scripts/render-all.sh [DAY-001 ...]
set -euo pipefail
cd "$(dirname "$0")/.."
npx tsx scripts/build-manifest.ts
IDS=("$@"); if [ ${#IDS[@]} -eq 0 ]; then IDS=($(ls production | grep -E '^DAY-[0-9]{3}$')); fi
mkdir -p output
for id in "${IDS[@]}"; do
  echo "=== render $id ==="
  npx remotion render src/index.ts "$id" "output/$id.mp4" --codec=h264 --crf=20 --audio-codec=aac --audio-bitrate=160k --log=error --concurrency=4
  ffprobe -v error -show_entries format=duration -of csv=p=0 "output/$id.mp4"
done
