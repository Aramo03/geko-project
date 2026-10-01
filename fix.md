# Статус после волны 2

**Дата:** 2026-09-29 · **Ветка:** `dev` (локально впереди `origin/dev`; рабочее дерево чистое).

Волна 2 **считается закрытой**: модели и миграции по зонам [TASK.md](TASK.md) в основном на месте. Ниже — что **исправлено** с прошлой версии этого файла и что **ещё осталось** перед продакшен-готовым API.

---

## Что уже не актуально (архив проблем wave 2)

| Было в старом fix.md | Сейчас |
|----------------------|--------|
| Два класса `Language` в `main/models.py` | **Исправлено** — один `Language` |
| SyntaxError в `main/migrations/0001_initial.py` (TeamTranslation) | **Исправлено** (коммит «Fix migration» и последующие PR) |
| `init_ui` — заглушка с `CommandError` | **Исправлено** — seed `am`/`en`/`ru` + 4 UI-блока |
| Daniel: `User` = `AbstractUser` + TODO | **Исправлено** — кастомный `User` + `UserManager` + `accounts/0001_initial` |
| Ashot: нет `status` у `Event` | **Исправлено** в модели + `main/0005_event_status.py` |
| Mariam: нет `is_approved` / xor у `Comment` | **Исправлено** в `main/models.py` + `0003_comment_is_approved` |
| Vach: курсы только в `main` | **Исправлено** — `apps.courses`, миграция `0004_move_popular_course` |

---

## Оставшиеся пробелы (честный список)

### Архитектура и данные

1. **Дубликаты `main` vs `apps.content`** — в `content` есть свои `Language`, `Review`, `LessonInfo` (+ translations). Это **намеренно** (учебный дубликат); API волны 3 должен читать **`main`**, пока Lead не согласует единый источник. **Не удалять** модели без решения Lead.
2. **`ContactMessage`** — в backup есть FK на `category`; в текущем `main` — `phone` без `category` / `country` / `whatsapp` как в backup. Уточнить с Mariam + Lead при API контактов.
3. **`Event`** — есть `status` и одно поле `date`; в backup — `start_date` / `end_date`, другие `upload_to` и `related_name` у gallery. Для API сверять с backup или зафиксировать контракт в docs.
4. **`Review` в `main`** — упрощённая схема (текст/рейтинг без image fields backup). Hayk: либо выровнять поля, либо описать в API.

### Backend волна 3 (ожидаемо пусто)

| Область | Файлы | Статус |
|---------|--------|--------|
| API / router | `main/urls.py`, `config/urls.py` | TODO, нет ViewSet |
| Serializers | `main/serializers.py` | TODO |
| Views | `main/views.py` | TODO |
| Admin Unfold | `main/admin.py`, `accounts/admin.py` | TODO |
| `create_admin` | `accounts/management/commands/create_admin.py` | **Всё ещё disabled**, хотя `User` уже реализован — Daniel (волна 3) |

### Миграции и CI

1. **`python manage.py migrate`** на **новой** SQLite (пустой файл) — **проходит** (проверено с `DB_NAME=…`).
2. **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) — только `check` + frontend build + docker build; **нет** `migrate` (и smoke `init_ui`). Lead + UI/QA.
3. После локальных правок всегда гонять `makemigrations` / `migrate` перед PR; при сомнении — чистая БД, не поломанная старая `db.sqlite3`.

### Git / ветки

- **`feat/courses`** — влит в `dev` (Vach).
- **Не мержить в `dev`:** `origin/feat/ui`, `origin/feature/events` (устаревшие/conflict-prone).
- PR только в **`dev`**, не в `main`.

---

## Рекомендуемый порядок волны 3 (Lead)

```text
1. Daniel: create_admin + JWT + регистрация User в admin
2. Sv: общий паттерн ?language= для serializers/views
3. Karen → Vach → Ashot → Hayk → Suren: публичные GET API по зонам
4. Mariam: contact + comments (+ reply JWT)
5. UI/QA: admin inlines, init_ui в Docker README, CI migrate
6. Front: shell (axios, language), затем страницы по docs/backend.md
```

---

## Быстрая проверка окружения

```bash
cd backend
pip install -r requirements.txt
# новая БД: задайте DB_NAME или удалите локальный db.sqlite3
python manage.py migrate
python manage.py init_ui
python manage.py check
```

---

## Исторический разбор (волна 2, для преподавателя)

Подробный постмортем по зонам (Daniel, Sv, Karen, …) из первой версии fix.md сохранён по смыслу в git-истории репозитория. Актуальный чеклист — только разделы **«Статус после волны 2»** выше.

*Имена зон: Daniel, Sv, Karen, Vach, Ashot, Hayk, Suren, Mariam; Lead и UI/QA.*
