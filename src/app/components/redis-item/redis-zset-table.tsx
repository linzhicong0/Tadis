import { ColumnDef } from "@tanstack/react-table";
import { RedisTableAction, RedisTableCell, RedisTableHeader, RedisTableInputCell } from "./redis-table-components";
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

    function handleUpdateScore(member: string, score: number) {
        redisCommands.zsetUpdateScore(item.redis_key, member, score).then(() => {
            onRefresh?.();
        }).catch((error) => {
            toast.error('Failed to update score: ' + error);
        });
    }

    function handleUpdateMember(member: string, newMember: string, score: number) {
        redisCommands.zsetUpdateMember(item.redis_key, member, newMember, score).then(() => {
            onRefresh?.();
        }).catch((error) => {
            toast.error('Failed to update member: ' + error);
        });
    }

    const zsetColumns: ColumnDef<{ score: number; member: string }>[] = [
        {
            id: "index",
            header: () => <RedisTableHeader header="#" />,
            size: 20,
            cell: ({ row }) => <RedisTableCell value={row.index + 1} />
        },
        {
            id: "member",
            header: () => <RedisTableHeader header="Member" />,
            accessorKey: "member",
            cell: ({ row }) => <RedisTableInputCell value={row.original.member} onConfirm={(newMember) => handleUpdateMember(row.original.member, newMember, row.original.score)} />
        },
        {
            id: "score",
            header: () => <RedisTableHeader header="Score" />,
            accessorKey: "score",
            cell: ({ row }) => <RedisTableInputCell value={row.original.score} onConfirm={(value) => handleUpdateScore(row.original.member, Number(value))} />
        },
        {
            id: "action",
            header: () => <RedisTableHeader header="Operations" />,
            cell: ({ row }) => {
                return <RedisTableAction onCopy={() => {}} onDelete={() => handleDelete(row.original.member)} />
            }
        }
    ];

    if (!('ZSetValue' in item.value)) return null;

    return (
        <DataTable
            columns={zsetColumns}
            data={Object.entries(item.value.ZSetValue).map(([_, value]) => ({
                score: Number(value[1]),
                member: value[0]
            }))}
        />
    );
}