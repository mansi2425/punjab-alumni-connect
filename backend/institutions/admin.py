from django.contrib import admin
from .models import Institution

# This line tells the Django admin to find our Institution model
# and make it available on the admin site.
admin.site.register(Institution)