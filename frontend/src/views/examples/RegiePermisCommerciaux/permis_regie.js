import React, { useState } from "react";
import axios from "axios";

const PermisRegie = () => {
  const [formData, setFormData] = useState({
    numero_quittance: "",
    requerant: "",
    localisation: "",
    type: "",
    date_paiement: "",
    surface: "",
    type_mesure: "",
    rubrique: "",
    type_permis: "",
    dernier_paiement: "",
    observations: "",
  });

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fonction pour envoyer les données à l'API
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/permis_regie/", formData)
      .then((response) => {
        alert("Permis ajouté avec succès !");
        setFormData({
          numero_quittance: "",
          requerant: "",
          localisation: "",
          type: "",
          date_paiement: "",
          surface: "",
          type_mesure: "",
          rubrique: "",
          type_permis: "",
          dernier_paiement: "",
          observations: "",
        });
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du permis", error);
      });
  };

  return (
    <div>
      <h2>Ajouter un Permis de Régie</h2>
      <form onSubmit={handleSubmit}>
        <table border="1">
          <thead>
            <tr>
              <th>Champ</th>
              <th>Valeur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Numéro de quittance</td>
              <td><input type="number" name="numero_quittance" value={formData.numero_quittance} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Requérant</td>
              <td><input type="text" name="requerant" value={formData.requerant} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Localisation</td>
              <td><input type="text" name="localisation" value={formData.localisation} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Type</td>
              <td>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="">Sélectionner...</option>
                  <option value="Domaine public nu">Domaine public nu (ملك جماعي عار)</option>
                  <option value="Domaine public couvert">Domaine public couvert (ملك جماعي مغطى)</option>
                  <option value="Panneau publicitaire">Panneau publicitaire (لوحة اشهارية)</option>
                  <option value="Installation publicitaire">Installation publicitaire (نصب اشهاري)</option>
                  <option value="Boisson">Boisson (المشروبات)</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Date de paiement</td>
              <td><input type="date" name="date_paiement" value={formData.date_paiement} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Surface</td>
              <td><input type="number" name="surface" value={formData.surface} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Type de mesure</td>
              <td>
                <select name="type_mesure" value={formData.type_mesure} onChange={handleChange} required>
                  <option value="">Sélectionner...</option>
                  <option value="Derivee de regulations de la taxation">Dérivée de régulations de la taxation</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Rubrique</td>
              <td><input type="text" name="rubrique" value={formData.rubrique} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Type de permis</td>
              <td><input type="number" name="type_permis" value={formData.type_permis} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>آخر دورة تم أداؤها</td>
              <td><input type="date" name="dernier_paiement" value={formData.dernier_paiement} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Observations</td>
              <td><input type="text" name="observations" value={formData.observations} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  );
};

export default PermisRegie;
