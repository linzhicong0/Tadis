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


// #[derive(Serialize, Deserialize, Debug, Clone)]
// pub struct RedisServerStatistics {
//     pub redis_version: String,
//     pub redis_mode: RedisMode,
//     pub uptime_in_seconds: i64,
//     pub uptime_in_days: i64,
//     pub connected_clients: i64,
//     pub used_memory_human: String,
//     pub total_keys: i64,
//     pub time: String,
// }


// #[derive(Serialize, Deserialize, Debug, Clone)]
// pub enum RedisMode {
//     Standalone,
//     Cluster,
//     Sentinel,
// }


#[derive(Debug, serde::Serialize)]
pub struct RedisServerStatistics {
    // Server section
    pub server: ServerStats,
    // Clients section
    pub clients: ClientStats,
    // Memory section
    pub memory: MemoryStats,
    // Stats section
    pub stats: Stats,
    // CPU section
    pub cpu: CpuStats,
    // Keyspace section
    pub keyspace: Vec<KeyspaceStats>,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ServerStats {
    pub version: String,
    pub mode: String,
    pub os: String,
    pub arch_bits: u32,
    pub uptime_in_seconds: u64,
    pub uptime_in_days: u64,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ClientStats {
    pub connected_clients: u32,
    pub blocked_clients: u32,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MemoryStats {
    pub used_memory: u64,
    pub used_memory_human: String,
    pub used_memory_rss: u64,
    pub used_memory_peak: u64,
    pub used_memory_peak_human: String,
    pub used_memory_lua: u64,
    pub maxmemory: u64,
    pub maxmemory_policy: String,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Stats {
    pub total_connections_received: u64,
    pub total_commands_processed: u64,
    pub instantaneous_ops_per_sec: u64,
    pub total_net_input_bytes: u64,
    pub total_net_output_bytes: u64,
    pub keyspace_hits: u64,
    pub keyspace_misses: u64,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CpuStats {
    pub used_cpu_sys: f64,
    pub used_cpu_user: f64,
    pub used_cpu_sys_children: f64,
    pub used_cpu_user_children: f64,
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct KeyspaceStats {
    pub database: String,
    pub keys: u64,
    pub expires: u64,
    pub avg_ttl: u64,
}

impl From<String> for RedisServerStatistics {
    fn from(info: String) -> Self {
        let mut server = ServerStats {
            version: String::new(),
            mode: String::new(),
            os: String::new(),
            arch_bits: 0,
            uptime_in_seconds: 0,
            uptime_in_days: 0,
        };
        let mut clients = ClientStats {
            connected_clients: 0,
            blocked_clients: 0,
        };
        let mut memory = MemoryStats {
            used_memory: 0,
            used_memory_human: String::new(),
            used_memory_rss: 0,
            used_memory_peak: 0,
            used_memory_peak_human: String::new(),
            used_memory_lua: 0,
            maxmemory: 0,
            maxmemory_policy: String::new(),
        };
        let mut stats = Stats {
            total_connections_received: 0,
            total_commands_processed: 0,
            instantaneous_ops_per_sec: 0,
            total_net_input_bytes: 0,
            total_net_output_bytes: 0,
            keyspace_hits: 0,
            keyspace_misses: 0,
        };
        let mut cpu = CpuStats {
            used_cpu_sys: 0.0,
            used_cpu_user: 0.0,
            used_cpu_sys_children: 0.0,
            used_cpu_user_children: 0.0,
        };
        let mut keyspace = Vec::new();

        let lines: Vec<&str> = info.lines().collect();
        let mut current_section = "";

        for line in lines {
            if line.starts_with('#') {
                current_section = line.trim_start_matches("# ");
                continue;
            }

            if line.is_empty() {
                continue;
            }

            let parts: Vec<&str> = line.split(':').collect();
            if parts.len() != 2 {
                continue;
            }

            let key = parts[0];
            let value = parts[1];

            match current_section {
                "Server" => {
                    match key {
                        "redis_version" => server.version = value.to_string(),
                        "redis_mode" => server.mode = value.to_string(),
                        "os" => server.os = value.to_string(),
                        "arch_bits" => server.arch_bits = value.parse().unwrap_or(0),
                        "uptime_in_seconds" => server.uptime_in_seconds = value.parse().unwrap_or(0),
                        "uptime_in_days" => server.uptime_in_days = value.parse().unwrap_or(0),
                        _ => {}
                    }
                }
                "Clients" => {
                    match key {
                        "connected_clients" => clients.connected_clients = value.parse().unwrap_or(0),
                        "blocked_clients" => clients.blocked_clients = value.parse().unwrap_or(0),
                        _ => {}
                    }
                }
                "Memory" => {
                    match key {
                        "used_memory" => memory.used_memory = value.parse().unwrap_or(0),
                        "used_memory_human" => memory.used_memory_human = value.to_string(),
                        "used_memory_rss" => memory.used_memory_rss = value.parse().unwrap_or(0),
                        "used_memory_peak" => memory.used_memory_peak = value.parse().unwrap_or(0),
                        "used_memory_peak_human" => memory.used_memory_peak_human = value.to_string(),
                        "used_memory_lua" => memory.used_memory_lua = value.parse().unwrap_or(0),
                        "maxmemory" => memory.maxmemory = value.parse().unwrap_or(0),
                        "maxmemory_policy" => memory.maxmemory_policy = value.to_string(),
                        _ => {}
                    }
                }
                "Stats" => {
                    match key {
                        "total_connections_received" => stats.total_connections_received = value.parse().unwrap_or(0),
                        "total_commands_processed" => stats.total_commands_processed = value.parse().unwrap_or(0),
                        "instantaneous_ops_per_sec" => stats.instantaneous_ops_per_sec = value.parse().unwrap_or(0),
                        "total_net_input_bytes" => stats.total_net_input_bytes = value.parse().unwrap_or(0),
                        "total_net_output_bytes" => stats.total_net_output_bytes = value.parse().unwrap_or(0),
                        "keyspace_hits" => stats.keyspace_hits = value.parse().unwrap_or(0),
                        "keyspace_misses" => stats.keyspace_misses = value.parse().unwrap_or(0),
                        _ => {}
                    }
                }
                "CPU" => {
                    match key {
                        "used_cpu_sys" => cpu.used_cpu_sys = value.parse().unwrap_or(0.0),
                        "used_cpu_user" => cpu.used_cpu_user = value.parse().unwrap_or(0.0),
                        "used_cpu_sys_children" => cpu.used_cpu_sys_children = value.parse().unwrap_or(0.0),
                        "used_cpu_user_children" => cpu.used_cpu_user_children = value.parse().unwrap_or(0.0),
                        _ => {}
                    }
                }
                "Keyspace" => {
                    let db = key.to_string();
                    let stats_parts: Vec<&str> = value.split(',').collect();
                    let mut db_stats = KeyspaceStats {
                        database: db,
                        keys: 0,
                        expires: 0,
                        avg_ttl: 0,
                    };

                    for stat in stats_parts {
                        let kv: Vec<&str> = stat.split('=').collect();
                        if kv.len() == 2 {
                            match kv[0] {
                                "keys" => db_stats.keys = kv[1].parse().unwrap_or(0),
                                "expires" => db_stats.expires = kv[1].parse().unwrap_or(0),
                                "avg_ttl" => db_stats.avg_ttl = kv[1].parse().unwrap_or(0),
                                _ => {}
                            }
                        }
                    }
                    keyspace.push(db_stats);
                }
                _ => {}
            }
        }

        RedisServerStatistics {
            server,
            clients,
            memory,
            stats,
            cpu,
            keyspace,
        }
    }
}


