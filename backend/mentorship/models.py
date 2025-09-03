from django.db import models
from users.models import User

class MentorshipRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    )

    requester = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_requests')
    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_requests')
    initial_message = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request from {self.requester.username} to {self.mentor.username}"

class ConnectionInfo(models.Model):
    # This creates a direct, one-to-one link to an accepted request
    request = models.OneToOneField(MentorshipRequest, on_delete=models.CASCADE)
    
    # The mentor controls this information
    shared_contact_info = models.TextField(help_text="The contact details the mentor chose to share (email, phone, etc.)")
    shared_message = models.TextField(blank=True, help_text="A personal message from the mentor")

    def __str__(self):
        return f"Connection info for request #{self.request.id}"