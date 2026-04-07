'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: any; // Pour dynamiser avec la vraie tâche cliquée
}

export default function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  // États avec tes valeurs Figma par défaut pour tester le design
  const [title, setTitle] = useState('authentification JWT');
  const [description, setDescription] = useState('complémenter le système d\'authentification avec tokens JWT');
  const [dueDate, setDueDate] = useState('9 mars');
  const [assigneesText, setAssigneesText] = useState('2 collaborateurs');
  const [status, setStatus] = useState('À faire'); // Pour gérer la sélection du badge

  // ⚡ DYNAMISATION 
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      
      if (task.dueDate) {
        const dateObj = new Date(task.dueDate);
        setDueDate(dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }));
      }
      
      if (task.assignees) {
        const count = task.assignees.length;
        setAssigneesText(`${count} collaborateur${count > 1 ? 's' : ''}`);
      }

      // Traduction du statut API vers le français pour sélectionner le bon badge
      if (task.status === 'TODO') setStatus('À faire');
      else if (task.status === 'IN_PROGRESS') setStatus('En cours');
      else if (task.status === 'DONE') setStatus('Terminée');
    }
  }, [task]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tâche modifiée :", { title, description, dueDate, assigneesText, status });
    onClose();
  };

  return (
    // 1. LE FOND : Flouté
    <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50">
      
      {/* 2. LA FENÊTRE : 598x799 px */}
      <div className="bg-[#FFFFFF] rounded-[10px] w-[598px] h-[799px] relative pt-[79px] px-[73px] pb-[79px] shadow-xl font-sans flex flex-col">
        
        {/* LA CROIX */}
        <button 
          onClick={onClose}
          className="absolute top-[37px] right-[38.67px] hover:opacity-70 transition flex items-center justify-center"
        >
          <Image src="/cross.svg" alt="Fermer" width={14} height={14} className="w-[14.33px] h-[14.33px]" />
        </button>

        {/* TITRE PRINCIPAL (Avec le texte tout à gauche et 40px d'espace en bas) */}
        <h2 
          className="text-[#1F1F1F] text-[24px] font-semibold mb-[40px] self-start"
          style={{ fontFamily: "'Manrope', sans-serif", lineHeight: "100%" }}
        >
          Modifier une tâche
        </h2>

        {/* LE FORMULAIRE (Bloc de saisie) */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          
          {/* CHAMP : Titre */}
          <div className="flex flex-col gap-[7px] mb-[24px]">
            <label className="text-[14px] font-normal text-[#000000]" style={{ fontFamily: "'Inter', sans-serif" }}>Titre</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-[452px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] text-[12px] text-[#6B7280] outline-none focus:border-[#D3590B] transition"
              required
            />
          </div>

          {/* CHAMP : Description */}
          <div className="flex flex-col gap-[7px] mb-[24px]">
            <label className="text-[14px] font-normal text-[#000000]" style={{ fontFamily: "'Inter', sans-serif" }}>Description</label>
            <input 
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-[452px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] text-[12px] text-[#6B7280] outline-none focus:border-[#D3590B] transition"
              required
            />
          </div>

          {/* CHAMP : Échéance */}
          <div className="flex flex-col gap-[7px] mb-[24px]">
            <label className="text-[14px] font-normal text-[#000000]" style={{ fontFamily: "'Inter', sans-serif" }}>Échéance</label>
            <div className="relative w-[452px]">
              <input 
                type="text"
                value={dueDate}
                readOnly
                className="w-full h-[53px] border border-[#E5E7EB] rounded-[4px] pl-[17px] pr-[45px] text-[12px] text-[#6B7280] outline-none transition bg-[#FFFFFF] cursor-pointer"
              />
              {/* L'icône calendrier (date.svg) */}
              <div className="absolute top-[18.23px] right-[17px] pointer-events-none flex items-center justify-center">
                 <Image src="/date.svg" alt="Calendrier" width={15} height={16.54} />
              </div>
            </div>
          </div>

          {/* CHAMP : Assigné à */}
          <div className="flex flex-col gap-[7px] mb-[24px]">
            <label className="text-[14px] font-normal text-[#000000]" style={{ fontFamily: "'Inter', sans-serif" }}>Assigné à :</label>
            <div className="relative w-[452px]">
              <input 
                type="text"
                value={assigneesText}
                readOnly
                className="w-full h-[53px] border border-[#E5E7EB] rounded-[4px] pl-[17px] pr-[40px] text-[12px] text-[#6B7280] outline-none transition cursor-pointer bg-[#FFFFFF]"
              />
              <div className="absolute top-[22.5px] right-[17px] pointer-events-none flex items-center justify-center">
                 <Image src="/vector.svg" alt="Flèche" width={16} height={8} className="w-[16px] h-[8px]" />
              </div>
            </div>
          </div>

          {/* CHAMP : Statut (Les Badges) */}
          <div className="flex flex-col">
            <label className="text-[14px] font-normal text-[#000000] mb-[16px]" style={{ fontFamily: "'Inter', sans-serif" }}>Statut :</label>
            <div className="flex items-center gap-[8px]">
              {/* Badge : À faire */}
              <button 
                type="button"
                onClick={() => setStatus('À faire')}
                className={`w-[75px] h-[25px] rounded-[50px] flex items-center justify-center text-[14px] font-normal transition ${status === 'À faire' ? 'bg-[#FFE0E0] text-[#EF4444] ring-2 ring-red-300' : 'bg-[#FFE0E0] text-[#EF4444] opacity-70 hover:opacity-100'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                À faire
              </button>

              {/* Badge : En cours */}
              <button 
                type="button"
                onClick={() => setStatus('En cours')}
                className={`w-[90px] h-[25px] rounded-[50px] flex items-center justify-center text-[14px] font-normal transition ${status === 'En cours' ? 'bg-[#FFF0D7] text-[#E08D00] ring-2 ring-orange-300' : 'bg-[#FFF0D7] text-[#E08D00] opacity-70 hover:opacity-100'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                En cours
              </button>

              {/* Badge : Terminée */}
              <button 
                type="button"
                onClick={() => setStatus('Terminée')}
                className={`w-[94px] h-[25px] rounded-[50px] flex items-center justify-center text-[14px] font-normal transition ${status === 'Terminée' ? 'bg-[#F1FFF7] text-[#27AE60] ring-2 ring-green-300' : 'bg-[#F1FFF7] text-[#27AE60] opacity-70 hover:opacity-100'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Terminée
              </button>
            </div>
          </div>

          {/* BOUTON */}
          <button 
            type="submit"
            className="mt-[56px] w-[244px] h-[50px] bg-[#E5E7EB] text-[#9CA3AF] rounded-[10px] text-[16px] font-normal flex items-center justify-center transition hover:bg-[#D1D5DB] self-start"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Enregistrer
          </button>

        </form>
      </div>
    </div>
  );
}