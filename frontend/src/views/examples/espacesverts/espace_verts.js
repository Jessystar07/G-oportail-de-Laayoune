import React, { useState, useEffect } from 'react';
import axios from 'axios';
const EspaceVerts = () => {
  const [espacesVerts, setEspacesVerts] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    type_espace: '',
    surface: '',
    nombre_arbres: '',
    gestionnaire: '',
    statut: '',
    date_creation: '',
    description: '',
    geom: '',
  });

  // Charger les données des espaces verts depuis l'API
  useEffect(() => {
    axios.get('http://localhost:8000/api/espaces_verts/')
      .then(response => {
        setEspacesVerts(response.data);
      })
      .catch(error => {
        console.error('Erreur de récupération des données des espaces verts', error);
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

  // Ajouter un nouvel espace vert
  const handleAddEspaceVert = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/espaces_verts/', formData)
      .then(response => {
        setEspacesVerts([...espacesVerts, response.data]);
        setFormData({
          nom: '',
          type_espace: '',
          surface: '',
          nombre_arbres: '',
          gestionnaire: '',
          statut: '',
          date_creation: '',
          description: '',
          geom: '',
        });
      })
      .catch(error => {
        console.error('Erreur d’ajout d’espace vert', error);
      });
  };

  // Modifier un espace vert existant
  const handleEditEspaceVert = (id) => {
    const espaceVert = espacesVerts.find(ev => ev.id === id);
    setFormData({
      nom: espaceVert.nom,
      type_espace: espaceVert.type_espace,
      surface: espaceVert.surface,
      nombre_arbres: espaceVert.nombre_arbres,
      gestionnaire: espaceVert.gestionnaire,
      statut: espaceVert.statut,
      date_creation: espaceVert.date_creation,
      description: espaceVert.description,
      geom: espaceVert.geom,
    });
  };

  // Supprimer un espace vert
  const handleDeleteEspaceVert = (id) => {
    axios.delete(`http://localhost:8000/api/espaces_verts/${id}/`)
      .then(() => {
        setEspacesVerts(espacesVerts.filter(ev => ev.id !== id));
      })
      .catch(error => {
        console.error('Erreur de suppression d’espace vert', error);
      });
  };

  return (
    <div className="table-container">
      <h2>Gestion des Espaces Verts</h2>
      <form onSubmit={handleAddEspaceVert}>
        <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} placeholder="Nom de l’espace vert" required />
        <input type="text" name="type_espace" value={formData.type_espace} onChange={handleInputChange} placeholder="Type d’espace" required />
        <input type="number" name="surface" value={formData.surface} onChange={handleInputChange} placeholder="Surface totale (m² ou ha)" required />
        <input type="number" name="nombre_arbres" value={formData.nombre_arbres} onChange={handleInputChange} placeholder="Nombre d'arbres" required />
        <input type="text" name="gestionnaire" value={formData.gestionnaire} onChange={handleInputChange} placeholder="Gestionnaire" required />
        <input type="text" name="statut" value={formData.statut} onChange={handleInputChange} placeholder="Statut" required />
        <input type="date" name="date_creation" value={formData.date_creation} onChange={handleInputChange} placeholder="Date de création" required />
        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required />
        <input type="text" name="geom" value={formData.geom} onChange={handleInputChange} placeholder="Géométrie (polygone)" required />
        <button type="submit">Ajouter</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Surface</th>
            <th>Nombre d'arbres</th>
            <th>Gestionnaire</th>
            <th>Statut</th>
            <th>Date de création</th>
            <th>Description</th>
            <th>Géométrie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {espacesVerts.map(espaceVert => (
            <tr key={espaceVert.id}>
              <td>{espaceVert.nom}</td>
              <td>{espaceVert.type_espace}</td>
              <td>{espaceVert.surface}</td>
              <td>{espaceVert.nombre_arbres}</td>
              <td>{espaceVert.gestionnaire}</td>
              <td>{espaceVert.statut}</td>
              <td>{espaceVert.date_creation}</td>
              <td>{espaceVert.description}</td>
              <td>{espaceVert.geom}</td>
              <td>
                <button className="edit" onClick={() => handleEditEspaceVert(espaceVert.id)}>
                  <i className="fa fa-pencil"></i>
                </button>
                <button className="delete" onClick={() => handleDeleteEspaceVert(espaceVert.id)}>
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

export default EspaceVerts;
