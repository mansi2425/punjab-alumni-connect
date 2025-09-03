from django.contrib import admin
from .models import MentorshipRequest, ConnectionInfo

admin.site.register(MentorshipRequest)
admin.site.register(ConnectionInfo)