use std::{sync::Mutex, time::Duration};

use log::info;
use madis_database::{
    models::ConnectionConfig,
    queries::{
        connection_name_exists, create_connection_configuration, delete_connection_configuration,
        get_all_connection_configurations, update_connection_configuration,
    },
};
use redis::Client;
use tauri::State;

use crate::AppState;

#[tauri::command]
pub async fn save_connection_config(
    app_handle: tauri::AppHandle,
    config: ConnectionConfig,
    is_new: bool,
) -> Result<(), String> {
    if is_new {
        info!("Creating new connection configuration for {:?}", config);

        let exists = connection_name_exists(&app_handle, config.name.clone()).await.map_err(|e| e.to_string())?;
        if exists {
            return Err(format!("Connection name '{}' already exists", config.name));
        }

        create_connection_configuration(&app_handle, config)
            .await
            .map_err(|e| e.to_string())?;
    } else {
        info!("Updating connection configuration for {:?}", config);
        update_connection_configuration(&app_handle, config)
            .await
            .map_err(|e| e.to_string())?;
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
    delete_connection_configuration(&app_handle, connection_name)
        .await
        .map_err(|e| e.to_string())?;

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
