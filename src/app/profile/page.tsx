'use client'; //dit à Next.js que c'est une page interactive

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Le GPS de Next.js
import Link from 'next/link';
import Cookies from 'js-cookie'; // Notre portefeuille pour le Badge VIP

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
                // Si la connexion réussit, on range le Badge VIP (token) dans les cookies
                // ATTENTION : on utilise data.data.token car le backend range les infos dans une boîte "data"
                Cookies.set('token', data.data.token, { expires: 1 }); // expire dans 1 jour

                // Le GPS nous emmène vers le Dashboard
                router.push('/dashboard');

            } else {
                // Si le backend dit non, on affiche son message d'erreur
                setError(data.message || 'Email ou mot de passe incorrect');
            }
        } catch (err) {
            setError('Impossible de joindre le serveur. Le backend est allumé ?');
        }
    };

    return (
        // 👇 LA GRANDE STRUCTURE EN DEUX COLONNES (Flex)
        <div className="flex min-h-screen bg-white">

            {/* 🖥️ COLONNE DE GAUCHE (Illustration) - Cachée sur mobile, visible sur PC (md:) */}
            <div className="hidden md:flex md:w-1/2 bg-orange-500 p-12 flex-col justify-center items-center text-white">
                {/* Le grand texte de la maquette */}
                <h2 className="text-5xl font-extrabold mb-12 leading-tight max-w-lg text-center">
                    Collaborez simplement sur vos projets.
                </h2>
                {/* 🎨 Placeholder pour l'illustration de la maquette. 
                    Dans un vrai projet, on mettrait une balise <Image /> ici. */}
                <div className="w-full max-w-lg h-96 bg-orange-600 rounded-2xl flex items-center justify-center border-4 border-orange-400 border-dashed">
                    <span className="text-orange-200 text-sm">[ Illustration Maquette ]</span>
                </div>
            </div>

            {/* 📝 COLONNE DE DROITE (Le Formulaire) */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16">

                {/* Le Logo en haut à droite */}
                <div className="absolute top-8 right-8 font-bold text-2xl text-orange-500">
                    🍑 Abricot
                </div>

                {/* La boîte qui contient le formulaire, alignée à gauche */}
                <div className="w-full max-w-md">

                    {/* Le Titre exact de la maquette */}
                    <h1 className="text-4xl font-bold text-slate-900 mb-8">Connexion Abricot</h1>

                    {/* Si on a une erreur, on l'affiche dans une boîte rouge */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        {/* CASE EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1.5">E-mail</label>
                            <input
                                type="email"
                                // Placeholder exact de la maquette
                                placeholder="name@company.com"
                                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* CASE MOT DE PASSE */}
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1.5">Mot de passe</label>
                            <input
                                type="password"
                                // Placeholder exact de la maquette
                                placeholder="••••••••••••"
                                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* 🔗 Ligne intermédiaire (Se souvenir de moi + Mot de passe oublié) */}
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                                <input type="checkbox" className="accent-orange-500 h-4 w-4 rounded border-slate-300" />
                                Se souvenir de moi
                            </label>
                            {/* Le lien vers "Mot de passe oublié" n'est pas géré par le backend, 
                                donc il est juste visuel pour le moment. */}
                            <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                                Mot de passe oublié ?
                            </a>
                        </div>

                        {/* LE BOUTON ORANGE */}
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition shadow-sm mt-3"
                        >
                            Se connecter
                        </button>

                    </form>
                    {/* Fin de ton formulaire de connexion */}

                </div> {/* Fin de la div w-full max-w-md */}

                {/* 👇 LE FAMEUX BLOC AU PIXEL PRÈS */}
                {/* mt-[202px] = 202 pixels d'écart avec le formulaire au-dessus */}
                {/* mb-[92px]  = 92 pixels d'écart avec le bas de la page */}
                {/* gap-[10px] = 10 pixels exactement entre les deux phrases */}
                <div className="mt-[202px] mb-[92px] flex items-center justify-center gap-[10px] text-sm text-slate-600">
                    <span>Pas encore de compte ?</span>
                    <Link href="/register" className="text-orange-500 hover:text-orange-600 font-bold underline">
                        Créer un compte
                    </Link>
                </div>

            </div>
        </div>
    );
}