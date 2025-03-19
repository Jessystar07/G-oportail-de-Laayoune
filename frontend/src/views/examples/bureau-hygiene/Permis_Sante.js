import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PermisSante = () => {
  const [permits, setPermits] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [permitFormData, setPermitFormData] = useState({
    date_reception: '',
    date: '',
    delivreur: '',  
    reference: '',
    observations: ''
  });

  // Function to load permits data
  const loadPermits = () => {
    axios.get('http://localhost:8000/api/PermisSante/')  
      .then(response => setPermits(response.data))
      .catch(error => console.error('Erreur de récupération des permis de santé', error));
  };

  // Load data on component mount
  useEffect(() => {
    // Load permits
    loadPermits();
  }, []);

  const handlePermitInputChange = (e) => {
    const { name, value } = e.target;
    setPermitFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddOrUpdatePermit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing permit
      axios.put(`http://localhost:8000/api/PermisSante/${editingId}/`, permitFormData)
        .then(() => {
          setEditingId(null);
          resetForm();
          loadPermits(); // Reload permits after update
        })
        .catch(error => console.error('Erreur de mise à jour du permis de santé', error));
    } else {
      // Add new permit
      axios.post('http://localhost:8000/api/PermisSante/', permitFormData)
        .then(() => {
          resetForm();
          loadPermits(); // Reload permits after addition
        })
        .catch(error => console.error('Erreur d\'ajout de permis de santé', error));
    }
  };

  const handleEditPermit = (permit) => {
    setEditingId(permit.id);
    
    setPermitFormData({
      date_reception: permit.date_reception,
      date: permit.date || '',
      delivreur: permit.delivreur,
      reference: permit.reference,
      observations: permit.observations || ''
    });
  };

  const handleDeletePermit = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce permis?')) {
      axios.delete(`http://localhost:8000/api/PermisSante/${id}/`)
        .then(() => {
          loadPermits(); // Reload permits after deletion
        })
        .catch(error => console.error('Erreur de suppression de permis de santé', error));
    }
  };

  const resetForm = () => {
    setPermitFormData({
      date_reception: '',
      date: '',
      delivreur: '',
      reference: '',
      observations: ''
    });
    setEditingId(null);
  };

  return (
    <div className="table-container">
      <h3>{editingId ? 'Modifier le' : 'Ajouter un'} Permis de Santé</h3>
      <form onSubmit={handleAddOrUpdatePermit}>
        <label>Date de Réception *</label>
        <input 
          type="date" 
          name="date_reception" 
          value={permitFormData.date_reception} 
          onChange={handlePermitInputChange} 
          required 
        />

        <label>Délivreur *</label>
        <input 
          type="text" 
          name="delivreur" 
          value={permitFormData.delivreur} 
          onChange={handlePermitInputChange} 
          placeholder="Délivreur"
          required 
        />

        <label>Référence *</label>
        <input 
          type="text" 
          name="reference" 
          value={permitFormData.reference} 
          onChange={handlePermitInputChange} 
          placeholder="Référence"
          required 
        />

        <label>Observations</label>
        <textarea 
          name="observations" 
          value={permitFormData.observations || ''} 
          onChange={handlePermitInputChange} 
          placeholder="Observations"
        />

        <label>Date</label>
        <input 
          type="date" 
          name="date" 
          value={permitFormData.date} 
          onChange={handlePermitInputChange} 
        />

        <div className="form-buttons">
          <button type="submit">
            {editingId ? 'Mettre à jour' : 'Ajouter'} le Permis
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
            <th>Date de Réception</th>
            <th>Délivreur</th>
            <th>Référence</th>
            <th>Observations</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permits.map(permit => (
            <tr key={permit.id}>
              <td>{permit.date_reception}</td>
              <td>{permit.delivreur}</td>
              <td>{permit.reference}</td>
              <td>{permit.observations}</td>
              <td>{permit.date}</td>
              <td>
                <button 
                  className="edit" 
                  onClick={() => handleEditPermit(permit)}
                >
                  <i className="fa fa-edit"></i>
                </button>
                <button 
                  className="delete" 
                  onClick={() => handleDeletePermit(permit.id)}
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

export default PermisSante;