import { RedisItemType } from "@/types/redis";

export interface RedisTreeItem {
    key: string;
    label: string;
    children?: RedisTreeItem[];
    item_type: RedisItemType;
}
