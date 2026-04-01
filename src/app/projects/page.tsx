'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Image from 'next/image';
import CreateProjectModal from '@/src/components/CreateProjectModal';


// On explique à TypeScript à quoi ressemble un Projet qui vient du Backend

interface TeamMember {
  id: string;
  initials: string;
  isOwner: boolean; // Vrai si la personne est le propriétaire du projet
}

interface Project {
  id: string;
  name: string;
  description: string;
  completedTasks: number;
  totalTasks: number;
  team: TeamMember[];
}

export default function ProjectsPage() {

  // 2. MÉMOIRE DE LA PAGE (Les "States" React)

  const [projects, setProjects] = useState<Project[]>([]); // Mémoire pour stocker les projets
  const [loading, setLoading] = useState(true); // pour savoir si on est en train de charger
  const [error, setError] = useState(''); // Mémoire pour stocker les erreurs éventuelles
  const [isModalOpen, setIsModalOpen] = useState(false); //mémoire pour savoir si la fenêtre est ouverte

  // 3. LOGIQUE MÉTIER (Récupération des données au démarrage)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setError('');  // on éfface le méssage rouge à chaque nouveau chargement
        const token = Cookies.get('token'); // On récupère le badge VIP

        // Appel au Backend pour avoir les projets
        const response = await fetch('http://localhost:8000/projects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();

          // 🕵️ On affiche dans la console ce que le backend t'envoie
          console.log("Données reçues du backend :", data);

          // 🛡️ RECHERCHE AUTOMATIQUE DU TABLEAU
          let listeProjets = [];
          if (Array.isArray(data)) listeProjets = data;
          else if (data.data && Array.isArray(data.data)) listeProjets = data.data;
          else if (data.data && Array.isArray(data.data.projects)) listeProjets = data.data.projects;
          else if (data.projects && Array.isArray(data.projects)) listeProjets = data.projects;

          console.log("Les projets extraits :", listeProjets);
          setProjects(listeProjets);

        } else {

          setError('Erreur lors du chargement des projets');
        }
      } catch (err) {
        setError('Impossible de joindre le serveur.');
      } finally {
        setLoading(false); // Le chargement est fini, qu'il y ait une erreur ou non
      }
    };

    fetchProjects(); // On lance la fonction
  }, []);

  // 4. L'INTERFACE VISUELLE 

  // Écran d'attente
  if (loading) return <div className="p-10 text-center font-sans">Chargement de vos projets...</div>;

  return (
    // CONTENEUR GLOBAL 
    <div className="max-w-[1440px] mx-auto px-[100px] py-[50px] font-sans">

      {/* L'EN-TÊTE : Titre et Bouton */}
      {/* items-end force les enfants à s'aligner sur la ligne du bas */}
      <div className="flex justify-between items-end w-full max-w-[1166px] h-[69px] mx-auto mb-[64px]">

        {/* Partie gauche */}
        <div className="h-full flex flex-col justify-between">
          <h1 className="text-[24px] font-semibold text-[#1F1F1F] leading-none" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Mes projets
          </h1>
          <p className="text-[16px] text-[#6B7280] leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>
            Gérez vos projets
          </p>
        </div>

        {/* Partie droite : Le bouton */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1F1F1F] text-[#FFFFFF] w-[181px] h-[50px] rounded-[10px] font-medium text-[16px] transition hover:bg-black cursor-pointer">
          + Créer un projet
        </button>

      </div>


      {/* Affichage des erreurs éventuelles */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* LA GRILLE DES PROJETS (1166px de large, 3 colonnes) */}
      <div className="w-full max-w-[1166px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">

        {/* BOUCLE : Pour chaque projet dans la mémoire, on dessine ça : */}
        {projects.map((rawProject: any) => {

          // --- 1. TRADUCTION DE L'ÉQUIPE (Backend -> Frontend) ---
          // Le backend envoie "owner" et "members", on les transforme en tableau "team"
          const ownerData = rawProject.owner;
          let ownerInitials = 'U';
          if (ownerData) {
            const fullName = ownerData.name || `${ownerData.firstName || ''} ${ownerData.lastName || ''}`.trim() || 'Inconnu';
            ownerInitials = fullName !== 'Inconnu' ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
          }
          const teamOwner = ownerData ? { id: ownerData.id, initials: ownerInitials, isOwner: true } : null;

          const membersData = rawProject.members || [];
          const teamMembers = membersData.map((m: any) => {
            const user = m.user || m;
            const fullName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Inconnu';
            const initials = fullName !== 'Inconnu' ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
            return { id: user.id || m.id, initials: initials, isOwner: false };
          });

          // On assemble le tout, en filtrant les potentiels doublons (comme pour l'Alice de tout à l'heure !)
          const fullTeam = teamOwner ? [
            teamOwner,
            ...teamMembers.filter((m: any) => m.id !== teamOwner.id)
          ] : teamMembers;

          // --- 2. CALCUL DES TÂCHES (Si le backend envoie un tableau de tâches) ---
          const projectTasks = rawProject.tasks || [];
          const completedCount = projectTasks.filter((t: any) => t.status === 'DONE' || t.status === 'Terminée').length;

          // --- 3. SÉCURISATION DES DONNÉES ---
          const project = {
            ...rawProject,
            team: fullTeam,
            completedTasks: completedCount || rawProject.completedTasks || 0,
            totalTasks: projectTasks.length || rawProject.totalTasks || 0,
          }

          // --- CALCULS DYNAMIQUES POUR CETTE CARTE ---

          // 1. Calcul du pourcentage pour la barre noire
          const progressPercent = project.totalTasks > 0
            ? Math.round((project.completedTasks / project.totalTasks) * 100)
            : 0;

          // 2. Séparation de l'équipe (Propriétaire d'un côté, les autres de l'autre)
          const owner = project.team.find((member: TeamMember) => member.isOwner);
          const others = project.team.filter((member: TeamMember) => !member.isOwner);

          return (
            <Link href={`/projects/${project.id}`} key={project.id} className="block group">

              {/* LA CARTE BLANCHE (380x351px, bordure, padding 34px) */}
              <div className="w-[380px] h-[351px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] p-[34px] flex flex-col justify-between hover:shadow-md transition-shadow">

                {/* PARTIE 1 : Titre et Description */}
                <div>
                  <h3
                    className="text-[18px] text-[#1F1F1F] mb-[8px] truncate"
                    style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}
                  >
                    {/* On affiche le nom qui vient du Backend */}
                    {project.name}
                  </h3>

                  {/* Description*/}
                  <p
                    className="text-[14px] font-normal text-[#6B7280] w-[312px] line-clamp-2 leading-[1.2]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {project.description}
                  </p>
                </div>

                {/* PARTIE 2 : La Barre de Progression */}
                <div className="mt-[20px]">

                  {/* Textes au-dessus de la barre */}
                  <div className="flex justify-between text-[12px] font-normal text-[#6B7280] mb-[15px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span>Progression</span>
                    {/* Le pourcentage calculé plus haut */}
                    <span>{progressPercent}%</span>
                  </div>

                  {/* La structure de la barre de progression */}
                  <div className="w-[312px] h-[7px] bg-[#E5E7EB] rounded-[40px] overflow-hidden">
                    {/* remplissage noir dynamique. On utilise 'style' pour changer la largeur selon le calcul */}
                    <div
                      className="h-full bg-[#1F1F1F] rounded-[40px] transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>

                  {/* Texte en dessous de la barre */}
                  <p className="text-[12px] font-normal text-[#6B7280] mt-[12px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {/* Les nombres exacts de tâches */}
                    {project.completedTasks}/{project.totalTasks} tâches terminées
                  </p>
                </div>

                {/* PARTIE 3 : L'Équipe */}
                <div className="mt-[20px]">

                  {/* En-tête "Équipe" avec le petit logo */}
                  <div className="flex items-center gap-[8px] mb-[15px]">
                    <div className="relative w-[16px] h-[16px]">
                      <Image src="/team.svg" alt="Icone Equipe" fill />
                    </div>
                    {/* On compte automatiquement le nombre total de personnes dans l'équipe */}
                    <span className="text-[14px] font-medium text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Équipe ({project.team.length})
                    </span>
                  </div>

                  {/* Les Pastilles (Propriétaire + Autres) */}
                  <div className="flex items-center gap-[4px]">

                    {/* LA PASTILLE DU PROPRIÉTAIRE (Orange) */}
                    {owner && (
                      <div className="flex items-center gap-[5px]">

                        {/* 1. Le petit rond des initiales */}
                        <div className="w-[27px] h-[27px] rounded-full flex items-center justify-center bg-[#FFE8D9]">
                          <span className="text-[10px] font-normal text-[#0F0F0F]">{owner.initials}</span>
                        </div>

                        {/* 2. La pastille de texte */}
                        <div className="flex items-center bg-[#FFE8D9] rounded-[40px] h-[27px] px-[10px]">
                          <span
                            className="text-[14px] font-normal text-[#D3590B]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            Propriétaire
                          </span>
                        </div>

                      </div>
                    )}

                    {/* LES PASTILLES DES AUTRES MEMBRES (Grises) */}
                    {/* La classe '-space-x-1' fait que les cercles se chevauchent vers la gauche */}
                    <div className="flex items-center -space-x-1 ml-[4px]">
                      {others.map((member: TeamMember) => (
                        <div
                          key={member.id}

                          className="w-[27px] h-[27px] rounded-full bg-[#E5E7EB] border border-white flex items-center justify-center"
                        >
                          <span
                            className="text-[10px] font-normal text-[#0F0F0F]"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {member.initials}
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

              </div>
            </Link>
          );
        })}
      </div>
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}