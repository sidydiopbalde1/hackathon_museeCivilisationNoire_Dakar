import connectDB from '@/lib/mongodb';
import Artwork from '@/models/Artwork';
import { NextResponse } from 'next/server';
import artworksData from '@/data/artworks.json';

export async function GET(request, context) {
  try {
    // Await params avant de l'utiliser (Next.js 15+)
    const params = await context.params;
    
    // D'abord essayer de récupérer depuis la base de données
    try {
      await connectDB();
      const artwork = await Artwork.findOne({ id: params.id });
      
      if (artwork) {
        // Incrémenter le compteur de vues
        artwork.viewCount += 1;
        await artwork.save();
        return NextResponse.json(artwork);
      }
    } catch (dbError) {
      console.log('Erreur DB, utilisation des données statiques:', dbError.message);
    }

    // Fallback: utiliser les données statiques du fichier JSON
    const staticArtwork = artworksData.find(artwork => artwork.id === params.id);
    
    if (!staticArtwork) {
      return NextResponse.json(
        { error: 'Œuvre non trouvée' },
        { status: 404 }
      );
    }

    console.log('Artwork trouvée dans les données statiques:', staticArtwork);
    return NextResponse.json(staticArtwork);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    await connectDB();

    const params = await context.params;
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
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    await connectDB();

    const params = await context.params;
    const artwork = await Artwork.findOneAndDelete({ id: params.id });

    if (!artwork) {
      return NextResponse.json(
        { error: 'Œuvre non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Œuvre supprimée avec succès' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}