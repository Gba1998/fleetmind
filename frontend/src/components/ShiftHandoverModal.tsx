import React, { useState } from 'react';
import { 
  ShieldCheck, X, CheckCircle, AlertTriangle, User, Truck, 
  Clock, FileCheck, Check, Camera, Gauge, Radio
} from 'lucide-react';

interface ShiftHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: {
    id: string;
    vehicleName: string;
    driver: string;
    day: string;
    startHour: number;
    endHour: number;
  };
  onValidateHandover: (checklist: any) => void;
}

export const ShiftHandoverModal: React.FC<ShiftHandoverModalProps> = ({
  isOpen,
  onClose,
  assignment,
  onValidateHandover,
}) => {
  const [alcoholTest, setAlcoholTest] = useState(true);
  const [fluidLevels, setFluidLevels] = useState(true);
  const [tireTreads, setTireTreads] = useState(true);
  const [reversingCamera, setReversingCamera] = useState(true);
  const [fireExtinguisher, setFireExtinguisher] = useState(true);
  const [ppeCompliant, setPpeCompliant] = useState(true);
  const [odometer, setOdometer] = useState('142850');
  const [hourmeter, setHourmeter] = useState('4852.4');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const allChecksPassed = alcoholTest && fluidLevels && tireTreads && reversingCamera && fireExtinguisher && ppeCompliant;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onValidateHandover({
      alcoholTest,
      fluidLevels,
      tireTreads,
      reversingCamera,
      fireExtinguisher,
      ppeCompliant,
      odometer,
      hourmeter,
      notes,
      validatedAt: new Date().toLocaleTimeString('fr-FR')
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08111F]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#111820] border border-[#8995A3]/30 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#172231] to-[#111820] border-b border-[#8995A3]/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F4F6F8] font-mono uppercase tracking-wider">
                Fiche de Prise de Quart & Relève Fosse
              </h3>
              <p className="text-[11px] text-[#8995A3]">
                Contrôle pré-démarrage obligatoire avant engagement sur piste minière.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8995A3] hover:text-[#F4F6F8] p-1 rounded-lg hover:bg-[#172231] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Engin & Conducteur Actif */}
          <div className="p-3.5 rounded-xl bg-[#08111F] border border-[#8995A3]/20 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-[#8995A3] uppercase font-mono block">Matériel Affecté</span>
              <span className="font-bold text-[#F4F6F8] text-xs flex items-center gap-1.5 mt-0.5">
                <Truck className="w-3.5 h-3.5 text-[#FF8A00]" />
                {assignment.vehicleName}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#8995A3] uppercase font-mono block">Conducteur Titulaire</span>
              <span className="font-bold text-[#F4F6F8] text-xs flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-[#3b82f6]" />
                {assignment.driver}
              </span>
            </div>
          </div>

          {/* Relevés Compteurs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#8995A3] font-mono text-[10px] uppercase font-bold mb-1">
                Relevé Horamètre Moteur (Heures)
              </label>
              <input
                type="text"
                value={hourmeter}
                onChange={(e) => setHourmeter(e.target.value)}
                className="w-full bg-[#172231] border border-[#8995A3]/30 rounded-lg px-3 py-2 text-xs font-mono text-[#F4F6F8] focus:border-[#FF8A00] outline-none"
              />
            </div>
            <div>
              <label className="block text-[#8995A3] font-mono text-[10px] uppercase font-bold mb-1">
                Odomètre (Kilomètres)
              </label>
              <input
                type="text"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="w-full bg-[#172231] border border-[#8995A3]/30 rounded-lg px-3 py-2 text-xs font-mono text-[#F4F6F8] focus:border-[#FF8A00] outline-none"
              />
            </div>
          </div>

          {/* Checklist Sécurité & Pré-Démarrage */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold text-[#FF8A00] uppercase tracking-wider block">
              Points de Contrôle Réglementaires Fosse
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              <label className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                alcoholTest ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#F4F6F8]' : 'bg-[#172231] border-[#8995A3]/25 text-[#8995A3]'
              }`}>
                <span className="text-[11px] font-medium">Test Alcoolémie 0.00 g/L</span>
                <input 
                  type="checkbox" 
                  checked={alcoholTest} 
                  onChange={(e) => setAlcoholTest(e.target.checked)} 
                  className="w-4 h-4 accent-[#10B981]" 
                />
              </label>

              <label className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                fluidLevels ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#F4F6F8]' : 'bg-[#172231] border-[#8995A3]/25 text-[#8995A3]'
              }`}>
                <span className="text-[11px] font-medium">Niveaux Huile & Liquides</span>
                <input 
                  type="checkbox" 
                  checked={fluidLevels} 
                  onChange={(e) => setFluidLevels(e.target.checked)} 
                  className="w-4 h-4 accent-[#10B981]" 
                />
              </label>

              <label className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                tireTreads ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#F4F6F8]' : 'bg-[#172231] border-[#8995A3]/25 text-[#8995A3]'
              }`}>
                <span className="text-[11px] font-medium">Pneumatiques / Bandes</span>
                <input 
                  type="checkbox" 
                  checked={tireTreads} 
                  onChange={(e) => setTireTreads(e.target.checked)} 
                  className="w-4 h-4 accent-[#10B981]" 
                />
              </label>

              <label className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                reversingCamera ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#F4F6F8]' : 'bg-[#172231] border-[#8995A3]/25 text-[#8995A3]'
              }`}>
                <span className="text-[11px] font-medium">Caméra & Bip Recul</span>
                <input 
                  type="checkbox" 
                  checked={reversingCamera} 
                  onChange={(e) => setReversingCamera(e.target.checked)} 
                  className="w-4 h-4 accent-[#10B981]" 
                />
              </label>

              <label className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                fireExtinguisher ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#F4F6F8]' : 'bg-[#172231] border-[#8995A3]/25 text-[#8995A3]'
              }`}>
                <span className="text-[11px] font-medium">Extincteur Cabine Vérifié</span>
                <input 
                  type="checkbox" 
                  checked={fireExtinguisher} 
                  onChange={(e) => setFireExtinguisher(e.target.checked)} 
                  className="w-4 h-4 accent-[#10B981]" 
                />
              </label>

              <label className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                ppeCompliant ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#F4F6F8]' : 'bg-[#172231] border-[#8995A3]/25 text-[#8995A3]'
              }`}>
                <span className="text-[11px] font-medium">EPI Complets (Casque, Gilet)</span>
                <input 
                  type="checkbox" 
                  checked={ppeCompliant} 
                  onChange={(e) => setPpeCompliant(e.target.checked)} 
                  className="w-4 h-4 accent-[#10B981]" 
                />
              </label>

            </div>
          </div>

          {/* Remarques / Observations */}
          <div>
            <label className="block text-[#8995A3] font-mono text-[10px] uppercase font-bold mb-1">
              Observations Éventuelles (Poussière, état piste, éclairage)
            </label>
            <input
              type="text"
              placeholder="Ex: Piste humide sur rampe nord, visibilité bonne..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#172231] border border-[#8995A3]/30 rounded-lg px-3 py-2 text-xs text-[#F4F6F8] focus:border-[#FF8A00] outline-none"
            />
          </div>

          {/* Boutons d'Action */}
          <div className="pt-3 border-t border-[#8995A3]/20 flex items-center justify-end gap-3 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#172231] hover:bg-[#172231]/80 text-[#8995A3] hover:text-[#F4F6F8] font-bold cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!allChecksPassed}
              className={`px-5 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                allChecksPassed
                  ? 'bg-[#10B981] hover:bg-[#10B981]/90 text-[#08111F] shadow-lg shadow-[#10B981]/20'
                  : 'bg-[#172231] text-[#8995A3] cursor-not-allowed border border-[#8995A3]/20'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Valider la Prise de Quart</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ShiftHandoverModal;
