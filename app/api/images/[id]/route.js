import { NextResponse } from 'next/server';
import { getImageFromGridFS, getImageMetadata } from '@/lib/gridfsService';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de fichier requis' },
        { status: 400 }
      );
    }
    
    // Récupérer les métadonnées pour le Content-Type
    const metadata = await getImageMetadata(id);
    
    // Récupérer le fichier depuis GridFS
    const imageBuffer = await getImageFromGridFS(id);
    
    // Retourner l'image avec les bonnes headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': metadata.metadata?.contentType || 'image/jpeg',
        'Content-Length': imageBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache 1 an
        'ETag': id, // Pour le cache
      },
    });
    
  } catch (error) {
    console.error('Erreur récupération image:', error);
    
    // Si le fichier n'existe pas
    if (error.message.includes('non trouvé')) {
      return NextResponse.json(
        { error: 'Image non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'image' },
      { status: 500 }
    );
  }
}