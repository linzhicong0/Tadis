use serde::{Serialize, Deserialize};


#[derive(Serialize, Deserialize, Debug, Clone, Default)]
#[serde(default, rename_all = "camelCase")]
pub struct ConnectionConfig {
    pub name: String,
    pub host: String,
    pub port: u16,
    pub username: String,
    pub password: String,
}

