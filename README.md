# Dayardan — Video Production System

Автономная система производства **15 вертикальных роликов** (9:16, 1080×1920, 30 fps, 55–60 с, MP4 H.264/AAC)
на кыргызском языке для платформы подготовки к ЖРТ (ОРТ) **https://www.dayardan.com**.

Стек: Remotion 4 + React + TypeScript · Playwright (захват реального интерфейса) · ElevenLabs `eleven_v3`
(нативные кыргызские голоса, посимвольные тайминги → субтитры) · FFmpeg · Node 22.

| Документ | Содержание |
|---|---|
| `SITE_RESEARCH.md` | Подтверждённые факты о сайте, что не подтверждено, сетевой блокер |
| `CONTENT_PLAN.md` | 15 роликов: идеи, сцены, адаптации |
| `STYLE_GUIDE.md` | Палитра, типографика, безопасные зоны, движение, субтитры |
| `STATUS.md` | Состояние каждого ролика (planned → delivered) |
| `HANDOFF.md` | Что сделано/проверено, как продолжить из нового чата |
| `output/VERIFICATION.md` | Таблица ffprobe-проверки всех MP4 |

## Структура

```
production/DAY-0xx/script.json   сцены + текст диктора (источник правды)
production/DAY-0xx/timing.json   тайминг из реальной озвучки (генерируется)
production/costs.json            журнал платных TTS-запросов (символы)
audio/DAY-0xx.mp3                озвучка (+ .raw.mp3 до коррекции темпа)
subtitles/DAY-0xx.srt|.json      субтитры (1:1 с речью)
screenshots/, recordings/        реальные захваты сайта (+ recordings/manifest.json)
src/components/                  Intro, Outro, PhoneMockup, ScreenRecording, AnimatedCursor,
                                 ButtonHighlight, ZoomEffect, DynamicSubtitles, CallToAction, …
src/scenes/SceneRenderer.tsx     типы сцен: hook, statement, title, phone, steps, features, cta
src/compositions/DayardanVideo   сборка ролика из config + timing
scripts/capture-site.ts          Playwright-захват сайта → manifest
scripts/tts.ts                   ElevenLabs → audio + subtitles + timing (с кэшем, без повторных списаний)
scripts/build-manifest.ts        production/* → src/generated/videos.json, захваты → public/captures
scripts/render-all.sh            рендер всех MP4 в output/
scripts/verify.ts                ffprobe/blackdetect-проверка → output/VERIFICATION.md
output/DAY-0xx.mp4               готовые ролики
```

## Команды

```bash
npm install
export ELEVENLABS_API_KEY=...                 # только для генерации озвучки (не коммитить!)
npm run capture        # реальные скриншоты/записи сайта (нужен доступ к www.dayardan.com)
npm run tts            # озвучка + субтитры + тайминг (кэшируется по хешу текста)
npm run render:all     # собрать манифест и отрендерить все 15 MP4
npm run verify         # проверить все MP4 (ffprobe, чёрные кадры, контрольные кадры)
npm run studio         # Remotion Studio для предпросмотра
npm run render -- DAY-003 output/DAY-003.mp4   # один ролик
```

Браузер для рендера: `remotion.config.ts` указывает на предустановленный Chromium Headless Shell
(`REMOTION_BROWSER_EXECUTABLE` переопределяет путь). Для Playwright: `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`.
