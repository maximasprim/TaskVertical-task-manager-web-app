# tasks/urls.py
from django.urls import path
from .views import TaskListCreateView, TaskDetailView, RegisterView, create_task,get_task

urlpatterns = [
    path('tasks/', get_task, name='task-list-create'),
    path('tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('register/', RegisterView.as_view(), name='register'),
    path('tasks/create/',create_task, name='create_task'),
]
