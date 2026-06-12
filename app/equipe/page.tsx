"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TEAM } from "@/lib/team";

type TeamMember = {
  id: string;
  name: string;
  role: "Fisioterapeuta" | "Secretária" | "Auxiliar";
  status: "ativo" | "inativo" | "ferias";
  initials: string;
  color: string;
  email: string;
  phone: string;
  since: string;
  specialty?: string;
  crefito?: string;
};

const statusLabel = { ativo: "Ativo", inativo: "Inativo", ferias: "Férias" } as const;
const statusStyle = {
  ativo: "bg-[var(--color-pine-50)] text-[var(--color-pine-700)]",
  inativo: "bg-[var(--color-cat-bloqueado-bg)] text-[var(--color-ink-soft)]",
  ferias: "bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-600)]",
} as const;

const roleIcon: Record<string, React.ReactNode> = {
  Fisioterapeuta: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 1 0 0 10A5 5 0 0 0 12 2zM12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z" />
    </svg>
  ),
  Secretária: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
  Auxiliar: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
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

export default function EquipePage() {
  const [team] = useState<TeamMember[]>(TEAM);
  const [selected, setSelected] = useState<TeamMember | null>(null);

  const fisios = team.filter((m) => m.role === "Fisioterapeuta");
  const outros = team.filter((m) => m.role !== "Fisioterapeuta");

  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] relative">
      {/* Checkbox escondido para controlar o menu mobile */}
      <input type="checkbox" id="menu-toggle" className="peer hidden" />

      {/* Sidebar no desktop */}
      <div className="hidden lg:contents">
        <Sidebar active="equipe" userName="Vitoria Scheffler" userRole="Fisioterapeuta" />
      </div>

      {/* Overlay do menu mobile */}
      <div className="fixed inset-0 z-50 hidden peer-checked:block lg:hidden">
        {/* Fundo escuro */}
        <label htmlFor="menu-toggle" className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Painel do menu */}
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--color-card)] shadow-xl animate-slide-in-left">
          {/* Botão de fechar */}
          <label
            htmlFor="menu-toggle"
            className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[var(--color-card)] hover:bg-[var(--color-paper)] border border-[var(--color-line)] cursor-pointer"
            aria-label="Fechar menu"
          >
            <CloseIcon />
          </label>

          {/* Sidebar com altura total */}
          <div className="h-full">
            <Sidebar active="equipe" userName="Vitoria Scheffler" userRole="Fisioterapeuta" />
          </div>
        </div>
      </div>

      <main className="flex-1 min-w-0 px-4 py-5 sm:px-6 md:px-8 md:py-6">
        {/* Botão do menu mobile */}
        <label
          htmlFor="menu-toggle"
          className="lg:hidden inline-flex mb-4 p-2 rounded-lg hover:bg-[var(--color-card)] border border-[var(--color-line)] cursor-pointer z-30 relative"
          aria-label="Abrir menu"
        >
          <MenuIcon />
        </label>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-[22px] sm:text-[24px] md:text-[26px] font-medium text-[var(--color-pine-700)]">Equipe</h1>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-0.5">
              {team.filter((m) => m.status === "ativo").length} ativos · {team.length} no total
            </p>
          </div>
          <button className="rounded-[10px] bg-[var(--color-pine-600)] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[var(--color-pine-700)] transition-colors">
            + Convidar membro
          </button>
        </div>

        <div className="flex gap-6 items-start flex-col lg:flex-row">
          {/* Coluna principal */}
          <div className="flex-1 flex flex-col gap-6 w-full">
            {/* Fisioterapeutas */}
            <div>
              <p className="text-[11px] font-medium text-[var(--color-ink-soft)] uppercase tracking-wide mb-3">Fisioterapeutas</p>
              <div className="grid grid-cols-1 gap-3">
                {fisios.map((m) => (
                  <MemberCard key={m.id} member={m} selected={selected?.id === m.id} onClick={() => setSelected(selected?.id === m.id ? null : m)} />
                ))}
              </div>
            </div>

            {/* Outros */}
            <div>
              <p className="text-[11px] font-medium text-[var(--color-ink-soft)] uppercase tracking-wide mb-3">Administrativo & Apoio</p>
              <div className="grid grid-cols-1 gap-3">
                {outros.map((m) => (
                  <MemberCard key={m.id} member={m} selected={selected?.id === m.id} onClick={() => setSelected(selected?.id === m.id ? null : m)} />
                ))}
              </div>
            </div>
          </div>

          {/* Painel lateral do membro */}
          {selected && (
            <div className="w-full lg:w-[320px] shrink-0 rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] overflow-hidden sticky top-6">
              <MemberPanel member={selected} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function MemberCard({ member: m, selected, onClick }: { member: TeamMember; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-[12px] border px-5 py-4 transition-all ${
        selected
          ? "border-[var(--color-pine-400)] bg-[var(--color-pine-50)]"
          : "border-[var(--color-line)] bg-[var(--color-card)] hover:border-[var(--color-pine-200)]"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-medium shrink-0 ${m.color}`}>
          {m.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] font-medium">{m.name}</p>
            <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${statusStyle[m.status]}`}>
              {statusLabel[m.status]}
            </span>
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

function MemberPanel({ member: m, onClose }: { member: TeamMember; onClose: () => void }) {
  return (
    <div>
      {/* Header */}
      <div className={`px-5 py-5 ${m.color}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-[16px] font-medium">
              {m.initials}
            </div>
            <div>
              <p className="font-display text-[16px] font-medium">{m.name}</p>
              <p className="text-[12px] opacity-70 mt-0.5">{m.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="opacity-60 hover:opacity-100 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Detalhes */}
      <div className="px-5 py-5 flex flex-col gap-4">
        <span className={`self-start text-[11px] font-medium rounded-full px-2.5 py-1 ${statusStyle[m.status]}`}>
          {statusLabel[m.status]}
        </span>

        <div className="flex flex-col gap-3">
          {m.crefito && <InfoItem label="CREFITO" value={m.crefito} />}
          {m.specialty && <InfoItem label="Especialidade" value={m.specialty} />}
          <InfoItem label="E-mail" value={m.email} />
          <InfoItem label="Telefone" value={m.phone} />
          <InfoItem label="Na equipe desde" value={m.since} />
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button className="w-full rounded-[10px] border border-[var(--color-line)] py-2.5 text-[13px] font-medium hover:bg-[var(--color-paper)] transition-colors">
            Editar dados
          </button>
          <button className="w-full rounded-[10px] border border-[var(--color-line)] py-2.5 text-[13px] font-medium text-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-100)] transition-colors">
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