import os
import subprocess
import sys
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent
PYTHON = sys.executable
MANAGE_PY = PROJECT_DIR / 'manage.py'


def run_manage(*args):
    env = os.environ.copy()
    env.setdefault('DJANGO_SETTINGS_MODULE', 'geko.settings')
    subprocess.run(
        [PYTHON, str(MANAGE_PY), *args],
        cwd=PROJECT_DIR,
        env=env,
        check=True,
    )


def set_admin_password():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'geko.settings')
    import django

    django.setup()
    from django.contrib.auth.models import User

    user = User.objects.get(username='admin')
    user.set_password('admin')
    user.save()


def main():
    run_manage('makemigrations')
    run_manage('migrate')
    run_manage(
        'createsuperuser',
        '--email=admin@gmail.com',
        '--username=admin',
        '--noinput',
    )
    set_admin_password()


if __name__ == '__main__':
    main()
