import React, { useState } from 'react';
import { Truck, Plus, Search, Filter, UserCheck, MapPin, Gauge, Fuel, Edit3 } from 'lucide-react';

export default function VehiclesView({ vehicles, drivers, onAddVehicle, onUpdateVehicle }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    plate: '',
    model: '',
    type: 'Heavy Truck',
    fuelType: 'Diesel',
    assignedDriverId: '',
    currentOdo: 0,
    fuelCapacity: 200,
    mileageTarget: 5.0,
    locationName: 'Kochi Central Hub'
  });

  const filtered = vehicles.filter(v => {
    const matchesSearch = v.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newVehicle.plate) return;

    const created = {
      id: `v-${Date.now()}`,
      plate: newVehicle.plate.toUpperCase(),
      model: newVehicle.model || 'Standard Commercial Carrier',
      type: newVehicle.type,
      fuelType: newVehicle.fuelType,
      assignedDriverId: newVehicle.assignedDriverId || null,
      currentOdo: Number(newVehicle.currentOdo) || 0,
      status: 'Available',
      lastLocation: {
        lat: 9.9816 + (Math.random() - 0.5) * 0.2,
        lng: 76.2999 + (Math.random() - 0.5) * 0.2,
        name: newVehicle.locationName,
        speed: 0,
        updatedAt: 'Just now'
      },
      fuelLevel: 100,
      fuelCapacity: Number(newVehicle.fuelCapacity) || 150,
      mileageTarget: Number(newVehicle.mileageTarget) || 6.5
    };

    onAddVehicle(created);
    setShowAddModal(false);
    setNewVehicle({
      plate: '',
      model: '',
      type: 'Heavy Truck',
      fuelType: 'Diesel',
      assignedDriverId: '',
      currentOdo: 0,
      fuelCapacity: 200,
      mileageTarget: 5.0,
      locationName: 'Kochi Central Hub'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Fleet Vehicles</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Manage commercial vehicles, assign drivers, monitor odometer and status.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Register New Vehicle
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by plate number (e.g. KL-07), model..."
            className="form-input"
            style={{ paddingLeft: '38px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['ALL', 'On Trip', 'Available', 'In Maintenance', 'Idle'].map(status => (
            <button
              key={status}
              className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '16px'
      }}>
        {filtered.map(vehicle => {
          const driver = drivers.find(d => d.id === vehicle.assignedDriverId);
          return (
            <div key={vehicle.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <span className="badge badge-purple" style={{ marginBottom: '4px', fontSize: '0.7rem' }}>{vehicle.type}</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{vehicle.plate}</h3>
                  </div>
                  <span className={`badge ${
                    vehicle.status === 'On Trip' ? 'badge-green' :
                    vehicle.status === 'Available' ? 'badge-blue' :
                    vehicle.status === 'In Maintenance' ? 'badge-yellow' : 'badge-red'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  {vehicle.model}
                </div>

                {/* Info row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  background: 'var(--bg-input)',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.75rem',
                  marginBottom: '14px'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Odometer:</span>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{vehicle.currentOdo.toLocaleString()} KM</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Fuel / Power:</span>
                    <div style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{vehicle.fuelLevel}% ({vehicle.fuelType})</div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                    <div style={{ fontWeight: 600, color: 'var(--accent-blue)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      📍 {vehicle.lastLocation?.name || 'Depot'}
                    </div>
                  </div>
                </div>

                {/* Driver Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', padding: '6px 8px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                  {driver ? (
                    <>
                      <img src={driver.avatar} alt={driver.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{driver.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Assigned Driver • {driver.phone}</div>
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No driver assigned
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <select 
                  className="form-select" 
                  style={{ fontSize: '0.75rem', padding: '6px 8px' }}
                  value={vehicle.status}
                  onChange={(e) => onUpdateVehicle(vehicle.id, { status: e.target.value })}
                >
                  <option value="Available">Set: Available</option>
                  <option value="On Trip">Set: On Trip</option>
                  <option value="In Maintenance">Set: Maintenance</option>
                  <option value="Idle">Set: Idle</option>
                </select>

                <select 
                  className="form-select" 
                  style={{ fontSize: '0.75rem', padding: '6px 8px' }}
                  value={vehicle.assignedDriverId || ''}
                  onChange={(e) => onUpdateVehicle(vehicle.id, { assignedDriverId: e.target.value || null })}
                >
                  <option value="">Unassign Driver</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Register New Fleet Vehicle</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Registration Plate Number *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. KL-07-DE-9922" 
                    className="form-input"
                    value={newVehicle.plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Make & Model</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Tata Prima 4028.S / BharatBenz 1923C" 
                    className="form-input"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Vehicle Type</label>
                    <select 
                      className="form-select"
                      value={newVehicle.type}
                      onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                    >
                      <option value="Heavy Truck">Heavy Truck</option>
                      <option value="Pickup Van">Pickup Van</option>
                      <option value="Reefer Truck">Reefer Truck</option>
                      <option value="Cargo Truck">Cargo Truck</option>
                      <option value="Electric Mini Van">Electric Mini Van</option>
                      <option value="Passenger Van">Passenger Van</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fuel / Energy Type</label>
                    <select 
                      className="form-select"
                      value={newVehicle.fuelType}
                      onChange={(e) => setNewVehicle({ ...newVehicle, fuelType: e.target.value })}
                    >
                      <option value="Diesel">Diesel</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Electric">Electric</option>
                      <option value="CNG">CNG</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Initial Odometer (KM)</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={newVehicle.currentOdo}
                      onChange={(e) => setNewVehicle({ ...newVehicle, currentOdo: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assign Driver</label>
                    <select 
                      className="form-select"
                      value={newVehicle.assignedDriverId}
                      onChange={(e) => setNewVehicle({ ...newVehicle, assignedDriverId: e.target.value })}
                    >
                      <option value="">Unassigned</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
