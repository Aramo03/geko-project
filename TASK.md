# Geko — задания команды

**Пошагово (волна 4):** [task-advanced.md](task-advanced.md)  
**Git:** [CONTRIBUTING.md](CONTRIBUTING.md) · **API:** [docs/backend.md](docs/backend.md) · **Фронт:** [docs/frontend.md](docs/frontend.md)

---

## Волна 4 — страницы как backup **(сейчас)**

Шаги, файлы и DoD — в **[task-advanced.md](task-advanced.md)** (раздел «Волна 4 — активные задания»). Долг полей после волны 3 — [fix.md](fix.md). Порядок мержа — там же, не здесь.

| # | Имя | Фокус волны 4 |
|---|-----|----------------|
| 1 | Lead | Порядок мержа, ревью, Docker `migrate` при старте backend |
| 2 | Daniel | Redux store + слайс токена (`geko_access_token`) |
| 3 | Sv | Согласовать язык UI и `?language=` (сейчас i18n fallback `am`, API default `en`) |
| 4 | Karen | `/course-category` и `/course-category/:id` |
| 5 | Vach | `/courses/:id` + карточка курса |
| 6 | Ashot | `/events`, вкладки, `/events/:tab/:id` |
| 7 | Hayk | Секции Home: reviews + lesson info |
| 8 | Suren | `/about-us` из `GET /api/teams/` + Unfold для Team |
| 9 | Mariam | Поля контакта как в [docs/frontend.md](docs/frontend.md) + компоненты комментариев |
| 10 | UI / QA | Header, Footer, 404, hero из `UIBlock`, чеклист пустых/ошибок |

**Правила:** ветка `feat/<имя>-<зона>` от `dev`; один PR = одна зона; в `main` не пушить; модели не удалять; не мержить `origin/feat/ui` и `origin/feature/events` (см. CONTRIBUTING).

---

## English

Wave **4** (pages like backup) is **active**. Steps: [task-advanced.md](task-advanced.md). Field gaps: [fix.md](fix.md). PRs to `dev` only.

Wave **3** (API, admin, frontend shell) closed 2026-10-04. Wave **2** (models) closed 2026-09-29 — archives below.

## Հայերեն

**Ալիք 4** (էջեր backup-ի պես) — **ակտիվ**։ Մանրամասներ՝ [task-advanced.md](task-advanced.md)։ Մնացորդներ՝ [fix.md](fix.md)։

**Ալիք 3** փակված է (2026-10-04)։ **Ալիք 2** փակված է (2026-09-29) — արխիվը ստորև։

---

## Архив — волна 3 (API, admin, фронт, закрыта)

**Дата закрытия (документация):** 2026-10-04 · **Ветка:** `dev`  
Исправления и техдолг — **[fix.md](fix.md)**. Пошаговый архив — **[task-advanced.md](task-advanced.md)**.

### Итог по зонам (wave 3)

| # | Имя | Фокус волны 3 |
|---|-----|----------------|
| 1 | Lead | Контракт API, ревью PR в `dev`, Docker/CI (`migrate` в pipeline) |
| 2 | Daniel | JWT (`/api/auth/token/`), восстановить `create_admin`, `accounts/admin.py` |
| 3 | Sv | Параметр `?language=` (базовый хелпер/миксин для ViewSet) |
| 4 | Karen | API категорий |
| 5 | Vach | API popular courses + связь с категориями |
| 6 | Ashot | API events (+ фильтр по `status`) |
| 7 | Hayk | API reviews / lesson_info (**источник данных:** `main`, не `content`) |
| 8 | Suren | API teams |
| 9 | Mariam | `POST /api/contact/`, comments GET/POST, reply с JWT |
| 10 | UI / QA | Unfold admin, i18n JSON, shell/страницы, QA после API |

---

## Архив — волна 2 (модели Django, закрыта)

**Статус:** выполнена по сути (модели + миграции в `dev`).  
**Дата закрытия (документация):** 2026-09-29  
**Ветка:** `dev` (последние известные правки — миграции и `feat/courses` от Vach).

Архитектура wave 2 и техдолг — в [fix.md](fix.md) (раздел «Архив — волна 2»).

### Итог по зонам (wave 2)

| # | Имя | Зона | Результат в `dev` |
|---|-----|------|-------------------|
| 1 | Lead | Порядок мержа, ревью | PR в `dev`; `feat/courses` влит; **не** мержить `origin/feat/ui`, `origin/feature/events` |
| 2 | Daniel | User | `accounts.User` + `UserManager`, email, роли, `save()` |
| 3 | Sv | Language | `Language` в `apps/main` |
| 4 | Karen | Category | `Category` + `CategoryTranslation` |
| 5 | Vach | Courses | `PopularCourse` в `apps.courses` + translation |
| 6 | Ashot | Events | `Event` + translation + gallery; поле `status` (`0005_event_status`) |
| 7 | Hayk | Content | `Review`, `LessonInfo` в `main` (+ дубликат в `apps.content` — **намеренно**, не удалять) |
| 8 | Suren | Team | `Team` в `apps.team` |
| 9 | Mariam | Leads + Comments | `ContactMessage`, `Comment` (+ `is_approved`, xor в `clean()`) |
| 10 | UI / QA | UIBlock, migrate, `init_ui` | `UIBlock`; `init_ui` — языки + 4 блока; `migrate` на **новой** SQLite проходит |

**DoD волны 2 (факт):** сериализаторы, views, React, admin, JWT в этой волне не требовались.
