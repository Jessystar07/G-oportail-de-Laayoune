import React, { useEffect, useRef, useState } from "react";
import { Card, Container, Row } from "reactstrap";

import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-draw";
import "leaflet-measure";
import "leaflet-measure/dist/leaflet-measure.css";
import "leaflet-search";
import "leaflet-search/dist/leaflet-search.min.css";
import "leaflet.heat";

import omnivore from "leaflet-omnivore";
import shp from "shpjs";

import domtoimage from "dom-to-image";
import { jsPDF } from "jspdf";

// Updated CSS for map components
const customStyles = `
  .map-wrapper-container {
    height: 100%;
    width: 100%;
    padding: 0;
  }
  
  .row-container {
    height: 100%;
    margin: 0;
  }
  
  .col-map {
    height: 100%;
    padding: 0;
    position: relative;
  }
  
  .map-card {
    height: 100%;
    width: 100%;
    margin: 0;
    border: none;
    border-radius: 0;
  }

  .map-container {
    height: 100%;
    width: 100%;
    z-index: 0;
  }
  
  .map-controls-container {
    position: absolute;
    top: 10px;
    left: 55px;  
    z-index: 1000;
    display: flex;
    background: white;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    max-width: calc(100% - 20px);
    overflow-x: auto;
  }
  
  .map-control-button {
    background: white;
    border: none;
    border-right: 1px solid rgba(0, 0, 0, 0.2);
    padding: 8px 12px;
    font-size: 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #000;
    transition: background-color 0.2s;
  }
  
  .map-control-button:last-child {
    border-right: none;
  }
  
  .map-control-button:hover {
    background-color: #f0f0f0;
  }
  
  .map-control-button svg {
    margin-right: 5px;
  }
  
  .map-control-label {
    display: flex;
    align-items: center;
    margin: 0;
    cursor: pointer;
    padding: 8px 12px;
    font-size: 12px;
    color: #000;
  }
  
  .map-control-label:hover {
    background-color: #f0f0f0;
  }
  
  .map-control-label svg {
    margin-right: 5px;
  }
  
  .coords-info {
    background: white;
    padding: 5px 10px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    font-size: 12px;
  }

  .map-control-tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    pointer-events: none;
    transition: opacity 0.2s;
  }
  
  .custom-popup {
    max-height: 200px;
    overflow-y: auto;
    padding: 5px;
  }
  
  .export-loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left: 4px solid #5e72e4;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 1s linear infinite;
    margin-bottom: 10px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .leaflet-control-measure {
    background-color: white !important;
    border: 2px solid rgba(0, 0, 0, 0.2) !important;
    border-radius: 4px !important;
  }
  .leaflet-control-measure-interaction {
    pointer-events: auto !important;
  }

  .leaflet-measure-path {
    pointer-events: auto !important;
    z-index: 1000 !important; 
  }

  .leaflet-measure-map-measure .leaflet-interactive {
    cursor: crosshair !important;
  }
  .leaflet-touch .leaflet-bar a {
    width: 36px;
    height: 30px;
    line-height: 30px;
  }

  .leaflet-control-zoom-out {
    width: 36px;
    height: 36px;
  }

  .leaflet-control-zoom-out svg {
    width: 24px;
    height: 24px;
    margin: auto;
  }
  
  .leaflet-measure-resultpopup {
    background-color: white !important;
    border: 2px solid rgba(0, 0, 0, 0.2) !important;
    color: #333 !important;
    padding: 8px !important;
    border-radius: 4px !important;
    font-weight: normal !important;
  }

  .leaflet-container {
    touch-action: pan-x pan-y !important;
  }

  /* Crucial fix - completely prevent map interaction during measurement */
  .leaflet-container.measuring {
    cursor: crosshair !important;
    touch-action: none !important;
    pointer-events: all !important; 
  }

  /* Make sure measurement mode gets priority */
  .leaflet-measure-map {
    z-index: 1000 !important;
    touch-action: none !important;
    pointer-events: all !important;
  }

  /* Fix map panning while measuring */
  body.measuring {
    touch-action: none !important;
    overflow: hidden;
  }
    body.measuring .leaflet-container {
  cursor: crosshair !important;
}

  /* Ensure measurement points and paths are clickable */
  .leaflet-measure-path, 
  .leaflet-measure-point {
    pointer-events: all !important;
  touch-action: none !important;
  z-index: 10000 !important;
}
body.measuring .leaflet-container .leaflet-map-pane {
  pointer-events: none;
}

body.measuring .leaflet-container .leaflet-overlay-pane {
  pointer-events: all;
}
  .leaflet-measure-map-measure .leaflet-interactive {
    touch-action: none !important;
    pointer-events: all !important;
  }

  .leaflet-draw-toolbar a {
    background-size: 20px 20px !important;
    background-position: center center !important;
  }

  /* Add custom styling for the measure control button */
  .leaflet-control-measure a.leaflet-control-measure-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
  }

  .measurement-icon {
    width: 20px;
    height: 20px;
  }

  /* Add styling for measurement results */
  .leaflet-measure-resultpopup table {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  .leaflet-measure-resultpopup th,
  .leaflet-measure-resultpopup td {
    padding: 2px 4px;
    text-align: left;
  }
  

  @media (max-width: 768px) {
    .map-controls-container {
      flex-wrap: wrap;
      width: calc(100% - 20px);
    }

    .map-control-button {
      flex: 1 1 auto;
      min-width: 80px;
      text-align: center;
      justify-content: center;
    }
  }
`;
const GeoPortal = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const drawnItemsRef = useRef(null);
  const fileInputRef = useRef(null);
  const isMapInitializedRef = useRef(false);
  const measureControlRef = useRef(null);

  const [exporting, setExporting] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Common function for adding SVG icons to buttons
  const addIconToButton = (selector, iconSvg) => {
    const button = document.querySelector(selector);
    if (button) {
      button.innerHTML = iconSvg + button.innerHTML;
    }
  };

  // Inject custom CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = customStyles;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    
    const initMap = () => {
      try {
        if (!L || !L.map) {
          console.error("Leaflet is not fully loaded");
          return;
        }
      
        // Patching Leaflet's measure plugin to fix positioning issues
        if (L.Control && L.Control.Measure && L.Control.Measure.prototype) {
          // Save the original _startMeasure method
          const originalStartMeasure = L.Control.Measure.prototype._startMeasure;
          
          // Override the _startMeasure method to fix interaction issues
          L.Control.Measure.prototype._startMeasure = function(...args) {
            // Call the original method
            originalStartMeasure.apply(this, args);
            
            // Add measuring class to body and map container
            document.body.classList.add('measuring');
            
            // Temporarily disable all map interactions
            if (this._map) {
              this._map._container.classList.add('measuring');
              
              // Store original map options to restore later
              this._originalMapOptions = {
                dragging: this._map.dragging.enabled(),
                touchZoom: this._map.touchZoom.enabled(),
                doubleClickZoom: this._map.doubleClickZoom.enabled(),
                scrollWheelZoom: this._map.scrollWheelZoom.enabled(),
                boxZoom: this._map.boxZoom.enabled(),
                keyboard: this._map.keyboard.enabled(),
                tap: this._map.tap && this._map.tap.enabled()
              };
              
              // Disable map interactions
              this._map.dragging.disable();
              this._map.touchZoom.disable();
              this._map.doubleClickZoom.disable();
              this._map.scrollWheelZoom.disable();
              this._map.boxZoom.disable();
              this._map.keyboard.disable();
              if (this._map.tap) this._map.tap.disable();
            }
          };
          
          // Save the original _finishMeasure method
          const originalFinishMeasure = L.Control.Measure.prototype._finishMeasure;
          
          // Override the _finishMeasure method to restore map interactions
          L.Control.Measure.prototype._finishMeasure = function(...args) {
            // Call the original method
            originalFinishMeasure.apply(this, args);
            
            // Remove measuring classes
            document.body.classList.remove('measuring');
            
            // Restore map interactions
            if (this._map && this._originalMapOptions) {
              this._map._container.classList.remove('measuring');
              
              // Restore original map options
              if (this._originalMapOptions.dragging) this._map.dragging.enable();
              if (this._originalMapOptions.touchZoom) this._map.touchZoom.enable();
              if (this._originalMapOptions.doubleClickZoom) this._map.doubleClickZoom.enable();
              if (this._originalMapOptions.scrollWheelZoom) this._map.scrollWheelZoom.enable();
              if (this._originalMapOptions.boxZoom) this._map.boxZoom.enable();
              if (this._originalMapOptions.keyboard) this._map.keyboard.enable();
              if (this._originalMapOptions.tap && this._map.tap) this._map.tap.enable();
            }
          };
          
          // Remplacer complètement la méthode _handleMapClick pour corriger le problème du premier point
          L.Control.Measure.prototype._handleMapClick = function(evt) {
            // Immédiatement empêcher la propagation de l'événement vers la carte
            L.DomEvent.stopPropagation(evt);
            L.DomEvent.preventDefault(evt);
            
            // Capturer les coordonnées exactes du clic avant toute manipulation
            const clickLatLng = evt.latlng.clone();
            
            // Important: Désactiver les mouvements de la carte avant même d'appeler la méthode originale
            if (this._map) {
              this._map.dragging.disable();
              this._map.doubleClickZoom.disable();
              this._map.scrollWheelZoom.disable();
              this._map.boxZoom.disable();
            }
            
            // Modification clé: au lieu d'utiliser la méthode originale, recréer sa fonctionnalité
            // mais en utilisant les coordonnées exactes capturées
            if (!this._measuring) {
              this._measuring = true;
              this._measureVertices = [];
              this._measureLayer = L.layerGroup().addTo(this._map);
              
              // Ajouter le premier point avec les coordonnées exactes du clic
              this._measureVertices.push(clickLatLng);
              const marker = L.circleMarker(clickLatLng, this.options.pointOptions || {
                color: '#ff7800',
                weight: 2,
                fillColor: '#ff7800',
                fillOpacity: 0.5,
                radius: 5
              }).addTo(this._measureLayer);
              marker._isFirstPoint = true;
            } else {
              // Pour les points suivants
              this._measureVertices.push(clickLatLng);
              L.circleMarker(clickLatLng, this.options.pointOptions || {
                color: '#ff7800',
                weight: 2,
                fillColor: '#ff7800',
                fillOpacity: 0.5,
                radius: 5
              }).addTo(this._measureLayer);
              
              // Créer ou mettre à jour la ligne de mesure
              if (this._measureVertices.length > 1) {
                if (this._measureLine) {
                  this._measureLine.setLatLngs(this._measureVertices);
                } else {
                  this._measureLine = L.polyline(this._measureVertices, this.options.lineOptions || {
                    color: '#ff7800',
                    weight: 2
                  }).addTo(this._measureLayer);
                }
              }
              
              // Mise à jour des résultats si la méthode existe
              if (typeof this._updateResults === 'function') {
                this._updateResults();
              }
              
              // Mise à jour du tooltip si la méthode existe
              if (typeof this._updateTooltip === 'function') {
                this._updateTooltip(clickLatLng);
              }
            }
          };
        }
      
        const map = L.map(mapRef.current, {
          center: [27.1468963, -13.1637425],
          zoom: 13.5, 
          zoomControl: false,
          scrollWheelZoom: true,
          touchZoom: true,
          doubleClickZoom: true,
          tap: false,  // Disable tap handler to prevent zoom issues
          attributionControl: true,
          // Important - set higher maxBoundsViscosity to prevent dragging outside bounds
          maxBoundsViscosity: 1.0
        });
        
        mapInstanceRef.current = map;
        
        const baseLayers = {
          "OpenStreetMap": L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 25
          }),
          "Satellite": L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
              attribution: "Tiles &copy; Esri",
              maxZoom: 25
            }
          ),
          "Terrain": L.tileLayer(
            "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",
            {
              attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
              maxZoom: 25
            }
          ),
          "Toner": L.tileLayer(
            "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",
            {
              attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>',
              maxZoom: 25
            }
          ),
        };
        
        baseLayers["OpenStreetMap"].addTo(map);
        
        L.control.layers(baseLayers, null, { 
          position: "topright",
          collapsed: true,
        }).addTo(map);
        
        L.control.zoom({ 
          position: "topright",
          zoomInTitle: "Zoomer",
          zoomOutTitle: "Dézoomer"
        }).addTo(map);
        


        
        // Drawing tools
        if (L.Control && L.Control.Draw) {
          drawnItemsRef.current = new L.FeatureGroup();
          map.addLayer(drawnItemsRef.current);
          
          const drawControl = new L.Control.Draw({
            position: "topright",
            edit: { 
              featureGroup: drawnItemsRef.current,
              poly: { allowIntersection: false }
            },
            draw: {
              polygon: { allowIntersection: false, showArea: true },
              polyline: true,
              rectangle: true,
              circle: true,
              marker: true,
              circlemarker: false
            }
          });
          
          map.addControl(drawControl);
          
          map.on(L.Draw.Event.CREATED, (event) => {
            drawnItemsRef.current.addLayer(event.layer);
          });
        }
        
        // Add measurement control with enhanced options
        if (L.control.measure) {
          const measureOptions = {
            position: 'topright',
            primaryLengthUnit: 'meters',
            secondaryLengthUnit: 'kilometers',
            primaryAreaUnit: 'sqmeters',
            secondaryAreaUnit: 'hectares',
            activeColor: '#1e88e5',
            completedColor: '#4caf50',
            captureZIndex: 10000,  // Ensure high z-index for measurement elements
            popupOptions: {
              className: 'leaflet-measure-resultpopup',
              autoPanPadding: [10, 10]
            },
            // Enhanced precision for measurements
            decPoint: '.',
            thousandsSep: ' ',
            units: {
              meters: {
                factor: 1,
                display: 'mètres',
                decimals: 2
              },
              kilometers: {
                factor: 0.001,
                display: 'kilomètres',
                decimals: 3
              },
              sqmeters: {
                factor: 1,
                display: 'mètres²',
                decimals: 2
              },
              hectares: {
                factor: 0.0001,
                display: 'hectares',
                decimals: 2
              }
            },
            localization: 'fr',
            clearMeasurementsOnStop: false,
            measureControlTitleOn: 'Mesurer une distance ou une surface',
            measureControlTitleOff: 'Arrêter de mesurer',
            // Important - do NOT resize the map during measurement
            resumeOnToggleOut: false
          };

          measureControlRef.current = L.control.measure(measureOptions);
          measureControlRef.current.addTo(map);

          // Enhanced event handlers for measurement tool
          map.on('measurestart', (e) => {
            console.log('Measurement started');
            setIsMeasuring(true);
            if (mapRef.current) {
              mapRef.current.classList.add('measuring');
            }
            document.body.classList.add('measuring');
            
            // Capture immédiate des événements de la carte
            const captureMapInteractions = () => {
              // Désactiver immédiatement toutes les interactions de la carte
              map.dragging.disable();
              map.touchZoom.disable();
              map.doubleClickZoom.disable();
              map.scrollWheelZoom.disable();
              map.boxZoom.disable();
              map.keyboard.disable();
              if (map.tap) map.tap.disable();
              
              // Empêcher toute interférence avec la couche de mesure
              document.querySelectorAll('.leaflet-overlay-pane').forEach(pane => {
                pane.style.pointerEvents = 'all';
              });
            };
            
            // Exécuter immédiatement et répéter après un court délai pour s'assurer que ça prend effet
            captureMapInteractions();
            setTimeout(captureMapInteractions, 50);
          });

          map.on('measurefinish', () => {
            console.log('Measurement finished');
            setIsMeasuring(false);
            if (mapRef.current) {
              mapRef.current.classList.remove('measuring');
            }
            document.body.classList.remove('measuring');
            
            // Re-enable map interactions after measuring
            map.dragging.enable();
            map.touchZoom.enable();
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
            map.boxZoom.enable();
            map.keyboard.enable();
            if (map.tap) map.tap.enable();
          });
          
          // Capture clicks on measurement elements
          map.on('click', (e) => {
            if (isMeasuring) {
              // When measuring, consume the event to prevent map movement
              L.DomEvent.stopPropagation(e);
              L.DomEvent.preventDefault(e);
            }
          });
          
          // Fix for measurement paths to ensure they are clickable
          map.on('layeradd', (e) => {
            if (e.layer && e.layer._path && (
                e.layer._path.classList.contains('leaflet-measure-path') || 
                e.layer._container && e.layer._container.classList.contains('leaflet-measure-path')
            )) {
              // Make measurement elements capture mouse events
              e.layer._path.style.pointerEvents = 'all';
              e.layer._path.style.touchAction = 'none';
              if (e.layer._path.nextSibling && e.layer._path.nextSibling.classList.contains('leaflet-measure-point')) {
                e.layer._path.nextSibling.style.pointerEvents = 'all';
                e.layer._path.nextSibling.style.touchAction = 'none';
              }
            }
          });
        }
        
        // Coordinates display
        const coordsControl = L.control({ position: 'bottomright' });
        coordsControl.onAdd = function() {
          const div = L.DomUtil.create('div', 'info coords-info');
          div.id = 'coordinates';
          div.innerHTML = '<strong>Coordonnées:</strong> --';
          return div;
        };
        coordsControl.addTo(map);
        
        map.on('mousemove', (e) => {
          // Only update coordinates if not measuring
          if (!isMeasuring) {
            const coordsElement = document.getElementById('coordinates');
            if (coordsElement) {
              coordsElement.innerHTML = 
                `<strong>Latitude:</strong> ${e.latlng.lat.toFixed(6)}, <strong>Longitude:</strong> ${e.latlng.lng.toFixed(6)}`;
            }
          }
        });
        
        // Disable click propagation on all control elements
        const disableClickPropagation = () => {
          document.querySelectorAll('.leaflet-control, .map-controls-container, .map-control-button').forEach(element => {
            L.DomEvent.disableClickPropagation(element);
          });
        };
        
        // Initial attempt to disable click propagation
        disableClickPropagation();
        
        // Fix for first click issues: force map to fully initialize and settle
        setTimeout(() => {
          map.invalidateSize(true);
          addButtonIcons();
          disableClickPropagation(); // Try again after icons are added
          
          // Set map as ready after proper initialization
          setMapReady(true);
          isMapInitializedRef.current = true;
        }, 1000);
        
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    setTimeout(initMap, 100);
    
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          isMapInitializedRef.current = false;
        } catch (error) {
          console.error("Error removing map:", error);
        }
      }
    };
  }, []);

  // Comprehensive fixing of all measurement tool interaction issues
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    
    try {
      // Comprehensive patch for all measurement tool elements
      const fixMeasurementElements = () => {
        console.log("Applying fixes to measurement tools");
        
        // 1. Fix the measurement button itself
        const measureToggle = document.querySelector('.leaflet-control-measure-toggle');
        if (measureToggle) {
          L.DomEvent.disableClickPropagation(measureToggle);
          L.DomEvent.disableScrollPropagation(measureToggle);
        }
        
        // 2. Fix all existing measurement result popups
        document.querySelectorAll('.leaflet-measure-resultpopup').forEach(popup => {
          L.DomEvent.disableClickPropagation(popup);
          L.DomEvent.disableScrollPropagation(popup);
          popup.style.pointerEvents = 'all';
        });
        
        // 3. Fix all measurement paths
        document.querySelectorAll('.leaflet-measure-path').forEach(path => {
          if (path.style) {
            path.style.pointerEvents = 'all';
            path.style.touchAction = 'none';
          }
          L.DomEvent.disableClickPropagation(path);
        });
        
        // 4. Fix measure vertices/points
        document.querySelectorAll('.leaflet-measure-vertex, .leaflet-measure-point').forEach(point => {
          if (point.style) {
            point.style.pointerEvents = 'all';
            point.style.touchAction = 'none';
          }
          L.DomEvent.disableClickPropagation(point);
        });
        
        // 5. Add handlers to ensure the map doesn't move during measurement
        if (isMeasuring && mapInstanceRef.current) {
          const map = mapInstanceRef.current;
          
          // Ensure map interactions are disabled during measurement
          map.dragging.disable();
          map.touchZoom.disable();
          map.doubleClickZoom.disable();
          map.scrollWheelZoom.disable();
          map.boxZoom.disable();
          map.keyboard.disable();
          if (map.tap) map.tap.disable();
          
          // Nouvelle méthode pour empêcher tout mouvement de carte
          document.querySelectorAll('.leaflet-map-pane').forEach(pane => {
            pane.style.pointerEvents = 'none';
          });
          
          document.querySelectorAll('.leaflet-overlay-pane').forEach(pane => {
            pane.style.pointerEvents = 'all';
          });
          
          // Add measuring class to necessary elements
          document.body.classList.add('measuring');
          if (mapRef.current) {
            mapRef.current.classList.add('measuring');
          }
        }
      };
      
      // Apply fixes immediately
      fixMeasurementElements();
      
      // Set up mutation observer to watch for dynamically added measurement elements
      const observer = new MutationObserver((mutations) => {
        let shouldFix = false;
        
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length > 0) {
            Array.from(mutation.addedNodes).forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Check if the added node or any of its children are measurement elements
                if (
                  (node.classList && (
                    node.classList.contains('leaflet-measure-path') ||
                    node.classList.contains('leaflet-measure-point') ||
                    node.classList.contains('leaflet-measure-vertex') ||
                    node.classList.contains('leaflet-measure-resultpopup')
                  )) ||
                  node.querySelector('.leaflet-measure-path, .leaflet-measure-point, .leaflet-measure-vertex, .leaflet-measure-resultpopup')
                ) {
                  shouldFix = true;
                }
              }
            });
          }
        });
        
        if (shouldFix) {
          // Wait a brief moment to ensure elements are fully rendered
          setTimeout(fixMeasurementElements, 10);
        }
      });
      
      // Start observing the entire document for measurement elements
      observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        attributeFilter: ['class']
      });
      
      // Ajouter des gestionnaires d'événements supplémentaires pour capturer les clics sur la carte pendant la mesure
      const map = mapInstanceRef.current;
      
      // Capture all mouse events on the map container during measuring
      const captureAllEvents = (e) => {
        if (isMeasuring) {
          e.stopPropagation();
          if (e.type === 'mousedown' || e.type === 'touchstart') {
            L.DomEvent.preventDefault(e);
          }
        }
      };
      
      const mapContainer = map._container;
      mapContainer.addEventListener('mousedown', captureAllEvents, true);
      mapContainer.addEventListener('touchstart', captureAllEvents, true);
      
      // Clean up observer on component unmount
      return () => {
        observer.disconnect();
        mapContainer.removeEventListener('mousedown', captureAllEvents, true);
        mapContainer.removeEventListener('touchstart', captureAllEvents, true);
      };
    } catch (error) {
      console.error("Error fixing measurement tool:", error);
    }
  }, [mapReady, isMeasuring]);



  // Add icons to map control buttons
  const addButtonIcons = () => {
    const icons = {
      '.leaflet-draw-draw-polyline': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="12" x2="22" y2="12"></line></svg>`,
      '.leaflet-draw-draw-polygon': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 18,6 18,12 12,16 6,12 6,6"></polygon></svg>`,
      '.leaflet-draw-draw-rectangle': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16"></rect></svg>`,
      '.leaflet-draw-draw-circle': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"></circle></svg>`,
      '.leaflet-draw-draw-marker': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8 2 5 5 5 9c0 5 7 11 7 11s7-6 7-11c0-4-3-7-7-7z"></path><circle cx="12" cy="9" r="2.5"></circle></svg>`,
      '.leaflet-draw-edit-edit': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
      '.leaflet-draw-edit-remove': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
      
      '.leaflet-control-measure-toggle': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="measurement-icon"><path d="M2 12h20"></path><path d="M2 12v-2"></path><path d="M22 12v-2"></path><path d="M7 12v-2"></path><path d="M12 12v-2"></path><path d="M17 12v-2"></path></svg>`
    
    };

    try {
      Object.entries(icons).forEach(([selector, iconSvg]) => {
        addIconToButton(selector, iconSvg);
      });
    } catch (error) {
      console.warn("Error adding icons:", error);
    }
  };

  // Add a button to toggle measurement mode directly in the UI
  const toggleMeasurement = () => {
    if (!mapInstanceRef.current || !measureControlRef.current) return;
    
    try {
      // Find and click the measurement button
      const measureToggle = document.querySelector('.leaflet-control-measure-toggle');
      if (measureToggle) {
        // Stop propagation and prevent default
        L.DomEvent.stopPropagation(new Event('click'));
        
        // Click the button
        measureToggle.click();
      }
    } catch (error) {
      console.error("Error toggling measurement:", error);
    }
  };

  // Export map as image or PDF
  const exportMap = async (format) => {
    if (!mapInstanceRef.current) return;
    
    try {
      setExporting(true);
      
      const mapElement = mapRef.current;
      if (!mapElement) {
        alert("Élément de carte introuvable.");
        setExporting(false);
        return;
      }
      
      const exportPromise = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const dataUrl = await domtoimage.toPng(mapElement, {
            width: mapElement.offsetWidth,
            height: mapElement.offsetHeight,
            style: {
              transform: 'scale(1)',
              transformOrigin: 'top left',
              width: `${mapElement.offsetWidth}px`,
              height: `${mapElement.offsetHeight}px`
            }
          });
          
          if (format === 'png') {
            const link = document.createElement('a');
            link.download = `carte-export-${new Date().toISOString().slice(0,10)}.png`;
            link.href = dataUrl;
            link.click();
          } else if (format === 'pdf') {
            const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: 'a4'
            });
            
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            
            const currentDate = new Date().toLocaleDateString();
            const coords = mapInstanceRef.current.getCenter();
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Carte exportée le ${currentDate} | Centre: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)} | Zoom: ${mapInstanceRef.current.getZoom()}`, pdfWidth/2, pdfHeight + 5, { align: 'center' });
            
            pdf.save(`carte-export-${new Date().toISOString().slice(0,10)}.pdf`);
          }
        } catch (error) {
          console.error("Error exporting map:", error);
          alert(`Erreur lors de l'exportation de la carte: ${error.message}`);
        } finally {
          setExporting(false);
        }
      };
      
      exportPromise();
    } catch (error) {
      console.error("Error initiating export:", error);
      alert(`Erreur lors de l'exportation: ${error.message}`);
      setExporting(false);
    }
  };

  return (
    <Container fluid className="map-wrapper-container">
      <Row className="row-container">
        <div className="col col-map">
          <Card className="map-card">
            <div className="map-controls-container">
 
              <button
                className="map-control-button"
                onClick={() => exportMap('png')}
                title="Exporter en PNG"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                PNG
              </button>
              
              <button
                className="map-control-button"
                onClick={() => exportMap('pdf')}
                title="Exporter en PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                PDF
              </button>
            </div>
            
            <div ref={mapRef} className="map-container"></div>
            
            {exporting && (
              <div className="export-loading-overlay">
                <div className="spinner"></div>
                <p>Exportation en cours...</p>
              </div>
            )}
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default GeoPortal;