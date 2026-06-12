import { Sidebar } from "@/components/Sidebar";

export default function SolicitacoesPage() {
  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] relative">
      {/* Checkbox escondido para o menu mobile */}
      <input type="checkbox" id="menu-toggle" className="peer hidden" />

      {/* Sidebar no desktop */}
      <div className="hidden lg:contents">
        <Sidebar active="solicitacoes" userName="Vitoria Scheffler" userRole="Fisioterapeuta" />
      </div>

      {/* Overlay do menu mobile */}
      <div className="fixed inset-0 z-50 hidden peer-checked:block lg:hidden">
        <label htmlFor="menu-toggle" className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-[var(--color-card)] shadow-xl animate-slide-in-left">
          <label
            htmlFor="menu-toggle"
            className="absolute top-4 right-4 z-20 p-2 rounded-lg bg-[var(--color-card)] hover:bg-[var(--color-paper)] border border-[var(--color-line)] cursor-pointer"
            aria-label="Fechar menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </label>
          <div className="h-full">
            <Sidebar active="solicitacoes" userName="Vitoria Scheffler" userRole="Fisioterapeuta" />
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </label>

        <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3">
          <div>
            <h1 className="font-display text-[22px] sm:text-[24px] md:text-[26px] font-medium text-[var(--color-pine-700)]">
              Solicitações
            </h1>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1">
              Gerencie solicitações enviadas pelos pacientes.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-terracotta-100)] px-3 py-1 text-[13px] font-medium text-[var(--color-terracotta-600)]">
            2 pendentes
          </span>
        </div>

        <div className="space-y-4">
          {/* Solicitação 1 */}
          <div className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
              <div>
                <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">
                  Novo agendamento
                </span>

                <h3 className="mt-3 text-[15px] sm:text-[16px] font-medium">
                  Maria Silva
                </h3>

                <p className="mt-1 text-[12px] sm:text-[13px] text-[var(--color-ink-soft)]">
                  Solicitou um horário.
                </p>

                <p className="mt-4 text-[13px]">
                  <span className="text-[var(--color-ink-soft)]">
                    Preferência:
                  </span>{" "}
                  16/06 • 14:00
                </p>

                <p className="mt-1 text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">
                  Recebido há 2 horas
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button className="rounded-[10px] border border-[var(--color-line)] px-4 py-2 text-[13px] hover:bg-[var(--color-paper)] transition-colors">
                  Recusar
                </button>
                <button className="rounded-[10px] bg-[var(--color-pine-600)] px-4 py-2 text-[13px] font-medium text-white hover:bg-[var(--color-pine-700)] transition-colors">
                  Aceitar
                </button>
              </div>
            </div>
          </div>

          {/* Solicitação 2 */}
          <div className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
              <div>
                <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700">
                  Remarcação
                </span>

                <h3 className="mt-3 text-[15px] sm:text-[16px] font-medium">
                  João Pereira
                </h3>

                <div className="mt-4 space-y-1 text-[13px]">
                  <p>
                    <span className="text-[var(--color-ink-soft)]">
                      De:
                    </span>{" "}
                    16/06 • 09:00
                  </p>
                  <p>
                    <span className="text-[var(--color-ink-soft)]">
                      Para:
                    </span>{" "}
                    17/06 • 15:00
                  </p>
                </div>

                <p className="mt-3 text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">
                  Recebido há 35 minutos
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button className="rounded-[10px] border border-[var(--color-line)] px-4 py-2 text-[13px] hover:bg-[var(--color-paper)] transition-colors">
                  Recusar
                </button>
                <button className="rounded-[10px] bg-[var(--color-pine-600)] px-4 py-2 text-[13px] font-medium text-white hover:bg-[var(--color-pine-700)] transition-colors">
                  Aceitar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}