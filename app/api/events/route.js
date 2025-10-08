import connectDB from '@/lib/mongodb';
import Event from '@/models/Event';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit')) || 50;

    let query = {};

    if (search) {
      query.$or = [
        { 'title.fr': { $regex: search, $options: 'i' } },
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.wo': { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    // Si aucun filtre de statut, récupérer tous les événements
    if (!status) {
      // Ne pas filtrer par date pour permettre l'affichage de tous les événements
    } else if (status === 'upcoming') {
      query.date = { $gte: new Date() };
    } else if (status === 'past') {
      query.date = { $lt: new Date() };
    }

    const events = await Event.find(query)
      .sort({ date: -1 })
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
    
    // Générer un ID unique
    let id;
    let isUnique = false;
    let counter = await Event.countDocuments() + 1;
    
    while (!isUnique) {
      id = `EVT${String(counter).padStart(3, '0')}`;
      const existingEvent = await Event.findOne({ id });
      if (!existingEvent) {
        isUnique = true;
      } else {
        counter++;
      }
    }
    
    const eventData = {
      id,
      ...body
    };
    
    const event = await Event.create(eventData);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}