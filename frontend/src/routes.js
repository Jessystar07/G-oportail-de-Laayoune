import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";

var routes = [
  {
    path: "/index",
    name: "Géoportail",
    icon: "ni ni-square-pin text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/principal",
    name: "Principal",
    icon: "ni ni-building text-blue",
    layout: "/admin",
    views: [
      {
        path: "/parcelle",
        name: "Parcelle",
        icon: "ni ni-map-big text-orange",
        views: [
          { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
          { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
          { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
        ]
      },
      {
        path: "/requerant-personne-physique",
        name: "Requérant Personne Physique",
        icon: "ni ni-single-02 text-yellow",
        views: [
          { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
          { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
          { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
        ]
      },
      {
        path: "/requerant-personne-morale",
        name: "Requérant Personne Morale",
        icon: "ni ni-briefcase-24 text-info",
        views: [
          { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
          { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
          { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
        ]
      }
    ]
  },
  {
    path: "/urbanisme",
    name: "Urbanisme",
    icon: "ni ni-building text-yellow",
    layout: "/admin",
    views: [
      {
        path: "/permis",
        name: "Permis",
        icon: "ni ni-paper-diploma text-primary",
        views: [
          { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
          { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
          { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
        ]
      }
    ]
  },
  {
    path: "/regie-urbanisme",
    name: "Régie Urbanisme",
    icon: "ni ni-money-coins text-danger",
    layout: "/admin",
    views: [
      {
        path: "/paiement-tnb",
        name: "Paiement TNB",
        icon: "ni ni-credit-card text-warning",
        views: [
          { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
          { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
          { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
        ]
      },
      {
        path: "/paiement-permis-urbanisme",
        name: "Paiement Permis Urbanisme",
        icon: "ni ni-money-coins text-info",
        views: [
          { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
          { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
          { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
        ]
      }
    ]
  },


  {
    path: "/annexes-urbanisme",
    name: "annexes-urbanisme",
    icon: "ni ni-istanbul text-success",
    layout: "/admin",
    views: [
      {
        path: "/SuiviTravaux",
        name: "Suivi-Travaux",
        icon: "ni ni-paper-diploma text-primary",
        views: [
          { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
          { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
          { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
        ]
      }
    ]
  },
  
  {
    path: "/regie-permis-commerciaux",
    name: "Regie Permis Commerciaux",
    icon: "ni ni-basket text-blue",
    layout: "/admin",
    views: [
      {
        path: "/permis",
        name: "Permis",
        icon: "ni ni-map-big text-orange",
        views: [
          { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
          { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
          { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
        ]
      },
    ]
  },    
{
    path: "/division-services-commerciaux",
    name: "Division Services Commerciaux",
    icon: "ni ni-shop text-red",
    layout: "/admin",
    views: [
      {
        path: "/Inspection",
        name: "Inspection",
        icon: "ni ni-ruler-pencil text-orange",
        views: [
          { path: "/index", name: "Liste", component: "InspectionList" },  // Replace with actual component
          { path: "/create", name: "Créer", component: "InspectionCreate" }, // Replace with actual component
          { path: "/edit", name: "Modifier", component: "InspectionEdit" }, // Replace with actual component
        ]
      },
      {
        path: "/Permis-TNB",
        name: "Permis-TNB",
        icon: "ni ni-ungroup text-yellow",
        views: [
          { path: "/index", name: "Liste", component: "PermisList" },  // Replace with actual component
          { path: "/create", name: "Créer", component: "PermisCreate" }, // Replace with actual component
          { path: "/edit", name: "Modifier", component: "PermisEdit" }, // Replace with actual component
        ]
      },
    ]
  },
     
  {
    path: "/bureau-hygiene",
    name: "Bureau d'hygiene",
    icon: "ni ni-building text-green",
    layout: "/admin",
    views: [
      {
        path: "/Permis-Sante",
        name: "Permis de santé",
        icon: "ni ni-sound-wave text-orange",
        views: [
          { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
          { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
          { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
        ]
      },
    ]
  },  

  {
    path: "/marches-communaux",
    name: "Marchés Communaux",
    icon: "ni ni-shop text-yellow",
    layout: "/admin",
    views: [
      {
        path: "/Espace",
        name: "Espace",
        icon: "ni ni-map-big text-green",
        views: [
          { path: "/index", name: "Liste", component: "InspectionList" },  // Replace with actual component
          { path: "/create", name: "Créer", component: "InspectionCreate" }, // Replace with actual component
          { path: "/edit", name: "Modifier", component: "InspectionEdit" }, // Replace with actual component
        ]
      },
      {
        path: "/Marches",
        name: "Marchés",
        icon: "ni ni-basket text-yellow",
        views: [
          { path: "/index", name: "Liste", component: "PermisList" },  // Replace with actual component
          { path: "/create", name: "Créer", component: "PermisCreate" }, // Replace with actual component
          { path: "/edit", name: "Modifier", component: "PermisEdit" }, // Replace with actual component
        ]
      },
    ]
  },

  {
    path: "/regie-marches",
    name: "Regie marchés",
    icon: "ni ni-building text-blue",
    layout: "/admin",
    views: [
      {
        path: "/Paiement-Exploitation",
        name: "Paiement-Exploitation",
        icon: "ni ni-credit-card text-orange",
        views: [
          { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
          { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
          { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
        ]
      },
    ]
  },

  {
    path: "/espaces-verts",
    name: "Espaces verts",
    icon: "ni ni-tie-bow text-green",
    views: [
      { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
      { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
      { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
    ]
  },
  {
    path: "/voirie",
    name: "voirie",
    icon: "ni ni-map-big text-orange",
    views: [
      { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
      { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
      { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
    ]
  },
  {
    path: "/sport-culture",
    name: "Sport et culture",
    icon: "ni ni-trophy text-yellow",
    views: [
      { path: "/index", name: "Liste", component: null },  // Replace 'null' with the actual component
      { path: "/create", name: "Créer", component: null }, // Replace 'null' with the actual component
      { path: "/edit", name: "Modifier", component: null }, // Replace 'null' with the actual component
    ]
  },


  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },

  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
 
];

export default routes;
