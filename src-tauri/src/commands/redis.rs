use std::collections::HashMap;
use std::sync::Mutex;

use redis::Commands;
use tauri::{command, State};

use crate::models::redis::{ListDirection, RedisItem, RedisItemValue, RedisTreeItem};
use crate::AppState;

const LIST_DELETED_VALUE_PLACEHOLDER: &str = "__MADIS_DELETED_VALUE_PLACEHOLDER__";

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
pub fn search_keys_as_tree(
    state: State<'_, Mutex<AppState>>,
    search_term: String,
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
        .keys(&format!("*{}*", search_term))
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

    println!("key_type: {:?}, size: {:?}, ttl: {:?}", key_type, size, ttl);

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
        "stream" => {
            let value = RedisItem {
                redis_key: key.clone(),
                value: RedisItemValue::StreamValue(get_stream(client, key)?),
                ttl,
                size,
            };
            println!("stream value: {:?}", value);
            Ok(value)
        }
        "zset" => {
            let value = RedisItem {
                redis_key: key.clone(),
                value: RedisItemValue::ZSetValue(get_zset(client, key)?),
                ttl,
                size,
            };
            Ok(value)
        }
        _ => Err(format!("Unsupported key type: {}", key_type)),
    }
}
#[command]
pub fn delete_key(state: State<'_, Mutex<AppState>>, key: String) -> Result<(), String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    client
        .del(&key)
        .map_err(|e| format!("Failed to delete key: {}", e))?;
    Ok(())
}

#[command]
pub fn add_list(
    state: State<'_, Mutex<AppState>>,
    key: String,
    items: Vec<String>,
    ttl: Option<i64>,
) -> Result<(), String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    let mut pipe = redis::pipe();
    pipe.rpush(&key, items);
    if let Some(ttl) = ttl {
        if ttl > 0 {
            pipe.expire(&key, ttl);
        }
    }

    pipe.query(client)
        .map_err(|e| format!("Failed to add list: {}", e))?;
    Ok(())
}

#[command]
pub fn save_string(
    state: State<'_, Mutex<AppState>>,
    key: String,
    value: String,
    ttl: Option<i64>,
) -> Result<(), String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    let mut pipe = redis::pipe();
    pipe.set(&key, value);
    if let Some(ttl) = ttl {
        if ttl > 0 {
            pipe.expire(&key, ttl);
        }
    }

    pipe.query(client)
        .map_err(|e| format!("Failed to save string: {}", e))?;

    Ok(())
}

#[command]
pub fn list_add_items(
    state: State<'_, Mutex<AppState>>,
    key: String,
    items: Vec<String>,
    direction: ListDirection,
) -> Result<(), String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    match direction {
        ListDirection::Start => {
            client
                .lpush(&key, items)
                .map_err(|e| format!("Failed to add items: {}", e))?;
        }
        ListDirection::End => {
            client
                .rpush(&key, items)
                .map_err(|e| format!("Failed to add items: {}", e))?;
        }
    }

    Ok(())
}

#[command]
pub fn list_update_value(
    state: State<'_, Mutex<AppState>>,
    key: String,
    index: i64,
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
        .lset(&key, index as isize, &value)
        .map_err(|e| format!("Failed to update value: {}", e))?;

    Ok(())
}

#[command]
pub fn list_delete_value(
    state: State<'_, Mutex<AppState>>,
    key: String,
    index: i64,
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
        .lset(&key, index as isize, LIST_DELETED_VALUE_PLACEHOLDER)
        .map_err(|e| format!("Failed to delete value: {}", e))?;

    client
        .lrem(&key, 0, &LIST_DELETED_VALUE_PLACEHOLDER)
        .map_err(|e| format!("Failed to delete value: {}", e))?;

    Ok(())
}

#[command]
pub fn set_add_items(
    state: State<'_, Mutex<AppState>>,
    key: String,
    items: Vec<String>,
    ttl: Option<i64>,
) -> Result<(), String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    let mut pipe = redis::pipe();
    pipe.sadd(&key, items);
    if let Some(ttl) = ttl {
        if ttl > 0 {
            pipe.expire(&key, ttl);
        }
    }
    pipe.query(client)
        .map_err(|e| format!("Failed to add items: {}", e))?;

    Ok(())
}

#[command]
pub fn set_update_value(
    state: State<'_, Mutex<AppState>>,
    key: String,
    value: String,
    new_value: String,
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
        .srem(&key, &value)
        .map_err(|e| format!("Failed to update value: {}", e))?;

    client
        .sadd(&key, &new_value)
        .map_err(|e| format!("Failed to update value: {}", e))?;

    Ok(())
}

#[command]
pub fn set_delete_value(
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
        .srem(&key, &value)
        .map_err(|e| format!("Failed to delete value: {}", e))?;

    Ok(())
}

#[command]
pub fn hash_add_items(
    state: State<'_, Mutex<AppState>>,
    key: String,
    items: Vec<(String, String)>,
    ttl: Option<i64>,
) -> Result<(), String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    let mut pipe = redis::pipe();
    pipe.hset_multiple(&key, &items);
    if let Some(ttl) = ttl {
        if ttl > 0 {
            pipe.expire(&key, ttl);
        }
    }
    pipe.query(client)
        .map_err(|e| format!("Failed to add items: {}", e))?;

    Ok(())
}

#[command]
pub fn hash_delete_field(
    state: State<'_, Mutex<AppState>>,
    key: String,
    field: String,
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
        .hdel(&key, &field)
        .map_err(|e| format!("Failed to delete field: {}", e))?;

    Ok(())
}

#[command]
pub fn hash_update_value(
    state: State<'_, Mutex<AppState>>,
    key: String,
    field: String,
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
        .hset(&key, &field, &value)
        .map_err(|e| format!("Failed to update field: {}", e))?;

    Ok(())
}

#[command]
pub fn hash_update_field(
    state: State<'_, Mutex<AppState>>,
    key: String,
    old_field: String,
    new_field: String,
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
        .hdel(&key, &old_field)
        .map_err(|e| format!("Failed to delete field: {}", e))?;

    client
        .hset(&key, &new_field, &value)
        .map_err(|e| format!("Failed to update key: {}", e))?;

    Ok(())
}

#[command]
pub fn add_zset_items(
    state: State<'_, Mutex<AppState>>,
    key: String,
    items: Vec<(f64, String)>,
    ttl: Option<i64>,
) -> Result<(), String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    let mut pipe = redis::pipe();
    pipe.zadd_multiple(&key, &items);
    if let Some(ttl) = ttl {
        if ttl > 0 {
            pipe.expire(&key, ttl);
        }
    }
    pipe.query(client)
        .map_err(|e| format!("Failed to add items: {}", e))?;

    Ok(())
}

#[command]
pub fn zset_add_items(
    state: State<'_, Mutex<AppState>>,
    key: String,
    items: Vec<(f64, String)>,
    replace: bool,
) -> Result<(), String> {
    println!("zset_add_items: {:?}", items);
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    if replace {
        println!("replace");
        client
            .zadd_multiple(&key, &items)
            .map_err(|e| format!("Failed to add items: {}", e))?;
    } else {
        redis::cmd("ZADD")
            .arg(key)
            .arg("NX")
            .arg(items)
            .exec(client)
            .map_err(|e| format!("Failed to add items: {}", e))?;
    }

    Ok(())
}

#[command]
pub fn zset_delete_value(
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
        .zrem(&key, &value)
        .map_err(|e| format!("Failed to delete value: {}", e))?;

    Ok(())
}

#[command]
pub fn zset_update_score(
    state: State<'_, Mutex<AppState>>,
    key: String,
    member: String,
    score: f64,
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
        .zadd(&key, &member, score)
        .map_err(|e| format!("Failed to update score: {}", e))?;

    Ok(())
}

#[command]
pub fn zset_update_member(
    state: State<'_, Mutex<AppState>>,
    key: String,
    old_member: String,
    new_member: String,
    score: f64,
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
        .zrem(&key, &old_member)
        .map_err(|e| format!("Failed to delete member: {}", e))?;

    client
        .zadd(&key, &new_member, score)
        .map_err(|e| format!("Failed to add member: {}", e))?;

    Ok(())
}

#[command]
pub fn stream_add_items(
    state: State<'_, Mutex<AppState>>,
    key: String,
    id: Option<String>,
    items: Vec<(String, String)>,
    ttl: Option<i64>,
) -> Result<(), String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    let id = id.unwrap_or("*".to_string());
    let mut pipe = redis::pipe();
    pipe.xadd(&key, id, &items);
    if let Some(ttl) = ttl {
        if ttl > 0 {
            pipe.expire(&key, ttl);
        }
    }
    pipe.query(client)
        .map_err(|e| format!("Failed to add items: {}", e))?;

    Ok(())
}

#[command]
pub fn stream_delete_value(
    state: State<'_, Mutex<AppState>>,
    key: String,
    id: String,
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
        .xdel(&key, &[&id])
        .map_err(|e| format!("Failed to delete value: {}", e))?;

    Ok(())
}

#[command]
pub fn update_ttl(state: State<'_, Mutex<AppState>>, key: String, ttl: i64) -> Result<(), String> {
    let mut state = state
        .lock()
        .map_err(|e| format!("Failed to lock state: {}", e))?;
    let selected = state.selected_client.clone();
    let client = state
        .connected_clients
        .get_mut(&selected)
        .ok_or(format!("No client selected"))?;

    if ttl == -1 {
        client
            .persist(&key)
            .map_err(|e| format!("Failed to update ttl: {}", e))?;
    } else {
        client
            .expire(&key, ttl)
            .map_err(|e| format!("Failed to update ttl: {}", e))?;
    }

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

fn get_stream(
    client: &mut redis::Connection,
    key: String,
) -> Result<Vec<HashMap<String, HashMap<String, String>>>, String> {
    let value: Vec<HashMap<String, HashMap<String, String>>> = client
        .xrange(&key, "-", "+")
        .map_err(|e| format!("Failed to get stream: {}", e))?;
    Ok(value)
}

fn get_zset(client: &mut redis::Connection, key: String) -> Result<Vec<(String, f64)>, String> {
    let value: Vec<(String, f64)> = client
        .zrange_withscores(&key, 0, -1)
        .map_err(|e| format!("Failed to get zset: {}", e))?;
    println!("zset value: {:?}", value);
    Ok(value)
}
