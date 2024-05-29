import os
import ssl

import django

# Установка настроек Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PerfomancePoint.settings')
django.setup()

# После установки настроек Django, импортируем настройки электронной почты
from django.conf import settings
from django.core.mail import send_mail

# Отправляем письмо, используя настройки из settings.py

send_mail(
    'Тема письма',
    'Текст письма.',
    settings.EMAIL_HOST_USER,  # Используем переменную из settings.py
    ['anton.gavrilov.1673@mail.ru'],
    fail_silently=False,
)
