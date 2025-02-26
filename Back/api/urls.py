# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, TestView, test_connection, test_data
from .views import (ParcelleViewSet, PersonnePhysiqueViewSet, PersonneMoraleViewSet, PermisCommercialViewSet, SuiviTravauxViewSet,
                    PaiementPermisUrbanismeViewSet, Paiement_TNBViewSet, Permis_UrbanismeViewSet, EspaceViewSet, MarchesViewSet, InspectionViewSet,
                    SportCultureViewSet, PermisSanteViewSet, VoirieViewSet, EspaceVertViewSet, Paiement_ExploitationViewSet)


# Create a router and register our viewsets
router = DefaultRouter()
router.register('items', ItemViewSet)
router.register(r'parcelles', ParcelleViewSet)
router.register(r'personnes-physiques', PersonnePhysiqueViewSet)
router.register(r'personnes-morales', PersonneMoraleViewSet)
router.register(r'Inspection', InspectionViewSet)
router.register(r'Marches', MarchesViewSet)
router.register(r'Espace', EspaceViewSet)
router.register(r'Permis_Urbanisme', Permis_UrbanismeViewSet)
router.register(r'Paiement_TNB', Paiement_TNBViewSet)
router.register(r'PaiementPermisUrbanisme', PaiementPermisUrbanismeViewSet)
router.register(r'SuiviTravaux', SuiviTravauxViewSet)
router.register(r'PermisCommercial', PermisCommercialViewSet)
router.register(r'Paiement_Exploitation', Paiement_ExploitationViewSet)
router.register(r'EspaceVert', EspaceVertViewSet)
router.register(r'Voirie', VoirieViewSet)
router.register(r'PermisSante', PermisSanteViewSet)
router.register(r'SportCulture', SportCultureViewSet)


# Add your URL patterns here
urlpatterns = [
    # API endpoints will be handled by the router
    path('', include(router.urls)),
    path('test/', TestView.as_view(), name='test'),
    path('test-connection/', test_connection, name='test-connection'),
    path('test-data/', test_data, name='test-data'),
]
