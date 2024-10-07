from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import generics
from .models import Task
from .serializers import TaskSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.
class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user = self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user = self.request.user)
    
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permision_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(user = self.request.user)
    
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({"error": "email and username or password are required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({"error": "user with username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, email=email,password=password)
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "User created successfully",
            "access": str(refresh.access_token),
            "refresh":str(refresh)
        }, status = status.HTTP_201_CREATED)

@api_view(['POST'])   
def create_task(request):
    serializer = TaskSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(status = status.HTTP_201_CREATED)
    return Response(status = status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
def get_task(request):
    tasks = Task.objects.all()
    serial = TaskSerializer(tasks, many=True)
    return Response(serial.data)