import { ColumnDef } from "@tanstack/react-table";
import { RedisTableAction, RedisTableCell, RedisTableHeader } from "./redis-table-components";
import { RedisDetailItem } from "@/types/redisItem";
import { DataTable } from "../data-table";
import { redisCommands } from "@/services/redis-commands";
import { toast } from "sonner";

export default function RedisZSetTable({ item, onRefresh }: { item: RedisDetailItem, onRefresh?: () => void }) {

    function handleDelete(value: string) {
        redisCommands.zsetDeleteValue(item.redis_key, value).then(() => {
            onRefresh?.();
        }).catch((error) => {
            toast.error('Failed to delete value: ' + error);
        });
    }

    const zsetColumns: ColumnDef<{ score: number; value: string }>[] = [
        {
            id: "index",
            header: () => <RedisTableHeader header="#" />,
            size: 20,
            cell: ({ row }) => <RedisTableCell value={row.index + 1} />
        },
        {
            id: "value",
            header: () => <RedisTableHeader header="Value" />,
            accessorKey: "value",
            cell: ({ row }) => <RedisTableCell value={row.original.value} />
        },
        {
            id: "score",
            header: () => <RedisTableHeader header="Score" />,
            accessorKey: "score",
            cell: ({ row }) => <RedisTableCell value={row.original.score} />
        },
        {
            id: "action",
            header: () => <RedisTableHeader header="Operations" />,
            cell: ({ row }) => {
                return <RedisTableAction onCopy={() => {}} onEdit={() => {}} onDelete={() => handleDelete(row.original.value)} />
            }
        }
    ];

    if (!('ZSetValue' in item.value)) return null;

    return (
        <DataTable
            columns={zsetColumns}
            data={Object.entries(item.value.ZSetValue).map(([_, value]) => ({
                score: Number(value[1]),
                value: value[0]
            }))}
        />
    );
}