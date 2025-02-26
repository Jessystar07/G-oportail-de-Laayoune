import os
import django
import pandas as pd
from django.core.wsgi import get_wsgi_application
from api.models import Parcelle

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'geoportal.settings')
get_wsgi_application()

django.setup()



df = pd.read_excel('LAAYSIG DOCUMENTATION.xlsx')

# Insérer les données dans PostgreSQL
for index, row in df.iterrows():
    Parcelle.objects.create(
        annexe=row["Annexe"],
        numero_secteur=row["Numero de secteur"],
        numero_lot=row["Numero de lot"],
        lotissement=row["Lotissement"],
        consistance=row["Consisance"],
        avenue=row["Avenue"],
        rue=row["Rue"],
        numero=row["Numero"],
        titre=row["Titre"],
        surface_totale=row["Surface totale"],
        surface_taxable=row["Surface Taxable"],
        sdau=row["SDAU"],
        date_eclatement=row["Date Eclatement"],
        nom=row["Nom"],
        prenom=row["Prenom"],
        cnie=row["CNIE"],
        telephone=row["Telephone"],
        adresse=row["Addresse"],
        rc=row["RC"],
        raison_sociale=row["Raison Sociale"],
        if_entreprise=row["IF"],
        ice=row["ICE"],
        type_demande=row["Type de demande"],
        nature_demande=row["Nature de demande"],
        numero_dossier=row["Numero de dossier"],
        date_retrait=row["Date de retrait"],
        observations=row["Observations"]
    )

print("✅ Données importées avec succès !")
