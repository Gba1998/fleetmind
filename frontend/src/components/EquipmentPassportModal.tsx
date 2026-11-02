import React from 'react';
import { 
  X, Printer, Download, ShieldCheck, QrCode, FileText, 
  Truck, Gauge, Fuel, Calendar, Wrench, Building2, User, CheckCircle
} from 'lucide-react';
import { EquipmentItem } from '../App';

interface EquipmentPassportModalProps {
  equipment: EquipmentItem | null;
  tenantName: string;
  onClose: () => void;
}

export const EquipmentPassportModal: React.FC<EquipmentPassportModalProps> = ({
  equipment,
  tenantName,
  onClose,
}) => {
  if (!equipment) return null;

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
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#F4F6F8]">
                Fiche Signalétique & Passeport Technique Machine
              </h3>
              <p className="text-[11px] font-mono text-[#8995A3]">
                Format standardisé A4 certifié pour inspection sur site
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
              <span>Imprimer / Enregistrer en PDF</span>
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
        {/* DOCUMENT DE TYPE FEUILLE A4 OFFICIELLE (ZONE IMPRIMABLE)                  */}
        {/* ========================================================================= */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-[#0D1522] text-[#F4F6F8] print:p-0 print:bg-white print:text-black">
          
          <div className="border border-[#8995A3]/30 print:border-black rounded-xl p-6 sm:p-8 bg-[#111820] print:bg-white space-y-6 shadow-xl print:shadow-none">
            
            {/* 1. EN-TÊTE OFFICIEL DE LA FICHE */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-[#FF8A00] print:border-black gap-4">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#FF8A00] print:text-black font-extrabold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RÉFÉRENTIEL MATÉRIEL LOURD & MINIER • FLEETMIND
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#F4F6F8] print:text-black mt-1">
                  PASSEPORT TECHNIQUE D'EXPLOITATION
                </h1>
                <div className="text-xs text-[#8995A3] print:text-gray-600 font-mono mt-0.5">
                  Organisation : <strong className="text-[#F4F6F8] print:text-black">{tenantName}</strong> • Date d'édition : {today}
                </div>
              </div>

              {/* Bloc QR Code de Contrôle & Référence Parc */}
              <div className="flex items-center gap-3 bg-[#08111F] print:bg-gray-100 p-2.5 rounded-lg border border-[#8995A3]/25 print:border-gray-400">
                <div className="w-12 h-12 bg-white p-1 rounded flex items-center justify-center text-black">
                  <QrCode className="w-10 h-10" />
                </div>
                <div className="font-mono text-left">
                  <div className="text-[9px] uppercase text-[#8995A3] print:text-gray-500 font-bold">N° Enregistrement</div>
                  <div className="text-xs font-black text-[#FF8A00] print:text-black">{equipment.id}</div>
                  <div className="text-[9px] text-[#10B981] print:text-green-700 font-bold">CERTIFIÉ VALIDE</div>
                </div>
              </div>
            </div>

            {/* 2. PHOTO DU VÉHICULE & SYNTHÈSE D'IDENTITÉ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Photo HD de l'Équipement */}
              <div className="md:col-span-1 h-52 rounded-xl overflow-hidden border border-[#8995A3]/30 print:border-black bg-[#08111F] relative">
                <img
                  src={equipment.imageUrl || '/images/equipments/excavator.jpg'}
                  alt={equipment.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/fleetmind-mining-truck.png';
                  }}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-black/80 text-[#FF8A00] print:text-black font-mono text-[9px] font-bold px-2 py-0.5 rounded">
                  {equipment.type.replace('_', ' ')}
                </span>
              </div>

              {/* Fiche Signalétique Constructeur */}
              <div className="md:col-span-2 space-y-3">
                <div className="bg-[#172231] print:bg-gray-50 p-4 rounded-xl border border-[#8995A3]/20 print:border-gray-300">
                  <div className="text-[10px] uppercase font-mono text-[#8995A3] print:text-gray-500 font-bold">Désignation Commerciale</div>
                  <h2 className="text-lg font-black text-[#F4F6F8] print:text-black">{equipment.name}</h2>
                  <div className="font-mono text-xs text-[#FF8A00] print:text-black font-black mt-0.5">
                    Immatriculation : {equipment.immat}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="bg-[#172231] print:bg-gray-50 p-2.5 rounded-lg border border-[#8995A3]/15 print:border-gray-300">
                    <span className="text-[10px] text-[#8995A3] print:text-gray-500 block">Marque</span>
                    <strong className="text-[#F4F6F8] print:text-black">{equipment.brand || 'Constructeur BTP'}</strong>
                  </div>

                  <div className="bg-[#172231] print:bg-gray-50 p-2.5 rounded-lg border border-[#8995A3]/15 print:border-gray-300">
                    <span className="text-[10px] text-[#8995A3] print:text-gray-500 block">Modèle Série</span>
                    <strong className="text-[#F4F6F8] print:text-black">{equipment.model || 'Standard Lourd'}</strong>
                  </div>

                  <div className="bg-[#172231] print:bg-gray-50 p-2.5 rounded-lg border border-[#8995A3]/15 print:border-gray-300">
                    <span className="text-[10px] text-[#8995A3] print:text-gray-500 block">Année Sortie</span>
                    <strong className="text-[#F4F6F8] print:text-black">{equipment.year || '2022'}</strong>
                  </div>

                  <div className="bg-[#172231] print:bg-gray-50 p-2.5 rounded-lg border border-[#8995A3]/15 print:border-gray-300">
                    <span className="text-[10px] text-[#8995A3] print:text-gray-500 block">Compteur Actuel</span>
                    <strong className="text-[#10B981] print:text-green-800 font-bold">
                      {equipment.counterValue.toLocaleString()} {equipment.counterType === 'HOURS' ? 'Heures' : 'km'}
                    </strong>
                  </div>

                  <div className="bg-[#172231] print:bg-gray-50 p-2.5 rounded-lg border border-[#8995A3]/15 print:border-gray-300">
                    <span className="text-[10px] text-[#8995A3] print:text-gray-500 block">Conso Cible</span>
                    <strong className="text-blue-400 print:text-blue-800">{equipment.avgCons}</strong>
                  </div>

                  <div className="bg-[#172231] print:bg-gray-50 p-2.5 rounded-lg border border-[#8995A3]/15 print:border-gray-300">
                    <span className="text-[10px] text-[#8995A3] print:text-gray-500 block">Statut Actif</span>
                    <strong className="text-[#FF8A00] print:text-black">{equipment.status.replace(/_/g, ' ')}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. AFFECTATION CHANTIER & OPÉRATEUR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#172231] print:bg-gray-50 border border-[#8995A3]/20 print:border-gray-300 flex items-center gap-3">
                <Building2 className="w-5 h-5 text-[#FF8A00] print:text-black shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#8995A3] print:text-gray-500 block font-bold">
                    Zone / Chantier d'Affectation
                  </span>
                  <strong className="text-[#F4F6F8] print:text-black text-sm">{equipment.site}</strong>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#172231] print:bg-gray-50 border border-[#8995A3]/20 print:border-gray-300 flex items-center gap-3">
                <User className="w-5 h-5 text-[#10B981] print:text-black shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#8995A3] print:text-gray-500 block font-bold">
                    Conducteur Titulaire Habilité
                  </span>
                  <strong className="text-[#F4F6F8] print:text-black text-sm">{equipment.driver}</strong>
                </div>
              </div>
            </div>

            {/* 4. CONFORMITÉ RÉGLEMENTAIRE & VISITES TECHNIQUES */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase text-[#8995A3] print:text-gray-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#10B981] print:text-black" />
                Registre Réglementaire & Sécurité Industrielle
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#08111F] print:bg-white border border-[#8995A3]/20 print:border-gray-300">
                  <div className="text-[10px] text-[#8995A3] print:text-gray-500 uppercase">Assurance Flotte</div>
                  <div className="text-[#10B981] print:text-green-700 font-bold mt-1">CONFORME (À jour)</div>
                  <div className="text-[10px] text-[#8995A3] print:text-gray-500">Échéance : 2027-04-15</div>
                </div>

                <div className="p-3 rounded-lg bg-[#08111F] print:bg-white border border-[#8995A3]/20 print:border-gray-300">
                  <div className="text-[10px] text-[#8995A3] print:text-gray-500 uppercase">Contrôle Technique Mines</div>
                  <div className="text-[#10B981] print:text-green-700 font-bold mt-1">VISITE VALIDÉE</div>
                  <div className="text-[10px] text-[#8995A3] print:text-gray-500">Validité : 12 mois</div>
                </div>

                <div className="p-3 rounded-lg bg-[#08111F] print:bg-white border border-[#8995A3]/20 print:border-gray-300">
                  <div className="text-[10px] text-[#8995A3] print:text-gray-500 uppercase">Prochaine Vidange / Révision</div>
                  <div className="text-[#FF8A00] print:text-black font-bold mt-1">Palier 500 Heures</div>
                  <div className="text-[10px] text-[#8995A3] print:text-gray-500">Prévue dans 150 h</div>
                </div>
              </div>
            </div>

            {/* 5. CADRE DE VALIDATION & VISA OFFICIEL */}
            <div className="pt-6 border-t border-[#8995A3]/20 print:border-gray-400 grid grid-cols-2 gap-8 text-xs font-mono">
              <div className="space-y-6">
                <div>
                  <span className="text-[#8995A3] print:text-gray-600 block text-[10px] uppercase font-bold">
                    Le Responsable Matériel & Parc
                  </span>
                  <div className="font-bold text-[#F4F6F8] print:text-black mt-1">Alexandre Kouamé</div>
                </div>
                <div className="h-10 border-b border-dashed border-[#8995A3]/40 print:border-gray-500 flex items-end">
                  <span className="text-[9px] text-[#8995A3]/60 print:text-gray-400 italic">Signature & Date</span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[#8995A3] print:text-gray-600 block text-[10px] uppercase font-bold">
                    Visa Sécurité / Direction Technique
                  </span>
                  <div className="font-bold text-[#F4F6F8] print:text-black mt-1">{tenantName}</div>
                </div>
                <div className="h-10 border border-[#8995A3]/30 print:border-gray-400 rounded flex items-center justify-center text-[10px] text-[#8995A3] print:text-gray-500 font-bold uppercase">
                  Cachet & Tampon Officiel
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default EquipmentPassportModal;
