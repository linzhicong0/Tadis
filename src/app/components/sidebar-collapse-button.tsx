import { useSidebar } from "@/components/ui/sidebar"
import { PanelLeft } from "lucide-react"

export default function SidebarCollapseButton() {
    const { toggleSidebar } = useSidebar()

    return (
        <button
            className="hover:text-blue-600 dark:text-gray-300 dark:hover:text-white"
            onClick={toggleSidebar}
        >
            <PanelLeft className="w-[18px] h-[18px]" />
        </button>
    )
}