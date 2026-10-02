import React, { useState } from 'react';
import { Users, Plus, Upload, Phone, Calendar, ShieldCheck, MessageCircle, AlertTriangle } from 'lucide-react';
import { getExpiryStatus } from '../data/initialData';

export default function DriversView({ drivers, vehicles, onAddDriver, onUpdateDriver }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    email: '',
    licenseNumber: '',
    licenseExpiry: '',
    experienceYears: 3,
    assignedVehicle: ''
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newDriver.name || !newDriver.phone) return;

    const created = {
      id: `d-${Date.now()}`,
      name: newDriver.name,
      role: 'Driver',
      phone: newDriver.phone,
      email: newDriver.email || `${newDriver.name.toLowerCase().replace(/\s+/g, '.')}@fleettrack.com`,
      avatar: photoPreview || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      licenseNumber: newDriver.licenseNumber || 'KL-07-NEW-8891',
      licenseExpiry: newDriver.licenseExpiry || '2028-12-31',
      assignedVehicle: newDriver.assignedVehicle || 'Unassigned',
      experienceYears: Number(newDriver.experienceYears) || 2,
      status: 'Available'
    };

    onAddDriver(created);
    setShowAddModal(false);
    setPhotoPreview(null);
    setNewDriver({
      name: '',
      phone: '',
      email: '',
      licenseNumber: '',
      licenseExpiry: '',
      experienceYears: 3,
      assignedVehicle: ''
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Driver Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Driver profiles, photo uploads, driving license expiry verification, and WhatsApp communication.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add New Driver
        </button>
      </div>

      {/* Driver Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '20px'
      }}>
        {drivers.map(driver => {
          const licenseCheck = driver.licenseExpiry ? getExpiryStatus(driver.licenseExpiry) : null;
          const assignedVeh = vehicles.find(v => v.assignedDriverId === driver.id);

          return (
            <div key={driver.id} className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Header with Photo & Badge */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={driver.avatar} 
                      alt={driver.name} 
                      style={{ 
                        width: '68px', 
                        height: '68px', 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        border: '3px solid var(--accent-blue)',
                        boxShadow: 'var(--shadow-md)'
                      }} 
                    />
                    <span 
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        background: driver.status === 'On Trip' ? '#10b981' : '#3b82f6',
                        border: '2px solid var(--bg-card)'
                      }}
                    />
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {driver.name}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                      {driver.experienceYears} Years Experience • ID: #{driver.id}
                    </div>
                    <span className={`badge ${driver.status === 'On Trip' ? 'badge-green' : 'badge-blue'}`}>
                      {driver.status}
                    </span>
                  </div>
                </div>

                {/* Details Box */}
                <div style={{
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '0.8rem',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Assigned Vehicle:</span>
                    <strong style={{ color: assignedVeh ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                      {assignedVeh ? assignedVeh.plate : 'None'}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                    <strong>{driver.phone}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>License No:</span>
                    <strong style={{ fontFamily: 'monospace' }}>{driver.licenseNumber}</strong>
                  </div>

                  {licenseCheck && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)' }}>License Validity:</span>
                      <span className={`badge ${licenseCheck.badgeClass}`} style={{ fontSize: '0.7rem' }}>
                        {licenseCheck.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: WhatsApp & Status */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`https://wa.me/${driver.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${driver.name}, here is your fleet operational update.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-whatsapp"
                  style={{ flex: 1, fontSize: '0.8rem' }}
                >
                  <MessageCircle size={15} /> WhatsApp Driver
                </a>

                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    const newStatus = driver.status === 'Available' ? 'On Trip' : 'Available';
                    onUpdateDriver(driver.id, { status: newStatus });
                  }}
                  style={{ fontSize: '0.75rem' }}
                >
                  Toggle Status
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add New Fleet Driver</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                {/* Photo Upload with Live Preview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '50%',
                    background: 'var(--bg-input)',
                    border: '2px dashed var(--accent-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Upload size={24} style={{ color: 'var(--accent-blue)' }} />
                    )}
                  </div>
                  <div>
                    <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Driver Photo *</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                    />
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>Upload PNG, JPG or camera capture</div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Sreejith Varma" 
                    className="form-input"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Phone (WhatsApp) *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="+91 98471 23456" 
                      className="form-input"
                      value={newDriver.phone}
                      onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Experience (Years)</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={newDriver.experienceYears}
                      onChange={(e) => setNewDriver({ ...newDriver, experienceYears: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Driving License Number</label>
                    <input 
                      type="text" 
                      placeholder="KL-07-2022-XXXXX" 
                      className="form-input"
                      value={newDriver.licenseNumber}
                      onChange={(e) => setNewDriver({ ...newDriver, licenseNumber: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">License Expiry Date</label>
                    <input 
                      type="date" 
                      className="form-input"
                      value={newDriver.licenseExpiry}
                      onChange={(e) => setNewDriver({ ...newDriver, licenseExpiry: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Driver Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
