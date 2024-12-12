import { ColumnDef } from "@tanstack/react-table";
import { RedisTableAction, RedisTableCell, RedisTableHeader } from "./redis-table-components";
import { RedisDetailItem } from "@/types/redisItem";
import { DataTable } from "../data-table";
import { toast } from "sonner";
import { redisCommands } from "@/services/redis-commands";
import { copyToClipboard } from "@/lib/utils";

export default function RedisStreamTable({ item, onRefresh }: { item: RedisDetailItem, onRefresh?: () => void }) {

    function handleDelete(id: string) {
        redisCommands.streamDeleteValue(item.redis_key, id).then(() => {
            onRefresh?.();
        }).catch((error) => {
            toast.error('Failed to delete value: ' + error);
        });
    }

    function handleCopy(value: string) {
        copyToClipboard(value);
        toast.success('Copied to clipboard.');
    }

    const streamColumns: ColumnDef<{ id: string; fields: string }>[] = [
        {
            id: "index",
            header: () => <RedisTableHeader header="#" />,
            size: 20,
            cell: ({ row }) => <RedisTableCell value={row.index + 1} />
        },
        {
            id: "id",
            header: () => <RedisTableHeader header="ID" />,
            accessorKey: "id",
            cell: ({ row }) => <RedisTableCell value={row.original.id} />
        },
        {
            id: "fields",
            header: () => <RedisTableHeader header="Fields" />,
            accessorKey: "fields",
            cell: ({ row }) => <pre className="whitespace-pre-wrap redis-item-table-text-color">{row.original.fields}</pre>
        },
        {
            id: "action",
            header: () => <RedisTableHeader header="Operations" />,
            cell: ({ row }) => {
                return <RedisTableAction onCopy={() => { handleCopy(row.original.fields) }} onDelete={() => handleDelete(row.original.id)} />
            }
        }
    ];

    if (!('StreamValue' in item.value)) return null;

    return (
        <DataTable
            columns={streamColumns}
            data={Object.entries(item.value.StreamValue).flatMap(([id, fields]) => {
                return Object.entries(fields).map(([key, value]) => {
                    return {
                        id: key,
                        fields: JSON.stringify(value, null, 2)
                    }
                })
            })}
        />
    );
}