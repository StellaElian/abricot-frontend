import type { Metadata } from 'next';
import './globals.css';
// On importe notre nouvelle barre magique
import AuthNavbar from '../components/AuthNavbar'; 

export const metadata: Metadata = {
  title: 'Abricot - Gestion de Projet',
  description: 'SaaS de gestion de tâches',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {/* On place notre composant AuthNavbar ici */}
        <AuthNavbar />
        
        <main className="min-h-screen bg-slate-50">
          {children}
        </main>
      </body>
    </html>
  );
}