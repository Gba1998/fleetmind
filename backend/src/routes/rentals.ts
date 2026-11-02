import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET all rentals
router.get('/', async (req, res) => {
  try {
    const { status, tenantId } = req.query;
    const where: any = {};
    if (status) where.status = String(status);
    if (tenantId) where.tenantId = String(tenantId);

    const rentals = await prisma.rental.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rentals', details: (error as Error).message });
  }
});

// CREATE rental
router.post('/', async (req, res) => {
  try {
    const { id, supplier, equipment, dailyRate, totalCost, startDate, endDate, status, tenantId } = req.body;
    if (!supplier || !equipment) {
      return res.status(400).json({ error: 'supplier and equipment are required' });
    }

    const rentId = id || `LOC-${Math.floor(100 + Math.random() * 900)}`;
    const created = await prisma.rental.create({
      data: {
        id: rentId,
        supplier,
        equipment,
        dailyRate: Number(dailyRate) || 0,
        totalCost: Number(totalCost) || 0,
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || new Date().toISOString().split('T')[0],
        status: status || 'EN_COURS',
        tenantId: tenantId || null
      }
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rental', details: (error as Error).message });
  }
});

// UPDATE rental status (close contract)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.rental.update({
      where: { id },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update rental status', details: (error as Error).message });
  }
});

export default router;
