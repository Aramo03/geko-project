# Task wave 2 — модели Django

10 человек. Одна зона = свои модели. Срок: **1 день**.

Ветка от `dev`: `feat/<имя>-<зона>`. PR только в `dev`. См. [CONTRIBUTING.md](CONTRIBUTING.md).

**Спека полей:** [backup/prod-geko-back-main/main/models.py](backup/prod-geko-back-main/main/models.py) — смотри, не копируй файл целиком.  
**Новое:** `Comment`, `UIBlock`, кастомный `User` — [docs/backend.md](docs/backend.md).

Имена классов **как в backup**. Не переименовывать `PopularCourse`, `ContactMessage`.

---

## 1. Lead

Порядок мержа в `dev`, конфликты, ревью.

**Сделать:** договориться о порядке: **User → Language → Category → … → UIBlock**; таблица «кто что мержит и когда»; никто не пушит в `main`.

**DoD:** все PR идут в `dev`; после полного мержа команда запускает `makemigrations` + `migrate` (зона 10 помогает).

Порядок мержа в `dev` (следующий PR только после предыдущего). В `main` не пушить.

| Когда | Кто | Зона | Что мержить |
|-------|-----|------|-------------|
| 1 | Daniel | User | `accounts`: `User` + `managers.py` |
| 2 | Sv | Language | `Language` |
| 3 | Karen | Category | `Category` + `CategoryTranslation` |
| 4 | Vach | Courses | `PopularCourse` + `PopularCourseTranslation` |
| 5 | Ashot | Events | `Event` + `EventTranslation` + `EventGallery` |
| 6 | Hayk | Content | `Review`, `LessonInfo` + `LessonInfoTranslation` |
| 7 | Suren | Team | `Team` + `TeamTranslation` |
| 8 | Mariam | Leads + Comments | `ContactMessage`, `Comment` |
| 9 | UI / QA | UIBlock | `UIBlock`, общий `makemigrations` + `migrate`, `init_ui` |

Конфликт в `main/models.py` или в миграции `main` закрывает Lead: чужие классы не переписывать.

## 2. User (`accounts`)Daniel

**Сделать:** [`backend/apps/accounts/models.py`](backend/apps/accounts/models.py) + [`managers.py`](backend/apps/accounts/managers.py) — кастомный `User`, email-логин, роли `user` / `admin` / `superuser`; `save()` согласует `is_staff` / `is_superuser` с role.

**DoD:** `python manage.py makemigrations accounts` без ошибок; PR в `dev` **первым** среди моделей.

## 3. Language - Sv


**Сделать:** модель `Language` (`code`, `name`) в `apps/main/models.py`.

**DoD:** миграция `main`; в комментарии PR — seed позже: `am`, `en`, `ru`.

## 4. Category - Karen

**Сделать:** `Category` + `CategoryTranslation` (FK на Language, `unique_together`).

**DoD:** миграция; связь Category ↔ Translation в PR-описании.

## 5. Courses - Vach

**Сделать:** `PopularCourse` + `PopularCourseTranslation` (FK Category).

**DoD:** миграция; имена **PopularCourse**, не Course.

## 6. Events - Ashot

**Сделать:** `Event` (`status`: upcoming / happening / completed) + `EventTranslation` + `EventGallery`.

**DoD:** миграция; три статуса как в backup.

## 7. Content - Hayk

**Сделать:** `Review`; `LessonInfo` + `LessonInfoTranslation`.

**DoD:** миграция; ordering по `order` где нужно (см. backup).

## 8. Team - Suren

**Сделать:** `Team` + `TeamTranslation`.

**DoD:** миграция.

## 9. Leads + Comments - Mariam

**Сделать:** `ContactMessage` (форма пробного урока); `Comment` — гость без логина: `full_name`, `email`, `whatsapp` (blank ok), `text`; FK **либо** `category` **либо** `popular_course`; `parent` для ответа admin; `is_approved`.

**DoD:** миграция; validation «ровно одна цель» (category xor course).

## 10. UI / QA

**Сделать:** `UIBlock` (`key`, `section`, `payload`, `order`, `is_visible`); после мержа всех зон в `dev` — общий `makemigrations` + `migrate`; восстановить логику [`init_ui`](backend/apps/main/management/commands/init_ui.py) (пока заглушка).

**DoD:** `migrate` на чистой БД проходит; `init_ui` создаёт языки и 4 блока; чеклист: все модели из списка в `main/models.py` TODO есть в коде.

---

## Общие правила волны

- Один PR = одна зона моделей
- Не трогать сериализаторы / views / React в этой волне
- Конфликты в `main/models.py` — Lead решает, не перезаписывать чужие классы
- После волны: [`create_admin`](backend/apps/accounts/management/commands/create_admin.py) и admin-регистрация — следующая волна

Когда преподаватель скажет «обнови task» — этот файл перепишут под волну 3.
