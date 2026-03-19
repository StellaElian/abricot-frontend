import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import LogoutButton from '../components/LogoutButton';

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
        <nav className="bg-slate-900 text-white p-4 flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <div className="font-bold text-xl text-orange-500">🍑 Abricot</div>
            <Link href="/dashboard" className="hover:text-orange-400">Dashboard</Link>
            <Link href="/projects" className="hover:text-orange-400">Projets</Link>
            <Link href="/tasks" className="hover:text-orange-400">Tâches</Link>
          </div>
          <LogoutButton />
        </nav>

        {/* Le contenu de la page s'affichera ici */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
