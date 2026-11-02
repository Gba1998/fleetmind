import React from 'react';
import { Plus, FileText, CheckCircle, Calendar } from 'lucide-react';
import Badge from '../components/ui/Badge';

interface Rental {
  id: string;
  supplier: string;
  equipment: string;
  dailyRate: number;
  totalCost: number;
  startDate: string;
  endDate: string;
  status: string;
}

interface RentalsViewProps {
  rentals: Rental[];
  onAddRental: () => void;
  onFinishRental: (id: string) => void;
  formatMoney: (val: number) => string;
}

export const RentalsView: React.FC<RentalsViewProps> = ({
  rentals,
  onAddRental,
  onFinishRental,
  formatMoney,
}) => {
  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex items-center justify-between bg-[#111820] p-4 rounded-xl border border-[#8995A3]/20">
        <div>
          <h3 className="text-sm font-extrabold text-[#F4F6F8]">
            Gestion des Engins en Location Externe
          </h3>
          <p className="text-xs text-[#8995A3]">
            Suivi des matériels tiers loués auprès des prestataires BTP et calcul des engagements financiers.
          </p>
        </div>

        <button
          onClick={onAddRental}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nouveau Contrat</span>
        </button>
      </div>

      {/* Rentals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rentals.map((rental) => (
          <div
            key={rental.id}
            className="bg-[#111820] border border-[#8995A3]/20 rounded-xl p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-mono text-[#FF8A00] font-bold">
                    {rental.id}
                  </span>
                  <h4 className="font-extrabold text-sm text-[#F4F6F8] mt-0.5">
                    {rental.equipment}
                  </h4>
                  <div className="text-xs text-[#8995A3]">
                    Loueur : <strong className="text-[#F4F6F8]">{rental.supplier}</strong>
                  </div>
                </div>

                <Badge variant={rental.status === 'EN_COURS' ? 'success' : 'neutral'}>
                  {rental.status === 'EN_COURS' ? 'En Cours' : 'Clôturé'}
                </Badge>
              </div>

              <div className="pt-2 border-t border-[#8995A3]/15 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#8995A3] block text-[10px] font-mono uppercase font-bold">Tarif Journalier</span>
                  <strong className="text-[#F4F6F8] font-mono">{formatMoney(rental.dailyRate)}</strong>
                </div>
                <div>
                  <span className="text-[#8995A3] block text-[10px] font-mono uppercase font-bold">Total Prévu</span>
                  <strong className="text-[#FF8A00] font-mono">{formatMoney(rental.totalCost)}</strong>
                </div>
                <div className="col-span-2 pt-1">
                  <span className="text-[#8995A3] block text-[10px] font-mono uppercase font-bold">Période d'Exploitation</span>
                  <span className="text-[#8995A3] font-mono text-[11px]">{rental.startDate} au {rental.endDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#8995A3]/15 flex justify-end">
              {rental.status === 'EN_COURS' ? (
                <button
                  onClick={() => onFinishRental(rental.id)}
                  className="bg-[#172231] hover:bg-[#10B981]/20 text-[#8995A3] hover:text-[#10B981] border border-[#8995A3]/25 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  Clôturer le contrat
                </button>
              ) : (
                <span className="text-[11px] font-mono text-[#8995A3]">Contrat Archivé</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RentalsView;
