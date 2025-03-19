import React, { useState, useEffect } from "react";
import axios from "axios";
import './regieUrbanisme.css';

// Configure API base URL based on environment
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";

const RegieUrbanisme = () => {
  const [paiementsTNB, setPaiementsTNB] = useState([]);
  const [paiementsPermis, setPaiementsPermis] = useState([]);
  const [activeTab, setActiveTab] = useState("tnb"); // "tnb" ou "permis"
  const [formDataTNB, setFormDataTNB] = useState({
    taxe_tnb: "",
    quittance: "",
    date_paiement: "",
    rubrique: "",
    observations: "",
  });
  const [formDataPermis, setFormDataPermis] = useState({
    ref_permis_id: "",
    montant: "",
    quittance: "",
    date_paiement: "",
    montant_occupation: "",
    quittance_occupation: "",
    date_paiement_occupation: "",
    periode_occupation: "",
    rubrique: "",
  });
  const [editingTNBId, setEditingTNBId] = useState(null);
  const [editingPermisId, setEditingPermisId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // Charger les données TNB
    axios
      .get(`${API_BASE_URL}/PaiementTNB/`)
      .then((response) => setPaiementsTNB(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des données TNB", error);
        showToastMessage("Erreur lors du chargement des données TNB", "error");
      });

    // Charger les données Permis
    axios
      .get(`${API_BASE_URL}/PaiementPermisUrbanisme/`)
      .then((response) => setPaiementsPermis(response.data))
      .catch((error) => {
        console.error("Erreur lors du chargement des données Permis");
        showToastMessage("Erreur lors du chargement: " + 
          (error.response?.data?.detail || error.message), "error");
      });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleChangeTNB = (e) => {
    setFormDataTNB({ ...formDataTNB, [e.target.name]: e.target.value });
  };

  const handleChangePermis = (e) => {
    setFormDataPermis({ ...formDataPermis, [e.target.name]: e.target.value });
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSubmitTNB = (e) => {
    e.preventDefault();
    // Formater et valider les données avant envoi
    const dataToSubmit = {
      ...formDataTNB,
      taxe_tnb: parseFloat(formDataTNB.taxe_tnb || 0), // Envoyer comme nombre
      observations: formDataTNB.observations || null
    };

    if (editingTNBId) {
      axios
        .put(`${API_BASE_URL}/PaiementTNB/${editingTNBId}/`, dataToSubmit)
        .then(() => {
          showToastMessage("Paiement TNB modifié avec succès !");
          setEditingTNBId(null);
          resetFormTNB();
          fetchData();
        })
        .catch((error) => {
          console.error("Erreur lors de la modification du TNB");
          showToastMessage("Erreur lors de la modification: " + 
            (error.response?.data?.detail || error.message), "error");
        });
    } else {
      axios
        .post(`${API_BASE_URL}/PaiementTNB/`, dataToSubmit)
        .then(() => {
          showToastMessage("Paiement TNB ajouté avec succès !");
          resetFormTNB();
          fetchData();
        })
        .catch((error) => {
          console.error("Erreur lors de l'ajout du TNB");
          showToastMessage("Erreur lors de l'ajout: " + 
            (error.response?.data?.detail || error.message), "error");
        });
    }
  };

  const handleSubmitPermis = (e) => {
    e.preventDefault();
    // Formater et valider les données avant envoi
    const dataToSubmit = {
      ...formDataPermis,
      montant: parseFloat(formDataPermis.montant || 0),
      montant_occupation: formDataPermis.montant_occupation ? parseFloat(formDataPermis.montant_occupation) : null,
      quittance_occupation: formDataPermis.quittance_occupation || null,
      date_paiement_occupation: formDataPermis.date_paiement_occupation || null,
      periode_occupation: formDataPermis.periode_occupation || null
    };

    // Vérifier si la date de paiement d'occupation est fournie lorsque le montant d'occupation est spécifié
    if (dataToSubmit.montant_occupation && !dataToSubmit.date_paiement_occupation) {
      showToastMessage("La date de paiement d'occupation est requise si un montant d'occupation est spécifié.", "error");
      return;
    }

    if (editingPermisId) {
      axios
        .put(`${API_BASE_URL}/PaiementPermisUrbanisme/${editingPermisId}/`, dataToSubmit)
        .then(() => {
          showToastMessage("Paiement Permis modifié avec succès !");
          setEditingPermisId(null);
          resetFormPermis();
          fetchData();
        })
        .catch((error) => {
          showToastMessage("Erreur lors de la modification: " + 
            (error.response?.data?.detail || error.message), "error");
        });
    } else {
      axios
        .post(`${API_BASE_URL}/PaiementPermisUrbanisme/`, dataToSubmit)
        .then(() => {
          showToastMessage("Paiement Permis ajouté avec succès !");
          resetFormPermis();
          fetchData();
        })
        .catch((error) => {
          showToastMessage("Erreur lors de l'ajout: " + 
            (error.response?.data?.detail || error.message), "error");
        });
    }
  };

  const resetFormTNB = () => {
    setFormDataTNB({
      taxe_tnb: "",
      quittance: "",
      date_paiement: "",
      rubrique: "",
      observations: "",
    });
  };

  const resetFormPermis = () => {
    setFormDataPermis({
      ref_permis_id: "",
      montant: "",
      quittance: "",
      date_paiement: "",
      montant_occupation: "",
      quittance_occupation: "",
      date_paiement_occupation: "",
      periode_occupation: "",
      rubrique: "",
    });
  };

  const handleEditTNB = (paiement) => {
    setEditingTNBId(paiement.id);
    setFormDataTNB({
      taxe_tnb: paiement.taxe_tnb,
      quittance: paiement.quittance,
      date_paiement: paiement.date_paiement,
      rubrique: paiement.rubrique,
      observations: paiement.observations || "",
    });
    setActiveTab("tnb");
  };

  const handleEditPermis = (paiement) => {
    setEditingPermisId(paiement.id);
    setFormDataPermis({
      ref_permis_id: paiement.ref_permis_id,
      montant: paiement.montant,
      quittance: paiement.quittance,
      date_paiement: paiement.date_paiement,
      montant_occupation: paiement.montant_occupation || "",
      quittance_occupation: paiement.quittance_occupation || "",
      date_paiement_occupation: paiement.date_paiement_occupation || "",
      periode_occupation: paiement.periode_occupation || "",
      rubrique: paiement.rubrique,
    });
    setActiveTab("permis");
  };

  const handleDeleteTNB = (id) => {
    axios
      .delete(`${API_BASE_URL}/PaiementTNB/${id}/`)
      .then(() => {
        showToastMessage("Paiement TNB supprimé avec succès !");
        fetchData();
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du TNB");
        showToastMessage("Erreur lors de la suppression: " + 
          (error.response?.data?.detail || error.message), "error");
      });
  };

  const handleDeletePermis = (id) => {
    axios
      .delete(`${API_BASE_URL}/PaiementPermisUrbanisme/${id}/`)
      .then(() => {
        showToastMessage("Paiement Permis supprimé avec succès !");
        fetchData();
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression du Permis");
        showToastMessage("Erreur lors de la suppression: " + 
          (error.response?.data?.detail || error.message), "error");
      });
  };

  const typesPermis = [
    "Permis de construction",
    "Permis d'habiter",
    "Permis de reparation",
    "Permis de démolition",
    "Permis de renouvellement d'occupation du domaine public",
    "Permis d'établissement de segmentation",
    "Permis pour créer un groupe résidentiel",
    "Permis de construire pour petits projets",
    "Permis de construire pour grands projets"
  ];

  const typesRubrique = ["type 1", "type 2", "type 3", "type 4", "type 5"];

  return (
    <div className="division-container">
      <h2>Régie - Urbanisme</h2>
      
      {/* Tabs selon le nouveau style */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === "tnb" ? "active" : ""}`} 
          onClick={() => handleTabChange("tnb")}
        >
          Paiement - TNB
        </button>
        <button 
          className={`tab ${activeTab === "permis" ? "active" : ""}`} 
          onClick={() => handleTabChange("permis")}
        >
          Paiement - Permis d'urbanisme
        </button>
      </div>
      
      {/* Tab Content avec le nouveau style */}
      <div className={`tab-content ${activeTab === "tnb" ? "active" : ""}`}>
        <div className="form">
          <form onSubmit={handleSubmitTNB}>
            <div className="form-row">
              <div className="form-field">
                <label>Taxe TNB</label>
                <input
                  type="number"
                  name="taxe_tnb"
                  value={formDataTNB.taxe_tnb}
                  onChange={handleChangeTNB}
                  required
                  placeholder="Taxe TNB"
                  step="0.01"
                  min="0.01"
                />
              </div>
              
              <div className="form-field">
                <label>Quittance</label>
                <input
                  type="text"
                  name="quittance"
                  value={formDataTNB.quittance}
                  onChange={handleChangeTNB}
                  required
                  placeholder="Numéro de quittance"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Date de paiement</label>
                <input
                  type="date"
                  name="date_paiement"
                  value={formDataTNB.date_paiement}
                  onChange={handleChangeTNB}
                  required
                />
              </div>
              
              <div className="form-field">
                <label>Rubrique</label>
                <select name="rubrique" value={formDataTNB.rubrique} onChange={handleChangeTNB} required>
                  <option value="">Sélectionner...</option>
                  {typesRubrique.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-field">
              <label>Observations</label>
              <textarea
                name="observations"
                value={formDataTNB.observations}
                onChange={handleChangeTNB}
                placeholder="Observations"
              />
            </div>
            
            <div className="button-group">
              <button type="submit" className="submit-button">
                {editingTNBId ? "Modifier" : "Ajouter"}
              </button>
              {editingTNBId && (
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => {
                    setEditingTNBId(null);
                    resetFormTNB();
                  }}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
        
        <h3>Liste des paiements TNB</h3>
        <div className="table-responsive">
          {paiementsTNB.length === 0 ? (
            <div className="no-data">Aucun paiement TNB trouvé</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Taxe TNB</th>
                  <th>Quittance</th>
                  <th>Date de paiement</th>
                  <th>Rubrique</th>
                  <th>Observations</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paiementsTNB.map((paiement) => (
                  <tr key={paiement.id}>
                    <td>{parseFloat(paiement.taxe_tnb).toFixed(2)}</td>
                    <td>{paiement.quittance}</td>
                    <td>{paiement.date_paiement}</td>
                    <td>{paiement.rubrique}</td>
                    <td>{paiement.observations}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit" onClick={() => handleEditTNB(paiement)}>
                        <i className="fa fa-edit"></i> 
                        </button>
                        <button
                          className="delete"
                          onClick={() => {
                            if (window.confirm("Êtes-vous sûr de vouloir supprimer ce paiement TNB ?")) {
                              handleDeleteTNB(paiement.id);
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
      </div>
      
      <div className={`tab-content ${activeTab === "permis" ? "active" : ""}`}>
        <div className="form">
          <form onSubmit={handleSubmitPermis}>
            <div className="form-row">
              <div className="form-field">
                <label>Référence de permis</label>
                <select name="ref_permis_id" value={formDataPermis.ref_permis_id} onChange={handleChangePermis} required>
                  <option value="">Sélectionner...</option>
                  {typesPermis.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Montant</label>
                <input
                  type="number"
                  name="montant"
                  value={formDataPermis.montant}
                  onChange={handleChangePermis}
                  required
                  placeholder="Montant"
                  step="0.01"
                  min="0.01"
                />
              </div>
              
              <div className="form-field">
                <label>Quittance</label>
                <input
                  type="text"
                  name="quittance"
                  value={formDataPermis.quittance}
                  onChange={handleChangePermis}
                  required
                  placeholder="Numéro de quittance"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Date de paiement</label>
                <input
                  type="date"
                  name="date_paiement"
                  value={formDataPermis.date_paiement}
                  onChange={handleChangePermis}
                  required
                />
              </div>
              
              <div className="form-field">
                <label>Montant d'occupation</label>
                <input
                  type="number"
                  name="montant_occupation"
                  value={formDataPermis.montant_occupation}
                  onChange={handleChangePermis}
                  placeholder="Montant d'occupation"
                  step="0.01"
                  min="0.01"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Quittance d'occupation</label>
                <input
                  type="text"
                  name="quittance_occupation"
                  value={formDataPermis.quittance_occupation}
                  onChange={handleChangePermis}
                  placeholder="Quittance d'occupation"
                />
              </div>
              
              <div className="form-field">
                <label>Date de paiement d'occupation</label>
                <input
                  type="date"
                  name="date_paiement_occupation"
                  value={formDataPermis.date_paiement_occupation}
                  onChange={handleChangePermis}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label>Période d'occupation</label>
                <input
                  type="text"
                  name="periode_occupation"
                  value={formDataPermis.periode_occupation}
                  onChange={handleChangePermis}
                  placeholder="Période d'occupation"
                />
              </div>
              
              <div className="form-field">
                <label>Rubrique</label>
                <select name="rubrique" value={formDataPermis.rubrique} onChange={handleChangePermis} required>
                  <option value="">Sélectionner...</option>
                  {typesRubrique.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="button-group">
              <button type="submit" className="submit-button">
                {editingPermisId ? "Modifier" : "Ajouter"}
              </button>
              {editingPermisId && (
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => {
                    setEditingPermisId(null);
                    resetFormPermis();
                  }}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>
        
        <h3>Liste des paiements Permis d'urbanisme</h3>
        <div className="table-responsive">
          {paiementsPermis.length === 0 ? (
            <div className="no-data">Aucun paiement Permis d'urbanisme trouvé</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Montant</th>
                  <th>Quittance</th>
                  <th>Date de paiement</th>
                  <th>Rubrique</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paiementsPermis.map((paiement) => (
                  <tr key={paiement.id}>
                    <td>{paiement.ref_permis_id}</td>
                    <td>{parseFloat(paiement.montant).toFixed(2)}</td>
                    <td>{paiement.quittance}</td>
                    <td>{paiement.date_paiement}</td>
                    <td>{paiement.rubrique}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit" onClick={() => handleEditPermis(paiement)}>
                        <i className="fa fa-edit"></i> 
                        </button>
                        <button
                          className="delete"
                          onClick={() => {
                            if (window.confirm("Êtes-vous sûr de vouloir supprimer ce paiement Permis ?")) {
                              handleDeletePermis(paiement.id);
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

export default RegieUrbanisme;