# Статус проекта GEKO

**Обновлено:** 2026-10-04 · **Ветка:** `dev`  
**Волна 2:** закрыта (модели). **Волна 3:** закрыта Lead-PR (API, admin, базовый фронт); остаточный техдолг ниже.

Задания: [TASK.md](TASK.md) · API-контракт: [docs/backend.md](docs/backend.md)

---

## Архив — волна 2 (модели, закрыта 2026-09-29)

### Что уже не актуально (исправлено в wave 2)

| Было | Сейчас |
|------|--------|
| Два класса `Language` в `main/models.py` | **Исправлено** — один `Language` |
| SyntaxError в `main/migrations/0001_initial.py` | **Исправлено** |
| `init_ui` — заглушка с `CommandError` | **Исправлено** — seed `am`/`en`/`ru` + 4 UI-блока |
| Daniel: `User` = `AbstractUser` + TODO | **Исправлено** — кастомный `User` + `UserManager` |
| Ashot: нет `status` у `Event` | **Исправлено** + `0005_event_status` |
| Mariam: нет `is_approved` / xor у `Comment` | **Исправлено** |
| Vach: курсы только в `main` | **Исправлено** — `apps.courses` |

### Архитектура и данные (wave 2, всё ещё актуально)

1. **Дубликаты `main` vs `apps.content`** — намеренный учебный дубликат. Публичный API читает **`main`** (и `apps.courses` / `apps.team`), не `apps.content`.
2. **`ContactMessage`** — `phone` сохранён. Волна 4 добавляет `country`, `whatsapp` и FK `category` (`0006_contactmessage_country_whatsapp_category`).
3. **`Event`** — одно поле `date` (не `start_date`/`end_date` backup); gallery `related_name='gallery'`.
4. **`Review` в `main`** — `full_name`, `rating`, `text` (без image fields backup).

---

## Волна 3 — сделано (в `dev`)

| # | Зона | Результат |
|---|------|-----------|
| 1 | Lead | Swagger, `/api/contact/` (не `/api/leads/`), CI `migrate` + `init_ui`, docs |
| 2 | Daniel | JWT `/api/auth/token/`, `create_admin`, Unfold `User` admin |
| 3 | Sv | `?language=`, `resolve_language_code` (default `en`), serializers |
| 4 | Karen | `GET /api/categories/` |
| 5 | Vach | `popular_courses`, `courses/<category_id>/` |
| 6 | Ashot | `GET /api/events/` + `status` |
| 7 | Hayk | `reviews`, `lesson_info` из `main` |
| 8 | Suren | `GET /api/teams/` |
| 9 | Mariam | contact, comments, reply JWT |
| 10 | UI/QA | Unfold admin в `main/admin.py`, ui-blocks API, фронт + `client.js` |

---

## Волна 3 — что было ошибочно (исправлено в closure PR)

| Проблема | Было | Стало |
|----------|------|--------|
| Contact URL | `POST /api/leads/contact/` | `POST /api/contact/` |
| Swagger | импорт без маршрутов | `/api/schema/`, `/api/schema/swagger-ui/` |
| CI | только `check` | `migrate` + `init_ui` + `check` |
| `leads/views.py` | лишний `CategoryViewSet`, `render` | удалено |
| `leads/admin.py` | plain `register` | модели в `main/admin.py` (Unfold + inlines) |
| `EventSerializer` | без фильтра translations по языку | как у Category/LessonInfo |
| React страницы | TODO-заглушки | запросы к API, loading/error/empty |
| `frontend/src/api/client.js` | TODO | language на GET, JWT из `localStorage` |
| `fix.md` | «API TODO» | актуальный статус wave 3 |

---

## Волна 3 — техдолг (не блокирует merge в `dev`)

1. **Contact / backup** — закрыто в волне 4: `country`, `whatsapp`, FK `category` и форма `/contacts`.
2. **Event / Review** — полный паритет полей и медиа с backup.
3. **Admin** — `PopularCourse` / `Team` в Unfold (сейчас только через API; список в админке опционально).
4. **Фронт** — визуал и поведение как backup (дизайн, комментарии на страницах курсов, admin login UI).
5. **Docker** — автоматический `migrate` в entrypoint compose (сейчас вручную, см. backend.md).
6. **`GET /api/reviews/?language=`** — у `Review` нет translation-модели; параметр не влияет на тело ответа.
7. **Git** — не мержить `origin/feat/ui`, `origin/feature/events`; PR только в `dev`.

---

## Быстрая проверка окружения

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py init_ui
python manage.py check
python manage.py test apps.leads apps.courses
```

```bash
cd frontend && npm install && npm run build
```

---

## Исторический разбор (волна 2, для преподавателя)

Постмортем по зонам wave 2 — в git-истории репозитория. Актуальные чеклисты — разделы выше.

*Имена зон: Daniel, Sv, Karen, Vach, Ashot, Hayk, Suren, Mariam; Lead и UI/QA.*
