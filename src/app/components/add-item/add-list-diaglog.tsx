import { CustomDialog } from "@/components/ui/custom-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListStart, ListEnd, Plus, Trash2 } from "lucide-react";
import { useState, useRef } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { redisCommands } from "@/services/redis-commands";
import { toast } from "sonner";

interface AddListDialogProps {
    isOpen: boolean;
    onClose?: () => void;
    redisKey: string;
    onConfirm?: (position: 'Start' | 'End', items: string[]) => void;
}

export default function AddListDialog({ isOpen, onClose, redisKey, onConfirm }: AddListDialogProps) {
    const [direction, setDirection] = useState<'Start' | 'End'>('Start');
    const [items, setItems] = useState<string[]>(['']);
    const lastInputRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const handleAddItem = () => {
        setItems([...items, '']);
        setTimeout(() => {
            lastInputRef.current?.select();
            buttonRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems.length ? newItems : ['']);
    };

    const handleItemChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };

    const handleConfirm = () => {
        const nonEmptyItems = items.filter(item => item.trim() !== '');
        redisCommands.listAddItems(redisKey, nonEmptyItems, direction).then(() => {
            reset();
            onConfirm?.(direction, nonEmptyItems);
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
        setItems(['']);
        setDirection('Start');
    };

    return (
        <CustomDialog isOpen={isOpen} onClose={handleCancel} title={"List Add Item(s)"}>
            <div className="space-y-2 py-2">
                <div className="space-y-2">
                    <Label>Key</Label>
                    <Input value={redisKey} disabled />
                </div>

                <div className="space-y-2">
                    <Label>Type</Label>
                    <ToggleGroup
                        type="single"
                        size="sm"
                        defaultValue={direction}
                        className="justify-start"
                        onValueChange={(value) => setDirection(value as 'Start' | 'End')}
                    >
                        <ToggleGroupItem value="Start" aria-label="Toggle start">
                            <div className="flex items-center gap-2">
                                <ListStart className="h-4 w-4" />
                                <span>Start</span>
                            </div>
                        </ToggleGroupItem>
                        <ToggleGroupItem value="End" aria-label="Toggle end">
                            <div className="flex items-center gap-2">
                                <ListEnd className="h-4 w-4" />
                                <span>End</span>
                            </div>
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="space-y-2">
                    <Label>Item(s)</Label>
                    <ScrollArea className="h-24">
                        <div className="space-y-2 mr-3 ml-1 mt-1">
                            {items.map((item, index) => (
                                <div key={index} className="flex gap-1">
                                    <Input
                                        ref={index === items.length - 1 ? lastInputRef : null}
                                        value={item}
                                        onChange={(e) => handleItemChange(index, e.target.value)}
                                        placeholder="new item"
                                    />
                                    <Button
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
                                ref={buttonRef}
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

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2c2c2c] dark:hover:bg-[#3c3c3c] text-gray-900 dark:text-white px-4"
                    onClick={handleCancel}>
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
