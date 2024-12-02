'use client'

import { Plus, RotateCw, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { redisCommands } from '@/services/redis-commands'
import TreeView from '@/app/components/treeview';
import { RedisTreeItem } from '@/models/redisTreeItem'
import { ScrollArea } from '@/components/ui/scroll-area'
import RedisStringItem from '../components/redis-item/redis-string-item'
import { RedisDetailItem } from '@/types/redisItem'
import RedisListItem from '../components/redis-item/redis-list-item'
import RedisSetItem from '../components/redis-item/redis-set-item'
import RedisHashItem from '../components/redis-item/redis-hash-item';
import RedisStreamItem from '../components/redis-item/redis-stream-item';
import RedisZsetItem from '../components/redis-item/redis-zset.item';
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
            setSelectedItem(redisItem);

        })
    };

    const mockListItem  = {
        redis_key: "test:list",
        value: {
            ListValue: ["item1", "item2", "item3", "item4", "item5"]
        },
        ttl: -1,
        size: 1024
    };

    return (
        <div className="flex h-[calc(100vh-2rem)]">
            {/* Left Sidebar */}
            <div className="w-100 bg-gray-200/50 dark:bg-gray-800/50 border-r border-gray-700 flex flex-col">
                <div className="p-4 flex flex-col h-full">
                    {/* Search Bar */}
                    <div className="flex gap-2 mb-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <input
                                type="text"
                                placeholder="search"
                                className="bg-yello-500 pl-8 bg-gray-300 dark:bg-gray-800 text-gray-200 h-full rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <button className="bg-gray-300 dark:bg-gray-800 rounded-md p-0.5">
                            <RotateCw className="p-1 dark:text-gray-300" />
                        </button>
                        <button className="bg-gray-300 dark:bg-gray-800 rounded-md p-0.5">
                            <Plus className="p-0.5 dark:text-gray-300" />
                        </button>
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

            {/* Main Content Area */}
            {selectedItem && (
                'StringValue' in selectedItem.value ? (
                    <RedisStringItem redis_key={selectedItem.redis_key} value={selectedItem.value as { StringValue: string }} ttl={selectedItem.ttl} size={selectedItem.size} />
                ) : 'ListValue' in selectedItem.value ? (
                    <RedisListItem redis_key={selectedItem.redis_key} value={selectedItem.value as { ListValue: string[] }} ttl={selectedItem.ttl} size={selectedItem.size} />
                ) : 'SetValue' in selectedItem.value ? (
                    <RedisSetItem 
                        redis_key={selectedItem.redis_key}
                        value={selectedItem.value as { SetValue: string[] }}
                        ttl={selectedItem.ttl}
                        size={selectedItem.size}
                    />
                ) : 'HashValue' in selectedItem.value ? (
                    <RedisHashItem 
                        redis_key={selectedItem.redis_key}
                        value={selectedItem.value as { HashValue: Record<string, string> }}
                        ttl={selectedItem.ttl}
                        size={selectedItem.size}
                    />
                ) : 'StreamValue' in selectedItem.value ? (
                    <RedisStreamItem 
                        redis_key={selectedItem.redis_key}
                        value={selectedItem.value as { StreamValue: Record<string, Record<string, string>> }}
                        ttl={selectedItem.ttl}
                        size={selectedItem.size}
                    />
                ) : 'ZSetValue' in selectedItem.value ? (
                    <RedisZsetItem 
                        redis_key={selectedItem.redis_key}
                        value={selectedItem.value as { ZSetValue: Array<[string, number]> }}
                        ttl={selectedItem.ttl}
                        size={selectedItem.size}
                    />
                ) : null
            )}
        </div>
    )
}