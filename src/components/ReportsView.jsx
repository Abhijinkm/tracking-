import React from 'react';
import { BarChart3, Download, Printer, FileText, CheckCircle2 } from 'lucide-react';

export default function ReportsView({ vehicles, dailyLogs, fuelLogs, maintenance, documents }) {
  // Export Daily KM to CSV
  const handleExportKM = () => {
    const headers = ['Date,Vehicle,Driver_ID,Start_KM,End_KM,Total_KM,Route,Status\n'];
    const rows = dailyLogs.map(l => 
      `"${l.date}","${l.vehicleId}","${l.driverId}",${l.startKM},${l.endKM},${l.totalKM},"${l.startLocation} to ${l.endLocation}","${l.status}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fleet_daily_km_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Export Fuel to CSV
  const handleExportFuel = () => {
    const headers = ['Date,Vehicle,Driver_ID,Odometer,Liters,Rate,Total_Cost,Station,Mileage_KM_L\n'];
    const rows = fuelLogs.map(f => 
      `"${f.date}","${f.vehicleId}","${f.driverId}",${f.odometer},${f.liters},${f.rate},${f.totalCost},"${f.station}",${f.calculatedMileage}\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fleet_fuel_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalKM = dailyLogs.reduce((acc, c) => acc + (c.totalKM || 0), 0);
  const totalFuelCost = fuelLogs.reduce((acc, c) => acc + (c.totalCost || 0), 0);
  const totalServiceCost = maintenance.reduce((acc, c) => acc + (c.cost || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Operational Fleet Reports & Analytics
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Comprehensive performance audits, cost per kilometer analysis, and data exports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print Report
          </button>
          <button className="btn btn-primary" onClick={handleExportKM}>
            <Download size={16} /> Export KM Log (CSV)
          </button>
          <button className="btn btn-primary" onClick={handleExportFuel}>
            <Download size={16} /> Export Fuel Data (CSV)
          </button>
        </div>
      </div>

      {/* Financial & Distance Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>NET OPERATIONAL EXPENSES</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '4px' }}>
            ₹{(totalFuelCost + totalServiceCost).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Fuel: ₹{totalFuelCost.toLocaleString()} | Service: ₹{totalServiceCost.toLocaleString()}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>COST PER KILOMETER (CPK)</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
            ₹{totalKM > 0 ? ((totalFuelCost + totalServiceCost) / totalKM).toFixed(2) : '0.00'} <span style={{ fontSize: '0.85rem' }}>/ KM</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Includes diesel refuels and maintenance upkeep
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>FLEET UTILIZATION RATE</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '4px' }}>
            {vehicles.length > 0 ? Math.round((vehicles.filter(v => v.status === 'On Trip').length / vehicles.length) * 100) : 0}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Vehicles active in commercial transit
          </div>
        </div>
      </div>

      {/* Vehicle Summary Table */}
      <div className="table-container">
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 700 }}>
          Vehicle Performance Breakdown
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Vehicle Plate</th>
              <th>Make & Model</th>
              <th>Fuel Type</th>
              <th>Odometer</th>
              <th>Fuel Logs</th>
              <th>Service Logs</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => {
              const vFuel = fuelLogs.filter(f => f.vehicleId === v.id);
              const vMaint = maintenance.filter(m => m.vehicleId === v.id);
              return (
                <tr key={v.id}>
                  <td><strong style={{ color: 'var(--accent-blue)' }}>{v.plate}</strong></td>
                  <td>{v.model}</td>
                  <td>{v.fuelType}</td>
                  <td><strong>{v.currentOdo.toLocaleString()} KM</strong></td>
                  <td>{vFuel.length} entries</td>
                  <td>{vMaint.length} service records</td>
                  <td>
                    <span className={`badge ${
                      v.status === 'On Trip' ? 'badge-green' :
                      v.status === 'Available' ? 'badge-blue' :
                      v.status === 'In Maintenance' ? 'badge-yellow' : 'badge-red'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
