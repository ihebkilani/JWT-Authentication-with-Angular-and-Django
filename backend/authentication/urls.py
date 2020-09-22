from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import RegisterView, LoginView, LogoutView, UserView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user/<int:id>', UserView.as_view()),
    path('logout', LogoutView.as_view()),
    path('token', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),

]