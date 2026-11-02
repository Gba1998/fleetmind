import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET all fuel logs
router.get('/', async (req, res) => {
  try {
    const { vehicle, anomaly } = req.query;
    const where: any = {};
    if (vehicle) where.vehicle = String(vehicle);
    if (anomaly !== undefined) where.anomaly = anomaly === 'true';

    const logs = await prisma.fuelLog.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fuel logs', details: (error as Error).message });
  }
});

// CREATE fuel log
router.post('/', async (req, res) => {
  try {
    const { id, date, vehicle, qty, amount, station, driver, anomaly } = req.body;
    if (!vehicle || !qty || !amount) {
      return res.status(400).json({ error: 'vehicle, qty, and amount are required' });
    }

    const logId = id || `PL-${Math.floor(100 + Math.random() * 900)}`;
    const created = await prisma.fuelLog.create({
      data: {
        id: logId,
        date: date || new Date().toISOString().split('T')[0],
        vehicle,
        qty: String(qty),
        amount: Number(amount) || 0,
        station: station || 'Station Chantier',
        driver: driver || 'Non assigné',
        anomaly: Boolean(anomaly)
      }
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create fuel log', details: (error as Error).message });
  }
});

// DELETE fuel log
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.fuelLog.delete({ where: { id } });
    res.json({ success: true, message: 'Fuel log deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete fuel log', details: (error as Error).message });
  }
});

export default router;
