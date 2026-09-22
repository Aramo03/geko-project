import os
import subprocess
import re
import environ
from datetime import datetime
from django.core.management import BaseCommand
import shutil

# Инициализация environ
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))


environ.Env.read_env()

# Инициализация переменных окружения
env = environ.Env()

class Command(BaseCommand):
    help = 'Restore database and media files from a backup'

    def handle(self, *args, **kwargs):
        # Получаем значение поддомена из .env
        subdomain = env('SUBDOMAIN', default='default')

        # Путь для бэкапов: SUBDOMAIN/backups
        backup_dir = os.path.abspath(os.path.join(BASE_DIR, '..', '..', subdomain, 'backups'))

        # Получаем все папки в директории бэкапов, которые начинаются с числа и даты
        existing_backups = [f for f in os.listdir(backup_dir) if re.match(r'^\d+_\d{4}-\d{2}-\d{2}$', f)]

        if not existing_backups:
            self.stdout.write("No backups found.")
            return

        # Показываем список доступных бэкапов
        self.stdout.write("Available backups:")
        for idx, backup in enumerate(existing_backups, start=1):
            self.stdout.write(f"{idx}. {backup}")

        # Просим выбрать номер бэкапа для восстановления
        self.stdout.write("Enter the number of the backup to restore:")
        backup_number = input().strip()

        # Проверка на корректность ввода
        try:
            backup_number = int(backup_number)
            if backup_number < 1 or backup_number > len(existing_backups):
                raise ValueError
        except ValueError:
            self.stdout.write("Invalid backup number.")
            return

        # Получаем выбранный бэкап
        selected_backup = existing_backups[backup_number - 1]
        backup_folder = os.path.join(backup_dir, selected_backup)

        # Пути к файлам бэкапов
        db_backup_file = os.path.join(backup_folder, "db_backup.sql")
        media_backup_file = os.path.join(backup_folder, "media_backup.tar.gz")

        # Удаление активных сессий из базы данных перед её удалением
        self.stdout.write("Disconnecting all active sessions from the database...")
        try:
            subprocess.run(
                [
                    "psql", "-U", env('DB_USER'), "-h", env('DB_HOST'), "-p", env('DB_PORT'),
                    "-c", f"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '{env('DB_NAME')}' AND pid <> pg_backend_pid();"
                ],
                check=True,
                env={**os.environ, "PGPASSWORD": env('DB_PASSWORD')}
            )
        except subprocess.CalledProcessError as e:
            self.stdout.write(f"Error disconnecting sessions: {e}")
            return

        # Удаление базы данных
        self.stdout.write("Dropping existing database...")
        try:
            subprocess.run(
                ["psql", "-U", env('DB_USER'), "-h", env('DB_HOST'), "-p", env('DB_PORT'), "-c", f"DROP DATABASE IF EXISTS {env('DB_NAME')}"],
                check=True,
                env={**os.environ, "PGPASSWORD": env('DB_PASSWORD')}
            )
        except subprocess.CalledProcessError as e:
            self.stdout.write(f"Error during database deletion: {e}")
            return

        # Создание новой базы данных
        self.stdout.write(f"Creating database {env('DB_NAME')}...")
        try:
            subprocess.run(
                ["psql", "-U", env('DB_USER'), "-h", env('DB_HOST'), "-p", env('DB_PORT'), "-c", f"CREATE DATABASE {env('DB_NAME')}"],
                check=True,
                env={**os.environ, "PGPASSWORD": env('DB_PASSWORD')}
            )
        except subprocess.CalledProcessError as e:
            self.stdout.write(f"Error during database creation: {e}")
            return

        # Удаление медиа файлов
        self.stdout.write("Deleting media files...")
        media_dir = os.path.join(BASE_DIR, 'media')
        try:
            # Удаляем все файлы и папки в директории media
            for root, dirs, files in os.walk(media_dir, topdown=False):
                for name in files:
                    os.remove(os.path.join(root, name))
                for name in dirs:
                    shutil.rmtree(os.path.join(root, name))
        except Exception as e:
            self.stdout.write(f"Error during media files deletion: {e}")
            return

        # Восстановление базы данных
        self.stdout.write(f"Restoring database from {db_backup_file}...")
        try:
            with open(db_backup_file, "rb") as f:
                subprocess.run(
                    ["psql", "-U", env('DB_USER'), "-h", env('DB_HOST'), "-p", env('DB_PORT'), env('DB_NAME')],
                    input=f.read(),
                    check=True,
                    env={**os.environ, "PGPASSWORD": env('DB_PASSWORD')}
                )
        except subprocess.CalledProcessError as e:
            self.stdout.write(f"Error during database restore: {e}")
            return

        # Восстановление медиа файлов
        self.stdout.write(f"Restoring media files from {media_backup_file}...")
        try:
            subprocess.run(
                ["tar", "-xzvf", media_backup_file, "-C", media_dir],
                check=True
            )
        except subprocess.CalledProcessError as e:
            self.stdout.write(f"Error during media files restore: {e}")
            return

        self.stdout.write(f"Restore completed from {selected_backup}")
