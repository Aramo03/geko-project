# Frontend

Как писать React в этом проекте. Смотри живой пример: [backup/geko-front-main](../backup/geko-front-main). Код оттуда не копируй папками — повтори логику.

## Стек (обязательно)

| Пакет | Зачем |
|--------|--------|
| React 19 + Vite | приложение |
| Tailwind CSS | утилиты |
| `react-router-dom` | маршруты |
| i18next + react-i18next | UI на `am` / `en` / `ru` |
| `useForm` из `react-hook-form` | все формы |
| Redux Toolkit + axios | API |
| CSS-файл компонента | локальные стили рядом с Tailwind |

## Маршруты (как в backup)

```
/                              Home
/about-us                      About
/course-category               все категории
/course-category/:id           категория + комментарии
/courses/:id                   детали курса + комментарии
/events                        → удобно редирект на /events/completed
/events/:tab                   happening | upcoming | completed
/events/:tab/:id               событие
/contacts                      контакты + форма
*                              404
```

Новое относительно backup: тред комментариев на `/course-category/:id` и `/courses/:id`.

Тексты контента — с API `?language=am|en|ru`. Подписи кнопок и меню — из JSON i18n.

## Медиа

Только файлы из backup. Они уже лежат в `frontend/public/` (скопированы из старого сайта) и в `backup/geko-front-main/public/`, `backup/media/`.

Можно: `/images/logo.webp`, `/images/flags/...`, `/videos/main.webm`, картинки галереи из `backup/media/event_gallery_images.zip`.

Нельзя: Unsplash, скачанные с интернета картинки, свои фото «на время».

Картинки курсов/событий с бэка: если URL не начинается с `https://`, добавь `VITE_BASE_URL`.

## Правило трёх файлов

Каждый компонент — папка и **ровно три файла**:

```
src/components/Header/
  Header.jsx      разметка
  header.css      стили
  header.js       логика, константы, хелперы
```

Имена: `Header.jsx` (PascalCase), `header.css` и `header.js` (camel/lower).

Пример уже есть в репозитории. Новый блок (Footer, CommentForm, CourseCard) — новая папка, те же три файла. Не складывай три компонента в один `.jsx`.

## Формы

Контакт и комментарий — только `useForm`:

```js
import { useForm } from 'react-hook-form'
```

Комментарий (гость): `full_name`, `email`, `whatsapp` (желательно), `text`.

Контакт (как в backup): `full_name`, `email`, `whatsapp`, `country`, `category`, `message` → `POST /api/contact/`.

## Оболочка

Header (телефон, email, языки, меню) → страница → Footer (контакты, навигация, карта, соцсети). Телефоны и hero — из API `UIBlock`, не хардкод.

## English

Use Tailwind, i18n, react-router-dom, and `useForm`. Media only from `backup/` / `frontend/public/`. Every component folder must contain `Component.jsx`, `component.css`, `component.js`.

## Հայերեն

Ամեն կոմպոնենտ՝ 3 ֆայլ։ Նկարները միայն backup-ից։ Ձևերը՝ `useForm`։ Երթուղիները նույնն են, ինչ հին կայքում, գումարած մեկնաբանություններ։
