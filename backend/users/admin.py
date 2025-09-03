from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'company')

# This is our custom admin configuration for the User model
class CustomUserAdmin(UserAdmin):
    # This adds our custom fields to the user's edit page in the admin
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'is_approved')}),
    )
    
    # This adds our custom fields to the main user list view
    list_display = ('username', 'email', 'first_name', 'is_staff', 'role', 'is_approved')
    
    # This makes the 'is_approved' and 'role' fields filterable on the right side
    list_filter = UserAdmin.list_filter + ('is_approved', 'role')

# We unregister the default User admin first, then register our custom one
# This avoids potential conflicts if the app is reloaded
# admin.site.unregister(User) # This line is often not needed, but is safe to have
admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile, ProfileAdmin)