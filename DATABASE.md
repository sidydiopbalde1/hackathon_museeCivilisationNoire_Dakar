# 🗄️ Configuration Base de Données - MCN Museum

## Choix de la base de données

### Option 1: PostgreSQL (Recommandé pour production)
**Avantages:**
- ✅ Données structurées et relationnelles
- ✅ Requêtes SQL puissantes
- ✅ Intégrité des données garantie
- ✅ Excellent pour analytics
- ✅ Gratuit avec Supabase

### Option 2: MongoDB (Recommandé pour rapidité)
**Avantages:**
- ✅ Flexibilité du schéma
- ✅ JSON natif (parfait pour multilingue)
- ✅ Setup ultra rapide
- ✅ Gratuit avec MongoDB Atlas
- ✅ Scaling facile

## 🚀 Installation PostgreSQL avec Supabase

### Étape 1: Créer un projet Supabase

```bash
# Aller sur supabase.com et créer un compte gratuit
# Créer un nouveau projet
# Nom: mcn-museum
# Région: Europe West (proche Sénégal)
```

### Étape 2: Créer les tables SQL

```sql
-- Table des œuvres
CREATE TABLE artworks (
  id TEXT PRIMARY KEY,
  title_fr TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_wo TEXT NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  description_wo TEXT,
  image_url TEXT,
  audio_url_fr TEXT,
  audio_url_en TEXT,
  audio_url_wo TEXT,
  period TEXT,
  origin TEXT,
  material TEXT,
  dimensions TEXT,
  qr_code TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table des favoris utilisateurs
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  artwork_id TEXT REFERENCES artworks(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, artwork_id)
);

-- Table des statistiques de visite
CREATE TABLE artwork_views (
  id SERIAL PRIMARY KEY,
  artwork_id TEXT REFERENCES artworks(id),
  view_date TIMESTAMP DEFAULT NOW(),
  user_id TEXT,
  language TEXT,
  device_type TEXT
);

-- Index pour performances
CREATE INDEX idx_artworks_qr ON artworks(qr_code);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_views_artwork ON artwork_views(artwork_id);
CREATE INDEX idx_views_date ON artwork_views(view_date);

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER update_artworks_updated_at
  BEFORE UPDATE ON artworks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Étape 3: Insérer les données initiales

```sql
-- Insérer les œuvres
INSERT INTO artworks (
  id, title_fr, title_en, title_wo,
  description_fr, description_en, description_wo,
  image_url, period, origin, material, dimensions, qr_code
) VALUES
(
  'MCN001',
  'Masque Dogon',
  'Dogon Mask',
  'Mask Dogon',
  'Ce masque Dogon du Mali représente un Kanaga...',
  'This Dogon mask from Mali represents a Kanaga...',
  'Mask Dogon bii jóge ci Mali...',
  'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
  'XVe - XVIIIe siècle',
  'Mali',
  'Bois, fibres végétales',
  '65 x 35 x 15 cm',
  'MCN001'
);

-- Répéter pour les autres œuvres...
```

### Étape 4: Configuration Next.js avec Supabase

```bash
npm install @supabase/supabase-js
```

Créer `lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

Ajouter à `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=votre_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
```

## 🍃 Installation MongoDB avec Atlas

### Étape 1: Créer un cluster MongoDB

```bash
# Aller sur mongodb.com/cloud/atlas
# Créer un compte gratuit
# Créer un cluster M0 (gratuit)
# Région: Europe West
# Nom: mcn-museum-cluster
```

### Étape 2: Configuration de sécurité

1. Database Access > Add User
   - Username: mcn-admin
   - Password: [générer un mot de passe fort]
   - Role: Atlas Admin

2. Network Access > Add IP Address
   - Allow access from anywhere: 0.0.0.0/0 (pour dev)

### Étape 3: Obtenir la connection string

```
mongodb+srv://mcn-admin:<password>@mcn-museum-cluster.xxxxx.mongodb.net/
```

### Étape 4: Installation Mongoose

```bash
npm install mongoose
```

Créer `lib/mongodb.js`:

```javascript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Définir MONGODB_URI dans .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

### Étape 5: Créer les modèles Mongoose

Créer `models/Artwork.js`:

```javascript
import mongoose from 'mongoose';

const ArtworkSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    fr: { type: String, required: true },
    en: { type: String, required: true },
    wo: { type: String, required: true },
  },
  description: {
    fr: String,
    en: String,
    wo: String,
  },
  imageUrl: String,
  audioUrl: {
    fr: String,
    en: String,
    wo: String,
  },
  period: String,
  origin: String,
  material: String,
  dimensions: String,
  qrCode: {
    type: String,
    unique: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  favorites: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index pour recherche
ArtworkSchema.index({ 
  'title.fr': 'text', 
  'title.en': 'text',
  'title.wo': 'text',
  origin: 'text',
  period: 'text'
});

export default mongoose.models.Artwork || mongoose.model('Artwork', ArtworkSchema);
```

Créer `models/Favorite.js`:

```javascript
import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  artworkId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

FavoriteSchema.index({ userId: 1, artworkId: 1 }, { unique: true });

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
```

Créer `models/View.js`:

```javascript
import mongoose from 'mongoose';

const ViewSchema = new mongoose.Schema({
  artworkId: {
    type: String,
    required: true,
  },
  userId: String,
  language: String,
  deviceType: String,
  viewedAt: {
    type: Date,
    default: Date.now,
  },
});

ViewSchema.index({ artworkId: 1, viewedAt: -1 });

export default mongoose.models.View || mongoose.model('View', ViewSchema);
```

### Étape 6: Configurer .env.local

```env
MONGODB_URI=mongodb+srv://mcn-admin:votre_password@mcn-museum-cluster.xxxxx.mongodb.net/mcn-museum?retryWrites=true&w=majority
```

## 📡 API Routes avec base de données

### PostgreSQL (Supabase) - app/api/artworks/route.js

```javascript
import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET - Récupérer toutes les œuvres
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const origin = searchParams.get('origin');

    let query = supabase.from('artworks').select('*');

    if (search) {
      query = query.or(`title_fr.ilike.%${search}%,title_en.ilike.%${search}%,origin.ilike.%${search}%`);
    }

    if (origin) {
      query = query.eq('origin', origin);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    // Transformer les données au format attendu par le frontend
    const formattedData = data.map(artwork => ({
      id: artwork.id,
      title: {
        fr: artwork.title_fr,
        en: artwork.title_en,
        wo: artwork.title_wo,
      },
      description: {
        fr: artwork.description_fr,
        en: artwork.description_en,
        wo: artwork.description_wo,
      },
      imageUrl: artwork.image_url,
      audioUrl: {
        fr: artwork.audio_url_fr,
        en: artwork.audio_url_en,
        wo: artwork.audio_url_wo,
      },
      period: artwork.period,
      origin: artwork.origin,
      material: artwork.material,
      dimensions: artwork.dimensions,
      qrCode: artwork.qr_code,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Créer une nouvelle œuvre
export async function POST(request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('artworks')
      .insert([{
        id: body.id,
        title_fr: body.title.fr,
        title_en: body.title.en,
        title_wo: body.title.wo,
        description_fr: body.description.fr,
        description_en: body.description.en,
        description_wo: body.description.wo,
        image_url: body.imageUrl,
        audio_url_fr: body.audioUrl.fr,
        audio_url_en: body.audioUrl.en,
        audio_url_wo: body.audioUrl.wo,
        period: body.period,
        origin: body.origin,
        material: body.material,
        dimensions: body.dimensions,
        qr_code: body.qrCode,
      }])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### MongoDB - app/api/artworks/route.js

```javascript
import connectDB from '@/lib/mongodb';
import Artwork from '@/models/Artwork';
import { NextResponse } from 'next/server';

// GET - Récupérer toutes les œuvres
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const origin = searchParams.get('origin');

    let query = {};

    if (search) {
      query.$or = [
        { 'title.fr': { $regex: search, $options: 'i' } },
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.wo': { $regex: search, $options: 'i' } },
        { origin: { $regex: search, $options: 'i' } },
        { period: { $regex: search, $options: 'i' } },
      ];
    }

    if (origin) {
      query.origin = origin;
    }

    const artworks = await Artwork.find(query).sort({ createdAt: -1 });

    return NextResponse.json(artworks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Créer une nouvelle œuvre
export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const artwork = await Artwork.create(body);

    return NextResponse.json(artwork, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### API Route pour une œuvre spécifique - app/api/artwork/[id]/route.js

```javascript
// Version MongoDB
import connectDB from '@/lib/mongodb';
import Artwork from '@/models/Artwork';
import View from '@/models/View';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await connectDB();

    const artwork = await Artwork.findOne({ id: params.id });

    if (!artwork) {
      return NextResponse.json(
        { error: 'Œuvre non trouvée' },
        { status: 404 }
      );
    }

    // Incrémenter le compteur de vues
    artwork.viewCount += 1;
    await artwork.save();

    // Enregistrer la vue pour analytics
    await View.create({
      artworkId: params.id,
      language: request.headers.get('accept-language')?.split(',')[0] || 'fr',
      deviceType: request.headers.get('user-agent')?.includes('Mobile') ? 'mobile' : 'desktop',
    });

    return NextResponse.json(artwork);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const artwork = await Artwork.findOneAndDelete({ id: params.id });

    if (!artwork) {
      return NextResponse.json(
        { error: 'Œuvre non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Œuvre supprimée avec succès' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

### API pour les favoris - app/api/favorites/route.js

```javascript
import connectDB from '@/lib/mongodb';
import Favorite from '@/models/Favorite';
import Artwork from '@/models/Artwork';
import { NextResponse } from 'next/server';

// GET - Récupérer les favoris d'un utilisateur
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      );
    }

    const favorites = await Favorite.find({ userId }).sort({ createdAt: -1 });
    const artworkIds = favorites.map(f => f.artworkId);
    const artworks = await Artwork.find({ id: { $in: artworkIds } });

    return NextResponse.json(artworks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Ajouter un favori
export async function POST(request) {
  try {
    await connectDB();

    const { userId, artworkId } = await request.json();

    if (!userId || !artworkId) {
      return NextResponse.json(
        { error: 'userId et artworkId requis' },
        { status: 400 }
      );
    }

    // Vérifier si l'œuvre existe
    const artwork = await Artwork.findOne({ id: artworkId });
    if (!artwork) {
      return NextResponse.json(
        { error: 'Œuvre non trouvée' },
        { status: 404 }
      );
    }

    // Créer ou récupérer le favori
    const favorite = await Favorite.findOneAndUpdate(
      { userId, artworkId },
      { userId, artworkId },
      { upsert: true, new: true }
    );

    // Incrémenter le compteur de favoris
    artwork.favorites += 1;
    await artwork.save();

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Déjà dans les favoris' },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Retirer un favori
export async function DELETE(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const artworkId = searchParams.get('artworkId');

    if (!userId || !artworkId) {
      return NextResponse.json(
        { error: 'userId et artworkId requis' },
        { status: 400 }
      );
    }

    const favorite = await Favorite.findOneAndDelete({ userId, artworkId });

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favori non trouvé' },
        { status: 404 }
      );
    }

    // Décrémenter le compteur de favoris
    await Artwork.findOneAndUpdate(
      { id: artworkId },
      { $inc: { favorites: -1 } }
    );

    return NextResponse.json({ message: 'Favori retiré avec succès' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

## 📊 Analytics API - app/api/analytics/route.js

```javascript
import connectDB from '@/lib/mongodb';
import View from '@/models/View';
import Artwork from '@/models/Artwork';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7days';

    // Calculer la date de début
    const now = new Date();
    let startDate;
    
    switch(period) {
      case '24h':
        startDate = new Date(now - 24 * 60 * 60 * 1000);
        break;
      case '7days':
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
    }

    // Total des vues
    const totalViews = await View.countDocuments({
      viewedAt: { $gte: startDate }
    });

    // Œuvres les plus vues
    const topArtworks = await View.aggregate([
      { $match: { viewedAt: { $gte: startDate } } },
      { $group: { _id: '$artworkId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Enrichir avec les infos des œuvres
    const topArtworksWithDetails = await Promise.all(
      topArtworks.map(async (item) => {
        const artwork = await Artwork.findOne({ id: item._id });
        return {
          artwork: artwork,
          views: item.count
        };
      })
    );

    // Distribution par langue
    const languageDistribution = await View.aggregate([
      { $match: { viewedAt: { $gte: startDate } } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Distribution par appareil
    const deviceDistribution = await View.aggregate([
      { $match: { viewedAt: { $gte: startDate } } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Vues par jour
    const viewsByDay = await View.aggregate([
      { $match: { viewedAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$viewedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      period,
      totalViews,
      topArtworks: topArtworksWithDetails,
      languageDistribution,
      deviceDistribution,
      viewsByDay,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

## 🔄 Script de migration des données

Créer `scripts/migrateData.js`:

```javascript
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Charger les données JSON
const artworks = require('../data/artworks.json');

// Connection MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

async function migrateData() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Créer le modèle inline pour la migration
    const ArtworkSchema = new mongoose.Schema({
      id: String,
      title: Object,
      description: Object,
      imageUrl: String,
      audioUrl: Object,
      period: String,
      origin: String,
      material: String,
      dimensions: String,
      qrCode: String,
      viewCount: { type: Number, default: 0 },
      favorites: { type: Number, default: 0 },
    }, { timestamps: true });

    const Artwork = mongoose.models.Artwork || mongoose.model('Artwork', ArtworkSchema);

    console.log(`\n📦 Migration de ${artworks.length} œuvres...`);

    for (const artwork of artworks) {
      await Artwork.findOneAndUpdate(
        { id: artwork.id },
        artwork,
        { upsert: true, new: true }
      );
      console.log(`✅ ${artwork.id}: ${artwork.title.fr}`);
    }

    console.log(`\n🎉 Migration terminée avec succès!`);
    console.log(`📊 ${artworks.length} œuvres dans la base de données`);

    await mongoose.connection.close();
    console.log('👋 Déconnecté de MongoDB');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

migrateData();
```

Exécuter avec:

```bash
MONGODB_URI=votre_uri node scripts/migrateData.js
```

## 🎯 Mise à jour du package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "qr:generate": "node scripts/generateQR.js",
    "db:migrate": "node scripts/migrateData.js",
    "db:seed": "node scripts/seedDatabase.js"
  },
  "dependencies": {
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "html5-qrcode": "^2.3.8",
    "lucide-react": "^0.294.0",
    "next-pwa": "^5.6.0",
    "mongoose": "^8.0.3",
    "@supabase/supabase-js": "^2.38.5"
  }
}
```

## ✅ Checklist finale

### PostgreSQL (Supabase)
- [ ] Compte Supabase créé
- [ ] Tables créées avec SQL
- [ ] Données insérées
- [ ] Variables d'env configurées
- [ ] API routes testées

### MongoDB (Atlas)
- [ ] Cluster MongoDB créé
- [ ] Connection string obtenue
- [ ] Modèles Mongoose créés
- [ ] Migration des données effectuée
- [ ] API routes testées

## 🚀 Quelle option choisir ?

**Choisir PostgreSQL/Supabase si:**
- Vous voulez des requêtes SQL complexes
- Vous avez besoin d'analytics poussés
- Vous préférez la structure relationnelle
- Vous voulez l'authentification Supabase

**Choisir MongoDB/Atlas si:**
- Vous voulez un setup ultra rapide
- Vous privilégiez la flexibilité
- Vous aimez travailler avec JSON
- Vous voulez scaler facilement

**Mon conseil pour le hackathon: MongoDB** - Setup en 10 minutes, parfait pour prototyper vite !

---

Voulez-vous que je vous aide à implémenter l'une ou l'autre option ?