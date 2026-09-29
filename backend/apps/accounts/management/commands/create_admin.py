from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

User = get_user_model()


class Command(BaseCommand):
    help = "Create staff admin (role=admin). Terminal only."

    def add_arguments(self, parser):
        parser.add_argument("email", type=str, help="Admin email")
        parser.add_argument("password", type=str, help="Admin password")

    def handle(self, *args, **options):
        email = options["email"]
        password = options["password"]

        if User.objects.filter(email=email).exists():
            raise CommandError(f"User with email '{email}' already exists.")

        User.objects.create_user(email, password, role="admin")
        self.stdout.write(self.style.SUCCESS(f"Successfully created admin user: {email}"))
