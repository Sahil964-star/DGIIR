import mongoose from 'mongoose';

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type:     String,
      unique:   true,
      required: true,
      index:    true,
    },
    title:       { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    photoUrl:    { type: String, default: null },
    voiceUrl:    { type: String, default: null },
    location:    { type: pointSchema, default: null },
    status:      {
      type:    String,
      enum:    ['pending', 'in_review', 'resolved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

complaintSchema.index({ location: '2dsphere' });

export const Complaint = mongoose.model('Complaint', complaintSchema);
