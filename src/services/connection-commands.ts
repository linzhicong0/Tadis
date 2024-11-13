
import { ConnectionConfig } from '@/models/connection';
import { invoke } from '@tauri-apps/api/core';

const LOAD_CONFIG_COMMAND_NAME = 'load_connection_config';
const SAVE_CONFIG_COMMAND_NAME = 'save_connection_config';
const DELETE_CONFIG_COMMAND_NAME = 'delete_connection_config';
const TEST_CONNECTION_COMMAND_NAME = 'test_connection';
const CONNECT_TO_REDIS_COMMAND_NAME = 'connect_to_redis';

export const connectionCommands = {

  loadConfig: async (): Promise<ConnectionConfig[]> => {
    return invoke<ConnectionConfig[]>(LOAD_CONFIG_COMMAND_NAME);
  },

  saveConfig: async (config: ConnectionConfig, isNew: boolean): Promise<void> => {
    return invoke(SAVE_CONFIG_COMMAND_NAME, { config, isNew });
  },

  deleteConfig: async (connectionName: string): Promise<void> => {
    return invoke(DELETE_CONFIG_COMMAND_NAME, { connectionName });
  },

  testConnection: async (config: ConnectionConfig): Promise<void> => {
    return invoke(TEST_CONNECTION_COMMAND_NAME, { config });
  },

  connectToRedis: async (config: ConnectionConfig): Promise<void> => {
    return invoke(CONNECT_TO_REDIS_COMMAND_NAME, { config });
  }

};
