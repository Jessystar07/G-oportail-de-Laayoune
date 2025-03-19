import React, { useState } from 'react';

const GeometryInput = ({ value, onChange }) => {
  const [points, setPoints] = useState(() => {
    // Parse initial value if it exists
    if (value && value.startsWith('LINESTRING')) {
      try {
        // Extract points from WKT format: LINESTRING(lon1 lat1, lon2 lat2, ...)
        const coordsStr = value.replace('LINESTRING(', '').replace(')', '');
        return coordsStr.split(',').map(point => {
          const [lon, lat] = point.trim().split(' ');
          return { lon: lon || '', lat: lat || '' };
        });
      } catch (e) {
        console.error("Error parsing geometry:", e);
        return [{ lon: '', lat: '' }, { lon: '', lat: '' }];
      }
    }
    // Default: start with two empty points (minimum for a line)
    return [{ lon: '', lat: '' }, { lon: '', lat: '' }];
  });

  const handlePointChange = (index, field, value) => {
    const newPoints = [...points];
    newPoints[index] = { ...newPoints[index], [field]: value };
    setPoints(newPoints);
    
    // Generate WKT format and trigger onChange
    const wkt = generateWKT(newPoints);
    onChange({ target: { name: 'geom', value: wkt } });
  };

  const addPoint = () => {
    setPoints([...points, { lon: '', lat: '' }]);
  };

  const removePoint = (index) => {
    if (points.length > 2) {
      const newPoints = [...points];
      newPoints.splice(index, 1);
      setPoints(newPoints);
      
      // Update parent after removing
      const wkt = generateWKT(newPoints);
      onChange({ target: { name: 'geom', value: wkt } });
    }
  };

  const generateWKT = (pointsArray) => {
    // Filter out incomplete points
    const validPoints = pointsArray.filter(p => p.lon && p.lat);
    
    if (validPoints.length < 2) return '';
    
    // Create WKT format: LINESTRING(lon1 lat1, lon2 lat2, ...)
    const coordsStr = validPoints
      .map(p => `${p.lon} ${p.lat}`)
      .join(', ');
    
    return `LINESTRING(${coordsStr})`;
  };

  return (
    <div className="geometry-input">
      <p>Définir la géométrie (au moins 2 points):</p>
      {points.map((point, index) => (
        <div key={index} className="point-inputs" style={{ display: 'flex', marginBottom: '5px' }}>
          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={point.lon}
            onChange={(e) => handlePointChange(index, 'lon', e.target.value)}
            style={{ width: '45%', marginRight: '5px' }}
          />
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={point.lat}
            onChange={(e) => handlePointChange(index, 'lat', e.target.value)}
            style={{ width: '45%', marginRight: '5px' }}
          />
          {points.length > 2 && (
            <button 
              type="button" 
              onClick={() => removePoint(index)}
              style={{ width: '10%', padding: '2px', background: '#ff6b6b' }}
              title="Supprimer ce point"
            >
              ×
            </button>
          )}
        </div>
      ))}
      <button 
        type="button" 
        onClick={addPoint}
        style={{ marginTop: '5px', padding: '3px 10px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px' }}
      >
        + Ajouter un point
      </button>
      <input 
        type="hidden" 
        name="geom" 
        value={generateWKT(points)} 
      />
    </div>
  );
};

export default GeometryInput;