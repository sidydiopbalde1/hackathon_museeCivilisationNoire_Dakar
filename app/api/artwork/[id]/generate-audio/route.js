import audioGenerationService from '@/lib/audioGenerationService';
import connectDB from '@/lib/mongodb';
import Artwork from '@/models/Artwork';
import artworksData from '@/data/artworks.json';
import { NextResponse } from 'next/server';

export async function POST(request, context) {
  try {
    const params = await context.params;
    const { languages = ['fr', 'en', 'wo'], provider = 'auto' } = await request.json();

    // Récupérer l'œuvre
    let artwork;
    try {
      await connectDB();
      artwork = await Artwork.findOne({ id: params.id });
    } catch (dbError) {
      console.log('Erreur DB, utilisation des données statiques');
    }

    if (!artwork) {
      artwork = artworksData.find(art => art.id === params.id);
    }

    if (!artwork) {
      return NextResponse.json(
        { error: 'Œuvre non trouvée' },
        { status: 404 }
      );
    }

    console.log(`Génération audio pour l'œuvre ${artwork.id}...`);

    // Générer les audios pour toutes les langues demandées
    const audioResults = {};
    
    for (const lang of languages) {
      try {
        let description = artwork.description?.[lang] || artwork.description?.fr;
        
        if (!description) {
          console.log(`Pas de description disponible pour ${lang}`);
          continue;
        }

        // Si ce n'est pas le français et qu'on n'a pas la traduction, utiliser le service de traduction
        if (lang !== 'fr' && !artwork.description?.[lang]) {
          const translationService = (await import('@/lib/translationService')).default;
          description = await translationService.translate(description, lang);
        }

        console.log(`Génération audio ${lang}...`);
        const audio = await audioGenerationService.generateAudio(description, lang, provider);
        
        // Calculer durée approximative
        const wordsPerMinute = lang === 'en' ? 160 : 140;
        const wordCount = description.split(' ').length;
        const duration = Math.ceil((wordCount / wordsPerMinute) * 60);

        audioResults[lang] = {
          success: true,
          audioUrl: audio.url || null,
          type: audio.type,
          duration: duration,
          description: description,
          wordCount: wordCount
        };

      } catch (error) {
        console.error(`Erreur génération audio ${lang}:`, error);
        audioResults[lang] = {
          success: false,
          error: error.message
        };
      }
    }

    // Optionnel: Sauvegarder les URLs dans la base de données
    try {
      if (artwork._id) {
        const audioUrls = {};
        Object.keys(audioResults).forEach(lang => {
          if (audioResults[lang].success && audioResults[lang].audioUrl) {
            audioUrls[lang] = audioResults[lang].audioUrl;
          }
        });

        await Artwork.findByIdAndUpdate(artwork._id, {
          $set: { 
            'audioUrl': audioUrls,
            'audioGenerated': new Date()
          }
        });
      }
    } catch (saveError) {
      console.log('Erreur sauvegarde URLs audio:', saveError);
    }

    return NextResponse.json({
      success: true,
      artworkId: artwork.id,
      audioResults: audioResults,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message 
      },
      { status: 500 }
    );
  }
}