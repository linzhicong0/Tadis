import { RedisDetailItem } from "@/types/redisItem";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type RedisItemType = 'string' | 'set' | 'hash' | 'list' | 'stream' | 'zset';

export function getRedisItemTypeColor(type: RedisItemType): string {
  const colors: Record<RedisItemType, string> = {
    string: 'bg-green-500',
    set: 'bg-blue-500',
    hash: 'bg-purple-600',
    list: 'bg-orange-400',
    stream: 'bg-red-500',
    zset: 'bg-purple-500'
  };
  return colors[type];
}

export function getRedisItemColor(item: RedisDetailItem) {
  return getRedisItemTypeColor(getRedisItemType(item) as RedisItemType);
}

export function getRedisItemType(item: RedisDetailItem) {
  return "StringValue" in item.value ? "string"
    : "ListValue" in item.value ? "list"
      : "SetValue" in item.value ? "set"
        : "HashValue" in item.value ? "hash"
          : "StreamValue" in item.value ? "stream"
            : "ZSetValue" in item.value ? "zset"
              : "unknown";
}

export async function copyToClipboard(text: string) {
  await writeText(text);
}
