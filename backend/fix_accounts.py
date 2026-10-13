from django.db import connection, transaction

tables = [
    "accounts_user_groups",
    "accounts_user_user_permissions",
    "accounts_user",
]

with transaction.atomic():
    with connection.cursor() as cursor:
        for table in tables:
            cursor.execute(f'SELECT COUNT(*) FROM "{table}"')
            if cursor.fetchone()[0] != 0:
                raise RuntimeError(f"{table} is not empty")

        cursor.execute("SELECT COUNT(*) FROM django_admin_log")
        if cursor.fetchone()[0] != 0:
            raise RuntimeError("django_admin_log is not empty")

        cursor.execute("PRAGMA foreign_key_check")
        if cursor.fetchall():
            raise RuntimeError("Database has foreign key errors")

        for table in tables:
            cursor.execute(f'DROP TABLE "{table}"')

        cursor.execute(
            "DELETE FROM django_migrations WHERE app = 'accounts'"
        )

print("Accounts tables reset successfully")