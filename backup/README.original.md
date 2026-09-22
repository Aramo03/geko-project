# Geko — recreate from scratch

Education site (courses, events, team, contacts).

**Keep the skeleton. Change the visuals.**

Same pages, routes, API, admin, and languages (`am` / `en` / `ru`). Colors, fonts, layout, and motion may change.

| App | Folder | URL |
|-----|--------|-----|
| Frontend | `geko-front-main/` | http://localhost:3000 |
| Backend + admin | `prod-geko-back-main/` | http://127.0.0.1:8000/api/ · http://127.0.0.1:8000/api/admin/ |

- Frontend details: [`geko-front-main/README.md`](geko-front-main/README.md)
- Backend details: [`prod-geko-back-main/README.md`](prod-geko-back-main/README.md)

---

## Русский

### Что нельзя ломать (скелет)

1. **Оболочка:** шапка (телефон, email, языки, меню) → страница → подвал (контакты, навигация, карта, соцсети).
2. **Страницы:** Главная, О нас, Курсы, Курс, События, Событие, Контакты, 404.
3. **Маршруты:** `/` `/about-us` `/course-category` `/course-category/:id` `/courses/:id` `/events` `/events/:tab` `/events/:tab/:id` `/contacts`
4. **Языки:** армянский (по умолчанию), английский, русский. UI — JSON. Контент — API `?language=am|en|ru`.
5. **Админка:** контент редактируется в Django Admin, не хардкодится во фронте.
6. **Форма:** имя, email, WhatsApp, страна, категория, сообщение → `POST /api/contact/`.

Визуал (бренд, сетка, анимации) команда дизайна может менять.

### Команда из 10 человек

| # | Роль | Зона | Definition of done |
|---|------|------|-------------------|
| 1 | Lead | Репозиторий, ветки, контракт API, ревью | Все ходят по одному скелету |
| 2 | Backend models | Модели, миграции, медиа | Админ создаёт весь контент |
| 3 | Backend API | ViewSet, сериализаторы, `?language=` | Фронт получает тот же JSON |
| 4 | Admin / CMS | `/api/admin/`, сортировка, картинки, инбокc заявок | Редактор наполняет сайт без кода |
| 5 | Frontend shell | Vite, роутер, Header, Footer, i18n, Redux | Каркас открывается на 3 языках |
| 6 | Home + About | Секции главной и «О нас» | Порядок секций как в скелете |
| 7 | Courses | Список, фильтр, пагинация, детальная | Работает с API категорий и курсов |
| 8 | Events | Вкладки upcoming / happening / completed + детальная | Статус с бэка, не с фронта |
| 9 | Contacts + form | 3 карточки + форма + SMTP | Заявка в админке и на почте |
| 10 | Design + QA | Токены, адаптив, контент am/en/ru | Скелет цел, визуал новый, пустые/ошибки проверены |

Параллель: 2–4 делают бэк, 5 поднимает оболочку, 6–9 ждут стабильный `/api/` и моки, 10 идёт с первого дня (макеты + ключи перевода).

### Как собрать проект с нуля

```text
geko/
  frontend/     # React 19 (latest) + Vite 6 (latest) + Redux Toolkit + Tailwind CSS 3.x + i18next
  backend/      # Django 5.2 + DRF + Pillow + django-cors-headers
  README.md
```

1. Lead создаёт репозиторий и две папки.
2. Backend: модели → миграции → API → админка → `.env.example`.
3. Frontend: роуты → layout → i18n → Redux thunks → страницы.
4. Seed: языки `am`, `en`, `ru` + по 1 записи на модель.
5. Design меняет CSS/токены, не маршруты и не поля API.

Локальный запуск (после установки, см. README фронта и бэка):

```bash
# backend
cd prod-geko-back-main
python -m venv venv
venv\Scripts\activate
pip install -r req.txt
copy .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 127.0.0.1:8000

# frontend (другое окно)
cd geko-front-main
copy .env.example .env
npm install
npm run dev
```

---

## English

### Frozen skeleton (do not change)

| Layer | Must stay |
|-------|-----------|
| Shell | Header (phone, email, language, nav) → page → Footer (contacts, nav, map, socials) |
| Pages | Home, About, Courses list, Course detail, Events list, Event detail, Contacts, 404 |
| Routes | `/` `/about-us` `/course-category` `/course-category/:id` `/courses/:id` `/events` `/events/:tab` `/events/:tab/:id` `/contacts` |
| Languages | `am` (default), `en`, `ru`. UI JSON + API `?language=` |
| CMS | All content lives in Django Admin |
| Form | `full_name`, `email`, `whatsapp`, `country`, `category`, `message` → `POST /api/contact/` |

Visuals (color, type, spacing, components look) may change.

### Team of 10

1. **Lead** — repo, API contract, reviews  
2. **Backend models** — schema, migrations, media folders  
3. **Backend API** — viewsets, serializers, language filter  
4. **Admin** — sortable inlines, uploads, contact inbox  
5. **Frontend shell** — Vite, router, Header/Footer, i18n, Redux  
6. **Home + About** — keep section order  
7. **Courses** — filter, grid/list, pagination, detail  
8. **Events** — tabs by `upcoming` / `happening` / `completed`  
9. **Contacts + form** — cards + POST + email  
10. **Design + QA** — tokens, responsive, am/en/ru copy, empty/error states  

### Recreate from zero

Same stack as this repo. Do not invent extra pages or extra resources until the skeleton works.

**Home sections (order):** hero video → trial form → category swiper → popular courses → lesson stats → 3 completed events → reviews.

**About sections (order):** title + image → text → category swiper → 3 feature cards → quote → team slider.

**Events tabs:** `happening` | `upcoming` | `completed`. `/events` redirects to `/events/completed`.

**API the frontend actually calls:**

| Method | Path |
|--------|------|
| GET | `/api/categories/?language=` |
| GET | `/api/popular_courses/?language=` |
| GET | `/api/events/?language=` |
| GET | `/api/events/{id}/?language=` |
| GET | `/api/reviews/?language=` |
| GET | `/api/lesson_info/?language=` |
| GET | `/api/teams/?language=` |
| POST | `/api/contact/` |

Images: if the path is not `https://…`, prepend `VITE_BASE_URL`.

---

## Հայերեն

### Ինչը չի փոխվում

- Կառուցվածքը՝ Header → էջ → Footer  
- Էջեր՝ գլխավոր, մեր մասին, դասընթացներ, դասընթաց, իրադարձություններ, կոնտակտներ, 404  
- Լեզուներ՝ `am` / `en` / `ru`  
- Կոնտենտը՝ Django Admin  
- Ձևը՝ `POST /api/contact/`  

Տեսքը (գույն, տառ, հեռավորություն) կարելի է փոխել։

### 10 հոգի

Lead, 3 backend (models / API / admin), frontend shell, Home+About, Courses, Events, Contacts, Design+QA։

Առաջինը բարձրացրեք API-ն և Header/Footer-ը, հետո էջերը, վերջում նոր դիզայնը։

---

## Git for 10 people

```text
main          # protected
develop       # integration
feat/be-*     # backend
feat/fe-*     # frontend
feat/ui-*     # visual-only (no route/API changes)
```

1. One PR = one role zone.  
2. Do not mix API field renames with CSS in the same PR.  
3. New page or new model needs Lead approval (skeleton change).  
4. Never commit `.env`, `venv/`, `node_modules/`, `media/`, `db.sqlite3`.

---

## Definition of done (whole site)

- [ ] `am` / `en` / `ru` switch reloads UI and API text  
- [ ] Admin can create category, course, event + gallery, team, review, lesson info  
- [ ] Home shows all 7 sections from API (empty state if no data)  
- [ ] Courses filter by category, paginate, open detail  
- [ ] Events filter by three statuses, open detail + gallery  
- [ ] Contact form creates `ContactMessage` and does not crash without SMTP  
- [ ] Visual redesign did not rename routes or API resources
