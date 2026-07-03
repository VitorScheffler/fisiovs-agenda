"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";

// ---------------------------------------------------------------------------
// Modal de Criar Conta
// ---------------------------------------------------------------------------
function CriarContaModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (email: string, password: string) => void;
}) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"secretaria" | "fisioterapeuta" | "admin">("secretaria");
  const [specialty, setSpecialty] = useState("");
  const [crefito, setCrefito] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setStep("form");
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
    setRole("secretaria"); setSpecialty(""); setCrefito("");
    setInviteCode(""); setError("");
  }

  function handleClose() { reset(); onClose(); }

  async function handleSubmit() {
    setError("");

    if (!name.trim() || !email.trim() || !password || !inviteCode.trim()) {
      setError("Preencha todos os campos obrigatórios."); return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres."); return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem."); return;
    }
    if ((role === "fisioterapeuta" || role === "admin") && !crefito.trim()) {
      setError("CREFITO é obrigatório para fisioterapeutas."); return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password, role, specialty, crefito, inviteCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao criar conta.");
        return;
      }
      setStep("success");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-[var(--color-card)] rounded-[20px] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--color-line)] flex items-center justify-between">
          <div>
            <h2 className="font-display text-[18px] font-medium text-[var(--color-pine-700)]">
              {step === "success" ? "Conta criada!" : "Criar conta"}
            </h2>
            {step === "form" && (
              <p className="text-[12px] text-[var(--color-ink-soft)] mt-0.5">Acesso restrito à equipe FisioVS</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-paper)] text-[var(--color-ink-soft)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success */}
        {step === "success" && (
          <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--color-pine-50)] flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-pine-600)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-[16px] text-[var(--color-pine-700)]">Bem-vindo(a), {name.split(" ")[0]}!</p>
              <p className="text-[13px] text-[var(--color-ink-soft)] mt-1">Sua conta foi criada. Você já está logado(a).</p>
            </div>
            <button
              onClick={() => { reset(); onSuccess(email, password); }}
              className="w-full rounded-[10px] bg-[var(--color-pine-600)] text-white text-[14px] font-medium py-2.5 hover:bg-[var(--color-pine-700)] transition-colors mt-2"
            >
              Acessar o sistema
            </button>
          </div>
        )}

        {/* Form */}
        {step === "form" && (
          <div className="px-6 py-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Nome completo <span className="text-[var(--color-terracotta-600)]">*</span></label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Ana Beatriz Santos"
                className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]" />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">E-mail <span className="text-[var(--color-terracotta-600)]">*</span></label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@fisiovs.com"
                className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]" />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Função</label>
              <select value={role} onChange={(e) => setRole(e.target.value as typeof role)}
                className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]">
                <option value="secretaria">Secretária</option>
                <option value="fisioterapeuta">Fisioterapeuta</option>
                <option value="admin">Admin (Proprietário)</option>
              </select>
            </div>
            {(role === "fisioterapeuta" || role === "admin") && (
              <>
                <div>
                  <label className="block text-[13px] font-medium mb-1.5">CREFITO <span className="text-[var(--color-terracotta-600)]">*</span></label>
                  <input type="text" value={crefito} onChange={(e) => setCrefito(e.target.value)} placeholder="Ex: CREFITO-5 / 123456-F"
                    className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium mb-1.5">Especialidade</label>
                  <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Ex: Fisioterapia Ortopédica"
                    className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]" />
                </div>
              </>
            )}
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Senha <span className="text-[var(--color-terracotta-600)]">*</span></label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                  className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 pr-10 text-[14px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]" />
                <button type="button" onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
                  {showPassword
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  }
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Confirmar senha <span className="text-[var(--color-terracotta-600)]">*</span></label>
              <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha"
                className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]" />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1.5">Código de convite <span className="text-[var(--color-terracotta-600)]">*</span></label>
              <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Solicite ao administrador"
                className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-paper)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]" />
              <p className="text-[11px] text-[var(--color-ink-soft)] mt-1">Cadastro restrito à equipe. Solicite o código ao administrador.</p>
            </div>
            {error && <p className="text-[12px] text-[var(--color-terracotta-600)] -mt-1">{error}</p>}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-[10px] bg-[var(--color-pine-600)] text-white text-[14px] font-medium py-2.5 hover:bg-[var(--color-pine-700)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? "Criando conta…" : "Criar conta"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Página de Login
// ---------------------------------------------------------------------------
export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  async function handleLogin() {
    setError("");

    if (!email || !password) {
      setError("Preencha e-mail e senha para continuar.");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if ("error" in result) {
      setError(result.error);
      return;
    }

    if (result.user.role === "paciente") {
      router.push("/agendar");
    } else {
      router.push("/home");
    }
  }

  async function handleRegisterSuccess(registeredEmail: string, registeredPassword: string) {
    setShowRegister(false);
    setLoading(true);
    const result = await login(registeredEmail, registeredPassword);
    setLoading(false);
    if (!("error" in result)) {
      router.push("/home");
    }
  }

  return (
    <>
      <div className="min-h-screen flex">
        {/* Painel de marca */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-[var(--color-pine-700)] overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <circle cx="500" cy="120" r="220" fill="var(--color-pine-600)" opacity="0.6" />
            <circle cx="80" cy="650" r="260" fill="var(--color-pine-900)" opacity="0.5" />
            <path d="M120 480C160 380 260 380 300 460C340 540 440 540 480 460" stroke="var(--color-terracotta-400)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
          </svg>
          <div className="relative z-10 flex flex-col justify-between p-12 text-white">
            <Logo className="[&_p]:text-white [&_p:last-child]:text-[var(--color-pine-100)]" />
            <div>
              <h2 className="font-display text-[34px] leading-tight font-medium max-w-sm">Cuidando do seu corpo com excelência</h2>
              <p className="text-[14px] text-[var(--color-pine-100)] mt-4 max-w-sm">Atendimento fisioterapêutico humanizado, focado na sua recuperação, funcionalidade e qualidade de vida.</p>
            </div>
            <p className="text-[12px] text-[var(--color-pine-200)]">FisioVS &middot; agenda.fisiovs.com.br</p>
          </div>
        </div>

        {/* Formulário */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[var(--color-paper)]">
          <div className="w-full max-w-sm">
            <div className="lg:hidden mb-10"><Logo /></div>

            <h1 className="font-display text-[26px] font-medium text-[var(--color-pine-700)]">Bem-vindo de volta</h1>
            <p className="text-[13px] text-[var(--color-ink-soft)] mt-1 mb-8">Faça login para acessar sua agenda</p>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="block text-[13px] font-medium mb-1.5">E-mail</label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-card)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="senha" className="block text-[13px] font-medium">Senha</label>
                  <a href="#" className="text-[12px] text-[var(--color-pine-600)] hover:underline">Esqueci minha senha</a>
                </div>
                <input
                  id="senha"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full rounded-[10px] border border-[var(--color-line)] bg-[var(--color-card)] px-3.5 py-2.5 text-[14px] outline-none focus:border-[var(--color-pine-400)] focus:ring-2 focus:ring-[var(--color-pine-100)]"
                />
              </div>

              {error && <p className="text-[12px] text-[var(--color-terracotta-600)] -mt-1">{error}</p>}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full rounded-[10px] bg-[var(--color-pine-600)] text-white text-[14px] font-medium py-2.5 mt-2 hover:bg-[var(--color-pine-700)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Entrando…" : "Entrar"}
              </button>
            </div>

            <p className="text-center text-[13px] text-[var(--color-ink-soft)] mt-6">
              Ainda não tem conta?{" "}
              <button onClick={() => setShowRegister(true)} className="text-[var(--color-pine-600)] font-medium hover:underline">
                Criar conta
              </button>
            </p>
          </div>
        </div>
      </div>

      <CriarContaModal open={showRegister} onClose={() => setShowRegister(false)} onSuccess={handleRegisterSuccess} />
    </>
  );
}