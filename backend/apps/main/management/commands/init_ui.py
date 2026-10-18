from django.core.management.base import BaseCommand

from apps.main.management.commands.seed_home_demo import seed_home_demo
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

# Factual contact data and URLs only (no UI copy). Translatable strings live in frontend i18n.
CONTACT_PHONE = "(+374) 98 03 33 94"
CONTACT_EMAIL = "gekoeducation1@gmail.com"
MAP_URL = "https://www.google.com/maps/search/?api=1&query=40.189774,44.522213"

DEFAULT_PAYLOADS = {
    "header": {
        "logo": "/images/logo.webp",
        "button_link": "/contacts",
    },
    # Hero copy is UI translation (frontend i18n `home.hero*`), not content
    # translation, so it is not duplicated here. The payload seeds only the
    # media/CTA slot data that HeroMedia renders on Home.
    "hero": {
        "poster": "/images/mainLoad.webp",
        "video_webm": "/videos/main.webm",
        "video_mp4": "/videos/main2.mp4",
        "button_link": "/contacts",
    },
    "footer": {
        "phone": CONTACT_PHONE,
        "email": CONTACT_EMAIL,
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


def is_empty_payload(payload):
    return payload in (None, {}, [])


class Command(BaseCommand):
    help = (
        "Seed languages, UI blocks, and demo content "
        "(courses, reviews, completed event, free lesson)."
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

            if is_empty_payload(block.payload):
                block.payload = payload
                block.save(update_fields=["payload"])
                self.stdout.write(f"Filled empty UI block {key}")
            else:
                self.stdout.write(f"UI block {key} already exists")

        seed_home_demo(self.stdout)
