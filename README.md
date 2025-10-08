# 🏛️ MCN Museum - Musée des Civilisations Noires

Application PWA Next.js pour le Hackathon Dakar Slush'D 2025

## 🎯 Objectif

Créer une expérience digitale immersive permettant aux visiteurs d'explorer les œuvres du Musée des Civilisations Noires via scan QR, multilingue (FR/EN/Wolof), avec descriptions audio et accessible en ligne.

## ✨ Fonctionnalités

- ✅ Scan QR Code pour accéder aux œuvres
- ✅ Interface multilingue (Français, Anglais, Wolof)
- ✅ Descriptions audio des œuvres
- ✅ Consultation hors ligne (PWA)
- ✅ Galerie complète de la collection
- ✅ Fiches détaillées avec métadonnées
- ✅ Partage social des œuvres
- ✅ Système de favoris
- ✅ Recherche par titre, origine, période
- ✅ Design responsive (mobile-first)

## 🚀 Installation

### 1. Cloner et installer

```bash
# Créer le projet Next.js
npx create-next-app@latest mcn-museum
cd mcn-museum

# Installer les dépendances
npm install firebase html5-qrcode lucide-react next-pwa
```

### 2. Configuration Firebase

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com)
2. Activer Firestore Database et Storage
3. Copier les credentials Firebase

Créer `.env.local` :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
```

### 3. Structure des fichiers

Copier tous les fichiers fournis dans la structure suivante :

```
mcn-museum/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── globals.css
│   ├── collection/page.js
│   ├── scan/page.js
│   └── artwork/[id]/page.js
├── components/
│   ├── Header.jsx
│   ├── BottomNav.jsx
│   ├── ArtworkCard.jsx
│   ├── QRScanner.jsx
│   └── AudioPlayer.jsx
├── lib/
│   └── firebase.js
├── data/
│   └── artworks.json
├── public/
│   ├── manifest.json
│   ├── images/
│   └── audio/
└── next.config.js
```

### 4. Configurer next.config.js

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'firebasestorage.googleapis.com'],
  },
});
```

### 5. Lancer l'application

```bash
# Mode développement
npm run dev

# Build production
npm run build
npm start
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 📱 Tester le PWA

1. Build en production : `npm run build && npm start`
2. Ouvrir Chrome DevTools
3. Application > Service Workers
4. Vérifier que le service worker est actif
5. Tester le mode hors ligne

## 🎨 Personnalisation

### Ajouter des œuvres

Éditer `data/artworks.json` :

```json
{
  "id": "MCN005",
  "title": {
    "fr": "Titre français",
    "en": "English title",
    "wo": "Tur wolof"
  },
  "description": {
    "fr": "Description...",
    "en": "Description...",
    "wo": "Description..."
  },
  "imageUrl": "/images/artwork5.jpg",
  "audioUrl": {
    "fr": "/audio/artwork5-fr.mp3",
    "en": "/audio/artwork5-en.mp3",
    "wo": "/audio/artwork5-wo.mp3"
  },
  "period": "XIXe siècle",
  "origin": "Sénégal",
  "material": "Bronze",
  "dimensions": "50 x 30 cm",
  "qrCode": "MCN005"
}
```

### Ajouter images et audio

1. Placer les images dans `public/images/`
2. Placer les fichiers audio dans `public/audio/`
3. Mettre à jour les URLs dans `artworks.json`

### Générer des QR Codes

```javascript
// Utiliser un service comme qrcode.js ou en ligne
// Format: MCN001, MCN002, etc.
// URL de redirection: https://votre-domaine.com/artwork/MCN001
```

## 🔥 Upload vers Firebase

### Images

```javascript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const uploadImage = async (file, artworkId) => {
  const storageRef = ref(storage, `artworks/${artworkId}.jpg`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
```

### Audio

```javascript
const uploadAudio = async (file, artworkId, lang) => {
  const storageRef = ref(storage, `audio/${artworkId}-${lang}.mp3`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
```

## 🚀 Déploiement sur Vercel

### Option 1: Via GitHub

1. Push votre code sur GitHub
2. Aller sur [vercel.com](https://vercel.com)
3. Import GitHub repository
4. Ajouter les variables d'environnement
5. Deploy

### Option 2: Via CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Variables d'environnement Vercel

Dans Settings > Environment Variables, ajouter :
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 📊 Analytics et Suivi

Firebase Analytics est déjà configuré. Pour tracker des événements :

```javascript
import { analytics } from '@/lib/firebase';
import { logEvent } from 'firebase/analytics';

// Tracker une visite d'œuvre
logEvent(analytics, 'view_artwork', {
  artwork_id: 'MCN001',
  artwork_name: 'Masque Dogon'
});

// Tracker un scan QR
logEvent(analytics, 'scan_qr', {
  artwork_id: 'MCN001'
});
```

## 🎤 Pitch Deck - Points clés

### Problème
- Accès limité au patrimoine culturel africain
- Barrières linguistiques
- Expérience de visite statique

### Solution
- Plateforme digitale multilingue
- Scan QR pour info instantanée
- Descriptions audio inclusives
- Accessible mondialement

### Impact
- Démocratisation de la culture
- Rayonnement international du MCN
- Expérience enrichie pour tous

### Technologie
- Next.js PWA (rapide, offline)
- Firebase (scalable, temps réel)
- Multilingue natif
- Scanner QR intégré

### Business Model
- Partenariats avec musées africains
- Licence SaaS pour autres institutions
- Sponsoring culturel
- Contenu premium

### Scalabilité
- Extensible à d'autres musées
- API ouverte pour développeurs
- Plateforme panafricaine

## 🏆 Critères d'évaluation

- **Innovation** ✅ Première plateforme digitale MCN multilingue avec Wolof
- **UX** ✅ Interface intuitive, PWA, hors ligne
- **Impact culturel** ✅ Préservation patrimoine, accès mondial
- **Faisabilité** ✅ Stack éprouvée, déployable en 48h
- **Scalabilité** ✅ Architecture modulaire, extensible

## 📞 Support

- Email: contact@senstartup.com
- Tel: +221 77 106 19 17

## 📝 License

MIT License - Hackathon Dakar Slush'D 2025

---

**Développé pour le Hackathon MCN - Dakar Slush'D 2025**

🇸🇳 Made with ❤️ in Senegal


npm install --legacy-peer-deps
