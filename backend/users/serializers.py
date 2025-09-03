from rest_framework import serializers
from .models import User, Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        # Add the new fields to this serializer as well
        fields = ['headline', 'about', 'location', 'company', 'skills', 'college', 'department', 'graduation_year', 'enrollment_number']

# --- THIS SERIALIZER IS NOW MUCH SMARTER ---
class RegisterSerializer(serializers.ModelSerializer):
    """
    Handles registration, including creating the nested Profile.
    """
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'profile']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Pop the profile data out to handle it separately
        profile_data = validated_data.pop('profile')
        
        # Create the user object
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'student')
        )
        
        # Now, create the Profile with the extra data.
        # Our signal still works, but this allows us to add the data immediately.
        Profile.objects.update_or_create(user=user, defaults=profile_data)
        
        return user

# The main UserSerializer is also updated to include the new profile fields
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'profile', 'is_approved']
        extra_kwargs = {'password': {'write_only': True}}

    def update(self, instance, validated_data):
        # This update method also needs to be aware of the new fields
        profile_data = validated_data.pop('profile', {})
        profile = instance.profile

        super().update(instance, validated_data)

        # Update all fields, including the new ones
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        
        profile.save()
        return instance