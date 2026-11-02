import React, { useState } from 'react';
import { 
  Search, Plus, Download, Fuel, AlertTriangle, CheckCircle, 
  TrendingUp, ShieldAlert, ArrowRight, X, Wrench, User, MapPin, 
  Clock, DollarSign, Activity, FileText, Database, Radio, 
  Layers, Gauge, ArrowDownUp, RefreshCw
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';
import { FuelSmartIcon, TcoSmartIcon, ImmobilizationSmartIcon } from '../components/ui/SmartDashboardIcons';

export interface FuelLog {
  id: string;
  date: string;
  vehicle: string;
  qty: string;
  amount: number;
  station: string;
  driver: string;
  anomaly: boolean;
}

export interface FuelTank {
  id: string;
  name: string;
  site: string;
  type: 'CUVE_FIXE' | 'CITERNE_MOBILE';
  capacity: number;       // Litres
  currentLevel: number;   // Litres
  minThreshold: number;   // Seuil alerte en Litres
  supplier: string;
  lastDeliveryDate: string;
  lastDeliveryQty: number;
  flowRate: string;
  sensorStatus: 'ONLINE' | 'OFFLINE';
}

export interface FuelReconciliationItem {
  id: string;
  period: string;
  tankId: string;
  tankName: string;
  initialStock: number;
  deliveredVolume: number; // Volume livré BL Fournisseur
  pumpedVolume: number;    // Volume distribué dans les engins
  actualStock: number;     // Jauge télématique réelle mesurée
  variance: number;        // Différence réelle vs théorique
  varianceRate: number;    // Pourcentage d'écart
  lossCost: number;        // Valeur FCFA de la perte
  status: 'CONFORME' | 'ALERTE_COULAGE';
}

const INITIAL_TANKS: FuelTank[] = [
  {
    id: 'TANK-01',
    name: 'Cuve Fixe Principale Aérienne',
    site: 'Base-Vie PK18 (Autoroute du Nord)',
    type: 'CUVE_FIXE',
    capacity: 50000,
    currentLevel: 34200,
    minThreshold: 10000,
    supplier: 'TotalEnergies CI',
    lastDeliveryDate: '26 Oct 2026',
    lastDeliveryQty: 20000,
    flowRate: '140 L/min',
    sensorStatus: 'ONLINE'
  },
  {
    id: 'TANK-02',
    name: 'Citerne Mobile Ravitailleur Piste 4x4',
    site: 'Fosse Sud Carrière Yopougon',
    type: 'CITERNE_MOBILE',
    capacity: 15000,
    currentLevel: 9800,
    minThreshold: 3000,
    supplier: 'Shell Mining CI',
    lastDeliveryDate: '28 Oct 2026',
    lastDeliveryQty: 8000,
    flowRate: '95 L/min',
    sensorStatus: 'ONLINE'
  },
  {
    id: 'TANK-03',
    name: 'Cuve Tampon Atelier & Concassage',
    site: 'Carrière Yopougon',
    type: 'CUVE_FIXE',
    capacity: 30000,
    currentLevel: 5400,
    minThreshold: 8000,
    supplier: 'Puma Energy',
    lastDeliveryDate: '22 Oct 2026',
    lastDeliveryQty: 12000,
    flowRate: '110 L/min',
    sensorStatus: 'ONLINE'
  }
];

const INITIAL_RECONCILIATION: FuelReconciliationItem[] = [
  {
    id: 'REC-W43-01',
    period: 'Semaine 43 (21-27 Oct 2026)',
    tankId: 'TANK-01',
    tankName: 'Cuve Principale Base-Vie PK18',
    initialStock: 28000,
    deliveredVolume: 20000,
    pumpedVolume: 13650,
    actualStock: 34200,
    variance: -150,
    varianceRate: -0.4,
    lossCost: 112500,
    status: 'CONFORME'
  },
  {
    id: 'REC-W43-02',
    period: 'Semaine 43 (21-27 Oct 2026)',
    tankId: 'TANK-02',
    tankName: 'Citerne Mobile Piste Fosse',
    initialStock: 6500,
    deliveredVolume: 8000,
    pumpedVolume: 4620,
    actualStock: 9800,
    variance: -80,
    varianceRate: -0.8,
    lossCost: 60000,
    status: 'CONFORME'
  },
  {
    id: 'REC-W43-03',
    period: 'Semaine 43 (21-27 Oct 2026)',
    tankId: 'TANK-03',
    tankName: 'Cuve Tampon Carrière Yopougon',
    initialStock: 12000,
    deliveredVolume: 10000,
    pumpedVolume: 14500,
    actualStock: 5400,
    variance: -2100,
    varianceRate: -28.0,
    lossCost: 1575000,
    status: 'ALERTE_COULAGE'
  }
];

interface FuelCostsViewProps {
  logs: FuelLog[];
  onAddFuelLog: () => void;
  onExportCsv: () => void;
  formatMoney: (val: number) => string;
  onRequestMaintenanceOrder?: (vehicleName: string, reason: string) => void;
  onAcknowledgeAnomaly?: (logId: string) => void;
}

export const FuelCostsView: React.FC<FuelCostsViewProps> = ({
  logs,
  onAddFuelLog,
  onExportCsv,
  formatMoney,
  onRequestMaintenanceOrder,
  onAcknowledgeAnomaly,
}) => {
  const [subTab, setSubTab] = useState<'ravitaillements' | 'cuves' | 'rapprochement'>('ravitaillements');
  const [search, setSearch] = useState('');
  const [anomalyOnly, setAnomalyOnly] = useState(false);
  const [investigatedLog, setInvestigatedLog] = useState<FuelLog | null>(null);
  const [tanks, setTanks] = useState<FuelTank[]>(INITIAL_TANKS);
  const [reconciliations, setReconciliations] = useState<FuelReconciliationItem[]>(INITIAL_RECONCILIATION);
  const [selectedReconciliation, setSelectedReconciliation] = useState<FuelReconciliationItem | null>(null);

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      log.station.toLowerCase().includes(search.toLowerCase()) ||
      log.driver.toLowerCase().includes(search.toLowerCase());
    const matchesAnomaly = !anomalyOnly || log.anomaly;
    return matchesSearch && matchesAnomaly;
  });

  const totalLitres = logs.reduce((acc, f) => acc + parseInt(f.qty.replace(/\D/g, '') || '0', 10), 0);
  const totalAmount = logs.reduce((acc, f) => acc + f.amount, 0);
  const anomaliesCount = logs.filter((f) => f.anomaly).length;

  const totalTankCapacity = tanks.reduce((acc, t) => acc + t.capacity, 0);
  const totalTankStock = tanks.reduce((acc, t) => acc + t.currentLevel, 0);
  const globalFillPercentage = Math.round((totalTankStock / totalTankCapacity) * 100);

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. SÉLECTEUR DE SOUS-ONGLETS CARBURANT                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111820] p-3 rounded-xl border border-[#8995A3]/20 shadow">
        <div className="flex items-center gap-1.5 bg-[#08111F] p-1 rounded-lg border border-[#8995A3]/25 font-mono text-xs">
          <button
            type="button"
            onClick={() => setSubTab('ravitaillements')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'ravitaillements'
                ? 'bg-[#FF8A00] text-[#08111F] shadow'
                : 'text-[#8995A3] hover:text-[#F4F6F8]'
            }`}
          >
            <Fuel className="w-3.5 h-3.5" />
            <span>Ravitaillements & Engins</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('cuves')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'cuves'
                ? 'bg-[#FF8A00] text-[#08111F] shadow'
                : 'text-[#8995A3] hover:text-[#F4F6F8]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Cuves & Citernes Mobiles</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('rapprochement')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'rapprochement'
                ? 'bg-[#FF8A00] text-[#08111F] shadow'
                : 'text-[#8995A3] hover:text-[#F4F6F8]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Audit Coulage & Anti-Vol</span>
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-mono">
          <span className="text-[#8995A3] hidden md:inline">Stock Cuves Chantiers :</span>
          <span className="bg-[#172231] px-2.5 py-1 rounded border border-[#8995A3]/30 text-[#10B981] font-bold">
            {totalTankStock.toLocaleString()} L ({globalFillPercentage}%)
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RUBAN KPI DU CARBURANT (AVEC ICÔNES SMART 3D)                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Volume Carburant Consommé"
          value={`${totalLitres.toLocaleString()} Litres`}
          subValue="Approvisionnement conforme aux quotas"
          customIconBadge={<FuelSmartIcon />}
          trend="+1.2%"
          trendPositive={true}
          accentColor="#38BDF8"
        />

        <StatCard
          label="Dépenses Globales Carburant"
          value={formatMoney(totalAmount)}
          subValue="Prix moyen : 750 FCFA / Litre gazole"
          customIconBadge={<TcoSmartIcon />}
          trend="-2.4% vs M-1"
          trendPositive={true}
          accentColor="#FF8A00"
        />

        <StatCard
          label="Anomalies de Surconsommation"
          value={`${anomaliesCount} Détectée(s)`}
          subValue={anomaliesCount > 0 ? "Dérive > 20% par rapport à la norme" : "Aucune dérive constatée"}
          customIconBadge={<ImmobilizationSmartIcon />}
          trend={anomaliesCount > 0 ? "Alerte Dérive" : "Conforme"}
          trendPositive={anomaliesCount === 0}
          accentColor={anomaliesCount > 0 ? "#EF4444" : "#10B981"}
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. SOUS-ONGLET A : REGISTRE DES RAVITAILLEMENTS ET AUDIT                  */}
      {/* ========================================================================= */}
      {subTab === 'ravitaillements' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Barre de Filtres et Saisie */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#111820] p-4 rounded-xl border border-[#8995A3]/20">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8995A3]" />
                <input
                  type="text"
                  placeholder="Rechercher plein par véhicule, station, chauffeur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#172231] border border-[#8995A3]/25 rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F6F8] placeholder-[#8995A3]/60 focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              <label className={`flex items-center gap-2 cursor-pointer border px-3 py-2 rounded-lg text-xs transition-colors ${
                anomalyOnly 
                  ? 'bg-[#EF4444]/15 border-[#EF4444]/50 text-red-300' 
                  : 'bg-[#172231] border-[#8995A3]/25 text-[#F4F6F8]'
              }`}>
                <input
                  type="checkbox"
                  checked={anomalyOnly}
                  onChange={(e) => setAnomalyOnly(e.target.checked)}
                  className="rounded bg-[#08111F] text-[#FF8A00] focus:ring-0 cursor-pointer"
                />
                <span className="font-semibold font-mono text-[11px]">
                  Anomalies uniquement ({anomaliesCount})
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onExportCsv}
                className="bg-[#172231] hover:bg-[#172231]/80 text-[#F4F6F8] px-3 py-2 rounded-lg text-xs font-semibold border border-[#8995A3]/25 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <button
                onClick={onAddFuelLog}
                className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-[#08111F] font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow cursor-pointer transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Saisir Ravitaillement</span>
              </button>
            </div>
          </div>

          {/* Table des Pleins */}
          <div className="bg-[#111820] rounded-xl border border-[#8995A3]/20 overflow-x-auto shadow-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#08111F] border-b border-[#8995A3]/20 text-[#8995A3] font-bold uppercase text-[10px] font-mono">
                <tr>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Équipement Concerne</th>
                  <th className="p-3.5">Volume Pompé</th>
                  <th className="p-3.5">Montant Réglé</th>
                  <th className="p-3.5">Station / Cuve Chantier</th>
                  <th className="p-3.5">Conducteur</th>
                  <th className="p-3.5">Audit Carburant</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8995A3]/15 font-medium text-[#F4F6F8]">
                {filtered.map((log) => (
                  <tr 
                    key={log.id} 
                    className={`hover:bg-[#172231]/50 transition-colors ${
                      log.anomaly ? 'bg-red-500/5' : ''
                    }`}
                  >
                    <td className="p-3.5 font-mono text-[#8995A3]">{log.date}</td>
                    <td className="p-3.5 font-bold flex items-center gap-2">
                      <Fuel className={`w-3.5 h-3.5 ${log.anomaly ? 'text-red-400' : 'text-[#FF8A00]'}`} />
                      <span>{log.vehicle}</span>
                    </td>
                    <td className="p-3.5 font-mono text-blue-400 font-bold">{log.qty}</td>
                    <td className="p-3.5 font-mono font-bold text-[#F4F6F8]">{formatMoney(log.amount)}</td>
                    <td className="p-3.5 text-[#8995A3]">{log.station}</td>
                    <td className="p-3.5">{log.driver}</td>
                    <td className="p-3.5">
                      {log.anomaly ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-mono font-bold animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          Surconsommation (+28%)
                        </span>
                      ) : (
                        <Badge variant="success">Conforme (Écart &lt; 3%)</Badge>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      {log.anomaly ? (
                        <button
                          type="button"
                          onClick={() => setInvestigatedLog(log)}
                          className="bg-red-500/15 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/40 px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer"
                        >
                          Investiguer
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-[#8995A3]">Vérifié</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SOUS-ONGLET B : SUPERVISION DES CUVES DE CHANTIER                      */}
      {/* ========================================================================= */}
      {subTab === 'cuves' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {tanks.map((tank) => {
              const fillPct = Math.round((tank.currentLevel / tank.capacity) * 100);
              const isLow = tank.currentLevel <= tank.minThreshold;

              return (
                <div 
                  key={tank.id}
                  className={`bg-[#111820] border rounded-2xl p-5 space-y-4 shadow-xl transition-all ${
                    isLow ? 'border-red-500/50 shadow-red-500/5' : 'border-[#8995A3]/25'
                  }`}
                >
                  {/* En-tête Cuve */}
                  <div className="flex items-start justify-between border-b border-[#8995A3]/15 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-[#172231] px-2 py-0.5 rounded text-[#FF8A00]">
                          {tank.id}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Jauge Télématique 4G
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-[#F4F6F8] mt-1">
                        {tank.name}
                      </h4>
                      <p className="text-[11px] text-[#8995A3] mt-0.5 font-mono">
                        {tank.site}
                      </p>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-[#FF8A00]/15 border border-[#FF8A00]/40 flex items-center justify-center text-[#FF8A00]">
                      <Database className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Jauge Visuelle de Niveau Cuve */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline font-mono">
                      <div>
                        <span className="text-xl font-black text-[#F4F6F8]">
                          {tank.currentLevel.toLocaleString()} L
                        </span>
                        <span className="text-[10px] text-[#8995A3] ml-1.5">
                          / {tank.capacity.toLocaleString()} L
                        </span>
                      </div>
                      <span className={`text-sm font-black ${
                        isLow ? 'text-red-400' : 'text-[#10B981]'
                      }`}>
                        {fillPct}%
                      </span>
                    </div>

                    {/* Réservoir Cylindrique Graphique */}
                    <div className="w-full h-4 bg-[#08111F] rounded-full border border-[#8995A3]/30 overflow-hidden p-0.5">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${
                          isLow 
                            ? 'bg-gradient-to-r from-red-600 to-amber-500' 
                            : 'bg-gradient-to-r from-[#10B981] to-emerald-400'
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>

                    {isLow ? (
                      <div className="flex items-center gap-1.5 text-red-400 text-[10px] font-mono font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Seuil critique atteint (&lt; {tank.minThreshold.toLocaleString()} L) - Réapprovisionnement requis</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-[#8995A3] block">
                        Autonomie estimée : ~4.2 jours d'exploitation
                      </span>
                    )}
                  </div>

                  {/* Fiche Technique Détaillée */}
                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#08111F] border border-[#8995A3]/20 font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-[#8995A3] block">Pétrolier Attitré</span>
                      <strong className="text-[#F4F6F8] text-[11px]">{tank.supplier}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#8995A3] block">Débit Pompe</span>
                      <strong className="text-[#FF8A00] text-[11px]">{tank.flowRate}</strong>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-[#8995A3]/15 flex justify-between text-[11px]">
                      <span className="text-[#8995A3]">Dernière livraison :</span>
                      <span className="text-[#F4F6F8] font-bold">{tank.lastDeliveryDate} (+{tank.lastDeliveryQty.toLocaleString()} L)</span>
                    </div>
                  </div>

                  {/* Action Réapprovisionnement */}
                  <button
                    type="button"
                    onClick={() => {
                      setTanks((prev) => prev.map((t) => {
                        if (t.id === tank.id) {
                          const newLvl = Math.min(t.capacity, t.currentLevel + 10000);
                          return {
                            ...t,
                            currentLevel: newLvl,
                            lastDeliveryDate: "Aujourd'hui",
                            lastDeliveryQty: 10000
                          };
                        }
                        return t;
                      }));
                    }}
                    className="w-full bg-[#172231] hover:bg-[#FF8A00] text-[#8995A3] hover:text-[#08111F] border border-[#8995A3]/30 hover:border-[#FF8A00] py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Réceptionner Livraison Pétrolier (+10 000 L)</span>
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SOUS-ONGLET C : RAPPROCHEMENT & LUTTE ANTI-VOL CARBURANT              */}
      {/* ========================================================================= */}
      {subTab === 'rapprochement' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Bannière Méthodologique Anti-Coulage */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#172231] via-[#111820] to-[#172231] border border-[#FF8A00]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FF8A00]/20 border border-[#FF8A00]/50 flex items-center justify-center text-[#FF8A00]">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F4F6F8] font-mono uppercase">
                  Moteur de Rapprochement Volumétrique & Détection des Fraudes
                </h4>
                <p className="text-xs text-[#8995A3]">
                  Calcul automatique de la balance : [Stock Initial] + [Livraisons BL] - [Volumes Pompés] vs [Jauge Réelle Fosse].
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[#8995A3]">Seuil Tolérance :</span>
              <span className="bg-[#10B981]/15 text-[#10B981] px-2.5 py-1 rounded font-bold border border-[#10B981]/30">
                ± 1.5% Max
              </span>
            </div>
          </div>

          {/* Tableau d'Audit du Rapprochement */}
          <div className="bg-[#111820] rounded-xl border border-[#8995A3]/20 overflow-x-auto shadow-lg">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-[#08111F] border-b border-[#8995A3]/20 text-[#8995A3] uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Période Audit</th>
                  <th className="p-3.5">Cuve Chantier</th>
                  <th className="p-3.5">Stock Initial</th>
                  <th className="p-3.5">Livré Pétrolier</th>
                  <th className="p-3.5">Distribué Engins</th>
                  <th className="p-3.5">Jauge Réelle</th>
                  <th className="p-3.5">Écart Constaté</th>
                  <th className="p-3.5">Perte Financière</th>
                  <th className="p-3.5 text-right">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8995A3]/10 text-[#F4F6F8]">
                {reconciliations.map((rec) => {
                  const isTheftAlert = rec.status === 'ALERTE_COULAGE';

                  return (
                    <tr 
                      key={rec.id} 
                      className={`hover:bg-[#172231]/50 transition-colors ${
                        isTheftAlert ? 'bg-red-500/10' : ''
                      }`}
                    >
                      <td className="p-3.5 text-[#8995A3] font-bold">{rec.period}</td>
                      <td className="p-3.5 font-bold text-[#F4F6F8]">{rec.tankName}</td>
                      <td className="p-3.5">{rec.initialStock.toLocaleString()} L</td>
                      <td className="p-3.5 text-blue-400 font-bold">+{rec.deliveredVolume.toLocaleString()} L</td>
                      <td className="p-3.5 text-[#FF8A00] font-bold">-{rec.pumpedVolume.toLocaleString()} L</td>
                      <td className="p-3.5 font-bold">{rec.actualStock.toLocaleString()} L</td>
                      <td className={`p-3.5 font-black ${isTheftAlert ? 'text-red-400' : 'text-[#10B981]'}`}>
                        {rec.variance > 0 ? `+${rec.variance}` : rec.variance} L ({rec.varianceRate}%)
                      </td>
                      <td className={`p-3.5 font-bold ${isTheftAlert ? 'text-red-400' : 'text-[#8995A3]'}`}>
                        {formatMoney(rec.lossCost)}
                      </td>
                      <td className="p-3.5 text-right">
                        {isTheftAlert ? (
                          <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 border border-red-500/40 px-2.5 py-1 rounded text-[10px] font-bold animate-pulse">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Coulage / Vol Présumé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Tolérance Normale
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TIROIR D'INVESTIGATION ET DIAGNOSTIC DES ANOMALIES CARBURANT            */}
      {/* ========================================================================= */}
      {investigatedLog && (
        <div className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-[#111820] border-l border-[#8995A3]/25 w-full max-w-lg h-full p-6 space-y-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-5">
              
              {/* En-tête de l'Investigation */}
              <div className="flex items-start justify-between border-b border-[#8995A3]/20 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold border border-red-500/30 uppercase">
                      Audit Télématique Carburant
                    </span>
                    <span className="text-[10px] font-mono text-[#8995A3] font-bold">
                      {investigatedLog.id}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#F4F6F8]">
                    {investigatedLog.vehicle}
                  </h3>
                  <p className="text-xs text-[#8995A3] font-mono">
                    Ravitaillement du {investigatedLog.date} • Station {investigatedLog.station}
                  </p>
                </div>

                <button
                  onClick={() => setInvestigatedLog(null)}
                  className="text-[#8995A3] hover:text-[#F4F6F8] p-1 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bannière Alerte Dérive Constatée */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase font-mono">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Dérive Anormale : +28.4% de Surconsommation</span>
                </div>
                <p className="text-xs text-[#8995A3] leading-relaxed">
                  Le volume pompé (<strong className="text-[#F4F6F8]">{investigatedLog.qty}</strong> pour <strong className="text-[#F4F6F8]">{formatMoney(investigatedLog.amount)}</strong>) présente un écart supérieur au seuil de tolérance de 20% par rapport au ratio kilométrique/horaire attendu pour ce modèle.
                </p>
              </div>

              {/* Matrice Comparative Norme vs Constaté */}
              <div className="bg-[#08111F] p-4 rounded-xl border border-[#8995A3]/20 space-y-3 font-mono text-xs">
                <div className="text-[10px] uppercase font-bold text-[#8995A3] tracking-wider">
                  Comparaison avec la Norme Constructeur :
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#172231] p-3 rounded-lg border border-[#8995A3]/15 space-y-1">
                    <span className="text-[10px] text-[#8995A3] block">Norme Constructeur</span>
                    <strong className="text-sm text-[#10B981]">14.8 L / 100km</strong>
                    <span className="text-[10px] text-[#8995A3] block">Base d'homologation</span>
                  </div>

                  <div className="bg-[#172231] p-3 rounded-lg border border-red-500/30 space-y-1">
                    <span className="text-[10px] text-red-400 block font-bold">Consommation Réelle</span>
                    <strong className="text-sm text-red-400 font-black">18.9 L / 100km</strong>
                    <span className="text-[10px] text-red-300 block font-bold">+4.1 L / 100km</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#172231] border border-[#8995A3]/15 flex items-center justify-between text-[11px]">
                  <span className="text-[#8995A3]">Surcoût direct estimé sur ce plein :</span>
                  <strong className="text-[#FF8A00] font-black">+21 250 FCFA</strong>
                </div>
              </div>

              {/* Hypothèses Diagnostiquées par le Moteur de Règles */}
              <div className="space-y-2 text-xs">
                <div className="text-[10px] font-mono font-bold uppercase text-[#8995A3]">
                  Diagnostic Algorithmique Préconisé :
                </div>

                <div className="space-y-2 font-mono">
                  <div className="p-3 rounded-lg bg-[#172231] border border-[#8995A3]/20 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <strong className="text-[#F4F6F8] block">Injecteur Défectueux ou Pompe Fuyarde</strong>
                      <span className="text-[11px] text-[#8995A3]">Probabilité 65% • Perte de pression d'injection suspectée.</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#172231] border border-[#8995A3]/20 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <strong className="text-[#F4F6F8] block">Surrégime Moteur ou Conduite Agressive</strong>
                      <span className="text-[11px] text-[#8995A3]">Probabilité 20% • Télématique : RPM &gt; 2 200 tr/min fréquent.</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#172231] border border-[#8995A3]/20 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500/20 text-red-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <strong className="text-[#F4F6F8] block">Écart Cuve Chantier / Vol de Carburant</strong>
                      <span className="text-[11px] text-[#8995A3]">Probabilité 15% • Discordance avec le ticket de pompiste.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Actions Correctives Déclenchables Immédiatement */}
            <div className="pt-4 border-t border-[#8995A3]/20 space-y-2">
              <button
                type="button"
                onClick={() => {
                  if (onRequestMaintenanceOrder) {
                    onRequestMaintenanceOrder(
                      investigatedLog.vehicle,
                      `Audit Carburant : Contrôle injecteurs & calibrage pompe suite à surconsommation +28% sur ${investigatedLog.vehicle}`
                    );
                  }
                  setInvestigatedLog(null);
                }}
                className="w-full bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-[#08111F] font-black py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FF8A00]/20 font-mono transition-all"
              >
                <Wrench className="w-4 h-4 stroke-[2.5]" />
                <span>Créer un Ordre de Contrôle Injecteur en Atelier</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onAcknowledgeAnomaly) {
                    onAcknowledgeAnomaly(investigatedLog.id);
                  }
                  setInvestigatedLog(null);
                }}
                className="w-full bg-[#172231] hover:bg-[#10B981]/15 text-[#8995A3] hover:text-[#10B981] border border-[#8995A3]/25 hover:border-[#10B981]/50 py-2.5 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Acquitter l'Anomalie (Justifiée par Chantier en Rampe)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default FuelCostsView;
