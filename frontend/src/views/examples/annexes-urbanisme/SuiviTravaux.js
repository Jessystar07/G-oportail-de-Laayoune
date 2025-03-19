import React, { useState, useEffect } from "react";
import axios from "axios";

const SuiviTravaux = () => {
  const [travaux, setTravaux] = useState([]);
  const [formData, setFormData] = useState({
    percentage: "",
    observations: "",
    date: "",
    phase_construction: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fonction pour récupérer les données
  const fetchTravaux = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/SuiviTravaux/");
      setTravaux(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des suivis de travaux :", error);
      showNotification("Impossible de charger les suivis de travaux", "error");
    }
  };

  // Afficher une notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchTravaux();
  }, []);

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Ajouter ou modifier une entrée
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editIndex !== null && travaux[editIndex]) {
        const id = travaux[editIndex].id;
        await axios.put(`http://127.0.0.1:8000/api/SuiviTravaux/${id}/`, formData);
        showNotification("Suivi de travaux mis à jour avec succès");
      } else {
        await axios.post("http://127.0.0.1:8000/api/SuiviTravaux/", formData);
        showNotification("Nouveau suivi de travaux ajouté avec succès");
      }
      setFormData({ percentage: "", observations: "", date: "", phase_construction: "" });
      setEditIndex(null);
      fetchTravaux();
    } catch (error) {
      console.error("Erreur lors de l'ajout/modification :", error);
      showNotification(`Erreur lors de ${editIndex !== null ? 'la modification' : 'l\'ajout'} du suivi de travaux`, "error");
    }
  };
  
  // Modifier une entrée existante
  const handleEdit = (index) => {
    if (travaux[index]) {
      setFormData(travaux[index]);
      setEditIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Supprimer une entrée
  const handleDelete = async (index) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce suivi de travaux ?')) {
      return;
    }
    
    try {
      const id = travaux[index].id;
      await axios.delete(`http://127.0.0.1:8000/api/SuiviTravaux/${id}/`);
      fetchTravaux();
      showNotification("Suivi de travaux supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      showNotification("Erreur lors de la suppression du suivi de travaux", "error");
    }
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setFormData({ percentage: "", observations: "", date: "", phase_construction: "" });
    setEditIndex(null);
  };

  return (
    <div className="suivi-travaux-container">
      <h2>Gestion du Suivi des Travaux</h2>
      
      {/* Notification Toast */}
      {notification && (
        <div className={`toast ${notification.type}`}>
          <div className="toast-content">{notification.message}</div>
          <button className="toast-close" onClick={() => setNotification(null)}>×</button>
        </div>
      )}
      
      <div className="section active">
        <div className="form-section">
          <form onSubmit={handleSubmit} className="form-container">            
            <div className="form-field">
              <label htmlFor="percentage">Pourcentage d'avancement</label>
              <input
                id="percentage"
                type="number"
                name="percentage"
                value={formData.percentage}
                onChange={handleChange}
                placeholder="Saisir le pourcentage (0-100)"
                required
              />
            </div>
            
            <div className="form-field">
              <label htmlFor="observations">Observations</label>
              <textarea
                id="observations"
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                placeholder="Ajouter des observations sur l'avancement des travaux"
              />
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="date">Date de constat</label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="phase_construction">Phase de construction</label>
                <select
                  id="phase_construction"
                  name="phase_construction"
                  value={formData.phase_construction}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner une phase</option>
                  <option value="Terrains nus">Terrains nus</option>
                  <option value="Chantier">Chantier</option>
                  <option value="Projet achevé">Projet achevé</option>
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit">
                {editIndex !== null ? 'Mettre à jour' : 'Ajouter'} le suivi
              </button>
              {editIndex !== null && (
                <button type="button" onClick={handleCancelEdit} className="cancel-button">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="data-section">
          <h3>Liste des suivis de travaux</h3>
          <div className="table-responsive">
            {travaux.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Pourcentage</th>
                    <th>Observations</th>
                    <th>Date</th>
                    <th>Phase</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {travaux.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.percentage}%</td>
                      <td>{item.observations}</td>
                      <td>{item.date}</td>
                      <td>{item.phase_construction}</td>
                      <td className="action-buttons">
                        <button 
                          className="edit" 
                          onClick={() => handleEdit(index)}
                          aria-label="Modifier"
                        >
                          <i className="fa fa-edit"></i> 
                        </button>
                        <button 
                          className="delete" 
                          onClick={() => handleDelete(index)}
                          aria-label="Supprimer"
                        >
                          <i className="fa fa-trash"></i> 
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">Aucun suivi de travaux disponible</div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .suivi-travaux-container {
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
        
        .section {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .form-section {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
          background-color: #f9f9f9;
          font-weight: bold;
          color: #555;
        }
        
        tr:hover {
          background-color: #f9f9f9;
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

export default SuiviTravaux;