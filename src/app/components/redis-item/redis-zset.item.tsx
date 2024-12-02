import { Button } from "@/components/ui/button";
import { RedisDetailItem } from "@/types/redisItem";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Trash2, Pen, Save, RotateCw } from "lucide-react";
import { DataTable } from "../data-table";

interface ZSetEntry {
    member: string;
    score: number;
}

const columns: ColumnDef<ZSetEntry>[] = [
    {
        header: "#",
        size: 20,
        cell: ({ row }) => <div>{row.index + 1}</div>
    },
    {
        header: "Member",
        accessorKey: "member",
        cell: ({ row }) => <div>{row.original.member}</div>
    },
    {
        header: "Score",
        accessorKey: "score",
        cell: ({ row }) => <div>{row.original.score}</div>
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

interface RedisZSetItemProps extends RedisDetailItem {
    value: {
        ZSetValue: Array<[string, number]>;
    };
}

export default function RedisZsetItem({ redis_key, value, ttl, size }: RedisZSetItemProps) {
    // Convert ZSet entries to table format
    console.log("zset value: ", value);
    const zsetEntries = value.ZSetValue.map(([member, score]) => ({
        member,
        score
    }));

    return (
        <div className="redis-item-page">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-500 px-2 text-white text-bold py-0.5 text-xs text-center rounded w-14">ZSET</div>
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
                </div>
            </div>

            <div className="flex flex-row items-center redis-item-info-color text-sm gap-2">
                <div className="rounded">TTL: {ttl === -1 ? 'INFINITY' : ttl}</div>
                <div className="rounded">Memory: {size} bytes</div>
            </div>

            <div className="mt-4 flex-1">
                <DataTable columns={columns} data={zsetEntries} />
            </div>
        </div>
    );
}