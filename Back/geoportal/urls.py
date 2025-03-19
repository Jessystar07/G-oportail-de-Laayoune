from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def home_view(request):
    return JsonResponse({"message": "Welcome to the Django API"})

urlpatterns = [
    path('', home_view, name='home'),  # Root URL for the homepage
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Inclure directement les routes de api.urls
]


