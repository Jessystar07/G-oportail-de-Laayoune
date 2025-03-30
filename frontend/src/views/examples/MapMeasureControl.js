import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet-measure';
import  "views/examples/measure.css";


// Extend Leaflet Measure Control with enhanced functionality
const EnhancedMeasureControl = {
  create: (map, options) => {
    const measureControl = L.Control.Measure.extend({
      initialize: function(options) {
        L.Control.Measure.prototype.initialize.call(this, {
          ...options,
          precision: {
            distanceUnit: 0.001, // Precise to millimeter
            areaUnit: 0.0001     // Precise to square centimeter
          }
        });
        
        // Custom measurement modes
        this._measureModes = [
          { type: 'distance', label: 'Distance', icon: 'measure-line' },
          { type: 'area', label: 'Area', icon: 'measure-polygon' }
        ];
        
        // Available units
        this._units = {
          distance: [
            { id: 'kilometers', name: 'Kilometers', factor: 0.001 },
            { id: 'meters', name: 'Meters', factor: 1 },
            { id: 'miles', name: 'Miles', factor: 0.000621371 },
            { id: 'yards', name: 'Yards', factor: 1.09361 }
          ],
          area: [
            { id: 'hectares', name: 'Hectares', factor: 0.0001 },
            { id: 'squareKilometers', name: 'Square Kilometers', factor: 0.000001 },
            { id: 'squareMeters', name: 'Square Meters', factor: 1 },
            { id: 'acres', name: 'Acres', factor: 0.000247105 }
          ]
        };
      },

      // Enhanced drawing methods to prevent cursor drift
      _createDrawingLayer: function() {
        this._drawLayer = L.featureGroup().addTo(this._map);
        this._drawLayer.on('click', this._preventUnintendedPoints.bind(this));
      },

      _preventUnintendedPoints: function(e) {
        // Implement strict point placement prevention
        if (this._drawing) {
          const tolerance = 5; // pixels tolerance
          const mapPoint = this._map.latLngToContainerPoint(e.latlng);
          const existingPoints = this._drawLayer.getLayers();
          
          if (existingPoints.length > 0) {
            const lastPoint = this._map.latLngToContainerPoint(
              existingPoints[existingPoints.length - 1].getLatLng()
            );
            
            if (mapPoint.distanceTo(lastPoint) < tolerance) {
              return false; // Prevent adding very close points
            }
          }
        }
      },

      // Custom UI for mode and unit selection
      _createUI: function() {
        const container = L.DomUtil.create('div', 'leaflet-measure-control');
        
        // Mode buttons
        const modeContainer = L.DomUtil.create('div', 'measure-mode-selector', container);
        this._measureModes.forEach(mode => {
          const modeBtn = L.DomUtil.create('button', `measure-mode-${mode.type}`, modeContainer);
          modeBtn.innerHTML = `<i class="icon-${mode.icon}"></i> ${mode.label}`;
          modeBtn.onclick = () => this._switchMeasureMode(mode.type);
        });

        // Unit selector
        const unitContainer = L.DomUtil.create('div', 'measure-unit-selector', container);
        this._updateUnitSelector(this._currentMode || 'distance');

        // Stop button
        const stopBtn = L.DomUtil.create('button', 'measure-stop-btn', container);
        stopBtn.innerHTML = 'Stop Measuring';
        stopBtn.onclick = () => this._stopMeasuring();

        return container;
      },

      _switchMeasureMode: function(mode) {
        this._currentMode = mode;
        this._updateUnitSelector(mode);
        this._stopMeasuring();
      },

      _updateUnitSelector: function(mode) {
        const unitContainer = this._container.querySelector('.measure-unit-selector');
        unitContainer.innerHTML = ''; // Clear existing units

        this._units[mode].forEach(unit => {
          const unitBtn = L.DomUtil.create('button', `measure-unit-${unit.id}`, unitContainer);
          unitBtn.textContent = unit.name;
          unitBtn.onclick = () => this._selectUnit(unit);
        });
      },

      _selectUnit: function(unit) {
        this._currentUnit = unit;
        // Update display of selected unit
      },

      // Override existing measuring methods to add precision and visual feedback
      _startMeasuring: function() {
        this._drawing = true;
        this._map.fire('measurestart');
        
        // Enhanced visual feedback
        this._map.getContainer().style.cursor = 'crosshair';
        
        // Create a clear, high-contrast drawing layer
        this._createDrawingLayer();
      },

      _stopMeasuring: function() {
        this._drawing = false;
        this._map.fire('measureend');
        
        // Reset cursor and clear drawing layers
        this._map.getContainer().style.cursor = '';
        if (this._drawLayer) {
          this._map.removeLayer(this._drawLayer);
        }
      }
    });

    return new measureControl(options);
  }
};

// React Component to Integrate Enhanced Measure Control
const MapMeasureControl = ({ map }) => {
  const [isMeasuring, setIsMeasuring] = useState(false);
  const measureControlRef = useRef(null);

  useEffect(() => {
    if (map) {
      // Initialize the enhanced measure control
      measureControlRef.current = EnhancedMeasureControl.create(map, {
        position: 'topright',
        primaryLengthUnit: 'kilometers',
        primaryAreaUnit: 'hectares',
        activeColor: '#5e72e4',
        completedColor: '#2dce89'
      });
    }

    return () => {
      // Cleanup
      if (measureControlRef.current) {
        map.removeControl(measureControlRef.current);
      }
    };
  }, [map]);

  const toggleMeasureMode = () => {
    setIsMeasuring(!isMeasuring);
    
    if (measureControlRef.current) {
      if (!isMeasuring) {
        measureControlRef.current._startMeasuring();
      } else {
        measureControlRef.current._stopMeasuring();
      }
    }
  };

  return null; // This component doesn't render anything directly
};

export default MapMeasureControl;