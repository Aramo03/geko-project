# Backend

Django API + админка. Модели уже написаны. Логика и имена ресурсов — как в [backup/prod-geko-back-main](../backup/prod-geko-back-main).

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

## URL (цель, пишете вы)

Как в backup, плюс comments и schema:

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

Админка в backup была на `/api/admin/`. Сохрани этот путь.

## JWT

- Гость оставляет комментарий **без** токена (`full_name`, `email`, `whatsapp`, `text`).
- `admin` / `superuser` логинятся через JWT и отвечают на комментарии.
- Публичной регистрации staff нет.

## Unfold

`unfold` стоит **перед** `django.contrib.admin` в `INSTALLED_APPS`. Админ видит контент, inbox комментариев, существующие `UIBlock`. У роли `admin` для `UIBlock` нет кнопки Add — слоты создаёт terminal.

## Команды (уже в каркасе)

```bash
python manage.py migrate
python manage.py createsuperuser    # role=superuser
python manage.py create_admin       # role=admin, is_staff
python manage.py init_ui            # слоты header / hero / footer / contacts_bar
```

`admin` и `superuser` создаются **только** из terminal. `init_ui` можно вызывать повторно — не дублирует `key`.

## Модели

Готовы в `apps/accounts` и `apps/main`:

- User: `user` / `admin` / `superuser`
- Language, Category + Translation, PopularCourse + Translation
- Event + Translation + EventGallery
- Review, LessonInfo, Team + translations
- ContactMessage
- **Comment** (новое): категория или курс, гость, `parent` для ответа admin
- **UIBlock** (новое): JSON-слоты UI

Не переименовывай `PopularCourse` и `ContactMessage`.

## Docker

Из корня репозитория: `docker compose up --build`.

Сервисы: `db` (Postgres), `backend`, `frontend`. Переменные — `.env.example`, не коммить `.env`.

## English

Implement DRF routers, Swagger, JWT for staff, Unfold admin, contact email. Models are done. Guest comments need no token. UI slots come from `init_ui`.

## Հայերեն

Մոդելները պատրաստ են։ Դու գրում ես API, Swagger, JWT, Unfold, նամակ։ Admin/superuser և UI-ն՝ միայն terminal-ից։
