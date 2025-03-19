import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './parcelle.css';

const Parcelle = () => {
  const [parcelles, setParcelles] = useState([]);
  const [personnesPhysiques, setPersonnesPhysiques] = useState([]);
  const [personnesMorales, setPersonnesMorales] = useState([]);
  const [parcelleFormData, setParcelleFormData] = useState({
    numero: '',
    annexe: '', 
    numero_secteur: '',
    numero_lot: '',
    lotissement: '',
    consistance: '',
    avenue: '',
    rue: '',
    numero_parcelle: '',
    titre: '',
    surface_totale: '',
    surface_taxable: '',
    sdau: '',
    date_eclatement: ''
  });

  const [personnePhysiqueFormData, setPersonnePhysiqueFormData] = useState({
    nom: '',
    prenom: '',
    cnie: '',
    telephone: '',
    addresse: ''
  });

  const [personneMoraleFormData, setPersonneMoraleFormData] = useState({
    rc: '',
    raison_sociale: '',
    if_field: '',
    ice: '',
    addresse_domicile: ''
  });

  // States for editing functionality
  const [editParcelleId, setEditParcelleId] = useState(null);
  const [editPersonnePhysiqueId, setEditPersonnePhysiqueId] = useState(null);
  const [editPersonneMoraleId, setEditPersonneMoraleId] = useState(null);
  const [activeTab, setActiveTab] = useState('parcelles');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState({
    parcelles: false,
    personnesPhysiques: false,
    personnesMorales: false
  });

  // Charger les données
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(prev => ({ ...prev, parcelles: true }));
    axios.get('http://127.0.0.1:8000/api/parcelles/')
      .then(response => {
        console.log('Parcelles reçues:', response.data);
        setParcelles(response.data);
        setLoading(prev => ({ ...prev, parcelles: false }));
      })
      .catch(error => {
        console.error('Erreur de récupération des parcelles', error);
        showNotification('Impossible de charger les parcelles', 'error');
        setLoading(prev => ({ ...prev, parcelles: false }));
      });
  
    setLoading(prev => ({ ...prev, personnesPhysiques: true }));
    axios.get('http://127.0.0.1:8000/api/personnes-physiques/')
      .then(response => {
        console.log('Personnes physiques reçues:', response.data);
        setPersonnesPhysiques(response.data);
        setLoading(prev => ({ ...prev, personnesPhysiques: false }));
      })
      .catch(error => {
        console.error('Erreur de récupération des personnes physiques', error);
        showNotification('Impossible de charger les personnes physiques', 'error');
        setLoading(prev => ({ ...prev, personnesPhysiques: false }));
      });
      
    setLoading(prev => ({ ...prev, personnesMorales: true }));
    axios.get('http://127.0.0.1:8000/api/personnes-morales/')
      .then(response => {
        console.log('Personnes morales reçues:', response.data);
        setPersonnesMorales(response.data);
        setLoading(prev => ({ ...prev, personnesMorales: false }));
      })
      .catch(error => {
        console.error('Erreur de récupération des personnes morales', error);
        showNotification('Impossible de charger les personnes morales', 'error');
        setLoading(prev => ({ ...prev, personnesMorales: false }));
      });
  };
  
  // Helper for showing notifications
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Gérer les changements dans les formulaires
  const handleParcelleInputChange = (e) => {
    const { name, value } = e.target;
    setParcelleFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePersonnePhysiqueInputChange = (e) => {
    const { name, value } = e.target;
    setPersonnePhysiqueFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePersonneMoraleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonneMoraleFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Ajouter ou mettre à jour une parcelle
  const handleSubmitParcelle = (e) => {
    e.preventDefault();
    
    const formData = {
      ...parcelleFormData,
      numero: parcelleFormData.numero ? parseInt(parcelleFormData.numero, 10) : null,
      annexe: parseInt(parcelleFormData.annexe, 10),
      numero_secteur: parcelleFormData.numero_secteur ? parseInt(parcelleFormData.numero_secteur, 10) : null,
      titre: parseInt(parcelleFormData.titre, 10),
      surface_totale: parcelleFormData.surface_totale ? parseFloat(parcelleFormData.surface_totale) : null,
      surface_taxable: parcelleFormData.surface_taxable ? parseFloat(parcelleFormData.surface_taxable) : null
    };
    if (editParcelleId) {
      // Mise à jour d'une parcelle existante
      axios.put(`http://127.0.0.1:8000/api/parcelles/${editParcelleId}/`, formData)
        .then(response => {
          console.log('Parcelle mise à jour:', response.data);
          setParcelles(parcelles.map(parcelle => 
            parcelle.id === editParcelleId ? response.data : parcelle
          ));
          resetParcelleForm();
          showNotification('Parcelle mise à jour avec succès');
        })
        .catch(error => {
          console.error('Erreur de mise à jour de parcelle', error);
          const errorMessage = error.response?.data?.detail || 'Erreur lors de la mise à jour de la parcelle';
          showNotification(errorMessage, 'error');
        });
    } else {
      // Ajout d'une nouvelle parcelle
      axios.post('http://127.0.0.1:8000/api/parcelles/', formData)
        .then(response => {
          console.log('Nouvelle parcelle ajoutée:', response.data);
          setParcelles([...parcelles, response.data]);
          resetParcelleForm();
          showNotification('Nouvelle parcelle ajoutée avec succès');
        })
        .catch(error => {
          console.error('Erreur d\'ajout de parcelle', error);
          const errorMessage = error.response?.data?.detail || 'Erreur lors de l\'ajout de la parcelle';
          showNotification(errorMessage, 'error');
        });
    }
  };

  // Ajouter ou mettre à jour une personne physique
  const handleSubmitPersonnePhysique = (e) => {
    e.preventDefault();
    
    const formData = {
      ...personnePhysiqueFormData,
      telephone: personnePhysiqueFormData.telephone ? parseInt(personnePhysiqueFormData.telephone, 10) : null
    };
    
    if (editPersonnePhysiqueId) {
      axios.put(`http://127.0.0.1:8000/api/personnes-physiques/${editPersonnePhysiqueId}/`, formData)
        .then(response => {
          console.log('Personne physique mise à jour:', response.data);
          setPersonnesPhysiques(personnesPhysiques.map(personne => 
            personne.id === editPersonnePhysiqueId ? response.data : personne
          ));
          resetPersonnePhysiqueForm();
          showNotification('Personne physique mise à jour avec succès');
        })
        .catch(error => {
          console.error('Erreur de mise à jour de personne physique', error);
          const errorMessage = error.response?.data?.detail || 'Erreur lors de la mise à jour de la personne physique';
          showNotification(errorMessage, 'error');
        });
    } else {
      axios.post('http://127.0.0.1:8000/api/personnes-physiques/', formData)
        .then(response => {
          console.log('Nouvelle personne physique ajoutée:', response.data);
          setPersonnesPhysiques([...personnesPhysiques, response.data]);
          resetPersonnePhysiqueForm();
          showNotification('Nouvelle personne physique ajoutée avec succès');
        })
        .catch(error => {
          console.error('Erreur d\'ajout de personne physique', error);
          const errorMessage = error.response?.data?.detail || 'Erreur lors de l\'ajout de la personne physique';
          showNotification(errorMessage, 'error');
        });
    }
  };

  // Ajouter ou mettre à jour une personne morale
  const handleSubmitPersonneMorale = (e) => {
    e.preventDefault();
    
    const formData = {
      ...personneMoraleFormData,
      rc: parseInt(personneMoraleFormData.rc, 10),
      if_field: personneMoraleFormData.if_field ? parseInt(personneMoraleFormData.if_field, 10) : null  // Changé de 'if_number' à 'if_field'
    };

    if (editPersonneMoraleId) {
      axios.put(`http://127.0.0.1:8000/api/personnes-morales/${editPersonneMoraleId}/`, formData)
        .then(response => {
          console.log('Personne morale mise à jour:', response.data);
          setPersonnesMorales(personnesMorales.map(personne => 
            personne.id === editPersonneMoraleId ? response.data : personne
          ));
          resetPersonneMoraleForm();
          showNotification('Personne morale mise à jour avec succès');
        })
        .catch(error => {
          console.error('Erreur de mise à jour de personne morale', error);
          const errorMessage = error.response?.data?.detail || 'Erreur lors de la mise à jour de la personne morale';
          showNotification(errorMessage, 'error');
        });
    } else {
      axios.post('http://127.0.0.1:8000/api/personnes-morales/', formData)
        .then(response => {
          console.log('Nouvelle personne morale ajoutée:', response.data);
          setPersonnesMorales([...personnesMorales, response.data]);
          resetPersonneMoraleForm();
          showNotification('Nouvelle personne morale ajoutée avec succès');
        })
        .catch(error => {
          console.error('Erreur d\'ajout de personne morale', error);
          const errorMessage = error.response?.data?.detail || 'Erreur lors de l\'ajout de la personne morale';
          showNotification(errorMessage, 'error');
        });
    }
  };

  // Préparer l'édition d'une parcelle
// Pour les parcelles
const handleEditParcelle = (parcelle) => {
  setEditParcelleId(parcelle.id);
  setParcelleFormData({
    numero: parcelle.numero,
    annexe: parcelle.annexe,
    numero_secteur: parcelle.numero_secteur,
    numero_lot: parcelle.numero_lot,
    lotissement: parcelle.lotissement,
    consistance: parcelle.consistance,  // Corrigé de 'consisance' à 'consistance'
    avenue: parcelle.avenue,
    rue: parcelle.rue,
    titre: parcelle.titre,
    surface_totale: parcelle.surface_totale,
    surface_taxable: parcelle.surface_taxable,
    sdau: parcelle.sdau,
    date_eclatement: parcelle.date_eclatement
  });
  setActiveTab('parcelles');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
  // Préparer l'édition d'une personne physique
  const handleEditPersonnePhysique = (personne) => {
    setEditPersonnePhysiqueId(personne.id);
    setPersonnePhysiqueFormData({
      nom: personne.nom,
      prenom: personne.prenom,
      cnie: personne.cnie,
      telephone: personne.telephone,
      addresse: personne.addresse
    });
    setActiveTab('personnesPhysiques');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

// Pour les personnes morales
const handleEditPersonneMorale = (personne) => {
  setEditPersonneMoraleId(personne.id);
  setPersonneMoraleFormData({
    rc: personne.rc,
    raison_sociale: personne.raison_sociale,
    if_field: personne.if_field,  // Changé de 'if_number' à 'if_field'
    ice: personne.ice,
    adresse_domicile: personne.adresse_domicile  // Standardisé à 'adresse_domicile'
  });
  setActiveTab('personnesMorales');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};



  // Pour les parcelles
const resetParcelleForm = () => {
  setParcelleFormData({
    numero: '',
    annexe: '',
    numero_secteur: '',
    numero_lot: '',
    lotissement: '',
    consistance: '',  // Corrigé de 'consisance' à 'consistance'
    avenue: '',
    rue: '',
    titre: '',
    surface_totale: '',
    surface_taxable: '',
    sdau: '',
    date_eclatement: ''
  });
  setEditParcelleId(null);
};

const resetPersonnePhysiqueForm = () => {
  setPersonnePhysiqueFormData({
    nom: '',
    prenom: '',
    cnie: '',
    telephone: '',
    addresse: ''
  });
  setEditPersonnePhysiqueId(null);
};

// Pour les personnes morales
const resetPersonneMoraleForm = () => {
  setPersonneMoraleFormData({
    rc: '',
    raison_sociale: '',
    if_field: '',  // Changé de 'if_number' à 'if_field'
    ice: '',
    adresse_domicile: ''  // Standardisé à 'adresse_domicile'
  });
  setEditPersonneMoraleId(null);
};


  // Supprimer une parcelle
  const handleDeleteParcelle = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette parcelle?')) {
      return;
    }
    
    axios.delete(`http://127.0.0.1:8000/api/parcelles/${id}/`)
      .then(() => {
        setParcelles(parcelles.filter(parcelle => parcelle.id !== id));
        showNotification('Parcelle supprimée avec succès');
      })
      .catch(error => {
        console.error('Erreur de suppression de parcelle', error);
        showNotification('Erreur lors de la suppression de la parcelle', 'error');
      });
  };

  // Supprimer une personne physique
  const handleDeletePersonnePhysique = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette personne physique?')) {
      return;
    }
    
    axios.delete(`http://127.0.0.1:8000/api/personnes-physiques/${id}/`)
      .then(() => {
        setPersonnesPhysiques(personnesPhysiques.filter(personne => personne.id !== id));
        showNotification('Personne physique supprimée avec succès');
      })
      .catch(error => {
        console.error('Erreur de suppression de personne physique', error);
        showNotification('Erreur lors de la suppression de la personne physique', 'error');
      });
  };

  // Supprimer une personne morale
  const handleDeletePersonneMorale = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette personne morale?')) {
      return;
    }
    
    axios.delete(`http://127.0.0.1:8000/api/personnes-morales/${id}/`)
      .then(() => {
        setPersonnesMorales(personnesMorales.filter(personne => personne.id !== id));
        showNotification('Personne morale supprimée avec succès');
      })
      .catch(error => {
        console.error('Erreur de suppression de personne morale', error);
        showNotification('Erreur lors de la suppression de la personne morale', 'error');
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
  const parcelleColumns = [
    { key: 'numero', label: 'Numéro' },
    { key: 'titre', label: 'Titre' },
    { key: 'lotissement', label: 'Lotissement' },
    { key: 'consistance', label: 'Consistance' },  
    { key: 'surface_totale', label: 'Surface totale' }
  ];
  const personnePhysiqueColumns = [
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'cnie', label: 'CNIE' },
    { key: 'telephone', label: 'Téléphone' }
  ];

  const personneMoraleColumns = [
    { key: 'rc', label: 'RC' },
    { key: 'raison_sociale', label: 'Raison sociale' },
    { key: 'if_field', label: 'IF' },  // Changé de 'if_number' à 'if_field'
    { key: 'ice', label: 'ICE' }
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
          className={`tab ${activeTab === 'parcelles' ? 'active' : ''}`}
          onClick={() => setActiveTab('parcelles')}
        >
          Parcelles
        </button>
        <button 
          className={`tab ${activeTab === 'personnesPhysiques' ? 'active' : ''}`}
          onClick={() => setActiveTab('personnesPhysiques')}
        >
          Requérants (Personnes Physiques)
        </button>
        <button 
          className={`tab ${activeTab === 'personnesMorales' ? 'active' : ''}`}
          onClick={() => setActiveTab('personnesMorales')}
        >
          Requérants (Personnes Morales)
        </button>
      </div>
      
      {/* Parcelles Tab */}
      <div className={`tab-content ${activeTab === 'parcelles' ? 'active' : ''}`}>        
        <form onSubmit={handleSubmitParcelle} className="form">
          <div className="form-row">
            <FormField 
              type="number"
              name="annexe"
              value={parcelleFormData.annexe}
              onChange={handleParcelleInputChange}
              placeholder="Annexe"
              required
            />
            
            <FormField 
              type="number"
              name="numero_secteur"
              value={parcelleFormData.numero_secteur}
              onChange={handleParcelleInputChange}
              placeholder="Numéro de secteur"
            />
          </div>
          
          <div className="form-row">
            <FormField 
              type="text"
              name="numero_lot"
              value={parcelleFormData.numero_lot}
              onChange={handleParcelleInputChange}
              placeholder="Numéro de lot"
            />
            
            <FormField 
              type="text"
              name="lotissement"
              value={parcelleFormData.lotissement}
              onChange={handleParcelleInputChange}
              placeholder="Lotissement"
            />
          </div>
          
          <div className="form-row">
            <FormField 
              type="text"
              name="consistance"
              value={parcelleFormData.consistance}
              onChange={handleParcelleInputChange}
              placeholder="consistance"
            />
            
            <FormField 
              type="text"
              name="avenue"
              value={parcelleFormData.avenue}
              onChange={handleParcelleInputChange}
              placeholder="Avenue"
            />
          </div>
          
          <div className="form-row">
            <FormField 
              type="text"
              name="rue"
              value={parcelleFormData.rue}
              onChange={handleParcelleInputChange}
              placeholder="Rue"
            />
            
            <FormField 
              type="number"
              name="numero_parcelle"
              value={parcelleFormData.numero_parcelle}
              onChange={handleParcelleInputChange}
              placeholder="Numéro"
            />
          </div>
          
          <div className="form-row">
            <FormField 
              type="number"
              name="titre"
              value={parcelleFormData.titre}
              onChange={handleParcelleInputChange}
              placeholder="Titre"
              required
            />
            
            <FormField 
              type="number"
              name="surface_totale"
              value={parcelleFormData.surface_totale}
              onChange={handleParcelleInputChange}
              placeholder="Surface totale"
            />
          </div>
          
          <div className="form-row">
            <FormField 
              type="number"
              name="surface_taxable"
              value={parcelleFormData.surface_taxable}
              onChange={handleParcelleInputChange}
              placeholder="Surface Taxable"
            />
            
            <FormField 
              type="text"
              name="sdau"
              value={parcelleFormData.sdau}
              onChange={handleParcelleInputChange}
              placeholder="SDAU"
            />
          </div>
          
          <FormField 
            type="date"
            name="date_eclatement"
            value={parcelleFormData.date_eclatement}
            onChange={handleParcelleInputChange}
            placeholder="Date Eclatement"
          />
          
          <div className="button-group">
            <button type="submit" className="submit-button">
              {editParcelleId ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editParcelleId && (
              <button type="button" className="cancel-button" onClick={resetParcelleForm}>
                Annuler
              </button>
            )}
          </div>
        </form>
        
        <h2>Liste des parcelles</h2>
        <DataTable 
          data={parcelles}
          columns={parcelleColumns}
          onEdit={handleEditParcelle}
          onDelete={handleDeleteParcelle}
          isLoading={loading.parcelles}
        />
      </div>
      
      {/* Personnes Physiques Tab */}
      <div className={`tab-content ${activeTab === 'personnesPhysiques' ? 'active' : ''}`}>
        
        <form onSubmit={handleSubmitPersonnePhysique} className="form">
          <div className="form-row">
            <FormField 
              type="text"
              name="nom"
              value={personnePhysiqueFormData.nom}
              onChange={handlePersonnePhysiqueInputChange}
              placeholder="Nom"
              required
            />
            
            <FormField 
              type="text"
              name="prenom"
              value={personnePhysiqueFormData.prenom}
              onChange={handlePersonnePhysiqueInputChange}
              placeholder="Prénom"
              required
            />
          </div>
          
          <div className="form-row">
            <FormField 
              type="text"
              name="cnie"
              value={personnePhysiqueFormData.cnie}
              onChange={handlePersonnePhysiqueInputChange}
              placeholder="CNIE"
              required
            />
            
            <FormField 
              type="number"
              name="telephone"
              value={personnePhysiqueFormData.telephone}
              onChange={handlePersonnePhysiqueInputChange}
              placeholder="Téléphone"
            />
          </div>
          
          <FormField 
            type="textarea"
            name="addresse"
            value={personnePhysiqueFormData.addresse}
            onChange={handlePersonnePhysiqueInputChange}
            placeholder="Adresse"
          />
          
          <div className="button-group">
            <button type="submit" className="submit-button">
              {editPersonnePhysiqueId ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editPersonnePhysiqueId && (
              <button type="button" className="cancel-button" onClick={resetPersonnePhysiqueForm}>
                Annuler
              </button>
            )}
          </div>
        </form>
        
        <h2>Liste des requérants (personnes physiques)</h2>
        <DataTable 
          data={personnesPhysiques}
          columns={personnePhysiqueColumns}
          onEdit={handleEditPersonnePhysique}
          onDelete={handleDeletePersonnePhysique}
          isLoading={loading.personnesPhysiques}
        />
      </div>
      
      {/* Personnes Morales Tab */}
      <div className={`tab-content ${activeTab === 'personnesMorales' ? 'active' : ''}`}>        
        <form onSubmit={handleSubmitPersonneMorale} className="form">
          <div className="form-row">
            <FormField 
              type="number"
              name="rc"
              value={personneMoraleFormData.rc}
              onChange={handlePersonneMoraleInputChange}
              placeholder="RC"
              required
            />
            
            <FormField 
              type="text"
              name="raison_sociale"
              value={personneMoraleFormData.raison_sociale}
              onChange={handlePersonneMoraleInputChange}
              placeholder="Raison Sociale"
              required
            />
          </div>
          <div className="form-row">
            <FormField 
              type="number"
              name="if_field"
              value={personneMoraleFormData.if_field}
              onChange={handlePersonneMoraleInputChange}
              placeholder="IF"
            />
            
            <FormField 
              type="text"
              name="ice"
              value={personneMoraleFormData.ice}
              onChange={handlePersonneMoraleInputChange}
              placeholder="ICE"
              required
            />
          </div>
          
          <FormField 
            type="textarea"
            name="addresse_domicile"
            value={personneMoraleFormData.addresse_domicile}
            onChange={handlePersonneMoraleInputChange}
            placeholder="Adresse Domicile"
          />
          
          <div className="button-group">
            <button type="submit" className="submit-button">
              {editPersonneMoraleId ? 'Mettre à jour' : 'Ajouter'}
            </button>
            {editPersonneMoraleId && (
              <button type="button" className="cancel-button" onClick={resetPersonneMoraleForm}>
                Annuler
              </button>
            )}
          </div>
        </form>
        
        <h2>Liste des requérants (personnes morales)</h2>
        <DataTable 
          data={personnesMorales}
          columns={personneMoraleColumns}
          onEdit={handleEditPersonneMorale}
          onDelete={handleDeletePersonneMorale}
          isLoading={loading.personnesMorales}
        />
      </div>
    </div>
  );
};

export default Parcelle;