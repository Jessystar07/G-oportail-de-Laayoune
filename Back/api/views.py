from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from django.http import JsonResponse
from .models import Item
from .serializers import ItemSerializer


# API View for testing backend connection
class TestView(APIView):
    
    def get(self, request):
        return Response({"message": "Backend is connected!"})

# Item ViewSet to handle CRUD operations on Items
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    
# Simple view to test connection via Django's JsonResponse
def test_connection(request):
    return JsonResponse({"message": "Backend connected successfully!"})


def test_data(request):
    if request.method == 'POST':
        return JsonResponse({"message": "Data received successfully!"})
    return JsonResponse({"message": "Test data endpoint working!"})