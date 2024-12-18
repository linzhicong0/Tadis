import { Button } from "@/components/ui/button";
import { CustomDialog } from "@/components/ui/custom-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface TTLDialogProps {
    isOpen: boolean;
    onClose: () => void;
    redisKey: string;
    ttlValue: number;
    onConfirm: (value: number) => void;
}

export default function TTLDialog({ isOpen, onClose, redisKey, ttlValue, onConfirm }: TTLDialogProps) {
    const [ttl, setTTL] = useState(ttlValue);
    const [unit, setUnit] = useState("seconds");

    const handleQuickSetTTL = (value: string) => {
        setTTL(parseInt(value));
        setUnit("seconds");
    };

    const handleConfirm = () => {
        let ttlInSeconds = ttl;
        if (unit === "minutes") {
            ttlInSeconds = ttl * 60;
        } else if (unit === "hours") {
            ttlInSeconds = ttl * 60 * 60;
        } else if (unit === "days") {
            ttlInSeconds = ttl * 24 * 60 * 60;
        }
        onConfirm(ttlInSeconds);
        onClose();
    };

    return (
        <CustomDialog
            isOpen={isOpen}
            onClose={onClose}
            title="Update TTL"
        >
            <div className="space-y-4">
                <div>
                    <Label>Key</Label>
                    <Input value={redisKey} disabled />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ttl">TTL</Label>
                    <div className="flex gap-2">
                        <Input
                            value={ttl}
                            onChange={(e) => setTTL(parseInt(e.target.value))}
                            className="custom-input flex-1"
                        />
                        <div className="w-32">
                            <Select onValueChange={(value) => {
                                setUnit(value);
                            }} defaultValue={unit} value={unit}>
                                <SelectTrigger className="w-32 custom-input">
                                    <SelectValue placeholder="Seconds" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Unit</SelectLabel>
                                        <SelectItem value="seconds">Seconds</SelectItem>
                                        <SelectItem value="minutes">Minutes</SelectItem>
                                        <SelectItem value="hours">Hours</SelectItem>
                                        <SelectItem value="days">Days</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2c2c2c] dark:hover:bg-[#3c3c3c] text-gray-900 dark:text-white px-4" onClick={() => handleQuickSetTTL("-1")}>
                        infinity
                    </Button>
                    <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2c2c2c] dark:hover:bg-[#3c3c3c] text-gray-900 dark:text-white px-4" onClick={() => handleQuickSetTTL("10")}>
                        10 seconds
                    </Button>
                    <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2c2c2c] dark:hover:bg-[#3c3c3c] text-gray-900 dark:text-white px-4" onClick={() => handleQuickSetTTL("60")}>
                        1 minute
                    </Button>
                    <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2c2c2c] dark:hover:bg-[#3c3c3c] text-gray-900 dark:text-white px-4" onClick={() => handleQuickSetTTL("3600")}>
                        1 hour
                    </Button>
                    <Button variant="secondary" className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2c2c2c] dark:hover:bg-[#3c3c3c] text-gray-900 dark:text-white px-4" onClick={() => handleQuickSetTTL("86400")}>
                        1 day
                    </Button>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2c2c2c] dark:hover:bg-[#3c3c3c] text-gray-900 dark:text-white px-4"
                        onClick={onClose}>
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