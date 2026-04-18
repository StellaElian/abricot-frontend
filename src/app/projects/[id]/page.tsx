'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import EditProjectModal from '@/src/components/EditProjectModal';
import EditTaskModal from '@/src/components/EditTaskModal';
import CreateTaskModal from '@/src/components/CreateTaskModal';

export default function ProjectDetailsPage() {

    const params = useParams();
    const projectId = params.id;

    const [projectTasks, setProjectTasks] = useState<any[]>([]);
    const [project, setProject] = useState<any>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<any>(null);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);

    const [commentText, setCommentText] = useState('');

    const contributors = project ? [
        project.owner,
        ...(project.members?.map((m: any) => m.user || m).filter((u: any) => u.id !== project.owner.id) || [])
    ].filter(Boolean) : [];

    useEffect(() => {
        const fetchAllData = async () => {
            const token = Cookies.get('token');
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
                        setProjectTasks([]);
                    }
                }

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

                    const currentProject = allProjects.find((p: any) => p.id === projectId);

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
        fetchAllData();
    }, [projectId]);

    const formatStatus = (status: string) => {
        if (status === 'TODO') return 'À faire';
        if (status === 'IN_PROGRESS') return 'En cours';
        if (status === 'DONE') return 'Terminée';
        return 'À faire';
    };

    const isOwner = currentUser && project && currentUser.id === project.owner?.id;

    const isMember = currentUser && project && project.members?.some((m: any) => {
        const memberId = m.user?.id || m.id;
        return memberId === currentUser.id;
    });

    const hasAccess = isOwner || isMember;

    if (project && currentUser && !hasAccess) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center font-sans p-4">
                <h1 className="text-[20px] lg:text-[24px] font-semibold text-[#1F1F1F] mb-[10px] text-center font-manrope">
                    Accès refusé
                </h1>
                <p className="text-[14px] lg:text-[16px] text-[#6B7280] mb-[20px] text-center font-inter">
                    Vous n'êtes ni administrateur ni contributeur de ce projet.
                </p>
                <Link href="/dashboard" className="w-[200px] h-[50px] bg-[#D3590B] text-[#FFFFFF] rounded-[10px] flex items-center justify-center hover:opacity-90 transition">
                    Retour au tableau de bord
                </Link>
            </div>
        );
    }

    const handleAddComment = async (taskId: string) => {
        if (!commentText.trim()) return;
        const token = Cookies.get('token');

        try {
            const response = await fetch(`http://localhost:8000/projects/${projectId}/tasks/${taskId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: commentText })
            });

            if (response.ok) {
                setCommentText('');
                window.location.reload();
            } else {
                alert("Erreur lors de l'ajout du commentaire.");
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] font-sans overflow-x-hidden">

            {/* ================= EN-TÊTE DU PROJET ================= */
            }
            <div className="w-full px-4 lg:px-[30px] pt-8 lg:pt-[78px] flex flex-col mb-[14px]">

                {/* LIGNE DU HAUT : Retour + (Titre, Desc, Boutons) */}
                <div className="flex flex-col lg:flex-row items-start gap-[16px] mb-6 lg:mb-[49px]">

                    {/* BOUTON RETOUR */}
                    <Link href="/projects" aria-label="Retour" className="w-[40px] h-[40px] lg:w-[57px] lg:h-[57px] bg-white border border-[#E5E7EB] rounded-[10px] flex items-center justify-center hover:bg-gray-50 transition shrink-0 cursor-pointer mb-4 lg:mb-0">
                        <Image src="/line3.svg" alt="" aria-hidden="true" width={15} height={1} className="w-[10px] lg:w-[15px]" />
                    </Link>

                    {/* RESTE EN-TÊTE : Titre/Desc à gauche, Boutons */}
                    <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-4 lg:gap-0">

                        {/* GAUCHE : Titre, Modifier et Description */}
                        <div className="flex flex-col w-full lg:w-auto">
                            <div className="flex flex-wrap items-center gap-[14px] mb-[8px]">
                                <h1 className="text-[20px] lg:text-[24px] font-semibold text-[#1F1F1F] font-manrope">
                                    {project ? project.title || project.name : "Chargement..."}
                                </h1>
                                {isOwner && (
                                    <button onClick={() => setIsEditModalOpen(true)} className="text-[#D3590B] text-[12px] lg:text-[14px] font-regular underline hover:opacity-80 transition font-inter">
                                        Modifier
                                    </button>
                                )}
                            </div>
                            <p className="text-[14px] lg:text-[18px] text-[#6B7280] font-regular font-inter">
                                {project ? project.description : "Aucune description pour ce projet."}
                            </p>
                        </div>

                        {/* DROITE : Boutons Créer et IA */}
                        <div className="flex gap-[12px] h-[50px]  mr-18 w-full lg:w-auto mt-4 lg:mt-0">
                            <button onClick={() => setIsCreateTaskModalOpen(true)} className="flex-1 lg:w-[141px] h-[50px] bg-[#1F1F1F] text-[#FFFFFF] rounded-[10px] text-[14px] lg:text-[16px] font-regular flex items-center justify-center hover:bg-black transition">
                                Créer une tâche
                            </button>
                            <button className="w-[94px] h-[50px] bg-[#D3590B] text-[#FFFFFF] rounded-[10px] text-[14px] lg:text-[16px] font-regular flex items-center justify-center gap-[10px] hover:opacity-90 transition font-inter">
                                <Image src="/star.svg" alt="" aria-hidden="true" width={16} height={16} className="w-[16px] lg:w-[21px]" />
                                IA
                            </button>
                        </div>
                    </div>
                </div>

                {/*BARRE DES CONTRIBUTEURS */}
                <div className="w-auto min-h-[67px] mr-16 ml-18 py-4 lg:py-0 bg-[#F3F4F6] rounded-[10px] flex flex-col lg:flex-row items-start lg:items-center justify-between px-4 lg:px-[40px] mt-4 lg:mt-0 gap-4 lg:gap-0">

                    {/* GAUCHE : Texte Contributeurs */}
                    <div className="flex items-center shrink-0">
                        <span className="text-[16px] lg:text-[18px] text-[#1F1F1F] font-semibold mr-[8px] font-manrope">Contributeurs</span>
                        <span className="text-[14px] lg:text-[16px] text-[#6B7280] font-inter">
                            {contributors ? contributors.length : 0} personnes
                        </span>
                    </div>

                    {/* DROITE : Les pastilles (initiales) repoussées à droite */}
                    <div className="flex items-center gap-[8px] ml-50 shrink-0 overflow-x-auto hide-scrollbar max-w-full">

                        {contributors && contributors.length > 0 ? (
                            contributors.map((contributor: any, index: number) => {

                                const fullName = contributor.name || `${contributor.firstName || ''} ${contributor.lastName || ''}`.trim() || 'Inconnu';
                                const initials = fullName !== 'Inconnu' ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

                                if (index === 0) {
                                    return (
                                        <div key={index} className="flex items-center gap-[5px] shrink-0">
                                            <div className="w-[27px] h-[27px] rounded-full bg-[#FFE8D9] flex items-center justify-center text-[#D3590B] text-[10px] font-semibold font-sans z-10">
                                                {initials}
                                            </div>
                                            <div className="h-[25px] px-[16px] bg-[#FFE8D9] rounded-[50px] flex items-center justify-center text-[#D3590B] text-[12px] lg:text-[14px] font-regular font-inter">
                                                {fullName}
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={index} className="flex items-center gap-[5px] shrink-0">
                                        <div className="w-[27px] h-[27px] rounded-full bg-[#E5E7EB] border border-[#FFFFFF] flex items-center justify-center text-[#0F0F0F] text-[10px] font-regular font-sans z-10">
                                            {initials}
                                        </div>
                                        <div className="h-[25px] px-[16px] bg-[#E5E7EB] rounded-[50px] flex items-center justify-center text-[#6B7280] text-[12px] lg:text-[14px] font-regular font-inter">
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


            {/* ================= CORPS DU PROJET ================= */}

            <div className="w-full px-4 lg:px-[100px] pt-4 lg:pt-[41px] pb-8">

                <div className="flex flex-col bg-[#FFFFFF] rounded-[10px] border border-[#E5E7EB] pb-6 lg:pb-[40px] overflow-hidden">


                    {/* EN-TÊTE DES TÂCHES ET FILTRES */}

                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full mb-6 lg:mb-[41px] px-4 lg:pl-[59px] pt-6 lg:pt-[40px] gap-4 lg:gap-0">

                        <div className="flex flex-col">
                            <h2 className="text-[16px] lg:text-[18px] font-semibold text-[#1F1F1F] mb-1 lg:mb-[8px] font-manrope">
                                Tâches
                            </h2>
                            <p className="text-[12px] lg:text-[16px] text-[#6B7280] font-regular font-inter">
                                par ordre de priorité
                            </p>
                        </div>

                        {/* Côté Droit : Boutons et Recherche */}
                        <div className="flex flex-wrap lg:flex-nowrap items-center w-full lg:w-[701px] lg:pr-[59px] gap-2 lg:gap-0 h-auto lg:h-[63px]">

                            <button className="h-[40px] lg:h-[45px] px-2 lg:w-[94px] flex items-center bg-[#FFE8D9] rounded-[8px] cursor-pointer lg:mr-[10px] shrink-0">
                                <div className="pl-2 lg:pl-[16px] pr-2 lg:pr-[14px] flex items-center justify-center">
                                    <Image src="/list.svg" alt="" aria-hidden="true" width={14} height={14} className="w-[12px] lg:w-[16px]" />
                                </div>
                                <span className="text-[#D3590B] text-[12px] lg:text-[14px] font-regular pr-2 lg:pr-0 font-inter">
                                    Liste
                                </span>
                            </button>

                            <button className="h-[40px] lg:h-[45px] px-2 lg:w-[130px] flex items-center bg-white rounded-[8px] cursor-pointer lg:mr-[16px] shrink-0">
                                <div className="pl-2 lg:pl-[16px] pr-2 lg:pr-[14px] flex items-center justify-center">
                                    <Image src="/logokanban.svg" alt="" aria-hidden="true" width={14} height={14} className="w-[12px] lg:w-[15px]" />
                                </div>
                                <span className="text-[#D3590B] text-[12px] lg:text-[14px] font-medium pr-2 lg:pr-0 font-inter">
                                    Calendrier
                                </span>
                            </button>

                            <button className="relative h-[40px] lg:h-[63px] w-[120px] lg:w-[152px] bg-white border border-[#E5E7EB] rounded-[8px] flex items-center cursor-pointer lg:mr-[16px] shrink-0 mt-2 lg:mt-0">
                                <span className="absolute left-[16px] lg:left-[32px] text-[#6B7280] text-[12px] lg:text-[14px] font-regular font-inter">
                                    Statut
                                </span>
                                <div className="absolute right-[16px] lg:right-[31px]">
                                    <Image src="/vector.svg" alt="" aria-hidden="true" width={12} height={6} className="w-[10px] lg:w-[16px]" />
                                </div>
                            </button>

                            <div className="relative w-full lg:w-[283px] h-[40px] lg:h-[63px] mt-2 lg:mt-0">
                                <label htmlFor="searchTask" className="sr-only">Rechercher une tâche</label>
                                <input
                                    id="searchTask"
                                    type="text"
                                    placeholder="Rechercher une tâche"
                                    className="w-full h-full border border-[#E5E7EB] rounded-[8px] bg-white pl-[16px] lg:pl-[32px] pr-[40px] lg:pr-[59px] text-[12px] lg:text-[14px] text-[#6B7280] outline-none focus:border-[#D3590B] transition"
                                />
                                <div className="absolute right-[16px] lg:right-[32px] top-[50%] -translate-y-1/2 pointer-events-none flex items-center justify-center">
                                    <Image src="/search.svg" alt="" aria-hidden="true" width={12} height={12} className="w-[12px] lg:w-[13.9px]" />
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* LISTE DES TÂCHES */}
                    <div className="h-auto bg-white flex flex-col gap-4 lg:gap-[17px] px-4 lg:pl-[59px] lg:pr-[59px]">

                        {projectTasks.map((task) => {
                            const frenchStatus = formatStatus(task.status);

                            return (
                                <div key={task.id} className="w-full min-h-[263.54px] h-auto px-4 lg:px-[40px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] flex flex-col hover:shadow-sm transition-shadow overflow-hidden">

                                    {/* HAUT DE LA CARTE */}
                                    <div className="py-4 lg:p-[25px] flex flex-col lg:flex-row justify-between items-start">

                                        <div className="flex flex-col w-full lg:max-w-[942px]">

                                            {/* Titre + Badge Statut */}
                                            <div className="flex flex-wrap items-center gap-2 lg:gap-[8px] mb-2 lg:mb-[7px]">
                                                <h3 className="text-[16px] lg:text-[18px] font-semibold text-[#000000] font-manrope">
                                                    {task.title}
                                                </h3>
                                                {frenchStatus === "À faire" ? (
                                                    <div className="w-auto lg:w-[75px] h-[25px] bg-[#FFE0E0] flex items-center justify-center text-[#EF4444] px-2 lg:px-[16px] py-[4px] rounded-[50px] text-[10px] lg:text-[14px] font-regular">{frenchStatus}</div>
                                                ) : frenchStatus === "En cours" ? (
                                                    <div className="w-auto lg:w-[90px] h-[25px] bg-[#FFF0D7] flex items-center justify-center text-[#E08D00] px-2 lg:px-[16px] py-[4px] rounded-[50px] text-[10px] lg:text-[14px] font-regular">{frenchStatus}</div>
                                                ) : (
                                                    <div className="w-auto lg:w-[94px] h-[25px] bg-[#F1FFF7] flex items-center justify-center text-[#27AE60] px-2 lg:px-[16px] py-[4px] rounded-[50px] text-[10px] lg:text-[14px] font-regular">{frenchStatus}</div>
                                                )}
                                            </div>

                                            <p className="text-[12px] lg:text-[14px] text-[#6B7280] mb-4 lg:mb-[32px] font-regular line-clamp-2 lg:line-clamp-none font-inter">
                                                {task.description}
                                            </p>

                                            <div className="flex items-center gap-2 lg:gap-[8px] mb-2 lg:mb-[24px] text-[10px] lg:text-[12px] text-[#6B7280] font-regular font-inter">
                                                <span className="font-regular text-[#6B7280]">Échéance :</span>
                                                <Image src="/union.svg" alt="" aria-hidden="true" width={12} height={13} className="w-[12px] lg:w-[15px]" />
                                                <span className="font-regular text-[#1F1F1F] text-[10px] lg:text-[12px] font-inter">{task.dueDate ? new Date(task.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) : "Date inconnue"}</span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 lg:gap-[8px] text-[10px] lg:text-[12px] text-[#6B7280] font-regular mb-4 lg:mb-0 font-inter">
                                                <span>Assigné à :</span>
                                                {task.assignees && task.assignees.map((assigneeObj: any, index: number) => {
                                                    const targetId = assigneeObj.userId || assigneeObj.id;
                                                    const userProfile = assigneeObj.user || contributors.find((c: any) => c.id === targetId) || assigneeObj;
                                                    const fullName = userProfile.name || `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Inconnu';
                                                    const initials = fullName !== 'Inconnu' ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

                                                    return (
                                                        <div key={index} className="flex items-center gap-1 lg:gap-[5px]">
                                                            <div className="w-[20px] h-[20px] lg:w-[27px] lg:h-[27px] rounded-full bg-[#E5E7EB] border border-[#FFFFFF] flex items-center justify-center text-[#0F0F0F] text-[8px] lg:text-[10px] font-regular font-sans z-10 shrink-0">
                                                                {initials}
                                                            </div>
                                                            <div className="h-[20px] lg:h-[25px] px-2 lg:px-[16px] bg-[#E5E7EB] rounded-[50px] flex items-center justify-center text-[#6B7280] text-[10px] lg:text-[14px] font-regular whitespace-nowrap font-inter">
                                                                {fullName}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Bouton "..." */}
                                        <button
                                            aria-label={`Options de la tâche ${task.title}`}
                                            onClick={() => { setSelectedTask(task); setIsEditTaskModalOpen(true) }}
                                            className="w-[40px] h-[40px] lg:w-[57px] lg:h-[57px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-50 transition self-end lg:self-auto lg:mt-[8px] lg:mr-[11px]"
                                        >
                                            <Image src="/plus.svg" alt="" aria-hidden="true" width={15} height={4} className="w-[10px] lg:w-[15px]" />
                                        </button>
                                    </div>

                                    {/* SÉPARATEUR */}
                                    <div className="pl-0 lg:pl-[18px] mt-2 lg:mt-[5px] w-full overflow-hidden" aria-hidden="true">
                                        <Image src="/line2.svg" alt="" width={1000} height={2} className="w-full" />
                                    </div>

                                    {/* BAS DE LA CARTE (Commentaires) */}
                                    <div className="flex flex-col w-full mt-2 lg:mt-[10px] pl-0 lg:pl-[20px] pb-4 lg:pb-[20px]">

                                        <div className="flex items-center justify-between w-full pr-0 lg:pr-[40px] mb-4 lg:mb-[20px] font-inter">
                                            <span className="text-[12px] lg:text-[14px] text-[#1F1F1F] font-regular">
                                                Commentaires ({task.comments ? task.comments.length : 0})
                                            </span>
                                            <button
                                                aria-label={expandedTaskId === task.id ? "Masquer les commentaires" : "Voir les commentaires"}
                                                aria-expanded={expandedTaskId === task.id}
                                                onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                                                className="flex items-center justify-center cursor-pointer hover:opacity-70 transition p-2"
                                            >
                                                <div className={`transition-transform duration-200 ${expandedTaskId === task.id ? 'rotate-180' : ''}`}>
                                                    <Image src="/more.svg" alt="" aria-hidden="true" width={12} height={6} className="w-[12px] lg:w-[16px]" />
                                                </div>
                                            </button>
                                        </div>

                                        {/* ZONE CACHÉE */}
                                        {expandedTaskId === task.id && (
                                            <div className="flex flex-col gap-4 lg:gap-[20px] w-full overflow-x-auto hide-scrollbar pb-2">

                                                {task.comments && task.comments.map((comment: any, index: number) => {
                                                    const authorName = comment.author?.name || comment.user?.name || 'Inconnu';
                                                    const initials = authorName !== 'Inconnu' ? authorName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
                                                    const date = new Date(comment.createdAt || Date.now());
                                                    const formattedDate = date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ', ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

                                                    const isMe = currentUser && (comment.author?.id === currentUser.id || comment.user?.id === currentUser.id || authorName === currentUser.name);

                                                    return (
                                                        <div key={index} className="flex items-start w-full min-w-[300px]">

                                                            <div className={`w-[27px] h-[27px] shrink-0 rounded-full flex items-center justify-center mr-2 lg:mr-[14px] ${isMe ? 'bg-[#FFE8D9]' : 'bg-[#E5E7EB] border border-[#FFFFFF]'}`}>
                                                                <span className="text-[#0F0F0F] text-[10px] font-normal font-inter">{initials}</span>
                                                            </div>

                                                            <div className="flex-1 bg-[#F3F4F6] min-h-[60px] lg:min-h-[83px] rounded-[10px] pt-[12px] lg:pt-[18px] px-3 lg:px-[14px] pb-[12px] lg:pb-[18px] flex flex-col justify-center">
                                                                <div className="flex justify-between items-center w-full mb-[8px]">
                                                                    <div className="flex items-center gap-[10px]">
                                                                        <span className="text-[#000000] text-[12px] lg:text-[14px] font-normal truncate max-w-[120px] lg:max-w-none font-inter">{authorName}</span>
                                                                    </div>
                                                                    <span className="text-[#6B7280] text-[8px] lg:text-[10px] font-normal shrink-0 font-inter">{formattedDate}</span>
                                                                </div>
                                                                <p className="text-[#000000] text-[10px] lg:text-[12px] font-normal font-inter">
                                                                    {comment.content}
                                                                </p>
                                                            </div>

                                                        </div>
                                                    );
                                                })}

                                                {/* BLOC "AJOUTER UN COMMENTAIRE" */}
                                                <div className="flex items-start w-full mt-2 lg:mt-[10px] min-w-[300px]">

                                                    <div className="w-[27px] h-[27px] shrink-0 rounded-full bg-[#FFE8D9] flex items-center justify-center mr-2 lg:mr-[14px] mt-2 lg:mt-[16px]">
                                                        <span className="text-[#0F0F0F] text-[10px] font-normal font-inter">
                                                            {currentUser ? (currentUser.name ? currentUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U') : 'U'}
                                                        </span>
                                                    </div>

                                                    <div className="flex-1 flex flex-col lg:flex-row items-center gap-2 lg:gap-0 mr-0 lg:mr-[16px]">
                                                        <div className="w-full h-[50px] lg:h-[83px] bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] px-3 lg:px-[14px] flex items-center">
                                                            <label htmlFor={`comment-input-${task.id}`} className="sr-only">Ajouter un commentaire</label>
                                                            <input
                                                                id={`comment-input-${task.id}`}
                                                                type="text"
                                                                value={commentText}
                                                                onChange={(e) => setCommentText(e.target.value)}
                                                                onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(task.id); }}
                                                                placeholder="Ajouter un commentaire..."
                                                                className="w-full bg-transparent border-none outline-none text-[#000000] text-[10px] lg:text-[12px] font-normal placeholder-[#6B7280] font-inter"
                                                            />
                                                        </div>
                                                        {/* BOUTON ENVOYER */}
                                                        <button
                                                            onClick={() => handleAddComment(task.id)}
                                                            className="w-full lg:w-[209px] h-[40px] lg:h-[50px] shrink-0 bg-[#E5E7EB] text-[#9CA3AF] rounded-[10px] text-[12px] lg:text-[14px] font-medium flex items-center justify-center transition hover:bg-gray-300 mt-2 lg:mt-[16px] lg:ml-4 font-inter"
                                                        >
                                                            Envoyer
                                                        </button>
                                                    </div>

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