"use client";

import { useState } from "react";
import { useApp } from "../context/AppContext";
import { categoryLabels, AppointmentCategory } from "@/lib/types";
import { weekDays, weekDates, hours } from "@/lib/mock-data";
import { Modal, ModalBox, ModalHeader, ModalBody, ModalFooter, FieldGroup, TextInput, SelectInput, BtnPrimary, BtnSecondary } from "./Modal";

const categoryStyles: Record<string, string> = {
  avaliacao: "bg-[var(--color-cat-avaliacao-bg)] text-[var(--color-cat-avaliacao-fg)]",
  retorno: "bg-[var(--color-cat-retorno-bg)] text-[var(--color-cat-retorno-fg)]",
  tratamento: "bg-[var(--color-cat-tratamento-bg)] text-[var(--color-cat-tratamento-fg)]",
  pilates: "bg-[var(--color-cat-pilates-bg)] text-[var(--color-cat-pilates-fg)]",
  bloqueado: "bg-[var(--color-cat-bloqueado-bg)] text-[var(--color-cat-bloqueado-fg)]",
};

export function AppointmentModal() {
  const { modal, closeModal, approveAppointment, rejectAppointment, addAppointment, patients } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // New appointment form state
  const [formPatient, setFormPatient] = useState("");
  const [formCategory, setFormCategory] = useState<AppointmentCategory>("avaliacao");
  const [formDay, setFormDay] = useState<number>(0);
  const [formTime, setFormTime] = useState("08:00");
  const [formDuration, setFormDuration] = useState("1");
  const [formNote, setFormNote] = useState("");

  if (!modal) return null;

  if (modal.type === "new") {
    const initialDay = modal.day;
    const initialTime = modal.time;

    async function handleCreate() {
      if (!formPatient.trim()) { setError("Informe o nome do paciente."); return; }
      setSubmitting(true);
      setError("");
      try {
        await addAppointment({
          day: formDay !== undefined ? formDay : initialDay,
          time: formTime || initialTime,
          durationSlots: parseInt(formDuration) || 1,
          patient: formPatient.trim(),
          category: formCategory,
          note: formNote.trim() || null,
          status: "confirmado",
        });
        setFormPatient(""); setFormNote(""); setFormDuration("1");
        closeModal();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao criar agendamento.");
      } finally {
        setSubmitting(false);
      }
    }

    return (
      <Modal open onClose={closeModal}>
        <ModalBox className="max-w-md">
          <ModalHeader
            title="Novo agendamento"
            subtitle={`${weekDays[initialDay]}, ${weekDates[initialDay]} · ${initialTime}`}
            onClose={closeModal}
          />
          <ModalBody>
            <FieldGroup label="Paciente">
              {patients.length > 0 ? (
                <SelectInput value={formPatient} onChange={(v) => { setFormPatient(v); setError(""); }}>
                  <option value="">Selecione um paciente…</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </SelectInput>
              ) : (
                <TextInput value={formPatient} onChange={(v) => { setFormPatient(v); setError(""); }} placeholder="Nome do paciente" />
              )}
            </FieldGroup>

            <FieldGroup label="Categoria">
              <SelectInput value={formCategory} onChange={(v) => setFormCategory(v as AppointmentCategory)}>
                {(Object.keys(categoryLabels) as AppointmentCategory[]).map((cat) => (
                  <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                ))}
              </SelectInput>
            </FieldGroup>

            <div className="grid grid-cols-2 gap-3">
              <FieldGroup label="Dia">
                <SelectInput value={String(formDay !== undefined ? formDay : initialDay)} onChange={(v) => setFormDay(Number(v))}>
                  {weekDays.map((d, i) => (
                    <option key={i} value={i}>{d} {weekDates[i]}</option>
                  ))}
                </SelectInput>
              </FieldGroup>
              <FieldGroup label="Horário">
                <SelectInput value={formTime || initialTime} onChange={setFormTime}>
                  {hours.map((h) => <option key={h} value={h}>{h}</option>)}
                </SelectInput>
              </FieldGroup>
            </div>

            <FieldGroup label="Duração (horas)">
              <SelectInput value={formDuration} onChange={setFormDuration}>
                <option value="1">1 hora</option>
                <option value="2">2 horas</option>
                <option value="3">3 horas</option>
              </SelectInput>
            </FieldGroup>

            <FieldGroup label="Observação (opcional)">
              <TextInput value={formNote} onChange={setFormNote} placeholder="Anotação sobre o atendimento…" />
            </FieldGroup>

            {error && <p className="text-[12px] text-[var(--color-terracotta-600)]">{error}</p>}
          </ModalBody>
          <ModalFooter>
            <BtnSecondary onClick={closeModal}>Cancelar</BtnSecondary>
            <BtnPrimary onClick={handleCreate} disabled={submitting}>
              {submitting ? "Salvando…" : "Agendar"}
            </BtnPrimary>
          </ModalFooter>
        </ModalBox>
      </Modal>
    );
  }

  const { appointment: appt } = modal;
  const isPending = appt.status === "pendente";
  const dayLabel = weekDays[appt.day];
  const dateLabel = weekDates[appt.day];

  async function handleApprove() {
    setSubmitting(true); setError("");
    try { await approveAppointment(appt.id); }
    catch (err) { setError(err instanceof Error ? err.message : "Erro ao aprovar."); }
    finally { setSubmitting(false); }
  }

  async function handleReject() {
    setSubmitting(true); setError("");
    try { await rejectAppointment(appt.id); }
    catch (err) { setError(err instanceof Error ? err.message : "Erro ao recusar."); }
    finally { setSubmitting(false); }
  }

  return (
    <Modal open onClose={closeModal}>
      <ModalBox>
        {/* Header colorido pela categoria */}
        <div className={`px-6 py-5 ${categoryStyles[appt.category]}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide opacity-70 mb-1">
                {categoryLabels[appt.category]}
              </p>
              <h2 className="font-display text-[20px] font-medium leading-tight">{appt.patient}</h2>
            </div>
            <button onClick={closeModal} className="mt-0.5 opacity-60 hover:opacity-100 transition-opacity flex-shrink-0" aria-label="Fechar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2.5">
            <InfoRow icon="calendar" label="Data">{dayLabel}, {dateLabel}</InfoRow>
            <InfoRow icon="clock" label="Horário">
              {appt.time}
              {appt.durationSlots > 1 && <span className="text-[var(--color-ink-soft)]"> · {appt.durationSlots}h</span>}
            </InfoRow>
            {appt.note && <InfoRow icon="note" label="Observação">{appt.note}</InfoRow>}
          </div>

          {isPending ? (
            <div className="rounded-[10px] bg-[var(--color-terracotta-100)] border border-[var(--color-terracotta-400)] px-4 py-3">
              <p className="text-[12px] font-medium text-[var(--color-terracotta-600)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta-600)]" />
                Aguardando aprovação
              </p>
              <p className="text-[12px] text-[var(--color-ink-soft)] mt-1">Solicitado pela secretária. Confirme ou recuse.</p>
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

          {error && <p className="text-[12px] text-[var(--color-terracotta-600)]">{error}</p>}

          {isPending ? (
            <div className="flex gap-2 mt-1">
              <BtnSecondary onClick={handleReject}>Recusar</BtnSecondary>
              <BtnPrimary onClick={handleApprove} disabled={submitting}>
                {submitting ? "Aguarde…" : "Aprovar"}
              </BtnPrimary>
            </div>
          ) : (
            <div className="flex gap-2 mt-1">
              <BtnSecondary onClick={closeModal}>Fechar</BtnSecondary>
              <BtnSecondary onClick={closeModal}>Editar</BtnSecondary>
            </div>
          )}
        </div>
      </ModalBox>
    </Modal>
  );
}

function InfoRow({ icon, label, children }: { icon: "calendar" | "clock" | "note"; label: string; children: React.ReactNode }) {
  const icons = {
    calendar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>,
    clock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></svg>,
    note: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10z" /><path d="M14 3v7h7M8 13h8M8 17h5" /></svg>,
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
