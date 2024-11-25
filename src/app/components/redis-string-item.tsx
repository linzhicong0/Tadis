import type { RedisDetailItem } from '@/types/redisItem';
import { useState } from 'react';

interface RedisStringItemProps extends RedisDetailItem {
    value: {
        StringValue: string;
    };
}

export default function RedisStringItem({ redis_key, value, ttl, size }: RedisStringItemProps) {
    const [stringValue, setStringValue] = useState(value.StringValue);
    
    return (
        <div className="flex-1 bg-[#1D1D1D] p-4 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-4 text-gray-300 mb-4">
                <div className="bg-green-600 px-2 py-0.5 text-xs rounded">STRING</div>
                <div>{redis_key}</div>
                <div className="ml-auto flex gap-2">
                    <button className="p-2 bg-gray-800 rounded-md">Copy</button>
                    <button className="p-2 bg-gray-800 rounded-md">Reload</button>
                    <button className="p-2 bg-gray-800 rounded-md">Delete</button>
                    <button className="p-2 bg-gray-800 rounded-md">Save</button>
                </div>
            </div>

            <div className="flex flex-row items-center text-gray-400 text-sm gap-2">
                <div className="rounded">TTL: {ttl === -1 ? 'INFINITY' : ttl}</div>
                <div className="rounded">Memory: {size} bytes</div>
                <div>Encoding: {/* encoding info */}</div>
            </div>

            <div className="mt-4 flex-1">
                <textarea
                    className="w-full h-full min-h-0 bg-gray-800 text-gray-200 p-3 rounded-md resize-none"
                    value={stringValue}
                    onChange={(e) => setStringValue(e.target.value)}
                />
            </div>
        </div>
    )
}