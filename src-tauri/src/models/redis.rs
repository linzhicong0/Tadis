use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RedisTreeItem {
    pub key: String,
    pub label: String,
    pub children: Option<Vec<RedisTreeItem>>,
    pub item_type: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RedisItem {
    pub redis_key: String,
    pub value: RedisItemValue,
    pub ttl: i64,
    pub size: i64,
}

// #[derive(Serialize, Deserialize, Debug, Clone)]
// pub struct StreamEntry {
//     pub id: String,
//     pub fields: HashMap<String, String>,
// }

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum RedisItemValue {
    StringValue(String),
    HashValue(HashMap<String, String>),
    ListValue(Vec<String>),
    SetValue(Vec<String>),
    ZSetValue(Vec<(String, f64)>),
    StreamValue(Vec<HashMap<String, HashMap<String, String>>>),
    None,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum ListDirection {
    Start,
    End,
}