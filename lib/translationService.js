// Service de traduction avec Hugging Face
class TranslationService {
  constructor() {
    this.apiUrl = 'https://api-inference.huggingface.co/models/facebook/nllb-200-distilled-600M';
    this.cache = new Map();
    
    // Codes de langues NLLB pour Hugging Face
    this.languageCodes = {
      'fr': 'fra_Latn',
      'en': 'eng_Latn', 
      'wo': 'wol_Latn' // Wolof
    };
  }

  // Générer une clé de cache
  getCacheKey(text, targetLang) {
    return `${text}_${targetLang}`;
  }

  // Traduction avec Hugging Face (gratuit)
  async translateWithHuggingFace(text, targetLang) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Pas besoin de clé API pour l'inference API gratuite
        },
        body: JSON.stringify({
          inputs: text,
          parameters: {
            src_lang: this.languageCodes['fr'], // Source français
            tgt_lang: this.languageCodes[targetLang]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const result = await response.json();
      return result[0]?.translation_text || text;
    } catch (error) {
      console.error('Erreur Hugging Face:', error);
      return this.getFallbackTranslation(text, targetLang);
    }
  }

  // Traductions de fallback (statiques)
  getFallbackTranslation(text, targetLang) {
    const fallbacks = {
      en: {
        'Bienvenue au MCN': 'Welcome to MCN',
        'Bienvenue au Musée des Civilisations Noires': 'Welcome to the Museum of Black Civilizations',
        'Musée des Civilisations Noires': 'Museum of Black Civilizations',
        'Digital Experience': 'Digital Experience',
        'Explorez le patrimoine africain à travers le digital': 'Explore African heritage through digital',
        'Découvrez l\'héritage africain dans toute sa splendeur': 'Discover African heritage in all its splendor',
        'Une expérience immersive et interactive': 'An immersive and interactive experience',
        'Voir toutes les collections': 'See all collections',
        'Des milliers d\'œuvres à découvrir': 'Thousands of works to discover',
        'Collection': 'Collection',
        'Scanner': 'Scan',
        'Accueil': 'Home',
        'Œuvres en vedette': 'Featured Artworks',
        'Voir tout': 'See all',
        'À propos du Musée': 'About the Museum',
        'Chargement des œuvres...': 'Loading artworks...',
        'Réessayer': 'Try again',
        'Aucune œuvre disponible pour le moment': 'No artwork available at the moment',
        'Le Musée des Civilisations Noires est l\'un des plus grands espaces culturels du Sénégal et d\'Afrique. Il abrite une richesse patrimoniale inestimable dédiée à la préservation et à la valorisation des civilisations africaines.': 'The Museum of Black Civilizations is one of the largest cultural spaces in Senegal and Africa. It houses invaluable heritage dedicated to preserving and promoting African civilizations.',
        'Grâce à cette plateforme digitale, nous rendons accessible notre collection au monde entier, offrant une expérience enrichie et interactive autour de nos œuvres exceptionnelles.': 'Thanks to this digital platform, we make our collection accessible to the whole world, offering an enriched and interactive experience around our exceptional works.'
      },
      wo: {
        'Bienvenue au MCN': 'Dalal ak jam ci MCN',
        'Bienvenue au Musée des Civilisations Noires': 'Dalal ak jam ci Musée yu Civilization yu Ñuul',
        'Musée des Civilisations Noires': 'Musée yu Civilization yu Ñuul',
        'Digital Experience': 'Expérience Digital',
        'Explorez le patrimoine africain à travers le digital': 'Xool patrimoine bu Afrik ci digital',
        'Découvrez l\'héritage africain dans toute sa splendeur': 'Gis héritage bu Afrik ci sa bari',
        'Une expérience immersive et interactive': 'Benn expérience immersive ak interactive',
        'Voir toutes les collections': 'Gis collection yépp',
        'Des milliers d\'œuvres à découvrir': 'Ay dubu liggéey ngir gis',
        'Collection': 'Njëkk',
        'Scanner': 'Skin',
        'Accueil': 'Kër',
        'Œuvres en vedette': 'Liggéey yu am solo',
        'Voir tout': 'Gis lépp',
        'À propos du Musée': 'Ci Musée bi',
        'Chargement des œuvres...': 'Liggéey yi dañuy yeub...',
        'Réessayer': 'Jariñ kët',
        'Aucune œuvre disponible pour le moment': 'Amul liggéey ci leegi',
        'Le Musée des Civilisations Noires est l\'un des plus grands espaces culturels du Sénégal et d\'Afrique. Il abrite une richesse patrimoniale inestimable dédiée à la préservation et à la valorisation des civilisations africaines.': 'Musée yu Civilization yu Ñuul dafa am ci espaces culturels yu mag yooyu ci Senegaal ak Afrik. Dafa am patrimoine bu bari bu ñuul ngir ñu ragal civilisation yu Afrik.',
        'Grâce à cette plateforme digitale, nous rendons accessible notre collection au monde entier, offrant une expérience enrichie et interactive autour de nos œuvres exceptionnelles.': 'Ak plateform digital bii, ñu may joxe collection yu ñu ci adduna bi lépp, di jox benn expérience bu yem ak interactive ci liggéey yu ñu yu yem.'
      }
    };

    return fallbacks[targetLang]?.[text] || text;
  }

  // Méthode principale de traduction
  async translate(text, targetLang) {
    // Si c'est déjà en français, pas besoin de traduire
    if (targetLang === 'fr') return text;

    // Vérifier le cache
    const cacheKey = this.getCacheKey(text, targetLang);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Essayer Hugging Face
    let translation;
    try {
      translation = await this.translateWithHuggingFace(text, targetLang);
    } catch (error) {
      translation = this.getFallbackTranslation(text, targetLang);
    }

    // Mettre en cache
    this.cache.set(cacheKey, translation);
    
    // Sauvegarder en localStorage
    this.saveCacheToStorage();

    return translation;
  }

  // Sauvegarder le cache en localStorage
  saveCacheToStorage() {
    try {
      const cacheData = Array.from(this.cache.entries());
      localStorage.setItem('translation_cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Impossible de sauvegarder le cache:', error);
    }
  }

  // Charger le cache depuis localStorage
  loadCacheFromStorage() {
    try {
      const stored = localStorage.getItem('translation_cache');
      if (stored) {
        const cacheData = JSON.parse(stored);
        this.cache = new Map(cacheData);
      }
    } catch (error) {
      console.warn('Impossible de charger le cache:', error);
    }
  }

  // Initialiser le service
  init() {
    this.loadCacheFromStorage();
  }
}

// Instance singleton
const translationService = new TranslationService();
translationService.init();

export default translationService;