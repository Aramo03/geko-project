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

DEFAULT_PAYLOADS = {
    "header": {
        "logo": "/images/logo.webp",
        "button_link": "/contacts",
    },
    "hero": {
        "title": {
            "am": "GEKO",
            "en": "GEKO",
            "ru": "GEKO",
        },
        "text": {
            "am": "Ժամանակակից տեխնիկական գիտությունների և վերլուծության գործնական ուղիներ։",
            "en": "Practical pathways for modern technical sciences and analytics.",
            "ru": "Практические направления современных технических наук и аналитики.",
        },
    },
    "footer": {
        "phone": "+374 00 000000",
        "email": "info@geko.am",
        "address": "Yerevan, Armenia",
        "map": "https://maps.google.com/",
    },
    "contacts_bar": {
        "phone": "+374XXXXXXXX",
        "email": "info@example.com",
    },
}


def is_empty_payload(payload):
    return payload in (None, {}, [])


class Command(BaseCommand):
    help = "Seed languages (am, en, ru) and UI blocks (header, hero, footer, contacts_bar)."

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

            if is_empty_payload(block.payload):
                block.payload = payload
                block.save(update_fields=["payload"])
                self.stdout.write(f"Filled empty UI block {key}")
            else:
                self.stdout.write(f"UI block {key} already exists")
