# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, TestView, test_connection, test_data
from .views import (ParcelleViewSet, PersonnePhysiqueViewSet, PersonneMoraleViewSet, PermisCommercialViewSet, SuiviTravauxViewSet,
                    PaiementPermisUrbanismeViewSet, PaiementTNBViewSet, PermisUrbanismeViewSet, EspaceViewSet, MarchesViewSet, InspectionViewSet,
                    SportCultureViewSet,PermisRegieViewSet, PermisSanteViewSet, VoirieViewSet, EspaceVertViewSet, PaiementExploitationViewSet)


# Create a router and register our viewsets
router = DefaultRouter()
router.register('items', ItemViewSet)
router.register('parcelles', ParcelleViewSet)
router.register('personnes-physiques', PersonnePhysiqueViewSet)
router.register('personnes-morales', PersonneMoraleViewSet)
router.register('Inspection', InspectionViewSet)
router.register('Marches', MarchesViewSet)
router.register('Espace', EspaceViewSet)
router.register('PermisUrbanisme', PermisUrbanismeViewSet)
router.register('PaiementTNB', PaiementTNBViewSet)
router.register('PaiementPermisUrbanisme', PaiementPermisUrbanismeViewSet)
router.register('SuiviTravaux', SuiviTravauxViewSet)
router.register('PermisCommercial', PermisCommercialViewSet)
router.register('PaiementExploitation', PaiementExploitationViewSet)
router.register('EspaceVert', EspaceVertViewSet)
router.register('Voirie', VoirieViewSet)
router.register('PermisSante', PermisSanteViewSet)
router.register('SportCulture', SportCultureViewSet)
router.register('PermisRegie', PermisRegieViewSet)


# Add your URL patterns here
urlpatterns = [
    # API endpoints will be handled by the router
    path('', include(router.urls)),
    path('test/', TestView.as_view(), name='test'),
    path('test-connection/', test_connection, name='test-connection'),
    path('test-data/', test_data, name='test-data'),
]
