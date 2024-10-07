from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low','low'),
        ('medium','medium'),
        ('high','high'),
    ]
    title = models.CharField(max_length=100)
    description = models.TextField()
    # due_date = models.DateTimeField()
    # priority = models.CharField(max_length=6, choices= PRIORITY_CHOICES)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # user = models.ForeignKey(User, on_delete= models.CASCADE)

    def __str__(self):
        return self.title
