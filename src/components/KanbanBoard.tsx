import React from "react";
import { 
  Kanban, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Eye, 
  Calendar,
  CheckCircle2,
  Inbox
} from "lucide-react";
import { ContentItem, ContentStatus } from "../types";
import { getContents, saveContents } from "../mockData";

interface KanbanBoardProps {
  contents: ContentItem[];
  onRefreshData: () => void;
  onNavigate: (view: string) => void;
}

export default function KanbanBoard({ contents, onRefreshData, onNavigate }: KanbanBoardProps) {
  const columns = [
    { 
      id: ContentStatus.DRAFT, 
      title: "Rascunhos", 
      desc: "Conteúdos gerados pela IA",
      color: "border-t-amber-500", 
      badge: "bg-amber-500/10 text-amber-400" 
    },
    { 
      id: ContentStatus.APPROVED, 
      title: "Aprovados", 
      desc: "Revisados e prontos",
      color: "border-t-indigo-500", 
      badge: "bg-indigo-500/10 text-indigo-400" 
    },
    { 
      id: ContentStatus.SCHEDULED, 
      title: "Agendados", 
      desc: "Na fila de postagem",
      color: "border-t-emerald-500", 
      badge: "bg-emerald-500/10 text-emerald-400" 
    },
    { 
      id: ContentStatus.PUBLISHED, 
      title: "Publicados", 
      desc: "Postados no IG / TikTok",
      color: "border-t-blue-500", 
      badge: "bg-blue-500/10 text-blue-400" 
    }
  ];

  const handleMove = (item: ContentItem, direction: "left" | "right") => {
    const statusOrder = [
      ContentStatus.DRAFT,
      ContentStatus.APPROVED,
      ContentStatus.SCHEDULED,
      ContentStatus.PUBLISHED
    ];

    const currentIndex = statusOrder.indexOf(item.status);
    let nextIndex = currentIndex;

    if (direction === "right" && currentIndex < statusOrder.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (direction === "left" && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }

    if (nextIndex !== currentIndex) {
      const library = getContents();
      const index = library.findIndex(p => p.id === item.id);
      if (index !== -1) {
        const nextStatus = statusOrder[nextIndex];
        library[index].status = nextStatus;

        // If shifting to Scheduled but doesn't have a date, prefill tomorrow's date
        if (nextStatus === ContentStatus.SCHEDULED && !library[index].scheduledDate) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          library[index].scheduledDate = tomorrow.toISOString().split("T")[0];
        }

        saveContents(library);
        onRefreshData();
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl text-white flex items-center gap-2">
            <Kanban className="w-8 h-8 text-brand-blue" />
            Workflow Kanban
          </h2>
          <p className="text-sm text-gray-400">
            Acompanhe visualmente a produção. Mova os posts nas colunas para mudar as fases da campanha.
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

      {/* Grid of Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start overflow-x-auto pb-4">
        {columns.map((col) => {
          const itemsInCol = contents.filter(item => item.status === col.id);

          return (
            <div
              key={col.id}
              className={`p-4 bg-[#090d16]/80 border border-white/5 rounded-2xl border-t-4 ${col.color} min-w-[250px] space-y-4`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-white text-sm">{col.title}</h3>
                  <span className="text-[10px] text-gray-500 font-mono block">{col.desc}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold font-mono ${col.badge}`}>
                  {itemsInCol.length}
                </span>
              </div>

              {/* Cards List */}
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {itemsInCol.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-white/5 rounded-xl bg-black/10 flex flex-col items-center justify-center space-y-2 text-gray-600">
                    <Inbox className="w-6 h-6" />
                    <span className="text-[11px]">Nenhum card</span>
                  </div>
                ) : (
                  itemsInCol.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 bg-gray-900/60 rounded-xl border border-white/5 hover:border-brand-blue/20 transition-all space-y-3 shadow relative group"
                    >
                      {/* Meta info */}
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-brand-blue font-bold font-mono uppercase">{item.destination}</span>
                        {item.status === ContentStatus.SCHEDULED && item.scheduledDate && (
                          <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.scheduledDate}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <h4 className="font-bold text-white text-xs truncate mb-1">{item.title}</h4>
                        <p className="text-[10px] text-gray-500 line-clamp-1">{item.format}</p>
                      </div>

                      {/* Moving Controls and Action row */}
                      <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                        {/* Shifter Left */}
                        <button
                          onClick={() => handleMove(item, "left")}
                          disabled={item.status === ContentStatus.DRAFT}
                          className="p-1 hover:bg-white/5 text-gray-500 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Voltar Etapa"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onNavigate("library")}
                          className="text-[10px] text-brand-blue hover:underline flex items-center gap-1 font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detalhes</span>
                        </button>

                        {/* Shifter Right */}
                        <button
                          onClick={() => handleMove(item, "right")}
                          disabled={item.status === ContentStatus.PUBLISHED}
                          className="p-1 hover:bg-white/5 text-gray-500 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Avançar Etapa"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
