import React from 'react';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Gauge, 
  Fuel, 
  FileText, 
  Wrench, 
  MessageSquare, 
  BarChart3,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  userRole,
  expiringDocsCount 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard & GPS', icon: LayoutDashboard, roles: ['Admin', 'Manager', 'Driver'] },
    { id: 'vehicles', label: 'Fleet Vehicles', icon: Truck, roles: ['Admin', 'Manager'] },
    { id: 'drivers', label: 'Drivers & Photos', icon: Users, roles: ['Admin', 'Manager'] },
    { id: 'daily-km', label: 'Daily KM & Trips', icon: Gauge, roles: ['Admin', 'Manager', 'Driver'], badge: userRole === 'Driver' ? 'Punch' : null },
    { id: 'fuel', label: 'Fuel & Receipts', icon: Fuel, roles: ['Admin', 'Manager', 'Driver'] },
    { 
      id: 'documents', 
      label: 'Document Expiry', 
      icon: FileText, 
      roles: ['Admin', 'Manager'],
      badge: expiringDocsCount > 0 ? expiringDocsCount : null,
      badgeColor: 'badge-red'
    },
    { id: 'maintenance', label: 'Service & Repairs', icon: Wrench, roles: ['Admin', 'Manager'] },
    { id: 'whatsapp', label: 'WhatsApp Alerts', icon: MessageSquare, roles: ['Admin', 'Manager'] },
    { id: 'reports', label: 'Reports & Export', icon: BarChart3, roles: ['Admin', 'Manager'] },
  ];

  // Filter items based on active role
  const allowedItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      flexShrink: 0
    }}>
      <div>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0 12px 12px',
        }}>
          Navigation Menu
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {allowedItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '11px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: isActive ? 'linear-gradient(90deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.03) 100%)' : 'transparent',
                  color: isActive ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  border: 'none',
                  borderLeft: isActive ? '3px solid var(--accent-blue)' : '3px solid transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'var(--transition)',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon size={19} style={{ color: isActive ? 'var(--accent-blue)' : 'inherit' }} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`badge ${item.badgeColor || 'badge-blue'}`} style={{ padding: '2px 7px', fontSize: '10px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Auto-Reminder Cron Status Box */}
      <div style={{
        background: 'var(--bg-input)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-md)',
        padding: '14px',
        marginTop: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={16} style={{ color: 'var(--accent-whatsapp)' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            WhatsApp Engine
          </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '8px' }}>
          Daily 08:00 AM Cron active. Auto-scans 30-day document expiries and service triggers.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>
          <span className="pulse-indicator" style={{ background: '#10b981' }}></span>
          <span>Scheduler Running</span>
        </div>
      </div>
    </aside>
  );
}
