'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = Cookies.get('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // APPEL DELA BONNE ROUTE
                const res = await fetch('http://localhost:8000/auth/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const json = await res.json();
                    // On récupère les données de la même manière que pour la Navbar
                    const userData = json.data?.user || json.data || json.user || json;
                    setUser(userData);
                }
            } catch (err) {
                console.error("Erreur de récupération du profil:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // LOGIQUE DE FORMATAGE DYNAMIQUE
    
    // 1 On récupère d'abord le nom complet
    const fullName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || '';
    
    // 2 On coupe le nom complet en deux (initiales)
    const firstName = user?.firstName || (fullName ? fullName.split(' ')[0] : '');
    const lastName = user?.lastName || (fullName ? fullName.split(' ').slice(1).join(' ') : '');
    
    const email = user?.email || '';
    const fakePassword = '●●●●●●●●●●●●';


    // Écran d'attente
    if (loading) return <div className="p-10 text-center font-sans">Chargement de votre profil...</div>;

    return (
        // CONTENEUR GLOBAL 
        <div className="bg-[#F3F4F6] min-h-screen pt-[57px] pb-[181px] pl-[100px] pr-[125px] font-sans">
            
            {/* LE GROS BLOC BLANC */}
            <div className="w-[1215px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[59px] pt-[40px] pb-[59px] flex flex-col mx-auto">

                {/* TITRES À L'INTÉRIEUR DU BLOC */}
                <div className="mb-[41px]">
                    <h1 className="text-[24px] font-semibold text-[#1F1F1F] mb-[8px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                        Mon compte
                    </h1>
                    <p className="text-[16px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {fullName}
                    </p>
                </div>

                {/* FORMULAIRE */}
                <div className="flex flex-col">
                    
                    {/* BLOC NOM */}
                    <div className="mb-[24px]">
                        <label className="block text-[14px] text-[#000000] font-regular mb-[7px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                            Nom
                        </label>
                        <div className="w-[1097px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] flex items-center bg-[#FFFFFF]">
                            <span className="text-[12px] text-[#6B7280] font-regular" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                                {lastName}
                            </span>
                        </div>
                    </div>

                    {/* BLOC PRÉNOM */}
                    <div className="mb-[24px]">
                        <label className="block text-[14px] text-[#000000] font-regular mb-[7px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                            Prénom
                        </label>
                        <div className="w-[1097px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] flex items-center bg-[#FFFFFF]">
                            <span className="text-[12px] text-[#6B7280] font-regular" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                                {firstName}
                            </span>
                        </div>
                    </div>

                    {/* BLOC EMAIL */}
                    <div className="mb-[24px]">
                        <label className="block text-[14px] text-[#000000] font-regular mb-[7px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                            Email
                        </label>
                        <div className="w-[1097px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] flex items-center bg-[#FFFFFF]">
                            <span className="text-[12px] text-[#6B7280] font-regular" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                                {email}
                            </span>
                        </div>
                    </div>

                    {/* BLOC MOT DE PASSE */}
                    <div className="mb-[41px]">
                        <label className="block text-[14px] text-[#000000] font-regular mb-[7px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                            Mot de passe
                        </label>
                        <div className="w-[1097px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] flex items-center bg-[#FFFFFF]">
                            <span className="text-[14px] text-[#1F1F1F] font-regular tracking-[4px]">
                                {fakePassword}
                            </span>
                        </div>
                    </div>

                </div>

                {/* BOUTON */}
                <button className="w-[242px] h-[50px] bg-[#1F1F1F] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-black transition self-start">
                    <span className="text-[16px] text-[#FFFFFF] font-regular" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                        Modifier les informations
                    </span>
                </button>

            </div>
        </div>
    );
}