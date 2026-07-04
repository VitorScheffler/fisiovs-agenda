"use client";

import { Sidebar } from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";
import { categoryLabels } from "@/lib/types";
import { getToday, toISODate } from "@/lib/date-utils";

export default function HomePage() {
  const { currentUser, appointments, patients } = useApp();

  const userName = currentUser?.name ?? "";
  const userRole =
    currentUser?.role === "secretaria" ? "Secretária" : "Fisioterapeuta";
  const firstName = userName.split(" ")[0] ?? "";

  // Destaca o dia de hoje (Seg=0 ... Sáb=5). Domingo não tem atendimentos
  // marcados na grade Seg-Sáb, então a lista fica vazia.
  const todayISO = toISODate(getToday());

  const todayAppointments = appointments
    .filter((a) => a.date === todayISO && a.status !== "pendente")
    .sort((a, b) => a.time.localeCompare(b.time));

  const pendingRequests = appointments.filter((a) => a.status === "pendente");

  const activePatients = patients.filter((p) => p.status === "ativo");

  const nextAppointment = appointments
    .filter((a) => a.status !== "pendente" && a.date >= todayISO)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))[0];

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] relative">
      <input type="checkbox" id="menu-toggle" className="peer hidden" />

      <div className="hidden lg:contents">
        <Sidebar active="home" userName={userName} userRole={userRole} pendingCount={pendingRequests.length} />
      </div>

      <div className="fixed inset-0 z-50 hidden peer-checked:block lg:hidden">
        <label htmlFor="menu-toggle" className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--color-card)] shadow-xl animate-slide-in-left">
          <label
            htmlFor="menu-toggle"
            className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[var(--color-card)] hover:bg-[var(--color-paper)] border border-[var(--color-line)] cursor-pointer"
            aria-label="Fechar menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </label>
          <div className="h-full">
            <Sidebar active="home" userName={userName} userRole={userRole} pendingCount={pendingRequests.length} />
          </div>
        </div>
      </div>

      <main className="flex-1 min-w-0 px-4 py-5 sm:px-6 md:px-8 md:py-6">
        <label
          htmlFor="menu-toggle"
          className="lg:hidden inline-flex mb-4 p-2 rounded-lg hover:bg-[var(--color-card)] border border-[var(--color-line)] cursor-pointer z-30 relative"
          aria-label="Abrir menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </label>

        <div className="mb-6 sm:mb-8">
          <h1 className="font-display text-[22px] sm:text-[24px] md:text-[26px] font-medium text-[var(--color-pine-700)]">
            Bom dia, {firstName} 👋
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[var(--color-ink-soft)] mt-1">
            Você tem {todayAppointments.length} atendimento{todayAppointments.length === 1 ? "" : "s"} agendado{todayAppointments.length === 1 ? "" : "s"} para hoje.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-[13px] text-[var(--color-ink-soft)] mb-2">Atendimentos marcados hoje</p>
            <p className="text-[26px] sm:text-[30px] font-semibold text-[var(--color-ink)]">{todayAppointments.length}</p>
          </div>

          <div className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-[13px] text-[var(--color-ink-soft)] mb-2">Pacientes ativos</p>
            <p className="text-[26px] sm:text-[30px] font-semibold text-[var(--color-ink)]">{activePatients.length}</p>
          </div>

          <div className="rounded-[14px] border border-[var(--color-terracotta-100)] bg-[var(--color-card)] p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--color-terracotta-50)] rounded-bl-[80px] opacity-40" />
            <p className="text-[13px] text-[var(--color-ink-soft)] mb-2">Solicitações pendentes</p>
            <p className="text-[26px] sm:text-[30px] font-semibold text-[var(--color-terracotta-600)]">{pendingRequests.length}</p>
          </div>

          <div className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <p className="text-[13px] text-[var(--color-ink-soft)] mb-2">Próximo atendimento</p>
            <p className="text-[26px] sm:text-[30px] font-semibold text-[var(--color-pine-600)]">
              {nextAppointment ? nextAppointment.time : "—"}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
          <div className="flex-1 min-w-0 rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[16px] sm:text-[18px] font-medium text-[var(--color-ink)]">
                Agenda de hoje
              </h2>
              <a href="/agenda" className="text-[13px] font-medium text-[var(--color-pine-600)] hover:text-[var(--color-pine-700)] transition-colors">
                Ver agenda completa
              </a>
            </div>

            <div className="space-y-5">
              {todayAppointments.length === 0 && (
                <p className="text-[13px] text-[var(--color-ink-soft)]">Nenhum atendimento para hoje.</p>
              )}
              {todayAppointments.map((appt) => (
                <div key={appt.id} className="flex items-start gap-4">
                  <div className="text-[14px] font-medium text-[var(--color-ink-soft)] w-14 shrink-0 pt-0.5">
                    {appt.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-medium text-[var(--color-ink)]">{appt.patient}</p>
                    <p className="text-[13px] text-[var(--color-ink-soft)] mt-0.5">{categoryLabels[appt.category]}</p>
                  </div>
                  <div className="hidden sm:block w-2 h-2 rounded-full bg-[var(--color-pine-200)] mt-2 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-4 sm:gap-5">
            <div className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <h2 className="text-[15px] sm:text-[16px] font-medium text-[var(--color-ink)] mb-4">
                Ações rápidas
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <a href="/agenda" className="rounded-[12px] bg-[var(--color-pine-50)] border border-[var(--color-pine-100)] p-4 text-left hover:bg-[var(--color-pine-100)] transition-colors group">
                  <svg className="w-6 h-6 text-[var(--color-pine-600)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[13px] font-medium text-[var(--color-pine-700)] block leading-tight">Novo agendamento</span>
                </a>
                <a href="/pacientes" className="rounded-[12px] bg-[var(--color-pine-50)] border border-[var(--color-pine-100)] p-4 text-left hover:bg-[var(--color-pine-100)] transition-colors group">
                  <svg className="w-6 h-6 text-[var(--color-pine-600)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span className="text-[13px] font-medium text-[var(--color-pine-700)] block leading-tight">Cadastrar paciente</span>
                </a>
                <a href="/agenda" className="rounded-[12px] bg-[var(--color-pine-50)] border border-[var(--color-pine-100)] p-4 text-left hover:bg-[var(--color-pine-100)] transition-colors group">
                  <svg className="w-6 h-6 text-[var(--color-pine-600)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[13px] font-medium text-[var(--color-pine-700)] block leading-tight">Ver agenda</span>
                </a>
                <a href="/solicitacoes" className="rounded-[12px] bg-[var(--color-pine-50)] border border-[var(--color-pine-100)] p-4 text-left hover:bg-[var(--color-pine-100)] transition-colors group">
                  <svg className="w-6 h-6 text-[var(--color-pine-600)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="text-[13px] font-medium text-[var(--color-pine-700)] block leading-tight">Solicitações</span>
                </a>
              </div>
            </div>

            <div className="rounded-[14px] border border-[var(--color-terracotta-100)] bg-[var(--color-card)] p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[15px] sm:text-[16px] font-medium text-[var(--color-ink)]">
                  Solicitações pendentes
                </h2>
                <span className="inline-flex rounded-full bg-[var(--color-terracotta-100)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-terracotta-600)]">
                  {pendingRequests.length}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                {pendingRequests.length === 0 && (
                  <p className="text-[13px] text-[var(--color-ink-soft)]">Nenhuma solicitação pendente.</p>
                )}
                {pendingRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between py-1">
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-[var(--color-ink)] truncate">{req.patient}</p>
                      <p className="text-[12px] text-[var(--color-ink-soft)] mt-0.5">{categoryLabels[req.category]}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href="/solicitacoes" className="block text-center w-full rounded-[10px] border border-[var(--color-line)] px-4 py-2 text-[13px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-paper)] transition-colors">
                Ver todas
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
