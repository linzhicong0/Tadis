
import { ConnectionConfig } from '@/models/connection';
import { invoke } from '@tauri-apps/api/core';
import { RedisTreeItem } from '@/models/redisTreeItem';
import { RedisItem } from '@/types/redisItem';
const GET_ALL_KEYS_AS_TREE_COMMAND_NAME = 'get_all_keys_as_tree';
const GET_STRING_COMMAND_NAME = 'get_string';

export const redisCommands = {

    getAllKeysAsTree: async (): Promise<RedisTreeItem[]> => {
        return invoke<RedisTreeItem[]>(GET_ALL_KEYS_AS_TREE_COMMAND_NAME);
    },

    getString: async (key: string): Promise<RedisItem> => {
        return invoke<RedisItem>(GET_STRING_COMMAND_NAME, { key });
    },


};

