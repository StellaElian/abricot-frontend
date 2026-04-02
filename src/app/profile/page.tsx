'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) return;

                // SOLUTION : La même route qui marche !
                const res = await fetch('http://localhost:8000/projects', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const jsonResponse = await res.json();
                    let allProjects = [];
                    if (Array.isArray(jsonResponse.data)) allProjects = jsonResponse.data;
                    else if (jsonResponse.data && Array.isArray(jsonResponse.data.projects)) allProjects = jsonResponse.data.projects;
                    else if (Array.isArray(jsonResponse)) allProjects = jsonResponse;

                    // On récupère le propriétaire (toi)
                    if (allProjects.length > 0 && allProjects[0].owner) {
                        setUser(allProjects[0].owner);
                    }
                }
            } catch (err) {
                console.error("Erreur API", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // ==========================================
    // TA LOGIQUE EXACTE :
    // ==========================================
    const fullName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Amélie Dupont';
    const firstName = user?.firstName || fullName.split(' ')[0] || 'Amélie';
    const lastName = user?.lastName || fullName.split(' ').slice(1).join(' ') || 'Dupont';
    const email = user?.email || 'a.dupont@mail.com';
    const fakePassword = '●●●●●●●●●●●●';

    if (loading) return <div className="p-10 text-center font-sans">Chargement de votre profil...</div>;

    return (
        <div className="bg-[#E5E7EB] min-h-screen pt-[57px] pb-[181px] pl-[100px] pr-[125px] font-sans">
            
            {/* TITRES AU DESSUS DU BLOC */}
            <div className="mb-[40px]">
                <h1 className="text-[24px] font-semibold text-[#1F1F1F] leading-none mb-[8px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                    Mon compte
                </h1>
                <p className="text-[16px] text-[#6B7280] leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {fullName}
                </p>
            </div>

            {/* LE GROS BLOC BLANC */}
            <div className="w-[1215px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] px-[59px] pt-[41px] pb-[40px] flex flex-col">

                {/* FORMULAIRE (Inputs empilés) */}
                <div className="flex flex-col">
                    
                    {/* BLOC NOM */}
                    <div className="mb-[24px]">
                        <label className="block text-[14px] text-[#000000] font-regular mb-[7px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                            Nom
                        </label>
                        <div className="w-[1097px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] py-[19px] flex items-center bg-[#FFFFFF]">
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
                        <div className="w-[1097px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] py-[19px] flex items-center bg-[#FFFFFF]">
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
                        <div className="w-[1097px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] py-[19px] flex items-center bg-[#FFFFFF]">
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
                        <div className="w-[1097px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] py-[19px] flex items-center bg-[#FFFFFF]">
                            <span className="text-[14px] text-[#1F1F1F] font-regular tracking-[4px]">
                                {fakePassword}
                            </span>
                        </div>
                    </div>

                </div>

                {/* LE BOUTON */}
                <button className="w-[242px] h-[50px] bg-[#1F1F1F] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-black transition">
                    <span className="text-[16px] text-[#FFFFFF] font-regular" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                        Modifier les informations
                    </span>
                </button>

            </div>
        </div>
    );
}