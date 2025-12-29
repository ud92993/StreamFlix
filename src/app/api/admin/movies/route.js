import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => {
      console.log('✅ MongoDB connecté');
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Schéma Movie
const MovieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number, required: true },
  description: { type: String, required: true },
  poster: { type: String, required: true },
  uqloadLink: { type: String, required: true },
  embedId: { type: String, required: true },
  duration: { type: String, default: 'N/A' },
  views: { type: Number, default: 0 },
}, { timestamps: true });

const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);

// Fonction pour extraire l'ID UQload
function extractUQloadId(url) {
  const patterns = [
    /uqload\.[a-z]+\/([a-z0-9]+)\.html/i,
    /uqload\.[a-z]+\/embed-([a-z0-9]+)\.html/i,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * POST - Ajouter un film
 */
export async function POST(request) {
  try {
    console.log('📝 Début ajout de film...');

    // Vérification simple de session
    const cookies = request.headers.get('cookie');
    if (!cookies || !cookies.includes('next-auth.session-token')) {
      console.log('❌ Non autorisé');
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await connectDB();
    console.log('✅ DB connectée');

    const body = await request.json();
    console.log('📦 Données reçues:', body.title);

    const { title, genre, year, description, poster, uqloadLink, duration } = body;

    // Validation
    if (!title || !genre || !year || !description || !poster || !uqloadLink) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Extraction ID UQload
    const embedId = extractUQloadId(uqloadLink);
    console.log('🔍 ID UQload extrait:', embedId);
    
    if (!embedId) {
      return NextResponse.json(
        { success: false, error: 'Lien UQload invalide. Format: https://uqload.bz/xxxxx.html' },
        { status: 400 }
      );
    }

    console.log('🎬 Création du film...');

    // Création
    const movie = await Movie.create({
      title,
      genre,
      year: parseInt(year),
      description,
      poster,
      uqloadLink,
      embedId,
      duration: duration || 'N/A',
    });

    console.log('✅ Film créé:', movie._id);

    return NextResponse.json({
      success: true,
      data: movie,
      message: 'Film ajouté avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Erreur complète:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprimer un film
 */
export async function DELETE(request) {
  try {
    const cookies = request.headers.get('cookie');
    if (!cookies || !cookies.includes('next-auth.session-token')) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID requis' },
        { status: 400 }
      );
    }

    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return NextResponse.json(
        { success: false, error: 'Film non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Film supprimé'
    });

  } catch (error) {
    console.error('❌ Erreur DELETE:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}