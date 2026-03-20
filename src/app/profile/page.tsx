'use client';//dit à Next.js que c'est une page interactive (où l'utilisateur va taper des choses)

import { useState, useEffect } from 'react';// memoire usestate+action automatique useeffect
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';// Le GPS de Next.js

export default function ProfilePage() {
    //On crée des cases mémoires pour stocker ce que l'utilisateur tape
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Reste vide par sécurité    
    const [message, setMessage] = useState({ text: '', type: '' }); // Pour afficher succès ou erreurs
    const router = useRouter();

    //Au chargement(action automatique), on va chercher les infos de l'utilisateur
    useEffect(() => {
        const fetchProfile = async () => {
            const token = Cookies.get('token');

            // Sécurité 1 : Si pas de token, ou si le navigateur a stocké "undefined" par erreur
            if (!token || token === 'undefined') {
                Cookies.remove('token');
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/auth/profile', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                // Sécurité 2 : Le token est expiré (ton problème d'hier !)
                if (response.status === 401) {
                    Cookies.remove('token');
                    router.push('/login');
                    return;
                }

                if (response.ok) {
                    const responseData = await response.json();
                    if (responseData.data) {
                        setName(responseData.data.name || '');
                        setEmail(responseData.data.email || '');
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du profil", error);
            }
        };

        fetchProfile();
    }, [router]);

    // Quand on clique sur "Enregistrer les modifications"
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        const token = Cookies.get('token');

        // Sécurité 3 : On vérifie le token juste avant d'envoyer
        if (!token || token === 'undefined') {
            setMessage({ text: 'Session expirée. Veuillez vous reconnecter.', type: 'error' });
            return;
        }

        try {
            // On utilise EXACTEMENT l'adresse indiquée par le fichier Backend
            const response = await fetch('http://localhost:8000/auth/profile', {
                method: 'PUT', // PUT pour modifier des données
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, email }),
            });

            if (response.ok) {
                setMessage({ text: 'Profil mis à jour avec succès ! 🍑', type: 'success' });
            } else {
                const data = await response.json();
                setMessage({ text: data.message || 'Erreur lors de la mise à jour', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Impossible de joindre le serveur.', type: 'error' });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-center text-orange-500 mb-6">Mon Profil</h1>

                {/* Affichage des messages de succès ou d'erreur */}
                {message.text && (
                    <div className={`px-4 py-3 rounded mb-4 text-sm ${message.type === 'success' ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                        <input
                            type="text"
                            className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:border-orange-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe (optionnel)</label>
                        <input
                            type="password"
                            placeholder="Laisser vide pour ne pas changer"
                            className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:border-orange-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-slate-900 text-white font-bold py-2 px-4 rounded hover:bg-slate-800 transition mt-2"
                    >
                        Enregistrer les modifications
                    </button>
                </form>
            </div>
        </div>
    );
}