import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  ShieldCheck, 
  Eye, 
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { UserSession, ActionCategory } from '../types';

interface AuditLogsViewProps {
  sessions: UserSession[];
  onInspectSession: (session: UserSession) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ sessions, onInspectSession }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReasonFilter, setSelectedReasonFilter] = useState<string>('ALL');

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = 
      s.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.predictedReason && s.predictedReason.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedReasonFilter === 'ALL') return matchesSearch;
    if (selectedReasonFilter === 'UPI_PAYMENT_FAILURE') return matchesSearch && (s.predictedReason === 'UPI_PAYMENT_FAILURE' || s.predictedReason === 'NETBANKING_TIMEOUT');
    if (selectedReasonFilter === 'PRICE_SHOPPING') return matchesSearch && s.predictedReason === 'PRICE_SHOPPING_COMPARISON';
    if (selectedReasonFilter === 'SHIPPING_FEE') return matchesSearch && s.predictedReason === 'SURPRISE_SHIPPING_COST';
    if (selectedReasonFilter === 'DO_NOTHING') return matchesSearch && s.recommendedAction === 'DO_NOTHING';

    return matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['SessionID', 'Customer', 'CityTier', 'CartValue_INR', 'RiskScore', 'DiagnosisReason', 'RecommendedAction', 'Discount_INR', 'Latency_MS', 'Timestamp'];
    const rows = filteredSessions.map(s => [
      s.sessionId,
      `"${s.customerName}"`,
      s.cityTier,
      s.cartValue,
      s.riskScore || 0,
      s.predictedReason || 'N/A',
      s.recommendedAction || 'N/A',
      s.discountOfferedAmount || 0,
      s.latencyMs || 0,
      s.timestamp
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cart_rescue_audit_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getActionBadgeColor = (action?: ActionCategory) => {
    switch (action) {
      case 'INSTANT_UPI_RETRY':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'FREE_EXPRESS_SHIPPING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'TARGETED_MARGIN_DISCOUNT':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'COD_ENABLE_VERIFICATION':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'DO_NOTHING':
        return 'bg-slate-800 text-slate-400 border-slate-700';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 text-white">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight">
              Real-Time Session Decision Audit Log
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete compliance logging of risk score, signals behind it, and chosen policy action for every session.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-colors"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          Export Audit Trail (CSV)
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by session ID, customer name, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Sessions' },
            { id: 'UPI_PAYMENT_FAILURE', label: 'Payment Failures' },
            { id: 'PRICE_SHOPPING', label: 'Price Compare' },
            { id: 'SHIPPING_FEE', label: 'Shipping Friction' },
            { id: 'DO_NOTHING', label: 'Do Nothing' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedReasonFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                selectedReasonFilter === f.id
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Session ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Cart Total</th>
              <th className="p-3">Risk Score</th>
              <th className="p-3">Diagnosis Reason</th>
              <th className="p-3">Policy Action</th>
              <th className="p-3">Discount (₹)</th>
              <th className="p-3">Latency</th>
              <th className="p-3 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredSessions.map((s) => (
              <tr key={s.sessionId} className="hover:bg-slate-900/60 transition-colors">
                <td className="p-3 font-bold text-indigo-300 whitespace-nowrap">{s.sessionId}</td>
                <td className="p-3 font-sans font-medium text-white whitespace-nowrap">
                  {s.customerName} <span className="text-[10px] text-slate-500 font-mono">({s.cityTier})</span>
                </td>
                <td className="p-3 font-bold text-emerald-400 whitespace-nowrap">₹{s.cartValue.toLocaleString('en-IN')}</td>
                <td className="p-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    (s.riskScore || 0) > 75 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (s.riskScore || 0) > 40 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {s.riskScore || 0}/100
                  </span>
                </td>
                <td className="p-3 font-sans font-semibold text-amber-300 whitespace-nowrap">
                  {s.predictedReason || 'LOW_INTENT_BROWSING'}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getActionBadgeColor(s.recommendedAction)}`}>
                    {s.recommendedAction || 'DO_NOTHING'}
                  </span>
                </td>
                <td className="p-3 text-white font-bold whitespace-nowrap">
                  {s.discountOfferedAmount ? `₹${s.discountOfferedAmount}` : '₹0'}
                </td>
                <td className="p-3 text-slate-400 whitespace-nowrap">{s.latencyMs || 115}ms</td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button
                    onClick={() => onInspectSession(s)}
                    className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 transition-colors"
                    title="View XAI Multi-Agent Step Trace"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
