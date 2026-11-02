import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';

const router = Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const { tenantId, role } = req.query;
    const where: any = {};
    if (tenantId) where.tenantId = String(tenantId);
    if (role) where.role = String(role);

    const users = await prisma.user.findMany({
      where,
      include: { tenant: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: (error as Error).message });
  }
});

// CREATE user
router.post('/', async (req, res) => {
  try {
    const { name, email, role, site, tenantId, code, password } = req.body;
    if (!name || !email || !role || !site) {
      return res.status(400).json({ error: 'name, email, role, and site are required' });
    }
    const cleanEmail = email.toLowerCase().trim();
    const hashedPassword = bcrypt.hashSync(password?.trim() || 'fleetmind2026', 10);

    const user = await prisma.user.create({
      data: {
        code: code || `USR-${Date.now().toString().slice(-4)}`,
        name,
        email: cleanEmail,
        password: hashedPassword,
        role,
        site,
        tenantId: tenantId || null,
        active: true
      }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user', details: (error as Error).message });
  }
});

// TOGGLE active status
router.patch('/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'User not found' });

    const updated = await prisma.user.update({
      where: { id },
      data: { active: !existing.active }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle status', details: (error as Error).message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: (error as Error).message });
  }
});

export default router;
