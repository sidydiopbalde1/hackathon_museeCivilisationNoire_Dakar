import mongoose from 'mongoose';

const ArtworkSchema = new mongoose.Schema({
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
  imageUrl: String,
  audioUrl: {
    fr: String,
    en: String,
    wo: String,
  },
  period: String,
  origin: String,
  material: String,
  dimensions: String,
  qrCode: {
    type: String,
    unique: true,
  },
  location: {
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
    address: { type: String, required: false },
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  favorites: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index pour recherche
ArtworkSchema.index({ 
  'title.fr': 'text', 
  'title.en': 'text',
  'title.wo': 'text',
  origin: 'text',
  period: 'text'
});

export default mongoose.models.Artwork || mongoose.model('Artwork', ArtworkSchema);