
import { ConnectionConfig } from '@/models/connection';
import { invoke } from '@tauri-apps/api/core';


const LOAD_CONFIG_COMMAND_NAME = 'load_config';
const SAVE_CONFIG_COMMAND_NAME = 'save_config';

export const connectionCommands = {

  loadConfig: async (): Promise<ConnectionConfig[]> => {
    return invoke<ConnectionConfig[]>(LOAD_CONFIG_COMMAND_NAME);
  },

  saveConfig: async (config: ConnectionConfig[]): Promise<void> => {
    return invoke(SAVE_CONFIG_COMMAND_NAME, { config });
  }

};