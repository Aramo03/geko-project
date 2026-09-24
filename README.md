# GEKO — учебный каркас

Сайт школы [GEKO Education](https://gekoeducation.com). Ученики собирают проект сами. Здесь уже есть **пустая структура**, **гайды**, **backup** и TODO под модели (ученики пишут сами).

**RU / EN / HY** — читай гайды на том языке, который удобен. Код и имена API — на английском, как в backup.

## С чего начать

1. [CONTRIBUTING.md](CONTRIBUTING.md) — git: `main` не трогать, работа в своей ветке, PR только в `dev`
2. [TASK.md](TASK.md) — текущее задание на 10 человек (преподаватель обновляет этот файл)
3. [docs/frontend.md](docs/frontend.md) — React, Tailwind, i18n, `useForm`, 3 файла на компонент
4. [docs/backend.md](docs/backend.md) — Django, DRF, JWT, Swagger, Unfold, Docker
5. [backup/README.md](backup/README.md) — старый сайт. Смотреть, не копировать код 1:1

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | React 19, Vite, Tailwind, i18next, react-router-dom, react-hook-form (`useForm`), Redux Toolkit, axios |
| Backend | Django 5, DRF + routers, SimpleJWT, drf-spectacular (Swagger), Unfold, Pillow, PostgreSQL |
| Infra | Docker Compose, GitHub Actions |

## Структура

```
geko-project/
  TASK.md                 текущая волна (10 человек)
  CONTRIBUTING.md         git
  docs/frontend.md
  docs/backend.md
  backup/                 старый сайт + медиа (read-only)
  backend/                Django
  frontend/               React
```

## Быстрый старт (после своей волны в TASK.md)

```bash
# backend
cd backend
python -m venv venv
venv\Scripts\activate          # Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
copy .env.example .env         # Linux/macOS: cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py create_admin
python manage.py init_ui
python manage.py runserver

# frontend (другое окно)
cd frontend
npm install
npm run dev 
```

Или: `docker compose up --build` (когда дойдёте до этой волны).

## Что уже готово / что писать вам

Готово: каркас Django/React, TODO в `models.py`, backup, пример `Header` (3 файла), медиа в `frontend/public/`.

Вам: **модели** (см. [TASK.md](TASK.md)), миграции, admin, API, JWT, Swagger, страницы React, почта, CI.

## Правила (коротко)

- API и страницы как в backup: `/` `/about-us` `/course-category` `/course-category/:id` `/courses/:id` `/events` `/contacts`
- Языки: `am` / `en` / `ru`
- Медиа только из `backup/` (уже лежит в `frontend/public/`)
- Компонент = `Component.jsx` + `component.css` + `component.js`
- Staff (`admin`, `superuser`) и слоты UI — только из terminal
- PR: своя ветка → `dev`. В `main` не пушить

