from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework.routers import DefaultRouter
from api.views import (ParcelleViewSet, PermisRegieViewSet,PersonnePhysiqueViewSet, PersonneMoraleViewSet, PermisCommercialViewSet, SuiviTravauxViewSet,
                    PaiementPermisUrbanismeViewSet, Paiement_TNBViewSet, Permis_UrbanismeViewSet, EspaceViewSet, MarchesViewSet, InspectionViewSet,
                    SportCultureViewSet, PermisSanteViewSet, VoirieViewSet, EspaceVertViewSet, Paiement_ExploitationViewSet)


def home_view(request):
    return JsonResponse({"message": "Welcome to the Django API"})

router = DefaultRouter()
router.register('parcelles', ParcelleViewSet)
router.register('personnes-physiques', PersonnePhysiqueViewSet)
router.register('personnes-morales', PersonneMoraleViewSet)
router.register('Inspection', InspectionViewSet)
router.register('Marches', MarchesViewSet)
router.register('Espace', EspaceViewSet)
router.register('Permis_Urbanisme', Permis_UrbanismeViewSet)
router.register('Paiement_TNB', Paiement_TNBViewSet)
router.register('PaiementPermisUrbanisme', PaiementPermisUrbanismeViewSet)
router.register('SuiviTravaux', SuiviTravauxViewSet)
router.register('PermisCommercial', PermisCommercialViewSet)
router.register('Paiement_Exploitation', Paiement_ExploitationViewSet)
router.register('EspaceVert', EspaceVertViewSet)
router.register('Voirie', VoirieViewSet)
router.register('PermisSante', PermisSanteViewSet)
router.register('SportCulture', SportCultureViewSet)
router.register('PermisRegie',PermisRegieViewSet)

urlpatterns = [
    path('', home_view, name='home'),  # Root URL for the homepage
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),  # Directly include the router urls
]
