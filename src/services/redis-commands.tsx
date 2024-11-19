
import { ConnectionConfig } from '@/models/connection';
import { invoke } from '@tauri-apps/api/core';
import { RedisTreeItem } from '@/models/redisTreeItem';
const GET_ALL_KEYS_AS_TREE_COMMAND_NAME = 'get_all_keys_as_tree';

export const redisCommands = {

    getAllKeysAsTree: async (): Promise<RedisTreeItem[]> => {
        return invoke<RedisTreeItem[]>(GET_ALL_KEYS_AS_TREE_COMMAND_NAME);
    },


};

