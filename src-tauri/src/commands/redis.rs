use std::sync::Mutex;

use redis::Commands;
use tauri::{command, State};

use crate::AppState;

#[command]
pub fn get_all_keys(state: State<'_, Mutex<AppState>>) -> Result<Vec<String>, String> {
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

    Ok(keys)
}
