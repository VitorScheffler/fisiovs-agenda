function statusFromPercent(value: number): 'up' | 'degraded' | 'down' {
  if (value >= 90) return 'down';
  if (value >= 70) return 'degraded';
  return 'up';
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const width = 100;
  const height = 28;
  const max = Math.max(...data, 100);
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / max) * height}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-7 mt-2" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="var(--color-pine-600)" strokeWidth="1.5" />
    </svg>
  );
}

export function ResourceGauge({
  label,
  value,
  detail,
  history,
}: {
  label: string;
  value: number;
  detail: string;
  history?: number[];
}) {
  const status = statusFromPercent(value);
  const color = `var(--color-status-${status})`;

  return (
    <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">{label}</p>
        <span className="font-[family-name:var(--font-mono)] text-xl" style={{ color }}>
          {value.toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--color-line)] mt-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-[var(--color-ink-soft)] mt-2">{detail}</p>
      {history && <Sparkline data={history} />}
    </div>
  );
}