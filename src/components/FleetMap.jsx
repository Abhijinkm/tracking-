import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom vehicle markers by status
const getStatusColor = (status) => {
  switch (status) {
    case 'On Trip': return '#10b981'; // Green
    case 'Available': return '#3b82f6'; // Blue
    case 'In Maintenance': return '#f59e0b'; // Amber
    default: return '#64748b'; // Gray/Idle
  }
};

const createVehicleIcon = (status, plate) => {
  const color = getStatusColor(status);
  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="
        background: ${color};
        color: #fff;
        padding: 4px 8px;
        border-radius: 20px;
        font-weight: 700;
        font-size: 11px;
        white-space: nowrap;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        gap: 5px;
        border: 2px solid #ffffff;
      ">
        <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#ffffff;animation: pulseGlow 1.5s infinite;"></span>
        ${plate.slice(-4)}
      </div>
    `,
    iconSize: [60, 26],
    iconAnchor: [30, 13]
  });
};

export default function FleetMap({ vehicles, selectedVehicle, onSelectVehicle, height = '450px' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center: Central Kerala / Kochi area
      const map = L.map(mapContainerRef.current, {
        center: [9.9816, 76.2999],
        zoom: 8,
        zoomControl: true
      });

      // Dark / Modern CartoDB map tiles for sleek high-tech aesthetics
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds();

    vehicles.forEach(vehicle => {
      if (!vehicle.lastLocation?.lat || !vehicle.lastLocation?.lng) return;

      const marker = L.marker([vehicle.lastLocation.lat, vehicle.lastLocation.lng], {
        icon: createVehicleIcon(vehicle.status, vehicle.plate)
      }).addTo(map);

      const popupContent = `
        <div style="font-family: inherit; min-width: 200px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <strong style="color: #38bdf8; font-size: 13px;">${vehicle.plate}</strong>
            <span style="font-size: 10px; padding: 2px 6px; border-radius: 10px; background: rgba(255,255,255,0.1); font-weight: 600;">${vehicle.status}</span>
          </div>
          <div style="font-size: 12px; color: #cbd5e1; margin-bottom: 4px;"><strong>${vehicle.model}</strong></div>
          <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">📍 ${vehicle.lastLocation.name}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; background: rgba(255,255,255,0.05); padding: 6px; border-radius: 6px;">
            <div>Speed: <strong style="color:#10b981;">${vehicle.lastLocation.speed} km/h</strong></div>
            <div>Fuel: <strong>${vehicle.fuelLevel}%</strong></div>
            <div>Odo: <strong>${vehicle.currentOdo.toLocaleString()} km</strong></div>
            <div>Type: <strong>${vehicle.fuelType}</strong></div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        if (onSelectVehicle) onSelectVehicle(vehicle);
      });

      markersRef.current[vehicle.id] = marker;
      bounds.extend([vehicle.lastLocation.lat, vehicle.lastLocation.lng]);
    });

    if (vehicles.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }

  }, [vehicles]);

  // Pan to selected vehicle if changed
  useEffect(() => {
    if (selectedVehicle && mapInstanceRef.current && selectedVehicle.lastLocation) {
      mapInstanceRef.current.flyTo(
        [selectedVehicle.lastLocation.lat, selectedVehicle.lastLocation.lng],
        13,
        { duration: 1.2 }
      );
      if (markersRef.current[selectedVehicle.id]) {
        markersRef.current[selectedVehicle.id].openPopup();
      }
    }
  }, [selectedVehicle]);

  return (
    <div style={{ position: 'relative', width: '100%', height, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      {/* Map Legend Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        zIndex: 500,
        background: 'rgba(17, 24, 39, 0.85)',
        backdropFilter: 'blur(8px)',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '11px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        border: '1px solid var(--border-color)',
        color: '#f8fafc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span> On Trip
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }}></span> Available
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}></span> Service
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#64748b' }}></span> Idle
        </div>
      </div>
    </div>
  );
}
