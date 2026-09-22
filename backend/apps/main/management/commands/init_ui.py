# TODO (student wave — models): re-enable after Language and UIBlock models exist.
#
# Seeds am/en/ru languages and default UIBlock keys (header, hero, footer, contacts_bar).
# See docs/backend.md — superuser runs this from terminal only.

from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Seed languages and UI blocks — disabled until models are implemented."

    def handle(self, *args, **options):
        raise CommandError(
            "Implement Language and UIBlock first, then restore this command (see TASK.md)."
        )
