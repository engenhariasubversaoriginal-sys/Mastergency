import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import Auth from "./components/Auth";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ContentGenerator from "./components/ContentGenerator";
import LibraryComponent from "./components/Library";
import EditorialCalendar from "./components/EditorialCalendar";
import KanbanBoard from "./components/KanbanBoard";
import SettingsComponent from "./components/Settings";
import CreditShop from "./components/CreditShop";
import AdminPanel from "./components/AdminPanel";

import { UserProfile, Agency, ContentItem, CreditPackage, CreditTransaction } from "./types";
import { 
  getUserProfile, 
  getAgency, 
  getContents, 
  getPackages, 
  getTransactions 
} from "./mockData";

export default function App() {
  // Authentication states
  const [user, setUser] = useState<UserProfile | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);

  // App navigation state: "landing" | "auth" | dashboard views
  const [view, setView] = useState<string>("landing");
  const [authMode, setAuthMode] = useState<"login" | "register" | "recovery">("login");

  // App dataset states
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);

  // Generator pre-fill parameters
  const [genPrefill, setGenPrefill] = useState<any>(null);

  // Responsive mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load user session and state on mount
  useEffect(() => {
    const activeUser = getUserProfile();
    const activeAgency = getAgency();
    
    if (activeUser && activeAgency) {
      setUser(activeUser);
      setAgency(activeAgency);
      setView("dashboard");
      refreshData();
    } else {
      // Default views for unauthenticated users
      setView("landing");
    }
  }, []);

  const refreshData = () => {
    setContents(getContents());
    setPackages(getPackages());
    setTransactions(getTransactions());
  };

  const handleLoginSuccess = (loggedInUser: UserProfile, loggedInAgency: Agency) => {
    setUser(loggedInUser);
    setAgency(loggedInAgency);
    setView("dashboard");
    refreshData();
  };

  const handleLogout = () => {
    localStorage.removeItem("globoai_user");
    // Preserve default agency data, just clear active session
    setUser(null);
    setView("landing");
  };

  const handleNavigate = (targetView: string, extraParams?: any) => {
    if (targetView === "generator" && extraParams) {
      setGenPrefill(extraParams);
    } else {
      setGenPrefill(null);
    }
    setView(targetView);
    setSidebarOpen(false); // Close sidebar on mobile navigation
    refreshData();
  };

  // Helper to sync user profile state after credit purchases/generations
  const handleRefreshUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleRefreshAgency = (updatedAgency: Agency) => {
    setAgency(updatedAgency);
  };

  // Render view router helper
  const renderActiveView = () => {
    if (!user || !agency) return null;

    switch (view) {
      case "dashboard":
        return (
          <Dashboard 
            user={user} 
            contents={contents} 
            onNavigate={handleNavigate}
            onRefreshData={refreshData}
          />
        );
      case "generator":
        return (
          <ContentGenerator 
            user={user} 
            agency={agency} 
            onRefreshUser={handleRefreshUser}
            onNavigate={handleNavigate}
            prefillParams={genPrefill}
          />
        );
      case "library":
        return (
          <LibraryComponent 
            contents={contents} 
            onRefreshLibrary={refreshData} 
            onNavigate={handleNavigate}
          />
        );
      case "calendar":
        return (
          <EditorialCalendar 
            contents={contents} 
            onRefreshData={refreshData} 
            onNavigate={handleNavigate}
          />
        );
      case "kanban":
        return (
          <KanbanBoard 
            contents={contents} 
            onRefreshData={refreshData} 
            onNavigate={handleNavigate}
          />
        );
      case "credits":
        return (
          <CreditShop 
            user={user} 
            packages={packages} 
            transactions={transactions} 
            onRefreshUser={handleRefreshUser}
            onRefreshTransactions={refreshData}
          />
        );
      case "settings":
        return (
          <SettingsComponent 
            agency={agency} 
            user={user} 
            onRefreshAgency={handleRefreshAgency}
            onRefreshUser={handleRefreshUser}
          />
        );
      case "admin":
        if (user.role !== "admin") {
          return (
            <div className="p-8 text-center text-rose-400 font-bold border border-rose-500/10 bg-rose-500/5 rounded-2xl">
              Acesso restrito! Somente administradores autorizados possuem acesso a este painel estratégico.
            </div>
          );
        }
        return <AdminPanel onRefreshData={refreshData} />;
      default:
        return (
          <Dashboard 
            user={user} 
            contents={contents} 
            onNavigate={handleNavigate}
          />
        );
    }
  };

  // Unauthenticated routing
  if (!user) {
    if (view === "auth") {
      return (
        <Auth 
          onAuthSuccess={(userProfile) => {
            const actAgency = getAgency();
            handleLoginSuccess(userProfile, actAgency);
          }} 
          onBackToLanding={() => setView("landing")} 
          initialMode={authMode === "register" ? "register" : "login"}
        />
      );
    }
    return (
      <LandingPage 
        onLoginClick={() => {
          setAuthMode("login");
          setView("auth");
        }}
        onRegisterClick={() => {
          setAuthMode("register");
          setView("auth");
        }}
        packages={getPackages()}
      />
    );
  }

  // Authenticated Dashboard Layout
  return (
    <div className="min-h-screen bg-[#070a13] text-gray-100 flex font-sans antialiased overflow-x-hidden">
      {/* Background Ambience Dots */}
      <div className="fixed inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-brand-blue/10 blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand-purple/10 blur-3xl pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar 
        currentView={view} 
        onNavigate={handleNavigate} 
        user={user} 
        onLogout={handleLogout} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Pane */}
      <main className="flex-1 min-w-0 md:pl-72 flex flex-col min-h-screen">
        <div className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto space-y-8">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}
