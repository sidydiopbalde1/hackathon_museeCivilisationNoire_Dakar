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
        'Grâce à cette plateforme digitale, nous rendons accessible notre collection au monde entier, offrant une expérience enrichie et interactive autour de nos œuvres exceptionnelles.': 'Thanks to this digital platform, we make our collection accessible to the whole world, offering an enriched and interactive experience around our exceptional works.',
        'Vue 2D': '2D View',
        'Vue 3D': '3D View',
        'Chargement de la vue 3D...': 'Loading 3D view...',
        'Cliquez et glissez pour explorer en 3D': 'Click and drag to explore in 3D',
        'Image haute qualité de l\'œuvre': 'High quality artwork image',
        '🖱️ Clic + glisser pour tourner': '🖱️ Click + drag to rotate',
        '🔄 Molette pour zoomer': '🔄 Scroll to zoom',
        '🖱️ Survolez pour interagir': '🖱️ Hover to interact',
        '🎮 Rotation automatique': '🎮 Auto rotation',
        'Retour': 'Back',
        'Période': 'Period',
        'Origine': 'Origin',
        'Matériau': 'Material',
        'Dimensions': 'Dimensions',
        'Informations': 'Information',
        'Volume': 'Volume',
        'Vitesse': 'Speed',
        'Description audio': 'Audio description',
        'Génération en cours...': 'Generating...',
        'Erreur': 'Error',
        'Cliquez sur play pour écouter la description': 'Click play to listen to the description',
        'Audio généré automatiquement': 'Audio automatically generated',
        'Œuvre non trouvée': 'Artwork not found',
        'Erreur:': 'Error:',
        'au Musée des Civilisations Noires': 'at the Museum of Black Civilizations',
        'Découvrez': 'Discover',
        'Partage annulé': 'Share cancelled',
        'Lien copié dans le presse-papier !': 'Link copied to clipboard!',
        'Chargement de l\'œuvre...': 'Loading artwork...',
        'Retour à l\'accueil': 'Back to home',
        'À propos de cette œuvre': 'About this artwork',
        'Partager cette œuvre': 'Share this artwork',
        'Copier le lien': 'Copy link',
        'Lien de la page': 'Page link',
        'Connexion': 'Login',
        'Accédez à votre espace personnel': 'Access your personal space',
        'Adresse email': 'Email address',
        'votre@email.com': 'your@email.com',
        'Mot de passe': 'Password',
        'Votre mot de passe': 'Your password',
        'Se souvenir de moi': 'Remember me',
        'Mot de passe oublié ?': 'Forgot password?',
        'Se connecter': 'Sign in',
        'Connexion en cours...': 'Logging in...',
        'Connexion réussie !': 'Login successful!',
        'Pas encore de compte ?': 'Don\'t have an account?',
        'Créer un compte': 'Create account',
        'Rejoignez notre communauté': 'Join our community',
        'Créez votre compte pour accéder à toutes nos fonctionnalités': 'Create your account to access all our features',
        'Une expérience personnalisée vous attend': 'A personalized experience awaits you',
        'Rejoignez-nous pour une expérience complète': 'Join us for a complete experience',
        'Prénom': 'First name',
        'Votre prénom': 'Your first name',
        'Nom': 'Last name',
        'Votre nom': 'Your last name',
        'Téléphone': 'Phone',
        'optionnel': 'optional',
        '+221 XX XXX XX XX': '+221 XX XXX XX XX',
        'Minimum 8 caractères': 'Minimum 8 characters',
        'Confirmer le mot de passe': 'Confirm password',
        'Répétez votre mot de passe': 'Repeat your password',
        'Les mots de passe ne correspondent pas': 'Passwords do not match',
        'J\'accepte les': 'I accept the',
        'conditions d\'utilisation': 'terms of service',
        'et la': 'and the',
        'politique de confidentialité': 'privacy policy',
        'Créer mon compte': 'Create my account',
        'Création en cours...': 'Creating account...',
        'Compte créé avec succès !': 'Account created successfully!',
        'Déjà un compte ?': 'Already have an account?'
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
        'Grâce à cette plateforme digitale, nous rendons accessible notre collection au monde entier, offrant une expérience enrichie et interactive autour de nos œuvres exceptionnelles.': 'Ak plateform digital bii, ñu may joxe collection yu ñu ci adduna bi lépp, di jox benn expérience bu yem ak interactive ci liggéey yu ñu yu yem.',
        'Vue 2D': 'Gis 2D',
        'Vue 3D': 'Gis 3D', 
        'Chargement de la vue 3D...': 'Gis 3D dañuy yeub...',
        'Cliquez et glissez pour explorer en 3D': 'Cuuti te ngis ngir xool ci 3D',
        'Image haute qualité de l\'œuvre': 'Nataal bu yem bu liggéey bi',
        '🖱️ Clic + glisser pour tourner': '🖱️ Cuut te ngis ngir dellu',
        '🔄 Molette pour zoomer': '🔄 Molette ngir ñaar',
        '🖱️ Survolez pour interagir': '🖱️ Dem ci kaw ngir jëf',
        '🎮 Rotation automatique': '🎮 Dellu otomatik',
        'Retour': 'Dellu',
        'Période': 'Période',
        'Origine': 'Origine',
        'Matériau': 'Matériau',
        'Dimensions': 'Dimensions',
        'Informations': 'Xalaat',
        'Œuvre non trouvée': 'Liggéey amul',
        'Erreur:': 'Njumte:',
        'au Musée des Civilisations Noires': 'ci Musée yu Civilization yu Ñuul',
        'Découvrez': 'Gis',
        'Partage annulé': 'Bokk wutal',
        'Lien copié dans le presse-papier !': 'Lien yi def ci press-papier!',
        'Chargement de l\'œuvre...': 'Liggéey bi dañuy yeub...',
        'Retour à l\'accueil': 'Dellu ci kër',
        'À propos de cette œuvre': 'Ci liggéey bii',
        'Partager cette œuvre': 'Bokk liggéey bii',
        'Copier le lien': 'Koppi lien bi',
        'Lien de la page': 'Lien bu page bi',
        'Connexion': 'Dugg',
        'Accédez à votre espace personnel': 'Dugg ci sa espace personnel',
        'Adresse email': 'Email',
        'votre@email.com': 'sa@email.com',
        'Mot de passe': 'Kod',
        'Votre mot de passe': 'Sa kod',
        'Se souvenir de moi': 'Fatte ma',
        'Mot de passe oublié ?': 'Fatte nga sa kod?',
        'Se connecter': 'Dugg',
        'Connexion en cours...': 'Dañuy dugg...',
        'Connexion réussie !': 'Dugg bi baax!',
        'Pas encore de compte ?': 'Amul sa compte?',
        'Créer un compte': 'Sos benn compte',
        'Rejoignez notre communauté': 'Boole ak ñu',
        'Créez votre compte pour accéder à toutes nos fonctionnalités': 'Sos sa compte ngir gis yépp li ñu def',
        'Une expérience personnalisée vous attend': 'Benn expérience bu yaw dafay ngi teg',
        'Rejoignez-nous pour une expérience complète': 'Boole ak ñu ngir benn expérience bu mat',
        'Prénom': 'Tur',
        'Votre prénom': 'Sa tur',
        'Nom': 'Sant',
        'Votre nom': 'Sa sant',
        'Téléphone': 'Telefon',
        'optionnel': 'wérul',
        '+221 XX XXX XX XX': '+221 XX XXX XX XX',
        'Minimum 8 caractères': 'Minimum 8 carac',
        'Confirmer le mot de passe': 'Definisi kod bi',
        'Répétez votre mot de passe': 'Wax kët sa kod',
        'Les mots de passe ne correspondent pas': 'Kod yi ñu ñakk',
        'J\'accepte les': 'Dama waxul',
        'conditions d\'utilisation': 'condition yu jëf',
        'et la': 'ak',
        'politique de confidentialité': 'politique bu secret',
        'Créer mon compte': 'Sos sama compte',
        'Création en cours...': 'Dañuy sos...',
        'Compte créé avec succès !': 'Compte bi sos na baax!',
        'Déjà un compte ?': 'Am nga sa compte?'
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
    // Vérifier si localStorage est disponible (côté client uniquement)
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const cacheData = Array.from(this.cache.entries());
        localStorage.setItem('translation_cache', JSON.stringify(cacheData));
      } catch (error) {
        console.warn('Impossible de sauvegarder le cache:', error);
      }
    }
  }

  // Charger le cache depuis localStorage
  loadCacheFromStorage() {
    // Vérifier si localStorage est disponible (côté client uniquement)
    if (typeof window !== 'undefined' && window.localStorage) {
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