// Service de génération audio avec text-to-speech
class AudioGenerationService {
  constructor() {
    // Configuration des APIs TTS disponibles
    this.apis = {
      elevenlabs: {
        url: 'https://api.elevenlabs.io/v1/text-to-speech',
        voiceIds: {
          fr: 'pNInz6obpgDQGcFmaJgB', // Voix française
          en: 'ErXwobaYiN019PkySvjV', // Voix anglaise
          wo: 'pNInz6obpgDQGcFmaJgB'  // Fallback français pour wolof
        }
      },
      openai: {
        url: 'https://api.openai.com/v1/audio/speech',
        voices: {
          fr: 'alloy',
          en: 'nova', 
          wo: 'alloy'
        }
      }
    };
    
    this.cache = new Map();
  }

  // Générer clé de cache
  getCacheKey(text, language, voice) {
    return `${text.substring(0, 50)}_${language}_${voice}`;
  }

  // ElevenLabs TTS (10k caractères gratuits/mois)
  async generateWithElevenLabs(text, language) {
    try {
      const voiceId = this.apis.elevenlabs.voiceIds[language];
      
      const response = await fetch(`${this.apis.elevenlabs.url}/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || ''
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Erreur ElevenLabs:', error);
      throw error;
    }
  }

  // OpenAI TTS 
  async generateWithOpenAI(text, language) {
    try {
      const voice = this.apis.openai.voices[language];
      
      const response = await fetch(this.apis.openai.url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice,
          response_format: 'mp3'
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Erreur OpenAI:', error);
      throw error;
    }
  }

  // Web Speech API (navigateur, gratuit mais limité)
  async generateWithWebSpeech(text, language) {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Web Speech API non supportée'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configuration de la voix selon la langue
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(language === 'wo' ? 'fr' : language));
      if (voice) utterance.voice = voice;
      
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => resolve('audio généré');
      utterance.onerror = (e) => reject(e);

      speechSynthesis.speak(utterance);
    });
  }

  // Méthode principale de génération
  async generateAudio(text, language = 'fr', provider = 'auto') {
    try {
      // Vérifier le cache
      const cacheKey = this.getCacheKey(text, language, provider);
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      let audioBuffer;

      // Essayer les providers dans l'ordre de préférence
      if (provider === 'auto' || provider === 'elevenlabs') {
        try {
          audioBuffer = await this.generateWithElevenLabs(text, language);
        } catch (error) {
          console.log('ElevenLabs échoué, essai OpenAI...');
        }
      }

      if (!audioBuffer && (provider === 'auto' || provider === 'openai')) {
        try {
          audioBuffer = await this.generateWithOpenAI(text, language);
        } catch (error) {
          console.log('OpenAI échoué, essai Web Speech...');
        }
      }

      if (!audioBuffer && (provider === 'auto' || provider === 'webspeech')) {
        // Web Speech API comme fallback (pour démo)
        await this.generateWithWebSpeech(text, language);
        return { type: 'webspeech', text, language };
      }

      if (!audioBuffer) {
        throw new Error('Tous les providers TTS ont échoué');
      }

      // Convertir en Blob et créer URL
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);

      const result = { type: 'audio', url, blob };
      
      // Mettre en cache
      this.cache.set(cacheKey, result);
      
      return result;

    } catch (error) {
      console.error('Erreur génération audio:', error);
      throw error;
    }
  }

  // Générer audio pour toutes les langues d'une œuvre
  async generateArtworkAudio(artwork) {
    const results = {};
    const languages = ['fr', 'en', 'wo'];

    for (const lang of languages) {
      try {
        let description = artwork.description?.[lang];
        
        // Si pas de description dans cette langue, utiliser la traduction
        if (!description && lang !== 'fr') {
          const { translate } = await import('./translationService.js');
          description = await translate(artwork.description?.fr || '', lang);
        }

        if (description) {
          console.log(`Génération audio ${lang} pour ${artwork.title?.fr}...`);
          const audio = await this.generateAudio(description, lang);
          results[lang] = audio;
          
          // Calculer durée approximative (basé sur vitesse de lecture moyenne)
          const wordsPerMinute = lang === 'en' ? 160 : 140; // Anglais plus rapide
          const wordCount = description.split(' ').length;
          const duration = Math.ceil((wordCount / wordsPerMinute) * 60); // en secondes
          
          results[lang].duration = duration;
          results[lang].description = description;
        }
      } catch (error) {
        console.error(`Erreur génération audio ${lang}:`, error);
        results[lang] = { error: error.message };
      }
    }

    return results;
  }

  // Sauvegarder les audios générés (optionnel, pour éviter de regénérer)
  async saveAudioFiles(artworkId, audioResults) {
    try {
      // Ici vous pourriez sauvegarder sur Firebase Storage, S3, etc.
      const savedUrls = {};
      
      for (const [lang, audio] of Object.entries(audioResults)) {
        if (audio.blob) {
          // Simuler la sauvegarde (remplacer par vraie logique)
          savedUrls[lang] = `/audio/${artworkId}_${lang}.mp3`;
        }
      }
      
      return savedUrls;
    } catch (error) {
      console.error('Erreur sauvegarde audio:', error);
      return {};
    }
  }
}

// Instance singleton
const audioGenerationService = new AudioGenerationService();

export default audioGenerationService;