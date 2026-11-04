# STATUS.md — состояние 15 роликов

Статусы: planned → scripted → assets_ready → audio_ready → rendered → verified → delivered.
`rendered` — только при наличии реального MP4 в `output/`; `verified` — после `npm run verify` (ffprobe, blackdetect) и просмотра контрольных кадров (`output/qa/`);
`delivered` — MP4 закоммичен и запушен в ветку `claude/dayardan-video-production-ns6ro9`.

**Версия 2 (2026-11-04):** все 15 роликов перерендерены с **реальными экранами сайта** (скриншоты и записи `screenshots/`, `recordings/`,
курсор/подсветка по координатам настоящих элементов) и в **реальной палитре Dayardan** (зелёный #16A34A, логотип сайта).
Версия 1 (2026-11-03, нейтральные карточки вместо интерфейса) — в истории git до коммита `e3fb4bc`.

Последняя проверка: 2026-11-04T04:05:23.077Z · итог: 15/15 ✅ (см. `output/VERIFICATION.md`).

| ID | Название | Тип | Сценарий | Озвучка (речь, с) | Субтитры | Экраны сайта в ролике | MP4 (проверен) | Статус | Примечание |
|---|---|---|---|---|---|---|---|---|---|
| DAY-001 | ЖРТга даярданып жатасыңбы? | реклама | ✅ | ✅ 53.1 | ✅ | home, home-result-demo, how-demo-question | ✅ 57.3 с, 13.8 МБ | delivered |  |
| DAY-002 | Телефонуң менен даярдан! | реклама | ✅ | ✅ 50.9 | ✅ | home-result-demo, rec-demo-answer, rec-home-scroll | ✅ 55.1 с, 13.2 МБ | delivered |  |
| DAY-003 | Даярданууну бүгүн башта! | реклама | ✅ | ✅ 55.4 | ✅ | how-result-topics, tests-hub | ✅ 59.6 с, 13.3 МБ | delivered |  |
| DAY-004 | Өзүңдү сынап көр! | реклама | ✅ | ✅ 53.4 | ✅ | how-demo-question, how-result-demo, tests-hub | ✅ 57.6 с, 13.4 МБ | delivered |  |
| DAY-005 | Каталарыңды билип ал! | реклама | ✅ | ✅ 53.0 | ✅ | home-result-demo, rec-demo-answer | ✅ 57.1 с, 12.6 МБ | delivered |  |
| DAY-006 | ЖРТга даярдануунун оңой жолу | реклама | ✅ | ✅ 50.9 | ✅ | home-result-demo, how-demo-question, rec-tests-hub | ✅ 55.1 с, 12.5 МБ | delivered |  |
| DAY-007 | Dayardan менен максатыңа жакында! | реклама | ✅ | ✅ 52.6 | ✅ | home, home-progress, rec-demo-answer | ✅ 56.8 с, 13 МБ | delivered |  |
| DAY-008 | Dayardan сайтына кантип киребиз? | обучение | ✅ | ✅ 55.8 | ✅ | home, how-steps, rec-home-scroll | ✅ 60 с, 15.5 МБ | delivered | темп 1.0509 |
| DAY-009 | Кантип катталабыз? | обучение | ✅ | ✅ 52.3 | ✅ | login, menu, rec-register-typing, register-filled | ✅ 56.5 с, 12.6 МБ | delivered | сценарий и озвучка переписаны 04.11 (регистрация) |
| DAY-010 | Тестти кантип табабыз? | обучение | ✅ | ✅ 55.8 | ✅ | home, tests-hub, tests-hub-thematic | ✅ 60 с, 14 МБ | delivered | темп 1.0603 |
| DAY-011 | Тестти кантип баштайбыз? | обучение | ✅ | ✅ 52.2 | ✅ | how-demo-question, tests-hub | ✅ 56.4 с, 12.3 МБ | delivered |  |
| DAY-012 | Суроолорго кантип жооп беребиз? | обучение | ✅ | ✅ 52.8 | ✅ | how-demo-answered, how-demo-question | ✅ 57 с, 12.5 МБ | delivered |  |
| DAY-013 | Тестти кантип аяктайбыз? | обучение | ✅ | ✅ 49.7 | ✅ | how-after, how-demo-next, how-result-demo | ✅ 55.1 с, 13.7 МБ | delivered |  |
| DAY-014 | Жыйынтыкты кантип көрөбүз? | обучение | ✅ | ✅ 53.5 | ✅ | home-result-demo | ✅ 57.7 с, 13.1 МБ | delivered |  |
| DAY-015 | Dayardan сайтын толук колдонуу | обучение | ✅ | ✅ 48.7 | ✅ | home, home-result-demo, rec-demo-answer, rec-tests-hub, tests-hub | ✅ 55.1 с, 14.3 МБ | delivered |  |

## Ссылки на MP4 (ветка `claude/dayardan-video-production-ns6ro9`)

| ID | Просмотр на GitHub | Прямая ссылка (raw) |
|---|---|---|
| DAY-001 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-001.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-001.mp4) |
| DAY-002 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-002.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-002.mp4) |
| DAY-003 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-003.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-003.mp4) |
| DAY-004 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-004.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-004.mp4) |
| DAY-005 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-005.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-005.mp4) |
| DAY-006 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-006.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-006.mp4) |
| DAY-007 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-007.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-007.mp4) |
| DAY-008 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-008.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-008.mp4) |
| DAY-009 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-009.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-009.mp4) |
| DAY-010 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-010.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-010.mp4) |
| DAY-011 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-011.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-011.mp4) |
| DAY-012 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-012.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-012.mp4) |
| DAY-013 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-013.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-013.mp4) |
| DAY-014 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-014.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-014.mp4) |
| DAY-015 | [blob](https://github.com/adiletgpt6-beep/dayardan/blob/claude/dayardan-video-production-ns6ro9/output/DAY-015.mp4) | [raw](https://raw.githubusercontent.com/adiletgpt6-beep/dayardan/claude/dayardan-video-production-ns6ro9/output/DAY-015.mp4) |

## Оставшееся ограничение

Бэкенд `api.dayardan.com` недоступен из среды рендера (`ERR_TUNNEL_CONNECTION_FAILED`, см. `SITE_RESEARCH.md`), поэтому живой тест
(список тестов, реальный экран вопроса, завершение теста, реальный результат, кабинет) не захвачен. Для экранов «вопрос» и «результат»
использованы собственные демонстрации интерфейса и примеры результата на страницах сайта. После разрешения `api.dayardan.com`
можно дополнить `scripts/capture-site.ts` сценарием живого теста и перерендерить затронутые ролики.
