import { RedisDetailItem } from "@/types/redisItem";
import { useState } from "react";


interface RedisStringEditorProps {
    item: RedisDetailItem;
    onValueChange: (value: string) => void;
}

export default function RedisStringEditor({ item, onValueChange }: RedisStringEditorProps) {
    const [stringValue, setStringValue] = useState(
        'StringValue' in item.value ? item.value.StringValue : ''
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setStringValue(newValue);
        onValueChange(newValue);
    };

    if (!('StringValue' in item.value)) return null;

    return <textarea
        className="w-full h-full min-h-0 bg-gray-800 text-gray-200 p-3 rounded-md resize-none"
        value={stringValue}
        onChange={handleChange}
    />
}