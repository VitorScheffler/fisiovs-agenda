export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
        <circle cx="15" cy="15" r="15" fill="var(--color-pine-600)" />
        <path
          d="M9 20.5C9 20.5 10.5 13 15 13C19.5 13 21 20.5 21 20.5"
          stroke="var(--color-paper)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="15" cy="9.5" r="2.2" fill="var(--color-terracotta-400)" />
      </svg>
      <div className="leading-tight">
        <p className="font-display text-[17px] font-medium text-[var(--color-pine-700)]">
          FisioVS
        </p>
        <p className="text-[11px] text-[var(--color-ink-soft)] -mt-0.5">
          Clínica de Fisioterapia
        </p>
      </div>
    </div>
  );
}
