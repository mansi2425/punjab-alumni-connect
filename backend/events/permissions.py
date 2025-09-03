# backend/events/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOrganizerOrReadOnly(BasePermission):
    """
    Object-level permission to only allow organizers of an event to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.organizer == request.user

# --- ADD THIS NEW PERMISSION CLASS ---
class CanCreateEventsPermission(BasePermission):
    """
    Global permission to check if a user has a role that is allowed
    to create events (POST requests).
    """
    def has_permission(self, request, view):
        # Allow GET, HEAD, OPTIONS requests for any authenticated user
        if request.method in SAFE_METHODS:
            return True
        
        # Deny POST requests for users with the 'student' role
        if request.method == 'POST' and request.user.role == 'student':
            return False
            
        # Allow POST requests for all other authenticated roles (alumni, admins, etc.)
        return True