'use client';

import { useState } from 'react';

const GENRES = ['Action', 'Drame', 'Comédie', 'SF', 'Horreur', 'Animation', 'Romance', 'Thriller', 'Documentaire'];

export default function AdminForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    genre: 'Action',
    year: new Date().getFullYear(),
    description: '',
    poster: '',
    uqloadLink: '',
    duration: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/admin/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'ajout du film');
      }

      setSuccess(true);
      setFormData({
        title: '',
        genre: 'Action',
        year: new Date().getFullYear(),
        description: '',
        poster: '',
        uqloadLink: '',
        duration: '',
      });

      if (onSuccess) onSuccess(data.data);

      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 rounded-lg bg-netflix-darkGray p-8">
      <h2 className="mb-6 text-3xl font-bold text-white">Ajouter un film</h2>

      {/* Messages */}
      {error && (
        <div className="rounded-md bg-red-900/50 p-4 text-red-200">
          {error}
        </div>
      )}
      
      {success && (
        <div className="rounded-md bg-green-900/50 p-4 text-green-200">
          Film ajouté avec succès ! 🎉
        </div>
      )}

      {/* Titre */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Titre du film *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full rounded-md bg-netflix-gray px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
          placeholder="Spider-Man: No Way Home"
        />
      </div>

      {/* Genre et Année */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Genre *
          </label>
          <select
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
            className="w-full rounded-md bg-netflix-gray px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
          >
            {GENRES.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Année *
          </label>
          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            className="w-full rounded-md bg-netflix-gray px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          className="w-full rounded-md bg-netflix-gray px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
          placeholder="Synopsis du film..."
        />
      </div>

      {/* URL de l'affiche */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          URL de l&apos;affiche *
        </label>
        <input
          type="url"
          name="poster"
          value={formData.poster}
          onChange={handleChange}
          required
          className="w-full rounded-md bg-netflix-gray px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
          placeholder="https://example.com/poster.jpg"
        />
        {formData.poster && (
          <img 
            src={formData.poster} 
            alt="Preview" 
            className="mt-2 h-40 rounded-md object-cover"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
      </div>

      {/* Lien UQload */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Lien UQload *
        </label>
        <input
          type="url"
          name="uqloadLink"
          value={formData.uqloadLink}
          onChange={handleChange}
          required
          className="w-full rounded-md bg-netflix-gray px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
          placeholder="https://uqload.bz/48nlkbwky85e.html"
        />
        <p className="mt-1 text-sm text-netflix-lightGray">
          Format: https://uqload.bz/XXXXX.html
        </p>
      </div>

      {/* Durée (optionnel) */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          Durée (optionnel)
        </label>
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full rounded-md bg-netflix-gray px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
          placeholder="02:01:12"
        />
      </div>

      {/* Bouton submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-netflix-red px-6 py-3 font-semibold text-white transition-colors hover:bg-netflix-red/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Ajout en cours...' : 'Ajouter le film'}
      </button>
    </form>
  );
}
