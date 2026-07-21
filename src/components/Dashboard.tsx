import React, { useState } from "react";
import { 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Calendar, 
  Coins, 
  TrendingUp, 
  ArrowRight,
  Settings,
  HelpCircle,
  FileText,
  MessageSquare,
  Send,
  Copy,
  Check,
  BookOpen,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { UserProfile, ContentItem, ContentStatus } from "../types";
import { saveUserProfile, getAgency } from "../mockData";

interface DashboardProps {
  user: UserProfile;
  contents: ContentItem[];
  onNavigate: (view: string, extraParams?: any) => void;
  onRefreshData?: () => void;
}

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
  isDemo?: boolean;
}

export default function Dashboard({ user, contents, onNavigate, onRefreshData }: DashboardProps) {
  // Metrics calculations
  const totalCreated = contents.length;
  const totalPublished = contents.filter(c => c.status === ContentStatus.PUBLISHED).length;
  const totalScheduled = contents.filter(c => c.status === ContentStatus.SCHEDULED).length;
  
  // Upcoming scheduled posts
  const upcomingPosts = contents
    .filter(c => c.status === ContentStatus.SCHEDULED && c.scheduledDate)
    .sort((a, b) => (a.scheduledDate || "").localeCompare(b.scheduledDate || ""))
    .slice(0, 3);

  // ChatGPT-style state
  const [chatPrompt, setChatPrompt] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: "assistant",
      text: `### 🔮 Bem-vindo ao Mastergency Consultor!

Eu sou o seu **Estrategista de Copywriting de Elite**. Digite qualquer dúvida ou prompt abaixo para obter respostas instantâneas em tempo real. 

**Ideias de prompts para testar:**
* *"Me dê 3 ideias de Reels com ganchos fortes para quem quer estudar na Irlanda"*
* *"Crie uma chamada para ação (CTA) persuasiva com urgência sobre vistos da Austrália"*
* *"Como quebrar a objeção de comprovação de renda para o Canadá?"*`
    }
  ]);

  // Copywriting Formulas List
  const COPY_FORMULAS = [
    {
      id: "f-aida",
      name: "Fórmula AIDA",
      desc: "Atenção ➔ Interesse ➔ Desejo ➔ Ação",
      template: `🚨 ATENÇÃO: Sabia que a Irlanda é o único destino de língua inglesa na Europa que permite que você estude e trabalhe legalmente em 2026?

✨ INTERESSE: Dublin está cheia de vagas na área de tecnologia, hotelaria e serviços. Você pode recuperar todo o seu investimento inicial ainda no primeiro ano!

💼 DESEJO: Nossa agência cuida de todo o processo burocrático e do suporte de chegada na Irlanda para que sua única preocupação seja fazer as malas.

👉 AÇÃO: As turmas de 2026 estão preenchendo rápido. Envie 'IRLANDA' no direct para falarmos com um consultor!`
    },
    {
      id: "f-pas",
      name: "Fórmula PAS",
      desc: "Problema ➔ Agitação ➔ Solução",
      template: `❌ Ter o visto negado por causa de um único documento preenchido incorretamente. Esse é o maior pesadelo de quem sonha com o Canadá.

🔥 O que muitos não sabem é que o consulado canadense analisa cada detalhe com rigor cirúrgico, e qualquer erro bobo na comprovação de renda joga meses de esforço no lixo.

✅ Mas você não precisa passar por esse estresse sozinho. Nossa consultoria de vistos tem 98% de aprovação e analisa toda a sua pasta financeira antes do protocolo. Clique no link da bio e simule seu perfil grátis!`
    },
    {
      id: "f-hso",
      name: "Fórmula Hook-Story-Offer",
      desc: "Gancho Magnético ➔ Storytelling ➔ Oferta",
      template: `🇦🇺 Eu quase desisti de ir para a Austrália porque achei que precisava ser rico...

Há 3 anos, eu estava na mesma posição que você: queria estudar fora, mas achava que o visto australiano era impossível pro meu bolso. Foi só quando conheci a assessoria certa que descobri que o parcelamento inteligente existia.

Hoje, a nossa agência está com taxas de câmbio congeladas e parcelamento em até 12x sem juros para cursos de idiomas em Sydney e Brisbane. Comente 'QUERO' para iniciarmos seu planejamento hoje!`
    }
  ];

  const [copiedFormulaId, setCopiedFormulaId] = useState<string | null>(null);

  const handleQuickGen = (destination: string, service: string) => {
    onNavigate("generator", { destination, service });
  };

  const handleSendChat = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    
    const promptToSend = customText || chatPrompt;
    if (!promptToSend.trim() || chatLoading) return;

    // Check credits
    if (user.availableCredits <= 0) {
      // Show simulated free credit recharge to let user test fully!
      const rechargeConfirm = window.confirm(
        "Seus créditos acabaram! Deseja recarregar +4 créditos de teste gratuitamente para continuar testando o ChatGPT?"
      );
      if (rechargeConfirm) {
        const updatedUser = { ...user, availableCredits: 4 };
        saveUserProfile(updatedUser);
        if (onRefreshData) onRefreshData();
        return;
      } else {
        setChatMessages(prev => [
          ...prev,
          {
            sender: "assistant",
            text: `⚠️ **Saldo de créditos esgotado.**\n\nPor favor, recarregue créditos na aba **Pacotes de Créditos** ou clique no botão de recarga automática para continuar utilizando o consultor de IA.`
          }
        ]);
        return;
      }
    }

    // Add user message
    const userMsg: ChatMessage = { sender: "user", text: promptToSend };
    setChatMessages(prev => [...prev, userMsg]);
    setChatPrompt("");
    setChatLoading(true);

    // Deduct credit local storage
    const updatedUser = {
      ...user,
      availableCredits: Math.max(0, user.availableCredits - 1),
      totalGenerated: user.totalGenerated + 1
    };
    saveUserProfile(updatedUser);
    if (onRefreshData) onRefreshData();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToSend,
          agency: getAgency()
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setChatMessages(prev => [
          ...prev,
          {
            sender: "assistant",
            text: data.response,
            isDemo: data.isDemo
          }
        ]);
      } else {
        throw new Error(data.error || "Erro desconhecido");
      }
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: "assistant",
          text: `❌ **Falha ao gerar resposta:** ${err.message || "Verifique sua conexão ou tente novamente."}`
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyFormulaText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormulaId(id);
    setTimeout(() => setCopiedFormulaId(null), 2000);
  };

  const handleDemoRefill = () => {
    const updated = { ...user, availableCredits: 4 };
    saveUserProfile(updated);
    if (onRefreshData) onRefreshData();
    alert("Saldo recarregado! Você recebeu mais 4 créditos de teste.");
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-950 via-[#131333]/30 to-[#0c183a]/40 border border-white/5 p-5 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
        <div className="absolute inset-0 bg-radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 60%) pointer-events-none" />
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-brand-blue/10 text-brand-blue border border-brand-blue/20 text-[10px] uppercase px-2 py-0.5 rounded-full font-bold font-mono">
              Painel de Controle {user.role === "admin" ? "ADMINISTRATIVO" : "DE AGÊNCIA"}
            </span>
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Olá, {user.fullName}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
            O que vamos planejar hoje para atrair mais estudantes internacionais e vender consultorias de visto?
          </p>
        </div>
        <button
          onClick={() => onNavigate("generator")}
          className="w-full sm:w-auto px-5 py-3 sm:py-3.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/30 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          id="btn-dash-new-post"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Criar Conteúdo Completo</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-brand-blue/20 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono block">Conteúdos Criados</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalCreated}</span>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% este mês</span>
            </div>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-brand-purple/20 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono block">Posts Publicados</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalPublished}</span>
            <span className="text-[11px] text-gray-400 block">Do rascunho ao feed</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-yellow-500/20 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono block">Seus Créditos de Teste</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-yellow-400">{user.availableCredits}</span>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate("credits")}
                className="text-[10px] text-yellow-500 font-bold hover:underline"
              >
                Comprar Pacotes
              </button>
              <span className="text-gray-600 text-[10px]">•</span>
              <button
                onClick={handleDemoRefill}
                className="text-[10px] text-emerald-400 font-bold hover:underline"
              >
                Recarga Grátis
              </button>
            </div>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 shrink-0">
            <Coins className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-emerald-500/20 transition-all">
          <div className="space-y-1">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono block">Agendados no Mês</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalScheduled}</span>
            <span className="text-[11px] text-gray-400 block">No calendário editorial</span>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* CHATGPT-STYLE CHAT ASSISTANT PROMPT CONTAINER */}
      <div className="p-4 sm:p-6 bg-gradient-to-tr from-gray-950 via-slate-900/40 to-[#0e172a]/50 rounded-3xl border border-white/10 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-brand-blue/15 flex items-center justify-center text-brand-blue border border-brand-blue/20 shrink-0">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white">Consultor de Copywriting Mastergency</h3>
              <p className="text-[11px] sm:text-xs text-gray-400">ChatGPT-style Assistant: Pergunte dúvidas reais ou peça copywriting estratégico</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-gray-400 font-mono">
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span>Consumo: 1 crédito por prompt</span>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="h-72 sm:h-80 overflow-y-auto bg-black/50 rounded-2xl border border-white/5 p-3 sm:p-4 space-y-4">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 sm:gap-3 max-w-[95%] sm:max-w-[85%] ${
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                  msg.sender === "user"
                    ? "bg-brand-purple text-white"
                    : "bg-brand-blue text-white"
                }`}
              >
                {msg.sender === "user" ? "U" : "IA"}
              </div>
              <div className="space-y-1.5">
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-brand-purple/20 border border-brand-purple/30 text-white rounded-tr-none"
                      : "bg-white/5 border border-white/10 text-gray-300 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "assistant" && i > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(msg.text, i)}
                      className="text-[10px] text-gray-400 hover:text-white transition-colors flex items-center gap-1 bg-white/5 border border-white/10 rounded px-2 py-0.5"
                    >
                      {copiedIndex === i ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copiar Resposta
                        </>
                      )}
                    </button>
                    {msg.isDemo && (
                      <span className="text-[9px] text-yellow-500 font-mono bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded font-bold">
                        MODO DEMO
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div className="flex items-center gap-3 max-w-[80%] mr-auto">
              <div className="w-8 h-8 rounded-lg bg-brand-blue text-white flex items-center justify-center animate-spin">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none text-xs text-gray-400">
                Escrevendo sua resposta persuasiva...
              </div>
            </div>
          )}
        </div>

        {/* Suggestion Prompts Row */}
        <div className="space-y-2">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sugestões de Prompts de Teste:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSendChat(undefined, "Gere 3 ganchos para Reels sobre intercâmbio de Trabalho e Estudo no Canadá")}
              disabled={chatLoading}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 rounded-lg border border-white/5 hover:border-brand-blue/30 text-left transition-all"
            >
              🎯 Ganchos Reels Canadá
            </button>
            <button
              onClick={() => handleSendChat(undefined, "Crie uma legenda persuasiva focada em vender Curso de Idiomas em Dublin")}
              disabled={chatLoading}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 rounded-lg border border-white/5 hover:border-brand-purple/30 text-left transition-all"
            >
              📝 Legenda Venda Dublin
            </button>
            <button
              onClick={() => handleSendChat(undefined, "Me dê 5 CTAs focados em urgência e escassez de vagas de intercâmbio")}
              disabled={chatLoading}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[11px] text-gray-300 rounded-lg border border-white/5 hover:border-yellow-500/30 text-left transition-all"
            >
              🚨 5 CTAs com Escassez
            </button>
          </div>
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleSendChat} className="flex gap-3">
          <input
            type="text"
            value={chatPrompt}
            onChange={(e) => setChatPrompt(e.target.value)}
            disabled={chatLoading}
            placeholder="Digite sua dúvida ou peça um post (Ex: Crie 5 chamadas de ação sobre visto australiano...)"
            className="flex-1 bg-black/60 border border-white/10 focus:border-brand-blue/50 rounded-xl px-4 py-3 text-sm focus:outline-none text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={chatLoading || !chatPrompt.trim()}
            className="px-5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* PERSUASIVE COPYWRITING FORMULAS & HIGH-IMPACT CTAs */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">Biblioteca de Fórmulas Persuasivas</h3>
            <p className="text-xs text-gray-400">Fórmulas consagradas adaptadas para intercâmbio. Copie e personalize!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COPY_FORMULAS.map((formula) => (
            <div
              key={formula.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/5 hover:border-brand-blue/20 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded">
                    {formula.name}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">{formula.desc}</span>
                </div>
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 text-[11px] text-gray-400 font-mono whitespace-pre-wrap leading-relaxed h-48 overflow-y-auto">
                  {formula.template}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => copyFormulaText(formula.template, formula.id)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedFormulaId === formula.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setChatPrompt(`Gere um texto no modelo ${formula.name} sobre `)}
                  className="px-3 py-2 bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue border border-brand-blue/20 rounded-xl text-xs font-bold transition-all"
                  title="Usar modelo no chat"
                >
                  Usar no Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Shortcuts + Scheduled Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Route Buttons */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-blue" />
            Atalhos Rápidos de Destinos
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/5 hover:border-brand-blue/30 transition-all space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-lg">🇨🇦</span>
                <span className="text-[10px] bg-brand-blue/10 text-brand-blue py-0.5 px-1.5 rounded font-bold font-mono">CANADÁ</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Trabalho & Estudo no Canadá</h4>
                <p className="text-xs text-gray-500 mt-1">Gere roteiros sobre vistos Co-op e colleges canadenses.</p>
              </div>
              <button
                onClick={() => handleQuickGen("Canadá", "Trabalho & Estudo")}
                className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Criar agora</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/5 hover:border-brand-purple/30 transition-all space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-lg">🇮🇪</span>
                <span className="text-[10px] bg-brand-purple/10 text-brand-purple py-0.5 px-1.5 rounded font-bold font-mono">IRLANDA</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Estudo & Trabalho em Dublin</h4>
                <p className="text-xs text-gray-500 mt-1">Explique o custo de vida real na Irlanda de forma simples.</p>
              </div>
              <button
                onClick={() => handleQuickGen("Irlanda", "Curso de Idiomas")}
                className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Criar agora</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/5 hover:border-emerald-500/30 transition-all space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-lg">🇦🇺</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 py-0.5 px-1.5 rounded font-bold font-mono">AUSTRÁLIA</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Vistos Austrália</h4>
                <p className="text-xs text-gray-500 mt-1">Dicas sobre comprovação financeira e carta de intenção.</p>
              </div>
              <button
                onClick={() => handleQuickGen("Austrália", "Consultoria de Vistos")}
                className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Criar agora</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-white/5 hover:border-blue-400/30 transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white">
                  <Settings className="w-4 h-4 text-gray-400" />
                </div>
                <h4 className="font-bold text-white text-sm">Mudar Configurações</h4>
                <p className="text-xs text-gray-500">Mude o tom de voz e diferenciais da sua agência no gerador.</p>
              </div>
              <button
                onClick={() => onNavigate("settings")}
                className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-1.5 mt-2 cursor-pointer"
              >
                <span>Ajustar Perfil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Next Scheduled Posts Column */}
        <div className="space-y-6">
          <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Próximas Publicações
          </h3>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
            {upcomingPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-xs">
                Nenhum post agendado para os próximos dias.
                <button
                  onClick={() => onNavigate("generator")}
                  className="text-brand-blue font-bold hover:underline block mx-auto mt-2 cursor-pointer"
                >
                  Criar e Agendar agora →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onNavigate("library")}
                    className="p-3 bg-black/40 rounded-xl border border-white/5 hover:border-brand-blue/30 cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-gray-400 font-mono font-bold">{post.scheduledDate}</span>
                      <span className="text-brand-blue font-semibold">{post.destination}</span>
                    </div>
                    <h4 className="font-bold text-white text-xs truncate">{post.title}</h4>
                    <p className="text-[10px] text-gray-400 line-clamp-1">{post.format}</p>
                  </div>
                ))}
                <button
                  onClick={() => onNavigate("calendar")}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-300 font-semibold transition-all text-center block cursor-pointer"
                >
                  Ver no Calendário Editorial
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-gradient-to-tr from-brand-blue/10 to-brand-purple/10 border border-brand-blue/20 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-brand-blue" />
              Como funciona o saldo?
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Cada geração de IA estratégica (headlines + legenda/roteiro + hashtags + CTA) consome 1 crédito. Consultas e edições posteriores são 100% livres de custo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
