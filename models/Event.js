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
  startTime: String,
  endTime: String,
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
  },
  tags: [{
    type: String
  }],
  program: [{
    time: String,
    title: String,
    description: String
  }]
}, {
  timestamps: true,
});

// Index pour améliorer les performances
EventSchema.index({ date: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ status: 1 });

// Middleware pour mettre à jour automatiquement le statut
EventSchema.pre('save', function(next) {
  const now = new Date();
  const eventDate = new Date(this.date);
  
  if (eventDate < now) {
    this.status = 'past';
  } else {
    this.status = 'upcoming';
  }
  
  next();
});

export default mongoose.models.Event || mongoose.model('Event', EventSchema);