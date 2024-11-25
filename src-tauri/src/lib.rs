use redis::Connection;
use std::{collections::HashMap, sync::Mutex};
use tauri::Manager;

mod commands;
mod models;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            commands::connection::delete_connection_config,
            commands::connection::save_connection_config,
            commands::connection::load_connection_config,
            commands::connection::test_connection,
            commands::connection::connect_to_redis,
            commands::redis::get_all_keys_as_tree,
            commands::redis::get_key_detail,
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            app.manage(Mutex::new(AppState {
                connected_clients: HashMap::new(),
                selected_client: String::new(),
            }));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

pub struct AppState {
    pub connected_clients: HashMap<String, Connection>,
    pub selected_client: String,
}
