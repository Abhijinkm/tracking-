import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Fuel, 
  FileWarning, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  Plus,
  Send,
  Navigation,
  CheckCircle,
  Clock
} from 'lucide-react';
import FleetMap from './FleetMap';

export default function DashboardView({ 
  vehicles, 
  dailyLogs, 
  fuelLogs, 
  documents, 
  maintenance,
  notifications,
  onNavigate,
  onOpenWhatsAppModal 
}) {
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0] || null);

  // Calculations
  const totalVehicles = vehicles.length;
  const activeOnRoad = vehicles.filter(v => v.status === 'On Trip').length;
  const inMaintenance = vehicles.filter(v => v.status === 'In Maintenance').length;
  const available = vehicles.filter(v => v.status === 'Available').length;

  const totalFuelCost = fuelLogs.reduce((acc, curr) => acc + (curr.totalCost || 0), 0);
  const totalKM = dailyLogs.reduce((acc, curr) => acc + (curr.totalKM || 0), 0);

  const avgMileage = (
    fuelLogs.reduce((acc, curr) => acc + (curr.calculatedMileage || 0), 0) / (fuelLogs.length || 1)
  ).toFixed(1);

  const urgentDocsCount = notifications.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Welcome */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Fleet Telematics & Command Center
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Live GPS telemetry, daily odometer entries, fuel expense tracking, and document expiry alerts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => onNavigate('daily-km')}
          >
            <Clock size={16} /> Daily KM Punch
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => onNavigate('fuel')}
          >
            <Fuel size={16} /> Log Fuel
          </button>
          <button 
            className="btn btn-whatsapp" 
            onClick={onOpenWhatsAppModal}
          >
            <Send size={16} /> Auto WhatsApp Alert
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px'
      }}>
        {/* Total Fleet Card */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>TOTAL FLEET</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)' }}>
              <Truck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {totalVehicles} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Vehicles</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
            <span style={{ color: '#10b981' }}>{activeOnRoad} Active</span> •
            <span style={{ color: '#3b82f6' }}>{available} Ready</span> •
            <span style={{ color: '#f59e0b' }}>{inMaintenance} In Shop</span>
          </div>
        </div>

        {/* Total KM Travelled */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>LOGGED DISTANCE</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-emerald)' }}>
              <Navigation size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {totalKM.toLocaleString()} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>KM</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Across {dailyLogs.length} verified trip dispatches
          </div>
        </div>

        {/* Fuel Expense */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>FUEL SPENT</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', color: 'var(--accent-amber)' }}>
              <Fuel size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            ₹{totalFuelCost.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Avg. Fleet Mileage: <strong style={{ color: 'var(--accent-emerald)' }}>{avgMileage} KM/L</strong>
          </div>
        </div>

        {/* Expiry / Compliance Alerts */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '20px', 
            cursor: 'pointer',
            border: urgentDocsCount > 0 ? '1px solid rgba(244,63,94,0.4)' : '1px solid var(--border-color)',
            background: urgentDocsCount > 0 ? 'rgba(244,63,94,0.04)' : 'var(--bg-card)'
          }}
          onClick={() => onNavigate('documents')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>DOCUMENT ALERTS</span>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-rose)' }}>
              <FileWarning size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: urgentDocsCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)', marginBottom: '4px' }}>
            {urgentDocsCount} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Action Required</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {urgentDocsCount > 0 ? 'Expiring soon or expired documents' : 'All vehicle permits are valid'}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Fleet Status Side Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Map Section */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Live GPS Fleet Tracking</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time location, speed telemetry & status</p>
            </div>
            {selectedVehicle && (
              <span className="badge badge-blue">
                Tracking: {selectedVehicle.plate}
              </span>
            )}
          </div>

          <FleetMap 
            vehicles={vehicles} 
            selectedVehicle={selectedVehicle} 
            onSelectVehicle={(veh) => setSelectedVehicle(veh)}
            height="460px"
          />
        </div>

        {/* Selected Vehicle / Quick Fleet Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selectedVehicle ? (
            <div className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <span className="badge badge-purple" style={{ marginBottom: '6px' }}>{selectedVehicle.type}</span>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedVehicle.plate}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedVehicle.model}</p>
                </div>
                <span className={`badge ${
                  selectedVehicle.status === 'On Trip' ? 'badge-green' :
                  selectedVehicle.status === 'Available' ? 'badge-blue' :
                  selectedVehicle.status === 'In Maintenance' ? 'badge-yellow' : 'badge-red'
                }`}>
                  {selectedVehicle.status}
                </span>
              </div>

              <div style={{
                background: 'var(--bg-input)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Current Location:</span>
                  <strong style={{ color: 'var(--text-primary)', textAlign: 'right' }}>{selectedVehicle.lastLocation.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Live Speed:</span>
                  <strong style={{ color: '#10b981' }}>{selectedVehicle.lastLocation.speed} km/h</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Odometer Reading:</span>
                  <strong>{selectedVehicle.currentOdo.toLocaleString()} KM</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Fuel / Battery Level:</span>
                  <strong style={{ color: 'var(--accent-amber)' }}>{selectedVehicle.fuelLevel}%</strong>
                </div>
              </div>

              {/* Quick WhatsApp Alert for this vehicle */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Fleet Notice: Vehicle ${selectedVehicle.plate} is currently at ${selectedVehicle.lastLocation.name} with Odo ${selectedVehicle.currentOdo} KM.`)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
                style={{ width: '100%' }}
              >
                <Send size={15} /> WhatsApp Telematics Link
              </a>
            </div>
          ) : null}

          {/* Quick Vehicle Status List */}
          <div className="glass-card" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Fleet Status List ({vehicles.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '220px' }}>
              {vehicles.map(v => (
                <div 
                  key={v.id}
                  onClick={() => setSelectedVehicle(v)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedVehicle?.id === v.id ? 'rgba(59,130,246,0.15)' : 'var(--bg-input)',
                    border: selectedVehicle?.id === v.id ? '1px solid var(--accent-blue)' : '1px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    transition: 'var(--transition)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{v.plate}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{v.model.slice(0, 22)}...</div>
                  </div>
                  <span className={`badge ${
                    v.status === 'On Trip' ? 'badge-green' :
                    v.status === 'Available' ? 'badge-blue' :
                    v.status === 'In Maintenance' ? 'badge-yellow' : 'badge-red'
                  }`} style={{ fontSize: '0.7rem' }}>
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trips & Fuel Activity Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Latest Trips */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Recent Daily KM Logs</h3>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => onNavigate('daily-km')}>
              View All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dailyLogs.slice(0, 3).map(log => {
              const vehicle = vehicles.find(v => v.id === log.vehicleId);
              return (
                <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{vehicle?.plate || log.vehicleId}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.startLocation} → {log.endLocation}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>+{log.totalKM} KM</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{log.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Maintenance / Service Alerts */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Active Service & Maintenance</h3>
            <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => onNavigate('maintenance')}>
              View Garage Logs
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {maintenance.slice(0, 3).map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-input)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.vehiclePlate}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.serviceType.slice(0, 35)}...</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${m.status === 'Completed' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: '0.7rem' }}>
                    {m.status}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>₹{m.cost.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
