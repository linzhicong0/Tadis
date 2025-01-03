import { invoke } from '@tauri-apps/api/core';
import { RedisTreeItem } from '@/models/redisTreeItem';
import { RedisDetailItem } from '@/types/redisItem';

const GET_ALL_KEYS_AS_TREE_COMMAND_NAME = 'get_all_keys_as_tree';
const SEARCH_KEYS_AS_TREE_COMMAND_NAME = 'search_keys_as_tree';
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
const SET_UPDATE_VALUE_COMMAND_NAME = 'set_update_value';
const HASH_UPDATE_FIELD_COMMAND_NAME = 'hash_update_field';
const HASH_UPDATE_VALUE_COMMAND_NAME = 'hash_update_value';
const ZSET_UPDATE_SCORE_COMMAND_NAME = 'zset_update_score';
const ZSET_UPDATE_MEMBER_COMMAND_NAME = 'zset_update_member';
const ADD_LIST_COMMAND_NAME = 'add_list';
const ADD_ZSET_ITEMS_COMMAND_NAME = 'add_zset_items';

export const redisCommands = {

    getAllKeysAsTree: async (): Promise<RedisTreeItem[]> => {
        return invoke<RedisTreeItem[]>(GET_ALL_KEYS_AS_TREE_COMMAND_NAME);
    },

    searchKeysAsTree: async (searchTerm: string): Promise<RedisTreeItem[]> => {
        return invoke<RedisTreeItem[]>(SEARCH_KEYS_AS_TREE_COMMAND_NAME, { searchTerm });
    },

    getKeyDetail: async (key: string): Promise<RedisDetailItem> => {
        return invoke<RedisDetailItem>(GET_KEY_DETAIL_COMMAND_NAME, { key });
    },

    saveString: async (key: string, value: string, ttl: number | null): Promise<void> => {
        return invoke<void>(SAVE_STRING_COMMAND_NAME, { key, value, ttl });
    },

    updateTTL: async (key: string, ttl: number): Promise<void> => {
        return invoke<void>(UPDATE_TTL_COMMAND_NAME, { key, ttl });
    },

    listAddItems: async (key: string, items: string[], direction: 'Start' | 'End'): Promise<void> => {
        return invoke<void>(LIST_ADD_ITEMS_COMMAND_NAME, { key, items, direction });
    },

    setAddItems: async (key: string, items: string[], ttl: number | null): Promise<void> => {
        return invoke<void>(SET_ADD_ITEMS_COMMAND_NAME, { key, items, ttl });
    },

    hashAddItems: async (key: string, items: [string, string][], ttl: number | null): Promise<void> => {
        return invoke<void>(HASH_ADD_ITEMS_COMMAND_NAME, { key, items, ttl });
    },

    zsetAddItems: async (key: string, items: [number, string][], replace: boolean): Promise<void> => {
        return invoke<void>(ZSET_ADD_ITEMS_COMMAND_NAME, { key, items, replace });
    },

    streamAddItems: async (key: string, id: string, items: [string, string][], ttl: number | null): Promise<void> => {
        return invoke<void>(STREAM_ADD_ITEMS_COMMAND_NAME, { key, id, items, ttl });
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

    setUpdateValue: async (key: string, value: string, newValue: string): Promise<void> => {
        return invoke<void>(SET_UPDATE_VALUE_COMMAND_NAME, { key, value, newValue });
    },

    hashUpdateValue: async (key: string, field: string, value: string): Promise<void> => {
        return invoke<void>(HASH_UPDATE_VALUE_COMMAND_NAME, { key, field, value });
    },

    hashUpdateField: async (key: string, oldField: string, newField: string, value: string): Promise<void> => {
        return invoke<void>(HASH_UPDATE_FIELD_COMMAND_NAME, { key, oldField, newField, value });
    },

    zsetUpdateScore: async (key: string, member: string, score: number): Promise<void> => {
        return invoke<void>(ZSET_UPDATE_SCORE_COMMAND_NAME, { key, member, score });
    },

    zsetUpdateMember: async (key: string, oldMember: string, newMember: string, score: number): Promise<void> => {
        return invoke<void>(ZSET_UPDATE_MEMBER_COMMAND_NAME, { key, oldMember, newMember, score });
    },

    addList: async (key: string, items: string[], ttl: number): Promise<void> => {
        return invoke<void>(ADD_LIST_COMMAND_NAME, { key, items, ttl });
    },

    addZsetItems: async (key: string, items: [number, string][], ttl: number | null): Promise<void> => {
        return invoke<void>(ADD_ZSET_ITEMS_COMMAND_NAME, { key, items, ttl });
    },
};



