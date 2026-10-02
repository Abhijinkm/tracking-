import React, { useState } from 'react';
import { Fuel, Plus, Upload, Eye, DollarSign, TrendingDown, MapPin } from 'lucide-react';

export default function FuelView({ fuelLogs, vehicles, drivers, onAddFuelLog }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewReceipt, setPreviewReceipt] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);

  const [fuelForm, setFuelForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    driverId: drivers[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    odometer: '',
    liters: '',
    rate: '96.50',
    station: 'Indian Oil Dealer'
  });

  const totalCost = (Number(fuelForm.liters) || 0) * (Number(fuelForm.rate) || 0);

  const handleReceiptUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!fuelForm.vehicleId || !fuelForm.liters) return;

    const liters = Number(fuelForm.liters);
    const rate = Number(fuelForm.rate);
    const odo = Number(fuelForm.odometer) || 0;

    // Estimate mileage
    const vehicle = vehicles.find(v => v.id === fuelForm.vehicleId);
    const calculatedMileage = vehicle?.mileageTarget ? (vehicle.mileageTarget * (0.95 + Math.random() * 0.1)).toFixed(1) : 4.5;

    const created = {
      id: `fuel-${Date.now()}`,
      date: fuelForm.date,
      vehicleId: fuelForm.vehicleId,
      driverId: fuelForm.driverId,
      odometer: odo,
      liters,
      rate,
      totalCost: liters * rate,
      station: fuelForm.station,
      receiptUrl: receiptImage || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&auto=format&fit=crop&q=80',
      calculatedMileage: Number(calculatedMileage)
    };

    onAddFuelLog(created);
    setShowAddModal(false);
    setReceiptImage(null);
    setFuelForm({
      vehicleId: vehicles[0]?.id || '',
      driverId: drivers[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      odometer: '',
      liters: '',
      rate: '96.50',
      station: 'Indian Oil Dealer'
    });
  };

  const totalLiters = fuelLogs.reduce((acc, curr) => acc + (curr.liters || 0), 0);
  const totalSpend = fuelLogs.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Fuel & Refueling Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Track fuel expenses, rate per liter, KM/L efficiency, and digitized bill receipts.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Log Fuel Purchase
        </button>
      </div>

      {/* Fuel Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Fuel Consumed</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '4px' }}>
            {totalLiters.toFixed(1)} <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Liters</span>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Expense</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '4px' }}>
            ₹{totalSpend.toLocaleString()}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Average Fuel Rate</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
            ₹96.50 <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/ Liter</span>
          </div>
        </div>
      </div>

      {/* Fuel Logs Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vehicle Plate</th>
              <th>Driver</th>
              <th>Odometer</th>
              <th>Volume (L)</th>
              <th>Rate / L</th>
              <th>Total Cost</th>
              <th>Efficiency (KM/L)</th>
              <th>Fuel Station</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {fuelLogs.map(log => {
              const vehicle = vehicles.find(v => v.id === log.vehicleId);
              const driver = drivers.find(d => d.id === log.driverId);

              return (
                <tr key={log.id}>
                  <td><strong>{log.date}</strong></td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{vehicle?.plate || log.vehicleId}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{vehicle?.fuelType}</div>
                  </td>
                  <td>{driver?.name || 'Driver'}</td>
                  <td>{log.odometer ? `${log.odometer.toLocaleString()} KM` : '—'}</td>
                  <td><strong style={{ color: 'var(--text-primary)' }}>{log.liters} L</strong></td>
                  <td>₹{log.rate}</td>
                  <td><strong style={{ color: 'var(--accent-amber)' }}>₹{log.totalCost.toLocaleString()}</strong></td>
                  <td>
                    <span className="badge badge-green">
                      {log.calculatedMileage} KM/L
                    </span>
                  </td>
                  <td><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.station}</span></td>
                  <td>
                    {log.receiptUrl ? (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                        onClick={() => setPreviewReceipt(log.receiptUrl)}
                      >
                        <Eye size={12} /> View Bill
                      </button>
                    ) : 'No bill'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Fuel Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Log Fuel Refill</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Vehicle *</label>
                    <select 
                      className="form-select"
                      required
                      value={fuelForm.vehicleId}
                      onChange={(e) => {
                        const veh = vehicles.find(v => v.id === e.target.value);
                        setFuelForm({ 
                          ...fuelForm, 
                          vehicleId: e.target.value,
                          odometer: veh ? veh.currentOdo : fuelForm.odometer
                        });
                      }}
                    >
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.plate} ({v.model})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Driver</label>
                    <select 
                      className="form-select"
                      value={fuelForm.driverId}
                      onChange={(e) => setFuelForm({ ...fuelForm, driverId: e.target.value })}
                    >
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Fuel Volume (Liters) *</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      required 
                      placeholder="e.g. 50.0" 
                      className="form-input"
                      value={fuelForm.liters}
                      onChange={(e) => setFuelForm({ ...fuelForm, liters: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rate / Liter (₹) *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      required 
                      className="form-input"
                      value={fuelForm.rate}
                      onChange={(e) => setFuelForm({ ...fuelForm, rate: e.target.value })}
                    />
                  </div>
                </div>

                {/* Real-time calculated total cost */}
                {totalCost > 0 && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    color: '#f59e0b',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>Total Calculated Fuel Bill:</span>
                    <span>₹{totalCost.toFixed(2)}</span>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Odometer at Refuel (KM)</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={fuelForm.odometer}
                      onChange={(e) => setFuelForm({ ...fuelForm, odometer: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fuel Station Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bharat Petroleum, Ernakulam" 
                      className="form-input"
                      value={fuelForm.station}
                      onChange={(e) => setFuelForm({ ...fuelForm, station: e.target.value })}
                    />
                  </div>
                </div>

                {/* Receipt Upload */}
                <div className="form-group">
                  <label className="form-label">Upload Receipt Bill Photo</label>
                  <input type="file" accept="image/*" onChange={handleReceiptUpload} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }} />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Fuel Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bill Preview Modal */}
      {previewReceipt && (
        <div className="modal-overlay" onClick={() => setPreviewReceipt(null)}>
          <div className="modal-card" style={{ maxWidth: '420px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Fuel Bill Receipt</h3>
              <button onClick={() => setPreviewReceipt(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ padding: '20px' }}>
              <img src={previewReceipt} alt="Receipt" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
