'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string; //on accepte l'id en paramètre
  contributors: any[]; //On accepte la liste des membres du projet
}

export default function CreateTaskModal({ isOpen, onClose, projectId, contributors = [] }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [status, setStatus] = useState('À faire');
  


  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) return; 
    try {
      const token = Cookies.get('token'); 

      // Traduction du statut en anglais pour le backend 
      let backendStatus = "TODO";
      if (status === "En cours") backendStatus = "IN_PROGRESS";
      if (status === "Terminée") backendStatus = "DONE";

      const response = await fetch(`http://localhost:8000/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title,
          description: description,
          status: backendStatus,
          // Conversion date 
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          //tableau de vrais ID
          assignees: selectedAssignees 
        })
      });

      if (response.ok) {
        console.log("Tâche créée !");
        onClose();
        window.location.reload(); // Rafraîchit la page pour voir la nouvelle tâche
      } else {
        const errorData = await response.json();
        console.error("Erreur backend:", errorData);
        alert("Erreur lors de la création de la tâche.");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      alert("Impossible de joindre le serveur.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="bg-[#FFFFFF] rounded-[10px] w-[598px] h-[799px] relative pt-[79px] px-[73px] pb-[79px] shadow-xl font-sans flex flex-col">
        
        <button 
          onClick={onClose}
          className="absolute top-[37px] right-[38.67px] hover:opacity-70 transition flex items-center justify-center"
        >
          <Image src="/cross.svg" alt="Fermer" width={14} height={14} className="w-[14.33px] h-[14.33px]" />
        </button>

        <h2 
          className="text-[#1F1F1F] text-[24px] font-semibold mb-[40px] self-start"
          style={{ fontFamily: "'Manrope', sans-serif", lineHeight: "100%" }}
        >
          Créer une tâche
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          
          <div className="flex flex-col gap-[7px] mb-[24px]">
            <label className="text-[14px] font-normal text-[#000000]" style={{ fontFamily: "'Inter', sans-serif" }}>Titre*</label>
            <input 
              type="text"
              placeholder="Ex: Authentification JWT"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-[452px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] text-[12px] text-[#6B7280] outline-none focus:border-[#D3590B] transition"
              required
            />
          </div>

          <div className="flex flex-col gap-[7px] mb-[24px]">
            <label className="text-[14px] font-normal text-[#000000]" style={{ fontFamily: "'Inter', sans-serif" }}>Description*</label>
            <input 
              type="text"
              placeholder="Description de la tâche..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-[452px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] text-[12px] text-[#6B7280] outline-none focus:border-[#D3590B] transition"
              required
            />
          </div>

          <div className="flex flex-col gap-[7px] mb-[24px]">
            <label className="text-[14px] font-normal text-[#000000]" style={{ fontFamily: "'Inter', sans-serif" }}>Échéance*</label>
            <div className="relative w-[452px]">
              <input 
                type="date"
                placeholder="Sélectionner une date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-[53px] border border-[#E5E7EB] rounded-[4px] pl-[17px] pr-[45px] text-[12px] text-[#6B7280] outline-none focus:border-[#D3590B] transition cursor-pointer"
              />
            </div>
          </div>

         <div className="flex flex-col gap-[7px] mb-[24px]">
            <label className="text-[14px] font-normal text-[#000000]" style={{ fontFamily: "'Inter', sans-serif" }}>Assigné à :</label>
            <div className="relative w-[452px]">
              
              {/* Le bouton pour ouvrir le menu déroulant */}
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full min-h-[53px] border border-[#E5E7EB] rounded-[4px] pl-[17px] pr-[40px] py-[15px] text-[12px] text-[#6B7280] transition cursor-pointer flex flex-wrap gap-[5px]"
              >
                {selectedAssignees.length === 0 ? (
                  "Choisir un ou plusieurs collaborateurs"
                ) : (
                  // On affiche les personnes sélectionnées
                  selectedAssignees.map(id => {
                    const person = contributors.find((c: any) => c.id === id || c.userId === id);
                    const name = person?.name || person?.user?.name || "Inconnu";
                    return (
                      <span key={id} className="bg-[#E5E7EB] text-[#1F1F1F] px-[8px] py-[2px] rounded-[4px]">
                        {name}
                      </span>
                    );
                  })
                )}
              </div>
              <div className="absolute top-[22.5px] right-[17px] pointer-events-none flex items-center justify-center">
                 <Image src="/vector.svg" alt="Flèche" width={16} height={8} className={`w-[16px] h-[8px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {/* LE MENU DÉROULANT CACHÉ (S'affiche que si on a cliqué) */}
              {isDropdownOpen && (
                <div className="absolute top-[58px] left-0 w-full bg-white border border-[#E5E7EB] rounded-[4px] shadow-md z-10 max-h-[150px] overflow-y-auto">
                  {contributors && contributors.length > 0 ? (
                    contributors.map((contributor: any, index: number) => {
                      const targetId = contributor.userId || contributor.id;
                      const fullName = contributor.name || contributor.user?.name || `${contributor.firstName || ''} ${contributor.lastName || ''}`.trim() || 'Inconnu';
                      const isSelected = selectedAssignees.includes(targetId);

                      return (
                        <div 
                          key={index}
                          onClick={() => {
                            // Clic : Si déjà coché, on l'enlève. Sinon, on l'ajoute.
                            if (isSelected) {
                              setSelectedAssignees(selectedAssignees.filter(id => id !== targetId));
                            } else {
                              setSelectedAssignees([...selectedAssignees, targetId]);
                            }
                          }}
                          className="px-[17px] py-[10px] text-[12px] text-[#1F1F1F] hover:bg-[#F3F4F6] cursor-pointer flex items-center gap-[10px]"
                        >
                          <input type="checkbox" checked={isSelected} readOnly className="cursor-pointer" />
                          {fullName}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-[17px] py-[10px] text-[12px] text-[#6B7280]">Aucun collaborateur dans ce projet</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[14px] font-normal text-[#000000] mb-[16px]" style={{ fontFamily: "'Inter', sans-serif" }}>Statut :</label>
            <div className="flex items-center gap-[8px]">
              <button 
                type="button"
                onClick={() => setStatus('À faire')}
                className={`w-[75px] h-[25px] rounded-[50px] flex items-center justify-center text-[14px] font-normal transition ${status === 'À faire' ? 'bg-[#FFE0E0] text-[#EF4444] ring-2 ring-red-300' : 'bg-[#FFE0E0] text-[#EF4444] opacity-70 hover:opacity-100'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                À faire
              </button>

              <button 
                type="button"
                onClick={() => setStatus('En cours')}
                className={`w-[90px] h-[25px] rounded-[50px] flex items-center justify-center text-[14px] font-normal transition ${status === 'En cours' ? 'bg-[#FFF0D7] text-[#E08D00] ring-2 ring-orange-300' : 'bg-[#FFF0D7] text-[#E08D00] opacity-70 hover:opacity-100'}`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                En cours
              </button>

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

          {/* Bouton "Ajouter une tâche" */}
          <button 
            type="submit"
            disabled={!title.trim() || !description.trim()}
            className="mt-[56px] w-[181px] h-[50px] bg-[#E5E7EB] text-[#9CA3AF] rounded-[10px] text-[16px] font-normal flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#D1D5DB] self-start"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            + Ajouter une tâche
          </button>

        </form>
      </div>
    </div>
  );
}