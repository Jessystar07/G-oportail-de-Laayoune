import React, { useEffect, useRef } from "react";
import { Card, Container, Row } from "reactstrap";
import * as L from 'leaflet';
import "leaflet.heat";
import "leaflet-search/dist/leaflet-search.min.css";
import "leaflet-search";
import "leaflet/dist/leaflet.css";
import Header from "components/Headers/Header.js";

const GeoPortal = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current, {
      center: [27.140288, -13.2661061],
      zoom: 12,
      zoomControl: false,
      scrollWheelZoom: true, // Changed to true for better user experience
    });

    // Define base layers
    const baseLayers = {
      "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }),
      "Satellite": L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }),
      "Terrain": L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
      }),
      "Dark": L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      })
    };

    // Add the default layer
    baseLayers["OpenStreetMap"].addTo(map);

    // Add layer control
    L.control.layers(baseLayers, null, {
      position: 'topright'
    }).addTo(map);

    // Add zoom control
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    // Add heatmap layer
    const heatmapData = [
      [27.140288, -13.2661061, 1],
      [27.140288, -13.2661061, 1],
    ];
    const heat = L.heatLayer(heatmapData, { radius: 25 }).addTo(map);

    // Add search control with Nominatim
    const searchControl = new L.Control.Search({
      url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
      jsonpParam: 'json_callback',
      propertyName: 'display_name',
      propertyLoc: ['lat', 'lon'],
      marker: L.circleMarker([0, 0], { radius: 30 }),
      autoCollapse: true,
      autoType: false,
      minLength: 2,
      position: 'topleft',
      textPlaceholder: 'Search for a location...',
      hideMarkerOnCollapse: true,
      moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 16); // Zoom closer to searched location
      },
      buildTip: function(text, val) {
        return '<a href="#">' + text + '</a>';
      },
      filterData: function(text, records) {
        return records;
      },
      parseJSON: function(data) {
        return data.map(item => ({
          loc: [item.lat, item.lon],
          title: item.display_name
        }));
      }
    }).addTo(map);

    // Add a scale control
    L.control.scale({
      position: 'bottomright',
      imperial: false // Use metric only
    }).addTo(map);

    // Enable scroll wheel zoom with Control key
    map.on('focus', () => {
      map.scrollWheelZoom.enable();
    });

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
                style={{
                  height: "600px", // Set map height
                  borderRadius: "8px", // Rounded corners
                }}
              />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default GeoPortal;