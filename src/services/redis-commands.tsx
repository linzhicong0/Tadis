
import { ConnectionConfig } from '@/models/connection';
import { invoke } from '@tauri-apps/api/core';
import { RedisTreeItem } from '@/models/redisTreeItem';
import { RedisDetailItem } from '@/types/redisItem';
const GET_ALL_KEYS_AS_TREE_COMMAND_NAME = 'get_all_keys_as_tree';
const GET_KEY_DETAIL_COMMAND_NAME = 'get_key_detail';
const SAVE_STRING_COMMAND_NAME = 'save_string';

export const redisCommands = {

    getAllKeysAsTree: async (): Promise<RedisTreeItem[]> => {
        return invoke<RedisTreeItem[]>(GET_ALL_KEYS_AS_TREE_COMMAND_NAME);
    },

    getKeyDetail: async (key: string): Promise<RedisDetailItem> => {
        return invoke<RedisDetailItem>(GET_KEY_DETAIL_COMMAND_NAME, { key });
    },

    saveString: async (key: string, value: string): Promise<void> => {
        return invoke<void>(SAVE_STRING_COMMAND_NAME, { key, value });
    },

};

