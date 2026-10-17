# Geko — задания команды

**Пошагово (волна 5):** [task-advanced.md](task-advanced.md)  
**Макет:** [Figma — Untitled](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0)  
**Git:** [CONTRIBUTING.md](CONTRIBUTING.md) · **API:** [docs/backend.md](docs/backend.md) · **Фронт:** [docs/frontend.md](docs/frontend.md)

---

## Волна 5 — UI по Figma **(сейчас)**

Шаги и DoD — в **[task-advanced.md](task-advanced.md)** (раздел «Волна 5»). Ошибки волны 4, которые чинятся по ходу вёрстки — [fix.md](fix.md).

Источник вида — файл Figma `dhh8j2e9rBeYrdPmzKz02I` (холст `0-1`), не папки backup. Данные по-прежнему с API.

| # | Имя | Фокус волны 5 |
|---|-----|----------------|
| 1 | Lead | Ревью по макету, Docker `migrate` перед `runserver` |
| 2 | Daniel | Медиа hero (видео/картинка из `frontend/public`) |
| 3 | Sv | Старт языка на `en`; queryset не прячет объект без перевода |
| 4 | Karen | Макет категорий; на странице только `CommentList` |
| 5 | Vach | Макет `/courses/:id`; тот же queryset-фикс в `courses` |
| 6 | Ashot | События: закрыть дыры DoD волны 4 и сверстать по кадру |
| 7 | Hayk | Секции отзывов и занятий на Home по кадру |
| 8 | Suren | `/about-us` по кадру; queryset команды без выкидывания строк |
| 9 | Mariam | Контакт и комментарии по кадру; текст «ждёт одобрения» |
| 10 | UI / QA | Токены, Header, Footer, 404, payload `init_ui` |

**Правила:** ветка `feat/<имя>-<зона>` от `dev`; один PR = одна зона; в `main` не пушить; модели не удалять; не мержить `origin/feat/ui` и `origin/feature/events`.

Порядок мержа: **Sv → UI/QA → Daniel → Mariam → Karen → Vach → Ashot → Hayk → Suren**.

---

## English

Wave **5** (UI from Figma) is **active**. Steps: [task-advanced.md](task-advanced.md). File: [Untitled](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0). Wave 4 gaps: [fix.md](fix.md). PRs to `dev` only.

Wave **4** (pages) closed 2026-10-10. Wave **3** closed 2026-10-04. Wave **2** closed 2026-09-29 — archives below.

## Հայերեն

**Ալիք 5** (UI ըստ Figma) — **ակտիվ**։ Քայլեր՝ [task-advanced.md](task-advanced.md)։ Մակետ՝ [Untitled](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0)։ Ալիք 4-ի սխալները՝ [fix.md](fix.md)։ PR միայն `dev`։

**Ալիք 4** փակված է (2026-10-10)։ **Ալիք 3** փակված է (2026-10-04)։ **Ալիք 2** փակված է (2026-09-29) — արխիվը ստորև։

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
