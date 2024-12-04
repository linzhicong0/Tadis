import { ColumnDef } from "@tanstack/react-table";
import { DataTable, Payment } from "../data-table";
import { Button } from "@/components/ui/button";
import { Copy, Pen, RotateCw, Save, Trash, Trash2 } from "lucide-react";
import { useState } from "react";
import { RedisDetailItem } from "@/types/redisItem";

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
        ListValue: string[];
    };
}

export default function RedisListItem({ redis_key, value, ttl, size }: RedisListItemProps) {

    return (
        <div className="redis-item-page">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-400 px-2 text-white text-bold py-0.5 text-xs text-center rounded w-14 font-semibold">LIST</div>
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
                    <Button variant="secondary">
                        <Save strokeWidth={1.5} />
                        Save
                    </Button>
                </div>
            </div>

            <div className="flex flex-row items-center redis-item-info-color text-sm gap-2">
                <div className="rounded">TTL: {ttl === -1 ? 'INFINITY' : ttl}</div>
                <div className="rounded">Memory: {size} bytes</div>
            </div>

            <div className="mt-4 flex-1">
                <DataTable columns={columns} data={value.ListValue} />
            </div>
        </div>
    );
}