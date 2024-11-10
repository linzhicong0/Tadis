use std::time::Duration;

use crate::models::connection_config::ConnectionConfig;
use serde_json::{json, Value};
use tauri_plugin_store::StoreExt;
use redis::Client;

const CONNECTIONS_KEY: &str = "connections";
const CONFIG_FILE_NAME: &str = "connections_config.json";

#[tauri::command]
pub fn save_connection_config(
    app_handle: tauri::AppHandle,
    config: ConnectionConfig,
    is_new: bool,
) -> Result<(), String> {
    let store = app_handle
        .store(CONFIG_FILE_NAME)
        .expect("Failed to get store");

    let mut existing_connection_configs = match store.get(CONNECTIONS_KEY) {
        Some(v) => v.as_object().ok_or("Invalid config format")?.clone(),
        None => serde_json::Map::new(),
    };

    if is_new {
        if existing_connection_configs.contains_key(&config.name) {
            return Err(format!("Connection '{}' already exists.", config.name));
        } else {
            existing_connection_configs
                .insert(config.name.clone(), serde_json::to_value(config).unwrap());
            store.set(CONNECTIONS_KEY, json!(existing_connection_configs));
            store.save().map_err(|e| e.to_string())?;
        }
    } else {
        existing_connection_configs
            .insert(config.name.clone(), serde_json::to_value(config).unwrap());
        store.set(CONNECTIONS_KEY, json!(existing_connection_configs));
        store.save().map_err(|e| e.to_string())?;
        
    }

    Ok(())
}

#[tauri::command]
pub fn load_connection_config(
    app_handle: tauri::AppHandle,
) -> Result<Vec<ConnectionConfig>, String> {
    let store = app_handle
        .store(CONFIG_FILE_NAME)
        .expect("Failed to get store");

    let connections = match store.get(CONNECTIONS_KEY) {
        Some(v) => v.as_object().ok_or("Invalid config format")?.clone(),
        None => return Err("No connections found".to_string()),
    };
    let connections_vec = connections
        .values()
        .map(|v| {
            serde_json::from_value::<crate::models::connection_config::ConnectionConfig>(v.clone())
        })
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(connections_vec)
}

#[tauri::command]
pub async fn delete_connection_config(
    app_handle: tauri::AppHandle,
    connection_name: String,
) -> Result<(), String> {
    let store = app_handle
        .store(CONFIG_FILE_NAME)
        .map_err(|e| e.to_string())?;

    let mut connections = store
        .get(CONNECTIONS_KEY)
        .ok_or("No connections found")?
        .as_object()
        .ok_or("Invalid connections format")?
        .clone();

    connections.remove(&connection_name);

    store.set(CONNECTIONS_KEY, json!(connections));
    store.save().map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn test_connection(config: ConnectionConfig) -> Result<String, String> {
    let url = format!(
        "redis://{}:{}@{}:{}/{}",
        config.username,
        config.password,
        config.host,
        config.port,
        0
    );

    let client = Client::open(url).map_err(|e| format!("Failed to create Redis client: {}", e))?;
    
    let connection = client
        .get_connection_with_timeout(Duration::from_secs(1))
        .map_err(|e| format!("Failed to connect to Redis: {}", e))?;

    Ok("Connection successful!".to_string())
}
