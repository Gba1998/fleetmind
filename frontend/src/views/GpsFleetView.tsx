import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, FastForward, RotateCcw, AlertTriangle, ShieldAlert,
  Gauge, Fuel, Thermometer, Activity, Clock, Navigation, MapPin,
  Radio, Wrench, ShieldCheck, Flame, Zap
} from 'lucide-react';
import GpsMap, { GpsVehicle, HAUL_ROAD_PATH, MINING_ZONES } from '../components/GpsMap';
import Badge from '../components/ui/Badge';

interface GpsFleetViewProps {
  vehicles: GpsVehicle[];
  onUpdateVehicles?: (updater: (prev: GpsVehicle[]) => GpsVehicle[]) => void;
  selectedVehicle: GpsVehicle | null;
  onSelectVehicle: (v: GpsVehicle) => void;
  statusFilter: string;
  onSetStatusFilter: (status: string) => void;
  typeFilter: string;
  onSetTypeFilter: (type: string) => void;
  onSimulatePing: () => void;
  onRequestMaintenanceOrder?: (vehicleId: string, vehicleName: string, reason: string) => void;
}

export const GpsFleetView: React.FC<GpsFleetViewProps> = ({
  vehicles,
  onUpdateVehicles,
  selectedVehicle,
  onSelectVehicle,
  statusFilter,
  onSetStatusFilter,
  typeFilter,
  onSetTypeFilter,
  onSimulatePing,
  onRequestMaintenanceOrder,
}) => {
  // Contrôleur de Simulation Temps Réel
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(1);
  const [framesCount, setFramesCount] = useState(128);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // État de navigation séquentielle sur la Piste de Roulage (pour le Tombereau Mercedes Actros)
  const truckWaypointIndex = useRef<number>(2);
  const truckDirection = useRef<'FORWARD' | 'BACKWARD'>('FORWARD');
  const truckPauseTicks = useRef<number>(0);

  // Boucle de Télématique en Temps Réel
  useEffect(() => {
    if (!isPlaying || !onUpdateVehicles) return;

    const intervalMs = Math.round(1500 / simSpeed);

    const timer = setInterval(() => {
      setFramesCount((prev) => prev + 1);

      onUpdateVehicles((prevVehicles) => {
        return prevVehicles.map((vehicle) => {
          // Clone pour modification immutabilité avec typage strict du tuple de coordonnées
          const trailCopy: [number, number][] = vehicle.trail
            ? [...vehicle.trail]
            : ([[vehicle.lat, vehicle.lng]] as [number, number][]);
          const v: GpsVehicle = { ...vehicle, trail: trailCopy };

          // 1. Tombereau Benne Mercedes Actros (EQ-102 / GPS-02) : Circuit Haul Road
          if (v.immat === 'AB-492-JK') {
            if (truckPauseTicks.current > 0) {
              truckPauseTicks.current -= 1;
              v.speed = 0;
              v.status = 'ARRÊT_MOTEUR_ALLUMÉ';
              v.rpm = 780; // Ralenti lors du déchargement / chargement
              v.lastUpdate = 'À l\'instant (Stationnaire opérationnel)';
            } else {
              v.status = 'EN_DEPLACEMENT';
              const targetIdx = truckWaypointIndex.current;
              const targetPt = HAUL_ROAD_PATH[targetIdx];

              const dLat = targetPt[0] - v.lat;
              const dLng = targetPt[1] - v.lng;
              const dist = Math.sqrt(dLat * dLat + dLng * dLng);

              if (dist < 0.002) {
                // Point atteint : passer au suivant
                if (truckDirection.current === 'FORWARD') {
                  if (targetIdx >= HAUL_ROAD_PATH.length - 1) {
                    // Arrivé au Concasseur BRL !
                    truckDirection.current = 'BACKWARD';
                    truckWaypointIndex.current = targetIdx - 1;
                    truckPauseTicks.current = 2; // Pause déchargement
                    v.site = 'Station de Concassage & Usine BRL';
                  } else {
                    truckWaypointIndex.current = targetIdx + 1;
                  }
                } else {
                  if (targetIdx <= 0) {
                    // Arrivé au Front de Taille en Fosse Y1 !
                    truckDirection.current = 'FORWARD';
                    truckWaypointIndex.current = 1;
                    truckPauseTicks.current = 2; // Pause chargement
                    v.site = 'Fosse d\'Extraction Y1';
                  } else {
                    truckWaypointIndex.current = targetIdx - 1;
                  }
                }
              } else {
                // Déplacement vers le point
                const step = 0.0012 * (simSpeed === 1 ? 1 : simSpeed === 2 ? 1.6 : 2.5);
                v.lat = Number((v.lat + (dLat / dist) * step).toFixed(5));
                v.lng = Number((v.lng + (dLng / dist) * step).toFixed(5));
                
                // Calcul de cap (Heading en degrés)
                const heading = Math.round((Math.atan2(dLng, dLat) * 180) / Math.PI);
                v.heading = (heading + 360) % 360;

                // Vitesse dynamique (34 - 44 km/h)
                const speedVariation = Math.floor(Math.random() * 8) - 4;
                v.speed = Math.min(48, Math.max(30, (v.speed || 38) + speedVariation));
                v.rpm = Math.round(1450 + v.speed * 12);
                v.site = 'Piste Haul Road (Liaison Fosse - Concasseur)';
                v.geofenceStatus = 'SUR_PISTE';
                v.speedAlert = v.speed > 45;
              }

              v.lastUpdate = 'À l\'instant (Télématique CAN-Bus)';
            }

            // Consommation et horamètre
            if (v.fuelPercent !== undefined) {
              v.fuelPercent = Math.max(5, Number((v.fuelPercent - 0.02).toFixed(2)));
              v.fuel = `${v.fuelPercent.toFixed(1)}%`;
            }
            if (v.engineHours !== undefined) {
              v.engineHours = Number((v.engineHours + 0.005).toFixed(3));
            }
          }

          // 2. Chargeuse Komatsu WA380 (EQ-105 / GPS-05) : Manœuvres en Fosse Y1
          else if (v.immat === 'ENG-5011-CI') {
            v.status = 'EN_DEPLACEMENT';
            const angle = (Date.now() / 2500) % (2 * Math.PI);
            v.lat = Number((5.3755 + Math.sin(angle) * 0.0015).toFixed(5));
            v.lng = Number((-4.0865 + Math.cos(angle) * 0.0015).toFixed(5));
            v.speed = Math.floor(8 + Math.random() * 8);
            v.rpm = Math.floor(1550 + Math.random() * 300);
            v.heading = Math.round((angle * 180) / Math.PI);
            v.site = 'Fosse d\'Extraction Y1';
            v.geofenceStatus = 'DANS_PERIMETRE';
            v.speedAlert = false;
            v.lastUpdate = 'À l\'instant (Télématique)';
          }

          // 3. Pelle Hydraulique CAT 336D (EQ-101 / GPS-01) : Extraction au Front de Taille
          else if (v.immat === 'ENG-8821-CI') {
            v.status = 'ARRÊT_MOTEUR_ALLUMÉ';
            v.speed = 0;
            // Régime moteur oscillant (cycles d'effort hydraulique)
            v.rpm = Math.floor(1450 + Math.random() * 450);
            v.coolantTemp = Math.floor(86 + Math.random() * 4);
            v.site = 'Fosse d\'Extraction Y1 (Front de taille)';
            v.geofenceStatus = 'DANS_PERIMETRE';
            v.lastUpdate = 'À l\'instant (CAN-Bus actif)';
          }

          // 4. Toyota Hilux 4x4 Support (EQ-103 / GPS-03) : Base-Vie
          else if (v.immat === 'CI-3009-XX') {
            v.status = 'ARRÊT_MOTEUR_ALLUMÉ';
            v.speed = 0;
            v.rpm = 800;
            v.site = 'Base-Vie & Ateliers Centraux';
            v.geofenceStatus = 'DANS_PERIMETRE';
            v.lastUpdate = 'Il y a 30s';
          }

          // Mise à jour de la traînée (Trail)
          if (v.status === 'EN_DEPLACEMENT') {
            v.trail = v.trail ? [...v.trail, [v.lat, v.lng] as [number, number]] : [[v.lat, v.lng] as [number, number]];
            if (v.trail.length > 15) {
              v.trail.shift();
            }
          }

          return v;
        });
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, simSpeed, onUpdateVehicles]);

  // Synchronisation du véhicule sélectionné
  const currentSelected = vehicles.find((v) => v.id === selectedVehicle?.id) || selectedVehicle;

  // Déclencheur d'Événement : Excès de Vitesse Forcé
  const handleTriggerSpeedAlert = () => {
    if (!onUpdateVehicles) return;
    onUpdateVehicles((prev) =>
      prev.map((v) => {
        if (v.immat === 'AB-492-JK') {
          return {
            ...v,
            speed: 54, // Vitesse au-dessus de 45 km/h
            speedAlert: true,
            rpm: 2280,
            lastUpdate: 'ALERTE IMMÉDIATE : Vitesse 54 km/h'
          };
        }
        return v;
      })
    );
    setActiveAlert('ALERTE TÉLÉMATIQUE : Excès de vitesse détecté sur le Tombereau Mercedes Actros (54 km/h > limite 45 km/h)');
    setTimeout(() => setActiveAlert(null), 6000);
  };

  // Déclencheur d'Événement : Surchauffe Moteur Forcée
  const handleTriggerOverheat = () => {
    if (!onUpdateVehicles) return;
    onUpdateVehicles((prev) =>
      prev.map((v) => {
        if (v.immat === 'AB-492-JK') {
          return {
            ...v,
            coolantTemp: 104, // Surchauffe critique
            speedAlert: true,
            lastUpdate: 'ALERTE CRITIQUE : Température moteur 104°C'
          };
        }
        return v;
      })
    );
    setActiveAlert('ALERTE MOTEUR CRITIQUE : Surchauffe 104°C sur Mercedes Actros 3340. Arrêt préconisé.');
    setTimeout(() => setActiveAlert(null), 6000);
  };

  // Réinitialisation des positions nominales
  const handleResetPositions = () => {
    truckWaypointIndex.current = 2;
    truckDirection.current = 'FORWARD';
    truckPauseTicks.current = 0;
    if (onUpdateVehicles) {
      onUpdateVehicles((prev) =>
        prev.map((v) => {
          if (v.immat === 'AB-492-JK') {
            return {
              ...v,
              lat: 5.3875,
              lng: -4.0590,
              speed: 38,
              coolantTemp: 89,
              speedAlert: false,
              trail: [[5.3785, -4.0830], [5.3820, -4.0720], [5.3875, -4.0590]],
            };
          }
          return v;
        })
      );
    }
    setActiveAlert('Circuit télématique réinitialisé aux positions nominales.');
    setTimeout(() => setActiveAlert(null), 3000);
  };

  const filtered = vehicles.filter((v) => {
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || v.type === typeFilter;
    return matchesStatus && matchesType;
  });

  return (
    <div className="space-y-5">
      
      {/* ========================================================================= */}
      {/* 1. BANDEAU DE CONTRÔLE TÉLÉMATIQUE LIVE HUD                                */}
      {/* ========================================================================= */}
      <div className="bg-[#111820] border border-[#8995A3]/25 rounded-xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          
          {/* Statut de Connexion Satellite & CAN-Bus */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-[#10B981] animate-ping' : 'bg-[#FF8A00]'}`} />
              <span className={`absolute w-2 h-2 rounded-full ${isPlaying ? 'bg-[#10B981]' : 'bg-[#FF8A00]'}`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black font-mono text-[#F4F6F8] tracking-wider uppercase">
                  {isPlaying ? 'Flux Télématique CAN-Bus en Direct' : 'Simulation en Pause'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#172231] text-[#10B981] border border-[#10B981]/30 font-bold">
                  4G LTE / IRIDIUM
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#8995A3] mt-0.5">
                Balises synchronisées • {framesCount} trames traitées • Précision GPS &plusmn;1.4m
              </p>
            </div>
          </div>

          {/* Boutons de Contrôle de la Boucle (Play / Cadence / Actions) */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            
            {/* Bouton Play/Pause */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-2 rounded-lg text-xs font-black font-mono flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                isPlaying
                  ? 'bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-[#08111F]'
                  : 'bg-[#10B981] hover:bg-[#10B981]/90 text-[#08111F]'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Mettre en Pause' : 'Reprendre le Flux'}</span>
            </button>

            {/* Sélecteur de Cadence (1x, 2x, 5x) */}
            <div className="bg-[#172231] border border-[#8995A3]/25 rounded-lg p-0.5 flex items-center text-[11px] font-mono font-bold">
              <button
                type="button"
                onClick={() => setSimSpeed(1)}
                className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                  simSpeed === 1 ? 'bg-[#FF8A00] text-[#08111F]' : 'text-[#8995A3] hover:text-[#F4F6F8]'
                }`}
              >
                1x (1.5s)
              </button>
              <button
                type="button"
                onClick={() => setSimSpeed(2)}
                className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                  simSpeed === 2 ? 'bg-[#FF8A00] text-[#08111F]' : 'text-[#8995A3] hover:text-[#F4F6F8]'
                }`}
              >
                2x
              </button>
              <button
                type="button"
                onClick={() => setSimSpeed(5)}
                className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                  simSpeed === 5 ? 'bg-[#FF8A00] text-[#08111F]' : 'text-[#8995A3] hover:text-[#F4F6F8]'
                }`}
              >
                5x
              </button>
            </div>

            {/* Bouton Déclenchement Incident Vitesse */}
            <button
              type="button"
              onClick={handleTriggerSpeedAlert}
              title="Simuler un excès de vitesse > 45 km/h sur la Haul Road"
              className="bg-[#172231] hover:bg-red-500/15 text-red-400 border border-red-500/30 px-2.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simuler Excès Vitesse</span>
            </button>

            {/* Bouton Déclenchement Incident Surchauffe */}
            <button
              type="button"
              onClick={handleTriggerOverheat}
              title="Simuler une température moteur 104°C"
              className="bg-[#172231] hover:bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Simuler Surchauffe</span>
            </button>

            {/* Réinitialisation */}
            <button
              type="button"
              onClick={handleResetPositions}
              title="Réinitialiser les véhicules"
              className="bg-[#172231] hover:bg-[#8995A3]/20 text-[#8995A3] hover:text-[#F4F6F8] border border-[#8995A3]/25 p-2 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message d'Alerte Actif en Temps Réel */}
        {activeAlert && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-300 p-2.5 rounded-lg text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="font-bold">{activeAlert}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTRES DE SÉLECTION D'ENGINS                                         */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#111820] p-3 rounded-xl border border-[#8995A3]/20 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[#8995A3] font-bold text-[11px] uppercase mr-1">Filtrer Balises :</span>
          
          <select
            value={statusFilter}
            onChange={(e) => onSetStatusFilter(e.target.value)}
            className="bg-[#172231] border border-[#8995A3]/30 rounded-lg px-2.5 py-1.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer"
          >
            <option value="ALL">Tous les statuts ({vehicles.length})</option>
            <option value="EN_DEPLACEMENT">En déplacement actif</option>
            <option value="ARRÊT_MOTEUR_ALLUMÉ">Front de taille / Moteur allumé</option>
            <option value="A_L_ATELIER">À l'atelier mécanique</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => onSetTypeFilter(e.target.value)}
            className="bg-[#172231] border border-[#8995A3]/30 rounded-lg px-2.5 py-1.5 text-[#F4F6F8] focus:border-[#FF8A00] outline-none cursor-pointer"
          >
            <option value="ALL">Toutes les catégories</option>
            <option value="CAMION">Tombereaux & Bennes</option>
            <option value="ENGIN_BTP">Pelles & Chargeuses</option>
            <option value="VEHICULE_LEGER">Pick-up de liaison (4x4)</option>
            <option value="GENERATEUR">Groupes stationnaires</option>
          </select>
        </div>

        <div className="text-[11px] text-[#8995A3] flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>3 Zones de Géofencing surveillées</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DISPOSITION CARTOGRAPHIE (2/3) + DASHBOARD CAN-BUS (1/3)              */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* CARTE LEAFLET MINING (2 Colonnes) */}
        <div className="lg:col-span-2 space-y-2">
          <GpsMap
            vehicles={filtered}
            selectedVehicle={currentSelected}
            onSelectVehicle={onSelectVehicle}
          />

          <div className="text-[10px] text-[#8995A3] font-mono flex items-center justify-between px-1">
            <span>Sélectionnez un engin sur la carte ou dans la liste pour inspecter sa télémétrie CAN-Bus.</span>
            <span>Réseau : Carrière Yopougon Ouest & Centrale BRL</span>
          </div>
        </div>

        {/* PANNEAU INSPECTEUR TÉLÉMATIQUE AVANCÉ (1 Colonne) */}
        <div className="bg-[#111820] border border-[#8995A3]/25 rounded-xl p-5 space-y-5 shadow-2xl">
          {currentSelected ? (
            <div className="space-y-4">
              
              {/* En-tête de l'Engin Sélectionné */}
              <div className="flex items-start justify-between pb-3 border-b border-[#8995A3]/20">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#FF8A00]/15 text-[#FF8A00] font-bold border border-[#FF8A00]/30 uppercase">
                      {currentSelected.type?.replace('_', ' ') || 'ENGIN'}
                    </span>
                    <span className="font-mono text-xs text-[#F4F6F8] font-black">
                      {currentSelected.immat}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-[#F4F6F8]">
                    {currentSelected.name}
                  </h4>
                </div>

                <Badge
                  variant={
                    currentSelected.speedAlert
                      ? 'danger'
                      : currentSelected.status === 'EN_DEPLACEMENT'
                      ? 'success'
                      : currentSelected.status === 'ARRÊT_MOTEUR_ALLUMÉ'
                      ? 'warning'
                      : 'info'
                  }
                >
                  {currentSelected.speedAlert ? 'EXCÈS VITESSE' : currentSelected.status.replace(/_/g, ' ')}
                </Badge>
              </div>

              {/* Localisation & Conducteur */}
              <div className="bg-[#08111F] p-3 rounded-xl border border-[#8995A3]/20 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-[#FF8A00] font-bold font-mono text-[11px]">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{currentSelected.site || 'Carrière Principale'}</span>
                </div>
                <div className="text-[#8995A3] text-[11px] font-mono pl-5">
                  Conducteur : <strong className="text-[#F4F6F8]">{currentSelected.driver || 'Chauffeur de Quart'}</strong>
                </div>
                <div className="text-[10px] text-[#8995A3] font-mono pl-5">
                  Position : {currentSelected.lat}&deg; N, {currentSelected.lng}&deg; W
                </div>
              </div>

              {/* Jauges Principales CAN-Bus */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* 1. Compteur Vitesse Instantanée */}
                <div className="bg-[#172231] p-3 rounded-xl border border-[#8995A3]/20 space-y-1">
                  <div className="flex items-center justify-between text-[#8995A3] text-[10px] font-mono font-bold uppercase">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-[#FF8A00]" /> Vitesse
                    </span>
                    <span className="text-[9px]">Max: 45</span>
                  </div>
                  <div className="flex items-baseline gap-1 pt-1">
                    <span className={`text-2xl font-black font-mono ${currentSelected.speed > 45 ? 'text-red-400' : 'text-[#F4F6F8]'}`}>
                      {currentSelected.speed}
                    </span>
                    <span className="text-xs font-mono text-[#8995A3]">km/h</span>
                  </div>
                  {/* Barre visuelle de vitesse */}
                  <div className="w-full bg-[#08111F] h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all duration-300 ${
                        currentSelected.speed > 45 ? 'bg-red-500' : 'bg-[#FF8A00]'
                      }`}
                      style={{ width: `${Math.min(100, (currentSelected.speed / 60) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* 2. Régime Moteur (RPM) */}
                <div className="bg-[#172231] p-3 rounded-xl border border-[#8995A3]/20 space-y-1">
                  <div className="flex items-center justify-between text-[#8995A3] text-[10px] font-mono font-bold uppercase">
                    <span className="flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-[#10B981]" /> Régime Moteur
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="text-2xl font-black font-mono text-[#10B981]">
                      {currentSelected.rpm ?? (currentSelected.speed > 0 ? 1750 : 800)}
                    </span>
                    <span className="text-xs font-mono text-[#8995A3]">tr/min</span>
                  </div>
                  {/* Barre tachymétrique */}
                  <div className="w-full bg-[#08111F] h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full transition-all duration-300 ${
                        (currentSelected.rpm ?? 1600) > 2100 ? 'bg-red-500' : 'bg-[#10B981]'
                      }`}
                      style={{ width: `${Math.min(100, ((currentSelected.rpm ?? 1600) / 2500) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* 3. Niveau Carburant Réservoir */}
                <div className="bg-[#172231] p-3 rounded-xl border border-[#8995A3]/20 space-y-1">
                  <div className="flex items-center justify-between text-[#8995A3] text-[10px] font-mono font-bold uppercase">
                    <span className="flex items-center gap-1">
                      <Fuel className="w-3.5 h-3.5 text-blue-400" /> Réservoir
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="text-2xl font-black font-mono text-blue-400">
                      {currentSelected.fuel}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8995A3] font-mono">
                    Conso : {currentSelected.speed > 0 ? '34.5 L/h' : '4.2 L/h'}
                  </div>
                </div>

                {/* 4. Température Moteur */}
                <div className="bg-[#172231] p-3 rounded-xl border border-[#8995A3]/20 space-y-1">
                  <div className="flex items-center justify-between text-[#8995A3] text-[10px] font-mono font-bold uppercase">
                    <span className="flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-amber-400" /> Temp. Moteur
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 pt-1">
                    <span className={`text-2xl font-black font-mono ${(currentSelected.coolantTemp ?? 88) > 95 ? 'text-red-400 font-extrabold' : 'text-amber-400'}`}>
                      {currentSelected.coolantTemp ?? 88}&deg;C
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8995A3] font-mono">
                    {(currentSelected.coolantTemp ?? 88) > 95 ? 'ATTENTION SURCHAUFFE' : 'Pression huile : 4.6 bar'}
                  </div>
                </div>
              </div>

              {/* Horamètre & Cap */}
              <div className="bg-[#172231] p-3 rounded-xl border border-[#8995A3]/20 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF8A00]" />
                  <div>
                    <span className="text-[10px] text-[#8995A3] uppercase block font-bold">Horamètre Cumulé</span>
                    <strong className="text-[#F4F6F8] text-sm">
                      {(currentSelected.engineHours ?? 3450.2).toFixed(1)} heures
                    </strong>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#8995A3] uppercase block font-bold">Cap Balise</span>
                  <strong className="text-[#FF8A00] text-sm">
                    {currentSelected.heading ?? 45}&deg; N-E
                  </strong>
                </div>
              </div>

              {/* Actions Rapides Déclenchables sur l'Engin */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onRequestMaintenanceOrder) {
                      onRequestMaintenanceOrder(
                        currentSelected.id,
                        currentSelected.name,
                        `Alerte Télématique GPS : Vitesse ${currentSelected.speed} km/h, Temp ${currentSelected.coolantTemp ?? 88}°C`
                      );
                    } else {
                      alert(`Ordre de réparation pré-rempli pour ${currentSelected.name}`);
                    }
                  }}
                  className="w-full bg-[#172231] hover:bg-amber-500/15 text-amber-300 border border-amber-500/30 py-2.5 rounded-lg text-xs font-bold font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>Émettre un Ordre d'Atelier pour cet Engin</span>
                </button>
              </div>

              {/* Mention de fraîcheur */}
              <div className="text-[10px] text-[#8995A3] font-mono flex items-center justify-between pt-1 border-t border-[#8995A3]/15">
                <span>Dernière trame :</span>
                <span className="text-[#FF8A00] font-bold">{currentSelected.lastUpdate}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-xs text-[#8995A3] space-y-3 font-mono">
              <Radio className="w-8 h-8 text-[#FF8A00] mx-auto opacity-50 animate-pulse" />
              <p>Sélectionnez une balise sur la carte pour inspecter les paramètres CAN-Bus en direct.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GpsFleetView;
