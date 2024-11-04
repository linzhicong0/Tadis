import { X } from 'lucide-react';

export default function CloseButton({ onClose }: { onClose: () => void }) {
    return (
        <button
            className="w-[12px] h-[12px] rounded-full bg-[#FF5F57] relative"
            onClick={onClose}
        >
            <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
                <X className="w-[10px] h-[10px] text-gray-800" />
            </span>
        </button>
    );
}