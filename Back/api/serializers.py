import json
from rest_framework import serializers
from decimal import Decimal
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from django.contrib.gis.geos import GEOSGeometry, WKTReader

from .models import Parcelle, Item , PermisRegie,PersonnePhysique, PersonneMorale, PermisCommercial, SuiviTravaux, PaiementPermisUrbanisme, PaiementTNB, PermisUrbanisme,Espace,Marches,Inspection,SportCulture,PermisSante,Voirie,EspaceVert,PaiementExploitation


class ParcelleSerializer(serializers.ModelSerializer):
    """ vvv"""
    class Meta:
        model = Parcelle
        fields = '__all__'

class PersonnePhysiqueSerializer(serializers.ModelSerializer):
    """ vvv"""
    class Meta:
        model = PersonnePhysique
        fields = '__all__'

class PersonneMoraleSerializer(serializers.ModelSerializer):
    """ vvv"""
    class Meta:
        model = PersonneMorale
        fields = '__all__'
        
        
class PermisRegieSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermisRegie
        fields = '__all__'

class PermisCommercialSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermisCommercial
        fields = '__all__'
        
class InspectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inspection
        fields = ['id', 'date', 'inspection_technicien', 'type_occupation', 'surface', 'observations']
        
class SuiviTravauxSerializer(serializers.ModelSerializer):
    """ vvv"""
    class Meta:
        model = SuiviTravaux
        fields = '__all__'
        
class PaiementTNBSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaiementTNB
        fields = '__all__'
        
    def validate(self, data):
        """
        Custom validation to ensure the data is correct
        """
        # Ensure taxe_tnb is positive
        if data.get('taxe_tnb', 0) <= 0:
            raise serializers.ValidationError({"taxe_tnb": "La taxe TNB doit être supérieure à zéro."})
            
        return data


class PaiementPermisUrbanismeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaiementPermisUrbanisme
        fields = '__all__'
        
    def validate(self, data):
        """
        Custom validation to ensure the data is correct
        """
        # Ensure montant is positive
        if data.get('montant', 0) <= 0:
            raise serializers.ValidationError({"montant": "Le montant doit être supérieur à zéro."})
            
        # If montant_occupation is provided, ensure it's positive
        if data.get('montant_occupation') is not None and data.get('montant_occupation', 0) <= 0:
            raise serializers.ValidationError({"montant_occupation": "Le montant d'occupation doit être supérieur à zéro."})
            
        # Ensure date_paiement_occupation is provided if montant_occupation is provided
        if data.get('montant_occupation') and not data.get('date_paiement_occupation'):
            raise serializers.ValidationError({"date_paiement_occupation": "La date de paiement d'occupation est requise si un montant d'occupation est spécifié."})
            
        return data
    
    
    
class PermisUrbanismeSerializer(serializers.ModelSerializer):
    """ vvv """
    class Meta:
        model = PermisUrbanisme
        fields = '__all__'

        
class EspaceSerializer(serializers.ModelSerializer):
    numero_Espace = serializers.CharField(source='numero_d_espace')
    exploitant = serializers.CharField(source='exploitant_requerant', read_only=True)
    
    class Meta:
        model = Espace
        fields = ['id', 'numero_Espace', 'prix', 'exploitant', 'exploitant_requerant']
        extra_kwargs = {
            'exploitant_requerant': {'write_only': True}
        }

class MarchesSerializer(serializers.ModelSerializer):
    nom_marche = serializers.CharField(source='nom_du_marche')
    
    class Meta:
        model = Marches
        fields = ['id', 'nom_marche', 'annexe', 'numero_secteur', 'numero_lot', 
                 'lotissement', 'avenue', 'rue', 'surface_totale']

        

class SportCultureSerializer(serializers.ModelSerializer):
    """
    Serializer pour le modèle SportCulture.
    """
    class Meta:
        model = SportCulture
        fields = '__all__'


class PermisSanteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermisSante
        fields = '__all__'

class VoirieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voirie
        fields = ['id', 'nom', 'type_voirie', 'largeur', 'etat', 'priorite', 'observations', 'geom']

# GeoJSON serializer for GET operations
class VoirieGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Voirie
        geo_field = 'geom'
        fields = ['id', 'nom', 'type_voirie', 'largeur', 'etat', 'priorite', 'observations']

# Dans serializers.py


class EspaceVertSerializer(GeoFeatureModelSerializer):
    """
    Serializer pour le modèle EspaceVert avec support GeoJSON.
    """
    # Champs calculés
    surface_ha = serializers.SerializerMethodField()
    
    class Meta:
        model = EspaceVert
        geo_field = 'geom'
        fields = '__all__'
    
    def get_surface_ha(self, obj):
        """
        Convertit la surface de m² en hectares pour l'affichage
        """
        if obj.surface:
            return round(obj.surface / 10000, 2)
        return None
    
    def validate_geom(self, value):
        """
        Validation supplémentaire pour le champ géométrique
        """
        if value:
            # Vérifier que la géométrie est valide
            if not value.valid:
                value = value.buffer(0)  # Tente de corriger la géométrie
                if not value.valid:
                    raise serializers.ValidationError("La géométrie fournie n'est pas valide.")
        return value
    
    def to_internal_value(self, data):
        """
        Conversion des données d'entrée, notamment pour gérer le WKT
        """
        # Traitement spécial pour le champ géométrique
        if 'geom' in data and data['geom'] and isinstance(data['geom'], str):
            try:
                # Essayer de traiter comme WKT
                if data['geom'].startswith(('POLYGON', 'MULTIPOLYGON', 'POINT', 'LINESTRING')):
                    # Assurez-vous que les imports sont corrects
                    from django.contrib.gis.geos import WKTReader
                    reader = WKTReader()
                    data = data.copy()  # Éviter de modifier l'original
                    data['geom'] = reader.read(data['geom'])
                # Essayer de traiter comme GeoJSON
                elif data['geom'].startswith('{'):
                    try:
                        geojson = json.loads(data['geom'])
                        data = data.copy()
                        data['geom'] = GEOSGeometry(json.dumps(geojson))
                    except Exception as e:
                        raise serializers.ValidationError({'geom': f"Format GeoJSON invalide: {str(e)}"})
                # Gérer les chaînes vides
                elif not data['geom'].strip():
                    data = data.copy()
                    data['geom'] = None
                else:
                    raise serializers.ValidationError({'geom': "Format géométrique non reconnu"})
            except Exception as e:
                raise serializers.ValidationError({'geom': f"Format géométrique invalide: {str(e)}"})
        
        # Traiter les champs numériques
        try:
            if 'surface' in data and data['surface'] and not isinstance(data['surface'], (int, float)):
                data = data.copy() if not isinstance(data, dict) else data
                data['surface'] = float(data['surface'])
            
            if 'nombre_arbres' in data:
                if data['nombre_arbres'] == '':
                    data = data.copy() if not isinstance(data, dict) else data
                    data['nombre_arbres'] = None
                elif data['nombre_arbres'] is not None and not isinstance(data['nombre_arbres'], int):
                    data = data.copy() if not isinstance(data, dict) else data
                    data['nombre_arbres'] = int(data['nombre_arbres'])
        except (ValueError, TypeError) as e:
            field = 'surface' if 'surface' in str(e) else 'nombre_arbres'
            raise serializers.ValidationError({field: f"Valeur numérique invalide: {str(e)}"})
        
        return super().to_internal_value(data)


class EspaceVertSimpleSerializer(serializers.ModelSerializer):
    """
    Serializer simplifié pour certaines opérations sans GeoJSON.
    """
    class Meta:
        model = EspaceVert
        fields = '__all__'
    
    def to_representation(self, instance):
        """
        Personnalisation de la représentation des données
        """
        representation = super().to_representation(instance)
        
        # Convertir la géométrie en format WKT si elle existe
        if instance.geom:
            representation['geom'] = instance.geom.wkt
        
        return representation
    def to_internal_value(self, data):
        """
        Conversion des données d'entrée, notamment pour gérer le WKT
        """
        # Faisons une copie des données pour ne pas modifier l'original
        internal_data = data.copy()
        
        # Si geom est fourni comme une chaîne WKT
        if 'geom' in internal_data and internal_data['geom']:
            if isinstance(internal_data['geom'], str):
                try:
                    if internal_data['geom'].startswith(('POLYGON', 'POINT')):
                        # Convertir WKT en géométrie GEOS
                        from django.contrib.gis.geos import WKTReader
                        reader = WKTReader()
                        geom = reader.read(internal_data['geom'])
                        internal_data['geom'] = geom
                    elif internal_data['geom'].startswith('{'):
                        # Tenter de le traiter comme du GeoJSON
                        try:
                            geojson = json.loads(internal_data['geom'])
                            internal_data['geom'] = GEOSGeometry(json.dumps(geojson))
                        except Exception as e:
                            raise serializers.ValidationError({'geom': f"Format GeoJSON invalide: {str(e)}"})
                    else:
                        # Si la chaîne est vide, mettre à None
                        if not internal_data['geom'].strip():
                            internal_data['geom'] = None
                        else:
                            raise serializers.ValidationError({'geom': "Format géométrique non reconnu"})
                except Exception as e:
                    raise serializers.ValidationError({'geom': f"Format géométrique invalide: {str(e)}"})
        
        # Convertir les champs numériques si nécessaire
        try:
            if 'surface' in internal_data and internal_data['surface'] and not isinstance(internal_data['surface'], (int, float)):
                internal_data['surface'] = float(internal_data['surface'])
            
            if 'nombre_arbres' in internal_data:
                if internal_data['nombre_arbres'] == '':
                    internal_data['nombre_arbres'] = None
                elif internal_data['nombre_arbres'] is not None and not isinstance(internal_data['nombre_arbres'], int):
                    internal_data['nombre_arbres'] = int(internal_data['nombre_arbres'])
        except (ValueError, TypeError) as e:
            field = 'surface' if 'surface' in str(e) else 'nombre_arbres'
            raise serializers.ValidationError({field: f"Valeur numérique invalide: {str(e)}"})
        
        return super().to_internal_value(internal_data)

class PaiementExploitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaiementExploitation
        fields = ['id', 'quittance', 'montant', 'rubrique', 'date_du_dernier_paiement', 'nouvelle_date_de_paiement']
        
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
