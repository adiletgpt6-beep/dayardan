# Галерея роликов

Опубликованная страница (просмотр + скачивание оригиналов): https://claude.ai/artifact/96U94qFH8qsYf9uKXdhnq7

`index.html` — исходник страницы; на странице играют лёгкие копии 720×1280 (`preview/*.mp4`, не хранятся в репозитории,
создаются из `output/*.mp4`: `ffmpeg -i output/DAY-001.mp4 -crf 27 -vf scale=720:1280 -c:a aac -b:a 96k preview/DAY-001.mp4`),
кнопки «Скачать оригинал» ведут на файлы 1080×1920 в `output/` (raw-ссылки GitHub). Постеры — `poster/*.jpg`.
