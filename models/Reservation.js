import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    ref: 'Event'
  },
  eventTitle: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  // Informations du visiteur
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 1
  },
  // Statut de la réservation
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  // Numéro de réservation unique
  reservationNumber: {
    type: String,
    required: true,
    unique: true
  },
  // Notes ou demandes spéciales
  notes: {
    type: String,
    trim: true
  },
  // Montant total
  totalAmount: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
ReservationSchema.index({ eventId: 1 });
ReservationSchema.index({ email: 1 });
ReservationSchema.index({ reservationNumber: 1 });
ReservationSchema.index({ createdAt: -1 });

export default mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);