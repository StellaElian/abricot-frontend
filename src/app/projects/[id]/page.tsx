'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProjectDetailsPage() {

    // FAUSSES DONNÉES TEMPORAIRES POUR L'INTÉGRATION
    const mockProjectTasks = [
        { id: 1, title: "Authentification JWT", description: "Implémenter le système d'authentification avec tokens JWT", dueDate: "9 mars", status: "TODO", comments: 1, assignees: [{ init: "BD", name: "Bertrand Dupont" }, { init: "AD", name: "Anne Dupont" }] },
        { id: 2, title: "Authentification JWT", description: "Implémenter le système d'authentification avec tokens JWT", dueDate: "9 mars", status: "IN_PROGRESS", comments: 1, assignees: [{ init: "BD", name: "Bertrand Dupont" }, { init: "AD", name: "Anne Dupont" }] },
        { id: 3, title: "Authentification JWT", description: "Implémenter le système d'authentification avec tokens JWT", dueDate: "9 mars", status: "DONE", comments: 1, assignees: [{ init: "BD", name: "Bertrand Dupont" }, { init: "AD", name: "Anne Dupont" }] },
    ];

    const formatStatus = (status: string) => {
        if (status === 'TODO') return 'À faire';
        if (status === 'IN_PROGRESS') return 'En cours';
        if (status === 'DONE') return 'Terminée';
        return 'À faire'; // Par défaut
    };

    return (
        // CONTENEUR GLOBAL AVEC LES DEUX COULEURS DE FOND
        // Le min-h-screen permet à la page de prendre toute la hauteur de l'écran
        <div className="min-h-screen bg-[#F9FAFB] font-sans">
            {/* ================= EN-TÊTE DU PROJET ================= */}
            <div className="w-[1320px] mx-auto pt-[78px] flex flex-col mb-[14px] ml-[44px]">

                {/* LIGNE DU HAUT : Retour + Infos + Boutons */}
                <div className="flex items-start gap-[16px] mb-[49px]">

                    {/* BOUTON RETOUR (Flèche) */}
                    <Link href="/projects" className="w-[57px] h-[57px] bg-white border border-[#E5E7EB] rounded-[10px] flex items-center justify-center hover:bg-gray-50 transition shrink-0 cursor-pointer">
                        <Image src="/line3.svg" alt="Flèche retour" width={15} height={1} />
                    </Link>

                    {/* RESTE DE L'EN-TÊTE (Titre, Desc, Boutons) */}
                    <div className="flex flex-col w-full">

                        <div className="flex justify-between items-start w-full">
                            {/* Titre et Modifier */}
                            <div className="flex items-center gap-[14px] mb-[14px]">
                                <h1 className="text-[24px] font-semibold text-[#1F1F1F]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                    Nom du projet
                                </h1>
                                <button className="text-[#D3590B] text-[14px] font-regular underline cursor-pointer hover:opacity-80 transition" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Modifier
                                </button>
                            </div>

                            {/* Boutons (Créer une tâche + IA) */}
                            <div className="flex gap-[12px] h-[50px] shrink-0">
                                <button className="w-[141px] h-[50px] bg-[#1F1F1F] text-[#FFFFFF] rounded-[10px] text-[16px] font-regular flex items-center justify-center cursor-pointer hover:bg-black transition">
                                    Créer une tâche
                                </button>
                                <button className="w-[94px] h-[50px] bg-[#D3590B] text-[#FFFFFF] rounded-[10px] text-[16px] font-regular flex items-center justify-center gap-[10px] cursor-pointer hover:opacity-90 transition" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    <Image src="/star.svg" alt="IA" width={21} height={21} />
                                    IA
                                </button>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-[16px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Développement de la nouvelle version de l'API REST avec authentification JWT
                        </p>

                    </div>
                </div>

                {/* BARRE DES CONTRIBUTEURS (Le fameux fond F3F4F6) */}
                <div className="w-full h-[67px] bg-[#F3F4F6] rounded-[8px] flex items-center pl-[64px]">
                    <span className="text-[14px] text-[#1F1F1F] font-medium mr-[8px]" style={{ fontFamily: "'Inter', sans-serif" }}>Contributeurs</span>
                    <span className="text-[14px] text-[#6B7280] mr-[24px]" style={{ fontFamily: "'Inter', sans-serif" }}>3 personnes</span>

                    <div className="flex items-center gap-[8px]">
                        {/* 1. Propriétaire (AD) */}
                        <div className="flex items-center gap-[4px]">
                            <div className="w-[27px] h-[27px] rounded-full bg-[#FFE8D9] border border-[#FFFFFF] flex items-center justify-center text-[#D3590B] text-[10px] font-semibold font-sans z-10">AD</div>
                            <div className="h-[25px] bg-[#FFE8D9] rounded-[50px] px-[16px] flex items-center justify-center text-[#D3590B] text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>Propriétaire</div>
                        </div>
                        {/* 2. Contributeur (BD) */}
                        <div className="flex items-center gap-[4px]">
                            <div className="w-[27px] h-[27px] rounded-full bg-[#E5E7EB] border border-[#FFFFFF] flex items-center justify-center text-[#6B7280] text-[10px] font-semibold font-sans z-10">BD</div>
                            <div className="h-[25px] bg-[#E5E7EB] rounded-[50px] px-[16px] flex items-center justify-center text-[#6B7280] text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>Bertrand Dupont</div>
                        </div>
                        {/* 3. Contributeur (AD) */}
                        <div className="flex items-center gap-[4px]">
                            <div className="w-[27px] h-[27px] rounded-full bg-[#E5E7EB] border border-[#FFFFFF] flex items-center justify-center text-[#6B7280] text-[10px] font-semibold font-sans z-10">AD</div>
                            <div className="h-[25px] bg-[#E5E7EB] rounded-[50px] px-[16px] flex items-center justify-center text-[#6B7280] text-[14px]" style={{ fontFamily: "'Inter', sans-serif" }}>Anne Dupont</div>
                        </div>
                    </div>
                </div>



            </div >


            {/* ================= CORPS DU PROJET (Fond gris clair F9FAFB) ================= */}
            < div className="w-full pt-[40px] pb-[60px]" >
                <div className="w-[1215px] ml-[112px] flex flex-col">


                    {/* 1. EN-TÊTE DES TÂCHES ET FILTRES */}
                    <div className="flex justify-between items-center w-full mb-[40px]">

                        {/* Côté Gauche : Titre et Sous-titre */}
                        <div className="flex flex-col">
                            <h2 className="text-[18px] font-semibold text-[#1F1F1F] leading-none mb-[8px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                Tâches
                            </h2>
                            <p className="text-[16px] text-[#6B7280] leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>
                                par ordre de priorité
                            </p>
                        </div>

                        {/* Côté Droit : Boutons Filtres et Recherche */}
                        <div className="flex items-center">

                            {/* 1. Bouton "Liste" (94x45px) */}
                            <button className="w-[94px] h-[45px] flex items-center bg-[#FFE8D9] border border-[#FFE8D9] rounded-[8px] cursor-pointer mr-[10px]">
                                <div className="pl-[16px] pr-[14px] flex items-center justify-center">
                                    <Image src="/list.svg" alt="Liste" width={16} height={16} />
                                </div>
                                <span className="text-[#D3590B] text-[14px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Liste
                                </span>
                            </button>

                            {/* 2. Bouton "Calendrier" (130x45px) */}
                            <button className="w-[130px] h-[45px] flex items-center bg-white border border-[#E5E7EB] rounded-[8px] cursor-pointer mr-[16px]">
                                <div className="pl-[16px] pr-[14px] flex items-center justify-center">
                                    <Image src="/logokanban.svg" alt="Calendrier" width={15} height={15} />
                                </div>
                                <span className="text-[#D3590B] text-[14px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Calendrier
                                </span>
                            </button>

                            {/* 3. Bouton "Statut" (152x63px) */}
                            <button className="relative w-[152px] h-[63px] bg-white border border-[#E5E7EB] rounded-[8px] flex items-center cursor-pointer mr-[16px]">
                                <span className="absolute left-[32px] text-[#1F1F1F] text-[14px] font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Statut
                                </span>
                                <div className="absolute right-[31px]">
                                    <Image src="/vector.svg" alt="Flèche bas" width={12} height={8} />
                                </div>
                            </button>

                            {/* 4. Barre de recherche (283x63px) */}
                            <div className="relative w-[283px] h-[63px]">
                                <input
                                    type="text"
                                    placeholder="Rechercher une tâche"
                                    className="w-full h-full border border-[#E5E7EB] rounded-[8px] bg-white pl-[24px] pr-[50px] text-[14px] text-[#6B7280] outline-none focus:border-[#D3590B] transition"
                                />
                                <div className="absolute right-[24px] top-[23.5px] pointer-events-none flex items-center justify-center">
                                    <Image src="/search.svg" alt="Recherche" width={16} height={16} />
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* 2. LA LISTE DES TÂCHES (Le gros bloc principal) */}
                    <div className="w-full h-auto bg-white border border-[#E5E7EB] rounded-[10px] flex flex-col gap-[17px] p-[40px]">

                        {mockProjectTasks.map((task) => {
                            const frenchStatus = formatStatus(task.status);

                            return (
                                <div key={task.id} className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] flex flex-col hover:shadow-sm transition-shadow">

                                    {/* HAUT DE LA CARTE (Titre, Description, Échéance, Assignés + Bouton ...) */}
                                    <div className="p-[24px] flex justify-between items-start">

                                        <div className="flex flex-col w-full max-w-[850px]">
                                            {/* Ligne 1 : Titre + Badge Statut (Corrigé !) */}
                                            <div className="flex items-center gap-[8px] mb-[8px]">
                                                <h3 className="text-[18px] font-semibold text-[#1F1F1F] leading-none" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                                    {task.title}
                                                </h3>
                                                {/* Badge de statut dynamisé avec couleurs de ta maquette */}
                                                {frenchStatus === "À faire" ? (
                                                    <div className="bg-[#FEF2F2] text-[#EF4444] px-[16px] py-[4px] rounded-[50px] text-[12px] font-normal">{frenchStatus}</div>
                                                ) : frenchStatus === "En cours" ? (
                                                    <div className="bg-[#FFF7ED] text-[#F97316] px-[16px] py-[4px] rounded-[50px] text-[12px] font-normal">{frenchStatus}</div>
                                                ) : (
                                                    <div className="bg-[#F0FDF4] text-[#22C55E] px-[16px] py-[4px] rounded-[50px] text-[12px] font-normal">{frenchStatus}</div>
                                                )}
                                            </div>

                                            {/* Ligne 2 : Description (Coupée à 2 lignes maximum) */}
                                            <p className="text-[14px] text-[#6B7280] mb-[24px] line-clamp-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                {task.description}
                                            </p>

                                            {/* Ligne 3 : Échéance (Avec Icône Calendrier logoag.svg !) */}
                                            <div className="flex items-center gap-[8px] mb-[16px] text-[12px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                <span className="font-medium text-[#1F1F1F]">Échéance :</span>
                                                <Image src="/logoag.svg" alt="Agenda" width={15} height={15} />
                                                <span>{task.dueDate}</span>
                                            </div>

                                            {/* Ligne 4 : Assigné à */}
                                            <div className="flex items-center gap-[8px] text-[12px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                <span className="font-medium text-[#1F1F1F]">Assigné à :</span>
                                                {task.assignees.map((assignee, i) => (
                                                    <div key={i} className="flex items-center gap-[4px] bg-[#F3F4F6] rounded-[50px] px-[8px] py-[4px]">
                                                        {/* Petit Rond d'avatar gris */}
                                                        <div className="w-[20px] h-[20px] rounded-full bg-[#E5E7EB] border border-[#FFFFFF] flex items-center justify-center text-[#6B7280] text-[8px] font-semibold">
                                                            {assignee.init}
                                                        </div>
                                                        <span>{assignee.name}</span>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>

                                        {/* Bouton "..." (Options point.svg) à droite */}
                                        <button className="w-[57px] h-[57px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-50 transition mt-[8px] mr-[11px]">
                                            <Image src="/point.svg" alt="Options" width={16} height={4} />
                                        </button>

                                    </div>

                                    {/* SÉPARATEUR DE CARTE (line2.svg) */}
                                    <div className="w-full h-[1px]">
                                        <Image src="/line2.svg" alt="Séparateur" width={1017} height={1} className="w-full object-cover" />
                                    </div>

                                    {/* BAS DE LA CARTE (Commentaires FAFAFA) */}
                                    <div className="px-[24px] py-[16px] flex justify-between items-center bg-[#FAFAFA] rounded-b-[10px]">
                                        <span className="text-[14px] text-[#6B7280] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                                            Commentaires ({task.comments})
                                        </span>
                                        <button className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer hover:opacity-70 transition">
                                            <Image src="/more.svg" alt="Voir plus" width={14} height={8} />
                                        </button>
                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </div>
            </div >

        </div >
    );
}