import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeft } from "lucide-react"

export default function SidebarCollapseButton() {
    const { toggleSidebar } = useSidebar()

    return (
        <button
            className="text-gray-300 hover:text-white"
            onClick={toggleSidebar}
        >
            <PanelLeft className="w-[18px] h-[18px]"/>
        </button>
    )
}