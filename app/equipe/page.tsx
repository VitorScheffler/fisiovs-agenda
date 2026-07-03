"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { useApp } from "@/context/AppContext";
import { TeamMember } from "@/lib/types";
import { Modal, ModalBox, ModalHeader, ModalBody, ModalFooter, FieldGroup, TextInput, SelectInput, BtnPrimary, BtnSecondary } from "@/components/Modal";

const statusLabel = { ativo: "Ativo", inativo: "Inativo", ferias: "Férias" } as const;
const statusStyle = {
  ativo: "bg-[var(--color-pine-50)] text-[var(--color-pine-700)]",
  inativo: "bg-[var(--color-cat-bloqueado-bg)] text-[var(--color-ink-soft)]",
  ferias: "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-600)]",
} as const;

const roleIcon: Record<string, React.ReactNode> = {
  Fisioterapeuta: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zM12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" /></svg>,
  Secretaria: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
  Auxiliar: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  TI: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
};

const MenuIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;

// --- Modal: Convidar Membro ---
function ConvidarModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Fisioterapeuta");
  const [phone, setPhone] = useState("");
  const [crefito, setCrefito] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function reset() { setName(""); setEmail(""); setPhone(""); setCrefito(""); setSpecialty(""); setError(""); setSuccess(false); }

  async function handleSave() {
    if (!name.trim() || !email.trim()) { setError("Nome e e-mail são obrigatórios."); return; }
    setSaving(true); setError("");
    try {
      await new Promise((r) => setTimeout(r, 700));
      setSuccess(true);
      setTimeout(() => { reset(); onClose(); }, 1500);
    } catch {
      setError("Erro ao convidar membro.");
    } finally {
      setSaving(false);
    }
  }

  function handleClose() { reset(); onClose(); }

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalBox className="max-w-md">
        <ModalHeader title="Convidar membro" subtitle="Um convite será enviado por e-mail" onClose={handleClose} />
        <ModalBody>
          {success ? (
            <div className="py-6 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-full bg-[var(--color-pine-50)] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-pine-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <p className="font-medium text-[var(--color-pine-700)]">Convite enviado!</p>
              <p className="text-[13px] text-[var(--color-ink-soft)]">{name} receberá um e-mail com as instruções de acesso.</p>
            </div>
          ) : (
            <>
              <FieldGroup label="Nome completo *"><TextInput value={name} onChange={setName} placeholder="Ex: Dra. Mariana Souza" /></FieldGroup>
              <FieldGroup label="E-mail *"><TextInput value={email} onChange={setEmail} type="email" placeholder="email@exemplo.com" /></FieldGroup>
              <FieldGroup label="Função">
                <SelectInput value={role} onChange={setRole}>
                  <option value="Fisioterapeuta">Fisioterapeuta</option>
                  <option value="Secretaria">Secretaria</option>
                  <option value="Auxiliar">Auxiliar</option>
                  <option value="TI">TI</option>
                </SelectInput>
              </FieldGroup>
              <FieldGroup label="Telefone"><TextInput value={phone} onChange={setPhone} placeholder="(00) 00000-0000" /></FieldGroup>
              {role === "Fisioterapeuta" && (
                <>
                  <FieldGroup label="CREFITO"><TextInput value={crefito} onChange={setCrefito} placeholder="Ex: CREFITO-3/12345-F" /></FieldGroup>
                  <FieldGroup label="Especialidade"><TextInput value={specialty} onChange={setSpecialty} placeholder="Ex: Ortopedia e Traumatologia" /></FieldGroup>
                </>
              )}
              {error && <p className="text-[12px] text-[var(--color-terracotta-600)]">{error}</p>}
            </>
          )}
        </ModalBody>
        {!success && (
          <ModalFooter>
            <BtnSecondary onClick={handleClose}>Cancelar</BtnSecondary>
            <BtnPrimary onClick={handleSave} disabled={saving}>{saving ? "Enviando…" : "Enviar convite"}</BtnPrimary>
          </ModalFooter>
        )}
      </ModalBox>
    </Modal>
  );
}

// --- Modal: Editar Membro ---
function EditarMembroModal({ open, onClose, member }: { open: boolean; onClose: () => void; member: TeamMember }) {
  const [name, setName] = useState(member.name);
  const [email, setEmail] = useState(member.email);
  const [phone, setPhone] = useState(member.phone);
  const [specialty, setSpecialty] = useState(member.specialty ?? "");
  const [crefito, setCrefito] = useState(member.crefito ?? "");
  const [status, setStatus] = useState(member.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true); setError("");
    try {
      await new Promise((r) => setTimeout(r, 600));
      onClose();
    } catch {
      setError("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox className="max-w-md">
        <ModalHeader title="Editar dados" subtitle={member.name} onClose={onClose} />
        <ModalBody>
          <FieldGroup label="Nome"><TextInput value={name} onChange={setName} /></FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <FieldGroup label="E-mail"><TextInput value={email} onChange={setEmail} type="email" /></FieldGroup>
            <FieldGroup label="Telefone"><TextInput value={phone} onChange={setPhone} /></FieldGroup>
          </div>
          <FieldGroup label="Status">
            <SelectInput value={status} onChange={(v) => setStatus(v as typeof status)}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="ferias">Férias</option>
            </SelectInput>
          </FieldGroup>
          {member.role === "Fisioterapeuta" && (
            <>
              <FieldGroup label="CREFITO"><TextInput value={crefito} onChange={setCrefito} /></FieldGroup>
              <FieldGroup label="Especialidade"><TextInput value={specialty} onChange={setSpecialty} /></FieldGroup>
            </>
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

// --- Modal: Confirmar desativação ---
function DesativarModal({ open, onClose, member }: { open: boolean; onClose: () => void; member: TeamMember }) {
  const isAtivo = member.status === "ativo";
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBox>
        <ModalHeader title={isAtivo ? "Desativar acesso" : "Reativar acesso"} onClose={onClose} />
        <ModalBody>
          <p className="text-[14px]">
            {isAtivo
              ? `Tem certeza que deseja desativar o acesso de ${member.name}? O membro não conseguirá mais entrar no sistema.`
              : `Deseja reativar o acesso de ${member.name}?`}
          </p>
        </ModalBody>
        <ModalFooter>
          <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
          <BtnPrimary onClick={handleConfirm} disabled={saving}>{saving ? "Aguarde…" : isAtivo ? "Desativar" : "Reativar"}</BtnPrimary>
        </ModalFooter>
      </ModalBox>
    </Modal>
  );
}

export default function EquipePage() {
  const { currentUser } = useApp();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [showConvidar, setShowConvidar] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [showDesativar, setShowDesativar] = useState(false);

  const userName = currentUser?.name ?? "";
  const userRole = currentUser?.role === "secretaria" ? "Secretária" : "Fisioterapeuta";

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/team", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Erro ao carregar equipe.");
        if (active) setTeam(data.team);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Erro ao carregar equipe.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const fisios = team.filter((m) => m.role === "Fisioterapeuta");
  const outros = team.filter((m) => m.role !== "Fisioterapeuta");

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] relative">
      <input type="checkbox" id="menu-toggle" className="peer hidden" />
      <div className="hidden lg:contents"><Sidebar active="equipe" userName={userName} userRole={userRole} /></div>

      <div className="fixed inset-0 z-50 hidden peer-checked:block lg:hidden">
        <label htmlFor="menu-toggle" className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--color-card)] shadow-xl animate-slide-in-left">
          <label htmlFor="menu-toggle" className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[var(--color-card)] hover:bg-[var(--color-paper)] border border-[var(--color-line)] cursor-pointer" aria-label="Fechar menu"><CloseIcon /></label>
          <div className="h-full"><Sidebar active="equipe" userName={userName} userRole={userRole} /></div>
        </div>
      </div>

      <main className="flex-1 min-w-0 px-4 py-5 sm:px-6 md:px-8 md:py-6">
        <label htmlFor="menu-toggle" className="lg:hidden inline-flex mb-4 p-2 rounded-lg hover:bg-[var(--color-card)] border border-[var(--color-line)] cursor-pointer z-30 relative" aria-label="Abrir menu"><MenuIcon /></label>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-[22px] sm:text-[24px] md:text-[26px] font-medium text-[var(--color-pine-700)]">Equipe</h1>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-0.5">{team.filter((m) => m.status === "ativo").length} ativos · {team.length} no total</p>
          </div>
          <button onClick={() => setShowConvidar(true)} className="rounded-[10px] bg-[var(--color-pine-600)] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[var(--color-pine-700)] transition-colors">
            + Convidar membro
          </button>
        </div>

        {loading && <p className="text-[13px] text-[var(--color-ink-soft)]">Carregando equipe…</p>}
        {error && <p className="text-[13px] text-[var(--color-terracotta-600)]">{error}</p>}

        {!loading && !error && (
          <div className="flex gap-6 items-start flex-col lg:flex-row">
            <div className="flex-1 flex flex-col gap-6 w-full">
              <div>
                <p className="text-[11px] font-medium text-[var(--color-ink-soft)] uppercase tracking-wide mb-3">Fisioterapeutas</p>
                <div className="grid grid-cols-1 gap-3">
                  {fisios.map((m) => <MemberCard key={m.id} member={m} selected={selected?.id === m.id} onClick={() => setSelected(selected?.id === m.id ? null : m)} />)}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-[var(--color-ink-soft)] uppercase tracking-wide mb-3">Administrativo &amp; Apoio</p>
                <div className="grid grid-cols-1 gap-3">
                  {outros.map((m) => <MemberCard key={m.id} member={m} selected={selected?.id === m.id} onClick={() => setSelected(selected?.id === m.id ? null : m)} />)}
                </div>
              </div>
            </div>

            {selected && (
              <div className="w-full lg:w-[320px] shrink-0 rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] overflow-hidden sticky top-6">
                <MemberPanel
                  member={selected}
                  onClose={() => setSelected(null)}
                  onEditar={() => setShowEditar(true)}
                  onDesativar={() => setShowDesativar(true)}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <ConvidarModal open={showConvidar} onClose={() => setShowConvidar(false)} />
      {selected && <EditarMembroModal open={showEditar} onClose={() => setShowEditar(false)} member={selected} />}
      {selected && <DesativarModal open={showDesativar} onClose={() => setShowDesativar(false)} member={selected} />}
    </div>
  );
}

function MemberCard({ member: m, selected, onClick }: { member: TeamMember; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`text-left rounded-[12px] border px-5 py-4 transition-all ${selected ? "border-[var(--color-pine-400)] bg-[var(--color-pine-50)]" : "border-[var(--color-line)] bg-[var(--color-card)] hover:border-[var(--color-pine-200)]"}`}>
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-medium shrink-0 ${m.color}`}>{m.initials}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] font-medium">{m.name}</p>
            <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${statusStyle[m.status]}`}>{statusLabel[m.status]}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-[12px] text-[var(--color-ink-soft)]">
            <span className="opacity-60">{roleIcon[m.role]}</span>
            <span>{m.role}</span>
            {m.specialty && <span>· {m.specialty}</span>}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[12px] text-[var(--color-ink-soft)]">Desde</p>
          <p className="text-[13px] font-medium">{m.since}</p>
        </div>
      </div>
    </button>
  );
}

function MemberPanel({ member: m, onClose, onEditar, onDesativar }: { member: TeamMember; onClose: () => void; onEditar: () => void; onDesativar: () => void }) {
  return (
    <div>
      <div className={`px-5 py-5 ${m.color}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-[16px] font-medium">{m.initials}</div>
            <div>
              <p className="font-display text-[16px] font-medium">{m.name}</p>
              <p className="text-[12px] opacity-70 mt-0.5">{m.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
      </div>
      <div className="px-5 py-5 flex flex-col gap-4">
        <span className={`self-start text-[11px] font-medium rounded-full px-2.5 py-1 ${statusStyle[m.status]}`}>{statusLabel[m.status]}</span>
        <div className="flex flex-col gap-3">
          {m.crefito && <InfoItem label="CREFITO" value={m.crefito} />}
          {m.specialty && <InfoItem label="Especialidade" value={m.specialty} />}
          <InfoItem label="E-mail" value={m.email} />
          <InfoItem label="Telefone" value={m.phone} />
          <InfoItem label="Na equipe desde" value={m.since} />
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <button onClick={onEditar} className="w-full rounded-[10px] border border-[var(--color-line)] py-2.5 text-[13px] font-medium hover:bg-[var(--color-paper)] transition-colors">Editar dados</button>
          <button onClick={onDesativar} className="w-full rounded-[10px] border border-[var(--color-line)] py-2.5 text-[13px] font-medium text-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-100)] transition-colors">
            {m.status === "ativo" ? "Desativar acesso" : "Reativar acesso"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-[var(--color-ink-soft)]">{label}</p>
      <p className="text-[13px] font-medium mt-0.5">{value}</p>
    </div>
  );
}
