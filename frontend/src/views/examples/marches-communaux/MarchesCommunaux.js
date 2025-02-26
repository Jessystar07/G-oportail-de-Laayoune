import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'views/examples/regie-marches/Styletable.css';  // Assurez-vous d'utiliser ce CSS


const MarchesCommunaux = () => {
  const [espaces, setEspaces] = useState([]);
  const [marches, setMarches] = useState([]);
  const [exploitants, setExploitants] = useState([]);  // Pour récupérer les exploitants
  
  const [espaceFormData, setEspaceFormData] = useState({
    numero_espace: '',
    prix: '',
    exploitant: ''  // Référence à l'exploitant
  });

  const [marcheFormData, setMarcheFormData] = useState({
    nom_marche: '',
    annexe: '',
    numero_secteur: '',
    numero_lot: '',
    lotissement: '',
    avenue: '',
    rue: '',
    surface_totale: ''
  });

  // Charger les données des espaces, marchés et exploitants
  useEffect(() => {
    axios.get('http://localhost:8000/api/espaces/')
      .then(response => {
        setEspaces(response.data);
      })
      .catch(error => {
        console.error('Erreur de récupération des données des espaces', error);
      });

    axios.get('http://localhost:8000/api/marches/')
      .then(response => {
        setMarches(response.data);
      })
      .catch(error => {
        console.error('Erreur de récupération des données des marchés', error);
      });

    axios.get('http://localhost:8000/api/exploitants/')  // Récupérer les exploitants
      .then(response => {
        setExploitants(response.data);
      })
      .catch(error => {
        console.error('Erreur de récupération des exploitants', error);
      });
  }, []);

  // Gérer la modification des valeurs dans les formulaires
  const handleEspaceInputChange = (e) => {
    const { name, value } = e.target;
    setEspaceFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMarcheInputChange = (e) => {
    const { name, value } = e.target;
    setMarcheFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Ajouter un nouvel espace
  const handleAddEspace = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/espaces/', espaceFormData)
      .then(response => {
        setEspaces([...espaces, response.data]);
        setEspaceFormData({
          numero_espace: '',
          prix: '',
          exploitant: ''  // Réinitialiser la valeur de l'exploitant
        });
      })
      .catch(error => {
        console.error('Erreur d’ajout d’espace', error);
      });
  };

  // Ajouter un nouveau marché
  const handleAddMarche = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/marches/', marcheFormData)
      .then(response => {
        setMarches([...marches, response.data]);
        setMarcheFormData({
          nom_marche: '',
          annexe: '',
          numero_secteur: '',
          numero_lot: '',
          lotissement: '',
          avenue: '',
          rue: '',
          surface_totale: ''
        });
      })
      .catch(error => {
        console.error('Erreur d’ajout de marché', error);
      });
  };

  // Supprimer un espace
  const handleDeleteEspace = (id) => {
    axios.delete(`http://localhost:8000/api/espaces/${id}/`)
      .then(() => {
        setEspaces(espaces.filter(espace => espace.id !== id));
      })
      .catch(error => {
        console.error('Erreur de suppression d’espace', error);
      });
  };

  // Supprimer un marché
  const handleDeleteMarche = (id) => {
    axios.delete(`http://localhost:8000/api/marches/${id}/`)
      .then(() => {
        setMarches(marches.filter(marche => marche.id !== id));
      })
      .catch(error => {
        console.error('Erreur de suppression de marché', error);
      });
  };

  return (
    <div className="table-container">
      <h2>Gestion des Espaces et Marchés Communaux</h2>

      {/* Formulaire pour l'Espace */}
      <h3>Ajouter un Espace</h3>
      <form onSubmit={handleAddEspace}>
        <input type="text" name="numero_espace" value={espaceFormData.numero_espace} onChange={handleEspaceInputChange} placeholder="Numéro d’espace" required />
        <input type="number" name="prix" value={espaceFormData.prix} onChange={handleEspaceInputChange} placeholder="Prix" required />
        
        {/* Sélectionner l'exploitant (requérant) */}
        <select name="exploitant" value={espaceFormData.exploitant} onChange={handleEspaceInputChange} required>
          <option value="">Sélectionnez un exploitant</option>
          {exploitants.map(exploitant => (
            <option key={exploitant.id} value={exploitant.id}>
              {exploitant.nom} {/* Remplacez "nom" par le champ réel représentant l'exploitant */}
            </option>
          ))}
        </select>

        <button type="submit">Ajouter un Espace</button>
      </form>

      {/* Table des Espaces */}
      <table>
        <thead>
          <tr>
            <th>Numéro d’Espace</th>
            <th>Prix</th>
            <th>Exploitant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {espaces.map(espace => (
            <tr key={espace.id}>
              <td>{espace.numero_espace}</td>
              <td>{espace.prix}</td>
              <td>{espace.exploitant ? espace.exploitant.nom : 'Non défini'}</td>
              <td>
                <button className="delete" onClick={() => handleDeleteEspace(espace.id)}>
                  <i className="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulaire pour le Marché */}
      <h3>Ajouter un Marché</h3>
      <form onSubmit={handleAddMarche}>
        <input type="text" name="nom_marche" value={marcheFormData.nom_marche} onChange={handleMarcheInputChange} placeholder="Nom du Marché" required />
        <input type="number" name="annexe" value={marcheFormData.annexe} onChange={handleMarcheInputChange} placeholder="Annexe" required />
        <input type="number" name="numero_secteur" value={marcheFormData.numero_secteur} onChange={handleMarcheInputChange} placeholder="Numéro de Secteur" />
        <input type="number" name="numero_lot" value={marcheFormData.numero_lot} onChange={handleMarcheInputChange} placeholder="Numéro de Lot" />
        <input type="text" name="lotissement" value={marcheFormData.lotissement} onChange={handleMarcheInputChange} placeholder="Lotissement" />
        <textarea name="avenue" value={marcheFormData.avenue} onChange={handleMarcheInputChange} placeholder="Avenue" />
        <textarea name="rue" value={marcheFormData.rue} onChange={handleMarcheInputChange} placeholder="Rue" />
        <input type="number" name="surface_totale" value={marcheFormData.surface_totale} onChange={handleMarcheInputChange} placeholder="Surface Totale" />
        <button type="submit">Ajouter un Marché</button>
      </form>

      {/* Table des Marchés */}
      <table>
        <thead>
          <tr>
            <th>Nom du Marché</th>
            <th>Annexe</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {marches.map(marche => (
            <tr key={marche.id}>
              <td>{marche.nom_marche}</td>
              <td>{marche.annexe}</td>
              <td>
                <button className="delete" onClick={() => handleDeleteMarche(marche.id)}>
                  <i className="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MarchesCommunaux;
