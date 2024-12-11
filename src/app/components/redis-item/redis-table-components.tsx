import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Pen, Trash2 } from "lucide-react";
import { useState } from "react";

interface RedisTableHeaderProps {
    header: string;
}

function RedisTableHeader({ header }: RedisTableHeaderProps) {
    return <div className="redis-item-table-text-color">{header}</div>;
}


interface RedisTableCellProps {
    value: string | number;
}

interface RedisTableInputCellProps {
    value: string | number;
    onConfirm?: (value: string) => void;
}

function RedisTableCell({ value }: RedisTableCellProps) {
    return <div className="redis-item-table-text-color">{value}</div>;
}

function RedisTableInputCell({ value, onConfirm }: RedisTableInputCellProps) {
    let originalValue = value;
    const [inputValue, setInputValue] = useState(value);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && (inputValue !== originalValue)) {
            onConfirm?.(inputValue.toString());
            originalValue = inputValue;
        }
    };

    const handleBlur = () => {
        if (inputValue !== originalValue) {
            onConfirm?.(inputValue.toString());
            originalValue = inputValue;
        }
    };

    return <Input
        className="h-7 rounded-lg border-none shadow-none focus-visible:outline-none focus-visible:ring-blue-400 dark:focus-visible:ring-blue-600 focus-visible:ring-2 focus-visible:ring-offset-0 redis-item-table-text-color"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
    />;
}

interface RedisTableActionProps {
    onCopy?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

function RedisTableAction({ onCopy, onEdit, onDelete }: RedisTableActionProps) {
    return <div className="flex">
        {onCopy &&
            <Button className="h-6 w-6 redis-item-table-text-color" variant="ghost" size="sm" onClick={onCopy}>
                <Copy strokeWidth={1.5} />
            </Button>}
        {onEdit &&
            <Button className="h-6 w-6 redis-item-table-text-color" variant="ghost" size="sm" onClick={onEdit}>
                <Pen strokeWidth={1.5} />
            </Button>}
        {onDelete &&
            <Button className="h-6 w-6 redis-item-table-text-color" variant="ghost" size="sm" onClick={onDelete}>
                <Trash2 strokeWidth={1.5} />
            </Button>}
    </div>;
}
export { RedisTableHeader, RedisTableCell, RedisTableInputCell, RedisTableAction };