import React, { useState, useEffect } from 'react';
import { 
  Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, 
  MapPin, Truck, Wrench, Fuel, FlaskConical, Building2,
  ChevronLeft, ChevronRight, Play, Pause, Activity, AlertCircle, Key
} from 'lucide-react';
import { apiLogin } from '../services/api';

interface Tenant {
  id: string;
  name: string;
  country: string;
  currency: string;
}

interface Role {
  code: string;
  label: string;
}

interface LoginPageProps {
  tenants: Tenant[];
  currentTenant: Tenant;
  onSelectTenant: (tenant: Tenant) => void;
  roles: Role[];
  currentRole: Role;
  onSelectRole: (role: Role) => void;
  onLogin: (sessionData?: { user?: any; tenant?: any }) => void;
}

// Scènes cinématiques du Cycle de Transport de Minerai
const ORE_TRANSPORT_SCENES = [
  {
    id: 1,
    title: 'Extraction & Chargement en Fosse',
    step: 'Étape 01/05',
    sub: 'Pelle hydraulique & Tombereau lourd au front de taille',
    speed: '0 km/h • Remplissage benne',
    metric: '240T Minerai chargé',
    image: '/images/mining-cycle/scene1-loading.jpg',
    tag: 'EXTRACTION EN COURS'
  },
  {
    id: 2,
    title: 'Convoi sur Pistes en Gradins',
    step: 'Étape 02/05',
    sub: 'Remontée en rampe 8% • Piste Carrière Principale',
    speed: '22 km/h • Vitesse régulée',
    metric: 'Convoi 3 Tombereaux',
    image: '/images/mining-cycle/scene2-convoy.jpg',
    tag: 'CONVOI EN TRANSIT'
  },
  {
    id: 3,
    title: 'Transit Piste Serpentine Haute',
    step: 'Étape 03/05',
    sub: 'Liaison fosse vers station de concassage primaire',
    speed: '32 km/h • Télématique active',
    metric: 'Pente descendante maîtrisée',
    image: '/images/mining-cycle/scene3-transit.jpg',
    tag: 'ROULAGE HAUTE PRÉCISION'
  },
  {
    id: 4,
    title: 'Roulage Crépusculaire Pleine Puissance',
    step: 'Étape 04/05',
    sub: 'Phares LED & capteurs d\'assiette en opération de quart',
    speed: '28 km/h • Pression pneus 7.2 bar',
    metric: 'Suivi télématique 100%',
    image: '/images/mining-cycle/scene4-haulage.png',
    tag: 'OPÉRATIONS DE NUIT'
  },
  {
    id: 5,
    title: 'Déversement au Concasseur Primaire',
    step: 'Étape 05/05',
    sub: 'Benne basculée 65° • Alimentation trémie usine',
    speed: '0 km/h • Déchargement effectif',
    metric: '240T déversées en 42s',
    image: '/images/mining-cycle/scene5-dumping.jpg',
    tag: 'CYCLE COMPLÉTÉ'
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({
  tenants,
  currentTenant,
  onSelectTenant,
  roles,
  currentRole,
  onSelectRole,
  onLogin,
}) => {
  const [email, setEmail] = useState('sinan@fleetmind.io');
  const [password, setPassword] = useState('fleetmind2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>('');

  // Animation Cycle de Transport de Minerai
  const [activeScene, setActiveScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Transition automatique toutes les 5.5 secondes
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveScene((prev) => (prev + 1) % ORE_TRANSPORT_SCENES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      // Authentification réelle via API Express & token JWT persistant
      const result = await apiLogin(email.trim(), password);
      setIsLoading(false);
      onLogin({ user: result.user, tenant: result.tenant });
    } catch (err: any) {
      console.warn('Erreur authentification API:', err);
      // Si l'utilisateur utilise un compte démo ou si l'API est injoignable, fallback souple
      if (email === 'contact@fleetmind-mining.com' || email.includes('demo')) {
        setIsLoading(false);
        onLogin();
      } else {
        setIsLoading(false);
        setLoginError(err.message || 'Identifiant ou mot de passe incorrect.');
      }
    }
  };

  const currentScene = ORE_TRANSPORT_SCENES[activeScene];

  return (
    <div className="min-h-screen w-full bg-[#08111F] text-[#F4F6F8] flex flex-col lg:flex-row antialiased font-sans relative overflow-x-hidden selection:bg-[#FF8A00] selection:text-[#08111F]">
      
      {/* ========================================================================= */}
      {/* ZONE GAUCHE (~65%) : ANIMATION DU TRANSPORT DE MINERAIS & IDENTITÉ        */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-[65%] min-h-[620px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#8995A3]/20">
        
        {/* Calques Cinématiques Animés du Transport de Minerais (Crossfade & Zoom) */}
        {ORE_TRANSPORT_SCENES.map((scene, idx) => (
          <div
            key={scene.id}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform ${
              idx === activeScene 
                ? 'opacity-100 scale-100 z-0' 
                : 'opacity-0 scale-105 pointer-events-none -z-10'
            }`}
            style={{
              backgroundImage: `url('${scene.image}'), url('/images/fleetmind-mining-truck.png')`,
              backgroundColor: '#08111F'
            }}
          />
        ))}

        {/* Dégradés Industriels Sombres pour Garantie de Lisibilité Maximale */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08111F] via-[#08111F]/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08111F] via-[#08111F]/30 to-[#08111F]/60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(255,138,0,0.14),transparent_60%)] pointer-events-none" />

        {/* Particules de Poussière Minérale Flottantes Animées */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute bottom-10 left-[20%] w-1.5 h-1.5 rounded-full bg-[#FF8A00] animate-ping" />
          <div className="absolute bottom-32 left-[45%] w-1 h-1 rounded-full bg-amber-300 animate-pulse" />
          <div className="absolute bottom-20 left-[60%] w-2 h-2 rounded-full bg-[#FF8A00]/50 animate-bounce" />
          <div className="absolute bottom-40 left-[75%] w-1.5 h-1.5 rounded-full bg-amber-200 animate-pulse" />
        </div>

        {/* Courbes Topographiques Subtiles en Arrière-Plan */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.14] stroke-[#8995A3]" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          strokeWidth="1.2"
        >
          <path d="M-50,220 C250,140 450,380 900,180 C1300,60 1600,320 2000,140" />
          <path d="M-50,360 C200,300 550,520 850,320 C1250,200 1550,440 2000,280" />
          <path d="M-50,500 C180,460 600,660 800,460 C1200,340 1500,580 2000,420" />
          <path d="M-50,640 C140,610 650,800 750,600 C1150,480 1450,720 2000,560" />
          <path d="M-50,780 C100,750 700,940 900,740 C1100,620 1400,860 2000,700" />
        </svg>

        {/* --- EN-TÊTE SUPÉRIEUR GAUCHE --- */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          {/* Logo FleetMind conforme à la référence */}
          <div className="flex items-center gap-3.5">
            {/* Emblème Technique Losange Orange */}
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#111820] to-[#08111F] border border-[#FF8A00] flex items-center justify-center shadow-lg shadow-[#FF8A00]/20">
              <div className="w-5 h-5 border-2 border-[#FF8A00] rotate-45 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-[#FF8A00]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-2xl tracking-widest text-[#F4F6F8] font-mono">FLEET</span>
                <span className="font-black text-2xl tracking-widest text-[#FF8A00] font-mono">MIND</span>
              </div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#8995A3] -mt-0.5">
                Intelligent Fleet & Mining Operations
              </p>
            </div>
          </div>

          {/* Indicateur Technique Haut : Réseau Opérationnel */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-[#111820]/90 border border-[#8995A3]/30 px-3 py-1.5 rounded-full text-[11px] font-mono backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <span className="font-bold text-[#F4F6F8] tracking-wider text-[10px] uppercase">Réseau Opérationnel</span>
            </div>
            <div className="hidden sm:block w-8 h-[1px] bg-[#FF8A00]/60" />
          </div>
        </div>

        {/* --- CORPS CENTRAL DE TEXTE & ACCROCHE --- */}
        <div className="relative z-10 my-auto py-8 max-w-xl space-y-5">
          {/* Tagline de Bienvenue avec filet orange */}
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-[2px] bg-[#FF8A00]" />
            <span className="text-xs font-mono font-bold tracking-[0.2em] text-[#FF8A00] uppercase">
              Bienvenue sur FleetMind
            </span>
          </div>

          {/* Grand Titre Conforme à l'Image de Référence */}
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#F4F6F8] leading-[1.12] tracking-tight">
            La performance de votre <span className="text-[#FF8A00]">flotte.</span>
            <span className="block mt-1">La maîtrise de vos opérations.</span>
          </h1>

          {/* Description Métier Industrielle */}
          <p className="text-xs sm:text-sm text-[#8995A3] leading-relaxed font-normal">
            Plateforme industrielle centralisée dédiée aux environnements d'extraction sévères et aux chantiers d'infrastructure : suivi télématique en temps réel, ateliers de maintenance lourde, planification des conducteurs et audit du carburant.
          </p>
        </div>

        {/* --- BANDEAU ANIMÉ DU TRANSPORT DE MINERAIS (HUD TÉLÉMATIQUE) --- */}
        <div className="relative z-10 mb-6 bg-[#08111F]/85 backdrop-blur-md border border-[#8995A3]/30 rounded-xl p-3.5 shadow-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#8995A3]/20 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FF8A00]/15 border border-[#FF8A00]/40 flex items-center justify-center text-[#FF8A00]">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-[#FF8A00] uppercase tracking-wider">
                    Cycle Transport de Minerais
                  </span>
                  <span className="text-[9px] bg-[#FF8A00]/20 text-[#FF8A00] px-1.5 py-0.2 rounded font-mono font-semibold">
                    {currentScene.tag}
                  </span>
                </div>
                <div className="text-xs font-extrabold text-[#F4F6F8] mt-0.5">
                  {currentScene.title}
                </div>
              </div>
            </div>

            {/* Métriques télématiques de la scène active */}
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="bg-[#172231]/80 px-2.5 py-1 rounded border border-[#8995A3]/20 text-[#8995A3]">
                <span className="text-[#F4F6F8] font-bold">{currentScene.speed}</span>
              </div>
              <div className="bg-[#172231]/80 px-2.5 py-1 rounded border border-[#8995A3]/20 text-[#FF8A00] font-bold">
                {currentScene.metric}
              </div>

              {/* Contrôles d'animation Pause / Suivant */}
              <div className="flex items-center gap-1 bg-[#111820] p-1 rounded border border-[#8995A3]/25">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 text-[#8995A3] hover:text-[#FF8A00] transition-colors cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Reprendre l\'animation'}
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScene((prev) => (prev - 1 + ORE_TRANSPORT_SCENES.length) % ORE_TRANSPORT_SCENES.length)}
                  className="p-1 text-[#8995A3] hover:text-[#F4F6F8] transition-colors cursor-pointer"
                  title="Étape précédente"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveScene((prev) => (prev + 1) % ORE_TRANSPORT_SCENES.length)}
                  className="p-1 text-[#8995A3] hover:text-[#F4F6F8] transition-colors cursor-pointer"
                  title="Étape suivante"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Stepper Interactif des 5 Étapes du Roulage */}
          <div className="grid grid-cols-5 gap-2">
            {ORE_TRANSPORT_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => {
                  setActiveScene(idx);
                  setIsPlaying(false);
                }}
                className={`text-left p-1.5 rounded-lg border transition-all cursor-pointer ${
                  idx === activeScene 
                    ? 'bg-[#FF8A00]/20 border-[#FF8A00] text-[#F4F6F8]' 
                    : 'bg-[#111820]/60 border-[#8995A3]/15 text-[#8995A3] hover:border-[#8995A3]/40'
                }`}
              >
                <div className="font-mono text-[9px] font-bold tracking-widest text-[#FF8A00]">
                  {scene.step}
                </div>
                <div className="text-[10px] font-semibold truncate mt-0.5">
                  {scene.title.split(' ')[0]} {scene.title.split(' ')[1] || ''}
                </div>
                {/* Micro-barre de progression animée */}
                <div className="w-full h-1 bg-[#172231] rounded-full mt-1 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      idx === activeScene 
                        ? 'bg-[#FF8A00] w-full animate-pulse' 
                        : idx < activeScene 
                        ? 'bg-[#10B981] w-full' 
                        : 'w-0'
                    }`} 
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* --- PIED DE ZONE GAUCHE (4 Piliers + Cible Topographique) --- */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4 border-t border-[#8995A3]/20">
          
          {/* 4 Fonctionnalités avec Icônes Lucide */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 flex-1">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[#FF8A00] shrink-0" />
              <span className="text-xs text-[#F4F6F8] font-medium leading-tight">
                Suivi GPS<br /><span className="text-[10px] text-[#8995A3]">en temps réel</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-[#FF8A00] shrink-0" />
              <span className="text-xs text-[#F4F6F8] font-medium leading-tight">
                Gestion des<br /><span className="text-[10px] text-[#8995A3]">équipements</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Wrench className="w-5 h-5 text-[#FF8A00] shrink-0" />
              <span className="text-xs text-[#F4F6F8] font-medium leading-tight">
                Maintenance<br /><span className="text-[10px] text-[#8995A3]">prédictive</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Fuel className="w-5 h-5 text-[#FF8A00] shrink-0" />
              <span className="text-xs text-[#F4F6F8] font-medium leading-tight">
                Contrôle<br /><span className="text-[10px] text-[#8995A3]">du carburant</span>
              </span>
            </div>
          </div>

          {/* Repère Cartographique Topo en Bas à Droite */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-3 h-3 rounded-full border border-[#FF8A00] flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#FF8A00]" />
            </div>
            <div className="w-4 h-[1px] bg-[#FF8A00]" />
            <span className="font-mono text-[9px] font-bold tracking-widest text-[#F4F6F8] uppercase">
              Exploitation Minière & BTP
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ZONE DROITE (~35%) : FORMULAIRE DE CONNEXION & ACCÈS DÉMO                 */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-[35%] min-h-[500px] lg:min-h-screen bg-[#08111F] flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-hidden">
        
        {/* Accent Géométrique Industriel en Coin Inférieur Droit */}
        <div className="absolute -bottom-8 -right-8 w-28 h-28 pointer-events-none opacity-40">
          <div className="w-full h-full border-r-2 border-b-2 border-[#FF8A00] rotate-12" />
        </div>

        {/* Haut : Partenaire Minier */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2 text-right">
            <div className="text-[10px] text-[#8995A3] font-medium leading-tight">
              Notre partenaire<br />
              <strong className="text-[#F4F6F8] font-semibold">Minier & BTP</strong>
            </div>
            <div className="w-8 h-8 rounded-lg bg-[#111820] border border-[#8995A3]/25 flex items-center justify-center text-[#8995A3]">
              <Building2 className="w-4 h-4 text-[#FF8A00]" />
            </div>
          </div>
        </div>

        {/* Centre : Titre & Formulaire de Connexion */}
        <div className="my-auto py-6 max-w-sm w-full mx-auto space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F6F8] tracking-tight">
              Bienvenue sur <span className="text-[#FF8A00]">FleetMind</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#8995A3] mt-1.5 font-medium">
              Connectez-vous à votre espace de travail
            </p>
          </div>

          {loginError && (
            <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] rounded-lg p-3 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-semibold">{loginError}</p>
                <button
                  type="button"
                  onClick={() => onLogin()}
                  className="text-[11px] font-bold text-[#FF8A00] underline hover:text-[#FF8A00]/80 cursor-pointer block"
                >
                  Continuer en session démo immédiate
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ 1 : Identifiant professionnel ou e-mail */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F4F6F8] block">
                Identifiant professionnel ou e-mail
              </label>
              <div className="relative rounded-lg bg-[#0D1522] border border-[#8995A3]/30 focus-within:border-[#FF8A00] transition-colors">
                <User className="w-4 h-4 text-[#8995A3] absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex : nom@entreprise.com"
                  required
                  className="w-full bg-transparent pl-10 pr-3 py-2.5 text-xs sm:text-sm text-[#F4F6F8] placeholder-[#8995A3]/60 focus:outline-none"
                />
              </div>
            </div>

            {/* Champ 2 : Mot de passe avec toggle visibilité */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#F4F6F8]">
                  Mot de passe
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-[#FF8A00] hover:underline cursor-pointer"
                  onClick={() => alert("Réinitialisation du mot de passe : contactez votre administrateur FleetMind.")}
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative rounded-lg bg-[#0D1522] border border-[#8995A3]/30 focus-within:border-[#FF8A00] transition-colors">
                <Lock className="w-4 h-4 text-[#8995A3] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
                  required
                  className="w-full bg-transparent pl-10 pr-10 py-2.5 text-xs sm:text-sm text-[#F4F6F8] placeholder-[#8995A3]/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#8995A3] hover:text-[#F4F6F8] cursor-pointer"
                  title={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Indication des identifiants par défaut */}
            <div className="bg-[#0D1522] border border-[#8995A3]/25 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-[#8995A3]">
                <Key className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>Identifiants : <strong className="text-[#F4F6F8]">sinan@fleetmind.io</strong></span>
              </div>
              <span className="font-mono text-[#FF8A00] font-bold">fleetmind2026</span>
            </div>

            {/* Sélecteurs Discrets Multi-Entreprise & Rôle (Préservation de l'émulation démo) */}
            <div className="pt-1 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="bg-[#0D1522] p-2 rounded-lg border border-[#8995A3]/20">
                <span className="text-[9px] uppercase text-[#8995A3] block font-bold mb-1">Filiale Minière</span>
                <select
                  value={currentTenant.id}
                  onChange={(e) => {
                    const t = tenants.find((item) => item.id === e.target.value);
                    if (t) onSelectTenant(t);
                  }}
                  className="w-full bg-transparent text-[#F4F6F8] font-bold focus:outline-none cursor-pointer truncate text-[11px]"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#08111F] text-[#F4F6F8]">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#0D1522] p-2 rounded-lg border border-[#8995A3]/20">
                <span className="text-[9px] uppercase text-[#8995A3] block font-bold mb-1">Profil Actif</span>
                <select
                  value={currentRole.code}
                  onChange={(e) => {
                    const r = roles.find((item) => item.code === e.target.value);
                    if (r) onSelectRole(r);
                  }}
                  className="w-full bg-transparent text-[#FF8A00] font-bold focus:outline-none cursor-pointer truncate text-[11px]"
                >
                  {roles.map((r) => (
                    <option key={r.code} value={r.code} className="bg-[#08111F] text-[#F4F6F8]">
                      {r.code}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bouton Principal Orange Conforme */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF8A00] hover:bg-[#FF8A00]/90 active:scale-[0.99] text-[#08111F] font-black py-3 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF8A00]/25 transition-all cursor-pointer mt-2"
            >
              <span>{isLoading ? 'Connexion en cours...' : 'Accéder à mon espace'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Séparateur « Ou » */}
          <div className="relative flex items-center justify-center my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#8995A3]/20" />
            </div>
            <span className="relative bg-[#08111F] px-3 text-[11px] font-mono text-[#8995A3] uppercase">
              Ou
            </span>
          </div>

          {/* Carte d'Accès Démonstration Conforme */}
          <div className="bg-[#0D1522] border border-[#8995A3]/25 hover:border-[#FF8A00]/40 rounded-xl p-3 flex items-center justify-between gap-3 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF8A00]/10 border border-[#FF8A00]/30 flex items-center justify-center text-[#FF8A00] shrink-0">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#F4F6F8]">Accès de démonstration</div>
                <div className="text-[10px] text-[#8995A3]">Pour tester l'application</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onLogin()}
              className="bg-[#172231] hover:bg-[#FF8A00]/15 text-[#FF8A00] border border-[#8995A3]/30 hover:border-[#FF8A00]/50 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer shrink-0"
            >
              Se connecter
            </button>
          </div>
        </div>

        {/* Bas : Mention de Connexion Sécurisée */}
        <div className="flex items-center justify-center sm:justify-start gap-2 text-[11px] text-[#8995A3] pt-4 border-t border-[#8995A3]/15">
          <ShieldCheck className="w-4 h-4 text-[#8995A3] shrink-0" />
          <span>Connexion sécurisée (mode démonstration)</span>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
