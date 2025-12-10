import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { AIAssistant } from './components/AIAssistant';
import { MOCK_QUOTES } from './constants';
import { ViewType } from './types';
import { 
    DashboardPage, 
    QuotesPage, 
    ClientsPage, 
    AnalyticsPage, 
    SettingsPage, 
    NotificationsPage 
} from './components/Pages';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Filter data based on time range
  const filteredQuotes = useMemo(() => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoff = new Date(now.setDate(now.getDate() - days));
    return MOCK_QUOTES.filter(q => new Date(q.date) >= cutoff);
  }, [timeRange]);

  const getHeaderTitle = () => {
      switch(currentView) {
          case 'dashboard': return 'Dashboard Overview';
          case 'quotes': return 'Quote Management';
          case 'clients': return 'Client Database';
          case 'analytics': return 'Performance Analytics';
          case 'settings': return 'System Settings';
          case 'notifications': return 'Notifications';
          default: return 'Dashboard';
      }
  };

  const showTimeFilter = ['dashboard', 'analytics', 'quotes'].includes(currentView);

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">{getHeaderTitle()}</h2>
            <p className="text-sm text-slate-500">
                {currentView === 'dashboard' ? "Welcome back, here's what's happening with your quotebot today." : "Manage and track your roofing business."}
            </p>
          </div>
          
          {showTimeFilter && (
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    timeRange === range 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                >
                    {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
                </button>
                ))}
            </div>
          )}
        </header>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {currentView === 'dashboard' && <DashboardPage quotes={filteredQuotes} allQuotes={MOCK_QUOTES} />}
          {currentView === 'quotes' && <QuotesPage quotes={filteredQuotes} allQuotes={MOCK_QUOTES} />}
          {currentView === 'clients' && <ClientsPage quotes={filteredQuotes} allQuotes={MOCK_QUOTES} />}
          {currentView === 'analytics' && <AnalyticsPage quotes={filteredQuotes} allQuotes={MOCK_QUOTES} />}
          {currentView === 'settings' && <SettingsPage />}
          {currentView === 'notifications' && <NotificationsPage />}
          
          <div className="h-10"></div> {/* Spacer */}
        </main>
      </div>

      <AIAssistant quotes={filteredQuotes} />
    </div>
  );
};

export default App;
