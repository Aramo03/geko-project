from django.core.management.base import BaseCommand

from apps.main.models import Language
from apps.UI.models import UIBlock


class Command(BaseCommand):
    help = "Initialize default UI blocks"

    def handle(self, *args, **options):
        languages = [
            ("am", "Armenian"),
            ("en", "English"),
            ("ru", "Russian"),
        ]

        for code, name in languages:
            Language.objects.get_or_create(
                code=code,
                defaults={"name": name},
            )

        blocks = [
            ("header", "global", 1),
            ("hero", "home", 2),
            ("footer", "global", 3),
            ("contacts_bar", "global", 4),
        ]

        for key, section, order in blocks:
            UIBlock.objects.get_or_create(
                key=key,
                defaults={
                    "section": section,
                    "payload": {},
                    "order": order,
                    "is_visible": True,
                },
            )

        self.stdout.write(
            self.style.SUCCESS("UI initialized successfully.")
        )