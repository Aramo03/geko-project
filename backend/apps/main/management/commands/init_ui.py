from django.core.management.base import BaseCommand

from apps.main.models import Language, UIBlock

LANGUAGES = (
    ("am", "Armenian"),
    ("en", "English"),
    ("ru", "Russian"),
)

UI_BLOCKS = (
    ("header", "header", 0),
    ("hero", "hero", 1),
    ("footer", "footer", 2),
    ("contacts_bar", "contacts_bar", 3),
)

# Default shell. Every `init_ui` run writes header, hero, footer, and the
# contacts bar back to these payloads. Courses, team, reviews, and events
# are not created.
CONTACT_PHONE = "(+374) 98 03 33 94"
CONTACT_EMAIL = "gekoeducation1@gmail.com"
MAP_URL = "https://www.google.com/maps/search/?api=1&query=40.189774,44.522213"

DEFAULT_PAYLOADS = {
    "header": {
        "logo": "/images/logo.webp",
        "button_link": "/contacts",
        "phone": CONTACT_PHONE,
        "email": CONTACT_EMAIL,
    },
    "hero": {
        "kicker": {
            "am": "GEKO Education",
            "en": "GEKO Education",
            "ru": "GEKO Education",
        },
        "title": {
            "am": "GEKO",
            "en": "GEKO",
            "ru": "GEKO",
        },
        "text": {
            "am": "Ժամանակակից տեխնիկական գիտությունների և վերլուծության գործնական ուղիներ։",
            "en": "Practical pathways for modern technical sciences and analytics",
            "ru": "Практические направления современных технических наук и аналитики.",
        },
        "cta": {
            "am": "Գրանցվել",
            "en": "Enroll now",
            "ru": "Записаться",
        },
        "poster": "/images/mainLoad.webp",
        "video_webm": "/videos/main.webm",
        "video_mp4": "/videos/main2.mp4",
        "button_link": "/contacts",
    },
    "footer": {
        "phone": CONTACT_PHONE,
        "email": CONTACT_EMAIL,
        "address": {
            "am": "Երևան, Հայաստան — GEKO Education",
            "en": "Yerevan, Armenia — GEKO Education campus",
            "ru": "Ереван, Армения — кампус GEKO Education",
        },
        "description": {
            "am": "Ժամանակակից տեխնիկական գիտությունների և վերլուծության հիմքերի գործնական թվային ուղիներ։",
            "en": "Providing holistic and practical digital pathways for modern technical sciences and analytics foundations.",
            "ru": "Практические цифровые направления для современных технических наук и основ аналитики.",
        },
        "map": MAP_URL,
        "facebook": "https://www.facebook.com/GekoOnlineEducation/",
        "instagram": "https://www.instagram.com/geko_education",
        "linkedin": "https://www.linkedin.com/company/geko-education",
    },
    "contacts_bar": {
        "phone": CONTACT_PHONE,
        "email": CONTACT_EMAIL,
    },
}


class Command(BaseCommand):
    help = (
        "Seed languages am/en/ru and restore the default header, hero, "
        "footer, and contacts bar. Does not insert content rows."
    )

    def handle(self, *args, **options):
        for code, name in LANGUAGES:
            _, created = Language.objects.get_or_create(
                code=code,
                defaults={"name": name},
            )
            if created:
                self.stdout.write(f"Created language {code}")
            else:
                self.stdout.write(f"Language {code} already exists")

        for key, section, order in UI_BLOCKS:
            payload = DEFAULT_PAYLOADS[key]
            block, created = UIBlock.objects.get_or_create(
                key=key,
                defaults={
                    "section": section,
                    "payload": payload,
                    "order": order,
                    "is_visible": True,
                },
            )
            if created:
                self.stdout.write(f"Created UI block {key}")
                continue

            block.section = section
            block.order = order
            block.is_visible = True
            block.payload = payload
            block.save(update_fields=["section", "order", "is_visible", "payload"])
            self.stdout.write(f"Restored default UI block {key}")
