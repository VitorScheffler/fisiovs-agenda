"use client";

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

// Ícones para o menu mobile
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Agrupar agendamentos por dia para visualização mobile
function groupAppointmentsByDay() {
  const grouped: { day: string; date: string; dayIndex: number; appts: typeof appointments }[] = [];
  for (let i = 0; i < weekDays.length; i++) {
    const dayAppts = appointments
      .filter((a) => a.day === i)
      .sort((a, b) => hours.indexOf(a.time) - hours.indexOf(b.time));
    grouped.push({
      day: weekDays[i],
      date: weekDates[i],
      dayIndex: i,
      appts: dayAppts,
    });
  }
  return grouped;
}

export default function AgendaPage() {
  const todayIndex = 2; // Quarta-feira em destaque

  const mobileGrouped = groupAppointmentsByDay();

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] relative">
      {/* Checkbox escondido para o menu mobile */}
      <input type="checkbox" id="menu-toggle" className="peer hidden" />

      {/* Sidebar no desktop */}
      <div className="hidden lg:contents">
        <Sidebar active="agenda" userName="Vitoria Scheffler" userRole="Fisioterapeuta" />
      </div>

      {/* Overlay do menu mobile */}
      <div className="fixed inset-0 z-50 hidden peer-checked:block lg:hidden">
        <label htmlFor="menu-toggle" className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--color-card)] shadow-xl animate-slide-in-left">
          <label
            htmlFor="menu-toggle"
            className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[var(--color-card)] hover:bg-[var(--color-paper)] border border-[var(--color-line)] cursor-pointer"
            aria-label="Fechar menu"
          >
            <CloseIcon />
          </label>
          <div className="h-full">
            <Sidebar active="agenda" userName="Vitoria Scheffler" userRole="Fisioterapeuta" />
          </div>
        </div>
      </div>

      <main className="flex-1 min-w-0 px-4 py-5 sm:px-6 md:px-8 md:py-6">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-3 mb-6">
          {/* Grupo esquerdo: menu + título */}
          <div className="flex items-center gap-3 min-w-0">
            <label
              htmlFor="menu-toggle"
              className="lg:hidden inline-flex p-2 rounded-lg hover:bg-[var(--color-card)] border border-[var(--color-line)] cursor-pointer z-30 shrink-0"
              aria-label="Abrir menu"
            >
              <MenuIcon />
            </label>
            <div className="min-w-0">
              <h1 className="font-display text-[22px] sm:text-[24px] md:text-[26px] font-medium text-[var(--color-pine-700)]">
                Agenda
              </h1>
              <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-0.5">
                9 – 14 de junho, 2026
              </p>
            </div>
          </div>

          {/* Grupo direito: controles (desktop) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
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

          {/* Botão mobile (visível apenas em telas pequenas) */}
          <button className="lg:hidden rounded-[10px] bg-[var(--color-pine-600)] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[var(--color-pine-700)] transition-colors shrink-0">
            + Novo
          </button>
        </div>

        {/* Grade semanal (desktop) */}
        <div className="hidden lg:block rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] overflow-hidden">
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

        {/* Visualização mobile: lista por dia */}
        <div className="lg:hidden flex flex-col gap-6">
          {mobileGrouped.map((group) => (
            <div key={group.dayIndex} className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] overflow-hidden">
              {/* Cabeçalho do dia */}
              <div className={`px-4 py-3 border-b border-[var(--color-line)] ${group.dayIndex === todayIndex ? "bg-[var(--color-pine-50)]" : ""}`}>
                <p className="text-[14px] font-medium">
                  {group.day}{" "}
                  <span className="text-[12px] text-[var(--color-ink-soft)] font-normal">
                    {group.date}
                  </span>
                </p>
              </div>
              {/* Agendamentos do dia */}
              <div className="p-3 flex flex-col gap-2">
                {group.appts.length === 0 ? (
                  <p className="text-[13px] text-[var(--color-ink-soft)] py-4 text-center">
                    Nenhum agendamento
                  </p>
                ) : (
                  group.appts.map((appt, idx) => (
                    <div key={idx} className="flex items-start gap-3 py-2 border-b border-[var(--color-line)] last:border-0">
                      <span className="text-[12px] font-medium w-12 shrink-0 text-right text-[var(--color-ink-soft)]">
                        {appt.time}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate">{appt.patient}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${legendDot[appt.category]}`} />
                          <span className="text-[11px] text-[var(--color-ink-soft)]">
                            {categoryLabels[appt.category]}
                          </span>
                        </div>
                        {appt.status === "pendente" && (
                          <span className="inline-block mt-1 text-[10px] font-medium text-[var(--color-terracotta-600)]">
                            Pendente
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legenda (visível em todas as telas) */}
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