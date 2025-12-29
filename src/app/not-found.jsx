import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-netflix-black px-4">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-netflix-red">404</h1>
        <h2 className="mb-4 text-3xl font-bold text-white">Page non trouvée</h2>
        <p className="mb-8 text-netflix-lightGray">
          Désolé, la page que vous recherchez n'existe pas.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-netflix-red px-8 py-3 font-semibold text-white transition-colors hover:bg-netflix-red/90"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}