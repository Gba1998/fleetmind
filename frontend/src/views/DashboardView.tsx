import React, { useState } from 'react';
import { 
  Truck, User, Wrench, DollarSign, Activity, AlertTriangle, 
  MapPin, CheckCircle, ArrowRight, ShieldCheck, ChevronRight,
  TrendingUp, TrendingDown, Clock, BarChart3, Printer, Flame,
  FileCheck, PieChart as PieIcon, Radio, Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, 
  CartesianGrid, XAxis, YAxis, AreaChart, Area
} from 'recharts';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import GpsMap, { GpsVehicle } from '../components/GpsMap';
import { EquipmentItem } from '../App';
import MonthlyTcoReportModal from '../components/MonthlyTcoReportModal';
import MiningOreTransportCycle from '../components/MiningOreTransportCycle';
import { 
  TcoSmartIcon, FuelSmartIcon, MaintenanceSmartIcon, RentalsSmartIcon,
  AvailabilitySmartIcon, OperatorsSmartIcon, ImmobilizationSmartIcon, ProductionHoursSmartIcon,
  RibbonTabTcoIcon, RibbonTabPerfIcon, RibbonTabMiningIcon,
  PdfSmartIcon, DisponibiliteRadialBadge
} from '../components/ui/SmartDashboardIcons';

interface DashboardViewProps {
  equipments: EquipmentItem[];
  gpsVehicles: GpsVehicle[];
  activeVehiclesCount: number;
  inMaintenanceCount: number;
  uniqueDriversCount: number;
  totalExpenses: number;
  totalMaintCost: number;
  totalFuelCost: number;
  totalRentalCost?: number;
  tenantName?: string;
  formatMoney: (val: number) => string;
  dynamicExpenseDonut: { name: string; value: number; color: string }[];
  costTrendData: any[];
  subView: 'costs' | 'perf' | 'cycle';
  onSetSubView: (view: 'costs' | 'perf' | 'cycle') => void;
  onNavigateTab: (tabId: string) => void;
  onSelectGpsVehicle: (v: GpsVehicle) => void;
  criticalAlertsCount: number;
  fuelAnomaliesCount: number;
  documentsExpiringCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  equipments,
  gpsVehicles,
  activeVehiclesCount,
  inMaintenanceCount,
  uniqueDriversCount,
  totalExpenses,
  totalMaintCost,
  totalFuelCost,
  totalRentalCost = 9300000,
  tenantName,
  formatMoney,
  dynamicExpenseDonut,
  costTrendData,
  subView,
  onSetSubView,
  onNavigateTab,
  onSelectGpsVehicle,
  criticalAlertsCount,
  fuelAnomaliesCount,
  documentsExpiringCount,
}) => {
  const [showTcoReport, setShowTcoReport] = useState(false);

  const availabilityRate = equipments.length
    ? Math.round((activeVehiclesCount / equipments.length) * 100)
    : 0;

  // Mock Operational Performance by Site
  const sitePerformance = [
    { site: 'Autoroute du Nord PK18', rate: 96, active: 4, hours: 1420 },
    { site: 'Carrière Yopougon', rate: 92, active: 3, hours: 1180 },
    { site: 'Base Vie San Pedro', rate: 85, active: 2, hours: 840 },
    { site: 'Chantier Pont Bouaflé', rate: 70, active: 1, hours: 520 },
  ];

  // Category breakdown availability
  const categoryStats = [
    { cat: 'Engins BTP', rate: 94, count: '3 / 3 en service', color: '#FF8A00' },
    { cat: 'Camions Lourds', rate: 100, count: '2 / 2 en service', color: '#3B82F6' },
    { cat: 'Véhicules 4x4', rate: 50, count: '1 / 2 à l\'atelier', color: '#F59E0B' },
    { cat: 'Générateurs', rate: 0, count: '0 / 1 en panne', color: '#EF4444' },
  ];

  // Ranking TCO estimé par équipement
  const equipmentTcoRanking = equipments.map((eq, idx) => {
    const hourlyRate = eq.counterType === 'HOURS' ? 24500 : 185; // FCFA/h ou FCFA/km
    const estimatedFuel = Math.round(eq.counterValue * (eq.counterType === 'HOURS' ? 22 : 0.38) * 850);
    const estimatedMaint = idx === 0 ? 3200000 : idx === 1 ? 1800000 : idx === 2 ? 4500000 : 950000;
    const totalTco = estimatedFuel + estimatedMaint;

    return {
      ...eq,
      hourlyRate,
      estimatedFuel,
      estimatedMaint,
      totalTco
    };
  }).sort((a, b) => b.totalTco - a.totalTco);

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. RUBAN SÉLECTEUR DE VUE PRINCIPALE (DESIGN COCKPIT HAUT DE GAMME)       */}
      {/* ========================================================================= */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 bg-gradient-to-r from-[#111820] via-[#151F2C] to-[#111820] p-3 sm:p-4 rounded-2xl border border-[#8995A3]/25 shadow-xl">
        
        {/* 3 Onglets Majeurs avec Mini-Badges Smart */}
        <div className="flex items-center gap-2 bg-[#08111F] p-1.5 rounded-xl border border-[#8995A3]/25 font-mono text-xs overflow-x-auto">
          
          <button
            onClick={() => onSetSubView('costs')}
            className={`font-black px-4 py-2.5 rounded-lg flex items-center gap-2.5 transition-all duration-200 cursor-pointer whitespace-nowrap group ${
              subView === 'costs'
                ? 'bg-gradient-to-r from-[#FF8A00] to-[#E57B00] text-[#08111F] shadow-lg shadow-[#FF8A00]/30 ring-1 ring-[#FF8A00]/50'
                : 'text-[#8995A3] hover:text-[#F4F6F8] hover:bg-[#172231]/80'
            }`}
          >
            <RibbonTabTcoIcon active={subView === 'costs'} />
            <span className="text-xs tracking-wide">Budget & Coûts TCO</span>
          </button>

          <button
            onClick={() => onSetSubView('perf')}
            className={`font-black px-4 py-2.5 rounded-lg flex items-center gap-2.5 transition-all duration-200 cursor-pointer whitespace-nowrap group ${
              subView === 'perf'
                ? 'bg-gradient-to-r from-[#FF8A00] to-[#E57B00] text-[#08111F] shadow-lg shadow-[#FF8A00]/30 ring-1 ring-[#FF8A00]/50'
                : 'text-[#8995A3] hover:text-[#F4F6F8] hover:bg-[#172231]/80'
            }`}
          >
            <RibbonTabPerfIcon active={subView === 'perf'} />
            <span className="text-xs tracking-wide">Performance Opérationnelle</span>
          </button>

          <button
            onClick={() => onSetSubView('cycle')}
            className={`font-black px-4 py-2.5 rounded-lg flex items-center gap-2.5 transition-all duration-200 cursor-pointer whitespace-nowrap group ${
              subView === 'cycle'
                ? 'bg-gradient-to-r from-[#FF8A00] to-[#E57B00] text-[#08111F] shadow-lg shadow-[#FF8A00]/30 ring-1 ring-[#FF8A00]/50'
                : 'text-[#8995A3] hover:text-[#F4F6F8] hover:bg-[#172231]/80'
            }`}
          >
            <RibbonTabMiningIcon active={subView === 'cycle'} />
            <span className="text-xs tracking-wide">Cycle Minier (Animation)</span>
          </button>

        </div>

        {/* Actions Rapides & Taux Global avec Alignement Parfait */}
        <div className="flex items-center gap-3 text-xs font-mono self-end xl:self-auto flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setShowTcoReport(true)}
            className="bg-gradient-to-r from-[#172231] to-[#1E2B3E] hover:from-[#FF8A00] hover:to-amber-500 text-[#FF8A00] hover:text-[#08111F] border border-[#FF8A00]/40 hover:border-amber-400 font-black px-4 py-2.5 rounded-xl flex items-center gap-2.5 transition-all duration-300 cursor-pointer shadow-lg shadow-black/25 group whitespace-nowrap"
            title="Ouvrir le rapport exécutif officiel A4 en PDF"
          >
            <PdfSmartIcon />
            <span>Rapport TCO (PDF)</span>
          </button>

          <DisponibiliteRadialBadge rate={availabilityRate} />
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. VUE A : BUDGET & COÛTS TCO (AFFICHÉE IMMÉDIATEMENT)                      */}
      {/* ========================================================================= */}
      {subView === 'costs' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Ruban KPI Financier TCO avec Icônes Smart & Classy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="TCO Consolidé Période"
              value={formatMoney(totalExpenses)}
              subValue="Carburant + Ateliers + Locations"
              customIconBadge={<TcoSmartIcon />}
              trend="-4.2% vs M-1"
              trendPositive={true}
              onClick={() => {}}
              accentColor="#FF8A00"
            />

            <StatCard
              label="Poste Carburant & Cuves"
              value={formatMoney(totalFuelCost)}
              subValue="48.2% du budget d'exploitation"
              customIconBadge={<FuelSmartIcon />}
              trend="+1.4%"
              trendPositive={false}
              onClick={() => onNavigateTab('fuel')}
              accentColor="#3b82f6"
            />

            <StatCard
              label="Maintenance & Pièces"
              value={formatMoney(totalMaintCost)}
              subValue="24.6% du TCO (4 ordres atelier)"
              customIconBadge={<MaintenanceSmartIcon />}
              trend="-6.8%"
              trendPositive={true}
              onClick={() => onNavigateTab('maintenance')}
              accentColor="#F59E0B"
            />

            <StatCard
              label="Locations Externes"
              value={formatMoney(totalRentalCost)}
              subValue="12.8% du TCO (Matériels tiers)"
              customIconBadge={<RentalsSmartIcon />}
              trend="3 Contrats"
              trendPositive={true}
              onClick={() => onNavigateTab('rentals')}
              accentColor="#8B5CF6"
            />
          </div>

          {/* Les 2 Grands Graphiques TCO : Répartition Donut & Évolution 6 Mois */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Ventilation des Dépenses Donut */}
            <div className="p-5 rounded-xl bg-[#111820] border border-[#8995A3]/20 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#8995A3]/15 pb-3">
                <div className="flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-[#FF8A00]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4F6F8] font-mono">
                    Ventilation des Dépenses TCO par Poste
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#8995A3] bg-[#172231] px-2 py-0.5 rounded border border-[#8995A3]/25">
                  Consolidé Octobre 2026
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
                <div className="h-60 w-full relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dynamicExpenseDonut}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={92}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {dynamicExpenseDonut.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: any) => formatMoney(Number(value))}
                        contentStyle={{ backgroundColor: '#111820', borderColor: '#8995A3', borderRadius: '8px', color: '#F4F6F8', fontSize: '11px', fontFamily: 'monospace' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[9px] uppercase font-bold text-[#8995A3] font-mono">Total TCO</span>
                    <span className="text-xs font-black text-[#F4F6F8] font-mono">{formatMoney(totalExpenses)}</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  {dynamicExpenseDonut.map((item) => (
                    <div key={item.name} className="flex items-center justify-between border-b border-[#8995A3]/15 pb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[#8995A3] truncate text-[11px] font-medium">{item.name}</span>
                      </div>
                      <span className="font-mono text-[#F4F6F8] font-bold text-[11px]">{formatMoney(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Historique TCO sur 6 Mois */}
            <div className="p-5 rounded-xl bg-[#111820] border border-[#8995A3]/20 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#8995A3]/15 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#10B981]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4F6F8] font-mono">
                    Évolution du Coût Moyen par Engin (6 Mois)
                  </h3>
                </div>
                <span className="text-[10px] bg-[#172231] text-[#8995A3] px-2 py-0.5 rounded font-mono border border-[#8995A3]/25">
                  Tendance Décroissante
                </span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costTrendData}>
                    <defs>
                      <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF8A00" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#FF8A00" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="freqGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#8995A3" strokeOpacity={0.15} />
                    <XAxis dataKey="month" stroke="#8995A3" fontSize={10} fontStyle="bold" />
                    <YAxis stroke="#8995A3" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111820', borderColor: '#8995A3', borderRadius: '8px', color: '#F4F6F8', fontSize: '11px', fontFamily: 'monospace' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="costIndex"
                      name="Indice Coût TCO"
                      stroke="#FF8A00"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#costGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="frequency"
                      name="Fréquence pannes"
                      stroke="#10B981"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#freqGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Tableau Détaillé du TCO par Équipement */}
          <div className="bg-[#111820] border border-[#8995A3]/20 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-[#172231]/60 border-b border-[#8995A3]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#FF8A00]" />
                <h3 className="text-xs font-mono font-bold uppercase text-[#F4F6F8]">
                  Classement TCO des Engins d'Exploitation
                </h3>
              </div>
              <span className="text-[10px] text-[#8995A3] font-mono">
                Coût cumulé (Carburant + Ateliers)
              </span>
            </div>

            <div className="overflow-x-auto text-xs font-mono">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#08111F] text-[#8995A3] uppercase text-[10px] border-b border-[#8995A3]/20">
                  <tr>
                    <th className="p-3">Matériel</th>
                    <th className="p-3">Site Actuel</th>
                    <th className="p-3">Compteur</th>
                    <th className="p-3">Dépense Carburant</th>
                    <th className="p-3">Atelier & Pièces</th>
                    <th className="p-3">TCO Consolidé</th>
                    <th className="p-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#8995A3]/10">
                  {equipmentTcoRanking.map((eq) => (
                    <tr key={eq.id} className="hover:bg-[#172231]/50 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-[#F4F6F8]">{eq.name}</div>
                        <span className="text-[10px] text-[#8995A3]">{eq.immat}</span>
                      </td>
                      <td className="p-3 text-[#8995A3]">{eq.site}</td>
                      <td className="p-3 font-bold text-[#F4F6F8]">
                        {eq.counterValue.toLocaleString()} {eq.counterType === 'HOURS' ? 'h' : 'km'}
                      </td>
                      <td className="p-3 text-blue-400 font-bold">{formatMoney(eq.estimatedFuel)}</td>
                      <td className="p-3 text-[#FF8A00] font-bold">{formatMoney(eq.estimatedMaint)}</td>
                      <td className="p-3 font-black text-[#F4F6F8]">{formatMoney(eq.totalTco)}</td>
                      <td className="p-3">
                        <Badge variant={eq.status === 'EN_SERVICE' ? 'success' : eq.status === 'EN_MAINTENANCE' ? 'warning' : 'danger'}>
                          {eq.status.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. VUE B : PERFORMANCE OPÉRATIONNELLE (AFFICHÉE IMMÉDIATEMENT)            */}
      {/* ========================================================================= */}
      {subView === 'perf' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Ruban KPI Opérationnel avec Icônes Smart & Classy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Disponibilité Flotte"
              value={`${availabilityRate}%`}
              subValue={`${activeVehiclesCount} / ${equipments.length} matériels opérationnels`}
              customIconBadge={<AvailabilitySmartIcon />}
              trend="+2.4%"
              trendPositive={true}
              onClick={() => onNavigateTab('equipment')}
              accentColor="#10B981"
            />

            <StatCard
              label="Opérateurs Actifs"
              value={uniqueDriversCount}
              subValue="Affectés sur 4 chantiers"
              customIconBadge={<OperatorsSmartIcon />}
              trend="100% Présence"
              trendPositive={true}
              onClick={() => onNavigateTab('assignments')}
              accentColor="#3b82f6"
            />

            <StatCard
              label="Immobilisation Atelier"
              value={inMaintenanceCount}
              subValue={inMaintenanceCount > 0 ? "1 panne bloquante" : "Aucune immobilisation"}
              customIconBadge={<ImmobilizationSmartIcon />}
              trend={inMaintenanceCount > 0 ? "Critique" : "Nominal"}
              trendPositive={inMaintenanceCount === 0}
              onClick={() => onNavigateTab('maintenance')}
              accentColor="#EF4444"
            />

            <StatCard
              label="Heures de Production"
              value="3 960 h"
              subValue="Cumul mensuel des 4 fronts"
              customIconBadge={<ProductionHoursSmartIcon />}
              trend="+5.2%"
              trendPositive={true}
              onClick={() => onNavigateTab('operations')}
              accentColor="#FF8A00"
            />
          </div>

          {/* Les 2 Grands Graphiques Opérationnels : Par Chantier & Par Catégorie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Disponibilité par Chantier / Front Minier */}
            <div className="p-5 rounded-xl bg-[#111820] border border-[#8995A3]/20 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#8995A3]/15 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#FF8A00]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4F6F8] font-mono">
                    Taux de Disponibilité par Front d'Exploitation
                  </h3>
                </div>
                <span className="text-[10px] bg-[#172231] text-[#8995A3] px-2 py-0.5 rounded font-mono border border-[#8995A3]/25">
                  Moyenne 88.2%
                </span>
              </div>

              <div className="space-y-3.5">
                {sitePerformance.map((item) => (
                  <div key={item.site} className="p-3 rounded-lg bg-[#172231]/60 border border-[#8995A3]/15 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#F4F6F8]">{item.site}</span>
                      <span className="font-mono font-bold text-[#10B981]">{item.rate}% disponible</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#08111F] overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${item.rate >= 90 ? 'bg-[#10B981]' : item.rate >= 80 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} 
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-[#8995A3] font-mono">
                      <span>{item.active} machines actives</span>
                      <span>{item.hours} heures de production cumulées</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disponibilité par Catégorie Technique */}
            <div className="p-5 rounded-xl bg-[#111820] border border-[#8995A3]/20 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#8995A3]/15 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#3B82F6]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4F6F8] font-mono">
                    Santé et Rotation du Parc par Catégorie
                  </h3>
                </div>
                <span className="text-[10px] bg-[#172231] text-[#8995A3] px-2 py-0.5 rounded font-mono border border-[#8995A3]/25">
                  Supervision Active
                </span>
              </div>

              <div className="space-y-3.5">
                {categoryStats.map((item) => (
                  <div key={item.cat} className="p-3.5 rounded-lg bg-[#172231]/60 border border-[#8995A3]/15 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-[#F4F6F8]">{item.cat}</span>
                      <span className="font-mono font-bold" style={{ color: item.color }}>{item.rate}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#08111F] overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${item.rate}%`, backgroundColor: item.color }} 
                      />
                    </div>
                    <div className="text-[11px] text-[#8995A3] font-mono flex justify-between">
                      <span>Ratio opérationnel</span>
                      <span className="text-[#F4F6F8] font-semibold">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Cartographie GPS Live & Alertes Prioritaires */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Carte Flotte */}
            <div className="lg:col-span-2 bg-[#111820] border border-[#8995A3]/20 rounded-xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FF8A00]" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4F6F8] font-mono">
                      Cartographie d'Exploitation en Direct
                    </h3>
                    <span className="text-[10px] bg-[#10B981]/15 text-[#10B981] font-mono px-2 py-0.5 rounded border border-[#10B981]/30">
                      {gpsVehicles.length} Balises Actives
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8995A3] mt-1">
                    Surveillance télématique des engins actifs sur les fronts miniers, pistes et chantiers.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('gps')}
                  className="text-xs font-semibold text-[#FF8A00] hover:text-[#FF8A00]/80 flex items-center gap-1 cursor-pointer font-mono p-1.5 rounded hover:bg-[#172231] transition-colors"
                >
                  <span>Vue plein écran</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="rounded-lg overflow-hidden border border-[#8995A3]/25">
                <GpsMap
                  vehicles={gpsVehicles}
                  selectedVehicle={gpsVehicles[0] || null}
                  onSelectVehicle={(v) => {
                    onSelectGpsVehicle(v);
                    onNavigateTab('gps');
                  }}
                />
              </div>
            </div>

            {/* Alertes Prioritaires */}
            <div className="bg-[#111820] border border-[#8995A3]/20 rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-lg">
              <div className="space-y-4">
                <div className="border-b border-[#8995A3]/15 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F4F6F8] font-mono flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                    Alertes de Supervision Fosse
                  </h3>
                  <p className="text-[11px] text-[#8995A3] mt-0.5">
                    Événements requérant une action immédiate.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Maintenance */}
                  <div 
                    onClick={() => onNavigateTab('maintenance')}
                    className="p-3.5 rounded-lg bg-[#172231] border border-[#8995A3]/20 hover:border-[#EF4444]/60 cursor-pointer transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="danger">Intervention Atelier</Badge>
                      <span className="text-[10px] font-mono text-[#8995A3]">Priorité Haute</span>
                    </div>
                    <div className="text-xs font-bold text-[#F4F6F8] group-hover:text-[#EF4444] transition-colors">
                      {criticalAlertsCount > 0 ? `${criticalAlertsCount} panne(s) critique(s) en cours` : "Aucune panne critique"}
                    </div>
                    <div className="text-[11px] text-[#8995A3]">
                      Pompe à injection SDMO 250kVA en attente de validation atelier.
                    </div>
                  </div>

                  {/* Carburant */}
                  <div 
                    onClick={() => onNavigateTab('fuel')}
                    className="p-3.5 rounded-lg bg-[#172231] border border-[#8995A3]/20 hover:border-[#FF8A00]/60 cursor-pointer transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="orange">Audit Carburant</Badge>
                      <span className="text-[10px] font-mono text-[#FF8A00] font-bold">Surconsommation</span>
                    </div>
                    <div className="text-xs font-bold text-[#F4F6F8] group-hover:text-[#FF8A00] transition-colors">
                      {fuelAnomaliesCount} ravitaillement(s) avec dérive &gt; 28%
                    </div>
                    <div className="text-[11px] text-[#8995A3]">
                      Contrôler le débit de pompe et le régime moteur du Hilux (EQ-103).
                    </div>
                  </div>

                  {/* Documents */}
                  <div 
                    onClick={() => onNavigateTab('documents')}
                    className="p-3.5 rounded-lg bg-[#172231] border border-[#8995A3]/20 hover:border-[#F59E0B]/60 cursor-pointer transition-all space-y-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="warning">Conformité Légale</Badge>
                      <span className="text-[10px] font-mono text-[#8995A3]">Échéance &lt; 30j</span>
                    </div>
                    <div className="text-xs font-bold text-[#F4F6F8] group-hover:text-[#F59E0B] transition-colors">
                      {documentsExpiringCount} document(s) à renouveler
                    </div>
                    <div className="text-[11px] text-[#8995A3]">
                      Assurance flotte et certificat de conformité BTP en fin de validité.
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('analytics')}
                className="w-full bg-[#172231] hover:bg-[#FF8A00]/15 text-[#F4F6F8] hover:text-[#FF8A00] border border-[#8995A3]/25 hover:border-[#FF8A00]/50 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                <ShieldCheck className="w-4 h-4 text-[#FF8A00]" />
                <span>Ouvrir l'Assistant Analytique IA</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. VUE C : CYCLE DE ROULAGE MINIER EN DIRECT (ANIMATION 5 PHASES)         */}
      {/* ========================================================================= */}
      {subView === 'cycle' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Composant Cinématique Intégral */}
          <MiningOreTransportCycle />

          {/* Synthèse des Engins Miniers Engagés */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-[#111820] border border-[#8995A3]/20 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-[#FF8A00] uppercase font-bold block">Unité d'Extraction</span>
              <div className="text-sm font-bold text-[#F4F6F8]">Pelle Hydraulique CAT 6020B</div>
              <p className="text-[11px] text-[#8995A3]">Moteur 1 043 ch • Godet 12 m³ • Cadence 1 400 t/h au front de taille sud.</p>
            </div>

            <div className="bg-[#111820] border border-[#8995A3]/20 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-[#FF8A00] uppercase font-bold block">Flotte de Roulage</span>
              <div className="text-sm font-bold text-[#F4F6F8]">3 Tombereaux CAT 793F (240T)</div>
              <p className="text-[11px] text-[#8995A3]">Charge utile 240 tonnes • V16 Quad-Turbo 2 650 ch • Pneus géants 40.00R57.</p>
            </div>

            <div className="bg-[#111820] border border-[#8995A3]/20 p-4 rounded-xl space-y-2">
              <span className="text-[10px] text-[#FF8A00] uppercase font-bold block">Station de Broyage</span>
              <div className="text-sm font-bold text-[#F4F6F8]">Concasseur Primaire Giratoire</div>
              <p className="text-[11px] text-[#8995A3]">Capacité trémie 350T • Déversement par benne 42s • Débit 2 200 t/h.</p>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODALE DU RAPPORT MENSUEL TCO (A4 IMPRIMABLE)                          */}
      {/* ========================================================================= */}
      {showTcoReport && (
        <MonthlyTcoReportModal
          tenantName={tenantName || 'SOGEA-SATOM CI'}
          totalExpenses={totalExpenses}
          totalFuelCost={totalFuelCost}
          totalMaintCost={totalMaintCost}
          totalRentalCost={totalRentalCost}
          availabilityRate={availabilityRate}
          equipmentsCount={equipments.length}
          formatMoney={formatMoney}
          onClose={() => setShowTcoReport(false)}
        />
      )}

    </div>
  );
};

export default DashboardView;
