import { redisCommands } from "@/services/redis-commands";
import { RedisDetailItem } from "@/types/redisItem";
import { useState } from "react";
import { toast } from "sonner";


export default function RedisStringEditor({ item }: { item: RedisDetailItem }) {

    const [stringValue, setStringValue] = useState(
        'StringValue' in item.value ? item.value.StringValue : ''
    );

    const onSave = async () => {
        redisCommands.saveString(item.redis_key, stringValue).then(() => {
            toast.success("Value saved successfully")
        });
    };

    if (!('StringValue' in item.value)) return null;

    return <textarea
        className="w-full h-full min-h-0 bg-gray-800 text-gray-200 p-3 rounded-md resize-none"
        value={stringValue}
        onChange={(e) => setStringValue(e.target.value)}
    />
}