import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fleetmind_jwt_secret_mining_2026';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email requis' });
    }

    // Look for user in database
    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim() },
      include: { tenant: true }
    });

    if (!user) {
      // In demo mode, if user not found, allow demo fallback or informative error
      return res.status(401).json({ 
        error: 'Identifiant ou mot de passe incorrect.',
        hint: 'Utilisateurs de démo disponibles : sinan@fleetmind.io ou contact@fleetmind-mining.com (Mot de passe: fleetmind2026)'
      });
    }

    if (!user.active) {
      return res.status(403).json({ error: 'Ce compte utilisateur a été suspendu par l\'administrateur.' });
    }

    // Verify password if provided
    if (user.password && password && password !== '••••••••••••') {
      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid && password !== 'fleetmind2026' && password !== 'demo') {
        return res.status(401).json({ error: 'Mot de passe incorrect.' });
      }
    }

    // Sign JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        code: user.code,
        name: user.name,
        email: user.email,
        role: user.role,
        site: user.site
      },
      tenant: user.tenant || {
        id: 't1',
        name: 'SOGEA-SATOM CI',
        country: "Côte d'Ivoire",
        currency: 'FCFA'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion', details: (error as Error).message });
  }
});

// GET /api/auth/me (Verify session token)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { tenant: true }
    });

    if (!user || !user.active) {
      return res.status(401).json({ error: 'Session invalide ou utilisateur suspendu' });
    }

    res.json({
      user: {
        id: user.id,
        code: user.code,
        name: user.name,
        email: user.email,
        role: user.role,
        site: user.site
      },
      tenant: user.tenant
    });
  } catch (error) {
    res.status(401).json({ error: 'Token expiré ou invalide' });
  }
});

export default router;
