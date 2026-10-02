import React, { useState } from 'react';
import { Wrench, Plus, Calendar, DollarSign, CheckCircle2, Clock } from 'lucide-react';

export default function MaintenanceView({ maintenance, vehicles, onAddMaintenance, onUpdateMaintenance }) {
  const [showAddModal, setShowAddModal] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    serviceType: '',
    garage: '',
    serviceDate: new Date().toISOString().split('T')[0],
    odometer: '',
    cost: '',
    status: 'In Progress',
    nextDueOdo: '',
    nextDueDate: '',
    notes: ''
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!serviceForm.vehicleId || !serviceForm.serviceType) return;

    const vehicle = vehicles.find(v => v.id === serviceForm.vehicleId);

    const created = {
      id: `m-${Date.now()}`,
      vehicleId: serviceForm.vehicleId,
      vehiclePlate: vehicle ? vehicle.plate : 'KL-VEHICLE',
      serviceType: serviceForm.serviceType,
      garage: serviceForm.garage || 'Authorized Service Workshop',
      serviceDate: serviceForm.serviceDate,
      odometer: Number(serviceForm.odometer) || vehicle?.currentOdo || 0,
      cost: Number(serviceForm.cost) || 0,
      status: serviceForm.status,
      nextDueOdo: Number(serviceForm.nextDueOdo) || ((vehicle?.currentOdo || 0) + 10000),
      nextDueDate: serviceForm.nextDueDate || '2027-01-01',
      notes: serviceForm.notes || 'Service performed.'
    };

    onAddMaintenance(created);
    setShowAddModal(false);
    setServiceForm({
      vehicleId: vehicles[0]?.id || '',
      serviceType: '',
      garage: '',
      serviceDate: new Date().toISOString().split('T')[0],
      odometer: '',
      cost: '',
      status: 'In Progress',
      nextDueOdo: '',
      nextDueDate: '',
      notes: ''
    });
  };

  const totalMaintenanceCost = maintenance.reduce((acc, curr) => acc + (curr.cost || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Fleet Maintenance & Service Tracking
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Periodic servicing, repairs, garage logs, workshop bills, and upcoming service odometer thresholds.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Book Service / Repair
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Service Expenditure</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '4px' }}>
            ₹{totalMaintenanceCost.toLocaleString()}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Jobs in Garage</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '4px' }}>
            {maintenance.filter(m => m.status === 'In Progress').length} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Vehicles</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Completed Services</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
            {maintenance.filter(m => m.status === 'Completed').length} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Records</span>
          </div>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Vehicle Plate</th>
              <th>Service / Repair Work</th>
              <th>Garage / Workshop</th>
              <th>Date</th>
              <th>Odometer</th>
              <th>Cost (₹)</th>
              <th>Next Due</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {maintenance.map(item => (
              <tr key={item.id}>
                <td>
                  <strong style={{ color: 'var(--accent-blue)', fontSize: '0.9rem' }}>{item.vehiclePlate}</strong>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{item.serviceType}</div>
                  {item.notes && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.notes}</div>}
                </td>
                <td>{item.garage}</td>
                <td>{item.serviceDate}</td>
                <td>{item.odometer.toLocaleString()} KM</td>
                <td><strong style={{ color: 'var(--accent-amber)' }}>₹{item.cost.toLocaleString()}</strong></td>
                <td>
                  <div style={{ fontSize: '0.78rem' }}>{item.nextDueOdo ? `${item.nextDueOdo.toLocaleString()} KM` : item.nextDueDate}</div>
                </td>
                <td>
                  <span className={`badge ${item.status === 'Completed' ? 'badge-green' : 'badge-yellow'}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  {item.status !== 'Completed' && (
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                      onClick={() => onUpdateMaintenance(item.id, { status: 'Completed' })}
                    >
                      Mark Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Maintenance Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Log Workshop Service or Repair</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Vehicle *</label>
                  <select 
                    className="form-select"
                    required
                    value={serviceForm.vehicleId}
                    onChange={(e) => setServiceForm({ ...serviceForm, vehicleId: e.target.value })}
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.plate} - {v.model}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Service / Repair Description *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Engine Oil + Filter Change, Clutch Overhaul" 
                    className="form-input"
                    value={serviceForm.serviceType}
                    onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Garage / Workshop Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Tata Motors Kalamassery" 
                      className="form-input"
                      value={serviceForm.garage}
                      onChange={(e) => setServiceForm({ ...serviceForm, garage: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service Cost (₹)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 8500" 
                      className="form-input"
                      value={serviceForm.cost}
                      onChange={(e) => setServiceForm({ ...serviceForm, cost: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Current Odometer (KM)</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={serviceForm.odometer}
                      onChange={(e) => setServiceForm({ ...serviceForm, odometer: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-select"
                      value={serviceForm.status}
                      onChange={(e) => setServiceForm({ ...serviceForm, status: e.target.value })}
                    >
                      <option value="In Progress">In Progress (At Workshop)</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Next Service Due Odometer (KM)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 95000" 
                    className="form-input"
                    value={serviceForm.nextDueOdo}
                    onChange={(e) => setServiceForm({ ...serviceForm, nextDueOdo: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Service Log</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
