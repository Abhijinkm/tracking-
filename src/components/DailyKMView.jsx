import React, { useState } from 'react';
import { Gauge, Plus, CheckCircle, Clock, MapPin, Check, Filter } from 'lucide-react';

export default function DailyKMView({ dailyLogs, vehicles, drivers, currentUser, onAddLog, onVerifyLog }) {
  const [showPunchModal, setShowPunchModal] = useState(false);

  const [punchForm, setPunchForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    driverId: currentUser.role === 'Driver' ? currentUser.id : drivers[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    startKM: '',
    endKM: '',
    startLocation: '',
    endLocation: '',
    notes: ''
  });

  const totalTripKM = (Number(punchForm.endKM) || 0) - (Number(punchForm.startKM) || 0);

  const handlePunchSubmit = (e) => {
    e.preventDefault();
    if (!punchForm.vehicleId || !punchForm.startKM || !punchForm.endKM) return;

    const startKM = Number(punchForm.startKM);
    const endKM = Number(punchForm.endKM);

    if (endKM < startKM) {
      alert('End Odometer cannot be less than Start Odometer!');
      return;
    }

    const created = {
      id: `log-${Date.now()}`,
      date: punchForm.date,
      vehicleId: punchForm.vehicleId,
      driverId: punchForm.driverId,
      startKM,
      endKM,
      totalKM: endKM - startKM,
      startLocation: punchForm.startLocation || 'Kochi Yard',
      endLocation: punchForm.endLocation || 'Customer Depot',
      status: 'Completed',
      verified: currentUser.role !== 'Driver', // Auto verify if admin/manager logged it
      notes: punchForm.notes || 'Trip completed.'
    };

    onAddLog(created);
    setShowPunchModal(false);
    setPunchForm({
      vehicleId: vehicles[0]?.id || '',
      driverId: currentUser.role === 'Driver' ? currentUser.id : drivers[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      startKM: '',
      endKM: '',
      startLocation: '',
      endLocation: '',
      notes: ''
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Daily KM & Odometer Logs</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Daily odometer punch-in/out, distance calculation, and trip dispatch verification.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowPunchModal(true)}>
          <Plus size={16} /> Punch Daily Trip Odometer
        </button>
      </div>

      {/* Daily Logs Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vehicle Plate</th>
              <th>Driver</th>
              <th>Start KM</th>
              <th>End KM</th>
              <th>Total Distance</th>
              <th>Route Dispatched</th>
              <th>Status / Audit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dailyLogs.map(log => {
              const vehicle = vehicles.find(v => v.id === log.vehicleId);
              const driver = drivers.find(d => d.id === log.driverId);

              return (
                <tr key={log.id}>
                  <td><strong>{log.date}</strong></td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>
                      {vehicle?.plate || log.vehicleId}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{vehicle?.model}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {driver?.avatar && (
                        <img src={driver.avatar} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                      )}
                      <span>{driver?.name || 'Driver'}</span>
                    </div>
                  </td>
                  <td>{log.startKM.toLocaleString()} KM</td>
                  <td>{log.endKM.toLocaleString()} KM</td>
                  <td>
                    <span className="badge badge-green" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                      +{log.totalKM} KM
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>{log.startLocation} → {log.endLocation}</div>
                    {log.notes && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.notes}</div>}
                  </td>
                  <td>
                    {log.verified ? (
                      <span className="badge badge-blue">
                        <Check size={12} /> Verified
                      </span>
                    ) : (
                      <span className="badge badge-yellow">
                        <Clock size={12} /> Pending Audit
                      </span>
                    )}
                  </td>
                  <td>
                    {!log.verified && (currentUser.role === 'Admin' || currentUser.role === 'Manager') && (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        onClick={() => onVerifyLog(log.id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Punch In Modal */}
      {showPunchModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Daily Trip KM Punch-In</h3>
              <button onClick={() => setShowPunchModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handlePunchSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Vehicle *</label>
                    <select 
                      className="form-select"
                      required
                      value={punchForm.vehicleId}
                      onChange={(e) => {
                        const veh = vehicles.find(v => v.id === e.target.value);
                        setPunchForm({ 
                          ...punchForm, 
                          vehicleId: e.target.value,
                          startKM: veh ? veh.currentOdo : punchForm.startKM
                        });
                      }}
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.plate} ({v.model})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Driver *</label>
                    <select 
                      className="form-select"
                      required
                      value={punchForm.driverId}
                      onChange={(e) => setPunchForm({ ...punchForm, driverId: e.target.value })}
                    >
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Start Odometer (KM) *</label>
                    <input 
                      type="number" 
                      required 
                      className="form-input"
                      value={punchForm.startKM}
                      onChange={(e) => setPunchForm({ ...punchForm, startKM: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Odometer (KM) *</label>
                    <input 
                      type="number" 
                      required 
                      className="form-input"
                      value={punchForm.endKM}
                      onChange={(e) => setPunchForm({ ...punchForm, endKM: e.target.value })}
                    />
                  </div>
                </div>

                {/* Auto Calculated Total KM Display */}
                {totalTripKM >= 0 && punchForm.startKM && punchForm.endKM && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    color: '#10b981',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>Calculated Total Distance:</span>
                    <span>+{totalTripKM} KM</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Start Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cochin Port" 
                      className="form-input"
                      value={punchForm.startLocation}
                      onChange={(e) => setPunchForm({ ...punchForm, startLocation: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Destination</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Calicut Depot" 
                      className="form-input"
                      value={punchForm.endLocation}
                      onChange={(e) => setPunchForm({ ...punchForm, endLocation: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Trip Notes / Deliveries</label>
                  <textarea 
                    rows={2} 
                    className="form-textarea"
                    placeholder="Enter dispatch notes, cargo details or client name..."
                    value={punchForm.notes}
                    onChange={(e) => setPunchForm({ ...punchForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPunchModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Trip Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
