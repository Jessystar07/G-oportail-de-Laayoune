# Generated by Django 5.1.6 on 2025-02-21 16:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_inspection_paiementpermisurbanisme_paiementtnb_and_more'),
    ]

    operations = [
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
            name='RegieMarches',
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
            name='Urbanisme',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type_demande', models.CharField(max_length=255)),
                ('nature_demande', models.CharField(max_length=255)),
                ('adresse', models.TextField()),
                ('numero_dossier', models.CharField(max_length=255)),
                ('numero_titre', models.IntegerField()),
                ('date_retrait', models.DateField()),
                ('mois_concerne', models.CharField(blank=True, max_length=255, null=True)),
                ('numero_decision', models.CharField(max_length=255)),
                ('date_permis', models.DateField()),
            ],
        ),
        migrations.RenameModel(
            old_name='PaiementTNB',
            new_name='RegieUrbanisme',
        ),
        migrations.AlterField(
            model_name='inspection',
            name='type_occupation',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='parcelle',
            name='annexe',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='permiscommercial',
            name='autorise',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='permiscommercial',
            name='exonere',
            field=models.BooleanField(),
        ),
        migrations.AlterField(
            model_name='personnemorale',
            name='if_field',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='personnephysique',
            name='telephone',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='suivitravaux',
            name='phase_construction',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterModelTable(
            name='inspection',
            table=None,
        ),
        migrations.AlterModelTable(
            name='paiementpermisurbanisme',
            table=None,
        ),
        migrations.AlterModelTable(
            name='parcelle',
            table=None,
        ),
        migrations.AlterModelTable(
            name='permiscommercial',
            table=None,
        ),
        migrations.AlterModelTable(
            name='personnemorale',
            table=None,
        ),
        migrations.AlterModelTable(
            name='personnephysique',
            table=None,
        ),
        migrations.AlterModelTable(
            name='regieurbanisme',
            table=None,
        ),
        migrations.AlterModelTable(
            name='suivitravaux',
            table=None,
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
        migrations.AlterField(
            model_name='paiementpermisurbanisme',
            name='ref_permis',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.urbanisme'),
        ),
        migrations.DeleteModel(
            name='Permis',
        ),
    ]
