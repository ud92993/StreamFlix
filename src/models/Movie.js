import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    enum: ['Action', 'Drame', 'Comédie', 'SF', 'Horreur', 'Animation', 'Romance', 'Thriller', 'Documentaire'],
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    required: true,
  },
  uqloadLink: {
    type: String,
    required: true,
  },
  embedId: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: 'N/A',
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

MovieSchema.index({ title: 'text', description: 'text' });
MovieSchema.index({ genre: 1 });