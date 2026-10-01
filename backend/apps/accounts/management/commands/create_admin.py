import getpass

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError
from django.core.validators import validate_email

User = get_user_model()


class Command(BaseCommand):
    help = "Create staff admin (role=admin). Terminal only."

    def add_arguments(self, parser):
        parser.add_argument("email", nargs="?", type=str, help="Admin email")
        parser.add_argument("password", nargs="?", type=str, help="Admin password")

    def handle(self, *args, **options):
        email = (options.get("email") or "").strip()
        password = options.get("password") or ""

        if not email:
            email = input("Email: ").strip()
        if not email:
            raise CommandError("Email cannot be blank.")

        try:
            validate_email(email)
        except ValidationError:
            raise CommandError("Enter a valid email address.")

        if not password:
            password = getpass.getpass("Password: ")
        if not password:
            raise CommandError("Password cannot be blank.")

        if User.objects.filter(email=email).exists():
            raise CommandError(f"User with email '{email}' already exists.")

        try:
            validate_password(password, user=User(email=email, role="admin"))
        except ValidationError as exc:
            raise CommandError("\n".join(exc.messages))

        User.objects.create_user(email, password, role="admin")
        self.stdout.write(self.style.SUCCESS(f"Successfully created admin user: {email}"))
