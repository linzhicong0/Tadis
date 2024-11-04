import { Cog, Trash2, Unplug } from "lucide-react";

interface ConnectionCardProps {
    name: string;
    address: string;
    status: string;
    onPlay?: () => void;
    onSettings?: () => void;
    onDelete?: () => void;
}

export default function ConnectionCard({ name, address, status, onPlay, onSettings, onDelete }: ConnectionCardProps) {
    return (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-4 w-[220px] h-[200px] flex flex-col shadow-lg shadow-black/20 backdrop-blur-sm">
            {/* Card Header */}
            <h3 className="text-white text-xl font-medium mb-2">{name}</h3>

            {/* Connection Info */}
            <p className="text-gray-400 text-sm mb-2">{address}</p>
            <p className="text-gray-400 mb-auto">{status}</p>

            {/* Action Buttons */}
            <div className="flex justify-end gap-0.5 mt-4">
                <button
                    onClick={onPlay}
                    className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                    <Unplug className="w-5 h-5" />
                </button>
                <button
                    onClick={onSettings}
                    className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                    <Cog className="w-5 h-5" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}