use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tauri::async_runtime::Mutex;
use tauri_plugin_store::{StoreBuilder, StoreExt};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            save_config,
            load_config,
        ])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ConnectionConfig {
    name: String,
    host: String,
    port: u16,
    username: String,
    password: String,
    // Add other config fields as needed
}

// Store the config in memory
struct ConnectionConfigStore(Mutex<Option<ConnectionConfig>>);

#[tauri::command]
fn save_config(app_handle: tauri::AppHandle, new_configs: Vec<Value>) -> Result<(), String> {
    let store = app_handle
        .store("config.json")
        .expect("Failed to get store");
    
    // Get existing configs
    let mut existing_configs = match store.get("config") {
        Some(v) => v.as_array()
            .ok_or("Invalid config format")?
            .clone(),
        None => Vec::new()
    };
    
    // Check for duplicate names
    for new_config in &new_configs {
        let new_name = new_config["name"].as_str().ok_or("Invalid name format")?;
        if existing_configs.iter().any(|config| config["name"].as_str() == Some(new_name)) {
            return Err(format!("Connection '{}' already exists.", new_name));
        }
    }
    
    // Append new configs
    existing_configs.extend(new_configs);
    
    // Save updated configs
    store.set("config", json!(existing_configs));
    
    Ok(())
}

#[tauri::command]
fn load_config(app_handle: tauri::AppHandle) -> Result<Value, String> {
    // If not in memory, load from file
    let store = app_handle
        .store("config.json")
        .expect("Failed to get store");
    let value = store.get("config");
    // println!("{:?}", value);

    match value {
        Some(v) => Ok(v.clone()),
        None => Err("Could not load configuration data".to_string())
    }
}
