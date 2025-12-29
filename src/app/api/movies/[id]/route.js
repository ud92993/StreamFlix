import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

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
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const MovieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  year: Number,
  description: String,
  poster: String,
  uqloadLink: String,
  embedId: String,
  duration: String,
  views: Number,
}, { timestamps: true });

const Movie = mongoose.models.Movie || mongoose.model('Movie', MovieSchema);

export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'ID invalide' },
        { status: 400 }
      );
    }

    const movie = await Movie.findById(id);

    if (!movie) {
      return NextResponse.json(
        { success: false, error: 'Film non trouvé' },
        { status: 404 }
      );
    }

    // Incrémenter les vues
    await Movie.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return NextResponse.json({
      success: true,
      data: movie
    });

  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}