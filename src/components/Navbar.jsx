import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ShieldCheck, 
  UserCheck, 
  Truck, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ExternalLink,
  Send
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  allUsers, 
  onSwitchUser, 
  theme, 
  onToggleTheme, 
  notifications,
  onOpenWhatsAppModal 
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadAlerts = notifications.length;

  return (
    <header style={{
      height: '68px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand & Live Clock */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(37,99,235,0.35)'
          }}>
            <Truck size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              FleetTrack <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>PRO</span>
            </h1>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>GPS & Fleet Lifecycle Automation</div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--bg-input)',
          padding: '4px 10px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          <Clock size={13} style={{ color: 'var(--accent-blue)' }} />
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Right Controls: Role Switcher, WhatsApp Bell, Theme, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Role Switcher Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '4px 8px'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Active Role:
          </span>
          <select 
            value={currentUser.id}
            onChange={(e) => {
              const selected = allUsers.find(u => u.id === e.target.value);
              if (selected) onSwitchUser(selected);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {allUsers.map(user => (
              <option key={user.id} value={user.id} style={{ background: 'var(--bg-secondary)' }}>
                {user.role}: {user.name}
              </option>
            ))}
          </select>
          <span className={`badge ${currentUser.role === 'Admin' ? 'badge-purple' : currentUser.role === 'Manager' ? 'badge-blue' : 'badge-green'}`}>
            {currentUser.role}
          </span>
        </div>

        {/* WhatsApp Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '8px 10px', position: 'relative' }}
            onClick={() => setShowNotifications(!showNotifications)}
            title="Auto Expiry & WhatsApp Alerts"
          >
            <Bell size={18} />
            {unreadAlerts > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--accent-rose)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-secondary)'
              }}>
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '48px',
              width: '360px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              padding: '16px',
              zIndex: 500
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} style={{ color: 'var(--accent-amber)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Auto Reminders ({unreadAlerts})</span>
                </div>
                <button 
                  onClick={() => { setShowNotifications(false); onOpenWhatsAppModal(); }}
                  className="btn btn-whatsapp" 
                  style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                >
                  <Send size={12} /> Test WhatsApp
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    All vehicle documents & services are up-to-date!
                  </div>
                ) : (
                  notifications.map(item => (
                    <div 
                      key={item.id} 
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-input)',
                        borderLeft: `4px solid ${item.status === 'Expired' ? 'var(--accent-rose)' : 'var(--accent-amber)'}`,
                        fontSize: '0.8rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{item.vehiclePlate}</strong>
                        <span style={{ fontSize: '0.7rem', color: item.status === 'Expired' ? 'var(--accent-rose)' : 'var(--accent-amber)', fontWeight: 600 }}>
                          {item.label}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{item.docType}</div>
                      <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end' }}>
                        <a 
                          href={`https://wa.me/?text=${encodeURIComponent(`Fleet Alert: ${item.docType} for vehicle ${item.vehiclePlate} is ${item.status} (${item.label}).`)}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="btn btn-whatsapp"
                          style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                        >
                          Send WhatsApp <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          className="btn btn-secondary" 
          onClick={onToggleTheme} 
          style={{ padding: '8px 10px' }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={17} style={{ color: '#f59e0b' }} /> : <Moon size={17} />}
        </button>

        {/* User Avatar & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid var(--border-color)' }}>
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-blue)' }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{currentUser.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{currentUser.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
