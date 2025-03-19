# Generated by Django 5.1.6 on 2025-03-18 13:50

import django.contrib.gis.db.models.fields
import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EspaceVert',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(help_text="Nom de l'espace vert (ex. « Parc de la Liberté », « Jardin Public »)", max_length=255)),
                ('type_espace', models.CharField(help_text="Type d'espace vert (parc, jardin, square, etc.)", max_length=255)),
                ('surface', models.FloatField(help_text='Surface totale (en m² ou ha)')),
                ('nombre_arbres', models.IntegerField(blank=True, help_text="Nombre approximatif d'arbres ou d'arbustes", null=True)),
                ('gestionnaire', models.CharField(help_text="Service ou entité responsable de l'entretien (ex. Mairie, Société privée)", max_length=255)),
                ('statut', models.CharField(help_text='Statut général (ouvert au public, en rénovation, fermé temporairement, etc.)', max_length=255)),
                ('date_creation', models.DateField(blank=True, help_text='Date de création/plantation ou inauguration', null=True)),
                ('description', models.TextField(blank=True, help_text='Informations complémentaires (ex. présence de fontaines, espaces de jeux, etc.)')),
                ('geom', django.contrib.gis.db.models.fields.PolygonField(blank=True, help_text="Géométrie (polygone représentant les limites de l'espace vert)", null=True, srid=4326)),
                ('date_modification', models.DateTimeField(auto_now=True, help_text='Date de dernière modification')),
                ('date_ajout', models.DateTimeField(auto_now_add=True, help_text="Date d'ajout dans le système")),
            ],
            options={
                'verbose_name': 'Espace vert',
                'verbose_name_plural': 'Espaces verts',
                'ordering': ['nom'],
            },
        ),
        migrations.CreateModel(
            name='Inspection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('inspection_technicien', models.CharField(max_length=255)),
                ('type_occupation', models.CharField(choices=[('الملك الجماعي عاري m²', 'الملك الجماعي عاري m²'), ('الملك الجماعي مغطى m²', 'الملك الجماعي مغطى m²'), ('لوحة إشهارية m²', 'لوحة إشهارية m²'), ('نصب اشهاري', 'نصب اشهاري')], max_length=255)),
                ('surface', models.FloatField()),
                ('observations', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Marches',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom_du_marche', models.CharField(max_length=255)),
                ('annexe', models.IntegerField()),
                ('numero_secteur', models.IntegerField(blank=True, null=True)),
                ('numero_lot', models.IntegerField(blank=True, null=True)),
                ('lotissement', models.CharField(blank=True, max_length=255, null=True)),
                ('avenue', models.TextField(blank=True, null=True)),
                ('rue', models.TextField(blank=True, null=True)),
                ('surface_totale', models.FloatField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PaiementExploitation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quittance', models.IntegerField()),
                ('montant', models.FloatField()),
                ('rubrique', models.IntegerField()),
                ('date_du_dernier_paiement', models.DateField()),
                ('nouvelle_date_de_paiement', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='PaiementPermisUrbanisme',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ref_permis_id', models.CharField(max_length=255)),
                ('montant', models.DecimalField(decimal_places=2, max_digits=10)),
                ('quittance', models.IntegerField()),
                ('date_paiement', models.DateField()),
                ('montant_occupation', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('quittance_occupation', models.IntegerField(blank=True, null=True)),
                ('date_paiement_occupation', models.DateField(blank=True, null=True)),
                ('periode_occupation', models.IntegerField(blank=True, null=True)),
                ('rubrique', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='PaiementTNB',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('taxe_tnb', models.DecimalField(decimal_places=2, max_digits=10)),
                ('quittance', models.CharField(max_length=100)),
                ('date_paiement', models.DateField()),
                ('rubrique', models.CharField(max_length=100)),
                ('observations', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Parcelle',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('annexe', models.IntegerField()),
                ('numero_secteur', models.IntegerField(blank=True, null=True)),
                ('numero_lot', models.CharField(blank=True, max_length=255, null=True)),
                ('lotissement', models.CharField(blank=True, max_length=255, null=True)),
                ('consistance', models.CharField(blank=True, max_length=255, null=True)),
                ('avenue', models.CharField(blank=True, max_length=255, null=True)),
                ('rue', models.CharField(blank=True, max_length=255, null=True)),
                ('numero', models.IntegerField(blank=True, null=True)),
                ('titre', models.IntegerField()),
                ('surface_totale', models.FloatField(blank=True, null=True)),
                ('surface_taxable', models.FloatField(blank=True, null=True)),
                ('sdau', models.CharField(blank=True, max_length=255, null=True)),
                ('date_eclatement', models.DateField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PermisCommercial',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('autorise', models.BooleanField(default=False)),
                ('exonere', models.BooleanField(default=False)),
                ('activite', models.CharField(max_length=255)),
                ('specialite', models.CharField(blank=True, max_length=255, null=True)),
                ('adresse', models.TextField(blank=True, null=True)),
                ('annexe', models.IntegerField()),
                ('arrondissement', models.IntegerField()),
                ('observations', models.TextField(blank=True, null=True)),
                ('date_permis', models.DateField()),
                ('numero_permis', models.CharField(max_length=255, unique=True)),
                ('reparations', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PermisRegie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero_de_quittance', models.CharField(max_length=255, unique=True)),
                ('requérant', models.CharField(max_length=255)),
                ('localisation', models.TextField()),
                ('type_permis', models.CharField(choices=[('Domaine public nu', 'Domaine public nu (ملك جماعي عار)'), ('Domaine public couvert', 'Domaine public couvert (ملك جماعي مغطى)'), ('Panneau publicitaire', 'Panneau publicitaire (لوحة اشهارية)'), ('Installation publicitaire', 'نصب اشهاري (Installation publicitaire)'), ('Boisson', 'المشروبات (Boisson)')], max_length=255)),
                ('date_de_paiement', models.DateField(default=django.utils.timezone.now)),
                ('surface', models.FloatField()),
                ('type_de_mesure', models.CharField(choices=[('Derivee de regulations de la taxation', 'Dérivée de régulations de la taxation')], max_length=255)),
                ('rubrique', models.CharField(max_length=255)),
                ('type_de_permis', models.IntegerField()),
                ('dernier_paiement', models.DateField(default=django.utils.timezone.now)),
                ('observations', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PermisSante',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_reception', models.DateField()),
                ('delivreur', models.CharField(max_length=255)),
                ('reference', models.CharField(max_length=255)),
                ('observations', models.TextField(blank=True, null=True)),
                ('date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='PermisUrbanisme',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_demande', models.CharField(choices=[('Permis de construction', 'Permis de construction'), ("Permis d'habiter", "Permis d'habiter"), ('Permis de reparation', 'Permis de reparation'), ('Permis de démolition', 'Permis de démolition'), ("Permis de renouvellement d'occupation du domaine public", "Permis de renouvellement d'occupation du domaine public"), ("Permis d'établissement de segmentation", "Permis d'établissement de segmentation"), ('Permis pour créer un groupe résidentiel', 'Permis pour créer un groupe résidentiel'), ('Permis de construire pour petits projets', 'Permis de construire pour petits projets'), ('Permis de construire pour grands projets', 'Permis de construire pour grands projets')], max_length=255)),
                ('nature_demande', models.CharField(choices=[('Nouvelle demande', 'Nouvelle demande'), ('Renouvellement', 'Renouvellement'), ('Modification', 'Modification'), ('Transfert', 'Transfert')], max_length=255)),
                ('adresse', models.TextField()),
                ('numero_dossier', models.CharField(max_length=255)),
                ('numero_titre', models.IntegerField()),
                ('date_retrait', models.DateField()),
                ('mois_concerne', models.CharField(blank=True, max_length=255, null=True)),
                ('numero_decision', models.CharField(max_length=255)),
                ('date_permis', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='PersonneMorale',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rc', models.IntegerField()),
                ('raison_sociale', models.CharField(max_length=255)),
                ('if_field', models.IntegerField(blank=True, null=True)),
                ('ice', models.TextField(blank=True, null=True)),
                ('adresse_domicile', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PersonnePhysique',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=255)),
                ('prenom', models.CharField(max_length=255)),
                ('cnie', models.CharField(max_length=255)),
                ('telephone', models.IntegerField(blank=True, null=True)),
                ('adresse', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SportCulture',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=255)),
                ('type_etablissement', models.CharField(max_length=255)),
                ('activite_principale', models.CharField(max_length=255)),
                ('capacite', models.IntegerField()),
                ('horaires_ouverture', models.TextField()),
                ('gestionnaire', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('geom', django.contrib.gis.db.models.fields.PointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='SuiviTravaux',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('percentage', models.IntegerField()),
                ('observations', models.TextField()),
                ('date', models.DateField()),
                ('phase_construction', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Voirie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=255)),
                ('type_voirie', models.CharField(choices=[('Rue', 'Rue'), ('Avenue', 'Avenue'), ('Boulevard', 'Boulevard')], max_length=255)),
                ('largeur', models.FloatField()),
                ('etat', models.CharField(choices=[('Bon', 'Bon'), ('Moyen', 'Moyen'), ('Mauvais', 'Mauvais')], max_length=255)),
                ('priorite', models.CharField(choices=[('Haute', 'Haute'), ('Moyenne', 'Moyenne'), ('Basse', 'Basse')], max_length=255)),
                ('observations', models.TextField()),
                ('geom', django.contrib.gis.db.models.fields.LineStringField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Espace',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero_d_espace', models.CharField(max_length=255)),
                ('prix', models.FloatField()),
                ('exploitant_requerant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.personnephysique')),
            ],
        ),
    ]
