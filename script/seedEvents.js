const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

const eventsData = [
  {
    id: 'EVT001',
    title: {
      fr: "Exposition : Masques Sacrés d'Afrique de l'Ouest",
      en: "Exhibition: Sacred Masks of West Africa",
      wo: "Exposition: Mask yu Sacré yu Afrique de l'Ouest"
    },
    description: {
      fr: "Découvrez une collection exceptionnelle de masques traditionnels provenant du Mali, du Sénégal et de la Guinée.",
      en: "Discover an exceptional collection of traditional masks from Mali, Senegal and Guinea.",
      wo: "Xoolal collection bu am xeex yu mask traditionnel yu jóge ci Mali, Sénégal ak Guinée."
    },
    date: new Date('2025-10-15T10:00:00Z'),
    time: '10h00 - 18h00',
    location: 'Salle d\'exposition principale, MCN',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800',
    category: 'exposition',
    price: 'Gratuit',
    capacity: 100,
    status: 'upcoming'
  },
  {
    id: 'EVT002',
    title: {
      fr: "Conférence : L'Art Contemporain Africain",
      en: "Conference: Contemporary African Art",
      wo: "Conférence: Art Contemporain Africain"
    },
    description: {
      fr: "Rencontre avec des artistes contemporains africains qui redéfinissent l'art moderne.",
      en: "Meet contemporary African artists redefining modern art.",
      wo: "Jàppale ak artistes contemporains africains yi ñuy definitions bees art moderne."
    },
    date: new Date('2025-10-20T14:00:00Z'),
    time: '14h00 - 16h00',
    location: 'Auditorium MCN',
    imageUrl: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
    category: 'conference',
    price: 'Gratuit',
    capacity: 150,
    status: 'upcoming'
  },
  {
    id: 'EVT003',
    title: {
      fr: "Atelier : Initiation à la Sculpture Sénégalaise",
      en: "Workshop: Introduction to Senegalese Sculpture",
      wo: "Atelier: Initiation ci Sculpture Sénégalaise"
    },
    description: {
      fr: "Apprenez les techniques traditionnelles de sculpture sur bois avec des artisans sénégalais.",
      en: "Learn traditional wood carving techniques with Senegalese craftsmen.",
      wo: "Jàng techniques traditionnels yu sculpture ci garab ak artisans sénégalais."
    },
    date: new Date('2025-10-25T09:00:00Z'),
    time: '09h00 - 12h00',
    location: 'Atelier créatif, MCN',
    imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800',
    category: 'atelier',
    price: '5000 FCFA',
    capacity: 20,
    status: 'upcoming'
  },
  {
    id: 'EVT004',
    title: {
      fr: "Spectacle : Danse et Percussions Africaines",
      en: "Show: African Dance and Percussion",
      wo: "Spectacle: Fec ak Percussion Africaine"
    },
    description: {
      fr: "Une soirée exceptionnelle de danses traditionnelles accompagnées de percussions sabar et djembé.",
      en: "An exceptional evening of traditional dances accompanied by sabar and djembe percussion.",
      wo: "Guddi bu am xeex yu danses traditionnelles ak percussion sabar ak djembé."
    },
    date: new Date('2025-11-05T19:00:00Z'),
    time: '19h00 - 21h00',
    location: 'Esplanade du MCN',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    category: 'spectacle',
    price: '3000 FCFA',
    capacity: 200,
    status: 'upcoming'
  },
  {
    id: 'EVT005',
    title: {
      fr: "Visite Guidée : Trésors du Royaume du Bénin",
      en: "Guided Tour: Treasures of the Kingdom of Benin",
      wo: "Visite Guidée: Trésors yu Royaume du Bénin"
    },
    description: {
      fr: "Visite guidée exclusive de la collection de bronzes et sculptures du royaume du Bénin.",
      en: "Exclusive guided tour of the collection of bronzes and sculptures from the Kingdom of Benin.",
      wo: "Visite guidée exclusive yu collection yu bronzes ak sculptures yu royaume du Bénin."
    },
    date: new Date('2025-11-10T11:00:00Z'),
    time: '11h00 - 12h30',
    location: 'Galerie africaine, MCN',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
    category: 'visite',
    price: 'Gratuit',
    capacity: 30,
    status: 'upcoming'
  }
];

const EventSchema = new mongoose.Schema({
  id: String,
  title: Object,
  description: Object,
  date: Date,
  time: String,
  location: String,
  imageUrl: String,
  category: String,
  price: String,
  capacity: Number,
  status: String
}, { timestamps: true });

async function seedEvents() {
  try {
    console.log('🔄 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB\n');

    const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);

    // Vider la collection d'abord (optionnel)
    const clearExisting = process.argv.includes('--clear');
    if (clearExisting) {
      await Event.deleteMany({});
      console.log('🗑️  Collection events vidée\n');
    }

    console.log(`📦 Insertion de ${eventsData.length} événements...\n`);

    for (const eventData of eventsData) {
      await Event.findOneAndUpdate(
        { id: eventData.id },
        eventData,
        { upsert: true, new: true }
      );
      console.log(`✅ ${eventData.id}: ${eventData.title.fr}`);
    }

    const total = await Event.countDocuments();
    console.log(`\n🎉 Base de données contient ${total} événements!`);

    await mongoose.connection.close();
    console.log('👋 Déconnecté de MongoDB\n');
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

seedEvents();