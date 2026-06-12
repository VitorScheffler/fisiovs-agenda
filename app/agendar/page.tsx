import { Logo } from "@/components/Logo";
import { availableSlots, calendarDays } from "@/lib/mock-data";

export default function AgendarPage() {
  const selectedDate = 10; // Quarta-feira, 10 de junho

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex justify-center px-4 py-6">
      <div className="w-full max-w-[420px]">
        <Logo className="[&_p]:text-white [&_p:last-child]:text-[var(--color-pine-700)]" />
        <div className="flex items-center gap-3 mb-6">
          <button
            aria-label="Voltar"
            className="w-9 h-9 rounded-full border border-[var(--color-line)] bg-[var(--color-card)] flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div>
            <p className="font-display text-[18px] font-medium text-[var(--color-pine-700)]">
              Agendar horário
            </p>
            <p className="text-[12px] text-[var(--color-ink-soft)]">Vitoria Raiane Scheffler</p>
          </div>
        </div>

        <div className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 mb-5">
          <div className="flex items-center justify-between mb-4">
            <button aria-label="Mês anterior" className="text-[15px] text-[var(--color-ink-soft)]">‹</button>
            <p className="text-[13px] font-medium">Junho 2026</p>
            <button aria-label="Próximo mês" className="text-[15px] text-[var(--color-ink-soft)]">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((d) => (
              <div key={d.date} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-[var(--color-ink-soft)]">{d.label}</span>
                <button
                  className={`w-8 h-8 rounded-full text-[13px] flex items-center justify-center ${
                    d.date === selectedDate
                      ? "bg-[var(--color-pine-600)] text-white font-medium"
                      : "text-[var(--color-ink)] hover:bg-[var(--color-paper)]"
                  }`}
                >
                  {d.date}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-pine-600)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M3 9h18M8 2v4M16 2v4" />
          </svg>
          <p className="text-[13px] font-medium">Quarta-feira, 10 de junho</p>
        </div>

        <div className="flex flex-col gap-2">
          {availableSlots.map((slot) => (
            <div
              key={slot.time}
              className={`flex items-center justify-between rounded-[12px] border px-4 py-3 ${
                slot.available
                  ? "border-[var(--color-pine-200)] bg-[var(--color-pine-50)]"
                  : "border-[var(--color-line)] bg-[var(--color-paper)] opacity-60"
              }`}
            >
              <div>
                <p className="text-[14px] font-medium">{slot.time}</p>
                <p className="text-[12px] text-[var(--color-ink-soft)]">
                  {slot.available ? "Disponível" : "Indisponível"}
                </p>
              </div>
              <button
                disabled={!slot.available}
                className={`text-[13px] font-medium rounded-[8px] px-4 py-2 transition-colors ${
                  slot.available
                    ? "bg-[var(--color-pine-600)] text-white hover:bg-[var(--color-pine-700)]"
                    : "bg-[var(--color-line)] text-[var(--color-ink-soft)] cursor-not-allowed"
                }`}
              >
                Agendar
              </button>
            </div>
          ))}
        </div>

        {/* Navegação inferior, estilo app */}
        <div className="mt-8 rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] flex items-center justify-around py-3">
          <NavIcon label="Início">
            <path d="M3 11l9-8 9 8M5 10v10h14V10" />
          </NavIcon>
          <NavIcon label="Agendamentos" active>
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M3 9h18M8 2v4M16 2v4" />
          </NavIcon>
          <NavIcon label="Perfil">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" />
          </NavIcon>
        </div>
      </div>
    </div>
  );
}

function NavIcon({
  children,
  label,
  active = false,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-1 text-[11px] ${
        active ? "text-[var(--color-pine-600)] font-medium" : "text-[var(--color-ink-soft)]"
      }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {children}
      </svg>
      {label}
    </div>
  );
}
