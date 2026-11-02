import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    cb(null, `equipment-${Date.now()}-${cleanName}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext) || allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format de fichier non supporté. Veuillez envoyer une image (JPG, PNG, WebP).'));
    }
  }
});

// POST /api/upload
router.post('/', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier reçu' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du téléversement', details: (error as Error).message });
  }
});

export default router;
