import React, { useState } from "react";

const SuiviTravaux = () => {
  const [travaux, setTravaux] = useState([]);
  const [formData, setFormData] = useState({
    percentage: "",
    observations: "",
    date: "",
    phase: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  // Gérer les changements dans les champs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Ajouter ou modifier une entrée
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Modification d'une entrée existante
      const updatedTravaux = [...travaux];
      updatedTravaux[editIndex] = formData;
      setTravaux(updatedTravaux);
      setEditIndex(null);
    } else {
      // Ajout d'une nouvelle entrée
      setTravaux([...travaux, formData]);
    }
    setFormData({ percentage: "", observations: "", date: "", phase: "" });
  };

  // Modifier une entrée existante
  const handleEdit = (index) => {
    setFormData(travaux[index]);
    setEditIndex(index);
  };

  // Supprimer une entrée
  const handleDelete = (index) => {
    setTravaux(travaux.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Suivi des Travaux</h2>
      
      {/* Formulaire */}
      <form onSubmit={handleSubmit}>
        <table border="1">
          <thead>
            <tr>
              <th>Champ</th>
              <th>Valeur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Pourcentage</td>
              <td><input type="number" name="percentage" value={formData.percentage} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Observations</td>
              <td><textarea name="observations" value={formData.observations} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td>Date</td>
              <td><input type="date" name="date" value={formData.date} onChange={handleChange} required /></td>
            </tr>
            <tr>
              <td>Phase de construction</td>
              <td>
                <select name="phase" value={formData.phase} onChange={handleChange} required>
                  <option value="">Sélectionner...</option>
                  <option value="Terrains nus">Terrains nus</option>
                  <option value="Chantier">Chantier</option>
                  <option value="Projet achevé">Projet achevé</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit">{editIndex !== null ? "Modifier" : "Ajouter"}</button>
      </form>

      {/* Tableau des enregistrements */}
      {travaux.length > 0 && (
        <table border="1" style={{ marginTop: "20px" }}>
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
              <tr key={index}>
                <td>{item.percentage}%</td>
                <td>{item.observations}</td>
                <td>{item.date}</td>
                <td>{item.phase}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Modifier</button>
                  <button onClick={() => handleDelete(index)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SuiviTravaux;
