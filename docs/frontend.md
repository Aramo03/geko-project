# Frontend

Как писать React в этом проекте. **Волна 5:** вид бери из [Figma Untitled](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0) (файл `dhh8j2e9rBeYrdPmzKz02I`, холст `0-1`). Backup [backup/geko-front-main](../backup/geko-front-main) — старое поведение, не макет. Код оттуда не копируй папками.

Кадр своей страницы ищи на холсте. Нет кадра — спроси Lead, не рисуй второй дизайн. Цвета — CSS-переменные оболочки (их выкладывает UI/QA). Новые подписи — в `am.json` / `en.json` / `ru.json`.

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

Оболочка берёт файлы из `frontend/public/`: `logo.webp`, `mainLoad.webp`, `mer_masin.webp`, флаги `am`/`en`/`ru`, `videos/main.webm`, `videos/main2.mp4`, `favicon.ico`, шрифт Roboto.

Не используются и убраны из `public`: `books.webp`, `images/about_info/`, `faviconLogo.ico`. Загрузки курсов, событий и команды живут в Django `media` и в пустой базе отсутствуют — их добавляют в админке. Папку `backup/` не копировать в `public`.

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

## Цвета и Tailwind

Все UI-цвета — в `:root` ([`frontend/src/index.css`](../frontend/src/index.css)); в разметке используй утилиты Tailwind (`bg-brand`, `text-text-muted`, …) или `var(--color-*)`. Анимации — [`frontend/src/styles/animations.css`](../frontend/src/styles/animations.css) и локальные `*.css` компонентов. Картинки/видео — [`OptimizedImage`](../frontend/src/components/OptimizedMedia/OptimizedImage.jsx) (`loading`, `decoding`, `fetchPriority`).

## Оболочка

Header (телефон, email, языки, меню) → страница → Footer (контакты, навигация, карта, соцсети). **Из API `UIBlock`** (после `python manage.py init_ui`): `contacts_bar` / `footer` — phone, email, map URL, соцсети; `header` — logo, `button_link`. **Из i18n:** подписи меню и форм, адрес текстом (`contacts.addressLine`), тексты hero на Home (`home.hero*`), footer description. Хелперы — `frontend/src/lib/uiBlocks.jsx`.

## Чеклист polish (волна 6)

Проверять на desktop и на ширине 375px:

- нет горизонтального скролла (`overflow-x: clip` на `body`, сетки через `minmax(0, 1fr)`)
- у содержательных картинок есть `alt`, декоративные иконки — `aria-hidden`
- фокус виден (`:focus-visible`, токен `--color-focus`)
- цвета только из переменных `index.css`, новые hex в компонентах не добавлять
- loading / error / empty на страницах используют `common.loading`, `common.error`, `common.empty`
- `document.title` меняется по маршруту (`pageTitles` в i18n), в `index.html` есть title и meta description
- `<html lang>` равен `am`, `en` или `ru` после переключения языка
- у полей форм есть подпись, ошибка связана через `aria-describedby` и `aria-invalid`, после отправки фокус остаётся на статусе
- `npm run build` не предупреждает о чанке больше 500 kB

## English

Wave 5 visual source: [Figma Untitled](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0). Use Tailwind, i18n, react-router-dom, and `useForm`. Media only from `backup/` / `frontend/public/`. Every component folder must contain `Component.jsx`, `component.css`, `component.js`.

## Հայերեն

Ալիք 5-ի տեսքը՝ [Figma](https://www.figma.com/design/dhh8j2e9rBeYrdPmzKz02I/Untitled?node-id=0-1&p=f&t=zLfOBIPA8bKF4Onc-0)։ Ամեն կոմպոնենտ՝ 3 ֆայլ։ Նկարները միայն backup-ից / `public`-ից։ Ձևերը՝ `useForm`։
