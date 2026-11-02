import React, { useState } from 'react';
import { 
  BarChart2, Truck, MapPin, Wrench, Fuel, Calendar, 
  FileText, FileCheck, Sparkles, ShieldCheck, MoreHorizontal,
  X, Building2, UserCheck, LogOut, ChevronRight, Activity
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  tenants: { id: string; name: string; country: string; currency: string }[];
  currentTenant: { id: string; name: string; country: string; currency: string };
  onSelectTenant: (tenant: any) => void;
  roles: { code: string; label: string }[];
  currentRole: { code: string; label: string };
  onSelectRole: (role: any) => void;
  onLogout: () => void;
  inMaintenanceCount: number;
  assignmentsCount: number;
  equipmentsCount: number;
  documentsExpiringCount: number;
  fuelAnomaliesCount: number;
  rentalsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
  tenants,
  currentTenant,
  onSelectTenant,
  roles,
  currentRole,
  onSelectRole,
  onLogout,
  inMaintenanceCount,
  assignmentsCount,
  equipmentsCount,
  documentsExpiringCount,
  fuelAnomaliesCount,
  rentalsCount,
}) => {
  const [showFullMenu, setShowFullMenu] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Poste', icon: BarChart2 },
    { id: 'equipment', label: 'Engins', icon: Truck, badge: equipmentsCount },
    { id: 'gps', label: 'GPS Live', icon: MapPin },
    { id: 'maintenance', label: 'Atelier', icon: Wrench, badge: inMaintenanceCount },
    { id: 'fuel', label: 'Carburant', icon: Fuel, badge: fuelAnomaliesCount },
  ];

  const allNavigationTabs = [
    { id: 'dashboard', label: 'Poste de Contrôle', sub: 'Synthèse TCO & Opérations', icon: BarChart2 },
    { id: 'equipment', label: 'Parc Engins & Véhicules', sub: 'Inventaire, Compteurs & Fiches', icon: Truck, badge: equipmentsCount },
    { id: 'gps', label: 'Télématique GPS Live', sub: 'Positionnement & Vitesse Flotte', icon: MapPin },
    { id: 'assignments', label: 'Ordres de Mission', sub: 'Chauffeurs & Chantiers Actifs', icon: Calendar, badge: assignmentsCount },
    { id: 'maintenance', label: 'Atelier & Maintenance', sub: 'Pannes, Pièces & Préventif 500h', icon: Wrench, badge: inMaintenanceCount },
    { id: 'fuel', label: 'Audit Carburant & Cuves', sub: 'Anti-coulage & Ravitaillements', icon: Fuel, badge: fuelAnomaliesCount },
    { id: 'rentals', label: 'Locations Externes', sub: 'Engins tiers & Contrats LOXAM', icon: FileText, badge: rentalsCount },
    { id: 'documents', label: 'Documents Légaux', sub: 'Assurances & Visites Techniques', icon: FileCheck, badge: documentsExpiringCount },
    { id: 'analytics', label: 'Analytique & IA Flotte', sub: 'Assistant Prédictif Carrière', icon: Sparkles },
    { id: 'admin', label: 'Administration RBAC', sub: 'Gestion Utilisateurs & Rôles', icon: ShieldCheck },
  ];

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setShowFullMenu(false);
  };

  return (
    <>
      {/* ======================================================================= */}
      {/* BARRE DE NAVIGATION INFÉRIEURE FLOTTANTE (SMARTPHONE ONLY < lg)          */}
      {/* ======================================================================= */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E1520]/95 backdrop-blur-xl border-t border-[#8995A3]/25 px-2 py-1.5 flex items-center justify-around lg:hidden shadow-[0_-8px_30px_rgba(0,0,0,0.7)]"
        style={{ paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}
      >
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all relative ${
                isActive ? 'text-[#FF8A00]' : 'text-[#8995A3] hover:text-[#F4F6F8]'
              }`}
            >
              <div className="relative">
                <div 
                  className={`w-9 h-7 rounded-lg flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-[#FF8A00]/20 text-[#FF8A00] shadow-[0_0_10px_rgba(255,138,0,0.35)]' 
                      : ''
                  }`}
                >
                  <Icon className={`w-4 h-4 stroke-[2.2] ${isActive ? 'stroke-[2.6]' : ''}`} />
                </div>

                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-[#FF8A00] text-[#08111F] text-[9px] font-mono font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {tab.badge}
                  </span>
                )}
              </div>
              
              <span className={`text-[10px] font-mono tracking-tight mt-0.5 ${isActive ? 'font-black text-[#FF8A00]' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Bouton "Plus" pour ouvrir le menu complet */}
        <button
          onClick={() => setShowFullMenu(!showFullMenu)}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
            showFullMenu ? 'text-[#FF8A00]' : 'text-[#8995A3] hover:text-[#F4F6F8]'
          }`}
        >
          <div className={`w-9 h-7 rounded-lg flex items-center justify-center ${showFullMenu ? 'bg-[#FF8A00]/20 text-[#FF8A00]' : ''}`}>
            <MoreHorizontal className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-tight mt-0.5">
            Menu
          </span>
        </button>
      </nav>

      {/* ======================================================================= */}
      {/* DRAWER MOBILE PLEIN ÉCRAN POUR TOUS LES MODULES & RÉGLAGES             */}
      {/* ======================================================================= */}
      {showFullMenu && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end lg:hidden animate-in fade-in duration-200">
          <div 
            className="bg-[#111820] border-t border-[#8995A3]/30 rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"
            style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
          >
            {/* Header du Drawer */}
            <div className="p-4 border-b border-[#8995A3]/20 flex items-center justify-between bg-[#141E2C]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF8A00] to-amber-600 flex items-center justify-center text-[#08111F] font-black text-xs shadow-md">
                  FM
                </div>
                <div>
                  <h3 className="font-mono font-black text-sm text-[#F4F6F8] leading-tight">
                    FLEET<span className="text-[#FF8A00]">MIND</span> Mobile
                  </h3>
                  <span className="text-[10px] text-[#8995A3] font-mono block">
                    Supervision Carrières & Chantiers
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowFullMenu(false)}
                className="w-8 h-8 rounded-full bg-[#172231] hover:bg-[#1E2B3E] text-[#8995A3] hover:text-white flex items-center justify-center border border-[#8995A3]/25 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Corps Défilable du Drawer */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* Sélecteur d'Entité Minière */}
              <div className="bg-[#08111F] p-3 rounded-xl border border-[#8995A3]/20">
                <label className="text-[10px] font-mono font-black uppercase text-[#8995A3] flex items-center gap-1.5 mb-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#FF8A00]" />
                  Organisation & Devise
                </label>
                <select
                  value={currentTenant.id}
                  onChange={(e) => {
                    const found = tenants.find(t => t.id === e.target.value);
                    if (found) onSelectTenant(found);
                  }}
                  className="w-full bg-[#172231] text-xs font-bold text-[#F4F6F8] border border-[#8995A3]/30 rounded-lg p-2 focus:outline-none focus:border-[#FF8A00]"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.country}) — {t.currency}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grille des 10 Modules */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[#8995A3] block px-1">
                  Tous les Modules Flotte
                </span>

                <div className="grid grid-cols-1 gap-1.5">
                  {allNavigationTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-[#FF8A00]/20 to-[#172231] border border-[#FF8A00]/50 text-white'
                            : 'bg-[#172231]/60 hover:bg-[#172231] text-[#8995A3] hover:text-white border border-[#8995A3]/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive ? 'bg-[#FF8A00] text-[#08111F]' : 'bg-[#111820] text-[#FF8A00] border border-[#FF8A00]/30'
                            }`}
                          >
                            <Icon className="w-4 h-4 stroke-[2.2]" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#F4F6F8] leading-tight">
                              {tab.label}
                            </div>
                            <div className="text-[10px] text-[#8995A3] leading-tight">
                              {tab.sub}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {tab.badge !== undefined && tab.badge > 0 && (
                            <span className="bg-[#FF8A00] text-[#08111F] text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full">
                              {tab.badge}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-[#8995A3]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rôle Actif & Déconnexion */}
              <div className="bg-[#08111F] p-3 rounded-xl border border-[#8995A3]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#8995A3] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#FF8A00]" /> Profil Actif
                  </span>
                  <span className="font-mono text-[#FF8A00] bg-[#FF8A00]/15 px-2 py-0.5 rounded border border-[#FF8A00]/30 font-bold text-[10px]">
                    {currentRole.code}
                  </span>
                </div>

                <select
                  value={currentRole.code}
                  onChange={(e) => {
                    const r = roles.find(x => x.code === e.target.value);
                    if (r) onSelectRole(r);
                  }}
                  className="w-full bg-[#172231] text-xs font-semibold text-[#F4F6F8] border border-[#8995A3]/30 rounded-lg p-2 focus:outline-none focus:border-[#FF8A00]"
                >
                  {roles.map(r => (
                    <option key={r.code} value={r.code}>
                      {r.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setShowFullMenu(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Fermer la session (Déconnexion)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileBottomNav;
