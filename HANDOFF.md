# HANDOFF.md — передача проекта

Ветка: `claude/dayardan-video-production-ns6ro9` · репозиторий: https://github.com/adiletgpt6-beep/dayardan
Последний подтверждённый коммит: см. раздел «Последний коммит» внизу.

## Что выполнено (версия 2, 2026-11-04 — реальные экраны сайта)

- Сайт стал доступен из среды (`www.dayardan.com` → 200). Проведено полное исследование: главная, меню, выбор типа теста, руководство
  «Кантип иштейт?» с интерактивным демо интерфейса, вход, регистрация, о нас, контакты — `SITE_RESEARCH.md`.
- `scripts/capture-site.ts` v2: 29 реальных скриншотов (`screenshots/`, 1170×2532) + 6 записей экрана (`recordings/*.mp4`, 780×1688, 30 fps)
  + `recordings/manifest.json` с координатами настоящих кнопок/полей (`boxes`). Формы не отправлялись, авторизация не обходилась.
- Фирменный стиль заменён на реальный: зелёный #16A34A / #166534 / #10482C, логотип сайта (`public/brand/logo.png`), Inter — `STYLE_GUIDE.md`, `src/theme.ts`.
- Компоненты: `ScreenRecording` показывает реальные скриншоты (Ken-Burns) и видео-записи; курсор, подсветка и зум задаются именем элемента (`box`), координаты берутся из DOM.
- Все 15 сцен-конфигов перепривязаны к реальным экранам (`production/DAY-0xx/script.json`). Тексты диктора 14 роликов не менялись — озвучка переиспользована.
- DAY-009 переписан в настоящую инструкцию по регистрации (меню → Аккаунтка кирүү → Кирүү → Катталуу → форма → «Катталуу»/Google); 1 новый TTS-запрос.
- 15 MP4 перерендерены в `output/new`, нормализованы (−16 LUFS), проверены и только после этого заменили старые файлы в `output/`.

## Что проверено

- `npm run verify`: 15/15 ✅ — 1080×1920, 30 fps, 55.1–60.0 с, H.264 + AAC 48 kHz, чёрных сегментов 0 — `output/VERIFICATION.md`, `production/verification.json`.
- Контрольные кадры `output/qa/DAY-0xx/`; визуально просмотрены контакт-листы DAY-001, 007, 008, 009, 012, 013, 015: реальный интерфейс внутри телефона,
  подсветка/курсор попадают на настоящие кнопки (проверено наложением boxes на скриншоты), субтитры читаемы, подписи сцен совпадают с реальными названиями кнопок.
- Соответствие инструкций обучающих роликов сайту — таблица в `SITE_RESEARCH.md` §5.
- TypeScript: `npm run typecheck` без ошибок.

## Что НЕ сделано / ограничения

1. **`api.dayardan.com` заблокирован сетевой политикой среды** (`net::ERR_TUNNEL_CONNECTION_FAILED` на `/tests/get-all`, `/subject`, `/auth/refresh`).
   Поэтому не захвачены: список тестов, живой экран вопроса, завершение теста, реальный экран результата, личный кабинет. В роликах для этих шагов
   используются демонстрация интерфейса и примеры результата с самого сайта (страница «Кантип иштейт?», главная). Чтобы захватить живой тест:
   разрешить `api.dayardan.com` в Network access, дописать в `capture-site.ts` сценарий (вход тестовым аккаунтом → старт теста → ответ → завершение → результат),
   добавить ключи `live-question`, `live-finish`, `live-result` и подставить их в DAY-011…DAY-015.
2. DAY-013 («как завершить тест»): кнопка завершения живого теста не подтверждена; ролик показывает «Тесттен кийин эмне болот?» и пример результата, формулировка диктора осторожная.
3. Голоса не прослушаны человеком (нет аудиовыхода); рекомендуется прослушать DAY-009 (новая озвучка).
4. MP4 хранятся в Git (≈13–15 МБ каждый). При желании перенести в Releases/S3 и обновить ссылки в `STATUS.md`.

## Как продолжить из нового чата

```bash
git clone https://github.com/adiletgpt6-beep/dayardan && cd dayardan && git checkout claude/dayardan-video-production-ns6ro9 && npm install
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers npm run capture      # обновить скриншоты/записи/manifest (нужен доступ к www. и желательно api.dayardan.com)
export ELEVENLABS_API_KEY=...                                  # только если меняются тексты say (кэш по хешу — без повторных списаний)
npm run tts
OUT_DIR=output/new npm run render:all && OUT_DIR=output/new npm run master && OUT_DIR=output/new npm run verify
mv output/new/DAY-0*.mp4 output/ && rm -rf output/qa && mv output/new/qa output/qa && mv output/new/VERIFICATION.md output/ && rmdir output/new
git add -A && git commit -m "..." && git push
```
Отдельный ролик: `bash scripts/render-all.sh DAY-013` (пишет в `output/` или `$OUT_DIR`).

## Расходы

- ElevenLabs: всего 17 TTS-запросов, 13 131 символ `eleven_v3` (`production/costs.json`; +772 символа за новый DAY-009) + 2 тестовых образца ≈ 240 символов.
  Оценка ≈ 2–3 USD ≈ 190–270 сом (зависит от плана; ключ без права `user_read`, остаток квоты из среды не читается). Новые списания сверх подписки не инициировались.
- Рендер, захват, GitHub — 0 сом. Итого ≪ 1000 сом.

## Последний коммит

`b1da45cdce7763a56efa229c470f2ac66efb3a7d` — «Deliver v2: all 15 videos re-rendered with real dayardan.com screens, verified and mastered; update STATUS, HANDOFF, VERIFICATION» (push подтверждён GitHub).
