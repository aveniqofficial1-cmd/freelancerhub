import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  TrendingUp,
  FolderKanban,
  Receipt,
  Users,
  Plus
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, setIsCreateProjectOpen } = useApp();

  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'create', label: 'New', icon: Plus, isAction: true },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 border-t border-slate-200 backdrop-blur-lg z-40 flex items-center justify-around px-2 shadow-lg pb-safe">
      {items.map((item) => {
        const Icon = item.icon;
        if (item.isAction) {
          return (
            <button
              key={item.id}
              onClick={() => setIsCreateProjectOpen(true)}
              className="w-11 h-11 -mt-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md font-bold active:scale-95 transition-transform"
            >
              <Plus className="w-6 h-6" />
            </button>
          );
        }

        const isActive = activeView === item.id || (item.id === 'projects' && activeView === 'project_workspace');

        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
