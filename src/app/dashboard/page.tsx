'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CreateProjectModal from '@/src/components/CreateProjectModal';

export default function DashboardPage() {

  // 1. FAUSSES DONNÉES (Pour l'intégration visuelle)
  const mockTasks = [
    { id: 1, title: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", messages: 2, status: "À faire" },
    { id: 2, title: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", messages: 2, status: "En cours" },
    { id: 3, title: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", messages: 2, status: "À faire" },
    { id: 4, title: "Nom de la tâche", description: "Description de la tâche", project: "Nom du projet", date: "9 mars", messages: 2, status: "À faire" },
  ];

  //mémoire
  const [isModalOpen, setIsModalOpen] = useState(false); //mémoire pour savoir si la fenêtre est ouverte

  return (
    // CONTENEUR GLOBAL
    <div className="max-w-[1440px] mx-auto px-[100px] py-[50px] font-sans">

      {/* 1. L'EN-TÊTE */}
      <div className="flex justify-between items-end w-full h-[69px] mb-[60px]">
        <div className="h-full flex flex-col justify-between">
          <h1 className="text-[24px] font-semibold text-[#1F1F1F] leading-none" style={{ fontFamily: "'Manrope', sans-serif" }}>
            Tableau de bord
          </h1>
          <p className="text-[16px] text-[#6B7280] leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>
            Bonjour Alice Dupont, voici un aperçu de vos projets et tâches
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1F1F1F] text-[#FFFFFF] w-[181px] h-[50px] rounded-[10px] font-medium text-[16px] transition hover:bg-black">
          + Créer un projet
        </button>
      </div>

      {/* 2. LES ONGLETS (Liste / Kanban)*/}
      <div className="flex gap-[10px] w-full mb-[30px]">
        {/* Onglet Actif ou inactif : Liste */}
        <div className="w-[94px] h-[45px] bg-[#FFE8D9] rounded-[8px] flex items-center justify-center gap-[8px] cursor-pointer">
          <Image src="/list.svg" alt="Liste" width={16} height={16} />
          <span className="text-[#D3590B] text-[14px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
            Liste
          </span>
        </div>
        {/* Onglet actif ou Inactif : Kanban */}
        <div className="w-[111px] h-[45px] bg-[#FFFFFF] rounded-[8px] border border-[#E5E7EB] flex items-center justify-center gap-[8px] cursor-pointer hover:bg-gray-50 transition">
          <Image src="/logokanban.svg" alt="Kanban" width={16} height={16} />
          <span className="text-[#6B7280] text-[14px] font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
            Kanban
          </span>
        </div>
      </div>

      {/* 3. GROS BLOC PRINCIPAL */}
      <div className="w-full px-[59px] pt-[40px] pb-[41px] border border-transparent bg-[#FFFFFF]">

        {/* L'en-tête du bloc (mx-auto pour centrer le contenu INTÉRIEUR) */}
        <div className="flex justify-between items-start w-full max-w-[1097px] mx-auto mb-[41px]">

          <div className="flex flex-col gap-[8px]">
            <h2 className="text-[18px] font-semibold text-[#1F1F1F] leading-none" style={{ fontFamily: "'Manrope', sans-serif" }}>
              Mes tâches assignées
            </h2>
            <p className="text-[14px] text-[#6B7280] leading-none" style={{ fontFamily: "'Inter', sans-serif" }}>
              Par ordre de priorité
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="relative w-[357px] h-[63px] bg-[#FFFFFF]">
            <input
              type="text"
              placeholder="Rechercher une tâche"
              className="w-full h-full border border-[#E5E7EB] rounded-[8px] pl-[32px] pr-[56px] text-[14px] text-[#6B7280] outline-none focus:border-[#D3590B] transition"
            />
            <div className="absolute right-[32px] top-[24px] pointer-events-none flex items-center justify-center">
              <Image src="/search.svg" alt="Recherche" width={16} height={16} />
            </div>
          </div>

        </div>

        {/* 4. LA LISTE DES TÂCHES */}
        <div className="flex flex-col gap-[17px] w-full max-w-[1097px] mx-auto">

          {mockTasks.map((task, index) => (
            <div key={index} className="w-full h-[162px] bg-[#FFFFFF] border border-[#E5E7EB] rounded-[10px] p-[25px] flex justify-between hover:shadow-sm transition-shadow">

              {/* Côté Gauche : Infos de la tâche */}
              <div className="flex flex-col">
                <h3 className="text-[16px] font-semibold text-[#1F1F1F] mb-[7px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {task.title}
                </h3>
                <p className="text-[14px] text-[#6B7280] mb-[32px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {task.description}
                </p>

                {/* Métadonnées */}
                <div className="flex items-center text-[12px] text-[#6B7280]" style={{ fontFamily: "'Inter', sans-serif" }}>

                  {/* Projet */}
                  <div className="flex items-center gap-[8px]">
                    <Image src="/files2.svg" alt="Projet" width={18} height={14} />
                    <span>{task.project}</span>
                  </div>

                  {/* Séparateur */}
                  <div className="mx-[15px] flex items-center justify-center bg-[#E5E7EB]">
                    <Image src="/line.svg" alt="Séparateur" width={1} height={11} className="h-[11px] w-[1px]" />
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-center gap-[8px]">
                    <Image src="/date.svg" alt="Date" width={15} height={15} />
                    <span>{task.date}</span>
                  </div>

                  {/* Séparateur */}
                  <div className="mx-[15px] flex items-center justify-center bg-[#E5E7EB]">
                    <Image src="/line.svg" alt="Séparateur" width={1} height={11} className="h-[11px] w-[1px]" />
                  </div>

                  {/* Messages */}
                  <div className="flex items-center gap-[8px]">
                    <Image src="/mess.svg" alt="Messages" width={15} height={15} />
                    <span>{task.messages}</span>
                  </div>

                </div>
              </div>

              {/* Côté Droit : Statut et Bouton */}
              <div className="flex flex-col justify-between items-end">

                {/* Pastille de Statut Dynamique */}
                {task.status === "À faire" ? (
                  <div className="bg-[#FEF2F2] text-[#EF4444] px-[16px] py-[4px] rounded-[40px] text-[12px] font-normal border border-transparent">
                    {task.status}
                  </div>
                ) : (
                  <div className="bg-[#FFF7ED] text-[#F97316] px-[16px] py-[4px] rounded-[40px] text-[12px] font-normal border border-transparent">
                    {task.status}
                  </div>
                )}

                {/* Bouton Voir */}
                <button className="w-[121px] h-[50px] bg-[#1F1F1F] text-[#FFFFFF] rounded-[10px] text-[16px] font-medium transition hover:bg-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Voir
                </button>
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}