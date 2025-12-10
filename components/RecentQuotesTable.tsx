import React from 'react';
import { Quote, QuoteStatus } from '../types';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface RecentQuotesTableProps {
  quotes: Quote[];
  limit?: number;
}

const StatusBadge: React.FC<{ status: QuoteStatus }> = ({ status }) => {
  const styles = {
    [QuoteStatus.ACCEPTED]: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    [QuoteStatus.REJECTED]: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    [QuoteStatus.PENDING]: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    [QuoteStatus.COMPLETED]: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  const icons = {
    [QuoteStatus.ACCEPTED]: CheckCircle,
    [QuoteStatus.REJECTED]: XCircle,
    [QuoteStatus.PENDING]: Clock,
    [QuoteStatus.COMPLETED]: CheckCircle,
  };

  const Icon = icons[status] || AlertCircle;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      <Icon className="w-3 h-3 mr-1.5" />
      {status}
    </span>
  );
};

export const RecentQuotesTable: React.FC<RecentQuotesTableProps> = ({ quotes, limit }) => {
  const displayQuotes = limit ? quotes.slice(0, limit) : quotes;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700">
            <th className="py-4 px-4 font-medium text-sm">Customer</th>
            <th className="py-4 px-4 font-medium text-sm">Service</th>
            <th className="py-4 px-4 font-medium text-sm">Date</th>
            <th className="py-4 px-4 font-medium text-sm">Amount</th>
            <th className="py-4 px-4 font-medium text-sm">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {displayQuotes.map((quote) => (
            <tr key={quote.id} className="group hover:bg-slate-800/50 transition-colors">
              <td className="py-4 px-4">
                <div className="flex flex-col">
                  <span className="text-slate-200 font-medium">{quote.customerName}</span>
                  <span className="text-slate-500 text-xs">{quote.address}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-slate-300 text-sm">{quote.serviceType}</td>
              <td className="py-4 px-4 text-slate-400 text-sm">{new Date(quote.date).toLocaleDateString()}</td>
              <td className="py-4 px-4 text-slate-200 font-medium">${quote.quoteAmount.toLocaleString()}</td>
              <td className="py-4 px-4">
                <StatusBadge status={quote.status} />
              </td>
            </tr>
          ))}
          {displayQuotes.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                No quotes found for this period.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
