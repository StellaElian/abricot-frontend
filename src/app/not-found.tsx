import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center font-sans">
    
      <h1 
        className="text-[120px] font-bold text-[#D3590B] leading-none mb-[10px]" 
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        404
      </h1>
      
      {/* sous-titre */}
      <h2 
        className="text-[24px] font-semibold text-[#1F1F1F] mb-[10px]" 
        style={{ fontFamily: "'Manrope', sans-serif" }}
      >
        Page introuvable
      </h2>
      
      <p 
        className="text-[16px] text-[#6B7280] mb-[30px] text-center max-w-[450px]" 
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Oups ! La page que vous recherchez semble ne pas exister ou a été déplacée.
      </p>
      
      {/* Bouton de retour */}
      <Link 
        href="/dashboard" 
        className="w-[250px] h-[50px] bg-[#1F1F1F] text-[#FFFFFF] rounded-[10px] flex items-center justify-center font-medium hover:bg-black transition"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Retour au tableau de bord
      </Link>
      
    </div>
  );
}
