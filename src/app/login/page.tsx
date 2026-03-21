'use client'; //dit à Next.js que c'est une page interactive (où l'utilisateur va taper des choses)

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Le GPS de Next.js
import Link from 'next/link';
import Cookies from 'js-cookie'; // Notre portefeuille pour le Badge VIP
import Image from 'next/image';

export default function LoginPage() {
    // Ces "states" vont mémoriser ce que l'utilisateur tape dans les cases
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter(); // On initialise le GPS

    // Cette fonction s'activera quand on cliquera sur "Se connecter"
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // On efface les anciennes erreurs à chaque nouvel essai

        try {
            // On envoie la demande au Backend
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST', // On POSTE des informations
                headers: {
                    'Content-Type': 'application/json', // on parle en format JSON
                },
                // On transforme l'email et le mot de passe en texte brut 
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json(); // On lit la réponse de la cuisine

            if (response.ok) {
                Cookies.set('token', data.data.token, { expires: 1 });
                router.push('/dashboard');

            } else {
                setError(data.message || 'Email ou mot de passe incorrect');
            }
        } catch (err) {
            setError('Impossible de joindre le serveur. Le backend est allumé ?');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#E5E7EB] font-sans overflow-hidden">

            {/* LA COLONNE DE GAUCHE (562px) */}
            <div className="relative w-full lg:w-[562px] min-h-[1024px] shrink-0 bg-[#E5E7EB]">

                {/* Le Logo en absolu */}
                <div className="absolute top-[92.92px] left-[154.72px]">
                    <Image src="/logoabricot.svg" alt="Logo Abricot" width={252.57} height={32.17} priority />
                </div>

                {/* Le Bloc Central (Formulaire) de 282px */}
                <div className="mt-[300px] w-[282px] mx-auto flex flex-col items-center">

                    <h1
                        className="text-[40px] text-[#D3590B] leading-none text-center mb-[30px] mt-[102px]"
                        style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}
                    >
                        Connexion
                    </h1>

                    {/* Affichage des erreurs (adapté à la taille du bloc) */}
                    {error && (
                        <div className="w-full bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-xs text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="w-full flex flex-col items-center">

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
                                className="w-[282px] h-[53px] rounded-[4px] border border-[#E5E7EB] bg-[#FFFFFF] px-3 focus:outline-none [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:black]"
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
                                className="w-[282px] h-[53px] rounded-[4px] border border-[#E5E7EB] bg-[#FFFFFF] px-3 focus:outline-none [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_white_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:black]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Bouton */}
                        <button
                            type="submit"
                            className="w-[249px] h-[50px] mt-[28px] bg-[#1F1F1F] text-[#FFFFFF] text-[16px] font-normal rounded-[4px] flex justify-center items-center"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Se connecter
                        </button>

                        <a
                            href="#"
                            className="mt-[21px] text-[#D3590B] text-[14px] font-normal underline"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Mot de passe oublié?
                        </a>
                    </form>
                </div>

                {/* Texte du bas en absolu */}
                <div className="absolute bottom-[92.92px] w-full flex justify-center gap-[10px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <span className="text-[#000000] text-[14px] font-normal">
                        Pas encore de compte ?
                    </span>
                    <Link href="/register" className="text-[#D3590B] text-[14px] font-normal underline">
                        Créer un compte
                    </Link>
                </div>
            </div>

            {/* LA COLONNE DE DROITE (Image) */}
            <div className="hidden lg:block relative w-[907px] h-[1024px]">
                <Image
                    src="/hero-login.jpg"
                    alt="Bureau avec outils"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>

        </div>
    );
}