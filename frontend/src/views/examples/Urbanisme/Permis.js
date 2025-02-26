import React, { useState } from "react";
import 'views/examples/regie-marches/Styletable.css';  // Assurez-vous d'utiliser ce CSS
const Permis = () => {
  const [permis, setPermis] = useState([]);
  const [formData, setFormData] = useState({
    typeDemande: "",
    natureDemande: "",
    adresse: "",
    numeroDossier: "",
    numeroTitre: "",
    dateRetrait: "",
    moisConcerne: "",
    numeroDecision: "",
    datePermis: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  const typesDePermis = [
    "Permis de construction",
    "Permis d'habiter",
    "Permis de réparation",
    "Permis de démolition",
    "Permis de renouvellement d'occupation du domaine public",
    "Permis d'établissement de segmentation",
    "Permis pour créer un groupe résidentiel",
    "Permis de construire pour petits projets",
    "Permis de construire pour grands projets",
  ];

  const naturesDemande = [
    "Nouvelle demande",
    "Renouvellement",
    "Modification",
    "Transfert",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedPermis = [...permis];
      updatedPermis[editIndex] = formData;
      setPermis(updatedPermis);
      setEditIndex(null);
    } else {
      setPermis([...permis, formData]);
    }
    setFormData({
      typeDemande: "",
      natureDemande: "",
      adresse: "",
      numeroDossier: "",
      numeroTitre: "",
      dateRetrait: "",
      moisConcerne: "",
      numeroDecision: "",
      datePermis: "",
    });
  };

  const handleEdit = (index) => {
    setFormData(permis[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setPermis(permis.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-5 text-gray-700">Gestion des Permis</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Type de demande */}
        <div>
          <label className="block font-semibold">Type de demande *</label>
          <select
            name="typeDemande"
            value={formData.typeDemande}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner...</option>
            {typesDePermis.map((type, idx) => (
              <option key={idx} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Nature de demande */}
        <div>
          <label className="block font-semibold">Nature de demande *</label>
          <select
            name="natureDemande"
            value={formData.natureDemande}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner...</option>
            {naturesDemande.map((nature, idx) => (
              <option key={idx} value={nature}>{nature}</option>
            ))}
          </select>
        </div>

        {/* Adresse */}
        <div className="col-span-2">
          <label className="block font-semibold">Adresse *</label>
          <textarea
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          ></textarea>
        </div>

        {/* Autres champs */}
        {[
          { label: "Numéro de dossier *", name: "numeroDossier", type: "text", required: true },
          { label: "Numéro de titre *", name: "numeroTitre", type: "number", required: true },
          { label: "Date de retrait *", name: "dateRetrait", type: "date", required: true },
          { label: "Mois concerné", name: "moisConcerne", type: "text", required: false },
          { label: "Numéro de décision *", name: "numeroDecision", type: "text", required: true },
          { label: "Date du permis *", name: "datePermis", type: "date", required: true },
        ].map((field, index) => (
          <div key={index} className={field.name === "moisConcerne" ? "col-span-2" : ""}>
            <label className="block font-semibold">
              {field.label} {field.required && "*"}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}

        <div className="col-span-2">
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            {editIndex !== null ? "Modifier" : "Ajouter"}
          </button>
        </div>
      </form>

      {/* Tableau des permis */}
      {permis.length > 0 && (
        <table className="w-full mt-5 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {["Type", "Nature", "Adresse", "Dossier", "Titre", "Retrait", "Mois", "Décision", "Date", "Actions"].map((col, idx) => (
                <th key={idx} className="border p-2 text-left">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permis.map((item, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{item.typeDemande}</td>
                <td className="border p-2">{item.natureDemande}</td>
                <td className="border p-2">{item.adresse}</td>
                <td className="border p-2">{item.numeroDossier}</td>
                <td className="border p-2">{item.numeroTitre}</td>
                <td className="border p-2">{item.dateRetrait}</td>
                <td className="border p-2">{item.moisConcerne}</td>
                <td className="border p-2">{item.numeroDecision}</td>
                <td className="border p-2">{item.datePermis}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(index)} className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded">✏️</button>
                  <button onClick={() => handleDelete(index)} className="bg-red-500 text-white px-2 py-1 rounded">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Permis;
