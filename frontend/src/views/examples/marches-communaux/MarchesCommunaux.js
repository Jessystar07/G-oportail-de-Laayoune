import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Base URL for API endpoints
const API_BASE_URL = 'http://localhost:8000/api';

// FormField component for reusable form inputs
const FormField = ({ type, name, value, onChange, placeholder, required = false, options = [] }) => {
  if (type === 'select') {
    return (
      <div className="form-field">
        <label htmlFor={name}>{placeholder}</label>
        <select 
          id={name}
          name={name} 
          value={value} 
          onChange={onChange} 
          required={required}
        >
          <option value="">{`Sélectionnez un ${placeholder.toLowerCase()}`}</option>
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.nom}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  if (type === 'textarea') {
    return (
      <div className="form-field">
        <label htmlFor={name}>{placeholder}</label>
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      </div>
    );
  }
  
  return (
    <div className="form-field">
      <label htmlFor={name}>{placeholder}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

// EspaceForm component
const EspaceForm = ({ formData, onInputChange, onSubmit, isEditing, onCancel, personnes = [] }) => {
  return (
    <form onSubmit={onSubmit} className="form-container">      
      <label>Numéro d'Espace *</label>
      <input
        type="text"
        name="numero_Espace"
        value={formData.numero_Espace}
        onChange={onInputChange}
        placeholder="Numéro d'Espace"
        required
      />
      
      <label>Prix *</label>
      <input
        type="number"
        name="prix"
        value={formData.prix}
        onChange={onInputChange}
        placeholder="Prix"
        required
      />
      
      <label>Exploitant *</label>
      <input
        type="select"
        name="exploitant_requerant"
        value={formData.exploitant_requerant}
        onChange={onInputChange}
        placeholder="Exploitant (Requerant)"
        options={personnes}
        required
      />
      
      <div className="form-actions">
        <button type="submit">
          {isEditing ? 'Mettre à jour' : 'Ajouter'} l'Espace
        </button>
        {isEditing && (
          <button type="button" onClick={onCancel} className="cancel-button">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

// MarcheForm component
const MarcheForm = ({ formData, onInputChange, onSubmit, isEditing, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="form-container">      
      <label>Nom du Marché *</label>
        <input
        type="text"
        name="nom_marche"
        value={formData.nom_marche}
        onChange={onInputChange}
        placeholder="Nom du Marché"
        required
      />
        <label>Annexe *</label>
        <input
        type="number"
        name="annexe"
        value={formData.annexe}
        onChange={onInputChange}
        placeholder="Annexe"
        required
        
      />
      
      <div className="form-row">
        <FormField 
          type="number"
          name="numero_secteur"
          value={formData.numero_secteur}
          onChange={onInputChange}
          placeholder="Numéro de Secteur"
        />
        
        <FormField 
          type="number"
          name="numero_lot"
          value={formData.numero_lot}
          onChange={onInputChange}
          placeholder="Numéro de Lot"
        />
      </div>
      
      <FormField 
        type="text"
        name="lotissement"
        value={formData.lotissement}
        onChange={onInputChange}
        placeholder="Lotissement"
      />
      
      <div className="form-row">
        <FormField 
          type="textarea"
          name="avenue"
          value={formData.avenue}
          onChange={onInputChange}
          placeholder="Avenue"
        />
        
        <FormField 
          type="textarea"
          name="rue"
          value={formData.rue}
          onChange={onInputChange}
          placeholder="Rue"
        />
      </div>
      
      <FormField 
        type="number"
        name="surface_totale"
        value={formData.surface_totale}
        onChange={onInputChange}
        placeholder="Surface Totale"
      />
      
      
      <div className="form-actions">
        <button type="submit">
          {isEditing ? 'Mettre à jour' : 'Ajouter'} le Marché
        </button>
        {isEditing && (
          <button type="button" onClick={onCancel} className="cancel-button">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

// DataTable component
const DataTable = ({ data, columns, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Chargement des données...</div>;
  }
  
  if (data.length === 0) {
    return <div className="no-data">Aucune donnée disponible</div>;
  }
  
  return (
    <div className="table-responsive">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={`${item.id}-${column.key}`}>
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
              <td className="action-buttons">
                <button 
                  className="edit" 
                  onClick={() => onEdit(item)}
                  aria-label="Modifier"
                >
                  <i className="fa fa-edit"></i> 
                </button>
                <button 
                  className="delete" 
                  onClick={() => onDelete(item.id)}
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
  );
};

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">{message}</div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

// Main MarchesCommunaux component
const MarchesCommunaux = () => {
  // Data states
  const [Espace, setEspace] = useState([]);
  const [Marches, setMarches] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState({
    Espace: false,
    Marches: false,
    form: false
  });
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('Espace'); // 'Espace' or 'Marches'
  
  // Form states
  const initialEspaceForm = {
    id: null,
    numero_Espace: '',
    prix: '',
    exploitant_requerant: ''
  };

  const initialMarcheForm = {
    id: null,
    nom_marche: '',
    annexe: '',
    numero_secteur: '',
    numero_lot: '',
    lotissement: '',
    avenue: '',
    rue: '',
    surface_totale: ''
  };
  
  const [EspaceFormData, setEspaceFormData] = useState(initialEspaceForm);
  const [marcheFormData, setMarcheFormData] = useState(initialMarcheForm);
  const [isEditingEspace, setIsEditingEspace] = useState(false);
  const [isEditingMarche, setIsEditingMarche] = useState(false);
  const [personnes, setPersonnes] = useState([]);

  // Helper for showing notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };
  
  // API fetch functions
  const fetchEspace = useCallback(async () => {
    setLoading(prev => ({ ...prev, Espace: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/Espace/`);
      setEspace(response.data);
    } catch (error) {
      console.error('Erreur de récupération des données des Espace', error);
      showNotification('Impossible de charger les Espace', 'error');
    } finally {
      setLoading(prev => ({ ...prev, Espace: false }));
    }
  }, []);
  
  const fetchMarches = useCallback(async () => {
    setLoading(prev => ({ ...prev, Marches: true }));
    try {
      const response = await axios.get(`${API_BASE_URL}/Marches/`);
      setMarches(response.data);
    } catch (error) {
      console.error('Erreur de récupération des données des marchés', error);
      showNotification('Impossible de charger les marchés', 'error');
    } finally {
      setLoading(prev => ({ ...prev, Marches: false }));
    }
  }, []);
  
  const fetchPersonnes = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/personnes-physiques/`);
      setPersonnes(response.data);
    } catch (error) {
      console.error('Erreur de récupération des personnes', error);
      showNotification('Impossible de charger les exploitants', 'error');
    }
  }, []);

  // Load all data on component mount
  useEffect(() => {
    fetchEspace();
    fetchMarches();
    fetchPersonnes();
  }, [fetchEspace, fetchMarches, fetchPersonnes]);
  
  // Form handlers
  const handleEspaceInputChange = (e) => {
    const { name, value } = e.target;
    setEspaceFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMarcheInputChange = (e) => {
    const { name, value } = e.target;
    setMarcheFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Espace CRUD operations
  const handleEspaceubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, form: true }));
    
    try {
      if (isEditingEspace) {
        // Update existing Espace
        const response = await axios.put(
          `${API_BASE_URL}/Espace/${EspaceFormData.id}/`, 
          EspaceFormData
        );
        setEspace(Espace.map(item => 
          item.id === EspaceFormData.id ? response.data : item
        ));
        showNotification('Espace mis à jour avec succès');
      } else {
        // Create new Espace
        const response = await axios.post(
          `${API_BASE_URL}/Espace/`, 
          EspaceFormData
        );
        setEspace([...Espace, response.data]);
        showNotification('Nouvel Espace ajouté avec succès');
      }
      
      // Reset form
      setEspaceFormData(initialEspaceForm);
      setIsEditingEspace(false);
    } catch (error) {
      console.error('Erreur lors de l\'opération sur l\'Espace', error);
      showNotification(
        `Erreur lors de ${isEditingEspace ? 'la modification' : 'l\'ajout'} de l'Espace`, 
        'error'
      );
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };
  
  const handleEditEspace = (Espace) => {
    setEspaceFormData({
      id: Espace.id,
      numero_Espace: Espace.numero_Espace,
      prix: Espace.prix,
      exploitant_requerant: Espace.exploitant_requerant || ''
    });
    setIsEditingEspace(true);
    setActiveTab('Espace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteEspace = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet Espace ?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/Espace/${id}/`);
      setEspace(Espace.filter(Espace => Espace.id !== id));
      showNotification('Espace supprimé avec succès');
    } catch (error) {
      console.error('Erreur de suppression d\'Espace', error);
      showNotification('Erreur lors de la suppression de l\'Espace', 'error');
    }
  };
  
  // Marche CRUD operations
  const handleMarchesubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, form: true }));
    
    try {
      if (isEditingMarche) {
        // Update existing marche
        const response = await axios.put(
          `${API_BASE_URL}/Marches/${marcheFormData.id}/`, 
          marcheFormData
        );
        setMarches(Marches.map(item => 
          item.id === marcheFormData.id ? response.data : item
        ));
        showNotification('Marché mis à jour avec succès');
      } else {
        // Create new marche
        const response = await axios.post(
          `${API_BASE_URL}/Marches/`, 
          marcheFormData
        );
        setMarches([...Marches, response.data]);
        showNotification('Nouveau marché ajouté avec succès');
      }
      
      // Reset form
      setMarcheFormData(initialMarcheForm);
      setIsEditingMarche(false);
    } catch (error) {
      console.error('Erreur lors de l\'opération sur le marché', error);
      showNotification(
        `Erreur lors de ${isEditingMarche ? 'la modification' : 'l\'ajout'} du marché`, 
        'error'
      );
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };
  
  const handleEditMarche = (marche) => {
    setMarcheFormData({
      id: marche.id,
      nom_nom_marche: marche.nom_marche,
      annexe: marche.annexe,
      numero_secteur: marche.numero_secteur || '',
      numero_lot: marche.numero_lot || '',
      lotissement: marche.lotissement || '',
      avenue: marche.avenue || '',
      rue: marche.rue || '',
      surface_totale: marche.surface_totale || ''
    });
    setIsEditingMarche(true);
    setActiveTab('Marches');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteMarche = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce marché ?')) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/Marches/${id}/`);
      setMarches(Marches.filter(marche => marche.id !== id));
      showNotification('Marché supprimé avec succès');
    } catch (error) {
      console.error('Erreur de suppression de marché', error);
      showNotification('Erreur lors de la suppression du marché', 'error');
    }
  };
  
  // Reset form handlers
  const handleCancelEspaceEdit = () => {
    setEspaceFormData(initialEspaceForm);
    setIsEditingEspace(false);
  };
  
  const handleCancelMarcheEdit = () => {
    setMarcheFormData(initialMarcheForm);
    setIsEditingMarche(false);
  };
  
  // Define table columns
  const EspaceColumns = [
    { key: 'numero_Espace', label: 'Numéro d\'Espace' },
    { key: 'prix', label: 'Prix', render: (Espace) => `${Espace.prix} €` },
    { key: 'exploitant', label: 'Exploitant' }
  ];
  
  const marcheColumns = [
    { key: 'nom_marche', label: 'Nom du Marché' },
    { key: 'annexe', label: 'Annexe' },
    { key: 'surface_totale', label: 'Surface Totale (m²)' },
    { 
      key: 'adresse', 
      label: 'Adresse',
      render: (marche) => {
        const parts = [];
        if (marche.lotissement) parts.push(marche.lotissement);
        if (marche.avenue) parts.push(`Avenue ${marche.avenue}`);
        if (marche.rue) parts.push(`Rue ${marche.rue}`);
        return parts.join(', ') || 'Non spécifiée';
      }
    }
  ];
  
  return (
    <div className="Marches-communaux-container">      
      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'Espace' ? 'active' : ''}`} 
          onClick={() => setActiveTab('Espace')}
        >
          Espaces
        </button>
        <button 
          className={`tab ${activeTab === 'Marches' ? 'active' : ''}`} 
          onClick={() => setActiveTab('Marches')}
        >
          Marchés
        </button>
      </div>
      
      {/* Notification Toast */}
      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      {/* Espace Section */}
      <div className={`section ${activeTab === 'Espace' ? 'active' : 'hidden'}`}>
        <div className="form-section">
        <EspaceForm 
          formData={EspaceFormData}
          onInputChange={handleEspaceInputChange}
          onSubmit={handleEspaceubmit}
          isEditing={isEditingEspace}
          onCancel={handleCancelEspaceEdit}
          personnes={personnes}
        />
        </div>
        
        <div className="data-section">
          <h3>Liste des espaces</h3>
          <DataTable 
            data={Espace}
            columns={EspaceColumns}
            onEdit={handleEditEspace}
            onDelete={handleDeleteEspace}
            isLoading={loading.Espace}
          />
        </div>
      </div>
      
      {/* Marchés Section */}
      <div className={`section ${activeTab === 'Marches' ? 'active' : 'hidden'}`}>
        <div className="form-section">
          <MarcheForm 
            formData={marcheFormData}
            onInputChange={handleMarcheInputChange}
            onSubmit={handleMarchesubmit}
            isEditing={isEditingMarche}
            onCancel={handleCancelMarcheEdit}
          />
        </div>
        
        <div className="data-section">
          <h3>Liste des Marchés</h3>
          <DataTable 
            data={Marches}
            columns={marcheColumns}
            onEdit={handleEditMarche}
            onDelete={handleDeleteMarche}
            isLoading={loading.Marches}
          />
        </div>
      </div>
      
      {/* CSS for styling */}
      <style jsx>{`
        .Marches-communaux-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        h2 {
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }
        
        h3 {
          color: #555;
          margin-bottom: 15px;
        }
        
        .tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }
        
        .tab {
          padding: 10px 20px;
          font-size: 16px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .tab.active {
          color: #3498db;
          border-bottom: 3px solid #3498db;
        }
        
        .section {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .section.hidden {
          display: none;
        }
        
        .form-section {
          background-color:#f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px #f9f9f9;
        }
        
        .form-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        
        .form-field label {
          font-weight: bold;
          color: #555;
        }
        
        .form-row {
          display: flex;
          gap: 15px;
        }
        
        .form-row .form-field {
          flex: 1;
        }
        
        input, select, textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        textarea {
          min-height: 80px;
        }
        
        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        
        button {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        color: #bdb6b6;
        }
        
        button[type="submit"] {
          background-color: #3498db;
          color: white;
        }
        
        button[type="submit"]:hover {
          background-color: #2980b9;
        }
        
        .cancel-button {
          background-color: #e74c3c;
          color: white;
        }
        
        .cancel-button:hover {
          background-color: #c0392b;
        }
        
        .data-section {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .table-responsive {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        th {
          background-color:#f9f9f9;
          font-weight: bold;
          color: #555;
        }
        
        tr:hover {
          background-color:#f9f9f9;
        }
        
        .action-buttons {
          display: flex;
          gap: 10px;
        }
        
        .edit {
          background-color: #2ecc71;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .edit:hover {
          background-color: #27ae60;
        }
        
        .delete {
          background-color: #e74c3c;
          color: white;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .delete:hover {
          background-color: #c0392b;
        }
        
        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }
        
        .no-data {
          text-align: center;
          padding: 20px;
          color: #666;
          font-style: italic;
        }
        
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 20px;
          border-radius: 4px;
          background-color: #2ecc71;
          color: white;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          max-width: 350px;
        }
        
        .toast.error {
          background-color: #e74c3c;
        }
        
        .toast-close {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default MarchesCommunaux;