import React from 'react';
import { LayoutDashboard, FileText, Settings, Users, PieChart, Bell } from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">R</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">RoofBot<span className="text-blue-500">.ai</span></h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => onNavigate('dashboard')}
        />
        <SidebarItem 
            icon={FileText} 
            label="Quotes" 
            active={currentView === 'quotes'} 
            onClick={() => onNavigate('quotes')}
        />
        <SidebarItem 
            icon={Users} 
            label="Clients" 
            active={currentView === 'clients'} 
            onClick={() => onNavigate('clients')}
        />
        <SidebarItem 
            icon={PieChart} 
            label="Analytics" 
            active={currentView === 'analytics'} 
            onClick={() => onNavigate('analytics')}
        />
        <div className="pt-4 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">System</p>
        </div>
        <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={currentView === 'settings'} 
            onClick={() => onNavigate('settings')}
        />
        <SidebarItem 
            icon={Bell} 
            label="Notifications" 
            active={currentView === 'notifications'} 
            onClick={() => onNavigate('notifications')}
            badge="3" 
        />
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <img 
            src="https://picsum.photos/40/40" 
            alt="Admin" 
            className="w-9 h-9 rounded-full border border-slate-600" 
          />
          <div>
            <p className="text-sm font-medium text-white">Alex Johnson</p>
            <p className="text-xs text-slate-500">Agency Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<{ 
    icon: any, 
    label: string, 
    active?: boolean, 
    badge?: string,
    onClick: () => void 
}> = ({ icon: Icon, label, active, badge, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${active ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && (
        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
    )}
  </button>
);
