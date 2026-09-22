# Backup — старый сайт GEKO (read-only)

Это **референс**, не рабочая папка. Смотри страницы, API, медиа. Не мержи этот код в `backend/` и `frontend/` нового каркаса. Не коммить сюда правки.

## Что внутри

| Путь | Что |
|------|-----|
| `geko-front-main/` | старый React (без `node_modules`, без `.env`) |
| `prod-geko-back-main/` | старый Django (без `venv`, без `.env`) |
| `db_backup.sql` | дамп Postgres без паролей из `.env` |
| `media/event_gallery_images.zip` | фото галереи событий |
| `README.original.md` | старый учебный README (10 ролей, маршруты, API) |

Секреты (`.env` с паролем БД) **не** копировались. Для запуска старого кода возьми `.env.example` внутри папок.

## Зачем вам это

- Те же маршруты и те же имена API, что нужно повторить
- Картинки и видео — единственные разрешённые медиа
- Понять секции Home / About / Events, не выдумывать новые

## Что в новом проекте другое

- Кастомный User: `user` / `admin` / `superuser`
- Комментарии на категории и деталях курса
- `UIBlock` создаётся командой `init_ui`, не кнопкой Add у admin
- Docker, JWT, Swagger, Unfold — в новом стеке явно

## Как открыть старый фронт локально (по желанию)

```bash
cd backup/geko-front-main
copy .env.example .env
npm install
npm run dev
```

Старый бэк: см. `prod-geko-back-main/README.md`. Это не обязательная часть волны 1.
