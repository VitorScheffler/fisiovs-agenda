"use client";

import { useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";

type AvatarUploadProps = {
  uploadUrl: string; // ex: "/api/team/abc123/avatar"
  currentAvatar?: string | null;
  initials: string;
  color?: string;
  onChanged: (avatarUrl: string | null) => void;
};

export function AvatarUpload({ uploadUrl, currentAvatar, initials, color, onChanged }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFileSelected(file: File) {
    setBusy(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await fetch(uploadUrl, { method: "POST", credentials: "include", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Erro ao enviar imagem.");
        return;
      }
      const newAvatar: string | null = data.member?.avatar ?? data.patient?.avatar ?? null;
      onChanged(newAvatar);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleRemove() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(uploadUrl, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Erro ao remover imagem.");
        return;
      }
      onChanged(null);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar src={currentAvatar} initials={initials} color={color} size="w-16 h-16" />
      <div className="flex flex-col gap-1.5">
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="text-[12px] font-medium rounded-[8px] border border-[var(--color-line)] px-3 py-1.5 hover:border-[var(--color-pine-300)] disabled:opacity-50"
          >
            {busy ? "Enviando…" : currentAvatar ? "Trocar foto" : "Adicionar foto"}
          </button>
          {currentAvatar && (
            <button
              type="button"
              disabled={busy}
              onClick={handleRemove}
              className="text-[12px] font-medium rounded-[8px] border border-[var(--color-line)] px-3 py-1.5 text-[var(--color-terracotta-600)] hover:border-[var(--color-terracotta-300)] disabled:opacity-50"
            >
              Remover
            </button>
          )}
        </div>
        {error && <p className="text-[11px] text-[var(--color-terracotta-600)]">{error}</p>}
        <p className="text-[11px] text-[var(--color-ink-soft)]">JPG, PNG, WEBP ou GIF · até 5MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelected(file);
        }}
      />
    </div>
  );
}
