import { ColumnDef } from "@tanstack/react-table";
import { RedisTableAction, RedisTableCell, RedisTableHeader, RedisTableInputCell } from "./redis-table-components";
import { RedisDetailItem } from "@/types/redisItem";
import { DataTable } from "../data-table";
import { toast } from "sonner";
import { redisCommands } from "@/services/redis-commands";
import { copyToClipboard } from "@/lib/utils";

export default function RedisListTable({ item, onRefresh }: { item: RedisDetailItem, onRefresh?: (message?: string) => void }) {

    function handleDelete(index: number) {
        redisCommands.listDeleteValue(item.redis_key, index).then(() => {
            onRefresh?.("Deleted.");
        }).catch((error) => {
            toast.error('Failed to delete value: ' + error);
        });
    }

    function handleUpdate(index: number, value: string) {
        redisCommands.listUpdateValue(item.redis_key, index, value).then(() => {
            onRefresh?.("Updated.");
        }).catch((error) => {
            toast.error('Failed to update value: ' + error);
        });
    }

    function handleCopy(value: string) {
        copyToClipboard(value);
        toast.success('Copied to clipboard.');
    }

    const listColumns: ColumnDef<string>[] = [
        {
            id: "index",
            header: () => <RedisTableHeader header="#" />,
            size: 20,
            cell: ({ row }) => {
                return <RedisTableCell value={row.index + 1} />;
            }
        },
        {
            id: "value",
            header: () => <RedisTableHeader header="Value" />,
            cell: ({ row }) => {
                return <RedisTableInputCell value={row.original} onConfirm={(value) => handleUpdate(row.index, value)} />;
            }
        },
        {
            id: "action",
            header: () => <RedisTableHeader header="Operations" />,
            cell: ({ row }) => {
                return <RedisTableAction onCopy={() => { handleCopy(row.original) }} onDelete={() => handleDelete(row.index)} />
            }
        }
    ]

    console.log("log");

    if (!('ListValue' in item.value)) return null;

    return (
        <DataTable
            columns={listColumns}
            data={item.value.ListValue}
        />
    );
}