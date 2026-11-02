import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET all maintenance orders
router.get('/', async (req, res) => {
  try {
    const { status, vehicleId, priority } = req.query;
    const where: any = {};
    if (status) where.status = String(status);
    if (vehicleId) where.vehicleId = String(vehicleId);
    if (priority) where.priority = String(priority);

    const orders = await prisma.maintenanceOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch maintenance orders', details: (error as Error).message });
  }
});

// CREATE maintenance order
router.post('/', async (req, res) => {
  try {
    const { vehicleId, vehicleName, type, title, priority, cost, tech, date } = req.body;
    if (!vehicleId || !title) {
      return res.status(400).json({ error: 'vehicleId and title are required' });
    }

    const orderId = `OR-2026-${Math.floor(100 + Math.random() * 900)}`;
    const created = await prisma.maintenanceOrder.create({
      data: {
        id: orderId,
        vehicleId,
        vehicleName: vehicleName || vehicleId,
        type: type || 'CORRECTIF',
        title,
        status: 'EN_COURS',
        priority: priority || 'MOYENNE',
        cost: Number(cost) || 0,
        tech: tech || 'Atelier Central',
        date: date || new Date().toISOString().split('T')[0]
      }
    });

    // Also update equipment status to EN_MAINTENANCE if it's currently EN_SERVICE
    await prisma.equipment.updateMany({
      where: { id: vehicleId, status: 'EN_SERVICE' },
      data: { status: 'EN_MAINTENANCE' }
    });

    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create maintenance order', details: (error as Error).message });
  }
});

// PATCH status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const updated = await prisma.maintenanceOrder.update({
      where: { id },
      data: { status }
    });

    // If marked TERMINE, check if equipment can be restored to EN_SERVICE
    if (status === 'TERMINE') {
      const activePending = await prisma.maintenanceOrder.count({
        where: { vehicleId: updated.vehicleId, status: { in: ['EN_COURS', 'ATTENTE_PIECE'] } }
      });
      if (activePending === 0) {
        await prisma.equipment.update({
          where: { id: updated.vehicleId },
          data: { status: 'EN_SERVICE' }
        });
      }
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update maintenance order', details: (error as Error).message });
  }
});

// DELETE maintenance order
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.maintenanceOrder.delete({ where: { id } });
    res.json({ success: true, message: 'Maintenance order deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete maintenance order', details: (error as Error).message });
  }
});

export default router;
