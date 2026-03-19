'use client'; //dit à Next.js que c'est une page interactive (où l'utilisateur va taper des choses)

import { useState } from 'react';

export default function LoginPage() {
    // Ces "states" vont mémoriser ce que l'utilisateur tape dans les cases
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Cette fonction s'activera quand on cliquera sur "Se connecter"
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêche la page de se recharger
        console.log("On va essayer de connecter :", email, password);
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold text-center text-orange-500 mb-6">Connexion Abricot 🍑</h1>

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