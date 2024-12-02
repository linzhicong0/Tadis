import { toast } from 'sonner';
import { redisCommands } from '@/services/redis-commands';
import type { RedisDetailItem } from '@/types/redisItem';
import { useState } from 'react';
import { Copy, RotateCw, Trash, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RedisStringItemProps extends RedisDetailItem {
    value: {
        StringValue: string;
    };
}

export default function RedisStringItem({ redis_key, value, ttl, size }: RedisStringItemProps) {
    const [stringValue, setStringValue] = useState(value.StringValue);

    const onSave = async () => {
        redisCommands.saveString(redis_key, stringValue).then(() => {
            toast.success("Value saved successfully")
        });
    };

    return (
        <div className="redis-item-page">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-green-600 px-2 text-white py-0.5 text-xs rounded font-semibold">STRING</div>
                <div className="text-gray-800 dark:text-gray-200 text-base">{redis_key}</div>
                <div className="ml-auto flex gap-2">
                    <Button variant="secondary">
                        <Copy strokeWidth={1.5} />
                        Copy
                    </Button>
                    <Button variant="secondary">
                        <RotateCw strokeWidth={1.5} />
                        Refresh
                    </Button>
                    <Button variant="secondary">
                        <Trash strokeWidth={1.5} />
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={onSave}>
                        <Save strokeWidth={1.5}  />
                        Save
                    </Button>
                </div>
            </div>

            <div className="flex flex-row items-center redis-item-info-color text-sm gap-2">
                <div className="rounded">TTL: {ttl === -1 ? 'INFINITY' : ttl}</div>
                <div className="rounded">Memory: {size} bytes</div>
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