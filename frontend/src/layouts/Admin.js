import React, { useState } from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "components/Sidebar/Sidebar.js";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import routes from "routes.js";
import "./Layout.css";

const Admin = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return <Route path={prop.path} element={prop.component} key={key} />;
      } else if (prop.views) {
        return prop.views.map((view, subKey) => (
          <Route path={view.path} element={view.component} key={`${key}-${subKey}`} />
        ));
      }
      return null;
    });
  };

  return (
    <div className="layout">
      <Sidebar
        routes={routes}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <div className={`main-container ${!isSidebarOpen ? "expanded" : ""}`}>
        <div className="header">
          <AdminNavbar brandText="Urban Planning Geoportal" />
        </div>

        <div className="content">
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/admin/index" replace />} />
          </Routes>
        </div>

        <div className="footer">
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};

export default Admin;
