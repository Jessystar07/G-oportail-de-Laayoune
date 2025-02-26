import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SportCulture = () => {
  const [sportCultures, setSportCultures] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    type_etablissement: '',
    activite_principale: '',
    capacite: '',
    horaires_ouverture: '',
    gestionnaire: '',
    description: '',
    geom: '',
  });

  // Charger les données de Sport & Culture depuis l'API
  useEffect(() => {
    axios.get('http://localhost:8000/api/sport_cultures/')
      .then(response => {
        setSportCultures(response.data);
      })
      .catch(error => {
        console.error('Erreur de récupération des données de Sport & Culture', error);
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

  // Ajouter un nouvel équipement ou lieu
  const handleAddSportCulture = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/sport_cultures/', formData)
      .then(response => {
        setSportCultures([...sportCultures, response.data]);
        setFormData({
          nom: '',
          type_etablissement: '',
          activite_principale: '',
          capacite: '',
          horaires_ouverture: '',
          gestionnaire: '',
          description: '',
          geom: ''
        });
      })
      .catch(error => {
        console.error('Erreur d’ajout de Sport & Culture', error);
      });
  };

  // Modifier un équipement ou lieu existant
  const handleEditSportCulture = (id) => {
    const sportCulture = sportCultures.find(sc => sc.id === id);
    setFormData({
      nom: sportCulture.nom,
      type_etablissement: sportCulture.type_etablissement,
      activite_principale: sportCulture.activite_principale,
      capacite: sportCulture.capacite,
      horaires_ouverture: sportCulture.horaires_ouverture,
      gestionnaire: sportCulture.gestionnaire,
      description: sportCulture.description,
      geom: sportCulture.geom,
    });
  };

  // Supprimer un équipement ou lieu
  const handleDeleteSportCulture = (id) => {
    axios.delete(`http://localhost:8000/api/sport_cultures/${id}/`)
      .then(() => {
        setSportCultures(sportCultures.filter(sc => sc.id !== id));
      })
      .catch(error => {
        console.error('Erreur de suppression de Sport & Culture', error);
      });
  };

  return (
    <div className="table-container">
      <h2>Gestion des Équipements Sportifs et Culturels</h2>
      <form onSubmit={handleAddSportCulture}>
        <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} placeholder="Nom de l’équipement" required />
        <input type="text" name="type_etablissement" value={formData.type_etablissement} onChange={handleInputChange} placeholder="Type d’établissement" required />
        <input type="text" name="activite_principale" value={formData.activite_principale} onChange={handleInputChange} placeholder="Activité principale" required />
        <input type="number" name="capacite" value={formData.capacite} onChange={handleInputChange} placeholder="Capacité d’accueil" required />
        <textarea name="horaires_ouverture" value={formData.horaires_ouverture} onChange={handleInputChange} placeholder="Horaires d’ouverture" required />
        <input type="text" name="gestionnaire" value={formData.gestionnaire} onChange={handleInputChange} placeholder="Gestionnaire" required />
        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required />
        <input type="text" name="geom" value={formData.geom} onChange={handleInputChange} placeholder="Géométrie (point)" required />
        <button type="submit">Ajouter</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Activité principale</th>
            <th>Capacité</th>
            <th>Horaires d’ouverture</th>
            <th>Gestionnaire</th>
            <th>Description</th>
            <th>Géométrie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sportCultures.map(sportCulture => (
            <tr key={sportCulture.id}>
              <td>{sportCulture.nom}</td>
              <td>{sportCulture.type_etablissement}</td>
              <td>{sportCulture.activite_principale}</td>
              <td>{sportCulture.capacite}</td>
              <td>{sportCulture.horaires_ouverture}</td>
              <td>{sportCulture.gestionnaire}</td>
              <td>{sportCulture.description}</td>
              <td>{sportCulture.geom}</td>
              <td>
                <button className="edit" onClick={() => handleEditSportCulture(sportCulture.id)}>
                  <i className="fa fa-pencil"></i>
                </button>
                <button className="delete" onClick={() => handleDeleteSportCulture(sportCulture.id)}>
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

export default SportCulture;
