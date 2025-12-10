import React, { useState } from 'react';
import { Quote, QuoteStatus } from '../types';
import { StatCard } from './StatCard';
import { RevenueChart, ServiceDistributionChart, QuotesVolumeChart } from './Charts';
import { RecentQuotesTable } from './RecentQuotesTable';
import { 
  DollarSign, FileCheck, TrendingUp, Activity, Calendar, Search, Filter, Download, 
  Mail, Bell, Shield, User, Users, LayoutTemplate, Link as LinkIcon, Database, 
  FileText, CheckCircle, XCircle, Plus, Trash2, Save, BarChart3, AlertTriangle, Globe
} from 'lucide-react';

interface PageProps {
  quotes: Quote[];
  allQuotes: Quote[]; // For history/clients view that shouldn't be affected by time range
}

export const DashboardPage: React.FC<PageProps> = ({ quotes }) => {
  const totalRevenue = quotes.reduce((sum, q) => sum + q.quoteAmount, 0);
  const totalQuotes = quotes.length;
  const avgValue = totalQuotes > 0 ? totalRevenue / totalQuotes : 0;
  const acceptanceRate = totalQuotes > 0 
    ? (quotes.filter(q => q.status === QuoteStatus.ACCEPTED).length / totalQuotes) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue (Est)" value={`$${totalRevenue.toLocaleString()}`} change="+12.5%" trend="up" icon={DollarSign} colorClass="bg-emerald-500 text-emerald-500" />
        <StatCard title="Quotes Generated" value={totalQuotes.toString()} change="+8.2%" trend="up" icon={FileCheck} colorClass="bg-blue-500 text-blue-500" />
        <StatCard title="Avg Quote Value" value={`$${Math.floor(avgValue).toLocaleString()}`} change="-2.1%" trend="down" icon={TrendingUp} colorClass="bg-amber-500 text-amber-500" />
        <StatCard title="Acceptance Rate" value={`${Math.floor(acceptanceRate)}%`} change="+4.3%" trend="up" icon={Activity} colorClass="bg-violet-500 text-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
            <div className="flex items-center text-sm text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
              Potential Value
            </div>
          </div>
          <RevenueChart quotes={quotes} />
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-white mb-2">Service Distribution</h3>
          <p className="text-sm text-slate-500 mb-6">Breakdown by job type</p>
          <div className="flex-1 min-h-[250px]">
            <ServiceDistributionChart quotes={quotes} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Recent Quotes</h3>
          </div>
          <RecentQuotesTable quotes={quotes} limit={5} />
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-semibold text-white">Quote Volume</h3>
             <Calendar className="w-4 h-4 text-slate-500" />
           </div>
           <p className="text-3xl font-bold text-white mb-1">{quotes.length}</p>
           <p className="text-sm text-slate-500 mb-8">quotes generated in selected period</p>
           <QuotesVolumeChart quotes={quotes} />
        </div>
      </div>
    </div>
  );
};

export const QuotesPage: React.FC<PageProps> = ({ quotes }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="text" placeholder="Search quotes by ID or name..." className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
                Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 hover:text-white transition-colors">
                <Download className="w-4 h-4" />
                Export
            </button>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
        <RecentQuotesTable quotes={quotes} />
      </div>
    </div>
  );
};

export const ClientsPage: React.FC<PageProps> = ({ allQuotes }) => {
  // Aggregate clients
  const clients = Object.values(allQuotes.reduce((acc, quote) => {
    if (!acc[quote.customerName]) {
      acc[quote.customerName] = {
        name: quote.customerName,
        address: quote.address,
        totalSpent: 0,
        quotesCount: 0,
        lastActive: quote.date,
        status: 'Active'
      };
    }
    acc[quote.customerName].totalSpent += quote.quoteAmount;
    acc[quote.customerName].quotesCount += 1;
    if (new Date(quote.date) > new Date(acc[quote.customerName].lastActive)) {
        acc[quote.customerName].lastActive = quote.date;
    }
    return acc;
  }, {} as Record<string, any>));

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-slate-400 text-sm font-medium">Total Clients</h3>
                <p className="text-2xl font-bold text-white mt-1">{clients.length}</p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-slate-400 text-sm font-medium">New This Month</h3>
                <p className="text-2xl font-bold text-white mt-1">12</p>
            </div>
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-slate-400 text-sm font-medium">Avg Lifetime Value</h3>
                <p className="text-2xl font-bold text-white mt-1">$14,250</p>
            </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                        <th className="py-4 px-6 font-medium text-sm">Client Name</th>
                        <th className="py-4 px-6 font-medium text-sm">Location</th>
                        <th className="py-4 px-6 font-medium text-sm">Total Value</th>
                        <th className="py-4 px-6 font-medium text-sm">Quotes</th>
                        <th className="py-4 px-6 font-medium text-sm">Last Active</th>
                        <th className="py-4 px-6 font-medium text-sm">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {clients.map((client, i) => (
                         <tr key={i} className="group hover:bg-slate-700/30 transition-colors">
                            <td className="py-4 px-6 text-slate-200 font-medium">{client.name}</td>
                            <td className="py-4 px-6 text-slate-400 text-sm">{client.address}</td>
                            <td className="py-4 px-6 text-emerald-400 font-medium">${client.totalSpent.toLocaleString()}</td>
                            <td className="py-4 px-6 text-slate-300">{client.quotesCount}</td>
                            <td className="py-4 px-6 text-slate-400 text-sm">{new Date(client.lastActive).toLocaleDateString()}</td>
                            <td className="py-4 px-6">
                                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">View Profile</button>
                            </td>
                         </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export const AnalyticsPage: React.FC<PageProps> = ({ quotes }) => {
    return (
        <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-6">Revenue Performance</h3>
                <div className="h-[400px]">
                    <RevenueChart quotes={quotes} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                     <h3 className="text-xl font-bold text-white mb-4">Service Breakdown</h3>
                     <div className="h-[300px]">
                        <ServiceDistributionChart quotes={quotes} />
                     </div>
                </div>
                 <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                     <h3 className="text-xl font-bold text-white mb-4">Daily Volume</h3>
                     <div className="h-[300px]">
                        <QuotesVolumeChart quotes={quotes} />
                     </div>
                </div>
            </div>
        </div>
    );
}

export const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'team' | 'templates' | 'integrations' | 'system'>('general');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-blue-500" />
                                Business Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Company Name</label>
                                    <input type="text" defaultValue="RoofBot Solutions" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Service Phone</label>
                                    <input type="text" defaultValue="+1 (555) 123-4567" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Service Areas</label>
                                    <textarea defaultValue="Austin, Round Rock, Cedar Park, Pflugerville, Georgetown" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 transition-colors min-h-[80px]" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-500" />
                                Approval Workflows
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <div>
                                        <p className="text-white font-medium">Require Manual Approval</p>
                                        <p className="text-sm text-slate-500">For quotes exceeding a specific amount.</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm text-slate-400">Threshold:</span>
                                        <input type="text" defaultValue="$5,000" className="w-24 bg-slate-800 border border-slate-600 rounded px-2 py-1 text-white text-sm text-right" />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <div>
                                        <p className="text-white font-medium">Auto-Send Quotes</p>
                                        <p className="text-sm text-slate-500">Automatically email quotes under $1,000.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'team':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white">Team Management</h3>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium">
                                <Plus className="w-4 h-4" />
                                Add Member
                            </button>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-900/50">
                                    <tr className="text-slate-400 border-b border-slate-700">
                                        <th className="py-4 px-6 font-medium text-sm">User</th>
                                        <th className="py-4 px-6 font-medium text-sm">Role</th>
                                        <th className="py-4 px-6 font-medium text-sm">Status</th>
                                        <th className="py-4 px-6 font-medium text-sm text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {[
                                        { name: 'Alex Johnson', email: 'alex@roofbot.ai', role: 'Admin', status: 'Active' },
                                        { name: 'Sarah Connor', email: 'sarah@roofbot.ai', role: 'Estimator', status: 'Active' },
                                        { name: 'Mike Ross', email: 'mike@roofbot.ai', role: 'Viewer', status: 'Inactive' },
                                    ].map((user, i) => (
                                        <tr key={i} className="group hover:bg-slate-700/20">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="text-slate-200 font-medium">{user.name}</p>
                                                    <p className="text-slate-500 text-xs">{user.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${user.role === 'Admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-700 text-slate-300'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`flex items-center gap-1.5 text-sm ${user.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button className="text-slate-400 hover:text-rose-400 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'templates':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
                             <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <LayoutTemplate className="w-5 h-5 text-amber-500" />
                                Pricing Tiers
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {['Roof Replacement', 'Repair', 'Gutter Install'].map((service) => (
                                    <div key={service} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                                        <p className="text-slate-300 font-medium mb-3">{service}</p>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs text-slate-500">Base Rate ($)</label>
                                                <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm" placeholder="0.00" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500">Margin (%)</label>
                                                <input type="number" className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white text-sm" placeholder="20" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'integrations':
                 return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                            <div className="p-8 border-b border-slate-700">
                                <h3 className="text-xl font-bold text-white mb-2">Connected Apps</h3>
                                <p className="text-slate-400 text-sm">Manage connections to external CRM and accounting tools.</p>
                            </div>
                            <div className="divide-y divide-slate-700">
                                {[
                                    { name: 'Salesforce', desc: 'Sync leads and quote data automatically.', connected: true, icon: Database },
                                    { name: 'QuickBooks', desc: 'Push invoices when quotes are accepted.', connected: false, icon: FileText },
                                    { name: 'Google Calendar', desc: 'Schedule inspections directly.', connected: true, icon: Calendar },
                                ].map((app) => (
                                    <div key={app.name} className="p-6 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                                                <app.icon className="w-5 h-5 text-slate-300" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium">{app.name}</h4>
                                                <p className="text-sm text-slate-500">{app.desc}</p>
                                            </div>
                                        </div>
                                        <button className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${app.connected ? 'border-red-500/20 text-red-400 hover:bg-red-500/10' : 'bg-blue-600 border-transparent text-white hover:bg-blue-500'}`}>
                                            {app.connected ? 'Disconnect' : 'Connect'}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                 );
            case 'system':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <h4 className="text-slate-300 font-medium mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> API Usage</h4>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-400">Tokens Used (Monthly)</span>
                                            <span className="text-white">1.2M / 5M</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-400">GenAI Calls</span>
                                            <span className="text-white">8,432</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col justify-center items-center text-center">
                                <Download className="w-10 h-10 text-slate-600 mb-4" />
                                <h4 className="text-white font-medium mb-2">Export Data</h4>
                                <p className="text-sm text-slate-500 mb-4">Download full system logs and quote history.</p>
                                <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors">Download CSV</button>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                             <div className="p-6 border-b border-slate-700">
                                <h3 className="text-lg font-bold text-white">System Activity Log</h3>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-900/50 text-slate-400">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">Time</th>
                                        <th className="px-6 py-3 font-medium">User</th>
                                        <th className="px-6 py-3 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 text-slate-300">
                                    <tr>
                                        <td className="px-6 py-3">Today, 10:42 AM</td>
                                        <td className="px-6 py-3">Alex Johnson</td>
                                        <td className="px-6 py-3">Updated pricing tier: Roof Replacement</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-3">Today, 09:15 AM</td>
                                        <td className="px-6 py-3">System</td>
                                        <td className="px-6 py-3">Scheduled backup completed</td>
                                    </tr>
                                     <tr>
                                        <td className="px-6 py-3">Yesterday, 4:20 PM</td>
                                        <td className="px-6 py-3">Sarah Connor</td>
                                        <td className="px-6 py-3">Exported client list to CSV</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Admin Settings</h2>
                    <p className="text-slate-500">Manage your agency configuration and team.</p>
                </div>
                <div className="flex gap-3">
                     <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors border border-slate-700">Cancel</button>
                     <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                     </button>
                </div>
            </div>

            <div className="flex overflow-x-auto border-b border-slate-700 gap-6">
                {[
                    { id: 'general', label: 'General', icon: Globe },
                    { id: 'team', label: 'Team', icon: Users },
                    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
                    { id: 'integrations', label: 'Integrations', icon: LinkIcon },
                    { id: 'system', label: 'System', icon: Activity },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === tab.id 
                                ? 'border-blue-500 text-blue-400' 
                                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {renderTabContent()}
            </div>
        </div>
    );
}

export const NotificationsPage: React.FC = () => {
    const notifications = [
        { id: 1, title: 'New High-Value Quote Generated', desc: 'A roof replacement quote for $18,500 was generated for customer James Smith.', time: '2 mins ago', type: 'success' },
        { id: 2, title: 'API Usage Alert', desc: 'You have reached 80% of your daily token limit for Gemini API.', time: '2 hours ago', type: 'warning' },
        { id: 3, title: 'System Update', desc: 'RoofBot dashboard was updated to version 2.4.0 successfully.', time: '1 day ago', type: 'info' },
        { id: 4, title: 'Quote Rejected', desc: 'Customer Sarah Jones rejected quote #Q-1045. Reason: "Price too high".', time: '1 day ago', type: 'error' },
        { id: 5, title: 'New Lead Detected', desc: '3 new visitors initiated chat sessions in the last hour.', time: '3 days ago', type: 'info' },
    ];

    return (
        <div className="max-w-3xl">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                 <button className="text-sm text-blue-400 hover:text-blue-300">Mark all as read</button>
             </div>
             
             <div className="space-y-4">
                 {notifications.map((n) => (
                     <div key={n.id} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-start gap-4 hover:border-slate-600 transition-colors">
                         <div className={`mt-1 p-2 rounded-full ${
                             n.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                             n.type === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                             n.type === 'error' ? 'bg-rose-500/20 text-rose-400' :
                             'bg-blue-500/20 text-blue-400'
                         }`}>
                             <Bell className="w-4 h-4" />
                         </div>
                         <div className="flex-1">
                             <div className="flex justify-between items-start">
                                 <h4 className="text-slate-200 font-medium">{n.title}</h4>
                                 <span className="text-xs text-slate-500">{n.time}</span>
                             </div>
                             <p className="text-slate-400 text-sm mt-1">{n.desc}</p>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
}