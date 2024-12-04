import { Button } from "@/components/ui/button";
import { RedisDetailItem } from "@/types/redisItem";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Trash2, Pen, RotateCw, Clock, Plus } from "lucide-react";
import { DataTable } from "../data-table";

const columns: ColumnDef<String>[] = [
    {
        id: "index",
        header: () => <div className="redis-item-table-text-color">#</div>,
        size: 20,
        cell: ({ row }) => {
            return <div className="redis-item-table-text-color">{row.index + 1}</div>
        }
    },
    {
        id: "value",
        header: () => <div className="redis-item-table-text-color">Value</div>,
        cell: ({ row }) => {
            return <div className="redis-item-table-text-color">{row.original}</div>
        }
    },
    {
        id: "action",
        header: () => <div className="redis-item-table-text-color">Operations</div>,
        cell: ({ row }) => {
            return <div className="flex">
                <Button className="h-6 w-6 redis-item-table-text-color" variant="ghost" size="sm">
                    <Copy strokeWidth={1.5} />
                </Button>
                <Button className="h-6 w-6 redis-item-table-text-color" variant="ghost" size="sm">
                    <Pen strokeWidth={1.5} />
                </Button>
                <Button className="h-6 w-6 redis-item-table-text-color" variant="ghost" size="sm">
                    <Trash2 strokeWidth={1.5} />
                </Button>
            </div>
        }
    }
]

interface RedisListItemProps extends RedisDetailItem {
    value: {
        SetValue: string[];
    };
}

export default function RedisSetItem({ redis_key, value, ttl, size }: RedisListItemProps) {
    return (
        <div className="redis-item-page">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-500 px-2 text-white text-bold py-0.5 text-xs text-center rounded w-14 font-semibold">SET</div>
                <div className="text-gray-800 dark:text-gray-200 text-base">{redis_key}</div>
                <div className="ml-auto flex gap-2">
                    <Button variant="secondary">
                        <RotateCw strokeWidth={1.5} />
                        Refresh
                    </Button>
                    <Button variant="secondary">
                        <Clock strokeWidth={1.5} />
                        TTL
                    </Button>
                    <Button variant="secondary">
                        <Plus strokeWidth={1.5} />
                        Add
                    </Button>
                </div>
            </div>

            <div className="flex flex-row items-center redis-item-info-color text-sm gap-2">
                <div className="rounded">TTL: {ttl === -1 ? 'INFINITY' : ttl}</div>
                <div className="rounded">Memory: {size} bytes</div>
            </div>

            {/* <ScrollArea className="mt-4"> */}
                <div className="mt-4 overflow-y-auto">
                    <DataTable columns={columns} data={value.SetValue} />
                </div>
            {/* </ScrollArea> */}

        </div>
    );
}