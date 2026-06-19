import mongoose from 'mongoose';

// ── Counter document schema ──────────────────────────────────────────────────
const counterSchema = new mongoose.Schema({
  _id:  { type: String, required: true },   // e.g. "DEL-2026"
  seq:  { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

/**
 * Generates the next complaint ID in the format DEL-YYYY-NNNN.
 * Uses findOneAndUpdate with $inc for atomic, collision-free increments.
 */
export async function generateComplaintId() {
  const year   = new Date().getFullYear();
  const key    = `DEL-${year}`;

  const counter = await Counter.findOneAndUpdate(
    { _id: key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(4, '0');
  return `DEL-${year}-${padded}`;
}
