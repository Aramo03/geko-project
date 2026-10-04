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
            _, created = UIBlock.objects.get_or_create(
                key=key,
                defaults={
                    "section": section,
                    "payload": {},
                    "order": order,
                    "is_visible": True,
                },
            )
            if created:
                self.stdout.write(f"Created UI block {key}")
            else:
                self.stdout.write(f"UI block {key} already exists")
