import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  CheckCircle, AlertCircle, Info, X, Upload, Truck, Calendar, Wrench, 
  Fuel, FileText, FileCheck, User, Camera, Loader2, Image as ImageIcon
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import MobileBottomNav from './components/MobileBottomNav';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import { GpsVehicle } from './components/GpsMap';

// Backend API Service Client (Phase 2 SQLite / Express & Auth / Upload)
import { 
  checkBackendHealth, 
  getSavedToken, getSavedUser, getSavedTenant, clearSession, apiGetMe, apiUploadPhoto,
  apiGetEquipments, apiCreateEquipment, apiUpdateEquipmentStatus, apiDeleteEquipment,
  apiGetMaintenanceOrders, apiCreateMaintenanceOrder, apiUpdateMaintenanceOrderStatus,
  apiGetAssignments, apiCreateAssignment, apiDeleteAssignment,
  apiGetRentals, apiCreateRental, apiCloseRental,
  apiGetDocuments, apiCreateDocument, apiRenewDocument,
  apiGetFuelLogs, apiCreateFuelLog,
  apiGetUsers, apiCreateUser, apiToggleUser,
  apiGetGpsTracks, apiPingGps, apiSendChatMessage
} from './services/api';
import { enqueueOfflineAction, getEffectiveOnlineStatus } from './services/offlineSync';

// Views
import DashboardView from './views/DashboardView';
import EquipmentsView from './views/EquipmentsView';
import GpsFleetView from './views/GpsFleetView';
import MaintenanceView from './views/MaintenanceView';
import FuelCostsView from './views/FuelCostsView';
import OperationsView from './views/OperationsView';
import RentalsView from './views/RentalsView';
import DocumentsView from './views/DocumentsView';
import AnalyticsAiView from './views/AnalyticsAiView';
import AdminRbacView from './views/AdminRbacView';

// --- INITIAL MOCK DATA ---
const INITIAL_TENANTS = [
  { id: 't1', name: 'SOGEA-SATOM CI', country: "Côte d'Ivoire", currency: 'FCFA' },
  { id: 't2', name: 'BOLLORÉ MINES', country: 'Guinée', currency: 'USD' },
  { id: 't3', name: 'COLAS WEST AFRICA', country: 'Sénégal', currency: 'FCFA' }
];

const INITIAL_ROLES = [
  { code: 'ADM-E', label: 'Admin Entreprise (ADM-E)' },
  { code: 'GP', label: 'Gestionnaire de Parc (GP)' },
  { code: 'RM', label: 'Responsable Maintenance (RM)' },
  { code: 'RC', label: 'Responsable Carburant (RC)' },
  { code: 'COND', label: 'Conducteur / Opérateur (COND)' },
  { code: 'DIR', label: 'Direction (DIR)' },
  { code: 'ADM-PF', label: 'Admin FleetMind (ADM-PF)' }
];

export interface EquipmentItem {
  id: string;
  name: string;
  type: 'ENGIN_BTP' | 'CAMION' | 'VEHICULE_LEGER' | 'GENERATEUR';
  immat: string;
  counterType: 'HOURS' | 'KM';
  counterValue: number;
  site: string;
  status: 'EN_SERVICE' | 'EN_MAINTENANCE' | 'EN_PANNE';
  driver: string;
  avgCons: string;
  imageUrl?: string;
  brand?: string;
  model?: string;
  year?: number;
}

const INITIAL_EQUIPMENT: EquipmentItem[] = [
  { 
    id: 'EQ-101', 
    name: '2021 Caterpillar 336D Excavatrice', 
    type: 'ENGIN_BTP', 
    immat: 'ENG-8821-CI', 
    counterType: 'HOURS', 
    counterValue: 4850, 
    site: 'Autoroute du Nord PK18', 
    status: 'EN_SERVICE', 
    driver: 'Kouassi Jean', 
    avgCons: '28.5 L/h',
    imageUrl: '/images/equipments/excavator.jpg',
    brand: 'Caterpillar',
    model: '336D Hydraulic Crawler',
    year: 2021
  },
  { 
    id: 'EQ-102', 
    name: '2020 Mercedes Actros 3340 Benne', 
    type: 'CAMION', 
    immat: 'AB-492-JK', 
    counterType: 'KM', 
    counterValue: 142500, 
    site: 'Carrière Yopougon', 
    status: 'EN_SERVICE', 
    driver: 'Diallo Mamadou', 
    avgCons: '38.2 L/100km',
    imageUrl: '/images/equipments/dumptruck.jpg',
    brand: 'Mercedes-Benz',
    model: 'Actros 3340 6x4 Heavy Dump',
    year: 2020
  },
  { 
    id: 'EQ-103', 
    name: '2022 Toyota Hilux 4x4 Support', 
    type: 'VEHICULE_LEGER', 
    immat: 'CI-3009-XX', 
    counterType: 'KM', 
    counterValue: 89400, 
    site: 'Base Vie San Pedro', 
    status: 'EN_MAINTENANCE', 
    driver: 'Yao Marc', 
    avgCons: '14.8 L/100km',
    imageUrl: '/images/equipments/pickup.jpg',
    brand: 'Toyota',
    model: 'Hilux Double Cabine 2.8 D-4D',
    year: 2022
  },
  { 
    id: 'EQ-104', 
    name: '2019 SDMO Groupe 250kVA', 
    type: 'GENERATEUR', 
    immat: 'GE-2022-04', 
    counterType: 'HOURS', 
    counterValue: 11200, 
    site: 'Chantier Pont Bouaflé', 
    status: 'EN_PANNE', 
    driver: 'Traoré Bakary', 
    avgCons: '32.0 L/h',
    imageUrl: '/images/equipments/generator.jpg',
    brand: 'Kohler-SDMO',
    model: 'V250C2 Diesel Silent',
    year: 2019
  },
  { 
    id: 'EQ-105', 
    name: '2021 Komatsu WA380 Chargeuse', 
    type: 'ENGIN_BTP', 
    immat: 'ENG-5011-CI', 
    counterType: 'HOURS', 
    counterValue: 6200, 
    site: 'Carrière Yopougon Ouest', 
    status: 'EN_SERVICE', 
    driver: 'Samba Diop', 
    avgCons: '22.1 L/h',
    imageUrl: '/images/equipments/loader.jpg',
    brand: 'Komatsu',
    model: 'WA380-8 Wheel Loader',
    year: 2021
  },
  { 
    id: 'EQ-106', 
    name: '2023 Volvo FMX 440 Camion Malaxeur', 
    type: 'CAMION', 
    immat: 'CI-8812-ZZ', 
    counterType: 'KM', 
    counterValue: 34100, 
    site: 'Centrale BRL Abidjan', 
    status: 'EN_SERVICE', 
    driver: 'Aka Norbert', 
    avgCons: '41.0 L/100km',
    imageUrl: '/images/equipments/mixer.jpg',
    brand: 'Volvo Trucks',
    model: 'FMX 440 8x4 Concrete Mixer',
    year: 2023
  }
];

const INITIAL_ASSIGNMENTS = [
  { id: 'ASG-1', vehicleId: 'EQ-102', vehicleName: 'Mercedes Actros 3340', driver: 'Richard Hendricks', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', startHour: 6, endHour: 11, day: 'Jeu 5 Oct' },
  { id: 'ASG-2', vehicleId: 'EQ-103', vehicleName: 'Toyota Hilux 4x4', driver: 'Erlich Bachman', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', startHour: 9, endHour: 13, day: 'Jeu 5 Oct' },
  { id: 'ASG-3', vehicleId: 'EQ-103', vehicleName: 'Toyota Hilux 4x4', driver: 'Nelson Bighetti', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', startHour: 13, endHour: 17, day: 'Jeu 5 Oct' },
  { id: 'ASG-4', vehicleId: 'EQ-101', vehicleName: 'CAT 336D Excavatrice', driver: 'Monica Hall', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', startHour: 11, endHour: 15, day: 'Jeu 5 Oct' },
  { id: 'ASG-5', vehicleId: 'EQ-105', vehicleName: 'Komatsu WA380', driver: 'Jian Yang', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', startHour: 14, endHour: 18, day: 'Jeu 5 Oct' },
  { id: 'ASG-6', vehicleId: 'EQ-106', vehicleName: 'Volvo FMX 440', driver: 'Dinesh Chugtai', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40', startHour: 11, endHour: 15, day: 'Jeu 5 Oct' }
];

const INITIAL_MAINTENANCE_ORDERS = [
  { id: 'OR-2026-001', vehicleId: 'EQ-103', vehicleName: 'Toyota Hilux 4x4', type: 'CORRECTIF', title: 'Fuite liquide de frein & disques', status: 'EN_COURS', priority: 'HAUTE', cost: 350000, tech: 'Alexandre Kouamé', date: '2026-10-24' },
  { id: 'OR-2026-002', vehicleId: 'EQ-104', vehicleName: 'SDMO Groupe 250kVA', type: 'PANNE', title: 'Remplacement pompe à injection diesel', status: 'ATTENTE_PIECE', priority: 'CRITIQUE', cost: 1250000, tech: 'Lucas Diallo', date: '2026-10-26' },
  { id: 'OR-2026-003', vehicleId: 'EQ-101', vehicleName: 'CAT 336D Excavatrice', type: 'PREVENTIF', title: 'Vidange 500h + Filtres hydrauliques', status: 'TERMINE', priority: 'MOYENNE', cost: 480000, tech: 'Marie Touré', date: '2026-10-20' },
  { id: 'OR-2026-004', vehicleId: 'EQ-102', vehicleName: 'Mercedes Actros 3340', type: 'PREVENTIF', title: 'Graissage complet & Contrôle suspension', status: 'TERMINE', priority: 'BASSE', cost: 180000, tech: 'Alexandre Kouamé', date: '2026-10-18' }
];

const INITIAL_GPS_VEHICLES: GpsVehicle[] = [
  { 
    id: 'GPS-01', 
    immat: 'ENG-8821-CI', 
    name: 'CAT 336D Excavatrice', 
    type: 'ENGIN_BTP', 
    speed: 0, 
    status: 'ARRÊT_MOTEUR_ALLUMÉ', 
    lat: 5.3788, 
    lng: -4.0835, 
    fuel: '74.0%', 
    fuelPercent: 74.0,
    rpm: 1680,
    coolantTemp: 86,
    oilPressure: 4.6,
    engineHours: 4850.5,
    heading: 45,
    geofenceStatus: 'DANS_PERIMETRE',
    speedAlert: false,
    site: 'Fosse d\'Extraction Y1 (Front de taille)',
    driver: 'Kouassi Jean',
    lastUpdate: 'À l\'instant (Télématique)',
    trail: [[5.3786, -4.0838], [5.3788, -4.0835]]
  },
  { 
    id: 'GPS-02', 
    immat: 'AB-492-JK', 
    name: 'Mercedes Actros 3340', 
    type: 'CAMION', 
    speed: 38, 
    status: 'EN_DEPLACEMENT', 
    lat: 5.3875, 
    lng: -4.0590, 
    fuel: '52.0%', 
    fuelPercent: 52.0,
    rpm: 1720,
    coolantTemp: 89,
    oilPressure: 4.8,
    engineHours: 3210.2,
    heading: 65,
    geofenceStatus: 'SUR_PISTE',
    speedAlert: false,
    site: 'Piste Haul Road (Fosse - Concasseur)',
    driver: 'Diallo Mamadou',
    lastUpdate: 'À l\'instant (Télématique)',
    trail: [[5.3785, -4.0830], [5.3820, -4.0720], [5.3875, -4.0590]]
  },
  { 
    id: 'GPS-03', 
    immat: 'CI-3009-XX', 
    name: 'Toyota Hilux 4x4', 
    type: 'VEHICULE_LEGER', 
    speed: 0, 
    status: 'ARRÊT_MOTEUR_ALLUMÉ', 
    lat: 5.3425, 
    lng: -4.0150, 
    fuel: '38.0%', 
    fuelPercent: 38.0,
    rpm: 800,
    coolantTemp: 82,
    oilPressure: 3.8,
    engineHours: 1940.8,
    heading: 180,
    geofenceStatus: 'DANS_PERIMETRE',
    speedAlert: false,
    site: 'Base-Vie & Ateliers Centraux',
    driver: 'Yao Marc',
    lastUpdate: 'Il y a 30s',
    trail: [[5.3410, -4.0145], [5.3425, -4.0150]]
  },
  { 
    id: 'GPS-04', 
    immat: 'CI-8812-ZZ', 
    name: 'Volvo FMX 440 Malaxeur', 
    type: 'CAMION', 
    speed: 22, 
    status: 'EN_DEPLACEMENT', 
    lat: 5.4050, 
    lng: -4.0320, 
    fuel: '88.0%', 
    fuelPercent: 88.0,
    rpm: 1450,
    coolantTemp: 84,
    oilPressure: 4.4,
    engineHours: 1120.4,
    heading: 310,
    geofenceStatus: 'DANS_PERIMETRE',
    speedAlert: false,
    site: 'Station de Concassage & Centrale BRL',
    driver: 'Aka Norbert',
    lastUpdate: 'À l\'instant (Télématique)',
    trail: [[5.3990, -4.0250], [5.4050, -4.0320]]
  },
  { 
    id: 'GPS-05', 
    immat: 'ENG-5011-CI', 
    name: 'Komatsu WA380 Chargeuse', 
    type: 'ENGIN_BTP', 
    speed: 12, 
    status: 'EN_DEPLACEMENT', 
    lat: 5.3755, 
    lng: -4.0865, 
    fuel: '65.0%', 
    fuelPercent: 65.0,
    rpm: 1850,
    coolantTemp: 91,
    oilPressure: 4.5,
    engineHours: 6200.7,
    heading: 120,
    geofenceStatus: 'DANS_PERIMETRE',
    speedAlert: false,
    site: 'Fosse d\'Extraction Y1',
    driver: 'Samba Diop',
    lastUpdate: 'À l\'instant (Télématique)',
    trail: [[5.3745, -4.0870], [5.3755, -4.0865]]
  },
  { 
    id: 'GPS-06', 
    immat: 'GE-2022-04', 
    name: 'SDMO Groupe 250kVA', 
    type: 'GENERATEUR', 
    speed: 0, 
    status: 'ARRÊT_MOTEUR_ALLUMÉ', 
    lat: 5.3410, 
    lng: -4.0135, 
    fuel: '20.0%', 
    fuelPercent: 20.0,
    rpm: 1500,
    coolantTemp: 78,
    oilPressure: 4.2,
    engineHours: 11200.3,
    heading: 0,
    geofenceStatus: 'DANS_PERIMETRE',
    speedAlert: false,
    site: 'Base-Vie & Ateliers Centraux',
    driver: 'Traoré Bakary',
    lastUpdate: 'À l\'instant (Alimentation continue)',
    trail: [[5.3410, -4.0135]]
  }
];

const INITIAL_RENTALS = [
  { id: 'LOC-101', supplier: 'LOXAM West Africa', equipment: 'Nacelle Ciseau 18m Haulotte', dailyRate: 120000, totalCost: 1800000, startDate: '2026-10-01', endDate: '2026-10-15', status: 'TERMINE' },
  { id: 'LOC-102', supplier: 'BTP Location CI', equipment: 'Compacteur Dynapac CA250', dailyRate: 250000, totalCost: 7500000, startDate: '2026-10-10', endDate: '2026-11-10', status: 'EN_COURS' }
];

const INITIAL_DOCUMENTS = [
  { id: 'DOC-01', vehicle: 'Toyota Hilux (CI-3009-XX)', docType: 'Assurance Flotte', docNo: 'ASS-2026-9921', expiryDate: '2026-11-05', status: 'ALERT_EXPIRING' },
  { id: 'DOC-02', vehicle: 'Mercedes Actros (AB-492-JK)', docType: 'Visite Technique', docNo: 'VT-88392-CI', expiryDate: '2026-12-20', status: 'VALID' },
  { id: 'DOC-03', vehicle: 'SDMO Groupe (GE-2022-04)', docType: 'Certificat Conformité BTP', docNo: 'CERT-2025-01', expiryDate: '2026-10-15', status: 'EXPIRED' }
];

const INITIAL_FUEL_LOGS = [
  { id: 'FL-001', date: '2026-10-27', vehicle: 'Mercedes Actros 3340', qty: '320 L', amount: 240000, station: 'TotalEnergies Treichville', driver: 'Diallo Mamadou', anomaly: false },
  { id: 'FL-002', date: '2026-10-26', vehicle: 'Toyota Hilux 4x4', qty: '85 L', amount: 63750, station: 'Shell Yopougon', driver: 'Yao Marc', anomaly: true },
  { id: 'FL-003', date: '2026-10-25', vehicle: 'Volvo FMX 440 Malaxeur', qty: '290 L', amount: 217500, station: 'Oilibya Vridi', driver: 'Aka Norbert', anomaly: false }
];

const INITIAL_USERS = [
  { id: 'USR-1', name: 'Sinan B.', email: 'sinan@fleetmind.io', role: 'ADM-E', site: 'Siège Principal', active: true },
  { id: 'USR-2', name: 'Kouadio Jean', email: 'k.jean@sogea.ci', role: 'GP', site: 'Chantier Autoroute', active: true },
  { id: 'USR-3', name: 'Alexandre Kouamé', email: 'a.kouame@sogea.ci', role: 'RM', site: 'Atelier Central', active: true },
  { id: 'USR-4', name: 'Awa Diop', email: 'a.diop@sogea.ci', role: 'RC', site: 'Base Logistique', active: true },
  { id: 'USR-5', name: 'Yao Marc', email: 'y.marc@sogea.ci', role: 'COND', site: 'Base San Pedro', active: true }
];

const COST_TREND_DATA = [
  { month: 'Jan 2026', costIndex: 65, frequency: 40 },
  { month: 'Fév 2026', costIndex: 78, frequency: 52 },
  { month: 'Mar 2026', costIndex: 72, frequency: 44 },
  { month: 'Avr 2026', costIndex: 58, frequency: 38 },
  { month: 'Mai 2026', costIndex: 82, frequency: 48 },
  { month: 'Juin 2026', costIndex: 88, frequency: 42 }
];

const TELEMETRY_KM_DATA = [
  { month: 'Mars', km: 18000 },
  { month: 'Avril', km: 28000 },
  { month: 'Mai', km: 41000 },
  { month: 'Juin', km: 32000 },
  { month: 'Juil', km: 38000 },
  { month: 'Août', km: 26000 },
  { month: 'Sept', km: 35000 },
  { month: 'Oct', km: 31000 }
];

export default function FleetMindApp() {
  // Authentication State (False by default -> displays Mining Tech Premium Login)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Navigation & Role States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTenant, setCurrentTenant] = useState(INITIAL_TENANTS[0]);
  const [currentRole, setCurrentRole] = useState(INITIAL_ROLES[0]);
  const [dashboardSubView, setDashboardSubView] = useState<'costs' | 'perf' | 'cycle'>('costs');
  const [timeRange] = useState('01 Jan 2026 - 29 Oct 2026');

  // Interactive In-Memory Data States
  const [equipments, setEquipments] = useState<EquipmentItem[]>(INITIAL_EQUIPMENT);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [maintenanceOrders, setMaintenanceOrders] = useState(INITIAL_MAINTENANCE_ORDERS);
  const [gpsVehicles, setGpsVehicles] = useState<GpsVehicle[]>(INITIAL_GPS_VEHICLES);
  const [rentals, setRentals] = useState(INITIAL_RENTALS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [fuelLogs, setFuelLogs] = useState(INITIAL_FUEL_LOGS);
  const [users, setUsers] = useState(INITIAL_USERS);

  // Modals & Selection States
  const [showAddEqModal, setShowAddEqModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false);
  const [showAddFuelModal, setShowAddFuelModal] = useState(false);
  const [showAddRentalModal, setShowAddRentalModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // GPS Map Selection & Drawer
  const [selectedGpsVehicle, setSelectedGpsVehicle] = useState<GpsVehicle | null>(INITIAL_GPS_VEHICLES[0]);
  const [gpsStatusFilter, setGpsStatusFilter] = useState('ALL');
  const [gpsTypeFilter, setGpsTypeFilter] = useState('ALL');

  // CSV Import State
  const [csvParsedRows, setCsvParsedRows] = useState<any[]>([]);
  const [csvError, setCsvError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Photo Upload State (pour Ajout d'Équipement)
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);
  const [uploadPhotoError, setUploadPhotoError] = useState<string>('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadPhotoError('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadPhotoError('L\'image est trop volumineuse (limite : 10 Mo).');
      return;
    }

    setIsUploadingPhoto(true);
    setUploadPhotoError('');

    try {
      const url = await apiUploadPhoto(file);
      setUploadedPhotoUrl(url);
      showToast('Photo de l\'équipement téléversée avec succès !');
    } catch (err: any) {
      console.warn('Erreur téléversement API, bascule sur lecteur local:', err);
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedPhotoUrl(reader.result as string);
        showToast('Photo chargée en mémoire locale', 'info');
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Toast Notification System
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'info' | 'error' }[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: 'Bonjour Sinan. Je suis votre Assistant Flotte FleetMind. J\'ai analysé la consommation de la période : 1 anomalie surconsommation sur le Hilux (EQ-103) à investiguer.' },
    { id: 2, sender: 'user', text: 'Quelle est la procédure conseillée pour l\'anomalie de surconsommation ?' },
    { id: 3, sender: 'ai', text: '1. Vérifier si un changement de chauffeur ou de chantier a eu lieu.\n2. Planifier un test de pression d\'injection à l\'Atelier Central.\n3. Bloquer le dépassement de carte carburant.' }
  ]);
  const [inputChat, setInputChat] = useState('');
  const [aiValidated, setAiValidated] = useState(false);

  // Format currency FCFA / USD
  const formatMoney = (val: number) => {
    if (currentTenant.currency === 'FCFA') {
      return `${val.toLocaleString('fr-FR')} FCFA`;
    }
    return `$${val.toLocaleString('en-US')}`;
  };

  // Client-Side Real CSV Export Generator
  const downloadCsv = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [
      headers.join(';'),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(';'))
    ].join('\r\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Fichier exporté avec succès : ${filename}`, 'info');
  };

  // Dynamic KPI Calculations from Real In-Memory State
  const activeVehiclesCount = equipments.filter((e) => e.status === 'EN_SERVICE').length;
  const inMaintenanceCount = equipments.filter((e) => e.status === 'EN_MAINTENANCE' || e.status === 'EN_PANNE').length;
  const uniqueDriversCount = useMemo(() => {
    const drivers = new Set(equipments.map((e) => e.driver).filter(Boolean));
    return drivers.size;
  }, [equipments]);

  const totalFuelCost = useMemo(() => fuelLogs.reduce((acc, f) => acc + f.amount, 0), [fuelLogs]);
  const totalMaintCost = useMemo(() => maintenanceOrders.reduce((acc, m) => acc + m.cost, 0), [maintenanceOrders]);
  const totalRentalCost = useMemo(() => rentals.reduce((acc, r) => acc + r.totalCost, 0), [rentals]);
  const totalExpenses = totalFuelCost + totalMaintCost + totalRentalCost + 11000000;

  const dynamicExpenseDonut = useMemo(() => [
    { name: 'Carburant', value: totalFuelCost || 42100000, color: '#3b82f6' },
    { name: 'Maintenance & Ateliers', value: totalMaintCost || 21500000, color: '#FF8A00' },
    { name: 'Locations Externes', value: totalRentalCost || 9300000, color: '#8b5cf6' },
    { name: 'Assurance & Documents', value: 9200000, color: '#10B981' },
    { name: 'Divers & Péages', value: 2196500, color: '#8995A3' }
  ], [totalFuelCost, totalMaintCost, totalRentalCost]);

  // AI Chat Handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;
    const query = inputChat;
    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setChatMessages((prev) => [...prev, userMsg]);
    setInputChat('');

    setTimeout(() => {
      let reply = `Synthèse FleetMind : Votre flotte compte actuellement ${equipments.length} équipements dont ${activeVehiclesCount} en service et ${inMaintenanceCount} en atelier.`;
      if (query.toLowerCase().includes('panne') || query.toLowerCase().includes('maintenance')) {
        const critical = maintenanceOrders.filter((m) => m.priority === 'CRITIQUE');
        reply = `Rapport Atelier : ${critical.length} intervention(s) critique(s) en cours. Priorité immédiate : ${critical.map((c) => c.title).join(', ') || 'Aucune panne critique'}.`;
      } else if (query.toLowerCase().includes('carburant') || query.toLowerCase().includes('conso')) {
        const anom = fuelLogs.filter((f) => f.anomaly);
        reply = `Audit Carburant : ${anom.length} anomalie(s) de surconsommation détectée(s). Dernier véhicule concerné : ${anom[0]?.vehicle || 'Aucun'}.`;
      }
      setChatMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'ai', text: reply }]);
    }, 600);
  };

  // Restauration de session persistante (JWT dans localStorage)
  useEffect(() => {
    const token = getSavedToken();
    if (token) {
      apiGetMe().then((res) => {
        if (res && res.user) {
          setIsAuthenticated(true);
          if (res.user.role) {
            const r = INITIAL_ROLES.find((x) => x.code === res.user.role);
            if (r) setCurrentRole(r);
          }
          const savedTenant = getSavedTenant();
          if (savedTenant) {
            const t = INITIAL_TENANTS.find((x) => x.id === savedTenant.id);
            if (t) setCurrentTenant(t);
          }
          showToast(`Session active restaurée : ${res.user.name} (${res.user.role})`, 'info');
        }
      }).catch(() => {
        clearSession();
      });
    }
  }, []);

  // Synchronisation avec l'API Backend Express & SQLite
  useEffect(() => {
    let isMounted = true;
    async function syncBackend() {
      try {
        const isHealthy = await checkBackendHealth();
        if (isHealthy && isMounted) {
          const [eqs, orders, fuels, asgs, rents, docs, usrs] = await Promise.all([
            apiGetEquipments().catch(() => null),
            apiGetMaintenanceOrders().catch(() => null),
            apiGetFuelLogs().catch(() => null),
            apiGetAssignments().catch(() => null),
            apiGetRentals().catch(() => null),
            apiGetDocuments().catch(() => null),
            apiGetUsers().catch(() => null),
          ]);
          if (eqs && eqs.length > 0) setEquipments(eqs);
          if (orders && orders.length > 0) setMaintenanceOrders(orders);
          if (fuels && fuels.length > 0) setFuelLogs(fuels);
          if (asgs && asgs.length > 0) setAssignments(asgs);
          if (rents && rents.length > 0) setRentals(rents);
          if (docs && docs.length > 0) setDocuments(docs);
          if (usrs && usrs.length > 0) setUsers(usrs);
          showToast('Connecté à la base de données SQLite (API Express)', 'info');
        }
      } catch (e) {
        console.warn('Mode local en mémoire actif', e);
      }
    }
    syncBackend();
    return () => { isMounted = false; };
  }, []);

  // Status Toggles & Management Actions (with API sync)
  const handleUpdateMaintenanceStatus = (id: string, newStatus: string) => {
    const updated = maintenanceOrders.map((order) => order.id === id ? { ...order, status: newStatus } : order);
    setMaintenanceOrders(updated);
    apiUpdateMaintenanceOrderStatus(id, newStatus).catch(() => {});

    const targetOrder = maintenanceOrders.find((o) => o.id === id);
    if (targetOrder && newStatus === 'TERMINE') {
      // Vérifier si la machine a d'autres interventions actives en cours
      const hasOtherOpenOrders = updated.some(
        (o) => o.vehicleId === targetOrder.vehicleId && o.id !== id && o.status !== 'TERMINE'
      );
      if (!hasOtherOpenOrders) {
        // Remise en service opérationnel automatique !
        handleUpdateEquipmentStatus(targetOrder.vehicleId, 'EN_SERVICE');
        showToast(`Machine ${targetOrder.vehicleName} remise en service opérationnel !`, 'success');
      } else {
        showToast(`Ordre ${id} clôturé. Autres interventions en attente sur cet engin.`, 'info');
      }
    } else {
      showToast(`Ordre ${id} passé en ${newStatus.replace(/_/g, ' ')}`, 'info');
    }
  };

  const handleAutoGeneratePreventiveOrder = (eq: EquipmentItem) => {
    const isHours = eq.counterType === 'HOURS';
    const interval = isHours ? 500 : 15000;
    const remainder = eq.counterValue % interval;
    const nextMilestone = eq.counterValue + (interval - remainder);

    const newOrder = {
      id: `OR-2026-00${maintenanceOrders.length + 1}`,
      vehicleId: eq.id,
      vehicleName: eq.name,
      type: 'PREVENTIF',
      title: `Entretien Périodique ${nextMilestone.toLocaleString()} ${isHours ? 'h' : 'km'} (Vidange + Filtres)`,
      status: 'EN_COURS',
      priority: 'MOYENNE',
      cost: 380000,
      tech: 'Atelier Central (Alexandre K.)',
      date: new Date().toISOString().split('T')[0]
    };

    setMaintenanceOrders((prev) => [newOrder, ...prev]);
    apiCreateMaintenanceOrder(newOrder).catch(() => {});
    handleUpdateEquipmentStatus(eq.id, 'EN_MAINTENANCE');
    showToast(`Ordre préventif ${newOrder.id} généré pour ${eq.name} !`, 'success');
  };

  const handleUpdateEquipmentStatus = (id: string, newStatus: 'EN_SERVICE' | 'EN_MAINTENANCE' | 'EN_PANNE') => {
    setEquipments((prev) => prev.map((eq) => eq.id === id ? { ...eq, status: newStatus } : eq));
    apiUpdateEquipmentStatus(id, newStatus).catch(() => {});
    setGpsVehicles((prev) => prev.map((g) => {
      if (g.immat === equipments.find((e) => e.id === id)?.immat) {
        return {
          ...g,
          status: newStatus === 'EN_SERVICE' ? 'EN_DEPLACEMENT' : 'A_L_ATELIER',
          speed: newStatus === 'EN_SERVICE' ? 35 : 0
        };
      }
      return g;
    }));
    showToast(`Statut de ${id} passé en ${newStatus.replace(/_/g, ' ')}`);
  };

  const handleDeleteEquipment = (id: string) => {
    const eq = equipments.find((e) => e.id === id);
    if (confirm(`Confirmez-vous le retrait de l'équipement ${eq?.name || id} du parc ?`)) {
      setEquipments((prev) => prev.filter((e) => e.id !== id));
      setGpsVehicles((prev) => prev.filter((g) => g.immat !== eq?.immat));
      apiDeleteEquipment(id).catch(() => {});
      showToast(`Équipement ${id} retiré du parc.`, 'info');
    }
  };

  const handleRenewDocument = (id: string) => {
    setDocuments((prev) => prev.map((doc) => {
      if (doc.id === id) {
        return {
          ...doc,
          expiryDate: '2027-10-29',
          status: 'VALID'
        };
      }
      return doc;
    }));
    apiRenewDocument(id).catch(() => {});
    showToast(`Document ${id} renouvelé pour 1 an.`);
  };

  const handleFinishRental = (id: string) => {
    setRentals((prev) => prev.map((r) => r.id === id ? { ...r, status: 'TERMINE' } : r));
    apiCloseRental(id).catch(() => {});
    showToast(`Contrat de location ${id} clôturé.`);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    apiDeleteAssignment(id).catch(() => {});
    showToast(`Ordre de mission ${id} clôturé.`);
  };

  const handleToggleUser = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, active: !u.active } : u));
    apiToggleUser(id).catch(() => {});
    showToast(`Statut du collaborateur modifié.`);
  };

  // Controlled GPS Telemetry Simulation
  const handleSimulateGpsPing = () => {
    setGpsVehicles((prev) => prev.map((v) => {
      const deltaLat = (Math.random() - 0.5) * 0.003;
      const deltaLng = (Math.random() - 0.5) * 0.003;
      const newSpeed = v.status === 'EN_DEPLACEMENT' ? Math.max(10, Math.floor(v.speed + (Math.random() * 8 - 4))) : 0;
      return {
        ...v,
        lat: Number((v.lat + deltaLat).toFixed(4)),
        lng: Number((v.lng + deltaLng).toFixed(4)),
        speed: newSpeed,
        lastUpdate: 'À l\'instant (Ping Simulé)'
      };
    }));
    showToast('Ping télématique simulé : Positions actualisées sur la carte.', 'info');
  };

  // CSV File Reader
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setCsvError('Format non supporté. Veuillez sélectionner un fichier au format .csv uniquement.');
      setCsvParsedRows([]);
      return;
    }

    setCsvError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const lines = text.split(/\r\n|\n/).filter((line) => line.trim().length > 0);
        if (lines.length < 2) {
          setCsvError('Le fichier CSV est vide ou ne contient aucun en-tête.');
          return;
        }

        const delimiter = lines[0].includes(';') ? ';' : ',';
        const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, '').toLowerCase());

        const parsed = lines.slice(1).map((line, index) => {
          const cols = line.split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ''));
          const rowObj: any = {};
          headers.forEach((h, i) => {
            rowObj[h] = cols[i] || '';
          });
          return {
            id: `EQ-IMP-${Date.now() + index}`,
            name: rowObj.name || rowObj.nom || rowObj.modele || `Engin Importé #${index + 1}`,
            type: (['ENGIN_BTP', 'CAMION', 'VEHICULE_LEGER', 'GENERATEUR'].includes(rowObj.type?.toUpperCase()) ? rowObj.type.toUpperCase() : 'VEHICULE_LEGER') as any,
            immat: rowObj.immat || rowObj.immatriculation || `CI-IMP-${1000 + index}`,
            counterType: (rowObj.countertype?.toUpperCase() === 'HOURS' || rowObj.compteur_type?.toUpperCase() === 'HOURS') ? 'HOURS' : 'KM' as any,
            counterValue: Number(rowObj.countervalue || rowObj.compteur || 0),
            site: rowObj.site || rowObj.chantier || 'Base Principale',
            status: 'EN_SERVICE' as const,
            driver: rowObj.driver || rowObj.conducteur || 'Chauffeur Non Assigné',
            avgCons: rowObj.avgcons || '22.0 L/100km'
          };
        });

        setCsvParsedRows(parsed);
      } catch (err) {
        setCsvError('Erreur lors du traitement du fichier CSV.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (csvParsedRows.length === 0) return;
    setEquipments((prev) => [...csvParsedRows, ...prev]);
    showToast(`${csvParsedRows.length} équipements importés avec succès !`);
    setShowImportModal(false);
    setCsvParsedRows([]);
  };

  // IF NOT AUTHENTICATED -> RENDER PREMIUM MINING TECH LOGIN PAGE
  if (!isAuthenticated) {
    return (
      <>
        {/* TOASTS CONTAINER */}
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-3 ${
                toast.type === 'success'
                  ? 'bg-[#111820] border-[#10B981]/50 text-[#10B981] shadow-[#10B981]/10'
                  : toast.type === 'error'
                  ? 'bg-[#111820] border-[#EF4444]/50 text-[#EF4444] shadow-[#EF4444]/10'
                  : 'bg-[#111820] border-[#FF8A00]/50 text-[#FF8A00] shadow-[#FF8A00]/10'
              }`}
            >
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-[#FF8A00] shrink-0" />}
              <span className="text-xs font-semibold">{toast.message}</span>
            </div>
          ))}
        </div>

        <LoginPage
          tenants={INITIAL_TENANTS}
          currentTenant={currentTenant}
          onSelectTenant={(t) => {
            setCurrentTenant(t);
            showToast(`Organisation : ${t.name} (${t.currency})`, 'info');
          }}
          roles={INITIAL_ROLES}
          currentRole={currentRole}
          onSelectRole={(r) => {
            setCurrentRole(r);
            showToast(`Profil actif : ${r.label}`, 'info');
          }}
          onLogin={(sessionData) => {
            setIsAuthenticated(true);
            if (sessionData?.user) {
              const r = INITIAL_ROLES.find((x) => x.code === sessionData.user.role);
              if (r) setCurrentRole(r);
            }
            if (sessionData?.tenant) {
              const t = INITIAL_TENANTS.find((x) => x.id === sessionData.tenant.id);
              if (t) setCurrentTenant(t);
            }
            showToast(`Session ouverte : Bienvenue ${sessionData?.user?.name || currentRole.code}`);
          }}
        />
      </>
    );
  }

  // TITLES BY ACTIVE TAB
  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Poste de Contrôle des Opérations', subtitle: 'Synthèse télématique, disponibilité du parc et TCO consolidé.' },
    equipment: { title: 'Référentiel des Équipements & Engins BTP', subtitle: 'Inventaire des matériels, compteurs heures/km et historique machine.' },
    gps: { title: 'Supervision Télématique GPS en Temps Réel', subtitle: 'Géolocalisation, vitesses et état de fonctionnement des balises.' },
    assignments: { title: 'Planning des Missions & Affectations', subtitle: 'Attribution des conducteurs et créneaux horaires d\'exploitation.' },
    maintenance: { title: 'Gestion de l\'Atelier & Maintenance Lourde', subtitle: 'Ordres de réparation, pièces détachées et immobilisation des machines.' },
    fuel: { title: 'Contrôle Carburant & Détection des Dérives', subtitle: 'Ravitaillements aux cuves de chantier et détection de surconsommation.' },
    rentals: { title: 'Gestion des Contrats de Location Externe', subtitle: 'Suivi des engins tiers, prestataires et engagements budgétaires.' },
    documents: { title: 'Registre Documentaire & Alertes Réglementaires', subtitle: 'Assurances, visites techniques et certificats de conformité minière.' },
    analytics: { title: 'Analytique Opérationnelle & Assistant IA', subtitle: 'Indicateurs d\'éco-conduite et synthèse automatisée de la flotte.' },
    admin: { title: 'Matrice des Accès RBAC & Rôles Industriels', subtitle: 'Administration des collaborateurs et cloisonnement des données.' },
  };

  const activePageInfo = pageTitles[activeTab] || { title: 'FleetMind Operations', subtitle: '' };

  return (
    <div className="min-h-screen bg-[#08111F] text-[#F4F6F8] flex flex-col lg:flex-row font-sans antialiased overflow-x-hidden relative">
      
      {/* TOAST NOTIFICATIONS */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-3 ${
              toast.type === 'success'
                ? 'bg-[#111820] border-[#10B981]/50 text-[#10B981] shadow-[#10B981]/10'
                : toast.type === 'error'
                ? 'bg-[#111820] border-[#EF4444]/50 text-[#EF4444] shadow-[#EF4444]/10'
                : 'bg-[#111820] border-[#FF8A00]/50 text-[#FF8A00] shadow-[#FF8A00]/10'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-[#10B981] shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#FF8A00] shrink-0" />}
            <span className="text-xs font-semibold">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* LEFT SIDEBAR NAVIGATION (DESKTOP >= lg) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        tenants={INITIAL_TENANTS}
        currentTenant={currentTenant}
        onSelectTenant={(t) => {
          setCurrentTenant(t);
          showToast(`Entité active : ${t.name}`, 'info');
        }}
        roles={INITIAL_ROLES}
        currentRole={currentRole}
        onSelectRole={(r) => {
          setCurrentRole(r);
          showToast(`Profil : ${r.label}`, 'info');
        }}
        onLogout={() => {
          clearSession();
          setIsAuthenticated(false);
          showToast('Session fermée avec succès.', 'info');
        }}
        inMaintenanceCount={inMaintenanceCount}
        assignmentsCount={assignments.length}
        equipmentsCount={equipments.length}
        documentsExpiringCount={documents.filter((d) => d.status !== 'VALID').length}
        fuelAnomaliesCount={fuelLogs.filter((f) => f.anomaly).length}
        rentalsCount={rentals.filter((r) => r.status === 'EN_COURS').length}
      />

      {/* MOBILE BOTTOM NAVIGATION BAR (SMARTPHONE < lg) */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        tenants={INITIAL_TENANTS}
        currentTenant={currentTenant}
        onSelectTenant={(t) => {
          setCurrentTenant(t);
          showToast(`Entité active : ${t.name}`, 'info');
        }}
        roles={INITIAL_ROLES}
        currentRole={currentRole}
        onSelectRole={(r) => {
          setCurrentRole(r);
          showToast(`Profil : ${r.label}`, 'info');
        }}
        onLogout={() => {
          clearSession();
          setIsAuthenticated(false);
          showToast('Session fermée avec succès.', 'info');
        }}
        inMaintenanceCount={inMaintenanceCount}
        assignmentsCount={assignments.length}
        equipmentsCount={equipments.length}
        documentsExpiringCount={documents.filter((d) => d.status !== 'VALID').length}
        fuelAnomaliesCount={fuelLogs.filter((f) => f.anomaly).length}
        rentalsCount={rentals.filter((r) => r.status === 'EN_COURS').length}
      />

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          title={activePageInfo.title}
          subtitle={activePageInfo.subtitle}
          timeRange={timeRange}
          currentRole={currentRole}
          currentTenant={currentTenant}
          onLogout={() => {
            clearSession();
            setIsAuthenticated(false);
            showToast('Session fermée avec succès.', 'info');
          }}
          onNavigateTab={setActiveTab}
          fuelAnomaliesCount={fuelLogs.filter((f) => f.anomaly).length}
          criticalAlertsCount={maintenanceOrders.filter((m) => m.priority === 'CRITIQUE' && m.status !== 'TERMINE').length}
          documentsExpiringCount={documents.filter((d) => d.status !== 'VALID').length}
        />

        <main className="p-4 sm:p-6 space-y-6 flex-1 pb-24 lg:pb-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              equipments={equipments}
              gpsVehicles={gpsVehicles}
              activeVehiclesCount={activeVehiclesCount}
              inMaintenanceCount={inMaintenanceCount}
              uniqueDriversCount={uniqueDriversCount}
              totalExpenses={totalExpenses}
              totalMaintCost={totalMaintCost}
              totalFuelCost={totalFuelCost}
              totalRentalCost={totalRentalCost}
              tenantName={currentTenant.name}
              formatMoney={formatMoney}
              dynamicExpenseDonut={dynamicExpenseDonut}
              costTrendData={COST_TREND_DATA}
              subView={dashboardSubView}
              onSetSubView={setDashboardSubView}
              onNavigateTab={setActiveTab}
              onSelectGpsVehicle={(v) => {
                setSelectedGpsVehicle(v);
                setActiveTab('gps');
              }}
              criticalAlertsCount={maintenanceOrders.filter((m) => m.priority === 'CRITIQUE').length}
              fuelAnomaliesCount={fuelLogs.filter((f) => f.anomaly).length}
              documentsExpiringCount={documents.filter((d) => d.status !== 'VALID').length}
            />
          )}

          {activeTab === 'equipment' && (
            <EquipmentsView
              equipments={equipments}
              currentRole={currentRole}
              tenantName={currentTenant.name}
              onAddEquipment={() => setShowAddEqModal(true)}
              onImportCsv={() => setShowImportModal(true)}
              onExportCsv={() =>
                downloadCsv(
                  `flotte_equipements_${Date.now()}.csv`,
                  ['ID', 'Nom', 'Type', 'Immatriculation', 'Compteur Type', 'Valeur Compteur', 'Chantier', 'Statut', 'Conducteur', 'Conso Moyenne'],
                  equipments.map((e) => [e.id, e.name, e.type, e.immat, e.counterType, e.counterValue, e.site, e.status, e.driver, e.avgCons])
                )
              }
              onUpdateStatus={handleUpdateEquipmentStatus}
              onDeleteEquipment={handleDeleteEquipment}
              onViewOnMap={(immat) => {
                const target = gpsVehicles.find((g) => g.immat === immat);
                if (target) {
                  setSelectedGpsVehicle(target);
                  setActiveTab('gps');
                } else {
                  showToast(`Balise non localisée pour ${immat}`, 'info');
                }
              }}
            />
          )}

          {activeTab === 'gps' && (
            <GpsFleetView
              vehicles={gpsVehicles}
              onUpdateVehicles={setGpsVehicles}
              selectedVehicle={selectedGpsVehicle}
              onSelectVehicle={setSelectedGpsVehicle}
              statusFilter={gpsStatusFilter}
              onSetStatusFilter={setGpsStatusFilter}
              typeFilter={gpsTypeFilter}
              onSetTypeFilter={setGpsTypeFilter}
              onSimulatePing={handleSimulateGpsPing}
              onRequestMaintenanceOrder={(vehicleId, vehicleName, reason) => {
                setShowAddMaintenanceModal(true);
                showToast(`Ordre d'atelier ouvert pour ${vehicleName} (${reason})`, 'info');
              }}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceView
              orders={maintenanceOrders}
              equipments={equipments}
              currentRole={currentRole}
              onAddOrder={() => setShowAddMaintenanceModal(true)}
              onUpdateStatus={handleUpdateMaintenanceStatus}
              onAutoGeneratePreventiveOrder={handleAutoGeneratePreventiveOrder}
              onExportCsv={() =>
                downloadCsv(
                  `ordres_maintenance_${Date.now()}.csv`,
                  ['N Ordre', 'ID Machine', 'Nom Machine', 'Type', 'Libelle', 'Statut', 'Priorite', 'Cout', 'Technicien', 'Date'],
                  maintenanceOrders.map((m) => [m.id, m.vehicleId, m.vehicleName, m.type, m.title, m.status, m.priority, m.cost, m.tech, m.date])
                )
              }
              formatMoney={formatMoney}
            />
          )}

          {activeTab === 'fuel' && (
            <FuelCostsView
              logs={fuelLogs}
              onAddFuelLog={() => setShowAddFuelModal(true)}
              onRequestMaintenanceOrder={(vehicleName, reason) => {
                setShowAddMaintenanceModal(true);
                showToast(`Ordre de contrôle ouvert pour ${vehicleName} (${reason})`, 'info');
              }}
              onAcknowledgeAnomaly={(logId) => {
                setFuelLogs((prev) => prev.map((f) => (f.id === logId ? { ...f, anomaly: false } : f)));
                showToast('Anomalie carburant acquittée.', 'info');
              }}
              onExportCsv={() =>
                downloadCsv(
                  `registre_carburant_${Date.now()}.csv`,
                  ['Date', 'Vehicule', 'Volume', 'Montant', 'Station', 'Conducteur', 'Anomalie'],
                  fuelLogs.map((f) => [f.date, f.vehicle, f.qty, f.amount, f.station, f.driver, f.anomaly ? 'OUI' : 'NON'])
                )
              }
              formatMoney={formatMoney}
            />
          )}

          {activeTab === 'assignments' && (
            <OperationsView
              assignments={assignments}
              onAddAssignment={() => setShowAddAssignmentModal(true)}
              onDeleteAssignment={handleDeleteAssignment}
              onExportCsv={() =>
                downloadCsv(
                  `planning_missions_${Date.now()}.csv`,
                  ['ID Mission', 'Vehicule', 'Conducteur', 'Debut (h)', 'Fin (h)', 'Jour'],
                  assignments.map((a) => [a.id, a.vehicleName, a.driver, a.startHour, a.endHour, a.day])
                )
              }
            />
          )}

          {activeTab === 'rentals' && (
            <RentalsView
              rentals={rentals}
              onAddRental={() => setShowAddRentalModal(true)}
              onFinishRental={handleFinishRental}
              formatMoney={formatMoney}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsView
              documents={documents}
              onAddDocument={() => setShowAddDocumentModal(true)}
              onRenewDocument={handleRenewDocument}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsAiView
              telemetryData={TELEMETRY_KM_DATA}
              aiValidated={aiValidated}
              onValidateAi={() => {
                setAiValidated(true);
                showToast('Recommandations IA validées et archivées.');
              }}
              chatMessages={chatMessages}
              inputChat={inputChat}
              onSetInputChat={setInputChat}
              onSendMessage={handleSendMessage}
            />
          )}

          {activeTab === 'admin' && (
            <AdminRbacView
              users={users}
              onAddUser={() => setShowAddUserModal(true)}
              onToggleUser={handleToggleUser}
              onTriggerSupportMode={() => showToast('Mode Support tracé avec journalisation renforcée.', 'info')}
            />
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* ============================ MODALES UNIFIÉES =========================== */}
      {/* ========================================================================= */}

      {/* 1. NOUVEL ÉQUIPEMENT */}
      {showAddEqModal && (
        <div className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111820] border border-[#8995A3]/25 rounded-xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#8995A3]/20 pb-3">
              <h3 className="text-base font-extrabold text-[#F4F6F8] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#FF8A00]" /> Ajouter un Équipement au Parc
              </h3>
              <button onClick={() => { setShowAddEqModal(false); setUploadedPhotoUrl(''); setUploadPhotoError(''); }} className="text-[#8995A3] hover:text-[#F4F6F8] cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const immat = String(fd.get('immat') || '').trim().toUpperCase();
              
              if (equipments.some((x) => x.immat === immat)) {
                showToast(`Une machine avec l'immatriculation ${immat} existe déjà !`, 'error');
                return;
              }

              const eqType = String(fd.get('type') || 'VEHICULE_LEGER') as any;
              const defaultImages: Record<string, string> = {
                ENGIN_BTP: '/images/equipments/excavator.jpg',
                CAMION: '/images/equipments/dumptruck.jpg',
                VEHICULE_LEGER: '/images/equipments/pickup.jpg',
                GENERATEUR: '/images/equipments/generator.jpg'
              };
              const customImg = String(fd.get('imageUrl') || '').trim();
              const finalImageUrl = uploadedPhotoUrl || customImg || defaultImages[eqType] || '/images/equipments/pickup.jpg';

              const newEq: EquipmentItem = {
                id: `EQ-${Math.floor(107 + Math.random() * 900)}`,
                name: String(fd.get('name') || ''),
                type: eqType,
                immat,
                counterType: String(fd.get('counterType') || 'KM') as any,
                counterValue: parseInt(String(fd.get('counterValue') || '0'), 10),
                site: String(fd.get('site') || 'Base Centrale'),
                status: 'EN_SERVICE',
                driver: String(fd.get('driver') || 'Chauffeur Non Assigné'),
                avgCons: String(fd.get('avgCons') || '25.0 L/100km'),
                imageUrl: finalImageUrl,
                brand: String(fd.get('brand') || 'Industriel'),
                model: String(fd.get('model') || 'Standard'),
                year: parseInt(String(fd.get('year') || '2023'), 10)
              };

              setEquipments((prev) => [newEq, ...prev]);
              apiCreateEquipment(newEq).catch(() => {});

              const newGps: GpsVehicle = {
                id: `GPS-${Date.now()}`,
                immat: newEq.immat,
                name: newEq.name,
                type: newEq.type,
                speed: 0,
                status: 'ARRÊT_MOTEUR_ALLUMÉ',
                lat: 5.35 + (Math.random() - 0.5) * 0.05,
                lng: -4.01 + (Math.random() - 0.5) * 0.05,
                fuel: '100%',
                lastUpdate: 'À l\'instant (Simulé)',
                driver: newEq.driver,
                site: newEq.site
              };
              setGpsVehicles((prev) => [newGps, ...prev]);

              showToast(`Équipement ${newEq.name} (${newEq.immat}) enregistré !`);
              setShowAddEqModal(false);
              setUploadedPhotoUrl('');
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Désignation du Matériel</label>
                <input required name="name" placeholder="Ex: 2022 Komatsu PC210 Pelle sur chenilles" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Catégorie</label>
                  <select name="type" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer">
                    <option value="ENGIN_BTP">Engin BTP (Pelle, Chargeuse...)</option>
                    <option value="CAMION">Camion Benne / Malaxeur</option>
                    <option value="VEHICULE_LEGER">Véhicule Léger (4x4)</option>
                    <option value="GENERATEUR">Groupe Électrogène</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Immatriculation / N° Parc</label>
                  <input required name="immat" placeholder="CI-7740-XX" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Unité Compteur</label>
                  <select name="counterType" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer">
                    <option value="KM">Kilomètres (KM)</option>
                    <option value="HOURS">Heures Moteur (Heures)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Valeur Initiale</label>
                  <input required type="number" name="counterValue" defaultValue="15000" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Affectation Chantier</label>
                  <input required name="site" defaultValue="Carrière Yopougon" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
                </div>
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Conducteur Assigné</label>
                  <input required name="driver" defaultValue="Kouassi Jean" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Consommation Indicative</label>
                <input name="avgCons" defaultValue="28.0 L/100km" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
              </div>

              {/* Téléversement de Photo Réelle (Local / Téléphone) */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[#8995A3] font-bold font-mono text-[11px] uppercase flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#FF8A00]" /> Photo de l'Équipement (Upload Fichier)
                  </span>
                  {uploadedPhotoUrl && (
                    <span className="text-[#10B981] text-[10px] flex items-center gap-1 font-mono">
                      <CheckCircle className="w-3 h-3" /> Photo prête
                    </span>
                  )}
                </label>

                <div className="flex items-center gap-3">
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="flex-1 border border-dashed border-[#8995A3]/30 hover:border-[#FF8A00] bg-[#08111F]/60 rounded-lg p-2.5 flex items-center justify-center gap-2 cursor-pointer transition-colors group"
                  >
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileChange}
                      className="hidden"
                    />
                    {isUploadingPhoto ? (
                      <div className="flex items-center gap-2 text-amber-400 font-medium">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Téléversement en cours vers le serveur...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[#8995A3] group-hover:text-[#F4F6F8]">
                        <Upload className="w-4 h-4 text-[#FF8A00]" />
                        <span className="text-xs">
                          {uploadedPhotoUrl ? 'Changer la photo sélectionnée' : 'Sélectionner une photo depuis votre PC / Mobile'}
                        </span>
                      </div>
                    )}
                  </div>

                  {uploadedPhotoUrl && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#FF8A00]/40 shrink-0 bg-[#08111F]">
                      <img
                        src={uploadedPhotoUrl}
                        alt="Aperçu engin"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedPhotoUrl('');
                        }}
                        className="absolute top-0 right-0 bg-[#08111F]/90 text-[#EF4444] p-0.5 rounded-bl hover:bg-[#EF4444] hover:text-white"
                        title="Retirer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {uploadPhotoError && (
                  <p className="text-[11px] text-[#EF4444] font-medium">{uploadPhotoError}</p>
                )}
                <p className="text-[10px] text-[#8995A3]">
                  Formats acceptés : JPG, PNG, WEBP (max 10 Mo). Si aucune photo n'est choisie, l'illustration par défaut sera affectée.
                </p>
              </div>

              <div className="pt-3 border-t border-[#8995A3]/20 flex justify-end gap-2">
                <button type="button" onClick={() => { setShowAddEqModal(false); setUploadedPhotoUrl(''); setUploadPhotoError(''); }} className="bg-[#172231] text-[#8995A3] hover:text-[#F4F6F8] px-4 py-2 rounded font-semibold cursor-pointer">Annuler</button>
                <button type="submit" className="bg-[#FF8A00] text-[#08111F] font-bold px-4 py-2 rounded cursor-pointer">Enregistrer la Machine</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. IMPORT CSV */}
      {showImportModal && (
        <div className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111820] border border-[#8995A3]/25 rounded-xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#8995A3]/20 pb-3">
              <h3 className="text-base font-extrabold text-[#F4F6F8] flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" /> Importer des Équipements par Fichier CSV
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-[#8995A3] hover:text-[#F4F6F8] cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-200">
              <strong className="block mb-1">Format pris en charge :</strong>
              Fichiers tabulaires au format <code>.csv</code> (séparateur virgule ou point-virgule).
              <span className="block text-[11px] text-[#8995A3] mt-1 font-mono">Le format Excel natif .xlsx n'est pas pris en charge dans cette version.</span>
            </div>

            <div className="border-2 border-dashed border-[#8995A3]/30 hover:border-[#FF8A00] rounded-xl p-6 text-center space-y-2 cursor-pointer bg-[#08111F]/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" accept=".csv" onChange={handleCsvFileChange} className="hidden" />
              <Upload className="w-8 h-8 text-[#8995A3] mx-auto opacity-70" />
              <div className="text-xs font-bold text-[#F4F6F8]">Cliquez pour sélectionner un fichier CSV</div>
              <div className="text-[11px] text-[#8995A3] font-mono">Colonnes : nom, type, immatriculation, compteur, site, conducteur</div>
            </div>

            {csvError && (
              <div className="text-xs font-semibold text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 p-2.5 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {csvError}
              </div>
            )}

            {csvParsedRows.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#10B981] font-mono flex items-center justify-between">
                  <span>{csvParsedRows.length} machine(s) détectée(s) prêtes à l'import :</span>
                </div>
                <div className="max-h-36 overflow-y-auto border border-[#8995A3]/20 rounded-lg bg-[#08111F] p-2 space-y-1 text-[11px]">
                  {csvParsedRows.map((r, i) => (
                    <div key={i} className="flex justify-between items-center text-[#F4F6F8] border-b border-[#8995A3]/10 pb-1">
                      <span><strong>{r.name}</strong> ({r.immat})</span>
                      <span className="font-mono text-[#FF8A00]">{r.site}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-[#8995A3]/20 flex justify-end gap-2">
              <button type="button" onClick={() => setShowImportModal(false)} className="bg-[#172231] text-[#8995A3] hover:text-[#F4F6F8] px-4 py-2 rounded text-xs font-semibold cursor-pointer">Annuler</button>
              <button type="button" disabled={csvParsedRows.length === 0} onClick={handleConfirmImport} className="bg-blue-600 disabled:opacity-40 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded text-xs cursor-pointer">
                Confirmer l'Importation ({csvParsedRows.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. NOUVELLE MISSION */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111820] border border-[#8995A3]/25 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#8995A3]/20 pb-3">
              <h3 className="text-base font-extrabold text-[#F4F6F8] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#10B981]" /> Créer un Ordre de Mission
              </h3>
              <button onClick={() => setShowAddAssignmentModal(false)} className="text-[#8995A3] hover:text-[#F4F6F8] cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const vehicleId = String(fd.get('vehicleId') || '');
              const eq = equipments.find((x) => x.id === vehicleId);

              const newAsg = {
                id: `ASG-${assignments.length + 1}`,
                vehicleId,
                vehicleName: eq ? eq.name : 'Véhicule',
                driver: String(fd.get('driver') || 'Chauffeur'),
                color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                startHour: parseInt(String(fd.get('startHour') || '8'), 10),
                endHour: parseInt(String(fd.get('endHour') || '16'), 10),
                day: String(fd.get('day') || 'Aujourd\'hui')
              };

              setAssignments((prev) => [newAsg, ...prev]);
              apiCreateAssignment(newAsg).catch(() => {});
              showToast(`Mission enregistrée pour ${newAsg.driver}`);
              setShowAddAssignmentModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Sélectionner le Véhicule</label>
                <select name="vehicleId" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer">
                  {equipments.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.immat})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Nom du Conducteur</label>
                <input required name="driver" defaultValue="Diallo Mamadou" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Heure Début (06 - 20h)</label>
                  <input required type="number" min="6" max="20" name="startHour" defaultValue="8" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
                </div>
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Heure Fin (07 - 22h)</label>
                  <input required type="number" min="7" max="22" name="endHour" defaultValue="16" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Jour de Mission</label>
                <input required name="day" defaultValue="Aujourd'hui" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
              </div>

              <div className="pt-3 border-t border-[#8995A3]/20 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddAssignmentModal(false)} className="bg-[#172231] text-[#8995A3] hover:text-[#F4F6F8] px-4 py-2 rounded font-semibold cursor-pointer">Annuler</button>
                <button type="submit" className="bg-[#10B981] text-[#08111F] font-bold px-4 py-2 rounded cursor-pointer">Valider la Mission</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. AJOUT ORDRE MAINTENANCE */}
      {showAddMaintenanceModal && (
        <div className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111820] border border-[#8995A3]/25 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#8995A3]/20 pb-3">
              <h3 className="text-base font-extrabold text-[#F4F6F8] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#FF8A00]" /> Signaler un Ordre de Réparation
              </h3>
              <button onClick={() => setShowAddMaintenanceModal(false)} className="text-[#8995A3] hover:text-[#F4F6F8] cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const vehicleId = String(fd.get('vehicleId') || '');
              const eq = equipments.find((x) => x.id === vehicleId);

              const newOrder = {
                id: `OR-2026-00${maintenanceOrders.length + 1}`,
                vehicleId: eq ? eq.id : vehicleId,
                vehicleName: eq ? eq.name : vehicleId,
                type: String(fd.get('type') || 'CORRECTIF'),
                title: String(fd.get('title') || ''),
                status: 'EN_COURS',
                priority: String(fd.get('priority') || 'MOYENNE'),
                cost: parseInt(String(fd.get('cost') || '0'), 10),
                tech: String(fd.get('tech') || 'Atelier Central'),
                date: '2026-10-29'
              };

              setMaintenanceOrders((prev) => [newOrder, ...prev]);
              if (!getEffectiveOnlineStatus()) {
                enqueueOfflineAction('MAINTENANCE_ORDER', newOrder);
                showToast(`Zone Blanche Fosse : Ordre ${newOrder.id} stocké en cache local (attente synchro).`, 'info');
              } else {
                apiCreateMaintenanceOrder(newOrder).catch(() => {
                  enqueueOfflineAction('MAINTENANCE_ORDER', newOrder);
                });
                showToast(`Ordre ${newOrder.id} émis pour ${newOrder.vehicleName}`);
              }
              if (eq) {
                handleUpdateEquipmentStatus(eq.id, 'EN_MAINTENANCE');
              }
              setShowAddMaintenanceModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Équipement Concerne</label>
                <select name="vehicleId" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer">
                  {equipments.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.immat})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Type d'Intervention</label>
                  <select name="type" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer">
                    <option value="PANNE">Panne Signalee</option>
                    <option value="CORRECTIF">Maintenance Corrective</option>
                    <option value="PREVENTIF">Entretien Preventif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Priorité</label>
                  <select name="priority" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer">
                    <option value="MOYENNE">Moyenne</option>
                    <option value="HAUTE">Haute</option>
                    <option value="CRITIQUE">Critique</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Libellé des Travaux</label>
                <input required name="title" placeholder="Ex: Réfection vérins et circuits hydrauliques..." className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Coût Estimé ({currentTenant.currency})</label>
                  <input required type="number" name="cost" defaultValue="250000" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
                </div>
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Technicien Assigné</label>
                  <input required name="tech" defaultValue="Alexandre Kouamé" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
                </div>
              </div>

              <div className="pt-3 border-t border-[#8995A3]/20 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddMaintenanceModal(false)} className="bg-[#172231] text-[#8995A3] hover:text-[#F4F6F8] px-4 py-2 rounded font-semibold cursor-pointer">Annuler</button>
                <button type="submit" className="bg-[#FF8A00] text-[#08111F] font-bold px-4 py-2 rounded cursor-pointer">Créer le Bon Atelier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. SAISIE PLEIN CARBURANT */}
      {showAddFuelModal && (
        <div className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111820] border border-[#8995A3]/25 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#8995A3]/20 pb-3">
              <h3 className="text-base font-extrabold text-[#F4F6F8] flex items-center gap-2">
                <Fuel className="w-5 h-5 text-[#FF8A00]" /> Enregistrer un Ravitaillement
              </h3>
              <button onClick={() => setShowAddFuelModal(false)} className="text-[#8995A3] hover:text-[#F4F6F8] cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const qtyNum = parseInt(String(fd.get('qty') || '0'), 10);
              const vehicleStr = String(fd.get('vehicle') || '');

              // Algorithme d'audit automatique des dérives carburant (> 20%)
              const isLight = vehicleStr.toLowerCase().includes('hilux') || vehicleStr.toLowerCase().includes('pickup');
              const isHeavy = vehicleStr.toLowerCase().includes('actros') || vehicleStr.toLowerCase().includes('fmx');
              const isAnomaly = isLight ? qtyNum > 80 : isHeavy ? qtyNum > 360 : qtyNum > 450;

              const newLog = {
                id: `FL-${Date.now()}`,
                date: '2026-10-29',
                vehicle: vehicleStr,
                qty: `${qtyNum} L`,
                amount: parseInt(String(fd.get('amount') || '0'), 10),
                station: String(fd.get('station') || 'Cuve Centrale'),
                driver: String(fd.get('driver') || 'Chauffeur de Quart'),
                anomaly: isAnomaly
              };

              setFuelLogs((prev) => [newLog, ...prev]);
              if (!getEffectiveOnlineStatus()) {
                enqueueOfflineAction('FUEL_LOG', newLog);
                showToast(`Zone Blanche Fosse : Ravitaillement ${newLog.qty} stocké en cache local (attente synchro).`, 'info');
              } else {
                apiCreateFuelLog(newLog).catch(() => {
                  enqueueOfflineAction('FUEL_LOG', newLog);
                });
                if (isAnomaly) {
                  showToast(`Alerte Carburant : Surconsommation anormale détectée sur ${newLog.vehicle} !`, 'error');
                } else {
                  showToast(`Ravitaillement de ${newLog.qty} enregistré avec succès.`);
                }
              }
              setShowAddFuelModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Sélectionner l'Équipement</label>
                <select name="vehicle" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer">
                  {equipments.map((e) => <option key={e.id} value={`${e.name} (${e.immat})`}>{e.name} ({e.immat})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Quantité (Litres)</label>
                  <input required type="number" name="qty" defaultValue="180" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
                </div>
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Montant Total ({currentTenant.currency})</label>
                  <input required type="number" name="amount" defaultValue="135000" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Station / Cuve Chantier</label>
                <input required name="station" defaultValue="Cuve Chantier Yopougon" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
              </div>

              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Nom du Chauffeur</label>
                <input required name="driver" defaultValue="Diallo Mamadou" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
              </div>

              <div className="pt-3 border-t border-[#8995A3]/20 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddFuelModal(false)} className="bg-[#172231] text-[#8995A3] hover:text-[#F4F6F8] px-4 py-2 rounded font-semibold cursor-pointer">Annuler</button>
                <button type="submit" className="bg-[#FF8A00] text-[#08111F] font-bold px-4 py-2 rounded cursor-pointer">Valider le Plein</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. NOUVEAU CONTRAT LOCATION */}
      {showAddRentalModal && (
        <div className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111820] border border-[#8995A3]/25 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#8995A3]/20 pb-3">
              <h3 className="text-base font-extrabold text-[#F4F6F8] flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" /> Nouveau Contrat de Location
              </h3>
              <button onClick={() => setShowAddRentalModal(false)} className="text-[#8995A3] hover:text-[#F4F6F8] cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const daily = parseInt(String(fd.get('dailyRate') || '0'), 10);
              const days = parseInt(String(fd.get('days') || '15'), 10);

              const newRent = {
                id: `LOC-${103 + rentals.length}`,
                supplier: String(fd.get('supplier') || ''),
                equipment: String(fd.get('equipment') || ''),
                dailyRate: daily,
                totalCost: daily * days,
                startDate: '2026-10-29',
                endDate: '2026-11-20',
                status: 'EN_COURS'
              };

              setRentals((prev) => [newRent, ...prev]);
              apiCreateRental(newRent).catch(() => {});
              showToast(`Contrat enregistré : ${newRent.equipment}`);
              setShowAddRentalModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Loueur BTP / Prestataire</label>
                <input required name="supplier" defaultValue="LOXAM West Africa" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
              </div>

              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Désignation Matériel</label>
                <input required name="equipment" placeholder="Ex: Grue Mobile Liebherr LTM 1050" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Prix / Jour ({currentTenant.currency})</label>
                  <input required type="number" name="dailyRate" defaultValue="180000" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
                </div>
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Durée (Jours)</label>
                  <input required type="number" name="days" defaultValue="20" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
                </div>
              </div>

              <div className="pt-3 border-t border-[#8995A3]/20 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddRentalModal(false)} className="bg-[#172231] text-[#8995A3] hover:text-[#F4F6F8] px-4 py-2 rounded font-semibold cursor-pointer">Annuler</button>
                <button type="submit" className="bg-blue-600 text-white font-bold px-4 py-2 rounded cursor-pointer">Valider le Contrat</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. ENREGISTRER DOCUMENT LÉGAL */}
      {showAddDocumentModal && (
        <div className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111820] border border-[#8995A3]/25 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#8995A3]/20 pb-3">
              <h3 className="text-base font-extrabold text-[#F4F6F8] flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#FF8A00]" /> Enregistrer une Pièce Légale
              </h3>
              <button onClick={() => setShowAddDocumentModal(false)} className="text-[#8995A3] hover:text-[#F4F6F8] cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const expiry = String(fd.get('expiryDate') || '2026-12-31');

              const newDoc = {
                id: `DOC-${String(documents.length + 1).padStart(2, '0')}`,
                vehicle: String(fd.get('vehicle') || ''),
                docType: String(fd.get('docType') || 'Assurance Flotte'),
                docNo: String(fd.get('docNo') || 'PIECE-2026-01'),
                expiryDate: expiry,
                status: 'VALID'
              };

              setDocuments((prev) => [newDoc, ...prev]);
              apiCreateDocument(newDoc).catch(() => {});
              showToast(`Document ${newDoc.docType} enregistré.`);
              setShowAddDocumentModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Véhicule Associé</label>
                <select name="vehicle" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer">
                  {equipments.map((e) => <option key={e.id} value={`${e.name} (${e.immat})`}>{e.name} ({e.immat})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Type de Pièce</label>
                <select name="docType" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer">
                  <option value="Assurance Flotte">Assurance Flotte</option>
                  <option value="Visite Technique">Contrôle / Visite Technique</option>
                  <option value="Certificat Conformité BTP">Certificat de Conformité BTP</option>
                  <option value="Carte Grise">Carte Grise</option>
                  <option value="Patente d'Exploitation">Patente d'Exploitation Carrière</option>
                </select>
              </div>

              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Numéro de la Pièce</label>
                <input required name="docNo" placeholder="ASS-2026-88192" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
              </div>

              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Date d'Expiration</label>
                <input required type="date" name="expiryDate" defaultValue="2027-04-15" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
              </div>

              <div className="pt-3 border-t border-[#8995A3]/20 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddDocumentModal(false)} className="bg-[#172231] text-[#8995A3] hover:text-[#F4F6F8] px-4 py-2 rounded font-semibold cursor-pointer">Annuler</button>
                <button type="submit" className="bg-[#FF8A00] text-[#08111F] font-bold px-4 py-2 rounded cursor-pointer">Enregistrer Pièce</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. NOUVEL UTILISATEUR */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111820] border border-[#8995A3]/25 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-[#8995A3]/20 pb-3">
              <h3 className="text-base font-extrabold text-[#F4F6F8] flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF8A00]" /> Ajouter un Collaborateur
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-[#8995A3] hover:text-[#F4F6F8] cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const newUser = {
                id: `USR-${users.length + 1}`,
                name: String(fd.get('name') || ''),
                email: String(fd.get('email') || ''),
                role: String(fd.get('role') || 'GP'),
                site: String(fd.get('site') || 'Siège Principal'),
                active: true
              };

              setUsers((prev) => [...prev, newUser]);
              apiCreateUser(newUser).catch(() => {});
              showToast(`Compte créé pour ${newUser.name} (${newUser.role})`);
              setShowAddUserModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Nom Complet</label>
                <input required name="name" placeholder="Kouamé Patrick" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
              </div>

              <div>
                <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Adresse E-mail</label>
                <input required type="email" name="email" placeholder="p.kouame@sogea.ci" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] font-mono focus:border-[#FF8A00] outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Rôle Attribué</label>
                  <select name="role" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer">
                    {INITIAL_ROLES.map((r) => <option key={r.code} value={r.code}>{r.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#8995A3] mb-1 font-bold font-mono text-[11px] uppercase">Affectation Base</label>
                  <input required name="site" defaultValue="Base Centrale Abidjan" className="w-full bg-[#08111F] border border-[#8995A3]/30 rounded p-2.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none" />
                </div>
              </div>

              <div className="pt-3 border-t border-[#8995A3]/20 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddUserModal(false)} className="bg-[#172231] text-[#8995A3] hover:text-[#F4F6F8] px-4 py-2 rounded font-semibold cursor-pointer">Annuler</button>
                <button type="submit" className="bg-[#FF8A00] text-[#08111F] font-bold px-4 py-2 rounded cursor-pointer">Créer l'Utilisateur</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
