from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

UserModel = get_user_model()


def custom_validation(data):
    email = data['email'].strip()
    username = data['username'].strip()
    password = data['password'].strip()
    ##
    if not email or UserModel.objects.filter(email=email).exists():
        raise ValidationError('Пользователь с таким email уже существует.')
        ##
    if not password or len(password) < 8:
        raise ValidationError('Пароль должен содержать минимум 8 символов.')
        ##
    if not username:
        raise ValidationError('Некорректное имя пользователя.')
    return data


def validate_email(data):
    email = data['email'].strip()
    if not email:
        raise ValidationError('Email не найден.')
    return True


def validate_username(data):
    username = data['username'].strip()
    if not username:
        raise ValidationError('Выберите другое имя пользователя.')
    return True


def validate_password(data):
    password = data['password'].strip()
    if not password:
        raise ValidationError('Необходимо ввести пароль.')
    return True
