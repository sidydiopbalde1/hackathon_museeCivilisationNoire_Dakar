import dotenv from 'dotenv';
import connectDB from '../lib/mongodb.js';
import User from '../models/User.js';

// Charger les variables d'environnement depuis .env
dotenv.config({ path: '.env' });

async function seedAdmin() {
  try {
    await connectDB();
    console.log('Connexion à la base de données établie');

    const adminExists = await User.findOne({ email: 'admin10@gmail.com' });
    if (adminExists) {
      console.log('L\'utilisateur admin existe déjà');
      return;
    }

    const adminUser = new User({
      nom: 'Admin',
      email: 'admin10@gmail.com',
      password: 'admin123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Utilisateur admin créé avec succès:');
    console.log('Email: admin10@gmail.com');
    console.log('Mot de passe: admin123');
    console.log('Rôle: admin');

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
  } finally {
    process.exit(0);
  }
}

seedAdmin();