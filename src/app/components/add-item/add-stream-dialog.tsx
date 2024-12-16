import { CustomDialog } from "@/components/ui/custom-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { redisCommands } from "@/services/redis-commands";
import { toast } from "sonner";

interface FieldValuePair {
    field: string;
    value: string;
}

interface AddStreamDialogProps {
    isOpen: boolean;
    onClose?: () => void;
    redisKey: string;
    onConfirm?: (items: FieldValuePair[]) => void;
}

export default function AddStreamDialog({ isOpen, onClose, redisKey, onConfirm }: AddStreamDialogProps) {
    const [items, setItems] = useState<FieldValuePair[]>([{ field: "", value: "" }]);
    const [id, setId] = useState<string>("*");
    const lastInputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleAddItem = () => {
        setItems([...items, { field: "", value: "" }]);
        setTimeout(() => {
            lastInputRef.current?.select();
            buttonRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems.length ? newItems : [{ field: "", value: "" }]);
    };

    const handleItemChange = (index: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[index] = { field, value };
        setItems(newItems);
    };

    const handleConfirm = () => {
        const nonEmptyItems = items.filter(item => item.field.trim() !== '' && item.value.trim() !== '');
        redisCommands.streamAddItems(redisKey, id, nonEmptyItems.map((item) => [item.field, item.value]), null).then(() => {
            reset();
            onConfirm?.(nonEmptyItems);
            onClose?.();
        }).catch((error) => {
            toast.error("Failed to add stream entry: " + error);
        });
    };

    const handleCancel = () => {
        reset();
        onClose?.();
    };

    const reset = () => {
        setItems([{ field: "", value: "" }]);
    };

    return (
        <CustomDialog isOpen={isOpen} onClose={handleCancel} title="Stream Add Entry">
            <ScrollArea className="h-[calc(80vh-8rem)] max-h-[300px]">
                <div className="space-y-2 py-2 mr-4">
                    <div className="space-y-2">
                        <Label>Key</Label>
                        <Input value={redisKey} disabled />
                    </div>

                    <div className="space-y-2">
                        <Label>Id</Label>
                        <Input value={id} onChange={(e) => setId(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label>Field-Value Pairs</Label>
                        <ScrollArea className="h-44">
                            <div className="space-y-2 mr-3 ml-1 mt-1">
                                {items.map((item, index) => (
                                    <div key={index} className="flex gap-1">
                                        <Input
                                            ref={index === items.length - 1 ? lastInputRef : null}
                                            value={item.field}
                                            onChange={(e) => handleItemChange(index, e.target.value, item.value)}
                                            placeholder="field"
                                            autoComplete="off"
                                        />
                                        <Input
                                            value={item.value}
                                            onChange={(e) => handleItemChange(index, item.field, e.target.value)}
                                            placeholder="value"
                                            autoComplete="off"
                                        />
                                        <Button
                                            ref={buttonRef}
                                            className="redis-item-table-text-color hover:text-red-500"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveItem(index)}
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
                                    Add item
                                </Button>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </ScrollArea>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2c2c2c] dark:hover:bg-[#3c3c3c] text-gray-900 dark:text-white px-4"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                    onClick={handleConfirm}
                >
                    Confirm
                </Button>
            </div>
        </CustomDialog>
    );
}
