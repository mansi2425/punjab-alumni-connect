from django.urls import path
from .views import MentorshipRequestListCreateView, RespondToRequestView,ConnectionListView

urlpatterns = [
    # URL for listing and creating requests: /api/mentorship/requests/
    path('requests/', MentorshipRequestListCreateView.as_view(), name='mentorship-requests'),
    
    # URL for responding to a specific request: /api/mentorship/requests/5/respond/
    path('requests/<int:pk>/respond/', RespondToRequestView.as_view(), name='respond-to-request'),
    path('connections/', ConnectionListView.as_view(), name='mentorship-connections'),
]