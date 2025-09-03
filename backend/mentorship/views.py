from django.db.models import Q
from rest_framework import generics, status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import MentorshipRequest, ConnectionInfo, User
from .serializers import MentorshipRequestSerializer, ConnectionDetailSerializer

class MentorshipRequestListCreateView(generics.ListCreateAPIView):
    """
    - GET: Returns a list of requests based on 'view' and 'status' parameters.
    - POST: Creates a new mentorship request, checking for duplicates.
    """
    serializer_class = MentorshipRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Get parameters from the frontend's URL
        view_type = self.request.query_params.get('view', 'incoming')
        status_filter = self.request.query_params.get('status', None)

        # Logic for the 'outgoing' view (My Sent Requests)
        if view_type == 'outgoing':
            queryset = user.sent_requests.all()
            # If the frontend asks for a specific status, filter the sent items.
            if status_filter in ['pending', 'accepted', 'declined']:
                queryset = queryset.filter(status=status_filter)
        # Logic for the 'incoming' view (Requests to Me)
        else:
            # The 'incoming' view is a "To-Do" list, so it's always pending.
            queryset = user.received_requests.filter(status='pending')
        
        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        requester = self.request.user
        mentor_id = serializer.validated_data['mentor_id']
        try:
            mentor = User.objects.get(pk=mentor_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("The selected mentor does not exist.")

        # Prevent duplicate active requests
        if MentorshipRequest.objects.filter(
            Q(status='pending') | Q(status='accepted'),
            requester=requester,
            mentor=mentor
        ).exists():
            raise serializers.ValidationError("You already have an active or pending request with this mentor.")

        serializer.save(requester=requester, mentor=mentor)


class RespondToRequestView(APIView):
    """
    An endpoint for a mentor to accept or decline a request.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, *args, **kwargs):
        try:
            mentorship_request = MentorshipRequest.objects.get(pk=pk)
        except MentorshipRequest.DoesNotExist:
            return Response({"error": "Request not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.user != mentorship_request.mentor:
            return Response({"error": "You do not have permission to respond to this request."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get('status')
        if new_status not in ['accepted', 'declined']:
            return Response({"error": "Invalid status provided."}, status=status.HTTP_400_BAD_REQUEST)

        mentorship_request.status = new_status
        mentorship_request.save()

        if new_status == 'accepted':
            contact_info = request.data.get('shared_contact_info', 'Mentor has not provided contact info yet.')
            message = request.data.get('shared_message', '')
            ConnectionInfo.objects.create(
                request=mentorship_request,
                shared_contact_info=contact_info,
                shared_message=message
            )

        return Response({"status": f"Request {new_status}"}, status=status.HTTP_200_OK)


class ConnectionListView(generics.ListAPIView):
    """
    Returns a list of all connections for the logged-in user.
    """
    serializer_class = ConnectionDetailSerializer
    permission_classes = [IsAuthenticated]

    # --- THIS IS THE CRITICAL FIX ---
    # This method is called by the framework. We are overriding it to add
    # the 'request' object to the context that gets passed to the serializer.
    def get_serializer_context(self):
        # Start with the default context
        context = super().get_serializer_context()
        # Add the request object to the context
        context['request'] = self.request
        return context
    # --- END OF FIX ---

    def get_queryset(self):
        user = self.request.user
        accepted_requests = MentorshipRequest.objects.filter(
            Q(mentor=user) | Q(requester=user),
            status='accepted'
        )
        return ConnectionInfo.objects.filter(request__in=accepted_requests)