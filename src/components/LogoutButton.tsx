'use client'; // On précise que ce petit bout de code est interactif (il écoute les clics)

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // On jette le Badge VIP
        Cookies.remove('token');
        //on utilise le GPS pour retourner à la porte d'entrée
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold transition"
        >
            Se déconnecter
        </button>
    );
}
