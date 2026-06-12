"use client";

import { useApp } from "../context/AppContext";
import { categoryLabels } from "@/lib/types";
import { weekDays, weekDates } from "@/lib/mock-data";

const categoryStyles: Record<string, string> = {
  avaliacao: "bg-[var(--color-cat-avaliacao-bg)] text-[var(--color-cat-avaliacao-fg)]",
  retorno: "bg-[var(--color-cat-retorno-bg)] text-[var(--color-cat-retorno-fg)]",
  tratamento: "bg-[var(--color-cat-tratamento-bg)] text-[var(--color-cat-tratamento-fg)]",
  pilates: "bg-[var(--color-cat-pilates-bg)] text-[var(--color-cat-pilates-fg)]",
  bloqueado: "bg-[var(--color-cat-bloqueado-bg)] text-[var(--color-cat-bloqueado-fg)]",
};

export function AppointmentModal() {
  const { modal, closeModal, approveAppointment, rejectAppointment } = useApp();

  if (!modal) return null;

  if (modal.type === "new") {
    const dayLabel = weekDays[modal.day];
    const dateLabel = weekDates[modal.day];
    return (
      <Backdrop onClose={closeModal}>
        <div className="bg-[var(--color-card)] rounded-[16px] p-6 w-full max-w-sm shadow-xl">
          <h2 className="font-display text-[18px] font-medium text-[var(--color-pine-700)] mb-1">
            Novo agendamento
          </h2>
          <p className="text-[13px] text-[var(--color-ink-soft)] mb-4">
            {dayLabel}, {dateLabel} · {modal.time}
          </p>
          <p className="text-[13px] text-[var(--color-ink-soft)]">
            Funcionalidade em desenvolvimento.
          </p>
          <button
            onClick={closeModal}
            className="mt-5 w-full rounded-[10px] border border-[var(--color-line)] py-2.5 text-[13px] font-medium hover:bg-[var(--color-paper)] transition-colors"
          >
            Fechar
          </button>
        </div>
      </Backdrop>
    );
  }

  const { appointment: appt } = modal;
  const isPending = appt.status === "pendente";
  const dayLabel = weekDays[appt.day];
  const dateLabel = weekDates[appt.day];

  return (
    <Backdrop onClose={closeModal}>
      <div className="bg-[var(--color-card)] rounded-[16px] w-full max-w-sm shadow-xl overflow-hidden">
        {/* Header colorido pela categoria */}
        <div className={`px-6 py-5 ${categoryStyles[appt.category]}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide opacity-70 mb-1">
                {categoryLabels[appt.category]}
              </p>
              <h2 className="font-display text-[20px] font-medium leading-tight">
                {appt.patient}
              </h2>
            </div>
            <button
              onClick={closeModal}
              className="mt-0.5 opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
              aria-label="Fechar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Infos */}
          <div className="flex flex-col gap-2.5">
            <InfoRow icon="calendar" label="Data">
              {dayLabel}, {dateLabel}
            </InfoRow>
            <InfoRow icon="clock" label="Horário">
              {appt.time}
              {appt.durationSlots > 1 && (
                <span className="text-[var(--color-ink-soft)]"> · {appt.durationSlots}h</span>
              )}
            </InfoRow>
            {appt.note && (
              <InfoRow icon="note" label="Observação">
                {appt.note}
              </InfoRow>
            )}
          </div>

          {/* Status badge */}
          {isPending ? (
            <div className="rounded-[10px] bg-[var(--color-terracotta-100)] border border-[var(--color-terracotta-400)] px-4 py-3">
              <p className="text-[12px] font-medium text-[var(--color-terracotta-600)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta-600)]" />
                Aguardando aprovação
              </p>
              <p className="text-[12px] text-[var(--color-ink-soft)] mt-1">
                Solicitado pela secretária. Confirme ou recuse.
              </p>
            </div>
          ) : (
            <div className="rounded-[10px] bg-[var(--color-pine-50)] border border-[var(--color-pine-200)] px-4 py-3">
              <p className="text-[12px] font-medium text-[var(--color-pine-700)] flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Confirmado
              </p>
            </div>
          )}

          {/* Ações */}
          {isPending ? (
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => rejectAppointment(appt.id)}
                className="flex-1 rounded-[10px] border border-[var(--color-line)] py-2.5 text-[13px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-paper)] transition-colors"
              >
                Recusar
              </button>
              <button
                onClick={() => approveAppointment(appt.id)}
                className="flex-1 rounded-[10px] bg-[var(--color-pine-600)] text-white py-2.5 text-[13px] font-medium hover:bg-[var(--color-pine-700)] transition-colors"
              >
                Aprovar
              </button>
            </div>
          ) : (
            <div className="flex gap-2 mt-1">
              <button
                onClick={closeModal}
                className="flex-1 rounded-[10px] border border-[var(--color-line)] py-2.5 text-[13px] font-medium hover:bg-[var(--color-paper)] transition-colors"
              >
                Fechar
              </button>
              <button
                className="flex-1 rounded-[10px] border border-[var(--color-line)] py-2.5 text-[13px] font-medium text-[var(--color-ink-soft)] hover:bg-[var(--color-paper)] transition-colors"
              >
                Editar
              </button>
            </div>
          )}
        </div>
      </div>
    </Backdrop>
  );
}

function Backdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,127,131,0.12)", backdropFilter: "blur(2px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: "calendar" | "clock" | "note";
  label: string;
  children: React.ReactNode;
}) {
  const icons = {
    calendar: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" />
      </svg>
    ),
    clock: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
    note: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10z" />
        <path d="M14 3v7h7M8 13h8M8 17h5" />
      </svg>
    ),
  };

  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-[var(--color-pine-600)] flex-shrink-0">{icons[icon]}</span>
      <div>
        <span className="text-[11px] text-[var(--color-ink-soft)] block">{label}</span>
        <span className="text-[13px] font-medium">{children}</span>
      </div>
    </div>
  );
}