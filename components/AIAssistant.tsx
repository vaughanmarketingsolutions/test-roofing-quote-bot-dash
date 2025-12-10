import React, { useState } from 'react';
import { Sparkles, X, Loader2, MessageSquare } from 'lucide-react';
import { generateDashboardInsights } from '../services/geminiService';
import { Quote } from '../types';

interface AIAssistantProps {
  quotes: Quote[];
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ quotes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setLoading(true);
    const result = await generateDashboardInsights(quotes);
    setInsights(result);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
            setIsOpen(true);
            if (!insights) handleGenerateInsights();
        }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-105 z-50 flex items-center gap-2 group"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-medium">
          Ask AI Agent
        </span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-semibold text-white">AI Analyst</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 overflow-y-auto max-h-[60vh] bg-slate-800">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
            <p className="text-sm">Analyzing quote patterns...</p>
          </div>
        ) : (
          <div className="space-y-4">
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="bg-slate-700/50 rounded-2xl rounded-tl-none p-4 text-slate-200 text-sm leading-relaxed">
                    <p className="mb-2 font-medium text-white">Here is your business performance summary:</p>
                    {/* Render HTML safely since we control the source or trust the specific simple formatting */}
                    <div dangerouslySetInnerHTML={{ __html: insights || '' }} className="prose prose-invert prose-sm prose-ul:pl-4 prose-li:marker:text-indigo-400" />
                </div>
             </div>
             
             <div className="flex justify-end">
                <div className="bg-indigo-600 rounded-2xl rounded-tr-none p-3 text-white text-sm max-w-[80%]">
                    Can you spot any trends in repair jobs?
                </div>
             </div>
             
             <div className="text-center">
                 <button 
                    onClick={handleGenerateInsights}
                    className="text-xs text-indigo-400 hover:text-indigo-300 underline mt-2"
                 >
                    Refresh Analysis
                 </button>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-900/30 border-t border-slate-700">
        <div className="relative">
            <input 
                type="text" 
                placeholder="Ask a question about your metrics..." 
                disabled 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-3 pr-10 text-sm text-slate-400 focus:outline-none cursor-not-allowed opacity-70"
            />
            <MessageSquare className="absolute right-3 top-2.5 w-4 h-4 text-slate-600" />
        </div>
        <p className="text-[10px] text-slate-600 mt-2 text-center">AI generated insights may vary. Verify important financial data.</p>
      </div>
    </div>
  );
};
