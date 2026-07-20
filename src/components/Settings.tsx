import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Building, 
  Globe, 
  Layers, 
  Users, 
  Volume2, 
  Sparkles, 
  Check, 
  HelpCircle,
  Key
} from "lucide-react";
import { Agency, UserProfile } from "../types";
import { getAgency, saveAgency, getUserProfile, saveUserProfile } from "../mockData";

interface SettingsProps {
  agency: Agency;
  user: UserProfile;
  onRefreshAgency: (updatedAgency: Agency) => void;
  onRefreshUser: (updatedUser: UserProfile) => void;
}

export default function SettingsComponent({ 
  agency, 
  user, 
  onRefreshAgency, 
  onRefreshUser 
}: SettingsProps) {
  // Agency states
  const [agencyName, setAgencyName] = useState("");
  const [destinationsStr, setDestinationsStr] = useState("");
  const [servicesStr, setServicesStr] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [differentials, setDifferentials] = useState("");

  // User Profile states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // UI state
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (agency) {
      setAgencyName(agency.name);
      setDestinationsStr(agency.destinations.join(", "));
      setServicesStr(agency.services.join(", "));
      setAudience(agency.audience);
      setTone(agency.tone);
      setDifferentials(agency.differentials);
    }
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
    }
  }, [agency, user]);

  const handleSaveAgency = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg("");

    const updatedAgency: Agency = {
      ...agency,
      name: agencyName,
      destinations: destinationsStr.split(",").map(d => d.trim()).filter(Boolean),
      services: servicesStr.split(",").map(s => s.trim()).filter(Boolean),
      audience,
      tone,
      differentials
    };

    saveAgency(updatedAgency);
    onRefreshAgency(updatedAgency);
    setSaveSuccessMsg("Configurações da agência salvas com sucesso! A IA já usará as novas diretrizes.");
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg("");

    const updatedUser = {
      ...user,
      fullName
    };

    saveUserProfile(updatedUser);
    onRefreshUser(updatedUser);
    setSaveSuccessMsg("Perfil do usuário atualizado com sucesso!");
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <h2 className="font-display font-extrabold text-3xl text-white flex items-center gap-2">
          <Settings className="w-8 h-8 text-brand-blue" />
          Configurações da Plataforma
        </h2>
        <p className="text-sm text-gray-400">
          Personalize as informações da sua agência. A nossa inteligência artificial usa essas diretrizes para moldar as headlines e roteiros de acordo com a sua realidade.
        </p>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center flex items-center justify-center gap-2 font-semibold">
          <Check className="w-4 h-4 text-emerald-400" />
          {saveSuccessMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Agency Marketing settings */}
        <div className="lg:col-span-2">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-white/5 pb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-blue" />
              Diretrizes de Conteúdo (Exchange Profile)
            </h3>

            <form onSubmit={handleSaveAgency} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Nome Oficial da Agência
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Destinos / Países (Separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={destinationsStr}
                    onChange={(e) => setDestinationsStr(e.target.value)}
                    placeholder="Ex: Canadá, Irlanda, Austrália, EUA, Malta"
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-blue"
                    required
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Estes países aparecerão no menu do gerador.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Serviços / Programas (Separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={servicesStr}
                    onChange={(e) => setServicesStr(e.target.value)}
                    placeholder="Ex: Trabalho & Estudo, Curso de Idiomas, Vistos"
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-blue"
                    required
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">Estes programas aparecerão no menu do gerador.</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Tom de Voz de Preferência
                </label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="Ex: Inspirador, informal, focado em conquistas práticas e credibilidade"
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Diferenciais Competitivos da Empresa
                </label>
                <textarea
                  value={differentials}
                  onChange={(e) => setDifferentials(e.target.value)}
                  placeholder="Ex: Suporte local 24/7 no Canadá, consultores ex-intercambistas, alto índice de aprovação de vistos de estudante..."
                  rows={3}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-blue resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Público-alvo / Persona Principal
                </label>
                <textarea
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Ex: Jovens de 22 a 32 anos cansados da rotina no Brasil que querem imigração qualificada ou transição de carreira..."
                  rows={3}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-blue resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl shadow-lg hover:shadow-brand-blue/30 transition-all flex items-center justify-center gap-1.5 text-sm"
                id="btn-settings-save-agency"
              >
                <Sparkles className="w-5 h-5" />
                <span>Salvar Configurações de IA</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: User Credentials and System Status */}
        <div className="space-y-6">
          {/* User profile */}
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-white/5 pb-3">Seu Perfil de Acesso</h3>
            
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nome Completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">E-mail de Trabalho</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full bg-gray-900 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-gray-500 cursor-not-allowed focus:outline-none"
                />
                <span className="text-[10px] text-gray-600 mt-1 block">O e-mail principal não pode ser alterado por segurança.</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-semibold hover:bg-white/10 transition-all"
                id="btn-settings-save-user"
              >
                Atualizar Perfil
              </button>
            </form>
          </div>

          {/* Security details & API secrets */}
          <div className="p-6 bg-gradient-to-tr from-brand-purple/5 to-transparent rounded-2xl border border-white/5 space-y-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
              <Key className="w-4 h-4 text-brand-purple" />
              Segredos de Conexão AI
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              O GloboAI consome sua chave <strong className="text-white">GEMINI_API_KEY</strong> de forma criptografada e segura pelo servidor (Express Node backend).
            </p>
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between">
              <span className="text-[11px] font-mono text-gray-400">••••••••••••••••</span>
              <span className="text-[9px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-bold uppercase font-mono tracking-wider">
                Injetado via Secrets
              </span>
            </div>
            <p className="text-[10px] text-gray-500 leading-normal">
              Você pode alterar a chave secreta a qualquer momento no painel do Google AI Studio em <strong className="text-gray-400">Settings &gt; Secrets</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
