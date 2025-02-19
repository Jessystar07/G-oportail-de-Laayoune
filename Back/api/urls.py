from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, TestView, test_connection, test_data

# Create a router and register our viewset
router = DefaultRouter()
router.register(r'items', ItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('test/', TestView.as_view(), name='test'),
    path('test-connection/', test_connection, name='test-connection'),
    path('test-data/', test_data, name='test-data'),
]