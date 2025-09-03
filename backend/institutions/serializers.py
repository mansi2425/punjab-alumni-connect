from rest_framework import serializers
from .models import Institution

# This serializer is for the public application form. It is unchanged.
class InstitutionApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ['id', 'name', 'address', 'contact_person', 'contact_email', 'contact_phone']

# --- THIS IS THE NEW, FULL SERIALIZER FOR ADMINS ---
class InstitutionSerializer(serializers.ModelSerializer):
    """
    A full serializer for viewing and updating existing institutions.
    """
    class Meta:
        model = Institution
        # Includes all fields, including the status
        fields = ['id', 'name', 'address', 'contact_person', 'contact_email', 'contact_phone', 'status', 'created_at']