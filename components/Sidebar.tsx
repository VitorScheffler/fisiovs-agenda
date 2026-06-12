import Link from "next/link";
import { Logo } from "./Logo";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
};

const icons = {
  agenda: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  ),
  pacientes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" />
      <path d="M16.5 4.5a3.2 3.2 0 0 1 0 6.4M21.5 20c0-2.8-2-4.8-4.8-5.4" />
    </svg>
  ),
  equipe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M14 9h4M14 12h4M5.5 16c.4-1.4 1.7-2.3 3.5-2.3s3.1 1 3.5 2.3" />
    </svg>
  ),
  solicitacoes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 8v4l2.5 2.5" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  config: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V19.5a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H4.5a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h0a1.7 1.7 0 0 0 1-1.55V4.5a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v0a1.7 1.7 0 0 0 1.55 1H19.5a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z" />
    </svg>
  ),
};

export function Sidebar({
  active,
  userName,
  userRole,
}: {
  active: "agenda" | "pacientes" | "equipe" | "solicitacoes" | "config";
  userName: string;
  userRole: "Fisioterapeuta" | "Secretária";
}) {
  const items: NavItem[] = [
    { label: "Agenda", href: "/agenda", icon: icons.agenda },
    { label: "Pacientes", href: "/pacientes", icon: icons.pacientes },
  ];

  if (userRole === "Fisioterapeuta") {
    items.push({ label: "Equipe", href: "/equipe", icon: icons.equipe });
  }

  items.push({ label: "Solicitações", href: "/solicitacoes", icon: icons.solicitacoes, badge: 1 });
  items.push({ label: "Configurações", href: "/configuracoes", icon: icons.config });

  const initials = userName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <aside className="w-[224px] shrink-0 border-r border-[var(--color-line)] bg-[var(--color-card)] flex flex-col">
      <div className="px-5 py-5 border-b border-[var(--color-line)]">
        <Logo />
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {items.map((item) => {
          const isActive = item.label.toLowerCase().startsWith(active);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between gap-2.5 rounded-[10px] px-3 py-2.5 text-[14px] transition-colors ${
                isActive
                  ? "bg-[var(--color-pine-50)] text-[var(--color-pine-700)] font-medium"
                  : "text-[var(--color-ink-soft)] hover:bg-[var(--color-paper)]"
              }`}
            >
              <span className="flex items-center gap-2.5">
                {item.icon}
                {item.label}
              </span>
              {item.badge ? (
                <span className="text-[11px] font-medium rounded-full px-1.5 py-0.5 bg-[var(--color-terracotta-100)] text-[var(--color-terracotta-600)]">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[var(--color-line)] flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[var(--color-pine-100)] text-[var(--color-pine-700)] flex items-center justify-center text-[12px] font-medium">
          {initials}
        </div>
        <div className="leading-tight">
          <p className="text-[13px] font-medium">{userName}</p>
          <p className="text-[11px] text-[var(--color-ink-soft)]">{userRole}</p>
        </div>
      </div>
    </aside>
  );
}
