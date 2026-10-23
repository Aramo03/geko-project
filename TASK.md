# Geko — задания команды

**Пошагово (волна 6):** [task-advanced.md](task-advanced.md)  
**Закрытие волны 5 и долг:** [fix.md](fix.md)  
**Git:** [CONTRIBUTING.md](CONTRIBUTING.md) · **API:** [docs/backend.md](docs/backend.md) · **Фронт:** [docs/frontend.md](docs/frontend.md)

---

## Архив — волна 6 (QA, production, polish, закрыта)

**Дата закрытия:** 2026-10-23 · **Ветка:** `dev`  
Шаги — в **[task-advanced.md](task-advanced.md)**. Аудит — [fix.md](fix.md). Запуск — [docs/deploy.md](docs/deploy.md).

Три трека закрыты: **QA/тесты**, **production/deploy**, **polish/UX**. Новых функций нет. База — пустой PostgreSQL, демо-строки и лишние картинки в media не сидируются.

| # | Имя | Фокус волны 6 | Итог |
|---|-----|----------------|--------|
| 1 | Lead | CI: тесты + `docker compose up` smoke | тесты и smoke в CI |
| 2 | Daniel | gunicorn, `collectstatic`, env-секреты, hero | gunicorn + WhiteNoise |
| 3 | Sv | тесты языка, SEO `lang` | detail без перевода, `html lang` |
| 4 | Karen | тесты и polish категорий | API категорий, 375px |
| 5 | Vach | тесты и polish `/courses/:id` | detail не 404 |
| 6 | Ashot | тесты событий | три статуса, gallery |
| 7 | Hayk | Home polish, code-splitting | маршруты кроме Home ленивые |
| 8 | Suren | тесты и polish About | команда без перевода на `en` остаётся |
| 9 | Mariam | тесты форм, a11y | гость скрыт, reply без JWT запрещён |
| 10 | UI / QA | prod-фронт, чеклист | nginx-сборка, чеклист в docs/frontend.md |

**Правила:** ветка `feat/<имя>-<зона>` от `dev`; один PR = одна зона; в `main` не пушить; модели не удалять; не мержить `origin/feat/ui` и `origin/feature/events`.

Порядок мержа: **Lead/Daniel (CI + prod-каркас) → UI/QA (prod-фронт + чеклист) → Karen → Vach → Ashot → Hayk → Suren → Mariam → Sv**.

---

## English

Wave **6** (QA/tests, production, polish) is **closed** on `dev` (2026-10-23). Audit: [fix.md](fix.md). Deploy: [docs/deploy.md](docs/deploy.md). Empty PostgreSQL, no demo rows. Do not push to `main`.

Wave **5** (UI from Figma) closed 2026-10-19. Wave **4** closed 2026-10-10. Wave **3** closed 2026-10-04. Wave **2** closed 2026-09-29 — archives below.

## Հայերեն

**Ալիք 6** (QA/թեստեր, production, polish) — **փակված է** `dev`-ի վրա (2026-10-23)։ Աուդիտ՝ [fix.md](fix.md)։ Deploy՝ [docs/deploy.md](docs/deploy.md)։ Դատարկ PostgreSQL, demo տողեր չկան։ `main` չենք push անում։

**Ալիք 5** փակված է (2026-10-19)։ **Ալիք 4** փակված է (2026-10-10)։ **Ալիք 3** փակված է (2026-10-04)։ **Ալիք 2** փակված է (2026-09-29) — արխիվը ստորև։

---

## Архив — волна 5 (UI по Figma, закрыта)

**Дата закрытия:** 2026-10-19 · **Ветка:** `dev`  
Ошибки и аудит — **[fix.md](fix.md)**. Пошаговый архив — **[task-advanced.md](task-advanced.md)**.

| # | Имя | Фокус волны 5 | Итог проверки |
|---|-----|----------------|----------------|
| 1 | Lead | Ревью по макету, Docker `migrate` | migrate в compose есть; docker up и Figma — ручная подпись |
| 2 | Daniel | Медиа hero | сделано |
| 3 | Sv | Старт `en`, queryset | сделано |
| 4 | Karen | Категории, `CommentList` | сделано; мёртвый `CourseComments` удалён при закрытии |
| 5 | Vach | `/courses/:id`, queryset | сделано |
| 6 | Ashot | События целиком | сделано |
| 7 | Hayk | Home: reviews + lessons | сделано |
| 8 | Suren | About, queryset команды | сделано |
| 9 | Mariam | Контакт, комментарии | сделано |
| 10 | UI / QA | Токены, Header, Footer, 404, `init_ui` | сделано; payload `hero` дозаполнен при закрытии |

---

## Архив — волна 4 (страницы, закрыта)

**Дата закрытия:** 2026-10-10 · **Ветка:** `dev`  
Ошибки — **[fix.md](fix.md)**. Пошаговый архив — **[task-advanced.md](task-advanced.md)**.

| # | Имя | Фокус волны 4 | Итог проверки |
|---|-----|----------------|----------------|
| 1 | Lead | Docker `migrate`, порядок PR | migrate в compose нет |
| 2 | Daniel | Redux token | сделано |
| 3 | Sv | UI язык = API, default `en` | fallback есть, детектор браузера мешает |
| 4 | Karen | Категории | страницы есть, комментарии продублированы |
| 5 | Vach | Курс | страница и admin есть, queryset режет курс |
| 6 | Ashot | События | список-заглушка, детали нет |
| 7 | Hayk | Home: reviews + lessons | сделано |
| 8 | Suren | About + admin Team | сделано |
| 9 | Mariam | Контакт + комментарии | сделано |
| 10 | UI / QA | Header, Footer, 404, hero | каркас есть, вид не макет |

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
