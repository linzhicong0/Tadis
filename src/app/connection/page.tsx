'use client';
import { PlusIcon, Server, Tag } from "lucide-react";
import ConnectionCard from "../components/connection-card";
import { useEffect, useState } from "react";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserIcon, KeyIcon } from "lucide-react";
import { connectionCommands } from "@/services/connection-commands";

interface Connection {
    id: string;
    name: string;
    address: string;
    status: string;
}

interface ConnectionGridProps {
    connections: Connection[];
    onAddNew: () => void;
}

let connections: Connection[] = [
    { id: '1', name: 'Connection 1', address: '192.168.1.1', status: 'Connected' },
    { id: '2', name: 'Connection 2', address: '192.168.1.2', status: 'Disconnected' },
    { id: '3', name: 'Connection 3', address: '192.168.1.3', status: 'Disconnected' },
];

export default function Connection() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        host: '',
        port: '',
        username: '',
        password: ''
    });

    useEffect(() => {
        connectionCommands.loadConfig()
            .then((value) => {
                console.log('Config loaded successfully:', value);
            })
            .catch((error) => {
                console.error('Error loading config:', error);
            });


    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            await connectionCommands.saveConfig({
                name: formData.name,
                host: formData.host,
                port: Number(formData.port),
                username: formData.username,
                password: formData.password
            });
            setIsDialogOpen(false);
            // Reset form
            setFormData({
                name: '',
                host: '',
                port: '',
                username: '',
                password: ''
            });
        } catch (error) {
            console.error('Error saving config:', error);
        }
    };

    return (
        <div>
            <div className="grid auto-rows-[200px] grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 p-4">
                {connections.map((connection) => (
                    <ConnectionCard
                        key={connection.id}
                        name={connection.name}
                        address={connection.address}
                        status={connection.status}
                        onPlay={() => console.log('Play', connection.id)}
                        onSettings={() => console.log('Settings', connection.id)}
                        onDelete={() => console.log('Delete', connection.id)}
                    />
                ))}

                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-gray-800 rounded-lg p-4 flex items-center justify-center hover:bg-gray-700 transition-colors w-[220px] h-[200px]"
                >
                    <PlusIcon className="w-12 h-12 text-gray-400" />
                </button>
            </div>

            <CustomDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <div className="text-white px-4 select-none">
                    <h2 className="text-2xl font-normal mb-4">Create Connection</h2>
                    <form className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-base">Connection Name</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2  w-5 h-5" />
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="connection name"
                                    className="bg-[#2c2c2c] border-none pl-10 h-10 text-white placeholder:text-base text-base"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-base">Host</label>
                                <div className="relative">
                                    <Server className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                                    <Input
                                        name="host"
                                        value={formData.host}
                                        onChange={handleInputChange}
                                        placeholder="127.0.0.1"
                                        className="bg-[#2c2c2c] border-none pl-10 h-10 text-white placeholder:text-base text-base"
                                    />
                                </div>
                            </div>

                            <div className="w-32 space-y-2">
                                <label className="text-base">Port</label>
                                <Input
                                    name="port"
                                    value={formData.port}
                                    onChange={handleInputChange}
                                    placeholder="6379"
                                    className="bg-[#2c2c2c] border-none h-10 text-white placeholder:text-base text-base"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-base">Username</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                                    <Input
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="username"
                                        className="bg-[#2c2c2c] border-none pl-10 h-10 text-white placeholder:text-base text-base"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 space-y-2">
                                <label className="text-base">Password</label>
                                <div className="relative">
                                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                                    <Input
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        type="password"
                                        placeholder="password"
                                        className="bg-[#2c2c2c] border-none pl-10 h-10 text-white placeholder:text-base text-base"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-12">
                            <Button
                                type="button"
                                variant="secondary"
                                className="bg-[#4c4c4c] hover:bg-[#5c5c5c] text-white px-4"
                            >
                                Test Connection
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsDialogOpen(false)}
                                className="bg-[#2c2c2c] hover:bg-[#3c3c3c] text-white px-4"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                                onClick={handleSave}
                            >
                                Create
                            </Button>
                        </div>
                    </form>
                </div>
            </CustomDialog>
        </div>
    );
}
