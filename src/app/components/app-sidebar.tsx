'use client';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { Database, Server, Settings2 } from "lucide-react";
import { usePathname } from "next/navigation";

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
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon" className="mt-8">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="-mt-2">
                        Madis
                    </SidebarGroupLabel>
                    <SidebarSeparator />
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton 
                                        asChild 
                                        isActive={pathname === item.url}
                                    >
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

