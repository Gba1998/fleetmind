import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Nettoyage de la base de données SQLite ---');
  await prisma.chatMessage.deleteMany();
  await prisma.fuelLog.deleteMany();
  await prisma.fleetDocument.deleteMany();
  await prisma.rental.deleteMany();
  await prisma.gpsTrack.deleteMany();
  await prisma.maintenanceOrder.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  console.log('--- Seeding des Tenants ---');
  const t1 = await prisma.tenant.create({
    data: {
      code: 't1',
      name: 'SOGEA-SATOM CI',
      country: "Côte d'Ivoire",
      currency: 'FCFA'
    }
  });

  const t2 = await prisma.tenant.create({
    data: {
      code: 't2',
      name: 'BOLLORÉ MINES',
      country: 'Guinée',
      currency: 'USD'
    }
  });

  const t3 = await prisma.tenant.create({
    data: {
      code: 't3',
      name: 'COLAS WEST AFRICA',
      country: 'Sénégal',
      currency: 'FCFA'
    }
  });

  console.log('--- Seeding des Utilisateurs avec Mots de Passe Hachés ---');
  const defaultHash = bcrypt.hashSync('fleetmind2026', 10);

  await prisma.user.createMany({
    data: [
      { code: 'USR-1', name: 'Sinan B.', email: 'sinan@fleetmind.io', password: defaultHash, role: 'ADM-E', site: 'Siège Principal', active: true, tenantId: t1.id },
      { code: 'USR-2', name: 'Kouadio Jean', email: 'k.jean@sogea.ci', password: defaultHash, role: 'GP', site: 'Chantier Autoroute', active: true, tenantId: t1.id },
      { code: 'USR-3', name: 'Alexandre Kouamé', email: 'a.kouame@sogea.ci', password: defaultHash, role: 'RM', site: 'Atelier Central', active: true, tenantId: t1.id },
      { code: 'USR-4', name: 'Awa Diop', email: 'a.diop@sogea.ci', password: defaultHash, role: 'RC', site: 'Base Logistique', active: true, tenantId: t1.id },
      { code: 'USR-5', name: 'Yao Marc', email: 'y.marc@sogea.ci', password: defaultHash, role: 'COND', site: 'Base San Pedro', active: true, tenantId: t1.id },
      { code: 'USR-6', name: 'Amadou Koné', email: 'contact@fleetmind-mining.com', password: defaultHash, role: 'ADM-E', site: 'Direction des Mines', active: true, tenantId: t1.id }
    ]
  });

  console.log('--- Seeding des Équipements ---');
  await prisma.equipment.createMany({
    data: [
      { id: 'EQ-101', name: '2021 Caterpillar 336D Excavatrice', type: 'ENGIN_BTP', immat: 'ENG-8821-CI', counterType: 'HOURS', counterValue: 4850, site: 'Autoroute du Nord PK18', status: 'EN_SERVICE', driver: 'Kouassi Jean', avgCons: '28.5 L/h', imageUrl: '/images/equipments/excavator.jpg', brand: 'Caterpillar', model: '336D', year: 2021, tenantId: t1.id },
      { id: 'EQ-102', name: '2020 Mercedes Actros 3340 Benne', type: 'CAMION', immat: 'AB-492-JK', counterType: 'KM', counterValue: 142500, site: 'Carrière Yopougon', status: 'EN_SERVICE', driver: 'Diallo Mamadou', avgCons: '38.2 L/100km', imageUrl: '/images/equipments/dumptruck.jpg', brand: 'Mercedes-Benz', model: 'Actros 3340', year: 2020, tenantId: t1.id },
      { id: 'EQ-103', name: '2022 Toyota Hilux 4x4 Support', type: 'VEHICULE_LEGER', immat: 'CI-3009-XX', counterType: 'KM', counterValue: 89400, site: 'Base Vie San Pedro', status: 'EN_MAINTENANCE', driver: 'Yao Marc', avgCons: '14.8 L/100km', imageUrl: '/images/equipments/pickup.jpg', brand: 'Toyota', model: 'Hilux', year: 2022, tenantId: t1.id },
      { id: 'EQ-104', name: '2019 SDMO Groupe 250kVA', type: 'GENERATEUR', immat: 'GE-2022-04', counterType: 'HOURS', counterValue: 11200, site: 'Chantier Pont Bouaflé', status: 'EN_PANNE', driver: 'Traoré Bakary', avgCons: '32.0 L/h', imageUrl: '/images/equipments/generator.jpg', brand: 'SDMO', model: '250kVA', year: 2019, tenantId: t1.id },
      { id: 'EQ-105', name: '2021 Komatsu WA380 Chargeuse', type: 'ENGIN_BTP', immat: 'ENG-5011-CI', counterType: 'HOURS', counterValue: 6200, site: 'Carrière Yopougon Ouest', status: 'EN_SERVICE', driver: 'Samba Diop', avgCons: '22.1 L/h', imageUrl: '/images/equipments/loader.jpg', brand: 'Komatsu', model: 'WA380', year: 2021, tenantId: t1.id },
      { id: 'EQ-106', name: '2023 Volvo FMX 440 Camion Malaxeur', type: 'CAMION', immat: 'CI-8812-ZZ', counterType: 'KM', counterValue: 34100, site: 'Centrale BRL Abidjan', status: 'EN_SERVICE', driver: 'Aka Norbert', avgCons: '41.0 L/100km', imageUrl: '/images/equipments/mixer.jpg', brand: 'Volvo', model: 'FMX 440', year: 2023, tenantId: t1.id }
    ]
  });

  console.log('--- Seeding des Missions / Affectations ---');
  await prisma.assignment.createMany({
    data: [
      { id: 'ASG-1', vehicleId: 'EQ-102', vehicleName: 'Mercedes Actros 3340', driver: 'Richard Hendricks', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', startHour: 6, endHour: 11, day: 'Jeu 5 Oct' },
      { id: 'ASG-2', vehicleId: 'EQ-103', vehicleName: 'Toyota Hilux 4x4', driver: 'Erlich Bachman', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', startHour: 9, endHour: 13, day: 'Jeu 5 Oct' },
      { id: 'ASG-3', vehicleId: 'EQ-103', vehicleName: 'Toyota Hilux 4x4', driver: 'Nelson Bighetti', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', startHour: 13, endHour: 17, day: 'Jeu 5 Oct' },
      { id: 'ASG-4', vehicleId: 'EQ-101', vehicleName: 'CAT 336D Excavatrice', driver: 'Monica Hall', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', startHour: 11, endHour: 15, day: 'Jeu 5 Oct' },
      { id: 'ASG-5', vehicleId: 'EQ-105', vehicleName: 'Komatsu WA380', driver: 'Jian Yang', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', startHour: 14, endHour: 18, day: 'Jeu 5 Oct' },
      { id: 'ASG-6', vehicleId: 'EQ-106', vehicleName: 'Volvo FMX 440', driver: 'Dinesh Chugtai', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40', startHour: 11, endHour: 15, day: 'Jeu 5 Oct' }
    ]
  });

  console.log('--- Seeding des Ordres de Maintenance ---');
  await prisma.maintenanceOrder.createMany({
    data: [
      { id: 'OR-2026-001', vehicleId: 'EQ-103', vehicleName: 'Toyota Hilux 4x4', type: 'CORRECTIF', title: 'Fuite liquide de frein & disques', status: 'EN_COURS', priority: 'HAUTE', cost: 350000, tech: 'Alexandre Kouamé', date: '2026-10-24' },
      { id: 'OR-2026-002', vehicleId: 'EQ-104', vehicleName: 'SDMO Groupe 250kVA', type: 'PANNE', title: 'Remplacement pompe à injection diesel', status: 'ATTENTE_PIECE', priority: 'CRITIQUE', cost: 1250000, tech: 'Lucas Diallo', date: '2026-10-26' },
      { id: 'OR-2026-003', vehicleId: 'EQ-101', vehicleName: 'CAT 336D Excavatrice', type: 'PREVENTIF', title: 'Vidange 500h + Filtres hydrauliques', status: 'TERMINE', priority: 'MOYENNE', cost: 480000, tech: 'Marie Touré', date: '2026-10-20' },
      { id: 'OR-2026-004', vehicleId: 'EQ-102', vehicleName: 'Mercedes Actros 3340', type: 'PREVENTIF', title: 'Graissage complet & Contrôle suspension', status: 'TERMINE', priority: 'BASSE', cost: 180000, tech: 'Alexandre Kouamé', date: '2026-10-18' }
    ]
  });

  console.log('--- Seeding Télématique & GPS ---');
  await prisma.gpsTrack.createMany({
    data: [
      { id: 'GPS-01', immat: 'ENG-8821-CI', name: 'CAT 336D Excavatrice', speed: 0, status: 'ARRÊT_MOTEUR_ALLUMÉ', lat: '5.3599° N', lng: '-4.0083° W', fuel: '74%', lastUpdate: 'Il y a 2 min', equipmentId: 'EQ-101' },
      { id: 'GPS-02', immat: 'AB-492-JK', name: 'Mercedes Actros 3340', speed: 68, status: 'EN_DEPLACEMENT', lat: '5.4120° N', lng: '-3.9840° W', fuel: '52%', lastUpdate: 'À l\'instant', equipmentId: 'EQ-102' },
      { id: 'GPS-03', immat: 'CI-3009-XX', name: 'Toyota Hilux 4x4', speed: 0, status: 'A_L_ATELIER', lat: '5.3100° N', lng: '-4.0320° W', fuel: '38%', lastUpdate: 'Il y a 15 min', equipmentId: 'EQ-103' },
      { id: 'GPS-04', immat: 'CI-8812-ZZ', name: 'Volvo FMX 440 Malaxeur', speed: 42, status: 'EN_DEPLACEMENT', lat: '5.3850° N', lng: '-4.0150° W', fuel: '88%', lastUpdate: 'À l\'instant', equipmentId: 'EQ-106' }
    ]
  });

  console.log('--- Seeding Contrats de Location ---');
  await prisma.rental.createMany({
    data: [
      { id: 'LOC-101', supplier: 'LOXAM West Africa', equipment: 'Nacelle Ciseau 18m Haulotte', dailyRate: 120000, totalCost: 1800000, startDate: '2026-10-01', endDate: '2026-10-15', status: 'TERMINE', tenantId: t1.id },
      { id: 'LOC-102', supplier: 'BTP Location CI', equipment: 'Compacteur Dynapac CA250', dailyRate: 250000, totalCost: 7500000, startDate: '2026-10-10', endDate: '2026-11-10', status: 'EN_COURS', tenantId: t1.id }
    ]
  });

  console.log('--- Seeding Documents & Échéances ---');
  await prisma.fleetDocument.createMany({
    data: [
      { id: 'DOC-01', vehicle: 'Toyota Hilux (CI-3009-XX)', docType: 'Assurance Flotte', docNo: 'ASS-2026-9921', expiryDate: '2026-11-05', status: 'ALERT_EXPIRING' },
      { id: 'DOC-02', vehicle: 'Mercedes Actros (AB-492-JK)', docType: 'Visite Technique', docNo: 'VT-88392-CI', expiryDate: '2026-12-20', status: 'VALID' },
      { id: 'DOC-03', vehicle: 'SDMO Groupe (GE-2022-04)', docType: 'Certificat Conformité BTP', docNo: 'CERT-2025-01', expiryDate: '2026-10-15', status: 'EXPIRED' }
    ]
  });

  console.log('--- Seeding Carburant & Pleins ---');
  await prisma.fuelLog.createMany({
    data: [
      { id: 'FL-001', date: '2026-10-27', vehicle: 'Mercedes Actros 3340', qty: '320 L', amount: 240000, station: 'TotalEnergies Treichville', driver: 'Diallo Mamadou', anomaly: false },
      { id: 'FL-002', date: '2026-10-26', vehicle: 'Toyota Hilux 4x4', qty: '85 L', amount: 63750, station: 'Shell Yopougon', driver: 'Yao Marc', anomaly: true }
    ]
  });

  console.log('--- Seeding Chat IA ---');
  await prisma.chatMessage.createMany({
    data: [
      { sender: 'ai', text: 'Bonjour Sinan. Je suis votre Assistant Flotte FleetMind. J\'ai analysé la consommation de la période : 1 anomalie surconsommation sur le Hilux (EQ-103) à investiguer.' },
      { sender: 'user', text: 'Quelle est la procédure conseillée pour l\'anomalie de surconsommation ?' },
      { sender: 'ai', text: '1. Vérifier si un changement de chauffeur ou de chantier a eu lieu.\n2. Planifier un test de pression d\'injection à l\'Atelier Central.\n3. Bloquer le dépassement de carte carburant.' }
    ]
  });

  console.log('Seeding terminé avec succès ! Base de données prête.');
}

main()
  .catch((e) => {
    console.error('Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
