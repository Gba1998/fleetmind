import React from 'react';

// =========================================================================
// SMART & CLASSY 3D METALLIC INDUSTRIAL ICONS - FLEETMIND PLATFORM
// Conception vectorielle haute fidélité : dégradés métalliques, reflets,
// verre dépoli (glassmorphism) et finitions cockpit minier haut de gamme.
// =========================================================================

// 1. Badge TCO & Trésorerie Flotte (Lingot & Coffre d'Or Métallisé)
export const TcoSmartIcon: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div 
    className="relative rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(255,138,0,0.35)] shrink-0 overflow-hidden"
    style={{
      width: size,
      height: size,
      background: 'radial-gradient(120% 120% at 30% 20%, rgba(255, 184, 77, 0.22) 0%, rgba(255, 138, 0, 0.12) 45%, rgba(13, 20, 30, 0.95) 100%)',
      border: '1px solid rgba(255, 166, 0, 0.45)',
      boxShadow: '0 10px 24px -4px rgba(255, 138, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.5)'
    }}
  >
    {/* Micro reflet de surface vitrée */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

    <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="gold-metal-tco" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="35%" stopColor="#FFB300" />
          <stop offset="70%" stopColor="#FF8F00" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>
        <linearGradient id="gold-sheen-tco" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFE082" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FF6F00" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Anneau extérieur biseauté */}
      <circle cx="16" cy="16" r="13" stroke="url(#gold-metal-tco)" strokeWidth="1.6" strokeDasharray="4 2" opacity="0.6" />
      <circle cx="16" cy="16" r="11" stroke="url(#gold-metal-tco)" strokeWidth="1.8" />

      {/* Cadran central & Lingot / Coffre trésorerie */}
      <rect x="10" y="10" width="12" height="12" rx="3" fill="#141E2C" stroke="url(#gold-metal-tco)" strokeWidth="1.5" />
      
      {/* Symbole Devise / TCO stylisé à relief */}
      <path d="M16 8V24" stroke="url(#gold-metal-tco)" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 12C20 10.6 18.2 9.5 16 9.5C13.8 9.5 12 10.6 12 12C12 14.8 20 14 20 17C20 18.5 18.2 19.5 16 19.5C13.8 19.5 12 18.5 12 17" 
        stroke="url(#gold-metal-tco)" strokeWidth="2.2" strokeLinecap="round" />

      {/* Micro diamant de brillance spéculaire */}
      <polygon points="21,11 22.5,9.5 24,11 22.5,12.5" fill="#FFF" className="animate-pulse" />
      <circle cx="9" cy="22" r="1.2" fill="#FFB300" />
    </svg>
  </div>
);

// 2. Badge Carburant & Cuves (Pistolet Haute Pression & Goutte Fluide Cyan Télématique)
export const FuelSmartIcon: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div 
    className="relative rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] shrink-0 overflow-hidden"
    style={{
      width: size,
      height: size,
      background: 'radial-gradient(120% 120% at 30% 20%, rgba(56, 189, 248, 0.22) 0%, rgba(37, 99, 235, 0.12) 45%, rgba(13, 20, 30, 0.95) 100%)',
      border: '1px solid rgba(56, 189, 248, 0.45)',
      boxShadow: '0 10px 24px -4px rgba(37, 99, 235, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.5)'
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

    <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="fuel-cyan-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
        <linearGradient id="drop-glow-grad" x1="18" y1="12" x2="26" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="60%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
      </defs>

      {/* Cuve de ravitaillement & Colonne */}
      <rect x="5" y="7" width="13" height="19" rx="3" fill="#141E2C" stroke="url(#fuel-cyan-grad)" strokeWidth="1.8" />
      
      {/* Cadran digital de la pompe (Niveau Litres) */}
      <rect x="8" y="10" width="7" height="5" rx="1.5" fill="#08111F" stroke="#38BDF8" strokeWidth="1" />
      <line x1="9.5" y1="12.5" x2="13.5" y2="12.5" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />

      {/* Flexible haute pression vers pistolet */}
      <path d="M18 11L21 8L25 11V21C25 23 23 24 21 24H18" 
        stroke="url(#fuel-cyan-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Goutte de gazole pure avec reflet brillant */}
      <path d="M21 13C21 13 18.5 16.5 18.5 18.5C18.5 20 19.6 21 21 21C22.4 21 23.5 20 23.5 18.5C23.5 16.5 21 13 21 13Z" 
        fill="url(#drop-glow-grad)" stroke="#E0F2FE" strokeWidth="0.8" />
      <circle cx="20.2" cy="17.2" r="0.8" fill="#FFFFFF" />

      {/* Socle industriel */}
      <line x1="3" y1="27" x2="19" y2="27" stroke="url(#fuel-cyan-grad)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

// 3. Badge Maintenance & Pièces Atelier (Clé Titane Forgée & Rouage d'Horlogerie Lourde)
export const MaintenanceSmartIcon: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div 
    className="relative rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] shrink-0 overflow-hidden"
    style={{
      width: size,
      height: size,
      background: 'radial-gradient(120% 120% at 30% 20%, rgba(251, 191, 36, 0.22) 0%, rgba(217, 119, 6, 0.12) 45%, rgba(13, 20, 30, 0.95) 100%)',
      border: '1px solid rgba(251, 191, 36, 0.45)',
      boxShadow: '0 10px 24px -4px rgba(217, 119, 6, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.5)'
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

    <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="wrench-amber-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="80%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <radialGradient id="gear-core-grad" cx="21" cy="21" r="7" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="70%" stopColor="#B45309" />
          <stop offset="100%" stopColor="#1E293B" />
        </radialGradient>
      </defs>

      {/* Rouage denté industriel arrière-plan */}
      <circle cx="21" cy="21" r="6.5" stroke="url(#wrench-amber-grad)" strokeWidth="1.8" strokeDasharray="3 2" fill="#141E2C" />
      <circle cx="21" cy="21" r="3" fill="url(#gear-core-grad)" stroke="#FEF3C7" strokeWidth="0.8" />
      
      {/* Clé à molette mécanique forgée en diagonale */}
      <path 
        d="M19.5 8.5C18.2 7.2 16.4 6.8 14.8 7.3L17.2 9.7L15.3 11.6L12.9 9.2C12.4 10.8 12.8 12.6 14.1 13.9C15.2 15 16.8 15.4 18.2 15L24.8 21.6C25.4 22.2 26.4 22.2 27 21.6C27.6 21 27.6 20 27 19.4L20.4 12.8C20.8 11.4 20.4 9.8 19.5 8.5Z" 
        fill="none" 
        stroke="url(#wrench-amber-grad)" 
        strokeWidth="1.9" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {/* Manche de la clé titane avec gorge usinée */}
      <line x1="8" y1="24" x2="16" y2="16" stroke="url(#wrench-amber-grad)" strokeWidth="3" strokeLinecap="round" />
      <line x1="9" y1="23" x2="15" y2="17" stroke="#FEF3C7" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      
      {/* Œil de serrage à six pans */}
      <circle cx="7" cy="25" r="3" fill="#141E2C" stroke="url(#wrench-amber-grad)" strokeWidth="1.8" />
      <circle cx="7" cy="25" r="1.2" fill="#FBBF24" />
    </svg>
  </div>
);

// 4. Badge Locations & Matériels Tiers (Porte-Char Lourd & Contrat Améthyste)
export const RentalsSmartIcon: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div 
    className="relative rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.35)] shrink-0 overflow-hidden"
    style={{
      width: size,
      height: size,
      background: 'radial-gradient(120% 120% at 30% 20%, rgba(192, 132, 252, 0.22) 0%, rgba(147, 51, 234, 0.12) 45%, rgba(13, 20, 30, 0.95) 100%)',
      border: '1px solid rgba(192, 132, 252, 0.45)',
      boxShadow: '0 10px 24px -4px rgba(147, 51, 234, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.5)'
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

    <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="purple-metal-rent" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="40%" stopColor="#C084FC" />
          <stop offset="80%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#581C87" />
        </linearGradient>
      </defs>

      {/* Plateforme porte-char / Camion lourd de transport */}
      <rect x="4" y="11" width="16" height="9" rx="2" fill="#141E2C" stroke="url(#purple-metal-rent)" strokeWidth="1.8" />
      <path d="M20 14H24L27 17V20H20V14Z" fill="#141E2C" stroke="url(#purple-metal-rent)" strokeWidth="1.8" strokeLinejoin="round" />
      
      {/* Roues jumelées renforcées */}
      <circle cx="8" cy="22" r="2.8" fill="#08111F" stroke="url(#purple-metal-rent)" strokeWidth="1.8" />
      <circle cx="8" cy="22" r="1.1" fill="#C084FC" />
      <circle cx="15" cy="22" r="2.8" fill="#08111F" stroke="url(#purple-metal-rent)" strokeWidth="1.8" />
      <circle cx="15" cy="22" r="1.1" fill="#C084FC" />
      <circle cx="23" cy="22" r="2.8" fill="#08111F" stroke="url(#purple-metal-rent)" strokeWidth="1.8" />
      <circle cx="23" cy="22" r="1.1" fill="#C084FC" />

      {/* Clé de location & Contrat flottant au-dessus */}
      <circle cx="11" cy="7" r="2.2" stroke="url(#purple-metal-rent)" strokeWidth="1.5" />
      <path d="M13.2 7H18M15.5 7V9.5" stroke="url(#purple-metal-rent)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </div>
);

// 5. Badge Disponibilité Flotte Opérationnelle (Radar Cockpit & Émeraude Haute Disponibilité)
export const AvailabilitySmartIcon: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div 
    className="relative rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] shrink-0 overflow-hidden"
    style={{
      width: size,
      height: size,
      background: 'radial-gradient(120% 120% at 30% 20%, rgba(52, 211, 153, 0.22) 0%, rgba(16, 185, 129, 0.12) 45%, rgba(13, 20, 30, 0.95) 100%)',
      border: '1px solid rgba(52, 211, 153, 0.45)',
      boxShadow: '0 10px 24px -4px rgba(16, 185, 129, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.5)'
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

    <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="emerald-grad-avail" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="40%" stopColor="#34D399" />
          <stop offset="80%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>
      </defs>

      {/* Anneau radar & graduations de surveillance */}
      <circle cx="16" cy="16" r="12" stroke="url(#emerald-grad-avail)" strokeWidth="1.8" className="opacity-80" />
      <circle cx="16" cy="16" r="8" stroke="url(#emerald-grad-avail)" strokeWidth="1.2" strokeDasharray="3 3" className="opacity-50" />
      <line x1="16" y1="4" x2="16" y2="7" stroke="url(#emerald-grad-avail)" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="25" x2="16" y2="28" stroke="url(#emerald-grad-avail)" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="16" x2="7" y2="16" stroke="url(#emerald-grad-avail)" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="16" x2="28" y2="16" stroke="url(#emerald-grad-avail)" strokeWidth="2" strokeLinecap="round" />

      {/* Écusson de validation & coche nominale */}
      <path 
        d="M10.5 16.5L14.2 20.2L22 12.5" 
        stroke="url(#emerald-grad-avail)" 
        strokeWidth="2.8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle cx="22" cy="10" r="1.5" fill="#A7F3D0" className="animate-ping" />
    </svg>
  </div>
);

// 6. Badge Conducteurs & Opérateurs Actifs (Casque Minier Éclairé & Biométrie Saphir)
export const OperatorsSmartIcon: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div 
    className="relative rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.35)] shrink-0 overflow-hidden"
    style={{
      width: size,
      height: size,
      background: 'radial-gradient(120% 120% at 30% 20%, rgba(96, 165, 250, 0.22) 0%, rgba(37, 99, 235, 0.12) 45%, rgba(13, 20, 30, 0.95) 100%)',
      border: '1px solid rgba(96, 165, 250, 0.45)',
      boxShadow: '0 10px 24px -4px rgba(37, 99, 235, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.5)'
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

    <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="blue-grad-operator" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#BFDBFE" />
          <stop offset="40%" stopColor="#60A5FA" />
          <stop offset="80%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>

      {/* Profil de l'opérateur avec armure / gilet haute visibilité */}
      <path d="M7 26C7 21.5 11 18 16 18C21 18 25 21.5 25 26" stroke="url(#blue-grad-operator)" strokeWidth="2.2" strokeLinecap="round" />
      
      {/* Tête & Casque Minier Renforcé */}
      <circle cx="16" cy="11.5" r="5" fill="#141E2C" stroke="url(#blue-grad-operator)" strokeWidth="2" />
      <path d="M10.5 10C10.5 7 13 4.5 16 4.5C19 4.5 21.5 7 21.5 10H10.5Z" fill="#1E293B" stroke="url(#blue-grad-operator)" strokeWidth="2" />
      
      {/* Visière et Lampe Frontale Minérale LED */}
      <line x1="9.5" y1="10" x2="22.5" y2="10" stroke="#93C5FD" strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="16,3.5 17.5,6 14.5,6" fill="#38BDF8" />
      <circle cx="16" cy="6" r="1.5" fill="#FFF" className="animate-pulse" />
    </svg>
  </div>
);

// 7. Badge Pannes & Immobilisations Atelier (Balise d'Alerte Rubis Écarlate & Danger Mécanique)
export const ImmobilizationSmartIcon: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div 
    className="relative rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.35)] shrink-0 overflow-hidden"
    style={{
      width: size,
      height: size,
      background: 'radial-gradient(120% 120% at 30% 20%, rgba(248, 113, 113, 0.22) 0%, rgba(220, 38, 38, 0.12) 45%, rgba(13, 20, 30, 0.95) 100%)',
      border: '1px solid rgba(248, 113, 113, 0.45)',
      boxShadow: '0 10px 24px -4px rgba(220, 38, 38, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.5)'
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

    <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="ruby-danger-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FECACA" />
          <stop offset="40%" stopColor="#F87171" />
          <stop offset="80%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>
      </defs>

      {/* Triangle de balisage haute visibilité d'intervention d'urgence */}
      <path 
        d="M13.7 5.8L3.2 23.5C2.4 24.8 3.3 26.5 4.8 26.5H27.2C28.7 26.5 29.6 24.8 28.8 23.5L18.3 5.8C17.2 4 14.8 4 13.7 5.8Z" 
        fill="#141E2C" 
        stroke="url(#ruby-danger-grad)" 
        strokeWidth="2" 
        strokeLinejoin="round" 
      />
      
      {/* Point d'exclamation mécanique d'arrêt d'urgence */}
      <line x1="16" y1="12" x2="16" y2="18.5" stroke="url(#ruby-danger-grad)" strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="16" cy="22.5" r="1.5" fill="#FCA5A5" />
    </svg>
  </div>
);

// 8. Badge Heures de Production & Compteurs (Horamètre Moteur & Chronomètre Industriel)
export const ProductionHoursSmartIcon: React.FC<{ size?: number }> = ({ size = 52 }) => (
  <div 
    className="relative rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(255,138,0,0.35)] shrink-0 overflow-hidden"
    style={{
      width: size,
      height: size,
      background: 'radial-gradient(120% 120% at 30% 20%, rgba(255, 184, 77, 0.22) 0%, rgba(217, 119, 6, 0.12) 45%, rgba(13, 20, 30, 0.95) 100%)',
      border: '1px solid rgba(255, 184, 77, 0.45)',
      boxShadow: '0 10px 24px -4px rgba(217, 119, 6, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.35), inset 0 -2px 4px rgba(0, 0, 0, 0.5)'
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

    <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="amber-chrono-grad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="40%" stopColor="#FB923C" />
          <stop offset="80%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>
      </defs>

      {/* Cadran d'horamètre industriel lourd avec poussoir supérieur */}
      <circle cx="16" cy="17" r="10.5" fill="#141E2C" stroke="url(#amber-chrono-grad)" strokeWidth="2" />
      <path d="M16 2.5V6.5M13 2.5H19" stroke="url(#amber-chrono-grad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="9" x2="22" y2="11" stroke="url(#amber-chrono-grad)" strokeWidth="1.8" strokeLinecap="round" />

      {/* Aiguilles de mesure et index d'heures */}
      <line x1="16" y1="17" x2="16" y2="11" stroke="url(#amber-chrono-grad)" strokeWidth="2.4" strokeLinecap="round" />
      <line x1="16" y1="17" x2="21" y2="19" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="17" r="2" fill="#FED7AA" />

      {/* Graduations sur le pourtour */}
      <circle cx="16" cy="17" r="8" stroke="url(#amber-chrono-grad)" strokeWidth="1" strokeDasharray="1.5 3" opacity="0.6" />
    </svg>
  </div>
);

// =========================================================================
// MINI-ICÔNES DU RUBAN DE NAVIGATION SUPÉRIEUR (SMART COCKPIT TABS)
// =========================================================================

export const RibbonTabTcoIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <div 
    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md ${
      active 
        ? 'bg-[#08111F] text-[#FF8A00] border border-[#FF8A00]/60 shadow-[0_0_12px_rgba(255,138,0,0.4)]' 
        : 'bg-[#FF8A00]/15 text-[#FF8A00] group-hover:bg-[#FF8A00]/25 border border-[#FF8A00]/30'
    }`}
  >
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7V17M15 9.5C15 8.4 13.7 7.5 12 7.5C10.3 7.5 9 8.4 9 9.5C9 12 15 11.5 15 14C15 15.1 13.7 16 12 16C10.3 16 9 15.1 9 14" 
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  </div>
);

export const RibbonTabPerfIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <div 
    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md ${
      active 
        ? 'bg-[#08111F] text-[#0EA5E9] border border-[#0EA5E9]/60 shadow-[0_0_12px_rgba(14,165,233,0.4)]' 
        : 'bg-[#0EA5E9]/15 text-[#0EA5E9] group-hover:bg-[#0EA5E9]/25 border border-[#0EA5E9]/30'
    }`}
  >
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M3 12H7L10 5L14 19L17 12H21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="5" r="1.5" fill="currentColor" />
      <circle cx="14" cy="19" r="1.5" fill="currentColor" />
    </svg>
  </div>
);

export const RibbonTabMiningIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <div 
    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md ${
      active 
        ? 'bg-[#08111F] text-amber-400 border border-amber-400/60 shadow-[0_0_12px_rgba(251,191,36,0.4)]' 
        : 'bg-amber-500/15 text-amber-400 group-hover:bg-amber-500/25 border border-amber-400/30'
    }`}
  >
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      {/* Silhouette détaillée d'un tombereau minier lourd 240T */}
      <path d="M2 14L4.5 7H13.5L16 14H2Z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 10H19.5L22 14H16V10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="6.5" cy="17.5" r="2.8" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="17.5" r="2.8" stroke="currentColor" strokeWidth="2" />
      <line x1="9.3" y1="17.5" x2="14.7" y2="17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

// =========================================================================
// MINI-ICÔNE SMART RAPPORT TCO & BADGE RADIAL TÉLÉMÉTRIE FLOTTE
// =========================================================================

export const PdfSmartIcon: React.FC = () => (
  <div className="w-5 h-5 rounded-md bg-[#FF8A00]/20 flex items-center justify-center text-[#FF8A00] group-hover:bg-[#08111F]/30 transition-colors shrink-0">
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" strokeWidth="2" />
      <line x1="16" y1="17" x2="8" y2="17" strokeWidth="2" />
      <line x1="10" y1="9" x2="8" y2="9" strokeWidth="2" />
    </svg>
  </div>
);

export const DisponibiliteRadialBadge: React.FC<{ rate: number; statusText?: string }> = ({
  rate,
  statusText = 'NOMINAL'
}) => {
  // Calcul circonférence SVG r=10 => C = 2 * PI * 10 = 62.83
  const circumference = 62.83;
  const strokeDashoffset = circumference - (circumference * Math.min(100, Math.max(0, rate))) / 100;

  return (
    <div className="flex items-center gap-3 bg-[#08111F] px-3.5 py-2 rounded-xl border border-[#8995A3]/25 shadow-inner whitespace-nowrap">
      {/* Mini cadran radial SVG */}
      <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
        <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
          <circle
            cx="14"
            cy="14"
            r="10"
            fill="none"
            stroke="#172231"
            strokeWidth="2.5"
          />
          <circle
            cx="14"
            cy="14"
            r="10"
            fill="none"
            stroke="#10B981"
            strokeWidth="2.8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping absolute" />
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-bold text-[#8995A3] tracking-wider leading-none">
          Disponibilité Flotte
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="font-black text-xs text-[#10B981] font-mono leading-none">
            {rate}%
          </span>
          <span className="text-[9px] font-extrabold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.2 rounded border border-[#10B981]/30 font-mono tracking-wide leading-none">
            {statusText}
          </span>
        </div>
      </div>
    </div>
  );
};

