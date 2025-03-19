import React from "react";
import { Link, useLocation } from "react-router-dom"; // Importer useLocation pour gérer l'élément actif
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

const AdminNavbar = () => {
  const location = useLocation(); // Utiliser useLocation pour obtenir la route actuelle

  // Fonction pour définir la classe "active" en fonction de l'URL actuelle
  const getLinkClass = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
      <Container className="px-4">
        <button className="navbar-toggler" id="navbar-collapse-main">
          <span className="navbar-toggler-icon" />
        </button>
        <UncontrolledCollapse navbar toggler="#navbar-collapse-main">
          <div className="navbar-collapse-header d-md-none">
            <Row>
              <Col className="collapse-close" xs="6">
                <button className="navbar-toggler" id="navbar-collapse-main">
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink
                className={`nav-link-icon ${getLinkClass("/")}`}
                to="/"
                tag={Link}
              >
                <i className="ni ni-planet" />
                <span className="nav-link-inner--text">Géoportail</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`nav-link-icon ${getLinkClass("/auth/register")}`}
                to="/auth/register"
                tag={Link}
              >
                <i className="ni ni-circle-08" />
                <span className="nav-link-inner--text">S'inscrire</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`nav-link-icon ${getLinkClass("/auth/login")}`}
                to="/auth/login"
                tag={Link}
              >
                <i className="ni ni-key-25" />
                <span className="nav-link-inner--text">Se connecter</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={`nav-link-icon ${getLinkClass("/admin/user-profile")}`}
                to="/admin/user-profile"
                tag={Link}
              >
                <i className="ni ni-single-02" />
                <span className="nav-link-inner--text">Profile</span>
              </NavLink>
            </NavItem>
          </Nav>
        </UncontrolledCollapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
