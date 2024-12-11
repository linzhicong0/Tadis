import { Button } from "@/components/ui/button";
import { redisCommands } from "@/services/redis-commands";
import { RedisDetailItem } from "@/types/redisItem";
import { Clock3, Copy, Plus, RotateCw, Save } from "lucide-react";
import { useEffect, useState } from "react";
import RedisListTable from "./redis-list-table";
import RedisSetTable from "./redis-set-table";
import RedisHashTable from "./redis-hash-table";
import RedisStreamTable from "./redis-stream-table";
import RedisZSetTable from "./redis-zset-table";
import { copyToClipboard, getRedisItemColor, getRedisItemType } from "@/lib/utils";
import RedisStringEditor from "./redis-string-editor";
import { toast } from "sonner";
import ToolTip from "../tool-tip";
import TTLDialog from "../ttl-dialog";
import AddListDialog from "../add-item/add-list-diaglog";
import AddSetDialog from "../add-item/add-set-dialog";
import AddHashDialog from "../add-item/add-hash-dialog";
import AddZSetDialog from "../add-item/add-zset-dialog";
import AddStreamDialog from "../add-item/add-stream-dialog";

interface RedisItemDetailProps {
    redisKey: string;
}

export default function RedisItemDetail({ redisKey }: RedisItemDetailProps) {

    const [redisItem, setRedisItem] = useState<RedisDetailItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTTLDialogOpen, setIsTTLDialogOpen] = useState(false);
    const [ttlValue, setTTLValue] = useState("-1");
    const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);

    const loadRedisItem = async () => {
        setIsLoading(true);
        try {
            const item = await redisCommands.getKeyDetail(redisKey);
            setRedisItem(item);
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    const refreshRedisItem = async () => {
        const item = await redisCommands.getKeyDetail(redisKey);
        setRedisItem(item);
    }

    useEffect(() => {
        loadRedisItem();
    }, [redisKey]);

    const handleSave = async () => {
        if (redisItem && 'StringValue' in redisItem.value) {
            try {
                await redisCommands.saveString(redisItem.redis_key, redisItem.value.StringValue);
                toast.success("Saved");
            } catch (error) {
                toast.error("Failed to save value");
            }
        }
    };

    const handleRefresh = async () => {
        await refreshRedisItem().then(() => {
            toast.success("Refreshed.");
        }).catch((error) => {
            toast.error(`Failed to refresh data: ${error}`);
        });
    }

    const handleUpdateTTL = async (value: number) => {
        try {
            await redisCommands.updateTTL(redisKey, value);
            await refreshRedisItem().then(() => {
                toast.success("TTL updated");
            }).catch((error) => {
                toast.error(`Failed to update TTL: ${error}`);
            });
        } catch (error) {
            toast.error("Failed to update TTL");
        }
    };

    const handleUpdate = async() =>{
        await refreshRedisItem().then(() => {
            toast.success("Updated");
        }).catch((error) => {
            toast.error(`Failed to update: ${error}`);
        });
    }

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

                    <ToolTip tooltipContent="Refresh">
                        <Button
                            variant="secondary"
                            className="w-8 h-8"
                            onClick={handleRefresh}
                        >
                            <RotateCw strokeWidth={1.5} />
                        </Button>
                    </ToolTip>
                    <ToolTip tooltipContent="TTL">
                        <Button
                            variant="secondary"
                            className="w-8 h-8"
                            onClick={() => {
                                setTTLValue(redisItem?.ttl.toString() || "-1");
                                setIsTTLDialogOpen(true);
                            }}
                        >
                            <Clock3 strokeWidth={1.5} />
                        </Button>
                    </ToolTip>

                    {/* Bellow button only applicable for non string value */}
                    {
                        !('StringValue' in redisItem!.value) && (
                            <ToolTip tooltipContent="Add">
                                <Button variant="secondary" className="w-8 h-8" onClick={() => setIsAddItemDialogOpen(true)}>
                                    <Plus strokeWidth={1.5} />
                                </Button>
                            </ToolTip>
                        )
                    }

                    {/* Bellow button only applicable for string value */}
                    {
                        'StringValue' in redisItem!.value && (
                            <>
                                <ToolTip tooltipContent="Copy">
                                    <Button variant="secondary" className="w-8 h-8" onClick={() => copyToClipboard('StringValue' in redisItem!.value ? redisItem!.value.StringValue : '')}>
                                        <Copy strokeWidth={1.5} />
                                    </Button>
                                </ToolTip>
                                <ToolTip tooltipContent="Save">
                                    <Button variant="secondary" onClick={handleSave} className="w-8 h-8">
                                        <Save strokeWidth={1.5} />
                                    </Button>
                                </ToolTip>
                            </>
                        )
                    }


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
                                <RedisSetTable item={redisItem} onRefresh={handleRefresh} />
                            ) : 'HashValue' in redisItem.value ? (
                                <RedisHashTable item={redisItem} onRefresh={handleRefresh} />
                            ) : 'StreamValue' in redisItem.value ? (
                                <RedisStreamTable item={redisItem} />
                            ) : 'ZSetValue' in redisItem.value ? (
                                <RedisZSetTable item={redisItem} />
                            ) : 'StringValue' in redisItem.value ? (
                                <RedisStringEditor
                                    item={redisItem}
                                    onValueChange={(value) => {
                                        setRedisItem(prev => prev ? {
                                            ...prev,
                                            value: { StringValue: value }
                                        } : null)
                                    }}
                                />
                            ) : null
                        }
                    </div>
                )
            }

            <TTLDialog
                isOpen={isTTLDialogOpen}
                onClose={() => setIsTTLDialogOpen(false)}
                redisKey={redisItem!.redis_key}
                ttlValue={parseInt(ttlValue)}
                onConfirm={handleUpdateTTL}
            />
            {
                redisItem?.value && ('ListValue' in redisItem.value ? (
                    <AddListDialog
                        isOpen={isAddItemDialogOpen}
                        onClose={() => setIsAddItemDialogOpen(false)}
                        redisKey={redisItem!.redis_key}
                        onConfirm={handleUpdate}
                    />
                ) : 'SetValue' in redisItem.value ? (
                    <AddSetDialog
                        isOpen={isAddItemDialogOpen}
                        onClose={() => setIsAddItemDialogOpen(false)}
                        redisKey={redisItem!.redis_key}
                        onConfirm={handleUpdate}
                    />
                ) : 'HashValue' in redisItem.value ? (
                    <AddHashDialog
                        isOpen={isAddItemDialogOpen}
                        onClose={() => setIsAddItemDialogOpen(false)}
                        redisKey={redisItem!.redis_key}
                        onConfirm={handleUpdate}
                    />
                ) : 'ZSetValue' in redisItem.value ? (
                    <AddZSetDialog
                        isOpen={isAddItemDialogOpen}
                        onClose={() => setIsAddItemDialogOpen(false)}
                        redisKey={redisItem!.redis_key}
                        onConfirm={handleUpdate}
                    />
                ) : 'StreamValue' in redisItem.value ? (
                    <AddStreamDialog
                        isOpen={isAddItemDialogOpen}
                        onClose={() => setIsAddItemDialogOpen(false)}
                        redisKey={redisItem!.redis_key}
                        onConfirm={handleUpdate}
                    />
                ) : null)
            }
        </div>
    );
}