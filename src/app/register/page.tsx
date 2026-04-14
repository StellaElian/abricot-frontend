'use client'; //dit à Next.js que c'est une page interactive (où l'utilisateur va taper des choses)

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function RegisterPage() {
    // Ces "states" vont mémoriser ce que l'utilisateur tape dans les cases
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter(); // On initialise le GPS

    // s'activera que quand on clique sur "S'inscrire'"
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // On efface les anciennes erreurs à chaque nouvel essai

        try {
            // On envoie la demande au Backend
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST', // On POSTE des infos
                headers: {
                    'Content-Type': 'application/json',
                },
                // On transforme l'email et le mot de passe en texte brut 
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json(); 

            if (response.ok) {
                // Si le backend nous donne un token direct, on connecte l'utilisateur
                if (data.data && data.data.token) {
                    Cookies.set('token', data.data.token, { expires: 1 });
                    router.push('/dashboard');
                } else {
                    // Sinon on l'envoie se connecter
                    router.push('/login');
                }
            } else {
                setError(data.message || "Erreur lors de l'inscription");
            }
        } catch (err) {
            setError('Impossible de joindre le serveur.');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#E5E7EB] font-sans overflow-x-hidden lg:overflow-hidden">

            {/* COLONNE DE GAUCHE */}
            <div className="relative w-full lg:w-[562px] min-h-screen lg:min-h-[1024px] shrink-0 bg-[#E5E7EB] flex flex-col lg:block">

                {/* Logo */}
                <div className="absolute top-[40px] lg:top-[92.92px] left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[154.72px]">
                    <Image src="/logoabricot.svg" alt="Logo Abricot" width={252.57} height={32.17} priority className="w-[180px] lg:w-[252.57px] h-auto" />
                </div>

                {/* Le Bloc Central (Formulaire) */}
                <div className="mt-[120px] lg:mt-[300px] w-full px-4 lg:px-0 lg:w-[282px] mx-auto flex flex-col items-center">

                    <h1
                        className="text-[32px] lg:text-[40px] text-[#D3590B] leading-none text-center mb-[30px] mt-[20px] lg:mt-[102px]"
                        style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}
                    >
                        Inscription
                    </h1>

                    {/* Affichage des erreurs */}
                    {error && (
                        <div className="w-full max-w-[282px] bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-xs text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="w-full max-w-[282px] flex flex-col items-center">

                        {/* Email */}
                        <div className="w-full flex flex-col">
                            <label
                                className="text-[#000000] text-[14px] font-normal mb-[7px] text-left"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full lg:w-[282px] h-[53px] rounded-[4px] border border-[#E5E7EB] bg-[#FFFFFF] px-3 focus:outline-none [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:black]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Mot de passe */}
                        <div className="w-full flex flex-col mt-[29px]">
                            <label
                                className="text-[#000000] text-[14px] font-normal mb-[7px] text-left"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                className="w-full lg:w-[282px] h-[53px] rounded-[4px] border border-[#E5E7EB] bg-[#FFFFFF] px-3 focus:outline-none [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:black]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Bouton */}
                        <button
                            type="submit"
                            className="w-full lg:w-[249px] h-[50px] mt-[28px] bg-[#1F1F1F] text-[#FFFFFF] text-[16px] font-normal rounded-[10px] flex justify-center items-center"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            S'inscrire
                        </button>

                    </form>
                </div>

                {/* Texte du bas */}
                <div className="absolute bottom-[40px] lg:bottom-[92.92px] w-full flex justify-center" style={{ fontFamily: "'Inter', sans-serif" }}>

                    <div className="w-auto flex justify-start gap-[10px]">
                        <span className="text-[#000000] text-[14px] font-normal">
                            Déjà inscrit ?
                        </span>
                        <Link href="/login" className="text-[#D3590B] text-[14px] font-normal underline">
                            Se connecter
                        </Link>
                    </div>

                </div>

            </div>

            {/* COLONNE DE DROITE (Image) */}
            <div className="hidden lg:block relative h-[1024px] flex-1 ">
                <Image
                    src="/hero-register.jpg"
                    alt="Bureau avec fournitures"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center', overflow: 'hidden' }}
                    priority
                />
            </div>

        </div>
    );
}