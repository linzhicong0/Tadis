import { ColumnDef } from "@tanstack/react-table";
import { RedisTableAction, RedisTableCell, RedisTableHeader } from "./redis-table-components";
import { RedisDetailItem } from "@/types/redisItem";
import { DataTable } from "../data-table";
import { redisCommands } from "@/services/redis-commands";
import { toast } from "sonner";


export default function RedisSetTable({ item, onRefresh }: { item: RedisDetailItem, onRefresh?: () => void }) {

    function handleDelete(value: string) {
        redisCommands.setDeleteValue(item.redis_key, value).then(() => {
            onRefresh?.();
        }).catch((error) => {
            toast.error('Failed to delete value: ' + error);
        });
    }

    const setColumns: ColumnDef<string>[] = [
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
                return <RedisTableAction onCopy={() => { }} onEdit={() => { }} onDelete={() => handleDelete(row.original) } />
            }
        }
    ]

    if (!('SetValue' in item.value)) return null;

    return (
        <DataTable
            columns={setColumns}
            data={item.value.SetValue}
        />
    );
}