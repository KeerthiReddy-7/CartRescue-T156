import React from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  BarChart2, 
  PieChart as PieIcon, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Layers,
  IndianRupee,
  Activity
} from 'lucide-react';
import { UserSession } from '../types';

interface AnalyticsDashboardProps {
  sessions: UserSession[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ sessions }) => {
  // Aggregate Abandonment Reasons
  const reasonCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    const reason = s.predictedReason || 'LOW_INTENT_BROWSING';
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });

  const reasonData = Object.entries(reasonCounts).map(([reason, count]) => ({
    name: reason.replace(/_/g, ' '),
    count
  }));

  // Aggregate Action Categories
  const actionCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    const action = s.recommendedAction || 'DO_NOTHING';
    actionCounts[action] = (actionCounts[action] || 0) + 1;
  });

  const actionData = Object.entries(actionCounts).map(([action, count]) => ({
    name: action.replace(/_/g, ' '),
    count
  }));

  // Colors for charts
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

  const totalSessionsCount = sessions.length || 1;
  const paymentFailureCount = sessions.filter(s => s.predictedReason === 'UPI_PAYMENT_FAILURE' || s.predictedReason === 'NETBANKING_TIMEOUT').length;
  const priceShoppingCount = sessions.filter(s => s.predictedReason === 'PRICE_SHOPPING_COMPARISON').length;
  const shippingFrictionCount = sessions.filter(s => s.predictedReason === 'SURPRISE_SHIPPING_COST').length;

  return (
    <div className="space-y-6">
      
      {/* Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Payment Failures (UPI/NetBanking)
          </div>
          <div className="text-2xl font-black text-rose-400">
            {((paymentFailureCount / totalSessionsCount) * 100).toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {paymentFailureCount} sessions · Zero discount wasted
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Price Shopping Comparison
          </div>
          <div className="text-2xl font-black text-purple-400">
            {((priceShoppingCount / totalSessionsCount) * 100).toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {priceShoppingCount} sessions · Targeted margin coupon
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Shipping & Delivery Friction
          </div>
          <div className="text-2xl font-black text-amber-400">
            {((shippingFrictionCount / totalSessionsCount) * 100).toFixed(1)}%
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {shippingFrictionCount} sessions · Free shipping upgrade
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            Avg AI Decision Cost
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ₹0.015 <span className="text-xs font-normal text-slate-400">/ decision</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Fast heuristic + Gemini fallback
          </p>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Abandonment Diagnosis Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-indigo-400" />
            Abandonment Reason Diagnosis Breakdown
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reasonData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {reasonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommended Action Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-400" />
            Policy-Bounded Recommended Actions
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actionData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="count" name="Session Count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
