'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: any; // reçoit les données des projets
}

export default function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
    // Les états commencent vide
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [contributorsText, setContributorsText] = useState('');

    //dynamisation
    useEffect(() => {
        if (project) {
            setTitle(project.title || project.name || '');
            setDescription(project.description || '');
            //calcul nbr contributeurs 
            const contributorsList = [
                project.owner,
                ...(project.members?.map((m: any) => m.user || m).filter((u: any) => u?.id !== project.owner?.id) || [])
            ].filter(Boolean);

            const count = contributorsList.length;
            setContributorsText(`${count} collaborateur${count > 1 ? 's' : ''}`);
        }
    }, [project]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = Cookies.get('token');
            const response = await fetch(`http://localhost:8000/projects/${project.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: title,
                    description: description
                })
            });

            if (response.ok) {
                console.log("Projet modifié avec succès ");
                onClose();
                window.location.reload();
            } else {
                alert("Erreur lors de la modification du projet");
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
            alert("Impossible de joindre le serveur. ");
        }

    };

    return (
        // LE FOND : Flouté (backdrop-blur-sm)
        <div className="fixed inset-0 bg-gray-500/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            {/* LA FENÊTRE */}
            <div className="bg-[#FFFFFF] rounded-[10px] w-full max-w-[598px] min-h-[500px] lg:h-[616px] relative pt-[60px] lg:pt-[79px] px-6 lg:px-[73px] pb-[40px] lg:pb-[79px] shadow-xl font-sans flex flex-col">

                {/* LA CROIX */}
                <button
                    onClick={onClose}
                    aria-label="Fermer la fenêtre"
                    className="absolute top-[20px] lg:top-[37.5px] right-[20px] lg:right-[39.17px] hover:opacity-70 transition flex items-center justify-center"
                >
                    <Image
                        src="/cross.svg"
                        alt=""
                        aria-hidden="true"
                        width={14}
                        height={14}
                        className="w-[13.33px] h-[13.33px]"
                    />
                </button>

                {/* TITRE PRINCIPAL */}
                <h2
                    className="text-[#1F1F1F] text-[20px] lg:text-[24px] font-semibold mb-[24px] lg:mb-[40px] mt-0 lg:mt-[28.17px] font-manrope"
                    style={{ lineHeight: "100%" }}
                >
                    Modifier un projet
                </h2>

                {/* LE FORMULAIRE  */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] lg:gap-[24px] flex-grow">

                    {/* CHAMP : Titre */}
                    <div className="flex flex-col gap-[7px]">
                        <label htmlFor="title" className="text-[14px] font-normal text-[#1F1F1F] font-inter">
                            Titre*
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full lg:w-[452px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] text-[14px] text-[#6B7280] outline-none focus:border-[#D3590B] transition"
                            required
                        />
                    </div>

                    {/* CHAMP : Description */}
                    <div className="flex flex-col gap-[7px]">
                        <label htmlFor="description" className="text-[14px] font-normal text-[#1F1F1F] font-inter">
                            Description*
                        </label>
                        <input
                            id="description"
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full lg:w-[452px] h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] text-[14px] text-[#6B7280] outline-none focus:border-[#D3590B] transition"
                            required
                        />
                    </div>

                    {/* CHAMP : Contributeurs */}
                    <div className="flex flex-col gap-[7px]">
                        <label htmlFor="contributors" className="text-[14px] font-normal text-[#1F1F1F] font-inter">
                            Contributeurs
                        </label>
                        <div className="relative w-full lg:w-[452px]">
                            <input
                                id="contributors"
                                type="text"
                                value={contributorsText}
                                onChange={(e) => setContributorsText(e.target.value)}
                                className="w-full h-[53px] border border-[#E5E7EB] rounded-[4px] pl-[17px] pr-[40px] text-[14px] text-[#6B7280] outline-none focus:border-[#D3590B] transition cursor-pointer"
                            />
                            {/* LA FLÈCHE (vers le bas) */}
                            <div className="absolute top-[22.5px] right-[17px] pointer-events-none flex items-center justify-center">
                                <Image
                                    src="/vector.svg"
                                    alt=""
                                    aria-hidden="true"
                                    width={16}
                                    height={8}
                                    className="w-[16px] h-[8px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* BOUTONS : Enregistrer et Supprimer */}
                    <div className="mt-auto flex flex-col-reverse lg:flex-row items-center justify-between w-full gap-4 lg:gap-0">
                        <button
                            type="submit"
                            className="mt-auto w-full lg:w-[181px] h-[50px] bg-[#E5E7EB] text-[#9CA3AF] rounded-[10px] text-[16px] font-normal flex items-center justify-center transition hover:bg-[#D1D5DB] font-inter"
                        >
                            Enregistrer
                        </button>

                        {/* BOUTON SUPPRIMER */}
                        <button
                            type="button"
                            onClick={async () => {
                                {
                                    if (window.confirm("Voulez-vous vraiment supprimer ce projet de manière définitive ?"))

                                        try {
                                            const token = Cookies.get('token');
                                            const response = await fetch(`http://localhost:8000/projects/${project.id}`, {
                                                method: 'DELETE',
                                                headers: {
                                                    'Authorization': `Bearer ${token}`
                                                }
                                            });

                                            if (response.ok) {
                                                onClose();
                                                window.location.href = '/projects';
                                            } else {
                                                alert("Erreur lors de la suppression du projet");
                                            }
                                        }
                                        catch (error) {
                                            alert("Impossible de joindre le serveur. ");
                                        }
                                };
                            }
                            }
                            className="text-[#EF4444] text-[14px] font-medium underline cursor-pointer hover:opacity-70 transition mt-2 lg:mt-0 font-inter"
                        >
                            Supprimer le projet
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}