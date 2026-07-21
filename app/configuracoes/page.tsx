"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";
import { Modal, ModalBox, ModalHeader, ModalBody, ModalFooter, FieldGroup, TextInput, SelectInput, BtnPrimary, BtnSecondary } from "@/components/Modal";
import type { AgendaConfig } from "@/lib/types";
import { DEFAULT_AGENDA_CONFIG } from "@/lib/schedule-utils";
import { useRouter } from "next/navigation";

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

// --- Modal: Editar Perfil ---
function EditarPerfilModal({ open, onClose, user }: { open: boolean; onClose: () => void; user: import("@/lib/types").User | null }) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [specialty, setSpecialty] = useState(user?.specialty ?? "");
  const [crefito, setCrefito] = useState(user?.crefito ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!name.trim()) { setError("Nome é obrigatório."); return; }
    setSaving(true); setError("");
    try {
      await new Promise((r) => setTimeout(r, 700));
      onClose();
    } catch {
      setError("Erro ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox>
        <ModalHeader title="Editar perfil" onClose={onClose} />
        <ModalBody>
          <FieldGroup label="Nome completo *"><TextInput value={name} onChange={setName} /></FieldGroup>
          <FieldGroup label="E-mail"><TextInput value={email} onChange={setEmail} type="email" disabled /></FieldGroup>
          {user?.crefito !== undefined && (
            <FieldGroup label="CREFITO"><TextInput value={crefito} onChange={setCrefito} placeholder="Ex: CREFITO-3/12345-F" /></FieldGroup>
          )}
          {user?.specialty !== undefined && (
            <FieldGroup label="Especialidade"><TextInput value={specialty} onChange={setSpecialty} /></FieldGroup>
          )}
          {error && <p className="text-[12px] text-[var(--color-terracotta-600)]">{error}</p>}
        </ModalBody>
        <ModalFooter>
          <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
          <BtnPrimary onClick={handleSave} disabled={saving}>{saving ? "Salvando…" : "Salvar"}</BtnPrimary>
        </ModalFooter>
      </ModalBox>
    </Modal>
  );
}

// --- Utilidades de horário ---

// Gera todos os horários do dia, de 00:00 a 23:45, em passos de 15 minutos.
function generateTimeOptions(stepMinutes = 15): string[] {
  const options: string[] = [];
  for (let minutes = 0; minutes < 24 * 60; minutes += stepMinutes) {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    options.push(`${h}:${m}`);
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions(15);
// "00:00" extra ao final representa meia-noite como limite de fechamento (fim do dia).
const END_TIME_OPTIONS = [...TIME_OPTIONS.slice(1), "00:00"];

const WEEKDAY_OPTIONS: { value: number; label: string }[] = [
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sáb" },
  { value: 0, label: "Dom" },
];

// --- Modal: Configurar Agenda ---
function ConfigAgendaModal({
  open,
  onClose,
  config,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  config: AgendaConfig;
  onSave: (config: AgendaConfig) => Promise<void>;
}) {
  const [inicio, setInicio] = useState(config.horarioInicio);
  const [fim, setFim] = useState(config.horarioFim);
  const [duracao, setDuracao] = useState(String(config.duracaoConsulta));
  const [intervalo, setIntervalo] = useState(String(config.intervaloConsulta));
  const [dias, setDias] = useState<number[]>(config.diasAtendimento);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Sempre que o modal abrir, sincroniza os campos com a configuração salva.
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincronização intencional ao abrir o modal
      setInicio(config.horarioInicio);
      setFim(config.horarioFim);
      setDuracao(String(config.duracaoConsulta));
      setIntervalo(String(config.intervaloConsulta));
      setDias(config.diasAtendimento);
      setError("");
    }
  }, [open, config]);

  function toggleDia(value: number) {
    setDias((prev) =>
      prev.includes(value) ? prev.filter((d) => d !== value) : [...prev, value].sort((a, b) => a - b)
    );
  }

  async function handleSave() {
    if (dias.length === 0) {
      setError("Selecione pelo menos um dia de atendimento.");
      return;
    }
    // "00:00" como fim representa meia-noite (fim do dia). Só bloqueamos
    // início === fim quando não for o caso especial 00:00–00:00 (dia inteiro).
    if (inicio === fim && !(inicio === "00:00" && fim === "00:00")) {
      setError("O horário de início e fim não podem ser iguais.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({
        horarioInicio: inicio,
        horarioFim: fim,
        duracaoConsulta: Number(duracao),
        intervaloConsulta: Number(intervalo),
        diasAtendimento: dias,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar configuração da agenda.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox>
        <ModalHeader title="Configurar agenda" subtitle="Horários de atendimento" onClose={onClose} />
        <ModalBody>
          <FieldGroup label="Dias de atendimento">
            <div className="flex flex-wrap gap-2">
              {WEEKDAY_OPTIONS.map(({ value, label }) => {
                const active = dias.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleDia(value)}
                    className={`px-3 py-1.5 rounded-[8px] text-[12px] font-medium border transition-colors ${
                      active
                        ? "bg-[var(--color-pine-600)] text-white border-[var(--color-pine-600)]"
                        : "bg-[var(--color-card)] text-[var(--color-ink-soft)] border-[var(--color-line)] hover:bg-[var(--color-paper)]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="Início">
              <SelectInput value={inicio} onChange={setInicio}>
                {TIME_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
              </SelectInput>
            </FieldGroup>
            <FieldGroup label="Fim">
              <SelectInput value={fim} onChange={setFim}>
                {END_TIME_OPTIONS.map(h => <option key={h} value={h}>{h === "00:00" ? "00:00 (meia-noite)" : h}</option>)}
              </SelectInput>
            </FieldGroup>
          </div>
          <FieldGroup label="Duração padrão da consulta">
            <SelectInput value={duracao} onChange={setDuracao}>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">60 minutos</option>
              <option value="90">90 minutos</option>
            </SelectInput>
          </FieldGroup>
          <FieldGroup label="Intervalo entre atendimentos">
            <SelectInput value={intervalo} onChange={setIntervalo}>
              <option value="0">Sem intervalo</option>
              <option value="10">10 minutos</option>
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
            </SelectInput>
          </FieldGroup>
          {error && <p className="text-[12px] text-[var(--color-terracotta-600)]">{error}</p>}
        </ModalBody>
        <ModalFooter>
          <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
          <BtnPrimary onClick={handleSave} disabled={saving}>{saving ? "Salvando…" : "Salvar"}</BtnPrimary>
        </ModalFooter>
      </ModalBox>
    </Modal>
  );
}

// --- Modal: Alterar Senha ---
function AlterarSenhaModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function reset() { setAtual(""); setNova(""); setConfirmar(""); setError(""); setSuccess(false); }

  async function handleSave() {
    if (!atual || !nova || !confirmar) { setError("Preencha todos os campos."); return; }
    if (nova !== confirmar) { setError("As senhas não coincidem."); return; }
    if (nova.length < 6) { setError("A nova senha deve ter pelo menos 6 caracteres."); return; }
    setSaving(true); setError("");
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSuccess(true);
      setTimeout(() => { reset(); onClose(); }, 1500);
    } catch {
      setError("Erro ao alterar senha.");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() { reset(); onClose(); }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalBox>
        <ModalHeader title="Alterar senha" onClose={handleClose} />
        <ModalBody>
          {success ? (
            <div className="py-6 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-pine-50)] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-pine-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <p className="font-medium text-[var(--color-pine-700)]">Senha alterada com sucesso!</p>
            </div>
          ) : (
            <>
              <FieldGroup label="Senha atual"><TextInput value={atual} onChange={setAtual} type="password" placeholder="••••••••" /></FieldGroup>
              <FieldGroup label="Nova senha"><TextInput value={nova} onChange={setNova} type="password" placeholder="Mínimo 6 caracteres" /></FieldGroup>
              <FieldGroup label="Confirmar nova senha"><TextInput value={confirmar} onChange={setConfirmar} type="password" placeholder="Repita a nova senha" /></FieldGroup>
              {error && <p className="text-[12px] text-[var(--color-terracotta-600)]">{error}</p>}
            </>
          )}
        </ModalBody>
        {!success && (
          <ModalFooter>
            <BtnSecondary onClick={handleClose}>Cancelar</BtnSecondary>
            <BtnPrimary onClick={handleSave} disabled={saving}>{saving ? "Alterando…" : "Alterar senha"}</BtnPrimary>
          </ModalFooter>
        )}
      </ModalBox>
    </Modal>
  );
}

// --- Modal: Google Agenda ---
function GoogleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [connecting, setConnecting] = useState(false);

  async function handleConnect() {
    setConnecting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setConnecting(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox>
        <ModalHeader title="Conectar Google Agenda" onClose={onClose} />
        <ModalBody>
          <div className="flex flex-col items-center gap-4 py-3 text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--color-paper)] border border-[var(--color-line)] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-pine-600)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[15px]">Sincronize com o Google Agenda</p>
              <p className="text-[13px] text-[var(--color-ink-soft)] mt-1 max-w-[260px]">Seus agendamentos serão exportados automaticamente para o seu Google Calendar.</p>
            </div>
            <ul className="text-left w-full flex flex-col gap-2">
              {["Sincronização automática em tempo real", "Notificações pelo Google", "Compartilhamento com pacientes"].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-[13px]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-pine-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </ModalBody>
        <ModalFooter>
          <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
          <BtnPrimary onClick={handleConnect} disabled={connecting}>{connecting ? "Conectando…" : "Autorizar Google"}</BtnPrimary>
        </ModalFooter>
      </ModalBox>
    </Modal>
  );
}

const WEEKDAY_SHORT_ORDER: { value: number; label: string }[] = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Seg" },
  { value: 2, label: "Ter" },
  { value: 3, label: "Qua" },
  { value: 4, label: "Qui" },
  { value: 5, label: "Sex" },
  { value: 6, label: "Sáb" },
];

function describeDiasAtendimento(dias: number[]): string {
  if (dias.length === 7) return "Todos os dias";
  const segToSab = [1, 2, 3, 4, 5, 6];
  if (dias.length === 6 && segToSab.every((d) => dias.includes(d))) return "Segunda a sábado";
  const segToSex = [1, 2, 3, 4, 5];
  if (dias.length === 5 && segToSex.every((d) => dias.includes(d))) return "Segunda a sexta";
  return WEEKDAY_SHORT_ORDER.filter((d) => dias.includes(d.value))
    .map((d) => d.label)
    .join(", ");
}

export default function ConfiguracoesPage() {
  const { currentUser, agendaConfig, agendaConfigLoading, updateAgendaConfig } = useApp();
  const [showPerfil, setShowPerfil] = useState(false);
  const [showAgenda, setShowAgenda] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [showGoogle, setShowGoogle] = useState(false);
  const router = useRouter();
  const [isTi, setIsTi] = useState(false);

  useEffect(() => {
    fetch("/api/noc/access")
      .then((res) => (res.ok ? res.json() : { isTi: false }))
      .then((data) => setIsTi(!!data.isTi))
      .catch(() => setIsTi(false));
  }, []);

  // Enquanto a configuração real ainda não chegou do banco, usamos um valor
  // padrão apenas para exibição/preenchimento inicial do formulário.
  const effectiveAgendaConfig = agendaConfig ?? DEFAULT_AGENDA_CONFIG;
  const intervaloLabel =
    effectiveAgendaConfig.intervaloConsulta === 0
      ? "Sem intervalo"
      : `${effectiveAgendaConfig.intervaloConsulta} minutos`;
  const diasLabel = describeDiasAtendimento(effectiveAgendaConfig.diasAtendimento);

  const userName = currentUser?.name ?? "";
  const userRole = currentUser?.role === "secretaria" ? "Secretária" : "Fisioterapeuta";

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] relative">
      <input type="checkbox" id="menu-toggle" className="peer hidden" />
      <div className="hidden lg:contents"><Sidebar active="config" userName={userName} userRole={userRole} userAvatar={currentUser?.avatar} /></div>

      <div className="fixed inset-0 z-50 hidden peer-checked:block lg:hidden">
        <label htmlFor="menu-toggle" className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--color-card)] shadow-xl animate-slide-in-left">
          <label htmlFor="menu-toggle" className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[var(--color-card)] hover:bg-[var(--color-paper)] border border-[var(--color-line)] cursor-pointer" aria-label="Fechar menu"><CloseIcon /></label>
          <div className="h-full"><Sidebar active="config" userName={userName} userRole={userRole} userAvatar={currentUser?.avatar} /></div>
        </div>
      </div>

      <main className="flex-1 min-w-0 px-4 py-5 sm:px-6 md:px-8 md:py-6">
        <label htmlFor="menu-toggle" className="lg:hidden inline-flex mb-4 p-2 rounded-lg hover:bg-[var(--color-card)] border border-[var(--color-line)] cursor-pointer z-30 relative" aria-label="Abrir menu"><MenuIcon /></label>

        <div className="mb-6 sm:mb-8">
          <h1 className="font-display text-[22px] sm:text-[24px] md:text-[26px] font-medium text-[var(--color-pine-700)] leading-tight">Configurações</h1>
          <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1 max-w-md">Gerencie preferências, integrações e informações da sua conta.</p>
        </div>

        <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 lg:grid-cols-2">
          <section className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 md:p-6">
            <h2 className="text-[17px] sm:text-[18px] font-medium text-[var(--color-pine-700)]">Perfil</h2>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1">Atualize suas informações pessoais.</p>
            <div className="mt-4 sm:mt-5 space-y-3 text-[13px] sm:text-[14px]">
              <div><p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">Nome</p><p className="break-words">{currentUser?.name ?? "—"}</p></div>
              <div><p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">E-mail</p><p className="break-all">{currentUser?.email ?? "—"}</p></div>
              {currentUser?.crefito && <div><p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">CREFITO</p><p>{currentUser.crefito}</p></div>}
              {currentUser?.specialty && <div><p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">Especialidade</p><p>{currentUser.specialty}</p></div>}
            </div>
            <button onClick={() => setShowPerfil(true)} className="mt-5 sm:mt-6 w-full sm:w-auto rounded-[10px] border border-[var(--color-line)] px-4 py-2.5 text-[13px] font-medium hover:bg-[var(--color-paper)] transition-colors">Editar perfil</button>
          </section>

          <section className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 md:p-6">
            <h2 className="text-[17px] sm:text-[18px] font-medium text-[var(--color-pine-700)]">Agenda</h2>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1">Configure seus horários de atendimento.</p>
            <div className="mt-4 sm:mt-5 space-y-3 text-[13px] sm:text-[14px]">
              <div><p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">Dias de atendimento</p><p>{diasLabel}</p></div>
              <div><p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">Horário padrão</p><p>{effectiveAgendaConfig.horarioInicio} – {effectiveAgendaConfig.horarioFim}</p></div>
              <div><p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">Duração padrão da consulta</p><p>{effectiveAgendaConfig.duracaoConsulta} minutos</p></div>
              <div><p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">Intervalo entre atendimentos</p><p>{intervaloLabel}</p></div>
            </div>
            <button onClick={() => setShowAgenda(true)} disabled={agendaConfigLoading} className="mt-5 sm:mt-6 w-full sm:w-auto rounded-[10px] border border-[var(--color-line)] px-4 py-2.5 text-[13px] font-medium hover:bg-[var(--color-paper)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">Configurar agenda</button>
          </section>

          <section className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 md:p-6">
            <h2 className="text-[17px] sm:text-[18px] font-medium text-[var(--color-pine-700)]">Integrações</h2>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1">Conecte serviços externos para sincronizar sua agenda.</p>
            <div className="mt-4 sm:mt-5">
              <h3 className="font-medium text-[14px] sm:text-[15px]">Google Agenda</h3>
              <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1">Sincronize automaticamente seus agendamentos com o Google Calendar.</p>
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] sm:text-[12px] bg-yellow-50 text-yellow-700 mt-3 sm:mt-4">● Não conectado</span>
              <div className="mt-5 sm:mt-6">
                <button onClick={() => setShowGoogle(true)} className="w-full sm:w-auto rounded-[10px] bg-[var(--color-pine-600)] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[var(--color-pine-700)] transition-colors">Conectar com Google</button>
              </div>
            </div>
          </section>

          <section className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 md:p-6">
            <h2 className="text-[17px] sm:text-[18px] font-medium text-[var(--color-pine-700)]">Segurança</h2>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1">Gerencie o acesso à sua conta.</p>
            <div className="mt-4 sm:mt-5 space-y-3">
              <button onClick={() => setShowSenha(true)} className="w-full text-left rounded-[10px] border border-[var(--color-line)] px-4 py-3 hover:bg-[var(--color-paper)] transition-colors text-[13px] sm:text-[14px]">Alterar senha</button>
              {isTi && (
                <button onClick={() => router.push("/noc")} className="w-full text-left rounded-[10px] border border-[var(--color-line)] px-4 py-3 hover:bg-[var(--color-paper)] transition-colors text-[13px] sm:text-[14px]">Painel NOC</button>
              )}
            </div>
          </section>
        </div>
      </main>

      <EditarPerfilModal open={showPerfil} onClose={() => setShowPerfil(false)} user={currentUser} />
      <ConfigAgendaModal open={showAgenda} onClose={() => setShowAgenda(false)} config={effectiveAgendaConfig} onSave={updateAgendaConfig} />
      <AlterarSenhaModal open={showSenha} onClose={() => setShowSenha(false)} />
      <GoogleModal open={showGoogle} onClose={() => setShowGoogle(false)} />
    </div>
  );
}