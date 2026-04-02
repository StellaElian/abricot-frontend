'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie'; 
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AuthNavbar() {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // 1. AUCUNE VALEUR PAR DÉFAUT.
    const [userInitials, setUserInitials] = useState('');

    useEffect(() => {
        const token = Cookies.get('token');
        setIsAuthenticated(!!token);

        const fetchUserInfos = async () => {
            if (!token) return;
            try {
                const res = await fetch('http://localhost:8000/auth/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const json = await res.json();
                    
                    // On cherche l'utilisateur (ça gère tous les cas possibles dubackend)
                    const userData = json.data?.user || json.data || json.user || json;
                    
                    // On récupère le vrai nom
                    const firstName = userData.firstName || '';
                    const lastName = userData.lastName || '';
                    const fullName = userData.name || `${firstName} ${lastName}`.trim();
                    
                    // On calcule dynamiquement et on remplit la bulle
                    if (fullName) {
                        const parts = fullName.split(' ');
                        const initials = parts.length > 1 
                            ? (parts[0][0] + parts[1][0]).toUpperCase() 
                            : fullName.substring(0, 2).toUpperCase();
                        
                        setUserInitials(initials);
                    }
                }
            } catch (error) {
                console.error("Erreur API:", error);
            }
        };

        fetchUserInfos();
    }, [pathname]);

    if (pathname === '/login' || pathname === '/register') return null;
    if (!isAuthenticated) return null;

    const isActive = (path: string) => pathname.startsWith(path);
    const isProfilePage = pathname === '/profile';

    return (
        <nav className="w-full h-[94px] bg-[#FFFFFF] border-b border-gray-100 flex items-center justify-between px-[100px] relative font-sans">
            <div className="flex-shrink-0">
                <Link href="/dashboard">
                    <Image src="/logoabricot.svg" alt="Logo Abricot" width={147} height={37} priority />
                </Link>
            </div>

            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-[16px] w-[512px] h-[78px]">
                <Link
                    href="/dashboard"
                    className={`flex items-center justify-center gap-[10px] w-[248px] h-[78px] rounded-[10px] transition-colors ${isActive('/dashboard') ? 'bg-[#0F0F0F] text-[#FFFFFF]' : 'bg-[#FFFFFF] text-[#D3590B] hover:bg-orange-50'}`}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                        <path d="M9.25 0H1.75C0.785 0 0 0.785 0 1.75V6.25C0 7.215 0.785 8 1.75 8H9.25C10.215 8 11 7.215 11 6.25V1.75C11 0.785 10.215 0 9.25 0Z" fill="currentColor" />
                        <path d="M9.25 10H1.75C0.785 10 0 10.785 0 11.75V22.25C0 23.215 0.785 24 1.75 24H9.25C10.215 24 11 23.215 11 22.25V11.75C11 10.785 10.215 10 9.25 10Z" fill="currentColor" />
                        <path d="M22.25 16H14.75C13.785 16 13 16.785 13 17.75V22.25C13 23.215 13.785 24 14.75 24H22.25C23.215 24 24 23.215 24 22.25V17.75C24 16.785 23.215 16 22.25 16Z" fill="currentColor" />
                        <path d="M22.25 0H14.75C13.785 0 13 0.785 13 1.75V12.25C13 13.215 13.785 14 14.75 14H22.25C23.215 14 24 13.215 24 12.25V1.75C24 0.785 23.215 0 22.25 0Z" fill="currentColor" />
                    </svg>
                    <span className="text-[14px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Tableau de bord</span>
                </Link>

                <Link
                    href="/projects"
                    className={`flex items-center justify-center gap-[10px] w-[248px] h-[78px] rounded-[10px] transition-colors ${isActive('/projects') ? 'bg-[#0F0F0F] text-[#FFFFFF]' : 'bg-[#FFFFFF] text-[#D3590B] hover:bg-orange-50'}`}
                >
                    <svg width="24" height="19" viewBox="0 0 29 23" fill="none" xmlns="http://www.w3.org/2000/svg" className="fill-current">
                        <path d="M26.5791 9.08691C27.4428 9.08698 28.2214 9.51204 28.6621 10.2227C29.0726 10.8866 29.1117 11.6992 28.7646 12.3965L24.3672 21.209C23.9765 21.9918 23.1766 22.4873 22.3018 22.4873H1.83984C0.970986 22.4873 0.240875 21.9031 0.0488281 21.1221L5.13672 10.4561C5.52599 9.62428 6.3926 9.08699 7.3457 9.08691H26.5791ZM8.66699 0C9.25766 6.22332e-05 9.81079 0.279265 10.1455 0.748047L12.0352 3.39062C12.0391 3.3935 12.05 3.39843 12.0654 3.39844H22.626C23.616 3.39852 24.4219 4.17503 24.4219 5.12988V7.44629H6.31055C5.35695 7.44629 4.48933 7.9845 4.10059 8.81641L0 17.4141V1.73145C2.66478e-05 0.776583 0.805427 6.71615e-05 1.7959 0H8.66699Z" fill="currentColor" />
                    </svg>
                    <span className="text-[14px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>Projets</span>
                </Link>
            </div>

            <div className="flex-shrink-0 flex justify-end">
                <Link 
                    href="/profile" 
                    className={`flex items-center justify-center w-[65px] h-[65px] rounded-full transition-all cursor-pointer ${
                        isProfilePage 
                            ? 'bg-[#D3590B] text-[#FFFFFF]' 
                            : 'bg-[#FFE8D9] text-[#0F0F0F] hover:ring-2 ring-orange-300'
                    }`}
                >
                    {/* On affiche les initiales seulement si on les a trouvées */}
                    {userInitials && (
                        <span className="text-[14px] font-normal tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {userInitials}
                        </span>
                    )}
                </Link>
            </div>
        </nav>
    );
}