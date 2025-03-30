import React from "react";
import { Card, CardBody, CardTitle, Container, Row, Col, Button, ButtonGroup } from "reactstrap";

const Header = ({ mapInstance, routingControl, travelMode, toggleTravelMode, resetRoute }) => {
  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Itinéraire
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          Navigation
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-route" />
                        </div>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <ButtonGroup className="w-100 mb-2">
                        <Button
                          id="modeToggle"
                          color={travelMode === "car" ? "info" : "success"}
                          size="sm"
                          className="w-50"
                          title="Changer le mode de transport"
                          onClick={toggleTravelMode}
                        >
                          <i className={`ni ni-${travelMode === "car" ? "delivery-fast" : "walk"} mr-1`}></i> {travelMode === "car" ? "Voiture" : "Piéton"}
                        </Button>
                        <Button
                          id="resetRoute"
                          color="danger"
                          size="sm"
                          className="w-50"
                          title="Effacer l'itinéraire actuel"
                          onClick={resetRoute}
                        >
                          <i className="ni ni-fat-remove mr-1"></i> Effacer
                        </Button>
                      </ButtonGroup>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Localisation
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">Position</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-map-marker-alt" />
                        </div>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <Button 
                        color="primary" 
                        size="sm"
                        className="w-100"
                        onClick={() => {
                          if (mapInstance) {
                            mapInstance.locate({setView: true, maxZoom: 16});
                          }
                        }}
                      >
                        <i className="ni ni-pin-3 mr-2"></i> Ma position
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Importation
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">Données</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-file-import" />
                        </div>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <Button
                        color="primary"
                        size="sm"
                        className="w-100"
                        onClick={() => document.getElementById('fileInput').click()}
                      >
                        <i className="ni ni-cloud-upload-96 mr-2"></i> Importer
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Vue
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">Affichage</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-globe" />
                        </div>
                      </Col>
                    </Row>
                    <div className="mt-3">
                      <Button
                        color="secondary"
                        size="sm"
                        className="w-100"
                        onClick={() => {
                          if (mapInstance) {
                            mapInstance.setView([27.140288, -13.2661061], 12);
                          }
                        }}
                      >
                        <i className="ni ni-world-2 mr-1"></i> Vue par défaut
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;