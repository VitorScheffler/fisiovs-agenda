import { Logo } from "@/components/Logo";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Painel de marca */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--color-pine-700)] overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 600 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <circle cx="500" cy="120" r="220" fill="var(--color-pine-600)" opacity="0.6" />
          <circle cx="80" cy="650" r="260" fill="var(--color-pine-900)" opacity="0.5" />
          <path
            d="M120 480C160 380 260 380 300 460C340 540 440 540 480 460"
            stroke="var(--color-terracotta-400)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
        </svg>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Logo className="[&_p]:text-white [&_p:last-child]:text-[var(--color-pine-100)]" />

          <div>
            <h2 className="font-display text-[34px] leading-tight font-medium max-w-sm">
              Cuidando do seu corpo com excelência
            </h2>
            <p className="text-[14px] text-[var(--color-pine-100)] mt-4 max-w-sm">
              Atendimento fisioterapêutico humanizado, focado na sua recuperação, funcionalidade e qualidade de vida.
            </p>
          </div>

          <p className="text-[12px] text-[var(--color-pine-200)]">
            FisioVS &middot; agenda.fisiovs.com.br
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--color-paper)]">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10">
            <Logo />
          </div>

          <h1 className="font-display text-[26px] font-medium text-[var(--color-pine-700)]">
            Bem-vindo de volta
          </h1>
          <p className="text-[13px] text-[var(--color-ink-soft)] mt-1 mb-8">
            Faça login para acessar sua agenda
          </p>

          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-card)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="senha" className="block text-[13px] font-medium">
                  Senha
                </label>
                <a href="#" className="text-[12px] text-[var(--color-pine-600)] hover:underline">
                  Esqueci minha senha
                </a>
              </div>
              <input
                id="senha"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-card)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-[10px] bg-[var(--color-pine-600)] text-white text-[14px] font-medium py-2.5 mt-2 hover:bg-[var(--color-pine-700)] transition-colors"
            >
              Entrar
            </button>
          </form>

          <p className="text-center text-[13px] text-[var(--color-ink-soft)] mt-6">
            Ainda não tem conta?{" "}
            <a href="#" className="text-[var(--color-pine-600)] font-medium hover:underline">
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
