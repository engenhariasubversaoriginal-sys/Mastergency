import React, { useState } from "react";
import { Sparkles, Mail, Lock, Building, ArrowRight, ArrowLeft, CheckCircle, ShieldAlert, KeyRound, Check, RefreshCw } from "lucide-react";
import { UserProfile, Agency } from "../types";
import { saveUserProfile, saveAgency, getAllUsers, saveAllUsers, getAllAgencies, saveAllAgencies } from "../mockData";

interface AuthProps {
  onAuthSuccess: (user: UserProfile) => void;
  onBackToLanding: () => void;
  initialMode?: "login" | "register";
}

export default function Auth({ onAuthSuccess, onBackToLanding, initialMode = "login" }: AuthProps) {
  const [mode, setMode] = useState<"login" | "register" | "recovery" | "confirm-email">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSsoLoading, setIsSsoLoading] = useState(false);

  // Keep temporary register details to proceed after email confirmation
  const [tempRegisterData, setTempRegisterData] = useState<any | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Por favor, preencha todos os campos.");
      return;
    }

    // Try finding user in stored DB
    const allUsers = getAllUsers();
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      // For demo simplicity, accept the standard password
      if (password === "admin123" || password === "user123" || password.length >= 6) {
        onAuthSuccess(user);
      } else {
        setErrorMsg("Senha incorreta. Use admin123 ou user123 para os acessos rápidos.");
      }
    } else {
      // Automatically fallback create if it's a known tester, or error out
      if (email === "admin@globoai.com") {
        const adminUser: UserProfile = {
          id: "user-456",
          email: "admin@globoai.com",
          fullName: "Carlos Eduardo (Admin)",
          agencyId: "agency-123",
          role: "admin",
          availableCredits: 4,
          totalGenerated: 24,
          totalPublished: 12,
          createdAt: "2026-05-10"
        };
        saveUserProfile(adminUser);
        onAuthSuccess(adminUser);
      } else if (email === "user@globoai.com") {
        const standardUser: UserProfile = {
          id: "user-user1",
          email: "user@globoai.com",
          fullName: "Mariana Costa (User)",
          agencyId: "agency-123",
          role: "user",
          availableCredits: 4,
          totalGenerated: 12,
          totalPublished: 4,
          createdAt: "2026-06-01"
        };
        saveUserProfile(standardUser);
        onAuthSuccess(standardUser);
      } else {
        setErrorMsg("Usuário não encontrado. Crie uma nova conta clicando no link abaixo.");
      }
    }
  };

  const handleRegisterInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!agencyName || !email || !password || !confirmPassword) {
      setErrorMsg("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("As senhas digitadas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    // Save pending register data and switch to confirm-email state
    setTempRegisterData({
      agencyName,
      email,
      password
    });
    setMode("confirm-email");
    setSuccessMsg("Código de confirmação de e-mail enviado!");
  };

  const handleConfirmEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!verificationCode) {
      setErrorMsg("Por favor, digite o código de confirmação.");
      return;
    }

    if (!tempRegisterData) {
      setErrorMsg("Sessão de registro expirada. Recomece o cadastro.");
      setMode("register");
      return;
    }

    const { agencyName: regAgencyName, email: regEmail } = tempRegisterData;

    // Create new Agency in local database
    const agencyId = `agency-${Date.now()}`;
    const newAgency: Agency = {
      id: agencyId,
      name: regAgencyName,
      destinations: ["Canadá", "Irlanda"],
      services: ["Trabalho & Estudo", "Curso de Idiomas"],
      audience: "Estudantes e jovens profissionais buscando intercâmbio",
      tone: "Amigável, inspirador e informativo",
      differentials: "Atendimento completo e consultores certificados",
      createdAt: new Date().toISOString().split("T")[0]
    };

    // Create new User profile with exactly 4 free credits
    const userId = `user-${Date.now()}`;
    const newUser: UserProfile = {
      id: userId,
      email: regEmail,
      fullName: regAgencyName + " Team",
      agencyId: agencyId,
      role: "user",
      availableCredits: 4, // 4 FREE CREDITS FOR TESTING PROMPTS!
      totalGenerated: 0,
      totalPublished: 0,
      createdAt: new Date().toISOString().split("T")[0]
    };

    // Save
    const agencies = getAllAgencies();
    agencies.push(newAgency);
    saveAllAgencies(agencies);
    saveAgency(newAgency);

    const users = getAllUsers();
    users.push(newUser);
    saveAllUsers(users);
    saveUserProfile(newUser);

    setSuccessMsg("E-mail verificado com sucesso! Sua agência recebeu 4 créditos grátis.");
    setTimeout(() => {
      onAuthSuccess(newUser);
    }, 1500);
  };

  const handleGoogleSso = () => {
    setIsSsoLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    setTimeout(() => {
      setIsSsoLoading(false);
      // Simulate Google SSO Success
      const randomId = Math.floor(Math.random() * 1000);
      const ssoEmail = `google.user${randomId}@gmail.com`;
      const ssoAgencyName = `Agência Google S.A.`;

      const agencyId = `agency-sso-${Date.now()}`;
      const newAgency: Agency = {
        id: agencyId,
        name: ssoAgencyName,
        destinations: ["Canadá", "Irlanda", "Austrália"],
        services: ["Trabalho & Estudo", "Curso de Idiomas"],
        audience: "Público geral de intercâmbio",
        tone: "Moderno e inspirador",
        differentials: "Suporte especializado via Google SSO",
        createdAt: new Date().toISOString().split("T")[0]
      };

      const newUser: UserProfile = {
        id: `user-sso-${Date.now()}`,
        email: ssoEmail,
        fullName: `Usuário Google ${randomId}`,
        agencyId: agencyId,
        role: "user",
        availableCredits: 4, // 4 credits
        totalGenerated: 0,
        totalPublished: 0,
        createdAt: new Date().toISOString().split("T")[0]
      };

      // Save
      const agencies = getAllAgencies();
      agencies.push(newAgency);
      saveAllAgencies(agencies);
      saveAgency(newAgency);

      const users = getAllUsers();
      users.push(newUser);
      saveAllUsers(users);
      saveUserProfile(newUser);

      setSuccessMsg("Conectado via Google SSO com sucesso! Ganhou 4 créditos grátis.");
      setTimeout(() => {
        onAuthSuccess(newUser);
      }, 1000);
    }, 1200);
  };

  const handleQuickFill = (targetEmail: string, role: "admin" | "user") => {
    setEmail(targetEmail);
    setPassword(role === "admin" ? "admin123" : "user123");
    setMode("login");
    setErrorMsg("");
    setSuccessMsg(`Preenchido credenciais de ${role === "admin" ? "Administrador" : "Usuário Comum"}!`);
  };

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Insira o seu e-mail cadastrado.");
      return;
    }

    setSuccessMsg("Enviamos um link de redefinição de senha para o seu e-mail!");
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#030712] via-gray-950 to-[#0c1020] flex flex-col justify-center items-center p-6 relative">
      {/* Background glowing decorations */}
      <div className="glow-bg-blue top-1/4 left-1/4" />
      <div className="glow-bg-purple bottom-1/4 right-1/4" />

      {/* Return button */}
      <button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors py-2 px-4 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5"
        id="btn-auth-back"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para a Página Inicial
      </button>

      <div className="w-full max-w-md glass-panel rounded-3xl border border-white/10 p-8 shadow-2xl relative">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-blue via-indigo-500 to-brand-purple rounded-t-3xl" />

        {/* Logo and Greeting */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center shadow-lg shadow-brand-blue/35 mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="font-display font-bold text-2xl text-white">
            {mode === "login" && "Acesse o GloboAI"}
            {mode === "register" && "Crie sua conta"}
            {mode === "confirm-email" && "Confirmação de E-mail"}
            {mode === "recovery" && "Recupere sua senha"}
          </h2>
          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
            {mode === "login" && "Crie conteúdos estratégicos para intercâmbio hoje"}
            {mode === "register" && "Cadastre sua agência e ganhe 4 créditos grátis!"}
            {mode === "confirm-email" && `Enviamos um PIN para o e-mail: ${tempRegisterData?.email}`}
            {mode === "recovery" && "Forneça seu e-mail para receber as instruções"}
          </p>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs text-center flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            {successMsg}
          </div>
        )}

        {/* GOOGLE SINGLE SIGN-ON (SSO) BAR */}
        {(mode === "login" || mode === "register") && (
          <div className="mb-6 space-y-4">
            <button
              onClick={handleGoogleSso}
              disabled={isSsoLoading}
              type="button"
              className="w-full py-3 px-4 bg-white text-gray-900 font-bold rounded-xl shadow-md hover:bg-gray-100 active:scale-99 transition-all flex items-center justify-center gap-3 border border-gray-200"
              id="btn-google-sso"
            >
              {isSsoLoading ? (
                <RefreshCw className="w-5 h-5 text-gray-900 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              )}
              {mode === "login" ? "Entrar com o Google" : "Cadastrar com o Google"}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">ou com e-mail</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@suaagencia.com"
                  className="w-full bg-gray-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => setMode("recovery")}
                  className="text-xs text-brand-blue hover:underline font-semibold"
                >
                  Esqueceu a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha secreta"
                  className="w-full bg-gray-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/30 hover:scale-101 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              id="btn-auth-login-submit"
            >
              Acessar Painel
              <ArrowRight className="w-4.5 h-4.5" />
            </button>

            <div className="text-center pt-4 border-t border-white/5">
              <span className="text-xs text-gray-400">Novo por aqui? </span>
              <button
                type="button"
                onClick={() => setMode("register")}
                className="text-xs text-brand-blue font-bold hover:underline"
              >
                Criar uma conta grátis
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === "register" && (
          <form onSubmit={handleRegisterInitiate} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Nome da Agência / Empresa
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Ex: Globo Intercâmbio"
                  className="w-full bg-gray-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  E-mail de Trabalho
                </label>
                <span className="text-[9px] text-gray-500 font-mono">se não usar SSO do Google</span>
              </div>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contato@suaagencia.com"
                  className="w-full bg-gray-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Escolha Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mín. 6 dgt"
                    className="w-full bg-gray-900/60 border border-white/10 rounded-xl pl-9 pr-2 py-3 text-xs focus:outline-none focus:border-brand-blue text-white"
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    className="w-full bg-gray-900/60 border border-white/10 rounded-xl pl-9 pr-2 py-3 text-xs focus:outline-none focus:border-brand-blue text-white"
                    minLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/30 hover:scale-101 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              id="btn-auth-register-submit"
            >
              Criar minha Agência
              <ArrowRight className="w-4.5 h-4.5" />
            </button>

            <div className="text-center pt-4 border-t border-white/5">
              <span className="text-xs text-gray-400">Já possui uma conta? </span>
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-xs text-brand-blue font-bold hover:underline"
              >
                Fazer login
              </button>
            </div>
          </form>
        )}

        {/* CONFIRM EMAIL VIEW */}
        {mode === "confirm-email" && (
          <form onSubmit={handleConfirmEmail} className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-xs text-blue-300 text-center space-y-1">
              <p className="font-bold">📧 Confirmação Obrigatória</p>
              <p>Digite qualquer código de 6 dígitos para simular a verificação de segurança do seu e-mail corporativo.</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 text-center">
                Código de 6 dígitos enviado por e-mail
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Ex: 782451"
                  className="w-full bg-gray-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-center tracking-widest text-lg font-bold focus:outline-none focus:border-brand-blue text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
              id="btn-auth-confirm-submit"
            >
              <Check className="w-4.5 h-4.5" />
              Confirmar & Ativar Conta (4 Créditos)
            </button>

            <button
              type="button"
              onClick={() => setMode("register")}
              className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Voltar ao Cadastro
            </button>
          </form>
        )}

        {/* RECOVERY FORM */}
        {mode === "recovery" && (
          <form onSubmit={handleRecovery} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@suaagencia.com"
                  className="w-full bg-gray-900/60 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/15 transition-all flex items-center justify-center gap-2"
              id="btn-auth-recovery-submit"
            >
              Enviar link de recuperação
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full py-2.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Voltar para o Login
            </button>
          </form>
        )}

        {/* TEST ACCOUNTS SHORTCUT PANEL */}
        {(mode === "login" || mode === "register") && (
          <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
            <div className="flex items-center gap-1.5 text-brand-blue">
              <ShieldAlert className="w-4 h-4" />
              <h4 className="text-[10px] font-extrabold uppercase tracking-widest">Acessos de Teste Rápidos</h4>
            </div>
            <p className="text-[10px] text-gray-500 leading-normal">
              Utilize os botões abaixo para preencher as credenciais e alternar os níveis de permissão instantaneamente:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill("admin@globoai.com", "admin")}
                className="p-2 bg-brand-blue/5 hover:bg-brand-blue/10 border border-brand-blue/15 hover:border-brand-blue/30 text-[11px] font-bold text-brand-blue rounded-xl transition-all text-left flex flex-col justify-between"
              >
                <span>🔑 Admin Login</span>
                <span className="text-[9px] text-gray-400 font-normal">Painel Admin Ativo</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill("user@globoai.com", "user")}
                className="p-2 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/15 hover:border-indigo-500/30 text-[11px] font-bold text-indigo-400 rounded-xl transition-all text-left flex flex-col justify-between"
              >
                <span>👤 User Login</span>
                <span className="text-[9px] text-gray-400 font-normal">4 Créditos Grátis</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
