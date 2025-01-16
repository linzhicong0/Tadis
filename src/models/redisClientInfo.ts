export interface RedisClientInfo {
    id: string;
    ip: string;
    db: string;
    connectedTime: number;
    idleTime: number;
}