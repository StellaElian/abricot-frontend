'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contributors, setContributors] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Nouveau projet :", { title, description, contributors });
    onClose();
  };

  return (
    // 1. LE FOND : Flouté (backdrop-blur-sm) et légèrement assombri, mais pas noir !
    <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50">
      
      {/* 2. LA FENÊTRE : Dimensions exactes (598x616) et centrée avec les marges Figma (73px sur les côtés) */}
      <div className="bg-white rounded-[10px] w-[598px] h-[616px] relative pt-[79px] px-[73px] shadow-xl font-sans flex flex-col">
        
        {/* 3. LA CROIX : Positionnée exactement à 37px du haut et 38.67px de la droite */}
        <button 
          onClick={onClose}
          className="absolute top-[37px] right-[38.67px] hover:opacity-70 transition flex items-center justify-center"
        >
          <Image 
            src="/cross.svg" 
            alt="Fermer" 
            width={14} 
            height={14} 
            className="w-[14.33px] h-[14.33px]" 
          />
        </button>

        {/* TITRE PRINCIPAL */}
        <h2 
          className="text-[#1F1F1F] text-[24px] font-semibold mb-[33px]"
          style={{ fontFamily: "'Manrope', sans-serif", lineHeight: "100%" }}
        >
          Créer un projet
        </h2>

        {/* LE FORMULAIRE  */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[24px] flex-grow">
          
          {/* CHAMP : Titre */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[14px] font-normal text-[#1F1F1F]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Titre*
            </label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-[452px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] outline-none focus:border-[#D3590B] transition"
              required
            />
          </div>

          {/* CHAMP : Description */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[14px] font-normal text-[#1F1F1F]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Description*
            </label>
            <input 
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-[452px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] outline-none focus:border-[#D3590B] transition"
              required
            />
          </div>

          {/* CHAMP : Contributeurs */}
          <div className="flex flex-col gap-[7px]">
            <label className="text-[14px] font-normal text-[#1F1F1F]" style={{ fontFamily: "'Inter', sans-serif" }}>
              Contributeurs
            </label>
            <div className="relative w-[452px]">
              <input 
                type="text"
                placeholder="Choisir un ou plusieurs collaborateurs"
                value={contributors}
                onChange={(e) => setContributors(e.target.value)}
                className="w-full h-[53px] border border-[#E5E7EB] rounded-[4px] pl-[17px] pr-[40px] text-[14px] text-[#6B7280] outline-none focus:border-[#D3590B] transition cursor-pointer"
              />
              {/* 4. LA FLÈCHE */}
              <div className="absolute top-[22.5px] right-[17px] pointer-events-none flex items-center justify-center">
                 <Image 
                   src="/vector.svg" 
                   alt="Flèche" 
                   width={16} 
                   height={8} 
                   className="w-[16px] h-[8px]" 
                 />
              </div>
            </div>
          </div>

          {/* BOUTON : Ajouter un projet */}
          <button 
            type="submit"
            disabled={!title.trim() || !description.trim()}
            className="mt-auto mb-[60px] w-[181px] h-[50px] bg-[#E5E7EB] text-[#9CA3AF] rounded-[10px] text-[16px] font-normal flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#D1D5DB]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Ajouter un projet
          </button>

        </form>
      </div>
    </div>
  );
}