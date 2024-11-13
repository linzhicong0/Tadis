'use client'

import { Plus, RotateCw, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import RedisItem from '@/app/components/redisitem'
import { redisCommands } from '@/services/redis-commands'

export default function Database() {
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        redisCommands.getAllKeys().then((keys) => {
            console.log(keys)
        })
    }, [])

    return (
        <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="w-100 bg-[#1C1C1C] border-r border-gray-700">
                <div className="p-4">
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

                    {/* Keys List */}
                    <div className="text-sm text-gray-400 mb-2">
                        KEYS (14 SCANNED)
                    </div>

                    <div className="space-y-1">
                        {/* Tree structure for keys */}
                        <div className="text-gray-300">
                            <div className="flex items-center gap-2 p-1 hover:bg-gray-800 rounded">
                                <ChevronDownIcon />
                                user (1)
                            </div>
                            {/* Nested items would go here */}
                            <div className="flex flex-col gap-2">
                                <RedisItem type="string" name="user:1:name" onDelete={() => { }} />
                                <RedisItem type="set" name="user:1:preferences" onDelete={() => {}} />
                                <RedisItem type="hash" name="user:1:profile" onDelete={() => {}} />
                                <RedisItem type="list" name="user:1:posts" onDelete={() => {}} />
                                <RedisItem type="stream" name="user:1:activity" onDelete={() => {}} />
                                <RedisItem type="zset" name="user:1:scores" onDelete={() => {}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-[#1D1D1D] p-4">
                <div className="flex items-center gap-4 text-gray-300 mb-4">
                    <div className="bg-green-600 px-2 py-0.5 text-xs rounded">STRING</div>
                    <div>user:1:name</div>

                    <div className="ml-auto flex gap-2">
                        <button className="p-2 bg-gray-800 rounded-md">Copy</button>
                        <button className="p-2 bg-gray-800 rounded-md">Reload</button>
                        <button className="p-2 bg-gray-800 rounded-md">Delete</button>
                        <button className="p-2 bg-gray-800 rounded-md">Save</button>
                    </div>
                </div>

                <div className="text-gray-400 text-sm space-y-1">
                    <div>TTL: INFINITY</div>
                    <div>Memory: 80 bytes</div>
                    <div>Encoding: {/* encoding info */}</div>
                </div>

                <div className="mt-4">
                    <textarea
                        className="w-full h-48 bg-gray-800 text-gray-200 p-3 rounded-md"
                        value="asdfadsfasdf1"
                    />
                </div>
            </div>
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