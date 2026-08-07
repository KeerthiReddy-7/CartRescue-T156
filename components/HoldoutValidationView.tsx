import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  ShieldCheck, 
  TrendingUp, 
  IndianRupee, 
  Percent, 
  Award, 
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { HoldoutExperimentResult } from '../types';

export const MOCK_HOLDOUT_RESULTS: HoldoutExperimentResult[] = [
  {
    groupName: 'Treatment (Cart Rescue AI)',
    sessionCount: 2500,
    convertedCount: 1625,
    conversionRate: 65.0,
    grossRevenue: 5200000,
    totalDiscountCost: 110000,
    netMargin: 1710000, // Product margin 35% minus discount
    avgDiscountPerSession: 44,
    incrementalMarginVsControlA: 485000
  },
  {
    groupName: 'Control A (No Action)',
    sessionCount: 2500,
    convertedCount: 975,
    conversionRate: 39.0,
    grossRevenue: 3510000,
    totalDiscountCost: 0,
    netMargin: 1225000,
    avgDiscountPerSession: 0,
    incrementalMarginVsControlA: 0
  },
  {
    groupName: 'Control B (Blanket 10% Discount)',
    sessionCount: 2500,
    convertedCount: 1450,
    conversionRate: 58.0,
    grossRevenue: 4640000,
    totalDiscountCost: 464000, // 10% on all converted carts
    netMargin: 1160000, // Discount ate all profit!
    avgDiscountPerSession: 185,
    incrementalMarginVsControlA: -65000
  }
];

export const HoldoutValidationView: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Holdout Control Group A/B Validation
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-2 max-w-3xl leading-relaxed">
              <strong>Guardrail Mandatory Requirement:</strong> Every recommended action is validated against a 10% blind holdout control group. Correlation claims are rejected. We compare <strong>Cart Rescue AI</strong> against <strong>No Action</strong> and traditional <strong>Blanket 10% Coupon Blasting</strong>.
            </p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-right">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              Incremental Net Margin Lift
            </div>
            <div className="text-2xl font-black text-emerald-300">
              +₹4,85,000
            </div>
            <div className="text-[11px] text-slate-400">vs Control A (Holdout)</div>
          </div>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Treatment Card */}
        <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-black text-[10px] px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            RECOMMENDED AGENT
          </div>

          <div className="text-sm font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            Treatment: Cart Rescue AI
          </div>
          <div className="text-xs text-slate-400 mb-4">Diagnosis-based action & policy bounds</div>

          <div className="space-y-3 border-t border-slate-800 pt-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Conversion Rate:</span>
              <span className="text-xl font-extrabold text-emerald-400">65.0%</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Avg Discount / Cart:</span>
              <span className="text-sm font-bold text-white">₹44</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Total Discount Spend:</span>
              <span className="text-sm font-bold text-emerald-400">₹1,10,000</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-slate-800 pt-2">
              <span className="text-xs font-bold text-slate-300">Net Profit Margin:</span>
              <span className="text-lg font-black text-emerald-300">₹17,10,000</span>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Saves margin by resolving UPI errors without discounting organic buyers!</span>
          </div>
        </div>

        {/* Control A Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="text-sm font-bold text-slate-300 mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            Control A: No Intervention
          </div>
          <div className="text-xs text-slate-400 mb-4">Baseline organic conversion holdout</div>

          <div className="space-y-3 border-t border-slate-800 pt-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Conversion Rate:</span>
              <span className="text-xl font-extrabold text-slate-300">39.0%</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Avg Discount / Cart:</span>
              <span className="text-sm font-bold text-white">₹0</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Total Discount Spend:</span>
              <span className="text-sm font-bold text-white">₹0</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-slate-800 pt-2">
              <span className="text-xs font-bold text-slate-300">Net Profit Margin:</span>
              <span className="text-lg font-black text-slate-200">₹12,25,000</span>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <span>61% carts abandoned due to unhandled payment timeouts and shipping friction.</span>
          </div>
        </div>

        {/* Control B Card */}
        <div className="bg-slate-900 border border-rose-500/40 rounded-2xl p-5 shadow-xl">
          <div className="text-sm font-bold text-rose-400 mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            Control B: Blanket 10% Coupon
          </div>
          <div className="text-xs text-slate-400 mb-4">Naïve auto-coupon blasting strategy</div>

          <div className="space-y-3 border-t border-slate-800 pt-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Conversion Rate:</span>
              <span className="text-xl font-extrabold text-amber-300">58.0%</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Avg Discount / Cart:</span>
              <span className="text-sm font-bold text-rose-300">₹185</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-400">Total Discount Spend:</span>
              <span className="text-sm font-bold text-rose-400">₹4,64,000</span>
            </div>
            <div className="flex justify-between items-baseline border-t border-slate-800 pt-2">
              <span className="text-xs font-bold text-slate-300">Net Profit Margin:</span>
              <span className="text-lg font-black text-rose-400">₹11,60,000</span>
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>Destroys ₹4.64L in margin! Gives discounts to users who would have converted anyway.</span>
          </div>
        </div>

      </div>

      {/* Chart Visualization */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          Net Margin Comparison (₹) Across Holdout Groups
        </h3>
        
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_HOLDOUT_RESULTS} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="groupName" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Net Profit Margin']}
              />
              <Legend />
              <Bar dataKey="netMargin" name="Net Profit Margin (₹)" radius={[8, 8, 0, 0]}>
                {MOCK_HOLDOUT_RESULTS.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 0 ? '#10b981' : index === 1 ? '#64748b' : '#f43f5e'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
