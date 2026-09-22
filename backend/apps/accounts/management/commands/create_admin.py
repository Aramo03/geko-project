# TODO (student wave — models): re-enable after User model + UserManager exist.
#
# from django.core.management.base import BaseCommand, CommandError
# from django.contrib.auth import get_user_model
#
# class Command(BaseCommand):
#     help = "Create staff admin (role=admin). Terminal only."
#     ...

from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create admin user — disabled until User model is implemented."

    def handle(self, *args, **options):
        raise CommandError(
            "Implement accounts.User and UserManager first, then restore this command (see TASK.md)."
        )
