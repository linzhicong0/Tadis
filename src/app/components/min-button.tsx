import { Minus } from 'lucide-react';


export default function MinButton({ handleMinimize }: { handleMinimize: () => void }) {

    return (
      <button 
        className="w-[12px] h-[12px] rounded-full bg-[#FFBD2E] relative "
        onClick={handleMinimize}
      >
        <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
            <Minus className="w-[10px] h-[10px] text-gray-800" />
        </span>
      </button>
    );
}