import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./fleetmind.db';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'fleetmind-secret-key-2026';
}

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

// Import Routers
import authRouter from './routes/auth.js';
import uploadRouter from './routes/upload.js';
import tenantsRouter from './routes/tenants.js';
import usersRouter from './routes/users.js';
import equipmentsRouter from './routes/equipments.js';
import maintenanceRouter from './routes/maintenance.js';
import assignmentsRouter from './routes/assignments.js';
import fuelRouter from './routes/fuel.js';
import rentalsRouter from './routes/rentals.js';
import documentsRouter from './routes/documents.js';
import gpsRouter from './routes/gps.js';
import analyticsRouter from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Serve uploaded images statically
app.use('/uploads', express.static(path.resolve('uploads')));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'FleetMind Intelligent Operations API',
    version: '1.0.0',
    mode: 'Multi-Tenant SQLite Dev',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/tenants', tenantsRouter);
app.use('/api/users', usersRouter);
app.use('/api/equipments', equipmentsRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/fuel', fuelRouter);
app.use('/api/rentals', rentalsRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/gps', gpsRouter);
app.use('/api/analytics', analyticsRouter);

// Serve frontend SPA static files if built
const candidateDistPaths = [
  path.resolve('../frontend/dist'),
  path.resolve('frontend/dist'),
  path.resolve(__dirname, '../../frontend/dist')
];
const distPath = candidateDistPaths.find(p => fs.existsSync(p));

if (distPath) {
  console.log(`📦 Serving frontend SPA static files from: ${distPath}`);
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 FleetMind API Server running on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

export default app;
