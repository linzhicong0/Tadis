import { Button } from "@/components/ui/button";
import { Copy, Pen, Trash2 } from "lucide-react";

interface RedisTableHeaderProps {
    header: string;
}

function RedisTableHeader({ header }: RedisTableHeaderProps) {
    return <div className="redis-item-table-text-color">{header}</div>;
}


interface RedisTableCellProps {
    value: string | number;
}

function RedisTableCell({ value }: RedisTableCellProps) {
    return <div className="redis-item-table-text-color">{value}</div>;
}

interface RedisTableActionProps {
    onCopy?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

function RedisTableAction({ onCopy, onEdit, onDelete }: RedisTableActionProps) {
    return <div className="flex">
        {onCopy &&
            <Button className="h-6 w-6 redis-item-table-text-color" variant="ghost" size="sm">
                <Copy strokeWidth={1.5} />
            </Button>}
        {onEdit &&
            <Button className="h-6 w-6 redis-item-table-text-color" variant="ghost" size="sm">
                <Pen strokeWidth={1.5} />
            </Button>}
        {onDelete &&
            <Button className="h-6 w-6 redis-item-table-text-color" variant="ghost" size="sm">
                <Trash2 strokeWidth={1.5} />
            </Button>}
    </div>;
}
export { RedisTableHeader, RedisTableCell, RedisTableAction };