# Backend

Django API + админка. Задания: [TASK.md](../TASK.md), детали — [task-advanced.md](../task-advanced.md). Статус и техдолг: [fix.md](../fix.md).

## Стек (обязательно)

| Пакет | Зачем |
|--------|--------|
| Django 5 | проект |
| DRF + `DefaultRouter` | `/api/…` |
| SimpleJWT | логин `admin` / `superuser` |
| drf-spectacular | Swagger UI |
| Unfold | вид Django Admin |
| docker + compose | db / backend / frontend |
| Pillow | картинки |
| PostgreSQL | база в Docker; локально можно SQLite из `.env.example` |

## URL (контракт)

```
GET  /api/categories/?language=
GET  /api/popular_courses/?language=
GET  /api/courses/<category_id>/
GET  /api/events/?language=
GET  /api/events/<id>/?language=
GET  /api/reviews/?language=
GET  /api/lesson_info/?language=
GET  /api/teams/?language=
GET  /api/ui-blocks/
POST /api/contact/
GET  /api/comments/?category= | ?popular_course=
POST /api/comments/                    гость, без JWT
POST /api/comments/<id>/reply/         admin, JWT
POST /api/auth/token/
GET  /api/schema/swagger-ui/
     /api/admin/                       Unfold
```

Админка: `/api/admin/`.

**ContactMessage (факт):** `full_name`, `email`, `phone`, `message`. В backup у формы ещё `country`, `category`, `whatsapp` — см. [fix.md](../fix.md).

## JWT

- Гость оставляет комментарий **без** токена (`full_name`, `email`, `whatsapp`, `text`).
- `admin` / `superuser` логинятся через JWT и отвечают на комментарии.
- Публичной регистрации staff нет.
- Для reply с фронта (dev): сохраните access token в `localStorage` под ключом `geko_access_token` после `POST /api/auth/token/`.

## Unfold

`unfold` стоит **перед** `django.contrib.admin` в `INSTALLED_APPS`. У роли `admin` для `UIBlock` нет кнопки Add — слоты создаёт terminal (`init_ui`).

## Миграции

После изменения моделей:

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

На **чистой** SQLite: удалите локальный `db.sqlite3` или задайте другой `DB_NAME` в `.env`, затем снова `migrate`.

Перед PR всегда проверяйте `makemigrations` / `migrate` на чистой БД.

## Staff в terminal

Создавайте staff **только** из terminal (не через публичную регистрацию).

### Superuser (`role=superuser`, полный доступ Django)

```bash
python manage.py createsuperuser
```

Введите **email** и пароль. `UserManager.create_superuser` выставляет `role=superuser`, `is_staff`, `is_superuser`.

### Admin (`role=admin`, staff для JWT и админки)

Интерактивно:

```bash
python manage.py create_admin
```

С аргументами:

```bash
python manage.py create_admin admin@example.com 'your-secure-password'
```

### JWT-логин

```bash
curl -X POST http://127.0.0.1:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your-secure-password"}'
```

### UI-слоты и языки

```bash
python manage.py init_ui
```

Идемпотентно: языки `am` / `en` / `ru` и блоки `header`, `hero`, `footer`, `contacts_bar`.

Полный порядок первого запуска:

```bash
pip install -r requirements.txt
python manage.py makemigrations   # если меняли модели
python manage.py migrate
python manage.py createsuperuser  # и/или create_admin
python manage.py init_ui
python manage.py runserver
```

## Docker

Из корня: `docker compose up --build`.

Сервисы: `db` (Postgres), `backend`, `frontend`. Переменные — `.env.example`.

**Первый запуск backend в Docker** (в контейнере или локально с Postgres из compose):

```bash
python manage.py migrate
python manage.py init_ui
python manage.py create_admin
```

Compose по умолчанию только `runserver` — миграции выполняются вручную один раз.

## English

After model changes: `makemigrations` then `migrate`. Staff via `createsuperuser` / `create_admin`. API paths as above. Swagger: `/api/schema/swagger-ui/`.

## Հայերեն

Մոդելներից հետո՝ `makemigrations`, ապա `migrate`։ Staff՝ `createsuperuser` / `create_admin`։ API ու Swagger՝ վերևի ցանկում։
