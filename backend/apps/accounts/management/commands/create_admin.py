from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create a staff admin user (role=admin). Terminal only."

    def add_arguments(self, parser):
        parser.add_argument("--email", required=True)
        parser.add_argument("--password", required=True)
        parser.add_argument("--first-name", default="")
        parser.add_argument("--last-name", default="")

    def handle(self, *args, **options):
        User = get_user_model()
        email = options["email"]
        if User.objects.filter(email=email).exists():
            raise CommandError(f"User {email} already exists")
        user = User.objects.create_user(
            email=email,
            password=options["password"],
            first_name=options["first_name"],
            last_name=options["last_name"],
            role=User.Role.ADMIN,
            is_staff=True,
            is_active=True,
        )
        self.stdout.write(self.style.SUCCESS(f"Admin created: {user.email}"))
