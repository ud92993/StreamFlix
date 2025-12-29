'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-netflix-black via-netflix-darkGray to-netflix-black px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/">
            <h1 className="text-5xl font-bold text-netflix-red">StreamFlix</h1>
          </Link>
          <p className="mt-2 text-netflix-lightGray">Espace d&apos;administration</p>
        </div>

        {/* Formulaire de connexion */}
        <div className="rounded-lg bg-netflix-darkGray p-8 shadow-2xl">
          <h2 className="mb-6 text-2xl font-bold text-white">Connexion Admin</h2>

          {error && (
            <div className="mb-4 rounded-md bg-red-900/50 p-4 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-netflix-gray px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
                placeholder="admin@streaming.com"
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-md bg-netflix-gray px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
                placeholder="••••••••"
              />
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-netflix-red px-6 py-3 font-semibold text-white transition-colors hover:bg-netflix-red/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Lien retour */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-netflix-lightGray hover:text-white"
            >
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>

        {/* Note de sécurité */}
        <div className="mt-6 rounded-md bg-netflix-gray/30 p-4">
          <p className="text-center text-xs text-netflix-lightGray">
            🔒 Connexion sécurisée avec chiffrement SSL
          </p>
        </div>
      </div>
    </div>
  );
}
