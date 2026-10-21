# Wave 6 — polish / QA checklist (zone 10, UI/QA)

**RU** · **EN** · **HY** — этот чеклист вставляют в описание каждого PR зон 4–9 волны 6 и отмечают только свою зону. Мержится до постраничного polish; ревьюер UI/QA не пропускает PR, где пункт зоны не отмечен и не объяснён.

## Русский

### Production frontend (зона 10, этот PR)

- [ ] `frontend/Dockerfile` — двухстадийная сборка: `npm ci` → `npm run build` → nginx раздаёт `dist`. Vite dev server в проде нет.
- [ ] `docker-compose.yml`: сервис `frontend` без bind-mount'ов и без `npm run dev`; `VITE_BASE_URL` — build-arg (встраивается в бандл при сборке), не runtime env.
- [ ] nginx: SPA-fallback на `index.html` (неизвестный путь показывает React-404), `index.html` — `no-cache`, `/assets/` — immutable-кэш на год, статика из `public/` — кэш на неделю, security headers (`nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`), gzip, `server_tokens off`.
- [ ] Проверка: `docker compose build frontend && docker compose up frontend` → `http://localhost:3000` отдаёт собранный сайт, прямой переход на `/contacts` и на несуществующий путь не даёт nginx-404.

### Чеклист для каждой страницы (зоны 4–9, в свой PR)

- [ ] **375px и desktop**: нет горизонтального скролла (`overflow-x` не спасает контент — сетки и картинки реально помещаются), нет обрезанного текста.
- [ ] **Картинки**: у каждой `<img>` есть `alt` (у декоративных — `alt=""`), медиа только из `frontend/public/` или с API (`VITE_BASE_URL` для не-`https://`), вне первого экрана — lazy.
- [ ] **Фокус и a11y**: видимый `:focus-visible` на всех ссылках/кнопках/полях, у полей форм есть `label`/`aria-label`, ошибки — рядом с полем и с `aria-invalid`, интерактив доступен с клавиатуры, меню закрывается по `Escape`.
- [ ] **Токены**: нет новых hex вне `:root` в `frontend/src/index.css`; цвета — `var(--color-*)` или Tailwind-утилиты темы.
- [ ] **Состояния**: loading / error / empty выглядят одинаково с остальными страницами и берутся из i18n (`common.loading` и т.д.), а не захардкожены на одном языке.
- [ ] **SEO**: `document.title` соответствует маршруту и языку (ставит оболочка по `pageTitles` в `am/en/ru.json`); `<html lang>` — зона Sv, финальным PR.
- [ ] **Данные**: страница ходит только в текущий API с `?language=`, смена флага обновляет список; пустой API и отключённая сеть не ломают layout.
- [ ] **Проверки в описании PR**: вывод `npm run build`, ширина 375px проверена, долг из `fix.md` своей зоны перечислен и закрыт.

### Известный долг, сознательно не в этом PR

- Чанк >500 kB (532.90 kB) — code-splitting маршрутов, зона Hayk (идёт после этого PR по порядку мержа).
- `<html lang>` за `i18n.language` и тесты языка — зона Sv, последний PR волны.
- Тесты backend по зонам и CI `manage.py test` + docker smoke — Lead / владельцы зон; этот PR CI не трогает.
- Существующие hex в CSS чужих зон не переписываются здесь: их владельцы приводят файлы к токенам в своих polish-PR; правило «нет новых hex» действует уже сейчас.

## English

Wave-6 polish/QA checklist owned by zone 10 (UI/QA). Paste it into every zone 4–9 PR description and tick only your zone.

- **Production frontend (this PR):** two-stage `frontend/Dockerfile` (`npm ci` → `npm run build` → nginx serves `dist`; no Vite dev server); compose `frontend` has no bind mounts and passes `VITE_BASE_URL` as a build arg; nginx has SPA fallback, `no-cache` for `index.html`, immutable caching for `/assets/`, security headers and gzip. Smoke: `docker compose up frontend` serves the built site on `:3000`, deep links and unknown paths do not produce an nginx 404.
- **Every page PR:** no horizontal scroll at 375px and desktop; `alt` on every image (empty for decorative), media only from `frontend/public/` or the API, lazy below the fold; visible focus, labelled form fields, errors next to fields with `aria-invalid`, keyboard-operable menus (`Escape` closes); no new hex outside `:root` tokens in `index.css`; identical loading/error/empty states from i18n; per-route `document.title` follows route + language (shell sets it from `pageTitles` in `am/en/ru.json`); data only from the current API with `?language=`, empty API / offline must not break layout; PR description contains `npm run build` output and the zone's `fix.md` debt closure.
- **Deliberately not in this PR:** the >500 kB chunk (route code-splitting — Hayk, merges after this PR), `<html lang>` sync and language tests (Sv, last), backend tests and CI `manage.py test` + docker smoke (Lead / zone owners).

## Հայերեն

Ալիք 6-ի polish/QA չեկլիստ (գոտի 10, UI/QA)։ Տեղադրել յուրաքանչյուր գոտու (4–9) PR-ի նկարագրության մեջ և նշել միայն սեփական գոտին։

- **Production frontend (այս PR)**՝ երկփուլ `frontend/Dockerfile` (`npm ci` → `npm run build` → nginx-ը տալիս է `dist`-ը, Vite dev server չկա), compose-ի `frontend`-ը առանց bind mount-ների է, `VITE_BASE_URL`-ը՝ build arg։ nginx-ում կա SPA fallback, `index.html`-ի համար՝ `no-cache`, `/assets/`-ի համար՝ immutable cache, security header-ներ և gzip։ Ստուգում՝ `docker compose up frontend` → `:3000`-ում բացվում է հավաքված կայքը, խորը հղումները nginx-404 չեն տալիս։
- **Յուրաքանչյուր էջի PR**՝ 375px և desktop լայնությամբ հորիզոնական scroll չկա; բոլոր նկարներն ունեն `alt` (դեկորատիվները՝ `alt=""`), մեդիան՝ միայն `frontend/public/`-ից կամ API-ից, առաջին էկրանից դուրս՝ lazy; տեսանելի ֆոկուս, ձևերի դաշտերն ունեն պիտակներ, սխալները՝ դաշտի կողքին `aria-invalid`-ով, մենյուն փակվում է `Escape`-ով; նոր hex չկա `index.css`-ի `:root` թոքեններից դուրս; loading/error/empty վիճակները նույնն են ամենուր և i18n-ից են; `document.title`-ը համապատասխանում է երթուղուն և լեզվին (shell-ը դնում է `pageTitles`-ից՝ `am/en/ru.json`); տվյալները միայն ընթացիկ API-ից `?language=`-ով, դատարկ API-ն / անջատված ցանցը layout չեն կոտրում; PR-ի նկարագրության մեջ՝ `npm run build`-ի արդյունքը և գոտու `fix.md` պարտքի փակումը։
- **Գիտակցաբար այս PR-ում չկա**՝ >500 kB չանկը (code-splitting — Hayk, մերջվում է այս PR-ից հետո), `<html lang>`-ի համաժամացումը և լեզվի թեստերը (Sv, վերջում), backend թեստերն ու CI-ի `manage.py test` + docker smoke-ը (Lead / գոտիների սեփականատերեր)։
