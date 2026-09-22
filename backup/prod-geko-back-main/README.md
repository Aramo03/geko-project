# Geko backend

Django REST API + Django Admin for the Geko Education site. Recreate this **data skeleton**; admin UI chrome may change.

**RU:** Бэкенд. Те же модели, URL и админка `/api/admin/`.  
**HY:** Backend. Նույն մոդելները, URL-ները և admin `/api/admin/`։

---

## Stack

| Piece | Version |
|-------|---------|
| Python | 3.11+ |
| Django | 5.1.6 |
| Django REST Framework | 3.15.2 |
| django-cors-headers | 4.7.0 |
| django-environ | 0.12.0 |
| django-admin-sortable2 | 2.2.4 |
| Pillow | 11.1.0 |
| DB (dev) | SQLite (`db.sqlite3`) |
| DB (prod / dump) | PostgreSQL + `psycopg2` |

JWT and drf-spectacular are in `req.txt` but **not used**. You can omit them on a clean rebuild unless you add auth later.

On Windows, install `psycopg2-binary` instead of `psycopg2` if the compiler is missing.

---

## Run (SQLite, local)

```bash
cd prod-geko-back-main
python -m venv venv
venv\Scripts\activate          # Linux/macOS: source venv/bin/activate
pip install -r req.txt
copy .env.example .env         # Linux/macOS: cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 127.0.0.1:8000
```

Shortcut after `.env` exists: `python all.py` (migrate + user `admin` / password `admin`). **Change that password** before any shared or public host.

| URL | What |
|-----|------|
| http://127.0.0.1:8000/api/ | API root |
| http://127.0.0.1:8000/api/admin/ | Admin (not `/admin/`) |
| http://127.0.0.1:8000/media/ | Uploads |

Frontend origin: `http://localhost:3000` (CORS + CSRF).

---

## Recreate from zero (order)

1. `django-admin startproject geko` + app `main`.
2. `.env` required at startup (`django-environ`). Copy `.env.example`.
3. Models below → one initial migration.
4. Seed `Language`: `am`, `en`, `ru`.
5. DRF router under `/api/`. Admin under `/api/admin/`.
6. Serializers: if `?language=` is set, return one `translation` object, not only the raw list.
7. `MEDIA_ROOT` + `static()` in `geko/urls.py` so images work in dev.
8. `CORS_ALLOW_ALL_ORIGINS = True` for local; lock this in production.
9. Contact POST saves `ContactMessage` and tries SMTP (must not 500 if mail is unset — use console backend in `.env` for local).

### Switch to PostgreSQL

In `geko/settings.py` use:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'),
        'PORT': env.int('DB_PORT'),
    }
}
```

Then: create DB → `migrate` → optional `psql ... < db_backup.sql`.

`manage.py backup` / `restore` speak PostgreSQL (`pg_dump` / `psql`) and **drop the database** on restore. Do not run restore on a DB you care about without a copy.

---

## Models (frozen schema)

Keep these resources. Extra fields are OK if the old JSON still works.

| Model | Important fields | Media folder |
|-------|------------------|--------------|
| `Language` | `code`, `name` | — |
| `Category` | `local_image`, `image_url`, `order` + translations.`text` | `images/` |
| `PopularCourse` | FK `category`, `duration`, yes/no flags (`certification`, `students`, `studentGroup`, `assessments`), `order` + translations.`title`, `lang`, `desc` | `images/` |
| `Event` | `start_date`, `end_date`, `image`, `order`, `status` ∈ `upcoming` \| `happening` \| `completed` + translations.`title`, `description`, `place` | `event_gallery_photos/` |
| `EventGallery` | FK `event`, `local_image`, `image_url`, `order` | `event_gallery_images/` |
| `Review` | `local_image`, `image_url`, `name`, `comment` (no translation table today) | `review_images/` |
| `LessonInfo` | `local_image`, `image_url`, `order` + translations.`title` | `lesson_images/` |
| `Team` | `local_image`, `image_url`, `order` + translations.`name`, `role`, `desc` | `team_images/` |
| `ContactMessage` | `full_name`, `email`, `message`, `country`, `whatsapp`, FK `category` (nullable) | — |

Image rule: prefer `local_image`, else `image_url`.

Translation tables: `unique_together` (parent, language).

---

## API (frozen URLs)

Prefix `/api/`. Query: `?language=am|en|ru` (default `en` in serializers today; frontend sends the active i18n language).

Router resources: `categories`, `popular_courses`, `lesson_info`, `reviews`, `events`, `teams`.

Each resource:

| Method | Path |
|--------|------|
| GET, POST | `/api/{resource}/` |
| GET, PUT, PATCH, DELETE | `/api/{resource}/{id}/` |

Extra:

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/courses/{category_id}/` | Courses in a category |
| GET | `/api/events/{id}/` | One event (also available via the viewset) |
| POST | `/api/contact/` | Form |
| POST | `/api/categories/update_order/` | Body `{"order": [ids]}` |
| POST | `/api/update-order/` | Legacy category order |

Frontend **needs** at least: list endpoints above + event detail + contact POST. Keep list/detail public (`AllowAny`) unless the whole team adds auth together.

### Contact body

```json
{
  "full_name": "string",
  "email": "user@example.com",
  "message": "string",
  "country": "string",
  "whatsapp": "string",
  "category": 1
}
```

---

## Admin (frozen behaviour)

URL: **`/api/admin/`**

| Model | Must have |
|-------|-----------|
| Language | list `code`, `name` |
| Category, PopularCourse, Team, LessonInfo, Event | drag-sort (`adminsortable2`) + translation inlines |
| Event | nested sortable `EventGallery` + multi-file upload |
| ContactMessage | read-only inbox |
| Review | image + name + comment |

Editors fill the site here. Do not ask frontend to hardcode course titles.

---

## Folder skeleton

```text
manage.py
req.txt
all.py
.env.example
geko/settings.py
geko/urls.py          # api/admin + api/ + media
main/models.py
main/serializers.py
main/views.py
main/urls.py
main/admin.py
main/forms.py
main/migrations/
main/management/commands/backup.py
main/management/commands/restore.py
media/
translations/am.json  # UI copies (frontend also has locale/)
translations/en.json
translations/ru.json
```

---

## Environment

See `.env.example`. Required keys: `DEBUG`, `DB_*`, `EMAIL_*`, `SUBDOMAIN`.

For local without SMTP:

```env
EMAIL_HOST=localhost
EMAIL_PORT=1025
```

or switch `EMAIL_BACKEND` to `django.core.mail.backends.console.EmailBackend`.

**Production:** new `SECRET_KEY`, no `ALLOWED_HOSTS = ['*']`, tighten CORS, PostgreSQL, real SMTP.

---

## Who does what (backend half of the 10)

| Role | Files |
|------|--------|
| Models | `main/models.py`, migrations, `media/` layout |
| API | `main/views.py`, `serializers.py`, `urls.py` |
| Admin | `main/admin.py`, `forms.py` |
| Lead | `settings.py`, `.env.example`, backup/restore |

---

## Do not copy these mistakes

- Do not put admin at `/admin/` — frontend and bookmarks use `/api/admin/`.
- Do not drop `?language=` support.
- `LessonInfoViewSet.update_order` must update **LessonInfo**, not Category.
- Event serializer should not expose fields that are not on the model (`available_slots` today).
- Do not ship with password `admin` outside local machines.
- Backup/restore is PostgreSQL-only; it will not work on SQLite.
