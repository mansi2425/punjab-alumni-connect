from django.urls import path
from .views import (
    InstitutionApplicationView, 
    PendingInstitutionsListView, 
    ApproveInstitutionView,
    RejectInstitutionView,
    PlatformAnalyticsView ,
    ApprovedInstitutionsListView, # <-- Import new view
    InstitutionDetailView,
    InstitutionAnalyticsView
)

urlpatterns = [
    path('apply/', InstitutionApplicationView.as_view(), name='institution-apply'),
    path('pending/', PendingInstitutionsListView.as_view(), name='pending-institutions'),
    path('approved/', ApprovedInstitutionsListView.as_view(), name='approved-institutions'),
    path('analytics/', PlatformAnalyticsView.as_view(), name='platform-analytics'),
    path('my-institution/analytics/', InstitutionAnalyticsView.as_view(), name='institution-analytics'),
    
    # --- UPDATED URLS ---
    path('<int:pk>/', InstitutionDetailView.as_view(), name='institution-detail'),
    path('<int:pk>/approve/', ApproveInstitutionView.as_view(), name='approve-institution'),
    path('<int:pk>/reject/', RejectInstitutionView.as_view(), name='reject-institution'), # <-- Add the new URL
]