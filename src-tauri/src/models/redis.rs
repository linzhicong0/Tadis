use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RedisTreeItem {
    pub key: String,
    pub label: String,
    pub children: Option<Vec<RedisTreeItem>>,
    pub item_type: String,
}
