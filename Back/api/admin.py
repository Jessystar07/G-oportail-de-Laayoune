
from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin

from .models import (
    Parcelle, PermisRegie, PersonnePhysique, PersonneMorale, 
    PermisUrbanisme, PaiementTNB, PaiementPermisUrbanisme, 
    SuiviTravaux, PermisCommercial, Inspection, Marches, 
    Espace, PaiementExploitation, EspaceVert, Voirie, 
    PermisSante, SportCulture, Item
)

# Register standard models
@admin.register(Parcelle)
class ParcelleAdmin(admin.ModelAdmin):
    list_display = ('titre', 'numero', 'annexe', 'lotissement', 'surface_totale')
    search_fields = ('titre', 'numero_lot', 'lotissement', 'avenue', 'rue')
    list_filter = ('annexe', 'sdau')


class PermisRegieAdmin(admin.ModelAdmin):
    list_display = (
        'numero_de_quittance', 
        'requérant', 
        'localisation', 
        'type_permis', 
        'date_de_paiement', 
        'surface', 
        'type_de_mesure', 
        'rubrique', 
        'type_de_permis', 
        'dernier_paiement', 
        'observations'
    )
    list_filter = ('type_permis', 'type_de_mesure', 'date_de_paiement', 'dernier_paiement')
    search_fields = ('numero_de_quittance', 'requérant', 'localisation')
    ordering = ('date_de_paiement',)
    date_hierarchy = 'date_de_paiement'
    # Personnalisation des champs en affichage
    fieldsets = (
        (None, {
            'fields': ('numero_de_quittance', 'requérant', 'localisation')
        }),
        ('Détails du permis', {
            'fields': ('type_permis', 'date_de_paiement', 'surface', 'type_de_mesure', 'rubrique', 'type_de_permis')
        }),
        ('Paiement', {
            'fields': ('dernier_paiement', 'observations')
        }),
    )
    list_editable = ('observations',)  # Permet d'éditer certains champs directement dans la liste
# Enregistrement du modèle et de son admin
admin.site.register(PermisRegie, PermisRegieAdmin)
    
@admin.register(PersonnePhysique)
class PersonnePhysiqueAdmin(admin.ModelAdmin):
    list_display = ('nom', 'prenom', 'cnie', 'telephone')
    search_fields = ('nom', 'prenom', 'cnie')

@admin.register(PersonneMorale)
class PersonneMoraleAdmin(admin.ModelAdmin):
    list_display = ('raison_sociale', 'rc', 'if_field', 'ice')
    search_fields = ('raison_sociale', 'rc', 'ice')

@admin.register(PermisUrbanisme)
class PermisUrbanismeAdmin(admin.ModelAdmin):
    list_display = ('numero_dossier', 'type_demande', 'numero_titre', 'date_permis')
    search_fields = ('numero_dossier', 'numero_decision', 'numero_titre')
    list_filter = ('type_demande', 'nature_demande')
    date_hierarchy = 'date_permis'

@admin.register(PaiementTNB)
class PaiementTNBAdmin(admin.ModelAdmin):
    list_display = ('quittance', 'taxe_tnb', 'date_paiement', 'rubrique')
    search_fields = ('quittance', 'rubrique')
    date_hierarchy = 'date_paiement'

@admin.register(PaiementPermisUrbanisme)
class PaiementPermisUrbanismeAdmin(admin.ModelAdmin):
    list_display = ('ref_permis_id', 'montant', 'quittance', 'date_paiement')
    search_fields = ('quittance', 'quittance_occupation')
    list_filter = ('rubrique',)
    date_hierarchy = 'date_paiement'

@admin.register(SuiviTravaux)
class SuiviTravauxAdmin(admin.ModelAdmin):
    list_display = ('phase_construction', 'percentage', 'date')
    search_fields = ('phase_construction',)
    date_hierarchy = 'date'


@admin.register(PermisCommercial)
class PermisCommercialAdmin(admin.ModelAdmin):
    list_display = ('numero_permis', 'activite', 'specialite', 'date_permis', 'autorise', 'exonere')
    search_fields = ('numero_permis', 'activite', 'specialite')
    list_filter = ('autorise', 'exonere', 'annexe', 'arrondissement')
    date_hierarchy = 'date_permis'

@admin.register(Inspection)
class InspectionAdmin(admin.ModelAdmin):
    list_display = ('inspection_technicien', 'date', 'type_occupation', 'surface')
    search_fields = ('inspection_technicien', 'type_occupation')
    list_filter = ('date',)
    date_hierarchy = 'date'

class MarchesAdmin(admin.ModelAdmin):
    list_display = ('nom_du_marche', 'annexe', 'numero_secteur', 'surface_totale')
    search_fields = ('nom_du_marche', 'lotissement')
    list_filter = ('annexe',)

@admin.register(Espace)
class EspaceAdmin(admin.ModelAdmin):
    list_display = ('numero_d_espace', 'exploitant_requerant', 'prix')
    search_fields = ('numero_d_espace',)

@admin.register(PaiementExploitation)
class PaiementExploitationAdmin(admin.ModelAdmin):
    list_display = ('quittance', 'montant', 'rubrique', 'date_du_dernier_paiement', 'nouvelle_date_de_paiement')
    search_fields = ('quittance',)
    list_filter = ('rubrique',)
    date_hierarchy = 'date_du_dernier_paiement'

# Register GIS models with OSMGeoAdmin for better spatial data handling
@admin.register(EspaceVert)
class EspaceVertAdmin(GISModelAdmin):
    list_display = ('nom', 'type_espace', 'surface', 'nombre_arbres', 'gestionnaire', 'statut', 'date_creation')
    search_fields = ('nom', 'gestionnaire', 'description')
    list_filter = ('type_espace', 'statut', 'date_creation')
    readonly_fields = ('date_ajout', 'date_modification')
    fieldsets = (
        ('Informations générales', {
            'fields': ('nom', 'type_espace', 'statut', 'date_creation')
        }),
        ('Caractéristiques', {
            'fields': ('surface', 'nombre_arbres', 'description')
        }),
        ('Gestion', {
            'fields': ('gestionnaire',)
        }),
        ('Localisation', {
            'fields': ('geom',)
        }),
        ('Métadonnées', {
            'fields': ('date_ajout', 'date_modification'),
            'classes': ('collapse',)
        }),
    )
    
    default_zoom = 12
    map_width = 800
    map_height = 500
    
    # Amélioration de l'interface d'admin
    save_on_top = True
    list_per_page = 20

@admin.register(Voirie)
class VoirieAdmin(admin.ModelAdmin):
    list_display = ('nom', 'type_voirie', 'largeur', 'etat', 'priorite')
    search_fields = ('nom',)
    list_filter = ('type_voirie', 'etat', 'priorite')

@admin.register(PermisSante)
class PermisSanteAdmin(admin.ModelAdmin):
    list_display = ('reference', 'delivreur', 'date', 'date_reception')
    search_fields = ('reference', 'delivreur')
    date_hierarchy = 'date'

@admin.register(SportCulture)
class SportCultureAdmin(admin.ModelAdmin):
    list_display = ('nom', 'type_etablissement', 'activite_principale', 'capacite', 'gestionnaire')
    search_fields = ('nom', 'gestionnaire', 'activite_principale')
    list_filter = ('type_etablissement',)

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name', 'description')
    date_hierarchy = 'created_at'