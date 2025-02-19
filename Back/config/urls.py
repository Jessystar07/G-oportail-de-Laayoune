
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home_view(request):
    return JsonResponse({"message": "Welcome to the Django API"})

urlpatterns = [
    path('', home_view, name='home'),  # Add this line for root URL
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]