export interface RedisServerStatistics {
    server: ServerStats;
    clients: ClientStats;
    memory: MemoryStats;
    stats: Stats;
    cpu: CpuStats;
    keyspace: KeyspaceStats[];
}

export interface ServerStats {
    version: string;
    mode: string;
    os: string;
    archBits: number;
    uptimeInSeconds: number;
    uptimeInDays: number;
}

export interface ClientStats {
    connectedClients: number;
    blockedClients: number;
}

export interface MemoryStats {
    usedMemory: number;
    usedMemoryHuman: string;
    usedMemoryRss: number;
    usedMemoryPeak: number;
    usedMemoryPeakHuman: string;
    usedMemoryLua: number;
    maxmemory: number;
    maxmemoryPolicy: string;
}

export interface Stats {
    totalConnectionsReceived: number;
    totalCommandsProcessed: number;
    instantaneousOpsPerSec: number;
    instantaneousInputKbps: number;
    instantaneousOutputKbps: number;
    totalNetInputBytes: number;
    totalNetOutputBytes: number;
    keyspaceHits: number;
    keyspaceMisses: number;
}

export interface CpuStats {
    usedCpuSys: number;
    usedCpuUser: number;
    usedCpuSysChildren: number;
    usedCpuUserChildren: number;
}

export interface KeyspaceStats {
    database: string;
    keys: number;
    expires: number;
    avgTtl: number;
}
