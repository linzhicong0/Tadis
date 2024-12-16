import { CustomDialog } from "@/components/ui/custom-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookmarkMinus, ListEnd, Plus, Replace, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { redisCommands } from "@/services/redis-commands";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface AddZSetDialogProps {
    isOpen: boolean;
    onClose?: () => void;
    redisKey: string;
    onConfirm?: (items: [number, string][]) => void;
}

export default function AddZSetDialog({ isOpen, onClose, redisKey, onConfirm }: AddZSetDialogProps) {
    const [items, setItems] = useState<[number, string][]>([[0, ""]]);
    const [duplicationType, setDuplicationType] = useState<'Replace' | 'Ignore'>('Replace');
    const lastInputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleAddItem = () => {
        setItems([...items, [0, ""]]);
        setTimeout(() => {
            lastInputRef.current?.select();
            buttonRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems.length ? newItems : [[0, ""]]);
    };

    const handleItemChange = (index: number, value: [number, string]) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };

    const handleConfirm = () => {
        const nonEmptyItems = items.filter(([_, value]) => value.trim() !== '');
        redisCommands.zsetAddItems(redisKey, nonEmptyItems, duplicationType === 'Replace').then(() => {
            reset();
            onConfirm?.(nonEmptyItems);
            onClose?.();
        }).catch((error) => {
            toast.error("Failed to add items: " + error);
        });
    };

    const handleCancel = () => {
        reset();
        onClose?.();
    };

    const reset = () => {
        setItems([[0, ""]]);
        setDuplicationType('Replace');
    };

    return (
        <CustomDialog isOpen={isOpen} onClose={handleCancel} title={"ZSet Add Item(s)"}>
            <ScrollArea className="h-[calc(80vh-8rem)] max-h-[300px]">
                <div className="space-y-2 py-2 mr-4">
                    <div className="space-y-2">
                        <Label>Key</Label>
                        <Input value={redisKey} disabled />
                    </div>

                    <div className="space-y-2">
                        <Label>Type</Label>
                        <ToggleGroup
                            type="single"
                            size="sm"
                            defaultValue={duplicationType}
                            className="justify-start"
                            onValueChange={(value) => setDuplicationType(value as 'Replace' | 'Ignore')}
                        >
                            <ToggleGroupItem value="Replace" aria-label="Toggle replace">
                                <div className="flex items-center gap-2">
                                    <Replace className="h-4 w-4" />
                                    <span>Replace</span>
                                </div>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="Ignore" aria-label="Toggle ignore">
                                <div className="flex items-center gap-2">
                                    <BookmarkMinus className="h-4 w-4" />
                                    <span>Ignore</span>
                                </div>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    <div className="space-y-2">
                        <Label>Item(s)</Label>
                        <ScrollArea className="h-44">
                            <div className="space-y-2 mr-3 ml-1 mt-1">
                                {items.map((item, index) => (
                                    <div key={index} className="flex gap-1">
                                        <Input
                                            ref={index === items.length - 1 ? lastInputRef : null}
                                            value={item[1]}
                                            onChange={(e) => handleItemChange(index, [item[0], e.target.value])}
                                            placeholder="member"
                                            autoComplete="off"
                                        />
                                        <Input
                                            type="number"
                                            value={item[0]}
                                            onChange={(e) => handleItemChange(index, [Number(e.target.value), item[1]])}
                                            placeholder="score"
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
                                    Add Item
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
