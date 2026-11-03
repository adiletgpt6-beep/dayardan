# HANDOFF.md — передача проекта

Ветка: `claude/dayardan-video-production-ns6ro9` · репозиторий: https://github.com/adiletgpt6-beep/dayardan
Последний подтверждённый коммит: см. раздел «Последний коммит» внизу (обновляется автоматически последним коммитом сессии).

## Что выполнено

- Исследование сайта в пределах доступного: подтверждённые факты и ограничения — `SITE_RESEARCH.md`.
- Система производства на Remotion 4 / React / TypeScript: компоненты Intro, Outro, PhoneMockup, ScreenRecording, AnimatedCursor,
  ButtonHighlight, ZoomEffect, DynamicSubtitles, CallToAction (+ Background, KineticText, Icon, Wordmark), 7 типов сцен, data-driven сборка.
- 15 сценариев на кыргызском языке: `production/DAY-001..015/script.json` (план — `CONTENT_PLAN.md`).
- Кыргызская озвучка ElevenLabs `eleven_v3` нативными голосами аккаунта (реклама — мужской «BalaGo son design-d4-2»,
  обучение — женский «BalaGo KG narrator»): `audio/DAY-0xx.mp3`; посимвольные тайминги → `production/DAY-0xx/timing.json`.
- Субтитры 1:1 с речью: `subtitles/DAY-0xx.srt` и `.json`; в видео — караоке-подсветка активного слова.
- 15 MP4 отрендерены локально (`output/DAY-0xx.mp4`), аудио нормализовано до −16 LUFS (`scripts/master-audio.sh`).
- Скрипты: `capture-site.ts`, `tts.ts` (с кэшем — без повторных списаний), `build-manifest.ts`, `render-all.sh`, `master-audio.sh`, `verify.ts`.

## Что проверено

- `npm run verify` на всех 15 файлах: 1080×1920, 30 fps, 55.1–60.0 с, H.264 + AAC 48 kHz, чёрных сегментов нет — `output/VERIFICATION.md`, `production/verification.json`.
- Контрольные кадры каждого ролика: `output/qa/DAY-0xx/*.png`; визуально просмотрены контакт-листы DAY-001, 003, 008, 012, 015
  (текст не обрезан, субтитры читаемы, пробелы между словами корректны, подсказки на экране совпадают с текстом диктора).
- Средняя громкость после мастеринга −18.7…−19.8 дБ (пики −1.5 dBTP) у всех 15.
- TypeScript: `npm run typecheck` без ошибок.

## Что НЕ сделано / ограничения

1. **Нет реальных скриншотов и записей экрана сайта.** Хост `www.dayardan.com` (и `dayardan.com`, `archive.org`) запрещён сетевой политикой
   облачной среды; Playwright-скрипт готов и падает ровно на сетевом отказе. Внутри телефона во всех роликах — нейтральная
   моушн-карточка, а не интерфейс сайта. Это главный пункт следующей итерации.
2. Регистрация/вход, таймер, разбор каждого вопроса — не подтверждены и в роликах не заявлены; DAY-009 адаптирован (см. `CONTENT_PLAN.md`, вариант DAY-009-alt).
3. Фирменные цвета и логотип сайта не получены — палитра временная (`STYLE_GUIDE.md`, `src/theme.ts`), используется только текстовый знак «Dayardan».
4. Голоса ElevenLabs не прослушаны человеком (в среде нет аудиовыхода); выравнивание и длительности проверены программно. Рекомендуется прослушать DAY-001 и DAY-008.
5. MP4 хранятся прямо в Git (≈13–14 МБ каждый, ≈205 МБ всего); объектного хранилища в среде не было. При желании перенести в GitHub Releases / S3 и заменить ссылки в `STATUS.md`.

## Как продолжить из нового чата

```bash
git clone https://github.com/adiletgpt6-beep/dayardan && cd dayardan && git checkout claude/dayardan-video-production-ns6ro9
npm install
# 1) Разрешить домены www.dayardan.com и dayardan.com в Network access окружения (Cloud environment → Edit).
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npm run capture      # screenshots/, recordings/, recordings/manifest.json
# 2) Сверить ключи манифеста (home, how-it-works, discovered-N, home-scroll) с полем "screen" в production/DAY-0xx/script.json;
#    при необходимости переименовать/добавить ключи (tests, test-intro, question, result) и поправить координаты cursor/highlight.
# 3) Обновить src/theme.ts по реальным цветам сайта; при необходимости поправить тексты say → npm run tts (пересоздаст только изменённые).
export ELEVENLABS_API_KEY=...   # не коммитить
npm run tts
npm run render:all && npm run master && npm run verify
git add -A && git commit -m "Re-render with real site captures" && git push
```

Если сессия прервалась во время рендера: `ls output/` → `bash scripts/render-all.sh DAY-0XX ...` для недостающих → `npm run master` → `npm run verify`.

## Расходы

- ElevenLabs: 16 запросов TTS, 12 359 символов (`production/costs.json`) + 2 тестовых образца ≈ 240 символов ⇒ ≈ 12 600 символов `eleven_v3`.
  Оценка стоимости по тарифам ElevenLabs: ≈ 2–3 USD ≈ 180–260 сом (зависит от плана; ключ не имеет права `user_read`, поэтому
  фактический остаток квоты/счёт из среды не читается). Новые списания сверх подписки не инициировались.
- Рендер (локальный Remotion/FFmpeg), GitHub, шрифты (@fontsource) — 0 сом. Итого ≪ 1000 сом.

## Последний коммит
