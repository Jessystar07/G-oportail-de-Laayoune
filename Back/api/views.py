import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework import viewsets, filters, status

from rest_framework.views import APIView
from rest_framework.decorators import action
from django.contrib.gis.geos import GEOSGeometry
from django.contrib.gis.measure import D


from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Parcelle, PermisRegie, PersonnePhysique, PersonneMorale, PermisCommercial, SuiviTravaux,
    PaiementPermisUrbanisme, PaiementTNB, PermisUrbanisme, Espace, Marches,
    Inspection, SportCulture,Item, PermisSante, Voirie, EspaceVert, PaiementExploitation
)

from .serializers import (
    ParcelleSerializer,EspaceVertSimpleSerializer, PermisRegieSerializer, PersonnePhysiqueSerializer, PersonneMoraleSerializer,
    PermisCommercialSerializer, SuiviTravauxSerializer, PaiementPermisUrbanismeSerializer,
    PaiementTNBSerializer,PermisUrbanismeSerializer, EspaceSerializer, MarchesSerializer,
    InspectionSerializer, SportCultureSerializer,PermisSanteSerializer, VoirieSerializer,VoirieGeoSerializer,
    EspaceVertSerializer, PaiementExploitationSerializer, ItemSerializer
)


class TestView(APIView):
    """
    A simple test view to check if the API is working.
    """
    def get(self, request, format=None):
        """
        Handles GET requests to the TestView endpoint.
        Returns a simple test message to check if the API is working.

        Arguments:
            request -- The HTTP request object.
            format -- The desired response format (optional).

        Returns:
            Response -- A simple message indicating that the API is working.
        """
        return Response({"message": "This is a test view!"}, status=status.HTTP_200_OK)






# Simple view to test connection
def test_connection(request):
    """
    Simple endpoint to check if the backend is connected.
    """
    return JsonResponse({"message": "Backend connected successfully!"})


@csrf_exempt
def test_data(request):
    """
    Simple test data endpoint.
    """
    if request.method == 'POST':
        return JsonResponse({"message": "Data received successfully!"})
    return JsonResponse({"message": "Test data endpoint working!"})

class ParcelleViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Parcelle instances.
    """
    queryset = Parcelle.objects.all()
    serializer_class = ParcelleSerializer
    
class PersonnePhysiqueViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing PersonnePhysique instances.
    """
    queryset = PersonnePhysique.objects.all()
    serializer_class = PersonnePhysiqueSerializer


class PersonneMoraleViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing PersonneMorale instances.
    """
    queryset = PersonneMorale.objects.all()
    serializer_class = PersonneMoraleSerializer
    
class ItemViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Item instances.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

class PermisCommercialViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing PermisCommercial instances.
    """
    queryset = PermisCommercial.objects.all()
    serializer_class = PermisCommercialSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError as e:
            return Response(
                {"detail": "Un permis avec ce numéro existe déjà."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
class InspectionViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Inspection instances.
    """
    queryset = Inspection.objects.all()
    serializer_class = InspectionSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            


class PermisRegieViewSet(viewsets.ModelViewSet):
    queryset = PermisRegie.objects.all()
    serializer_class = PermisRegieSerializer
    

class SuiviTravauxViewSet(viewsets.ModelViewSet):
    queryset = SuiviTravaux.objects.all()
    serializer_class = SuiviTravauxSerializer

class PaiementTNBViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing PaiementTNB instances.
    """
    queryset = PaiementTNB.objects.all()
    serializer_class = PaiementTNBSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"detail": f"Erreur lors de la création: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"detail": f"Erreur lors de la mise à jour: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


class PaiementPermisUrbanismeViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing PaiementPermisUrbanisme instances.
    """
    queryset = PaiementPermisUrbanisme.objects.all()
    serializer_class = PaiementPermisUrbanismeSerializer
    
    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"detail": f"Erreur lors de la création: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"detail": f"Erreur lors de la mise à jour: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
            

class PermisUrbanismeViewSet(viewsets.ModelViewSet):
    """
        A viewset for viewing and editing PermisUrbanisme instances.
    """
    queryset = PermisUrbanisme.objects.all()
    serializer_class = PermisUrbanismeSerializer


class PermisSanteViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing PermisSante instances.
    """
    queryset = PermisSante.objects.all()
    serializer_class = PermisSanteSerializer


class SportCultureViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour l'affichage et l'édition des instances SportCulture.
    """
    queryset = SportCulture.objects.all()
    serializer_class = SportCultureSerializer

    def create(self, request, *args, **kwargs):
        """
        Surcharge de la méthode create pour gérer les géométries au format texte.
        """
        data = request.data.copy()
        
        # Si la géométrie est fournie au format texte
        if 'geom' in data and isinstance(data['geom'], str):
            try:
                # Essayer de parser comme WKT
                data['geom'] = GEOSGeometry(data['geom'], srid=4326)
            except Exception as e:
                return Response({"erreur": f"Format de géométrie non valide: {str(e)}"}, status=400)
        
        return super().create(request=type('obj', (object,), {"data": data}), *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """
        Surcharge de la méthode update pour gérer les géométries au format texte.
        """
        data = request.data.copy()
        
        # Si la géométrie est fournie au format texte
        if 'geom' in data and isinstance(data['geom'], str):
            try:
                # Essayer de parser comme WKT
                data['geom'] = GEOSGeometry(data['geom'], srid=4326)
            except Exception as e:
                return Response({"erreur": f"Format de géométrie non valide: {str(e)}"}, status=400)
        
        return super().update(request=type('obj', (object,), {"data": data}), *args, **kwargs)





class EspaceViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Espace instances.
    """
    queryset = Espace.objects.all()
    serializer_class = EspaceSerializer

class MarchesViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing Marches instances.
    """
    queryset = Marches.objects.all()
    serializer_class = MarchesSerializer


class PaiementExploitationViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing PaiementExploitation instances.
    """
    queryset = PaiementExploitation.objects.all()
    serializer_class = PaiementExploitationSerializer


class EspaceVertViewSet(viewsets.ModelViewSet):
    """
    API pour visualiser et éditer les instances d'EspaceVert.
    """
    queryset = EspaceVert.objects.all()
    serializer_class = EspaceVertSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type_espace', 'statut', 'gestionnaire']
    search_fields = ['nom', 'description']
    ordering_fields = ['nom', 'surface', 'date_creation']
    
    def get_serializer_class(self):
        """
        Retourne différents sérialiseurs selon le format demandé.
        """
        format_param = self.request.query_params.get('format')
        if format_param == 'simple':
            return EspaceVertSimpleSerializer
        return EspaceVertSerializer
    
    @action(detail=False, methods=['get'])
    def types(self):
        """
        Renvoie la liste des types d'espaces verts disponibles.
        """
        types = EspaceVert.objects.values_list('type_espace', flat=True).distinct()
        return Response(list(types))
    
    @action(detail=False, methods=['get'])
    def statuts(self):
        """
        Renvoie la liste des statuts d'espaces verts disponibles.
        """
        statuts = EspaceVert.objects.values_list('statut', flat=True).distinct()
        return Response(list(statuts))
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """
        Recherche les espaces verts proches d'un point donné.
        
        Paramètres:
        - lat: latitude du point
        - lon: longitude du point
        - distance: distance maximale en mètres (par défaut 1000)
        """
        try:
            lat = float(request.query_params.get('lat'))
            lon = float(request.query_params.get('lon'))
            distance = float(request.query_params.get('distance', 1000))
            
            point = GEOSGeometry(f'POINT({lon} {lat})', srid=4326)
            queryset = EspaceVert.objects.filter(geom__distance_lte=(point, D(m=distance)))
            
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except (ValueError, TypeError):
            return Response(
                {"error": "Paramètres invalides. Assurez-vous de fournir lat, lon et éventuellement distance."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def create(self, request, *args, **kwargs):
        """
        Surcharge pour mieux gérer les formats de données géométriques
        """
        try:
            # Essai de conversion des données géométriques si nécessaire
            if 'geom' in request.data and isinstance(request.data['geom'], str):
                if request.data['geom'].startswith('{'):  # Probablement GeoJSON
                    geojson = json.loads(request.data['geom'])
                    if 'type' in geojson and 'coordinates' in geojson:
                        request.data['geom'] = GEOSGeometry(json.dumps(geojson))
            
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {"error": f"Erreur lors de la création: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )  # Fixed indentation here

class VoirieViewSet(viewsets.ModelViewSet):
    queryset = Voirie.objects.all()
    
    def get_serializer_class(self):
        # Use GeoJSON serializer for list/retrieve operations
        if self.action in ['list', 'retrieve']:
            return VoirieGeoSerializer
        # Use regular serializer for create/update operations
        return VoirieSerializer

