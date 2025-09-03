# backend/users/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Profile

# This is the function that will run every time a User object is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    This signal ensures that a Profile is automatically created for
    every new User.
    """
    if created:
        # If the User instance was just created, create a Profile for it
        Profile.objects.create(user=instance)