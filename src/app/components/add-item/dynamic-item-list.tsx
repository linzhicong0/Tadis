// src/components/dynamic-item-list.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2 } from "lucide-react";
import { useRef } from "react";

interface FieldConfig {
    type: 'string' | 'number';
    placeholder: string;
}

interface DynamicItemListProps<T> {
    items: T[];
    fields: FieldConfig[];
    onChange: (items: T[]) => void;
    createEmptyItem: () => T;
    getItemValue: (item: T, fieldIndex: number) => string | number;
    setItemValue: (item: T, fieldIndex: number, value: string) => T;
}

export function DynamicItemList<T>({
    items,
    fields,
    onChange,
    createEmptyItem,
    getItemValue,
    setItemValue,
}: DynamicItemListProps<T>) {
    const lastInputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleAddItem = () => {
        onChange([...items, createEmptyItem()]);
        setTimeout(() => {
            lastInputRef.current?.select();
            buttonRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        onChange(newItems.length ? newItems : [createEmptyItem()]);
    };

    const handleItemChange = (itemIndex: number, fieldIndex: number, value: string) => {
        const newItems = [...items];
        newItems[itemIndex] = setItemValue(items[itemIndex], fieldIndex, value);
        onChange(newItems);
    };

    return (
        <div className="space-y-2 mr-3 ml-1 mt-1">
            {items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-1">
                    {fields.map((field, fieldIndex) => (
                        <Input
                            key={fieldIndex}
                            ref={itemIndex === items.length - 1 && fieldIndex === 0 ? lastInputRef : null}
                            type={field.type}
                            value={getItemValue(item, fieldIndex)}
                            onChange={(e) => handleItemChange(itemIndex, fieldIndex, e.target.value)}
                            placeholder={field.placeholder}
                            autoComplete="off"
                            className="custom-input"
                        />
                    ))}
                    <Button
                        ref={buttonRef}
                        className="redis-item-table-text-color hover:text-red-500"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(itemIndex)}
                    >
                        <Trash2 strokeWidth={1.5} className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            <Button
                variant="secondary"
                className="w-full"
                onClick={handleAddItem}
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
            </Button>
        </div>
    );
}