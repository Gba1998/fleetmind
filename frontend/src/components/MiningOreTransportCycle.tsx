import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  Activity, Gauge, Truck, Layers, Clock, Radio, CheckCircle2,
  Sparkles, Compass, AlertCircle, X, ShieldCheck
} from 'lucide-react';

export interface MiningScene {
  id: number;
  stage: string;
  title: string;
  subtitle: string;
  status: string;
  tonnage: string;
  speed: string;
  slope: string;
  hydraulic: string;
  cycleTime: string;
  description: string;
  image: string;
  equipment: string;
}

export const MINING_ORE_SCENES: MiningScene[] = [
  {
    id: 1,
    stage: 'Étape 01/05',
    title: 'Extraction & Chargement au Front de Taille',
    subtitle: 'Pelle hydraulique lourde & Tombereau 240T au cœur de la fosse Yopougon',
    status: 'CHARGEMENT ACTIF',
    tonnage: '240 Tonnes (Minerai brut)',
    speed: '0 km/h (Stationnaire)',
    slope: '0.0% (Radier fosse)',
    hydraulic: '310 bar (Godet 18m³)',
    cycleTime: '3 min 45s (5 passes pelle)',
    description: 'Remplissage cadencé de la benne blindée par la pelle d\'extraction. Centrage automatique de la masse et pesée embarquée par capteurs télématiques sur vérins.',
    image: '/images/mining-cycle/scene1-loading.jpg',
    equipment: 'Pelle CAT 6020B & Tombereau CAT 793F'
  },
  {
    id: 2,
    stage: 'Étape 02/05',
    title: 'Remontée en Rampe des Gradins Miniers',
    subtitle: 'Convoi lourd gravissant les lacets de la carrière à ciel ouvert',
    status: 'CONVOI EN RAMPE 8.5%',
    tonnage: '240 Tonnes (Charge pleine)',
    speed: '18 km/h (Couple maximal)',
    slope: '+8.5% (Montée rampe sud)',
    hydraulic: '240 bar (Direction assistée)',
    cycleTime: '8 min 20s (Transit gradins)',
    description: 'Progression échelonnée sur les gradins avec maintien strict de l\'inter-distance de sécurité (50 m) régulée par balise GPS RTK et radar anticollision.',
    image: '/images/mining-cycle/scene2-convoy.jpg',
    equipment: 'Convoi de 3 Tombereaux Rigides 793F'
  },
  {
    id: 3,
    stage: 'Étape 03/05',
    title: 'Négociation Virage en Lacet & Dévers Falaise',
    subtitle: 'Descente contrôlée et franchissement de la piste serpentine étroite',
    status: 'ROULAGE HAUTE PRÉCISION',
    tonnage: '240 Tonnes (Stabilité gyroscopique)',
    speed: '24 km/h (Ralentisseur ARC)',
    slope: '-4.2% (Dévers sécurisé)',
    hydraulic: '275 bar (Freins refroidis huile)',
    cycleTime: '4 min 10s (Zone sinueuse)',
    description: 'Régulation continue de la vitesse par ralentisseur hydraulique automatique à bain d\'huile. Contrôle d\'assiette dynamique pour prévenir le basculement.',
    image: '/images/mining-cycle/scene3-transit.jpg',
    equipment: 'Tombereau CAT 793F (Assiette active)'
  },
  {
    id: 4,
    stage: 'Étape 04/05',
    title: 'Roulage Express vers l\'Usine de Traitement',
    subtitle: 'Tombereau lancé à pleine puissance sur la piste de haulage principale',
    status: 'TRANSIT PLEINE PUISSANCE',
    tonnage: '240 Tonnes (Vibrations régulées)',
    speed: '34 km/h (Régime de croisière)',
    slope: '+1.2% (Piste de roulage)',
    hydraulic: '220 bar (Suspension azote/huile)',
    cycleTime: '6 min 50s (Ligne droite usine)',
    description: 'Plein déploiement du groupe motopropulseur V16 Quad-Turbo de 2 650 chevaux. Suivi en temps réel de la pression des 6 pneus géants 40.00R57 et température essieux.',
    image: '/images/mining-cycle/scene4-haulage.png',
    equipment: 'Tombereau CAT 797F (2 650 ch V16)'
  },
  {
    id: 5,
    stage: 'Étape 05/05',
    title: 'Déversement au Concasseur Primaire',
    subtitle: 'Basculement benne 65° pour alimentation immédiate de la station de broyage',
    status: 'DÉVERSEMENT & FIN CYCLE',
    tonnage: '240 Tonnes vidées en 38s',
    speed: '0 km/h (Arrimé en quai)',
    slope: '0.0% (Quai d\'alimentation)',
    hydraulic: '330 bar (Vérins télescopiques)',
    cycleTime: '1 min 15s (Vidage & remise à plat)',
    description: 'Positionnement sur butoir de sécurité du concasseur primaire. Deux vigies au sol valident la séquence de déversement. Remise à zéro pour nouveau cycle de rotation.',
    image: '/images/mining-cycle/scene5-dumping.jpg',
    equipment: 'Trémie Concasseur Minier & CAT 793F'
  }
];

export const MiningOreTransportCycle: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const SLIDE_DURATION_MS = 5000;
  const TICK_INTERVAL_MS = 50;

  // Animation timer with smooth progress bar
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_INTERVAL_MS / SLIDE_DURATION_MS) * 100;
        if (next >= 100) {
          setActiveIdx((current) => (current + 1) % MINING_ORE_SCENES.length);
          return 0;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPlaying, activeIdx]);

  const handleSelectScene = (index: number) => {
    setActiveIdx(index);
    setProgress(0);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + MINING_ORE_SCENES.length) % MINING_ORE_SCENES.length);
    setProgress(0);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % MINING_ORE_SCENES.length);
    setProgress(0);
  };

  const currentScene = MINING_ORE_SCENES[activeIdx];

  return (
    <>
      {/* ========================================================================= */}
      {/* WIDGET STANDARD INTÉGRÉ AU POSTE DE CONTRÔLE (ACCUEIL)                    */}
      {/* ========================================================================= */}
      <div className="bg-[#111820] border border-[#8995A3]/25 rounded-2xl overflow-hidden shadow-2xl relative transition-all duration-300">
        
        {/* En-tête Métier Supérieur */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-[#172231] via-[#111820] to-[#172231] border-b border-[#8995A3]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#FF8A00]/20 border border-[#FF8A00]/50 flex items-center justify-center text-[#FF8A00] shadow-sm shadow-[#FF8A00]/20">
              <Truck className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-widest text-[#FF8A00] uppercase">
                  Cycle de Transport de Minerais
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Direct Piste Fosse
                </span>
              </div>
              <p className="text-[11px] text-[#8995A3] font-medium">
                Supervision cinématique en direct des 5 phases d'extraction et de roulage lourd.
              </p>
            </div>
          </div>

          {/* Boutons d'Action & Contrôles */}
          <div className="flex items-center gap-2 self-end sm:self-auto font-mono text-xs">
            <div className="flex items-center gap-1 bg-[#08111F] p-1 rounded-lg border border-[#8995A3]/30 shadow-inner">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded text-[#8995A3] hover:text-[#FF8A00] hover:bg-[#172231] transition-colors cursor-pointer"
                title={isPlaying ? 'Mettre en pause' : 'Lancer le cycle automatique'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded text-[#8995A3] hover:text-[#F4F6F8] hover:bg-[#172231] transition-colors cursor-pointer"
                title="Phase précédente"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded text-[#8995A3] hover:text-[#F4F6F8] hover:bg-[#172231] transition-colors cursor-pointer"
                title="Phase suivante"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsFullScreen(true)}
              className="flex items-center gap-1.5 bg-[#FF8A00]/15 hover:bg-[#FF8A00] text-[#FF8A00] hover:text-[#08111F] border border-[#FF8A00]/40 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer shadow-sm"
              title="Agrandir en mode cinématique plein écran"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Plein Écran</span>
            </button>
          </div>
        </div>

        {/* Corps Visuel : Affichage Cinématique avec Transitions */}
        <div className="relative w-full h-80 sm:h-96 md:h-[420px] bg-[#08111F] overflow-hidden group">
          
          {/* Calques d'Images avec Effet Ken Burns et Fondu Croisé */}
          {MINING_ORE_SCENES.map((scene, idx) => (
            <div
              key={scene.id}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                idx === activeIdx 
                  ? 'opacity-100 scale-100 z-10' 
                  : 'opacity-0 scale-105 pointer-events-none z-0'
              }`}
              style={{
                backgroundImage: `url('${scene.image}')`,
                backgroundColor: '#08111F'
              }}
            />
          ))}

          {/* Dégradés d'Ambiance Industrielle pour la Lisibilité du Texte */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08111F] via-[#08111F]/30 to-[#08111F]/70 z-20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08111F]/90 via-transparent to-[#08111F]/80 z-20 pointer-events-none" />

          {/* Lignes Topographiques et Viseur Technique HUD */}
          <div className="absolute inset-0 pointer-events-none z-20 opacity-20">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#FF8A00]" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#FF8A00]" />
            <div className="absolute bottom-16 left-4 w-6 h-6 border-b-2 border-l-2 border-[#FF8A00]" />
            <div className="absolute bottom-16 right-4 w-6 h-6 border-b-2 border-r-2 border-[#FF8A00]" />
          </div>

          {/* Tag Statut Supérieur Gauche */}
          <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
            <span className="font-mono text-[11px] font-extrabold bg-[#08111F]/90 border border-[#FF8A00] text-[#FF8A00] px-3 py-1 rounded-md backdrop-blur-md shadow-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse" />
              {currentScene.stage} • {currentScene.status}
            </span>
            <span className="hidden sm:inline-block font-mono text-[11px] bg-[#111820]/80 border border-[#8995A3]/30 text-[#F4F6F8] px-2.5 py-1 rounded-md backdrop-blur-md">
              {currentScene.equipment}
            </span>
          </div>

          {/* Panneau Télématique Flottant Supérieur Droit */}
          <div className="absolute top-4 right-4 z-30 hidden md:flex flex-col gap-1.5 font-mono text-[11px] text-right">
            <div className="bg-[#08111F]/85 border border-[#8995A3]/30 px-3 py-1 rounded-md backdrop-blur-md text-[#8995A3]">
              Charge Benne : <span className="text-[#FF8A00] font-bold">{currentScene.tonnage}</span>
            </div>
            <div className="bg-[#08111F]/85 border border-[#8995A3]/30 px-3 py-1 rounded-md backdrop-blur-md text-[#8995A3]">
              Vitesse Piste : <span className="text-emerald-400 font-bold">{currentScene.speed}</span>
            </div>
            <div className="bg-[#08111F]/85 border border-[#8995A3]/30 px-3 py-1 rounded-md backdrop-blur-md text-[#8995A3]">
              Pente Profil : <span className="text-[#F4F6F8] font-bold">{currentScene.slope}</span>
            </div>
          </div>

          {/* Overlay Texte Inférieur Gauche (Description de la Phase) */}
          <div className="absolute bottom-20 left-6 right-6 z-30 max-w-2xl space-y-2 pointer-events-auto">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#F4F6F8] tracking-tight drop-shadow-md">
              {currentScene.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#F4F6F8]/90 font-medium line-clamp-2 drop-shadow">
              {currentScene.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono pt-1">
              <span className="text-[#FF8A00] font-semibold bg-[#FF8A00]/15 px-2 py-0.5 rounded border border-[#FF8A00]/30">
                Hydraulique : {currentScene.hydraulic}
              </span>
              <span className="text-[#8995A3] bg-[#111820]/70 px-2 py-0.5 rounded border border-[#8995A3]/30">
                Temps de cycle estimé : {currentScene.cycleTime}
              </span>
            </div>
          </div>

          {/* Micro Barre de Défilement Continue en Bas de l'Image */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#172231] z-30">
            <div 
              className="h-full bg-gradient-to-r from-[#FF8A00] to-amber-300 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stepper Interactif des 5 Étapes du Roulage en Bas du Composant */}
        <div className="p-3 bg-[#08111F] border-t border-[#8995A3]/20">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {MINING_ORE_SCENES.map((scene, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => handleSelectScene(idx)}
                  className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                    isActive
                      ? 'bg-[#172231] border-[#FF8A00] text-[#F4F6F8] shadow-lg shadow-[#FF8A00]/10 ring-1 ring-[#FF8A00]'
                      : 'bg-[#111820] border-[#8995A3]/20 text-[#8995A3] hover:border-[#8995A3]/50 hover:text-[#F4F6F8]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                    <span className={isActive ? 'text-[#FF8A00] font-bold' : 'text-[#8995A3]'}>
                      0{scene.id}.
                    </span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-[#FF8A00]/20 text-[#FF8A00] font-bold' : 'bg-[#172231] text-[#8995A3]'
                    }`}>
                      {scene.speed.split(' ')[0]}
                    </span>
                  </div>

                  <div className="text-xs font-bold truncate group-hover:text-[#FF8A00] transition-colors">
                    {scene.title}
                  </div>

                  <div className="text-[10px] text-[#8995A3] truncate mt-0.5">
                    {scene.tonnage.split('(')[0]}
                  </div>

                  {/* Indicateur de Progression dans le Stepper */}
                  <div className="w-full h-1 bg-[#172231] rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-100 ${
                        isActive 
                          ? 'bg-[#FF8A00]' 
                          : idx < activeIdx 
                          ? 'bg-emerald-500 w-full' 
                          : 'w-0'
                      }`}
                      style={{ width: isActive ? `${progress}%` : undefined }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL CINÉMATIQUE PLEIN ÉCRAN                                             */}
      {/* ========================================================================= */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-[#08111F]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-300 overflow-y-auto">
          
          {/* Barre Supérieure du Plein Écran */}
          <div className="flex items-center justify-between border-b border-[#8995A3]/30 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#111820] to-[#08111F] border border-[#FF8A00] flex items-center justify-center shadow-lg shadow-[#FF8A00]/20">
                <Truck className="w-5 h-5 text-[#FF8A00]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#F4F6F8] tracking-tight">
                  Supervision Cinématique : Cycle de Transport Minier
                </h2>
                <p className="text-xs text-[#8995A3] font-mono">
                  Opérations Fosse Sud PK18 • Flotte Lourde Caterpillar & Komatsu
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 bg-[#172231] border border-[#8995A3]/30 text-[#F4F6F8] hover:text-[#FF8A00] px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Reprendre'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFullScreen(false)}
                className="p-2 rounded-xl bg-[#172231] hover:bg-red-500/20 text-[#8995A3] hover:text-red-400 border border-[#8995A3]/30 hover:border-red-500/50 transition-all cursor-pointer"
                title="Quitter le plein écran"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Grand Corps Visuel en Plein Écran */}
          <div className="my-6 relative flex-1 min-h-[460px] rounded-2xl overflow-hidden border border-[#8995A3]/30 shadow-2xl bg-[#08111F]">
            <img 
              src={currentScene.image} 
              alt={currentScene.title} 
              className="w-full h-full object-cover object-center animate-in fade-in duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08111F] via-[#08111F]/20 to-transparent pointer-events-none" />

            {/* Fiche Métier Haute Précision incrustée */}
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-[#111820]/90 border border-[#8995A3]/40 backdrop-blur-md shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-[#FF8A00] bg-[#FF8A00]/20 px-2.5 py-0.5 rounded border border-[#FF8A00]/40">
                    {currentScene.stage}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    {currentScene.status}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-[#F4F6F8]">
                  {currentScene.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8995A3] leading-relaxed">
                  {currentScene.description}
                </p>
                <div className="text-xs font-mono text-[#F4F6F8] font-bold">
                  Engins engagés : <span className="text-[#FF8A00]">{currentScene.equipment}</span>
                </div>
              </div>

              {/* Télématique et TCO Live */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-[#08111F]/80 p-3.5 rounded-xl border border-[#8995A3]/25">
                <div>
                  <span className="text-[10px] text-[#8995A3] block">Tonnage</span>
                  <span className="text-[#F4F6F8] font-black">{currentScene.tonnage}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8995A3] block">Vitesse Roulage</span>
                  <span className="text-emerald-400 font-black">{currentScene.speed}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8995A3] block">Pente Rampe</span>
                  <span className="text-[#FF8A00] font-black">{currentScene.slope}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8995A3] block">Pression Vérins</span>
                  <span className="text-cyan-400 font-black">{currentScene.hydraulic}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-[#8995A3]/20 flex items-center justify-between text-[11px]">
                  <span className="text-[#8995A3]">Durée séquence :</span>
                  <span className="text-[#F4F6F8] font-bold">{currentScene.cycleTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Bas de Page Plein Écran */}
          <div className="grid grid-cols-5 gap-3">
            {MINING_ORE_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                type="button"
                onClick={() => handleSelectScene(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  idx === activeIdx
                    ? 'bg-[#FF8A00]/20 border-[#FF8A00] text-[#F4F6F8]'
                    : 'bg-[#111820] border-[#8995A3]/30 text-[#8995A3] hover:border-[#8995A3]'
                }`}
              >
                <div className="text-[10px] font-mono text-[#FF8A00] font-bold">
                  {scene.stage}
                </div>
                <div className="text-xs font-bold truncate mt-0.5">
                  {scene.title}
                </div>
              </button>
            ))}
          </div>

        </div>
      )}
    </>
  );
};

export default MiningOreTransportCycle;
