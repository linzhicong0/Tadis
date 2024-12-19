use std::sync::Mutex;

use crate::models::ConnectionConfig;
use sqlx::Row;
use sqlx::SqlitePool;
use tauri::{Manager, Runtime};

pub async fn get_all_connection_configurations<R: Runtime>(
    mgr: &impl Manager<R>,
) -> Result<Vec<ConnectionConfig>, sqlx::Error> {
    let pool = {
        let state = mgr.state::<Mutex<SqlitePool>>();
        let pool = state.lock().unwrap();
        pool.clone()
    };

    let rows = sqlx::query("SELECT name, host, port, username, password FROM connection_configs")
        .fetch_all(&pool)
        .await?;

    let configs: Vec<ConnectionConfig> = rows
        .iter()
        .map(|row| ConnectionConfig {
            name: row.get("name"),
            host: row.get("host"),
            port: row.get("port"),
            username: row.get("username"),
            password: row.get("password"),
        })
        .collect();

    Ok(configs)
}

pub async fn create_connection_configuration<R: Runtime>(
    mgr: &impl Manager<R>,
    config: ConnectionConfig,
) -> Result<(), sqlx::Error> {
    let state = mgr.state::<Mutex<SqlitePool>>();
    let pool = &*state.lock().unwrap();

    sqlx::query("INSERT INTO connection_configs (name, host, port, username, password) VALUES (?, ?, ?, ?, ?)")
        .bind(config.name)
        .bind(config.host)
        .bind(config.port)
        .bind(config.username)
        .bind(config.password)
        .execute(pool)
        .await?;

    Ok(())
}

pub async fn update_connection_configuration<R: Runtime>(
    mgr: &impl Manager<R>,
    config: ConnectionConfig,
) -> Result<(), sqlx::Error> {
    let state = mgr.state::<Mutex<SqlitePool>>();
    let pool = &*state.lock().unwrap();

    sqlx::query("UPDATE connection_configs SET name = ?, host = ?, port = ?, username = ?, password = ? WHERE name = ?")
        .bind(config.name)
        .bind(config.host)
        .bind(config.port)
        .bind(config.username)
        .bind(config.password)
        .execute(pool)
        .await?;

    Ok(())
}

pub async fn delete_connection_configuration<R: Runtime>(
    mgr: &impl Manager<R>,
    name: String,
) -> Result<(), sqlx::Error> {
    let state = mgr.state::<Mutex<SqlitePool>>();
    let pool = &*state.lock().unwrap();

    sqlx::query("DELETE FROM connection_configs WHERE name = ?")
        .bind(name)
        .execute(pool)
        .await?;

    Ok(())
}
