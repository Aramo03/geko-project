# Статус проекта GEKO

**Обновлено:** 2026-10-10 · **Ветка:** `dev`  
**Волна 4:** закрыта (страницы и оболочка, проверка ниже). **Волна 5:** UI по [Figma](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0).  
**Волна 3** закрыта 2026-10-04. **Волна 2** закрыта 2026-09-29.

Задания: [TASK.md](TASK.md) · шаги: [task-advanced.md](task-advanced.md) · API: [docs/backend.md](docs/backend.md)

Проверка волны 4 — по текущему дереву и DoD из task-advanced. Макет Figma на ревью не открывался: файл просит вход. Визуал в эту волну не входил в DoD пиксель-в-пиксель; его забирает волна 5.

---

## Волна 4 — закрыта (2026-10-10)

Функциональный каркас страниц в коде есть: маршруты, Redux-токен, `fallbackLng: 'en'`, контакт с `country` / `whatsapp` / `category`, гостевой `CommentForm`, Header/Footer/404, hero из `UIBlock`, отзывы и занятия на `/`, команда на `/about-us`. Ниже — ошибки относительно DoD. Их чинят в своей зоне волны 5, вместе с вёрсткой по Figma.

### Сводка по зонам

| # | Зона | DoD волны 4 | Что не так |
|---|------|-------------|------------|
| 1 | Lead | не закрыт | `docker-compose.yml`: backend только `runserver`, без `migrate` |
| 2 | Daniel | закрыт | store, `geko_access_token`, `Provider` |
| 3 | Sv | частично | `fallbackLng: 'en'` есть; детектор браузера всё равно уводит старт с `en` |
| 4 | Karen | в основном | маршруты и карточка есть; список комментариев — свой, не `CommentList` |
| 5 | Vach | в основном | страница курса и admin есть; queryset прячет курс без перевода |
| 6 | Ashot | не закрыт | нет редиректа, детали, галереи, даты, неактивной пустой вкладки, карточки |
| 7 | Hayk | закрыт | обе секции, loading / error / empty, без картинок у Review |
| 8 | Suren | закрыт | `/about-us`, карточка из трёх файлов, Unfold Team |
| 9 | Mariam | закрыт | поля контакта, тесты, `CommentForm` + `CommentList`, reply не в UI |
| 10 | UI / QA | каркас закрыт | Header, Footer, 404, hero с API. Визуал не макет: соцсетей нет, payload `init_ui` пустой |

### Ошибки студентов

**Lead.** В `docker-compose.yml` у `backend` команда `python manage.py runserver 0.0.0.0:8000`. DoD: `migrate`, затем сервер. Контейнер по-прежнему поднимается со старой схемой, пока миграцию не сделают руками.

**Sv.** В `frontend/src/i18n/index.js` подключён `i18next-browser-languagedetector` и нет стартового `lng: 'en'`. `fallbackLng: 'en'` срабатывает только если язык браузера не из `am` / `en` / `ru`. Браузер на `ru` открывает интерфейс и `?language=ru`, хотя без явного выбора оба слоя должны быть `en`.

Отдельный разрыв языка, его же правило: list/detail режет queryset, если нет строки перевода. Интерцептор в `client.js` всегда добавляет `language`. Сериализаторы при пустом фильтре оставляют любой перевод (`or data["translations"]`), а queryset до сериализатора объект выкидывает. Так сделано в `backend/apps/main/views.py` (категории, события, занятия), `backend/apps/courses/views.py`, `backend/apps/team/views.py`. Курс или категория без перевода на текущий код пропадает; detail курса отвечает 404. На волне 5 это чинит Sv в `main`, Vach в `courses`, Suren в `team`: фильтр перевода убрать из queryset, выбор текста оставить в serializer.

**Karen.** `/course-category` и `/course-category/:id` ходят в API, есть loading / error / empty, карточка категории — три файла. Под курсами стоит свой `CategoryComments`, а не общий `CommentList` Mariam. `CommentForm` вставлен, после отправки список сам не перечитывается (`onCreated` / `refreshKey` не связаны). Гостевой комментарий и так не виден, пока `is_approved=False` — это верно; дубль компонента всё равно убрать.

**Vach.** `/courses/:id` берёт `GET /api/popular_courses/<id>/`, картинка без `https://` дополняется `VITE_BASE_URL`, в Unfold есть `PopularCourse` (`list_display`, inline). Ошибка: `popular_course_queryset` отбрасывает курс без перевода на `?language=` — см. Sv. Список комментариев — свой `CourseComments`, не `CommentList`.

**Ashot.** `frontend/src/pages/Events/Events.jsx` не выполняет DoD:

- `/events` не редиректит на `/events/completed`. Без `:tab` на экране `upcoming`, URL остаётся `/events`.
- `/events/:tab/:id` не читает `id`: нет страницы события, нет gallery, поле `date` не показано.
- Все три вкладки всегда ссылки. Пустая вкладка кликабельна.
- Карточки из трёх файлов нет. `events.js` — неиспользуемый `TITLE`.
- Запасной заголовок захардкожен: `` `Event ${event.id}` ``.
- `useEffect` зависит только от вкладки, не от `i18n.language`. Смена языка список не обновляет.

**Mariam — не ошибка DoD, правка текста на волне 5.** `POST /api/comments/` сохраняет гостя с `is_approved=False`, список отдаёт только одобренные. Строка успеха («комментарий добавлен») звучит так, будто он уже на странице. В макете написать, что сообщение отправлено и ждёт одобрения. Reply в UI нет — так и задумано.

**UI / QA.** Телефон и email шапки берутся из `header` / `contacts_bar`, Footer подключён в `App.jsx`, 404 без TODO, hero читает блок `hero`. Дыры к макету: в футере нет соцсетей (в `docs/frontend.md` они есть), `init_ui` создаёт блоки с `payload: {}` и повторный запуск пустой payload не заполняет. Пока в админке пусто, шапка и hero честно показывают empty — для Figma этого мало.

**Daniel, Hayk, Suren.** По DoD волны 4 замечаний нет. Daniel: слайс пишет и читает `geko_access_token`, приложение в `Provider`, страницы логина нет. Hayk: `/api/reviews/` (`full_name`, `rating`, `text`) и `/api/lesson_info/` с `i18n.language`, без image-полей у Review. Suren: карточка `name` / `role` / `desc`, пустой список из i18n, Team в Unfold с `ordering` по `order` и inline переводов.

### Что волна 4 не тащит дальше как «дизайн»

Страницы — колонка с `padding: 2rem`, почти без сетки backup и без Tailwind-раскладки (Tailwind 4 подключён в `index.css`, в разметке он почти не используется). Это не баг данных. Волна 5 собирает вид по Figma, не копируя `backup/geko-front-main` папками.

---

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

## Долг после волны 4 (делает волна 5)

1. **Figma** — вид всех экранов: [Untitled](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0). Backup не копировать.
2. **Docker** — `migrate` перед `runserver` в compose (Lead).
3. **Язык** — старт на `en`; queryset не удаляет объект без перевода (Sv, Vach, Suren).
4. **События** — редирект, пустая вкладка, деталь, `date`, gallery, карточка, смена языка (Ashot).
5. **Комментарии** — на категориях и курсе только `CommentList`; текст успеха про модерацию (Karen, Vach, Mariam).
6. **Оболочка** — токены, соцсети, непустой payload `init_ui` (UI/QA). Медиа hero — Daniel.
7. **Event / Review** — полный паритет полей с backup по-прежнему не цель, модели не раздувать.
8. **`GET /api/reviews/?language=`** — параметру не на что влиять; фильтр языка для отзывов не строить.
9. **Git** — не мержить `origin/feat/ui`, `origin/feature/events`; PR только в `dev`.

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
