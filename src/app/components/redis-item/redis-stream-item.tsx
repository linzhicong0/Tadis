import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../data-table";
import { Button } from "@/components/ui/button";
import { Copy, Pen, RotateCw, Save, Trash, Trash2 } from "lucide-react";
import { RedisDetailItem } from "@/types/redisItem";

const columns: ColumnDef<{ id: string; fields: string }>[] = [
    {
        id: "index",
        header: () => <div className="redis-item-table-text-color">#</div>,
        size: 20,
        cell: ({ row }) => <div className="redis-item-table-text-color">{row.index + 1}</div>
    },
    {
        id: "id",
        header: () => <div className="redis-item-table-text-color">ID</div>,
        accessorKey: "id",
        cell: ({ row }) => <div className="redis-item-table-text-color">{row.original.id}</div>
    },
    {
        id: "fields",
        header: () => <div className="redis-item-table-text-color">Fields</div>,
        accessorKey: "fields",
        cell: ({ row }) => <pre className="whitespace-pre-wrap redis-item-table-text-color">{row.original.fields}</pre>
    },
    {
        id: "action",
        header: () => <div className="redis-item-table-text-color">Operations</div>,
        cell: ({ row }) => (
            <div className="flex">
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
        )
    }
];

interface RedisStreamItemProps extends RedisDetailItem {
    value: {
        StreamValue: Record<string, Record<string, string>>;
    };
}

export default function RedisStreamItem({ redis_key, value, ttl, size }: RedisStreamItemProps) {
    // Convert stream entries to table format
    console.log("stream value: ", value);
    const streamEntries = Object.entries(value.StreamValue).map(([, fields]) => ({
        id: Object.keys(fields)[0],
        fields: JSON.stringify(Object.values(fields)[0], null, 2)
    }));
    console.log("stream entries: ", streamEntries);

    return (
        <div className="redis-item-page">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-600 px-2 text-white text-bold py-0.5 text-xs text-center rounded w-16 font-semibold">STREAM</div>
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
                <DataTable columns={columns} data={streamEntries} />
            </div>
        </div>
    );
}