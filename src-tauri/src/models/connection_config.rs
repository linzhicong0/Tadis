use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ConnectionConfig {
    pub name: String,
    pub host: String,
    pub port: u16,
    pub username: String,
    pub password: String,
}
