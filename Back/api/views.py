from rest_framework import viewsets
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import (
    Parcelle,PermisRegie, PersonnePhysique, PersonneMorale, PermisCommercial, SuiviTravaux,
    PaiementPermisUrbanisme, Paiement_TNB, Permis_Urbanisme, Espace, Marches,
    Inspection, SportCulture,Item, PermisSante, Voirie, EspaceVert, Paiement_Exploitation
)

from .serializers import (
    ParcelleSerializer,PermisRegieSerializer,PersonnePhysiqueSerializer, PersonneMoraleSerializer,
    PermisCommercialSerializer, SuiviTravauxSerializer, PaiementPermisUrbanismeSerializer,
    Paiement_TNBSerializer, Permis_UrbanismeSerializer, EspaceSerializer, MarchesSerializer,
    InspectionSerializer, SportCultureSerializer, PermisSanteSerializer, VoirieSerializer,
    EspaceVertSerializer, Paiement_ExploitationSerializer,ItemSerializer
)

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class TestView(APIView):
   
    def get(self, request, format=None):
        # Just an example response
        return Response({"message": "This is a test view!"}, status=status.HTTP_200_OK)


class ParcelleViewSet(viewsets.ModelViewSet):
    queryset = Parcelle.objects.all()
    serializer_class = ParcelleSerializer

# Simple view to test connection


def test_connection(request):
    return JsonResponse({"message": "Backend connected successfully!"})


@csrf_exempt
def test_data(request):
    if request.method == 'POST':
        return JsonResponse({"message": "Data received successfully!"})
    return JsonResponse({"message": "Test data endpoint working!"})


class PersonnePhysiqueViewSet(viewsets.ModelViewSet):
    queryset = PersonnePhysique.objects.all()
    serializer_class = PersonnePhysiqueSerializer
    
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class PersonneMoraleViewSet(viewsets.ModelViewSet):
    queryset = PersonneMorale.objects.all()
    serializer_class = PersonneMoraleSerializer


class PermisCommercialViewSet(viewsets.ModelViewSet):
    queryset = PermisCommercial.objects.all()
    serializer_class = PermisCommercialSerializer
    
class PermisRegieViewSet(viewsets.ModelViewSet):
    queryset = PermisRegie.objects.all()
    serializer_class = PermisRegieSerializer


class SuiviTravauxViewSet(viewsets.ModelViewSet):
    queryset = SuiviTravaux.objects.all()
    serializer_class = SuiviTravauxSerializer


class PaiementPermisUrbanismeViewSet(viewsets.ModelViewSet):
    queryset = PaiementPermisUrbanisme.objects.all()
    serializer_class = PaiementPermisUrbanismeSerializer


class Paiement_TNBViewSet(viewsets.ModelViewSet):
    queryset = Paiement_TNB.objects.all()
    serializer_class = Paiement_TNBSerializer


class Permis_UrbanismeViewSet(viewsets.ModelViewSet):
    queryset = Permis_Urbanisme.objects.all()
    serializer_class = Permis_UrbanismeSerializer


class PermisSanteViewSet(viewsets.ModelViewSet):
    queryset = PermisSante.objects.all()
    serializer_class = PermisSanteSerializer


class SportCultureViewSet(viewsets.ModelViewSet):
    queryset = SportCulture.objects.all()
    serializer_class = SportCultureSerializer


class InspectionViewSet(viewsets.ModelViewSet):
    queryset = Inspection.objects.all()
    serializer_class = InspectionSerializer


class MarchesViewSet(viewsets.ModelViewSet):
    queryset = Marches.objects.all()
    serializer_class = MarchesSerializer


class EspaceViewSet(viewsets.ModelViewSet):
    queryset = Espace.objects.all()
    serializer_class = EspaceSerializer


class Paiement_ExploitationViewSet(viewsets.ModelViewSet):
    queryset = Paiement_Exploitation.objects.all()
    serializer_class = Paiement_ExploitationSerializer


class EspaceVertViewSet(viewsets.ModelViewSet):
    queryset = EspaceVert.objects.all()
    serializer_class = EspaceVertSerializer


class VoirieViewSet(viewsets.ModelViewSet):
    
    queryset = Voirie.objects.all()
    serializer_class = VoirieSerializer
