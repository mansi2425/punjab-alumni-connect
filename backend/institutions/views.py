from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Institution
from .serializers import InstitutionApplicationSerializer, InstitutionSerializer
from users.models import User
from django.utils.crypto import get_random_string

class InstitutionApplicationView(generics.CreateAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionApplicationSerializer
    permission_classes = [AllowAny]

# --- THIS IS THE NEW VIEW TO LIST APPROVED COLLEGES ---
class ApprovedInstitutionsListView(generics.ListAPIView):
    queryset = Institution.objects.filter(status='approved').order_by('name')
    serializer_class = InstitutionSerializer
    permission_classes = [IsAuthenticated] # Should be IsSuperAdmin

# --- THIS IS THE NEW VIEW FOR EDITING AND DELETING ---
class InstitutionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer
    permission_classes = [IsAuthenticated] # Should be IsSuperAdmin

class PendingInstitutionsListView(generics.ListAPIView):
    queryset = Institution.objects.filter(status='pending').order_by('created_at')
    serializer_class = InstitutionApplicationSerializer
    permission_classes = [IsAuthenticated]

class ApproveInstitutionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        try:
            institution = Institution.objects.get(pk=pk, status='pending')
        except Institution.DoesNotExist:
            return Response({"error": "Institution not found or already actioned."}, status=status.HTTP_404_NOT_FOUND)

        institution.status = 'approved'
        institution.save()

        admin_username = institution.contact_email.split('@')[0]
         # Use Django's core utility to generate a secure 12-character password
        admin_password = get_random_string(12)
        admin_user, created = User.objects.get_or_create(
            email=institution.contact_email,
            defaults={ 'username': admin_username, 'first_name': institution.contact_person, 'role': 'institution_admin', 'is_approved': True }
        )
        if created:
            admin_user.set_password(admin_password)
            admin_user.save()
            print(f"--- Institution Admin Created for {institution.name} ---")
            print(f"Username: {admin_username}")
            print(f"Password: {admin_password}")
        
        return Response({"status": f"{institution.name} approved and admin account created."}, status=status.HTTP_200_OK)

class RejectInstitutionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        try:
            institution = Institution.objects.get(pk=pk, status='pending')
        except Institution.DoesNotExist:
            return Response({"error": "Institution not found or already actioned."}, status=status.HTTP_404_NOT_FOUND)

        institution.status = 'rejected'
        institution.save()
        return Response({"status": f"{institution.name} has been rejected."}, status=status.HTTP_200_OK)

class PlatformAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        stats = {
            'total_institutions': Institution.objects.filter(status='approved').count(),
            'total_alumni': User.objects.filter(role='alumni', is_approved=True).count(),
            'total_students': User.objects.filter(role='student', is_approved=True).count(),
        }
        return Response(stats)
    
class InstitutionAnalyticsView(APIView):
    """
    Provides statistics scoped to the logged-in Institution Admin's college.
    """
    permission_classes = [IsAuthenticated] # In a real app, would be IsInstitutionAdmin

    def get(self, request, *args, **kwargs):
        admin_user = request.user

        # Security check: find the institution this admin manages.
        # We find the institution via the admin's email.
        try:
            institution = Institution.objects.get(contact_email=admin_user.email)
        except Institution.DoesNotExist:
             return Response({"error": "Admin not associated with any institution."}, status=status.HTTP_403_FORBIDDEN)
        
        stats = {
            'institution_name': institution.name,
            'total_alumni': User.objects.filter(profile__institution=institution, role='alumni', is_approved=True).count(),
            'total_students': User.objects.filter(profile__institution=institution, role='student', is_approved=True).count(),
            'pending_approvals': User.objects.filter(profile__institution=institution, is_approved=False).count(),
        }
        return Response(stats)