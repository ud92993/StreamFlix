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

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const genre = searchParams.get('genre');
    const limit = parseInt(searchParams.get('limit')) || 50;

    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (genre && genre !== 'all') {
      query.genre = genre;
    }

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const total = await Movie.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: movies,
      pagination: { total }
    });

  } catch (error) {
    console.error('Erreur GET /api/movies:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}