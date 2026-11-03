# HANDOFF.md — передача проекта

(Разделы «Выполнено/Проверено/Осталось» обновляются в конце сессии; см. также `STATUS.md`.)

## Как продолжить из нового чата

1. Клонировать репозиторий, ветка `claude/dayardan-video-production-ns6ro9`:
   ```bash
   git clone https://github.com/adiletgpt6-beep/dayardan && cd dayardan && git checkout claude/dayardan-video-production-ns6ro9
   npm install
   ```
2. Проверить инструменты: Node 22, FFmpeg, Chromium (`/opt/pw-browsers` в облачной среде; иначе `npx remotion browser ensure`).
3. **Разрешить домен** `www.dayardan.com` (и `dayardan.com`) в сетевых настройках окружения (Cloud environment → Edit → Network access → Allowed domains).
4. Захватить реальный интерфейс и пересобрать ролики:
   ```bash
   npm run capture          # screenshots/, recordings/, recordings/manifest.json
   # при необходимости: сопоставить новые ключи манифеста с полем "screen" в production/DAY-0xx/script.json
   npm run render:all       # 15 MP4 → output/
   npm run verify           # output/VERIFICATION.md
   ```
5. Озвучка уже сгенерирована и закэширована (`production/DAY-0xx/timing.json` + `audio/`). Повторные списания происходят
   только если изменить текст `say`, голос или модель (хеш в timing.json). Ключ — `ELEVENLABS_API_KEY` в окружении, в Git не хранится.
6. После рендера обновить `STATUS.md`, закоммитить `output/*.mp4` (≈16 МБ каждый) и запушить.

## Точная команда продолжения (если сессия прервалась во время рендера)

```bash
cd dayardan && npm install && ls output/            # посмотреть, какие MP4 уже есть
bash scripts/render-all.sh DAY-0XX DAY-0YY           # дорендерить недостающие
npm run verify
```
