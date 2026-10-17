"""Idempotent demo category, flagship course, team, and parent reviews for Home UI."""

from apps.courses.models import PopularCourse, PopularCourseTranslation
from apps.main.models import Category, CategoryTranslation, Language, Review
from apps.team.models import Team, TeamTranslation

FLAGSHIP_EN_TITLE = "Full-Stack Program"

LEGACY_SPLIT_COURSE_TITLES = (
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Python",
    "Django",
    "Deployment",
    "AI",
)

CATEGORY_SEED = (
    (
        "computer_science",
        {
            "en": "Computer Science",
            "am": "Համակարգչային գիտություն",
            "ru": "Компьютерные науки",
        },
    ),
)

FLAGSHIP_DESCRIPTION = {
    "en": (
        FLAGSHIP_EN_TITLE,
        "One integrated track: HTML, CSS, JavaScript, React, Python, Django, deployment, and AI. "
        "Build real projects from markup to production with mentor review at each milestone.",
    ),
    "am": (
        "Full-Stack ծրագիր",
        "Միասին ուղի՝ HTML, CSS, JavaScript, React, Python, Django, deployment և AI. "
        "Իրական նախագծեր մենթորի աջակցությամբ։",
    ),
    "ru": (
        "Full-Stack программа",
        "Единый трек: HTML, CSS, JavaScript, React, Python, Django, deployment и AI. "
        "Реальные проекты с наставником на каждом этапе.",
    ),
}

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

TEAM_SEED = (
    (
        "Aram Khalatryan",
        {
            "en": (
                "Aram Khalatryan",
                "Instructor",
                "Full-stack mentor: HTML, CSS, JavaScript, React, Python, Django, deployment, and AI.",
            ),
            "am": (
                "Արամ Խալաթրյան",
                "Դասախոս",
                "Full-stack մենթոր՝ HTML-ից մինչև AI և deployment։",
            ),
            "ru": (
                "Арам Халатрян",
                "Преподаватель",
                "Full-stack наставник: HTML, CSS, JavaScript, React, Python, Django, deployment и AI.",
            ),
        },
    ),
)


def _lang(code):
    return Language.objects.get(code=code)


def _find_course_by_en_title(title):
    return PopularCourse.objects.filter(
        translations__language__code="en",
        translations__title=title,
    ).first()


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


def _prune_legacy_split_courses(stdout):
    removed = 0
    for title in LEGACY_SPLIT_COURSE_TITLES:
        course = _find_course_by_en_title(title)
        if not course:
            continue
        course.delete()
        removed += 1
        stdout.write(f"Removed legacy demo course {title}")
    return removed


def _ensure_flagship_course(categories, stdout):
    category = categories["computer_science"]
    course = _find_course_by_en_title(FLAGSHIP_EN_TITLE)

    if not course:
        course = PopularCourse.objects.create(
            category=category,
            order=1,
            image_url="",
        )
        for code, (title, description) in FLAGSHIP_DESCRIPTION.items():
            PopularCourseTranslation.objects.create(
                popular_course=course,
                language=_lang(code),
                title=title,
                description=description,
            )
        stdout.write(f"Created flagship course {FLAGSHIP_EN_TITLE}")
        return

    course.category = category
    course.order = 1
    course.save(update_fields=["category", "order"])

    for code, (title, description) in FLAGSHIP_DESCRIPTION.items():
        translation = course.translations.filter(language__code=code).first()
        if translation:
            translation.title = title
            translation.description = description
            translation.save(update_fields=["title", "description"])
        else:
            PopularCourseTranslation.objects.create(
                popular_course=course,
                language=_lang(code),
                title=title,
                description=description,
            )
    stdout.write(f"Updated flagship course {FLAGSHIP_EN_TITLE}")


def _ensure_team(stdout):
    for _key, translations in TEAM_SEED:
        en_name = translations["en"][0]
        member = Team.objects.filter(
            translations__language__code="en",
            translations__name=en_name,
        ).first()
        if not member:
            member = Team.objects.create(order=1, image_url="")
            stdout.write(f"Created team member {en_name}")
        else:
            member.order = 1
            member.save(update_fields=["order"])

        for code, (name, role, desc) in translations.items():
            translation = member.translations.filter(language__code=code).first()
            if translation:
                translation.name = name
                translation.role = role
                translation.desc = desc
                translation.save(update_fields=["name", "role", "desc"])
            else:
                TeamTranslation.objects.create(
                    team=member,
                    language=_lang(code),
                    name=name,
                    role=role,
                    desc=desc,
                )


def _ensure_reviews(stdout):
    for full_name, rating, text in REVIEW_SEED:
        if Review.objects.filter(full_name=full_name, text=text).exists():
            continue
        Review.objects.create(full_name=full_name, rating=rating, text=text)
        stdout.write(f"Created review by {full_name}")


def seed_home_demo(stdout):
    categories = _ensure_categories(stdout)
    _prune_legacy_split_courses(stdout)
    _ensure_flagship_course(categories, stdout)
    _ensure_team(stdout)
    _ensure_reviews(stdout)
