# backend/users/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from institutions.models import Institution

class User(AbstractUser):
    # Define the choices for the user's role
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('alumni', 'Alumni'),
        ('department_admin', 'Department Admin'),
        ('institution_admin', 'Institution Admin'),
        ('super_admin', 'State Super Admin'),
    )

    # Add the custom role field
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    is_approved = models.BooleanField(default=False)
    
    # You can add other fields here later, like:
    # institution = models.ForeignKey('institutions.Institution', on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self):
        return self.username
    
# --- ADD THE NEW PROFILE MODEL BELOW ---

class Profile(models.Model):
    # This creates a one-to-one link with the main User model
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    institution = models.ForeignKey(Institution, on_delete=models.SET_NULL, null=True, blank=True)
    # Add all the fields our frontend profile page needs
    headline = models.CharField(max_length=255, blank=True)
    about = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    # --- ADD THESE TWO NEW FIELDS ---
    skills = models.TextField(blank=True, help_text="Comma-separated list of skills")
    # We will add more complex fields like Experience and Education later.
    # For now, let's start with these text-based fields.
    college = models.CharField(max_length=255, blank=True, null=True)
    department = models.CharField(max_length=255, blank=True, null=True)
    graduation_year = models.IntegerField(blank=True, null=True)
    enrollment_number = models.CharField(max_length=50, blank=True, null=True) # For both roll no and enrollment
    company = models.CharField(max_length=100, blank=True)
    def __str__(self):
        return f"{self.user.username}'s Profile"