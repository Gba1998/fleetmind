import React, { useState } from 'react';
import { Search, Plus, FileCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import Badge from '../components/ui/Badge';

interface FleetDocument {
  id: string;
  vehicle: string;
  docType: string;
  docNo: string;
  expiryDate: string;
  status: string;
}

interface DocumentsViewProps {
  documents: FleetDocument[];
  onAddDocument: () => void;
  onRenewDocument: (id: string) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  onAddDocument,
  onRenewDocument,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = documents.filter((d) => {
    const matchesSearch =
      d.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      d.docType.toLowerCase().includes(search.toLowerCase()) ||
      d.docNo.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VALID':
        return <Badge variant="success">Valide</Badge>;
      case 'ALERT_EXPIRING':
        return <Badge variant="warning">Échéance Proche (&lt; 30j)</Badge>;
      case 'EXPIRED':
        return <Badge variant="danger">Expiré</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#111820] p-4 rounded-xl border border-[#8995A3]/20">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8995A3]" />
            <input
              type="text"
              placeholder="Rechercher document, véhicule, n° police d'assurance..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#172231] border border-[#8995A3]/25 rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F6F8] placeholder-[#8995A3]/60 focus:outline-none focus:border-[#FF8A00]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#172231] border border-[#8995A3]/25 rounded-lg px-3 py-2 text-xs text-[#8995A3] focus:outline-none focus:border-[#FF8A00] cursor-pointer"
          >
            <option value="ALL">Tous les états de validité</option>
            <option value="ALERT_EXPIRING">Échéances proches (Urgent)</option>
            <option value="EXPIRED">Documents expirés</option>
            <option value="VALID">Documents conformes</option>
          </select>
        </div>

        <button
          onClick={onAddDocument}
          className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-[#08111F] font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Enregistrer Document</span>
        </button>
      </div>

      {/* Documents Table */}
      <div className="bg-[#111820] rounded-xl border border-[#8995A3]/20 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#08111F] border-b border-[#8995A3]/20 text-[#8995A3] font-bold uppercase text-[10px] font-mono">
            <tr>
              <th className="p-3.5">Équipement Associé</th>
              <th className="p-3.5">Type de Pièce Légale</th>
              <th className="p-3.5">Numéro Officiel</th>
              <th className="p-3.5">Date d'Expiration</th>
              <th className="p-3.5">Statut de Conformité</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8995A3]/15 font-medium text-[#F4F6F8]">
            {filtered.map((doc) => (
              <tr key={doc.id} className="hover:bg-[#172231]/40 transition-colors">
                <td className="p-3.5 font-bold">{doc.vehicle}</td>
                <td className="p-3.5">{doc.docType}</td>
                <td className="p-3.5 font-mono text-[#8995A3]">{doc.docNo}</td>
                <td className="p-3.5 font-mono font-bold">{doc.expiryDate}</td>
                <td className="p-3.5">{getStatusBadge(doc.status)}</td>
                <td className="p-3.5 text-right">
                  {doc.status !== 'VALID' && (
                    <button
                      onClick={() => onRenewDocument(doc.id)}
                      className="bg-[#10B981]/15 hover:bg-[#10B981] text-[#10B981] hover:text-[#08111F] px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all border border-[#10B981]/30 cursor-pointer"
                    >
                      Renouveler (+1 an)
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default DocumentsView;
