import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET all tenants
router.get('/', async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        _count: {
          select: { users: true, equipments: true, rentals: true }
        }
      }
    });
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenants', details: (error as Error).message });
  }
});

// GET single tenant by id or code
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await prisma.tenant.findFirst({
      where: {
        OR: [{ id }, { code: id }]
      },
      include: {
        users: true,
        equipments: true,
        rentals: true
      }
    });
    if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tenant', details: (error as Error).message });
  }
});

// CREATE tenant
router.post('/', async (req, res) => {
  try {
    const { code, name, country, currency } = req.body;
    if (!code || !name || !country) {
      return res.status(400).json({ error: 'code, name, and country are required' });
    }
    const tenant = await prisma.tenant.create({
      data: { code, name, country, currency: currency || 'FCFA' }
    });
    res.status(201).json(tenant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tenant', details: (error as Error).message });
  }
});

export default router;
