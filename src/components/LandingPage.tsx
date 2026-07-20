import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Check, 
  Globe, 
  TrendingUp, 
  Layers, 
  Clock, 
  FileText, 
  Instagram, 
  PlayCircle,
  HelpCircle,
  Zap,
  Coins,
  ChevronDown
} from "lucide-react";
import { ContentFormat, CreditPackage } from "../types";

interface LandingPageProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  packages: CreditPackage[];
}

export default function LandingPage({ onLoginClick, onRegisterClick, packages }: LandingPageProps) {
  // Free trial state
  const [trialCredits, setTrialCredits] = useState<number>(4);
  const [trialDestination, setTrialDestination] = useState<string>("Canadá");
  const [trialService, setTrialService] = useState<string>("Trabalho & Estudo");
  const [trialTheme, setTrialTheme] = useState<string>("Dúvidas sobre o salário mínimo de estudante");
  const [trialFormat, setTrialFormat] = useState<ContentFormat>(ContentFormat.REELS_SCRIPT);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [trialResult, setTrialResult] = useState<any | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Load trial credits on mount
  useEffect(() => {
    const saved = localStorage.getItem("globoai_free_trial_credits");
    if (saved !== null) {
      setTrialCredits(parseInt(saved, 10));
    } else {
      localStorage.setItem("globoai_free_trial_credits", "4");
    }
  }, []);

  const handleFreeGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trialCredits <= 0) {
      setGenerationError("Você esgotou seus créditos de teste gratuito! Cadastre-se em segundos para ganhar mais créditos e salvar seus conteúdos.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);
    setTrialResult(null);

    // Simulated/Real call to the Gemini API using proxy with a basic demo agency structure
    const demoAgency = {
      name: "Agência Demo",
      destinations: ["Canadá", "Irlanda", "Austrália"],
      services: ["Curso de Idiomas", "Trabalho & Estudo", "Consultoria de Visto"],
      audience: "Jovens estudantes",
      tone: "Entusiasta, moderno e claro",
      differentials: "Suporte completo no exterior"
    };

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agency: demoAgency,
          selectedDestination: trialDestination,
          selectedService: trialService,
          theme: trialTheme,
          format: trialFormat,
          objective: "Atrair Clientes",
          funnelStage: "Topo de Funil",
          customContext: "Foco no público que quer viajar nos próximos meses.",
          systemPromptText: `Você é uma IA estrategista de marketing de conteúdo especializada em intercâmbio. Crie um post focado no destino {selectedDestination}, serviço {selectedService} e tema {theme}. Siga o tom {tone}. Retorne no formato JSON com: title, headlines (array de 10), generatedText (completo em markdown), cta, hashtags.`
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Erro ao conectar com o serviço de IA.");
      }

      const data = await response.json();
      setTrialResult(data);

      const newCredits = trialCredits - 1;
      setTrialCredits(newCredits);
      localStorage.setItem("globoai_free_trial_credits", newCredits.toString());
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "Não foi possível gerar o conteúdo agora. Tente novamente em alguns instantes.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden text-gray-100">
      {/* Background glowing decorations */}
      <div className="glow-bg-blue top-[-10%] left-[-10%]" />
      <div className="glow-bg-purple top-[40%] right-[-15%]" />
      <div className="glow-bg-blue bottom-[-10%] left-[20%]" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center shadow-lg shadow-brand-blue/25">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
            GloboAI
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Benefícios</a>
          <a href="#playground" className="hover:text-white transition-colors">Teste Grátis</a>
          <a href="#pricing" className="hover:text-white transition-colors">Planos</a>
          <a href="#faq" className="hover:text-white transition-colors">Como funciona</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLoginClick}
            className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/5"
            id="btn-landing-login"
          >
            Entrar
          </button>
          <button
            onClick={onRegisterClick}
            className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-xl shadow-lg shadow-brand-blue/20 hover:shadow-brand-blue/35 hover:scale-102 transition-all"
            id="btn-landing-register"
          >
            Começar Grátis
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Floating badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/25 text-brand-blue text-xs font-semibold mb-6 animate-fade-in uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 animate-bounce" />
          IA Especializada em Educação Internacional
        </div>

        <h1 className="font-display font-extrabold text-4xl sm:text-6xl max-w-4xl tracking-tight leading-[1.1] mb-6">
          Transforme as dúvidas dos seus clientes em{" "}
          <span className="bg-gradient-to-r from-brand-blue via-indigo-400 to-brand-purple bg-clip-text text-transparent">
            posts virais prontos
          </span>{" "}
          para publicar!
        </h1>

        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
          Crie roteiros de Reels, carrosséis educativos, stories interativos e legendas profissionais
          altamente adaptados para os destinos e vistos que a sua agência vende.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a
            href="#playground"
            className="px-8 py-4 font-bold bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-xl shadow-xl shadow-brand-blue/25 hover:shadow-brand-blue/40 transition-all flex items-center gap-2.5 w-full sm:w-auto justify-center"
          >
            Experimentar na prática
            <ArrowRight className="w-5 h-5" />
          </a>
          <button
            onClick={onRegisterClick}
            className="px-8 py-4 font-bold bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-white/20 transition-all w-full sm:w-auto"
          >
            Criar conta gratuita
          </button>
        </div>

        {/* Dashboard Preview / Bento Section */}
        <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-gray-900/40 p-3 glow-blue relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 via-transparent to-brand-purple/10 rounded-2xl pointer-events-none opacity-50" />
          <div className="rounded-xl overflow-hidden bg-gray-950 border border-white/5 p-6 text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="px-3 py-1 rounded-md bg-white/5 text-xs text-gray-500 font-mono">
                globoai.app/intercambio-sem-fronteiras
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 border-r border-white/5 pr-4 space-y-4">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-mono text-gray-500 font-bold">Perfil da Agência</div>
                  <div className="text-sm font-semibold text-white">✈️ Intercâmbio Austrália & Canadá</div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Tom de voz:</span>
                    <span className="font-medium text-white">Inspirador & Técnico</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Público:</span>
                    <span className="font-medium text-white">Universitários 18-28 anos</span>
                  </div>
                </div>
                <div className="p-3 bg-brand-blue/5 rounded-lg border border-brand-blue/10 text-xs">
                  <div className="font-bold text-brand-blue flex items-center gap-1.5 mb-1">
                    <Zap className="w-3.5 h-3.5" />
                    Master System Prompt Ativo
                  </div>
                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    Estrategista de Marketing v1.2 integrado. A IA molda o texto conforme os vistos mais vendidos.
                  </p>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-blue">
                  <Instagram className="w-4 h-4" />
                  Roteiro de Reels Gerado
                </div>
                <div className="bg-black/50 p-4 rounded-xl border border-white/5 space-y-3 font-sans text-xs">
                  <p className="text-brand-purple font-bold">🎬 [Cena 1 - Gancho Inicial em Dublin]</p>
                  <p className="text-gray-300">
                    "Você sabia que dá pra pagar todo o seu custo de vida na Irlanda trabalhando apenas 20 horas por semana?"
                  </p>
                  <p className="text-brand-purple font-bold">💡 [Cena 2 - Detalhando os gastos reais]</p>
                  <p className="text-gray-300">
                    "O salário mínimo é de €13.50 por hora. Multiplicando pelas 20h permitidas, são €1.080 por mês. Com €200 de supermercado e €500 de aluguel compartilhado, você vive de forma muito tranquila!"
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[11px] bg-white/5 px-2 py-1 rounded text-gray-400">#vidadeestudante</span>
                  <span className="text-[11px] bg-white/5 px-2 py-1 rounded text-gray-400">#intercambioirlanda</span>
                  <span className="text-[11px] bg-white/5 px-2 py-1 rounded text-gray-400">#dublin2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Benefits */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5 relative">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Feito para empresas de Educação Internacional
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Seja você uma agência global ou um consultor independente, a GloboAI gera conteúdos precisos,
            eliminando as respostas genéricas do ChatGPT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 hover:border-brand-blue/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Agências de Intercâmbio</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Gere posts sobre acomodação, passagens, escolas parceiras e dicas de trabalho local em segundos.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 hover:border-brand-blue/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Consultores de Visto</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Explique com autoridade os processos complexos de GTE, comprovação de renda e documentos necessários.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 hover:border-brand-blue/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Escolas de Idiomas</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Crie desafios, ganchos de conversação e stories que valorizem a imersão linguística no exterior.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4 hover:border-brand-blue/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Education Companies</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Construa um funil estratégico (topo, meio e fundo de funil) que gere pedidos de orçamento reais.
            </p>
          </div>
        </div>
      </section>

      {/* Free Trial Playground (Interactive Generation Form) */}
      <section id="playground" className="py-20 px-6 max-w-5xl mx-auto border-t border-white/5">
        <div className="glass-panel rounded-3xl border border-white/10 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-brand-blue/10 border-b border-l border-white/5 text-xs text-brand-blue font-mono font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Live AI Playground
          </div>

          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="font-display font-bold text-3xl text-white mb-2">
              Faça um teste gratuito agora!
            </h2>
            <p className="text-gray-400 text-sm">
              Escolha as opções abaixo e assista à nossa inteligência artificial gerar o conteúdo.
            </p>
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-white/5 rounded-full text-xs text-yellow-400 font-bold border border-white/5">
              <Coins className="w-3.5 h-3.5" />
              Você tem <span className="text-white text-sm px-1 bg-yellow-500/20 rounded">{trialCredits}</span> créditos de teste restantes.
            </div>
          </div>

          <form onSubmit={handleFreeGeneration} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Destino / País
                </label>
                <select
                  value={trialDestination}
                  onChange={(e) => setTrialDestination(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white"
                >
                  <option value="Canadá">Canadá 🇨🇦</option>
                  <option value="Irlanda">Irlanda 🇮🇪</option>
                  <option value="Austrália">Austrália 🇦🇺</option>
                  <option value="Espanha">Espanha 🇪🇸</option>
                  <option value="EUA">EUA 🇺🇸</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Serviço / Programa
                </label>
                <select
                  value={trialService}
                  onChange={(e) => setTrialService(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white"
                >
                  <option value="Trabalho & Estudo">Trabalho & Estudo (Co-op/Work Permit)</option>
                  <option value="Curso de Idiomas">Curso de Idiomas (Inglês/Espanhol)</option>
                  <option value="Consultoria de Visto">Consultoria de Visto de Estudante</option>
                  <option value="College & University">College & Universidade</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Formato do Post
                </label>
                <select
                  value={trialFormat}
                  onChange={(e) => setTrialFormat(e.target.value as ContentFormat)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white"
                >
                  <option value={ContentFormat.REELS_SCRIPT}>Roteiro de Reels / TikTok 🎬</option>
                  <option value={ContentFormat.CAROUSEL}>Carrossel de Imagens 📄</option>
                  <option value={ContentFormat.CAPTIONS}>Legenda Completa 📝</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Dúvida do Cliente / Tema
                </label>
                <input
                  type="text"
                  value={trialTheme}
                  onChange={(e) => setTrialTheme(e.target.value)}
                  placeholder="Ex: Como funciona a comprovação financeira?"
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white placeholder:text-gray-600"
                  required
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isGenerating || trialCredits <= 0}
                className="px-8 py-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl shadow-lg hover:shadow-brand-blue/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 transition-all inline-flex items-center gap-2"
                id="btn-trial-generate"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Estrategista de IA pensando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Gerar Conteúdo Estratégico Grátis
                  </>
                )}
              </button>
            </div>
          </form>

          {generationError && (
            <div className="mt-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm text-center">
              {generationError}
              {trialCredits <= 0 && (
                <button
                  onClick={onRegisterClick}
                  className="block mx-auto mt-3 px-5 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-colors"
                >
                  Registrar minha Agência agora
                </button>
              )}
            </div>
          )}

          {trialResult && (
            <div className="mt-8 border-t border-white/10 pt-8 animate-fade-in space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-400 font-bold flex items-center justify-between">
                <span>✓ Conteúdo gerado com sucesso por GloboAI Strategist!</span>
                <span>Restam {trialCredits} testes</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-gray-500">Sugestões de Headlines</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-300">
                    {trialResult.headlines?.slice(0, 4).map((headline: string, idx: number) => (
                      <div key={idx} className="bg-white/5 p-2 rounded border border-white/5 flex items-start gap-2">
                        <span className="text-brand-blue font-bold">#{idx + 1}</span>
                        <span>{headline}</span>
                      </div>
                    ))}
                    <div className="bg-brand-blue/5 p-2 rounded border border-brand-blue/15 text-brand-blue text-center flex items-center justify-center font-bold col-span-1 md:col-span-2 cursor-pointer" onClick={onRegisterClick}>
                      Ver as outras 6 Headlines e exportar (+ Cadastre-se) →
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs uppercase font-mono tracking-wider text-gray-500">Conteúdo Estruturado</h4>
                  <div className="bg-black/40 p-5 rounded-xl border border-white/5 max-h-[300px] overflow-y-auto text-sm text-gray-200 leading-relaxed space-y-3 font-sans whitespace-pre-line">
                    {trialResult.generatedText}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 bg-white/5 p-4 rounded-xl border border-white/5 text-xs">
                    <span className="font-mono text-gray-500 uppercase font-bold block">Chamada de Ação (CTA)</span>
                    <p className="text-brand-purple font-semibold">{trialResult.cta}</p>
                  </div>

                  <div className="space-y-1.5 bg-white/5 p-4 rounded-xl border border-white/5 text-xs">
                    <span className="font-mono text-gray-500 uppercase font-bold block">Hashtags Recomendadas</span>
                    <p className="text-brand-blue font-mono">{trialResult.hashtags?.map((h: string) => `#${h}`).join(" ")}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-brand-blue/15 to-brand-purple/15 rounded-xl border border-brand-blue/30 p-4 text-center">
                <p className="text-sm font-semibold text-white mb-3">
                  Gostou da geração? Crie uma conta para acessar layouts personalizados para mais de 15 países!
                </p>
                <button
                  onClick={onRegisterClick}
                  className="px-6 py-2 bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-lg text-xs font-bold shadow hover:scale-103 transition-all"
                >
                  Registrar e salvar na Biblioteca →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Plans Section */}
      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Planos sob medida para o seu orçamento
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Sem contratos de fidelidade. Adquira créditos e use no seu próprio ritmo para manter suas redes ativas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pack) => (
            <div
              key={pack.id}
              className={`p-8 rounded-2xl border flex flex-col justify-between relative transition-all ${
                pack.popular
                  ? "bg-gradient-to-b from-gray-900 via-gray-900 to-indigo-950/40 border-brand-blue glow-blue"
                  : "bg-white/5 border-white/5"
              }`}
            >
              {pack.popular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-brand-blue text-white text-[10px] uppercase font-bold tracking-widest">
                  Mais Popular
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{pack.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">{pack.description}</p>

                <div className="flex items-baseline gap-1.5 mb-6 border-b border-white/5 pb-6">
                  <span className="text-sm text-gray-500 font-bold">R$</span>
                  <span className="text-4xl font-extrabold text-white">{pack.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 font-medium">pagamento único</span>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-brand-blue/15 flex items-center justify-center text-brand-blue">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>
                      <strong className="text-white">{pack.creditsAmount}</strong> gerações de IA completas
                    </span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-brand-blue/15 flex items-center justify-center text-brand-blue">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Biblioteca e exportação ilimitada</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-brand-blue/15 flex items-center justify-center text-brand-blue">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Organização em Kanban & Calendário</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-brand-blue/15 flex items-center justify-center text-brand-blue">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Suporte prioritário via chat</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onRegisterClick}
                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all ${
                  pack.popular
                    ? "bg-gradient-to-r from-brand-blue to-brand-purple text-white shadow-lg shadow-brand-blue/20 hover:scale-102"
                    : "bg-white/10 text-white hover:bg-white/15"
                }`}
              >
                Comprar Créditos Agora
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ / Footer */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto border-t border-white/5">
        <h2 className="font-display font-bold text-3xl text-center mb-12">Dúvidas Frequentes</h2>
        <div className="space-y-4">
          <div className="p-5 bg-white/5 rounded-xl border border-white/5">
            <h4 className="text-base font-bold text-white mb-2">Como a IA sabe sobre vistos e destinos reais?</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Diferente de IAs genéricas, o GloboAI permite cadastrar os destinos, diferenciais e serviços da sua agência. Nós acoplamos esses dados dinamicamente aos prompts estratégicos que enviamos para o motor do Gemini, resultando em postagens precisas e úteis.
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-xl border border-white/5">
            <h4 className="text-base font-bold text-white mb-2">Quantos créditos gasta cada post?</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Cada prompt de geração estratégica de conteúdo completo (que inclui o roteiro ou legenda + 10 headlines + CTA + hashtags de alta conversão) consome exatamente 1 crédito do seu saldo. A visualização, edição ou agendamento de posts não consome créditos adicionais.
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-xl border border-white/5">
            <h4 className="text-base font-bold text-white mb-2">Posso re-gerar ou editar depois?</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Sim! Todo conteúdo gerado entra diretamente na sua Biblioteca como Rascunho. Você pode abrir o editor embutido, alterar qualquer palavra, adicionar anotações e transferi-lo para as etapas do Kanban ou do calendário sem custo.
            </p>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-sm text-gray-500 bg-black/40">
        <p>© 2026 GloboAI Exchange SaaS. Todos os direitos reservados.</p>
        <p className="mt-2 text-xs text-gray-600">Projetado com excelência para educação internacional.</p>
      </footer>
    </div>
  );
}
