'use client'; //dit à Next.js que c'est une page interactive (où l'utilisateur va taper des choses)

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Le GPS de Next.js
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
                Cookies.set('token', data.token, { expires: 1 });
                router.push('/dashboard');

            } else {
                setError(data.message || 'Email ou mot de passe incorrect');
            }
        } catch (err) {
            setError('Impossible de joindre le serveur. Le backend est allumé ?');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold text-center text-orange-500 mb-6">Connexion Abricot 🍑</h1>

                {/* Si on a une erreur, on l'affiche dans une boîte rouge */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:border-orange-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:border-orange-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition"
                    >
                        Se connecter
                    </button>
                </form>
            </div>
        </div>
    );
}