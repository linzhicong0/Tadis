use std::{sync::Mutex, time::Duration};

use madis_database::{models::ConnectionConfig, queries::get_all_connection_configurations};
use redis::Client;
use serde_json::json;
use tauri::State;
use tauri_plugin_store::StoreExt;

use crate::AppState;

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
pub async fn load_connection_config(
    app_handle: tauri::AppHandle,
) -> Result<Vec<ConnectionConfig>, String> {
    let configs = get_all_connection_configurations(&app_handle)
        .await
        .map_err(|e| e.to_string())?;

    Ok(configs)
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
        config.username, config.password, config.host, config.port, 0
    );

    let client = Client::open(url).map_err(|e| format!("Failed to create Redis client: {}", e))?;

    let _connection = client
        .get_connection_with_timeout(Duration::from_secs(1))
        .map_err(|e| format!("Failed to connect to Redis: {}", e))?;

    Ok("Connection successful!".to_string())
}

#[tauri::command]
pub fn connect_to_redis(
    state: State<'_, Mutex<AppState>>,
    config: ConnectionConfig,
) -> Result<(), String> {
    let url = format!(
        "redis://{}:{}@{}:{}/{}",
        config.username, config.password, config.host, config.port, 0
    );
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    if state.connected_clients.contains_key(&config.name) {
        return Err(format!("Connection '{}' already connected.", config.name));
    }

    let client = Client::open(url).map_err(|e| format!("Failed to create Redis client: {}", e))?;

    let connection = client
        .get_connection_with_timeout(Duration::from_secs(120))
        .map_err(|e| format!("Failed to connect to Redis: {}", e))?;

    state
        .connected_clients
        .insert(config.name.clone(), connection);
    state.selected_client = config.name.clone();
    println!("Connected to Redis: {}", config.name);

    Ok(())
}
