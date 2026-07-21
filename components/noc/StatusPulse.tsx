import type { ServiceStatus } from '@/lib/noc-types';

const STATUS_LABEL: Record<ServiceStatus, string> = {
  up: 'Tudo operacional',
  degraded: 'Degradação parcial',
  down: 'Falha crítica',
};

export function StatusPulse({ status, checkedAt }: { status: ServiceStatus; checkedAt: string }) {
  const color = `var(--color-status-${status})`;
  const bg = `var(--color-status-${status}-bg)`;

  return (
    <div
      className="flex items-center gap-3 rounded-full px-4 py-2"
      style={{ backgroundColor: bg, color }}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
          style={{ backgroundColor: color }}
        />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: color }} />
      </span>
      <span className="text-sm font-medium">{STATUS_LABEL[status]}</span>
      <span className="text-xs opacity-70 font-[family-name:var(--font-mono)]">
        {new Date(checkedAt).toLocaleTimeString('pt-BR')}
      </span>
    </div>
  );
}