type RedisItemValue = 
  | { type: 'String', value: string }
  | { type: 'Hash', value: Record<string, string> }
  | { type: 'List', value: string[] }
  | { type: 'Set', value: string[] }
  | { type: 'SortedSet', value: Array<[string, number]> }
  | { type: 'None' };

interface RedisItem {
  value: RedisItemValue;
  ttl: string;
  size: string;
}


export type { RedisItem };