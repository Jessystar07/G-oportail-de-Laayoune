
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SportCulture = () => {
  // State management
  const [sportCultures, setSportCultures] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    type_etablissement: '',
    activite_principale: '',
    capacite: '',
    horaires_ouverture: '',
    gestionnaire: '',
    description: '',
    geom: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Charger les données de Sport & Culture depuis l'API
  const loadSportCultures = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/SportCulture/');
      
      // Handling different data formats (array or GeoJSON)
      if (Array.isArray(response.data)) {
        setSportCultures(response.data);
      } else if (response.data.features) {
        // If it's a GeoJSON object
        const formattedData = response.data.features.map(feature => ({
          ...feature.properties,
          geom: extractGeometryAsWkt(feature.geometry)
        }));
        setSportCultures(formattedData);
      } else {
        console.error('Format de données non reconnu', response.data);
        setMessage({ text: 'Erreur: Format de données non reconnu', type: 'error' });
      }
    } catch (error) {
      console.error('Erreur de récupération des données de Sport & Culture', error);
      setMessage({ 
        text: formatErrorMessage(error, 'Erreur lors du chargement des données'), 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadSportCultures();
  }, []);

  // Extraire la géométrie au format WKT depuis GeoJSON
  const extractGeometryAsWkt = (geometry) => {
    if (!geometry) return '';
    
    // Conversion simple pour les points (à étendre pour d'autres types)
    if (geometry.type === 'Point') {
      const [lon, lat] = geometry.coordinates;
      return `POINT(${lon} ${lat})`;
    }
    
    return JSON.stringify(geometry);
  };

  // Gérer la modification des valeurs dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }
    
    if (!formData.type_etablissement.trim()) {
      newErrors.type_etablissement = 'Le type d\'établissement est requis';
    }
    
    if (!formData.activite_principale.trim()) {
      newErrors.activite_principale = 'L\'activité principale est requise';
    }
    
    if (!formData.capacite || isNaN(parseInt(formData.capacite))) {
      newErrors.capacite = 'Une capacité valide est requise';
    }
    
    if (!formData.horaires_ouverture.trim()) {
      newErrors.horaires_ouverture = 'Les horaires d\'ouverture sont requis';
    }
    
    if (!formData.gestionnaire.trim()) {
      newErrors.gestionnaire = 'Le gestionnaire est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formater les messages d'erreur
  const formatErrorMessage = (error, defaultMessage) => {
    if (error.response) {
      if (error.response.data) {
        // Handle structured error responses
        if (typeof error.response.data === 'object' && !Array.isArray(error.response.data)) {
          const errorMessages = [];
          for (const [key, value] of Object.entries(error.response.data)) {
            if (Array.isArray(value)) {
              errorMessages.push(`${key}: ${value.join(', ')}`);
            } else {
              errorMessages.push(`${key}: ${value}`);
            }
          }
          return errorMessages.join('. ');
        } else if (typeof error.response.data === 'string') {
          return error.response.data;
        }
      }
      return `Erreur ${error.response.status}: ${error.response.statusText}`;
    }
    return defaultMessage || 'Une erreur est survenue';
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      id: null,
      nom: '',
      type_etablissement: '',
      activite_principale: '',
      capacite: '',
      horaires_ouverture: '',
      gestionnaire: '',
      description: '',
      geom: '',
    });
    setIsEditing(false);
    setErrors({});
  };

  // Uniformiser les propriétés des SportCultures
  const getSportCultureProps = (data) => {
    return {
      id: data.id || data.gid || data.objectid,
      nom: data.nom || data.name || '',
      type_etablissement: data.type_etablissement || data.type || '',
      activite_principale: data.activite_principale || data.activite || '',
      capacite: data.capacite || data.capacity || '',
      horaires_ouverture: data.horaires_ouverture || data.horaires || '',
      gestionnaire: data.gestionnaire || data.manager || '',
      description: data.description || '',
      geom: data.geom || data.geometry || '',
    };
  };

  // Ajouter ou modifier un équipement ou lieu
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ text: 'Veuillez corriger les erreurs dans le formulaire', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    try {
      if (isEditing) {
        // Modification d'un équipement existant
        const response = await axios.put(
          `http://localhost:8000/api/SportCulture/${formData.id}/`, 
          formData
        );
        
        setSportCultures(sportCultures.map(sc => 
          sc.id === formData.id ? getSportCultureProps(response.data) : sc
        ));
        
        setMessage({ text: 'Équipement modifié avec succès', type: 'success' });
      } else {
        // Ajout d'un nouvel équipement
        const response = await axios.post(
          'http://localhost:8000/api/SportCulture/', 
          formData
        );
        
        setSportCultures([...sportCultures, getSportCultureProps(response.data)]);
        setMessage({ text: 'Équipement ajouté avec succès', type: 'success' });
      }
      
      resetForm();
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire', error);
      setMessage({ 
        text: formatErrorMessage(error, 'Erreur lors de l\'enregistrement'), 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Préparer la modification d'un équipement
  const handleEditSportCulture = (id) => {
    const sportCulture = sportCultures.find(sc => sc.id === id);
    if (sportCulture) {
      setFormData({
        id: sportCulture.id,
        nom: sportCulture.nom,
        type_etablissement: sportCulture.type_etablissement,
        activite_principale: sportCulture.activite_principale,
        capacite: sportCulture.capacite,
        horaires_ouverture: sportCulture.horaires_ouverture,
        gestionnaire: sportCulture.gestionnaire,
        description: sportCulture.description,
        geom: sportCulture.geom,
      });
      setIsEditing(true);
      window.scrollTo(0, 0); // Scroll to the form
    }
  };

  // Supprimer un équipement ou lieu
  const handleDeleteSportCulture = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      setIsLoading(true);
      try {
        await axios.delete(`http://localhost:8000/api/SportCulture/${id}/`);
        setSportCultures(sportCultures.filter(sc => sc.id !== id));
        setMessage({ text: 'Équipement supprimé avec succès', type: 'success' });
      } catch (error) {
        console.error('Erreur de suppression de Sport & Culture', error);
        setMessage({ 
          text: formatErrorMessage(error, 'Erreur lors de la suppression'), 
          type: 'error' 
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="table-container">
      <h2>Gestion des Équipements Sportifs et Culturels</h2>
      
      {/* Message d'erreur ou de succès */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button 
            className="close-message" 
            onClick={() => setMessage({ text: '', type: '' })}
          >
            &times;
          </button>
        </div>
      )}
      
      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="form-container">        
        <div className="form-group">
          <label htmlFor="nom">Nom de l'équipement</label>
          <input 
            type="text" 
            id="nom"
            name="nom" 
            value={formData.nom} 
            onChange={handleInputChange} 
            className={errors.nom ? 'error' : ''}
            placeholder= "Nom de l’équipement ou du lieu (Ex. Stade Municipal )"
          />
          {errors.nom && <span className="error-message">{errors.nom}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="type_etablissement">Type d'établissement</label>
          <input 
            type="text" 
            id="type_etablissement"
            name="type_etablissement" 
            value={formData.type_etablissement} 
            onChange={handleInputChange} 
            placeholder= "Type ou vocation (stade, gymnase, musée, bibliothèque, salle de spectacle, etc.)"
            className={errors.type_etablissement ? 'error' : ''}
          />
          {errors.type_etablissement && <span className="error-message">{errors.type_etablissement}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="activite_principale">Activité principale</label>
          <input 
            type="text" 
            id="activite_principale"
            name="activite_principale" 
            value={formData.activite_principale} 
            onChange={handleInputChange} 
            placeholder= "Activité(s) principale(s) exercée(s) "
            className={errors.activite_principale ? 'error' : ''}
          />
          {errors.activite_principale && <span className="error-message">{errors.activite_principale}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="capacite">Capacité d'accueil</label>
          <input 
            type="number" 
            id="capacite"
            name="capacite" 
            value={formData.capacite} 
            onChange={handleInputChange} 
            placeholder="Capacité d’accueil (Ex. nombre de places assises, potentiel)"
            className={errors.capacite ? 'error' : ''}
          />
          {errors.capacite && <span className="error-message">{errors.capacite}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="horaires_ouverture">Horaires d'ouverture</label>
          <textarea 
            id="horaires_ouverture"
            name="horaires_ouverture" 
            value={formData.horaires_ouverture} 
            onChange={handleInputChange} 
            placeholder="Plages horaires d’ouverture"
            className={errors.horaires_ouverture ? 'error' : ''}
          />
          {errors.horaires_ouverture && <span className="error-message">{errors.horaires_ouverture}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="gestionnaire">Gestionnaire</label>
          <input 
            type="text" 
            id="gestionnaire"
            name="gestionnaire" 
            value={formData.gestionnaire} 
            onChange={handleInputChange} 
            placeholder="Entité responsable (Ex. Service des Sports, Association, Département Culturel, etc.)"
            className={errors.gestionnaire ? 'error' : ''}
          />
          {errors.gestionnaire && <span className="error-message">{errors.gestionnaire}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description"
            name="description" 
            value={formData.description} 
            placeholder="Informations diverses (Ex. équipements disponibles, historique, conditions d’accès, tarifs éventuels))"
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
  <label htmlFor="geom">Coordonnées (longitude, latitude)</label>
  <div className="coordinate-inputs">
    <input 
      type="number" 
      id="longitude"
      name="longitude" 
      value={formData.longitude || ''} 
      onChange={(e) => {
        setFormData({
          ...formData,
          longitude: e.target.value,
          geom: formData.latitude ? `POINT(${e.target.value} ${formData.latitude})` : formData.geom
        });
      }}
      placeholder="Longitude (ex: 2.3488)"
      step="0.0001"
    />
    <input 
      type="number" 
      id="latitude"
      name="latitude" 
      value={formData.latitude || ''} 
      onChange={(e) => {
        setFormData({
          ...formData,
          latitude: e.target.value,
          geom: formData.longitude ? `POINT(${formData.longitude} ${e.target.value})` : formData.geom
        });
      }}
      placeholder="Latitude (ex: 48.8534)" 
      step="0.0001"
    />
  </div>
  <small className="help-text">Exemple: 2.3488 pour longitude, 48.8534 pour latitude (Paris)</small>
</div>
        
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Traitement en cours...' : isEditing ? 'Modifier' : 'Ajouter'}
          </button>
          {isEditing && (
            <button 
              type="button" 
              onClick={resetForm} 
              className="cancel-button"
              disabled={isLoading}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
       {/* Tableau des équipements */}
       <div className="table-wrapper">
        <h3>Liste des équipements ({sportCultures.length})</h3>
        
        {isLoading && <div className="loading">Chargement en cours...</div>}
        
        {sportCultures.length === 0 && !isLoading ? (
          <p className="no-data">Aucun équipement enregistré.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Activité principale</th>
                <th>Capacité</th>
                <th>Horaires d'ouverture</th>
                <th>Gestionnaire</th>
                <th>Description</th>
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
                  <td>
                    <div className="table-cell-content">
                      {sportCulture.horaires_ouverture}
                    </div>
                  </td>
                  <td>{sportCulture.gestionnaire}</td>
                  <td>
                    <div className="table-cell-content">
                      {sportCulture.description}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-button" 
                        onClick={() => handleEditSportCulture(sportCulture.id)}
                        disabled={isLoading}
                      >
                        <i className="fa fa-edit"></i> 
                      </button>
                      <button 
                        className="delete-button" 
                        onClick={() => handleDeleteSportCulture(sportCulture.id)}
                        disabled={isLoading}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Styles CSS */}
      <style jsx>{`
        .table-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }
        
        h2 {
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }
        
        h3 {
          color: #444;
          margin-bottom: 15px;
        }
        
        .message {
          padding: 10px 15px;
          border-radius: 4px;
          margin-bottom: 20px;
          position: relative;
        }
        
        .message.success {
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }
        
        .message.error {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }
        
        .close-message {
          position: absolute;
          top: 5px;
          right: 10px;
          background: none;
          border: none;
          font-size: 18px;
          cursor: pointer;
          color: inherit;
        }
        
        .form-container {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 30px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        input, textarea {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        input.error, textarea.error {
          border-color: #dc3545;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }
        
        textarea {
          min-height: 80px;
          resize: vertical;
        }
        
        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }
        
        button {
          padding: 8px 15px;
          border: 50px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        
        button[type="submit"] {
          background-color: #007bff;
          color: white;
        }
        
        button[type="submit"]:hover {
          background-color: #0069d9;
        }
        
        .cancel-button {
          background-color: #6c757d;
          color: white;
        }
        
        .cancel-button:hover {
          background-color: #5a6268;
        }
        
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .table-wrapper {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        th {
          background-color: #f9f9f9;
          font-weight: bold;
        }
        
        tr:hover {
          background-color: #34495e;
        }
        
        .table-cell-content {
          max-height: 80px;
          overflow-y: auto;
          max-width: 200px;
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .action-buttons {
          display: flex;
          gap: 5px;
        }
        
        .edit-button {
          background-color: #34495e;
          color: #212529;
          color: white;
          width: 32px;  
          height: 32px; 
          border-radius: 50%; 
          padding: 0; 
          display: inline-flex; 
          align-items: center; 
          justify-content: center; 
          margin: 0 5px; 
          font-size: 14px; 
          border: none; 
          cursor: pointer;

        }
        
        .edit-button:hover {
          background-color: #e0a800;
        }
        
        .delete-button {
          background-color: #dc3545;
          color: white;
          width: 32px;  
          height: 32px; 
          border-radius: 50%; 
          padding: 0; 
          display: inline-flex; 
          align-items: center; 
          justify-content: center; 
          margin: 0 5px; 
          font-size: 14px; 
          border: none; 
          cursor: pointer; 
        }
        
        .delete-button:hover {
          background-color: #c82333;
        }
        
        .loading {
          text-align: center;
          padding: 20px;
          color: #007bff;
        }
        
        .no-data {
          text-align: center;
          padding: 20px;
          color:rgb(18, 49, 75);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default SportCulture;