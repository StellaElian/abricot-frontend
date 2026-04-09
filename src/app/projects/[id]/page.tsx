'use client';

import { useState, useEffect } from 'react'; // Ajout de useEffect
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

    // 2. Sçà)TATE POUR STOCKER LES VRAIES DONNÉES DU BACKEND
    const [projectTasks, setProjectTasks] = useState<any[]>([]);
    const [project, setProject] = useState<any>(null); //pour le projet
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null); // pour retenir la tâche qu'on souhaite modifier
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null); //Stocker la personne connectée
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null); // Pour savoir quelle tâche a ses commentaires dépliés


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
            }catch(error) {
                console.error("Erreur de récupération statut utilisateur",error);
            }
            if (!token || !projectId) return;
            try {
                // --- A. RÉCUPÉRATION DE TOUTES LES TÂCHES DU PROJET ---
                // On pointe les tâches du projet
                const tasksResponse = await fetch(`http://localhost:8000/projects/${projectId}/tasks`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (tasksResponse.ok) {
                    const tasksJson = await tasksResponse.json();

                    // le tableau est dans data.tasks 
                    if (tasksJson.data && Array.isArray(tasksJson.data.tasks)) {
                        setProjectTasks(tasksJson.data.tasks);
                    } else if (Array.isArray(tasksJson.data)) {
                        setProjectTasks(tasksJson.data);
                    } else {
                        setProjectTasks([]); // Sécurité anti-crash
                    }
                }


                /// --- B. RÉCUPÉRATION DU PROJET ---
                const projectResponse = await fetch(`http://localhost:8000/projects`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (projectResponse.ok) {
                    const projectJson = await projectResponse.json();

                    // 1. On cherche où est le vrai tableau (Array) des projets pour éviter le crash
                    let allProjects = [];
                    if (Array.isArray(projectJson.data)) {
                        allProjects = projectJson.data; // Le tableau est directement dans data
                    } else if (projectJson.data && Array.isArray(projectJson.data.projects)) {
                        allProjects = projectJson.data.projects; // Le tableau est caché dans data.projects
                    } else if (Array.isArray(projectJson)) {
                        allProjects = projectJson; // Le tableau est à la racine
                    }

                    // 2. On cherche le projet qui correspond à l'ID de la page
                    const currentProject = allProjects.find((p: any) => p.id === projectId);

                    // 3. On le sauvegarde
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

    // Fonction pour traduire les statuts (Inchangée)
    const formatStatus = (status: string) => {
        if (status === 'TODO') return 'À faire';
        if (status === 'IN_PROGRESS') return 'En cours';
        if (status === 'DONE') return 'Terminée';
        return 'À faire';
    };

    // --- VÉRIFICATIONS DES RÔLES (statut user) ---
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


    return (
        // CONTENEUR GLOBAL 
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
                        {/* On boucle sur le tableau des contributeurs */}
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

                    {/* 2. LA LISTE DES TÂCHES (gros bloc principal) */}
                    <div className="w-full h-auto bg-white flex flex-col gap-[17px] pl-[59px]">

                        {projectTasks.map((task) => {
                            const frenchStatus = formatStatus(task.status);

                            return (
                                <div key={task.id} className="w-[1090px] min-h-[263.54px] h-auto pl-[40px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] flex flex-col hover:shadow-sm transition-shadow">

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

                                                {/* On boucle sur les assignés de la tâche */}
                                                {task.assignees && task.assignees.map((assigneeObj: any, index: number) => {

                                                    // On utilise directement l'utilisateur fourni par le backend 
                                                    // Sinon, on cherche par l'ID sans créer autreacgose
                                                    const targetId = assigneeObj.userId || assigneeObj.id;
                                                    const userProfile = assigneeObj.user || contributors.find((c: any) => c.id === targetId) || assigneeObj;

                                                    // On extrait le nom
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
                                            onClick={() => setEditingTask(task)} // "On ouvre la modale avec CETTE tâche"
                                            className="w-[57px] h-[57px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-50 transition mt-[8px] mr-[11px]"
                                        >
                                            <Image src="/plus.svg" alt="Options" width={15} height={4} />
                                        </button>

                                    </div>

                                    {/* SÉPARATEUR (ligne)  */}
                                    <div className="pl-[18px] mt-[5px]">
                                        <Image src="/line2.svg" alt="Séparateur" width={1000} height={2} />
                                    </div>

                                    {/* BAS DE LA CARTE (Commentaires) */}
                                <div className="flex flex-col w-full mt-[10px]">
                                    
                                    {/* La ligne visible */}
                                    <div className="pl-[30px] flex items-center justify-between w-full" style={{ fontFamily: "'Inter', sans-serif" }}>
                                        <span className="text-[14px] text-[#1F1F1F] font-regular">
                                            Commentaires ({task.comments ? task.comments.length : 0})
                                        </span>
                                        <button 
                                            // ⚡ Le clic qui ouvre ou ferme l' accordéon 
                                            onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                                            className="pr-[40px] flex items-center justify-center cursor-pointer hover:opacity-70 transition"
                                        >
                                            {/* clic qui fait tourner l'icône quand c'est ouvert */}
                                            <div className={`transition-transform duration-200 ${expandedTaskId === task.id ? 'rotate-180' : ''}`}>
                                                <Image src="/more.svg" alt="Voir plus" width={16} height={8} />
                                            </div>
                                        </button>
                                    </div>

                                    {/* LA ZONE CACHÉE : Elle s'affiche UNIQUEMENT si on a cliqué sur la flèche */}
                                    {expandedTaskId === task.id && (
                                        
                                        <div className="ml-[30px] mr-[40px] mt-[15px] mb-[10px] bg-[#F9FAFB] rounded-[8px] p-[12px] border border-[#E5E7EB]">
                                            
                                            {/* Affichage des anciens commentaires */}
                                            <div className="mb-[12px] max-h-[100px] overflow-y-auto space-y-[8px]">
                                                {task.comments && task.comments.length > 0 ? (
                                                    task.comments.map((comment: any, index: number) => (
                                                        <div key={index} className="text-[12px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                                                            <span className="font-semibold text-[#1F1F1F]">{comment.author?.name || 'Inconnu'} : </span>
                                                            <span className="text-[#6B7280]">{comment.content}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-[12px] text-[#9CA3AF] italic" style={{ fontFamily: "'Inter', sans-serif" }}>Aucun commentaire pour le moment.</p>
                                                )}
                                            </div>

                                            {/* Le petit champ pour écrire */}
                                            <div className="flex gap-[8px]">
                                                <input 
                                                    type="text" 
                                                    placeholder="Ajouter un commentaire..." 
                                                    className="flex-1 h-[36px] border border-[#E5E7EB] rounded-[4px] px-[12px] text-[12px] outline-none focus:border-[#D3590B] transition"
                                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                                />
                                                <button className="h-[36px] px-[16px] bg-[#1F1F1F] text-white text-[12px] font-medium rounded-[4px] hover:bg-black transition" style={{ fontFamily: "'Inter', sans-serif" }}>
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
            </div >
            <EditProjectModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                project={project} // vraies données à la modale
            />
            {/* MODALE POUR MODIFIER UNE TÂCHE */}
            <EditTaskModal
                isOpen={!!editingTask} // S'ouvre seulement si une tâche a été sélectionnée (si editingTask n'est pas null)
                onClose={() => setEditingTask(null)} // Quand on ferme, on vide la mémoire
                task={editingTask} // On envoie toutes les infos de la tâche à la modale 
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