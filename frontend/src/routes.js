/* eslint-disable react/jsx-pascal-case */
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";

import Permis from "views/examples/Urbanisme/Permis";
import SuiviTravaux from "views/examples/annexes-urbanisme/SuiviTravaux";
import Permis_Sante from "views/examples/bureau-hygiene/Permis_Sante";
import MarchesCommunaux from "views/examples/marches-communaux/MarchesCommunaux"

import EspaceVert from "views/examples/espacesverts/EspaceVert";
import Parcelle from "views/examples/Principal/Parcelle";
import PaiementExploitation from "views/examples/regie-marches/PaiementExploitation";
import PermisRegie from "views/examples/RegiePermisCommerciaux/permis_regie";
import RegieUrbanisme from "views/examples/regie-urbanisme/RegieUrbanisme";
import Sport__Culture from "views/examples/SportCulture/Sport__Culture";
import Voirie from "views/examples/voirie/Voirie";
import DivisionCommerciaux from "views/examples/division-services-commerciaux/DivisionCommerciaux";



const routes = [
  {
    path: "/index",
    name: "Géoportail",
    icon: "ni ni-square-pin text-primary",
    component: <Index />,
    layout: "/admin",
  },


  {
    path: "/parcelle",
    name: "Principal",
    icon: "ni ni-map-big text-orange",
    component: <Parcelle />,
    layout: "/admin",
  },

  {
    path: "/permis",
    name: "Urbanisme",
    icon: "ni ni-paper-diploma text-primary",
    component: <Permis />,
    layout: "/admin",
  },

  



      {
        path: "/RegieUrbanisme",
        name: "Régie Urbanisme",
        icon: "ni ni-money-coins text-info",
        component: <RegieUrbanisme />,
        layout: "/admin",
    
  },


 {
    path: "/SuiviTravaux",
    name: "Annexes Urbanisme",
    icon: "ni ni-paper-diploma text-primary",
    component: <SuiviTravaux />,
    layout: "/admin",

  },

  {
    path: "/permis_regie",
    name: "Regie - Permis Commerciaux",
    icon: "ni ni-map-big text-orange",
    component: <PermisRegie />,
    layout: "/admin",
  },

  
  {
    path: "/DivisionCommerciaux",
    name: "Division Services Commerciaux",
    icon: "ni ni-shop text-red",
    component: <DivisionCommerciaux />,
    layout: "/admin",
  },
     
      {
        path: "/Permis_Sante",
        name: "Bureau d'hygiene",
        icon: "ni ni-sound-wave text-orange",
        component: <Permis_Sante />,
        layout: "/admin",
      },

  {
    path: "/marches-communaux",
    name: "Marchés Communaux",
    icon: "ni ni-shop text-yellow",
    component: < MarchesCommunaux />,
    layout: "/admin",
  },


  
  {
    path: "/PaiementExploitation",
    name: "Regie de Marché",
    icon: "ni ni-credit-card text-orange",
    component: <PaiementExploitation />,
    layout: "/admin",
  },
    
  


  
  {
    path: "/EspaceVert",
    name: "Espaces Verts",
    icon: "ni ni-tie-bow text-green",
    component: <EspaceVert />,
    layout: "/admin", 
  },
  {
    path: "/Voirie",
    name: "Voirie",
    icon: "ni ni-map-big text-orange",
    component: <Voirie />,
    layout: "/admin", // Added missing layout
  },
  {
    path: "/Sport__Culture",
    name: "Sport et Culture",
    icon: "ni ni-trophy text-yellow",
    component: <Sport__Culture />,
    layout: "/admin", 
  },
  {
    path: "/register",
    name: "S'inscrire",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/user-profile",
    name: "Profil utilisateur",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Se connecter",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
];

export default routes;
