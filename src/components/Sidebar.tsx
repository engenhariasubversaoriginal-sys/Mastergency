import { 
  Sparkles, 
  LayoutDashboard, 
  Library, 
  Calendar, 
  Kanban, 
  Settings, 
  Coins, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X, 
  User 
} from "lucide-react";
import { UserProfile } from "../types";

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({
  currentView,
  onNavigate,
  user,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Painel", icon: LayoutDashboard },
    { id: "generator", label: "Criador de Conteúdo", icon: Sparkles, highlight: true },
    { id: "library", label: "Biblioteca", icon: Library },
    { id: "calendar", label: "Calendário", icon: Calendar },
    { id: "kanban", label: "Workflow Kanban", icon: Kanban },
    { id: "settings", label: "Configurações", icon: Settings },
    { id: "credits", label: "Comprar Créditos", icon: Coins },
  ];

  if (user?.role === "admin") {
    menuItems.push({ id: "admin", label: "Painel Admin", icon: ShieldAlert, highlight: false });
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-3.5 px-4 bg-gray-950/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center shadow-lg shadow-brand-blue/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-base bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">
            Mastergency
          </span>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg text-xs font-bold text-yellow-400">
              <Coins className="w-3.5 h-3.5" />
              <span>{user.availableCredits} crd</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            id="btn-sidebar-open"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 glass-panel-heavy border-r border-white/10 z-50 flex flex-col justify-between overflow-y-auto transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 sm:p-6 flex-1">
          {/* Logo Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center shadow-lg shadow-brand-blue/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display font-extrabold text-xl bg-gradient-to-r from-brand-blue via-indigo-400 to-brand-purple bg-clip-text text-transparent leading-none">
                  Mastergency
                </h1>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                  Exchange SaaS
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              id="btn-sidebar-close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Preview */}
          {user && (
            <div className="p-3 mb-6 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow">
                {user.fullName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Coins className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-yellow-400 font-bold">{user.availableCredits} crd</span>
                </div>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-brand-blue/20 to-brand-purple/10 text-brand-blue border-l-4 border-brand-blue"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent"
                  } ${item.highlight && !isActive ? "animate-pulse shadow-sm shadow-brand-blue/5" : ""}`}
                  id={`nav-item-${item.id}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-brand-blue" : "text-gray-400"}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.highlight && (
                    <span className="text-[10px] bg-brand-blue/20 text-brand-blue py-0.5 px-1.5 rounded-full font-bold uppercase tracking-wider scale-90">
                      IA
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 px-2">
            <span>Versão 1.2.0</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Online
            </span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
            id="btn-logout"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>
    </>
  );
}
