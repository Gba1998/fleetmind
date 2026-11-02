import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET all GPS vehicle tracks
router.get('/', async (req, res) => {
  try {
    const tracks = await prisma.gpsTrack.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(tracks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GPS tracks', details: (error as Error).message });
  }
});

// UPDATE GPS position/speed (Simulate Ping)
router.post('/ping', async (req, res) => {
  try {
    const tracks = await prisma.gpsTrack.findMany();
    const updatedTracks = await Promise.all(
      tracks.map(async (t) => {
        const speedDelta = Math.floor(Math.random() * 10) - 5;
        const newSpeed = Math.max(0, Math.min(48, Math.round(t.speed + speedDelta)));
        return prisma.gpsTrack.update({
          where: { id: t.id },
          data: {
            speed: newSpeed,
            lastUpdate: 'À l\'instant (Télématique CAN-Bus)'
          }
        });
      })
    );
    res.json({ success: true, tracks: updatedTracks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to simulate GPS ping', details: (error as Error).message });
  }
});

// INGEST External Telematics Frame (Webhook endpoint)
router.post('/telematics', async (req, res) => {
  try {
    const { immat, lat, lng, speed, fuel, status, lastUpdate } = req.body;
    if (!immat) {
      return res.status(400).json({ error: 'immat is required' });
    }

    const existing = await prisma.gpsTrack.findFirst({ where: { immat } });
    if (existing) {
      const updated = await prisma.gpsTrack.update({
        where: { id: existing.id },
        data: {
          lat: lat !== undefined ? String(lat) : existing.lat,
          lng: lng !== undefined ? String(lng) : existing.lng,
          speed: speed !== undefined ? Number(speed) : existing.speed,
          fuel: fuel !== undefined ? String(fuel) : existing.fuel,
          status: status || existing.status,
          lastUpdate: lastUpdate || 'À l\'instant (Ingestion Webhook)'
        }
      });
      return res.json({ success: true, track: updated });
    }

    res.status(404).json({ error: `Balise non trouvée pour l'immatriculation ${immat}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process telematics frame', details: (error as Error).message });
  }
});

export default router;
