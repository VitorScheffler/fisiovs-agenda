"use client";

import { useEffect } from "react";

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(15,127,131,0.12)", backdropFilter: "blur(2px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>
  );
}

export function ModalBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[var(--color-card)] rounded-[16px] shadow-xl w-full max-w-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function ModalHeader({ title, subtitle, onClose }: { title: string; subtitle?: string; onClose: () => void }) {
  return (
    <div className="px-6 pt-6 pb-2 flex items-start justify-between gap-3">
      <div>
        <h2 className="font-display text-[18px] font-medium text-[var(--color-pine-700)]">{title}</h2>
        {subtitle && <p className="text-[12px] text-[var(--color-ink-soft)] mt-0.5">{subtitle}</p>}
      </div>
      <button
        onClick={onClose}
        className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center hover:bg-[var(--color-paper)] text-[var(--color-ink-soft)] transition-colors shrink-0"
        aria-label="Fechar"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="px-6 py-4 flex flex-col gap-3">{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 pb-6 pt-2 flex gap-2">
      {children}
    </div>
  );
}

export function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-[var(--color-ink-soft)] uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="rounded-[10px] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)] disabled:opacity-60 w-full"
    />
  );
}

export function SelectInput({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-[10px] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[13px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)] w-full"
    >
      {children}
    </select>
  );
}

export function BtnPrimary({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 rounded-[10px] bg-[var(--color-pine-600)] text-white py-2.5 text-[13px] font-medium hover:bg-[var(--color-pine-700)] transition-colors disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function BtnSecondary({ children, onClick, danger }: { children: React.ReactNode; onClick?: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-[10px] border border-[var(--color-line)] py-2.5 text-[13px] font-medium transition-colors ${danger ? "text-[var(--color-terracotta-600)] hover:bg-[var(--color-terracotta-100)]" : "hover:bg-[var(--color-paper)]"}`}
    >
      {children}
    </button>
  );
}
