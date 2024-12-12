import { RedisDetailItem } from "@/types/redisItem";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";
import { RedisTableAction, RedisTableCell, RedisTableHeader, RedisTableInputCell } from "./redis-table-components";
import { redisCommands } from "@/services/redis-commands";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";

interface RedisHashTableProps {
    item: RedisDetailItem;
    onRefresh?: (message?: string) => void;
}

export default function RedisHashTable({ item, onRefresh }: RedisHashTableProps) {

    function handleDelete(field: string) {
        redisCommands.hashDeleteField(item.redis_key, field).then(() => {
            onRefresh?.("Deleted.");
        }).catch((error) => {
            toast.error('Failed to delete field: ' + error);
        });
    }

    function handleUpdateValue(field: string, newValue: string) {
        redisCommands.hashUpdateValue(item.redis_key, field, newValue).then(() => {
            onRefresh?.("Updated.");
        }).catch((error) => {
            toast.error('Failed to update field: ' + error);
        });
    }

    function handleUpdateField(oldField: string, newField: string, value: string) {
        redisCommands.hashUpdateField(item.redis_key, oldField, newField, value).then(() => {
            onRefresh?.("Updated.");
        }).catch((error) => {
            toast.error('Failed to update field: ' + error);
        });
    }

    function handleCopy(record: Record<string, string>) {
        copyToClipboard(JSON.stringify(record));
        toast.success('Copied to clipboard.');
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
            id: "field",
            header: () => <RedisTableHeader header="Field" />,
            accessorKey: "field",
            cell: ({ row }) => <RedisTableInputCell value={row.original.field} onConfirm={(field) => handleUpdateField(row.original.field, field, row.original.value)} />
        },
        {
            id: "value",
            header: () => <RedisTableHeader header="Value" />,
            accessorKey: "value",
            cell: ({ row }) => <RedisTableInputCell value={row.original.value} onConfirm={(value) => handleUpdateValue(row.original.field, value)} />
        },
        {
            id: "action",
            header: () => <RedisTableHeader header="Operations" />,
            cell: ({ row }) => (
                <RedisTableAction onCopy={() => { handleCopy(row.original) }} onDelete={() => handleDelete(row.original.field)} />
            )
        }
    ];


    if (!('HashValue' in item.value)) return null;

    return (
        <DataTable
            columns={hashColumns}
            data={Object.entries(item.value.HashValue)
                .sort(([fieldA], [fieldB]) => fieldA.localeCompare(fieldB))
                .map(([field, value]) => ({ field, value }))}
        />
    );
}