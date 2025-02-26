from rest_framework import serializers
from .models import Parcelle, Item , PermisRegie,PersonnePhysique, PersonneMorale, PermisCommercial, SuiviTravaux, PaiementPermisUrbanisme, Paiement_TNB, Permis_Urbanisme,Espace,Marches,Inspection,SportCulture,PermisSante,Voirie,EspaceVert,Paiement_Exploitation

class ParcelleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parcelle
        fields = '__all__'

class PersonnePhysiqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = PersonnePhysique
        fields = '__all__'

class PersonneMoraleSerializer(serializers.ModelSerializer):
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

class SuiviTravauxSerializer(serializers.ModelSerializer):
    class Meta:
        model = SuiviTravaux
        fields = '__all__'
class PaiementPermisUrbanismeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaiementPermisUrbanisme
        fields = '__all__'
        
class Paiement_TNBSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paiement_TNB
        fields = '__all__'        
        
        
class Permis_UrbanismeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permis_Urbanisme
        fields = '__all__'
        
class EspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Espace
        fields = '__all__'

class MarchesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marches
        fields = '__all__'

class InspectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inspection
        fields = '__all__'
        
class SportCultureSerializer(serializers.ModelSerializer):
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
        fields = '__all__'

class EspaceVertSerializer(serializers.ModelSerializer):
    class Meta:
        model = EspaceVert
        fields = '__all__'

class Paiement_ExploitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paiement_Exploitation
        fields = '__all__'
        
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
