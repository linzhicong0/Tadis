'use client'

import { Plus, RotateCw, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { redisCommands } from '@/services/redis-commands'
import TreeView from '@/app/components/treeview';
import { RedisTreeItem } from '@/models/redisTreeItem'
import { ScrollArea } from '@/components/ui/scroll-area'
import RedisStringItem from '../components/redis-string-item'
import { RedisDetailItem } from '@/types/redisItem'
import RedisListItem from '../components/redist-list-item'
export default function Database() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedItemName, setSelectedItemName] = useState<string>('');
    const [redisData, setRedisData] = useState<RedisTreeItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<RedisDetailItem | null>(null);
    useEffect(() => {
        redisCommands.getAllKeysAsTree().then((keys) => {
            console.log("keys are: ", keys);
            setRedisData(keys)
        })
    }, [])

    const handleDelete = (name: string) => {
        console.log('Delete:', name);
    };

    const handleItemSelect = (item: RedisTreeItem) => {
        setSelectedItemName(item.key);
        redisCommands.getKeyDetail(item.key).then((redisItem) => {
            console.log('key:', redisItem.redisKey);
            setSelectedItem(redisItem);

        })
    };

    return (
        <div className="flex h-[calc(100vh-2rem)]">
            {/* Left Sidebar */}
            <div className="w-100 bg-[#1C1C1C] border-r border-gray-700 flex flex-col">
                <div className="p-4 flex flex-col h-full">
                    {/* Search Bar */}
                    <div className="flex gap-2 mb-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <input
                                type="text"
                                placeholder="search"
                                className="bg-yello-500 pl-8 bg-gray-800 text-gray-200 h-full rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button className="bg-gray-800 rounded-md p-0.5">
                            <RotateCw className="p-1" />
                        </button>
                        <button className="bg-gray-800 rounded-md p-0.5">
                            <Plus className="p-0.5" />
                        </button>
                    </div>

                    {/* Keys List Header */}
                    <div className="text-sm text-gray-400 mb-2">
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

            {/* Main Content Area */}
            {selectedItem && (
                'StringValue' in selectedItem.value ? (
                    <RedisStringItem redisKey={selectedItem.redisKey} value={selectedItem.value as { StringValue: string }} ttl={selectedItem.ttl} size={selectedItem.size} />
                ) : 'ListValue' in selectedItem.value ? (
                    <RedisListItem />
                ) : null
            )}
        </div>
    )
}

// You'll need to create these icons or import them from a library like heroicons
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
)

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
)

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
)