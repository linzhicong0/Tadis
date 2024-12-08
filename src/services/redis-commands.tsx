import { invoke } from '@tauri-apps/api/core';
import { RedisTreeItem } from '@/models/redisTreeItem';
import { RedisDetailItem } from '@/types/redisItem';
const GET_ALL_KEYS_AS_TREE_COMMAND_NAME = 'get_all_keys_as_tree';
const GET_KEY_DETAIL_COMMAND_NAME = 'get_key_detail';
const SAVE_STRING_COMMAND_NAME = 'save_string';
const UPDATE_TTL_COMMAND_NAME = 'update_ttl';
const LIST_ADD_ITEMS_COMMAND_NAME = 'list_add_items';
const SET_ADD_ITEMS_COMMAND_NAME = 'set_add_items';
const HASH_ADD_ITEMS_COMMAND_NAME = 'hash_add_items';

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

    updateTTL: async (key: string, ttl: number): Promise<void> => {
        return invoke<void>(UPDATE_TTL_COMMAND_NAME, { key, ttl });
    },

    listAddItems: async (key: string, items: string[], direction: 'Start' | 'End'): Promise<void> => {
        return invoke<void>(LIST_ADD_ITEMS_COMMAND_NAME, { key, items, direction });
    },

    setAddItems: async (key: string, items: string[]): Promise<void> => {
        return invoke<void>(SET_ADD_ITEMS_COMMAND_NAME, { key, items });
    },

    hashAddItems: async (key: string, items: [string, string][]): Promise<void> => {
        return invoke<void>(HASH_ADD_ITEMS_COMMAND_NAME, { key, items });
    },

};

