# backend/events/serializers.py
from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    # This field will send the organizer's username for display purposes
    organizer_username = serializers.CharField(source='organizer.username', read_only=True)
    
    class Meta:
        model = Event
        # --- THIS IS THE KEY FIX ---
        # We must include 'organizer' in the list of fields to be sent.
        # By default, for a ForeignKey, this will send the organizer's ID number.
        fields = ['id', 'title', 'description', 'start_time', 'end_time', 'location', 'organizer', 'organizer_username']
        # --- END OF FIX ---
        
        # This prevents a user from assigning an event to someone else when creating it.
        # The organizer is set automatically in the view.
        read_only_fields = ['organizer']