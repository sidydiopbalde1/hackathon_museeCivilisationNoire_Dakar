import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Artwork from '@/models/Artwork';

// GET - Récupérer une œuvre par ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // Essayer d'abord par le champ 'id' custom, puis par _id si c'est un ObjectId valide
    let artwork = await Artwork.findOne({ id: id });
    
    if (!artwork && id.match(/^[0-9a-fA-F]{24}$/)) {
      artwork = await Artwork.findById(id);
    }

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

// PUT - Modifier une œuvre
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();
    
    // Essayer d'abord par le champ 'id' custom, puis par _id si c'est un ObjectId valide
    let updatedArtwork = await Artwork.findOneAndUpdate(
      { id: id },
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedArtwork && id.match(/^[0-9a-fA-F]{24}$/)) {
      updatedArtwork = await Artwork.findByIdAndUpdate(
        id,
        body,
        { new: true, runValidators: true }
      );
    }

    if (!updatedArtwork) {
      return NextResponse.json(
        { error: 'Œuvre non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedArtwork);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Supprimer une œuvre
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    
    // Essayer d'abord par le champ 'id' custom, puis par _id si c'est un ObjectId valide
    let deletedArtwork = await Artwork.findOneAndDelete({ id: id });
    
    if (!deletedArtwork && id.match(/^[0-9a-fA-F]{24}$/)) {
      deletedArtwork = await Artwork.findByIdAndDelete(id);
    }

    if (!deletedArtwork) {
      return NextResponse.json(
        { error: 'Œuvre non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Œuvre supprimée avec succès',
      deletedArtwork 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}