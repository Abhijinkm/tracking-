import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, CheckCircle, Clock, Smartphone, RefreshCw, AlertCircle } from 'lucide-react';

export default function WhatsAppAutomationView({ 
  alerts, 
  documents, 
  vehicles, 
  drivers, 
  onTriggerCron, 
  onSendCustomWhatsApp 
}) {
  const [cronRunning, setCronRunning] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const [customWA, setCustomWA] = useState({
    recipientPhone: '+919847123456',
    vehiclePlate: vehicles[0]?.plate || '',
    template: 'expiry',
    customText: ''
  });

  const handleRunCron = () => {
    setCronRunning(true);
    setTimeout(() => {
      onTriggerCron();
      setCronRunning(false);
      setSuccessMessage('Auto-Reminder Engine completed! Scanned all vehicles, documents, and dispatched alerts via WhatsApp.');
      setTimeout(() => setSuccessMessage(null), 5000);
    }, 1200);
  };

  const handleSendCustom = (e) => {
    e.preventDefault();
    const phone = customWA.recipientPhone.replace(/[^0-9]/g, '');
    let text = customWA.customText;

    if (!text) {
      if (customWA.template === 'expiry') {
        text = `⚠️ *FLEET COMPLIANCE ALERT:*\nVehicle: *${customWA.vehiclePlate}*\nYour insurance/permit is nearing expiry. Please update today to avoid traffic fines.`;
      } else if (customWA.template === 'service') {
        text = `🔧 *MAINTENANCE ALERT:*\nVehicle: *${customWA.vehiclePlate}* is scheduled for periodic garage servicing. Please report to the depot.`;
      } else {
        text = `📋 *DAILY KM REMINDER:*\nPlease remember to punch in your starting & ending odometer readings for *${customWA.vehiclePlate}*.`;
      }
    }

    onSendCustomWhatsApp({
      id: `wa-${Date.now()}`,
      recipient: `Driver / Operator (${phone})`,
      phone: customWA.recipientPhone,
      plate: customWA.vehiclePlate,
      docType: 'Custom Fleet Alert',
      message: text,
      sentAt: 'Just now',
      status: 'Delivered',
      channel: 'WhatsApp'
    });

    // Open WhatsApp Web or URL
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            WhatsApp Automation & Cloud API Engine
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Automated scheduled daily cron alerts for document expiries, maintenance dues, and instant driver dispatches.
          </p>
        </div>

        <button 
          className="btn btn-whatsapp" 
          onClick={handleRunCron}
          disabled={cronRunning}
          style={{ fontSize: '0.9rem', padding: '10px 18px' }}
        >
          <Sparkles size={18} /> {cronRunning ? 'Scanning & Dispatching...' : 'Run Auto-Reminder Engine Now'}
        </button>
      </div>

      {successMessage && (
        <div style={{
          padding: '12px 18px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.3)',
          color: '#10b981',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grid: Dispatcher form & Cron status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Instant WhatsApp Sender */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={18} style={{ color: 'var(--accent-whatsapp)' }} /> Quick WhatsApp Message Dispatcher
          </h3>

          <form onSubmit={handleSendCustom}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Recipient Phone (WhatsApp) *</label>
                <input 
                  type="text" 
                  required 
                  className="form-input"
                  placeholder="+91 98471 23456"
                  value={customWA.recipientPhone}
                  onChange={(e) => setCustomWA({ ...customWA, recipientPhone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Related Vehicle</label>
                <select 
                  className="form-select"
                  value={customWA.vehiclePlate}
                  onChange={(e) => setCustomWA({ ...customWA, vehiclePlate: e.target.value })}
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.plate}>{v.plate} ({v.model})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Alert Template</label>
              <select 
                className="form-select"
                value={customWA.template}
                onChange={(e) => setCustomWA({ ...customWA, template: e.target.value })}
              >
                <option value="expiry">📄 Document Expiry Renewal Alert</option>
                <option value="service">🔧 Vehicle Periodic Service Due Alert</option>
                <option value="punch">⏱️ Daily Odometer Punch-In Reminder</option>
                <option value="custom">✍️ Custom Message</option>
              </select>
            </div>

            {customWA.template === 'custom' && (
              <div className="form-group">
                <label className="form-label">Custom Message Text</label>
                <textarea 
                  rows={3} 
                  className="form-textarea"
                  placeholder="Type WhatsApp message here..."
                  value={customWA.customText}
                  onChange={(e) => setCustomWA({ ...customWA, customText: e.target.value })}
                />
              </div>
            )}

            <button type="submit" className="btn btn-whatsapp" style={{ width: '100%', marginTop: '6px' }}>
              <Send size={15} /> Dispatch to WhatsApp
            </button>
          </form>
        </div>

        {/* Cron Job Architecture & Settings */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
              Automated Background Scheduler
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              The system runs a background cron job at <strong>08:00 AM IST</strong> daily to verify fleet health:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
              <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', borderLeft: '3px solid var(--accent-rose)' }}>
                <strong>Critical Priority:</strong> Documents expired or expiring in &lt; 7 days trigger instant alerts to Fleet Admin and assigned Driver.
              </div>
              <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', borderLeft: '3px solid var(--accent-amber)' }}>
                <strong>Warning Priority:</strong> Documents expiring in 15 or 30 days send advisory renewal notices with direct renewal links.
              </div>
              <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', borderLeft: '3px solid var(--accent-blue)' }}>
                <strong>Service Trigger:</strong> Vehicles within 500 KM of maintenance threshold alert the Workshop Supervisor.
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(37, 211, 102, 0.08)',
            border: '1px solid rgba(37, 211, 102, 0.25)',
            fontSize: '0.75rem',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span className="pulse-indicator" style={{ background: '#25d366' }}></span>
            <span>WhatsApp Business Cloud API webhook: <strong>Connected & Active</strong></span>
          </div>
        </div>
      </div>

      {/* Alert Logs Table */}
      <div className="table-container">
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.95rem' }}>
          Recent WhatsApp Transmission Logs
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Recipient</th>
              <th>Vehicle Plate</th>
              <th>Notification Message</th>
              <th>Delivery Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(alert => (
              <tr key={alert.id}>
                <td><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{alert.sentAt}</span></td>
                <td>
                  <div style={{ fontWeight: 600 }}>{alert.recipient}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{alert.phone}</div>
                </td>
                <td><strong style={{ color: 'var(--accent-blue)' }}>{alert.plate}</strong></td>
                <td style={{ maxWidth: '420px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {alert.message}
                </td>
                <td>
                  <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                    <CheckCircle size={11} /> {alert.status}
                  </span>
                </td>
                <td>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(alert.message)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                  >
                    Resend
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
