import connectDB from '@/lib/mongodb';
import Artwork from '@/models/Artwork';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const artwork = await Artwork.findOne({ id: params.id });

    if (!artwork) {
      return NextResponse.json(
        { error: 'Œuvre non trouvée' },
        { status: 404 }
      );
    }

    // Incrémenter le compteur de vues
    artwork.viewCount += 1;
    await artwork.save();

    return NextResponse.json(artwork);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

    const body = await request.json();
    const artwork = await Artwork.findOneAndUpdate(
      { id: params.id },
      body,
      { new: true, runValidators: true }
    );

    if (!artwork) {
      return NextResponse.json(
        { error: 'Œuvre non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(artwork);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}