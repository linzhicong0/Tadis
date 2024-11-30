use std::collections::HashMap;
use std::sync::Mutex;

use redis::Commands;
use tauri::{command, State};

use crate::models::redis::{RedisItem, RedisItemValue, RedisTreeItem};
use crate::AppState;

#[command]
pub fn get_all_keys_as_tree(
    state: State<'_, Mutex<AppState>>,
) -> Result<Vec<RedisTreeItem>, String> {
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
    result.sort_by(|a, b| match (a.children.is_some(), b.children.is_some()) {
        (true, false) => std::cmp::Ordering::Less,
        (false, true) => std::cmp::Ordering::Greater,
        _ => a.label.cmp(&b.label),
    });

    Ok(result)
}

#[command]
pub fn get_key_detail(state: State<'_, Mutex<AppState>>, key: String) -> Result<RedisItem, String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    println!("key: {:?}", key);
    let key_type: String = client
        .key_type(&key)
        .map_err(|e| format!("Failed to get key type: {}", e))?;

    let (size, ttl): (i64, i64) = redis::pipe()
        .atomic()
        .cmd("MEMORY")
        .arg("USAGE")
        .arg(&key)
        .cmd("TTL")
        .arg(&key)
        .query(client)
        .map_err(|e| format!("Failed to query Redis: {}", e))?;

    println!("size: {:?}, ttl: {:?}", size, ttl);

    match key_type.as_str() {
        "string" => {
            let value = RedisItem {
                redis_key: key.clone(),
                value: RedisItemValue::StringValue(get_string(client, key)?),
                ttl: ttl,
                size: size,
            };
            Ok(value)
        }
        "list" => {
            let value = RedisItem {
                redis_key: key.clone(),
                value: RedisItemValue::ListValue(get_list(client, key)?),
                ttl: ttl,
                size: size,
            };
            Ok(value)
        }
        "set" => {
            let value = RedisItem {
                redis_key: key.clone(),
                value: RedisItemValue::SetValue(get_set(client, key)?),
                ttl: ttl,
                size: size,
            };
            Ok(value)
        }
        "hash" => {
            let value = RedisItem {
                redis_key: key.clone(),
                value: RedisItemValue::HashValue(get_hash(client, key)?),
                ttl: ttl,
                size: size,
            };
            Ok(value)
        }
        _ => Err(format!("Unsupported key type: {}", key_type)),
    }
}

#[command]
pub fn save_string(
    state: State<'_, Mutex<AppState>>,
    key: String,
    value: String,
) -> Result<(), String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    client
        .set(&key, value)
        .map_err(|e| format!("Failed to save string: {}", e))?;

    Ok(())
}

fn convert_keys_to_tree(client: &mut redis::Connection, keys: Vec<String>) -> Vec<RedisTreeItem> {
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

fn get_key_type(client: &mut redis::Connection, key: String) -> Result<String, String> {
    let key_type: String = client
        .key_type(&key)
        .map_err(|e| format!("Failed to get key type: {}", e))?;

    Ok(key_type)
}

fn get_string(client: &mut redis::Connection, key: String) -> Result<String, String> {
    let value: String = client
        .get(&key)
        .map_err(|e| format!("Failed to get key value: {}", e))?;

    Ok(value)
}

fn get_list(client: &mut redis::Connection, key: String) -> Result<Vec<String>, String> {
    let value: Vec<String> = client
        .lrange(&key, 0, -1)
        .map_err(|e| format!("Failed to get list: {}", e))?;

    Ok(value)
}

fn get_set(client: &mut redis::Connection, key: String) -> Result<Vec<String>, String> {
    let value: Vec<String> = client
        .smembers(&key)
        .map_err(|e| format!("Failed to get set: {}", e))?;

    Ok(value)
}

fn get_hash(
    client: &mut redis::Connection,
    key: String,
) -> Result<HashMap<String, String>, String> {
    let value: HashMap<String, String> = client
        .hgetall(&key)
        .map_err(|e| format!("Failed to get hash: {}", e))?;
    Ok(value)
}
