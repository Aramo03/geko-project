# Deploy (dev)

Волна 6 закрыта на ветке `dev`. Этот файл — как поднять пустой PostgreSQL и production-стек. В `main` не пушить.

## Русский

1. Из корня репозитория скопируйте `.env.example` в `.env`.
2. Замените `SECRET_KEY` на случайную строку длиной от 32 символов без символа `$` (Compose раскрывает `$`). Замените `POSTGRES_PASSWORD` на свой пароль. Те же значения нельзя оставлять заглушками: при `DEBUG=False` процесс не стартует.
3. Если база должна быть с нуля, остановите стек и удалите том:

```bash
docker compose down -v
```

4. Поднимите стек. Контейнер backend сам делает `migrate` и `collectstatic`, затем gunicorn. Фронт — собранный nginx на порту 3000, API на порту 8000, Postgres на `localhost:5432`.

```bash
docker compose up --build -d
```

5. Один раз создайте языки, UI-слоты и staff. Демо-курсы, команда, отзывы и события не создаются. Картинки в `media` пустые, пока их не загрузят в админке.

```bash
docker compose exec backend python manage.py init_ui
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py create_admin
```

6. Проверьте:

- http://127.0.0.1:8000/api/schema/swagger-ui/
- http://127.0.0.1:8000/api/admin/
- http://127.0.0.1:3000/
- `GET /api/categories/` возвращает `[]`, пока курсы не добавлены в админке

Локальный `python manage.py runserver` использует тот же Postgres: в `backend/.env` поставьте `DB_HOST=localhost` и тот же пароль, что `POSTGRES_PASSWORD`.

## English

Copy `.env.example` to `.env`, set a real `SECRET_KEY` (32+ characters, no `$`) and `POSTGRES_PASSWORD`. `docker compose down -v` drops the database volume. `docker compose up --build -d` migrates and serves gunicorn on port 8000 and the built frontend on port 3000. Postgres is on `localhost:5432`. Run `init_ui`, `createsuperuser`, and `create_admin` once. Tables stay empty of courses, team, reviews, and events. Uploaded images appear only after you add them in the admin.

## Հայերեն

Պատճենեք `.env.example`-ը `.env`, դրեք իրական `SECRET_KEY` (32+ նիշ, առանց `$`) և `POSTGRES_PASSWORD`։ `docker compose down -v` մաքրում է բազայի volume-ը։ `docker compose up --build -d` անում է migrate և բարձրացնում gunicorn (8000) ու հավաքված frontend (3000)։ Postgres-ը `localhost:5432` է։ Մեկ անգամ՝ `init_ui`, `createsuperuser`, `create_admin`։ Աղյուսակները դատարկ են դասընթացներից, թիմից, կարծիքներից և իրադարձություններից։ Նկարները հայտնվում են միայն ադմինից վերբեռնելուց հետո։
