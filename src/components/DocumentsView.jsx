import React, { useState } from 'react';
import { FileText, Plus, AlertTriangle, CheckCircle, Clock, Send, ExternalLink, RefreshCw } from 'lucide-react';
import { getExpiryStatus } from '../data/initialData';

export default function DocumentsView({ documents, vehicles, onAddDocument, onRenewDocument }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  const [docForm, setDocForm] = useState({
    vehicleId: vehicles[0]?.id || '',
    docType: 'Commercial Vehicle Insurance',
    docNumber: '',
    issuedDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  });

  const docTypes = [
    'Commercial Vehicle Insurance',
    'Pollution Under Control (PUC)',
    'Motor Vehicle Fitness Certificate',
    'National Goods Permit',
    'State Road Tax Token',
    'RC (Registration Certificate)'
  ];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!docForm.vehicleId || !docForm.expiryDate) return;

    const vehicle = vehicles.find(v => v.id === docForm.vehicleId);

    const created = {
      id: `doc-${Date.now()}`,
      vehicleId: docForm.vehicleId,
      vehiclePlate: vehicle ? vehicle.plate : 'KL-VEHICLE',
      docType: docForm.docType,
      docNumber: docForm.docNumber || `DOC-${Date.now().toString().slice(-6)}`,
      issuedDate: docForm.issuedDate,
      expiryDate: docForm.expiryDate,
      fileUrl: 'document.pdf'
    };

    onAddDocument(created);
    setShowAddModal(false);
    setDocForm({
      vehicleId: vehicles[0]?.id || '',
      docType: 'Commercial Vehicle Insurance',
      docNumber: '',
      issuedDate: new Date().toISOString().split('T')[0],
      expiryDate: ''
    });
  };

  const processedDocs = documents.map(doc => {
    const expiryInfo = getExpiryStatus(doc.expiryDate);
    return { ...doc, expiryInfo };
  });

  const filteredDocs = processedDocs.filter(doc => {
    if (filterType === 'EXPIRING') return doc.expiryInfo.status === 'Expiring Soon';
    if (filterType === 'EXPIRED') return doc.expiryInfo.status === 'Expired';
    if (filterType === 'VALID') return doc.expiryInfo.status === 'Valid';
    return true;
  });

  const expiredCount = processedDocs.filter(d => d.expiryInfo.status === 'Expired').length;
  const expiringCount = processedDocs.filter(d => d.expiryInfo.status === 'Expiring Soon').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Vehicle Documents & Automated Expiry Engine
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Automatic days-until-expiry computation, status badges, and 1-click WhatsApp alerts.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Upload New Document
        </button>
      </div>

      {/* Summary Alert Bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div 
          className="glass-card" 
          style={{ padding: '16px', cursor: 'pointer', border: expiredCount > 0 ? '1px solid rgba(244,63,94,0.4)' : '' }}
          onClick={() => setFilterType('EXPIRED')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-rose)' }}>EXPIRED DOCUMENTS</span>
            <AlertTriangle size={18} style={{ color: 'var(--accent-rose)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-rose)', marginTop: '4px' }}>
            {expiredCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Vehicles illegal to operate on road</div>
        </div>

        <div 
          className="glass-card" 
          style={{ padding: '16px', cursor: 'pointer', border: expiringCount > 0 ? '1px solid rgba(245,158,11,0.4)' : '' }}
          onClick={() => setFilterType('EXPIRING')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)' }}>EXPIRING WITHIN 30 DAYS</span>
            <Clock size={18} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '4px' }}>
            {expiringCount}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Urgent renewal required</div>
        </div>

        <div 
          className="glass-card" 
          style={{ padding: '16px', cursor: 'pointer' }}
          onClick={() => setFilterType('ALL')}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-blue)' }}>TOTAL TRACKED CERTS</span>
            <FileText size={18} style={{ color: 'var(--accent-blue)' }} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {processedDocs.length}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Insurance, PUC, Tax, Fitness & Permits</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { id: 'ALL', label: 'All Documents' },
          { id: 'EXPIRED', label: `Expired (${expiredCount})` },
          { id: 'EXPIRING', label: `Expiring Soon (${expiringCount})` },
          { id: 'VALID', label: 'Valid / Compliant' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn ${filterType === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            onClick={() => setFilterType(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Vehicle Plate</th>
              <th>Document Type</th>
              <th>Certificate No.</th>
              <th>Issued Date</th>
              <th>Expiry Date</th>
              <th>Calculated Status</th>
              <th>WhatsApp Notification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map(doc => {
              const waText = encodeURIComponent(
                `*FLEET COMPLIANCE ALERT*\nVehicle: *${doc.vehiclePlate}*\nDocument: *${doc.docType}*\nStatus: *${doc.expiryInfo.status.toUpperCase()}* (${doc.expiryInfo.label})\nExpiry Date: ${doc.expiryDate}\nPlease renew immediately.`
              );

              return (
                <tr key={doc.id}>
                  <td>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{doc.vehiclePlate}</strong>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{doc.docType}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {doc.docNumber}
                    </span>
                  </td>
                  <td>{doc.issuedDate}</td>
                  <td><strong>{doc.expiryDate}</strong></td>
                  <td>
                    <span className={`badge ${doc.expiryInfo.badgeClass}`} style={{ fontSize: '0.75rem' }}>
                      {doc.expiryInfo.label}
                    </span>
                  </td>
                  <td>
                    <a
                      href={`https://wa.me/?text=${waText}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-whatsapp"
                      style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                    >
                      <Send size={11} /> WhatsApp Alert
                    </a>
                  </td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                      onClick={() => onRenewDocument(doc.id)}
                      title="Add 1 Year to Expiry"
                    >
                      <RefreshCw size={11} /> Quick Renew
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Add Vehicle Compliance Document</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Vehicle *</label>
                  <select 
                    className="form-select"
                    required
                    value={docForm.vehicleId}
                    onChange={(e) => setDocForm({ ...docForm, vehicleId: e.target.value })}
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.plate} - {v.model}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Document Type *</label>
                  <select 
                    className="form-select"
                    required
                    value={docForm.docType}
                    onChange={(e) => setDocForm({ ...docForm, docType: e.target.value })}
                  >
                    {docTypes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Certificate / Policy Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. INS-2026-99881" 
                    className="form-input"
                    value={docForm.docNumber}
                    onChange={(e) => setDocForm({ ...docForm, docNumber: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Issued Date</label>
                    <input 
                      type="date" 
                      className="form-input"
                      value={docForm.issuedDate}
                      onChange={(e) => setDocForm({ ...docForm, issuedDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Expiry Date *</label>
                    <input 
                      type="date" 
                      required 
                      className="form-input"
                      value={docForm.expiryDate}
                      onChange={(e) => setDocForm({ ...docForm, expiryDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Document</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
