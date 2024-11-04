import { MoveDiagonal2 } from 'lucide-react';

export default function MaxButton({ handleMaximize }: { handleMaximize: () => void }) {
    return (
      <button 
        className="w-[12px] h-[12px] rounded-full bg-[#28C840] relative "
        onClick={handleMaximize}
      >
        <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
            <MoveDiagonal2 className="w-[10px] h-[10px] text-gray-800" />
        </span>
      </button>
    );
}