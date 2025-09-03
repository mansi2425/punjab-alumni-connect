from django.shortcuts import render

# Create your views here.
# backend/events/views.py
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Event
from .serializers import EventSerializer
from .permissions import IsOrganizerOrReadOnly, CanCreateEventsPermission

class EventListCreateView(generics.ListCreateAPIView):
    """
    Allows authenticated users to see a list of all events.
    Allows authenticated users to create a new event.
    """
    queryset = Event.objects.all().order_by('start_time') # Show upcoming events first
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, CanCreateEventsPermission]
    # When a new event is created, automatically set the organizer to the current user
    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles retrieving (GET), updating (PUT/PATCH), and deleting (DELETE)
    a single event instance.
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated, IsOrganizerOrReadOnly]
    # In a real app, we would add a custom permission here to ensure
    # only the organizer of the event can edit or delete it.