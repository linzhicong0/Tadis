use std::sync::Mutex;

use redis::Commands;
use tauri::{command, State};

use crate::AppState;
use crate::models::redis::RedisTreeItem;

#[command]
pub fn get_all_keys_as_tree(state: State<'_, Mutex<AppState>>) -> Result<Vec<RedisTreeItem>, String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    let keys: Vec<String> = client
        .keys("*")
        .map_err(|e| format!("Failed to get keys: {}", e))?;

    let mut result = convert_keys_to_tree(client, keys);    
    result.sort_by(|a, b| {
        match (a.children.is_some(), b.children.is_some()) {
            (true, false) => std::cmp::Ordering::Less,
            (false, true) => std::cmp::Ordering::Greater,
            _ => a.label.cmp(&b.label),
        }
    });

    Ok(result)
}

pub fn convert_keys_to_tree(client: &mut redis::Connection, keys: Vec<String>) -> Vec<RedisTreeItem> {
    let mut root_items: Vec<RedisTreeItem> = Vec::new();
    
    for key in keys {
        let parts: Vec<&str> = key.split(':').collect();
        let item_type = get_key_type(client, key.clone()).unwrap_or_default();
        let mut current_items = &mut root_items;
        let mut current_path = String::new();
        
        // Process each part of the key
        for (i, &part) in parts.iter().enumerate() {
            let is_last = i == parts.len() - 1;
            
            // Build the current path
            if !current_path.is_empty() {
                current_path.push(':');
            }
            current_path.push_str(part);
            
            // Check if this part already exists in current_items
            let existing_index = current_items.iter().position(|item| item.label == part);
            
            match existing_index {
                Some(index) => {
                    // Item exists, move to its children
                    current_items = current_items[index].children.get_or_insert(Vec::new());
                }
                None => {
                    // Create new item
                    let new_item = RedisTreeItem {
                        key: if is_last { key.clone() } else { "".to_string() },
                        label: part.to_string(),
                        children: if is_last { None } else { Some(Vec::new()) },
                        item_type: item_type.clone(),
                    };
                    
                    current_items.push(new_item);
                    
                    // If not the last part, get the children vec of the newly added item
                    if !is_last {
                        let last_index = current_items.len() - 1;
                        current_items = current_items[last_index].children.as_mut().unwrap();
                    }
                }
            }
        }
    }
    
    root_items
}

pub fn get_key_type(client: &mut redis::Connection, key: String) -> Result<String, String> {

    let key_type: String = client
        .key_type(&key)
        .map_err(|e| format!("Failed to get key type: {}", e))?;

    Ok(key_type)
}

