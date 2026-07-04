"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";
import { categoryLabels } from "@/lib/types";
import { formatWeekdayShort, formatDDMMFromISO } from "@/lib/date-utils";

export default function SolicitacoesPage() {
  const { currentUser, appointments, approveAppointment, rejectAppointment } = useApp();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const userName = currentUser?.name ?? "";
  const userRole =
    currentUser?.role === "secretaria" ? "Secretária" : "Fisioterapeuta";

  const pending = appointments.filter((a) => a.status === "pendente");

  async function handleApprove(id: string) {
    setBusyId(id);
    setErrorId(null);
    try {
      await approveAppointment(id);
    } catch {
      setErrorId(id);
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id: string) {
    setBusyId(id);
    setErrorId(null);
    try {
      await rejectAppointment(id);
    } catch {
      setErrorId(id);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] relative">
      <input type="checkbox" id="menu-toggle" className="peer hidden" />

      <div className="hidden lg:contents">
        <Sidebar active="solicitacoes" userName={userName} userRole={userRole} pendingCount={pending.length} />
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
            <Sidebar active="solicitacoes" userName={userName} userRole={userRole} pendingCount={pending.length} />
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

        <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-[22px] sm:text-[24px] md:text-[26px] font-medium text-[var(--color-pine-700)]">
              Solicitações
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1">
              Gerencie solicitações enviadas pelos pacientes.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-terracotta-100)] px-3 py-1 text-[13px] font-medium text-[var(--color-terracotta-600)]">
            {pending.length} pendente{pending.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="space-y-4">
          {pending.length === 0 && (
            <p className="text-[13px] text-[var(--color-ink-soft)] text-center py-12">
              Nenhuma solicitação pendente.
            </p>
          )}

          {pending.map((req) => (
            <div key={req.id} className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
                <div>
                  <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                    {categoryLabels[req.category]}
                  </span>

                  <h3 className="mt-3 text-[15px] sm:text-[16px] font-medium">
                    {req.patient}
                  </h3>

                  <p className="mt-1 text-[12px] sm:text-[13px] text-[var(--color-ink-soft)]">
                    Solicitou um horário.
                  </p>

                  <p className="mt-4 text-[13px]">
                    <span className="text-[var(--color-ink-soft)]">Horário:</span>{" "}
                    {formatWeekdayShort(req.date)} ({formatDDMMFromISO(req.date)}) • {req.time}
                  </p>

                  {req.note && (
                    <p className="mt-1 text-[12px] text-[var(--color-ink-soft)]">{req.note}</p>
                  )}

                  {errorId === req.id && (
                    <p className="mt-2 text-[12px] text-[var(--color-terracotta-600)]">
                      Erro ao processar solicitação. Tente novamente.
                    </p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleReject(req.id)}
                    disabled={busyId === req.id}
                    className="rounded-[10px] border border-[var(--color-line)] px-4 py-2 text-[13px] hover:bg-[var(--color-paper)] transition-colors disabled:opacity-60"
                  >
                    Recusar
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    disabled={busyId === req.id}
                    className="rounded-[10px] bg-[var(--color-pine-600)] px-4 py-2 text-[13px] font-medium text-white hover:bg-[var(--color-pine-700)] transition-colors disabled:opacity-60"
                  >
                    {busyId === req.id ? "Aguarde…" : "Aceitar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
