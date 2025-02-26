import React, { useState } from "react";

const RegieUrbanisme = () => {
  // États pour Paiement - TNB
  const [paiementsTNB, setPaiementsTNB] = useState([]);
  const [tnbData, setTnbData] = useState({
    taxeTNB: "",
    quittance: "",
    datePaiement: "",
    rubrique: "",
    observations: "",
  });
  const [editIndexTNB, setEditIndexTNB] = useState(null);

  // États pour Paiement - Permis d'urbanisme
  const [paiementsPermis, setPaiementsPermis] = useState([]);
  const [permisData, setPermisData] = useState({
    refPermis: "",
    montant: "",
    quittance: "",
    datePaiement: "",
    montantOccupation: "",
    quittanceOccupation: "",
    datePaiementOccupation: "",
    periodeOccupation: "",
    rubrique: "",
  });
  const [editIndexPermis, setEditIndexPermis] = useState(null);

  // Gérer les changements dans les champs
  const handleChange = (e, setter) => {
    setter(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  // Ajouter ou modifier un paiement TNB
  const handleSubmitTNB = (e) => {
    e.preventDefault();
    if (editIndexTNB !== null) {
      const updatedPaiements = [...paiementsTNB];
      updatedPaiements[editIndexTNB] = tnbData;
      setPaiementsTNB(updatedPaiements);
      setEditIndexTNB(null);
    } else {
      setPaiementsTNB([...paiementsTNB, tnbData]);
    }
    setTnbData({ taxeTNB: "", quittance: "", datePaiement: "", rubrique: "", observations: "" });
  };

  // Ajouter ou modifier un paiement Permis d'Urbanisme
  const handleSubmitPermis = (e) => {
    e.preventDefault();
    if (editIndexPermis !== null) {
      const updatedPaiements = [...paiementsPermis];
      updatedPaiements[editIndexPermis] = permisData;
      setPaiementsPermis(updatedPaiements);
      setEditIndexPermis(null);
    } else {
      setPaiementsPermis([...paiementsPermis, permisData]);
    }
    setPermisData({
      refPermis: "",
      montant: "",
      quittance: "",
      datePaiement: "",
      montantOccupation: "",
      quittanceOccupation: "",
      datePaiementOccupation: "",
      periodeOccupation: "",
      rubrique: "",
    });
  };

  // Modifier une entrée
  const handleEdit = (index, setter, data, setEditIndex) => {
    setter(data[index]);
    setEditIndex(index);
  };

  // Supprimer une entrée
  const handleDelete = (index, data, setter) => {
    setter(data.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Regie Urbanisme</h2>

      {/* Formulaire Paiement - TNB */}
      <h3>Paiement - TNB</h3>
      <form onSubmit={handleSubmitTNB}>
        <table border="1">
          <tbody>
            <tr>
              <td>Taxe TNB</td>
              <td><input type="number" name="taxeTNB" value={tnbData.taxeTNB} onChange={(e) => handleChange(e, setTnbData)} required /></td>
            </tr>
            <tr>
              <td>Quittance</td>
              <td><input type="number" name="quittance" value={tnbData.quittance} onChange={(e) => handleChange(e, setTnbData)} required /></td>
            </tr>
            <tr>
              <td>Date de paiement</td>
              <td><input type="date" name="datePaiement" value={tnbData.datePaiement} onChange={(e) => handleChange(e, setTnbData)} required /></td>
            </tr>
            <tr>
              <td>Rubrique</td>
              <td>
                <select name="rubrique" value={tnbData.rubrique} onChange={(e) => handleChange(e, setTnbData)} required>
                  <option value="">Sélectionner...</option>
                  <option value="Type 1">Type 1</option>
                  <option value="Type 2">Type 2</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Observations</td>
              <td><textarea name="observations" value={tnbData.observations} onChange={(e) => handleChange(e, setTnbData)} /></td>
            </tr>
          </tbody>
        </table>
        <button type="submit">{editIndexTNB !== null ? "Modifier" : "Ajouter"}</button>
      </form>

      {/* Formulaire Paiement - Permis d'urbanisme */}
      <h3>Paiement - Permis d'urbanisme</h3>
      <form onSubmit={handleSubmitPermis}>
        <table border="1">
          <tbody>
            <tr>
              <td>Réf de permis</td>
              <td>
                <select name="refPermis" value={permisData.refPermis} onChange={(e) => handleChange(e, setPermisData)} required>
                  <option value="">Sélectionner...</option>
                  <option value="Permis de construction">Permis de construction</option>
                  <option value="Permis d'habiter">Permis d'habiter</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Montant</td>
              <td><input type="number" name="montant" value={permisData.montant} onChange={(e) => handleChange(e, setPermisData)} required /></td>
            </tr>
            <tr>
              <td>Quittance</td>
              <td><input type="number" name="quittance" value={permisData.quittance} onChange={(e) => handleChange(e, setPermisData)} required /></td>
            </tr>
          </tbody>
        </table>
        <button type="submit">{editIndexPermis !== null ? "Modifier" : "Ajouter"}</button>
      </form>

      {/* Tableau des paiements Permis */}
      {paiementsPermis.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>Réf de permis</th>
              <th>Montant</th>
              <th>Quittance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paiementsPermis.map((item, index) => (
              <tr key={index}>
                <td>{item.refPermis}</td>
                <td>{item.montant}</td>
                <td>{item.quittance}</td>
                <td>
                  <button onClick={() => handleEdit(index, setPermisData, paiementsPermis, setEditIndexPermis)}>Modifier</button>
                  <button onClick={() => handleDelete(index, paiementsPermis, setPaiementsPermis)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RegieUrbanisme;
