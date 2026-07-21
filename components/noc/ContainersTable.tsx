import type { ContainerInfo } from '@/lib/noc-types';

const STATE_COLOR: Record<string, string> = {
  running: 'var(--color-status-up)',
  restarting: 'var(--color-status-degraded)',
  exited: 'var(--color-status-down)',
  paused: 'var(--color-status-degraded)',
};

export function ContainersTable({ containers }: { containers: ContainerInfo[] }) {
  return (
    <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] p-4">
      <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)] mb-3">Containers</p>
      <div className="space-y-2">
        {containers.map((c) => (
          <div key={c.id} className="flex items-center justify-between text-sm border-b border-[var(--color-line)] last:border-0 py-1.5">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-[var(--color-ink-soft)] font-[family-name:var(--font-mono)]">{c.image}</p>
            </div>
            <div className="text-right">
              <p className="font-[family-name:var(--font-mono)] text-xs" style={{ color: STATE_COLOR[c.state] ?? 'var(--color-ink-soft)' }}>
                {c.state}
              </p>
              <p className="text-xs text-[var(--color-ink-soft)]">{c.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}