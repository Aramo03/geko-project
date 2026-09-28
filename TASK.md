# Geko — задания команды

**Пошагово (волна 3):** [task-advanced.md](task-advanced.md)  
**Git:** [CONTRIBUTING.md](CONTRIBUTING.md) · **API-цель:** [docs/backend.md](docs/backend.md)

---

## Волна 3 — API, admin, фронт **(сейчас)**

Одна зона = тот же человек, что в архиве волны 2 ниже. Детальные шаги, файлы и DoD — в **[task-advanced.md](task-advanced.md)** (раздел «Волна 3 — активные задания»). Техдолг после моделей — [fix.md](fix.md).

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

**Правила:** PR только в `dev`; в `main` не пушить; не удалять модели; не мержить устаревшие ветки UI/events (см. CONTRIBUTING).

---

## English

Wave **3** (API, admin, frontend) is **active**. Steps: [task-advanced.md](task-advanced.md). Gaps from models: [fix.md](fix.md). PRs to `dev` only, not `main`.

Wave **2** (Django models) is **done** on `dev` as of 2026-09-29 — archive below.

## Հայերեն

**Ալիք 3** (API, admin, front) — **ակտիվ**։ Մանրամասներ՝ [task-advanced.md](task-advanced.md)։ Մնացորդներ՝ [fix.md](fix.md)։

**Ալիք 2** (մոդելներ) **`dev`-ում փակված է** (2026-09-29) — արխիվը ստորև։

---

## Архив — волна 2 (модели Django, закрыта)

**Статус:** выполнена по сути (модели + миграции в `dev`).  
**Дата закрытия (документация):** 2026-09-29  
**Ветка:** `dev` (последние известные правки — миграции и `feat/courses` от Vach).

Оставшиеся расхождения и техдолг — в [fix.md](fix.md) (раздел «Статус после волны 2»).

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
