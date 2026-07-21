"use client";

import { useEffect, useRef, useState } from "react";
import type { MetricsResponse, HealthResponse } from "@/lib/noc-types";
import { Sidebar } from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";
import { StatusPulse } from "./StatusPulse";
import { ResourceGauge } from "./ResourceGauge";
import { ServiceHealthGrid } from "./ServiceHealthGrid";
import { ContainersTable } from "./ContainersTable";
import { ProcessesTable } from "./ProcessesTable";

const POLL_INTERVAL_MS = 7000;
const HISTORY_LENGTH = 30;

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function NocDashboard() {
  const { currentUser } = useApp();
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  const [memHistory, setMemHistory] = useState<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchAll() {
    try {
      const [metricsRes, healthRes] = await Promise.all([
        fetch("/api/noc/metrics", { cache: "no-store" }),
        fetch("/api/noc/health", { cache: "no-store" }),
      ]);

      if (!metricsRes.ok || !healthRes.ok) {
        setError("Falha ao consultar o painel. Verifique se o api-metricas está ativo.");
        return;
      }

      const metricsData: MetricsResponse = await metricsRes.json();
      const healthData: HealthResponse = await healthRes.json();

      if (!metricsData?.system?.cpu || !metricsData?.system?.memory) {
        setError("Dados de métricas incompletos recebidos da API.");
        return;
      }

      setMetrics(metricsData);
      setHealth(healthData);
      setError(null);

      setCpuHistory((prev) => [...prev, metricsData.system.cpu.usagePercent].slice(-HISTORY_LENGTH));
      setMemHistory((prev) => [...prev, metricsData.system.memory.usagePercent].slice(-HISTORY_LENGTH));
    } catch {
      setError("Não foi possível conectar à API de monitoramento.");
    }
  }

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function formatUptime(seconds: number) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  }

  const userName = currentUser?.name ?? "";
  const userRole = currentUser?.role === "secretaria" ? "Secretária" : "Fisioterapeuta";

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] relative">
      <input type="checkbox" id="menu-toggle" className="peer hidden" />
      <div className="hidden lg:contents">
        <Sidebar active="noc" userName={userName} userRole={userRole} userAvatar={currentUser?.avatar} />
      </div>

      <div className="fixed inset-0 z-50 hidden peer-checked:block lg:hidden">
        <label htmlFor="menu-toggle" className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--color-card)] shadow-xl animate-slide-in-left">
          <label htmlFor="menu-toggle" className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[var(--color-card)] hover:bg-[var(--color-paper)] border border-[var(--color-line)] cursor-pointer" aria-label="Fechar menu">
            <CloseIcon />
          </label>
          <div className="h-full">
            <Sidebar active="noc" userName={userName} userRole={userRole} userAvatar={currentUser?.avatar} />
          </div>
        </div>
      </div>

      <main className="flex-1 min-w-0 px-4 py-5 sm:px-6 md:px-8 md:py-6">
        <label htmlFor="menu-toggle" className="lg:hidden inline-flex mb-4 p-2 rounded-lg hover:bg-[var(--color-card)] border border-[var(--color-line)] cursor-pointer z-30 relative" aria-label="Abrir menu">
          <MenuIcon />
        </label>

        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-display text-[22px] sm:text-[24px] md:text-[26px] font-medium text-[var(--color-pine-700)] leading-tight">
              Painel NOC
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1 max-w-md">
              Monitoramento de infraestrutura do fisiovs-agenda.
            </p>
          </div>
          {health && <StatusPulse status={health.overall} checkedAt={health.checkedAt} />}
        </div>

        {error && (
          <div className="rounded-[14px] border border-[var(--color-status-down)] bg-[var(--color-status-down-bg)] px-4 py-3 text-[13px] text-[var(--color-status-down)] mb-5 sm:mb-6">
            {error}
          </div>
        )}

        {metrics && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ResourceGauge
                label="CPU"
                value={metrics.system.cpu.usagePercent}
                detail={`${metrics.system.cpu.cores} núcleos · load ${metrics.system.cpu.loadAvg}`}
                history={cpuHistory}
              />
              <ResourceGauge
                label="Memória"
                value={metrics.system.memory.usagePercent}
                detail={`${metrics.system.memory.usedGB} GB / ${metrics.system.memory.totalGB} GB`}
                history={memHistory}
              />
              <ResourceGauge
                label="Disco"
                value={metrics.system.disk[0]?.usagePercent ?? 0}
                detail={
                  metrics.system.disk[0]
                    ? `${metrics.system.disk[0].mount} · ${metrics.system.disk[0].usedGB}/${metrics.system.disk[0].sizeGB} GB`
                    : "sem dados"
                }
              />
              <div className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5">
                <p className="text-[11px] sm:text-[12px] uppercase tracking-wide text-[var(--color-ink-soft)]">Uptime</p>
                <p className="font-[family-name:var(--font-mono)] text-xl sm:text-2xl mt-1">
                  {formatUptime(metrics.system.uptimeSeconds)}
                </p>
                <p className="text-[11px] sm:text-xs text-[var(--color-ink-soft)] mt-2">
                  {metrics.system.network
                    .map((n) => `${n.iface}: ↓${(n.rxSec / 1024).toFixed(0)} KB/s ↑${(n.txSec / 1024).toFixed(0)} KB/s`)
                    .join(" · ")}
                </p>
              </div>
            </section>

            {health && <ServiceHealthGrid services={health.services} />}

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ContainersTable containers={metrics.containers.containers} />
              <ProcessesTable processes={metrics.system.processes} />
            </section>
          </div>
        )}

        {!metrics && !error && (
          <p className="text-[13px] text-[var(--color-ink-soft)]">Carregando métricas...</p>
        )}
      </main>
    </div>
  );
}