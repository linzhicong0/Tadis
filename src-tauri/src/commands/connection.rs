use serde_json::{json, Value};
use tauri_plugin_store::StoreExt;

#[tauri::command]
pub fn save_config(app_handle: tauri::AppHandle, new_configs: Vec<Value>) -> Result<(), String> {
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
pub fn load_config(app_handle: tauri::AppHandle) -> Result<Value, String> {
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