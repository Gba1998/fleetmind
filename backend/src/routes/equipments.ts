import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET all equipment with filters
router.get('/', async (req, res) => {
  try {
    const { status, type, site, search } = req.query;
    const where: any = {};

    if (status) where.status = String(status);
    if (type) where.type = String(type);
    if (site) where.site = { contains: String(site) };
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { immat: { contains: String(search) } },
        { driver: { contains: String(search) } }
      ];
    }

    const equipments = await prisma.equipment.findMany({
      where,
      include: {
        gpsTrack: true,
        _count: {
          select: { maintenanceOrders: true, assignments: true }
        }
      },
      orderBy: { id: 'asc' }
    });
    res.json(equipments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch equipment', details: (error as Error).message });
  }
});

// GET single equipment details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.equipment.findUnique({
      where: { id },
      include: {
        assignments: true,
        maintenanceOrders: true,
        gpsTrack: true
      }
    });
    if (!item) return res.status(404).json({ error: 'Equipment not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch equipment', details: (error as Error).message });
  }
});

// CREATE equipment
router.post('/', async (req, res) => {
  try {
    const { id, name, type, immat, counterType, counterValue, site, status, driver, avgCons, imageUrl, brand, model, year, tenantId } = req.body;
    if (!name || !immat || !counterType) {
      return res.status(400).json({ error: 'name, immat, and counterType are required' });
    }

    const eqId = id || `EQ-${Math.floor(100 + Math.random() * 900)}`;

    const created = await prisma.equipment.create({
      data: {
        id: eqId,
        name,
        type: type || 'VEHICULE_LEGER',
        immat,
        counterType,
        counterValue: Number(counterValue) || 0,
        site: site || 'Base Centrale',
        status: status || 'EN_SERVICE',
        driver: driver || null,
        avgCons: avgCons || null,
        imageUrl: imageUrl || null,
        brand: brand || null,
        model: model || null,
        year: year ? Number(year) : null,
        tenantId: tenantId || null
      }
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create equipment', details: (error as Error).message });
  }
});

// UPDATE equipment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, immat, counterType, counterValue, site, status, driver, avgCons, imageUrl, brand, model, year } = req.body;

    const updated = await prisma.equipment.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(immat && { immat }),
        ...(counterType && { counterType }),
        ...(counterValue !== undefined && { counterValue: Number(counterValue) }),
        ...(site && { site }),
        ...(status && { status }),
        ...(driver !== undefined && { driver }),
        ...(avgCons !== undefined && { avgCons }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(brand !== undefined && { brand }),
        ...(model !== undefined && { model }),
        ...(year !== undefined && { year: Number(year) })
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update equipment', details: (error as Error).message });
  }
});

// DELETE equipment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.equipment.delete({ where: { id } });
    res.json({ success: true, message: 'Equipment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete equipment', details: (error as Error).message });
  }
});

export default router;
