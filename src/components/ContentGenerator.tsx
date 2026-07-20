import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Coins, 
  HelpCircle, 
  Copy, 
  Check, 
  Calendar, 
  AlertCircle,
  Instagram,
  RefreshCw,
  CheckCircle2,
  FileText
} from "lucide-react";
import { 
  ContentFormat, 
  ContentStatus, 
  ContentItem, 
  Agency, 
  UserProfile 
} from "../types";
import { 
  getAgency, 
  getUserProfile, 
  saveUserProfile, 
  getContents, 
  saveContents, 
  getSystemPrompt, 
  saveTransactions, 
  getTransactions 
} from "../mockData";

interface ContentGeneratorProps {
  user: UserProfile;
  agency: Agency;
  onRefreshUser: (updatedUser: UserProfile) => void;
  onNavigate: (view: string) => void;
  prefillParams: any; // e.g. { destination: string, service: string }
}

export default function ContentGenerator({ 
  user, 
  agency, 
  onRefreshUser, 
  onNavigate,
  prefillParams
}: ContentGeneratorProps) {
  // Input states
  const [destination, setDestination] = useState("");
  const [service, setService] = useState("");
  const [theme, setTheme] = useState("");
  const [format, setFormat] = useState<ContentFormat>(ContentFormat.REELS_SCRIPT);
  const [objective, setObjective] = useState("Captação de Leads");
  const [funnelStage, setFunnelStage] = useState("Meio de Funil");
  const [customContext, setCustomContext] = useState("");

  // Loading / Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("Iniciando inteligência artificial...");
  const [result, setResult] = useState<ContentItem | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Scheduling state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  // Prefill check on mount
  useEffect(() => {
    if (agency) {
      setDestination(prefillParams?.destination || agency.destinations?.[0] || "Canadá");
      setService(prefillParams?.service || agency.services?.[0] || "Trabalho & Estudo");
    }
  }, [agency, prefillParams]);

  // Loading messages rotation
  useEffect(() => {
    if (!isGenerating) return;

    const messages = [
      "Lendo o perfil da sua agência e público-alvo...",
      "Consultando as regras de visto do destino...",
      "Processando o roteiro com gatilhos de retenção de 3 segundos...",
      "Escrevendo 10 headlines magnéticas para o feed...",
      "Formatando os slides perfeitos para conversão...",
      "Sintonizando o tom de voz ideal para seus clientes...",
      "Finalizando estrutura e hashtags estratégicas..."
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % messages.length;
      setLoaderMessage(messages[index]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isGenerating]);

  // Handle Generate
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResult(null);

    if (user.availableCredits <= 0) {
      setErrorMsg("Você não possui créditos suficientes! Adquira mais pacotes de créditos na loja.");
      return;
    }

    if (!theme.trim()) {
      setErrorMsg("Por favor, informe a dúvida ou tema do cliente.");
      return;
    }

    setIsGenerating(true);
    setLoaderMessage("Iniciando inteligência artificial...");

    try {
      const activeSystemPrompt = getSystemPrompt();

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agency,
          selectedDestination: destination,
          selectedService: service,
          theme,
          format,
          objective,
          funnelStage,
          customContext,
          systemPromptText: activeSystemPrompt.promptText
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Erro no servidor ao gerar conteúdo.");
      }

      const responseData = await response.json();

      // Deduct credit & record transaction
      const updatedUser = {
        ...user,
        availableCredits: user.availableCredits - 1,
        totalGenerated: user.totalGenerated + 1
      };
      saveUserProfile(updatedUser);
      onRefreshUser(updatedUser);

      // Save transaction log
      const txs = getTransactions();
      txs.push({
        id: `tx-gen-${Date.now()}`,
        profileId: user.id,
        date: new Date().toISOString().replace("T", " ").substring(0, 16),
        amount: -1,
        type: "generation",
        description: `Geração: ${responseData.title || theme} (${format})`
      });
      saveTransactions(txs);

      // Create new ContentItem and save to Library
      const newPost: ContentItem = {
        id: `post-${Date.now()}`,
        agencyId: agency.id,
        creatorId: user.id,
        title: responseData.title || theme,
        destination,
        service,
        theme,
        format,
        objective,
        funnelStage,
        customContext,
        generatedText: responseData.generatedText,
        headlines: responseData.headlines || [],
        cta: responseData.cta || "",
        hashtags: responseData.hashtags || [],
        status: ContentStatus.DRAFT,
        isDemo: responseData.isDemo,
        createdAt: new Date().toISOString().split("T")[0]
      };

      const library = getContents();
      library.push(newPost);
      saveContents(library);

      setResult(newPost);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Falha na conexão com a IA. Certifique-se de que a chave da API está correta nos segredos.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleApprove = () => {
    if (!result) return;
    const library = getContents();
    const index = library.findIndex(p => p.id === result.id);
    if (index !== -1) {
      library[index].status = ContentStatus.APPROVED;
      saveContents(library);
      setResult({ ...result, status: ContentStatus.APPROVED });
    }
  };

  const handleScheduleSubmit = () => {
    if (!result || !scheduleDate) return;
    const library = getContents();
    const index = library.findIndex(p => p.id === result.id);
    if (index !== -1) {
      library[index].status = ContentStatus.SCHEDULED;
      library[index].scheduledDate = scheduleDate;
      saveContents(library);
      setResult({ 
        ...result, 
        status: ContentStatus.SCHEDULED,
        scheduledDate: scheduleDate 
      });
    }
    setShowScheduleModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-extrabold text-3xl text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-brand-blue animate-pulse" />
            Criador de Conteúdo com IA
          </h2>
          <p className="text-sm text-gray-400">
            Mapeie o funil de vendas, insira a dúvida do seu lead e deixe a estrategista gerar o post completo.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 font-mono text-xs font-bold">
          <Coins className="w-4 h-4 text-yellow-500" />
          <span>Saldo: {user.availableCredits} crd</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-white/5 pb-3">Parâmetros do Post</h3>

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Destino / País
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white"
                >
                  {agency?.destinations?.map((dest) => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                  <option value="Geral/Multi-destino">Geral / Multi-destino 🌍</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Serviço Relacionado
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white"
                >
                  {agency?.services?.map((serv) => (
                    <option key={serv} value={serv}>{serv}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Formato Redes Sociais
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as ContentFormat)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white"
                >
                  <option value={ContentFormat.REELS_SCRIPT}>Roteiro de Reels / TikTok 🎬</option>
                  <option value={ContentFormat.CAROUSEL}>Carrossel de Imagens 📄</option>
                  <option value={ContentFormat.STORIES}>Sequência de Stories 📲</option>
                  <option value={ContentFormat.CAPTIONS}>Legenda Completa 📝</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Objetivo
                  </label>
                  <select
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-blue text-white"
                  >
                    <option value="Engajamento">Engajamento</option>
                    <option value="Quebrar Objeções">Quebrar Objeções</option>
                    <option value="Captação de Leads">Captar Leads</option>
                    <option value="Venda Direta">Venda Direta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Etapa do Funil
                  </label>
                  <select
                    value={funnelStage}
                    onChange={(e) => setFunnelStage(e.target.value)}
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-blue text-white"
                  >
                    <option value="Topo de Funil">Topo de Funil (Descoberta)</option>
                    <option value="Meio de Funil">Meio de Funil (Consideração)</option>
                    <option value="Fundo de Funil">Fundo de Funil (Decisão)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Dúvida do Cliente ou Tema Central
                </label>
                <textarea
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Ex: Qual o limite de idade para intercâmbio de Trabalho e Estudo na Irlanda? Qual o salário mínimo?"
                  rows={3}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white placeholder:text-gray-600 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Instruções extras (Opcional)
                </label>
                <input
                  type="text"
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  placeholder="Ex: Focar na agilidade do nosso suporte local..."
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white placeholder:text-gray-600"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating || user.availableCredits <= 0}
                className="w-full py-4 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl shadow-lg shadow-brand-blue/15 hover:shadow-brand-blue/35 hover:scale-101 transition-all flex items-center justify-center gap-2"
                id="btn-gen-submit"
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>Gerar Post (Consome 1 crédito)</span>
              </button>
            </form>
          </div>
        </div>

        {/* Output Area Column */}
        <div className="lg:col-span-3 min-h-[500px] flex flex-col">
          {/* Default view */}
          {!isGenerating && !result && !errorMsg && (
            <div className="flex-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col justify-center items-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-500">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">Nenhum conteúdo gerado ainda</h4>
                <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
                  Preencha os dados da agência e tema à esquerda, e veja a IA criar headlines marcantes, roteiros de alta retenção e hashtags ideais.
                </p>
              </div>
            </div>
          )}

          {/* Loading view */}
          {isGenerating && (
            <div className="flex-1 border border-white/10 bg-gray-950/50 rounded-2xl flex flex-col justify-center items-center text-center p-8 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-t-2 border-brand-blue border-r-2 border-brand-purple animate-spin" />
                <Sparkles className="w-6 h-6 text-brand-blue absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white text-lg">Estrategista Digital pensando...</h4>
                <p className="text-xs text-brand-blue font-mono animate-pulse">{loaderMessage}</p>
              </div>
            </div>
          )}

          {/* Error view */}
          {errorMsg && (
            <div className="flex-1 border border-rose-500/10 bg-rose-500/5 rounded-2xl flex flex-col justify-center items-center text-center p-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="font-bold text-rose-300">Erro na Geração</h4>
                <p className="text-xs text-rose-400/80 leading-relaxed">{errorMsg}</p>
              </div>
              <button
                onClick={() => onNavigate("settings")}
                className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-semibold text-white transition-all"
              >
                Ajustar Segredos de API
              </button>
            </div>
          )}

          {/* Success view */}
          {result && !isGenerating && (
            <div className="flex-1 bg-white/5 rounded-2xl border border-white/5 p-6 space-y-6 flex flex-col justify-between">
              {result.isDemo && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-start sm:items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span>
                      <strong>Modo de Demonstração Ativo:</strong> Chave de API não configurada. Configure o segredo <strong>GEMINI_API_KEY</strong> nas configurações do AI Studio para ativar a IA real.
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate("settings")}
                    className="text-[10px] font-bold bg-amber-500/20 text-amber-100 px-2.5 py-1 rounded-lg hover:bg-amber-500/30 transition-all whitespace-nowrap self-stretch sm:self-auto text-center"
                  >
                    Ver Configurações
                  </button>
                </div>
              )}

              {/* Top Meta info */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-brand-blue font-mono uppercase tracking-widest font-bold">
                    {result.format} • {result.destination}
                  </span>
                  <h3 className="font-bold text-white text-lg">{result.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    result.status === ContentStatus.DRAFT ? "bg-amber-500/15 text-amber-400" :
                    result.status === ContentStatus.APPROVED ? "bg-indigo-500/15 text-indigo-400" :
                    "bg-emerald-500/15 text-emerald-400"
                  }`}>
                    {result.status}
                  </span>
                </div>
              </div>

              {/* Main Text Area */}
              <div className="space-y-6 flex-1">
                {/* 10 Headlines */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Sugeridas 10 Headlines (Clique para Copiar)
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">Pristine Hook Generator</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-gray-300">
                    {result.headlines?.map((headline, index) => (
                      <div 
                        key={index}
                        onClick={() => handleCopy(headline, `hl-${index}`)}
                        className="p-2 rounded bg-black/30 border border-white/5 hover:border-brand-blue/30 cursor-pointer transition-all flex items-start gap-2 relative group"
                      >
                        <span className="text-brand-blue font-mono">#{index + 1}</span>
                        <span className="flex-1 pr-4">{headline}</span>
                        {copiedField === `hl-${index}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 absolute right-2" />
                        ) : (
                          <Copy className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2.5" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Structured Copy Area */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Texto do Conteúdo
                    </span>
                    <button
                      onClick={() => handleCopy(result.generatedText, "body")}
                      className="text-xs text-brand-blue font-bold flex items-center gap-1 hover:underline"
                    >
                      {copiedField === "body" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedField === "body" ? "Copiado!" : "Copiar Texto Completo"}
                    </button>
                  </div>
                  <div className="bg-black/40 p-5 rounded-xl border border-white/5 max-h-[280px] overflow-y-auto text-sm text-gray-200 leading-relaxed space-y-3 font-sans whitespace-pre-line border-l-4 border-l-brand-purple">
                    {result.generatedText}
                  </div>
                </div>

                {/* CTA and Hashtags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 relative group cursor-pointer" onClick={() => handleCopy(result.cta, "cta")}>
                    <span className="text-[10px] text-gray-500 font-mono block uppercase tracking-widest font-bold mb-1">
                      Chamada para Ação (CTA)
                    </span>
                    <p className="text-brand-purple text-xs font-semibold">{result.cta}</p>
                    {copiedField === "cta" ? (
                      <Check className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 absolute right-3 top-3" />
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 relative group cursor-pointer" onClick={() => handleCopy(result.hashtags.map(h => `#${h}`).join(" "), "hashtags")}>
                    <span className="text-[10px] text-gray-500 font-mono block uppercase tracking-widest font-bold mb-1">
                      Hashtags Recomendadas
                    </span>
                    <p className="text-brand-blue text-xs font-mono">{result.hashtags?.map(h => `#${h}`).join(" ")}</p>
                    {copiedField === "hashtags" ? (
                      <Check className="w-4 h-4 text-emerald-400 absolute right-3 top-3" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 absolute right-3 top-3" />
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Workflow Triggers */}
              <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleApprove}
                  disabled={result.status !== ContentStatus.DRAFT}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {result.status === ContentStatus.DRAFT ? "Aprovar Conteúdo" : "Conteúdo Aprovado ✓"}
                </button>

                <button
                  onClick={() => setShowScheduleModal(true)}
                  disabled={result.status === ContentStatus.PUBLISHED}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  {result.status === ContentStatus.SCHEDULED ? `Agendado (${result.scheduledDate})` : "Agendar no Calendário"}
                </button>

                <button
                  onClick={() => onNavigate("library")}
                  className="py-3 px-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs transition-all text-center font-semibold"
                >
                  Ir para Biblioteca
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm glass-panel-heavy rounded-2xl border border-white/10 p-6 space-y-4">
            <h4 className="font-display font-bold text-lg text-white">Agendar Publicação</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Escolha a data ideal para publicar este conteúdo estratégica nas suas redes sociais (Instagram ou TikTok).
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase font-mono mb-2">Data de Publicação</label>
              <input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue text-white"
                min="2026-07-17"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-400 hover:text-white transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={handleScheduleSubmit}
                disabled={!scheduleDate}
                className="flex-1 py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl text-xs shadow disabled:opacity-50"
              >
                Confirmar Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
