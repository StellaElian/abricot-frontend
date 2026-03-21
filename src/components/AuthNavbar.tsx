'use client'; // On précise que ce code est intelligent et réactif

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';

export default function AuthNavbar() {
    const pathname = usePathname(); // outil qui détecte quand on change de page
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // À chaque fois qu on change de page, on refait une vérification de sécurité
    useEffect(() => {
        const token = Cookies.get('token');
        // On transforme le token en Vrai ou Faux pour la mémoire
        setIsAuthenticated(!!token);
    }, [pathname]);

    if (pathname === '/login' || pathname === '/register'){
        return null;
    }

    return (
        <nav className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex gap-6 items-center">
                <div className="font-bold text-xl text-orange-500">🍑 Abricot</div>

                {/* On affiche ces liens SEULEMENT si on a un badge VIP */}
                {isAuthenticated && (
                    <>
                        <Link href="/dashboard" className="hover:text-orange-400">Dashboard</Link>
                        <Link href="/projects" className="hover:text-orange-400">Projets</Link>
                        <Link href="/tasks" className="hover:text-orange-400">Tâches</Link>
                    </>
                )}
            </div>

            <div>
                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <Link href="/profile" className="hover:text-orange-400 font-medium">
                            Mon Profil
                        </Link>
                        <LogoutButton />
                    </div>
                ) : (
                    <Link href="/login" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-bold transition">
                        Se connecter
                    </Link>
                )}
            </div>
        </nav>
    );
}