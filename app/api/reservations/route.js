import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

// Fonction pour générer un numéro de réservation unique
function generateReservationNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RES-${timestamp}-${random}`;
}

// Créer une nouvelle réservation
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      eventId, 
      firstName, 
      lastName, 
      email, 
      phone, 
      numberOfPeople,
      notes 
    } = body;

    // Validation des données
    if (!eventId || !firstName || !lastName || !email || !phone || !numberOfPeople) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }

    // Vérifier que l'événement existe
    const event = await Event.findOne({ id: eventId });
    if (!event) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier la capacité disponible
    if (event.capacity) {
      const existingReservations = await Reservation.find({ 
        eventId: eventId,
        status: { $ne: 'cancelled' }
      });
      
      const totalReserved = existingReservations.reduce(
        (sum, res) => sum + res.numberOfPeople, 
        0
      );
      
      if (totalReserved + numberOfPeople > event.capacity) {
        return NextResponse.json(
          { 
            error: 'Capacité insuffisante',
            availableSpots: event.capacity - totalReserved
          },
          { status: 400 }
        );
      }
    }

    // Créer la réservation
    const reservation = await Reservation.create({
      eventId: event.id,
      eventTitle: event.title.fr,
      eventDate: event.date,
      firstName,
      lastName,
      email,
      phone,
      numberOfPeople,
      notes,
      totalAmount: event.price,
      reservationNumber: generateReservationNumber(),
      status: 'confirmed'
    });

    // TODO: Envoyer un email de confirmation
    // await sendConfirmationEmail(reservation);

    return NextResponse.json({
      success: true,
      reservation: reservation,
      message: 'Réservation confirmée avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Récupérer les réservations
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const eventId = searchParams.get('eventId');

    let query = {};
    
    if (email) {
      query.email = email;
    }
    
    if (eventId) {
      query.eventId = eventId;
    }

    const reservations = await Reservation.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}