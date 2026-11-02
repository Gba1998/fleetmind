import React, { useState, useMemo } from 'react';
import { 
  BarChart2, Truck, Navigation, Wrench, FileText, Users, Fuel, MapPin, 
  PieChart as PieIcon, Settings, ShieldCheck, Sparkles, Calendar, Clock, 
  ChevronRight, ArrowUpRight, ArrowDownRight, CheckCircle, AlertTriangle, 
  XCircle, Search, Filter, Plus, Download, Upload, Eye, Check, RefreshCw, 
  MessageSquare, Send, User, Lock, Activity, DollarSign, ChevronLeft, Info, HelpCircle,
  FileCheck, AlertCircle, PlusCircle, ExternalLink
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, BarChart, Bar 
} from 'recharts';

// --- INITIAL MOCK DATA ---
const INITIAL_TENANTS = [
  { id: 't1', name: 'SOGEA-SATOM CI', country: 'Côte d\'Ivoire', currency: 'FCFA' },
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

const INITIAL_EQUIPMENT = [
  { id: 'EQ-101', name: '2021 Caterpillar 336D Excavatrice', type: 'ENGIN_BTP', immat: 'ENG-8821-CI', counterType: 'HOURS', counterValue: 4850, site: 'Autoroute du Nord', status: 'EN_SERVICE', driver: 'Kouassi Jean', avgCons: '28.5 L/h' },
  { id: 'EQ-102', name: '2020 Mercedes Actros 3340 Benne', type: 'CAMION', immat: 'AB-492-JK', counterType: 'KM', counterValue: 142500, site: 'Carrière Yopougon', status: 'EN_SERVICE', driver: 'Diallo Mamadou', avgCons: '38.2 L/100km' },
  { id: 'EQ-103', name: '2022 Toyota Hilux 4x4 Support', type: 'VEHICULE_LEGER', immat: 'CI-3009-XX', counterType: 'KM', counterValue: 89400, site: 'Base Vie San Pedro', status: 'EN_MAINTENANCE', driver: 'Yao Marc', avgCons: '14.8 L/100km' },
  { id: 'EQ-104', name: '2019 SDMO Groupe 250kVA', type: 'GENERATEUR', immat: 'GE-2022-04', counterType: 'HOURS', counterValue: 11200, site: 'Chantier Pont Bouaflé', status: 'EN_PANNE', driver: 'Traoré Bakary', avgCons: '32.0 L/h' },
  { id: 'EQ-105', name: '2021 Komatsu WA380 Chargeuse', type: 'ENGIN_BTP', immat: 'ENG-5011-CI', counterType: 'HOURS', counterValue: 6200, site: 'Carrière Yopougon', status: 'EN_SERVICE', driver: 'Samba Diop', avgCons: '22.1 L/h' },
  { id: 'EQ-106', name: '2023 Volvo FMX 440 Camion Malaxeur', type: 'CAMION', immat: 'CI-8812-ZZ', counterType: 'KM', counterValue: 34100, site: 'Centrale BRL Abidjan', status: 'EN_SERVICE', driver: 'Aka Norbert', avgCons: '41.0 L/100km' }
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

const INITIAL_GPS_TRACKS = [
  { id: 'GPS-01', immat: 'ENG-8821-CI', name: 'CAT 336D Excavatrice', speed: 0, status: 'ARRÊT_MOTEUR_ALLUMÉ', lat: '5.3599° N', lng: '-4.0083° W', fuel: '74%', lastUpdate: 'Il y a 2 min' },
  { id: 'GPS-02', immat: 'AB-492-JK', name: 'Mercedes Actros 3340', speed: 68, status: 'EN_DEPLACEMENT', lat: '5.4120° N', lng: '-3.9840° W', fuel: '52%', lastUpdate: 'À l\'instant' },
  { id: 'GPS-03', immat: 'CI-3009-XX', name: 'Toyota Hilux 4x4', speed: 0, status: 'A_L_ATELIER', lat: '5.3100° N', lng: '-4.0320° W', fuel: '38%', lastUpdate: 'Il y a 15 min' },
  { id: 'GPS-04', immat: 'CI-8812-ZZ', name: 'Volvo FMX 440 Malaxeur', speed: 42, status: 'EN_DEPLACEMENT', lat: '5.3850° N', lng: '-4.0150° W', fuel: '88%', lastUpdate: 'À l\'instant' }
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
  { id: 'FL-002', date: '2026-10-26', vehicle: 'Toyota Hilux 4x4', qty: '85 L', amount: 63750, station: 'Shell Yopougon', driver: 'Yao Marc', anomaly: true }
];

const INITIAL_USERS = [
  { id: 'USR-1', name: 'Sinan B.', email: 'sinan@fleetmind.io', role: 'ADM-E', site: 'Siège Principal', active: true },
  { id: 'USR-2', name: 'Kouadio Jean', email: 'k.jean@sogea.ci', role: 'GP', site: 'Chantier Autoroute', active: true },
  { id: 'USR-3', name: 'Alexandre Kouamé', email: 'a.kouame@sogea.ci', role: 'RM', site: 'Atelier Central', active: true },
  { id: 'USR-4', name: 'Awa Diop', email: 'a.diop@sogea.ci', role: 'RC', site: 'Base Logistique', active: true },
  { id: 'USR-5', name: 'Yao Marc', email: 'y.marc@sogea.ci', role: 'COND', site: 'Base San Pedro', active: true }
];

const EXPENSE_DONUT_DATA = [
  { name: 'Carburant', value: 42100000, color: '#3b82f6' },
  { name: 'Maintenance', value: 21500000, color: '#f59e0b' },
  { name: 'Assurance', value: 9200000, color: '#10b981' },
  { name: 'Pièces détachées', value: 7400000, color: '#8b5cf6' },
  { name: 'Amendes', value: 1800000, color: '#ef4444' },
  { name: 'Divers', value: 2196500, color: '#64748b' }
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

const MAINTENANCE_MANAGERS = [
  { id: 1, name: 'Alexandre Kouamé', spent: '91,0 M FCFA', count: '24 Interventions', progress: 85, color: 'bg-blue-500' },
  { id: 2, name: 'Marie Touré', spent: '24,2 M FCFA', count: '19 Interventions', progress: 55, color: 'bg-emerald-500' },
  { id: 3, name: 'Lucas Diallo', spent: '16,7 M FCFA', count: '12 Interventions', progress: 40, color: 'bg-amber-500' }
];

export default function FleetMindApp() {
  // Navigation & Role States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTenant, setCurrentTenant] = useState(INITIAL_TENANTS[0]);
  const [currentRole, setCurrentRole] = useState(INITIAL_ROLES[0]);
  const [timeRange, setTimeRange] = useState('01 Jan 2026 - 28 Oct 2026');

  // Interactive Data States
  const [equipments, setEquipments] = useState(INITIAL_EQUIPMENT);
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [maintenanceOrders, setMaintenanceOrders] = useState(INITIAL_MAINTENANCE_ORDERS);
  const [gpsTracks, setGpsTracks] = useState(INITIAL_GPS_TRACKS);
  const [rentals, setRentals] = useState(INITIAL_RENTALS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [fuelLogs, setFuelLogs] = useState(INITIAL_FUEL_LOGS);
  const [users, setUsers] = useState(INITIAL_USERS);

  // Modals & Selection States
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [showAddEqModal, setShowAddEqModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false);
  const [showAddFuelModal, setShowAddFuelModal] = useState(false);
  const [showAddRentalModal, setShowAddRentalModal] = useState(false);

  // AI Assistant Chat state
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'ai', text: 'Bonjour Sinan. Je suis votre Assistant Flotte FleetMind. J\'ai analysé la consommation de la période : 1 anomalie surconsommation sur le Hilux (EQ-103) à investiguer.' },
    { id: 2, sender: 'user', text: 'Quelle est la procédure conseillée pour l\'anomalie de surconsommation ?' },
    { id: 3, sender: 'ai', text: '1. Vérifier si un changement de chauffeur ou de chantier a eu lieu.\n2. Planifier un test de pression d\'injection à l\'Atelier Central.\n3. Bloquer le dépassement de carte carburant.' }
  ]);
  const [inputChat, setInputChat] = useState('');
  const [aiValidated, setAiValidated] = useState(false);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [scheduleViewMode, setScheduleViewMode] = useState('Day');

  // Format currency FCFA / USD
  const formatMoney = (val) => {
    if (currentTenant.currency === 'FCFA') {
      return `${val.toLocaleString('fr-FR')} FCFA`;
    }
    return `$${val.toLocaleString('en-US')}`;
  };

  // KPI Calculations
  const activeVehiclesCount = equipments.filter(e => e.status === 'EN_SERVICE').length;
  const inMaintenanceCount = equipments.filter(e => e.status === 'EN_MAINTENANCE' || e.status === 'EN_PANNE').length;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputChat.trim()) return;
    const newMsg = { id: Date.now(), sender: 'user', text: inputChat };
    setChatMessages(prev => [...prev, newMsg]);
    setInputChat('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Réponse FleetMind pour "${inputChat}" : Analyse télémetrique conforme aux exigences du Cahier des charges. Données validées.`
        }
      ]);
    }, 600);
  };

  // Handlers for maintenance status toggle
  const handleUpdateMaintenanceStatus = (id, newStatus) => {
    setMaintenanceOrders(prev => prev.map(order => {
      if (order.id === id) {
        return { ...order, status: newStatus };
      }
      return order;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans antialiased overflow-x-hidden">
      
      {/* ==================== LEFT SIDEBAR NAVIGATION ==================== */}
      <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/20">
                ⚡
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-wider text-white">FLITTEO</h1>
                <span className="text-[9px] font-bold uppercase text-orange-400 tracking-widest block -mt-1">FleetMind Intelligence</span>
              </div>
            </div>
          </div>

          {/* Tenant / Company Switcher */}
          <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/60">
            <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Entreprise (Multi-Tenant)</label>
            <select
              value={currentTenant.id}
              onChange={(e) => setCurrentTenant(INITIAL_TENANTS.find(t => t.id === e.target.value))}
              className="w-full bg-slate-800 text-xs text-slate-200 font-semibold border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              {INITIAL_TENANTS.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.country})</option>
              ))}
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
              { id: 'equipment', label: 'Véhicules & Engins', icon: Truck },
              { id: 'assignments', label: 'Ordres de mission', icon: Calendar, badge: assignments.length },
              { id: 'maintenance', label: 'Maintenance atelier', icon: Wrench, badge: inMaintenanceCount },
              { id: 'gps', label: 'Suivi GPS & Télématique', icon: MapPin },
              { id: 'fuel', label: 'Dépenses & Carburant', icon: Fuel },
              { id: 'rentals', label: 'Locations & Contrats', icon: FileText },
              { id: 'documents', label: 'Documents & Échéances', icon: FileCheck, badge: documents.filter(d => d.status !== 'VALID').length },
              { id: 'analytics', label: 'Analytics & Assistant IA', icon: Sparkles },
              { id: 'admin', label: 'Gestion des accès', icon: ShieldCheck }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm' 
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Role Switcher at Bottom */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 space-y-2">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400 uppercase font-bold">Rôle Utilisateur</span>
            <span className="font-mono text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">{currentRole.code}</span>
          </div>
          <select
            value={currentRole.code}
            onChange={(e) => setCurrentRole(INITIAL_ROLES.find(r => r.code === e.target.value))}
            className="w-full bg-slate-800 text-xs text-slate-200 font-medium border border-slate-700 rounded-lg px-2 py-1.5 focus:outline-none focus:border-orange-500"
          >
            {INITIAL_ROLES.map(r => (
              <option key={r.code} value={r.code}>{r.label}</option>
            ))}
          </select>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT WORKSPACE ==================== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-extrabold text-slate-100">
              {activeTab === 'dashboard' && 'FLITTEO Analytics'}
              {activeTab === 'equipment' && 'Gestion Référentiel Véhicules & Engins (H10)'}
              {activeTab === 'assignments' && 'Planning Affectations & Ordres de Mission'}
              {activeTab === 'maintenance' && 'Atelier & Ordres de Réparation'}
              {activeTab === 'gps' && 'Suivi Télématique GPS & Géofencing'}
              {activeTab === 'fuel' && 'Contrôle Carburant & Anomalies'}
              {activeTab === 'rentals' && 'Gestion des Contrats de Location'}
              {activeTab === 'documents' && 'Documents Administratifs & Alerte Échéances'}
              {activeTab === 'analytics' && 'Analytics Avancés & Assistant IA Side Drawer'}
              {activeTab === 'admin' && 'Matrice des Accès RBAC & Journal d\'Audit'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              <span>{timeRange}</span>
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center font-bold text-xs">
                SB
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-slate-200">Sinan B.</div>
                <div className="text-[10px] text-slate-400">{currentRole.code}</div>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <main className="p-6 space-y-6 flex-1">
          
          {/* ==================== TAB 1: DASHBOARD ==================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <button className="bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
                    <DollarSign className="w-3.5 h-3.5" /> Coûts
                  </button>
                  <button className="bg-slate-800 text-slate-300 font-semibold text-xs px-3 py-1.5 rounded-lg hover:bg-slate-700 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> Performance
                  </button>
                </div>
                <div className="text-xs font-semibold text-slate-400 flex items-center gap-2">
                  <span>Devise Locale :</span>
                  <span className="bg-slate-800 px-2 py-1 rounded font-mono text-orange-400 border border-slate-700">{currentTenant.currency}</span>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-400" /> Véhicules actifs
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-slate-100">{activeVehiclesCount * 20 + 24}</span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center"><ArrowUpRight className="w-3 h-3" /> +2.4%</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" /> Conducteurs actifs
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-slate-100">87</span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center"><ArrowUpRight className="w-3 h-3" /> +1.8%</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-400" /> Interventions en cours
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-extrabold text-slate-100">{inMaintenanceCount}</span>
                    <span className="text-xs text-rose-400 font-bold flex items-center"><ArrowDownRight className="w-3 h-3" /> -1.5%</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-400" /> Coût total période
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-extrabold text-slate-100">{formatMoney(84196500)}</span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center"><ArrowUpRight className="w-3 h-3" /> +3.1%</span>
                  </div>
                </div>
              </div>

              {/* Visual Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider">Répartition des dépenses</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                    <div className="h-56 w-full relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={EXPENSE_DONUT_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value">
                            {EXPENSE_DONUT_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Total Dépenses</span>
                        <span className="text-sm font-extrabold text-slate-100">{formatMoney(84196500)}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      {EXPENSE_DONUT_DATA.map(item => (
                        <div key={item.name} className="flex items-center justify-between border-b border-slate-800 pb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span className="text-slate-300">{item.name}</span>
                          </div>
                          <span className="font-mono text-slate-400 font-medium">{formatMoney(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider">Tendance des coûts</h3>
                  </div>
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={COST_TREND_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />
                        <YAxis stroke="#94a3b8" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                        <Line type="monotone" dataKey="costIndex" name="Coût moyen / véhicule" stroke="#3b82f6" strokeWidth={2.5} />
                        <Line type="monotone" dataKey="frequency" name="Fréquence interventions" stroke="#10b981" strokeWidth={2.5} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: VÉHICULES & ENGINS ==================== */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="relative flex-1 w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher engin, immatriculation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
                {['ADM-E', 'GP'].includes(currentRole.code) && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowImportModal(true)} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" /> Import CSV/Excel
                    </button>
                    <button onClick={() => setShowAddEqModal(true)} className="bg-orange-600 hover:bg-orange-500 text-slate-950 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow">
                      <Plus className="w-4 h-4" /> Nouvel Équipement
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equipments
                  .filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()) || e.immat.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(eq => (
                    <div key={eq.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-slate-700 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">{eq.type.replace('_', ' ')}</span>
                          <h3 className="font-extrabold text-sm text-slate-100">{eq.name}</h3>
                          <div className="text-xs font-mono text-slate-400">{eq.immat}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          eq.status === 'EN_SERVICE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                          eq.status === 'EN_MAINTENANCE' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {eq.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase font-bold">Compteur ({eq.counterType})</span>
                          <span className="font-bold font-mono text-slate-200">{eq.counterValue.toLocaleString()} {eq.counterType === 'HOURS' ? 'h' : 'km'}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] block uppercase font-bold">Chantier / Site</span>
                          <span className="text-slate-300 font-medium truncate block">{eq.site}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 3: ORDRES DE MISSION ==================== */}
          {activeTab === 'assignments' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-extrabold text-slate-100">Planning & Vehicle Assignments</h3>
                  </div>
                  <button onClick={() => setShowAddAssignmentModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-2 shadow">
                    <Plus className="w-4 h-4" /> Add Assignment
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
                <div className="min-w-[800px] p-4 divide-y divide-slate-800">
                  {assignments.map(asg => (
                    <div key={asg.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 font-bold text-xs">
                          {asg.startHour}:00 - {asg.endHour}:00
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-100">{asg.vehicleName}</div>
                          <div className="text-[11px] text-slate-400">Conducteur : {asg.driver}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded border border-orange-500/20">{asg.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==================== TAB 4: MAINTENANCE (100% FUNCTIONAL) ==================== */}
          {activeTab === 'maintenance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100">Ordres de Réparation & Entretien</h3>
                  <p className="text-xs text-slate-400">Suivi des interventions mécaniques, coûts et techniciens assignés.</p>
                </div>
                {['ADM-E', 'RM'].includes(currentRole.code) && (
                  <button onClick={() => setShowAddMaintenanceModal(true)} className="bg-orange-600 hover:bg-orange-500 text-slate-950 px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow">
                    <Plus className="w-4 h-4" /> Signaler Panne / Entretien
                  </button>
                )}
              </div>

              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">N° Ordre</th>
                      <th className="p-3.5">Équipement</th>
                      <th className="p-3.5">Type & Intervention</th>
                      <th className="p-3.5">Priorité</th>
                      <th className="p-3.5">Technicien</th>
                      <th className="p-3.5">Coût Estimé</th>
                      <th className="p-3.5">Statut</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                    {maintenanceOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-mono text-orange-400 font-bold">{order.id}</td>
                        <td className="p-3.5 font-bold text-slate-100">{order.vehicleName}</td>
                        <td className="p-3.5">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded mr-2 ${order.type === 'PANNE' ? 'bg-rose-500/20 text-rose-300' : 'bg-blue-500/20 text-blue-300'}`}>{order.type}</span>
                          {order.title}
                        </td>
                        <td className="p-3.5">
                          <span className={`font-bold text-[10px] ${order.priority === 'CRITIQUE' ? 'text-rose-400' : order.priority === 'HAUTE' ? 'text-amber-400' : 'text-slate-400'}`}>{order.priority}</span>
                        </td>
                        <td className="p-3.5">{order.tech}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-100">{formatMoney(order.cost)}</td>
                        <td className="p-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            order.status === 'TERMINE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                            order.status === 'EN_COURS' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          }`}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          {order.status !== 'TERMINE' && (
                            <button
                              onClick={() => handleUpdateMaintenanceStatus(order.id, 'TERMINE')}
                              className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2 py-1 rounded text-[10px] font-bold transition-colors"
                            >
                              Clôturer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== TAB 5: SUIVI GPS & TÉLÉMATIQUE ==================== */}
          {activeTab === 'gps' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100">Télématique GPS en Temps Réel</h3>
                  <p className="text-xs text-slate-400">Positionnement, vitesse et statut moteur des balises installées.</p>
                </div>
                <button onClick={() => setGpsTracks([...gpsTracks])} className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-700">
                  <RefreshCw className="w-3.5 h-3.5" /> Rafraîchir
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {gpsTracks.map(track => (
                  <div key={track.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-orange-400 font-bold">{track.immat}</span>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono">{track.lastUpdate}</span>
                    </div>
                    <div className="font-extrabold text-sm text-slate-100">{track.name}</div>
                    <div className="text-xs text-slate-400 space-y-1">
                      <div className="flex justify-between"><span>Vitesse:</span> <strong className="text-slate-200 font-mono">{track.speed} km/h</strong></div>
                      <div className="flex justify-between"><span>Réservoir:</span> <strong className="text-emerald-400 font-mono">{track.fuel}</strong></div>
                      <div className="flex justify-between"><span>Coordonnées:</span> <strong className="text-slate-300 font-mono">{track.lat}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 6: CARBURANT & DÉPENSES ==================== */}
          {activeTab === 'fuel' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100">Ravitaillements & Détection d'Anomalies</h3>
                  <p className="text-xs text-slate-400">Enregistrement manuel ou via cartes carburant avec contrôle IA des surconsommations.</p>
                </div>
                <button onClick={() => setShowAddFuelModal(true)} className="bg-orange-600 hover:bg-orange-500 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-2 shadow">
                  <Plus className="w-4 h-4" /> Saisir Plein Carburant
                </button>
              </div>

              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Véhicule</th>
                      <th className="p-3.5">Volume</th>
                      <th className="p-3.5">Montant Total</th>
                      <th className="p-3.5">Station</th>
                      <th className="p-3.5">Conducteur</th>
                      <th className="p-3.5">Détection Anomalie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                    {fuelLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-mono text-slate-400">{log.date}</td>
                        <td className="p-3.5 font-bold text-slate-100">{log.vehicle}</td>
                        <td className="p-3.5 font-mono text-blue-400 font-bold">{log.qty}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-100">{formatMoney(log.amount)}</td>
                        <td className="p-3.5">{log.station}</td>
                        <td className="p-3.5">{log.driver}</td>
                        <td className="p-3.5">
                          {log.anomaly ? (
                            <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-max border border-rose-500/30">
                              <AlertTriangle className="w-3 h-3" /> Écart +28%
                            </span>
                          ) : (
                            <span className="text-emerald-400 text-[10px] font-bold">Conforme</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== TAB 7: LOCATIONS & CONTRATS ==================== */}
          {activeTab === 'rentals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-100">Contrats de Location Externe</h3>
                  <p className="text-xs text-slate-400">Engins et véhicules loués auprès de prestataires tiers.</p>
                </div>
                <button onClick={() => setShowAddRentalModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-2 shadow">
                  <Plus className="w-4 h-4" /> Nouveau Contrat
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rentals.map(rental => (
                  <div key={rental.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-orange-400 font-bold">{rental.id}</span>
                        <h4 className="font-extrabold text-sm text-slate-100">{rental.equipment}</h4>
                        <div className="text-xs text-slate-400">{rental.supplier}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rental.status === 'EN_COURS' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        {rental.status}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-slate-500 block">Prix / Jour:</span><strong className="text-slate-200">{formatMoney(rental.dailyRate)}</strong></div>
                      <div><span className="text-slate-500 block">Total Engagement:</span><strong className="text-orange-400">{formatMoney(rental.totalCost)}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB 8: DOCUMENTS & ÉCHÉANCES ==================== */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <h3 className="text-sm font-extrabold text-slate-100">Registre des Documents Administratifs</h3>
                <p className="text-xs text-slate-400">Suivi des cartes grises, assurances, visites techniques et patentes avec alertes automatiques.</p>
              </div>

              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3.5">Véhicule</th>
                      <th className="p-3.5">Type Document</th>
                      <th className="p-3.5">Numéro Pièce</th>
                      <th className="p-3.5">Date d'Échéance</th>
                      <th className="p-3.5">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                    {documents.map(doc => (
                      <tr key={doc.id} className="hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-slate-100">{doc.vehicle}</td>
                        <td className="p-3.5">{doc.docType}</td>
                        <td className="p-3.5 font-mono text-slate-400">{doc.docNo}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-200">{doc.expiryDate}</td>
                        <td className="p-3.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            doc.status === 'VALID' ? 'bg-emerald-500/10 text-emerald-400' :
                            doc.status === 'ALERT_EXPIRING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {doc.status === 'VALID' ? 'Valide' : doc.status === 'ALERT_EXPIRING' ? 'Échéance Proche' : 'Expiré'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== TAB 9: ANALYTICS & IA ==================== */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold uppercase text-slate-300">Driven Kilometers / Engine Hours</h3>
                    <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-orange-400 font-mono">Telemetry Active</span>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={TELEMETRY_KM_DATA}>
                        <defs>
                          <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                        <Area type="monotone" dataKey="km" stroke="#3b82f6" fillOpacity={1} fill="url(#colorKm)" strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs text-slate-400 font-bold uppercase">Driving Behavior Score</span>
                    <div className="text-3xl font-extrabold text-emerald-400">84 / 100</div>
                    <p className="text-[11px] text-slate-500">Calculé à partir des accélérations brusques et surconsommations.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-xs text-slate-400 font-bold uppercase">Validation Humaine (Niv 2 IA)</span>
                    <div className="flex items-center gap-2 pt-1">
                      {aiValidated ? (
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded font-bold border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Synthèse Validée
                        </span>
                      ) : (
                        <button onClick={() => setAiValidated(true)} className="bg-orange-600 hover:bg-orange-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded shadow">
                          Valider la Synthèse IA
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Assistant Chat Drawer */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-[600px]">
                <div className="space-y-3 flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-400" />
                      <span className="font-extrabold text-xs text-slate-200">Assistant FleetMind (Aimy)</span>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-2 py-0.5 rounded-full font-bold">Online</span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`p-3 rounded-xl whitespace-pre-line leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white ml-6 font-semibold' : 'bg-slate-950 text-slate-300 border border-slate-800 mr-4'}`}>
                        {msg.text}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Posez une question sur le parc..."
                    value={inputChat}
                    onChange={e => setInputChat(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                  <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-slate-950 p-2 rounded-lg font-bold">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ==================== TAB 10: GESTION DES ACCÈS RBAC ==================== */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-100">Matrice de Contrôle d'Accès RBAC & Isolation Multi-Tenant</h3>
                    <p className="text-xs text-slate-400">Gestion des utilisateurs, des rôles stricts et conformité RG-ACC-01/02.</p>
                  </div>
                  <button className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1.5 rounded border border-slate-700 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> Mode Support FleetMind (Tracé)
                  </button>
                </div>

                <div className="bg-slate-950 rounded-lg p-4 border border-slate-800/80 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="pb-2">Utilisateur</th>
                        <th className="pb-2">Email</th>
                        <th className="pb-2">Rôle Attribué</th>
                        <th className="pb-2">Site Affecté</th>
                        <th className="pb-2 text-right">Statut Compte</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-900/50">
                          <td className="py-2.5 font-bold text-slate-100">{u.name}</td>
                          <td className="py-2.5 font-mono text-slate-400">{u.email}</td>
                          <td className="py-2.5">
                            <span className="font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded text-[10px] font-bold border border-orange-500/20">{u.role}</span>
                          </td>
                          <td className="py-2.5">{u.site}</td>
                          <td className="py-2.5 text-right">
                            <span className="text-emerald-400 font-bold text-[10px]">● Actif</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* ADD MAINTENANCE MODAL */}
      {showAddMaintenanceModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-100">Signaler un Ordre de Réparation</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const eq = equipments.find(x => x.id === fd.get('vehicleId'));
              const newOrder = {
                id: `OR-2026-00${maintenanceOrders.length + 1}`,
                vehicleId: eq.id,
                vehicleName: eq.name,
                type: fd.get('type'),
                title: fd.get('title'),
                status: 'EN_COURS',
                priority: fd.get('priority'),
                cost: parseInt(fd.get('cost')),
                tech: fd.get('tech'),
                date: '2026-10-28'
              };
              setMaintenanceOrders(prev => [newOrder, ...prev]);
              setShowAddMaintenanceModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Équipement Concerne</label>
                <select name="vehicleId" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200">
                  {equipments.map(e => <option key={e.id} value={e.id}>{e.name} ({e.immat})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Type Intervention</label>
                  <select name="type" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200">
                    <option value="PANNE">Panne Signalee</option>
                    <option value="CORRECTIF">Maintenance Corrective</option>
                    <option value="PREVENTIF">Entretien Preventif</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Priorité</label>
                  <select name="priority" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200">
                    <option value="MOYENNE">Moyenne</option>
                    <option value="HAUTE">Haute</option>
                    <option value="CRITIQUE">Critique</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Libelle de la Panne / Travaux</label>
                <input required name="title" placeholder="Ex: Remplacement injecteurs..." className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Cout Estime (FCFA)</label>
                  <input required type="number" name="cost" defaultValue="250000" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Technicien Assigne</label>
                  <input required name="tech" defaultValue="Alexandre Kouame" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200" />
                </div>
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddMaintenanceModal(false)} className="bg-slate-800 text-slate-300 px-4 py-2 rounded">Annuler</button>
                <button type="submit" className="bg-orange-600 text-slate-950 font-bold px-4 py-2 rounded">Creer l'Ordre</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD FUEL LOG MODAL */}
      {showAddFuelModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-100">Saisir un Ravitaillement Carburant</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const newLog = {
                id: `FL-${Date.now()}`,
                date: '2026-10-28',
                vehicle: fd.get('vehicle'),
                qty: `${fd.get('qty')} L`,
                amount: parseInt(fd.get('amount')),
                station: fd.get('station'),
                driver: fd.get('driver'),
                anomaly: false
              };
              setFuelLogs(prev => [newLog, ...prev]);
              setShowAddFuelModal(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Véhicule</label>
                <input required name="vehicle" placeholder="Ex: Mercedes Actros 3340" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Quantité (Litres)</label>
                  <input required type="number" name="qty" defaultValue="150" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Montant Total (FCFA)</label>
                  <input required type="number" name="amount" defaultValue="112500" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200" />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Station Service / Cuve</label>
                <input required name="station" defaultValue="TotalEnergies Treichville" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Nom du Conducteur</label>
                <input required name="driver" defaultValue="Diallo Mamadou" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-200" />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddFuelModal(false)} className="bg-slate-800 text-slate-300 px-4 py-2 rounded">Annuler</button>
                <button type="submit" className="bg-orange-600 text-slate-950 font-bold px-4 py-2 rounded">Enregistrer Plein</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}