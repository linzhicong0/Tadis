import { Button } from "@/components/ui/button";
import { redisCommands } from "@/services/redis-commands";
import { RedisDetailItem } from "@/types/redisItem";
import { Copy, RotateCw, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import RedisListTable from "./redis-list-table";
import RedisSetTable from "./redis-set-table";
import RedisHashTable from "./redis-hash-table";
import RedisStreamTable from "./redis-stream-table";
import RedisZSetTable from "./redis-zset-table";
import { getRedisItemColor, getRedisItemType } from "@/lib/utils";
import RedisStringEditor from "./redis-string-editor";

interface RedisItemDetailProps {
    redisKey: string;
}

export default function RedisItemDetail({ redisKey }: RedisItemDetailProps) {

    const [redisItem, setRedisItem] = useState<RedisDetailItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        redisCommands.getKeyDetail(redisKey)
            .then((item) => {
                setRedisItem(item);
            })
            .catch((error) => {
                console.error("Error loading Redis item:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [redisKey]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="redis-item-page">
            <div className="flex items-center gap-4 mb-4">
                <div className={`${getRedisItemColor(redisItem!)} uppercase px-1 text-white text-bold py-0.5 text-xs text-center rounded w-16 font-semibold`}>
                    {getRedisItemType(redisItem!)}
                </div>
                <div className="text-gray-800 dark:text-gray-200 text-base">
                    {redisItem?.redis_key}
                </div>
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
                    <Button variant="secondary">
                        <Save strokeWidth={1.5} />
                        Save
                    </Button>
                </div>
            </div>

            <div className="flex flex-row items-center redis-item-info-color text-sm gap-2">
                <div className="rounded">TTL: {redisItem?.ttl === -1 ? 'INFINITY' : redisItem?.ttl}</div>
                <div className="rounded">Memory: {redisItem?.size} bytes</div>
            </div>

            {/* The item detail */}
            {
                redisItem?.value && (
                    <div className="mt-4 flex-1">
                        {
                            'ListValue' in redisItem.value ? (
                                <RedisListTable item={redisItem} />
                            ) : 'SetValue' in redisItem.value ? (
                                <RedisSetTable item={redisItem} />
                            ) : 'HashValue' in redisItem.value ? (
                                <RedisHashTable item={redisItem} />
                            ) : 'StreamValue' in redisItem.value ? (
                                <RedisStreamTable item={redisItem} />
                            ) : 'ZSetValue' in redisItem.value ? (
                                <RedisZSetTable item={redisItem} />
                            ) : 'StringValue' in redisItem.value ? (
                                <RedisStringEditor item={redisItem} />
                            ) : null
                        }
                    </div>
                )
            }
        </div>
    );
}