'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboard({ user }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Recherche TMDB
  const [searchQuery, setSearchQuery] = useState('');
  const [tmdbResults, setTmdbResults] = useState([]);
  const [searchingTmdb, setSearchingTmdb] = useState(false);
  
  // Formulaire
  const [formData, setFormData] = useState({
    title: '',
    genre: 'Action',
    year: new Date().getFullYear(),
    description: '',
    poster: '',
    uqloadLink: '',
    duration: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const GENRES = ['Action', 'Drame', 'Comédie', 'SF', 'Horreur', 'Animation', 'Romance', 'Thriller', 'Documentaire'];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies?limit=200');
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Recherche TMDB
  const searchTmdb = async () => {
    if (!searchQuery.trim()) return;

    setSearchingTmdb(true);
    try {
      const response = await fetch(`/api/tmdb/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.success) {
        setTmdbResults(data.data);
      } else {
        alert('Erreur de recherche TMDB');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de recherche');
    } finally {
      setSearchingTmdb(false);
    }
  };

// Auto-remplir depuis TMDB
const selectTmdbMovie = (movie) => {
  setFormData(prev => ({
    ...prev,
    title: movie.title,
    year: movie.year || new Date().getFullYear(),
    description: movie.description,
    poster: movie.poster || '',
    duration: movie.duration || '', // Ajout de la durée
  }));
  setTmdbResults([]);
  setSearchQuery('');
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/admin/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Film ajouté avec succès !' });
        setFormData({
          title: '',
          genre: 'Action',
          year: new Date().getFullYear(),
          description: '',
          poster: '',
          uqloadLink: '',
          duration: '',
        });
        fetchMovies();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur réseau' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce film ?')) return;

    try {
      const response = await fetch(`/api/admin/movies?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMovies();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Header */}
      <header className="bg-netflix-darkGray shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <h1 className="text-2xl font-bold text-netflix-red">StreamFlix</h1>
            </Link>
            <span className="text-netflix-lightGray">| Admin</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-netflix-lightGray">
              👤 {user.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="rounded-md bg-netflix-red px-4 py-2 text-sm text-white hover:bg-netflix-red/90"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats */}
        <div className="mb-8 rounded-lg bg-netflix-darkGray p-6">
          <h2 className="mb-2 text-2xl font-bold text-white">
            📊 Total : {movies.length} films
          </h2>
        </div>

        {/* Formulaire avec recherche TMDB */}
        <div className="mb-8 rounded-lg bg-netflix-darkGray p-6">
          <h2 className="mb-6 text-2xl font-bold text-white">➕ Ajouter un film</h2>

          {/* Recherche TMDB */}
          <div className="mb-6 rounded-lg bg-netflix-gray/50 p-4">
            <h3 className="mb-3 text-lg font-semibold text-white">
              🎬 Rechercher sur TMDB (auto-remplissage)
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchTmdb()}
                placeholder="Ex: Spider-Man, Inception, Avatar..."
                className="flex-1 rounded bg-netflix-gray px-4 py-2 text-white placeholder-netflix-lightGray"
              />
              <button
                onClick={searchTmdb}
                disabled={searchingTmdb}
                className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {searchingTmdb ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>

            {/* Résultats TMDB */}
            {tmdbResults.length > 0 && (
              <div className="mt-4 max-h-96 space-y-2 overflow-y-auto">
                {tmdbResults.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => selectTmdbMovie(movie)}
                    className="flex cursor-pointer gap-3 rounded bg-netflix-gray p-3 hover:bg-netflix-gray/80"
                  >
                    {movie.poster && (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="h-20 w-14 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">
                        {movie.title} {movie.year && `(${movie.year})`}
                      </h4>
                      <p className="line-clamp-2 text-sm text-netflix-lightGray">
                        {movie.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {message.text && (
            <div className={`mb-4 rounded p-4 ${message.type === 'success' ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-white">Titre *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded bg-netflix-gray px-4 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm text-white">Genre *</label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full rounded bg-netflix-gray px-4 py-2 text-white"
                >
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white">Année *</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full rounded bg-netflix-gray px-4 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="3"
                className="w-full rounded bg-netflix-gray px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-white">URL Affiche *</label>
              <input
                type="url"
                name="poster"
                value={formData.poster}
                onChange={handleChange}
                required
                className="w-full rounded bg-netflix-gray px-4 py-2 text-white"
              />
              {formData.poster && (
                <img src={formData.poster} alt="Preview" className="mt-2 h-32 rounded" />
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-white">Lien UQload * 🎥</label>
              <input
                type="url"
                name="uqloadLink"
                value={formData.uqloadLink}
                onChange={handleChange}
                required
                placeholder="https://uqload.bz/xxxxx.html"
                className="w-full rounded bg-netflix-gray px-4 py-2 text-white"
              />
              <p className="mt-1 text-xs text-netflix-lightGray">
                💡 Seul champ à remplir manuellement - trouvez le lien du film
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm text-white">Durée (optionnel)</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="02:01:12"
                className="w-full rounded bg-netflix-gray px-4 py-2 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded bg-netflix-red px-6 py-3 font-semibold text-white hover:bg-netflix-red/90 disabled:opacity-50"
            >
              {submitting ? '⏳ Ajout en cours...' : '✅ Ajouter le film'}
            </button>
          </form>
        </div>

        {/* Liste des films */}
        <div className="rounded-lg bg-netflix-darkGray p-6">
          <h2 className="mb-4 text-2xl font-bold text-white">🎬 Films ({movies.length})</h2>
          
          {loading ? (
            <p className="text-netflix-lightGray">Chargement...</p>
          ) : movies.length === 0 ? (
            <p className="text-netflix-lightGray">Aucun film</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-netflix-gray">
                    <th className="px-4 py-3 text-left text-sm text-netflix-lightGray">Titre</th>
                    <th className="px-4 py-3 text-left text-sm text-netflix-lightGray">Genre</th>
                    <th className="px-4 py-3 text-left text-sm text-netflix-lightGray">Année</th>
                    <th className="px-4 py-3 text-right text-sm text-netflix-lightGray">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map(movie => (
                    <tr key={movie._id} className="border-b border-netflix-gray/50">
                      <td className="px-4 py-3 text-white">{movie.title}</td>
                      <td className="px-4 py-3 text-netflix-lightGray">{movie.genre}</td>
                      <td className="px-4 py-3 text-netflix-lightGray">{movie.year}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/movie/${movie._id}`}
                          target="_blank"
                          className="mr-2 rounded bg-blue-600 px-3 py-1 text-sm text-white"
                        >
                          Voir
                        </Link>
                        <button
                          onClick={() => handleDelete(movie._id)}
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}