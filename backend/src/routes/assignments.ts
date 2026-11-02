import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET all assignments
router.get('/', async (req, res) => {
  try {
    const { vehicleId, driver, day } = req.query;
    const where: any = {};
    if (vehicleId) where.vehicleId = String(vehicleId);
    if (driver) where.driver = { contains: String(driver) };
    if (day) where.day = String(day);

    const assignments = await prisma.assignment.findMany({
      where,
      orderBy: { startHour: 'asc' }
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments', details: (error as Error).message });
  }
});

// CREATE assignment
router.post('/', async (req, res) => {
  try {
    const { vehicleId, vehicleName, driver, color, startHour, endHour, day } = req.body;
    if (!vehicleId || !driver || startHour === undefined || endHour === undefined) {
      return res.status(400).json({ error: 'vehicleId, driver, startHour and endHour are required' });
    }

    const created = await prisma.assignment.create({
      data: {
        id: `ASG-${Date.now().toString().slice(-4)}`,
        vehicleId,
        vehicleName: vehicleName || vehicleId,
        driver,
        color: color || 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        startHour: Number(startHour),
        endHour: Number(endHour),
        day: day || 'Aujourd\'hui'
      }
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create assignment', details: (error as Error).message });
  }
});

// DELETE assignment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.assignment.delete({ where: { id } });
    res.json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assignment', details: (error as Error).message });
  }
});

export default router;
