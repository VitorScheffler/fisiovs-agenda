export type ServiceStatus = 'up' | 'down' | 'degraded';

export interface SystemMetrics {
  timestamp: string;
  cpu: { usagePercent: number; cores: number; loadAvg: number; temperature: number | null };
  memory: { totalGB: number; usedGB: number; freeGB: number; usagePercent: number };
  disk: { mount: string; sizeGB: number; usedGB: number; usagePercent: number }[];
  network: { iface: string; rxSec: number; txSec: number }[];
  uptimeSeconds: number;
  processes: {
    total: number;
    running: number;
    blocked: number;
    top: { pid: number; name: string; cpu: number; mem: number }[];
  };
}

export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
  ports: { private: number; public: number | null }[];
}

export interface MetricsResponse {
  system: SystemMetrics;
  containers: { checkedAt: string; containers: ContainerInfo[] };
}

export interface HealthResponse {
  overall: ServiceStatus;
  services: { name: string; status: ServiceStatus; latencyMs: number | null; message?: string }[];
  checkedAt: string;
}