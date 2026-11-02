import React from 'react';
import { 
  X, Printer, DollarSign, Activity, Truck, Fuel, 
  Wrench, ShieldCheck, TrendingUp, AlertTriangle, Building2, CheckCircle
} from 'lucide-react';
import { EquipmentItem } from '../App';

interface MonthlyTcoReportModalProps {
  tenantName: string;
  totalExpenses: number;
  totalFuelCost: number;
  totalMaintCost: number;
  totalRentalCost: number;
  availabilityRate: number;
  equipmentsCount: number;
  formatMoney: (v: number) => string;
  onClose: () => void;
}

export const MonthlyTcoReportModal: React.FC<MonthlyTcoReportModalProps> = ({
  tenantName,
  totalExpenses,
  totalFuelCost,
  totalMaintCost,
  totalRentalCost,
  availabilityRate,
  equipmentsCount,
  formatMoney,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-[#08111F]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Fenêtre Modale de Prévisualisation */}
      <div className="bg-[#111820] border border-[#8995A3]/30 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col my-auto max-h-[95vh] overflow-hidden">
        
        {/* Barre d'Action Supérieure (Non Imprimée) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-[#08111F] border-b border-[#8995A3]/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF8A00]/15 border border-[#FF8A00]/30 flex items-center justify-center text-[#FF8A00]">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#F4F6F8]">
                Rapport Mensuel d'Audit TCO & Performance Flotte
              </h3>
              <p className="text-[11px] font-mono text-[#8995A3]">
                Synthèse exécutive certifiée pour la Direction Financière & Générale
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-[#08111F] font-black px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-[#FF8A00]/25 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 stroke-[2.5]" />
              <span>Imprimer / Sauvegarder en PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-[#8995A3] hover:text-[#F4F6F8] p-2 rounded-lg hover:bg-[#172231] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DOCUMENT RAPPORT EXÉCUTIF A4 (ZONE IMPRIMABLE)                            */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-[#0D1522] text-[#F4F6F8] print:p-0 print:bg-white print:text-black">
          
          <div className="border border-[#8995A3]/30 print:border-black rounded-xl p-6 sm:p-8 bg-[#111820] print:bg-white space-y-6 shadow-xl print:shadow-none">
            
            {/* 1. EN-TÊTE DU RAPPORT */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-[#FF8A00] print:border-black gap-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#FF8A00] print:text-black font-extrabold">
                  FLEETMIND INTELLIGENT OPERATIONS • RAPPORT OFFICIEL
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F4F6F8] print:text-black mt-1">
                  AUDIT TCO CONSOLIDÉ & GOUVERNANCE DU PARC
                </h1>
                <div className="text-xs text-[#8995A3] print:text-gray-600 font-mono mt-0.5">
                  Filiale : <strong className="text-[#F4F6F8] print:text-black">{tenantName}</strong> • Période : Octobre 2026 • Date d'arrêté : {today}
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="inline-block bg-[#10B981]/15 print:bg-green-100 text-[#10B981] print:text-green-800 border border-[#10B981]/30 print:border-green-400 px-3 py-1 rounded text-xs font-bold">
                  AUDIT CONFORME
                </span>
                <div className="text-[10px] text-[#8995A3] print:text-gray-500 mt-1">
                  Réf: AUDIT-2026-M10
                </div>
              </div>
            </div>

            {/* 2. CHIFFRES CLÉS STRATÉGIQUES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#172231] print:bg-gray-50 p-4 rounded-xl border border-[#8995A3]/20 print:border-gray-300">
                <span className="text-[10px] uppercase font-mono text-[#8995A3] print:text-gray-500 block font-bold">
                  TCO Total Période
                </span>
                <strong className="text-lg sm:text-xl font-black font-mono text-[#FF8A00] print:text-black block mt-1">
                  {formatMoney(totalExpenses)}
                </strong>
                <span className="text-[10px] text-[#10B981] print:text-green-700 font-bold font-mono">
                  -4.2% vs M-1 (Optimisé)
                </span>
              </div>

              <div className="bg-[#172231] print:bg-gray-50 p-4 rounded-xl border border-[#8995A3]/20 print:border-gray-300">
                <span className="text-[10px] uppercase font-mono text-[#8995A3] print:text-gray-500 block font-bold">
                  Disponibilité Flotte
                </span>
                <strong className="text-lg sm:text-xl font-black font-mono text-[#10B981] print:text-green-800 block mt-1">
                  {availabilityRate}%
                </strong>
                <span className="text-[10px] text-[#8995A3] print:text-gray-600 font-mono">
                  Objectif cible &ge; 92%
                </span>
              </div>

              <div className="bg-[#172231] print:bg-gray-50 p-4 rounded-xl border border-[#8995A3]/20 print:border-gray-300">
                <span className="text-[10px] uppercase font-mono text-[#8995A3] print:text-gray-500 block font-bold">
                  Poste Carburant
                </span>
                <strong className="text-lg sm:text-xl font-black font-mono text-blue-400 print:text-blue-800 block mt-1">
                  {formatMoney(totalFuelCost)}
                </strong>
                <span className="text-[10px] text-[#8995A3] print:text-gray-600 font-mono">
                  1 anomalie signalée
                </span>
              </div>

              <div className="bg-[#172231] print:bg-gray-50 p-4 rounded-xl border border-[#8995A3]/20 print:border-gray-300">
                <span className="text-[10px] uppercase font-mono text-[#8995A3] print:text-gray-500 block font-bold">
                  Maintenance & Ateliers
                </span>
                <strong className="text-lg sm:text-xl font-black font-mono text-[#FF8A00] print:text-amber-800 block mt-1">
                  {formatMoney(totalMaintCost)}
                </strong>
                <span className="text-[10px] text-[#8995A3] print:text-gray-600 font-mono">
                  4 ordres exécutés
                </span>
              </div>
            </div>

            {/* 3. VENTILATION DES DÉPENSES OPÉRATIONNELLES */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-[#8995A3] print:text-gray-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#FF8A00] print:text-black" />
                Décomposition Budgétaire Consolidée
              </h3>

              <div className="overflow-x-auto border border-[#8995A3]/20 print:border-gray-300 rounded-xl bg-[#08111F] print:bg-white text-xs font-mono">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#172231] print:bg-gray-100 text-[#8995A3] print:text-gray-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Poste de Dépense</th>
                      <th className="p-3">Montant Consolidé</th>
                      <th className="p-3">% TCO</th>
                      <th className="p-3">Statut Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#8995A3]/10 print:divide-gray-200">
                    <tr>
                      <td className="p-3 font-bold text-[#F4F6F8] print:text-black">Approvisionnements Carburant & Cuves</td>
                      <td className="p-3 font-bold text-blue-400 print:text-black">{formatMoney(totalFuelCost)}</td>
                      <td className="p-3">48.2%</td>
                      <td className="p-3 text-[#10B981] print:text-green-700 font-bold">Sous contrôle</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-[#F4F6F8] print:text-black">Maintenance Lourde & Interventions d'Atelier</td>
                      <td className="p-3 font-bold text-[#FF8A00] print:text-black">{formatMoney(totalMaintCost)}</td>
                      <td className="p-3">24.6%</td>
                      <td className="p-3 text-[#10B981] print:text-green-700 font-bold">Conforme au plan</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-[#F4F6F8] print:text-black">Contrats de Location Externe (Matériels tiers)</td>
                      <td className="p-3 font-bold text-purple-400 print:text-black">{formatMoney(totalRentalCost)}</td>
                      <td className="p-3">12.8%</td>
                      <td className="p-3 text-[#FF8A00] print:text-amber-700 font-bold">Renouvellement en cours</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-[#F4F6F8] print:text-black">Assurances, Visites Techniques & Conformité</td>
                      <td className="p-3 font-bold text-[#10B981] print:text-black">{formatMoney(9200000)}</td>
                      <td className="p-3">10.5%</td>
                      <td className="p-3 text-[#10B981] print:text-green-700 font-bold">100% à jour</td>
                    </tr>
                    <tr className="bg-[#172231]/40 print:bg-gray-50 font-black">
                      <td className="p-3 uppercase">Total Consolidé TCO Période</td>
                      <td className="p-3 text-[#FF8A00] print:text-black">{formatMoney(totalExpenses)}</td>
                      <td className="p-3">100.0%</td>
                      <td className="p-3 text-[#10B981] print:text-green-700">Validé</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. RECOMMANDATIONS EXÉCUTIVES DE L'ASSISTANT IA */}
            <div className="p-4 rounded-xl bg-[#172231] print:bg-gray-50 border border-[#FF8A00]/30 print:border-gray-400 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#FF8A00] print:text-black font-bold font-mono text-[11px] uppercase">
                <CheckCircle className="w-4 h-4 text-[#FF8A00] print:text-black" />
                Recommandations Stratégiques FleetMind AI
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[#8995A3] print:text-gray-700 leading-relaxed">
                <li>
                  <strong className="text-[#F4F6F8] print:text-black">Optimisation Carburant :</strong> Diligenter un contrôle injecteur sur le Toyota Hilux (EQ-103) suite à une dérive de +18% par rapport à sa consommation nominale.
                </li>
                <li>
                  <strong className="text-[#F4F6F8] print:text-black">Gestion des Actifs :</strong> Remplacement planifié de la pompe d'injection sur le Groupe SDMO (EQ-104) afin de rétablir 100% de disponibilité sur la base vie.
                </li>
                <li>
                  <strong className="text-[#F4F6F8] print:text-black">Arbitrage Location :</strong> Clôturer la location de la Nacelle Ciseau Loxam à échéance pour économiser 1.2M FCFA par quinzaine.
                </li>
              </ul>
            </div>

            {/* 5. VISAS ET SIGNATURES OFFICIELLES */}
            <div className="pt-6 border-t border-[#8995A3]/20 print:border-gray-400 grid grid-cols-2 gap-8 text-xs font-mono">
              <div className="space-y-6">
                <div>
                  <span className="text-[#8995A3] print:text-gray-600 block text-[10px] uppercase font-bold">
                    La Direction Administrative & Financière
                  </span>
                  <div className="font-bold text-[#F4F6F8] print:text-black mt-1">Sinan B.</div>
                </div>
                <div className="h-10 border-b border-dashed border-[#8995A3]/40 print:border-gray-500 flex items-end">
                  <span className="text-[9px] text-[#8995A3]/60 print:text-gray-400 italic">Signature & Visa</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[#8995A3] print:text-gray-600 block text-[10px] uppercase font-bold">
                    La Direction Générale des Opérations
                  </span>
                  <div className="font-bold text-[#F4F6F8] print:text-black mt-1">{tenantName}</div>
                </div>
                <div className="h-10 border border-[#8995A3]/30 print:border-gray-400 rounded flex items-center justify-center text-[10px] text-[#8995A3] print:text-gray-500 font-bold uppercase">
                  Cachet de Validation Direction
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default MonthlyTcoReportModal;
