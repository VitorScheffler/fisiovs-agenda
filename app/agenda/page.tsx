"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { AppointmentCard } from "@/components/AppointmentCard";
import { AppointmentModal } from "@/components/AppointmentModal";
import { useApp } from "@/context/AppContext";
import {
  getPageDates,
  getPageLabel,
  isSameDate,
  getToday,
  toISODate,
  WEEKDAY_SHORT_PT,
} from "@/lib/date-utils";
import { generateAgendaHours, DEFAULT_AGENDA_CONFIG } from "@/lib/schedule-utils";
import { categoryLabels, AppointmentCategory, Appointment } from "@/lib/types";

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

// Um dia da página atual da agenda, já com os rótulos prontos para exibição.
type PageDay = { iso: string; label: string; ddmm: string; isToday: boolean };

function buildPageDays(dates: Date[]): PageDay[] {
  const today = getToday();
  return dates.map((d) => ({
    iso: toISODate(d),
    label: WEEKDAY_SHORT_PT[d.getDay()],
    ddmm: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
    isToday: isSameDate(d, today),
  }));
}

function groupAppointmentsByDay(appointments: Appointment[], days: PageDay[], hoursList: string[]) {
  return days.map((day, dayIndex) => {
    const dayAppts = appointments
      .filter((a) => a.date === day.iso)
      .sort((a, b) => hoursList.indexOf(a.time) - hoursList.indexOf(b.time));
    return { day: day.label, ddmm: day.ddmm, isToday: day.isToday, dayIndex, appts: dayAppts };
  });
}

export default function AgendaPage() {
  const { currentUser, appointments, appointmentsLoading, openNewSlot, agendaConfig } = useApp();

  const [pageOffset, setPageOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

  const effectiveConfig = agendaConfig ?? DEFAULT_AGENDA_CONFIG;
  const hoursList = generateAgendaHours(effectiveConfig);
  const pageDates = getPageDates(pageOffset, effectiveConfig.diasAtendimento);
  const days = buildPageDays(pageDates);
  const pageLabel = getPageLabel(pageDates);

  // Só existe "hoje" dentro da grade quando a página atual contém a data de hoje
  // (isso só pode acontecer na página 0, já que as demais são inteiramente passadas ou futuras).
  const todayIndex = pageOffset === 0 ? days.findIndex((d) => d.isToday) : -1;

  const mobileGrouped = groupAppointmentsByDay(appointments, days, hoursList);

  const userName = currentUser?.name ?? "";
  const userRole =
    currentUser?.role === "secretaria" ? "Secretária" : "Fisioterapeuta";

  function handleSlotClick(dayIndex: number, time: string) {
    const date = days[dayIndex]?.iso;
    if (!date) return;
    setSelectedSlot((prev) =>
      prev && prev.date === date && prev.time === time ? null : { date, time }
    );
  }

  function handleOpenNewAppointment() {
    if (selectedSlot) {
      openNewSlot(selectedSlot.date, selectedSlot.time);
      setSelectedSlot(null);
      return;
    }
    // O primeiro dia da página atual é sempre o próximo dia útil disponível
    // (hoje, na página 0), então serve como padrão razoável para um novo horário.
    openNewSlot(days[0]?.iso ?? toISODate(getToday()), hoursList[0] ?? "08:00");
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] relative">
      <input type="checkbox" id="menu-toggle" className="peer hidden" />

      <div className="hidden lg:contents">
        <Sidebar active="agenda" userName={userName} userRole={userRole} />
      </div>

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
            <Sidebar active="agenda" userName={userName} userRole={userRole} />
          </div>
        </div>
      </div>

      <main className="flex-1 min-w-0 px-4 py-5 sm:px-6 md:px-8 md:py-6">
        <div className="flex items-start justify-between gap-3 mb-6">
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
                {pageLabel}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1 rounded-[10px] border border-[var(--color-line)] bg-[var(--color-card)] px-1 py-1">
              <button onClick={() => setPageOffset((w) => w - 1)} className="px-3 py-1.5 text-[13px] rounded-[8px] hover:bg-[var(--color-paper)]" aria-label="Período anterior">
                ‹
              </button>
              <button onClick={() => setPageOffset(0)} className="px-2 text-[13px] font-medium hover:text-[var(--color-pine-700)]">
                {pageOffset === 0 ? "Hoje" : "Voltar para hoje"}
              </button>
              <button onClick={() => setPageOffset((w) => w + 1)} className="px-3 py-1.5 text-[13px] rounded-[8px] hover:bg-[var(--color-paper)]" aria-label="Próximo período">
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

            <button onClick={handleOpenNewAppointment} className="rounded-[10px] bg-[var(--color-pine-600)] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[var(--color-pine-700)] transition-colors">
              {selectedSlot ? "+ Agendar horário selecionado" : "+ Novo agendamento"}
            </button>
          </div>

          <button onClick={handleOpenNewAppointment} className="lg:hidden rounded-[10px] bg-[var(--color-pine-600)] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[var(--color-pine-700)] transition-colors shrink-0">
            + Novo
          </button>
        </div>

        {appointmentsLoading && (
          <p className="text-[13px] text-[var(--color-ink-soft)] mb-4">Carregando agenda…</p>
        )}

        {selectedSlot && (
          <div className="hidden lg:flex items-center justify-between gap-3 mb-4 rounded-[10px] bg-[var(--color-pine-50)] border border-[var(--color-pine-200)] px-4 py-2.5">
            <p className="text-[13px] text-[var(--color-pine-700)] font-medium">
              Horário selecionado: {selectedSlot.time} — clique em &quot;Agendar horário selecionado&quot; para continuar.
            </p>
            <button onClick={() => setSelectedSlot(null)} className="text-[12px] text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
              Cancelar seleção
            </button>
          </div>
        )}

        <div className="hidden lg:block rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] overflow-hidden">
          <div className="grid" style={{ gridTemplateColumns: `64px repeat(${days.length}, minmax(0, 1fr))` }}>
            <div className="border-b border-[var(--color-line)]" />
            {days.map((day, i) => (
              <div key={day.iso} className={`border-b border-l border-[var(--color-line)] px-2 py-3 text-center ${i === todayIndex ? "bg-[var(--color-pine-50)]" : ""}`}>
                <p className={`text-[12px] font-medium ${i === todayIndex ? "text-[var(--color-pine-700)]" : "text-[var(--color-ink-soft)]"}`}>
                  {day.label}
                </p>
                <p className={`text-[11px] mt-0.5 ${i === todayIndex ? "text-[var(--color-pine-600)]" : "text-[var(--color-ink-soft)]"}`}>
                  {day.ddmm}
                </p>
              </div>
            ))}

            {hoursList.map((hour) => (
              <div key={hour} className="contents">
                <div className="border-b border-[var(--color-line)] px-2 py-3 text-right text-[11px] text-[var(--color-ink-soft)]">
                  {hour}
                </div>
                {days.map((day, dayIndex) => {
                  const iso = day.iso;
                  const appt = appointments.find((a) => a.date === iso && a.time === hour);
                  const isOccupied = appointments.some(
                    (a) =>
                      a.date === iso &&
                      hoursList.indexOf(a.time) < hoursList.indexOf(hour) &&
                      hoursList.indexOf(a.time) + a.durationSlots > hoursList.indexOf(hour)
                  );
                  const isSelected = selectedSlot?.date === iso && selectedSlot?.time === hour;

                  return (
                    <div
                      key={dayIndex}
                      onClick={() => { if (!appt && !isOccupied) handleSlotClick(dayIndex, hour); }}
                      className={`border-b border-l border-[var(--color-line)] p-1.5 min-h-[60px] ${
                        dayIndex === todayIndex ? "bg-[var(--color-pine-50)]/40" : ""
                      } ${
                        !appt && !isOccupied ? "cursor-pointer hover:bg-[var(--color-pine-50)]/60 transition-colors" : ""
                      } ${
                        isSelected ? "ring-2 ring-inset ring-[var(--color-pine-600)] bg-[var(--color-pine-50)]" : ""
                      }`}
                    >
                      {appt && !isOccupied ? (
                        <div style={{ height: `calc(${appt.durationSlots * 100}% + ${(appt.durationSlots - 1) * 12}px)` }}>
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

        <div className="lg:hidden flex flex-col gap-6">
          {mobileGrouped.map((group) => (
            <div key={group.dayIndex} className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] overflow-hidden">
              <div className={`px-4 py-3 border-b border-[var(--color-line)] ${group.isToday ? "bg-[var(--color-pine-50)]" : ""}`}>
                <p className="text-[14px] font-medium">
                  {group.day}{" "}
                  <span className="text-[12px] text-[var(--color-ink-soft)] font-normal">
                    {group.ddmm}
                  </span>
                </p>
              </div>
              <div className="p-3 flex flex-col gap-2">
                {group.appts.length === 0 ? (
                  <p className="text-[13px] text-[var(--color-ink-soft)] py-4 text-center">Nenhum agendamento</p>
                ) : (
                  group.appts.map((appt) => (
                    <div key={appt.id} className="flex items-start gap-3 py-2 border-b border-[var(--color-line)] last:border-0">
                      <span className="text-[12px] font-medium w-12 shrink-0 text-right text-[var(--color-ink-soft)]">
                        {appt.time}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium truncate">{appt.patient}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${legendDot[appt.category]}`} />
                          <span className="text-[11px] text-[var(--color-ink-soft)]">{categoryLabels[appt.category]}</span>
                        </div>
                        {appt.status === "pendente" && (
                          <span className="inline-block mt-1 text-[10px] font-medium text-[var(--color-terracotta-600)]">Pendente</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-5 mt-4 flex-wrap">
          {legendOrder.map((cat) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${legendDot[cat]}`} />
              <span className="text-[12px] text-[var(--color-ink-soft)]">{categoryLabels[cat]}</span>
            </div>
          ))}
        </div>
      </main>

      <AppointmentModal />
    </div>
  );
}