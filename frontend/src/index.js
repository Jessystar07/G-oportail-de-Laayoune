import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import API from "./services/api";  // Assuming you have a file for API calls

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/geoportail_laayoune.scss";
import "leaflet/dist/leaflet.css";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="*" element={<Navigate to="/admin/index" replace />} />
    </Routes>
  </BrowserRouter>
);

// App component for testing connection
function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Test backend connection
    API.get('/test/')  // Assuming API is set up to call your Django backend
      .then(response => {
        setMessage(response.data.message);
        console.log('Backend connected!');
      })
      .catch(error => {
        console.error('Backend connection error:', error);
      });
  }, []);

  return (
    <div>
      <h1>Backend Message: {message}</h1>
    </div>
  );
}

export default App;
