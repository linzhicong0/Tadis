'use client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { RedisClientInfo } from "@/models/redisClientInfo"
import { redisCommands } from "@/services/redis-commands"
import { useState } from "react"
import { useEffect } from "react"

export default function ConnectedClientsTable() {
    const [clients, setClients] = useState<RedisClientInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        redisCommands.getClientList()
            .then((clients) => {
                setClients(clients);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-[200px]">Loading...</div>;
    }
    return (
        <div className="rounded-md max-h-[200px] overflow-y-auto">
            <Table className="border-none">
                <TableHeader className="top-0 bg-white dark:bg-gray-800 z-10 border-none">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[80px]">#</TableHead>
                        <TableHead>ip</TableHead>
                        <TableHead>db</TableHead>
                        <TableHead>connected time</TableHead>
                        <TableHead>idle time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clients.map((client, index) => (
                        <TableRow key={client.id} className="hover:bg-white bg-gray-50 dark:bg-gray-800 dark:hover:bg-blue-500/30 border-none">
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{client.ip}</TableCell>
                            <TableCell>{client.db}</TableCell>
                            <TableCell>{client.connectedTime}</TableCell>
                            <TableCell>{client.idleTime}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}