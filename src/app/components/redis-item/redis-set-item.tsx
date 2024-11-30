import { Button } from "@/components/ui/button";
import { RedisDetailItem } from "@/types/redisItem";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Trash2, Pen, Save, RotateCw } from "lucide-react";
import { DataTable } from "../data-table";

const columns: ColumnDef<String>[] = [
    {
        header: "#",
        size: 20,
        cell: ({ row }) => {
            return <div>{row.index + 1}</div>
        }
    },
    {
        header: "Value",
        cell: ({ row }) => {
            return <div>{row.original}</div>
        }
    },
    {
        id: "action",
        header: "Operations",
        cell: ({ row }) => {
            return <div className="flex">
                <Button variant="ghost" size="sm">
                    <Copy strokeWidth={1.5} />
                </Button>
                <Button variant="ghost" size="sm">
                    <Pen strokeWidth={1.5} />
                </Button>
                <Button variant="ghost" size="sm">
                    <Trash2 strokeWidth={1.5} className=""/>
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
        <div className="flex-1 bg-[#1D1D1D] p-4 flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-500 px-2 text-white text-bold py-0.5 text-xs text-center rounded w-14">SET</div>
                <div>{redis_key}</div>
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
                        <Trash2 strokeWidth={1.5} />
                        Delete
                    </Button>
                    <Button variant="secondary">
                        <Save strokeWidth={1.5} />
                        Save
                    </Button>
                </div>
            </div>

            <div className="flex flex-row items-center text-gray-400 text-sm gap-2">
                <div className="rounded">TTL: {ttl === -1 ? 'INFINITY' : ttl}</div>
                <div className="rounded">Memory: {size} bytes</div>
            </div>

            <div className="mt-4 flex-1">
                <DataTable columns={columns} data={value.SetValue} />
            </div>
        </div>
    );
}