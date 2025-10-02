// scripts/testInstallation.js
// Script pour tester que tout est bien configuré

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

async function testInstallation() {
  console.log('\n' + '='.repeat(60));
  log('🔍 TEST D\'INSTALLATION - MCN Museum', 'blue');
  console.log('='.repeat(60) + '\n');

  let allTestsPassed = true;
  const results = {
    passed: [],
    failed: [],
    warnings: []
  };

  // Test 1: Variables d'environnement
  info('Test 1: Variables d\'environnement');
  if (MONGODB_URI) {
    success('MONGODB_URI est défini');
    results.passed.push('Variables d\'environnement');
  } else {
    error('MONGODB_URI n\'est pas défini dans .env.local');
    results.failed.push('Variables d\'environnement');
    allTestsPassed = false;
  }
  console.log('');

  // Test 2: Structure des dossiers
  info('Test 2: Structure des dossiers');
  const requiredDirs = [
    'app',
    'app/api',
    'app/api/artworks',
    'components',
    'lib',
    'models',
    'scripts',
    'public'
  ];

  let dirsPassed = true;
  for (const dir of requiredDirs) {
    if (fs.existsSync(dir)) {
      success(`Dossier ${dir}/ existe`);
    } else {
      error(`Dossier ${dir}/ manquant`);
      dirsPassed = false;
      allTestsPassed = false;
    }
  }
  
  if (dirsPassed) {
    results.passed.push('Structure des dossiers');
  } else {
    results.failed.push('Structure des dossiers');
  }
  console.log('');

  // Test 3: Fichiers essentiels
  info('Test 3: Fichiers essentiels');
  const requiredFiles = [
    'app/layout.js',
    'app/page.js',
    'app/globals.css',
    'components/Header.jsx',
    'components/BottomNav.jsx',
    'components/ArtworkCard.jsx',
    'lib/mongodb.js',
    'models/Artwork.js',
    'next.config.js',
    'tailwind.config.js',
    'package.json'
  ];

  let filesPassed = true;
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      success(`Fichier ${file} existe`);
    } else {
      error(`Fichier ${file} manquant`);
      filesPassed = false;
      allTestsPassed = false;
    }
  }

  if (filesPassed) {
    results.passed.push('Fichiers essentiels');
  } else {
    results.failed.push('Fichiers essentiels');
  }
  console.log('');

  // Test 4: Dépendances npm
  info('Test 4: Dépendances npm');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    'mongoose',
    'lucide-react',
    'html5-qrcode',
    'tailwindcss'
  ];

  let depsPassed = true;
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  for (const dep of requiredDeps) {
    if (allDeps[dep]) {
      success(`Package ${dep} installé (${allDeps[dep]})`);
    } else {
      error(`Package ${dep} manquant`);
      depsPassed = false;
      allTestsPassed = false;
    }
  }

  if (depsPassed) {
    results.passed.push('Dépendances npm');
  } else {
    results.failed.push('Dépendances npm');
  }
  console.log('');

  // Test 5: Connexion MongoDB
  if (MONGODB_URI) {
    info('Test 5: Connexion MongoDB');
    try {
      await mongoose.connect(MONGODB_URI);
      success('Connexion à MongoDB réussie');
      
      // Test de lecture
      const collections = await mongoose.connection.db.listCollections().toArray();
      success(`${collections.length} collection(s) trouvée(s)`);
      
      // Vérifier la collection artworks
      const Artwork = mongoose.connection.collection('artworks');
      const count = await Artwork.countDocuments();
      
      if (count > 0) {
        success(`Base de données contient ${count} œuvre(s)`);
        results.passed.push('Connexion MongoDB');
        
        // Afficher quelques exemples
        const samples = await Artwork.find().limit(3).toArray();
        info('Exemples d\'œuvres:');
        samples.forEach(art => {
          console.log(`   - ${art.id}: ${art.title?.fr || art.title_fr || 'Sans titre'}`);
        });
      } else {
        warning('La base de données est vide');
        warning('Exécutez: npm run db:seed');
        results.warnings.push('Base de données vide');
      }
      
      await mongoose.connection.close();
    } catch (err) {
      error(`Erreur de connexion MongoDB: ${err.message}`);
      results.failed.push('Connexion MongoDB');
      allTestsPassed = false;
    }
  } else {
    warning('Test MongoDB ignoré (MONGODB_URI non défini)');
    results.warnings.push('MongoDB non testé');
  }
  console.log('');

  // Test 6: Configuration Next.js
  info('Test 6: Configuration Next.js');
  try {
    const nextConfig = require(path.join(process.cwd(), 'next.config.js'));
    success('next.config.js chargé correctement');
    
    if (nextConfig.images?.domains) {
      success(`Domaines d'images configurés: ${nextConfig.images.domains.join(', ')}`);
    } else {
      warning('Aucun domaine d\'images configuré');
      results.warnings.push('Domaines d\'images');
    }
    
    results.passed.push('Configuration Next.js');
  } catch (err) {
    error(`Erreur dans next.config.js: ${err.message}`);
    results.failed.push('Configuration Next.js');
    allTestsPassed = false;
  }
  console.log('');

  // Test 7: Configuration Tailwind
  info('Test 7: Configuration Tailwind');
  try {
    const tailwindConfig = require(path.join(process.cwd(), 'tailwind.config.js'));
    success('tailwind.config.js chargé correctement');
    
    if (tailwindConfig.content && tailwindConfig.content.length > 0) {
      success(`${tailwindConfig.content.length} chemins de contenu configurés`);
    } else {
      warning('Aucun chemin de contenu Tailwind configuré');
      results.warnings.push('Tailwind content');
    }
    
    results.passed.push('Configuration Tailwind');
  } catch (err) {
    error(`Erreur dans tailwind.config.js: ${err.message}`);
    results.failed.push('Configuration Tailwind');
    allTestsPassed = false;
  }
  console.log('');

  // Test 8: Manifest PWA
  info('Test 8: Manifest PWA');
  const manifestPath = 'public/manifest.json';
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      success('manifest.json existe et est valide');
      
      if (manifest.name && manifest.short_name) {
        success(`App: ${manifest.name}`);
      } else {
        warning('Manifest incomplet (name ou short_name manquant)');
        results.warnings.push('Manifest incomplet');
      }
      
      results.passed.push('Manifest PWA');
    } catch (err) {
      error(`Manifest JSON invalide: ${err.message}`);
      results.failed.push('Manifest PWA');
      allTestsPassed = false;
    }
  } else {
    error('manifest.json manquant dans public/');
    results.failed.push('Manifest PWA');
    allTestsPassed = false;
  }
  console.log('');

  // Test 9: Scripts package.json
  info('Test 9: Scripts npm');
  const requiredScripts = ['dev', 'build', 'start'];
  const scripts = packageJson.scripts || {};
  
  let scriptsPassed = true;
  for (const script of requiredScripts) {
    if (scripts[script]) {
      success(`Script "${script}" configuré`);
    } else {
      error(`Script "${script}" manquant`);
      scriptsPassed = false;
      allTestsPassed = false;
    }
  }

  // Scripts optionnels
  const optionalScripts = ['db:seed', 'qr:generate', 'lint'];
  for (const script of optionalScripts) {
    if (scripts[script]) {
      success(`Script optionnel "${script}" configuré`);
    } else {
      warning(`Script optionnel "${script}" non configuré`);
      results.warnings.push(`Script ${script}`);
    }
  }

  if (scriptsPassed) {
    results.passed.push('Scripts npm');
  } else {
    results.failed.push('Scripts npm');
  }
  console.log('');

  // Test 10: Node modules
  info('Test 10: Installation node_modules');
  if (fs.existsSync('node_modules')) {
    const nodeModulesSize = fs.readdirSync('node_modules').length;
    success(`node_modules existe (${nodeModulesSize} packages)`);
    results.passed.push('Node modules');
  } else {
    error('node_modules manquant - Exécutez: npm install');
    results.failed.push('Node modules');
    allTestsPassed = false;
  }
  console.log('');

  // Résumé final
  console.log('\n' + '='.repeat(60));
  log('📊 RÉSUMÉ DES TESTS', 'blue');
  console.log('='.repeat(60) + '\n');

  if (results.passed.length > 0) {
    log(`✅ Tests réussis (${results.passed.length}):`, 'green');
    results.passed.forEach(test => console.log(`   - ${test}`));
    console.log('');
  }

  if (results.warnings.length > 0) {
    log(`⚠️  Avertissements (${results.warnings.length}):`, 'yellow');
    results.warnings.forEach(warning => console.log(`   - ${warning}`));
    console.log('');
  }

  if (results.failed.length > 0) {
    log(`❌ Tests échoués (${results.failed.length}):`, 'red');
    results.failed.forEach(test => console.log(`   - ${test}`));
    console.log('');
  }

  // Verdict final
  console.log('='.repeat(60));
  if (allTestsPassed && results.failed.length === 0) {
    log('🎉 INSTALLATION COMPLÈTE ET FONCTIONNELLE!', 'green');
    console.log('');
    success('Vous pouvez lancer l\'application avec: npm run dev');
    
    if (results.warnings.length > 0) {
      console.log('');
      info('Notes:');
      console.log('   - Certains avertissements sont normaux en développement');
      console.log('   - Vous pouvez les résoudre avant le déploiement');
    }
  } else {
    log('⚠️  INSTALLATION INCOMPLÈTE', 'red');
    console.log('');
    error('Corrigez les erreurs ci-dessus avant de continuer');
    console.log('');
    info('Aide rapide:');
    
    if (results.failed.includes('Variables d\'environnement')) {
      console.log('   - Créez .env.local avec MONGODB_URI');
    }
    if (results.failed.includes('Fichiers essentiels')) {
      console.log('   - Copiez tous les fichiers fournis');
    }
    if (results.failed.includes('Dépendances npm')) {
      console.log('   - Exécutez: npm install');
    }
    if (results.failed.includes('Connexion MongoDB')) {
      console.log('   - Vérifiez votre connection string MongoDB');
      console.log('   - Vérifiez les permissions réseau sur MongoDB Atlas');
    }
  }
  console.log('='.repeat(60) + '\n');

  process.exit(allTestsPassed && results.failed.length === 0 ? 0 : 1);
}

// Fonction pour afficher l'aide
function showHelp() {
  console.log(`
🔍 Script de Test d'Installation - MCN Museum

Ce script vérifie que votre installation est complète et fonctionnelle.

Usage:
  node scripts/testInstallation.js

Tests effectués:
  1. Variables d'environnement (.env.local)
  2. Structure des dossiers
  3. Fichiers essentiels du projet
  4. Dépendances npm
  5. Connexion MongoDB
  6. Configuration Next.js
  7. Configuration Tailwind
  8. Manifest PWA
  9. Scripts npm
  10. Installation node_modules

En cas d'erreur:
  - Vérifiez que tous les fichiers sont copiés
  - Exécutez: npm install
  - Vérifiez .env.local
  - Consultez INSTALLATION_COMPLETE.md

  `);
}

// Exécution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }

  testInstallation().catch(err => {
    console.error('\n❌ Erreur fatale:', err);
    process.exit(1);
  });
}

module.exports = { testInstallation };