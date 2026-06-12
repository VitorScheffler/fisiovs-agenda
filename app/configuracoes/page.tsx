import { Sidebar } from "@/components/Sidebar";

// Ícones SVG inline
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

export default function ConfiguracoesPage() {
  return (
    <div className="flex min-h-screen bg-[var(--color-paper)] relative">
      {/* Checkbox escondido para controlar o menu mobile */}
      <input
        type="checkbox"
        id="menu-toggle"
        className="peer hidden"
      />

      {/* Sidebar no desktop */}
      <div className="hidden lg:contents">
        <Sidebar
          active="config"
          userName="Vitoria Scheffler"
          userRole="Fisioterapeuta"
        />
      </div>

      {/* Overlay do menu mobile (CSS puro) */}
      <div className="fixed inset-0 z-50 hidden peer-checked:block lg:hidden">
        {/* Fundo escuro */}
        <label
          htmlFor="menu-toggle"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

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
            <Sidebar
              active="config"
              userName="Vitoria Scheffler"
              userRole="Fisioterapeuta"
            />
          </div>
        </div>
      </div>

      <main className="flex-1 min-w-0 px-4 py-5 sm:px-6 md:px-8 md:py-6">
        {/* Botão do menu mobile (label para o checkbox) */}
        <label
          htmlFor="menu-toggle"
          className="lg:hidden inline-flex mb-4 p-2 rounded-lg hover:bg-[var(--color-card)] border border-[var(--color-line)] cursor-pointer z-30 relative"
          aria-label="Abrir menu"
        >
          <MenuIcon />
        </label>

        {/* Cabeçalho */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display text-[22px] sm:text-[24px] md:text-[26px] font-medium text-[var(--color-pine-700)] leading-tight">
            Configurações
          </h1>
          <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1 max-w-md">
            Gerencie preferências, integrações e informações da sua conta.
          </p>
        </div>

        {/* Grid responsivo */}
        <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Perfil */}
          <section className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 md:p-6">
            <h2 className="text-[17px] sm:text-[18px] font-medium text-[var(--color-pine-700)]">Perfil</h2>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1">Atualize suas informações pessoais.</p>

            <div className="mt-4 sm:mt-5 space-y-3 text-[13px] sm:text-[14px]">
              <div>
                <p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">Nome</p>
                <p className="break-words">Vitória Scheffler</p>
              </div>
              <div>
                <p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">E-mail</p>
                <p className="break-all">vitoria@email.com</p>
              </div>
              <div>
                <p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">Telefone</p>
                <p>(51) 99999-9999</p>
              </div>
            </div>

            <button className="mt-5 sm:mt-6 w-full sm:w-auto rounded-[10px] border border-[var(--color-line)] px-4 py-2.5 text-[13px] font-medium hover:bg-[var(--color-paper)] transition-colors">
              Editar perfil
            </button>
          </section>

          {/* Agenda */}
          <section className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 md:p-6">
            <h2 className="text-[17px] sm:text-[18px] font-medium text-[var(--color-pine-700)]">Agenda</h2>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1">Configure seus horários de atendimento.</p>

            <div className="mt-4 sm:mt-5 space-y-3 text-[13px] sm:text-[14px]">
              <div>
                <p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">Horário padrão</p>
                <p>08:00 – 18:00</p>
              </div>
              <div>
                <p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">Duração padrão da consulta</p>
                <p>60 minutos</p>
              </div>
              <div>
                <p className="text-[11px] sm:text-[12px] text-[var(--color-ink-soft)]">Intervalo entre atendimentos</p>
                <p>15 minutos</p>
              </div>
            </div>

            <button className="mt-5 sm:mt-6 w-full sm:w-auto rounded-[10px] border border-[var(--color-line)] px-4 py-2.5 text-[13px] font-medium hover:bg-[var(--color-paper)] transition-colors">
              Configurar agenda
            </button>
          </section>

          {/* Integrações */}
          <section className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 md:p-6">
            <h2 className="text-[17px] sm:text-[18px] font-medium text-[var(--color-pine-700)]">Integrações</h2>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1">Conecte serviços externos para sincronizar sua agenda.</p>

            <div className="mt-4 sm:mt-5">
              <h3 className="font-medium text-[14px] sm:text-[15px]">Google Agenda</h3>
              <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1">Sincronize automaticamente seus agendamentos com o Google Calendar.</p>

              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] sm:text-[12px] bg-yellow-50 text-yellow-700 mt-3 sm:mt-4">
                ● Não conectado
              </span>

              <button className="mt-5 sm:mt-6 w-full sm:w-auto rounded-[10px] bg-[var(--color-pine-600)] text-white text-[13px] font-medium px-4 py-2.5 hover:bg-[var(--color-pine-700)] transition-colors">
                Conectar com Google
              </button>
            </div>
          </section>

          {/* Segurança */}
          <section className="rounded-[14px] border border-[var(--color-line)] bg-[var(--color-card)] p-4 sm:p-5 md:p-6">
            <h2 className="text-[17px] sm:text-[18px] font-medium text-[var(--color-pine-700)]">Segurança</h2>
            <p className="text-[12px] sm:text-[13px] text-[var(--color-ink-soft)] mt-1">Gerencie o acesso à sua conta.</p>

            <div className="mt-4 sm:mt-5 space-y-3">
              <button className="w-full text-left rounded-[10px] border border-[var(--color-line)] px-4 py-3 hover:bg-[var(--color-paper)] transition-colors text-[13px] sm:text-[14px]">
                Alterar senha
              </button>
              <button className="w-full text-left rounded-[10px] border border-[var(--color-line)] px-4 py-3 hover:bg-[var(--color-paper)] transition-colors text-[13px] sm:text-[14px]">
                Sessões ativas
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}