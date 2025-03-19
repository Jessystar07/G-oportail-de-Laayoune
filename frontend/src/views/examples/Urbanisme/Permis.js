import React, { useState, useEffect } from "react";
import axios from "axios";

const Permis = () => {
    const [permis, setPermis] = useState([]);
    const [formData, setFormData] = useState({
        type_demande: "",
        nature_demande: "",
        adresse: "",
        numero_dossier: "",
        numero_titre: "",
        date_retrait: "",
        mois_concerne: "",
        numero_decision: "",
        date_permis: "",
    });
    const [editIndex, setEditIndex] = useState(null);
    const [notification, setNotification] = useState(null);

    const typeDemandeOptions = [
        "Permis de construction",
        "Permis d'habiter",
        "Permis de réparation",
        "Permis de démolition",
        "Permis de renouvellement d'occupation du domaine public",
        "Permis d'établissement de segmentation",
        "Permis pour créer un groupe résidentiel",
        "Permis de construire pour petits projets",
        "Permis de construire pour grands projets"
    ];

    const natureDemandeOptions = [
        "Nouvelle demande",
        "Renouvellement",
        "Modification",
        "Transfert"
    ];

    // Show notification
    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
    };

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/PermisUrbanisme/")
            .then(response => setPermis(response.data))
            .catch(error => {
                console.error("Erreur lors du chargement des permis :", error);
                showNotification("Impossible de charger les permis", "error");
            });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editIndex !== null) {
                const response = await axios.put(`http://127.0.0.1:8000/api/PermisUrbanisme/${permis[editIndex].id}/`, formData);
                const updatedPermis = [...permis];
                updatedPermis[editIndex] = response.data;
                setPermis(updatedPermis);
                setEditIndex(null);
                showNotification("Permis mis à jour avec succès");
            } else {
                const response = await axios.post("http://127.0.0.1:8000/api/PermisUrbanisme/", formData);
                setPermis([...permis, response.data]);
                showNotification("Nouveau permis ajouté avec succès");
            }
            resetForm();
        } catch (error) {
            console.error("Erreur lors de l'ajout/modification du permis :", error);
            showNotification("Erreur lors de l'ajout/modification du permis", "error");
        }
    };

    const handleEdit = (index) => {
        setFormData(permis[index]);
        setEditIndex(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (index) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce permis ?')) {
            return;
        }
        
        try {
            const url = `http://127.0.0.1:8000/api/PermisUrbanisme/${permis[index].id}/`;
            console.log("Deleting URL: ", url);
            await axios.delete(url);
            setPermis(permis.filter((_, i) => i !== index));
            showNotification("Permis supprimé avec succès");
        } catch (error) {
            console.error("Erreur lors de la suppression du permis :", error);
            showNotification("Erreur lors de la suppression du permis", "error");
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            type_demande: "",
            nature_demande: "",
            adresse: "",
            numero_dossier: "",
            numero_titre: "",
            date_retrait: "",
            mois_concerne: "",
            numero_decision: "",
            date_permis: "",
        });
    };

    // Cancel edit
    const handleCancelEdit = () => {
        resetForm();
        setEditIndex(null);
    };

    return (
        <div className="permis-container">
            <h2>Gestion des Permis</h2>
            
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
                            <label htmlFor="type_demande">Type de demande *</label>
                            <select
                                id="type_demande"
                                name="type_demande"
                                value={formData.type_demande}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionner...</option>
                                {typeDemandeOptions.map((option, idx) => (
                                    <option key={idx} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="nature_demande">Nature de demande *</label>
                            <select
                                id="nature_demande"
                                name="nature_demande"
                                value={formData.nature_demande}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Sélectionner...</option>
                                {natureDemandeOptions.map((option, idx) => (
                                    <option key={idx} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="adresse">Adresse *</label>
                            <textarea
                                id="adresse"
                                name="adresse"
                                value={formData.adresse}
                                placeholder="ex : 123 Rue des Exemples, Ville, Pays"
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="numero_dossier">Numéro de dossier *</label>
                                <input
                                    id="numero_dossier"
                                    type="text"
                                    name="numero_dossier"
                                    value={formData.numero_dossier}
                                    placeholder="ex : 1234/2021"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-field">
                                <label htmlFor="numero_titre">Numéro de titre *</label>
                                <input
                                    id="numero_titre"
                                    type="number"
                                    name="numero_titre"
                                    value={formData.numero_titre}
                                    placeholder="ex : 1234"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="date_retrait">Date de retrait *</label>
                                <input
                                    id="date_retrait"
                                    type="date"
                                    name="date_retrait"
                                    value={formData.date_retrait}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-field">
                                <label htmlFor="date_permis">Date du permis *</label>
                                <input
                                    id="date_permis"
                                    type="date"
                                    name="date_permis"
                                    value={formData.date_permis}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-field">
                            <label htmlFor="mois_concerne">Mois concerné</label>
                            <input
                                id="mois_concerne"
                                type="text"
                                name="mois_concerne"
                                value={formData.mois_concerne}
                                placeholder="ex : Janvier"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="numero_decision">Numéro de décision *</label>
                            <input
                                id="numero_decision"
                                type="text"
                                name="numero_decision"
                                value={formData.numero_decision}
                                placeholder="ex : 2807"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button type="submit">
                                {editIndex !== null ? 'Mettre à jour' : 'Ajouter'} le permis
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
                    <h3>Liste des permis</h3>
                    <div className="table-responsive">
                        {permis.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Nature</th>
                                        <th>Dossier</th>
                                        <th>Titre</th>
                                        <th>Retrait</th>
                                        <th>Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permis.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.type_demande}</td>
                                            <td>{item.nature_demande}</td>
                                            <td>{item.numero_dossier}</td>
                                            <td>{item.numero_titre}</td>
                                            <td>{item.date_retrait}</td>
                                            <td>{item.date_permis}</td>
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
                            <div className="no-data">Aucun permis disponible</div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                .permis-container {
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
                    padding:20px;
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
                    gap: 8px; /* Espacement entre les boutons */
                    align-items: center;
                    justify-content: center;
                }

                .action-buttons button {
                    width: 36px; /* Taille fixe pour uniformiser */
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%; /* Rend les boutons circulaires */
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.3s ease-in-out;
                }

                .edit {
                    background-color: #2ecc71;
                    color: white;
                }

                .edit:hover {
                    background-color: #27ae60;
                }

                .delete {
                    background-color: #e74c3c;
                    color: white;
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

export default Permis;