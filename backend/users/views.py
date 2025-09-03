from django.shortcuts import render

# Create your views here.
# backend/users/views.py
from rest_framework import generics , status
from rest_framework.permissions import AllowAny ,IsAuthenticated
from .models import User
from .serializers import UserSerializer
from rest_framework.views import APIView # <-- Add this import
from rest_framework.response import Response # <-- Add this import
from .serializers import UserSerializer, RegisterSerializer
from institutions.models import Institution

# This view uses Django REST Framework's generic 'CreateAPIView'
# which is designed specifically for creating new objects.
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # Anyone can access this view to register
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer 

class MeView(generics.RetrieveUpdateAPIView): # <-- CHANGE THIS
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
    
    # --- ADD THIS METHOD TO INTERCEPT THE UPDATE REQUEST ---
    def update(self, request, *args, **kwargs):
        # This is our checkpoint. Let's see what data arrived.
        print("====== BACKEND CHECKPOINT ======")
        print("Request Body Received:", request.data)
        print("==============================")
        
        # This line calls the original update logic after our print statement
        return super().update(request, *args, **kwargs)
    
# --- ADD THIS NEW VIEW ---
class AlumniListView(generics.ListAPIView):
    """
    Returns a list of all users with the 'alumni' role.
    This endpoint is protected and requires authentication to access.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    
    def get_queryset(self):
       # --- THIS IS THE CRITICAL FIX ---
        # 1. Get all approved alumni
        queryset = User.objects.filter(role='alumni', is_approved=True)
        
        # 2. Exclude the current user from that list
        #    self.request.user.pk is the ID of the logged-in user.
        queryset = queryset.exclude(pk=self.request.user.pk)
        
        return queryset
        # --- END OF FIX ---

class UserDetailView(generics.RetrieveAPIView):
    """
    Returns the details for a single user, identified by their primary key (ID).
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all() # The view will look for a user within this set

class MentorRecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        current_user = request.user
        
        # We can't recommend mentors if the user has no profile or skills
        if not hasattr(current_user, 'profile') or not current_user.profile.skills:
            return Response([]) # Return an empty list

        # 1. Get the current user's skills
        user_skills = set([skill.strip().lower() for skill in current_user.profile.skills.split(',')])
        if not user_skills:
            return Response([])

        # 2. Find all potential mentors (alumni who are open to mentoring)
        potential_mentors = User.objects.filter(
            role='alumni', is_approved=True
        ).exclude(pk=current_user.pk).prefetch_related('profile') # Exclude the user themselves

        # 3. Calculate a match score for each mentor
        matches = []
        for mentor in potential_mentors:
            if hasattr(mentor, 'profile') and mentor.profile.skills:
                mentor_skills = set([skill.strip().lower() for skill in mentor.profile.skills.split(',')])
                common_skills = user_skills.intersection(mentor_skills)
                
                if common_skills:
                    match_score = len(common_skills)
                    matches.append({'mentor': UserSerializer(mentor).data, 'score': match_score})
        
        # 4. Sort by the best score and return the top 3
        sorted_matches = sorted(matches, key=lambda x: x['score'], reverse=True)
        return Response(sorted_matches[:3])
    
class PendingUsersListView(generics.ListAPIView):
    """
    Returns a list of all users who are not yet approved.
    In a real app, this would be filtered by the admin's institution/department.
    """
    permission_classes = [IsAuthenticated] # We would need IsAdminUser here in a real app
    serializer_class = UserSerializer
    
    def get_queryset(self):
        return User.objects.filter(is_approved=False)

class ApproveUserView(APIView):
    """
    An endpoint for an admin to approve a user.
    """
    permission_classes = [IsAuthenticated] # Would also be IsAdminUser

    def post(self, request, pk, *args, **kwargs):
        try:
            user_to_approve = User.objects.get(pk=pk)
            user_to_approve.is_approved = True
            user_to_approve.save()
            return Response({'status': 'user approved'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
class InstitutionPendingUsersView(generics.ListAPIView):
    """
    Provides a list of all unapproved users for the logged-in
    Institution Admin's specific college.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_queryset(self):
        admin_user = self.request.user
        # Find the institution managed by this admin via their email
        try:
            institution = Institution.objects.get(contact_email=admin_user.email)
        except Institution.DoesNotExist:
            # If no institution is found, return an empty list
            return User.objects.none()

        # Find all users who are not approved AND whose profile is linked to this institution
        return User.objects.filter(
            profile__institution=institution,
            is_approved=False
        ).order_by('date_joined')