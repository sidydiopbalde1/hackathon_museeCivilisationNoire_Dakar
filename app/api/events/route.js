import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 10;

    let query = {};
    
    // Filtrer par statut si spécifié
    if (status) {
      query.status = status;
    }

    // Récupérer uniquement les événements futurs par défaut
    if (!status || status === 'upcoming') {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .sort({ date: 1 })
      .limit(limit);

    return NextResponse.json(events);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const event = await Event.create(body);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}