"use client";

import { useState } from "react";
import { useApp } from "../context/AppContext";
import { categoryLabels, paymentMethodLabels, PaymentMethod, Appointment } from "@/lib/types";
import { weekDays, weekDates } from "@/lib/mock-data";
import { Modal, ModalBox, ModalHeader, ModalBody, ModalFooter, FieldGroup, TextArea, SelectInput, BtnPrimary, BtnSecondary } from "./Modal";

export function AtendimentoModal({ appointment, onClose }: { appointment: Appointment; onClose: () => void }) {
  const { saveAtendimento } = useApp();

  const [complaint, setComplaint] = useState("");
  const [procedure, setProcedure] = useState("");
  const [attended, setAttended] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("dinheiro");
  const [paid, setPaid] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const todayLabel = new Date().toLocaleDateString("pt-BR");

  async function handleSave() {
    setSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.set("complaint", complaint);
      formData.set("procedure", procedure);
      formData.set("attended", String(attended));
      formData.set("paymentMethod", paymentMethod);
      formData.set("paid", String(paid));
      if (receipt) formData.set("receipt", receipt);

      await saveAtendimento(appointment.id, formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar atendimento.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open onClose={onClose}>
      <ModalBox className="max-w-md">
        <ModalHeader
          title="Registrar atendimento"
          subtitle={`${appointment.patient} · ${weekDays[appointment.day]}, ${weekDates[appointment.day]} · ${appointment.time} · ${categoryLabels[appointment.category]}`}
          onClose={onClose}
        />
        <ModalBody>
          <FieldGroup label="Compareceu?">
            <div className="flex rounded-[10px] border border-[var(--color-line)] overflow-hidden">
              <button type="button" onClick={() => setAttended(true)} className={`flex-1 py-2 text-[13px] font-medium transition-colors ${attended ? "bg-[var(--color-pine-600)] text-white" : "bg-[var(--color-paper)] hover:bg-[var(--color-card)]"}`}>Sim</button>
              <button type="button" onClick={() => setAttended(false)} className={`flex-1 py-2 text-[13px] font-medium transition-colors ${!attended ? "bg-[var(--color-terracotta-600)] text-white" : "bg-[var(--color-paper)] hover:bg-[var(--color-card)]"}`}>Não</button>
            </div>
          </FieldGroup>

          <FieldGroup label="Queixa do dia">
            <TextArea value={complaint} onChange={setComplaint} placeholder="O que o paciente relatou nesta consulta…" />
          </FieldGroup>

          <FieldGroup label="O que foi feito">
            <TextArea value={procedure} onChange={setProcedure} placeholder="Procedimentos, exercícios, condutas realizadas…" />
          </FieldGroup>

          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Forma de pagamento">
              <SelectInput value={paymentMethod} onChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                {(Object.keys(paymentMethodLabels) as PaymentMethod[]).map((m) => (
                  <option key={m} value={m}>{paymentMethodLabels[m]}</option>
                ))}
              </SelectInput>
            </FieldGroup>
            <FieldGroup label="Pago?">
              <div className="flex rounded-[10px] border border-[var(--color-line)] overflow-hidden">
                <button type="button" onClick={() => setPaid(true)} className={`flex-1 py-2.5 text-[13px] font-medium transition-colors ${paid ? "bg-[var(--color-pine-600)] text-white" : "bg-[var(--color-paper)] hover:bg-[var(--color-card)]"}`}>Sim</button>
                <button type="button" onClick={() => setPaid(false)} className={`flex-1 py-2.5 text-[13px] font-medium transition-colors ${!paid ? "bg-[var(--color-terracotta-600)] text-white" : "bg-[var(--color-paper)] hover:bg-[var(--color-card)]"}`}>Não</button>
              </div>
            </FieldGroup>
          </div>

          <FieldGroup label="Comprovante de pagamento (opcional)">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
              className="text-[12px] file:mr-3 file:rounded-[8px] file:border-0 file:bg-[var(--color-pine-50)] file:text-[var(--color-pine-700)] file:px-3 file:py-2 file:text-[12px] file:font-medium"
            />
          </FieldGroup>

          <p className="text-[11px] text-[var(--color-ink-soft)]">Registro de hoje, {todayLabel}, às {appointment.time}.</p>

          {error && <p className="text-[12px] text-[var(--color-terracotta-600)]">{error}</p>}
        </ModalBody>
        <ModalFooter>
          <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
          <BtnPrimary onClick={handleSave} disabled={submitting}>{submitting ? "Salvando…" : "Salvar atendimento"}</BtnPrimary>
        </ModalFooter>
      </ModalBox>
    </Modal>
  );
}