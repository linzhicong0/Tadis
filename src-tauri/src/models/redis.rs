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
pub struct RedisItem{
    pub value: RedisItemValue,
    pub ttl: String,
    pub size: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum RedisItemValue{
    StringValue(String),
    HashValue(HashMap<String, String>),
    ListValue(Vec<String>),
    SetValue(Vec<String>),
    SortedSetValue(Vec<(String, f64)>),
    None,
}