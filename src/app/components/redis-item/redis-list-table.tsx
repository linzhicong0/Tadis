import { ColumnDef } from "@tanstack/react-table";
import { RedisTableAction, RedisTableCell, RedisTableHeader } from "./redis-table-components";
import { RedisDetailItem } from "@/types/redisItem";
import { DataTable } from "../data-table";
import { toast } from "sonner";
import { redisCommands } from "@/services/redis-commands";

export default function RedisListTable({ item, onRefresh }: { item: RedisDetailItem, onRefresh?: () => void }) {

    function handleDelete(index: number) {
        redisCommands.listDeleteValue(item.redis_key, index).then(() => {
            onRefresh?.();
        }).catch((error) => {
            toast.error('Failed to delete value: ' + error);
        });
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
                return <RedisTableCell value={row.original} />;
            }
        },
        {
            id: "action",
            header: () => <RedisTableHeader header="Operations" />,
            cell: ({ row }) => {
                return <RedisTableAction onCopy={() => { }} onEdit={() => { }} onDelete={() => handleDelete(row.index)} />
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