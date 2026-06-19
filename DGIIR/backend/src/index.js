import 'dotenv/config';
import express   from 'express';
import cors      from 'cors';
import path      from 'path';
import { fileURLToPath } from 'url';

import { connectDB }      from './db/mongoose.js';
import complaintsRouter   from './routes/complaints.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app  = express();
const PORT = process.env.PORT || 3001;

// ── CORS — scoped to the Vite dev server ──────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (e.g. curl, Postman, same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin "${origin}" not allowed`));
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve local uploads (MinIO fallback files) ────────────────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(uploadsDir));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/complaints', complaintsRouter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Unhandled]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error.' });
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────
await connectDB();

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
});
