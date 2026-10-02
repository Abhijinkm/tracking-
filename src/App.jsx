import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import VehiclesView from './components/VehiclesView';
import DriversView from './components/DriversView';
import DailyKMView from './components/DailyKMView';
import FuelView from './components/FuelView';
import DocumentsView from './components/DocumentsView';
import MaintenanceView from './components/MaintenanceView';
import WhatsAppAutomationView from './components/WhatsAppAutomationView';
import ReportsView from './components/ReportsView';

import {
  INITIAL_USERS,
  INITIAL_VEHICLES,
  INITIAL_DAILY_LOGS,
  INITIAL_FUEL_LOGS,
  INITIAL_DOCUMENTS,
  INITIAL_MAINTENANCE,
  INITIAL_WHATSAPP_ALERTS,
  getExpiryStatus
} from './data/initialData';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('fleet_theme') || 'dark');

  // Users & Active Role
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('fleet_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState(users[0]); // Default: Admin

  // Main Data States with LocalStorage Sync
  const [vehicles, setVehicles] = useState(() => {
    const saved = localStorage.getItem('fleet_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [dailyLogs, setDailyLogs] = useState(() => {
    const saved = localStorage.getItem('fleet_daily_logs');
    return saved ? JSON.parse(saved) : INITIAL_DAILY_LOGS;
  });

  const [fuelLogs, setFuelLogs] = useState(() => {
    const saved = localStorage.getItem('fleet_fuel_logs');
    return saved ? JSON.parse(saved) : INITIAL_FUEL_LOGS;
  });

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('fleet_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [maintenance, setMaintenance] = useState(() => {
    const saved = localStorage.getItem('fleet_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('fleet_alerts');
    return saved ? JSON.parse(saved) : INITIAL_WHATSAPP_ALERTS;
  });

  const [currentTab, setCurrentTab] = useState('dashboard');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('fleet_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);
  useEffect(() => {
    localStorage.setItem('fleet_daily_logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);
  useEffect(() => {
    localStorage.setItem('fleet_fuel_logs', JSON.stringify(fuelLogs));
  }, [fuelLogs]);
  useEffect(() => {
    localStorage.setItem('fleet_documents', JSON.stringify(documents));
  }, [documents]);
  useEffect(() => {
    localStorage.setItem('fleet_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);
  useEffect(() => {
    localStorage.setItem('fleet_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fleet_theme', theme);
  }, [theme]);

  // Simulated GPS Telematics micro-movement for active vehicles (feels alive & real-time)
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status === 'On Trip' && v.lastLocation) {
          return {
            ...v,
            lastLocation: {
              ...v.lastLocation,
              lat: v.lastLocation.lat + (Math.random() - 0.5) * 0.001,
              lng: v.lastLocation.lng + (Math.random() - 0.5) * 0.001,
              speed: Math.floor(40 + Math.random() * 25),
              updatedAt: 'Just now'
            }
          };
        }
        return v;
      }));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Compute urgent notifications (expired & expiring soon documents)
  const urgentNotifications = documents
    .map(doc => {
      const exp = getExpiryStatus(doc.expiryDate);
      return { ...doc, ...exp };
    })
    .filter(doc => doc.status === 'Expired' || doc.status === 'Expiring Soon');

  // Handlers
  const handleAddVehicle = (newVeh) => {
    setVehicles([newVeh, ...vehicles]);
  };

  const handleUpdateVehicle = (vehicleId, updates) => {
    setVehicles(vehicles.map(v => v.id === vehicleId ? { ...v, ...updates } : v));
  };

  const handleAddDriver = (newDriver) => {
    setUsers([...users, newDriver]);
  };

  const handleUpdateDriver = (driverId, updates) => {
    setUsers(users.map(u => u.id === driverId ? { ...u, ...updates } : u));
  };

  const handleAddDailyLog = (newLog) => {
    setDailyLogs([newLog, ...dailyLogs]);
    // Also update vehicle current odometer
    setVehicles(vehicles.map(v => {
      if (v.id === newLog.vehicleId) {
        return {
          ...v,
          currentOdo: newLog.endKM,
          status: 'Available'
        };
      }
      return v;
    }));
  };

  const handleVerifyDailyLog = (logId) => {
    setDailyLogs(dailyLogs.map(l => l.id === logId ? { ...l, verified: true } : l));
  };

  const handleAddFuelLog = (newFuel) => {
    setFuelLogs([newFuel, ...fuelLogs]);
    if (newFuel.odometer) {
      setVehicles(vehicles.map(v => v.id === newFuel.vehicleId ? { ...v, currentOdo: newFuel.odometer } : v));
    }
  };

  const handleAddDocument = (newDoc) => {
    setDocuments([newDoc, ...documents]);
  };

  const handleRenewDocument = (docId) => {
    setDocuments(documents.map(d => {
      if (d.id === docId) {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        return {
          ...d,
          issuedDate: new Date().toISOString().split('T')[0],
          expiryDate: nextYear.toISOString().split('T')[0]
        };
      }
      return d;
    }));
  };

  const handleAddMaintenance = (newMaint) => {
    setMaintenance([newMaint, ...maintenance]);
    if (newMaint.status === 'In Progress') {
      setVehicles(vehicles.map(v => v.id === newMaint.vehicleId ? { ...v, status: 'In Maintenance' } : v));
    }
  };

  const handleUpdateMaintenance = (maintId, updates) => {
    setMaintenance(maintenance.map(m => {
      if (m.id === maintId) {
        if (updates.status === 'Completed') {
          // Release vehicle back to available
          setVehicles(vehicles.map(v => v.id === m.vehicleId ? { ...v, status: 'Available' } : v));
        }
        return { ...m, ...updates };
      }
      return m;
    }));
  };

  // WhatsApp Cron simulation runner
  const handleTriggerCron = () => {
    const newAlerts = [];
    urgentNotifications.forEach(doc => {
      newAlerts.push({
        id: `wa-cron-${Date.now()}-${doc.id}`,
        recipient: `Vehicle Fleet Manager`,
        phone: '+919847000001',
        plate: doc.vehiclePlate,
        docType: doc.docType,
        message: `⚠️ *AUTOMATED FLEET CRON:* Document *${doc.docType}* for vehicle *${doc.vehiclePlate}* is *${doc.status.toUpperCase()}* (${doc.label}). Renewal needed immediately.`,
        sentAt: 'Just now (Cron)',
        status: 'Delivered',
        channel: 'WhatsApp'
      });
    });

    if (newAlerts.length > 0) {
      setAlerts([...newAlerts, ...alerts]);
    }
  };

  const handleSendCustomWhatsApp = (alertObj) => {
    setAlerts([alertObj, ...alerts]);
  };

  const driversList = users.filter(u => u.role === 'Driver');

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={currentUser.role}
        expiringDocsCount={urgentNotifications.length}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar 
          currentUser={currentUser}
          allUsers={users}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            // If switched to driver, route to daily-km punch view
            if (user.role === 'Driver') {
              setCurrentTab('daily-km');
            }
          }}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          notifications={urgentNotifications}
          onOpenWhatsAppModal={() => setCurrentTab('whatsapp')}
        />

        <main className="content-body">
          {currentTab === 'dashboard' && (
            <DashboardView 
              vehicles={vehicles}
              dailyLogs={dailyLogs}
              fuelLogs={fuelLogs}
              documents={documents}
              maintenance={maintenance}
              notifications={urgentNotifications}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenWhatsAppModal={() => setCurrentTab('whatsapp')}
            />
          )}

          {currentTab === 'vehicles' && (
            <VehiclesView 
              vehicles={vehicles}
              drivers={driversList}
              onAddVehicle={handleAddVehicle}
              onUpdateVehicle={handleUpdateVehicle}
            />
          )}

          {currentTab === 'drivers' && (
            <DriversView 
              drivers={driversList}
              vehicles={vehicles}
              onAddDriver={handleAddDriver}
              onUpdateDriver={handleUpdateDriver}
            />
          )}

          {currentTab === 'daily-km' && (
            <DailyKMView 
              dailyLogs={dailyLogs}
              vehicles={vehicles}
              drivers={driversList}
              currentUser={currentUser}
              onAddLog={handleAddDailyLog}
              onVerifyLog={handleVerifyDailyLog}
            />
          )}

          {currentTab === 'fuel' && (
            <FuelView 
              fuelLogs={fuelLogs}
              vehicles={vehicles}
              drivers={driversList}
              onAddFuelLog={handleAddFuelLog}
            />
          )}

          {currentTab === 'documents' && (
            <DocumentsView 
              documents={documents}
              vehicles={vehicles}
              onAddDocument={handleAddDocument}
              onRenewDocument={handleRenewDocument}
            />
          )}

          {currentTab === 'maintenance' && (
            <MaintenanceView 
              maintenance={maintenance}
              vehicles={vehicles}
              onAddMaintenance={handleAddMaintenance}
              onUpdateMaintenance={handleUpdateMaintenance}
            />
          )}

          {currentTab === 'whatsapp' && (
            <WhatsAppAutomationView 
              alerts={alerts}
              documents={documents}
              vehicles={vehicles}
              drivers={driversList}
              onTriggerCron={handleTriggerCron}
              onSendCustomWhatsApp={handleSendCustomWhatsApp}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsView 
              vehicles={vehicles}
              dailyLogs={dailyLogs}
              fuelLogs={fuelLogs}
              maintenance={maintenance}
              documents={documents}
            />
          )}
        </main>
      </div>
    </div>
  );
}
