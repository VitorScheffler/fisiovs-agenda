import Link from "next/link";
import { Logo } from "@/components/Logo";

const screens = [
  { href: "/login", title: "Login", description: "Tela de acesso para fisioterapeuta, secretária e paciente." },
  { href: "/agenda", title: "Agenda", description: "Painel principal com a agenda semanal e solicitações pendentes." },
  { href: "/agendar", title: "Agendar horário", description: "Tela do paciente para visualizar e marcar horários disponíveis." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <h1 className="font-display text-[22px] font-medium text-[var(--color-pine-700)] mb-1">
          Protótipo da agenda
        </h1>
        <p className="text-[13px] text-[var(--color-ink-soft)] mb-8">
          Escolha uma tela para visualizar
        </p>
        <div className="flex flex-col gap-3">
          {screens.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-[12px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 text-left hover:border-[var(--color-pine-400)] transition-colors"
            >
              <p className="text-[14px] font-medium text-[var(--color-pine-700)]">{s.title}</p>
              <p className="text-[12px] text-[var(--color-ink-soft)] mt-0.5">{s.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
