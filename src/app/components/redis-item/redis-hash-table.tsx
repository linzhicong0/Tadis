import { RedisDetailItem } from "@/types/redisItem";
import { DataTable } from "../data-table";
import { ColumnDef } from "@tanstack/react-table";
import { RedisTableAction, RedisTableCell, RedisTableHeader } from "./redis-table-components";


export default function RedisHashTable({ item }: { item: RedisDetailItem }) {

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
                <RedisTableAction onCopy={() => { }} onEdit={() => { }} onDelete={() => { }} />
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