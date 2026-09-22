# Geko frontend

React SPA for Geko Education. Recreate this **skeleton**; restyle freely.

**RU:** Фронт сайта. Те же маршруты, секции и API. Визуал можно менять.  
**HY:** Frontend. Նույն ուղիները, սեկցիաները և API-ն։ Տեսքը կարելի է փոխել։

---

## Stack

| Piece | Choice | Why keep it |
|-------|--------|-------------|
| React 19 + Vite 6 | SPA, port **3000** | Matches CORS on backend |
| react-router-dom 7 | Routes in `src/App.jsx` | Skeleton = URL map |
| Redux Toolkit | One slice: `src/redux/dataSlice.js` | All GET APIs in one place |
| i18next | `am` (default), `en`, `ru` | UI strings |
| Tailwind 3 + `App.css` | Tokens in `tailwind.config.js` | Design team owns this |
| axios | Calls `VITE_BASE_URL` | No shared client today |
| Swiper + react-slick | Carousels | Can replace library, keep the blocks |

Node.js 20+ / npm. `bun.lock` is optional.

---

## Run

```bash
cd geko-front-main
cp .env.example .env
# VITE_BASE_URL=http://127.0.0.1:8000
npm install
npm run dev          # http://localhost:3000
```

| Script | Command |
|--------|---------|
| Dev | `npm run dev` |
| Build | `npm run build` |
| Preview | `npm run preview` |
| Lint | `npm run lint` |

Backend must be on port 8000 or pages render empty.

---

## Recreate from zero (order)

1. Vite + React + Tailwind. Set `server.port = 3000`.
2. `.env`: `VITE_BASE_URL`.
3. `src/i18n.jsx` + `src/locale/am.json|en.json|ru.json`. Default language `am`.
4. `src/entities/routesArray.jsx` — five nav items (table below).
5. Layout in `App.jsx`: `PageUpButton` → `Header` → `<Routes>` → `Footer`.
6. `src/utils/utils.js`: `BASE_URL`, `getImageUrl`.
7. `src/redux/dataSlice.js`: thunks for the eight backend calls.
8. Pages in the section order below.
9. Then change colors/fonts/spacing.

### Routes (frozen)

| Path | Page | File |
|------|------|------|
| `/` | Home | `src/components/pages/home/Home.jsx` |
| `/about-us` | About | `src/components/pages/about/AboutUs.jsx` |
| `/course-category` | All courses | `src/components/pages/courses/Courses.jsx` |
| `/course-category/:id` | Courses by category | same |
| `/courses/:id` | Course detail | `src/components/pages/courses/[id]/index.jsx` |
| `/events` | Events (redirect → `/events/completed`) | `src/components/pages/events/Events.jsx` |
| `/events/:tab` | Tab: `happening` \| `upcoming` \| `completed` | same |
| `/events/:tab/:id` | Event detail | `src/components/pages/events/[id]/index.jsx` |
| `/contacts` | Contacts | `src/components/pages/contacts/Contacts.jsx` |
| `*` | 404 | `src/components/pages/shared/Error.jsx` |

Nav source of truth: `src/entities/routesArray.jsx` (Header, MobileMenu, Footer).

### Page sections (frozen order)

**Home**

1. Hero video (`/videos/…`)  
2. Register / trial form  
3. Category swiper → `/course-category/:id`  
4. Popular courses (4) → “view all” `/course-category`  
5. Lesson info strip  
6. Three completed events → `/events`  
7. Reviews slider  

**About**

1. Title + image  
2. Text  
3. Category swiper  
4. Three feature cards (entity or CMS)  
5. Quote  
6. Team slider (`/api/teams/`)  

**Courses:** title, category sidebar (desktop) / drawer (mobile), grid|list toggle, pagination, cards → `/courses/:id`.

**Course detail:** title, category, image, Sign up → `/contacts`, feature flags, description, related courses.

**Events:** three tabs with counts; empty tab disabled; card → `/events/:status/:id`.

**Event detail:** gallery, title, Sign up, description, dates, place.

**Contacts:** three info cards + same form as Home (without hero decoration).

---

## Folder skeleton

```text
src/
  App.jsx                 # layout + routes
  main.jsx                # Provider, BrowserRouter, i18n
  i18n.jsx
  index.css               # Tailwind
  App.css                 # extra CSS (design may replace)
  utils/utils.js          # BASE_URL, getImageUrl
  redux/store.js
  redux/dataSlice.js      # fetch* thunks
  locale/am.json
  locale/en.json
  locale/ru.json
  entities/               # nav, contacts, socials, about cards
  components/
    header/               # Header, Menu, MobileMenu, LanguageSwitcher
    footer/               # Footer
    pages/
      home/
      about/
      courses/ + [id]/
      events/ + [id]/
      contacts/ + api/fetchMessage.jsx
      shared/
public/images public/videos public/fonts
```

---

## API used by this app

`BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://127.0.0.1:8000'`

| Method | URL | Where |
|--------|-----|--------|
| GET | `/api/categories/?language={lng}` | Home, About, Courses sidebar |
| GET | `/api/popular_courses/?language={lng}` | Home, Courses, course detail |
| GET | `/api/events/?language={lng}` | Home, Events |
| GET | `/api/events/{id}/?language={lng}` | Event detail |
| GET | `/api/reviews/?language={lng}` | Home |
| GET | `/api/lesson_info/?language={lng}` | Home |
| GET | `/api/teams/?language={lng}` | About |
| POST | `/api/contact/` | Form (`fetchMessage.jsx`) |

On language change, dispatch the same thunks again.

`getImageUrl(path)`: if `path` starts with `https`, use as-is; else `{BASE_URL}{path}`.

Contact POST should send CSRF header `X-CSRFToken` from cookie `csrftoken` if Django session cookie is present.

---

## Design tokens (safe to change)

```js
// tailwind.config.js
colors: {
  primary: '#FFB606',
  secondary: '#2a4856',
}
```

Change these, `App.css`, and public images/videos. Do **not** rename routes, Redux thunk names, or i18n nav keys (`HOME`, `ABOUT_US`, `COURSES`, `EVENTS`, `CONTACTS`) without updating all three locale files.

---

## Who does what (frontend half of the 10)

| Role | Files |
|------|--------|
| Shell | `App.jsx`, `header/`, `footer/`, `i18n.jsx`, `entities/routesArray.jsx` |
| Home + About | `pages/home/`, `pages/about/`, `pages/shared/` |
| Courses | `pages/courses/` |
| Events | `pages/events/` |
| Contacts | `pages/contacts/`, `RegisterForm.jsx` |
| Design | `tailwind.config.js`, `App.css`, `public/` |

---

## Do not copy these mistakes

- No extra pages until the five nav pages work.
- Do not store course/event text in frontend JSON — it comes from the API.
- `ComingSoonPage` is unused; skip it.
- Prefer one carousel library if you rebuild.
- Wire form `category` and `country` into the POST body.
- Do not add a new route without adding it to `routesArray` **and** `App.jsx`.
