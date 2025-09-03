# backend/jobs/models.py
from django.db import models
from users.models import User

class Job(models.Model):
    JOB_TYPE_CHOICES = (
        ('Full-Time', 'Full-Time'),
        ('Internship', 'Internship'),
        ('Part-Time', 'Part-Time'),
    )

    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    description = models.TextField()
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_jobs')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"