type RedisItemValue = 
  | { StringValue: string }
  | { HashValue: Record<string, string> }
  | { ListValue: string[] }
  | { SetValue: string[] }
  | { SortedSetValue: Array<[string, number]> }
  | { StreamValue: Record<string, Record<string, string>> }
  | { None: null};

interface RedisDetailItem {
  redis_key: string,
  value: RedisItemValue;
  ttl: number;
  size: number;
}


export type { RedisDetailItem };