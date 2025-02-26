import React, { useState } from "react";
import "views/examples/Principal/Parcelle"; // Assure-toi que ce fichier contient le style fourni

const Parcelle = () => {
  // États pour chaque table
  const [parcelles, setParcelles] = useState([]);
  const [personnesPhysiques, setPersonnesPhysiques] = useState([]);
  const [personnesMorales, setPersonnesMorales] = useState([]);

  // Fonction pour ajouter une ligne
  const addRow = (setData, defaultRow) => {
    setData((prevData) => [...prevData, defaultRow]);
  };

  // Fonction pour supprimer une ligne
  const removeRow = (setData, index) => {
    setData((prevData) => prevData.filter((_, i) => i !== index));
  };

  // Fonction pour modifier une cellule
  const handleInputChange = (setData, index, field, value) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[index][field] = value;
      return newData;
    });
  };

  return (
    <div className="table-container">
      {/* Table Parcelles */}
      <h2>Parcelles</h2>
      <button onClick={() => addRow(setParcelles, {
        numeroSecteur: "", numeroLot: "", lotissement: "", consistance: "",
        avenue: "", rue: "", numero: "", titre: "", surfaceTotale: "", 
        surfaceTaxable: "", sdau: "", dateEclatement: ""
      })}>Ajouter Parcelle</button>
      <table>
        <thead>
          <tr>
            <th>Numéro Secteur</th><th>Numéro Lot</th><th>Lotissement</th>
            <th>Consistance</th><th>Avenue</th><th>Rue</th><th>Numéro</th>
            <th>Titre</th><th>Surface Totale</th><th>Surface Taxable</th>
            <th>SDAU</th><th>Date Eclatement</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcelles.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((key) => (
                <td key={key}><input type="text" value={row[key]} 
                  onChange={(e) => handleInputChange(setParcelles, index, key, e.target.value)} /></td>
              ))}
              <td><button onClick={() => removeRow(setParcelles, index)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Table Personne Physique */}
      <h2>Requérant (Personne Physique)</h2>
      <button onClick={() => addRow(setPersonnesPhysiques, {
        nom: "", prenom: "", cnie: "", telephone: "", adresse: ""
      })}>Ajouter Personne Physique</button>
      <table>
        <thead>
          <tr><th>Nom</th><th>Prénom</th><th>CNIE</th><th>Téléphone</th><th>Adresse</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {personnesPhysiques.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((key) => (
                <td key={key}><input type="text" value={row[key]} 
                  onChange={(e) => handleInputChange(setPersonnesPhysiques, index, key, e.target.value)} /></td>
              ))}
              <td><button onClick={() => removeRow(setPersonnesPhysiques, index)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Table Personne Morale */}
      <h2>Requérant (Personne Morale)</h2>
      <button onClick={() => addRow(setPersonnesMorales, {
        rc: "", raisonSociale: "", if: "", ice: "", adresseDomicile: ""
      })}>Ajouter Personne Morale</button>
      <table>
        <thead>
          <tr><th>RC</th><th>Raison Sociale</th><th>IF</th><th>ICE</th><th>Adresse Domicile</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {personnesMorales.map((row, index) => (
            <tr key={index}>
              {Object.keys(row).map((key) => (
                <td key={key}><input type="text" value={row[key]} 
                  onChange={(e) => handleInputChange(setPersonnesMorales, index, key, e.target.value)} /></td>
              ))}
              <td><button onClick={() => removeRow(setPersonnesMorales, index)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Parcelle;
