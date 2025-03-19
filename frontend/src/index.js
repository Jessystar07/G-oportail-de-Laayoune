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

import EspaceVert from "views/examples/espacesverts/EspaceVert";
import Parcelle from "views/examples/Principal/Parcelle";
import PaiementExploitation from "views/examples/regie-marches/PaiementExploitation";
import PermisRegie from "views/examples/RegiePermisCommerciaux/permis_regie";
import Sport__Culture from "views/examples/SportCulture/Sport__Culture";
import Voirie from "views/examples/voirie/Voirie";
import DivisionCommerciaux from "views/examples/division-services-commerciaux/DivisionCommerciaux";
import RegieUrbanisme from "views/examples/regie-urbanisme/RegieUrbanisme";




const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="*" element={<Navigate to="/admin/index" replace />} />
      <Route path="views/examples/Urbanisme/Permis" element={<Permis />} />
      <Route path="views/examples/annexes-urbanisme/SuiviTravaux" element={<SuiviTravaux />} />
      <Route path="views/examples/division-services-commerciaux/DivisionCommerciaux" element={<DivisionCommerciaux />} />
      <Route path="views/examples/bureau-hygiene/Permis_Sante" element={<Permis_Sante />} />
      <Route path="views/examples/espacesverts/EspaceVert" element={<EspaceVert />} />
      <Route path="views/examples/Principal/Parcelle" element={<Parcelle />} />
      <Route path="views/examples/regie-marches/PaiementExploitation" element={<PaiementExploitation />} />
      <Route path="views/examples/RegiePermisCommerciaux/permis_regie" element={<PermisRegie />} />
      <Route path="views/examples/regie-urbanisme/RegieUrbanisme" element={<RegieUrbanisme />} />
      <Route path="views/examples/SportCulture/Sport__Culture" element={<Sport__Culture />} />
      <Route path="views/examples/voirie/Voirie" element={<Voirie />} />

    </Routes>
  </BrowserRouter>
);
