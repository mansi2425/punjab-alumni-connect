from rest_framework import serializers
from .models import MentorshipRequest, ConnectionInfo
from users.serializers import UserSerializer

class MentorshipRequestSerializer(serializers.ModelSerializer):
    # This serializer is now correct and handles both reading and writing.
    requester = UserSerializer(read_only=True)
    mentor = UserSerializer(read_only=True)
    mentor_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = MentorshipRequest
        fields = ['id', 'requester', 'mentor', 'mentor_id', 'initial_message', 'status', 'created_at']

# --- THIS IS THE DEFINITIVE FIX ---
# We are replacing the old, complex serializer with this more direct one.
class ConnectionDetailSerializer(serializers.ModelSerializer):
    """
    A simpler, more robust serializer for showing an established connection.
    It directly includes the full details of the request, which contains both users.
    """
    # This line tells the serializer to include all the data from the related
    # MentorshipRequest, which we already know works perfectly.
    request = MentorshipRequestSerializer(read_only=True)

    class Meta:
        model = ConnectionInfo
        fields = ['id', 'shared_contact_info', 'shared_message', 'request']
# --- END OF FIX ---