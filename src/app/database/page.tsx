'use client'

import { Plus, RotateCw, Search, Clock, Users, Key, Database as DatabaseIcon, Split, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { redisCommands } from '@/services/redis-commands'
import TreeView from '@/app/components/treeview';
import { RedisTreeItem } from '@/models/redisTreeItem'
import { ScrollArea } from '@/components/ui/scroll-area'
import RedisItemDetail from '../components/redis-item/redis-item-detail';
import { toast } from 'sonner';
import AddItemDialog from '../components/add-item/add-item-dialog';
import { Button } from '@/components/ui/button';
import TabContent from '../components/tabs/tab-content';
import Tabs from '../components/tabs/tabs';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RedisLineChart from '../components/redis-line-chart';
import { RedisServerStatistics } from '@/models/redisServerStatistics';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import ConnectedClientsTable from '../components/connected-clients-table';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"


export default function Database() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedItemName, setSelectedItemName] = useState<string>('');
    const [redisData, setRedisData] = useState<RedisTreeItem[]>([]);
    const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
    const [serverStatistics, setServerStatistics] = useState<RedisServerStatistics | null>(null);

    const [commandSeriesData, setCommandSeriesData] = useState<{ time: string; commands: number; }[]>([]);
    const [clientSeriesData, setClientSeriesData] = useState<{ time: string; clients: number; }[]>([]);
    const [memorySeriesData, setMemorySeriesData] = useState<{ time: string; memory: number; }[]>([]);
    const [networkSeriesData, setNetworkSeriesData] = useState<{ time: string; input: number; output: number; }[]>([]);

    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(5);

    const lineProperties = {
        commands: [
            {
                dataKey: "commands",
                name: 'commands/sec',
                color: '#ff4d4f'
            }
        ],
        clients: [
            {
                dataKey: "clients",
                name: "connected clients",
                color: "#ff9c40"

            }
        ],
        memory: [
            {
                dataKey: "memory",
                name: "memory usage (MB)",
                color: "#7c4dff"

            }
        ],
        network: [
            {
                dataKey: "input",
                name: "in (kb/s)",
                color: "#40c4ff"
            },
            {
                dataKey: "output",
                name: "out (kb/s)",
                color: "#0fac7c"
            }
        ]
    }

    useEffect(() => {
        redisCommands.getAllKeysAsTree().then((keys) => {
            console.log("keys are: ", keys);
            setRedisData(keys)
        })

        refreshServerStatistics();

        // Only set up interval if autoRefresh is enabled
        let intervalId: NodeJS.Timeout | null = null;
        if (autoRefresh) {
            intervalId = setInterval(refreshServerStatistics, refreshInterval * 1000);
        }

        // Cleanup interval on component unmount or when autoRefresh/refreshInterval changes
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [autoRefresh, refreshInterval])

    const handleDelete = (key: string) => {
        redisCommands.deleteKey(key).then(() => {
            setRedisData(redisData.filter(item => item.key !== key));
            toast.success('Key deleted successfully');
        }).catch((error) => {
            toast.error('Failed to delete key: ' + error);
        });
    };

    const handleItemSelect = (item: RedisTreeItem) => {
        setSelectedItemName(item.key);
    };

    const handleRefresh = () => {
        if (searchTerm) {
            handleSearch();
        } else {
            redisCommands.getAllKeysAsTree().then((keys) => {
                setRedisData(keys)
                toast.success('Refreshed');
            })
        }
    }

    const handleSearch = () => {
        redisCommands.searchKeysAsTree(searchTerm).then((keys) => {
            setRedisData(keys)
            toast.success('Refreshed.');
        })
    }

    const handleStatisticsRefresh = () => {
        refreshServerStatistics();
    }

    const refreshServerStatistics = () => {
        redisCommands.getServerStatistics().then((statistics) => {
            setServerStatistics(statistics);

            const currentTime = new Date().toLocaleTimeString();

            setCommandSeriesData(prevData => {
                return [...prevData, {
                    time: currentTime,
                    commands: statistics.stats.instantaneousOpsPerSec
                }];
            });

            setClientSeriesData(prevData => {
                return [...prevData, {
                    time: currentTime,
                    clients: statistics.clients.connectedClients
                }];
            });

            setMemorySeriesData(prevData => {
                return [...prevData, {
                    time: currentTime,
                    memory: Math.round(statistics.memory.usedMemory / (1024 * 1024))
                }];
            });

            setNetworkSeriesData(prevData => {
                return [...prevData, {
                    time: currentTime,
                    input: statistics.stats.instantaneousInputKbps,
                    output: statistics.stats.instantaneousOutputKbps
                }];
            });
        })
    }

    const database = () => {
        return (
            <div className="flex w-full h-full">
                {/* Left Sidebar */}
                <div className="w-100 bg-gray-200/50 dark:bg-gray-800/50 border-r border-gray-700 flex flex-col">
                    <div className="p-4 flex flex-col h-full">
                        {/* Search Bar */}
                        <div className="flex gap-2 mb-4">
                            <div className="relative h-full">
                                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4  text-gray-600 dark:text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="search"
                                    className="pl-8 bg-gray-300 dark:bg-gray-700 dark:text-gray-300 h-8 rounded-lg"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onBlur={() => {
                                        handleSearch();
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch();
                                        }
                                    }}
                                />
                            </div>

                            <Button className="w-8 h-8 tadis-button" variant="secondary" onClick={handleRefresh}>
                                <RotateCw strokeWidth={2.0} />
                            </Button>
                            <Button className="w-8 h-8 tadis-button" variant="secondary" onClick={() => setIsAddItemDialogOpen(true)}>
                                <Plus strokeWidth={2.0} />
                            </Button>
                        </div>

                        {/* Keys List Header */}
                        <div className="text-sm text-gray-800 dark:text-gray-400 mb-2">
                            KEYS ({redisData.length} SCANNED)
                        </div>

                        {/* Wrap the TreeView in a ScrollArea */}
                        <ScrollArea className="flex-1">
                            <div className="space-y-1 pr-4">
                                {redisData.map((item) => (
                                    <TreeView
                                        key={item.label}
                                        item={item}
                                        onDelete={handleDelete}
                                        selectedItemName={selectedItemName}
                                        onItemSelect={handleItemSelect}
                                    />
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                {/* Try to use the dynamic route but seem we set the output: export, we can not pass the dynamic param to the sub page
                so now we will keep using this way to render the item first
            */}
                {/* Main Content Area */}
                {
                    selectedItemName && (
                        <RedisItemDetail redisKey={selectedItemName} />
                    )
                }

                <AddItemDialog isOpen={isAddItemDialogOpen} onClose={() => setIsAddItemDialogOpen(false)} />
            </div>
        );
    }

    const monitoringSection = () => (
        <div className="basis-2/3 grid grid-cols-2 gap-6">
            {/* Commands Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Commands</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full">
                        <RedisLineChart data={commandSeriesData} lines={lineProperties.commands} />
                    </div>
                </CardContent>
            </Card>

            {/* Clients Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Clients</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full">
                        <RedisLineChart
                            data={clientSeriesData}
                            lines={lineProperties.clients}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Memory Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Memory</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full">
                        <RedisLineChart
                            data={memorySeriesData}
                            lines={lineProperties.memory}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Network Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Network</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full">
                        <RedisLineChart data={networkSeriesData} lines={lineProperties.network}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const server = () => {
        const totalKeys = serverStatistics?.keyspace.reduce((sum, space) => sum + space.keys, 0) || 0;

        return (
            <div className='flex flex-col w-full h-full p-6 gap-6'>
                <div className="h-40">
                    <Card className="w-full h-full">
                        <CardHeader className="flex flex-row relative pb-1 gap-1">
                            <CardTitle>Server Statistics</CardTitle>
                            <Button
                                className='-translate-y-4'
                                variant="ghost"
                                size="icon"
                                onClick={handleStatisticsRefresh}
                            >
                                <RotateCw className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-4 ml-4 -translate-y-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="auto-refresh"
                                        checked={autoRefresh}
                                        onCheckedChange={setAutoRefresh}
                                    />
                                    <Label htmlFor="auto-refresh">Auto-refresh</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <Input
                                            id="refresh-interval"
                                            type="text"
                                            value={refreshInterval.toString()}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Allow empty input or numbers only
                                                if (value === '' || /^\d+$/.test(value)) {
                                                    if (value === '') {
                                                        // Allow empty state temporarily, don't set to 1 immediately
                                                        setRefreshInterval(0); // Use 0 as temporary placeholder
                                                    } else {
                                                        const num = parseInt(value, 10);
                                                        if (num > 0) {
                                                            setRefreshInterval(num);
                                                        }
                                                    }
                                                }
                                            }}
                                            onBlur={(e) => {
                                                // Only set default when user leaves the field and it's empty or 0
                                                if (e.target.value === '' || refreshInterval === 0) {
                                                    setRefreshInterval(1);
                                                }
                                            }}
                                            className="w-20 h-8 text-center pr-8 focus:ring-2 focus:ring-gray-400 focus:border-gray-400 dark:focus:ring-gray-500 dark:focus:border-gray-500 transition-all"
                                            placeholder="5"
                                        />
                                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400 pointer-events-none">
                                            s
                                        </span>
                                    </div>
                                    <Label 
                                        htmlFor="refresh-interval"
                                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        interval
                                    </Label>
                                </div>
                            </div>

                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-6">
                                <div className="flex items-center space-x-4">
                                    <Clock className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{serverStatistics?.server.uptimeInDays} days</p>
                                        <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Users className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="flex flex-row">
                                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {serverStatistics?.clients.connectedClients} Clients
                                            </p>
                                            <HoverCard>
                                                <HoverCardTrigger asChild>
                                                    <Button variant="link" size="icon">
                                                        <Info className="h-4 w-4" />
                                                    </Button>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="w-[600px] bg-white dark:bg-gray-800">
                                                    <ConnectedClientsTable />
                                                </HoverCardContent>
                                            </HoverCard>
                                        </div>
                                        <p className="text-sm font-medium text-muted-foreground">Connected Clients</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <Key className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalKeys} Keys</p>
                                        <p className="text-sm font-medium text-muted-foreground">Total Keys</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <DatabaseIcon className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{serverStatistics?.memory.usedMemoryHuman}</p>
                                        <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Replace the old cards with the new monitoring section */}
                {monitoringSection()}
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-2rem)] ">
            <Tabs className="bg-gray-200/50 dark:bg-gray-800/50">
                <TabContent id="database" className='h-full'>
                    {database()}
                </TabContent>
                <TabContent id="server" className='h-full'>
                    {server()}
                </TabContent>
            </Tabs>
        </div >
        // database()

    );
}