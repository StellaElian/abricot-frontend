'use client';

import { useState, useEffect } from 'react'; // Ajout de useEffect
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation'; // Ajout pour récupérer l'ID
import Cookies from 'js-cookie'; // Ajout pour le token

export default function ProjectDetailsPage() {

    // 1. RÉCUPÉRATION DE L'ID DU PROJET DEPUIS L'URL
    const params = useParams();
    const projectId = params.id;

    // 2. STATE POUR STOCKER LES VRAIES DONNÉES DU BACKEND
    const [projectTasks, setProjectTasks] = useState<any[]>([]);

    // 3. APPEL À L'API
    useEffect(() => {
        const fetchProjectTasks = async () => {
            const token = Cookies.get('token');
            if (!token || !projectId) return;

            try {
                // Attention : Assure-toi que cette route correspond EXACTEMENT à ton Swagger
                // L'image de ton Swagger montre `/dashboard/assigned-tasks`, mais cette page
                // est censée afficher les tâches d'UN SEUL projet. 
                // Si tu as une route comme `/projects/{projectId}/tasks`, utilise-la ici.
                // Sinon, on filtre les tâches assignées par projet.

                const response = await fetch(`http://localhost:8000/dashboard/assigned-tasks`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (response.ok) {
                    const json = await response.json();

                    if (json.success && json.data && json.data.tasks) {
                        // Si le endpoint ramène toutes les tâches, on filtre par l'ID du projet actuel
                        // Si le endpoint ramène DÉJÀ les tâches du bon projet, enlève le .filter()
                        const filteredTasks = json.data.tasks.filter((task: any) => task.projectId === projectId);
                        setProjectTasks(filteredTasks);
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des tâches du projet :", error);
            }
        };

        fetchProjectTasks();
    }, [projectId]); // Le useEffect se relance si l'ID du projet change

    // Fonction outil pour traduire les statuts (Inchangée)
    const formatStatus = (status: string) => {
        if (status === 'TODO') return 'À faire';
        if (status === 'IN_PROGRESS') return 'En cours';
        if (status === 'DONE') return 'Terminée';
        return 'À faire';
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
                        <p className="text-[18px] text-[#6B7280] font-regular " style={{ fontFamily: "'Inter', sans-serif" }}>
                            Développement de la nouvelle version de l'API REST avec authentification JWT
                        </p>

                    </div>
                </div>
                {/* BARRE DES CONTRIBUTEURS */}
                <div className="w-[1255px] h-[67px] bg-[#F3F4F6] rounded-[10px] flex items-center ml-[60px] pl-[50px]">
                    <span className="text-[18px] text-[#1F1F1F] font-[600] mr-[8px]" style={{ fontFamily: "'Manrope', sans-serif" }}>Contributeurs</span>
                    <span className="text-[16px] text-[#6B7280] pr-[450px]" style={{ fontFamily: "'Inter', sans-serif" }}>3 personnes</span>

                    <div className="flex items-center gap-[8px]">
                        {/* 1. Propriétaire (AD) */}
                        <div className="flex items-center gap-[5px]">
                            <div className="w-[27px] h-[27px] rounded-full bg-[#FFE8D9] flex items-center justify-center text-[#D3590B] text-[10px] font-semibold font-sans z-10">AD</div>
                            <div className="h-[25px] w-[109px] bg-[#FFE8D9] rounded-[50px] px-[16px] flex items-center justify-center text-[#D3590B] text-[14px] font-regular" style={{ fontFamily: "'Inter', sans-serif" }}>Propriétaire</div>
                        </div>
                        {/* 2. Contributeur (BD) */}
                        <div className="flex items-center gap-[5px]">
                            <div className="w-[27px] h-[27px] rounded-full bg-[#E5E7EB] border border-[#FFFFFF] flex items-center justify-center text-[#0F0F0F] text-[10px] font-regular font-sans z-10">BD</div>
                            <div className="h-[25px] w-[143px] bg-[#E5E7EB] rounded-[50px] px-[16px] flex items-center justify-center text-[#6B7280] text-[14px] font-regular" style={{ fontFamily: "'Inter', sans-serif" }}>Bertrand Dupont</div>
                        </div>
                        {/* 3. Contributeur (AD) */}
                        <div className="flex items-center gap-[5px]">
                            <div className="w-[27px] h-[27px] rounded-full bg-[#E5E7EB] border border-[#FFFFFF] flex items-center justify-center text-[#0F0F0F] text-[10px] font-regular font-sans z-10">AD</div>
                            <div className="h-[25px] w-[119px] bg-[#E5E7EB] rounded-[50px] px-[16px] flex items-center justify-center text-[#6B7280] text-[14px] font-regular" style={{ fontFamily: "'Inter', sans-serif" }}>Anne Dupont</div>
                        </div>
                    </div>
                </div>

            </div >


            {/* ================= CORPS DU PROJET (Fond gris clair F9FAFB) ================= */}
            < div className="w-[1255px] pt-[34px] pt-[41px] ml-[112px] " >
                <div className="flex flex-col bg-[#FFFFFF] rounded-[10px] border border-[#E5E7EB] pb-[40px]">


                    {/* 1. EN-TÊTE DES TÂCHES ET FILTRES */}
                    <div className="flex justify-between items-center w-full mb-[41px] pl-[59px] pt-[40px]">

                        {/* Côté Gauche : Titre et Sous-titre */}
                        <div className="flex flex-col">
                            <h2 className="text-[18px] font-semibold text-[#1F1F1F] mb-[8px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                Tâches
                            </h2>
                            <p className="text-[16px] text-[#6B7280] font-regular" style={{ fontFamily: "'Inter', sans-serif" }}>
                                par ordre de priorité
                            </p>
                        </div>

                        {/* Côté Droit : Boutons et Recherche */}
                        <div className="flex items-center pr-[59px] w-[701px] h-[63px]">

                            {/* 1. Bouton "Liste"  */}
                            <button className="w-[94px] h-[45px] flex items-center bg-[#FFE8D9] rounded-[8px] cursor-pointer mr-[10px]">
                                <div className="pl-[16px] pr-[14px] flex items-center justify-center">
                                    <Image src="/list.svg" alt="Liste" width={16} height={16} />
                                </div>
                                <span className="text-[#D3590B] text-[14px] font-regular" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Liste
                                </span>
                            </button>

                            {/* 2. Bouton "Calendrier" (130x45px) */}
                            <button className="w-[130px] h-[45px] flex items-center bg-white rounded-[8px] cursor-pointer mr-[16px]">
                                <div className="pl-[16px] pr-[14px] flex items-center justify-center">
                                    <Image src="/logokanban.svg" alt="Calendrier" width={15} height={15.38} />
                                </div>
                                <span className="text-[#D3590B] text-[14px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Calendrier
                                </span>
                            </button>

                            {/* 3. Bouton "Statut" */}
                            <button className="relative w-[152px] h-[63px] bg-white border border-[#E5E7EB] rounded-[8px] flex items-center cursor-pointer mr-[16px]">
                                <span className="absolute left-[32px] text-[#6B7280] text-[14px] font-regular" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    Statut
                                </span>
                                <div className="absolute right-[31px]">
                                    <Image src="/vector.svg" alt="Flèche bas" width={16} height={8} />
                                </div>
                            </button>

                            {/* 4. Barre de recherche */}
                            <div className="relative w-[283px] h-[63px]">
                                <input
                                    type="text"
                                    placeholder="Rechercher une tâche"
                                    className="w-full h-full border border-[#E5E7EB] rounded-[8px] bg-white pl-[32px] pr-[59px] text-[14px] text-[#6B7280] outline-none focus:border-[#D3590B] transition"
                                />
                                <div className="absolute right-[32px] top-[24.55px] pointer-events-none flex items-center justify-center">
                                    <Image src="/search.svg" alt="Recherche" width={13.9} height={13.9} />
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* 2. LA LISTE DES TÂCHES (Le gros bloc principal) */}
                    <div className="w-full h-auto bg-white flex flex-col gap-[17px] pl-[59px]">

                        {projectTasks.map((task) => {
                            const frenchStatus = formatStatus(task.status);

                            return (
                                <div key={task.id} className="w-[1090px] h-[263.54px] pl-[40px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] flex flex-col hover:shadow-sm transition-shadow">

                                    {/* HAUT DE LA CARTE (Titre, Description, Échéance, Assignés + Bouton ...) */}
                                    <div className="p-[25px] flex justify-between items-start">

                                        <div className="flex flex-col max-w-[942px]">
                                            {/* Ligne 1 : Titre + Badge Statut */}
                                            <div className="flex items-center gap-[8px] mb-[7px]">
                                                <h3 className="text-[18px] font-semibold text-[#000000]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                                    {task.title}
                                                </h3>
                                                {/* Badge de statut dynamisé avec les couleurs */}
                                                {frenchStatus === "À faire" ? (
                                                    <div className="w-[75px] h-[25px] bg-[#FFE0E0] flex items-center justify-center text-[#EF4444] px-[16px] py-[4px] rounded-[50px] text-[14px] font-regular">{frenchStatus}</div>
                                                ) : frenchStatus === "En cours" ? (
                                                    <div className="w-[90px] h-[25px] bg-[#FFF0D7] flex items-center justify-center text-[#E08D00] px-[16px] py-[4px] rounded-[50px] text-[14px] font-regular">{frenchStatus}</div>
                                                ) : (
                                                    <div className="w-[94px] h-[25px] bg-[#F1FFF7] flex items-center justify-center text-[#27AE60] px-[16px] py-[4px] rounded-[50px] text-[14px] font-regular">{frenchStatus}</div>
                                                )}
                                            </div>

                                            {/* Ligne 2 : Description */}
                                            <p className="text-[14px] text-[#6B7280] mb-[32px] font-regular" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                {task.description}
                                            </p>

                                            {/* Ligne 3 : Échéance  */}
                                            <div className="flex items-center gap-[8px] mb-[24px] text-[12px] text-[#6B7280] font-regular" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                <span className="font-regular text-[#6B7280] gap-[4px]">Échéance :</span>
                                                <Image src="/union.svg" alt="Agenda" width={15} height={16.54} />
                                                <span className="font-regular text-[#1F1F1F] text-[12px]" style={{ fontFamily: "'Inter', sans-serif" }}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : "Date inconnue"}</span>
                                            </div>

                                            {/* Ligne 4 : Assigné à */}
                                            <div className="flex items-center gap-[8px] text-[12px] text-[#6B7280] font-regular " style={{ fontFamily: "'Inter', sans-serif" }}>
                                                <span>Assigné à :</span>

                                                {/* On boucle sur les vrais assignés renvoyés par le backend */}
                                                {task.assignees && task.assignees.length > 0 ? (
                                                    task.assignees.map((assignee: any, index: number) => {
                                                        // On récupère le nom complet, que le backend utilise "firstName" + "lastName"
                                                        const fullName = `${assignee.firstName || ''} ${assignee.lastName || ''}`.trim() || 'Inconnu';
                                                        // On génère les initiales
                                                        const initials = fullName !== 'Inconnu' ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

                                                        return (
                                                            <div key={index} className="flex items-center gap-[5px]">
                                                                <div className="w-[27px] h-[27px] rounded-full bg-[#E5E7EB] border border-[#FFFFFF] flex items-center justify-center text-[#0F0F0F] text-[10px] font-regular font-sans z-10">
                                                                    {initials}
                                                                </div>
                                                                <div className="h-[25px] px-[16px] bg-[#E5E7EB] rounded-[50px] flex items-center justify-center text-[#6B7280] text-[14px] font-regular" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                                    {fullName}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <span>Aucun assigné</span>
                                                )}
                                            </div>


                                        </div>

                                        {/* Bouton "..." */}
                                        <button className="w-[57px] h-[57px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-50 transition mt-[8px] mr-[11px]">
                                            <Image src="/plus.svg" alt="Options" width={15} height={4} />
                                        </button>

                                    </div>

                                    {/* SÉPARATEUR DE CARTE (line2.svg) */}
                                    <div className="pl-[18px] mt-[5px]">
                                        <Image src="/line2.svg" alt="Séparateur" width={1000} height={2} />
                                    </div>

                                    {/* BAS DE LA CARTE (Commentaires) */}
                                    <div className="pl-[30px] mt-[10px] flex items-center justify-between w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        <span className="text-[14px] text-[#1F1F1F] font-regular">
                                            {/* On affiche la longueur du tableau, ou 0 s'il n'y a pas de commentaires */}
                                            Commentaires ({task.comments ? task.comments.length : 0})
                                        </span>
                                        <button className="pr-[40px] flex items-center justify-center cursor-pointer hover:opacity-70 transition">
                                            <Image src="/more.svg" alt="Voir plus" width={16} height={8} />
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