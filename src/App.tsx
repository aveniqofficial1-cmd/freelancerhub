import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { AuthModal } from './components/common/AuthModal';
import { WalkthroughGuideModal } from './components/common/WalkthroughGuideModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';

// Views
import { LandingPage } from './views/LandingPage';
import { DashboardView } from './views/DashboardView';
import { ProfileView } from './views/ProfileView';
import { PublicProfilePage } from './views/PublicProfilePage';
import { PublicVerificationPage } from './views/PublicVerificationPage';
import { LeadsView } from './views/LeadsView';
import { ClientsView } from './views/ClientsView';
import { ProjectWorkspaceView } from './views/ProjectWorkspaceView';
import { PortfolioView } from './views/PortfolioView';
import { InvoicesView } from './views/InvoicesView';
import { TemplatesView } from './views/TemplatesView';
import { AnalyticsView } from './views/AnalyticsView';
import { AIAssistantView } from './views/AIAssistantView';
import { SettingsView } from './views/SettingsView';
import { ClientPortalView } from './views/ClientPortalView';
import { DocumentsView } from './views/DocumentsView';

export const App: React.FC = () => {
  const { activeView, isAuthenticated } = useApp();

  // Public Fullscreen Pages
  if (activeView === 'landing' || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <LandingPage />
        <AuthModal />
        <ToastContainer />
      </div>
    );
  }

  if (activeView === 'public_profile') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <PublicProfilePage />
        <ToastContainer />
      </div>
    );
  }

  if (activeView === 'verification') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <PublicVerificationPage />
        <ToastContainer />
      </div>
    );
  }

  if (activeView === 'client_portal') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <ClientPortalView />
        <ToastContainer />
      </div>
    );
  }

  // Authenticated Main Workspace Layout
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden select-none">
      {/* Left Sidebar (Desktop/Tablet) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-8 bg-slate-50">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'profile' && <ProfileView />}
          {activeView === 'portfolio' && <PortfolioView />}
          {activeView === 'leads' && <LeadsView />}
          {activeView === 'clients' && <ClientsView />}
          {(activeView === 'projects' || activeView === 'project_workspace' || activeView === 'deliverables') && (
            <ProjectWorkspaceView />
          )}
          {activeView === 'documents' && <DocumentsView />}
          {(activeView === 'invoices' || activeView === 'payments') && <InvoicesView />}
          {activeView === 'templates' && <TemplatesView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'ai_assistant' && <AIAssistantView />}
          {activeView === 'settings' && <SettingsView />}
        </main>

        <MobileNav />
      </div>

      {/* Global Modals & Notifications */}
      <GlobalSearchModal />
      <AuthModal />
      <CreateProjectModal />
      <WalkthroughGuideModal />
      <ToastContainer />
    </div>
  );
};
