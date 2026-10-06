# GEKO — учебный каркас

Сайт школы [GEKO Education](https://gekoeducation.com). Ученики собирают проект в команде. **Волна 3 (API + admin + фронт)** закрыта на `dev`; остатки — [fix.md](fix.md).

**RU / EN / HY** — читай гайды на том языке, который удобен. Код и имена API — на английском, как в backup.

## С чего начать

1. [CONTRIBUTING.md](CONTRIBUTING.md) — git: `main` не трогать, работа в своей ветке, PR только в `dev`
2. [TASK.md](TASK.md) — задания по волнам (сейчас: волна 3 закрыта, архив волны 2 внизу)
3. [docs/frontend.md](docs/frontend.md) — React, Tailwind, i18n, `useForm`, 3 файла на компонент
4. [docs/backend.md](docs/backend.md) — Django, DRF, JWT, Swagger, миграции, staff в terminal
5. [backup/README.md](backup/README.md) — старый сайт. Смотреть, не копировать код 1:1

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | React 19, Vite, Tailwind, i18next, react-router-dom, react-hook-form, Redux Toolkit, axios |
| Backend | Django 5, DRF + routers, SimpleJWT, drf-spectacular (Swagger), Unfold, Pillow, PostgreSQL |
| Infra | Docker Compose, GitHub Actions |

## Быстрый старт

```bash
# backend
cd backend
python -m venv venv
venv\Scripts\activate          # Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
copy .env.example .env         # Linux/macOS: cp .env.example .env
python manage.py makemigrations  # если меняли модели
python manage.py migrate
python manage.py createsuperuser   # superuser — см. docs/backend.md
python manage.py create_admin      # role=admin — см. docs/backend.md
python manage.py init_ui
python manage.py runserver

# frontend (другое окно)
cd frontend
npm install
npm run dev
```

Подробно про **makemigrations**, **migrate**, **create_admin** / **createsuperuser** и JWT — [docs/backend.md](docs/backend.md).

Или: `docker compose up --build` (после `migrate` + `init_ui` в backend — см. backend.md).

## Что уже готово

- Модели и миграции (волна 2), API и JWT (волна 3) на `dev`
- Swagger: `/api/schema/swagger-ui/`
- React: маршруты, Header + i18n, страницы с запросами к API (базовый уровень)
- backup и медиа в `frontend/public/`

Дальше: дизайн/QA, паритет с backup, техдолг из [fix.md](fix.md).

## Правила (коротко)

- API и страницы как в backup: `/` `/about-us` `/course-category` `/courses/:id` `/events` `/contacts`
- Языки: `am` / `en` / `ru`
- Staff и UI-слоты — из terminal
- PR: своя ветка → `dev`. В `main` не пушить
