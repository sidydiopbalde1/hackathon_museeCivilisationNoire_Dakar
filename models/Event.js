import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    fr: { type: String, required: true },
    en: { type: String, required: true },
    wo: { type: String, required: true },
  },
  description: {
    fr: String,
    en: String,
    wo: String,
  },
  date: {
    type: Date,
    required: true,
  },
  time: String,
  location: String,
  imageUrl: String,
  category: {
    type: String,
    enum: ['exposition', 'conference', 'atelier', 'spectacle', 'visite'],
    default: 'exposition'
  },
  price: {
    type: String,
    default: 'Gratuit'
  },
  capacity: Number,
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'past'],
    default: 'upcoming'
  }
}, {
  timestamps: true,
});

EventSchema.index({ date: 1 });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);