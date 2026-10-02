// Initial Mock Data and Storage Manager for FleetTrack Pro

export const INITIAL_USERS = [
  {
    id: 'u-admin-1',
    name: 'Alex Morgan',
    email: 'admin@fleettrack.com',
    role: 'Admin',
    phone: '+919847000001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Fleet Operations Director',
  },
  {
    id: 'u-mgr-1',
    name: 'Priya Sharma',
    email: 'priya.sharma@fleettrack.com',
    role: 'Manager',
    phone: '+919847000002',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Depot Fleet Supervisor',
  },
  {
    id: 'd-101',
    name: 'Rahul Nair',
    email: 'rahul.nair@fleettrack.com',
    role: 'Driver',
    phone: '+919847123456',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    licenseNumber: 'KL-07-2019-0044521',
    licenseExpiry: '2027-11-20',
    assignedVehicle: 'KL-07-CC-4090',
    experienceYears: 6,
    status: 'On Trip'
  },
  {
    id: 'd-102',
    name: 'Mohammed Anoop',
    email: 'anoop.m@fleettrack.com',
    role: 'Driver',
    phone: '+919745987654',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    licenseNumber: 'KL-01-2021-0099812',
    licenseExpiry: '2026-10-15', // Expiring soon!
    assignedVehicle: 'KL-01-BK-8822',
    experienceYears: 4,
    status: 'Available'
  },
  {
    id: 'd-103',
    name: 'Suresh Kumar',
    email: 'suresh.k@fleettrack.com',
    role: 'Driver',
    phone: '+919895332211',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    licenseNumber: 'KL-08-2018-0012390',
    licenseExpiry: '2028-05-30',
    assignedVehicle: 'KL-08-AF-3311',
    experienceYears: 9,
    status: 'In Maintenance'
  }
];

export const INITIAL_VEHICLES = [
  {
    id: 'v-101',
    plate: 'KL-07-CC-4090',
    model: 'Tata Signa 4825.TK (Heavy Tipper)',
    type: 'Heavy Truck',
    fuelType: 'Diesel',
    assignedDriverId: 'd-101',
    currentOdo: 84250,
    status: 'On Trip', // 'On Trip' | 'Available' | 'In Maintenance' | 'Idle'
    lastLocation: {
      lat: 9.9816,
      lng: 76.2999,
      name: 'Edappally Bypass, Kochi',
      speed: 48,
      updatedAt: 'Just now'
    },
    fuelLevel: 68,
    fuelCapacity: 300,
    mileageTarget: 4.2
  },
  {
    id: 'v-102',
    plate: 'KL-01-BK-8822',
    model: 'Mahindra Bolero Maxi Truck Plus',
    type: 'Pickup Van',
    fuelType: 'Diesel',
    assignedDriverId: 'd-102',
    currentOdo: 42100,
    status: 'Available',
    lastLocation: {
      lat: 8.5241,
      lng: 76.9366,
      name: 'Technopark Hub, Trivandrum',
      speed: 0,
      updatedAt: '12 mins ago'
    },
    fuelLevel: 85,
    fuelCapacity: 60,
    mileageTarget: 14.5
  },
  {
    id: 'v-103',
    plate: 'KL-08-AF-3311',
    model: 'Ashok Leyland Ecomet 1215',
    type: 'Reefer Truck',
    fuelType: 'Diesel',
    assignedDriverId: 'd-103',
    currentOdo: 112400,
    status: 'In Maintenance',
    lastLocation: {
      lat: 10.5276,
      lng: 76.2144,
      name: 'AutoCraft Workshop, Thrissur',
      speed: 0,
      updatedAt: '2 hours ago'
    },
    fuelLevel: 40,
    fuelCapacity: 185,
    mileageTarget: 7.8
  },
  {
    id: 'v-104',
    plate: 'KL-11-BV-5509',
    model: 'Eicher Pro 2049 Light Duty',
    type: 'Cargo Truck',
    fuelType: 'Diesel',
    assignedDriverId: null,
    currentOdo: 31200,
    status: 'Idle',
    lastLocation: {
      lat: 11.2588,
      lng: 75.7804,
      name: 'Calicut Central Depot',
      speed: 0,
      updatedAt: '1 day ago'
    },
    fuelLevel: 55,
    fuelCapacity: 100,
    mileageTarget: 11.0
  },
  {
    id: 'v-105',
    plate: 'KL-40-H-1904',
    model: 'Tata Ace Gold EV',
    type: 'Electric Mini Van',
    fuelType: 'Electric',
    assignedDriverId: null,
    currentOdo: 14800,
    status: 'Available',
    lastLocation: {
      lat: 10.1076,
      lng: 76.3516,
      name: 'Aluva Metro Charging Hub',
      speed: 0,
      updatedAt: '35 mins ago'
    },
    fuelLevel: 92,
    fuelCapacity: 100,
    mileageTarget: 154 // KM per full charge
  }
];

export const INITIAL_DAILY_LOGS = [
  {
    id: 'log-001',
    date: '2026-10-01',
    vehicleId: 'v-101',
    driverId: 'd-101',
    startKM: 84110,
    endKM: 84250,
    totalKM: 140,
    startLocation: 'Kochi Harbor Yard',
    endLocation: 'Angamaly Distribution Center',
    status: 'Completed',
    verified: true,
    notes: 'Container delivery batch #440 completed on time.'
  },
  {
    id: 'log-002',
    date: '2026-10-01',
    vehicleId: 'v-102',
    driverId: 'd-102',
    startKM: 42020,
    endKM: 42100,
    totalKM: 80,
    startLocation: 'Trivandrum Central Depot',
    endLocation: 'Attingal Retailers Hub',
    status: 'Completed',
    verified: true,
    notes: 'Standard morning parcel dispatch.'
  },
  {
    id: 'log-003',
    date: '2026-09-30',
    vehicleId: 'v-101',
    driverId: 'd-101',
    startKM: 83920,
    endKM: 84110,
    totalKM: 190,
    startLocation: 'Kochi Port',
    endLocation: 'Thrissur Warehousing Hub',
    status: 'Completed',
    verified: true,
    notes: 'Interstate cargo transit.'
  }
];

export const INITIAL_FUEL_LOGS = [
  {
    id: 'fuel-1',
    date: '2026-09-30',
    vehicleId: 'v-101',
    driverId: 'd-101',
    odometer: 84050,
    liters: 75.0,
    rate: 96.50,
    totalCost: 7237.50,
    station: 'Indian Oil - Palarivattom Bypass',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&auto=format&fit=crop&q=80',
    calculatedMileage: 4.1
  },
  {
    id: 'fuel-2',
    date: '2026-09-28',
    vehicleId: 'v-102',
    driverId: 'd-102',
    odometer: 41850,
    liters: 32.0,
    rate: 96.50,
    totalCost: 3088.00,
    station: 'Bharat Petroleum - Kazhakkoottam',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&auto=format&fit=crop&q=80',
    calculatedMileage: 13.9
  },
  {
    id: 'fuel-3',
    date: '2026-09-27',
    vehicleId: 'v-103',
    driverId: 'd-103',
    odometer: 112100,
    liters: 90.0,
    rate: 96.50,
    totalCost: 8685.00,
    station: 'HP Auto Care - Kuttanellur',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&auto=format&fit=crop&q=80',
    calculatedMileage: 7.4
  }
];

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-1',
    vehicleId: 'v-101',
    vehiclePlate: 'KL-07-CC-4090',
    docType: 'National Goods Permit',
    docNumber: 'PERMIT-KL07-2024-998',
    issuedDate: '2025-10-10',
    expiryDate: '2026-10-06', // 5 days left -> EXPIRING SOON!
    fileUrl: 'permit_doc.pdf'
  },
  {
    id: 'doc-2',
    vehicleId: 'v-101',
    vehiclePlate: 'KL-07-CC-4090',
    docType: 'Commercial Vehicle Insurance',
    docNumber: 'BAJAJ-ALLZ-COMM-88910',
    issuedDate: '2025-12-01',
    expiryDate: '2026-12-01', // 61 days left -> VALID
    fileUrl: 'insurance_doc.pdf'
  },
  {
    id: 'doc-3',
    vehicleId: 'v-102',
    vehiclePlate: 'KL-01-BK-8822',
    docType: 'Pollution Under Control (PUC)',
    docNumber: 'PUC-KL01-998823',
    issuedDate: '2026-04-01',
    expiryDate: '2026-09-28', // EXPIRED 3 days ago!
    fileUrl: 'puc_certificate.pdf'
  },
  {
    id: 'doc-4',
    vehicleId: 'v-102',
    vehiclePlate: 'KL-01-BK-8822',
    docType: 'Motor Vehicle Fitness Certificate',
    docNumber: 'FC-RTO-TRV-5541',
    issuedDate: '2025-10-20',
    expiryDate: '2026-10-20', // 19 days left -> EXPIRING SOON!
    fileUrl: 'fitness_cert.pdf'
  },
  {
    id: 'doc-5',
    vehicleId: 'v-103',
    vehiclePlate: 'KL-08-AF-3311',
    docType: 'Commercial Vehicle Insurance',
    docNumber: 'NEW-INDIA-INS-7729',
    issuedDate: '2025-11-15',
    expiryDate: '2026-11-15', // 45 days left -> VALID
    fileUrl: 'insurance_policy.pdf'
  },
  {
    id: 'doc-6',
    vehicleId: 'v-104',
    vehiclePlate: 'KL-11-BV-5509',
    docType: 'State Road Tax Token',
    docNumber: 'TAX-KERALA-RT-8849',
    issuedDate: '2025-10-15',
    expiryDate: '2026-10-15', // 14 days left -> EXPIRING SOON!
    fileUrl: 'road_tax_receipt.pdf'
  }
];

export const INITIAL_MAINTENANCE = [
  {
    id: 'm-1',
    vehicleId: 'v-103',
    vehiclePlate: 'KL-08-AF-3311',
    serviceType: 'Brake Drum Replacement & Suspension Overhaul',
    garage: 'AutoCraft Fleet Garage, Thrissur',
    serviceDate: '2026-10-01',
    odometer: 112400,
    cost: 16500,
    status: 'In Progress',
    nextDueOdo: 125000,
    nextDueDate: '2027-01-15',
    notes: 'Rear left brake shoe worn out, replaced with genuine Ashok Leyland spares.'
  },
  {
    id: 'm-2',
    vehicleId: 'v-101',
    vehiclePlate: 'KL-07-CC-4090',
    serviceType: 'Periodic 80,000 KM Engine Oil & Filter Change',
    garage: 'Tata Motors Authorized Workshop, Kalamassery',
    serviceDate: '2026-08-15',
    odometer: 80100,
    cost: 12400,
    status: 'Completed',
    nextDueOdo: 90000,
    nextDueDate: '2026-12-15',
    notes: 'Engine oil 15W40 synthetic, fuel filter, and coolant topped up.'
  },
  {
    id: 'm-3',
    vehicleId: 'v-102',
    vehiclePlate: 'KL-01-BK-8822',
    serviceType: 'Scheduled 40K Servicing & Wheel Alignment',
    garage: 'TVS Mobility Hub, Kazhakootam',
    serviceDate: '2026-09-10',
    odometer: 40200,
    cost: 5800,
    status: 'Completed',
    nextDueOdo: 50000,
    nextDueDate: '2027-03-10',
    notes: 'Full alignment, tire rotation, air filter cleaned.'
  }
];

export const INITIAL_WHATSAPP_ALERTS = [
  {
    id: 'wa-1',
    recipient: 'Alex Morgan (Admin) & Driver Rahul',
    phone: '+919847123456',
    plate: 'KL-07-CC-4090',
    docType: 'National Goods Permit',
    message: '⚠️ *FLEET ALERT:* National Goods Permit for vehicle *KL-07-CC-4090* expires in *5 days* (06-Oct-2026). Please renew immediately to avoid penalty.',
    sentAt: 'Today at 08:00 AM',
    status: 'Delivered',
    channel: 'WhatsApp'
  },
  {
    id: 'wa-2',
    recipient: 'Manager Priya Sharma',
    phone: '+919847000002',
    plate: 'KL-01-BK-8822',
    docType: 'Pollution Under Control (PUC)',
    message: '🚨 *URGENT EXPIRED:* PUC Certificate for *KL-01-BK-8822* expired on 28-Sep-2026. Vehicle should not operate without valid testing.',
    sentAt: 'Yesterday at 08:00 AM',
    status: 'Read',
    channel: 'WhatsApp'
  }
];

// Helper to calculate days remaining
export function getExpiryStatus(expiryDateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'Expired',
      badgeClass: 'badge-red',
      days: Math.abs(diffDays),
      label: `Expired ${Math.abs(diffDays)} days ago`
    };
  } else if (diffDays <= 30) {
    return {
      status: 'Expiring Soon',
      badgeClass: 'badge-yellow',
      days: diffDays,
      label: `${diffDays} days left`
    };
  } else {
    return {
      status: 'Valid',
      badgeClass: 'badge-green',
      days: diffDays,
      label: `${diffDays} days left`
    };
  }
}
