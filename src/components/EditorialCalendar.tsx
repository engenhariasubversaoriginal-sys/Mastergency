import React, { useState } from "react";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Eye, 
  X, 
  CalendarDays,
  PlusCircle,
  TrendingUp,
  FileText
} from "lucide-react";
import { ContentItem, ContentStatus } from "../types";
import { getContents, saveContents } from "../mockData";

interface EditorialCalendarProps {
  contents: ContentItem[];
  onRefreshData: () => void;
  onNavigate: (view: string) => void;
}

export default function EditorialCalendar({ contents, onRefreshData, onNavigate }: EditorialCalendarProps) {
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed: 6)
  const [selectedDayPost, setSelectedDayPost] = useState<ContentItem | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Simple date helpers for month rendering
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Sunday=0, Monday=1, ...

  // Create calendar grid cell values
  const calendarCells: (number | null)[] = [];
  // Fill leading empty cells
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  // Fill month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const getDayPosts = (day: number) => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const monthStr = (currentMonth + 1) < 10 ? `0${currentMonth + 1}` : `${currentMonth + 1}`;
    const dateQuery = `${currentYear}-${monthStr}-${dayStr}`;

    return contents.filter(
      c => c.status === ContentStatus.SCHEDULED && c.scheduledDate === dateQuery
    );
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDayPost || !rescheduleDate) return;

    const library = getContents();
    const index = library.findIndex(p => p.id === selectedDayPost.id);
    if (index !== -1) {
      library[index].scheduledDate = rescheduleDate;
      saveContents(library);
      onRefreshData();
      setSelectedDayPost({ ...selectedDayPost, scheduledDate: rescheduleDate });
    }
    setSelectedDayPost(null);
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl text-white flex items-center gap-2">
            <Calendar className="w-8 h-8 text-brand-blue" />
            Calendário Editorial
          </h2>
          <p className="text-sm text-gray-400">
            Acompanhe a data de publicação dos posts aprovados e reagende as postagens arrastando ou clicando.
          </p>
        </div>
        <button
          onClick={() => onNavigate("generator")}
          className="px-5 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-white font-bold transition-all flex items-center gap-2 border border-white/10 self-start"
        >
          <PlusCircle className="w-4 h-4 text-brand-blue" />
          Gerar Novo Post
        </button>
      </div>

      {/* Calendar Control Navigation */}
      <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="font-display font-bold text-lg text-white">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
            <span className="text-gray-400">Agendados ({contents.filter(c => c.status === ContentStatus.SCHEDULED).length})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
            <span className="text-gray-400">Rascunhos/Aprovados ({contents.filter(c => c.status === ContentStatus.DRAFT || c.status === ContentStatus.APPROVED).length})</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden">
        {/* Days of Week Row */}
        <div className="grid grid-cols-7 border-b border-white/5 bg-black/30 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 auto-rows-[110px] md:auto-rows-[130px] border-l border-t border-white/5">
          {calendarCells.map((day, cellIndex) => {
            const hasDay = day !== null;
            const posts = hasDay ? getDayPosts(day) : [];

            return (
              <div
                key={cellIndex}
                className={`p-2 border-r border-b border-white/5 flex flex-col justify-between transition-colors ${
                  hasDay ? "bg-gray-950/40 hover:bg-white/2" : "bg-black/10"
                }`}
              >
                {/* Day number */}
                <span className={`text-xs font-semibold font-mono ${
                  day === 17 && currentMonth === 6 && currentYear === 2026 // Current local date (July 17, 2026)
                    ? "w-6 h-6 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold"
                    : "text-gray-500"
                }`}>
                  {day}
                </span>

                {/* Day Scheduled Posts */}
                <div className="flex-1 overflow-y-auto mt-2 space-y-1">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedDayPost(post)}
                      className="p-1 px-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded font-medium truncate cursor-pointer hover:bg-emerald-500/20 transition-all flex items-center gap-1"
                    >
                      <Clock className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{post.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Scheduled Post Details Drawer / Modal */}
      {selectedDayPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#0b0f1a] border border-white/10 rounded-3xl p-6 relative">
            <button
              onClick={() => setSelectedDayPost(null)}
              className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-0.5 px-2 rounded-full font-bold uppercase font-mono tracking-wider">
                    {selectedDayPost.format}
                  </span>
                  <span className="text-[10px] bg-brand-blue/10 text-brand-blue py-0.5 px-2 rounded-full font-bold uppercase font-mono tracking-wider">
                    {selectedDayPost.destination}
                  </span>
                </div>
                <h4 className="font-display font-bold text-white text-lg">{selectedDayPost.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Post agendado para publicação em <strong className="text-emerald-400 font-mono">{selectedDayPost.scheduledDate}</strong>.
                </p>
              </div>

              {/* Text Preview Box */}
              <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-xs text-gray-300 leading-relaxed font-sans max-h-[160px] overflow-y-auto whitespace-pre-line border-l-2 border-l-emerald-500">
                {selectedDayPost.generatedText}
              </div>

              {/* Rescheduling Form */}
              <form onSubmit={handleRescheduleSubmit} className="space-y-3 pt-3 border-t border-white/5">
                <span className="text-xs text-gray-400 uppercase font-mono font-bold tracking-wider block">Reagendar Post</span>
                <div className="flex gap-2">
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="flex-1 bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                    min="2026-07-17"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-gradient-to-r from-brand-blue to-brand-purple text-white text-xs font-bold rounded-xl shadow"
                  >
                    Confirmar Data
                  </button>
                </div>
              </form>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  onClick={() => {
                    setSelectedDayPost(null);
                    onNavigate("library");
                  }}
                  className="w-full py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Visualizar / Editar na Biblioteca
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
