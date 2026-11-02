import React, { useState } from 'react';
import { 
  Search, Plus, Download, Calendar, CheckCircle, Clock, Trash2,
  Moon, Sun, ShieldAlert, Activity, User, Truck, FileCheck, Check
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import ShiftHandoverModal from '../components/ShiftHandoverModal';

export interface Assignment {
  id: string;
  vehicleId: string;
  vehicleName: string;
  driver: string;
  color?: string;
  startHour: number;
  endHour: number;
  day: string;
  shift?: 'JOUR' | 'NUIT';
  vigilanceScore?: number; // percentage 0-100
  continuousHours?: number;
  handoverCompleted?: boolean;
  site?: string;
}

interface OperationsViewProps {
  assignments: Assignment[];
  onAddAssignment: () => void;
  onDeleteAssignment: (id: string) => void;
  onExportCsv: () => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  assignments,
  onAddAssignment,
  onDeleteAssignment,
  onExportCsv,
}) => {
  const [search, setSearch] = useState('');
  const [shiftFilter, setShiftFilter] = useState<'ALL' | 'JOUR' | 'NUIT'>('ALL');
  const [siteFilter, setSiteFilter] = useState<string>('ALL');
  const [selectedAssignmentForHandover, setSelectedAssignmentForHandover] = useState<Assignment | null>(null);
  const [completedHandovers, setCompletedHandovers] = useState<Record<string, boolean>>({});

  // Enrich assignments with realistic mining operational metadata if missing
  const enrichedAssignments: Assignment[] = assignments.map((asg, idx) => {
    const isNight = asg.startHour >= 18 || asg.startHour < 6;
    const shift = asg.shift || (isNight ? 'NUIT' : 'JOUR');
    const continuousHours = asg.continuousHours || (idx % 2 === 0 ? 3.5 : 4.8);
    const vigilanceScore = asg.vigilanceScore || (continuousHours > 4.5 ? 74 : 96);
    const site = asg.site || (idx % 3 === 0 ? 'Fosse Yopougon PK18' : idx % 3 === 1 ? 'Carrière Bouaflé' : 'Autoroute du Nord PK18');
    const handoverCompleted = completedHandovers[asg.id] ?? asg.handoverCompleted ?? (idx === 0 || idx === 1);

    return {
      ...asg,
      shift,
      continuousHours,
      vigilanceScore,
      site,
      handoverCompleted
    };
  });

  const filtered = enrichedAssignments.filter((a) => {
    const matchSearch =
      a.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
      a.driver.toLowerCase().includes(search.toLowerCase()) ||
      a.day.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      (a.site && a.site.toLowerCase().includes(search.toLowerCase()));

    const matchShift = shiftFilter === 'ALL' || a.shift === shiftFilter;
    const matchSite = siteFilter === 'ALL' || a.site === siteFilter;

    return matchSearch && matchShift && matchSite;
  });

  // Calculate KPIs
  const dayShiftCount = enrichedAssignments.filter((a) => a.shift === 'JOUR').length;
  const nightShiftCount = enrichedAssignments.filter((a) => a.shift === 'NUIT').length;
  const avgVigilance = enrichedAssignments.length
    ? Math.round(enrichedAssignments.reduce((acc, a) => acc + (a.vigilanceScore || 90), 0) / enrichedAssignments.length)
    : 95;
  const fatigueAlertsCount = enrichedAssignments.filter((a) => (a.vigilanceScore || 100) < 80).length;

  const handleValidateHandover = (checklist: any) => {
    if (selectedAssignmentForHandover) {
      setCompletedHandovers((prev) => ({
        ...prev,
        [selectedAssignmentForHandover.id]: true
      }));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. RUBAN KPI DES QUARTS MINIERS 24/7 & VIGILANCE                          */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#111820] border border-[#8995A3]/20 rounded-xl p-4 flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#8995A3] uppercase block">
              Opérateurs Mobilisés
            </span>
            <div className="text-xl font-extrabold text-[#F4F6F8] mt-0.5">
              {enrichedAssignments.length} Actifs
            </div>
            <div className="text-[11px] text-[#8995A3] mt-0.5 font-mono">
              <span className="text-amber-400 font-bold">{dayShiftCount} Jour</span> • <span className="text-indigo-400 font-bold">{nightShiftCount} Nuit</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FF8A00]/15 border border-[#FF8A00]/30 flex items-center justify-center text-[#FF8A00]">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#111820] border border-[#8995A3]/20 rounded-xl p-4 flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#8995A3] uppercase block">
              Indice Vigilance Équipe
            </span>
            <div className="text-xl font-extrabold text-[#10B981] mt-0.5">
              {avgVigilance}% NOMINAL
            </div>
            <div className="text-[11px] text-[#8995A3] mt-0.5 font-mono">
              Supervision anti-endormissement
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#111820] border border-[#8995A3]/20 rounded-xl p-4 flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#8995A3] uppercase block">
              Alertes Fatigue / Repos
            </span>
            <div className={`text-xl font-extrabold mt-0.5 ${fatigueAlertsCount > 0 ? 'text-amber-400' : 'text-[#F4F6F8]'}`}>
              {fatigueAlertsCount} à surveiller
            </div>
            <div className="text-[11px] text-[#8995A3] mt-0.5 font-mono">
              Seuil critique &gt; 4.5h de conduite
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
            fatigueAlertsCount > 0 
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' 
              : 'bg-[#172231] border-[#8995A3]/30 text-[#8995A3]'
          }`}>
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#111820] border border-[#8995A3]/20 rounded-xl p-4 flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] font-mono font-bold text-[#8995A3] uppercase block">
              Prises de Poste Visées
            </span>
            <div className="text-xl font-extrabold text-[#10B981] mt-0.5">
              {enrichedAssignments.filter((a) => a.handoverCompleted).length} / {enrichedAssignments.length}
            </div>
            <div className="text-[11px] text-[#8995A3] mt-0.5 font-mono">
              Checklists fosse validées
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. TIMELINE VISUELLE DES 24H (QUART JOUR / QUART NUIT)                    */}
      {/* ========================================================================= */}
      <div className="bg-[#111820] border border-[#8995A3]/20 rounded-xl p-4 space-y-3 shadow">
        <div className="flex items-center justify-between border-b border-[#8995A3]/15 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF8A00]" />
            <h3 className="text-xs font-mono font-bold uppercase text-[#F4F6F8]">
              Rotation des Quarts 24/7 (Continu Fosse & Chantiers)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Sun className="w-3 h-3" /> Quart Jour (06h - 18h)
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <Moon className="w-3 h-3" /> Quart Nuit (18h - 06h)
            </span>
          </div>
        </div>

        {/* Barre 24H dynamique */}
        <div className="space-y-1.5 font-mono text-[10px]">
          <div className="flex justify-between text-center text-[#8995A3]">
            <span>00h</span>
            <span>03h</span>
            <span>06h (Relève)</span>
            <span>09h</span>
            <span>12h</span>
            <span>15h</span>
            <span>18h (Relève)</span>
            <span>21h</span>
            <span>24h</span>
          </div>

          <div className="relative h-6 bg-[#08111F] rounded-lg border border-[#8995A3]/30 overflow-hidden flex">
            {/* Quart Nuit (00h-06h) */}
            <div className="w-[25%] h-full bg-indigo-950/60 border-r border-[#8995A3]/20 flex items-center justify-center text-indigo-300 font-bold">
              Poste Nuit
            </div>
            {/* Quart Jour (06h-18h) */}
            <div className="w-[50%] h-full bg-amber-950/40 border-r border-[#8995A3]/20 flex items-center justify-center text-amber-300 font-bold">
              Poste Jour Nominal
            </div>
            {/* Quart Nuit (18h-24h) */}
            <div className="w-[25%] h-full bg-indigo-950/60 flex items-center justify-center text-indigo-300 font-bold">
              Poste Nuit
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BARRE DE FILTRES ET ACTIONS                                            */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111820] p-4 rounded-xl border border-[#8995A3]/20">
        
        {/* Sélecteur de Quart */}
        <div className="flex items-center gap-1.5 bg-[#08111F] p-1 rounded-lg border border-[#8995A3]/25 font-mono text-xs">
          <button
            type="button"
            onClick={() => setShiftFilter('ALL')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
              shiftFilter === 'ALL'
                ? 'bg-[#FF8A00] text-[#08111F]'
                : 'text-[#8995A3] hover:text-[#F4F6F8]'
            }`}
          >
            Tous les Quarts
          </button>
          <button
            type="button"
            onClick={() => setShiftFilter('JOUR')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
              shiftFilter === 'JOUR'
                ? 'bg-amber-500 text-[#08111F]'
                : 'text-[#8995A3] hover:text-[#F4F6F8]'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Quart Jour</span>
          </button>
          <button
            type="button"
            onClick={() => setShiftFilter('NUIT')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
              shiftFilter === 'NUIT'
                ? 'bg-indigo-600 text-white'
                : 'text-[#8995A3] hover:text-[#F4F6F8]'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Quart Nuit</span>
          </button>
        </div>

        {/* Recherche Textuelle */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8995A3]" />
          <input
            type="text"
            placeholder="Rechercher chauffeur, matériel, site..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#172231] border border-[#8995A3]/25 rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F6F8] placeholder-[#8995A3]/60 focus:outline-none focus:border-[#FF8A00]"
          />
        </div>

        {/* Boutons Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCsv}
            className="bg-[#172231] hover:bg-[#172231]/80 text-[#F4F6F8] px-3 py-2 rounded-lg text-xs font-semibold border border-[#8995A3]/25 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#FF8A00]" />
            <span className="hidden sm:inline">Export Planning CSV</span>
          </button>

          <button
            onClick={onAddAssignment}
            className="bg-[#10B981] hover:bg-[#10B981]/90 text-[#08111F] font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nouvelle Affectation</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. LISTE DÉTAILLÉE DES AFFECTATIONS & ROTATIONS                           */}
      {/* ========================================================================= */}
      <div className="bg-[#111820] rounded-xl border border-[#8995A3]/20 overflow-hidden shadow">
        <div className="divide-y divide-[#8995A3]/15">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#8995A3] font-mono text-xs">
              Aucune affectation trouvée pour les critères sélectionnés.
            </div>
          ) : (
            filtered.map((asg) => {
              const isLowVigilance = (asg.vigilanceScore || 100) < 80;

              return (
                <div
                  key={asg.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#172231]/40 transition-colors"
                >
                  {/* Informations Principales Mission & Engin */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Badge Créneau Horaire */}
                    <div className={`p-2.5 rounded-xl border text-center min-w-[90px] font-mono ${
                      asg.shift === 'NUIT'
                        ? 'bg-indigo-950/40 border-indigo-700/40 text-indigo-300'
                        : 'bg-amber-950/30 border-amber-600/30 text-amber-400'
                    }`}>
                      <div className="text-[10px] font-bold flex items-center justify-center gap-1">
                        {asg.shift === 'NUIT' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                        <span>{asg.shift}</span>
                      </div>
                      <div className="text-xs font-black mt-0.5">
                        {asg.startHour}:00 - {asg.endHour}:00
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-[#F4F6F8]">
                          {asg.vehicleName}
                        </span>
                        <span className="text-[10px] font-mono text-[#8995A3]">
                          ({asg.id})
                        </span>
                        <span className="text-[10px] bg-[#172231] text-[#8995A3] px-2 py-0.5 rounded border border-[#8995A3]/25 font-mono">
                          {asg.site}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#8995A3]">
                        <span>Conducteur : <strong className="text-[#F4F6F8]">{asg.driver}</strong></span>
                        <span>•</span>
                        <span className="font-mono">{asg.day}</span>
                      </div>
                    </div>
                  </div>

                  {/* Indicateurs de Vigilance, Relève Fosse et Clôture */}
                  <div className="flex items-center gap-4 self-end md:self-auto font-mono text-xs">
                    
                    {/* Heures Consécutives & Jauge Vigilance */}
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-[10px] text-[#8995A3]">Temps volant :</span>
                        <span className="text-[#F4F6F8] font-bold">{asg.continuousHours}h consécutives</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-20 h-1.5 bg-[#08111F] rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              isLowVigilance ? 'bg-amber-500' : 'bg-[#10B981]'
                            }`}
                            style={{ width: `${asg.vigilanceScore}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold ${
                          isLowVigilance ? 'text-amber-400' : 'text-[#10B981]'
                        }`}>
                          {asg.vigilanceScore}%
                        </span>
                      </div>
                    </div>

                    {/* Fiche de Prise de Quart / Relève Fosse */}
                    {asg.handoverCompleted ? (
                      <span className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Prise de Quart Visée</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedAssignmentForHandover(asg)}
                        className="bg-[#FF8A00]/15 hover:bg-[#FF8A00] text-[#FF8A00] hover:text-[#08111F] border border-[#FF8A00]/40 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        title="Ouvrir la checklist de prise de quart et contrôle pré-démarrage"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Viser Prise de Poste</span>
                      </button>
                    )}

                    {/* Clôturer l'Affectation */}
                    <button
                      onClick={() => onDeleteAssignment(asg.id)}
                      className="text-[#8995A3] hover:text-emerald-400 p-2 rounded-lg hover:bg-[#172231] transition-colors cursor-pointer"
                      title="Clôturer la mission de l'opérateur"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Fiche de Prise de Quart Fosse */}
      {selectedAssignmentForHandover && (
        <ShiftHandoverModal
          isOpen={true}
          onClose={() => setSelectedAssignmentForHandover(null)}
          assignment={selectedAssignmentForHandover}
          onValidateHandover={handleValidateHandover}
        />
      )}

    </div>
  );
};

export default OperationsView;
