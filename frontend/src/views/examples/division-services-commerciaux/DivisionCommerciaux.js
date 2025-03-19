import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DivisionCommerciaux.css'
const DivisionCommerciaux = () => {
  const [permits, setPermits] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [permitFormData, setPermitFormData] = useState({
    autorise: false,
    exonere: false,
    activite: '',
    specialite: '',
    adresse: '',
    annexe: '',
    arrondissement: '',
    observations: '',
    date_permis: '',
    numero_permis: '',
    reparations: ''
  });

  const [inspectionFormData, setInspectionFormData] = useState({
    date: '',
    inspection_technicien: '',
    type_occupation: '',
    surface: '',
    observations: ''
  });

  // Options pour le type d'occupation
  const typeOccupationOptions = [
    'الملك الجماعي عاري m²',
    'الملك الجماعي مغطى m²',
    'لوحة إشهارية m²',
    'نصب اشهاري'
  ];

  // States for editing functionality
  const [editPermitId, setEditPermitId] = useState(null);
  const [editInspectionId, setEditInspectionId] = useState(null);
  const [activeTab, setActiveTab] = useState('permits');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState({
    permits: false,
    inspections: false
  });

  // Charger les permis commerciaux et les inspections
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(prev => ({ ...prev, permits: true }));
    axios.get('http://127.0.0.1:8000/api/PermisCommercial/')
      .then(response => {
        console.log('Permis reçus:', response.data);
        setPermits(response.data);
        setLoading(prev => ({ ...prev, permits: false }));
      })
      .catch(error => {
        console.error('Erreur de récupération des permis commerciaux', error);
        showNotification('Impossible de charger les permis', 'error');
        setLoading(prev => ({ ...prev, permits: false }));
      });
  
    setLoading(prev => ({ ...prev, inspections: true }));
    axios.get('http://127.0.0.1:8000/api/Inspection/')
      .then(response => {
        console.log('Inspections reçues:', response.data);
        setInspections(response.data);
        setLoading(prev => ({ ...prev, inspections: false }));
      })
      .catch(error => {
        console.error('Erreur de récupération des inspections', error);
        showNotification('Impossible de charger les inspections', 'error');
        setLoading(prev => ({ ...prev, inspections: false }));
      });
  };
  
  // Helper for showing notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Gérer les changements dans les formulaires
  const handlePermitInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPermitFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleInspectionInputChange = (e) => {
    const { name, value } = e.target;
    setInspectionFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Ajouter ou mettre à jour un permis commercial
  const handleSubmitPermit = (e) => {
    e.preventDefault();
    
    const formData = {
      ...permitFormData,
      annexe: permitFormData.annexe ? parseInt(permitFormData.annexe, 10) : null,
      arrondissement: permitFormData.arrondissement ? parseInt(permitFormData.arrondissement, 10) : null
    };
    
    if (editPermitId) {
      // Mise à jour d'un permis existant
      axios.put(`http://127.0.0.1:8000/api/PermisCommercial/${editPermitId}/`, formData)
        .then(response => {
          console.log('Permis mis à jour:', response.data);
          setPermits(permits.map(permit => 
            permit.id === editPermitId ? response.data : permit
          ));
          resetPermitForm();
          showNotification('Permis mis à jour avec succès');
        })
        .catch(error => {
          console.error('Erreur de mise à jour de permis commercial', error);
          const errorMessage = error.response?.data?.detail || 'Erreur lors de la mise à jour du permis';
          showNotification(errorMessage, 'error');
        });
    } else {
      // Ajout d'un nouveau permis
      axios.post('http://127.0.0.1:8000/api/PermisCommercial/', formData)
        .then(response => {
          console.log('Nouveau permis ajouté:', response.data);
          setPermits([...permits, response.data]);
          resetPermitForm();
          showNotification('Nouveau permis ajouté avec succès');
        })
        .catch(error => {
          console.error('Erreur d\'ajout de permis commercial', error);
          const errorMessage = error.response?.data?.detail || 'Erreur lors de l\'ajout du permis';
          showNotification(errorMessage, 'error');
        });
    }
  };

  const handleSubmitInspection = (e) => {
    e.preventDefault();
    
    const formData = {
      date: inspectionFormData.date,
      inspection_technicien: inspectionFormData.inspection_technicien,
      type_occupation: inspectionFormData.type_occupation,
      surface: parseFloat(inspectionFormData.surface),
      observations: inspectionFormData.observations
    };
    
    console.log("Inspection data being sent:", JSON.stringify(formData));
    
    if (editInspectionId) {
      axios.put(`http://127.0.0.1:8000/api/Inspection/${editInspectionId}/`, formData)
        .then(response => {
          console.log('Inspection mise à jour:', response.data);
          setInspections(inspections.map(inspection => 
            inspection.id === editInspectionId ? response.data : inspection
          ));
          resetInspectionForm();
          showNotification('Inspection mise à jour avec succès');
        })
        .catch(error => {
          console.error('Erreur de mise à jour de l\'inspection commerciale', error);
          const errorMessage = error.response?.data?.detail || 'Erreur lors de la mise à jour de l\'inspection';
          showNotification(errorMessage, 'error');
        });
    } else {
      // Ajout d'une nouvelle inspection
      axios.post('http://127.0.0.1:8000/api/Inspection/', formData)
        .then(response => {
          console.log('Nouvelle inspection ajoutée:', response.data);
          setInspections([...inspections, response.data]);
          resetInspectionForm();
          showNotification('Nouvelle inspection ajoutée avec succès');
        })
        .catch(error => {
          console.error('Erreur d\'ajout d\'inspection commerciale', error);
          const errorMessage = error.response?.data?.detail || 'Erreur lors de l\'ajout de l\'inspection';
          showNotification(errorMessage, 'error');
        });
    }
  };

  // Préparer l'édition d'un permis commercial
  const handleEditPermit = (permit) => {
    setEditPermitId(permit.id);
    setPermitFormData({
      autorise: permit.autorise,
      exonere: permit.exonere,
      activite: permit.activite,
      specialite: permit.specialite,
      adresse: permit.adresse,
      annexe: permit.annexe,
      arrondissement: permit.arrondissement,
      observations: permit.observations,
      date_permis: permit.date_permis,
      numero_permis: permit.numero_permis,
      reparations: permit.reparations
    });
    setActiveTab('permits');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Préparer l'édition d'une inspection commerciale
  const handleEditInspection = (inspection) => {
    setEditInspectionId(inspection.id);
    setInspectionFormData({
      date: inspection.date,
      inspection_technicien: inspection.inspection_technicien,
      type_occupation: inspection.type_occupation,
      surface: inspection.surface,
      observations: inspection.observations
    });
    setActiveTab('inspections');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Réinitialiser le formulaire de permis
  const resetPermitForm = () => {
    setPermitFormData({
      autorise: false,
      exonere: false,
      activite: '',
      specialite: '',
      adresse: '',
      annexe: '',
      arrondissement: '',
      observations: '',
      date_permis: '',
      numero_permis: '',
      reparations: ''
    });
    setEditPermitId(null);
  };

  // Réinitialiser le formulaire d'inspection
  const resetInspectionForm = () => {
    setInspectionFormData({
      date: '',
      inspection_technicien: '',
      type_occupation: '',
      surface: '',
      observations: ''
    });
    setEditInspectionId(null);
  };

  // Supprimer un permis commercial
  const handleDeletePermit = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce permis?')) {
      return;
    }
    
    axios.delete(`http://127.0.0.1:8000/api/PermisCommercial/${id}/`)
      .then(() => {
        setPermits(permits.filter(permit => permit.id !== id));
        showNotification('Permis supprimé avec succès');
      })
      .catch(error => {
        console.error('Erreur de suppression de permis commercial', error);
        showNotification('Erreur lors de la suppression du permis', 'error');
      });
  };

  // Supprimer une inspection commerciale
  const handleDeleteInspection = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette inspection?')) {
      return;
    }
    
    axios.delete(`http://127.0.0.1:8000/api/Inspection/${id}/`)
      .then(() => {
        setInspections(inspections.filter(inspection => inspection.id !== id));
        showNotification('Inspection supprimée avec succès');
      })
      .catch(error => {
        console.error('Erreur de suppression d\'inspection commerciale', error);
        showNotification('Erreur lors de la suppression de l\'inspection', 'error');
      });
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

  // FormField component pour les différents types de champs
  const FormField = ({ type, name, value, onChange, placeholder, required = false, checked, options = [] }) => {
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
            {options.map((option, index) => (
              <option key={index} value={typeof option === 'object' ? option.value : option}>
                {typeof option === 'object' ? option.label : option}
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
  
    if (type === 'checkbox') {
      return (
        <div className="form-field checkbox">
          <label htmlFor={name}>
            <input
              id={name}
              type="checkbox"
              name={name}
              checked={checked}
              onChange={onChange}
            />
            {placeholder}
          </label>
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

  // Colonnes pour les tableaux
  const permitColumns = [
    { key: 'numero_permis', label: 'Numéro de permis' },
    { key: 'date_permis', label: 'Date' },
    { key: 'activite', label: 'Activité' },
    { key: 'specialite', label: 'Spécialité' },
    { key: 'adresse', label: 'Adresse' },
    { 
      key: 'autorise', 
      label: 'Autorisé',
      render: (item) => item.autorise ? 'Oui' : 'Non'
    },
    { 
      key: 'exonere', 
      label: 'Exonéré',
      render: (item) => item.exonere ? 'Oui' : 'Non'
    }
  ];

  const inspectionColumns = [
    { key: 'date', label: 'Date d\'inspection' },
    { key: 'inspection_technicien', label: 'Technicien' },
    { key: 'type_occupation', label: 'Type d\'occupation' },
    { key: 'surface', label: 'Surface (m²)' }
  ];

  return (
    <div className="division-container">      
      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'permits' ? 'active' : ''}`}
          onClick={() => setActiveTab('permits')}
        >
          Permis Commerciaux
        </button>
        <button 
          className={`tab ${activeTab === 'inspections' ? 'active' : ''}`}
          onClick={() => setActiveTab('inspections')}
        >
          Inspections
        </button>
      </div>
      
      <div className={`tab-content ${activeTab === 'permits' ? 'active' : ''}`}>        
        <form onSubmit={handleSubmitPermit} className="form">
          <div className="form-row">
            <FormField 
              type="text"
              name="numero_permis"
              value={permitFormData.numero_permis}
              onChange={handlePermitInputChange}
              placeholder="Numéro de permis"
              required
            />
            
            <FormField 
              type="date"
              name="date_permis"
              value={permitFormData.date_permis}
              onChange={handlePermitInputChange}
              placeholder="Date de permis"
              required
            />
          </div>
          
          <div className="form-row">
            <FormField 
              type="text"
              name="activite"
              value={permitFormData.activite}
              onChange={handlePermitInputChange}
              placeholder="Activité"
              required
            />
            
            <FormField 
              type="text"
              name="specialite"
              value={permitFormData.specialite}
              onChange={handlePermitInputChange}
              placeholder="Spécialité"
            />
          </div>
          
          <FormField 
            type="text"
            name="adresse"
            value={permitFormData.adresse}
            onChange={handlePermitInputChange}
            placeholder="Adresse"
            required
          />
          
          <div className="form-row">
            <FormField 
              type="number"
              name="annexe"
              value={permitFormData.annexe}
              onChange={handlePermitInputChange}
              placeholder="Annexe"
            />
            
            <FormField 
              type="number"
              name="arrondissement"
              value={permitFormData.arrondissement}
              onChange={handlePermitInputChange}
              placeholder="Arrondissement"
            />
          </div>
          
          <div className="form-row">
            <FormField 
              type="checkbox"
              name="autorise"
              checked={permitFormData.autorise}
              onChange={handlePermitInputChange}
              placeholder="Autorisé"
            />
            
            <FormField 
              type="checkbox"
              name="exonere"
              checked={permitFormData.exonere}
              onChange={handlePermitInputChange}
              placeholder="Exonéré"
            />
          </div>
          
          <FormField 
            type="textarea"
            name="observations"
            value={permitFormData.observations}
            onChange={handlePermitInputChange}
            placeholder="Observations"
          />
          
          <FormField 
            type="textarea"
            name="reparations"
            value={permitFormData.reparations}
            onChange={handlePermitInputChange}
            placeholder="Réparations"
          />
          
          <div className="button-group">
            <button type="submit" className="submit-button">
              {editPermitId ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editPermitId && (
              <button type="button" className="cancel-button" onClick={resetPermitForm}>
                Annuler
              </button>
            )}
          </div>
        </form>
        
        <h2>Liste des permis commerciaux</h2>
        <DataTable 
          data={permits}
          columns={permitColumns}
          onEdit={handleEditPermit}
          onDelete={handleDeletePermit}
          isLoading={loading.permits}
        />
      </div>
      
      <div className={`tab-content ${activeTab === 'inspections' ? 'active' : ''}`}>        
        <form onSubmit={handleSubmitInspection} className="form">
      <div className="form-row">
        <FormField 
          type="date"
          name="date"
          value={inspectionFormData.date}
          onChange={handleInspectionInputChange}
          placeholder="Date d'inspection"
          required
        />
        
        <FormField 
          type="text"
          name="inspection_technicien"
          value={inspectionFormData.inspection_technicien}
          onChange={handleInspectionInputChange}
          placeholder="Technicien"
          required
        />
      </div>
      
      <div className="form-row">
        <FormField 
          type="select"
          name="type_occupation"
          value={inspectionFormData.type_occupation}
          onChange={handleInspectionInputChange}
          placeholder="Type d'occupation"
          options={typeOccupationOptions}
          required
        />
        
        <FormField 
          type="number"
          name="surface"
          value={inspectionFormData.surface}
          onChange={handleInspectionInputChange}
          placeholder="Surface (m²)"
          required
        />
      </div>
      
      <FormField 
        type="textarea"
        name="observations"
        value={inspectionFormData.observations}
        onChange={handleInspectionInputChange}
        placeholder="Observations"
      />
      
      <div className="button-group">
        <button type="submit" className="submit-button">
          {editInspectionId ? 'Mettre à jour' : 'Ajouter'}
        </button>
        {editInspectionId && (
          <button type="button" className="cancel-button" onClick={resetInspectionForm}>
            Annuler
          </button>
        )}
      </div>
    </form>

        
        <h2>Liste des inspections</h2>
        <DataTable 
          data={inspections}
          columns={inspectionColumns}
          onEdit={handleEditInspection}
          onDelete={handleDeleteInspection}
          isLoading={loading.inspections}
        />
      </div>
    </div>
    
  );
};

export default DivisionCommerciaux;