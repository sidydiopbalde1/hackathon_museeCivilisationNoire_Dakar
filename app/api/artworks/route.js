import connectDB from '@/lib/mongodb';
import Artwork from '@/models/Artwork';
import { NextResponse } from 'next/server';

// GET - Récupérer toutes les œuvres
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const origin = searchParams.get('origin');

    let query = {};

    if (search) {
      query.$or = [
        { 'title.fr': { $regex: search, $options: 'i' } },
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.wo': { $regex: search, $options: 'i' } },
        { origin: { $regex: search, $options: 'i' } },
        { period: { $regex: search, $options: 'i' } },
      ];
    }

    if (origin) {
      query.origin = origin;
    }

    const artworks = await Artwork.find(query).sort({ createdAt: -1 });

    return NextResponse.json(artworks);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Créer une nouvelle œuvre
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const artwork = await Artwork.create(body);

    return NextResponse.json(artwork, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}