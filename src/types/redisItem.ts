type RedisItemValue = 
  | { StringValue: string }
  | { HashValue: Record<string, string> }
  | { ListValue: string[] }
  | { SetValue: string[] }
  | { SortedSetValue: Array<[string, number]> }
  | { None: null};

interface RedisDetailItem {
  redisKey: string,
  value: RedisItemValue;
  ttl: number;
  size: number;
}


export type { RedisDetailItem };