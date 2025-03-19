from datetime import timedelta
from django.utils import timezone  # Importation correcte
from django.db import models
from django.contrib.gis.db import models as geomodels  


# Principal Model
class Parcelle(models.Model):
    """
    Représente une parcelle dans un lotissement avec des informations associées telles que
    l'annexe, le numéro de secteur, la consistance, etc.
    """
    objects = models.Manager()
    annexe = models.IntegerField()
    numero_secteur = models.IntegerField(null=True, blank=True)
    numero_lot = models.CharField(max_length=255, null=True, blank=True)
    lotissement = models.CharField(max_length=255, null=True, blank=True)
    consistance = models.CharField(max_length=255, null=True, blank=True)  # Vérifiez l'orthographe ici
    avenue = models.CharField(max_length=255, null=True, blank=True)
    rue = models.CharField(max_length=255, null=True, blank=True)
    numero = models.IntegerField(null=True, blank=True)  # Assurez-vous que c'est bien ce champ à utiliser
    titre = models.IntegerField()
    surface_totale = models.FloatField(null=True, blank=True)
    surface_taxable = models.FloatField(null=True, blank=True)
    sdau = models.CharField(max_length=255, null=True, blank=True)
    date_eclatement = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"Parcelle {self.numero}"

class PersonnePhysique(models.Model):
    """
    Représente une personne physique avec des informations telles que le nom, le prénom,
    le numéro de CNIE, et les coordonnées de contact.
    """
    objects = models.Manager()
    nom = models.CharField(max_length=255)
    prenom = models.CharField(max_length=255)
    cnie = models.CharField(max_length=255)
    telephone = models.IntegerField(null=True, blank=True)
    addresse = models.TextField(null=True, blank=True)  

    def __str__(self):
        return f"{self.nom} {self.prenom}"

class PersonneMorale(models.Model):
    """
    Représente une personne morale avec des informations telles que le numéro RC,
    la raison sociale, et l'adresse.
    """
    objects = models.Manager()
    rc = models.IntegerField()
    raison_sociale = models.CharField(max_length=255)
    if_field = models.IntegerField(null=True, blank=True)  
    ice = models.TextField(null=True, blank=True)
    adresse_domicile = models.TextField(null=True, blank=True)  

    def __str__(self):
        return self.raison_sociale or "Nom de la personne morale inconnu"
# Permis Regie Model
class PermisRegie(models.Model):
    """
    Modèle représentant un permis de régie avec des informations sur le paiement, le type de permis,
    et les détails associés.
    """
    numero_de_quittance = models.CharField(max_length=255, unique=True)
    requérant = models.CharField(max_length=255)
    localisation = models.TextField()
    type_permis = models.CharField(
        max_length=255,
        choices=[("Domaine public nu", "Domaine public nu (ملك جماعي عار)"),
                 ("Domaine public couvert", "Domaine public couvert (ملك جماعي مغطى)"),
                 ("Panneau publicitaire", "Panneau publicitaire (لوحة اشهارية)"),
                 ("Installation publicitaire", "نصب اشهاري (Installation publicitaire)"),
                 ("Boisson", "المشروبات (Boisson)")],
    )  # Type de permis
    date_de_paiement = models.DateField(default=timezone.now)  # Utilisation de timezone.now()
    surface = models.FloatField()
    type_de_mesure = models.CharField(
        max_length=255,
        choices=[("Derivee de regulations de la taxation", "Dérivée de régulations de la taxation")]
    )  # Type de mesure
    rubrique = models.CharField(max_length=255)
    type_de_permis = models.IntegerField()
    dernier_paiement = models.DateField(default=timezone.now)  # Utilisation de timezone.now()
    observations = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"PermisRegie {self.numero_de_quittance} - {self.requérant}"



class PermisUrbanisme(models.Model):
    type_demande = models.CharField(
        max_length=255,
        choices=[
            ("Permis de construction", "Permis de construction"),
            ("Permis d'habiter", "Permis d'habiter"),
            ("Permis de reparation", "Permis de reparation"),
            ("Permis de démolition", "Permis de démolition"),
            ("Permis de renouvellement d'occupation du domaine public", "Permis de renouvellement d'occupation du domaine public"),
            ("Permis d'établissement de segmentation", "Permis d'établissement de segmentation"),
            ("Permis pour créer un groupe résidentiel", "Permis pour créer un groupe résidentiel"),
            ("Permis de construire pour petits projets", "Permis de construire pour petits projets"),
            ("Permis de construire pour grands projets", "Permis de construire pour grands projets")
        ]
    )
    nature_demande = models.CharField(
        max_length=255,
        choices=[
            ("Nouvelle demande", "Nouvelle demande"),
            ("Renouvellement", "Renouvellement"),
            ("Modification", "Modification"),
            ("Transfert", "Transfert")
        ]
    )
    adresse = models.TextField()
    numero_dossier = models.CharField(max_length=255)
    numero_titre = models.IntegerField()
    date_retrait = models.DateField()
    mois_concerne = models.CharField(max_length=255, null=True, blank=True)
    numero_decision = models.CharField(max_length=255)
    date_permis = models.DateField()

    def __str__(self):
        return f"PermisUrbanisme {self.numero_dossier}"


class PaiementTNB(models.Model):
    taxe_tnb = models.DecimalField(max_digits=10, decimal_places=2)
    quittance = models.CharField(max_length=100)
    date_paiement = models.DateField()    
    rubrique = models.CharField(max_length=100)
    observations = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"PaiementTNB {self.quittance}"


class PaiementPermisUrbanisme(models.Model):
    ref_permis_id = models.CharField(max_length=255)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    quittance = models.IntegerField()  # Doit être un entier
    date_paiement = models.DateField()
    montant_occupation = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    quittance_occupation = models.IntegerField(blank=True, null=True)  # Doit être un entier
    date_paiement_occupation = models.DateField(blank=True, null=True)
    periode_occupation = models.IntegerField(blank=True, null=True)  # Doit être un entier
    rubrique = models.CharField(max_length=255) 
    # Doit être un entier

    def __str__(self):
        return f"PaiementPermisUrbanisme {self.ref_permis_id} - {self.quittance}"


# Annexes Urbanisme Model
class SuiviTravaux(models.Model):
    """
    Modèle représentant le suivi des travaux de construction.
    """
    percentage = models.IntegerField()
    observations = models.TextField()
    date = models.DateField()
    phase_construction = models.CharField(max_length=100)  # Exemple

    def __str__(self):
        return f"{self.phase_construction} - {self.percentage}%"


# Services Commerciaux Model
class PermisCommercial(models.Model):
    """
    Modèle représentant un permis commercial, avec des informations sur l'autorisation, l'exonération,
    l'activité commerciale, et la date du permis.
    """
    objects = models.Manager()
    autorise = models.BooleanField(default=False)
    exonere = models.BooleanField(default=False)
    activite = models.CharField(max_length=255)
    specialite = models.CharField(max_length=255, null=True, blank=True)
    adresse = models.TextField(null=True, blank=True)
    annexe = models.IntegerField()
    arrondissement = models.IntegerField()
    observations = models.TextField(null=True, blank=True)
    date_permis = models.DateField()
    numero_permis = models.CharField(max_length=255, unique=True)
    reparations = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"PermisCommercial {self.numero_permis}"

class Inspection(models.Model):
    """
    Modèle représentant une inspection d'un site commercial, avec des informations sur
    le technicien, le type d'occupation, et les observations.
    """
    objects = models.Manager()
    # Suppression de la clé étrangère permis
    date = models.DateField()
    inspection_technicien = models.CharField(max_length=255)
    type_occupation = models.CharField(max_length=255, choices=[
        ('الملك الجماعي عاري m²', 'الملك الجماعي عاري m²'),
        ('الملك الجماعي مغطى m²', 'الملك الجماعي مغطى m²'),
        ('لوحة إشهارية m²', 'لوحة إشهارية m²'),
        ('نصب اشهاري', 'نصب اشهاري'),
    ])
    surface = models.FloatField()
    observations = models.TextField(null=True, blank=True)
    
    def __str__(self):
        return f"Inspection {self.inspection_technicien} - {self.date}"


class Marches(models.Model):
    """
    Représente un marché avec les informations associées, telles que le nom,
    le secteur, l'annexe, les coordonnées de l'emplacement, et la surface totale.
    """
    objects = models.Manager()
    nom_du_marche = models.CharField(max_length=255)  # Garder le nom original
    annexe = models.IntegerField()
    numero_secteur = models.IntegerField(null=True, blank=True)
    numero_lot = models.IntegerField(null=True, blank=True)
    lotissement = models.CharField(max_length=255, null=True, blank=True)
    avenue = models.TextField(null=True, blank=True)
    rue = models.TextField(null=True, blank=True)
    surface_totale = models.FloatField(null=True, blank=True)
    
    def __str__(self):
        return str(self.nom_du_marche) if self.nom_du_marche else "Nom du marché inconnu"

class Espace(models.Model):
    """
    Représente des espaces avec les informations associées.
    """
    objects = models.Manager()
    exploitant_requerant = models.ForeignKey('PersonnePhysique', on_delete=models.CASCADE)
    numero_d_espace = models.CharField(max_length=255)  # Garder le nom original
    prix = models.FloatField()
    
    def __str__(self):
        return str(self.numero_d_espace)


# Regie - Marches Commerciaux Model
class PaiementExploitation(models.Model):
    """
    Représente des PaiementExploitation avec les informations associées.
    """
    objects = models.Manager()
    quittance = models.IntegerField()
    montant = models.FloatField()
    rubrique = models.IntegerField()
    date_du_dernier_paiement = models.DateField()
    nouvelle_date_de_paiement = models.DateField()

    def __str__(self):
        return f"Quittance: {self.quittance}, Montant: {self.montant}, Rubrique: {self.rubrique}"

    def save(self, *args, **kwargs):
        # Calculer le montant basé sur le prix d'espace et le nombre de mois
        self.montant = self.rubrique * 100  # Exemple de calcul, ajustez selon les besoins
        # Calculer la nouvelle date de paiement
        if self.date_du_dernier_paiement and self.rubrique:
            self.nouvelle_date_de_paiement = self.date_du_dernier_paiement + timedelta(days=self.rubrique * 30)  # Exemple de calcul pour ajouter les mois
        super().save(*args, **kwargs)

# Spatial Models
class EspaceVert(models.Model):
    """
    Représente des espaces verts avec les informations associées.
    """
    objects = models.Manager()
    nom = models.CharField(max_length=255, help_text="Nom de l'espace vert (ex. « Parc de la Liberté », « Jardin Public »)")
    type_espace = models.CharField(max_length=255, help_text="Type d'espace vert (parc, jardin, square, etc.)")
    surface = models.FloatField(help_text="Surface totale (en m² ou ha)")
    nombre_arbres = models.IntegerField(null=True, blank=True, help_text="Nombre approximatif d'arbres ou d'arbustes")
    gestionnaire = models.CharField(max_length=255, help_text="Service ou entité responsable de l'entretien (ex. Mairie, Société privée)")
    statut = models.CharField(max_length=255, help_text="Statut général (ouvert au public, en rénovation, fermé temporairement, etc.)")
    date_creation = models.DateField(null=True, blank=True, help_text="Date de création/plantation ou inauguration")
    description = models.TextField(blank=True, help_text="Informations complémentaires (ex. présence de fontaines, espaces de jeux, etc.)")
    geom = geomodels.PolygonField(srid=4326, null=True, blank=True, help_text="Géométrie (polygone représentant les limites de l'espace vert)")
    
    # Ajout de champs pour mieux gérer les données
    date_modification = models.DateTimeField(auto_now=True, help_text="Date de dernière modification")
    date_ajout = models.DateTimeField(auto_now_add=True, help_text="Date d'ajout dans le système")
    
    # Définition des choix pour le type d'espace et le statut
    TYPE_CHOICES = [
        ('Parc', 'Parc'),
        ('Jardin', 'Jardin'),
        ('Square', 'Square'),
        ('Aire de jeux', 'Aire de jeux'),
        ('Espace naturel', 'Espace naturel'),
        ('Autre', 'Autre'),
    ]
    
    STATUT_CHOICES = [
        ('Ouvert au public', 'Ouvert au public'),
        ('En rénovation', 'En rénovation'),
        ('Fermé temporairement', 'Fermé temporairement'),
        ('Accès limité', 'Accès limité'),
        ('Autre', 'Autre'),
    ]
    
    def __str__(self):
        return f"{self.nom} - {self.type_espace} ({self.surface} m²)"
    
    class Meta:
        verbose_name = "Espace vert"
        verbose_name_plural = "Espaces verts"
        ordering = ['nom']


class Voirie(geomodels.Model):
    TYPE_CHOICES = [
        ('Rue', 'Rue'),
        ('Avenue', 'Avenue'),
        ('Boulevard', 'Boulevard'),
    ]
    
    ETAT_CHOICES = [
        ('Bon', 'Bon'),
        ('Moyen', 'Moyen'),
        ('Mauvais', 'Mauvais'),
    ]
    
    PRIORITE_CHOICES = [
        ('Haute', 'Haute'),
        ('Moyenne', 'Moyenne'),
        ('Basse', 'Basse'),
    ]

    nom = models.CharField(max_length=255)
    type_voirie = models.CharField(max_length=255, choices=TYPE_CHOICES)
    largeur = models.FloatField()
    etat = models.CharField(max_length=255, choices=ETAT_CHOICES)
    priorite = models.CharField(max_length=255, choices=PRIORITE_CHOICES)
    observations = models.TextField()
    geom = geomodels.LineStringField()
    objects = geomodels.Manager()
    def __str__(self):
        return f"{self.nom} ({self.type_voirie})"

# Modèle Permis Santé
class PermisSante(models.Model):
    """
    Représente des permis avec les informations associées.
    """
    date_reception = models.DateField()
    delivreur = models.CharField(max_length=255)  # Simple text field
    reference = models.CharField(max_length=255)
    observations = models.TextField(null=True, blank=True)
    date = models.DateField()

class SportCulture(models.Model):
    """
    Représente des équipements sportifs et culturels avec les informations associées.
    """
    objects = models.Manager()
    nom = models.CharField(max_length=255)
    type_etablissement = models.CharField(max_length=255)
    activite_principale = models.CharField(max_length=255)
    capacite = models.IntegerField()
    horaires_ouverture = models.TextField()
    gestionnaire = models.CharField(max_length=255)
    description = models.TextField()
    geom = geomodels.PointField(srid=4326)

    def __str__(self):
        return f"{self.nom} - {self.type_etablissement}"
    
    
class Item(models.Model):
    """
    Représente des items avec les informations associées.
    """
    objects = models.Manager()
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.name)  
