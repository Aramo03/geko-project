from django.core.management.base import BaseCommand

from apps.main.models import Language, UIBlock

DEFAULT_BLOCKS = [
    {
        "key": "header",
        "section": "header",
        "order": 10,
        "payload": {
            "phone": "+374 98 03 33 94",
            "phone_alt": "+374 98 03 33 94",
            "email": "gekoeducation@gmail.com",
        },
    },
    {
        "key": "hero",
        "section": "home",
        "order": 20,
        "payload": {
            "title_am": "",
            "title_en": "A FREE TRIAL CLASS REGISTRATION",
            "title_ru": "",
            "video": "/videos/main.webm",
        },
    },
    {
        "key": "footer",
        "section": "footer",
        "order": 30,
        "payload": {"map_embed": "", "socials": []},
    },
    {
        "key": "contacts_bar",
        "section": "contacts",
        "order": 40,
        "payload": {},
    },
]

DEFAULT_LANGUAGES = (
    ("am", "Armenian"),
    ("en", "English"),
    ("ru", "Russian"),
)


class Command(BaseCommand):
    help = "Create UIBlock slots and seed am/en/ru. Safe to run again."

    def handle(self, *args, **options):
        for code, name in DEFAULT_LANGUAGES:
            Language.objects.get_or_create(code=code, defaults={"name": name})
        created = 0
        for block in DEFAULT_BLOCKS:
            _, was_created = UIBlock.objects.get_or_create(
                key=block["key"],
                defaults={
                    "section": block["section"],
                    "order": block["order"],
                    "payload": block["payload"],
                    "is_visible": True,
                },
            )
            if was_created:
                created += 1
        self.stdout.write(self.style.SUCCESS(f"UI ready. New blocks: {created}"))
