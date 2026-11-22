# Презентация и речь

Отдельный Reveal.js-проект. Приложение живёт на `https://olympic-game.ru/`.

## Запуск

```bash
npm install
npm run dev
# http://localhost:5174/
```

Приложение для перехода должно быть запущено отдельно:

```bash
cd ../source
npm run dev
# http://localhost:5173/
```

## Сборка

```bash
npm run build
npm run preview
# http://localhost:4174/
```

Деплой — через GitHub Actions в
`https://github.com/tulenka22/olympic-game-presentation`.
Один раз включите **Settings → Pages → Source: GitHub Actions**.
После пуша в `master` workflow собирает `dist` и публикует его на
`https://tulenka22.github.io/olympic-game-presentation/`.

Приложение на `https://olympic-game.ru/` — другой origin, поэтому переход
слайды → приложение использует fade-занавес. Если позже отдать презентацию
с `https://olympic-game.ru/presentation/`, View Transition включится сам.

## Ссылки и QR

```bash
cp .env.example .env.local
```

- `VITE_APP_URL` — куда ведёт QR и кнопка «Открыть приложение»;
- `VITE_SHORT_URL` — текст короткой ссылки на слайде.

Production-значения лежат в `.env.production`:

```env
VITE_APP_URL=https://olympic-game.ru/
VITE_SHORT_URL=olympic-game.ru
```

Для локальной проверки скопируйте `.env.example` в `.env.local`.

Последний слайд: `→`, `Space`, `PageDown` или кнопка открывают приложение
с `?demo=1`. В этом режиме приложение стартует без прелоадера и прогревает
карточки 2024/1940/1924.

## Речь

```bash
npm run speech:docx
# speech.docx рядом с package.json
```

Исходник — `SPEECH.md`. Роли: Максим и Ваня, хронометраж 6:50.
