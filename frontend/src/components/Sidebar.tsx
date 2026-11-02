import React from 'react';
import { 
  BarChart2, Truck, Navigation, Wrench, FileText, Users, Fuel, MapPin, 
  Sparkles, Calendar, ShieldCheck, LogOut, FileCheck, ChevronLeft, ChevronRight,
  Building2, UserCheck
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface SidebarProps {
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

export const Sidebar: React.FC<SidebarProps> = ({
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
  const [collapsed, setCollapsed] = React.useState(false);

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Poste de Contrôle', icon: BarChart2 },
    { id: 'equipment', label: 'Parc Engins & Véhicules', icon: Truck, badge: equipmentsCount },
    { id: 'gps', label: 'Télématique GPS Live', icon: MapPin },
    { id: 'assignments', label: 'Ordres de Mission', icon: Calendar, badge: assignmentsCount },
    { id: 'maintenance', label: 'Atelier & Maintenance', icon: Wrench, badge: inMaintenanceCount },
    { id: 'fuel', label: 'Audit Carburant', icon: Fuel, badge: fuelAnomaliesCount },
    { id: 'rentals', label: 'Locations Externes', icon: FileText, badge: rentalsCount },
    { id: 'documents', label: 'Documents Légaux', icon: FileCheck, badge: documentsExpiringCount },
    { id: 'analytics', label: 'Analytique & IA Flotte', icon: Sparkles },
    { id: 'admin', label: 'Administration RBAC', icon: ShieldCheck },
  ];

  return (
    <aside
      className={`bg-[#0E1520] border-b lg:border-b-0 lg:border-r border-[#8995A3]/20 hidden lg:flex lg:flex-col justify-between shrink-0 z-30 transition-all duration-300 ${
        collapsed ? 'lg:w-20' : 'lg:w-64'
      }`}
    >
      <div>
        {/* Brand Header Cockpit Minier */}
        <div className="p-4 sm:p-5 border-b border-[#8995A3]/20 flex items-center justify-between bg-gradient-to-b from-[#141E2C] to-[#0E1520]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E2B3E] via-[#141E2C] to-[#08111F] border border-[#FF8A00]/60 flex items-center justify-center shrink-0 shadow-lg shadow-[#FF8A00]/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#FF8A00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-4 h-4 border-2 border-[#FF8A00] rotate-45 flex items-center justify-center shadow-[0_0_8px_rgba(255,138,0,0.5)]">
                <div className="w-1.5 h-1.5 bg-[#FF8A00]" />
              </div>
            </div>

            {!collapsed && (
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-black text-base tracking-widest text-[#F4F6F8] font-mono leading-none">
                    FLEET<span className="text-[#FF8A00]">MIND</span>
                  </h1>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#FF8A00] font-mono">
                    Mining Fleet OS
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-[#8995A3] hover:text-[#F4F6F8] hover:bg-[#172231] transition-colors"
            title={collapsed ? 'Agrandir la barre latérale' : 'Réduire la barre latérale'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Tenant Organization Switcher */}
        {!collapsed && (
          <div className="px-4 py-3 bg-[#08111F]/80 border-b border-[#8995A3]/15">
            <label className="text-[9px] font-extrabold uppercase tracking-wider text-[#8995A3] flex items-center gap-1.5 mb-1.5 font-mono">
              <Building2 className="w-3.5 h-3.5 text-[#FF8A00]" />
              Entité Minière & Pays
            </label>
            <select
              value={currentTenant.id}
              onChange={(e) => {
                const found = tenants.find(t => t.id === e.target.value);
                if (found) onSelectTenant(found);
              }}
              className="w-full bg-[#141E2C] text-xs text-[#F4F6F8] font-semibold border border-[#8995A3]/30 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#FF8A00] cursor-pointer shadow-inner hover:border-[#8995A3]/50 transition-colors"
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.country})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Navigation Items avec Micro-Badges & Halo Actif */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#172231] to-[#121B27] text-white border border-[#FF8A00]/50 shadow-md shadow-black/30'
                    : 'text-[#8995A3] hover:bg-[#141E2C]/70 hover:text-[#F4F6F8] border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                {/* Liseré indicateur actif à gauche */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#FF8A00] rounded-r-full shadow-[0_0_8px_rgba(255,138,0,0.6)]" />
                )}

                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                      isActive 
                        ? 'bg-[#FF8A00]/20 text-[#FF8A00] border border-[#FF8A00]/40 shadow-[0_0_10px_rgba(255,138,0,0.25)]' 
                        : 'bg-[#141E2C]/60 text-[#8995A3] group-hover:text-white group-hover:bg-[#1A2636] border border-[#8995A3]/20'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                  </div>
                  {!collapsed && <span className="truncate tracking-wide">{item.label}</span>}
                </div>

                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-[#FF8A00] text-[#08111F] shadow-[0_0_8px_rgba(255,138,0,0.5)]'
                        : 'bg-[#172231] text-[#8995A3] border border-[#8995A3]/25 group-hover:border-[#FF8A00]/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Role & Quick Actions at Bottom */}
      <div className="p-3 border-t border-[#8995A3]/20 bg-[#08111F]/90 space-y-2">
        {!collapsed ? (
          <>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-[#8995A3] uppercase font-bold tracking-wider flex items-center gap-1 font-mono">
                <UserCheck className="w-3 h-3 text-[#FF8A00]" /> Rôle Actif
              </span>
              <span className="font-mono text-[#FF8A00] bg-[#FF8A00]/15 px-2 py-0.5 rounded border border-[#FF8A00]/30 font-bold">
                {currentRole.code}
              </span>
            </div>

            <select
              value={currentRole.code}
              onChange={(e) => {
                const r = roles.find(x => x.code === e.target.value);
                if (r) onSelectRole(r);
              }}
              className="w-full bg-[#141E2C] text-xs text-[#8995A3] font-medium border border-[#8995A3]/30 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#FF8A00] cursor-pointer"
            >
              {roles.map(r => (
                <option key={r.code} value={r.code}>
                  {r.label}
                </option>
              ))}
            </select>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 bg-[#141E2C] hover:bg-red-500/15 text-[#8995A3] hover:text-red-400 border border-[#8995A3]/25 hover:border-red-500/40 py-2 rounded-lg text-xs font-bold transition-all duration-200 mt-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </>
        ) : (
          <button
            onClick={onLogout}
            className="w-full p-2.5 rounded-lg text-[#8995A3] hover:text-red-400 hover:bg-[#141E2C] flex items-center justify-center transition-colors cursor-pointer"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
