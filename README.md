# GEKO — учебный каркас

Сайт школы [GEKO Education](https://gekoeducation.com). Ученики собирают проект в команде. **Волна 6 (QA, production, polish)** закрыта на `dev` (2026-10-23). Аудит — [fix.md](fix.md). Пустой PostgreSQL и запуск — [docs/deploy.md](docs/deploy.md).

**RU / EN / HY** — читай гайды на том языке, который удобен. Код и имена API — на английском, как в backup.

## С чего начать

1. [CONTRIBUTING.md](CONTRIBUTING.md) — git: `main` не трогать, работа в своей ветке, PR только в `dev`
2. [TASK.md](TASK.md) — задания по волнам (волна 6 закрыта: QA + production + polish)
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

Или Docker: скопируйте `.env.example` в `.env`, задайте `SECRET_KEY` и `POSTGRES_PASSWORD`, затем `docker compose up --build`. Миграции применяет контейнер. `init_ui` и `create_admin` — один раз, см. [docs/deploy.md](docs/deploy.md). Локальный `runserver` ходит в тот же PostgreSQL (`localhost:5432`), не в SQLite.

## Что уже готово

- Модели и миграции (волна 2), API и JWT (волна 3), страницы и оболочка (волна 4), UI по Figma (волна 5), QA и production (волна 6) на `dev`
- Swagger: `/api/schema/swagger-ui/`
- React: маршруты, Header, Footer, страницы с запросами к API
- оболочка в `frontend/public/` (логотип, флаги, hero, About); загрузки курсов и команды — пустой Django `media`
- Макет волны 5: [Figma Untitled](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0)

Волна 6 на `dev`: тесты и docker smoke в CI, gunicorn и `DEBUG=False`, прод-сборка фронта, polish 375px / a11y / code-splitting. База после миграций пустая. Детали — [TASK.md](TASK.md), [fix.md](fix.md), [docs/deploy.md](docs/deploy.md).

## Правила (коротко)

- API и страницы как в backup: `/` `/about-us` `/course-category` `/courses/:id` `/events` `/contacts`
- Языки: `am` / `en` / `ru`
- Staff и UI-слоты — из terminal
- PR: своя ветка → `dev`. В `main` не пушить
