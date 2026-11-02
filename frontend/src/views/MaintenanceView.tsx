import React, { useState } from 'react';
import { 
  Search, Plus, Download, Wrench, CheckCircle, Clock, 
  AlertTriangle, ArrowRight, ShieldCheck, User, Calendar, 
  DollarSign, Activity, CheckCircle2, RotateCcw, Package,
  Layers, ShoppingCart, RefreshCw, AlertCircle, CircleDot
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';
import { MaintenanceSmartIcon, TcoSmartIcon, ImmobilizationSmartIcon } from '../components/ui/SmartDashboardIcons';
import { EquipmentItem } from '../App';

export interface MaintenanceOrder {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: string; // 'PREVENTIF' | 'CORRECTIF' | 'PANNE'
  title: string;
  status: string; // 'ATTENTE_PIECE' | 'EN_COURS' | 'EN_CONTROLE' | 'TERMINE'
  priority: string; // 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE'
  cost: number;
  tech: string;
  date: string;
}

export interface SparePart {
  id: string;
  code: string;
  name: string;
  category: 'PNEUMATIQUE' | 'FILTRATION' | 'LUBRIFIANT' | 'ORGANE' | 'FREINAGE';
  stockQty: number;
  minQty: number;
  unitCost: number;
  unit: string;
  location: string;
  compatibleModels: string;
  status: 'EN_STOCK' | 'STOCK_FAIBLE' | 'RUPTURE';
}

const INITIAL_SPARE_PARTS: SparePart[] = [
  {
    id: 'PR-01',
    code: 'BRDG-4000R57',
    name: 'Pneumatique Géant 40.00R57 Bridgestone Master',
    category: 'PNEUMATIQUE',
    stockQty: 6,
    minQty: 4,
    unitCost: 14500000,
    unit: 'Pneu unitaire',
    location: 'Parc à Pneus Sécurisé Fosse',
    compatibleModels: 'Caterpillar 793F / Komatsu HD785',
    status: 'EN_STOCK'
  },
  {
    id: 'PR-02',
    code: 'CAT-1R-0716',
    name: 'Filtre Hydraulique Haute Pression 10 Microns',
    category: 'FILTRATION',
    stockQty: 2,
    minQty: 5,
    unitCost: 185000,
    unit: 'Cartouche',
    location: 'Magasin Central - Allée A Rayon 4',
    compatibleModels: 'Pelle CAT 336D & 6020B',
    status: 'STOCK_FAIBLE'
  },
  {
    id: 'PR-03',
    code: 'TOTAL-15W40-208',
    name: 'Fût Huile Moteur Minérale Lourde 15W40 (208L)',
    category: 'LUBRIFIANT',
    stockQty: 14,
    minQty: 6,
    unitCost: 620000,
    unit: 'Fût 208L',
    location: 'Zone Dépôt Lubrifiants PK18',
    compatibleModels: 'Flotte Globale BTP & Poids Lourds',
    status: 'EN_STOCK'
  },
  {
    id: 'PR-04',
    code: 'MB-KIT-500H',
    name: 'Kit de Révision Cadencée 500 Heures Moteur',
    category: 'ORGANE',
    stockQty: 1,
    minQty: 3,
    unitCost: 850000,
    unit: 'Kit complet',
    location: 'Magasin Central - Rayon B-12',
    compatibleModels: 'Mercedes Actros 3340 Benne',
    status: 'STOCK_FAIBLE'
  },
  {
    id: 'PR-05',
    code: 'BREM-HD-4X4',
    name: 'Jeu de Mâchoires et Plaquettes Renforcées Fosse',
    category: 'FREINAGE',
    stockQty: 8,
    minQty: 4,
    unitCost: 340000,
    unit: 'Jeu 4 roues',
    location: 'Magasin Central - Rayon C-01',
    compatibleModels: 'Toyota Hilux 4x4 / Véhicules de Liaison',
    status: 'EN_STOCK'
  }
];

interface MaintenanceViewProps {
  orders: MaintenanceOrder[];
  equipments?: EquipmentItem[];
  currentRole: { code: string; label: string };
  onAddOrder: () => void;
  onUpdateStatus: (id: string, status: string) => void;
  onExportCsv: () => void;
  formatMoney: (val: number) => string;
  onAutoGeneratePreventiveOrder?: (equipment: EquipmentItem) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  orders,
  equipments = [],
  currentRole,
  onAddOrder,
  onUpdateStatus,
  onExportCsv,
  formatMoney,
  onAutoGeneratePreventiveOrder,
}) => {
  const [subTab, setSubTab] = useState<'ordres' | 'magasin'>('ordres');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Magasin Pièces Détachées State
  const [parts, setParts] = useState<SparePart[]>(INITIAL_SPARE_PARTS);
  const [partCategoryFilter, setPartCategoryFilter] = useState('ALL');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
      o.tech.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || o.priority === priorityFilter;
    const matchesType = typeFilter === 'ALL' || o.type === typeFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const filteredParts = parts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.compatibleModels.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesCat = partCategoryFilter === 'ALL' || p.category === partCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'CRITIQUE':
        return <Badge variant="danger">Critique</Badge>;
      case 'HAUTE':
        return <Badge variant="orange">Haute</Badge>;
      case 'MOYENNE':
        return <Badge variant="warning">Moyenne</Badge>;
      default:
        return <Badge variant="neutral">Basse</Badge>;
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'TERMINE':
        return (
          <span className="inline-flex items-center gap-1 text-[#10B981] font-mono text-[10px] font-bold bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
            <CheckCircle2 className="w-3 h-3" /> Clôturé
          </span>
        );
      case 'EN_CONTROLE':
        return (
          <span className="inline-flex items-center gap-1 text-[#0EA5E9] font-mono text-[10px] font-bold bg-[#0EA5E9]/15 px-2 py-0.5 rounded border border-[#0EA5E9]/30">
            <Activity className="w-3 h-3" /> Contrôle Piste
          </span>
        );
      case 'EN_COURS':
        return (
          <span className="inline-flex items-center gap-1 text-[#FF8A00] font-mono text-[10px] font-bold bg-[#FF8A00]/15 px-2 py-0.5 rounded border border-[#FF8A00]/30 animate-pulse">
            <Clock className="w-3 h-3" /> En Cours Fosse
          </span>
        );
      case 'ATTENTE_PIECE':
        return (
          <span className="inline-flex items-center gap-1 text-red-400 font-mono text-[10px] font-bold bg-red-500/15 px-2 py-0.5 rounded border border-red-500/30">
            <Package className="w-3 h-3" /> Attente Pièce
          </span>
        );
      default:
        return <Badge variant="neutral">{s}</Badge>;
    }
  };

  // Calcul des Seuils Préventifs (500h / 15 000 km)
  const preventiveWatchlist = equipments.map((eq) => {
    const isHours = eq.counterType === 'HOURS';
    const interval = isHours ? 500 : 15000;
    const remainder = eq.counterValue % interval;
    const remainingToNext = interval - remainder;
    const nextMilestone = eq.counterValue + remainingToNext;
    const isUrgent = remainingToNext <= (isHours ? 150 : 2500);

    return {
      equipment: eq,
      isHours,
      interval,
      remainingToNext,
      nextMilestone,
      isUrgent,
    };
  });

  const activeOrdersCount = orders.filter((o) => o.status !== 'TERMINE').length;
  const criticalOrdersCount = orders.filter((o) => o.priority === 'CRITIQUE' && o.status !== 'TERMINE').length;
  const totalMaintBudget = orders.reduce((acc, o) => acc + o.cost, 0);

  // Statistiques Magasin Pièces
  const totalMagasinValue = parts.reduce((acc, p) => acc + (p.stockQty * p.unitCost), 0);
  const lowStockPartsCount = parts.filter((p) => p.stockQty <= p.minQty).length;
  const giantTiresCount = parts.find((p) => p.category === 'PNEUMATIQUE')?.stockQty || 0;

  const handleRestockPart = (partId: string) => {
    setParts((prev) => prev.map((p) => {
      if (p.id === partId) {
        const added = p.category === 'PNEUMATIQUE' ? 2 : 5;
        const newQty = p.stockQty + added;
        return {
          ...p,
          stockQty: newQty,
          status: newQty > p.minQty ? 'EN_STOCK' : 'STOCK_FAIBLE'
        };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. SÉLECTEUR DE SOUS-ONGLETS MAINTENANCE (ORDRES VS MAGASIN PIÈCES)       */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111820] p-3 rounded-xl border border-[#8995A3]/20 shadow">
        <div className="flex items-center gap-1.5 bg-[#08111F] p-1 rounded-lg border border-[#8995A3]/25 font-mono text-xs">
          <button
            type="button"
            onClick={() => setSubTab('ordres')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'ordres'
                ? 'bg-[#FF8A00] text-[#08111F] shadow'
                : 'text-[#8995A3] hover:text-[#F4F6F8]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Ordres de Réparation (OT) & Préventif</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('magasin')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'magasin'
                ? 'bg-[#FF8A00] text-[#08111F] shadow'
                : 'text-[#8995A3] hover:text-[#F4F6F8]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Magasin Pièces & Pneus Géants (WMS)</span>
            {lowStockPartsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs font-mono">
          <span className="text-[#8995A3] hidden md:inline">Valorisation Stock Atelier :</span>
          <span className="bg-[#172231] px-2.5 py-1 rounded border border-[#8995A3]/30 text-[#10B981] font-bold">
            {formatMoney(totalMagasinValue)}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. RUBAN RÉCAPITULATIF ATELIER & BUDGET MAINTENANCE (ICÔNES SMART 3D)    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Ordres de Réparation Actifs"
          value={`${activeOrdersCount} En Atelier`}
          subValue={`${orders.filter((o) => o.status === 'EN_COURS').length} en cours • ${orders.filter((o) => o.status === 'ATTENTE_PIECE').length} en attente pièces`}
          customIconBadge={<MaintenanceSmartIcon />}
          trend={`${activeOrdersCount} Dossiers`}
          trendPositive={activeOrdersCount <= 2}
          accentColor="#F59E0B"
        />

        <StatCard
          label="Pannes Bloquantes / Critiques"
          value={`${criticalOrdersCount} Machine(s)`}
          subValue={criticalOrdersCount > 0 ? "Immobilisation prioritaire en fosse" : "Aucun engin bloqué"}
          customIconBadge={<ImmobilizationSmartIcon />}
          trend={criticalOrdersCount > 0 ? "Arrêt Fosse" : "Nominal"}
          trendPositive={criticalOrdersCount === 0}
          accentColor={criticalOrdersCount > 0 ? "#EF4444" : "#10B981"}
        />

        <StatCard
          label="Engagements Coûts Pièces & Atelier"
          value={formatMoney(totalMaintBudget)}
          subValue="Budget conforme au plan de maintenance"
          customIconBadge={<TcoSmartIcon />}
          trend="-4.6% vs Prévision"
          trendPositive={true}
          accentColor="#FF8A00"
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. SOUS-ONGLET A : ORDRES DE TRAVAIL & CARNET PRÉVENTIF                   */}
      {/* ========================================================================= */}
      {subTab === 'ordres' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Surveillance des Seuils Horamètres (Cycles 500h / 15 000 km) */}
          <div className="bg-[#111820] border border-[#8995A3]/25 rounded-xl p-4 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#FF8A00]" />
                <h3 className="text-xs font-black font-mono text-[#F4F6F8] uppercase tracking-wide">
                  Suivi Préventif des Paliers d'Horamètres (Cycles 500h / 15 000 km)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#8995A3]">
                Planification automatisée vidange & filtres
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {preventiveWatchlist.slice(0, 3).map((item) => (
                <div
                  key={item.equipment.id}
                  className={`p-3 rounded-lg border text-xs font-mono space-y-2 transition-all ${
                    item.isUrgent
                      ? 'bg-[#FF8A00]/10 border-[#FF8A00]/40'
                      : 'bg-[#172231]/60 border-[#8995A3]/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-[#F4F6F8] truncate max-w-[180px] font-bold">
                      {item.equipment.name}
                    </strong>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.isUrgent ? 'bg-[#FF8A00] text-[#08111F]' : 'bg-[#08111F] text-[#8995A3]'
                    }`}>
                      {item.isUrgent ? 'ÉCHÉANCE PROCHE' : 'PLANIFIÉ'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#8995A3]">Compteur actuel :</span>
                    <span className="font-bold text-[#F4F6F8]">
                      {item.equipment.counterValue.toLocaleString()} {item.isHours ? 'h' : 'km'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-[#8995A3]">Prochain palier :</span>
                    <span className="font-bold text-[#FF8A00]">
                      {item.nextMilestone.toLocaleString()} {item.isHours ? 'h' : 'km'} (dans {item.remainingToNext} {item.isHours ? 'h' : 'km'})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onAutoGeneratePreventiveOrder) {
                        onAutoGeneratePreventiveOrder(item.equipment);
                      }
                    }}
                    className="w-full bg-[#172231] hover:bg-[#FF8A00]/20 text-[#FF8A00] border border-[#FF8A00]/30 hover:border-[#FF8A00] py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                    <span>Générer Ordre Vidange {item.nextMilestone} {item.isHours ? 'h' : 'km'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Filtres et Actions sur les Ordres */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#111820] p-4 rounded-xl border border-[#8995A3]/20">
            <div className="flex flex-1 flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8995A3]" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, véhicule, technicien, ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#172231] border border-[#8995A3]/25 rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F6F8] placeholder-[#8995A3]/60 focus:outline-none focus:border-[#FF8A00]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#172231] border border-[#8995A3]/25 rounded-lg px-3 py-2 text-xs text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="ATTENTE_PIECE">Attente Pièce</option>
                <option value="EN_COURS">En cours Fosse</option>
                <option value="EN_CONTROLE">Contrôle Piste</option>
                <option value="TERMINE">Clôturé</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-[#172231] border border-[#8995A3]/25 rounded-lg px-3 py-2 text-xs text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer"
              >
                <option value="ALL">Toutes les priorités</option>
                <option value="CRITIQUE">Critique</option>
                <option value="HAUTE">Haute</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="BASSE">Basse</option>
              </select>
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
                onClick={onAddOrder}
                className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-[#08111F] font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow cursor-pointer transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Nouvel Ordre (OT)</span>
              </button>
            </div>
          </div>

          {/* Tableau des Ordres */}
          <div className="bg-[#111820] rounded-xl border border-[#8995A3]/20 overflow-x-auto shadow-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#08111F] border-b border-[#8995A3]/20 text-[#8995A3] font-bold uppercase text-[10px] font-mono">
                <tr>
                  <th className="p-3.5">Réf & Date</th>
                  <th className="p-3.5">Matériel Concerne</th>
                  <th className="p-3.5">Intervention Atelier</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Priorité</th>
                  <th className="p-3.5">Statut Cycle</th>
                  <th className="p-3.5">Équipe / Technicien</th>
                  <th className="p-3.5">Coût Forfait</th>
                  <th className="p-3.5 text-right">Progression</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8995A3]/15 font-medium text-[#F4F6F8]">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#172231]/50 transition-colors">
                    <td className="p-3.5 font-mono text-[#8995A3]">
                      <div className="font-bold text-[#F4F6F8]">{o.id}</div>
                      <div className="text-[10px] text-[#8995A3]">{o.date}</div>
                    </td>
                    <td className="p-3.5 font-bold">
                      <div className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-[#FF8A00]" />
                        <span>{o.vehicleName}</span>
                      </div>
                    </td>
                    <td className="p-3.5 max-w-xs truncate" title={o.title}>
                      {o.title}
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-[10px] bg-[#172231] px-2 py-0.5 rounded border border-[#8995A3]/20 text-[#8995A3] font-bold">
                        {o.type}
                      </span>
                    </td>
                    <td className="p-3.5">{getPriorityBadge(o.priority)}</td>
                    <td className="p-3.5">{getStatusBadge(o.status)}</td>
                    <td className="p-3.5 text-[#8995A3] font-mono text-[11px]">{o.tech}</td>
                    <td className="p-3.5 font-mono font-bold text-[#FF8A00]">
                      {formatMoney(o.cost)}
                    </td>
                    <td className="p-3.5 text-right font-mono text-xs">
                      <div className="flex items-center justify-end gap-1.5">
                        {o.status === 'ATTENTE_PIECE' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(o.id, 'EN_COURS')}
                            className="bg-[#FF8A00]/15 hover:bg-[#FF8A00] text-[#FF8A00] hover:text-[#08111F] px-2 py-1 rounded text-[10px] font-bold border border-[#FF8A00]/40 transition-all cursor-pointer"
                            title="Passer en cours (pièce reçue)"
                          >
                            Démarrer
                          </button>
                        )}
                        {o.status === 'EN_COURS' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(o.id, 'EN_CONTROLE')}
                            className="bg-[#0EA5E9]/15 hover:bg-[#0EA5E9] text-[#0EA5E9] hover:text-[#08111F] px-2 py-1 rounded text-[10px] font-bold border border-[#0EA5E9]/40 transition-all cursor-pointer"
                            title="Passer en contrôle piste"
                          >
                            Contrôle
                          </button>
                        )}
                        {o.status === 'EN_CONTROLE' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(o.id, 'TERMINE')}
                            className="bg-[#10B981]/15 hover:bg-[#10B981] text-[#10B981] hover:text-[#08111F] px-2 py-1 rounded text-[10px] font-bold border border-[#10B981]/40 transition-all cursor-pointer"
                            title="Clôturer l'ordre et libérer l'engin"
                          >
                            Clôturer
                          </button>
                        )}
                        {o.status === 'TERMINE' && (
                          <span className="text-[10px] text-[#10B981] font-bold">
                            Validé
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SOUS-ONGLET B : MAGASIN PIÈCES DÉTACHÉES & PNEUMATIQUES (WMS ATELIER)  */}
      {/* ========================================================================= */}
      {subTab === 'magasin' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Ruban Spécifique Magasin */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-[#111820] border border-[#8995A3]/20 rounded-xl p-4 shadow">
              <span className="text-[10px] font-mono font-bold text-[#8995A3] uppercase block">
                Valeur Totale du Magasin
              </span>
              <div className="text-xl font-black font-mono text-[#10B981] mt-0.5">
                {formatMoney(totalMagasinValue)}
              </div>
              <span className="text-[10px] text-[#8995A3] font-mono">Stock physique valorisé</span>
            </div>

            <div className={`border rounded-xl p-4 shadow ${
              lowStockPartsCount > 0 ? 'bg-red-500/10 border-red-500/40' : 'bg-[#111820] border-[#8995A3]/20'
            }`}>
              <span className="text-[10px] font-mono font-bold text-[#8995A3] uppercase block">
                Alertes Seuil Critique
              </span>
              <div className="text-xl font-black font-mono text-red-400 mt-0.5 flex items-center justify-between">
                <span>{lowStockPartsCount} Référence(s)</span>
                {lowStockPartsCount > 0 && <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />}
              </div>
              <span className="text-[10px] text-red-300 font-mono">Réapprovisionnement requis</span>
            </div>

            <div className="bg-[#111820] border border-[#8995A3]/20 rounded-xl p-4 shadow">
              <span className="text-[10px] font-mono font-bold text-[#8995A3] uppercase block">
                Pneus Géants 40.00R57
              </span>
              <div className="text-xl font-black font-mono text-[#FF8A00] mt-0.5">
                {giantTiresCount} Disponibles
              </div>
              <span className="text-[10px] text-[#8995A3] font-mono">Pour tombereaux 240T</span>
            </div>

            <div className="bg-[#111820] border border-[#8995A3]/20 rounded-xl p-4 shadow">
              <span className="text-[10px] font-mono font-bold text-[#8995A3] uppercase block">
                Taux de Disponibilité Pièces
              </span>
              <div className="text-xl font-black font-mono text-[#10B981] mt-0.5">
                96.4% NOMINAL
              </div>
              <span className="text-[10px] text-[#8995A3] font-mono">Objectif logistique atelier</span>
            </div>
          </div>

          {/* Filtres & Recherche Magasin */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111820] p-4 rounded-xl border border-[#8995A3]/20">
            <div className="flex items-center gap-2 flex-wrap">
              {['ALL', 'PNEUMATIQUE', 'FILTRATION', 'LUBRIFIANT', 'ORGANE', 'FREINAGE'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setPartCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    partCategoryFilter === cat
                      ? 'bg-[#FF8A00] text-[#08111F]'
                      : 'bg-[#172231] text-[#8995A3] hover:text-[#F4F6F8]'
                  }`}
                >
                  {cat === 'ALL' ? 'Toutes Catégories' : cat}
                </button>
              ))}
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8995A3]" />
              <input
                type="text"
                placeholder="Rechercher référence OEM, nom, engin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#172231] border border-[#8995A3]/25 rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F6F8] placeholder-[#8995A3]/60 focus:outline-none focus:border-[#FF8A00]"
              />
            </div>
          </div>

          {/* Tableau d'Inventaire Magasin */}
          <div className="bg-[#111820] rounded-xl border border-[#8995A3]/20 overflow-x-auto shadow-lg">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead className="bg-[#08111F] border-b border-[#8995A3]/20 text-[#8995A3] uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Référence OEM</th>
                  <th className="p-3.5">Désignation Pièce / Organe</th>
                  <th className="p-3.5">Catégorie</th>
                  <th className="p-3.5">Emplacement Magasin</th>
                  <th className="p-3.5">Affectation Compatible</th>
                  <th className="p-3.5">Stock / Seuil Min</th>
                  <th className="p-3.5">Prix Unitaire</th>
                  <th className="p-3.5">Valeur Stock</th>
                  <th className="p-3.5 text-right">Action Réappro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#8995A3]/10 text-[#F4F6F8]">
                {filteredParts.map((part) => {
                  const isLow = part.stockQty <= part.minQty;

                  return (
                    <tr 
                      key={part.id} 
                      className={`hover:bg-[#172231]/50 transition-colors ${
                        isLow ? 'bg-red-500/5' : ''
                      }`}
                    >
                      <td className="p-3.5 font-bold text-[#FF8A00]">
                        {part.code}
                      </td>
                      <td className="p-3.5 font-bold text-[#F4F6F8]">
                        <div>{part.name}</div>
                        <span className="text-[10px] text-[#8995A3]">{part.unit}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-[9px] bg-[#172231] text-[#8995A3] px-2 py-0.5 rounded border border-[#8995A3]/20">
                          {part.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-[#8995A3]">{part.location}</td>
                      <td className="p-3.5 text-[#8995A3] truncate max-w-xs">{part.compatibleModels}</td>
                      <td className="p-3.5 font-bold">
                        <span className={isLow ? 'text-red-400 font-black' : 'text-[#10B981]'}>
                          {part.stockQty} en stock
                        </span>
                        <span className="text-[10px] text-[#8995A3] block">
                          Min: {part.minQty}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-[#F4F6F8]">
                        {formatMoney(part.unitCost)}
                      </td>
                      <td className="p-3.5 font-black text-[#10B981]">
                        {formatMoney(part.stockQty * part.unitCost)}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => handleRestockPart(part.id)}
                          className="bg-[#172231] hover:bg-[#FF8A00] text-[#8995A3] hover:text-[#08111F] px-2.5 py-1 rounded text-[10px] font-bold border border-[#8995A3]/30 transition-all cursor-pointer inline-flex items-center gap-1"
                          title="Commander et incrémenter le stock magasin"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Réappro</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};

export default MaintenanceView;
