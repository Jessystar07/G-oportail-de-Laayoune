import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './espacevert.css';
const EspacesVerts = () => {
  const [espacesVerts, setEspacesVerts] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
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
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les données des espaces verts depuis l'API
  const loadEspacesVerts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/EspaceVert/');
      
      if (Array.isArray(response.data)) {
        setEspacesVerts(response.data.map(ev => getEspaceVertProps(ev)));
      } else if (response.data.features) {
        const formattedData = response.data.features.map(feature => {
          const geom = extractGeometryAsWkt(feature.geometry);
          if (!geom.startsWith('POLYGON') && !geom.startsWith('POINT')) {
            throw new Error('Format de géométrie invalide');
          }
          return {
            ...feature.properties,
            geom,
            id: feature.id || feature.properties.id
          };
        });
        setEspacesVerts(formattedData);
      } else {
        setEspacesVerts([]);
        setErrorMessage('Format de données non reconnu');
      }
    } catch (error) {
      setErrorMessage(formatErrorMessage(error, 'Erreur de récupération des données des espaces verts'));
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadEspacesVerts();
  }, []);
  // Fonction pour uniformiser les données d'espace vert
  const getEspaceVertProps = (data) => {
    return {
      id: data.id || null,
      nom: data.nom || '',
      type_espace: data.type_espace || '',
      surface: data.surface || '',
      nombre_arbres: data.nombre_arbres || '',
      gestionnaire: data.gestionnaire || '',
      statut: data.statut || '',
      date_creation: data.date_creation || '',
      description: data.description || '',
      geom: data.geom || '',
    };
  };

  // Convertir la géométrie GeoJSON en format WKT
  const extractGeometryAsWkt = (geometry) => {
    if (!geometry) return '';
    try {
      if (geometry.type === 'Polygon') {
        const coordinates = geometry.coordinates[0].map(coord => `${coord[0]} ${coord[1]}`).join(', ');
        return `POLYGON((${coordinates}))`;
      } else if (geometry.type === 'Point') {
        return `POINT(${geometry.coordinates[0]} ${geometry.coordinates[1]})`;
      } else {
        return JSON.stringify(geometry);
      }
    } catch (error) {
      console.error('Erreur lors de la conversion de la géométrie', error);
      return '';
    }
  };
   

  // Formater les messages d'erreur
  const formatErrorMessage = (error, defaultMessage) => {
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        return error.response.data;
      } else if (typeof error.response.data === 'object') {
        const errorMessages = [];
        for (const key in error.response.data) {
          errorMessages.push(`${key}: ${error.response.data[key]}`);
        }
        return errorMessages.join('; ');
      }
    }
    return `${defaultMessage}: ${error.message}`;
  };

  // Gérer la modification des valeurs dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      id: null,
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
    setIsEditing(false);
    setErrorMessage('');
  };

  // Valider le formulaire
  const validateForm = () => {
    const requiredFields = ['nom', 'type_espace', 'surface', 'gestionnaire', 'statut'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        setErrorMessage(`Le champ ${field} est obligatoire`);
        return false;
      }
    }
    
    // Validation des valeurs numériques
    if (isNaN(parseFloat(formData.surface))) {
      setErrorMessage('La surface doit être un nombre');
      return false;
    }
    
    if (isNaN(parseInt(formData.nombre_arbres))) {
      setErrorMessage('Le nombre d\'arbres doit être un nombre entier');
      return false;
    }
    
    return true;
  };

  // Ajouter ou modifier un espace vert
// Ajouter ou modifier un espace vert
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  
  setIsLoading(true);
  setErrorMessage('');
  setSuccessMessage('');
  
  try {
      let response;
      
      if (isEditing) {
          // Mise à jour d'un espace vert existant
          response = await axios.put(`http://localhost:8000/api/EspaceVert/${formData.id}/`, formData);
          setSuccessMessage('Espace vert modifié avec succès');
          
          // Mettre à jour l'élément dans le tableau
          setEspacesVerts(prevState => 
              prevState.map(ev => ev.id === formData.id ? getEspaceVertProps(response.data) : ev)
          );
      } else {
          // Ajout d'un nouvel espace vert
          console.log('Sending data:', formData); // Log data being sent
          response = await axios.post('http://localhost:8000/api/EspaceVert/', formData);
          console.log('Response:', response.data); // Log response
          setSuccessMessage('Espace vert ajouté avec succès');
          
          // Ajouter le nouvel élément au tableau
          setEspacesVerts(prevState => [...prevState, getEspaceVertProps(response.data)]);
      }
      
      resetForm();
  } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      setErrorMessage(formatErrorMessage(error, 'Erreur lors de l\'enregistrement'));
  } finally {
      setIsLoading(false);
  }
};
  // Pré-remplir le formulaire pour modification
  const handleEditEspaceVert = (id) => {
    const espaceVert = espacesVerts.find(ev => ev.id === id);
    if (espaceVert) {
      setFormData(getEspaceVertProps(espaceVert));
      setIsEditing(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Supprimer un espace vert
  const handleDeleteEspaceVert = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet espace vert ?')) {
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/EspaceVert/${id}/`);
      setEspacesVerts(espacesVerts.filter(ev => ev.id !== id));
      setSuccessMessage('Espace vert supprimé avec succès');
      
      // Si on était en train d'éditer cet élément, reset du formulaire
      if (formData.id === id) {
        resetForm();
      }
    } catch (error) {
      setErrorMessage(formatErrorMessage(error, 'Erreur lors de la suppression'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="espaces-verts-container">
      <h2>{isEditing ? 'Modifier un espace vert' : 'Ajouter un nouvel espace vert'}</h2>
      
      {errorMessage && (
        <div className="alert alert-danger">
          <strong>Erreur:</strong> {errorMessage}
          <button onClick={() => setErrorMessage('')} className="close-btn">×</button>
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success">
          <strong>Succès:</strong> {successMessage}
          <button onClick={() => setSuccessMessage('')} className="close-btn">×</button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="espace-vert-form">
  {/* Row 1: Nom (Full-width) */}
  <div className="form-group">
    <label htmlFor="nom">Nom de l'espace vert *</label>
    <input 
      type="text" 
      id="nom"
      name="nom" 
      value={formData.nom} 
      onChange={handleInputChange} 
      placeholder="Ex: Parc de la Liberté" 
      required 
    />
  </div>
  
  {/* Row 2: Type d'espace (Left) + Surface (Right) */}
  <div style={{ display: 'flex', gap: '20px' }}>
    <div style={{ flex: '1' }}>
      <label htmlFor="type_espace">Type d'espace *</label>
      <select 
        id="type_espace"
        name="type_espace" 
        value={formData.type_espace} 
        onChange={handleInputChange} 
        required
        style={{ width: '100%' }}
      >
        <option value="">Sélectionnez un type</option>
        <option value="Parc">Parc</option>
        <option value="Jardin">Jardin</option>
        <option value="Square">Square</option>
        <option value="Aire de jeux">Aire de jeux</option>
        <option value="Espace naturel">Espace naturel</option>
        <option value="Autre">Autre</option>
      </select>
    </div>
    
    <div style={{ flex: '1' }}>
      <label htmlFor="surface">Surface (m²) *</label>
      <input 
        type="number" 
        id="surface"
        name="surface" 
        value={formData.surface} 
        onChange={handleInputChange} 
        placeholder="Ex: 5000" 
        required 
        min="0"
        step="0.01"
        style={{ width: '100%' }}
      />
    </div>
  </div>

  {/* Row 3: Nombre d'arbres (Left) + Gestionnaire (Right) */}
  <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
    <div style={{ flex: '1' }}>
      <label htmlFor="nombre_arbres">Nombre d'arbres</label>
      <input 
        type="number" 
        id="nombre_arbres"
        name="nombre_arbres" 
        value={formData.nombre_arbres} 
        onChange={handleInputChange} 
        placeholder="Ex: 125" 
        min="0"
        style={{ width: '100%' }}
      />
    </div>
    
    <div style={{ flex: '1' }}>
      <label htmlFor="gestionnaire">Gestionnaire *</label>
      <input 
        type="text" 
        id="gestionnaire"
        name="gestionnaire" 
        value={formData.gestionnaire} 
        onChange={handleInputChange} 
        placeholder="Ex: Mairie" 
        required 
        style={{ width: '100%' }}
      />
    </div>
  </div>
  
  {/* Row 4: Statut (Left) + Date de création (Right) */}
  <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
    <div style={{ flex: '1' }}>
      <label htmlFor="statut">Statut *</label>
      <select 
        id="statut"
        name="statut" 
        value={formData.statut} 
        onChange={handleInputChange} 
        required
        style={{ width: '100%' }}
      >
        <option value="">Sélectionnez un statut</option>
        <option value="Ouvert au public">Ouvert au public</option>
        <option value="En rénovation">En rénovation</option>
        <option value="Fermé temporairement">Fermé temporairement</option>
        <option value="Accès limité">Accès limité</option>
        <option value="Autre">Autre</option>
      </select>
    </div>
    
    <div style={{ flex: '1' }}>
      <label htmlFor="date_creation">Date de création/inauguration</label>
      <input 
        type="date" 
        id="date_creation"
        name="date_creation" 
        value={formData.date_creation} 
        onChange={handleInputChange} 
        style={{ width: '100%' }}
      />
    </div>
  </div>
  
  {/* Row 5: Géométrie (Left) + Description (Right) */}
  <div style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
    <div style={{ flex: '1' }}>
      <label htmlFor="geom">Géométrie (polygone WKT)</label>
      <textarea 
        id="geom"
        name="geom" 
        value={formData.geom} 
        onChange={handleInputChange} 
        placeholder="Ex: POLYGON((longitude latitude, longitude latitude, ...))" 
        rows="3"
        style={{ width: '100%' }}
      />
      <small className="form-text text-muted">
        Format WKT ex: POLYGON((2.3 48.8, 2.31 48.81, 2.32 48.80, 2.3 48.8))
      </small>
    </div>
    
    <div style={{ flex: '1' }}>
      <label htmlFor="description">Description</label>
      <textarea 
        id="description"
        name="description" 
        value={formData.description} 
        onChange={handleInputChange} 
        placeholder="Informations complémentaires (ex. présence de fontaines, espaces de jeux, etc.)" 
        rows="3"
        style={{ width: '100%' }}
      />
    </div>
  </div>
  
  <div className="form-buttons" style={{ marginTop: '20px' }}>
    <button type="submit" className="btn btn-primary" disabled={isLoading}>
      {isLoading ? 'Chargement...' : isEditing ? 'Mettre à jour' : 'Ajouter'}
    </button>
    {isEditing && (
      <button type="button" className="btn btn-secondary" onClick={resetForm}>
        Annuler
      </button>
    )}
  </div>
</form>

      <div className="table-section">
        <h2>Liste des espaces verts</h2>
        {isLoading && <div className="loading">Chargement des données...</div>}
        
        {espacesVerts.length === 0 && !isLoading ? (
          <div className="no-data">Aucun espace vert disponible</div>
        ) : (
          <div className="table-responsive">
            <table className="espaces-verts-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Type</th>
                  <th>Surface (m²)</th>
                  <th>Nombre d'arbres</th>
                  <th>Gestionnaire</th>
                  <th>Statut</th>
                  <th>Date création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {espacesVerts.map(espaceVert => (
                  <tr key={espaceVert.id}>
                    <td>
                      <div className="espace-nom">{espaceVert.nom}</div>
                      <div className="espace-description">{espaceVert.description?.substring(0, 50)}{espaceVert.description?.length > 50 ? '...' : ''}</div>
                    </td>
                    <td>{espaceVert.type_espace}</td>
                    <td>{espaceVert.surface}</td>
                    <td>{espaceVert.nombre_arbres}</td>
                    <td>{espaceVert.gestionnaire}</td>
                    <td>
                      <span className={`status-badge status-${espaceVert.statut?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {espaceVert.statut}
                      </span>
                    </td>
                    <td>{espaceVert.date_creation ? new Date(espaceVert.date_creation).toLocaleDateString() : '-'}</td>
                    

                    <td className="actions-cell">
                  <button 
                    className="btn btn-edit" 
                    onClick={() => handleEditEspaceVert(espaceVert.id)}
                    aria-label="Modifier"
                  >
                    <i className="fa fa-edit"></i> 
                  </button>
                  <button 
                    className="btn btn-delete" 
                    onClick={() => handleDeleteEspaceVert(espaceVert.id)}
                    aria-label="Supprimer"
                  >
                    <i className="fa fa-trash"></i> 
                  </button>
                </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal pour afficher les détails complets d'un espace vert si nécessaire */}
      {/* Peut être implémenté en ajoutant un état pour l'espace vert sélectionné */}
    </div>
  );
};

// Composant pour l'entrée de géométrie avec validation et prévisualisation
// Ce composant peut être développé séparément
const GeometryInput = ({ value, onChange }) => {
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(true);
  
  const validateGeometry = (input) => {
    // Validation basique du format WKT pour un polygone
    if (!input) return true;
    
    const polygonRegex = /POLYGON\s*\(\s*\(\s*(-?\d+(\.\d+)?\s+-?\d+(\.\d+)?(\s*,\s*-?\d+(\.\d+)?\s+-?\d+(\.\d+)?)*)\s*\)\s*\)/i;
    const pointRegex = /POINT\s*\(\s*(-?\d+(\.\d+)?\s+-?\d+(\.\d+)?)\s*\)/i;
    
    if (polygonRegex.test(input) || pointRegex.test(input)) {
      setIsValid(true);
      setError('');
      return true;
    } else {
      setIsValid(false);
      setError('Format WKT invalide. Exemple valide: POLYGON((1 1, 1 2, 2 2, 2 1, 1 1))');
      return false;
    }
  };
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    validateGeometry(newValue);
    onChange(e);
  };
  
  return (
    <div className={`geometry-input ${!isValid ? 'invalid' : ''}`}>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Ex: POLYGON((longitude latitude, longitude latitude, ...))"
        rows="3"
      />
      {error && <div className="error-message">{error}</div>}
      
      {/* Ici, on pourrait ajouter un aperçu de la géométrie sur une carte */}
      {isValid && value && (
        <div className="geometry-preview">
          <p>Aperçu non disponible dans cette version</p>
          {/* Intégration future avec une bibliothèque de cartographie comme Leaflet */}
        </div>
      )}
    </div>
  );
};

export default EspacesVerts;