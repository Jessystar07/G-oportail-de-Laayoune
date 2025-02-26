import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/geoportail_laayoune.scss";
import "leaflet/dist/leaflet.css";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";

import Permis from "views/examples/Urbanisme/Permis";
import SuiviTravaux from "views/examples/annexes-urbanisme/SuiviTravaux";

import Permis_Sante from "views/examples/bureau-hygiene/Permis_Sante";

import espace_verts from "views/examples/espacesverts/espace_verts";
import Parcelle from "views/examples/Principal/Parcelle";
import PaiementExploitation from "views/examples/regie-marches/PaiementExploitation";
import PermisRegie from "views/examples/RegiePermisCommerciaux/permis_regie";
import PaimentPermisUrbanisme from "views/examples/regie-urbanisme/PaiementPermisUrbanisme";
import sport_culture from "views/examples/SportCulture/sport_culture";
import Voirie from "views/examples/voirie/Voirie";
import division_commerciaux from "views/examples/division-services-commerciaux/division_commerciaux";




const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="*" element={<Navigate to="/admin/index" replace />} />
      <Route path="views/examples/Urbanisme/Permis" element={<Permis />} />
      <Route path="views/examples/annexes-urbanisme/SuiviTravaux" element={<SuiviTravaux />} />
      <Route path="views/examples/division-services-commerciaux/division_commerciaux" element={<division_commerciaux />} />
      <Route path="views/examples/bureau-hygiene/Permis_Sante" element={<Permis_Sante />} />
      <Route path="views/examples/espacesverts/espace_verts" element={<espace_verts />} />
      <Route path="views/examples/Principal/Parcelle" element={<Parcelle />} />
      <Route path="views/examples/regie-marches/PaiementExploitation" element={<PaiementExploitation />} />
      <Route path="views/examples/RegiePermisCommerciaux/permis_regie" element={<PermisRegie />} />
      <Route path="views/examples/regie-urbanisme/PaiementPermisUrbanisme" element={<PaimentPermisUrbanisme />} />
      <Route path="views/examples/SportCulture/sport_culture" element={<sport_culture />} />
      <Route path="views/examples/voirie/Voirie" element={<Voirie />} />

    </Routes>
  </BrowserRouter>
);
