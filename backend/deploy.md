# Deploy — сервер, домен, HTTPS

Сайт GEKO поднимается из **корня репозитория** одним Docker Compose: Postgres, Django (gunicorn) и собранный React (nginx). Браузер ходит только на домен. `/api` и `/static` nginx отдает в Django, `/media` — загруженные картинки. `VITE_BASE_URL` оставляют пустым, иначе шапка и футер на HTTPS ищут API на `127.0.0.1` посетителя и телефон пропадает.

В `main` не пушить. На сервер попадает ветка `dev`.

## Русский

### 1. Карта папок

Все команды Docker — из корня, там где лежит `docker-compose.yml`. Не из `backend/` и не из `frontend/`.

| Папка или файл | Зачем | Где это запускают |
|---|---|---|
| `docker-compose.yml` | Три сервиса: `db`, `backend`, `frontend` | Корень, и на своём ПК, и на сервере |
| `.env` | Секреты Compose. В git не коммитить | Только корень. Создать из `.env.example` |
| `.env.example` | Образец без секретов | Не запускать, только копировать |
| `backend/` | Код Django, `manage.py`, `requirements.txt` | На сервере внутрь не заходят: контейнер сам делает migrate и gunicorn |
| `backend/.env` | Настройки **локального** `runserver` на вашем ПК (`DB_HOST=localhost`) | Только ваш компьютер. На сервер этот файл не нужен и не копируется в образ |
| `backend/config/settings.py` | Django читает переменные окружения контейнера | Не править на сервере руками |
| `backend/apps/main/management/commands/init_ui.py` | Языки и дефолтные header, hero, footer, contacts bar | Выполняется командой внутри контейнера `backend` |
| `frontend/` | Исходники React | На сервере `npm` не запускают. Образ сам делает `npm ci` и `npm run build` |
| `frontend/nginx.conf` | Отдаёт сайт и проксирует `/api`, `/static`, `/media` | Попадает в образ frontend |
| `frontend/Dockerfile` | Сборка статики и nginx | Собирает Compose |
| `docs/` | Короткие гайды. Полный deploy — этот файл | Читать |

Тома Docker (их создаёт Compose, это не папки в git):

- `pgdata` — база Postgres. Удаление тома стирает все курсы и админов.
- `staticfiles` — CSS и JS админки после `collectstatic`.
- `mediafiles` — картинки, загруженные в админке. Тот же том читает nginx как `/media/`.

### 2. Куда идёт запрос

1. Посетитель открывает `https://example.com/`.
2. Caddy принимает 443, сертификат Let's Encrypt, и передаёт запрос контейнеру `frontend` (порт 3000 внутри сети Docker).
3. Nginx отдаёт `index.html` и файлы из сборки Vite.
4. React запрашивает `https://example.com/api/ui-blocks/` — тот же хост, без порта 8000.
5. Nginx проксирует `/api/` в контейнер `backend:8000`. Оттуда шапка берёт телефон и почту, футер — адрес, телефон, почту, карту и соцсети.
6. `/static/` — файлы админки через WhiteNoise в gunicorn.
7. `/media/` — файлы тома `mediafiles`.

Порт 8000 и Postgres снаружи сервера не открывают. Иначе кто угодно обойдёт HTTPS.

### 3. На своём компьютере, до сервера

Корень репозитория:

```bash
git checkout dev
git pull origin dev
copy .env.example .env
```

В корневом `.env` для локальной проверки:

- `DEBUG=True` можно на время локального Docker. На сервере обязательно `False`.
- `SECRET_KEY` — случайная строка от 32 символов **без символа `$`**. Compose раскрывает `$` как переменную. Если в ключе есть `$`, процесс не стартует или ключ обрежется.
- `POSTGRES_PASSWORD` — свой пароль, не заглушка из примера.
- `VITE_BASE_URL` оставить пустым.

Папка `backend/` нужна только если вы запускаете Django без Docker:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

В `backend/.env` поставьте `DB_HOST=localhost`, `DB_USER` и `DB_PASSWORD` как `POSTGRES_USER` и `POSTGRES_PASSWORD` из корневого `.env`. Затем из `backend/`:

```bash
python manage.py migrate
python manage.py init_ui
python manage.py runserver
```

Фронт в другом окне, папка `frontend/`:

```bash
npm install
npm run dev
```

Vite проксирует `/api` на `127.0.0.1:8000`. Отдельный `VITE_BASE_URL` не нужен. Если порт 3000 занят Docker, Vite возьмёт 3001 — это нормально, запрос всё равно same-origin.

Локальный Docker целиком, снова из **корня**:

```bash
docker compose up --build -d
docker compose exec backend python manage.py init_ui
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py create_admin
```

Проверка: http://127.0.0.1:3000/ — в чёрной полосе шапки телефон `(+374) 98 03 33 94` и почта `gekoeducation1@gmail.com`. Внизу, блок Contact Info: адрес, тот же телефон, почта, ссылка на карту.

Повторный `init_ui` заново записывает эти четыре слота. Правки телефона в админке он затирает. Курсы, команду, отзывы и события команда не создаёт.

### 4. Сервер

Нужен VPS с публичным IPv4, Ubuntu 22.04 или 24.04. Войти по SSH в домашний каталог, не в случайную папку.

Поставить Docker Engine и плагин Compose с официальной инструкции Docker. Проверка:

```bash
docker --version
docker compose version
```

Открыть в firewall только SSH, 80 и 443:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Клон в домашнюю папку, например `/home/ubuntu/geko-project`. Дальше все команды из этого корня:

```bash
git clone -b dev https://github.com/Aramo03/geko-project.git
cd geko-project
cp .env.example .env
```

Сгенерировать ключ на сервере (в строке не должно остаться `$`):

```bash
python3 -c "from django.core.management.utils import get_random_secret_key as g; print(g().replace('$',''))"
```

Если `python3` без Django, подойдёт любая случайная строка длиннее 32 символов без `$`.

Открыть корневой `.env` и выставить значения сервера. `example.com` заменить на свой домен:

```env
DEBUG=False
SECRET_KEY=сюда-длинный-ключ-без-доллара
ALLOWED_HOSTS=example.com,www.example.com
CORS_ALLOWED_ORIGINS=https://example.com,https://www.example.com
CSRF_TRUSTED_ORIGINS=https://example.com,https://www.example.com
POSTGRES_DB=geko_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=длинный-пароль-базы
VITE_BASE_URL=
```

`DEBUG=False` при заглушке `SECRET_KEY`, пустом `ALLOWED_HOSTS` или пароле-примере из `.env.example` контейнер backend не запустится. Это защита, не поломка.

Порты в `docker-compose.yml` на сервере привязать к localhost, чтобы 5432 и 8000 не торчали в интернет. В сервисе `db`:

```yaml
ports:
  - "127.0.0.1:5432:5432"
```

В сервисе `backend`:

```yaml
ports:
  - "127.0.0.1:8000:8000"
```

В сервисе `frontend` порт 3000 можно оставить на localhost для проверки по SSH-туннелю:

```yaml
ports:
  - "127.0.0.1:3000:3000"
```

Caddy внутри той же сети Docker ходит на `frontend:3000` и опубликованные порты ему не нужны.

### 5. Домен

У регистратора домена создать DNS-записи на публичный IP сервера. Пока записи не указывают на этот IP, сертификат не выпустится.

- `A` для `example.com` → IP сервера
- `A` для `www.example.com` → тот же IP, если нужен www

Подождать, пока `dig example.com` с вашего ПК показывает этот IP. Обычно несколько минут, иногда до часа.

`ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` и `CSRF_TRUSTED_ORIGINS` должны содержать тот же домен, с `https://` у двух последних. Имя без схемы в `ALLOWED_HOSTS`, со схемой в CORS и CSRF.

### 6. HTTPS

В корне репозитория создать файл `Caddyfile` (он не в git, домен у каждого свой):

```caddyfile
example.com, www.example.com {
    reverse_proxy frontend:3000
}
```

Caddy сам получает и обновляет сертификат Let's Encrypt. Почта для уведомлений о сертификате — по желанию, строкой в начале файла: `email you@example.com`.

Рядом создать `docker-compose.https.yml`:

```yaml
services:
  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - frontend

volumes:
  caddy_data:
  caddy_config:
```

Порты 80 и 443 должны быть свободны. Если на сервере уже стоит nginx или apache, его остановить, иначе Caddy не займёт 80 и сертификат не выпустится.

Почта для Let's Encrypt и домен должны быть настоящими. С `example.com` сертификат не дадут.

### 7. Первый запуск на сервере

Из корня `/home/ubuntu/geko-project`:

```bash
docker compose -f docker-compose.yml -f docker-compose.https.yml up --build -d
```

Первая сборка фронта качает npm-зависимости и занимает несколько минут. Смотреть:

```bash
docker compose ps
docker compose logs backend --tail 50
docker compose logs caddy --tail 50
```

`backend` в логе должен дойти до gunicorn без `ImproperlyConfigured`. `caddy` должен написать, что сертификат получен.

Один раз, всё ещё из корня, создать языки, шапку, футер и staff:

```bash
docker compose exec backend python manage.py init_ui
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py create_admin
```

`createsuperuser` спрашивает email и пароль в терминале. `create_admin` — учётка с ролью admin для этого проекта. Пароли в чат и в git не класть.

### 8. Проверка

- https://example.com/ открывается с замком.
- В шапке видны `(+374) 98 03 33 94` и `gekoeducation1@gmail.com`.
- В футере, Contact Info: адрес Еревана, тот же телефон, почта, ссылка Map.
- https://example.com/api/schema/swagger-ui/
- https://example.com/api/admin/ — логин staff. Стили админки грузятся с `/static/`.
- `curl -fsS https://example.com/api/categories/` печатает `[]`, пока курсы не добавлены в админке.
- `curl -fsS https://example.com/api/ui-blocks/` содержит `"phone": "(+374) 98 03 33 94"`.

Если сайт открывается, а телефона нет: в корневом `.env` не должен быть `VITE_BASE_URL=http://127.0.0.1:8000`. Очистить значение, затем из корня `docker compose build frontend` и `docker compose up -d frontend`. После этого браузер ходит на `https://домен/api/...`, а не на localhost посетителя.

### 9. Обновление

На сервере, из корня:

```bash
git pull origin dev
docker compose -f docker-compose.yml -f docker-compose.https.yml up --build -d
```

Миграции выполняет команда контейнера backend при старте. `init_ui` после обновления запускать только если нужно вернуть дефолтные слоты шапки и футера. Том `pgdata` при `up` не удаляется. `docker compose down -v` удаляет базу — на сервере так не делать.

### 10. Бэкап

Из корня, пока контейнер `db` запущен:

```bash
docker compose exec -T db pg_dump -U postgres geko_db > geko-$(date +%F).sql
```

Файл дампа забрать с сервера и не коммитить. Восстановление в пустую базу:

```bash
docker compose exec -T db psql -U postgres -d geko_db < geko-2026-10-23.sql
```

Картинки админки лежат в томе `mediafiles`, их дамп SQL не содержит. Копировать том отдельно, если загрузки уже есть.

## English

Run every Docker command from the repository root, the directory that contains `docker-compose.yml`.

The root `.env` (copied from `.env.example`) is what the server uses. `backend/.env` is only for `python manage.py runserver` on your own machine. The frontend image builds itself; do not run npm on the server.

Set `DEBUG=False`, a `SECRET_KEY` of at least 32 characters with no `$`, a real `POSTGRES_PASSWORD`, and leave `VITE_BASE_URL` empty. Put the bare domain in `ALLOWED_HOSTS` and `https://your-domain` in `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`.

DNS: an `A` record for the domain (and `www` if you use it) pointing at the server IP. Wait until it resolves before asking for a certificate.

On the server, bind Postgres `5432` and backend `8000` to `127.0.0.1` in `docker-compose.yml` so they are not public. Create a `Caddyfile`:

```caddyfile
example.com, www.example.com {
    reverse_proxy frontend:3000
}
```

Create `docker-compose.https.yml` with a `caddy:2` service publishing `80` and `443`, mounting that Caddyfile and two volumes `caddy_data` and `caddy_config`, `depends_on: frontend`. Stop any other program already listening on 80 or 443.

Start:

```bash
docker compose -f docker-compose.yml -f docker-compose.https.yml up --build -d
docker compose exec backend python manage.py init_ui
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py create_admin
```

Check the padlock, the header phone `(+374) 98 03 33 94` and email, the footer Contact Info block, `/api/schema/swagger-ui/`, `/api/admin/`, an empty `GET /api/categories/`, and `"phone"` inside `GET /api/ui-blocks/`.

Updates: `git pull origin dev`, then the same `up --build -d`. Do not use `down -v` on the server. Backup with `pg_dump` from the `db` service. `init_ui` rewrites the four shell slots and does not insert courses, team, reviews, or events.

## Հայերեն

Բոլոր Docker հրամանները արմատից են, որտեղ `docker-compose.yml`-ն է։

Սերվերի գաղտնիքները արմատի `.env`-ում են (պատճեն `.env.example`-ից)։ `backend/.env`-ը միայն ձեր համակարգչի `runserver`-ի համար է։ Սերվերում `npm` մի գործարկեք. frontend image-ը ինքն է հավաքվում։

`DEBUG=False`, `SECRET_KEY` առնվազն 32 նիշ և առանց `$`, իրական `POSTGRES_PASSWORD`, `VITE_BASE_URL` դատարկ։ `ALLOWED_HOSTS`-ում դոմենը առանց սխեմայի, `CORS_ALLOWED_ORIGINS` և `CSRF_TRUSTED_ORIGINS` — `https://your-domain`։

DNS՝ `A` գրառում դեպի սերվերի IP։ Սերտիֆիկատից առաջ սպասեք, մինչև դոմենը այդ IP-ն ցույց տա։

Սերվերում `5432` և `8000` կապեք `127.0.0.1`-ին, որ բաց համացանցում չլինեն։ Արմատում `Caddyfile`.

```caddyfile
example.com, www.example.com {
    reverse_proxy frontend:3000
}
```

`docker-compose.https.yml`՝ `caddy:2`, պորտեր `80` և `443`, այդ ֆայլը և `caddy_data` / `caddy_config` volume-ները, `depends_on: frontend`։ 80 կամ 443 զբաղեցնող այլ ծրագիրը կանգնեցրեք։

Մեկնարկ.

```bash
docker compose -f docker-compose.yml -f docker-compose.https.yml up --build -d
docker compose exec backend python manage.py init_ui
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py create_admin
```

Ստուգեք կողպեքը, վերնագրի հեռախոսը `(+374) 98 03 33 94` և փոստը, footer-ի Contact Info-ն, `/api/schema/swagger-ui/`, `/api/admin/`, դատարկ `GET /api/categories/` և `"phone"` դաշտը `GET /api/ui-blocks/`-ում։

Թարմացում՝ `git pull origin dev`, հետո նույն `up --build -d`։ Սերվերում `down -v` մի արեք։ Պահուստ՝ `pg_dump` `db` սերվիսից։ `init_ui`-ը վերագրում է չորս shell սլոթը և դասընթաց, թիմ, կարծիք կամ իրադարձություն չի ավելացնում։
