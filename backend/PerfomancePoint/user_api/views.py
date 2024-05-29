from django.conf import settings

from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            clean_data = custom_validation(request.data)
            serializer = UserRegisterSerializer(data=clean_data)
            if serializer.is_valid():
                user = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({'error': e}, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    ##
    def post(self, request):
        try:
            data = request.data
            assert validate_email(data)
            assert validate_password(data)
            serializer = UserLoginSerializer(data=data)
            if serializer.is_valid(raise_exception=True):
                user = serializer.check_user(data)
                login(request, user)
                session_id = request.session.session_key
                response = Response({'session_id': session_id, **serializer.data}, status=status.HTTP_200_OK)
                return response
        except ValidationError as e:
            return Response({'error': e}, status=status.HTTP_400_BAD_REQUEST)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

    def put(self, request):
        try:
            user = request.user
            data = request.data

            # Обновление saved_statistic
            saved_statistic = data.get('saved_statistic')
            if saved_statistic is not None:
                user.saved_statistic = saved_statistic

            # Обновление пароля
            data_change_password = data.get('changePassword')

            if data_change_password['newPassword'] and data_change_password['currentPassword']:
                if check_password(data_change_password['currentPassword'], user.password):
                    user.set_password(data_change_password['newPassword'])
                else:
                    return Response({'error': 'Текущий пароль введен неверно'}, status=status.HTTP_400_BAD_REQUEST)

            user.save()  # Сохраняем изменения

            serializer = UserSerializer(request.user)
            return Response({'message': 'Данные успешно сохранены',
                             'user': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


CustomUser = get_user_model()


class ConfirmEmailView(APIView):
    permission_classes = (AllowAny,)  # Разрешаем доступ всем

    def post(self, request):
        email = request.data.get('email')
        if email:
            confirmation_key = get_random_string(length=32)  # Генерируем уникальный ключ подтверждения
            user, _ = CustomUser.objects.get_or_create(email=email)
            user.confirmation_key = confirmation_key
            user.save()

            # Отправляем письмо с подтверждением
            send_mail(
                'Подтверждение email',
                f'Для подтверждения email перейдите по ссылке: http://localhost:3000/confirm-email/{confirmation_key}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )

            return Response({'message': 'Письмо с подтверждением отправлено'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Не указан адрес электронной почты'}, status=status.HTTP_400_BAD_REQUEST)


class ConfirmEmailAPIView(APIView):
    permission_classes = (AllowAny,)  # Разрешаем доступ всем

    def post(self, request, confirmation_key):
        try:
            user = CustomUser.objects.get(confirmation_key=confirmation_key)
            user.confirm_email = True
            user.confirmation_key = None  # Удаляем ключ подтверждения
            user.save()
            return Response({'message': 'Email успешно подтвержден'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Неверный ключ подтверждения'}, status=status.HTTP_404_NOT_FOUND)
