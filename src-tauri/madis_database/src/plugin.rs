use std::{
    fs::{create_dir_all, File},
    path::PathBuf,
    str::FromStr,
    sync::Mutex,
};

use log::info;
use sqlx::{migrate::Migrator, sqlite::SqliteConnectOptions, SqlitePool};
use tauri::{
    path::BaseDirectory,
    plugin::{self, TauriPlugin},
    AppHandle, Manager, Runtime,
};

#[derive(Default)]
pub struct Builder {}

impl Builder {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn build<R: Runtime>(self) -> TauriPlugin<R> {
        plugin::Builder::<R>::new("madis_database")
            .setup(|app, _| {
                info!("Building database plugin");
                let app_data_dir = app.path().app_data_dir().unwrap();
                create_dir_all(app_data_dir.clone()).expect("Problem creating App directory!");

                let db_file_path = app_data_dir.join("db.sqlite");
                info!("Database file path: {:?}", db_file_path);

                {
                    let db_file_path = db_file_path.clone();
                    let app_handle = app;
                    tauri::async_runtime::block_on(async move {
                        must_migrate_db(app_handle, &db_file_path).await;
                    });
                };

                // let manager = SqliteConnectionManager::file(db_file_path);
                let pool = tauri::async_runtime::block_on(async {
                    SqlitePool::connect_with(
                        SqliteConnectOptions::from_str(
                            db_file_path.to_string_lossy().to_string().as_str(),
                        )
                        .unwrap(),
                    )
                    .await
                    .expect("Failed to connect to database")
                });
                info!("Database connected.");

                app.manage(Mutex::new(pool));

                Ok(())
            })
            .build()
    }
}

async fn must_migrate_db<R: Runtime>(app_handle: &AppHandle<R>, path: &PathBuf) {
    let app_data_dir = app_handle.path().app_data_dir().unwrap();
    let sqlite_file_path = app_data_dir.join("db.sqlite");

    info!("Creating database file at {:?}", sqlite_file_path);
    File::options()
        .write(true)
        .create(true)
        .open(&sqlite_file_path)
        .expect("Problem creating database file!");

    let p_string = sqlite_file_path.to_string_lossy().replace(' ', "%20");
    let url = format!("sqlite://{}?mode=rwc", p_string);

    info!("Connecting to database at {}", url);
    let opts = SqliteConnectOptions::from_str(path.to_string_lossy().to_string().as_str()).unwrap();
    let pool = SqlitePool::connect_with(opts)
        .await
        .expect("Failed to connect to database");
    let p = app_handle
        .path()
        .resolve("migrations", BaseDirectory::Resource)
        .expect("failed to resolve resource");

    info!("Running database migrations from: {}", p.to_string_lossy());
    let mut m = Migrator::new(p).await.expect("Failed to load migrations");
    m.set_ignore_missing(true); // So we can roll back versions and not crash
    m.run(&pool).await.expect("Failed to run migrations");

    info!("Database migrations complete");
}
