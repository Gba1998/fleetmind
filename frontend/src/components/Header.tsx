import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, Search, Bell, LogOut, ShieldCheck, User, 
  AlertTriangle, Fuel, Wrench, FileText, CheckCircle, X, ChevronRight,
  Wifi, WifiOff, RefreshCw, Radio, HardDrive, ArrowDownUp
} from 'lucide-react';
import { 
  subscribeOfflineStatus, setSimulatedOffline, triggerSync, 
  isSimulatedOffline, getPendingQueueCount 
} from '../services/offlineSync';

interface HeaderProps {
  title: string;
  subtitle?: string;
  timeRange: string;
  currentRole: { code: string; label: string };
  currentTenant: { id: string; name: string; country: string; currency: string };
  onLogout: () => void;
  onNavigateTab?: (tabId: string) => void;
  fuelAnomaliesCount?: number;
  criticalAlertsCount?: number;
  documentsExpiringCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  timeRange,
  currentRole,
  currentTenant,
  onLogout,
  onNavigateTab,
  fuelAnomaliesCount = 1,
  criticalAlertsCount = 1,
  documentsExpiringCount = 2,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlineState, setOfflineState] = useState({
    isOnline: true,
    isSimulatedOffline: false,
    pendingCount: 0,
    lastSyncTime: null as string | null,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);

  const totalAlerts = fuelAnomaliesCount + criticalAlertsCount + documentsExpiringCount;

  // Souscription au statut réseau & synchronisation hors-ligne
  useEffect(() => {
    const unsubscribe = subscribeOfflineStatus((status) => {
      setOfflineState(status);
    });
    return () => unsubscribe();
  }, []);

  // Fermer les popovers si clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (networkRef.current && !networkRef.current.contains(event.target as Node)) {
        setShowNetworkMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await triggerSync();
    setTimeout(() => setIsSyncing(false), 600);
  };

  return (
    <header className="h-16 bg-[#111820] border-b border-[#8995A3]/20 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-[#F4F6F8] tracking-tight truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[11px] text-[#8995A3] hidden sm:block truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0 relative" ref={dropdownRef}>
        
        {/* Active time range */}
        <div className="hidden md:flex items-center gap-2 bg-[#172231] border border-[#8995A3]/20 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#8995A3]">
          <Calendar className="w-3.5 h-3.5 text-[#FF8A00]" />
          <span>{timeRange}</span>
        </div>

        {/* Currency badge */}
        <span className="hidden sm:inline-block font-mono text-xs text-[#FF8A00] bg-[#FF8A00]/10 border border-[#FF8A00]/30 px-2 py-1 rounded-md font-bold">
          {currentTenant.currency}
        </span>

        {/* Indicateur Télématique Réseau & Mode Hors-Ligne (Fosse Minière) */}
        <div className="relative" ref={networkRef}>
          <button
            type="button"
            onClick={() => setShowNetworkMenu(!showNetworkMenu)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              !offlineState.isOnline
                ? 'bg-[#FF8A00]/15 border-[#FF8A00] text-[#FF8A00] animate-pulse'
                : 'bg-[#172231] border-[#8995A3]/25 text-[#F4F6F8] hover:border-[#8995A3]/50'
            }`}
            title="État de la connectivité réseau & synchronisation fosse"
          >
            {offlineState.isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
                <span className="hidden lg:inline text-[11px] font-bold">4G Base-Vie</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span className="text-[11px] font-bold text-[#FF8A00]">
                  Zone Blanche {offlineState.pendingCount > 0 ? `(${offlineState.pendingCount})` : ''}
                </span>
              </>
            )}
          </button>

          {/* Popover Réseau / Synchronisation */}
          {showNetworkMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111820] border border-[#8995A3]/30 rounded-xl shadow-2xl p-4 z-50 space-y-3 font-mono animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-[#8995A3]/20 pb-2">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#FF8A00]" />
                  <span className="text-xs font-bold text-[#F4F6F8] uppercase">
                    Connectivité & Synchro
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNetworkMenu(false)}
                  className="text-[#8995A3] hover:text-[#F4F6F8] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Statut Réseau Actuel */}
              <div className="p-3 rounded-lg bg-[#08111F] border border-[#8995A3]/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8995A3]">Couverture terrain :</span>
                  {offlineState.isOnline ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5" /> En ligne (4G/Wi-Fi)
                    </span>
                  ) : (
                    <span className="text-[#FF8A00] font-bold flex items-center gap-1.5">
                      <WifiOff className="w-3.5 h-3.5" /> Zone Blanche (Fosse)
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8995A3]">File d'attente locale :</span>
                  <span className={`font-bold ${offlineState.pendingCount > 0 ? 'text-[#FF8A00]' : 'text-[#F4F6F8]'}`}>
                    {offlineState.pendingCount} transaction(s) en cache
                  </span>
                </div>

                {offlineState.lastSyncTime && (
                  <div className="flex items-center justify-between text-[11px] text-[#8995A3] pt-1 border-t border-[#8995A3]/15">
                    <span>Dernière synchronisation :</span>
                    <span className="text-[#F4F6F8] font-bold">{offlineState.lastSyncTime}</span>
                  </div>
                )}
              </div>

              {/* Bouton Synchroniser maintenant */}
              <button
                type="button"
                disabled={!offlineState.isOnline || isSyncing}
                onClick={handleManualSync}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !offlineState.isOnline
                    ? 'bg-[#172231] text-[#8995A3] cursor-not-allowed border border-[#8995A3]/20'
                    : 'bg-[#10B981] hover:bg-[#10B981]/90 text-[#08111F] shadow'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronisation en cours...' : 'Synchroniser le cache maintenant'}</span>
              </button>

              {/* Test du Mode Zone Blanche / Hors-Ligne */}
              <div className="pt-2 border-t border-[#8995A3]/20">
                <button
                  type="button"
                  onClick={() => setSimulatedOffline(!offlineState.isSimulatedOffline)}
                  className={`w-full py-1.5 px-2.5 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    offlineState.isSimulatedOffline
                      ? 'bg-[#FF8A00]/20 border-[#FF8A00] text-[#FF8A00]'
                      : 'bg-[#172231] border-[#8995A3]/30 text-[#8995A3] hover:text-[#F4F6F8]'
                  }`}
                >
                  <ArrowDownUp className="w-3 h-3" />
                  <span>
                    {offlineState.isSimulatedOffline
                      ? 'Désactiver la simulation Zone Blanche'
                      : 'Simuler Zone Blanche (Fosse Hors-Ligne)'}
                  </span>
                </button>
                <p className="text-[10px] text-[#8995A3] mt-1 leading-tight text-center">
                  Permet de tester la saisie terrain sans connexion internet.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Cloche Interactive du Centre de Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-lg border transition-all cursor-pointer relative ${
              showNotifications
                ? 'bg-[#FF8A00]/20 border-[#FF8A00] text-[#FF8A00]'
                : totalAlerts > 0
                ? 'bg-[#172231] border-red-500/40 text-red-400 hover:text-white'
                : 'bg-[#172231] border-[#8995A3]/20 text-[#8995A3] hover:text-[#F4F6F8]'
            }`}
            title="Centre de notifications opérationnelles"
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-mono text-[9px] font-black flex items-center justify-center animate-pulse">
                {totalAlerts}
              </span>
            )}
          </button>

          {/* Popover du Centre de Notifications */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#111820] border border-[#8995A3]/30 rounded-xl shadow-2xl p-4 z-50 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-[#8995A3]/20 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#FF8A00]" />
                  <span className="text-xs font-bold text-[#F4F6F8] font-mono uppercase">
                    Centre d'Alertes ({totalAlerts})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-[#8995A3] hover:text-[#F4F6F8] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto text-xs font-mono">
                
                {/* 1. Alerte Maintenance Critique */}
                {criticalAlertsCount > 0 && (
                  <div
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('maintenance');
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:border-red-500 transition-colors cursor-pointer space-y-1 group"
                  >
                    <div className="flex items-center justify-between text-red-400 font-bold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5" /> Panne Critique Bloquante
                      </span>
                      <span className="text-[9px] bg-red-500/20 px-1.5 py-0.5 rounded">Atelier</span>
                    </div>
                    <div className="text-[#F4F6F8] font-medium text-[11px]">
                      SDMO Groupe 250kVA (GE-2022-04) : Pompe à injection en attente
                    </div>
                    <span className="text-[9px] text-[#8995A3] block">Priorité immédiate en base vie</span>
                  </div>
                )}

                {/* 2. Alerte Carburant */}
                {fuelAnomaliesCount > 0 && (
                  <div
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('fuel');
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-lg bg-[#FF8A00]/10 border border-[#FF8A00]/30 hover:border-[#FF8A00] transition-colors cursor-pointer space-y-1 group"
                  >
                    <div className="flex items-center justify-between text-[#FF8A00] font-bold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5" /> Surconsommation Carburant
                      </span>
                      <span className="text-[9px] bg-[#FF8A00]/20 px-1.5 py-0.5 rounded">+28% Dérive</span>
                    </div>
                    <div className="text-[#F4F6F8] font-medium text-[11px]">
                      Toyota Hilux 4x4 (CI-3009-XX) : 85L pompés à Shell Yopougon
                    </div>
                    <span className="text-[9px] text-[#8995A3] block">Contrôle injecteurs préconisé</span>
                  </div>
                )}

                {/* 3. Alerte Document Échu */}
                {documentsExpiringCount > 0 && (
                  <div
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('documents');
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:border-blue-500 transition-colors cursor-pointer space-y-1 group"
                  >
                    <div className="flex items-center justify-between text-blue-400 font-bold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Échéance Documentaire
                      </span>
                      <span className="text-[9px] bg-blue-500/20 px-1.5 py-0.5 rounded">Réglementaire</span>
                    </div>
                    <div className="text-[#F4F6F8] font-medium text-[11px]">
                      Assurance Flotte Hilux (CI-3009-XX) : Expiration dans 7 jours
                    </div>
                    <span className="text-[9px] text-[#8995A3] block">Renouvellement police d'assurance requis</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#8995A3]/20 flex items-center justify-between text-[11px] font-mono text-[#8995A3]">
                <span>Télématique 4G synchronisée</span>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-[#FF8A00] hover:underline cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User profile */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#8995A3]/20">
          <div className="w-8 h-8 rounded-full bg-[#FF8A00]/15 border border-[#FF8A00]/40 text-[#FF8A00] flex items-center justify-center font-bold text-xs font-mono">
            SB
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-[#F4F6F8]">Sinan B.</div>
            <div className="text-[10px] text-[#8995A3] font-mono">
              {currentRole.code} • {currentTenant.name.split(' ')[0]}
            </div>
          </div>
        </div>

        {/* Logout action */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 bg-[#172231] hover:bg-[#FF8A00] text-[#8995A3] hover:text-[#08111F] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#8995A3]/25 transition-all shadow-sm cursor-pointer"
          title="Se déconnecter de la plateforme"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
