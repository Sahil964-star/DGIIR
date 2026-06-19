import express              from 'express';
import multer               from 'multer';
import { body, validationResult } from 'express-validator';
import { Complaint }        from '../models/Complaint.js';
import { generateComplaintId } from '../services/idService.js';
import { uploadFile }       from '../services/minioService.js';
import { v4 as uuidv4 }    from 'uuid';
import path                 from 'path';

const router = express.Router();

// ── Multer — memory storage (files go to MinIO or disk via service) ───────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max per file
  fileFilter(_req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'audio/webm', 'audio/ogg', 'audio/mp4'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

// ── Validation rules ──────────────────────────────────────────────────────────
const complaintValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be ≤ 200 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 5000 }).withMessage('Description must be ≤ 5000 characters'),
  body('lat').optional().isFloat({ min: -90,  max: 90  }).withMessage('Invalid latitude'),
  body('lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
];

// ─────────────────────────────────────────────────────────────────────────────
// POST /complaints
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'voice', maxCount: 1 },
  ]),
  complaintValidation,
  async (req, res) => {
    // Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const { title, description, lat, lng, accuracy } = req.body;

      // ── Generate unique ID ──────────────────────────────────────────────────
      const complaintId = await generateComplaintId();

      // ── Upload photo ────────────────────────────────────────────────────────
      let photoUrl = null;
      const photoFile = req.files?.photo?.[0];
      if (photoFile) {
        const ext      = path.extname(photoFile.originalname) || '.jpg';
        const filename = `${complaintId}-photo-${uuidv4()}${ext}`;
        photoUrl       = await uploadFile(photoFile.buffer, filename, photoFile.mimetype);
      }

      // ── Upload voice ────────────────────────────────────────────────────────
      let voiceUrl = null;
      const voiceFile = req.files?.voice?.[0];
      if (voiceFile) {
        const ext      = path.extname(voiceFile.originalname) || '.webm';
        const filename = `${complaintId}-voice-${uuidv4()}${ext}`;
        voiceUrl       = await uploadFile(voiceFile.buffer, filename, voiceFile.mimetype);
      }

      // ── Build location ──────────────────────────────────────────────────────
      const location =
        lat && lng
          ? {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)],
            }
          : null;

      // ── Persist to MongoDB ──────────────────────────────────────────────────
      const complaint = await Complaint.create({
        complaintId,
        title,
        description,
        photoUrl,
        voiceUrl,
        location,
      });

      return res.status(201).json({
        complaintId:  complaint.complaintId,
        status:       complaint.status,
        createdAt:    complaint.createdAt,
        message:      'Complaint submitted successfully.',
      });
    } catch (err) {
      console.error('[POST /complaints]', err);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /complaints/:id
// ─────────────────────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.id,
    }).lean();

    if (!complaint) {
      return res.status(404).json({ error: `Complaint "${req.params.id}" not found.` });
    }

    return res.json(complaint);
  } catch (err) {
    console.error('[GET /complaints/:id]', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
