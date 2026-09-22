# Task advanced — карта зон и шаги

Короткое задание: [TASK.md](TASK.md). Здесь — **кто какую зону занимает**, слои Front / Back / Serv / UI / Translation и **пошаговый план** на 10 человек.

Git: [CONTRIBUTING.md](CONTRIBUTING.md). Поля моделей: [backup/prod-geko-back-main/main/models.py](backup/prod-geko-back-main/main/models.py) — смотри, не копируй файл целиком. Новое (`User`, `Comment`, `UIBlock`): [docs/backend.md](docs/backend.md).

**Волна 2 (сейчас) — только Django-модели.** React, serializers, views, JWT, Swagger, Docker как «моя фича», i18n JSON — **не эта волна**.

---

## Карта слоёв всего проекта

| Слой | Что это | Где в репо | Волна |
|------|---------|------------|--------|
| **Lead** | ветки, PR в `dev`, конфликты, порядок мержа | git | всегда |
| **Back — models** | таблицы БД | `backend/apps/accounts/`, `backend/apps/main/models.py` | **2 (сейчас)** |
| **Translation A (контент)** | тексты курсов / событий / команды в БД | `*Translation` рядом с моделями | **2 (сейчас)**, зоны 3–8 |
| **UI-слоты (бэк)** | JSON-блоки шапки, hero, футера | модель `UIBlock` + `init_ui` | **2 (сейчас)**, зона 10 |
| **Back — API** | `/api/…`, `?language=`, JWT, Swagger | serializers, views, urls | волна 3+ |
| **Back — admin** | Unfold, inlines, inbox заявок | `admin.py` | волна 3+ |
| **Serv** | Docker Compose, Postgres, CI, `.env.example` | корень репо, `.github/` | позже, Lead + зона 10 |
| **Front — shell** | роутер, Header, Footer, Redux, axios | `frontend/src/` | после API |
| **Front — страницы** | Home, About, Courses, Events, Contacts | `frontend/src/pages/` | после shell |
| **Translation B (UI)** | подписи кнопок и меню | `frontend/src/i18n/am.json` `en.json` `ru.json` | **не сейчас** |
| **UI / Design / QA** | токены, адаптив, пустые/ошибки | CSS, Tailwind, чеклисты | после страниц |

Два разных «перевода»:

1. **Контент** — названия категорий, курсов, событий, роли в команде. Живут в Django (`CategoryTranslation`, `EventTranslation`, …). Это **волна 2**.
2. **Интерфейс** — «Home», «Контакты», кнопки форм. Живут в JSON i18n. Это **фронт, следующая волна**.

---

## Кто что занимает: волна 2 → потом

| # | Зона сейчас | Слой сейчас | Файлы сейчас | Потом (волна 3+) |
|---|-------------|-------------|--------------|------------------|
| 1 | Lead | Lead / Serv-координация | git, ревью PR | Lead + Serv (Docker, CI) |
| 2 | User | Back | `accounts/models.py`, `managers.py` | JWT, `create_admin` |
| 3 | Language | Back + фундамент Translation | `main/models.py` → `Language` | API `?language=` |
| 4 | Category | Back + Translation | `Category`, `CategoryTranslation` | API категорий + Front список |
| 5 | Courses | Back + Translation | `PopularCourse` + translation | Front `/course-category`, `/courses/:id` |
| 6 | Events | Back + Translation | `Event` + translation + gallery | Front `/events/:tab` |
| 7 | Content | Back + Translation | `Review`, `LessonInfo` + translation | Front Home: отзывы, lesson stats |
| 8 | Team | Back + Translation | `Team` + `TeamTranslation` | Front About: слайдер |
| 9 | Leads + Comments | Back | `ContactMessage`, `Comment` | Front Contacts + треды, SMTP |
| 10 | UI / QA | UI-слоты + Serv (migrate) | `UIBlock`, `init_ui.py` | Design, i18n JSON, QA |

Параллель после моделей: **2–4** остаются на бэке (API / admin), **5** поднимает оболочку фронта, **6–9** ждут стабильный `/api/`, **10** идёт с токенами и переводами кнопок.

---

## Порядок мержа (строго)

```
User → Language → Category → Courses → Events → Content → Team → Leads/Comments → UIBlock
```

Почему так: `Category` нужен `Language`; `PopularCourse` нужен `Category`; `Comment` нужен `Category` и `PopularCourse`; `init_ui` нужен `Language` и `UIBlock`.

Lead держит таблицу «кто мержит и когда». Никто не пушит в `main`.

---

## Общие шаги (каждый, кроме Lead)

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

## Запрещено в волне 2

- `frontend/` — страницы, Header, i18n JSON, стили
- serializers, views, urls API, JWT, Swagger
- Docker / CI как содержимое своего PR
- `create_admin` и регистрация в `admin.py`
- копировать backup `models.py` целиком
- переименовывать `PopularCourse` / `ContactMessage`
- пушить в `main`
- второй «заодно» PR с CSS или API в той же зоне

---

## Волна 3+ (ещё не началась)

Когда преподаватель скажет «обнови task», короткий [TASK.md](TASK.md) перепишут. Ожидаемая раскладка тех же 10 номеров:

| # | Слой | Работа |
|---|------|--------|
| 1 | Lead + Serv | API-контракт, Docker Compose, ревью |
| 2 | Back | JWT, `create_admin`, User admin |
| 3–4 | Back API | ViewSet + `?language=`, категории |
| 5–8 | Front страницы | Courses, Events, Home/About, Team |
| 9 | Front + Back | контакты `POST /api/contact/`, комментарии, SMTP |
| 10 | UI + Translation B + QA | i18n JSON, токены, адаптив, empty/error |

До этой команды **не начинай** волну 3 в своём PR волны 2.

---

## English

Short assignment: [TASK.md](TASK.md). This file is the **zone map** and **step-by-step** for 10 people.

**Wave 2 = Django models only.** Do not touch React, serializers, views, JWT, Swagger, Docker-as-a-feature, or i18n JSON.

### Layer map

| Layer | Meaning | Wave |
|-------|---------|------|
| Lead | git, PR to `dev`, merge order | always |
| Back models | DB tables in `accounts` + `main/models.py` | **2 now** |
| Translation A | `*Translation` rows (course/event/team copy) | **2 now**, zones 3–8 |
| UI slots | `UIBlock` + `init_ui` | **2 now**, zone 10 |
| Back API / admin | `/api/…`, Unfold | later |
| Serv | Docker, Postgres, CI | later (Lead + zone 10) |
| Front shell / pages | Header, routes, Home…Contacts | later |
| Translation B | `frontend/src/i18n/*.json` (buttons/nav) | **not now** |

Merge order: **User → Language → Category → Courses → Events → Content → Team → Leads/Comments → UIBlock**.

Branch from `dev`: `feat/<name>-<zone>`. PR **only to `dev`**. Spec: backup `models.py` (read, do not paste the whole file). Keep names `PopularCourse` and `ContactMessage`.

### Per-zone steps (wave 2)

1. **Lead** — merge table, review FK/`unique_together`, resolve `models.py` conflicts without deleting others’ classes, never `main`. After all PRs: migrate with zone 10.
2. **User** — `accounts` `User` + `UserManager`; email login; roles `user`/`admin`/`superuser`; `save()` syncs `is_staff`/`is_superuser`. First model PR. Do not restore `create_admin`.
3. **Language** — `code`, `name` only. Seed `am`/`en`/`ru` later in `init_ui` (note that in the PR).
4. **Category** — wait for Language; `Category` + `CategoryTranslation` (`text`, `unique_together`, `related_name='translations'`).
5. **Courses** — wait for Category; **`PopularCourse`** (not `Course`) + translation (`title`, `lang`, `desc`).
6. **Events** — statuses `upcoming` / `happening` / `completed` only; + `EventTranslation` + `EventGallery`.
7. **Content** — `Review` (no translation model); `LessonInfo` + `LessonInfoTranslation`; `ordering` by `order`.
8. **Team** — `Team` + `TeamTranslation` (`name`, `role`, `desc`).
9. **Leads** — wait for Category + Courses; `ContactMessage`; `Comment` guest fields; **xor** `category` vs `popular_course`; `parent`; `is_approved`.
10. **UI/QA** — `UIBlock` (`key`, `section`, `payload`, `order`, `is_visible`); after every zone is in `dev`, `makemigrations` + `migrate` on a clean DB; restore `init_ui` for languages + four keys `header` / `hero` / `footer` / `contacts_bar` (idempotent). Checklist: every TODO class exists.

Later: 2–4 stay backend (JWT/API/admin); 5–9 become frontend pages; 10 becomes Design + i18n JSON + QA; Lead owns Serv.

---

## Հայերեն

Կարճ առաջադրանք՝ [TASK.md](TASK.md)։ Այս ֆայլը **գոտիների քարտեզն** է և **քայլ առ քայլ**՝ 10 հոգու համար։

**Ալիք 2 = միայն Django մոդելներ։** React, serializers, views, JWT, Swagger, Docker, i18n JSON՝ ոչ հիմա։

### Շերտեր

| Շերտ | Ինչ է | Ալիք |
|------|--------|------|
| Lead | git, PR դեպի `dev` | միշտ |
| Back models | `accounts` + `main/models.py` | **2 հիմա** |
| Translation A | `*Translation` աղյուսակներ | **2 հիմա**, գոտի 3–8 |
| UI slots | `UIBlock` + `init_ui` | **2 հիմա**, գոտի 10 |
| Back API / admin | `/api/…`, Unfold | հետո |
| Serv | Docker, Postgres, CI | հետո |
| Front | Header, էջեր | հետո |
| Translation B | `i18n/*.json` (կոճակներ) | **ոչ հիմա** |

Միաձուլման կարգ՝ **User → Language → Category → Courses → Events → Content → Team → Leads/Comments → UIBlock**։

Ճյուղ՝ `feat/<անուն>-<գոտի>` `dev`-ից։ PR միայն `dev`։ Դաշտերը՝ backup `models.py` (նայել, ամբողջ ֆայլը չպատճենել)։ Չվերանվանել `PopularCourse`, `ContactMessage`։

### Գոտիներ (ալիք 2)

1. **Lead** — merge աղյուսակ, կոնֆլիկտներ `models.py`-ում առանց ուրիշի կլասները ջնջելու, `main` չդիպչել։
2. **User** — email-լոգին, `user`/`admin`/`superuser`, manager, `save()` համաձայնեցնում է `is_staff`։ Առաջին PR։ `create_admin`՝ ոչ հիմա։
3. **Language** — `code`, `name`։ Seed `am`/`en`/`ru`՝ հետո `init_ui`-ում։
4. **Category** — սպասել Language-ին։ + Translation, `unique_together`։
5. **Courses** — հենց `PopularCourse`, ոչ `Course`։
6. **Events** — 3 status + gallery + translation։
7. **Content** — Review + LessonInfo (+ translation, `order`)։
8. **Team** — Team + TeamTranslation։
9. **Leads** — ContactMessage + Comment (category **կամ** course, ոչ երկուսը)։
10. **UI/QA** — UIBlock, ամբողջ `migrate`, `init_ui`՝ լեզուներ + 4 բլոկ (`header`, `hero`, `footer`, `contacts_bar`)։

Հետո՝ 2–4 մնում են backend, 5–9՝ էջեր, 10՝ դիզայն + i18n, Lead՝ Docker/CI։
