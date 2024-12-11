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
const ZSET_ADD_ITEMS_COMMAND_NAME = 'zset_add_items';
const STREAM_ADD_ITEMS_COMMAND_NAME = 'stream_add_items';
const DELETE_KEY_COMMAND_NAME = 'delete_key';
const HASH_DELETE_FIELD_COMMAND_NAME = 'hash_delete_field';
const SET_DELETE_VALUE_COMMAND_NAME = 'set_delete_value';
const ZSET_DELETE_VALUE_COMMAND_NAME = 'zset_delete_value';
const STREAM_DELETE_VALUE_COMMAND_NAME = 'stream_delete_value';
const LIST_DELETE_VALUE_COMMAND_NAME = 'list_delete_value';
const LIST_UPDATE_VALUE_COMMAND_NAME = 'list_update_value';
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

    zsetAddItems: async (key: string, items: [number, string][], replace: boolean): Promise<void> => {
        return invoke<void>(ZSET_ADD_ITEMS_COMMAND_NAME, { key, items, replace });
    },

    streamAddItems: async (key: string, id: string, items: [string, string][]): Promise<void> => {
        return invoke<void>(STREAM_ADD_ITEMS_COMMAND_NAME, { key, id, items });
    },

    deleteKey: async (key: string): Promise<void> => {
        return invoke<void>(DELETE_KEY_COMMAND_NAME, { key });
    },

    hashDeleteField: async (key: string, field: string): Promise<void> => {
        return invoke<void>(HASH_DELETE_FIELD_COMMAND_NAME, { key, field });
    },

    setDeleteValue: async (key: string, value: string): Promise<void> => {
        return invoke<void>(SET_DELETE_VALUE_COMMAND_NAME, { key, value });
    },

    zsetDeleteValue: async (key: string, value: string): Promise<void> => {
        return invoke<void>(ZSET_DELETE_VALUE_COMMAND_NAME, { key, value });
    },

    streamDeleteValue: async (key: string, id: string): Promise<void> => {
        return invoke<void>(STREAM_DELETE_VALUE_COMMAND_NAME, { key, id });
    },

    listDeleteValue: async (key: string, index: number): Promise<void> => {
        return invoke<void>(LIST_DELETE_VALUE_COMMAND_NAME, { key, index });
    },

    listUpdateValue: async (key: string, index: number, value: string): Promise<void> => {
        return invoke<void>(LIST_UPDATE_VALUE_COMMAND_NAME, { key, index, value });
    },

};


