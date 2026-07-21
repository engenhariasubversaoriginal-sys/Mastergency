import React, { useState } from "react";
import { 
  Library, 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  Copy, 
  Eye, 
  X, 
  Check, 
  Calendar,
  AlertCircle,
  Plus
} from "lucide-react";
import { ContentItem, ContentFormat, ContentStatus } from "../types";
import { getContents, saveContents } from "../mockData";

interface LibraryProps {
  contents: ContentItem[];
  onRefreshLibrary: () => void;
  onNavigate: (view: string) => void;
}

export default function LibraryComponent({ contents, onRefreshLibrary, onNavigate }: LibraryProps) {
  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Active viewing/editing item states
  const [viewingItem, setViewingItem] = useState<ContentItem | null>(null);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Edit fields states
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCta, setEditCta] = useState("");
  const [editHashtags, setEditHashtags] = useState("");
  const [editHeadlines, setEditHeadlines] = useState<string[]>([]);

  // Unique destinations/formats in list for filtering
  const allDestinations = Array.from(new Set(contents.map(c => c.destination)));
  const allFormats = Object.values(ContentFormat);

  // Filter computation
  const filteredContents = contents.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.generatedText.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDestination = selectedDestination === "all" || item.destination === selectedDestination;
    const matchesFormat = selectedFormat === "all" || item.format === selectedFormat;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;

    return matchesSearch && matchesDestination && matchesFormat && matchesStatus;
  }).reverse(); // Show newest first

  // Actions
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir permanentemente este conteúdo estratégico?")) {
      const library = getContents();
      const filtered = library.filter(p => p.id !== id);
      saveContents(filtered);
      onRefreshLibrary();
      if (viewingItem?.id === id) setViewingItem(null);
    }
  };

  const handleDuplicate = (item: ContentItem) => {
    const library = getContents();
    const duplicated: ContentItem = {
      ...item,
      id: `post-dup-${Date.now()}`,
      title: `${item.title} (Cópia)`,
      createdAt: new Date().toISOString().split("T")[0],
      status: ContentStatus.DRAFT,
      scheduledDate: undefined
    };
    library.push(duplicated);
    saveContents(library);
    onRefreshLibrary();
  };

  const handleOpenEdit = (item: ContentItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditBody(item.generatedText);
    setEditCta(item.cta);
    setEditHashtags(item.hashtags.join(", "));
    setEditHeadlines([...item.headlines]);
  };

  const handleSaveEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const library = getContents();
    const index = library.findIndex(p => p.id === editingItem.id);
    if (index !== -1) {
      library[index] = {
        ...library[index],
        title: editTitle,
        generatedText: editBody,
        cta: editCta,
        hashtags: editHashtags.split(",").map(h => h.trim().replace("#", "")).filter(Boolean),
        headlines: editHeadlines
      };
      saveContents(library);
      onRefreshLibrary();
      if (viewingItem?.id === editingItem.id) {
        setViewingItem(library[index]);
      }
      setEditingItem(null);
    }
  };

  const handleStatusShift = (item: ContentItem, newStatus: ContentStatus) => {
    const library = getContents();
    const index = library.findIndex(p => p.id === item.id);
    if (index !== -1) {
      library[index].status = newStatus;
      saveContents(library);
      onRefreshLibrary();
      setViewingItem(library[index]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl text-white flex items-center gap-2">
            <Library className="w-8 h-8 text-brand-blue" />
            Biblioteca de Conteúdos
          </h2>
          <p className="text-sm text-gray-400">
            Gerencie, duplique, edite e acompanhe todos os conteúdos criados para sua agência de intercâmbio.
          </p>
        </div>
        <button
          onClick={() => onNavigate("generator")}
          className="px-5 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-white font-bold transition-all flex items-center gap-2 border border-white/10 self-start"
        >
          <Plus className="w-4 h-4 text-brand-blue" />
          Novo Post com IA
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-500" />
          <input
            type="text"
            placeholder="Pesquisar posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs focus:outline-none focus:border-brand-blue text-white"
          />
        </div>

        {/* Category Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
          {/* Destination */}
          <div>
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="all">🌍 Todos Destinos</option>
              {allDestinations.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="all">🎬 Todos Formatos</option>
              {allFormats.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
            >
              <option value="all">📌 Status (Todos)</option>
              {Object.values(ContentStatus).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Contents */}
      {filteredContents.length === 0 ? (
        <div className="py-20 text-center text-gray-500 border border-white/5 bg-white/5 rounded-2xl flex flex-col items-center justify-center space-y-3">
          <AlertCircle className="w-10 h-10 text-gray-600" />
          <div>
            <p className="font-bold text-white text-sm">Nenhum post corresponde aos filtros</p>
            <p className="text-xs text-gray-600">Limpe os filtros ou crie um novo post com IA.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredContents.map((post) => (
            <div
              key={post.id}
              className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-brand-blue/30 hover:shadow-lg hover:shadow-brand-blue/5 transition-all space-y-4 group relative"
            >
              <div className="space-y-3">
                {/* Meta Row */}
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-brand-blue font-mono font-bold uppercase tracking-wider">{post.destination}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold ${
                    post.status === ContentStatus.DRAFT ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    post.status === ContentStatus.APPROVED ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                    post.status === ContentStatus.SCHEDULED ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  }`}>
                    {post.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display font-bold text-white text-base truncate">{post.title}</h3>
                  <p className="text-xs text-gray-500 font-medium">{post.format}</p>
                </div>

                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed font-sans bg-black/25 p-3 rounded-xl border border-white/5">
                  {post.generatedText}
                </p>
              </div>

              {/* Action Buttons Row */}
              <div className="border-t border-white/5 pt-3.5 flex items-center justify-between text-xs text-gray-400">
                <span className="text-[10px] font-mono text-gray-500">Criação: {post.createdAt}</span>
                
                <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-all">
                  {/* View */}
                  <button
                    onClick={() => setViewingItem(post)}
                    className="p-1.5 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="Visualizar Post"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="p-1.5 hover:text-brand-blue hover:bg-brand-blue/10 rounded-lg transition-colors"
                    title="Editar Texto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicate(post)}
                    className="p-1.5 hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-colors"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAIL MODAL */}
      {viewingItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0b0f1a] border border-white/10 rounded-3xl p-4 sm:p-8 space-y-6 relative overflow-hidden my-auto max-h-[90vh] flex flex-col justify-between">
            {/* Top Accent line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-blue to-brand-purple" />

            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-brand-blue/10 text-brand-blue py-0.5 px-2 rounded-full font-bold uppercase font-mono tracking-wider">
                    {viewingItem.format}
                  </span>
                  <span className="text-[10px] bg-white/5 text-gray-400 py-0.5 px-2 rounded-full font-bold uppercase font-mono tracking-wider">
                    {viewingItem.destination}
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-xl">{viewingItem.title}</h3>
                <p className="text-xs text-gray-500">Tema do lead: "{viewingItem.theme}"</p>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Shift Panel */}
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/5 flex flex-wrap gap-2 items-center justify-between text-xs">
              <span className="text-gray-400 font-semibold">Alterar Status do Post:</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleStatusShift(viewingItem, ContentStatus.DRAFT)}
                  className={`px-2.5 py-1 rounded-lg font-bold ${viewingItem.status === ContentStatus.DRAFT ? "bg-amber-500 text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                >
                  Rascunho
                </button>
                <button 
                  onClick={() => handleStatusShift(viewingItem, ContentStatus.APPROVED)}
                  className={`px-2.5 py-1 rounded-lg font-bold ${viewingItem.status === ContentStatus.APPROVED ? "bg-indigo-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                >
                  Aprovado
                </button>
                <button 
                  onClick={() => handleStatusShift(viewingItem, ContentStatus.PUBLISHED)}
                  className={`px-2.5 py-1 rounded-lg font-bold ${viewingItem.status === ContentStatus.PUBLISHED ? "bg-blue-500 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                >
                  Publicado
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[380px] overflow-y-auto pr-2 space-y-4 md:space-y-0">
              {/* Left copy column */}
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-gray-400 uppercase tracking-wide">
                    <span>Conteúdo Estruturado</span>
                    <button 
                      onClick={() => handleCopyText(viewingItem.generatedText, "body")}
                      className="text-brand-blue text-[11px] font-bold hover:underline"
                    >
                      {copiedIndex === "body" ? "✓ Copiado" : "Copiar Texto"}
                    </button>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 text-sm leading-relaxed text-gray-200 whitespace-pre-line font-sans max-h-[250px] overflow-y-auto">
                    {viewingItem.generatedText}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                    <span className="text-[10px] text-gray-500 block uppercase font-mono mb-1">CTA</span>
                    <p className="text-brand-purple font-semibold">{viewingItem.cta}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs">
                    <span className="text-[10px] text-gray-500 block uppercase font-mono mb-1">Hashtags</span>
                    <p className="text-brand-blue font-mono">{viewingItem.hashtags.map(h => `#${h}`).join(" ")}</p>
                  </div>
                </div>
              </div>

              {/* Headlines column */}
              <div className="md:col-span-1 space-y-3">
                <span className="text-xs text-gray-400 uppercase tracking-wide block">10 Headlines Geradas</span>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {viewingItem.headlines?.map((hl, index) => (
                    <div 
                      key={index}
                      onClick={() => handleCopyText(hl, `hl-${index}`)}
                      className="p-2 rounded bg-black/30 border border-white/5 hover:border-brand-blue/30 cursor-pointer transition-all text-xs text-gray-300 relative group flex items-start gap-1.5"
                    >
                      <span className="text-brand-blue font-bold">#{index + 1}</span>
                      <span className="flex-1 pr-3">{hl}</span>
                      {copiedIndex === `hl-${index}` && (
                        <Check className="w-3 h-3 text-emerald-400 absolute right-1.5 top-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex gap-3 justify-end text-xs">
              <button
                onClick={() => {
                  setViewingItem(null);
                  handleOpenEdit(viewingItem);
                }}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white font-semibold transition-all border border-white/5"
              >
                Editar Conteúdo
              </button>
              <button
                onClick={() => setViewingItem(null)}
                className="px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl shadow-md"
              >
                Concluir Visualização
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEditSubmit} className="w-full max-w-2xl bg-[#0b0f1a] border border-white/10 rounded-3xl p-6 md:p-8 space-y-5 relative">
            <h4 className="font-display font-bold text-lg text-white">Editar Postagem Estratégica</h4>
            
            <div className="space-y-4 max-h-[440px] overflow-y-auto pr-2">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase font-mono mb-2">Título do Post</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase font-mono mb-2">Corpo do Texto / Roteiro</label>
                <textarea
                  value={editBody}
                  onChange={(e) => setEditBody(e.target.value)}
                  rows={8}
                  className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none font-sans"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase font-mono mb-2">Chamada para Ação (CTA)</label>
                  <input
                    type="text"
                    value={editCta}
                    onChange={(e) => setEditCta(e.target.value)}
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase font-mono mb-2">Hashtags (Separadas por vírgula)</label>
                  <input
                    type="text"
                    value={editHashtags}
                    onChange={(e) => setEditHashtags(e.target.value)}
                    className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Edit Headlines list */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase font-mono mb-1">Editar Headlines sugeridas (Clique para alterar)</label>
                <div className="space-y-2">
                  {editHeadlines.map((hl, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={hl}
                      onChange={(e) => {
                        const updated = [...editHeadlines];
                        updated[idx] = e.target.value;
                        setEditHeadlines(updated);
                      }}
                      className="w-full bg-gray-900/60 border border-white/5 rounded-lg px-3 py-1.5 text-xs text-gray-300"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2 justify-end text-xs">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white font-bold rounded-xl shadow-md"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
