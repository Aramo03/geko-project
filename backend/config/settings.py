from datetime import timedelta
from pathlib import Path

import environ
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, True),
    SECRET_KEY=(str, "dev-only-change-me"),
    ALLOWED_HOSTS=(list, ["localhost", "127.0.0.1"]),
)
env_file = BASE_DIR / ".env"
if env_file.exists():
    environ.Env.read_env(env_file)

SECRET_KEY = env("SECRET_KEY")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])  # type: ignore[arg-type]

# Production must never boot with a placeholder secret or a wildcard host.
# Local development is unaffected: these checks only run with DEBUG=False.
_PLACEHOLDER_SECRETS = {
    "",
    "dev-only-change-me",
    "change-me",
    "change-me-in-production",
    "change_me",
    "replace-with-a-long-random-secret-at-least-32-chars",
}
if not DEBUG:
    if SECRET_KEY in _PLACEHOLDER_SECRETS or len(SECRET_KEY) < 32:
        raise ImproperlyConfigured(
            "Set a real SECRET_KEY (at least 32 characters) in the environment "
            "before running with DEBUG=False. See .env.example."
        )
    if not ALLOWED_HOSTS or "*" in ALLOWED_HOSTS:
        raise ImproperlyConfigured(
            "Set ALLOWED_HOSTS to your domain(s) before running with "
            "DEBUG=False. See .env.example."
        )

INSTALLED_APPS = [
    "unfold",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",
    "drf_spectacular",
    "apps.accounts",
    "apps.main",
    "apps.courses",
    "apps.content",
    "apps.team",
    'apps.leads',
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    # Serves collectstatic output through gunicorn (DEBUG=False has no
    # runserver static/media helpers).
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

# PostgreSQL is the default so a fresh checkout connects to Postgres,
# not a leftover SQLite file. SQLite is used only when DB_ENGINE says so.
db_engine = env.str("DB_ENGINE", default="django.db.backends.postgresql")
db_name = env.str("DB_NAME", default="geko_db")
assert db_engine is not None
if db_engine.endswith("sqlite3"):
    DATABASES = {
        "default": {
            "ENGINE": db_engine,
            "NAME": BASE_DIR / db_name,
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": db_engine,
            "NAME": db_name,
            "USER": env.str("DB_USER", default="postgres"),
            "PASSWORD": env.str("DB_PASSWORD", default=""),
            "HOST": env.str("DB_HOST", default="localhost"),
            "PORT": env.str("DB_PORT", default="5432"),
        }
    }
    if not DEBUG and DATABASES["default"]["PASSWORD"] in {
        "",
        "change_me",
        "change-me",
        "replace-with-a-strong-database-password",
    }:
        raise ImproperlyConfigured(
            "Set a real DB_PASSWORD in the environment before running with "
            "DEBUG=False. See .env.example."
        )

AUTH_USER_MODEL = "accounts.User"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Yerevan"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Origins are env-driven so the production domain is config, not code.
# Comma-separated in .env; the defaults keep local development working.
_DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:5173",
]
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS", default=_DEFAULT_ORIGINS)
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=_DEFAULT_ORIGINS)

# Caddy (or any TLS proxy) terminates HTTPS and forwards plain HTTP.
# Django then still sees the original https scheme for admin and CSRF.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=4),
}

SPECTACULAR_SETTINGS = {
    "TITLE": "GEKO API",
    "DESCRIPTION": "Student skeleton — fill routers, serializers, comments.",
    "VERSION": "0.1.0",
}

EMAIL_BACKEND = env.str("EMAIL_BACKEND", default="django.core.mail.backends.console.EmailBackend")
EMAIL_HOST = env.str("EMAIL_HOST", default="smtp.example.com")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS", default=True)
EMAIL_HOST_USER = env.str("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = env.str("EMAIL_HOST_PASSWORD", default="")
DEFAULT_FROM_EMAIL = env.str("DEFAULT_FROM_EMAIL", default="GEKO <noreply@example.com>")

UNFOLD = {
    "SITE_TITLE": "GEKO Admin",
    "SITE_HEADER": "GEKO",
}
