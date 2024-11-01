import { Minus } from 'lucide-react';
import { Window } from '@tauri-apps/api/window'


export default function MinButton() {

    const handleMinimize = () => Window.getCurrent().minimize();

    return (
      <button 
        className="w-[12px] h-[12px] rounded-full bg-[#FFBD2E] relative group"
        onClick={handleMinimize}
      >
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <Minus className="w-[10px] h-[10px] text-gray-800" />
        </span>
      </button>
    );
}