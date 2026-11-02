import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET all documents
router.get('/', async (req, res) => {
  try {
    const { status, vehicle } = req.query;
    const where: any = {};
    if (status) where.status = String(status);
    if (vehicle) where.vehicle = String(vehicle);

    const docs = await prisma.fleetDocument.findMany({
      where,
      orderBy: { expiryDate: 'asc' }
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents', details: (error as Error).message });
  }
});

// CREATE document
router.post('/', async (req, res) => {
  try {
    const { id, vehicle, docType, docNo, expiryDate, status } = req.body;
    if (!vehicle || !docType || !docNo) {
      return res.status(400).json({ error: 'vehicle, docType, and docNo are required' });
    }

    const docId = id || `DOC-${Math.floor(100 + Math.random() * 900)}`;
    const created = await prisma.fleetDocument.create({
      data: {
        id: docId,
        vehicle,
        docType,
        docNo,
        expiryDate: expiryDate || new Date().toISOString().split('T')[0],
        status: status || 'VALID'
      }
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create document', details: (error as Error).message });
  }
});

// RENEW document
router.patch('/:id/renew', async (req, res) => {
  try {
    const { id } = req.params;
    const current = await prisma.fleetDocument.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: 'Document not found' });

    const currentYear = new Date(current.expiryDate).getFullYear() || 2026;
    const newExpiry = current.expiryDate.replace(String(currentYear), String(currentYear + 1));

    const updated = await prisma.fleetDocument.update({
      where: { id },
      data: {
        expiryDate: newExpiry,
        status: 'VALID'
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to renew document', details: (error as Error).message });
  }
});

export default router;
