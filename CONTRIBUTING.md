# Git — как работать в этом репозитории

**RU** · **EN** · **HY**

Ученики работают **только в своей ветке**. В `main` не пушат и не мержат. Максимум, куда можно влить работу — `dev`.

**Волна 2 (модели) закрыта** — см. [TASK.md](TASK.md). **Сейчас волна 3:** API, admin, фронт ([task-advanced.md](task-advanced.md)).

---

## Ветки

| Ветка | Кто трогает | Зачем |
|--------|-------------|--------|
| `main` | никто из учеников | стабильная версия, **protected** |
| `dev` | Lead после ревью PR | сборка команды |
| `feat/<имя>-<зона>` | только ты | твоя работа, например `feat/anna-home` |

Имена зон (волна 3): `user`, `language`, `category`, `courses`, `events`, `content`, `team`, `leads`, `api`, `admin`, `shell`, `home`, `contacts`, `design` — в имени ветки: `feat/<имя>-<зона>`.

### Ветки, которые **не мержить** в `dev`

| Ветка | Причина |
|--------|---------|
| `origin/feat/ui` | устарела относительно текущего `dev`, конфликты |
| `origin/feature/events` | устарела, Event уже в `main` на `dev` |

Влито: **`feat/courses`** (PopularCourse в `apps.courses`). Новую работу по курсам — только от актуального `dev`.

### Порядок работы (волна 3)

1. PR только в **`dev`**, base не `main`.
2. Сначала auth (Daniel), затем публичные GET API по зонам, затем POST contact/comments (Mariam), затем фронт.
3. Lead ревьюит один PR = одна зона; без `--force` в `dev` / `main`.

---

## Старт: клон и своя ветка

Делай по шагам. Не пропускай `dev`.

```bash
git clone <url-репозитория>
cd geko-project

git checkout dev
git pull origin dev

git checkout -b feat/имя-зона
```

Проверка: `git branch` — звёздочка на `feat/имя-зона`, не на `main`.

---

## Каждый день: commit и push

```bash
git status
git add .
git commit -m "feat(courses): add category page layout"
git push -u origin HEAD
```

Потом на GitHub/GitLab: **Create Pull Request**

- **base:** `dev`
- **compare:** твоя `feat/...`
- **не** base `main`

Если `push` пишет `no upstream`:

```bash
git push -u origin feat/имя-зона
```

---

## Если ошибка

### 1. Ещё не делал `commit` — хочу спрятать или отменить правки

Спрятать на потом:

```bash
git stash
git stash list
git stash pop
```

Выкинуть правки в одном файле (файл вернётся к последнему commit):

```bash
git checkout -- путь/к/файлу
```

Выкинуть **все** несохранённые правки (осторожно, не вернёшь):

```bash
git restore .
```

### 2. Сделал плохой `commit`, но **ещё не push**

Отменить последний commit, файлы оставить в рабочей папке:

```bash
git reset --soft HEAD~1
```

Вернуться к последнему нормальному commit на **своей** ветке:

```bash
git log --oneline
git reset --hard <hash-нормального-коммита>
```

`reset --hard` только на своей `feat/...`. Никогда на `main` и не на `dev`.

### 3. Плохой commit уже в remote, но в `dev` ещё не вливали

Безопасный путь — новый commit, который отменяет плохой:

```bash
git log --oneline
git revert <hash-плохого>
git push
```

Или переписать свою ветку (только если Lead разрешил и ветка никуда не влита):

```bash
git reset --hard <hash-нормального>
git push --force-with-lease
```

`--force` в `main` и `dev` **запрещён**.

### 4. Конфликт после `pull` / merge

```bash
git checkout feat/имя-зона
git pull origin dev
```

Если Git пишет `CONFLICT`:

1. Открой файлы с `<<<<<<<`
2. Оставь правильный код, удали маркеры
3. Сохрани
4. Дальше:

```bash
git add .
git commit -m "fix: resolve merge conflict with dev"
git push
```

### 5. Случайно сделал `push` + merge не туда (`main` или чужая ветка)

**Не делай** `git push --force` в `main`.

1. Напиши Lead в чат: какая ветка, ссылка на PR, hash merge (`git log --oneline`).
2. Lead на `main` или `dev`:

```bash
git checkout main
git pull
git revert -m 1 <hash-merge-коммита>
git push
```

`-m 1` нужен именно для merge-commit.

3. Ты у себя:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/имя-зона-fix
# исправь работу
git push -u origin HEAD
```

Новый PR снова только в `dev`.

---

## English

- Wave 2 models are done; wave 3 = API/admin/front ([task-advanced.md](task-advanced.md)).
- Never push or merge to `main`. PRs go to `dev` only.
- Do **not** merge `origin/feat/ui` or `origin/feature/events` into `dev`.
- `feat/courses` is already merged; branch new course work from current `dev`.
- Create a branch from updated `dev`: `git checkout -b feat/name-area`
- Bad local commit: `git reset --soft HEAD~1`
- Bad pushed commit (not in `dev` yet): `git revert` then push
- Accidental merge to `main`: do **not** force-push. Lead runs `git revert -m 1 <merge-hash>`. You continue from a new branch off `dev`.

## Հայերեն

- Ալիք 2 փակված է, ալիք 3 — API/front ([task-advanced.md](task-advanced.md))։
- `main` չեն դիպչում։ PR միայն դեպի `dev`։
- `feat/ui` և `feature/events` **չմիաձուլել** `dev`-ին։
- Ճյուղ՝ `git checkout -b feat/անուն-գոտի`
- Սխալ commit առանց push՝ `git reset --soft HEAD~1`
- Սխալ merge դեպի `main`՝ force չանել։ Lead-ը անում է `revert -m 1`։ Դու նոր ճյուղ ես բացում `dev`-ից։
