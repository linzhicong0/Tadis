import { useState } from 'react';
import { CustomDialog } from '@/components/ui/custom-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DynamicItemList } from './dynamic-item-list';
import { redisCommands } from '@/services/redis-commands';
import { toast } from 'sonner';

import { z } from "zod";

const redisSchema = z.object({
    key: z.string().min(1, "Key must be at least 1 characters."),
});

interface AddItemDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialFormData = {
    key: '',
    dbIndex: 0,
    dataType: 'STRING',
    ttl: '-1',
    value: '',
    listItems: [{ value: '' }],
    hashItems: [{ field: '', value: '' }],
    setItems: [{ value: '' }],
    zsetItems: [{ value: '', score: 0 }],
    id: '*',
    streamItems: [{ field: '', value: '' }]
};

export default function AddItemDialog({ isOpen, onClose }: AddItemDialogProps) {
    const [formData, setFormData] = useState(initialFormData);

    // Create a new handler for closing
    const handleClose = () => {
        setFormData(initialFormData);
        onClose();
    };

    const handleConfirm = async () => {
        // Handle form submission

        try {

            const validatedData = redisSchema.parse(formData);

            let result: Promise<void> = Promise.resolve();
            switch (formData.dataType) {
                case 'STRING':
                    result = redisCommands.saveString(validatedData.key, formData.value, parseInt(formData.ttl));
                    break;
                case 'LIST':
                    result = redisCommands.addList(validatedData.key, formData.listItems.map(item => item.value), parseInt(formData.ttl));
                    break;
                case 'SET':
                    result = redisCommands.setAddItems(validatedData.key, formData.setItems.map(item => item.value), parseInt(formData.ttl));
                    break;
                case 'HASH':
                    result = redisCommands.hashAddItems(validatedData.key, formData.hashItems.map(item => [item.field, item.value]), parseInt(formData.ttl));
                    break;
                case 'ZSET':
                    result = redisCommands.addZsetItems(validatedData.key, formData.zsetItems.map(item => [item.score, item.value]), parseInt(formData.ttl));
                    break;
                case 'STREAM':
                    result = redisCommands.streamAddItems(validatedData.key, formData.id, formData.streamItems.map(item => [item.field, item.value]), parseInt(formData.ttl));
                    break;
            }

            result.then(() => {
                toast.success('Item added successfully.');
                setFormData(initialFormData);
                onClose();
            }).catch((error) => {
                toast.error(`Error adding item: ${error}`);
            });


        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error(error.errors[0].message);
                return;
            }
            toast.error('An unexpected error occurred');
            return;
        }
    };
    const handleTypeChange = (value: string) => {
        setFormData({
            ...formData,
            dataType: value,
            listItems: [{ value: '' }],
            hashItems: [{ field: '', value: '' }],
            setItems: [{ value: '' }],
            zsetItems: [{ value: '', score: 0 }],
            streamItems: [{ field: '', value: '' }],
            id: '*'
        });
    }

    function showTypeInput(dataType: string) {
        if (dataType === 'LIST') {
            return <DynamicItemList
                items={formData.listItems}
                fields={[
                    {
                        type: 'string',
                        placeholder: 'item'
                    }
                ]}
                onChange={(items) => {
                    setFormData({
                        ...formData,
                        listItems: items
                    });
                }}
                createEmptyItem={() => ({ value: '' })}
                getItemValue={(item, fieldIndex) => item.value}
                setItemValue={(item, fieldIndex, value) => ({ ...item, value })}
            />
        } else if (dataType === 'STRING') {
            return <textarea
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="custom-input w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
        } else if (dataType === 'HASH') {
            return <DynamicItemList
                items={formData.hashItems}
                fields={[
                    {
                        type: 'string',
                        placeholder: 'field'
                    },
                    {
                        type: 'string',
                        placeholder: 'value'
                    }
                ]}
                onChange={(items) => {
                    setFormData({
                        ...formData,
                        hashItems: items
                    });
                }}
                createEmptyItem={() => ({ value: '', field: '' })}
                getItemValue={(item, fieldIndex) => fieldIndex === 0 ? item.field : item.value}
                setItemValue={(item, fieldIndex, value) => fieldIndex === 0 ? { ...item, field: value } : { ...item, value }}
            />
        } else if (dataType === 'SET') {
            return <DynamicItemList
                items={formData.setItems}
                fields={[
                    {
                        type: 'string',
                        placeholder: 'item'
                    }
                ]}
                onChange={(items) => {
                    setFormData({
                        ...formData,
                        setItems: items
                    });
                }}
                createEmptyItem={() => ({ value: '' })}
                getItemValue={(item, fieldIndex) => item.value}
                setItemValue={(item, fieldIndex, value) => ({ ...item, value })}
            />
        } else if (dataType === 'ZSET') {
            return <DynamicItemList
                items={formData.zsetItems}
                fields={[
                    {
                        type: 'string',
                        placeholder: 'member'
                    },
                    {
                        type: 'number',
                        placeholder: 'score'
                    }
                ]}
                onChange={(items) => {
                    setFormData({
                        ...formData,
                        zsetItems: items
                    });
                }}
                createEmptyItem={() => ({ value: '', score: 0 })}
                getItemValue={(item, fieldIndex) => fieldIndex === 0 ? item.value : item.score.toString()}
                setItemValue={(item, fieldIndex, value) => fieldIndex === 0 ? { ...item, value } : { ...item, score: parseFloat(value) }}
            />
        } else if (dataType === 'STREAM') {
            return <DynamicItemList
                items={formData.streamItems}
                fields={[
                    { type: 'string', placeholder: 'field' },
                    { type: 'string', placeholder: 'value' }
                ]}
                onChange={(items) => {
                    setFormData({
                        ...formData,
                        streamItems: items
                    });
                }}
                createEmptyItem={() => ({ field: '', value: '' })}
                getItemValue={(item, fieldIndex) => fieldIndex === 0 ? item.field : item.value}
                setItemValue={(item, fieldIndex, value) => fieldIndex === 0 ? { ...item, field: value } : { ...item, value }}
            />
        }
    }

    return (
        <CustomDialog isOpen={isOpen} onClose={handleClose} title="Add Item">
            <div className="flex flex-col max-h-[80vh]">
                <ScrollArea className="h-[calc(80vh-8rem)] max-h-[500px]">
                    <div className="space-y-4 mr-4">
                        {/* Key Input */}
                        <div className="space-y-2">
                            <Label>Key</Label>
                            <Input
                                value={formData.key}
                                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                                placeholder="Enter key"
                                className="custom-input"
                            />
                        </div>

                        {/* Database Index */}
                        <div className="space-y-2">
                            <Label>Database Index</Label>
                            <Select
                                value={formData.dbIndex.toString()}
                                onValueChange={(value) => setFormData({ ...formData, dbIndex: parseInt(value) })}
                            >
                                <SelectTrigger className="custom-input">
                                    <SelectValue>
                                        {formData.dbIndex}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[...Array(16)].map((_, i) => (
                                            <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Data Type */}
                        <div className="space-y-2">
                            <Label>Data Type</Label>
                            <Select
                                value={formData.dataType}
                                onValueChange={(value) => {
                                    handleTypeChange(value);
                                }}
                            >
                                <SelectTrigger className="custom-input">
                                    <SelectValue placeholder="Select data type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="STRING">STRING</SelectItem>
                                        <SelectItem value="LIST">LIST</SelectItem>
                                        <SelectItem value="SET">SET</SelectItem>
                                        <SelectItem value="HASH">HASH</SelectItem>
                                        <SelectItem value="ZSET">ZSET</SelectItem>
                                        <SelectItem value="STREAM">STREAM</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* TTL */}
                        <div className="space-y-2">
                            <Label>TTL (seconds)</Label>
                            <Input
                                type="number"
                                value={formData.ttl}
                                onChange={(e) => setFormData({ ...formData, ttl: e.target.value })}
                                className="custom-input"
                            />
                        </div>

                        {/* ID */}
                        {formData.dataType === 'STREAM' && (
                            <div className="space-y-2">
                                <Label>ID</Label>
                                <Input
                                    value={formData.id}
                                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                    className="custom-input"
                                />
                            </div>
                        )}

                        {/* Value */}
                        <div className="space-y-2">
                            <Label>Value</Label>
                            <ScrollArea className="h-48">
                                {showTypeInput(formData.dataType)}
                            </ScrollArea>
                        </div>
                    </div>
                </ScrollArea>
                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2c2c2c] dark:hover:bg-[#3c3c3c] text-gray-900 dark:text-white px-4"
                        onClick={handleClose}
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
            </div>

        </CustomDialog>
    );
}