use redis::Connection;
use window_vibrancy::*;
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
            commands::redis::save_string,
            commands::redis::update_ttl,
            commands::redis::list_add_items,
        ])
        .setup(|app| {

            let window = app.get_webview_window("main").unwrap();


            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
            
            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125))).expect("Unsupported platform! 'apply_blur' is only supported on Windows");


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
