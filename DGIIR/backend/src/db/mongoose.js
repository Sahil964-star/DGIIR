import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/dgiir';

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log(`[MongoDB] Connected → ${uri}`);
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err.message);
    process.exit(1);
  }
}
