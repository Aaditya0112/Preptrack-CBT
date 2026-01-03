from decouple import config
import os
from pathlib import Path
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = config('SECRET_KEY', default='replace-this-with-a-secure-secret')

DEBUG = config('DEBUG', cast=bool, default=True)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'accounts',
    'assessments',
    'performance',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backendWithAuth.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backendWithAuth.wsgi.application'

# Use DATABASE_URL from Render if available, else fallback to local config

DATABASES = {
    # 'default': {
    #     "ENGINE": "django.db.backends.postgresql",
    #     "NAME": "preptrack_db_final",
    #     "USER": config('DATABASE_USER'),
    #     "PASSWORD": config('DATABASE_PASSWORD'),
    #     "HOST": "localhost",
    #     "PORT": config('DATABASE_PORT', cast=int),
    # }, 

    'default': dj_database_url.config(default=config('DATABASE_URL'), conn_max_age=600),

    # 'old': {
    #     "ENGINE": "django.db.backends.postgresql",
    #     "NAME": "preptrack_db2",
    #     "USER": config('DATABASE_USER'),
    #     "PASSWORD": config('DATABASE_PASSWORD'),
    #     "HOST": "localhost",
    #     "PORT": config('DATABASE_PORT', cast=int),
    # }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
OLD_MEDIA_ROOT = r"C:\Users\rajaa\OneDrive\Desktop\IIT K\Intern-Preptrack\Preptrack-CBT\backend\media"

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'accounts.User'

from datetime import timedelta

# Parse CORS origins from env var (comma-separated)
_cors_origins = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:5173,http://127.0.0.1:5173',
    cast=lambda x: [origin.strip() for origin in x.split(',')]
)
CORS_ALLOWED_ORIGINS = _cors_origins
CORS_ALLOW_CREDENTIALS = True

# Parse CSRF origins from env var (comma-separated)
_csrf_origins = config(
    'CSRF_TRUSTED_ORIGINS',
    default='http://localhost:5173,http://127.0.0.1:5173',
    cast=lambda x: [origin.strip() for origin in x.split(',')]
)
CSRF_TRUSTED_ORIGINS = _csrf_origins

ACCESS_TOKEN_COOKIE_NAME = 'access'
REFRESH_TOKEN_COOKIE_NAME = 'refresh'
COOKIE_SECURE = config('COOKIE_SECURE', default=False, cast=bool)
COOKIE_SAMESITE = config('COOKIE_SAMESITE', default='Lax')

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'accounts.authentication.CookieJWTAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    # Adjust these to your needs; examples below are per-day.
    'DEFAULT_THROTTLE_RATES': {
        'anon': '200/day',
        'user': '1000/day',
    },
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    # rotate refresh tokens on use and blacklist old ones
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
