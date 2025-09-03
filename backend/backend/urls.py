"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# backend/backend/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Our users app's URLs (for registration)
    path('api/users/', include('users.urls')),
    path('api/events/', include('events.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/chatbot/', include('chatbot.urls')),
    path('api/mentorship/', include('mentorship.urls')),
    path('api/institutions/', include('institutions.urls')),
    # NEW: JWT Token Endpoints
    # This URL is where the frontend will send the username and password to get a token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # This URL is to get a new access token using a refresh token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
