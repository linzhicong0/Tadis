use serde_json::{json, Value};
use tauri_plugin_store::StoreExt;
use std::collections::HashMap;
use crate::models::connection_config::ConnectionConfig;

const CONNECTIONS_KEY: &str = "connections";

#[tauri::command]
pub fn save_config(app_handle: tauri::AppHandle, new_configs: Vec<Value>) -> Result<(), String> {
    let store = app_handle
        .store("config.json")
        .expect("Failed to get store");
    
    // Get existing configs
    let mut existing_configs = match store.get(CONNECTIONS_KEY) {
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
    store.set(CONNECTIONS_KEY, json!(existing_configs));
    store.save()
        .map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
pub fn load_config(app_handle: tauri::AppHandle) -> Result<Value, String> {
    // If not in memory, load from file
    let store = app_handle
        .store("config.json")
        .expect("Failed to get store");
    let value = store.get(CONNECTIONS_KEY);
    // println!("{:?}", value);

    match value {
        Some(v) => Ok(v.clone()),
        None => Err("Could not load configuration data".to_string())
    }
}

#[tauri::command]
pub async fn delete_connection_config(
    app_handle: tauri::AppHandle,
    connection_name: String,
) -> Result<(), String> {
    let store = app_handle
        .store("config.json")
        .map_err(|e| e.to_string())?;
    
    let mut connections = store.get(CONNECTIONS_KEY)
        .ok_or("No connections found")?
        .as_array()
        .ok_or("Invalid connections format")?
        .iter()
        .map(|v| serde_json::from_value::<crate::models::connection_config::ConnectionConfig>(v.clone()))
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    let index = connections.iter()
        .position(|config| config.name == connection_name)
        .ok_or_else(|| format!("Connection '{}' not found", connection_name))?;
    
    connections.remove(index);
    
    store.set(CONNECTIONS_KEY, json!(connections));
    store.save()
        .map_err(|e| e.to_string())?;
        
    Ok(())
}
