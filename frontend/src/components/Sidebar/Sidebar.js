import React, { useState } from 'react';
import { NavLink as NavLinkRRD, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { NavItem, NavLink, Collapse, Nav } from "reactstrap";
import { Menu, X } from 'lucide-react';
import "./Sidebar.css";

const Sidebar = ({ routes, isSidebarOpen, toggleSidebar }) => {
  const [collapseOpen, setCollapseOpen] = useState({});
  const location = useLocation();

  const activeRoute = (routeName) => location.pathname.includes(routeName) ? "active" : "";

  const toggleCollapse = (path) => {
    setCollapseOpen((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const createLinks = (routes) => {
    return routes.map((route, key) => {
      if (route.views) {
        return (
          <NavItem key={key}>
            <NavLink 
              href="#"
              onClick={(e) => { e.preventDefault(); toggleCollapse(route.path); }}
              className={`${activeRoute(route.path)} ${isSidebarOpen ? '' : 'collapsed-link'}`}
            >
              <i className={route.icon} />
              {isSidebarOpen && (
                <>
                  <span className="nav-link-text">{route.name}</span>
                  <i className={`ni ni-bold-${collapseOpen[route.path] ? 'up' : 'down'} ml-2`} />
                </>
              )}
            </NavLink>
            {isSidebarOpen && (
              <Collapse isOpen={collapseOpen[route.path]}>
                <Nav className="nav-sm flex-column">
                  {route.views.map((view, viewKey) => (
                    <NavItem key={viewKey}>
                      {view.views ? (
                        <>
                          <NavLink
                            href="#"
                            onClick={(e) => { e.preventDefault(); toggleCollapse(`${route.path}${view.path}`); }}
                            className={activeRoute(view.path)}
                          >
                            <i className={view.icon} />
                            <span className="nav-link-text">{view.name}</span>
                            <i className={`ni ni-bold-${collapseOpen[`${route.path}${view.path}`] ? 'up' : 'down'} ml-2`} />
                          </NavLink>
                          <Collapse isOpen={collapseOpen[`${route.path}${view.path}`]}>
                            <Nav className="nav-sm flex-column">
                              {view.views.map((subView, subViewKey) => (
                                <NavItem key={subViewKey}>
                                  <NavLink 
                                    to={route.layout + route.path + view.path + subView.path} 
                                    tag={NavLinkRRD}
                                    className={activeRoute(subView.path)}
                                    onClick={() => setCollapseOpen({})}
                                  >
                                    <span className="nav-link-text">{subView.name}</span>
                                  </NavLink>
                                </NavItem>
                              ))}
                            </Nav>
                          </Collapse>
                        </>
                      ) : (
                        <NavLink 
                          to={route.layout + route.path + view.path} 
                          tag={NavLinkRRD}
                          className={activeRoute(view.path)}
                          onClick={() => setCollapseOpen({})}
                        >
                          <i className={view.icon} />
                          <span className="nav-link-text">{view.name}</span>
                        </NavLink>
                      )}
                    </NavItem>
                  ))}
                </Nav>
              </Collapse>
            )}
          </NavItem>
        );
      } else {
        return (
          <NavItem key={key}>
            <NavLink 
              to={route.layout + route.path} 
              tag={NavLinkRRD}
              className={`${activeRoute(route.path)} ${isSidebarOpen ? '' : 'collapsed-link'}`}
              onClick={() => setCollapseOpen({})}
            >
              <i className={route.icon} />
              {isSidebarOpen && <span className="nav-link-text">{route.name}</span>}
            </NavLink>
          </NavItem>
        );
      }
    });
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <button 
          className="toggle-button"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <Nav className="navbar-nav">
        {createLinks(routes)}
      </Nav>
    </div>
  );
};

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
  isSidebarOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;