#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ConnectionConfig {
    name: String,
    host: String,
    port: u16,
    username: String,
    password: String,
    // Add other config fields as needed
}