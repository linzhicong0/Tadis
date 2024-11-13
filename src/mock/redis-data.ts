import { RedisTreeItem } from '@/types/redis';

export const mockRedisData: RedisTreeItem[] = [
  {
    name: 'users',
    children: [
      {
        name: 'user:1',
        children: [
          { name: 'user:1:name', type: 'string' },
          { name: 'user:1:preferences', type: 'set' },
          { name: 'user:1:profile', type: 'hash' },
        ]
      },
      {
        name: 'user:2',
        children: [
          { name: 'user:2:name', type: 'string' },
          { name: 'user:2:posts', type: 'list' },
        ]
      }
    ]
  },
  {
    name: 'products',
    children: [
      { name: 'products:featured', type: 'set' },
      { name: 'products:trending', type: 'zset' },
    ]
  }
]; 