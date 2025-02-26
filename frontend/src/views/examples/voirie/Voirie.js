import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'views/examples/regie-marches/Styletable.css';  // Assurez-vous d'utiliser ce CSS

const Voirie = () => {
  const [voiries, setVoiries] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    type_voirie: '',
    largeur: '',
    etat: '',
    priorite: '',
    observations: '',
    geom: '',
  });

  // Charger les données de voirie depuis l'API
  useEffect(() => {
    axios.get('http://localhost:8000/api/voiries/')
      .then(response => {
        setVoiries(response.data);
      })
      .catch(error => {
        console.error('Erreur de récupération des données de voirie', error);
      });
  }, []);

  // Gérer la modification des valeurs dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Ajouter une nouvelle voie
  const handleAddVoirie = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/voiries/', formData)
      .then(response => {
        setVoiries([...voiries, response.data]);
        setFormData({ nom: '', type_voirie: '', largeur: '', etat: '', priorite: '', observations: '', geom: '' });
      })
      .catch(error => {
        console.error('Erreur d’ajout de voirie', error);
      });
  };

  // Modifier une voie existante
  const handleEditVoirie = (id) => {
    const voirie = voiries.find(v => v.id === id);
    setFormData({
      nom: voirie.nom,
      type_voirie: voirie.type_voirie,
      largeur: voirie.largeur,
      etat: voirie.etat,
      priorite: voirie.priorite,
      observations: voirie.observations,
      geom: voirie.geom,
    });
  };

  // Supprimer une voie
  const handleDeleteVoirie = (id) => {
    axios.delete(`http://localhost:8000/api/voiries/${id}/`)
      .then(() => {
        setVoiries(voiries.filter(v => v.id !== id));
      })
      .catch(error => {
        console.error('Erreur de suppression de voirie', error);
      });
  };

  return (
    <div className="table-container">
      <h2>Gestion des Voiries</h2>
      <form onSubmit={handleAddVoirie}>
        <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} placeholder="Nom de la voie" required />
        <input type="text" name="type_voirie" value={formData.type_voirie} onChange={handleInputChange} placeholder="Type de voirie" required />
        <input type="number" step="0.01" name="largeur" value={formData.largeur} onChange={handleInputChange} placeholder="Largeur (en mètres)" required />
        <input type="text" name="etat" value={formData.etat} onChange={handleInputChange} placeholder="État de la voirie" required />
        <input type="text" name="priorite" value={formData.priorite} onChange={handleInputChange} placeholder="Priorité d'entretien" required />
        <textarea name="observations" value={formData.observations} onChange={handleInputChange} placeholder="Observations" required />
        <input type="text" name="geom" value={formData.geom} onChange={handleInputChange} placeholder="Géométrie (ligne)" required />
        <button type="submit">Ajouter</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Largeur</th>
            <th>État</th>
            <th>Priorité</th>
            <th>Observations</th>
            <th>Géométrie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {voiries.map(voirie => (
            <tr key={voirie.id}>
              <td>{voirie.nom}</td>
              <td>{voirie.type_voirie}</td>
              <td>{voirie.largeur}</td>
              <td>{voirie.etat}</td>
              <td>{voirie.priorite}</td>
              <td>{voirie.observations}</td>
              <td>{voirie.geom}</td>
              <td>
                <button className="edit" onClick={() => handleEditVoirie(voirie.id)}>
                  <i className="fa fa-pencil"></i>
                </button>
                <button className="delete" onClick={() => handleDeleteVoirie(voirie.id)}>
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

export default Voirie;
