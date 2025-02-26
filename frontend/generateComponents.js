const fs = require('fs');
const path = require('path');

// Liste des tables que vous avez mentionnées
const tables = [
  "api_espace", "api_espacevert", "api_inspection", "api_item", "api_marches", 
  "api_paiement_exploitation", "api_paiement_tnb", "api_paiementpermisurbanisme", 
  "api_parcelle", "api_permis_urbanisme", "api_permiscommercial", "api_permisregie", 
  "api_permissante", "api_personnemorale", "api_personnephysique", "api_sportculture", 
  "api_suivitravaux", "api_voirie", "auth_group", "auth_group_permissions", 
  "auth_permission", "auth_user", "auth_user_groups", "auth_user_user_permissions"
];

// Fonction pour créer un fichier de composant React pour chaque table
const createComponent = (table) => {
  const componentName = table.charAt(0).toUpperCase() + table.slice(1).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()).replace(/\s+/g, '');

  const componentCode = `
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ${componentName} = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/${table}/')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching data!', error);
      });
  }, []);

  return (
    <div>
      <h1>${componentName}</h1>
      <table>
        <thead>
          <tr>
            {/* Remplacer par vos noms de colonnes */}
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {/* Remplacer par les propriétés spécifiques à chaque table */}
              <td>{item.column1}</td>
              <td>{item.column2}</td>
              <td>{item.column3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ${componentName};
`;

  const filePath = path.join(__dirname, 'src', 'views', 'examples', table);
  const fileName = `${componentName}.js`;

  // Créer le dossier si nécessaire
  if (!fs.existsSync(filePath)){
    fs.mkdirSync(filePath, { recursive: true });
  }

  // Écrire le code du composant dans le fichier
  fs.writeFileSync(path.join(filePath, fileName), componentCode, 'utf8');
  console.log(`Component ${componentName} created!`);
};

// Générer les composants pour chaque table
tables.forEach(createComponent);
