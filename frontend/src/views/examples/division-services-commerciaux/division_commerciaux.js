import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'views/examples/regie-marches/Styletable.css';  

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
    permis: '',
    inspection_date: '',
    inspection_technicien: '',
    type_occupation: '',
    surface: '',
    observations: ''
  });

  // Charger les permis commerciaux et les inspections
  useEffect(() => {
    axios.get('http://localhost:8000/api/permits/')  // Changez l'URL selon votre backend
      .then(response => {
        setPermits(response.data);
      })
      .catch(error => {
        console.error('Erreur de récupération des permis commerciaux', error);
      });

    axios.get('http://localhost:8000/api/inspections/')  // Changez l'URL pour récupérer les inspections
      .then(response => {
        setInspections(response.data);
      })
      .catch(error => {
        console.error('Erreur de récupération des inspections', error);
      });
  }, []);

  // Gérer les changements dans les formulaires
  const handlePermitInputChange = (e) => {
    const { name, value } = e.target;
    setPermitFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInspectionInputChange = (e) => {
    const { name, value } = e.target;
    setInspectionFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Ajouter un permis commercial
  const handleAddPermit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/permits/', permitFormData)
      .then(response => {
        setPermits([...permits, response.data]);
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
      })
      .catch(error => {
        console.error('Erreur d’ajout de permis commercial', error);
      });
  };

  // Ajouter une inspection commerciale
  const handleAddInspection = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/inspections/', inspectionFormData)
      .then(response => {
        setInspections([...inspections, response.data]);
        setInspectionFormData({
          permis: '',
          inspection_date: '',
          inspection_technicien: '',
          type_occupation: '',
          surface: '',
          observations: ''
        });
      })
      .catch(error => {
        console.error('Erreur d’ajout d’inspection commerciale', error);
      });
  };

  // Supprimer un permis commercial
  const handleDeletePermit = (id) => {
    axios.delete(`http://localhost:8000/api/permits/${id}/`)
      .then(() => {
        setPermits(permits.filter(permit => permit.id !== id));
      })
      .catch(error => {
        console.error('Erreur de suppression de permis commercial', error);
      });
  };

  // Supprimer une inspection commerciale
  const handleDeleteInspection = (id) => {
    axios.delete(`http://localhost:8000/api/inspections/${id}/`)
      .then(() => {
        setInspections(inspections.filter(inspection => inspection.id !== id));
      })
      .catch(error => {
        console.error('Erreur de suppression d’inspection commerciale', error);
      });
  };

  return (
    <div className="table-container">
      <h2>Gestion des Permis Commerciaux et Inspections</h2>

      {/* Formulaire pour ajouter un permis commercial */}
      <h3>Ajouter un Permis Commercial</h3>
      <form onSubmit={handleAddPermit}>
        <input type="checkbox" name="autorise" checked={permitFormData.autorise} onChange={handlePermitInputChange} /> Autorisé
        <input type="checkbox" name="exonere" checked={permitFormData.exonere} onChange={handlePermitInputChange} /> Exonéré
        <input type="text" name="activite" value={permitFormData.activite} onChange={handlePermitInputChange} placeholder="Activité" required />
        <input type="text" name="specialite" value={permitFormData.specialite} onChange={handlePermitInputChange} placeholder="Spécialité" />
        <textarea name="adresse" value={permitFormData.adresse} onChange={handlePermitInputChange} placeholder="Adresse" />
        <input type="number" name="annexe" value={permitFormData.annexe} onChange={handlePermitInputChange} placeholder="Annexe" required />
        <input type="number" name="arrondissement" value={permitFormData.arrondissement} onChange={handlePermitInputChange} placeholder="Arrondissement" required />
        <textarea name="observations" value={permitFormData.observations} onChange={handlePermitInputChange} placeholder="Observations" />
        <input type="date" name="date_permis" value={permitFormData.date_permis} onChange={handlePermitInputChange} required />
        <input type="text" name="numero_permis" value={permitFormData.numero_permis} onChange={handlePermitInputChange} placeholder="Numéro de Permis" required />
        <textarea name="reparations" value={permitFormData.reparations} onChange={handlePermitInputChange} placeholder="Réparations" />
        <button type="submit">Ajouter un Permis Commercial</button>
      </form>

      {/* Table des Permis Commerciaux */}
      <table>
        <thead>
          <tr>
            <th>Numéro de Permis</th>
            <th>Activité</th>
            <th>Date de Permis</th>
            <th>Autorisé</th>
            <th>Exonéré</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permits.map(permit => (
            <tr key={permit.id}>
              <td>{permit.numero_permis}</td>
              <td>{permit.activite}</td>
              <td>{permit.date_permis}</td>
              <td>{permit.autorise ? 'Oui' : 'Non'}</td>
              <td>{permit.exonere ? 'Oui' : 'Non'}</td>
              <td>
                <button className="delete" onClick={() => handleDeletePermit(permit.id)}>
                  <i className="fa fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulaire pour ajouter une inspection commerciale */}
      <h3>Ajouter une Inspection Commerciale</h3>
      <form onSubmit={handleAddInspection}>
        <select name="permis" value={inspectionFormData.permis} onChange={handleInspectionInputChange} required>
          <option value="">Sélectionnez un Permis Commercial</option>
          {permits.map(permit => (
            <option key={permit.id} value={permit.id}>{permit.numero_permis}</option>
          ))}
        </select>
        <input type="date" name="inspection_date" value={inspectionFormData.inspection_date} onChange={handleInspectionInputChange} required />
        <input type="text" name="inspection_technicien" value={inspectionFormData.inspection_technicien} onChange={handleInspectionInputChange} placeholder="Inspection Technicien" required />
        <input type="text" name="type_occupation" value={inspectionFormData.type_occupation} onChange={handleInspectionInputChange} placeholder="Type d'occupation" required />
        <input type="number" name="surface" value={inspectionFormData.surface} onChange={handleInspectionInputChange} placeholder="Surface" required />
        <textarea name="observations" value={inspectionFormData.observations} onChange={handleInspectionInputChange} placeholder="Observations" />
        <button type="submit">Ajouter une Inspection</button>
      </form>

      {/* Table des Inspections Commerciales */}
      <table>
        <thead>
          <tr>
            <th>Numéro de Permis</th>
            <th>Date d'Inspection</th>
            <th>Technicien</th>
            <th>Type d'Occupation</th>
            <th>Surface</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inspections.map(inspection => (
            <tr key={inspection.id}>
              <td>{inspection.permis.numero_permis}</td>
              <td>{inspection.inspection_date}</td>
              <td>{inspection.inspection_technicien}</td>
              <td>{inspection.type_occupation}</td>
              <td>{inspection.surface}</td>
              <td>
                <button className="delete" onClick={() => handleDeleteInspection(inspection.id)}>
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

export default DivisionCommerciaux;
