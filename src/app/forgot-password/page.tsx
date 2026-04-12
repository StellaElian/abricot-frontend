'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // (pas de fetch vers le backend pour envoyer l'email) ==> simulation réussite pour l'expérience utilisateur 
        setIsSent(true);
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center font-sans">
            <div className="w-[400px] bg-white p-8 rounded-[10px] shadow-sm border border-[#E5E7EB] flex flex-col items-center">
                
                <h1 className="text-[24px] font-semibold text-[#1F1F1F] mb-[10px]" style={{ fontFamily: "'Manrope', sans-serif" }}>
                    Mot de passe oublié
                </h1>

                {!isSent ? (
                    //formulaire pour demander l'email
                    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                        <p className="text-[14px] text-[#6B7280] mb-[20px] text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Entrez votre adresse email ci-dessous. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </p>
                        
                        <input
                            type="email"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-[53px] border border-[#E5E7EB] rounded-[4px] px-[17px] text-[14px] outline-none focus:border-[#D3590B] mb-[20px]"
                            required
                        />
                        
                        <button 
                            type="submit"
                            className="w-full h-[50px] bg-[#1F1F1F] text-white rounded-[10px] hover:bg-black transition"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            Envoyer le lien
                        </button>
                    </form>
                ) : (
                    // message de succès
                    <div className="flex flex-col items-center text-center">
                        <div className="w-[50px] h-[50px] bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-[15px] text-[24px]">
                            ✓
                        </div>
                        <p className="text-[14px] text-[#6B7280] mb-[20px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Si l'adresse <span className="font-semibold text-[#1F1F1F]">{email}</span> existe dans notre base de données, vous recevrez un email contenant les instructions de réinitialisation d'ici quelques minutes. N'hésitez pas à consulter les spams .
                        </p>
                    </div>
                )}

                {/* retour à la connexion */}
                <Link href="/login" className="mt-[20px] text-[14px] text-[#D3590B] hover:underline" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Retour à la page de connexion
                </Link>

            </div>
        </div>
    );
}