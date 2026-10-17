"""Idempotent demo categories, popular courses, and parent reviews for Home UI."""

from apps.courses.models import PopularCourse, PopularCourseTranslation
from apps.main.models import Category, CategoryTranslation, Language, Review

CATEGORY_SEED = (
    ("language_arts", { "en": "Language Arts", "am": "Լեզվական արվեստ", "ru": "Языковые искусства" }),
    ("computer_science", { "en": "Computer Science", "am": "Համակարգչային գիտություն", "ru": "Компьютерные науки" }),
    ("exact_sciences", { "en": "Exact Sciences", "am": "Ճշգրիտ գիտություններ", "ru": "Точные науки" }),
    ("applied_tech", { "en": "Applied Tech", "am": "Կիրառական տեխնոլոգիա", "ru": "Прикладные технологии" }),
)

COURSE_SEED = (
    ("HTML", "computer_science", 1, {
        "en": ("HTML", "Structure the web with semantic markup, accessibility patterns, and document architecture."),
        "am": ("HTML", "Սեմանտիկ նշագրում, հասանելիություն և փաստաթղթի կառուցվածք։"),
        "ru": ("HTML", "Семантическая разметка, доступность и архитектура документов."),
    }),
    ("CSS", "computer_science", 2, {
        "en": ("CSS", "Layouts, responsive grids, design tokens, and polished interface systems."),
        "am": ("CSS", "Դասավորություններ, ադապտիվ ցանցեր և ինտերֆեյսի համակարգեր։"),
        "ru": ("CSS", "Вёрстка, адаптивные сетки и системы интерфейса."),
    }),
    ("JavaScript", "computer_science", 3, {
        "en": ("JavaScript", "DOM logic, async flows, modules, and interactive browser experiences."),
        "am": ("JavaScript", "DOM տրամաբանություն, ասինխրոն հոսքեր և ինտերակտիվ փորձ։"),
        "ru": ("JavaScript", "DOM, асинхронность, модули и интерактив в браузере."),
    }),
    ("React", "computer_science", 4, {
        "en": ("React", "Component models, state, hooks, and scalable single-page applications."),
        "am": ("React", "Կոմպոնենտներ, state, hooks և մասշտաբային SPA."),
        "ru": ("React", "Компоненты, state, hooks и масштабируемые SPA."),
    }),
    ("Python", "exact_sciences", 5, {
        "en": ("Python", "Readable syntax, data structures, scripting, and problem-solving foundations."),
        "am": ("Python", "Տվյալների կառուցվածքներ, սկրիպտավորում և լուծումների հիմք։"),
        "ru": ("Python", "Структуры данных, скрипты и основы решения задач."),
    }),
    ("Django", "computer_science", 6, {
        "en": ("Django", "ORM, REST APIs, auth, admin, and production-ready backend patterns."),
        "am": ("Django", "ORM, REST API, auth, admin և backend օրինաչափություններ։"),
        "ru": ("Django", "ORM, REST API, auth, admin и паттерны бэкенда."),
    }),
    ("Deployment", "applied_tech", 7, {
        "en": ("Deployment", "CI/CD, containers, hosting, and shipping full-stack projects safely."),
        "am": ("Deployment", "CI/CD, կոնտեյներներ, հոսթինգ և ապահով թողարկում։"),
        "ru": ("Deployment", "CI/CD, контейнеры, хостинг и безопасный релиз."),
    }),
    ("AI", "applied_tech", 8, {
        "en": ("AI", "Prompting, ML basics, automation workflows, and responsible AI literacy."),
        "am": ("AI", "Prompting, ML հիմքեր, ավտոմատացում և պատասխանատու AI."),
        "ru": ("AI", "Промпты, основы ML, автоматизация и ответственный AI."),
    }),
)

REVIEW_SEED = (
    (
        "Marcus Sterling",
        5,
        "Our daughter was initially afraid of math formulas. After only two months in the geometry logic module at GEKO, she is voluntarily leading classroom assignments!",
    ),
    (
        "Emily Henderson",
        5,
        "The coding and robotics track is top notch. They don't just build toy blocks; they explain real sensory arrays and variables. High quality educational rigor.",
    ),
    (
        "Andriy Kovalenko",
        5,
        "Absolute trust. The instructors are supportive and keep parents in sync with progress milestones constantly. We couldn't be more pleased.",
    ),
)


def _lang(code):
    return Language.objects.get(code=code)


def _ensure_categories(stdout):
    categories = {}
    for order, (key, labels) in enumerate(CATEGORY_SEED, start=1):
        category = Category.objects.filter(
            translations__language__code="en",
            translations__text=labels["en"],
        ).first()
        if not category:
            category = Category.objects.create(order=order)
            for code, text in labels.items():
                CategoryTranslation.objects.create(
                    category=category,
                    language=_lang(code),
                    text=text,
                )
            stdout.write(f"Created category {labels['en']}")
        categories[key] = category
    return categories


def _ensure_courses(categories, stdout):
    for en_title, cat_key, order, translations in COURSE_SEED:
        existing = PopularCourse.objects.filter(
            translations__language__code="en",
            translations__title=en_title,
        ).first()
        if existing:
            continue
        course = PopularCourse.objects.create(
            category=categories[cat_key],
            order=order,
            image_url="",
        )
        for code, (title, description) in translations.items():
            PopularCourseTranslation.objects.create(
                popular_course=course,
                language=_lang(code),
                title=title,
                description=description,
            )
        stdout.write(f"Created course {en_title}")


def _ensure_reviews(stdout):
    for full_name, rating, text in REVIEW_SEED:
        if Review.objects.filter(full_name=full_name, text=text).exists():
            continue
        Review.objects.create(full_name=full_name, rating=rating, text=text)
        stdout.write(f"Created review by {full_name}")


def seed_home_demo(stdout):
    categories = _ensure_categories(stdout)
    _ensure_courses(categories, stdout)
    _ensure_reviews(stdout)
