import { Sidebar } from "@/components/Sidebar";
import { AppointmentCard } from "@/components/AppointmentCard";
import { appointments, hours, weekDates, weekDays } from "@/lib/mock-data";
import { categoryLabels, AppointmentCategory } from "@/lib/types";

const legendOrder: AppointmentCategory[] = [
  "avaliacao",
  "retorno",
  "tratamento",
  "pilates",
  "bloqueado",
];

const legendDot: Record<AppointmentCategory, string> = {
  avaliacao: "bg-[var(--color-cat-avaliacao-fg)]",
  retorno: "bg-[var(--color-cat-retorno-fg)]",
  tratamento: "bg-[var(--color-cat-tratamento-fg)]",
  pilates: "bg-[var(--color-cat-pilates-fg)]",
  bloqueado: "bg-[var(--color-cat-bloqueado-fg)]",
};

export default function AgendaPage() {
  const todayIndex = 2; // Quarta-feira em destaque, como na referência

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)]">
      <Sidebar active="agenda" userName="Vi Schmitz" userRole="Fisioterapeuta" />

      <main className="flex-1 px-8 py-6 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-[26px] font-medium text-[var(--color-pine-700)]">
              Agenda
            </h1>
            <p className="text-[13px] text-[var(--color-ink-soft)] mt-0.5">
              9 – 14 de junho, 2026
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-[10px] border border-[var(--color-line)] bg-[var(--color-card)] px-1 py-1">
              <button className="px-3 py-1.5 text-[13px] rounded-[8px] hover:bg-[var(--color-paper)]" aria-label="Semana anterior">
                ‹
              </button>
              <span className="px-2 text-[13px] font-medium">Esta semana</span>
              <button className="px-3 py-1.5 text-[13px] rounded-[8px] hover:bg-[var(--color-paper)]" aria-label="Próxima semana">
                ›
              </button>
            </div>

            <button
              aria-label="Notificações"
              className="relative w-9 h-9 rounded-full border border-[var(--color-line)] bg-[var(--color-card)] flex items-center justify-center"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 8a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
                <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-terracotta-600)] text-white text-[10px] flex items-center justify-center">
                1
              </span>
            </button>

            <button className="rounded-[10px] bg-[var(--color-pine-600)] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[var(--color-pine-700)] transition-colors">
              + Novo agendamento
            </button>
          </div>
        </div>

        <div className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] overflow-hidden">
          <div
            className="grid"
            style={{ gridTemplateColumns: "64px repeat(6, minmax(0, 1fr))" }}
          >
            {/* Cabeçalho dos dias */}
            <div className="border-b border-[var(--color-line)]" />
            {weekDays.map((day, i) => (
              <div
                key={day}
                className={`border-b border-l border-[var(--color-line)] px-2 py-3 text-center ${
                  i === todayIndex ? "bg-[var(--color-pine-50)]" : ""
                }`}
              >
                <p
                  className={`text-[12px] font-medium ${
                    i === todayIndex ? "text-[var(--color-pine-700)]" : "text-[var(--color-ink-soft)]"
                  }`}
                >
                  {day}
                </p>
                <p
                  className={`text-[11px] mt-0.5 ${
                    i === todayIndex ? "text-[var(--color-pine-600)]" : "text-[var(--color-ink-soft)]"
                  }`}
                >
                  {weekDates[i]}
                </p>
              </div>
            ))}

            {/* Linhas de horário */}
            {hours.map((hour) => (
              <div key={hour} className="contents">
                <div className="border-b border-[var(--color-line)] px-2 py-3 text-right text-[11px] text-[var(--color-ink-soft)]">
                  {hour}
                </div>
                {weekDays.map((_, dayIndex) => {
                  const appt = appointments.find(
                    (a) => a.day === dayIndex && a.time === hour
                  );
                  const isOccupied = appointments.some(
                    (a) =>
                      a.day === dayIndex &&
                      hours.indexOf(a.time) < hours.indexOf(hour) &&
                      hours.indexOf(a.time) + a.durationSlots > hours.indexOf(hour)
                  );

                  return (
                    <div
                      key={dayIndex}
                      className={`border-b border-l border-[var(--color-line)] p-1.5 min-h-[60px] ${
                        dayIndex === todayIndex ? "bg-[var(--color-pine-50)]/40" : ""
                      }`}
                    >
                      {appt && !isOccupied ? (
                        <div
                          style={{
                            height: `calc(${appt.durationSlots * 100}% + ${
                              (appt.durationSlots - 1) * 12
                            }px)`,
                          }}
                        >
                          <AppointmentCard appointment={appt} />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5 mt-4 flex-wrap">
          {legendOrder.map((cat) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${legendDot[cat]}`} />
              <span className="text-[12px] text-[var(--color-ink-soft)]">
                {categoryLabels[cat]}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
