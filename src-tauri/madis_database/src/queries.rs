use std::sync::Mutex;

use crate::models::ConnectionConfig;
use log::info;
use sqlx::SqlitePool;
use sqlx::Row;
use tauri::{Manager, Runtime};

pub async fn get_connection_configurations<R: Runtime>(
    mgr: &impl Manager<R>,
) -> Result<Option<Vec<ConnectionConfig>>, sqlx::Error> {
    let state = mgr.state::<Mutex<SqlitePool>>();
    let pool = &*state.lock().unwrap();

    let row = sqlx::query("SELECT * FROM connection_configs")
        .fetch_one(pool)
        .await?;
    info!("row: {:?}", row.get::<String, _>("name"));

    Ok(None)
}
