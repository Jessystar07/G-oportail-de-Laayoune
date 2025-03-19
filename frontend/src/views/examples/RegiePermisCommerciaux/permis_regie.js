import React, { useState, useEffect } from "react";
import axios from "axios";
import './permisregi.css';

const PermisRegie = () => {
  const [permisRegie, setPermisRegie] = useState([]);
  const [formData, setFormData] = useState({
    numero_de_quittance: "",
    requérant: "",
    localisation: "",
    type_permis: "",
    date_de_paiement: "",
    surface: "",
    type_de_mesure: "",
    rubrique: "",
    type_de_permis: "",
    dernier_paiement: "",
    observations: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    fetchTravaux();
  }, []);

  const fetchTravaux = () => {
    axios
      .get("http://127.0.0.1:8000/api/PermisRegie/")
      .then((response) => setPermisRegie(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des données", error);
        showToastMessage("Erreur lors du chargement des données", "error");
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      axios
        .put(`http://127.0.0.1:8000/api/PermisRegie/${editingId}/`, formData)
        .then(() => {
          showToastMessage("Permis modifié avec succès !");
          setEditingId(null);
          resetForm();
          fetchTravaux();
        })
        .catch((error) => {
          console.error("Erreur lors de la modification", error);
          showToastMessage("Erreur lors de la modification", "error");
        });
    } else {
      axios
        .post("http://127.0.0.1:8000/api/PermisRegie/", formData)
        .then(() => {
          showToastMessage("Permis ajouté avec succès !");
          resetForm();
          fetchTravaux();
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout", error);
          showToastMessage("Erreur lors de l'ajout", "error");
        });
    }
  };

  const resetForm = () => {
    setFormData({
      numero_de_quittance: "",
      requérant: "",
      localisation: "",
      type_permis: "",
      date_de_paiement: "",
      surface: "",
      type_de_mesure: "",
      rubrique: "",
      type_de_permis: "",
      dernier_paiement: "",
      observations: "",
    });
  };

  const handleEdit = (travail) => {
    setEditingId(travail.id);
    setFormData(travail);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/PermisRegie/${id}/`)
      .then(() => {
        showToastMessage("Permis supprimé avec succès !");
        fetchTravaux();
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression", error);
        showToastMessage("Erreur lors de la suppression", "error");
      });
  };

  return (
    <div className="division-container">
      <h2>Gestion des Permis de Régie</h2>
      
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Numéro de quittance</label>
              <input
                type="number"
                name="numero_de_quittance"
                value={formData.numero_de_quittance}
                onChange={handleChange}
                required
                placeholder="Numéro de quittance"
              />
            </div>
            
            <div className="form-field">
              <label>Requérant</label>
              <input
                type="text"
                name="requérant"
                value={formData.requérant}
                onChange={handleChange}
                required
                placeholder="Requérant"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-field">
              <label>Localisation</label>
              <input
                type="text"
                name="localisation"
                value={formData.localisation}
                onChange={handleChange}
                required
                placeholder="Localisation"
              />
            </div>
            
            <div className="form-field">
              <label>Type de permis</label>
              <select name="type_permis" value={formData.type_permis} onChange={handleChange} required>
                <option value="">Sélectionner...</option>
                <option value="Domaine public nu">Domaine public nu (ملك جماعي عار)</option>
                <option value="Domaine public couvert">Domaine public couvert (ملك جماعي مغطى)</option>
                <option value="Panneau publicitaire">Panneau publicitaire (لوحة اشهارية)</option>
                <option value="Installation publicitaire">Installation publicitaire (نصب اشهاري)</option>
                <option value="Boisson">Boisson (المشروبات)</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-field">
              <label>Date de paiement</label>
              <input
                type="date"
                name="date_de_paiement"
                value={formData.date_de_paiement}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-field">
              <label>Surface</label>
              <input
                type="number"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                required
                placeholder="Surface"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-field">
              <label>Type de mesure</label>
              <select name="type_de_mesure" value={formData.type_de_mesure} onChange={handleChange} required>
                <option value="">Sélectionner...</option>
                <option value="Derivee de regulations de la taxation">Dérivée de régulations de la taxation</option>
              </select>
            </div>
            
            <div className="form-field">
              <label>Rubrique</label>
              <input
                type="text"
                name="rubrique"
                value={formData.rubrique}
                onChange={handleChange}
                required
                placeholder="Rubrique"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-field">
              <label>Type de permis (numérique)</label>
              <input
                type="number"
                name="type_de_permis"
                value={formData.type_de_permis}
                onChange={handleChange}
                required
                placeholder="Type de permis"
              />
            </div>
            
            <div className="form-field">
              <label>Dernier paiement</label>
              <input
                type="date"
                name="dernier_paiement"
                value={formData.dernier_paiement}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-field">
            <label>Observations</label>
            <textarea
              name="observations"
              value={formData.observations}
              onChange={handleChange}
              placeholder="Observations"
            />
          </div>
          
          <div className="button-group">
            <button type="submit" className="submit-button">
              {editingId ? "Modifier" : "Ajouter"}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => {
                  setEditingId(null);
                  resetForm();
                }}
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>
      
      <h3>Liste des Permis</h3>
      <div className="table-responsive">
        {permisRegie.length === 0 ? (
          <div className="no-data">Aucun permis de régie trouvé</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Numéro de Quittance</th>
                <th>Requérant</th>
                <th>Localisation</th>
                <th>Type de Permis</th>
                <th>Date de Paiement</th>
                <th>Surface</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {permisRegie.map((travail) => (
                <tr key={travail.id}>
                  <td>{travail.numero_de_quittance}</td>
                  <td>{travail.requérant}</td>
                  <td>{travail.localisation}</td>
                  <td>{travail.type_permis}</td>
                  <td>{travail.date_de_paiement}</td>
                  <td>{travail.surface}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit" onClick={() => handleEdit(travail)}>
                      <i className="fa fa-edit"></i> 
                      </button>
                      <button
                        className="delete"
                        onClick={() => {
                          if (window.confirm("Êtes-vous sûr de vouloir supprimer ce permis ?")) {
                            handleDelete(travail.id);
                          }
                        }}
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
      
      {showToast && (
        <div className={`toast ${toastType === "error" ? "error" : ""}`}>
          {toastMessage}
          <button className="toast-close" onClick={() => setShowToast(false)}>×</button>
        </div>
      )}
    </div>
  );
};

export default PermisRegie;