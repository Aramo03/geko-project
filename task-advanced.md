# Task advanced — карта зон и шаги

Короткое задание: [TASK.md](TASK.md). **Сначала читай волну 3**; волна 2 (модели) — архив внизу.

Git: [CONTRIBUTING.md](CONTRIBUTING.md). API: [docs/backend.md](docs/backend.md). Поля моделей (архив): [backup/prod-geko-back-main/main/models.py](backup/prod-geko-back-main/main/models.py).

**Волна 3 (сейчас)** — API, admin, `create_admin`, фронт, i18n UI, CI. **Волна 2 закрыта** (2026-09-29). Пробелы: [fix.md](fix.md).

---

## Карта слоёв всего проекта

| Слой | Что это | Где в репо | Волна |
|------|---------|------------|--------|
| **Lead** | ветки, PR в `dev`, конфликты, порядок мержа | git | всегда |
| **Back — models** | таблицы БД | `accounts`, `main`, `courses`, `team`, `content` | **2 ✓** |
| **Translation A (контент)** | тексты курсов / событий / команды в БД | `*Translation` рядом с моделями | **2 ✓** |
| **UI-слоты (бэк)** | JSON-блоки шапки, hero, футера | `UIBlock` + `init_ui` | **2 ✓** |
| **Back — API** | `/api/…`, `?language=`, JWT, Swagger | serializers, views, urls | **3 (сейчас)** |
| **Back — admin** | Unfold, inlines, inbox заявок | `admin.py` | **3 (сейчас)** |
| **Serv** | Docker Compose, Postgres, CI, `.env.example` | корень репо, `.github/` | позже, Lead + зона 10 |
| **Front — shell** | роутер, Header, Footer, Redux, axios | `frontend/src/` | после API |
| **Front — страницы** | Home, About, Courses, Events, Contacts | `frontend/src/pages/` | после shell |
| **Translation B (UI)** | подписи кнопок и меню | `frontend/src/i18n/am.json` `en.json` `ru.json` | **не сейчас** |
| **UI / Design / QA** | токены, адаптив, пустые/ошибки | CSS, Tailwind, чеклисты | после страниц |

Два разных «перевода»:

1. **Контент** — названия категорий, курсов, событий, роли в команде. Живут в Django (`CategoryTranslation`, `EventTranslation`, …). Это **волна 2**.
2. **Интерфейс** — «Home», «Контакты», кнопки форм. Живут в JSON i18n. Это **фронт** (часть волны 3, зона 10).

---

## Кто что занимает: волна 3

| # | Имя | Зона | Слой волны 3 | Ключевые файлы |
|---|-----|------|--------------|----------------|
| 1 | Lead | Lead | git, API-контракт, CI | `CONTRIBUTING.md`, `.github/workflows/ci.yml`, `docs/backend.md` |
| 2 | Daniel | User | JWT, admin user | `accounts/`, `config/urls.py`, `create_admin.py` |
| 3 | Sv | Language | `?language=` | `main/serializers.py`, `main/views.py`, хелперы |
| 4 | Karen | Category | API категорий | `main/views.py`, `main/serializers.py` |
| 5 | Vach | Courses | API курсов | `apps/courses/`, router в `main/urls.py` |
| 6 | Ashot | Events | API событий + `status` | `main/models.py` Event*, views/serializers |
| 7 | Hayk | Content | API reviews / lesson_info | **`main`**, не `apps.content` |
| 8 | Suren | Team | API teams | `apps/team/`, serializers |
| 9 | Mariam | Leads + Comments | contact + comments | `ContactMessage`, `Comment`, email |
| 10 | UI / QA | Admin + Front + QA | Unfold, i18n, страницы | `admin.py`, `frontend/src/` |

Параллель после моделей: **2–4** остаются на бэке (API / admin), **5** поднимает оболочку фронта, **6–9** ждут стабильный `/api/`, **10** идёт с токенами и переводами кнопок.

---

## Порядок мержа волны 3 (строго)

```
Daniel (auth) → Sv (?language=) → Karen → Vach → Ashot → Hayk → Suren → Mariam (POST) → UI/QA
```

Lead держит таблицу «кто мержит и когда». Никто не пушит в `main`.

---

## Общие шаги (волна 3)

1. Прочитай [TASK.md](TASK.md) и свой блок ниже в «Волна 3 — активные задания».
2. Прочитай [CONTRIBUTING.md](CONTRIBUTING.md).
3. Обнови `dev` и создай ветку:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/<имя>-<зона>
```

4. Спека URL: [docs/backend.md](docs/backend.md). Поля моделей (если нужно): backup `models.py` — смотри, не копируй целиком.
5. Один PR = одна зона. Не удаляй Django-модели. Не мешай API с CSS / React в одном PR.
6. PR: **base = `dev`**, не `main`. Конфликт в `urls.py` / serializers — зови Lead.
7. **Не мержить** `origin/feat/ui`, `origin/feature/events`.

---

## Волна 3 — активные задания

Спека URL: [docs/backend.md](docs/backend.md). Ветка: `feat/<имя>-<зона>` от `dev`, PR только в `dev`. **Не мержить** `origin/feat/ui`, `origin/feature/events`.

### 1 — Lead

1. Зафиксировать в чате контракт API (пути как в `docs/backend.md`).
2. Ревью: один PR = одна зона; без force-push в `dev`/`main`.
3. Добавить в CI шаг `python manage.py migrate` (и по желанию smoke `init_ui` после migrate).
4. Координировать порядок: **Daniel (auth) → Sv (language helper) → GET API по зонам 4–8 → Mariam (POST) → фронт**.

### 2 — Daniel (User / auth)

1. Восстановить [`create_admin`](backend/apps/accounts/management/commands/create_admin.py) (role=`admin`, `is_staff=True`) — `User` уже есть, заглушку убрать.
2. SimpleJWT: `POST /api/auth/token/`, подключить в [`config/urls.py`](backend/config/urls.py).
3. Зарегистрировать `User` в [`accounts/admin.py`](backend/apps/accounts/admin.py) (Unfold).
4. DoD: `create_admin` + логин через JWT для `admin`/`superuser`.

### 3 — Sv (Language)

1. Общий способ отдавать переводы по `?language=` (query param, default `en` или `am` — согласовать с Lead).
2. Вынести повторяющуюся логику из `get_translation` в serializer mixin или helper (не дублировать в 5 ViewSet).
3. DoD: любой list/detail API зон 4–8 принимает `language` и отдаёт нужный `*Translation`.

### 4 — Karen (Category)

1. Serializer: `Category` + nested/flat translation text.
2. ViewSet: `GET /api/categories/?language=`.
3. DoD: Swagger показывает endpoint; фильтр по языку работает.

### 5 — Vach (Courses)

1. Serializers для `PopularCourse` + translation (`apps.courses`).
2. `GET /api/popular_courses/?language=`, `GET /api/courses/<category_id>/` (как в backup).
3. DoD: FK на категорию отражён в API; имена **PopularCourse**.

### 6 — Ashot (Events)

1. ViewSet/list: `GET /api/events/?language=` и detail `GET /api/events/<id>/`.
2. Фильтр по `status` (`upcoming` / `happening` / `completed`) для вкладок фронта.
3. DoD: три статуса в API; gallery по необходимости read-only.

### 7 — Hayk (Content)

1. `GET /api/reviews/?language=` и `GET /api/lesson_info/?language=` из **`main.models`**.
2. **Не** подключать `apps.content` к публичному API без решения Lead (дубликат моделей намеренный).
3. DoD: ordering `LessonInfo` по `order`.

### 8 — Suren (Team)

1. `GET /api/teams/?language=` из `apps.team`.
2. Serializer: `name`, `role`, `desc` из `TeamTranslation`.
3. DoD: `db_table`/`related_name` не ломают migrate.

### 9 — Mariam (Leads + Comments)

1. `POST /api/contact/` → `ContactMessage` (валидация полей; при необходимости добавить поля backup — отдельный PR с Lead).
2. `GET /api/comments/?category=` | `?popular_course=`; `POST /api/comments/` без JWT (гость).
3. `POST /api/comments/<id>/reply/` с JWT (`admin`); уважать `is_approved` и xor category/course.
4. DoD: гость не может reply; admin может.

### 10 — UI / QA

1. Зарегистрировать модели в [`main/admin.py`](backend/apps/main/admin.py) (Unfold, inlines для translations где уместно).
2. `GET /api/ui-blocks/` (read-only для фронта).
3. Фронт: [`frontend/src/api/client.js`](frontend/src/api/client.js) — language query, JWT interceptor; страницы из TODO (`Home`, `Courses`, `Events`, `Contacts`, …).
4. i18n UI: `frontend/src/i18n/am.json`, `en.json`, `ru.json` (кнопки/меню — не путать с Translation A в БД).
5. DoD: `migrate` + `init_ui` в README/Docker; чеклист пустых состояний и ошибок API.

**Запрещено в волне 3:** удалять Django-модели; мержить `feat/ui` / `feature/events`; пушить в `main`.

---

## Архив — волна 2 (модели, закрыта)

Справочник по выполненным заданиям моделей. **Не начинай отсюда** — активная работа в разделе «Волна 3» выше.

### Порядок мержа моделей (волна 2)

```
User → Language → Category → Courses → Events → Content → Team → Leads/Comments → UIBlock
```

Почему так: `Category` нужен `Language`; `PopularCourse` нужен `Category`; `Comment` нужен `Category` и `PopularCourse`; `init_ui` нужен `Language` и `UIBlock`.

Lead держит таблицу «кто мержит и когда». Никто не пушит в `main`.

---

### Общие шаги (волна 2, каждый кроме Lead)

Делай **до** кода своей зоны.

1. Прочитай [TASK.md](TASK.md) (своя зона) и этот файл (свои шаги).
2. Прочитай [CONTRIBUTING.md](CONTRIBUTING.md).
3. Обнови `dev` и создай ветку:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/<имя>-<зона>
```

Примеры зон в имени ветки: `user`, `language`, `category`, `courses`, `events`, `content`, `team`, `leads`, `ui`.

4. Открой спеку: `backup/prod-geko-back-main/main/models.py`.
5. Пиши **только свои классы**. Чужие TODO и чужие классы не удаляй и не переписывай.
6. Имена классов как в backup. Не переименовывай `PopularCourse`, `ContactMessage`.
7. Коммит и push:

```bash
git add .
git commit -m "feat(<зона>): add <Model> models"
git push -u origin HEAD
```

8. PR: **base = `dev`**, не `main`. В описании PR: какие модели, какие FK, что проверить.
9. Если конфликт в `main/models.py` — не затирай чужие классы, зови Lead.

Один PR = одна зона. Не мешай модели с CSS / React / serializers.

---

## Зона 1 — Lead

**Слой:** Lead (git). Код моделей не пишешь, кроме помощи при конфликте.

### Шаги

1. Составь таблицу в чате команды:

   | # | Имя | Зона | Ветка | PR | Когда мержить |
   |---|-----|------|-------|----|---------------|
   | 2 | … | User | `feat/…-user` | ссылка | 1-й |
   | 3 | … | Language | … | … | 2-й |
   | … | … | … | … | … | … |

2. Проверь, что все ветки от актуального `dev`, не от `main`.
3. Ревью: имена классов, FK, `unique_together`, `related_name='translations'`, `ordering`.
4. Мержи **строго по порядку** выше. Не мержи Courses до Category.
5. Конфликт в `main/models.py`: оставь **оба** набора классов, убери только маркеры `<<<<<<<`.
6. После последнего PR зоны 10: вместе запускаете `makemigrations` + `migrate` (зона 10 ведёт).
7. Напиши в чат: «волна 2 закрыта, модели в `dev`».

### DoD

- Все PR влиты в `dev`, не в `main`.
- На чистой БД команда прогоняет migrate (зона 10).
- Никто не force-push в `dev` / `main`.

---

## Зона 2 — User (`accounts`)

**Слой:** Back. **Первый PR среди моделей.**

**Файлы:** [`backend/apps/accounts/models.py`](backend/apps/accounts/models.py), [`backend/apps/accounts/managers.py`](backend/apps/accounts/managers.py).

`AUTH_USER_MODEL = "accounts.User"` уже стоит в settings — не меняй.

### Шаги

1. Ветка: `feat/<имя>-user`.
2. В `managers.py` реализуй `UserManager` (`BaseUserManager`):
   - `create_user(email, password=None, **extra_fields)` — email обязателен, `set_password`.
   - `create_superuser(email, password=None, **extra_fields)` — `role=superuser`, `is_staff=True`, `is_superuser=True`.
3. В `models.py` кастомный `User`:
   - `AbstractBaseUser` + `PermissionsMixin`.
   - Логин = **email** (`USERNAME_FIELD = "email"`), не `username`.
   - Роль: choices `user` / `admin` / `superuser`.
   - `objects = UserManager()`.
4. В `save()` согласуй флаги с ролью:
   - `admin` → `is_staff=True`;
   - `superuser` → `is_staff=True` и `is_superuser=True`;
   - `user` → не staff / не superuser.
5. Проверка:

```bash
cd backend
python manage.py makemigrations accounts
```

Без ошибок. Сам `migrate` можно локально, в PR достаточно makemigrations.

6. **Не** включай `create_admin` и **не** пиши `accounts/admin.py` — следующая волна.

### DoD

- `makemigrations accounts` проходит.
- PR в `dev` **первым** среди зон 2–10.

---

## Зона 3 — Language

**Слой:** Back + фундамент Translation. Зоны 4–8 ждут этот мерж.

**Файл:** [`backend/apps/main/models.py`](backend/apps/main/models.py) — только класс `Language`.

### Шаги

1. Ветка: `feat/<имя>-language`.
2. Добавь `Language`:
   - `code` — `CharField`, `unique=True` (значения потом: `am`, `en`, `ru`);
   - `name` — `CharField`;
   - `__str__` → `name` (как в backup).
3. Не сиди языки в этом PR. В описании PR напиши: «seed `am` / `en` / `ru` позже в `init_ui` (зона 10)».
4. `makemigrations main` (если Django просит — только своя модель).
5. Не трогай другие классы в том же файле.

### DoD

- Модель `Language` в коде.
- Миграция `main` (или готовность к общей миграции — как скажет Lead).
- В PR есть пометка про seed.

---

## Зона 4 — Category

**Слой:** Back + Translation A.

**Файл:** `backend/apps/main/models.py`. Спека: backup `Category`, `CategoryTranslation`.

### Шаги

1. Дождись мержа **Language** в `dev`, подтяни: `git pull origin dev`.
2. `Category`:
   - `local_image` (`ImageField`, `upload_to='images/'`, blank/null);
   - `image_url` (`URLField`, blank/null);
   - `order` (`PositiveIntegerField`, default 0, blank/null);
   - `Meta.ordering = ['order']`;
   - `get_image()`, `get_translation(language_code)`, `__str__` как в backup.
3. `CategoryTranslation`:
   - FK `category` → `Category`, `related_name='translations'`, `CASCADE`;
   - FK `language` → `Language`, `CASCADE`;
   - поле `text`;
   - `unique_together = ('category', 'language')`.
4. В описании PR явно: «Category 1—* CategoryTranslation, translations фильтруются по `language__code`».
5. Не пиши сериализаторы и не сиди категории.

### DoD

- Обе модели есть, unique на пару category+language.
- Миграция / готовность к merge.

---

## Зона 5 — Courses

**Слой:** Back + Translation A. Потом Front: курсы.

**Имя класса: `PopularCourse`, не `Course`.**

### Шаги

1. Дождись мержа **Category**.
2. `PopularCourse` (поля как в backup):
   - FK `category` → `Category`;
   - `local_image`, `image_url`, `duration`;
   - `certification`, `students`, `studentGroup`, `assessments` — choices `yes` / `no`;
   - `order`, `Meta.ordering = ['order']`;
   - `get_image()`, `get_translation()`, `__str__`.
3. `PopularCourseTranslation`:
   - FK `popular_course`, `related_name='translations'`;
   - FK `language`;
   - `title`, `lang`, `desc`;
   - `unique_together = ('popular_course', 'language')`.
4. Проверь имя класса в PR: **PopularCourse**.

### DoD

- Имена как в backup.
- Миграция готова.

---

## Зона 6 — Events

**Слой:** Back + Translation A. Потом Front: вкладки событий.

### Шаги

1. Дождись **Language** (и лучше общий `dev` после Category, чтобы меньше конфликтов).
2. Choices статуса **точно три**, как в backup:

```python
('upcoming', 'Upcoming'),
('happening', 'Happening'),
('completed', 'Completed'),
```

3. `Event`: `start_date`, `end_date`, `image` (`upload_to='event_gallery_photos/'`), `order`, `status`, `get_translation()`, `__str__`.
4. `EventTranslation`: `place`, `title`, `description`; FK `event` + `language`; `unique_together = ('event', 'language')`; `related_name='translations'`.
5. `EventGallery`: FK `event`, `related_name='event_galleries'`; `local_image` (`upload_to='event_gallery_images/'`); `image_url`; `order`; `get_image()`.
6. Не выдумывай четвёртый статус и не переименовывай `happening`.

### DoD

- Три статуса как в backup.
- Три класса на месте.

---

## Зона 7 — Content

**Слой:** Back + Translation A. Потом секции Home.

### Шаги

1. Подтяни `dev` с `Language`.
2. `Review` (без translation-модели):
   - `local_image` (`upload_to='review_images/'`), `image_url`, `name`, `comment`;
   - `get_image()`, `__str__` → `name`.
3. `LessonInfo`:
   - `local_image` (`upload_to='lesson_images/'`), `image_url`, `order`;
   - `Meta.ordering = ['order']`;
   - `get_translation()`, `__str__`.
4. `LessonInfoTranslation`:
   - FK `lesson_info`, `related_name='translations'`;
   - FK `language`;
   - `title`;
   - `unique_together = ('lesson_info', 'language')`.
5. Ordering по `order` — не забудь `Meta` там, где он есть в backup.

### DoD

- `Review` + пара LessonInfo.
- `ordering` как в backup.

---

## Зона 8 — Team

**Слой:** Back + Translation A. Потом About.

### Шаги

1. Подтяни `dev` с `Language`.
2. `Team`: `local_image` (`upload_to='team_images/'`), `image_url`, `order`, `Meta.ordering = ['order']`, `get_image()`, `get_translation()`.
3. `TeamTranslation`: FK `team` + `language`; поля `name`, `role`, `desc`; `unique_together = ('team', 'language')`; `related_name='translations'`.
4. Не клади имя/роль на саму `Team` — они в translation.

### DoD

- Обе модели, unique на team+language.

---

## Зона 9 — Leads + Comments

**Слой:** Back. Потом Front: форма контактов + комментарии.

**Имя: `ContactMessage`, не `Lead` и не `Feedback`.**

### Шаги

1. Дождись мержа **Category** и **Courses** (`Comment` ссылается на оба).
2. `ContactMessage` как в backup:
   - `full_name`, `email`, `message`, `country`, `whatsapp`;
   - FK `category` → `Category`, `SET_NULL`, `null=True`, `blank=True`.
3. `Comment` (новое, не копируется из backup целиком):
   - гость без логина: `full_name`, `email`, `whatsapp` (`blank=True` ок), `text`;
   - FK `category` → `Category`, null/blank;
   - FK `popular_course` → `PopularCourse`, null/blank;
   - FK `parent` → `self` (ответ admin), null/blank;
   - `is_approved` (bool).
4. Validation **ровно одна цель**: заполнен `category` **или** `popular_course`, не оба и не оба пустые (xor). Сделай в `clean()` / `save()` модели (или CheckConstraint — как удобнее, но в PR опиши).
5. Не пиши views `POST /api/contact/` и `POST /api/comments/` — только модели.

### DoD

- Обе модели.
- В PR описан xor: category xor popular_course.

---

## Зона 10 — UI / QA

**Слой:** UI-слоты (бэк) + Serv (общие миграции). **Не React и не CSS.**

**Файлы:** `UIBlock` в `main/models.py`; [`backend/apps/main/management/commands/init_ui.py`](backend/apps/main/management/commands/init_ui.py) (сейчас заглушка).

### Шаги

1. Пока другие мержатся — напиши модель `UIBlock`:
   - `key` (уникальный слот, например `header`);
   - `section`;
   - `payload` (`JSONField`);
   - `order`;
   - `is_visible`.
2. **Не мержи `init_ui` раньше**, чем в `dev` есть `Language` и `UIBlock`.
3. После **всех** зон 2–9 в `dev`:
   - `git checkout dev && git pull origin dev`;
   - с Lead: `python manage.py makemigrations` и `python manage.py migrate` на **чистой** БД (удали локальный sqlite, если тестируешь с нуля).
4. Восстанови `init_ui`:
   - создаёт языки `am`, `en`, `ru` (не дублирует, если уже есть);
   - создаёт 4 блока: `header`, `hero`, `footer`, `contacts_bar` (не дублирует по `key`);
   - команда идемпотентна: повторный вызов не плодит строки.
5. Чеклист по TODO в `main/models.py`: все классы из списка есть в коде после мержа.
6. Не регистрируй модели в `admin.py` и не пиши фронт под `UIBlock`.

### DoD

- `migrate` на чистой БД проходит.
- `python manage.py init_ui` создаёт языки и 4 блока.
- Чеклист моделей закрыт.

---

### Запрещено в волне 2

- `frontend/` — страницы, Header, i18n JSON, стили
- serializers, views, urls API, JWT, Swagger
- Docker / CI как содержимое своего PR
- `create_admin` и регистрация в `admin.py`
- копировать backup `models.py` целиком
- переименовывать `PopularCourse` / `ContactMessage`
- пушить в `main`
- второй «заодно» PR с CSS или API в той же зоне

---

## English

Short assignment: [TASK.md](TASK.md). **Read wave 3 first**; wave 2 is archive at the bottom.

**Wave 3 (now):** API, admin, JWT, frontend, i18n UI. See «Волна 3 — активные задания» above. Spec: [docs/backend.md](docs/backend.md). PR **only to `dev`**. Do not merge `feat/ui` / `feature/events`. Keep `PopularCourse` and `ContactMessage` names.

**Merge order (wave 3):** Daniel (auth) → Sv (`?language=`) → Karen → Vach → Ashot → Hayk → Suren → Mariam (POST) → UI/QA.

### Layer map

| Layer | Meaning | Wave |
|-------|---------|------|
| Lead | git, PR to `dev`, merge order | always |
| Back models | DB tables in `accounts` + apps | **2 done** |
| Translation A | `*Translation` rows | **2 done** |
| UI slots | `UIBlock` + `init_ui` | **2 done** |
| Back API / admin | `/api/…`, Unfold | **3 now** |
| Serv | Docker, Postgres, CI | later (Lead + zone 10) |
| Front shell / pages | Header, routes, Home…Contacts | **3** (zone 10) |
| Translation B | `frontend/src/i18n/*.json` | **3** (zone 10) |

### Archive — wave 2 (models)

Merge order: **User → Language → Category → Courses → Events → Content → Team → Leads/Comments → UIBlock**.

Per-zone summary: Lead merge table; User email + roles; Language `code`/`name`; Category + Translation; **PopularCourse**; Events three statuses + gallery; Review + LessonInfo; Team + Translation; ContactMessage + Comment (xor); UIBlock + `init_ui` on clean DB.

---

## Հայերեն

Կարճ առաջադրանք՝ [TASK.md](TASK.md)։ **Նախ կարդա ալիք 3**; ալիք 2 — արխիվ ստորև։

**Ալիք 3 (հիմա)** — API, admin, JWT, front, i18n UI։ Մանրամասներ՝ վերևի «Волна 3 — активные задания»։ PR միայն `dev`։

**Merge (ալիք 3)**՝ Daniel → Sv → Karen → Vach → Ashot → Hayk → Suren → Mariam → UI/QA։

### Շերտեր (ալիք 3)

| Շերտ | Ինչ է | Ալիք |
|------|--------|------|
| Lead | git, PR դեպի `dev` | միշտ |
| Back models | մոդելներ | **2 փակված** |
| Back API / admin | `/api/…`, Unfold | **3 հիմա** |
| Front + i18n | էջեր, `i18n/*.json` | **3, գոտի 10** |

### Արխիվ — ալիք 2 (մոդելներ)

Միաձուլման կարգ՝ **User → Language → Category → Courses → Events → Content → Team → Leads/Comments → UIBlock**։

Գոտիներ՝ User, Language, Category, PopularCourse, Events, Content, Team, ContactMessage + Comment, UIBlock + `init_ui`։

