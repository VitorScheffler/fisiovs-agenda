import type { ServiceStatus } from '@/lib/noc-types';

const STATUS_LABEL: Record<ServiceStatus, string> = { up: 'Ativo', degraded: 'Degradado', down: 'Inativo' };

export function ServiceHealthGrid({
  services,
}: {
  services: { name: string; status: ServiceStatus; latencyMs: number | null; message?: string }[];
}) {
  return (
    <section className="rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)] mb-3">Status dos serviços</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {services.map((s) => {
          const color = `var(--color-status-${s.status})`;
          const bg = `var(--color-status-${s.status}-bg)`;
          return (
            <div key={s.name} className="rounded-md px-3 py-2 flex items-center justify-between" style={{ backgroundColor: bg }}>
              <div>
                <p className="text-sm font-medium" style={{ color }}>{s.name}</p>
                {s.message && <p className="text-xs opacity-70" style={{ color }}>{s.message}</p>}
              </div>
              <div className="text-right">
                <p className="text-xs font-[family-name:var(--font-mono)]" style={{ color }}>{STATUS_LABEL[s.status]}</p>
                {s.latencyMs !== null && (
                  <p className="text-xs opacity-60 font-[family-name:var(--font-mono)]" style={{ color }}>{s.latencyMs}ms</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}