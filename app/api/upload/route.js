import { NextResponse } from 'next/server';
import { uploadImageToGridFS } from '@/lib/gridfsService';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }
    
    // Validation du type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Utilisez JPG, PNG ou WebP' },
        { status: 400 }
      );
    }
    
    // Validation de la taille (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Maximum 10MB' },
        { status: 400 }
      );
    }
    
    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const filename = `artwork_${timestamp}.${fileExtension}`;
    
    // Upload vers GridFS
    const uploadResult = await uploadImageToGridFS(file, filename);
    
    return NextResponse.json({
      success: true,
      fileId: uploadResult.fileId,
      filename: uploadResult.filename,
      contentType: uploadResult.contentType,
      size: uploadResult.size,
      imageUrl: `/api/images/${uploadResult.fileId}`
    });
    
  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}