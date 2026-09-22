import os
import subprocess
from django.core.management.base import BaseCommand
from datetime import datetime
import environ
import re  # Для работы с регулярными выражениями

# Инициализация environ
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
environ.Env.read_env()

# Инициализация переменных окружения
env = environ.Env()


class Command(BaseCommand):
    help = 'Create a backup of the database and media files'

    def handle(self, *args, **kwargs):
        # Получаем значение поддомена из .env
        subdomain = env('SUBDOMAIN', default='default')

        # Путь для бэкапов: SUBDOMAIN/backups
        backup_dir = os.path.abspath(os.path.join(BASE_DIR, '..', '..', subdomain, 'backups'))
        media_dir = os.path.join(BASE_DIR, 'media')  # Директория с медиа-файлами

        # Создание директории для бэкапов, если её нет
        os.makedirs(backup_dir, exist_ok=True)

        # Получаем все папки в директории бэкапов, которые начинаются с числа и даты
        existing_backups = [f for f in os.listdir(backup_dir) if re.match(r'^\d+_\d{4}-\d{2}-\d{2}$', f)]

        # Если бэкапы уже есть, находим максимальный номер
        if existing_backups:
            # Извлекаем числа из имен папок и находим максимальный номер
            backup_numbers = [int(f.split('_')[0]) for f in existing_backups]
            backup_number = max(backup_numbers) + 1
        else:
            # Если нет бэкапов, начинаем с 1
            backup_number = 1

        # Дата создания
        date_folder = datetime.now().strftime("%Y-%m-%d")

        # Путь для новой папки с бэкапом
        backup_folder = os.path.join(backup_dir, f"{backup_number}_{date_folder}")
        os.makedirs(backup_folder, exist_ok=True)

        # Форматирование имен файлов для базы данных и медиа
        db_backup_file = os.path.join(backup_folder, "db_backup.sql")
        media_backup_file = os.path.join(backup_folder, "media_backup.tar.gz")

        # Бэкап базы данных
        self.stdout.write("Backing up the database...")
        try:
            subprocess.run(
                ["pg_dump", "-U", env('DB_USER'), "-h", env('DB_HOST'), "-p", env('DB_PORT'), env('DB_NAME')],
                stdout=open(db_backup_file, "w"),
                check=True,
                env={**os.environ, "PGPASSWORD": env('DB_PASSWORD')}
            )
        except subprocess.CalledProcessError as e:
            self.stdout.write(f"Error during database backup: {e}")
            return

        # Бэкап медиа файлов
        self.stdout.write("Backing up media files...")
        try:
            subprocess.run(
                ["tar", "-czvf", media_backup_file, "-C", media_dir, "."],
                check=True,
                env={**os.environ, "PGPASSWORD": env('DB_PASSWORD')}
            )
        except subprocess.CalledProcessError as e:
            self.stdout.write(f"Error during media files backup: {e}")
            return

        self.stdout.write(f"Backup completed! Files saved to {backup_folder}")
        self.stdout.write(f"Database backup file: {db_backup_file}")
        self.stdout.write(f"Media backup file: {media_backup_file}")
