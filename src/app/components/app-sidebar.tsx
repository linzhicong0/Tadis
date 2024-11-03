import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Database, Server, Settings2 } from "lucide-react";

const items = [
    {
        title: "Connection",
        url: "/connection",
        icon: Server
    },
    {
        title: "Database",
        url: "/database",
        icon: Database
    },
    {
        title: "Setting",
        url: "/setting",
        icon: Settings2
    }
]

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" className="mt-8">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="-mt-2">
                        Madis
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

