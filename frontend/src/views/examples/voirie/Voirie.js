import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GeometryInput from './GeometryInput'; // Import the new component
import 'views/examples/regie-marches/Styletable.css';

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
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Charger les données de voirie depuis l'API
  const loadVoiries = () => {
    axios.get('http://localhost:8000/api/Voirie/')
      .then(response => {
        console.log("Données reçues:", response.data);
        
        // Si les données sont au format GeoJSON
        if (response.data && response.data.features) {
          setVoiries(response.data.features);
        } 
        // Si les données sont un tableau simple
        else if (Array.isArray(response.data)) {
          setVoiries(response.data);
        } 
        // Autre structure (objet avec résultats)
        else if (response.data && Array.isArray(response.data.results)) {
          setVoiries(response.data.results);
        }
        // Par défaut, tableau vide
        else {
          setVoiries([]);
        }
        
        setError('');
      })
      .catch(error => {
        console.error('Erreur de récupération des données de voirie', error);
        setVoiries([]);
        setError('Impossible de charger les données: ' + (error.response?.data || error.message));
      });
  };

  useEffect(() => {
    loadVoiries();
  }, []);

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
      nom: '',
      type_voirie: '',
      largeur: '',
      etat: '',
      priorite: '',
      observations: '',
      geom: '',
    });
    setEditingId(null);
    setError('');
    setSuccess('');
  };

  // Créer les données à envoyer à l'API
  const createApiData = () => {
    try {
      // Valider que largeur est un nombre
      const largeur = parseFloat(formData.largeur);
      if (isNaN(largeur)) throw new Error("La largeur doit être un nombre");
      
      // Valider la géométrie
      if (!formData.geom || !formData.geom.startsWith('LINESTRING')) {
        throw new Error("La géométrie doit être au format LINESTRING");
      }
      
      // Construire l'objet avec les propriétés nécessaires
      const data = {
        nom: formData.nom,
        type_voirie: formData.type_voirie,
        largeur: largeur,
        etat: formData.etat,
        priorite: formData.priorite,
        observations: formData.observations,
        geom: formData.geom
      };
      
      return data;
    } catch (error) {
      console.error("Erreur lors de la création des données:", error);
      setError(error.message);
      return null;
    }
  };

  // Gérer la soumission du formulaire (ajouter ou modifier)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const data = createApiData();
    if (!data) return;  // Arrêter si la création des données a échoué
    
    console.log("Données envoyées:", data);
    
    if (editingId) {
      axios.put(`http://localhost:8000/api/Voirie/${editingId}/`, data)
        .then(response => {
          console.log("Réponse succès:", response.data);
          setSuccess('Voirie mise à jour avec succès');
          loadVoiries();
          resetForm();
        })
// In your handleSubmit function, update the catch block
        .catch(error => {
          console.error('Erreur d\'ajout de voirie', error);
          if (error.response) {
            console.log("Détails complets de l'erreur:", error.response);
            console.log("Données d'erreur:", error.response.data);
            setError(JSON.stringify(error.response.data, null, 2));
          } else {
            setError(error.message);
          }
        });
    } else {
      axios.post('http://localhost:8000/api/Voirie/', data)
        .then(response => {
          console.log("Réponse succès:", response.data);
          setSuccess('Voirie ajoutée avec succès');
          loadVoiries();
          resetForm();
        })
        .catch(error => {
          console.error('Erreur d\'ajout de voirie', error);
          if (error.response) {
            console.log("Détails de l'erreur:", error.response.data);
            setError(formatErrorMessage(error.response.data));
          } else {
            setError(error.message);
          }
        });
    }
  };

  // Formater les messages d'erreur pour l'affichage
  const formatErrorMessage = (errorData) => {
    if (typeof errorData === 'string') return errorData;
    
    let errorMessage = '';
    for (const field in errorData) {
      if (Array.isArray(errorData[field])) {
        errorMessage += `${field}: ${errorData[field].join(', ')}\n`;
      } else if (typeof errorData[field] === 'object') {
        errorMessage += `${field}: ${formatErrorMessage(errorData[field])}\n`;
      } else {
        errorMessage += `${field}: ${errorData[field]}\n`;
      }
    }
    return errorMessage;
  };

  // Extraire les propriétés d'une voirie selon le format (GeoJSON ou objet simple)
  const getVoirieProps = (voirie) => {
    // Si c'est une feature GeoJSON
    if (voirie.properties) {
      return { 
        id: voirie.id || voirie.properties.id,
        ...voirie.properties
      };
    }
    // Si c'est un objet simple
    return voirie;
  };

  // Extraire la géométrie d'une voirie au format WKT
  const extractGeometryAsWkt = (voirie) => {
    // Si c'est une feature GeoJSON
    if (voirie.geometry && voirie.geometry.coordinates) {
      const coords = voirie.geometry.coordinates;
      if (Array.isArray(coords) && coords.length >= 2) {
        // Convertir les coordonnées en format WKT: LINESTRING(lon1 lat1, lon2 lat2, ...)
        const pointsStr = coords.map(point => point.join(' ')).join(', ');
        return `LINESTRING(${pointsStr})`;
      }
    }
    
    // Sinon, utiliser le champ geom tel quel
    const props = getVoirieProps(voirie);
    return props.geom || '';
  };

  // Modifier une voie existante
  const handleEditVoirie = (id) => {
    const voirie = voiries.find(v => {
      const props = getVoirieProps(v);
      return props.id === id;
    });
    
    if (voirie) {
      const props = getVoirieProps(voirie);
      const geomWkt = extractGeometryAsWkt(voirie);
      
      setFormData({
        nom: props.nom || '',
        type_voirie: props.type_voirie || '',
        largeur: props.largeur?.toString() || '',
        etat: props.etat || '',
        priorite: props.priorite || '',
        observations: props.observations || '',
        geom: geomWkt,
      });
      setEditingId(id);
      setError('');
      setSuccess('');
    }
  };

  // Supprimer une voie
  const handleDeleteVoirie = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette voirie?')) {
      axios.delete(`http://localhost:8000/api/Voirie/${id}/`)
        .then(() => {
          setSuccess('Voirie supprimée avec succès');
          loadVoiries();
          if (editingId === id) {
            resetForm();
          }
        })
        .catch(error => {
          console.error('Erreur de suppression de voirie', error);
          if (error.response) {
            setError(formatErrorMessage(error.response.data));
          } else {
            setError(error.message);
          }
        });
    }
  };

  return (
    <div className="table-container">
      <h2>Gestion des Voiries</h2>
      
      {error && (
        <div className="error-message" style={{ 
          color: 'white', 
          backgroundColor: '#f44336', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px' 
        }}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message" style={{ 
          color: 'white', 
          backgroundColor: '#4CAF50', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px' 
        }}>
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="nom">Nom de l'équipement ou du lieu</label>
          <input 
            id="nom"
            type="text" 
            name="nom" 
            value={formData.nom} 
            onChange={handleInputChange} 
            placeholder="Ex. « Stade Municipal », « Centre Culturel », « Salle Omnisports »" 
            required 
          />
          
          <label htmlFor="type_voirie">Type de voirie</label>
          <select 
            id="type_voirie"
            name="type_voirie" 
            value={formData.type_voirie} 
            onChange={handleInputChange} 
            required
          >
            <option value="">-- Sélectionner un type --</option>
            <option value="Rue">Rue</option>
            <option value="Avenue">Avenue</option>
            <option value="Boulevard">Boulevard</option>
          </select>
        </div>
        
        <div className="form-row">
          <label htmlFor="largeur">Largeur</label>
          <input 
            id="largeur"
            type="number" 
            step="0.01" 
            name="largeur" 
            value={formData.largeur} 
            onChange={handleInputChange} 
            placeholder="Largeur moyenne (en mètres)" 
            required 
          />
          
          <label htmlFor="etat">État</label>
          <select 
            id="etat"
            name="etat" 
            value={formData.etat} 
            onChange={handleInputChange} 
            required
          >
            <option value="">-- Sélectionner un état --</option>
            <option value="Bon">Bon</option>
            <option value="Moyen">Moyen</option>
            <option value="Mauvais">Mauvais</option>
          </select>
        </div>
        
        <div className="form-row">
          <label htmlFor="priorite">Priorité</label>
          <select 
            id="priorite"
            name="priorite" 
            value={formData.priorite} 
            onChange={handleInputChange} 
            required
          >
            <option value="">-- Sélectionner une priorité --</option>
            <option value="Haute">Haute</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
        </div>
        
        {/* Remplacer l'input texte pour geom par notre nouveau composant */}
        <GeometryInput 
          value={formData.geom} 
          onChange={handleInputChange} 
        />
        
        <label htmlFor="observations">Observations</label>
        <textarea 
          id="observations"
          name="observations" 
          value={formData.observations} 
          onChange={handleInputChange} 
          placeholder="Notes supplémentaires (ex. obstacles, historique d’entretien, incidents relevés)" 
          rows="3"
        />
        
        <div className="form-buttons">
          <button type="submit">
            {editingId ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}>
              Annuler
            </button>
          )}
        </div>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(voiries) && voiries.length > 0 ? (
            voiries.map(voirie => {
              const props = getVoirieProps(voirie);
              return (
                <tr key={props.id}>
                  <td>{props.nom}</td>
                  <td>{props.type_voirie}</td>
                  <td>{props.largeur} m</td>
                  <td>{props.etat}</td>
                  <td>{props.priorite}</td>
                  <td>{props.observations}</td>
                  <td>
                    <button 
                      className="edit" 
                      onClick={() => handleEditVoirie(props.id)}
                      title="Modifier"
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button 
                      className="delete" 
                      onClick={() => handleDeleteVoirie(props.id)}
                      title="Supprimer"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                {voiries.length === 0 ? "Aucune voirie disponible" : "Chargement..."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Voirie;