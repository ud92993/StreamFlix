/**
 * Script d'initialisation pour créer le premier admin
 * 
 * Usage: node scripts/init-admin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  loginAttempts: { type: Number, default: 0 },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function initAdmin() {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Vérifier si un admin existe déjà
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      console.log('⚠️  Un admin existe déjà:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Nom: ${existingAdmin.name}`);
      console.log(`   Rôle: ${existingAdmin.role}`);
      return;
    }

    // Créer le premier admin
    const email = process.env.ADMIN_EMAIL || 'admin@streaming.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin123!';
    const name = 'Super Admin';

    console.log('\n📝 Création du premier admin...');
    
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
      name,
      role: 'superadmin',
    });

    console.log('✅ Admin créé avec succès !');
    console.log('\n📋 Informations de connexion:');
    console.log(`   Email: ${email}`);
    console.log(`   Mot de passe: ${password}`);
    console.log('\n⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !');
    console.log('   URL de connexion: http://localhost:3000/admin/login\n');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Déconnecté de MongoDB');
  }
}

initAdmin();