import { RedisDetailItem } from "@/types/redisItem";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";
import { RedisTableAction, RedisTableCell, RedisTableHeader } from "./redis-table-components";
import { redisCommands } from "@/services/redis-commands";
import { toast } from "sonner";

interface RedisHashTableProps {
    item: RedisDetailItem;
    onRefresh?: () => void;
}

export default function RedisHashTable({ item, onRefresh }: RedisHashTableProps) {

    function handleDelete(field: string) {
        redisCommands.hashDeleteField(item.redis_key, field).then(() => {
            onRefresh?.();
        }).catch((error) => {
            toast.error('Failed to delete field: ' + error);
        });
    }

    const hashColumns: ColumnDef<Record<string, string>>[] = [
        {
            id: "index",
            header: () => <RedisTableHeader header="#" />,
            size: 20,
            cell: ({ row }) => {
                return <div className="redis-item-table-text-color">{row.index + 1}</div>
            }
        },
        {
            id: "key",
            header: () => <RedisTableHeader header="Key" />,
            accessorKey: "key",
            cell: ({ row }) => <RedisTableCell value={row.original.key} />
        },
        {
            id: "value",
            header: () => <RedisTableHeader header="Value" />,
            accessorKey: "value",
            cell: ({ row }) => <RedisTableCell value={row.original.value} />
        },
        {
            id: "action",
            header: () => <RedisTableHeader header="Operations" />,
            cell: ({ row }) => (
                <RedisTableAction onCopy={() => { }} onEdit={() => { }} onDelete={() => handleDelete(row.original.key)} />
            )
        }
    ];


    if (!('HashValue' in item.value)) return null;

    return (
        <DataTable
            columns={hashColumns}
            data={Object.entries(item.value.HashValue).map(([key, value]) => ({ key, value }))}
        />
    );
}