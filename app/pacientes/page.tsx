"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";
import { Patient, PatientStatus, categoryLabels, paymentMethodLabels } from "@/lib/types";
import { calcAge } from "@/lib/patients";
import { generateAgendaHours, DEFAULT_AGENDA_CONFIG } from "@/lib/schedule-utils";
import { toISODate, getToday } from "@/lib/date-utils";
import { Modal, ModalBox, ModalHeader, ModalBody, ModalFooter, FieldGroup, TextInput, SelectInput, BtnPrimary, BtnSecondary } from "@/components/Modal";
import { Avatar } from "@/components/Avatar";
import { AvatarUpload } from "@/components/AvatarUpload";

const statusLabel: Record<PatientStatus, string> = { ativo: "Ativo", inativo: "Inativo", alta: "Alta" };
const statusStyle: Record<PatientStatus, string> = {
  ativo: "bg-[var(--color-pine-50)] text-[var(--color-pine-700)]",
  inativo: "bg-[var(--color-cat-bloqueado-bg)] text-[var(--color-ink-soft)]",
  alta: "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-600)]",
};
const catDot: Record<string, string> = {
  avaliacao: "bg-[var(--color-cat-avaliacao-fg)]",
  retorno: "bg-[var(--color-cat-retorno-fg)]",
  tratamento: "bg-[var(--color-cat-tratamento-fg)]",
  pilates: "bg-[var(--color-cat-pilates-fg)]",
  bloqueado: "bg-[var(--color-cat-bloqueado-fg)]",
};

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// --- Modal: Novo Paciente ---
function NovoPacienteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { refreshPatients } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [condition, setCondition] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function reset() { setName(""); setEmail(""); setPhone(""); setCpf(""); setBirthDate(""); setCondition(""); setError(""); }

  async function handleSave() {
    if (!name.trim() || !email.trim() || !phone.trim() || !cpf.trim() || !birthDate) {
      setError("Preencha todos os campos obrigatórios."); return;
    }
    setSaving(true); setError("");
    try {
      const now = new Date();
      const since = now.toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, phone, cpf, birthDate, condition: condition || undefined, since }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao salvar paciente."); return;
      }
      await refreshPatients();
      reset(); onClose();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() { reset(); onClose(); }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalBox className="max-w-md">
        <ModalHeader title="Novo paciente" subtitle="Preencha os dados cadastrais" onClose={handleClose} />
        <ModalBody>
          <FieldGroup label="Nome completo *"><TextInput value={name} onChange={setName} placeholder="Ex: Ana Luiza Costa" /></FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="E-mail *"><TextInput value={email} onChange={setEmail} type="email" placeholder="email@exemplo.com" /></FieldGroup>
            <FieldGroup label="Telefone *"><TextInput value={phone} onChange={setPhone} placeholder="(00) 00000-0000" /></FieldGroup>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="CPF *"><TextInput value={cpf} onChange={setCpf} placeholder="000.000.000-00" /></FieldGroup>
            <FieldGroup label="Nascimento *"><TextInput value={birthDate} onChange={setBirthDate} type="date" /></FieldGroup>
          </div>
          <FieldGroup label="Condição / queixa principal"><TextInput value={condition} onChange={setCondition} placeholder="Ex: Lombalgia crônica" /></FieldGroup>
          {error && <p className="text-[12px] text-[var(--color-terracotta-600)]">{error}</p>}
        </ModalBody>
        <ModalFooter>
          <BtnSecondary onClick={handleClose}>Cancelar</BtnSecondary>
          <BtnPrimary onClick={handleSave} disabled={saving}>{saving ? "Salvando…" : "Cadastrar"}</BtnPrimary>
        </ModalFooter>
      </ModalBox>
    </Modal>
  );
}

// --- Modal: Editar Ficha ---
function EditarFichaModal({ open, onClose, patient, onPatientChanged }: { open: boolean; onClose: () => void; patient: Patient; onPatientChanged: (patient: Patient) => void }) {
  const { updatePatient, refreshPatients } = useApp();
  const [name, setName] = useState(patient.name);
  const [email, setEmail] = useState(patient.email);
  const [phone, setPhone] = useState(patient.phone);
  const [condition, setCondition] = useState(patient.condition ?? "");
  const [notes, setNotes] = useState(patient.notes ?? "");
  const [status, setStatus] = useState<PatientStatus>(patient.status);
  const [avatar, setAvatar] = useState(patient.avatar ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true); setError("");
    try {
      await updatePatient(patient.id, { name, email, phone, condition: condition || null, notes: notes || null, status });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox className="max-w-md">
        <ModalHeader title="Editar ficha" subtitle={patient.name} onClose={onClose} />
        <ModalBody>
          <AvatarUpload
            uploadUrl={`/api/patients/${patient.id}/avatar`}
            currentAvatar={avatar}
            initials={patient.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
            onChanged={(newAvatar) => {
              setAvatar(newAvatar);
              onPatientChanged({ ...patient, avatar: newAvatar });
              refreshPatients().catch(() => {});
            }}
          />
          <FieldGroup label="Nome"><TextInput value={name} onChange={setName} /></FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="E-mail"><TextInput value={email} onChange={setEmail} type="email" /></FieldGroup>
            <FieldGroup label="Telefone"><TextInput value={phone} onChange={setPhone} /></FieldGroup>
          </div>
          <FieldGroup label="Status">
            <SelectInput value={status} onChange={(v) => setStatus(v as PatientStatus)}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="alta">Alta</option>
            </SelectInput>
          </FieldGroup>
          <FieldGroup label="Condição">
            <TextInput value={condition} onChange={setCondition} placeholder="Queixa principal" />
          </FieldGroup>
          <FieldGroup label="Observações clínicas">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Notas clínicas relevantes…"
              className="rounded-[10px] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)] resize-none w-full"
            />
          </FieldGroup>
          {error && <p className="text-[12px] text-[var(--color-terracotta-600)]">{error}</p>}
        </ModalBody>
        <ModalFooter>
          <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
          <BtnPrimary onClick={handleSave} disabled={saving}>{saving ? "Salvando…" : "Salvar alterações"}</BtnPrimary>
        </ModalFooter>
      </ModalBox>
    </Modal>
  );
}

// --- Modal: Agendar Consulta ---
function AgendarConsultaModal({ open, onClose, patient }: { open: boolean; onClose: () => void; patient: Patient }) {
  const { addAppointment, agendaConfig } = useApp();
  const hours = generateAgendaHours(agendaConfig ?? DEFAULT_AGENDA_CONFIG);
  const catLabels = categoryLabels;
  const [date, setDate] = useState(toISODate(getToday()));
  const [time, setTime] = useState(hours[0] ?? "08:00");
  const [category, setCategory] = useState("avaliacao");
  const [duration, setDuration] = useState("1");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true); setError("");
    try {
      await addAppointment({
        date,
        time,
        durationSlots: parseInt(duration),
        patient: patient.name,
        patientId: patient.id,
        category: category as import("@/lib/types").AppointmentCategory,
        note: note || null,
        status: "confirmado",
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao agendar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox>
        <ModalHeader title="Agendar consulta" subtitle={patient.name} onClose={onClose} />
        <ModalBody>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Data">
              <TextInput type="date" value={date} onChange={setDate} />
            </FieldGroup>
            <FieldGroup label="Horário">
              <SelectInput value={time} onChange={setTime}>
                {hours.map((h: string) => <option key={h} value={h}>{h}</option>)}
              </SelectInput>
            </FieldGroup>
          </div>
          <FieldGroup label="Categoria">
            <SelectInput value={category} onChange={setCategory}>
              {Object.entries(catLabels).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}
            </SelectInput>
          </FieldGroup>
          <FieldGroup label="Duração">
            <SelectInput value={duration} onChange={setDuration}>
              <option value="1">1 hora</option>
              <option value="2">2 horas</option>
              <option value="3">3 horas</option>
            </SelectInput>
          </FieldGroup>
          <FieldGroup label="Observação (opcional)">
            <TextInput value={note} onChange={setNote} placeholder="Anotação sobre o atendimento…" />
          </FieldGroup>
          {error && <p className="text-[12px] text-[var(--color-terracotta-600)]">{error}</p>}
        </ModalBody>
        <ModalFooter>
          <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
          <BtnPrimary onClick={handleSave} disabled={saving}>{saving ? "Agendando…" : "Confirmar"}</BtnPrimary>
        </ModalFooter>
      </ModalBox>
    </Modal>
  );
}

export default function PacientesPage() {
  const { currentUser, patients, patientsLoading, appointments } = useApp();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<PatientStatus | "todos">("todos");
  const [selected, setSelected] = useState<Patient | null>(null);
  const [showNovo, setShowNovo] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [showAgendar, setShowAgendar] = useState(false);

  const userName = currentUser?.name ?? "";
  const userRole = currentUser?.role === "secretaria" ? "Secretária" : "Fisioterapeuta";

  const filtered = patients.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function countWeekAppts(patientName: string) {
    return appointments.filter((a) => a.patient === patientName && a.status !== "cancelado").length;
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] relative">
      <input type="checkbox" id="menu-toggle" className="peer hidden" />

      <div className="hidden lg:contents">
        <Sidebar active="pacientes" userName={userName} userRole={userRole} userAvatar={currentUser?.avatar} />
      </div>

      <div className="fixed inset-0 z-50 hidden peer-checked:block lg:hidden">
        <label htmlFor="menu-toggle" className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--color-card)] shadow-xl animate-slide-in-left">
          <label htmlFor="menu-toggle" className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[var(--color-card)] hover:bg-[var(--color-paper)] border border-[var(--color-line)] cursor-pointer" aria-label="Fechar menu">
            <CloseIcon />
          </label>
          <div className="h-full"><Sidebar active="pacientes" userName={userName} userRole={userRole} userAvatar={currentUser?.avatar} /></div>
        </div>
      </div>

      <main className="flex-1 min-w-0 flex">
        <div className={`flex flex-col transition-all duration-200 ${selected ? "hidden lg:flex lg:w-[420px] lg:shrink-0" : "flex-1"}`}>
          <div className="px-4 sm:px-6 md:px-8 py-5 md:py-6 border-b border-[var(--color-line)] bg-[var(--color-paper)] sticky top-0 z-10">
            <div className="flex items-center gap-3 mb-4">
              <label htmlFor="menu-toggle" className="lg:hidden inline-flex p-2 rounded-lg hover:bg-[var(--color-card)] border border-[var(--color-line)] cursor-pointer z-30" aria-label="Abrir menu">
                <MenuIcon />
              </label>
              <div className="flex-1">
                <h1 className="font-display text-[22px] sm:text-[24px] md:text-[26px] font-medium text-[var(--color-pine-700)]">Pacientes</h1>
                <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-0.5">{patients.length} cadastrados</p>
              </div>
              <button
                onClick={() => setShowNovo(true)}
                className="rounded-[10px] bg-[var(--color-pine-600)] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[var(--color-pine-700)] transition-colors hidden sm:block"
              >
                + Novo paciente
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input type="text" placeholder="Buscar por nome ou e-mail…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-card)] pl-9 pr-3.5 py-2 text-[13px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]" />
              </div>
              <div className="flex rounded-[10px] border border-[var(--color-line)] bg-[var(--color-card)] overflow-hidden self-start">
                {(["todos", "ativo", "inativo", "alta"] as const).map((s) => (
                  <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 text-[12px] font-medium transition-colors capitalize ${filterStatus === s ? "bg-[var(--color-pine-600)] text-white" : "text-[var(--color-ink-soft)] hover:bg-[var(--color-paper)]"}`}>
                    {s === "todos" ? "Todos" : statusLabel[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 flex flex-col gap-2">
            {patientsLoading && <p className="text-[13px] text-[var(--color-ink-soft)] text-center py-12">Carregando pacientes…</p>}
            {!patientsLoading && filtered.length === 0 && <p className="text-[13px] text-[var(--color-ink-soft)] text-center py-12">Nenhum paciente encontrado.</p>}
            {filtered.map((p) => {
              const isSelected = selected?.id === p.id;
              const weekAppts = countWeekAppts(p.name);
              return (
                <button key={p.id} onClick={() => setSelected(isSelected ? null : p)} className={`text-left rounded-[12px] border px-4 py-3.5 transition-all ${isSelected ? "border-[var(--color-pine-400)] bg-[var(--color-pine-50)]" : "border-[var(--color-line)] bg-[var(--color-card)] hover:border-[var(--color-pine-200)]"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={p.avatar}
                        initials={p.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                        size="w-9 h-9"
                        className="text-[13px]"
                      />
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium truncate">{p.name}</p>
                        <p className="text-[12px] text-[var(--color-ink-soft)] truncate">{p.condition ?? p.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {weekAppts > 0 && <span className="text-[11px] font-medium rounded-full px-2 py-0.5 bg-[var(--color-pine-50)] text-[var(--color-pine-700)] border border-[var(--color-pine-200)]">{weekAppts} esta semana</span>}
                      <span className={`text-[11px] font-medium rounded-full px-2 py-0.5 ${statusStyle[p.status]}`}>{statusLabel[p.status]}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-4 mt-2.5 pl-12 ${selected ? "hidden" : ""}`}>
                    <span className="text-[12px] text-[var(--color-ink-soft)]">{calcAge(p.birthDate)} anos</span>
                    <span className="text-[12px] text-[var(--color-ink-soft)]">{p.phone}</span>
                    <span className="text-[12px] text-[var(--color-ink-soft)]">Desde {p.since}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selected && (
          <div className="flex-1 border-l border-[var(--color-line)] bg-[var(--color-card)] overflow-y-auto">
            <PatientSheet
              patient={selected}
              onClose={() => setSelected(null)}
              onEditar={() => setShowEditar(true)}
              onAgendar={() => setShowAgendar(true)}
            />
          </div>
        )}
      </main>

      <NovoPacienteModal open={showNovo} onClose={() => setShowNovo(false)} />
      {selected && <EditarFichaModal open={showEditar} onClose={() => setShowEditar(false)} patient={selected} onPatientChanged={setSelected} />}
      {selected && <AgendarConsultaModal open={showAgendar} onClose={() => setShowAgendar(false)} patient={selected} />}
    </div>
  );
}

function PatientSheet({ patient: p, onClose, onEditar, onAgendar }: { patient: Patient; onClose: () => void; onEditar: () => void; onAgendar: () => void }) {
  const age = calcAge(p.birthDate);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 sm:px-6 py-5 border-b border-[var(--color-line)] flex items-start justify-between gap-3 sticky top-0 bg-[var(--color-card)] z-10">
        <div className="flex items-center gap-3">
          <Avatar
            src={p.avatar}
            initials={p.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
            size="w-11 h-11"
            className="text-[15px]"
          />
          <div>
            <h2 className="font-display text-[18px] font-medium text-[var(--color-pine-700)]">{p.name}</h2>
            <p className="text-[12px] text-[var(--color-ink-soft)]">{age} anos · Desde {p.since}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-medium rounded-full px-2.5 py-1 ${{ ativo: "bg-[var(--color-pine-50)] text-[var(--color-pine-700)]", inativo: "bg-[var(--color-cat-bloqueado-bg)] text-[var(--color-ink-soft)]", alta: "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-600)]" }[p.status]}`}>
            {{ ativo: "Ativo", inativo: "Inativo", alta: "Alta" }[p.status]}
          </span>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--color-paper)] transition-colors text-[var(--color-ink-soft)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 sm:px-6 py-5 flex flex-col gap-5">
        {p.condition && <Section title="Condição"><p className="text-[13px]">{p.condition}</p></Section>}
        <Section title="Dados pessoais">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
            <Field label="E-mail" value={p.email} />
            <Field label="Telefone" value={p.phone} />
            <Field label="CPF" value={p.cpf} />
            <Field label="Nascimento" value={new Date(p.birthDate).toLocaleDateString("pt-BR")} />
            {p.address && <Field label="Endereço" value={p.address} className="col-span-1 sm:col-span-2" />}
          </div>
        </Section>
        {p.notes && <Section title="Observações clínicas"><p className="text-[13px] text-[var(--color-ink-soft)] leading-relaxed">{p.notes}</p></Section>}
        <Section title={`Histórico (${p.appointmentHistory.length} atendimentos)`}>
          <div className="flex flex-col gap-1">
            {p.appointmentHistory.slice().reverse().map((a) => {
              const isOpen = expandedId === a.id;
              return (
                <div key={a.id} className="border-b border-[var(--color-line)] last:border-0">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isOpen ? null : a.id)}
                    className="w-full flex items-center gap-3 py-1.5 text-left hover:bg-[var(--color-paper)] transition-colors rounded-[6px] -mx-1 px-1"
                  >
                    <span className={`w-2 h-2 rounded-full shrink-0 ${{ avaliacao: "bg-[var(--color-cat-avaliacao-fg)]", retorno: "bg-[var(--color-cat-retorno-fg)]", tratamento: "bg-[var(--color-cat-tratamento-fg)]", pilates: "bg-[var(--color-cat-pilates-fg)]", bloqueado: "bg-[var(--color-cat-bloqueado-fg)]" }[a.category]}`} />
                    <span className="text-[12px] text-[var(--color-ink-soft)] w-[72px] shrink-0">{a.date}</span>
                    <span className="text-[12px] font-medium">{categoryLabels[a.category]}</span>
                    {a.note && <span className="text-[12px] text-[var(--color-ink-soft)] truncate">— {a.note}</span>}
                    {a.status === "pendente" && <span className="ml-auto text-[10px] font-medium text-[var(--color-terracotta-600)] shrink-0">Pendente</span>}
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className={`shrink-0 text-[var(--color-ink-soft)] transition-transform ${a.status === "pendente" ? "" : "ml-auto"} ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="pb-3 pl-5 pr-1 flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-medium rounded-full px-2.5 py-1 ${a.attended ? "bg-[var(--color-pine-50)] text-[var(--color-pine-700)]" : "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-600)]"}`}>
                          {a.attended ? "Compareceu" : "Não compareceu"}
                        </span>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wide mb-1">Queixa do dia</p>
                        <p className="text-[13px] text-[var(--color-ink-soft)] leading-relaxed">{a.complaint || "Não informado."}</p>
                      </div>

                      <div>
                        <p className="text-[11px] uppercase tracking-wide mb-1">O que foi feito</p>
                        <p className="text-[13px] text-[var(--color-ink-soft)] leading-relaxed">{a.procedure || "Não informado."}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-wide mb-1">
                            Forma de pagamento
                          </p>
                          <p className="text-[13px] text-[var(--color-ink-soft)]">
                            {a.paymentMethod ? paymentMethodLabels[a.paymentMethod] : "—"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] text-white uppercase tracking-wide mb-1">
                            Pago?
                          </p>
                          <p className="text-[13px] text-[var(--color-ink-soft)]">
                            {a.paid ? "Sim" : "Não"}
                          </p>
                        </div>
                      </div>

                      {a.receiptUrl && (
                        <a href={a.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[var(--color-pine-600)] underline">
                          Ver comprovante de pagamento
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      <div className="px-4 sm:px-6 py-4 border-t border-[var(--color-line)] flex gap-2 sticky bottom-0 bg-[var(--color-card)]">
        <button onClick={onEditar} className="flex-1 rounded-[10px] border border-[var(--color-line)] py-2.5 text-[13px] font-medium hover:bg-[var(--color-paper)] transition-colors">Editar ficha</button>
        <button onClick={onAgendar} className="flex-1 rounded-[10px] bg-[var(--color-pine-600)] text-white py-2.5 text-[13px] font-medium hover:bg-[var(--color-pine-700)] transition-colors">Agendar consulta</button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-medium text-[var(--color-ink-soft)] uppercase tracking-wide mb-2">{title}</p>
      {children}
    </div>
  );
}

function Field({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[11px] text-[var(--color-ink-soft)]">{label}</p>
      <p className="text-[13px] font-medium mt-0.5">{value}</p>
    </div>
  );
}