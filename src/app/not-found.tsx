import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center font-sans px-4">
    
      <h1 
        className="text-[80px] md:text-[120px] font-bold text-[#D3590B] leading-none mb-[10px] font-manrope" 
      >
        404
      </h1>
      
      {/* sous-titre */}
      <h2 
        className="text-[20px] md:text-[24px] font-semibold text-[#1F1F1F] mb-[10px] text-center font-manrope" 
      >
        Page introuvable
      </h2>
      
      <p 
        className="text-[14px] md:text-[16px] text-[#6B7280] mb-[30px] text-center w-full max-w-[450px] font-inter" 
      >
        Oups ! La page que vous recherchez semble ne pas exister ou a été déplacée.
      </p>
      
      {/* Bouton de retour */}
      <Link 
        href="/dashboard" 
        className="w-full max-w-[250px] h-[50px] bg-[#1F1F1F] text-[#FFFFFF] rounded-[10px] flex items-center justify-center font-medium hover:bg-black transition text-[14px] md:text-[16px] font-inter"
      >
        Retour au tableau de bord
      </Link>
      
    </div>
  );
}