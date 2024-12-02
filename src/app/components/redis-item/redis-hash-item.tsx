import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";
import { Button } from "@/components/ui/button";
import { Copy, Pen, RotateCw, Save, Trash, Trash2 } from "lucide-react";
import { RedisDetailItem } from "@/types/redisItem";

const columns: ColumnDef<Record<string, string>>[] = [
    {
        header: "#",
        size: 20,
        cell: ({ row }) => <div>{row.index + 1}</div>
    },
    {
        header: "Key",
        accessorKey: "key",
        cell: ({ row }) => <div>{row.original.key}</div>
    },
    {
        header: "Value",
        accessorKey: "value",
        cell: ({ row }) => <div>{row.original.value}</div>
    },
    {
        id: "action",
        header: "Operations",
        cell: ({ row }) => (
            <div className="flex">
                <Button variant="ghost" size="sm">
                    <Copy strokeWidth={1.5} />
                </Button>
                <Button variant="ghost" size="sm">
                    <Pen strokeWidth={1.5} />
                </Button>
                <Button variant="ghost" size="sm">
                    <Trash2 strokeWidth={1.5} />
                </Button>
            </div>
        )
    }
];

interface RedisHashItemProps extends RedisDetailItem {
    value: {
        HashValue: Record<string, string>;
    };
}

export default function RedisHashItem({ redis_key, value, ttl, size }: RedisHashItemProps) {
    // Convert hash object to array of key-value pairs
    const hashEntries = Object.entries(value.HashValue).map(([key, value]) => ({
        key,
        value
    }));

    return (
        <div className="redis-item-page">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-600 px-2 text-white text-bold py-0.5 text-xs text-center rounded w-14 font-semibold">HASH</div>
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
                <DataTable columns={columns} data={hashEntries} />
            </div>
        </div>
    );
}