
export type RedisItemType = 'string' | 'set' | 'hash' | 'list' | 'stream' | 'zset';
export interface RedisTreeItem {
    key: string;
    label: string;
    children?: RedisTreeItem[];
    item_type: RedisItemType;
}
