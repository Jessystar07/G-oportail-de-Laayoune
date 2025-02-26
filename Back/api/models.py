from django.db import models
from django.contrib.gis.db import models
# Principal Model
class Parcelle(models.Model):
    annexe = models.IntegerField()
    numero_secteur = models.IntegerField(null=True, blank=True)
    numero_lot = models.CharField(max_length=255, null=True, blank=True)
    lotissement = models.CharField(max_length=255, null=True, blank=True)
    consistance = models.CharField(max_length=255, null=True, blank=True)
    avenue = models.CharField(max_length=255, null=True, blank=True)
    rue = models.CharField(max_length=255, null=True, blank=True)
    numero = models.IntegerField(null=True, blank=True)
    titre = models.IntegerField()
    surface_totale = models.FloatField(null=True, blank=True)
    surface_taxable = models.FloatField(null=True, blank=True)
    sdau = models.CharField(max_length=255, null=True, blank=True)
    date_eclatement = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Parcelle {self.numero}"
#permi regie


class PermisRegie(models.Model):
    autorise = models.BooleanField(default=False)
    exonere = models.BooleanField(default=False)
    activite = models.CharField(max_length=255)
    specialite = models.CharField(max_length=255, blank=True, null=True)
    adresse = models.TextField(blank=True, null=True)
    annexe = models.IntegerField()
    arrondissement = models.IntegerField()
    observations = models.TextField(blank=True, null=True)
    date_de_permis = models.DateField()
    numero_de_permis = models.CharField(max_length=255, unique=True)
    reparations = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"PermisRegie {self.numero_de_permis} - {self.activite}"


# Personne Physique Model
class PersonnePhysique(models.Model):
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    cnie = models.CharField(max_length=255)
    telephone = models.IntegerField(null=True, blank=True)
    adresse = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.nom} {self.prenom}"

# Personne Morale Model
class PersonneMorale(models.Model):
    rc = models.IntegerField()
    raison_sociale = models.CharField(max_length=255)
    if_field = models.IntegerField(null=True, blank=True)  # Changed from 'if'
    ice = models.TextField(null=True, blank=True)
    adresse_domicile = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.raison_sociale

# Urbanisme Model
class Permis_Urbanisme(models.Model):
    type_demande = models.CharField(max_length=255)
    nature_demande = models.CharField(max_length=255)
    adresse = models.TextField()
    numero_dossier = models.CharField(max_length=255)
    numero_titre = models.IntegerField()
    date_retrait = models.DateField()
    mois_concerne = models.CharField(max_length=255, null=True, blank=True)
    numero_decision = models.CharField(max_length=255)
    date_permis = models.DateField()

    def __str__(self):
        return f"Permis_Urbanisme {self.numero_dossier}"

# Regie Urbanisme Model
class Paiement_TNB(models.Model):
    taxe_tnb = models.FloatField()
    quittance = models.IntegerField()
    date_paiement = models.DateField()
    rubrique = models.CharField(max_length=255)
    observations = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"Paiement_TNB {self.quittance}"

class PaiementPermisUrbanisme(models.Model):
    ref_permis = models.ForeignKey(Permis_Urbanisme, on_delete=models.CASCADE)
    montant = models.FloatField()
    quittance = models.IntegerField()
    date_paiement = models.DateField()
    montant_occupation = models.FloatField(null=True, blank=True)
    quittance_occupation = models.IntegerField(null=True, blank=True)
    date_paiement_occupation = models.DateField(null=True, blank=True)
    periode_occupation = models.IntegerField(null=True, blank=True)
    rubrique = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Paiement Permis Urbanisme {self.ref_permis.numero_dossier}"

# Annexes Urbanisme Model
class SuiviTravaux(models.Model):
    percentage = models.FloatField()
    observations = models.TextField(null=True, blank=True)
    date = models.DateField()
    phase_construction = models.CharField(max_length=255)

    def __str__(self):
        return f"SuiviTravaux {self.phase_construction}"

# Services Commerciaux Model
class PermisCommercial(models.Model):
    autorise = models.BooleanField()
    exonere = models.BooleanField()
    activite = models.CharField(max_length=255)
    specialite = models.CharField(max_length=255, null=True, blank=True)
    adresse = models.TextField(null=True, blank=True)
    annexe = models.IntegerField()
    arrondissement = models.IntegerField()
    observations = models.TextField(null=True, blank=True)
    date_permis = models.DateField()
    numero_permis = models.CharField(max_length=255)
    reparations = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"PermisCommercial {self.numero_permis}"

class Inspection(models.Model):
    date = models.DateField()
    inspection_technicien = models.CharField(max_length=255)
    type_occupation = models.CharField(max_length=255)
    surface = models.FloatField()
    observations = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Inspection {self.inspection_technicien}"

# GIS (Spatial Data) Model (example for a market)
class Marches(models.Model):
    nom_du_marche = models.CharField(max_length=255)
    annexe = models.IntegerField()
    numero_secteur = models.IntegerField(null=True, blank=True)
    numero_lot = models.IntegerField(null=True, blank=True)
    lotissement = models.CharField(max_length=255, null=True, blank=True)
    avenue = models.TextField(null=True, blank=True)
    rue = models.TextField(null=True, blank=True)
    surface_totale = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.nom_du_marche

class Espace(models.Model):
    exploitant_requerant = models.ForeignKey(PersonnePhysique, on_delete=models.CASCADE)
    numero_d_espace = models.CharField(max_length=255)
    prix = models.FloatField()

    def __str__(self):
        return self.numero_d_espace

# Regie - Marches Commerciaux Model
class Paiement_Exploitation(models.Model):
    quittance = models.IntegerField()
    montant = models.FloatField()
    rubrique = models.IntegerField()
    date_du_dernier_paiement = models.DateField()
    nouvelle_date_de_paiement = models.DateField()

    def __str__(self):
        return f"Quittance: {self.quittance}, Montant: {self.montant}, Rubrique: {self.rubrique}"
    def save(self, *args, **kwargs):
        # Calculer le montant basé sur le prix d'espace et le nombre de mois
        self.montant = self.rubrique * 100  # Exemple de calcul, vous pouvez ajuster le calcul ici
        # Calculer la nouvelle date de paiement
        if self.date_du_dernier_paiement and self.rubrique:
            self.nouvelle_date_de_paiement = self.date_du_dernier_paiement + timedelta(days=self.rubrique * 30)  # Exemple de calcul pour ajouter les mois
        super().save(*args, **kwargs)
# Spatial Models
class EspaceVert(models.Model):
    nom = models.CharField(max_length=255)
    type_espace = models.CharField(max_length=255)
    surface = models.FloatField()
    nombre_arbres = models.IntegerField()
    gestionnaire = models.CharField(max_length=255)
    statut = models.CharField(max_length=255)
    date_creation = models.DateField()
    description = models.TextField()
    
    geom = models.PolygonField()  # Spatial geometry

class Voirie(models.Model):
    nom = models.CharField(max_length=255)
    type_voirie = models.CharField(max_length=255)
    largeur = models.FloatField()
    etat = models.CharField(max_length=255)
    priorite = models.CharField(max_length=255)
    observations = models.TextField()
    
    geom = models.LineStringField()  # Spatial line geometry
    
# Modèle Permis Santé
class PermisSante(models.Model):
    date_reception = models.DateField()
    delivreur = models.CharField(max_length=255)
    reference = models.CharField(max_length=255)
    observations = models.TextField(null=True, blank=True)
    date = models.DateField()

    def __str__(self):
        return f"PermisSante {self.reference}"  


class SportCulture(models.Model):
    nom = models.CharField(max_length=255)
    type_etablissement = models.CharField(max_length=255)
    activite_principale = models.CharField(max_length=255)
    capacite = models.IntegerField()
    horaires_ouverture = models.TextField()
    gestionnaire = models.CharField(max_length=255)
    description = models.TextField()
    geom = models.PointField(srid=4326)
    def __str__(self):
        return f"{self.nom} - {self.type_etablissement}"

class Item(models.Model):
    """
    Model representing an item in the system.
    Each item has a name, a description, and a creation date.
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:

        return self.name
