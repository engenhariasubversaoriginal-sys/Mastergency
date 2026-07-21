import React, { useState } from "react";
import { 
  ShieldAlert, 
  Users, 
  Building, 
  Sparkles, 
  Coins, 
  TrendingUp, 
  Check, 
  HelpCircle,
  FileCode,
  Sliders,
  DollarSign
} from "lucide-react";
import { UserProfile, Agency, SystemPrompt, CreditPackage } from "../types";
import { 
  getAllUsers, 
  saveAllUsers, 
  getAllAgencies, 
  saveAllAgencies, 
  getSystemPrompt, 
  saveSystemPrompt, 
  getPackages, 
  savePackages,
  saveUserProfile,
  saveAgency
} from "../mockData";
import { isSupabaseConfigured, SUPABASE_SETUP_SQL } from "../lib/supabase";

interface AdminPanelProps {
  onRefreshData: () => void;
}

export default function AdminPanel({ onRefreshData }: AdminPanelProps) {
  // DB states
  const [users, setUsers] = useState<UserProfile[]>(getAllUsers());
  const [agencies, setAgencies] = useState<Agency[]>(getAllAgencies());
  const [systemPrompt, setSystemPromptState] = useState<SystemPrompt>(getSystemPrompt());
  const [packages, setPackages] = useState<CreditPackage[]>(getPackages());

  // Editing state
  const [promptText, setPromptText] = useState(systemPrompt.promptText);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [selectedUserForCredits, setSelectedUserForCredits] = useState<UserProfile | null>(null);
  const [creditAdjustment, setCreditAdjustment] = useState<number>(10);

  // Success notice
  const [successMsg, setSuccessMsg] = useState("");

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SystemPrompt = {
      ...systemPrompt,
      promptText,
      updatedAt: new Date().toISOString().split("T")[0]
    };
    saveSystemPrompt(updated);
    setSystemPromptState(updated);
    setIsEditingPrompt(false);
    setSuccessMsg("Prompt mestre do sistema atualizado com sucesso! As gerações seguintes usarão a nova engenharia.");
    setTimeout(() => setSuccessMsg(""), 4000);
    onRefreshData();
  };

  const handleAdjustCreditsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForCredits) return;

    const allUsers = getAllUsers();
    const index = allUsers.findIndex(u => u.id === selectedUserForCredits.id);
    if (index !== -1) {
      const originalCredits = allUsers[index].availableCredits;
      const newCredits = Math.max(0, originalCredits + creditAdjustment);
      allUsers[index].availableCredits = newCredits;

      saveAllUsers(allUsers);
      setUsers(allUsers);

      // If active user is the one being edited, update active session state as well
      const activeUser = JSON.parse(localStorage.getItem("globoai_user") || "{}");
      if (activeUser.id === selectedUserForCredits.id) {
        activeUser.availableCredits = newCredits;
        saveUserProfile(activeUser);
      }

      setSuccessMsg(`Saldo de ${selectedUserForCredits.fullName} ajustado para ${newCredits} créditos.`);
      setTimeout(() => setSuccessMsg(""), 4000);
      onRefreshData();
    }
    setSelectedUserForCredits(null);
  };

  // Stats calculation
  const totalUsers = users.length;
  const totalAgencies = agencies.length;
  const totalCreditsGiven = users.reduce((acc, u) => acc + u.availableCredits, 0);
  const totalGenerations = users.reduce((acc, u) => acc + u.totalGenerated, 0);

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-3xl text-white flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-brand-purple" />
          Painel de Administração SaaS
        </h2>
        <p className="text-sm text-gray-400">
          Gerenciamento interno da Mastergency: monitore métricas financeiras, ajuste créditos de agências e refine a engenharia de prompt principal.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center flex items-center justify-center gap-2 font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          {successMsg}
        </div>
      )}

      {/* Global Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">Total Agências</span>
          <span className="text-2xl font-extrabold text-white">{totalAgencies}</span>
          <span className="text-[10px] text-gray-500 block">Ativas e registradas</span>
        </div>

        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">Membros / Usuários</span>
          <span className="text-2xl font-extrabold text-white">{totalUsers}</span>
          <span className="text-[10px] text-emerald-400 font-bold block">↑ Crescimento constante</span>
        </div>

        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">Gerações Efetuadas</span>
          <span className="text-2xl font-extrabold text-brand-blue">{totalGenerations}</span>
          <span className="text-[10px] text-gray-500 block">Pelo motor Gemini-3.5-Flash</span>
        </div>

        <div className="p-5 bg-gradient-to-br from-brand-purple/10 to-transparent rounded-2xl border border-white/5 space-y-1">
          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">Receita Recorrente Est.</span>
          <span className="text-2xl font-extrabold text-brand-purple">R$ 4.890,00</span>
          <span className="text-[10px] text-brand-purple font-mono font-bold block">MRR Simulado</span>
        </div>
      </div>

      {/* Supabase Status and Integration Panel */}
      <div className="p-6 bg-gradient-to-r from-gray-950 via-slate-900 to-[#0B1530] rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
              <span className="p-1 rounded bg-blue-500/10 text-brand-blue font-mono font-bold text-xs">SUPABASE</span>
              Conexão com o Banco de Dados Real
            </h3>
            <p className="text-xs text-gray-400">
              Gerencie a integração da Mastergency com o backend relacional do Supabase (Autenticação e Tabelas de Perfis).
            </p>
          </div>
          {isSupabaseConfigured() ? (
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full animate-pulse">
              🟢 CONECTADO COM SUCESSO
            </span>
          ) : (
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-full">
              🟡 EXECUTANDO EM MODO LOCAL (MOCK DATABASE)
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-white/5 text-xs">
          <div className="space-y-3">
            <p className="font-bold text-gray-300">Como estabelecer a conexão com seu Supabase:</p>
            <ol className="list-decimal pl-4 space-y-2 text-gray-400">
              <li>
                Acesse o painel do seu **Supabase**, crie um projeto novo ou use um existente.
              </li>
              <li>
                Copie as chaves **Project URL** e **API key (anon public)** em Settings &gt; API.
              </li>
              <li>
                Acesse as **Configurações de Segredos (Secrets)** no AI Studio e declare:
                <div className="font-mono text-[10px] bg-black/40 p-2 rounded border border-white/5 mt-1.5 space-y-1 text-gray-300">
                  <p>VITE_SUPABASE_URL="https://suaprojekt.supabase.co"</p>
                  <p>VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."</p>
                </div>
              </li>
              <li>
                Execute o script SQL ao lado no editor de SQL do Supabase para inicializar as tabelas relativas de Agências e Usuários!
              </li>
            </ol>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-300 font-mono text-[11px]">Esquema SQL de Inicialização (Supabase Editor)</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
                  alert("Script SQL copiado com sucesso!");
                }}
                className="px-2 py-1 bg-brand-blue/10 hover:bg-brand-blue/20 border border-brand-blue/25 text-brand-blue rounded text-[10px] font-bold transition-all cursor-pointer"
              >
                Copiar SQL
              </button>
            </div>
            <textarea
              readOnly
              value={SUPABASE_SETUP_SQL}
              rows={6}
              className="w-full bg-black/50 border border-white/5 rounded-xl p-3 font-mono text-[10px] text-gray-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Main split row: Users table vs Master Prompt Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Master Prompt Editor Card */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-[#0a0e1a] rounded-2xl border border-white/10 space-y-5">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileCode className="w-5 h-5 text-brand-blue" />
                Prompt Principal da IA (System Prompt)
              </h3>
              <button
                onClick={() => setIsEditingPrompt(!isEditingPrompt)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-semibold border border-white/10 transition-colors"
              >
                {isEditingPrompt ? "Cancelar Edição" : "Editar Prompt"}
              </button>
            </div>

            <form onSubmit={handleSavePrompt} className="space-y-4">
              <div className="text-[11px] text-gray-400 bg-white/2 p-3 rounded-xl border border-white/5 leading-relaxed space-y-1.5">
                <p className="font-bold text-brand-blue flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" /> Variables Disponíveis no Escopo:
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] text-gray-400">
                  <span>{`{agencyName}`} - Nome da Agência</span>
                  <span>{`{selectedDestination}`} - País selecionado</span>
                  <span>{`{destinations}`} - Países ativos</span>
                  <span>{`{selectedService}`} - Programa selecionado</span>
                  <span>{`{services}`} - Serviços cadastrados</span>
                  <span>{`{theme}`} - Dúvida / Tema central</span>
                  <span>{`{audience}`} - Público da agência</span>
                  <span>{`{format}`} - Formato de postagem</span>
                  <span>{`{tone}`} - Tom de voz selecionado</span>
                  <span>{`{differentials}`} - Diferenciais da agência</span>
                </div>
              </div>

              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                disabled={!isEditingPrompt}
                rows={12}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-gray-300 font-mono leading-relaxed focus:outline-none focus:border-brand-blue resize-none disabled:opacity-75 disabled:cursor-not-allowed"
              />

              {isEditingPrompt && (
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl text-xs shadow-md"
                  id="btn-admin-save-prompt"
                >
                  Confirmar e Aplicar Novo Prompt
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Users credit management */}
        <div className="space-y-6">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-purple" />
              Gestão de Usuários e Créditos
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-3 bg-black/35 rounded-xl border border-white/5 hover:border-brand-blue/20 transition-all flex justify-between items-center text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white truncate">{u.fullName}</p>
                    <p className="text-[10px] text-gray-500 font-mono truncate">{u.email}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] text-brand-purple font-semibold font-mono bg-brand-purple/10 px-1.5 py-0.5 rounded uppercase">{u.role}</span>
                      <span className="text-gray-400 text-[10px]">{u.totalGenerated} gerados</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-yellow-400 font-bold font-mono">{u.availableCredits} crd</span>
                    <button
                      onClick={() => setSelectedUserForCredits(u)}
                      className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-[9px] font-bold text-gray-300 transition-colors"
                    >
                      Ajustar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
            <h4 className="font-bold text-white text-xs">Agências Cadastradas</h4>
            <div className="space-y-2">
              {agencies.map((a) => (
                <div key={a.id} className="p-3 bg-black/20 rounded-lg text-xs space-y-1">
                  <p className="font-bold text-white">{a.name}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1">Destinos: {a.destinations.join(", ")}</p>
                  <p className="text-[10px] text-gray-500 line-clamp-1">Registro: {a.createdAt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Credit Adjustment Modal */}
      {selectedUserForCredits && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <form onSubmit={handleAdjustCreditsSubmit} className="w-full max-w-sm glass-panel-heavy rounded-2xl border border-white/10 p-5 sm:p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <h4 className="font-display font-bold text-lg text-white">Ajustar Créditos de IA</h4>
            <p className="text-xs text-gray-400">
              Ajuste manualmente o saldo de <strong className="text-white">{selectedUserForCredits.fullName}</strong>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase font-mono mb-2">Quantidade a Somar ou Subtrair</label>
                <input
                  type="number"
                  value={creditAdjustment}
                  onChange={(e) => setCreditAdjustment(parseInt(e.target.value, 10))}
                  placeholder="Ex: 10 ou -5"
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  required
                />
                <span className="text-[10px] text-gray-600 mt-1 block">Insira valores positivos para adicionar, ou negativos para debitar.</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserForCredits(null)}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-gray-400 hover:text-white transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-brand-purple text-white font-bold rounded-xl text-xs shadow-md"
              >
                Confirmar Ajuste
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
