# Task advanced — карта зон и шаги

Короткое задание: [TASK.md](TASK.md). **Сначала читай волну 5**; волны 4, 3 и 2 — архив ниже.

Git: [CONTRIBUTING.md](CONTRIBUTING.md). API: [docs/backend.md](docs/backend.md). Фронт: [docs/frontend.md](docs/frontend.md). Ошибки волны 4: [fix.md](fix.md).

**Макет волны 5:** [Figma Untitled](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0) — файл `dhh8j2e9rBeYrdPmzKz02I`, холст `node-id=0-1`. Backup [backup/geko-front-main](backup/geko-front-main) — только сверить старое поведение, папки не копировать и пиксели оттуда не снимать.

**Волна 5 (сейчас)** — сверстать экраны по этому Figma и закрыть дыры DoD из [fix.md](fix.md). **Волна 4 закрыта** (2026-10-10). **Волна 3 закрыта** (2026-10-04). **Волна 2 закрыта** (2026-09-29).

---

## Карта слоёв всего проекта

| Слой | Что это | Где в репо | Волна |
|------|---------|------------|--------|
| **Lead** | ветки, PR в `dev`, конфликты, порядок мержа | git | всегда |
| **Back — models** | таблицы БД | `accounts`, `main`, `courses`, `team`, `content` | **2 ✓** |
| **Translation A (контент)** | тексты курсов / событий / команды в БД | `*Translation` рядом с моделями | **2 ✓** |
| **UI-слоты (бэк)** | JSON-блоки шапки, hero, футера | `UIBlock` + `init_ui` | **2 ✓** |
| **Back — API** | `/api/…`, `?language=`, JWT, Swagger | serializers, views, urls | **3 ✓** |
| **Back — admin** | Unfold, inlines, inbox заявок | `admin.py` | **3 ✓** |
| **Serv** | Docker Compose, Postgres, CI, `.env.example` | корень репо, `.github/` | **4** (migrate — долг Lead на **5**) |
| **Front — shell** | роутер, Header, Footer, Redux, axios | `frontend/src/` | **4 ✓** каркас, **5** вид |
| **Front — страницы** | Home, About, Courses, Events, Contacts | `frontend/src/pages/` | **4 ✓** данные, **5** макет |
| **Translation B (UI)** | подписи кнопок и меню | `frontend/src/i18n/am.json` `en.json` `ru.json` | **4 ✓**, новые строки — **5** |
| **UI / Design / QA** | токены, адаптив, Figma | CSS, Tailwind, чеклисты | **5 (сейчас)** |

Два разных «перевода»:

1. **Контент** — названия категорий, курсов, событий, роли в команде. Живут в Django (`CategoryTranslation`, `EventTranslation`, …). Это **волна 2**.
2. **Интерфейс** — «Home», «Контакты», кнопки форм. Живут в JSON i18n. Ключи волны 4 уже в JSON; новые подписи волны 5 добавляет владелец экрана.

---

## Кто что занимает: волна 5

| # | Имя | Зона | Слой волны 5 | Ключевые файлы |
|---|-----|------|--------------|----------------|
| 1 | Lead | Lead | git, Docker migrate | `docker-compose.yml`, ревью PR |
| 2 | Daniel | User | медиа hero | `frontend/src/components/HeroMedia/`, слот на Home |
| 3 | Sv | Language | default `en`, queryset | `i18n/index.js`, `backend/apps/main/views.py` |
| 4 | Karen | Category | макет категорий | `pages/CourseCategory/`, `CommentList` |
| 5 | Vach | Courses | макет курса | `pages/CourseDetails/`, `apps/courses/views.py` |
| 6 | Ashot | Events | вкладки, деталь, макет | `pages/Events/`, карточка события |
| 7 | Hayk | Content | секции Home | `pages/Home/` — reviews, lesson info |
| 8 | Suren | Team | макет About | `pages/About/`, `apps/team/views.py` |
| 9 | Mariam | Leads + Comments | макет форм | `Contacts`, `CommentForm`, `CommentList` |
| 10 | UI / QA | Shell + QA | токены, Header, Footer, 404 | `Header`, `Footer`, `NotFound`, `init_ui` |

Страницы ждут токены и оболочку UI/QA. Karen и Vach вставляют `CommentList` Mariam, свои `CategoryComments` / `CourseComments` удаляют. Hayk не затирает hero (текст — UI/QA, медиа — Daniel).

---

## Порядок мержа волны 5 (строго)

```
Sv (язык) → UI/QA (токены, Header, Footer, 404) → Daniel (hero media) → Mariam (формы) → Karen → Vach → Ashot → Hayk → Suren
```

Почему так: без правила языка списки пустеют. Оболочка и CSS-переменные нужны раньше страниц. Медиа hero встаёт в уже сверстанный блок. Форма комментария — до категорий и курса. События не блокируют Home, но Ashot трогает свой маршрут целиком. Suren последний, чтобы About не столкнулся с Home.

Lead держит таблицу «кто мержит и когда». Никто не пушит в `main`.

---

## Общие шаги (волна 5)

Делай **до** вёрстки своей зоны.

1. Прочитай [TASK.md](TASK.md), свой блок ниже и свои строки в [fix.md](fix.md).
2. Открой [Figma](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0). Найди кадр своего маршрута на холсте `0-1`. Снимай отступы, шрифт, цвета, состояния hover / loading / empty / error. Если кадра нет — остановись и напиши Lead. Не выдумывай второй макет и не переноси JSX из backup.
3. Обнови `dev` и создай ветку:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/<имя>-<зона>
```

4. Данные только с текущего API. Модели, имена `PopularCourse` / `ContactMessage` и поле `Event.date` не меняй.
5. Новый компонент = **три файла**. Подписи — ключи `am.json` / `en.json` / `ru.json`. Медиа — `frontend/public/` и backup, не Unsplash.
6. Цвета и шрифт бери из переменных, которые выложит UI/QA (после его мержа). До мержа не хардкодь свою палитру в десяти местах.
7. Проверь ширину кадра desktop и 375px, если оба есть в файле.
8. Один PR = одна зона, **base = `dev`**. В описании PR: ссылка на кадр Figma и какие пункты из fix.md закрыты.
9. **Не мержить** `origin/feat/ui`, `origin/feature/events`.

---

## Волна 5 — активные задания

Спека поведения страниц уже в коде волны 4 и в [docs/frontend.md](docs/frontend.md). Вид — только Figma по ссылке выше.

### 1 — Lead

**Слой:** git + Docker. Чужие экраны не рисуешь.

#### Шаги

1. Таблица в чате: имя, ветка, PR, кадр Figma, когда мержить (порядок выше).
2. Ревью: один PR = одна зона; нет копипасты backup; нет своих цветов мимо токенов UI/QA; дыры из fix.md этой зоны закрыты в том же PR.
3. В [docker-compose.yml](docker-compose.yml) у `backend` команда должна мигрировать и потом слушать порт (волна 4 это не сделала):

```yaml
command: sh -c "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"
```

4. Не меняй `main`. `feat/ui` и `feature/events` не вливай.

#### DoD

- Контейнер backend применяет миграции сам.
- PR волны 5 влиты в `dev` в указанном порядке.
- В каждом PR есть ссылка на кадр.

---

### 2 — Daniel (медиа hero)

**Слой:** картинка или видео первого экрана. Логина для гостей нет. Слайс токена не ломай.

**Файлы:** новая папка `frontend/src/components/HeroMedia/` (три файла). Вставка на Home — только медиа-слот, секции Hayk не переписывай.

#### Шаги

1. Дождись мержа UI/QA, чтобы hero-текст из `UIBlock` уже стоял в макете.
2. По кадру Figma первого экрана: видео или постер из `frontend/public/` (`/videos/main.webm`, `/videos/main2.mp4`, `/images/mainLoad.webp` — что показывает кадр).
3. Если в кадре нет медиа — не добавляй чужой ролик. Напиши это в PR.
4. `setToken` / `clearToken` и ключ `geko_access_token` не меняй.

#### DoD

- На `/` медиа hero совпадает с кадром и грузится из `public`.
- Отзывы, занятия и текст hero на месте.

---

### 3 — Sv (язык)

**Слой:** старт на `en` и списки, которые не исчезают.

**Файлы:** [`frontend/src/i18n/index.js`](frontend/src/i18n/index.js), [`backend/apps/main/views.py`](backend/apps/main/views.py). Курсы и команду не правь — это Vach и Suren по тому же правилу.

#### Шаги

1. Первый заход без сохранённого выбора: и UI, и следующий GET сходятся на `en`. `fallbackLng` оставь `en`. Детектор браузера не должен подставлять `ru` или `am`, пока пользователь не нажал флаг. Явный выбор по-прежнему пишется и восстанавливается.
2. Активный флаг сравнивай с кодом `am` / `en` / `ru`, не с `ru-RU`.
3. В `CategoryViewSet`, `EventViewSet`, `LessonInfoViewSet` убери фильтр queryset по `translations__language__code`. Объект остаётся в списке. Текст по языку по-прежнему режет serializer (если перевода нет — уже есть fallback на любой).
4. В PR одной фразой запиши правило для Vach и Suren: то же самое в `courses/views.py` и `team/views.py`.

#### DoD

- Чистый браузер на русском всё равно открывает `en`, пока флаг не нажат.
- Категория и событие без перевода на `en` не пропадают из API.
- Клик по флагу меняет `?language=`.

---

### 4 — Karen (категории)

**Слой:** вид `/course-category` и `/course-category/:id`.

#### Шаги

1. Дождись UI/QA и Mariam.
2. Сверстай оба маршрута по своим кадрам: сетка карточек, обложка, название, список курсов выбранной категории, ссылка на `/courses/:id`.
3. Удали `CategoryComments`. Список — `CommentList` с `category`. Форма — `CommentForm`. После успешной отправки увеличь `refreshKey` (одобренные комментарии подтянутся; новый гостевой останется скрытым, пока admin не поставит `is_approved`).
4. Loading / error / empty — из i18n, как состояния на кадре.

#### DoD

- Оба маршрута визуально совпадают с кадром на desktop и на 375px.
- На странице нет второго списка комментариев.

---

### 5 — Vach (курс)

**Слой:** вид `/courses/:id`.

**Файлы:** [`frontend/src/pages/CourseDetails/`](frontend/src/pages/CourseDetails/), [`backend/apps/courses/views.py`](backend/apps/courses/views.py).

#### Шаги

1. Дождись Mariam.
2. Сверстай кадр курса: название, картинка (`VITE_BASE_URL`, если URL не `https://`), описание, комментарии.
3. Удали `CourseComments`. Подключи `CommentList` (`popularCourse`) и `CommentForm` с `refreshKey`.
4. В `popular_course_queryset` убери фильтр, который оставляет только курсы с переводом на `?language=`. Имя класса **PopularCourse** не меняй. Admin не ломай.

#### DoD

- `/courses/:id` открывается и для курса без перевода на текущий язык (текст — fallback serializer).
- Экран совпадает с кадром. В Unfold курс по-прежнему в списке.

---

### 6 — Ashot (события)

**Слой:** поведение, которое волна 4 не закрыла, плюс кадры списка и детали.

**Маршруты:** `/events` → редирект на `/events/completed`; `/events/:tab`; `/events/:tab/:id`.

#### Шаги

1. Дождись оболочки.
2. Вкладки ровно `upcoming`, `happening`, `completed`. Список: `GET /api/events/?status=<tab>`. Запрос повторяй при смене `i18n.language`.
3. Пустая вкладка не ссылка (сначала узнай, есть ли события в статусе).
4. Деталь `/events/:tab/:id`: заголовок перевода, поле **`date`**, gallery. Не переименовывай `date`.
5. Карточка — три файла. Запасной заголовок — ключ i18n, не `` `Event ${id}` ``.
6. Сверстай список и деталь по кадрам Figma.

#### DoD

- `/events` уходит на `/events/completed`.
- Пустая вкладка не кликается. Деталь открывается по id и показывает дату и галерею.
- Вид совпадает с кадром.

---

### 7 — Hayk (Home: отзывы и занятия)

**Слой:** только эти две секции на кадре главной. Источник — **`main`**.

#### Шаги

1. Дождись оболочки и не удаляй hero (текст UI/QA, медиа Daniel).
2. Секция отзывов по кадру: `full_name`, `rating`, `text`. Картинок у Review нет — в модель не добавляй.
3. Секция занятий: заголовок и текст перевода, порядок как отдаёт API.
4. `?language=` у reviews не фильтруй. Loading / error / empty оставь.

#### DoD

- Обе секции на `/` выглядят как на кадре Home.
- Hero и чужие секции на месте.

---

### 8 — Suren (About)

**Слой:** кадр `/about-us`.

**Файлы:** [`frontend/src/pages/About/`](frontend/src/pages/About/), [`backend/apps/team/views.py`](backend/apps/team/views.py).

#### Шаги

1. Мерж после Home.
2. Сверстай сетку карточек по кадру: фото, `name`, `role`, `desc`. Пустой список — empty из i18n.
3. В `TeamViewSet.get_queryset` убери фильтр по наличию перевода (правило Sv). Модель и `db_table` не меняй. Unfold не ломай.

#### DoD

- `/about-us` совпадает с кадром или показывает empty.
- Участник без перевода на `en` всё равно приходит в API.
- Team открывается в `/api/admin/`.

---

### 9 — Mariam (контакт и комментарии)

**Слой:** вид форм. Поля и API волны 4 не выкидывай. Reply в UI не делай.

#### Шаги

1. Дождись оболочки.
2. Форма `/contacts` по кадру: `full_name`, `email`, `whatsapp`, `country`, `category`, `message`, `useForm`.
3. `CommentForm` и `CommentList` по кадру комментариев. Это единственный список: Karen и Vach подключают его и удаляют свои копии.
4. Текст успеха: комментарий отправлен и ждёт одобрения. Не обещай, что он сразу виден в списке (`is_approved` для гостя остаётся `False`).
5. Ключи подписей — в `am` / `en` / `ru`.

#### DoD

- Контакт уходит с `country`, `whatsapp`, `category`.
- Гостевой комментарий создаётся. Чужая страница может вставить `CommentList` и `CommentForm` без своей копии разметки.
- Успех не пишет, что комментарий уже опубликован.

---

### 10 — UI / QA (оболочка и токены)

**Слой:** Header, Footer, 404, текст hero, переменные макета. Мержится **до** страниц.

#### Шаги

1. Дождись Sv.
2. Вынеси в `frontend/src/index.css` переменные с кадра (цвета, шрифт, ширина контейнера, отступы секции). Страницы волны 5 берут их, а не случайные hex.
3. Header по кадру: логотип, меню, флаги, телефон и email из `GET /api/ui-blocks/` (`header`, `contacts_bar`). Номера в JSX не хардкодь.
4. Footer по кадру: навигация, контакты, карта, соцсети. Подписи — i18n. Ссылки соцсетей — из payload футера, не из чужого домена «на глаз».
5. NotFound по кадру 404.
6. Текст hero — блок `hero` из `ui-blocks`. Медиа-слот не занимай: его ставит Daniel. Секции Hayk не удаляй.
7. В [`init_ui`](backend/apps/main/management/commands/init_ui.py) заполни payload `header`, `hero`, `footer`, `contacts_bar` так, чтобы пустой `{}` не оставлял оболочку без телефона и заголовка. Повторный запуск обновляет пустой payload и не затирает то, что уже вписали в админке. Тексты hero — объекты с ключами `am` / `en` / `ru`, как уже читает `blockText` на Home.
8. В PR чеклист: 375px и desktop; пустой API; ошибка сети.

#### DoD

- Header, Footer и 404 совпадают с кадрами на маршрутах из `App.jsx`.
- После `init_ui` в шапке есть телефон и email из API, не из константы в React.
- Цвета макета лежат в CSS-переменных.

---

## Запрещено в волне 5

- пушить в `main`
- удалять Django-модели и переименовывать `PopularCourse`, `ContactMessage`, `Event.date`
- мержить `origin/feat/ui` и `origin/feature/events`
- копировать backup папками или переносить его CSS как «макет»
- рисовать экран, если кадра в Figma нет, не спросив Lead
- картинки не из `frontend/public` / backup
- публичная регистрация staff
- показывать гостевой комментарий до `is_approved`
- добавлять image-поля в `Review`

---

## Архив — кто что занимал: волна 4

| # | Имя | Зона | Слой волны 4 | Ключевые файлы |
|---|-----|------|--------------|----------------|
| 1 | Lead | Lead | git, Docker migrate | `docker-compose.yml`, ревью PR |
| 2 | Daniel | User | Redux token | `frontend/src/store/`, `main.jsx` |
| 3 | Sv | Language | UI язык = API | `frontend/src/i18n/index.js`, `Header` |
| 4 | Karen | Category | страницы категорий | `pages/CourseCategory/`, карточки |
| 5 | Vach | Courses | страница курса | `pages/CourseDetails/`, `apps/courses/admin.py` |
| 6 | Ashot | Events | вкладки и деталь | `pages/Events/` |
| 7 | Hayk | Content | секции Home | `pages/Home/` — reviews, lesson info |
| 8 | Suren | Team | About + admin Team | `pages/About/`, `apps/team/admin.py` |
| 9 | Mariam | Leads + Comments | контакт + комментарии UI | `ContactMessage`, `CommentForm` |
| 10 | UI / QA | Shell + QA | Header, Footer, 404, hero | `components/Header`, `Footer`, `NotFound` |

Так зона стояла на волне 4: Karen и Vach ждали `CommentForm` от Mariam, оболочка мержилась раньше страниц. Волна закрыта 2026-10-10 — актуальные дыры в [fix.md](fix.md), не здесь.

---

## Порядок мержа волны 4 (строго)

```
Daniel (store) → Sv (language) → UI/QA (Header, Footer, 404) → Mariam (contact + comments UI) → Karen → Vach → Ashot → Hayk → Suren
```

Почему так: страницы сидят в оболочке; категории и курсы ждут общий `CommentForm` от Mariam. Hayk и Suren не блокируют друг друга, но Suren последний, чтобы About не конфликтовал с Home.

Lead держит таблицу «кто мержит и когда». Никто не пушит в `main`.

---

## Общие шаги (волна 4)

Делай **до** кода своей зоны.

1. Прочитай [TASK.md](TASK.md) и свой блок в «Волна 4 — активные задания».
2. Прочитай [CONTRIBUTING.md](CONTRIBUTING.md) и [docs/frontend.md](docs/frontend.md).
3. Обнови `dev` и создай ветку:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/<имя>-<зона>
```

Примеры зон: `user`, `language`, `category`, `courses`, `events`, `content`, `team`, `leads`, `shell`.

4. Смотри backup в `backup/geko-front-main` — повтори поведение, не копируй папки целиком.
5. Новый компонент = **три файла**: `Component.jsx`, `component.css`, `component.js`. Не складывай три блока в один `.jsx`.
6. Медиа только из `frontend/public/` и backup. Не Unsplash и не свои фото.
7. Формы — только `useForm`. Подписи кнопок — ключи в `am.json` / `en.json` / `ru.json`. Тексты курсов и событий — с API `?language=`.
8. Один PR = одна зона. PR: **base = `dev`**, не `main`.
9. **Не мержить** `origin/feat/ui`, `origin/feature/events`.

---

## Архив — волна 4 (страницы, закрыта 2026-10-10)

Справочник. **Не начинай отсюда** — активная работа в разделе «Волна 5» выше. Ошибки проверки — [fix.md](fix.md).

Спека страниц: [docs/frontend.md](docs/frontend.md). API уже в `dev`: [docs/backend.md](docs/backend.md).

### 1 — Lead

**Слой:** git + Docker. Чужие страницы не пишешь.

#### Шаги

1. Таблица в чате: имя, ветка `feat/…`, ссылка на PR, когда мержить (порядок выше).
2. Ревью: один PR = одна зона; нет force-push в `dev` / `main`; нет копипасты backup целиком.
3. В [docker-compose.yml](docker-compose.yml) у сервиса `backend` команда должна применить миграции и потом поднять сервер, например:

```yaml
command: sh -c "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"
```

4. Не меняй `main`. Устаревшие `feat/ui` и `feature/events` не вливай.

#### DoD

- Контейнер backend поднимает схему без ручного `migrate`.
- Все PR волны 4 влиты в `dev` в указанном порядке.

---

### 2 — Daniel (Redux token)

**Слой:** Front shell. Публичной регистрации нет.

**Файлы:** новая папка `frontend/src/store/`, [`frontend/src/main.jsx`](frontend/src/main.jsx).

#### Шаги

1. Ветка: `feat/<имя>-user`.
2. Redux Toolkit: store и слайс access-token.
3. Ключ в `localStorage`: `geko_access_token` (тот же, что уже читает [`frontend/src/api/client.js`](frontend/src/api/client.js)).
4. Действия: записать токен, очистить токен. При старте приложения прочитай ключ из `localStorage` в store.
5. Оберни приложение в `Provider` в `main.jsx`.
6. Не делай страницу логина для гостей и не меняй `User` / JWT endpoints.

#### DoD

- `npm run build` проходит.
- Токен, положенный в store, оказывается в `localStorage` под `geko_access_token` и наоборот.

---

### 3 — Sv (язык UI = API)

**Слой:** i18n + query `language`.

**Файлы:** [`frontend/src/i18n/index.js`](frontend/src/i18n/index.js), переключатель в Header.

#### Шаги

1. Дождись мержа store Daniel (не обязательно для языка, но ветка от актуального `dev`).
2. Сейчас UI fallback — `am`, API default — `en` в [`backend/apps/model_helpers.py`](backend/apps/model_helpers.py) (`DEFAULT_API_LANGUAGE`). Зафиксируй **оба на `en`**: `fallbackLng: 'en'` в `i18n/index.js`. Константу на бэке не переименовывай и не ставь `am`.
3. Кнопки языка в Header уже вызывают `i18n.changeLanguage`. Проверь, что после клика следующий GET уходит с `?language=` равным `am`, `en` или `ru` (interceptor в `client.js`).
4. Если список на странице не обновляется сам — не переписывай чужие страницы; в PR опиши, что владельцы страниц должны зависеть от `i18n.language` в `useEffect`.

#### DoD

- Переключение am / en / ru меняет query `language`.
- Без выбранного языка и API, и i18n сходятся на `en`.

---

### 4 — Karen (категории)

**Слой:** Front — `/course-category` и `/course-category/:id`.

**Смотри:** `backup/geko-front-main/src/components/pages/courses/Courses.jsx`, `CoursesMenu.jsx`.

#### Шаги

1. Дождись мержа оболочки (UI/QA) и `CommentForm` (Mariam).
2. `GET /api/categories/` — список. Карточка категории — отдельная папка из трёх файлов.
3. `GET /api/courses/<category_id>/` — курсы выбранной категории. Ссылка на `/courses/:id`.
4. Под списком курсов вставь комментарии Mariam с фильтром `?category=<id>`.
5. Состояния: загрузка, ошибка сети, пустой список — тексты из i18n, не захардкоженные строки на одном языке.

#### DoD

- Оба маршрута открываются и ходят в API.
- Пустой ответ и ошибка видны пользователю.

---

### 5 — Vach (курс)

**Слой:** Front — `/courses/:id` + короткая регистрация в админке.

**Файлы:** [`frontend/src/pages/CourseDetails/`](frontend/src/pages/CourseDetails/), `backend/apps/courses/admin.py`.

#### Шаги

1. Дождись Mariam (`CommentForm`).
2. Страница одного `PopularCourse`: данные из `GET /api/popular_courses/` (найди по `id`) или detail, если роутер его уже отдаёт. Имя класса остаётся **PopularCourse**.
3. Картинка: если URL не начинается с `https://`, добавь `VITE_BASE_URL` (см. docs/frontend.md).
4. Комментарии с `?popular_course=<id>`.
5. Unfold: список `PopularCourse` в `apps/courses/admin.py` (list_display, без переписывания модели).

#### DoD

- `/courses/:id` показывает название и не остаётся заглушкой.
- Курс виден в Django admin.

---

### 6 — Ashot (события)

**Слой:** Front — вкладки и деталь. Модель не переименовывай.

**Маршруты:** `/events` → редирект на `/events/completed`; `/events/:tab`; `/events/:tab/:id`.

#### Шаги

1. Дождись оболочки UI/QA.
2. Вкладки ровно три: `upcoming`, `happening`, `completed`. Список: `GET /api/events/?status=<tab>`.
3. Пустая вкладка не кликабельна (как в backup `Events.jsx`).
4. Карточка и страница `/events/:tab/:id`: заголовок из translation, gallery из API. Поле даты на API — **`date`**. Не переименовывай его в `start_date` / `end_date` без Lead.
5. Компонент карточки — три файла.

#### DoD

- Три статуса приходят с API и переключаются вкладками.
- Деталь события открывается по id.

---

### 7 — Hayk (Home: отзывы и занятия)

**Слой:** секции главной. Источник — **`main`**, не `apps.content`.

**Файлы:** [`frontend/src/pages/Home/`](frontend/src/pages/Home/).

#### Шаги

1. Дождись оболочки.
2. Секция отзывов: `GET /api/reviews/`. Поля, которые есть: `full_name`, `rating`, `text`. Картинок у Review нет — не добавляй image-поля в модель.
3. Секция занятий: `GET /api/lesson_info/?language=`. Заголовок из translation. Порядок уже по `order` на API.
4. Параметр `language` у reviews ни на что не влияет (нет translation-модели) — не строй фильтр языка для отзывов.
5. Состояния loading / error / empty.

#### DoD

- На `/` видны обе секции, без текста TODO.

---

### 8 — Suren (About + admin Team)

**Слой:** `/about-us` и Unfold для команды.

**Файлы:** [`frontend/src/pages/About/`](frontend/src/pages/About/), `backend/apps/team/admin.py`.

**Смотри:** backup `AboutUs.jsx`, `Tutors.jsx`.

#### Шаги

1. Мерж после Home, чтобы не столкнуться в общем layout, если трогаешь только About.
2. `GET /api/teams/?language=`. На карточке: `name`, `role`, `desc` из `TeamTranslation`.
3. Карточка — три файла. Пустой список — empty state из i18n.
4. Зарегистрируй `Team` в Unfold (`apps/team/admin.py`): list по `order`, inline переводов если уместно. Модель и `db_table` не меняй.

#### DoD

- `/about-us` показывает команду или пустое состояние.
- Team открывается в `/api/admin/`.

---

### 9 — Mariam (контакт и комментарии)

**Слой:** бэкенд полей контакта + общие компоненты комментариев. Reply в UI не делай.

#### Шаги

1. Дождись оболочки (форма контакта живёт на `/contacts` внутри layout).
2. Миграция `ContactMessage`: добавь `country` (CharField, blank), `whatsapp` (CharField, blank), FK `category` → `Category`, `null=True`, `blank=True`, `SET_NULL`. Поле `phone` не удаляй.
3. Обнови serializer и [`backend/apps/leads/tests.py`](backend/apps/leads/tests.py). `POST /api/contact/` принимает новые поля.
4. Форма [`frontend/src/pages/Contacts/Contacts.jsx`](frontend/src/pages/Contacts/Contacts.jsx) — `useForm`: `full_name`, `email`, `whatsapp`, `country`, `category`, `message` (как docs/frontend.md). Категории для select — `GET /api/categories/`.
5. Общие компоненты (каждый — три файла), например `frontend/src/components/CommentList/` и `CommentForm/`:
   - список: `GET /api/comments/?category=` или `?popular_course=`;
   - форма гостя: `full_name`, `email`, `whatsapp`, `text` → `POST /api/comments/` **без** JWT;
   - xor: либо category, либо popular_course — как в модели.
6. `POST /api/comments/<id>/reply/` в интерфейс не выноси. Это остаётся API + JWT.

#### DoD

- Форма контакта шлёт `country`, `whatsapp`, `category`.
- Гостевой комментарий создаётся; чужой `CommentForm` можно вставить на страницу категории и курса.

---

### 10 — UI / QA (оболочка)

**Слой:** Header, Footer, 404, hero. Мержится **до** страниц зон 4–8.

**Файлы:** [`frontend/src/components/Header/`](frontend/src/components/Header/), новый `frontend/src/components/Footer/`, [`frontend/src/pages/NotFound/NotFound.jsx`](frontend/src/pages/NotFound/NotFound.jsx), hero на Home.

#### Шаги

1. Дождись Sv, чтобы язык в шапке уже совпадал с API.
2. Header: телефон и email из `GET /api/ui-blocks/` (ключи `header` и `contacts_bar`), не хардкод номеров. Меню и флаги уже есть — не ломай маршруты.
3. Footer — новая папка из трёх файлов: навигация, контакты. Тексты кнопок — i18n JSON (`am`, `en`, `ru`).
4. Подключи Footer в [`frontend/src/App.jsx`](frontend/src/App.jsx) так, чтобы он был на всех маршрутах рядом с Header.
5. NotFound: убери TODO, страница 404 на неизвестный путь.
6. Hero на Home: блок `hero` из `ui-blocks` (ключ из `init_ui`). Не затирай секции Hayk, если его PR уже влит; если нет — оставь reviews/lesson как есть и добавь только hero.
7. Чеклист в описании PR: ширина 375px и desktop; пустой ответ API; ошибка сети.

#### DoD

- Header, Footer и 404 есть на маршрутах из `App.jsx`.
- Hero читает `UIBlock`, а не захардкоженный текст.

---

## Запрещено в волне 4

- пушить в `main`
- удалять Django-модели
- мержить `origin/feat/ui` и `origin/feature/events`
- копировать backup папками
- картинки не из `frontend/public` / backup (Unsplash, случайные URL)
- публичная регистрация staff
- переименовывать `PopularCourse`, `ContactMessage`, поле `Event.date`

---

## Архив — волна 3 (API, admin, фронт, закрыта 2026-10-04)

Справочник. **Не начинай отсюда** — активная работа в разделе «Волна 4» выше.

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

Справочник по выполненным заданиям моделей. **Не начинай отсюда** — активная работа в разделе «Волна 4» выше.

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

Short assignment: [TASK.md](TASK.md). **Read wave 5 first.** Waves 4, 3, and 2 are archives below.

**Wave 5 (now):** UI from [Figma Untitled](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0). Merge: Sv → UI/QA → Daniel (hero media) → Mariam → Karen → Vach → Ashot → Hayk → Suren. Close your wave 4 gaps in [fix.md](fix.md) in the same PR. PR **only to `dev`**.

Zones: Lead — Figma review + Docker `migrate`; Daniel — hero media from `public`; Sv — default `en`, querysets must not drop rows that lack a translation; Karen — category frames + shared `CommentList`; Vach — course frame + the same queryset fix; Ashot — event redirect, disabled empty tab, detail (`date`, gallery); Hayk — Home reviews and lessons; Suren — About frame; Mariam — contact and comments, success copy says “waiting for approval”; UI/QA — tokens, Header, Footer, 404, `init_ui` payloads.

### Archive — wave 4

Pages and shell. Closed 2026-10-10. Daniel, Hayk, Suren, Mariam met the functional DoD. Lead missed compose `migrate`. Sv left the browser detector. Ashot did not ship event detail. Karen and Vach duplicated comment lists.

### Archive — wave 3

API, admin, JWT. Merge was Daniel → Sv → Karen → Vach → Ashot → Hayk → Suren → Mariam → UI/QA. Closed 2026-10-04.

### Archive — wave 2 (models)

Merge order: **User → Language → Category → Courses → Events → Content → Team → Leads/Comments → UIBlock**.

---

## Հայերեն

Կարճ առաջադրանք՝ [TASK.md](TASK.md)։ **Նախ կարդա ալիք 5**։ Ալիք 4, 3 և 2 — արխիվ ստորև։

**Ալիք 5 (հիմա)** — UI ըստ [Figma](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0)։ Merge՝ Sv → UI/QA → Daniel → Mariam → Karen → Vach → Ashot → Hayk → Suren։ Ալիք 4-ի սխալները՝ [fix.md](fix.md)։ PR միայն `dev`։

Գոտիներ՝ Lead (Docker migrate + Figma review), Daniel (hero մեդիա), Sv (լեզու `en`, queryset-ը չի թաքցնում տողը), Karen / Vach (էջ + `CommentList`), Ashot (իրադարձության մանրամասն), Hayk (Home), Suren (About), Mariam (ձևեր), UI/QA (Header, Footer, 404, token-ներ)։

### Արխիվ — ալիք 4

Էջեր և ընդհանուր շրջանակ (Header/Footer)։ Փակված է 2026-10-10։ Սխալները՝ [fix.md](fix.md)։

### Արխիվ — ալիք 3

API, admin, JWT։ Փակված է 2026-10-04։

### Արխիվ — ալիք 2

Միաձուլման կարգ՝ **User → Language → Category → Courses → Events → Content → Team → Leads/Comments → UIBlock**։

