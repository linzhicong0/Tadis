
import { ConnectionConfig } from '@/models/connection';
import { invoke } from '@tauri-apps/api/core';

const GET_ALL_KEYS_COMMAND_NAME = 'get_all_keys';

export const redisCommands = {

    getAllKeys: async (): Promise<string[]> => {
        return invoke<string[]>(GET_ALL_KEYS_COMMAND_NAME);
    },


};

