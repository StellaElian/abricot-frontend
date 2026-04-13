'use client';

import { useState, useEffect } from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation'; // Ajout pour récupérer l'ID
import Cookies from 'js-cookie';
import EditProjectModal from '@/src/components/EditProjectModal';
import EditTaskModal from '@/src/components/EditTaskModal';
import CreateTaskModal from '@/src/components/CreateTaskModal';

export default function ProjectDetailsPage() {

    // 1. RÉCUPÉRATION DE L'ID DU PROJET DEPUIS L'URL
    const params = useParams();
    const projectId = params.id;

    // STOCKER LES VRAIES DONNÉES DU BACKEND
    const [projectTasks, setProjectTasks] = useState<any[]>([]);
    const [project, setProject] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

    //  mémoires pour la modale de modification de tâche :
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);

    // Mémoire texte de new comments
    const [commentText, setCommentText] = useState('');

    // 3. APPEL À L'API (CRÉATION DU TABLEAU DES CONTRIBUTEURS)
    const contributors = project ? [
        project.owner,
        // On mappe les membres, MAIS on filtre pour exclure celui qui a le même ID que le propriétaire
        ...(project.members?.map((m: any) => m.user || m).filter((u: any) => u.id !== project.owner.id) || [])
    ].filter(Boolean) : [];

    // 4. APPEL AUX APIS
    useEffect(() => {
        const fetchAllData = async () => {
            const token = Cookies.get('token');
            //Récupération profil user
            try {
                const userRes = await fetch('http://localhost:8000/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (userRes.ok) {
                    const userJson = await userRes.json();
                    const userData = userJson.data?.user || userJson.data || userJson.user || userJson;
                    setCurrentUser(userData);
                }
            } catch (error) {
                console.error("Erreur de récupération statut utilisateur", error);
            }
            if (!token || !projectId) return;
            try {
                // --- A. RÉCUPÉRATION DE TOUTES LES TÂCHES DU PROJET ---
                const tasksResponse = await fetch(`http://localhost:8000/projects/${projectId}/tasks`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (tasksResponse.ok) {
                    const tasksJson = await tasksResponse.json();

                    if (tasksJson.data && Array.isArray(tasksJson.data.tasks)) {
                        setProjectTasks(tasksJson.data.tasks);
                    } else if (Array.isArray(tasksJson.data)) {
                        setProjectTasks(tasksJson.data);
                    } else {
                        setProjectTasks([]); // Sécurité anti-crash
                    }
                }


                /// --- RÉCUPÉRATION DU PROJET ---
                const projectResponse = await fetch(`http://localhost:8000/projects`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (projectResponse.ok) {
                    const projectJson = await projectResponse.json();
                    let allProjects = [];
                    if (Array.isArray(projectJson.data)) {
                        allProjects = projectJson.data; 
                    } else if (projectJson.data && Array.isArray(projectJson.data.projects)) {
                        allProjects = projectJson.data.projects; 
                    } else if (Array.isArray(projectJson)) {
                        allProjects = projectJson;
                    }

                    // 2. On cherche le projet qui correspond à l'ID de la page
                    const currentProject = allProjects.find((p: any) => p.id === projectId);

                    // sauvegarde
                    if (currentProject) {
                        setProject(currentProject);
                    } else {
                        console.error("⚠️ Projet introuvable parmi la liste ! ID cherché :", projectId);
                    }
                }

            } catch (error) {
                console.error("ERREUR FATALE LORS DE LA REQUÊTE :", error);
            }
        };
        fetchAllData(); // On lance la fonction
    }, [projectId]);

    const formatStatus = (status: string) => {
        if (status === 'TODO') return 'À faire';
        if (status === 'IN_PROGRESS') return 'En cours';
        if (status === 'DONE') return 'Terminée';
        return 'À faire';
    };

    // --- VÉRIFICATIONS DES RÔLES ---
    // 1- propriétaire ?
    const isOwner = currentUser && project && currentUser.id === project.owner?.id;

    // 2- un membre de l'équipe ?
    const isMember = currentUser && project && project.members?.some((m: any) => {
        const memberId = m.user?.id || m.id;
        return memberId === currentUser.id;
    });

    // 3- A-t-il le droit d'être ici ?
    const hasAccess = isOwner || isMember;

    // Si le projet et l'utilisateur sont chargés, mais qu'il n'a pas accès -> ON LE BLOQUE !
    if (project && currentUser && !hasAccess) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center font-sans">
                <h1 className="text-[24px] font-semibold text-[#1F1F1F] mb-[10px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                    Accès refusé
                </h1>
                <p className="text-[16px] text-[#6B7280] mb-[20px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Vous n'êtes ni administrateur ni contributeur de ce projet.
                </p>
                <Link href="/dashboard" className="w-[200px] h-[50px] bg-[#D3590B] text-[#FFFFFF] rounded-[10px] flex items-center justify-center hover:opacity-90 transition">
                    Retour au tableau de bord
                </Link>
            </div>
        );
    }

    // FONCTION : AJOUTER UN COMMENTAIRE
    const handleAddComment = async (taskId: string) => {
        if (!commentText.trim()) return; // On n'envoie pas de commentaire vide
        const token = Cookies.get('token');

        try {
            const response = await fetch(`http://localhost:8000/projects/${projectId}/tasks/${taskId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: commentText }) // Le backend attend le "content"
            });

            if (response.ok) {
                setCommentText(''); // On vide le champ après l'envoi
                window.location.reload();
            } else {
                alert("Erreur lors de l'ajout du commentaire.");
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
        }
    };



    return (
        // CONTENEUR GLOBAL 
        <div className="min-h-screen bg-[#F9FAFB] font-sans">
            {/* ================= EN-TÊTE DU PROJET ================= */}
            <div className="w-[1320px] mx-auto pt-[78px] flex flex-col mb-[14px] ml-[44px]">

                {/* LIGNE DU HAUT */}
                <div className="flex items-start gap-[16px] mb-[49px]">

                    {/* BOUTON RETOUR */}
                    <Link href="/projects" className="w-[57px] h-[57px] bg-white border border-[#E5E7EB] rounded-[10px] flex items-center justify-center hover:bg-gray-50 transition shrink-0 cursor-pointer">
                        <Image src="/line3.svg" alt="Flèche retour" width={15} height={1} />
                    </Link>

                    {/* RESTE DE L'EN-TÊTE (Titre, Desc, Boutons) */}
                    <div className="flex flex-col w-full">

                        <div className="flex justify-between items-start w-full">
                            {/* Titre et Modifier */}
                            <div className="flex items-center gap-[14px] mb-[14px]">
                                <h1 className="text-[24px] font-semibold text-[#1F1F1F]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                    {/* Dynamisation du Titre */}
                                    {project ? project.title || project.name : "Chargement..."}
                                </h1>

                                {/* On affiche le bouton Modifier UNIQUEMENT si c'est le propriétaire (Admin) */}
                                {isOwner && (
                                    <button
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="text-[#D3590B] text-[14px] font-regular underline cursor-pointer hover:opacity-80 transition"
                                        style={{ fontFamily: "'Inter', sans-serif" }}
                                    >
                                        Modifier
                                    </button>
                                )}

                            </div>

                            {/* Boutons (Créer une tâche + IA) */}
                            <div className="flex gap-[12px] h-[50px] shrink-0">
                                <button
                                    onClick={() => setIsCreateTaskModalOpen(true)}
                                    className="w-[141px] h-[50px] bg-[#1F1F1F] text-[#FFFFFF] rounded-[10px] text-[16px] font-regular flex items-center justify-center cursor-pointer hover:bg-black transition">
                                    Créer une tâche
                                </button>
                                <button className="w-[94px] h-[50px] bg-[#D3590B] text-[#FFFFFF] rounded-[10px] text-[16px] font-regular flex items-center justify-center gap-[10px] cursor-pointer hover:opacity-90 transition" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    <Image src="/star.svg" alt="IA" width={21} height={21} />
                                    IA
                                </button>
                            </div>
                        </div>

                        {/* Dynamisation de la Description */}
                        <p className="text-[18px] text-[#6B7280] font-regular " style={{ fontFamily: "'Inter', sans-serif" }}>
                            {project ? project.description : "Aucune description pour ce projet."}
                        </p>

                    </div>
                </div>
                {/* BARRE DES CONTRIBUTEURS */}
                <div className="w-[1255px] h-[67px] bg-[#F3F4F6] rounded-[10px] flex items-center ml-[60px] pl-[50px]">
                    <span className="text-[18px] text-[#1F1F1F] font-[600] mr-[8px]" style={{ fontFamily: "'Manrope', sans-serif" }}>Contributeurs</span>
                    {/* Le nombre de personnes se met à jour dynamiquement */}
                    <span className="text-[16px] text-[#6B7280] pr-[300px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {contributors ? contributors.length : 0} personnes
                    </span>

                    <div className="flex items-center gap-[8px]">
                        {contributors && contributors.length > 0 ? (
                            contributors.map((contributor: any, index: number) => {
                                // Récupération du nom complet
                                const fullName = contributor.name || `${contributor.firstName || ''} ${contributor.lastName || ''}`.trim() || 'Inconnu';
                                // Récupération du prénom seul (pour le propriétaire)
                                const firstName = contributor.firstName || fullName.split(' ')[0] || 'Inconnu';
                                // Génération des initiales 
                                const initials = fullName !== 'Inconnu' ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

                                // SI C'EST LE PREMIER (index === 0) -> C'est le propriétaire
                                if (index === 0) {
                                    return (
                                        <div key={index} className="flex items-center gap-[5px]">
                                            <div className="w-[27px] h-[27px] rounded-full bg-[#FFE8D9] flex items-center justify-center text-[#D3590B] text-[10px] font-semibold font-sans z-10">
                                                {initials}
                                            </div>
                                            <div className="h-[25px] px-[16px] bg-[#FFE8D9] rounded-[50px] flex items-center justify-center text-[#D3590B] text-[14px] font-regular" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                {fullName}
                                            </div>
                                        </div>
                                    );
                                }

                                // SINON (index > 0) -> Ce sont les autres contributeurs
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
                            <span className="text-[14px] text-[#6B7280] font-regular">Aucun contributeur</span>
                        )}
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

                            {/* 2. Bouton Calendrier */}
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

                    {/* 2. LA LISTE DES TÂCHES (gros bloc principal) */}
                    <div className="w-full h-auto bg-white flex flex-col gap-[17px] pl-[59px]">

                        {projectTasks.map((task) => {
                            const frenchStatus = formatStatus(task.status);

                            return (
                                <div key={task.id} className="w-[1090px] min-h-[263.54px] h-auto pl-[40px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] flex flex-col hover:shadow-sm transition-shadow">

                                    {/* HAUT DE LA CARTE (Titre, Description, Échéance, Assignés + Bouton ...) */}
                                    <div className="p-[25px] flex justify-between items-start">

                                        <div className="flex flex-col max-w-[942px]">
                                            {/* Titre + Badge Statut */}
                                            <div className="flex items-center gap-[8px] mb-[7px]">
                                                <h3 className="text-[18px] font-semibold text-[#000000]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                                                    {task.title}
                                                </h3>
                                                {frenchStatus === "À faire" ? (
                                                    <div className="w-[75px] h-[25px] bg-[#FFE0E0] flex items-center justify-center text-[#EF4444] px-[16px] py-[4px] rounded-[50px] text-[14px] font-regular">{frenchStatus}</div>
                                                ) : frenchStatus === "En cours" ? (
                                                    <div className="w-[90px] h-[25px] bg-[#FFF0D7] flex items-center justify-center text-[#E08D00] px-[16px] py-[4px] rounded-[50px] text-[14px] font-regular">{frenchStatus}</div>
                                                ) : (
                                                    <div className="w-[94px] h-[25px] bg-[#F1FFF7] flex items-center justify-center text-[#27AE60] px-[16px] py-[4px] rounded-[50px] text-[14px] font-regular">{frenchStatus}</div>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <p className="text-[14px] text-[#6B7280] mb-[32px] font-regular" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                {task.description}
                                            </p>

                                            {/* Échéance  */}
                                            <div className="flex items-center gap-[8px] mb-[24px] text-[12px] text-[#6B7280] font-regular" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                <span className="font-regular text-[#6B7280] gap-[4px]">Échéance :</span>
                                                <Image src="/union.svg" alt="Agenda" width={15} height={16.54} />
                                                <span className="font-regular text-[#1F1F1F] text-[12px]" style={{ fontFamily: "'Inter', sans-serif" }}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : "Date inconnue"}</span>
                                            </div>

                                            {/* Assigné à */}
                                            <div className="flex items-center gap-[8px] text-[12px] text-[#6B7280] font-regular " style={{ fontFamily: "'Inter', sans-serif" }}>
                                                <span>Assigné à :</span>
                                                {task.assignees && task.assignees.map((assigneeObj: any, index: number) => {
                                                    const targetId = assigneeObj.userId || assigneeObj.id;
                                                    const userProfile = assigneeObj.user || contributors.find((c: any) => c.id === targetId) || assigneeObj;
                                                    const fullName = userProfile.name || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Inconnu';
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
                                                })}
                                            </div>
                                        </div>

                                        {/* Bouton "..." */}
                                        <button
                                            onClick={() => { setSelectedTask(task); setIsEditTaskModalOpen(true) }}
                                            className="w-[57px] h-[57px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-50 transition mt-[8px] mr-[11px]"
                                        >
                                            <Image src="/plus.svg" alt="Options" width={15} height={4} />
                                        </button>
                                    </div>

                                    {/* SÉPARATEUR (ligne)  */}
                                    <div className="pl-[18px] mt-[5px]">
                                        <Image src="/line2.svg" alt="Séparateur" width={1000} height={2} />
                                    </div>

                                    {/* BAS DE LA CARTE */}
                                    <div className="flex flex-col w-full mt-[10px] pl-[20px] pb-[20px]">

                                        <div className="flex items-center justify-between w-full pr-[40px] mb-[20px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                            <span className="text-[14px] text-[#1F1F1F] font-regular">
                                                Commentaires ({task.comments ? task.comments.length : 0})
                                            </span>
                                            <button
                                                onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                                                className="flex items-center justify-center cursor-pointer hover:opacity-70 transition"
                                            >
                                                <div className={`transition-transform duration-200 ${expandedTaskId === task.id ? 'rotate-180' : ''}`}>
                                                    <Image src="/more.svg" alt="Voir plus" width={16} height={8} />
                                                </div>
                                            </button>
                                        </div>

                                        {/* LA ZONE CACHÉE (comments)) */}
                                        {expandedTaskId === task.id && (
                                            <div className="flex flex-col gap-[20px] w-[980px]"> {/* ⚡ ICI LA VRAIE LARGEUR DE 942px */}

                                                {/* 1. LISTE DES ANCIENS COMMENTAIRES */}
                                                {task.comments && task.comments.map((comment: any, index: number) => {
                                                    const authorName = comment.author?.name || comment.user?.name || 'Inconnu';
                                                    const initials = authorName !== 'Inconnu' ? authorName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
                                                    const date = new Date(comment.createdAt || Date.now());
                                                    const formattedDate = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ', ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                                                    const isMe = currentUser && (comment.author?.id === currentUser.id || comment.user?.id === currentUser.id || authorName === currentUser.name);

                                                    return (
                                                        <div key={index} className="flex items-start w-full">

                                                            {/* AVATAR (initiales) */}
                                                            <div className={`w-[27px] h-[27px] shrink-0 rounded-full flex items-center justify-center mr-[14px] ${isMe ? 'bg-[#FFE8D9]' : 'bg-[#E5E7EB] border border-[#FFFFFF]'}`}>
                                                                <span className="text-[#0F0F0F] text-[10px] font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>{initials}</span>
                                                            </div>

                                                            {/* BLOC TEXTE */}
                                                            <div className="flex-1 bg-[#F3F4F6] min-h-[83px] rounded-[10px] pt-[18px] px-[14px] pb-[18px] flex flex-col justify-center">
                                                                <div className="flex justify-between items-center w-full mb-[8px]">
                                                                    <div className="flex items-center gap-[10px]">
                                                                        <span className="text-[#000000] text-[14px] font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>{authorName}</span>
                                                                    </div>
                                                                    <span className="text-[#6B7280] text-[10px] font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>{formattedDate}</span>
                                                                </div>
                                                                <p className="text-[#000000] text-[12px] font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                                    {comment.content}
                                                                </p>
                                                            </div>

                                                        </div>
                                                    );
                                                })}

                                                {/* BLOC "AJOUTER UN COMMENTAIRE" */}
                                                <div className="flex items-start w-full mt-[10px]">

                                                    {/* AVATAR CONNECTÉ (avec initiales) */}
                                                    <div className="w-[27px] h-[27px] shrink-0 rounded-full bg-[#FFE8D9] flex items-center justify-center mr-[14px] mt-[16px]">
                                                        <span className="text-[#0F0F0F] text-[10px] font-normal" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                            {currentUser ? (currentUser.name ? currentUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U') : 'U'}
                                                        </span>
                                                    </div>

                                                    {/* CHAMP DE SAISIE */}
                                                    <div className="flex-1 h-[83px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] px-[14px] flex items-center mr-[16px]">
                                                        <input
                                                            type="text"
                                                            value={commentText}
                                                            onChange={(e) => setCommentText(e.target.value)}
                                                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(task.id); }}
                                                            placeholder="Ajouter un commentaire..."
                                                            className="w-full bg-transparent border-none outline-none text-[#000000] text-[12px] font-normal placeholder-[#6B7280]"
                                                            style={{ fontFamily: "'Inter', sans-serif" }}
                                                        />
                                                    </div>

                                                    {/* BOUTON ENVOYER */}
                                                    <button
                                                        onClick={() => handleAddComment(task.id)}
                                                        className="w-[209px] h-[50px] shrink-0 bg-[#E5E7EB] text-[#9CA3AF] rounded-[10px] text-[14px] font-medium flex items-center justify-center transition hover:bg-gray-300 mt-[16px]"
                                                        style={{ fontFamily: "'Inter', sans-serif" }}
                                                    >
                                                        Envoyer
                                                    </button>

                                                </div>

                                            </div>
                                        )}

                                    </div>

                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            <EditProjectModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                project={project}
            />

            <EditTaskModal
                isOpen={isEditTaskModalOpen}
                onClose={() => setIsEditTaskModalOpen(false)}
                task={selectedTask}
                projectId={project?.id}
                contributors={contributors}
            />

            <CreateTaskModal
                isOpen={isCreateTaskModalOpen}
                onClose={() => setIsCreateTaskModalOpen(false)}
                projectId={project?.id}
                contributors={contributors}
            />
        </div>
    );
}