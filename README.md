# Portfo

One-page портфолио на Astro (SSR Node), стилизованное под формат `about`-страницы:
- минималистичный header (Blog + RU/EN + light/dark toggle)
- секции About + GitHub Activity + Projects
- иконки-контакты внизу (GitHub, Telegram, Email, LinkedIn)
- отдельная заглушка блога `/posts`

## Что есть сейчас

- RU/EN переключение интерфейса
- переключатель темы (light/dark) с сохранением в `localStorage`
- GitHub activity через `ghchart` + API-роуты для GitHub profile/contributions
- список проектов из data-файла (сейчас placeholders)
- адаптивный layout с контейнером `max-width: 48rem`

## Локальный запуск

```bash
npm install
npm run dev
```

Откройте: `http://localhost:4321`

## Продакшен сборка

```bash
npm run build
node dist/server/entry.mjs
```

## Docker

```bash
docker build -t portfo .
docker run --rm -p 4321:4321 portfo
```

## Роуты

- `/` — главная страница (About, GitHub, Projects, footer contacts)
- `/posts` — заглушка блога
- `/api/github/profile.json` — профиль GitHub
- `/api/github/contributions.json` — вклады GitHub

## Где редактировать контент и UI

- Основной контент и ссылки: `src/data/site-content.ts`
- Карточки проектов: `src/data/projects.ts`
- Главная страница: `src/pages/index.astro`
- Страница блога: `src/pages/posts.astro`
- Глобальные стили и темы: `src/styles/global.css`
- Клиентская логика RU/EN + theme: `src/scripts/locale.js`
- GitHub API-слой:
  - `src/pages/api/github/profile.json.ts`
  - `src/pages/api/github/contributions.json.ts`
  - `src/lib/github.ts`

## Примечания

- Текущий GitHub username берётся из `githubUsername` в `src/data/site-content.ts`.
- Email для кнопки связи: `perk77331@gmail.com`.
- Чтобы сменить соцссылки, обновите `telegramUrl` / `linkedinUrl` / `email` в `src/data/site-content.ts`.
