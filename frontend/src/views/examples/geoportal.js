import React, { useEffect, useRef } from "react";
import { Card, Container, Row } from "reactstrap";

// Leaflet components
import L from "leaflet";

// core components
import Header from "components/Headers/Header.js";

const GeoPortal = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current, {
      center: [40.748817, -73.985428], 
      zoom: 12, 
      zoomControl: false, 
      scrollWheelZoom: false, 
    });

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map);



    
    L.control.zoom({
      position: 'topright',
    }).addTo(map);



    return () => {
      map.remove();
    };
  }, []);

  return (
    <>
      <Header />
      <Container fluid className="mt--7">
        <Row>
          <div className="col">
            <Card className="shadow border-0">
              <div
                id="map-canvas"
                ref={mapRef}
                style={{ height: "600px", borderRadius: "8px" }} // Add rounded corners for a clean look
              />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default GeoPortal;
