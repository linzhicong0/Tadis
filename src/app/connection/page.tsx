'use client';
import { PlusIcon, Server, Tag } from "lucide-react";
import ConnectionCard from "../components/connection-card";
import { useEffect, useState } from "react";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserIcon, KeyIcon } from "lucide-react";
import { connectionCommands } from "@/services/connection-commands";
import CustomAlertDialog from "../components/custom-alert-dialog";
import { LoadingDialog } from "@/components/ui/loading-dialog";
import { toast } from "sonner";

interface Connection {
    id: string;
    name: string;
    address: string;
    status: string;
    username: string;
    password: string;
}

export default function Connection() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        host: '127.0.0.1',
        port: '6379',
        username: '',
        password: ''
    });
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean, connectionName: string }>({
        open: false,
        connectionName: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [isTestingConnection, setIsTestingConnection] = useState(false);

    useEffect(() => {
        connectionCommands.loadConfig()
            .then((configs) => {
                const loadedConnections = configs.map((config: any) => ({
                    id: config.name,
                    name: config.name,
                    address: `${config.host}:${config.port}`,
                    status: 'Disconnected',
                    username: config.username || '',
                    password: config.password || ''
                }));
                setConnections(loadedConnections);
                console.log('Config loaded successfully:', configs);
            })
            .catch((error) => {
                console.error('Error loading config:', error);
            });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log('Input changed:', name, value);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSettings = (connection: Connection) => {
        setFormData({
            name: connection.name,
            host: connection.address.split(':')[0],
            port: connection.address.split(':')[1],
            username: connection.username,
            password: connection.password,
        });
        setIsEditMode(true);
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            await connectionCommands.saveConfig({
                name: formData.name,
                host: formData.host,
                port: Number(formData.port),
                username: formData.username,
                password: formData.password
            }, !isEditMode);

            if (isEditMode) {
                setConnections(prev => prev.map(conn =>
                    conn.name === formData.name
                        ? {
                            ...conn,
                            address: `${formData.host}:${formData.port}`,
                            username: formData.username,
                            password: formData.password
                        }
                        : conn
                ));
            } else {
                setConnections(prev => [...prev, {
                    id: formData.name,
                    name: formData.name,
                    address: `${formData.host}:${formData.port}`,
                    status: 'Disconnected',
                    username: formData.username,
                    password: formData.password
                }]);
            }

            handleClose();
        } catch (error) {
            console.log(error);
            setError(error as string);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            host: '127.0.0.1',
            port: '6379',
            username: '',
            password: ''
        });
        setIsEditMode(false);
        setIsDialogOpen(false);
    };

    const handleDelete = async (connectionName: string) => {
        setDeleteConfirmation({
            open: true,
            connectionName
        });
    };

    const handleConfirmedDelete = async () => {
        try {
            await connectionCommands.deleteConfig(deleteConfirmation.connectionName);
            setConnections(prev => prev.filter(conn => conn.name !== deleteConfirmation.connectionName));
            setDeleteConfirmation({ open: false, connectionName: '' });
        } catch (error) {
            console.error('Error deleting connection:', error);
            setError('Failed to delete connection');
        }
    };

    const handleTestConnection = () => {
        setIsTestingConnection(true);
        connectionCommands.testConnection({
            name: formData.name,
            host: formData.host,
            port: Number(formData.port),
            username: formData.username,
            password: formData.password
        })
            .then(() => {
                setSuccessMessage('Connection successful!');
            })
            .catch((error) => {
                setError(`Connection failed: ${error}`);
            })
            .finally(() => {
                setIsTestingConnection(false);
            });
    };

    const handleConnectToRedis = (connection: Connection) => {
        connectionCommands.connectToRedis({
            name: connection.name,
            host: connection.address.split(':')[0],
            port: Number(connection.address.split(':')[1]),
            username: connection.username,
            password: connection.password
        }).then(() => {
            toast.success('Connected to Redis!');
        }).catch((error) => {
            toast.error(`Failed to connect to Redis: ${error}`);
        });
    };

    return (
        <div className="h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar bg-white/30 dark:bg-gray-800/50">
            <div className="grid auto-rows-[200px] grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 p-4">
                {connections.map((connection) => (
                    <ConnectionCard
                        key={connection.id}
                        name={connection.name}
                        address={connection.address}
                        status={connection.status}
                        onPlay={() => handleConnectToRedis(connection)}
                        onSettings={() => handleSettings(connection)}
                        onDelete={() => handleDelete(connection.name)}
                    />
                ))}

                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors w-[220px] h-[200px] shadow-lg shadow-black/10 backdrop-blur-sm"
                >
                    <PlusIcon className="w-12 h-12 text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            <CustomDialog isOpen={isDialogOpen} onClose={handleClose} title={isEditMode ? 'Update Connection' : 'New Connection'}>
                <form className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-base">Connection Name</label>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="connection name"
                                className="bg-gray-50 dark:bg-[#2c2c2c] border-gray-200 dark:border-none pl-10 h-10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-gray-400 dark:focus:border-gray-600"
                                disabled={isEditMode}
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-base">Host</label>
                            <div className="relative">
                                <Server className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <Input
                                    name="host"
                                    value={formData.host}
                                    onChange={handleInputChange}
                                    placeholder="127.0.0.1"
                                    className="bg-gray-50 dark:bg-[#2c2c2c] border-gray-200 dark:border-none pl-10 h-10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-gray-400 dark:focus:border-gray-600"
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
                                className="bg-gray-50 dark:bg-[#2c2c2c] border-gray-200 dark:border-none h-10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-gray-400 dark:focus:border-gray-600"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                            <label className="text-base">Username</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <Input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="username"
                                    className="bg-gray-50 dark:bg-[#2c2c2c] border-gray-200 dark:border-none pl-10 h-10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-gray-400 dark:focus:border-gray-600"
                                />
                            </div>
                        </div>

                        <div className="flex-1 space-y-2">
                            <label className="text-base">Password</label>
                            <div className="relative">
                                <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                                <Input
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    type="password"
                                    placeholder="password"
                                    className="bg-gray-50 dark:bg-[#2c2c2c] border-gray-200 dark:border-none pl-10 h-10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-gray-400 dark:focus:border-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-12">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleTestConnection}
                            className="bg-gray-200 hover:bg-gray-300 dark:bg-[#4c4c4c] dark:hover:bg-[#5c5c5c] text-gray-900 dark:text-white px-4"
                        >
                            Test Connection
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2c2c2c] dark:hover:bg-[#3c3c3c] text-gray-900 dark:text-white px-4"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                            onClick={handleSave}
                        >
                            {isEditMode ? 'Save' : 'Create'}
                        </Button>
                    </div>
                </form>
            </CustomDialog>

            <CustomAlertDialog open={!!error}
                title= "Error"
                description={error as string}
                onCancel={() => setError(null)}
                onContinue={() => setError(null)}
            />

            <CustomAlertDialog
                open={!!successMessage}
                title="Success"
                description={successMessage as string}
                onCancel={() => setSuccessMessage(null)}
                onContinue={() => setSuccessMessage(null)}
            />

            <CustomAlertDialog
                open={deleteConfirmation.open}
                title="Delete Connection"
                description={`Are you sure you want to delete the connection "${deleteConfirmation.connectionName}"?`}
                onCancel={() => setDeleteConfirmation({ open: false, connectionName: '' })}
                onContinue={handleConfirmedDelete}
            />

            <LoadingDialog 
                open={isTestingConnection}
                title="Testing Connection"
                description="Please wait while we test the connection..."
                onClose={() => {setIsTestingConnection(false)}}
            />
        </div>
    );
}
