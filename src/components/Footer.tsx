import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="w-full h-[68px] bg-[#FFFFFF] flex items-center justify-between pl-[30px] pr-[54px] border-t border-gray-100">

            {/* PARTIE GAUCHE : Le Logo */}
            <div className="flex-shrink-0">
                <Image
                    src="/logo2.svg"
                    alt="Logo Abricot Footer"
                    width={101}
                    height={12.86}
                    priority
                />
            </div>

            {/* PARTIE DROITE : Le Texte  */}
            <div className="flex-shrink-0">
                <span
                    className="text-[#000000] text-[16px] font-normal"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    Abricot 2025
                </span>
            </div>

        </footer>
    );
}