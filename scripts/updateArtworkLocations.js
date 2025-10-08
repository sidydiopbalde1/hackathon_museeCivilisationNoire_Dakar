import mongoose from 'mongoose';
import Artwork from '../models/Artwork.js';
import dotenv from 'dotenv';

dotenv.config();

const museumCoordinates = {
  latitude: 14.67862,
  longitude: -17.436026,
  address: "Autoroute prolongée x Plage de la Gare, Dakar, Sénégal"
};

async function updateArtworkLocations() {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/musee';
    await mongoose.connect(mongoUri);
    
    console.log('Connecté à MongoDB');

    // Trouver toutes les œuvres
    const artworks = await Artwork.find({});
    
    console.log(`Trouvé ${artworks.length} œuvres à mettre à jour`);
    
    // Mettre à jour chaque œuvre avec les coordonnées du musée
    for (const artwork of artworks) {
      artwork.location = museumCoordinates;
      await artwork.save();
      console.log(`Mise à jour de l'œuvre: ${artwork.id}`);
    }
    
    console.log('Toutes les œuvres ont été mises à jour avec les coordonnées du musée');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des coordonnées:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('Connexion à MongoDB fermée');
  }
}

// Exécuter la fonction
updateArtworkLocations();