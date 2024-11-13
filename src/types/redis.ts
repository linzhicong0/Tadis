export type RedisItemType = 'string' | 'set' | 'hash' | 'list' | 'stream' | 'zset';

export interface RedisTreeItem {
  name: string;
  type?: RedisItemType;
  children?: RedisTreeItem[];
} 