import connectDB from '@/lib/mongodb';
import Reservation from '@/models/Reservation';
import { NextResponse } from 'next/server';

// Récupérer une réservation par son numéro
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { reservationNumber } = params;
    
    const reservation = await Reservation.findOne({ 
      reservationNumber: reservationNumber 
    });
    
    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Annuler une réservation
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { reservationNumber } = params;
    
    const reservation = await Reservation.findOneAndUpdate(
      { reservationNumber: reservationNumber },
      { status: 'cancelled' },
      { new: true }
    );
    
    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    // TODO: Envoyer un email de confirmation d'annulation
    // await sendCancellationEmail(reservation);

    return NextResponse.json({
      success: true,
      message: 'Réservation annulée avec succès',
      reservation
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Modifier une réservation
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { reservationNumber } = params;
    const body = await request.json();
    
    // Ne pas permettre de modifier certains champs critiques
    const allowedUpdates = ['phone', 'numberOfPeople', 'notes'];
    const updates = {};
    
    Object.keys(body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = body[key];
      }
    });
    
    const reservation = await Reservation.findOneAndUpdate(
      { reservationNumber: reservationNumber },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!reservation) {
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Réservation modifiée avec succès',
      reservation
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}