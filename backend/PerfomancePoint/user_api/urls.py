from django.urls import path
from . import views

app_name = 'user_api'

urlpatterns = [
	path('register', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
	path('confirm-email/', views.ConfirmEmailView.as_view(), name='confirm_email'),
	path('confirm-email/<str:confirmation_key>/', views.ConfirmEmailAPIView.as_view(), name='confirm_email_api'),
]