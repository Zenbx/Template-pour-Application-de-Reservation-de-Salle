import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'RESAMA - Système de Réservation et Management Académique',
  description: 'Plateforme de gestion des réservations de salles et matériel pour établissements d\'enseignement',
  keywords: ['réservation', 'planning', 'salle', 'matériel', 'enseignement', 'académique'],
  authors: [{ name: 'Équipe RESAMA' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'RESAMA - Système de Réservation Académique',
    description: 'Gérez facilement vos réservations de salles et matériel',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className={`${poppins.className} antialiased bg-gray-50`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
