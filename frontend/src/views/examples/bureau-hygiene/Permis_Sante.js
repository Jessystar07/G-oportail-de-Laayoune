import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'views/examples/regie-marches/Styletable.css';  
const PermisSante = () => {
  const [permits, setPermits] = useState([]);
  const [delivreurs, setDelivreurs] = useState([]);   
  const [permitFormData, setPermitFormData] = useState({
    date_reception: '',
    delivreur: '',  
    reference: '',
    observations: '',
    date: ''
  });

  // Charger les données des permis et des délivreurs
  useEffect(() => {
    axios.get('http://localhost:8000/api/permits/')  
      .then(response => {
        setPermits(response.data);
      })
      .catch(error => {
        console.error('Erreur de récupération des permis de santé', error);
      });

    axios.get('http://localhost:8000/api/delivreurs/')  
      .then(response => {
        setDelivreurs(response.data);
      })
      .catch(error => {
        console.error('Erreur de récupération des délivreurs', error);
      });
  }, []);

  // Gérer la modification des valeurs dans le formulaire
  const handlePermitInputChange = (e) => {
    const { name, value } = e.target;
    setPermitFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Ajouter un nouveau permis de santé
  const handleAddPermit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/permits/', permitFormData)
      .then(response => {
        setPermits([...permits, response.data]);
        setPermitFormData({
          date_reception: '',
          delivreur: '',
          reference: '',
          observations: '',
          date: ''
        });
      })
      .catch(error => {
        console.error('Erreur d’ajout de permis de santé', error);
      });
  };

  // Supprimer un permis de santé
  const handleDeletePermit = (id) => {
    axios.delete(`http://localhost:8000/api/permits/${id}/`)
      .then(() => {
        setPermits(permits.filter(permit => permit.id !== id));
      })
      .catch(error => {
        console.error('Erreur de suppression de permis de santé', error);
      });
  };

  return (
    <div className="table-container">
      <h2>Gestion des Permis de Santé</h2>

      {/* Formulaire pour le Permis de santé */}
      <h3>Ajouter un Permis de Santé</h3>
      <form onSubmit={handleAddPermit}>
        <input 
          type="date" 
          name="date_reception" 
          value={permitFormData.date_reception} 
          onChange={handlePermitInputChange} 
          required 
        />
        <select 
          name="delivreur" 
          value={permitFormData.delivreur} 
          onChange={handlePermitInputChange} 
          required
        >
          <option value="">Sélectionnez un délivreur</option>
          {delivreurs.map(delivreur => (
            <option key={delivreur.id} value={delivreur.id}>
              {delivreur.nom} {/* Remplacez "nom" par le champ réel représentant le délivreur */}
            </option>
          ))}
        </select>
        <input 
          type="text" 
          name="reference" 
          value={permitFormData.reference} 
          onChange={handlePermitInputChange} 
          placeholder="Référence" 
          required 
        />
        <textarea 
          name="observations" 
          value={permitFormData.observations} 
          onChange={handlePermitInputChange} 
          placeholder="Observations" 
        />
        <input 
          type="date" 
          name="date" 
          value={permitFormData.date} 
          onChange={handlePermitInputChange} 
          required 
        />
        <button type="submit">Ajouter un Permis</button>
      </form>

      {/* Table des Permis de Santé */}
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
              <td>{permit.delivreur ? permit.delivreur.nom : 'Non défini'}</td> {/* Remplacez "nom" par le champ réel */}
              <td>{permit.reference}</td>
              <td>{permit.observations}</td>
              <td>{permit.date}</td>
              <td>
                <button className="delete" onClick={() => handleDeletePermit(permit.id)}>
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
