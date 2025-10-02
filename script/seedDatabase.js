const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const artworksData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/artworks.json'), 'utf8')
);

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
  favorites: { type: Number, default: 0 }
}, { timestamps: true });

async function seedDatabase() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté\n');

    const Artwork = mongoose.models.Artwork || mongoose.model('Artwork', ArtworkSchema);

    console.log(`📦 Insertion de ${artworksData.length} œuvres...\n`);

    for (const artwork of artworksData) {
      await Artwork.findOneAndUpdate(
        { id: artwork.id },
        artwork,
        { upsert: true, new: true }
      );
      console.log(`✅ ${artwork.id}: ${artwork.title.fr}`);
    }

    const total = await Artwork.countDocuments();
    console.log(`\n🎉 Base de données contient ${total} œuvres!`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

seedDatabase();