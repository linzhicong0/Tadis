'use client'

import { Plus, RotateCw, Search } from 'lucide-react'
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


export default function Database() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedItemName, setSelectedItemName] = useState<string>('');
    const [redisData, setRedisData] = useState<RedisTreeItem[]>([]);
    const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);

    useEffect(() => {
        redisCommands.getAllKeysAsTree().then((keys) => {
            console.log("keys are: ", keys);
            setRedisData(keys)
        })
    }, [])

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

    return (
        <div className="h-[calc(100vh-2rem)] ">
            <Tabs className="bg-gray-200/50 dark:bg-gray-800/50">
                <TabContent id="database" className='h-full'>
                    {database()}
                </TabContent>
                <TabContent id="server" className='h-full'>
                    <div className='bg-yellow-500/50 h-full'>Server Info</div>
                </TabContent>
            </Tabs>
        </div >
        // database()

    );
}