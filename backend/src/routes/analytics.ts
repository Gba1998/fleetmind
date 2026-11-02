import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET all chat messages
router.get('/chat', async (req, res) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat messages', details: (error as Error).message });
  }
});

// POST chat message (with AI auto-reply)
router.post('/chat', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required' });

    // Save user message
    const userMsg = await prisma.chatMessage.create({
      data: {
        sender: 'user',
        text
      }
    });

    // Generate intelligent contextual response
    let reply = "J'analyse les données télématiques de la flotte pour répondre précisément à votre requête.";
    const lower = text.toLowerCase();

    if (lower.includes('carburant') || lower.includes('conso')) {
      reply = "Analyse Carburant : Surconsommation anormale de +28% détectée sur le Hilux (EQ-103) au PK18. Recommandation : contrôle d'étanchéité du circuit et calibrage du débitmètre.";
    } else if (lower.includes('maintenance') || lower.includes('panne')) {
      reply = "Audit Maintenance : 1 panne critique en cours sur le Groupe SDMO (EQ-104) et 1 ordre de travail préventif terminé. Disponibilité actuelle de la flotte : 83.3%.";
    } else if (lower.includes('cout') || lower.includes('dépense') || lower.includes('budget')) {
      reply = "Synthèse Budgétaire TCO : Le poste Carburant représente 58% des dépenses totales, suivi de la Maintenance (24%) et des Locations externes (18%).";
    } else if (lower.includes('bonjour') || lower.includes('salut')) {
      reply = "Bonjour ! Je suis Aimy, votre assistant d'exploitation minière et BTP. Comment puis-je vous aider aujourd'hui ?";
    }

    const aiMsg = await prisma.chatMessage.create({
      data: {
        sender: 'ai',
        text: reply
      }
    });

    res.status(201).json({ userMessage: userMsg, aiMessage: aiMsg });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process chat message', details: (error as Error).message });
  }
});

export default router;
