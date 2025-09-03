# backend/users/urls.py
from django.urls import path
from .views import RegisterView ,MeView ,AlumniListView ,UserDetailView, MentorRecommendationView,PendingUsersListView, ApproveUserView, InstitutionPendingUsersView
urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me/', MeView.as_view(), name='auth_me'),
    # --- ADD THIS NEW LINE ---
    path('alumni/', AlumniListView.as_view(), name='alumni_list'),
    path('mentors/recommend/', MentorRecommendationView.as_view(), name='mentor_recommend'),
    path('pending/', PendingUsersListView.as_view(), name='pending_users'), # <-- ADD THIS
    path('institution-pending/', InstitutionPendingUsersView.as_view(), name='institution_pending_users'),
    path('<int:pk>/approve/', ApproveUserView.as_view(), name='approve_user'),
    # --- ADD THIS NEW DYNAMIC LINE ---
    path('<int:pk>/', UserDetailView.as_view(), name='user_detail'),
]