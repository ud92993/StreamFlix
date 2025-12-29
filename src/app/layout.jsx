import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'StreamFlix - Votre plateforme de streaming',
  description: 'Regardez vos films préférés en streaming HD',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-netflix-black text-white`}>
        {children}
      </body>
    </html>
  );
}