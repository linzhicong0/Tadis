import { ColumnDef } from "@tanstack/react-table";
import { RedisTableAction, RedisTableCell, RedisTableHeader } from "./redis-table-components";
import { RedisDetailItem } from "@/types/redisItem";
import { DataTable } from "../data-table";

export default function RedisListTable({ item }: { item: RedisDetailItem }) {


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
                return <RedisTableAction onCopy={() => { }} onEdit={() => { }} onDelete={() => { }} />
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