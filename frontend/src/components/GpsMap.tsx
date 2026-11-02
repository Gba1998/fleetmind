import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Eye, EyeOff, Maximize2, Compass, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface GpsVehicle {
  id: string;
  immat: string;
  name: string;
  type?: string;
  speed: number;
  status: string; // 'EN_DEPLACEMENT' | 'ARRÊT_MOTEUR_ALLUMÉ' | 'A_L_ATELIER'
  lat: number;
  lng: number;
  fuel: string;
  lastUpdate: string;
  driver?: string;
  site?: string;
  // Métriques CAN-Bus Télématiques Étendues
  rpm?: number;
  fuelPercent?: number;
  coolantTemp?: number;
  oilPressure?: number;
  engineHours?: number;
  heading?: number;
  geofenceStatus?: 'DANS_PERIMETRE' | 'HORS_PERIMETRE' | 'SUR_PISTE';
  speedAlert?: boolean;
  trail?: [number, number][];
}

interface GpsMapProps {
  vehicles: GpsVehicle[];
  selectedVehicle: GpsVehicle | null;
  onSelectVehicle: (vehicle: GpsVehicle) => void;
}

// =========================================================================
// ZONES MINIÈRES OFFICIELLES & COORDONNÉES DE GÉOFENCING
// =========================================================================
export const MINING_ZONES = [
  {
    id: 'zone-extraction',
    name: 'Fosse d\'Extraction Y1',
    code: 'FOSSE_Y1',
    type: 'EXTRACTION',
    speedLimit: 30,
    color: '#FF8A00', // Orange minier
    fillColor: '#FF8A00',
    fillOpacity: 0.12,
    coordinates: [
      [5.3860, -4.0930],
      [5.3900, -4.0750],
      [5.3710, -4.0730],
      [5.3670, -4.0910],
    ] as [number, number][],
    center: [5.3785, -4.0830] as [number, number],
    description: 'Front de taille & Chargement tombereaux 240T'
  },
  {
    id: 'zone-concasseur',
    name: 'Station de Concassage & Centrale BRL',
    code: 'CONCASSEUR_BRL',
    type: 'TRAITEMENT',
    speedLimit: 25,
    color: '#10B981', // Vert émeraude
    fillColor: '#10B981',
    fillOpacity: 0.12,
    coordinates: [
      [5.4130, -4.0410],
      [5.4150, -4.0230],
      [5.3980, -4.0210],
      [5.3960, -4.0390],
    ] as [number, number][],
    center: [5.4055, -4.0310] as [number, number],
    description: 'Trémie primaire de déversement & Stockage'
  },
  {
    id: 'zone-atelier',
    name: 'Base-Vie & Ateliers Centraux',
    code: 'BASE_VIE_ATELIER',
    type: 'MAINTENANCE',
    speedLimit: 20,
    color: '#0EA5E9', // Bleu cyan
    fillColor: '#0EA5E9',
    fillOpacity: 0.12,
    coordinates: [
      [5.3490, -4.0250],
      [5.3510, -4.0060],
      [5.3330, -4.0040],
      [5.3310, -4.0230],
    ] as [number, number][],
    center: [5.3410, -4.0145] as [number, number],
    description: 'Ateliers mécaniques lourds, fosses & cuves diesel'
  }
];

// Piste de Roulage Minier Lourde (Haul Road principale)
export const HAUL_ROAD_PATH: [number, number][] = [
  [5.3785, -4.0830], // Fosse extraction
  [5.3820, -4.0720], // Rampe sortie
  [5.3875, -4.0590], // Piste serpentine
  [5.3940, -4.0470], // Liaison intermédiaire
  [5.4055, -4.0310], // Concasseur primaire
];

export const GpsMap: React.FC<GpsMapProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const zonesLayerRef = useRef<L.LayerGroup | null>(null);
  const trailLayerRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [showGeofencing, setShowGeofencing] = useState(true);
  const [showTrails, setShowTrails] = useState(true);

  // Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centrage sur le complexe minier & carrières
    const map = L.map(mapContainerRef.current, {
      center: [5.378, -4.05],
      zoom: 12,
      zoomControl: false, // On utilise nos contrôles industriels personnalisés
      attributionControl: true,
    });

    // Dark Tiles haute définition (CartoDB Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>',
    }).addTo(map);

    // Initialisation des couches indépendantes
    const zonesLayer = L.layerGroup().addTo(map);
    const trailLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    zonesLayerRef.current = zonesLayer;
    trailLayerRef.current = trailLayer;
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Dessin des Zones de Géofencing et de la Piste Haul Road
  useEffect(() => {
    const zonesLayer = zonesLayerRef.current;
    if (!zonesLayer) return;

    zonesLayer.clearLayers();

    if (!showGeofencing) return;

    // 1. Piste de Roulage Minier Principale (Haul Road)
    const haulRoad = L.polyline(HAUL_ROAD_PATH, {
      color: '#FF8A00',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round',
    });
    haulRoad.bindTooltip(
      '<strong>Piste de Roulage Haul Road</strong><br/>Liaison Fosse Y1 &rarr; Concasseur BRL (Vmax 45 km/h)',
      { direction: 'top', className: 'leaflet-dark-tooltip' }
    );
    haulRoad.addTo(zonesLayer);

    // Halo d'éclairage sous la piste
    L.polyline(HAUL_ROAD_PATH, {
      color: '#FF8A00',
      weight: 12,
      opacity: 0.15,
    }).addTo(zonesLayer);

    // 2. Polygones des 3 Zones Minières
    MINING_ZONES.forEach((zone) => {
      const polygon = L.polygon(zone.coordinates, {
        color: zone.color,
        weight: 2,
        opacity: 0.9,
        fillColor: zone.fillColor,
        fillOpacity: zone.fillOpacity,
        dashArray: '5, 5',
      });

      polygon.bindTooltip(
        `<div class="font-sans">
          <strong style="color: ${zone.color};">${zone.name}</strong> [${zone.code}]<br/>
          <span style="color: #8995A3;">${zone.description}</span><br/>
          <span style="font-family: monospace; font-size: 10px;">Vitesse autorisée : &le; ${zone.speedLimit} km/h</span>
        </div>`,
        { direction: 'center', className: 'leaflet-dark-tooltip', permanent: false }
      );

      // Label fixe et discret au centre de chaque zone
      const labelIcon = L.divIcon({
        html: `
          <div class="whitespace-nowrap px-2 py-0.5 rounded text-[9px] font-mono font-bold border shadow-lg backdrop-blur-sm pointer-events-none"
               style="background-color: rgba(8, 17, 31, 0.85); color: ${zone.color}; border-color: ${zone.color}50;">
            ${zone.code} • &le;${zone.speedLimit} km/h
          </div>
        `,
        className: 'zone-label-icon',
        iconAnchor: [45, 10],
      });
      L.marker(zone.center, { icon: labelIcon, interactive: false }).addTo(zonesLayer);

      polygon.addTo(zonesLayer);
    });
  }, [showGeofencing]);

  // Dessin des Traînées de Navigation (Breadcrumb Trails)
  useEffect(() => {
    const trailLayer = trailLayerRef.current;
    if (!trailLayer) return;

    trailLayer.clearLayers();

    if (!showTrails) return;

    // Tracer la traînée du véhicule sélectionné (ou de tous les véhicules en déplacement)
    vehicles.forEach((v) => {
      if (!v.trail || v.trail.length < 2) return;

      const isSelected = selectedVehicle?.id === v.id;
      // Afficher la traînée si le véhicule est sélectionné ou en déplacement actif
      if (!isSelected && v.status !== 'EN_DEPLACEMENT') return;

      const trailColor = isSelected ? '#FF8A00' : '#10B981';
      const trailOpacity = isSelected ? 0.9 : 0.4;
      const trailWeight = isSelected ? 4 : 2;

      // Ligne principale de la traînée
      L.polyline(v.trail, {
        color: trailColor,
        weight: trailWeight,
        opacity: trailOpacity,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: isSelected ? undefined : '4, 4',
      }).addTo(trailLayer);

      // Marqueurs de petits points sur les passages récents
      if (isSelected) {
        v.trail.slice(-6).forEach((pt, idx) => {
          L.circleMarker(pt, {
            radius: 2 + idx * 0.5,
            color: '#FF8A00',
            fillColor: '#FF8A00',
            fillOpacity: 0.3 + idx * 0.12,
            weight: 1,
          }).addTo(trailLayer);
        });
      }
    });
  }, [vehicles, selectedVehicle, showTrails]);

  // Dessin des Marqueurs Véhicules Dynamiques
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    vehicles.forEach((v) => {
      const isSelected = selectedVehicle?.id === v.id;
      const hasSpeedAlert = v.speedAlert || (v.speed > 45 && v.status === 'EN_DEPLACEMENT');
      const isOutGeofence = v.geofenceStatus === 'HORS_PERIMETRE';

      // Couleur d'état
      let colorClass = 'bg-[#10B981] border-[#10B981] text-[#08111F]';
      let haloColor = 'rgba(16, 185, 129, 0.4)';

      if (hasSpeedAlert || isOutGeofence) {
        colorClass = 'bg-[#EF4444] border-red-400 text-white animate-pulse';
        haloColor = 'rgba(239, 68, 68, 0.6)';
      } else if (v.status === 'ARRÊT_MOTEUR_ALLUMÉ') {
        colorClass = 'bg-[#FF8A00] border-amber-300 text-[#08111F]';
        haloColor = 'rgba(255, 138, 0, 0.4)';
      } else if (v.status === 'A_L_ATELIER' || v.status === 'EN_MAINTENANCE') {
        colorClass = 'bg-[#0EA5E9] border-sky-300 text-[#08111F]';
        haloColor = 'rgba(14, 165, 233, 0.4)';
      }

      // Icônes vectorielles SVG industrielles conformes (0 emoji)
      const isTruck = v.type?.includes('CAMION') || v.type?.includes('BTP') || v.type?.includes('GENERATEUR');
      const iconSvg = isTruck
        ? `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`
        : `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`;

      // Flèche de cap directionnel
      const headingDeg = v.heading ?? 0;
      const headingArrow = v.status === 'EN_DEPLACEMENT'
        ? `<div class="absolute -top-2.5 left-1/2 -translate-x-1/2 transform transition-transform duration-300" style="transform: translateX(-50%) rotate(${headingDeg}deg);">
             <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-[#FF8A00]"></div>
           </div>`
        : '';

      const customHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
          ${
            hasSpeedAlert || isOutGeofence
              ? `<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-80"></span>`
              : v.status === 'EN_DEPLACEMENT'
              ? `<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60"></span>`
              : ''
          }
          ${headingArrow}
          <div class="w-8 h-8 rounded-full ${colorClass} border-2 shadow-2xl flex items-center justify-center font-bold text-xs shadow-black">
            ${iconSvg}
          </div>

          {/* Badge Vitesse & Immatriculation combinés */}
          <div class="absolute -bottom-5 whitespace-nowrap bg-[#08111F]/95 text-[10px] font-mono font-bold text-[#F4F6F8] px-1.5 py-0.5 rounded border border-[#8995A3]/40 shadow-lg pointer-events-none flex items-center gap-1">
            <span>${v.immat}</span>
            <span class="${hasSpeedAlert ? 'text-red-400 font-extrabold' : v.speed > 0 ? 'text-[#FF8A00]' : 'text-[#8995A3]'}">${v.speed} km/h</span>
          </div>

          ${
            hasSpeedAlert
              ? `<div class="absolute -top-5 bg-red-600 text-white font-mono font-black text-[9px] px-1 rounded shadow animate-bounce">
                  VITESSE &gt; 45
                 </div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-gps-pin',
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([v.lat, v.lng], { icon: customIcon });

      marker.on('click', () => {
        onSelectVehicle(v);
      });

      marker.bindTooltip(
        `<div class="font-sans space-y-1">
          <div class="flex items-center justify-between gap-3 border-b border-[#8995A3]/30 pb-1">
            <strong class="text-[#FF8A00]">${v.name}</strong>
            <span class="font-mono text-[10px] text-[#F4F6F8]">${v.immat}</span>
          </div>
          <div class="text-[11px] grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono">
            <span class="text-[#8995A3]">Vitesse:</span> <strong class="${hasSpeedAlert ? 'text-red-400' : 'text-[#10B981]'}">${v.speed} km/h</strong>
            <span class="text-[#8995A3]">Régime:</span> <span>${v.rpm ?? 1600} tr/min</span>
            <span class="text-[#8995A3]">Réservoir:</span> <span class="text-[#FF8A00]">${v.fuel}</span>
            <span class="text-[#8995A3]">Temp. moteur:</span> <span>${v.coolantTemp ?? 85}°C</span>
          </div>
          <div class="text-[10px] text-[#8995A3] pt-0.5">
            Zone: <strong class="text-[#F4F6F8]">${v.site || 'Carrière'}</strong>
          </div>
        </div>`,
        { direction: 'top', offset: [0, -20], className: 'leaflet-dark-tooltip' }
      );

      marker.addTo(markersLayer);
    });

    // Recentrage automatique fluide si un véhicule est sélectionné
    if (selectedVehicle) {
      map.flyTo([selectedVehicle.lat, selectedVehicle.lng], Math.max(map.getZoom(), 13), {
        duration: 0.6,
      });
    }
  }, [vehicles, selectedVehicle, onSelectVehicle]);

  // Actions de Contrôle de la Carte
  const handleFitAllZones = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([5.378, -4.05], 12, { duration: 0.8 });
  };

  const handleCenterSelected = () => {
    const map = mapInstanceRef.current;
    if (!map || !selectedVehicle) return;
    map.flyTo([selectedVehicle.lat, selectedVehicle.lng], 14, { duration: 0.8 });
  };

  return (
    <div className="relative w-full h-[540px] rounded-xl overflow-hidden border border-[#8995A3]/25 bg-[#08111F] shadow-2xl">
      {/* Conteneur DOM Leaflet */}
      <div
        ref={mapContainerRef}
        className="w-full h-full z-10"
        style={{ minHeight: '540px' }}
      />

      {/* Barre d'Outils Superposée (HUD Cartographique Industriel) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleFitAllZones}
          title="Vue d'ensemble de la Carrière"
          className="bg-[#08111F]/90 hover:bg-[#172231] text-[#F4F6F8] border border-[#8995A3]/30 hover:border-[#FF8A00] p-2 rounded-lg shadow-xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold"
        >
          <Maximize2 className="w-3.5 h-3.5 text-[#FF8A00]" />
          <span className="hidden sm:inline">Vue Carrière</span>
        </button>

        {selectedVehicle && (
          <button
            type="button"
            onClick={handleCenterSelected}
            title="Centrer sur le véhicule sélectionné"
            className="bg-[#08111F]/90 hover:bg-[#172231] text-[#FF8A00] border border-[#FF8A00]/50 p-2 rounded-lg shadow-xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold animate-in fade-in"
          >
            <Compass className="w-3.5 h-3.5 text-[#FF8A00] animate-spin-slow" />
            <span className="hidden sm:inline">{selectedVehicle.immat}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setShowGeofencing(!showGeofencing)}
          title="Afficher/Masquer les zones de géofencing"
          className={`bg-[#08111F]/90 border p-2 rounded-lg shadow-xl backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold ${
            showGeofencing
              ? 'text-[#10B981] border-[#10B981]/50'
              : 'text-[#8995A3] border-[#8995A3]/30 opacity-70'
          }`}
        >
          {showGeofencing ? <Eye className="w-3.5 h-3.5 text-[#10B981]" /> : <EyeOff className="w-3.5 h-3.5 text-[#8995A3]" />}
          <span className="hidden sm:inline">Zones Géofencing</span>
        </button>
      </div>

      {/* Légende Télématique Fixe en Bas à Gauche */}
      <div className="absolute bottom-3 left-3 z-20 bg-[#08111F]/90 backdrop-blur-md border border-[#8995A3]/25 p-2.5 rounded-lg text-[10px] font-mono space-y-1 shadow-2xl pointer-events-none">
        <div className="text-[#8995A3] uppercase tracking-wider font-bold mb-1">Légende Réseau Minier :</div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          <span className="text-[#F4F6F8]">En Déplacement Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF8A00]" />
          <span className="text-[#F4F6F8]">Front de Taille (Moteur Allumé)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
          <span className="text-red-400 font-bold">Alerte Excès Vitesse (&gt; 45 km/h)</span>
        </div>
      </div>
    </div>
  );
};

export default GpsMap;
