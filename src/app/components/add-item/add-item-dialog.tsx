import { useState } from 'react';
import { CustomDialog } from '@/components/ui/custom-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddItemDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddItemDialog({ isOpen, onClose }: AddItemDialogProps) {
    const [formData, setFormData] = useState({
        key: '',
        dbIndex: 0,
        dataType: 'STRING',
        ttl: '-1',
        value: ''
    });

    const handleSubmit = () => {
        // Handle form submission
        console.log(formData);
        onClose();
    };

    return (
        <CustomDialog isOpen={isOpen} onClose={onClose} title="Add Item">
            <div className="space-y-4">
                {/* Key Input */}
                <div className="space-y-2">
                    <Label>Key</Label>
                    <Input
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                        placeholder="Enter key"
                    />
                </div>

                {/* Database Index */}
                <div className="space-y-2">
                    <Label>Database Index</Label>
                    <Select
                        value={formData.dbIndex.toString()}
                        onValueChange={(value) => setFormData({ ...formData, dbIndex: parseInt(value) })}
                    >
                        <SelectTrigger>
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
                        onValueChange={(value) => setFormData({ ...formData, dataType: value })}
                    >
                        <SelectTrigger>
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
                    />
                </div>

                {/* Value */}
                <div className="space-y-2">
                    <Label>Value</Label>
                    <ScrollArea className="h-48">
                        <textarea
                            value={formData.value}
                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                            className="w-full h-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        />
                    </ScrollArea>

                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2c2c2c] dark:hover:bg-[#3c3c3c] text-gray-900 dark:text-white px-4"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                        onClick={handleSubmit}
                    >
                        Confirm
                    </Button>
                </div>
            </div>
        </CustomDialog>
    );
}