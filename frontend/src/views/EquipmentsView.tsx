import React, { useState } from 'react';
import { 
  Search, Plus, Upload, Download, Trash2, MapPin, 
  LayoutGrid, List, ChevronRight, X, Gauge, Fuel, User, Building, Printer
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import { EquipmentItem } from '../App';
import EquipmentPassportModal from '../components/EquipmentPassportModal';

interface EquipmentsViewProps {
  equipments: EquipmentItem[];
  currentRole: { code: string; label: string };
  tenantName?: string;
  onAddEquipment: () => void;
  onImportCsv: () => void;
  onExportCsv: () => void;
  onUpdateStatus: (id: string, status: 'EN_SERVICE' | 'EN_MAINTENANCE' | 'EN_PANNE') => void;
  onDeleteEquipment: (id: string) => void;
  onViewOnMap: (immat: string) => void;
}

export const EquipmentsView: React.FC<EquipmentsViewProps> = ({
  equipments,
  currentRole,
  tenantName,
  onAddEquipment,
  onImportCsv,
  onExportCsv,
  onUpdateStatus,
  onDeleteEquipment,
  onViewOnMap,
}) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [inspectedEquipment, setInspectedEquipment] = useState<EquipmentItem | null>(null);
  const [passportEquipment, setPassportEquipment] = useState<EquipmentItem | null>(null);

  const filtered = equipments.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.immat.toLowerCase().includes(search.toLowerCase()) ||
      e.driver.toLowerCase().includes(search.toLowerCase()) ||
      e.site.toLowerCase().includes(search.toLowerCase()) ||
      (e.brand && e.brand.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || e.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: EquipmentItem['status']) => {
    switch (status) {
      case 'EN_SERVICE':
        return <Badge variant="success">En Service</Badge>;
      case 'EN_MAINTENANCE':
        return <Badge variant="warning">En Maintenance</Badge>;
      case 'EN_PANNE':
        return <Badge variant="danger">En Panne</Badge>;
    }
  };

  const getCategoryLabel = (type: EquipmentItem['type']) => {
    switch (type) {
      case 'ENGIN_BTP': return 'Engin BTP';
      case 'CAMION': return 'Camion Lourd';
      case 'VEHICULE_LEGER': return 'Véhicule 4x4';
      case 'GENERATEUR': return 'Groupe Électrogène';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search, Filter Bar and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#111820] p-4 rounded-xl border border-[#8995A3]/20">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8995A3]" />
            <input
              type="text"
              placeholder="Rechercher engin, marque, immatriculation, chauffeur, chantier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#172231] border border-[#8995A3]/25 rounded-lg pl-9 pr-3 py-2 text-xs text-[#F4F6F8] placeholder-[#8995A3]/60 focus:outline-none focus:border-[#FF8A00]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#172231] border border-[#8995A3]/25 rounded-lg px-3 py-2 text-xs text-[#8995A3] focus:outline-none focus:border-[#FF8A00] cursor-pointer"
          >
            <option value="ALL">Toutes catégories</option>
            <option value="ENGIN_BTP">Engins BTP (Pelles, Chargeuses)</option>
            <option value="CAMION">Camions Bennes / Malaxeurs</option>
            <option value="VEHICULE_LEGER">Véhicules Légers (4x4)</option>
            <option value="GENERATEUR">Groupes Électrogènes</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#172231] border border-[#8995A3]/25 rounded-lg px-3 py-2 text-xs text-[#8995A3] focus:outline-none focus:border-[#FF8A00] cursor-pointer"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="EN_SERVICE">En service</option>
            <option value="EN_MAINTENANCE">En maintenance</option>
            <option value="EN_PANNE">En panne</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle View Mode */}
          <div className="bg-[#172231] p-1 rounded-lg border border-[#8995A3]/20 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-[#FF8A00] text-[#08111F] font-bold shadow' : 'text-[#8995A3] hover:text-[#F4F6F8]'}`}
              title="Vue cartes avec photos"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-all cursor-pointer ${viewMode === 'table' ? 'bg-[#FF8A00] text-[#08111F] font-bold shadow' : 'text-[#8995A3] hover:text-[#F4F6F8]'}`}
              title="Vue tableau avec aperçus"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onExportCsv}
            className="bg-[#172231] hover:bg-[#172231]/80 text-[#F4F6F8] px-3 py-2 rounded-lg text-xs font-semibold border border-[#8995A3]/25 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#FF8A00]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {['ADM-E', 'GP'].includes(currentRole.code) && (
            <>
              <button
                onClick={onImportCsv}
                className="bg-[#172231] hover:bg-[#172231]/80 text-[#F4F6F8] px-3 py-2 rounded-lg text-xs font-semibold border border-[#8995A3]/25 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Import</span>
              </button>

              <button
                onClick={onAddEquipment}
                className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-[#08111F] font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-[#FF8A00]/20 cursor-pointer transition-transform active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Nouvel Équipement</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* MODE CARTES PREMIUM AVEC PHOTOGRAPHIES RÉALISTES                        */}
      {/* ======================================================================= */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((eq) => (
            <div
              key={eq.id}
              className="bg-[#111820] border border-[#8995A3]/20 hover:border-[#FF8A00]/50 rounded-xl overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[#FF8A00]/5 transition-all group"
            >
              <div>
                {/* Bandeau Photo Haute Définition */}
                <div className="relative h-44 sm:h-48 w-full bg-[#08111F] overflow-hidden">
                  <img
                    src={eq.imageUrl || '/images/equipments/excavator.jpg'}
                    alt={eq.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/fleetmind-mining-truck.png';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Dégradé sombre pour lisibilité des badges */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111820] via-transparent to-black/50" />

                  {/* Badge Catégorie Flottant Haut-Gauche */}
                  <span className="absolute top-3 left-3 bg-[#08111F]/85 backdrop-blur-md border border-[#8995A3]/30 text-[#FF8A00] font-mono text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                    {getCategoryLabel(eq.type)}
                  </span>

                  {/* Badge Statut Flottant Haut-Droite avec Sélecteur Interactif */}
                  <div className="absolute top-3 right-3 relative group/status">
                    {getStatusBadge(eq.status)}
                    <div className="absolute right-0 mt-1 hidden group-hover/status:flex flex-col bg-[#08111F] border border-[#8995A3]/30 rounded-lg p-1 z-30 shadow-2xl w-36 text-[10px] font-mono">
                      <button onClick={() => onUpdateStatus(eq.id, 'EN_SERVICE')} className="text-left px-2 py-1 text-[#10B981] hover:bg-[#172231] rounded">● En service</button>
                      <button onClick={() => onUpdateStatus(eq.id, 'EN_MAINTENANCE')} className="text-left px-2 py-1 text-[#F59E0B] hover:bg-[#172231] rounded">● Maintenance</button>
                      <button onClick={() => onUpdateStatus(eq.id, 'EN_PANNE')} className="text-left px-2 py-1 text-[#EF4444] hover:bg-[#172231] rounded">● En panne</button>
                    </div>
                  </div>

                  {/* Chantier d'Exploitation Flottant Bas-Gauche */}
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] font-medium text-[#F4F6F8] bg-[#08111F]/80 backdrop-blur-sm px-2.5 py-0.5 rounded border border-[#8995A3]/25">
                    <MapPin className="w-3 h-3 text-[#FF8A00] shrink-0" />
                    <span className="truncate max-w-[200px]">{eq.site}</span>
                  </div>
                </div>

                {/* Corps de Carte */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-[#FF8A00] font-bold tracking-wider">
                        {eq.immat}
                      </span>
                      {eq.year && (
                        <span className="text-[10px] font-mono text-[#8995A3] bg-[#172231] px-1.5 py-0.5 rounded">
                          Année {eq.year}
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => setInspectedEquipment(eq)}
                      className="font-extrabold text-sm text-[#F4F6F8] mt-1 hover:text-[#FF8A00] transition-colors cursor-pointer line-clamp-1"
                      title={eq.name}
                    >
                      {eq.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-[#8995A3] mt-1">
                      <User className="w-3.5 h-3.5 text-[#8995A3]" />
                      <span className="truncate">{eq.driver}</span>
                    </div>
                  </div>

                  {/* Ruban Métrologique & Consommation */}
                  <div className="p-3 rounded-lg bg-[#172231]/60 border border-[#8995A3]/15 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-1 text-[#8995A3] text-[10px] uppercase font-mono font-bold">
                        <Gauge className="w-3 h-3 text-[#8995A3]" />
                        <span>Compteur ({eq.counterType === 'HOURS' ? 'Heures' : 'Km'})</span>
                      </div>
                      <div className="font-bold font-mono text-[#F4F6F8] mt-0.5">
                        {eq.counterValue.toLocaleString()} {eq.counterType === 'HOURS' ? 'h' : 'km'}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 text-[#8995A3] text-[10px] uppercase font-mono font-bold">
                        <Fuel className="w-3 h-3 text-[#8995A3]" />
                        <span>Conso Moyenne</span>
                      </div>
                      <div className="text-blue-400 font-mono font-semibold mt-0.5">
                        {eq.avgCons || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pied de Carte Actions */}
              <div className="px-5 py-3.5 bg-[#08111F]/50 border-t border-[#8995A3]/15 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInspectedEquipment(eq)}
                    className="text-[#FF8A00] hover:text-[#FF8A00]/80 font-mono font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Fiche technique</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onViewOnMap(eq.immat)}
                    className="text-[#8995A3] hover:text-[#F4F6F8] text-[11px] flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-[#172231] transition-colors"
                    title="Voir sur la carte télématique"
                  >
                    <MapPin className="w-3 h-3 text-[#FF8A00]" />
                    <span className="hidden sm:inline">GPS</span>
                  </button>

                  <button
                    onClick={() => setPassportEquipment(eq)}
                    className="text-[#8995A3] hover:text-[#FF8A00] text-[11px] flex items-center gap-1 cursor-pointer p-1 rounded hover:bg-[#172231] transition-colors font-mono"
                    title="Imprimer Passeport Technique / Fiche A4"
                  >
                    <Printer className="w-3 h-3 text-[#FF8A00]" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                </div>

                {['ADM-E', 'GP'].includes(currentRole.code) && (
                  <button
                    onClick={() => onDeleteEquipment(eq.id)}
                    className="text-[#8995A3] hover:text-[#EF4444] p-1.5 rounded hover:bg-[#EF4444]/10 transition-colors cursor-pointer"
                    title="Retirer la machine du parc"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ======================================================================= */
        /* MODE TABLEAU DENSE AVEC COLONNE MINIATURES PHOTO                        */
        /* ======================================================================= */
        <div className="bg-[#111820] rounded-xl border border-[#8995A3]/20 overflow-x-auto shadow-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#08111F] border-b border-[#8995A3]/20 text-[#8995A3] font-bold uppercase text-[10px] font-mono">
              <tr>
                <th className="p-3.5">Visuel</th>
                <th className="p-3.5">N° Parc / Immat</th>
                <th className="p-3.5">Désignation du Matériel</th>
                <th className="p-3.5">Catégorie</th>
                <th className="p-3.5">Compteur</th>
                <th className="p-3.5">Chantier</th>
                <th className="p-3.5">Conducteur</th>
                <th className="p-3.5">Statut</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#8995A3]/15 font-medium text-[#F4F6F8]">
              {filtered.map((eq) => (
                <tr key={eq.id} className="hover:bg-[#172231]/40 transition-colors group">
                  {/* Miniature Photo */}
                  <td className="p-3">
                    <div 
                      onClick={() => setInspectedEquipment(eq)}
                      className="w-12 h-9 rounded-lg overflow-hidden border border-[#8995A3]/25 bg-[#08111F] cursor-pointer group-hover:border-[#FF8A00] transition-colors shrink-0"
                    >
                      <img 
                        src={eq.imageUrl || '/images/equipments/excavator.jpg'} 
                        alt={eq.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/fleetmind-mining-truck.png';
                        }}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-[#FF8A00] font-bold">{eq.immat}</td>
                  <td className="p-3.5 font-bold">
                    <div 
                      onClick={() => setInspectedEquipment(eq)}
                      className="hover:text-[#FF8A00] cursor-pointer transition-colors"
                    >
                      {eq.name}
                    </div>
                    {eq.brand && (
                      <span className="text-[10px] text-[#8995A3] font-mono font-normal">
                        {eq.brand} {eq.model && `• ${eq.model}`}
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-[#8995A3] font-mono text-[11px]">
                    <span className="bg-[#172231] px-2 py-0.5 rounded border border-[#8995A3]/20">
                      {getCategoryLabel(eq.type)}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono">
                    {eq.counterValue.toLocaleString()} {eq.counterType === 'HOURS' ? 'h' : 'km'}
                  </td>
                  <td className="p-3.5 text-[#8995A3]">{eq.site}</td>
                  <td className="p-3.5">{eq.driver}</td>
                  <td className="p-3.5">{getStatusBadge(eq.status)}</td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => setInspectedEquipment(eq)}
                      className="text-[#FF8A00] hover:underline font-mono text-[11px] cursor-pointer"
                    >
                      Détails
                    </button>
                    {['ADM-E', 'GP'].includes(currentRole.code) && (
                      <button
                        onClick={() => onDeleteEquipment(eq.id)}
                        className="text-[#8995A3] hover:text-[#EF4444] cursor-pointer p-1"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TIROIR TECHNIQUE AVEC PHOTOGRAPHIE GRAND FORMAT                         */}
      {/* ======================================================================= */}
      {inspectedEquipment && (
        <div className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="bg-[#111820] border-l border-[#8995A3]/25 w-full max-w-md h-full p-6 space-y-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-start justify-between border-b border-[#8995A3]/20 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#FF8A00] uppercase tracking-widest">
                    Fiche Technique Machine
                  </span>
                  <h3 className="text-base font-extrabold text-[#F4F6F8] mt-1">
                    {inspectedEquipment.name}
                  </h3>
                  <div className="font-mono text-xs text-[#8995A3] font-bold">
                    {inspectedEquipment.immat} • ID {inspectedEquipment.id}
                  </div>
                </div>
                <button
                  onClick={() => setInspectedEquipment(null)}
                  className="text-[#8995A3] hover:text-[#F4F6F8] p-1 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photographie Réaliste Grand Format */}
              <div className="relative h-56 w-full rounded-xl overflow-hidden border border-[#8995A3]/30 bg-[#08111F] shadow-lg">
                <img
                  src={inspectedEquipment.imageUrl || '/images/equipments/excavator.jpg'}
                  alt={inspectedEquipment.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/fleetmind-mining-truck.png';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111820] via-transparent to-black/40" />

                {/* Badge Statut & Catégorie sur la photo */}
                <div className="absolute top-3 left-3">
                  <span className="bg-[#08111F]/90 backdrop-blur-md border border-[#8995A3]/30 text-[#FF8A00] font-mono text-[9px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {getCategoryLabel(inspectedEquipment.type)}
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  {getStatusBadge(inspectedEquipment.status)}
                </div>

                {inspectedEquipment.brand && (
                  <div className="absolute bottom-3 left-3 text-xs font-mono font-bold text-[#F4F6F8] bg-[#08111F]/80 backdrop-blur-sm px-2.5 py-1 rounded border border-[#8995A3]/25">
                    {inspectedEquipment.brand} {inspectedEquipment.model && `• ${inspectedEquipment.model}`}
                  </div>
                )}
              </div>

              {/* Matrice des Spécifications Techniques */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#172231] border border-[#8995A3]/15">
                  <span className="text-[#8995A3] flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#8995A3]" />
                    Chantier / Carrière :
                  </span>
                  <span className="font-semibold text-[#F4F6F8]">{inspectedEquipment.site}</span>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#172231] border border-[#8995A3]/15">
                  <span className="text-[#8995A3] flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-[#8995A3]" />
                    Compteur Actuel :
                  </span>
                  <strong className="font-mono text-[#F4F6F8]">
                    {inspectedEquipment.counterValue.toLocaleString()} {inspectedEquipment.counterType === 'HOURS' ? 'Heures Moteur' : 'Kilomètres'}
                  </strong>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#172231] border border-[#8995A3]/15">
                  <span className="text-[#8995A3] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8995A3]" />
                    Opérateur Assigné :
                  </span>
                  <strong className="text-[#F4F6F8]">{inspectedEquipment.driver}</strong>
                </div>

                <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#172231] border border-[#8995A3]/15">
                  <span className="text-[#8995A3] flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-[#8995A3]" />
                    Consommation Spécifiée :
                  </span>
                  <span className="font-mono text-[#FF8A00] font-bold">{inspectedEquipment.avgCons}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#8995A3]/20 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setPassportEquipment(inspectedEquipment);
                }}
                className="w-full bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-[#08111F] font-black py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FF8A00]/25"
              >
                <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Imprimer Passeport Technique (PDF A4)</span>
              </button>

              <button
                onClick={() => {
                  onViewOnMap(inspectedEquipment.immat);
                  setInspectedEquipment(null);
                }}
                className="w-full bg-[#172231] hover:bg-[#FF8A00]/15 text-[#F4F6F8] hover:text-[#FF8A00] border border-[#8995A3]/25 hover:border-[#FF8A00]/50 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF8A00]" />
                Localiser sur la carte télématique
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale d'Édition et Impression du Passeport Technique Machine A4 */}
      {passportEquipment && (
        <EquipmentPassportModal
          equipment={passportEquipment}
          tenantName={tenantName || 'SOGEA-SATOM CI'}
          onClose={() => setPassportEquipment(null)}
        />
      )}
    </div>
  );
};

export default EquipmentsView;
