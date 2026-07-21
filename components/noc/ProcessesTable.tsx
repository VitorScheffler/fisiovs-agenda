export function ProcessesTable({
  processes,
}: {
  processes: { total: number; running: number; blocked: number; top: { pid: number; name: string; cpu: number; mem: number }[] };
}) {
  return (
    <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink-soft)]">Processos</p>
        <p className="text-xs font-[family-name:var(--font-mono)] text-[var(--color-ink-soft)]">
          {processes.total} total · {processes.running} rodando · {processes.blocked} bloqueados
        </p>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-left text-[var(--color-ink-soft)]">
            <th className="font-normal pb-1">PID</th>
            <th className="font-normal pb-1">Processo</th>
            <th className="font-normal pb-1 text-right">CPU%</th>
            <th className="font-normal pb-1 text-right">MEM%</th>
          </tr>
        </thead>
        <tbody className="font-[family-name:var(--font-mono)]">
          {processes.top.map((p) => (
            <tr key={p.pid} className="border-t border-[var(--color-line)]">
              <td className="py-1">{p.pid}</td>
              <td className="py-1 truncate max-w-[140px]">{p.name}</td>
              <td className="py-1 text-right">{p.cpu.toFixed(1)}</td>
              <td className="py-1 text-right">{p.mem.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}