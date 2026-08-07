import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  DollarSign, 
  IndianRupee, 
  CheckCircle2, 
  AlertTriangle,
  Sliders,
  RotateCcw
} from 'lucide-react';
import { GuardrailPolicy } from '../types';

interface MarginGuardrailConfigProps {
  policy: GuardrailPolicy;
  onUpdatePolicy: (updated: GuardrailPolicy) => void;
}

export const MarginGuardrailConfig: React.FC<MarginGuardrailConfigProps> = ({
  policy,
  onUpdatePolicy
}) => {
  const handleToggle = (key: keyof GuardrailPolicy) => {
    onUpdatePolicy({
      ...policy,
      [key]: !policy[key]
    });
  };

  const handleNumChange = (key: keyof GuardrailPolicy, val: number) => {
    onUpdatePolicy({
      ...policy,
      [key]: val
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Policy & Margin Guardrail Control Center
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enforce hard mathematical caps on discount spend, cart eligibility, and self-checking agent safety constraints.
          </p>
        </div>

        <button
          onClick={() => onUpdatePolicy({
            maxDiscountPct: 10,
            maxDiscountCapAmount: 500,
            minCartForDiscount: 999,
            campaignBudgetTotal: 100000,
            campaignBudgetSpent: 34200,
            preventBlanketDiscountOnPaymentFail: true,
            allowCodOnTier3: true,
            requireSelfCheckAudit: true
          })}
          className="text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Recommended Policy
        </button>
      </div>

      {/* Numerical Sliders & Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Max Discount % */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-300">Max Discount % Limit</label>
            <span className="text-sm font-extrabold text-purple-400">{policy.maxDiscountPct}%</span>
          </div>
          <input
            type="range"
            min={2}
            max={20}
            value={policy.maxDiscountPct}
            onChange={(e) => handleNumChange('maxDiscountPct', Number(e.target.value))}
            className="w-full accent-purple-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
          <div className="text-[10px] text-slate-500 mt-2">
            Caps maximum discount offered by agent to protect product gross margin.
          </div>
        </div>

        {/* Max Discount Cap Amount */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-300">Max Discount Cap (₹)</label>
            <span className="text-sm font-extrabold text-emerald-400">₹{policy.maxDiscountCapAmount}</span>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={policy.maxDiscountCapAmount}
            onChange={(e) => handleNumChange('maxDiscountCapAmount', Number(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
          <div className="text-[10px] text-slate-500 mt-2">
            Absolute rupee limit per cart, regardless of high cart total.
          </div>
        </div>

        {/* Min Cart Value Threshold */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-300">Min Cart Threshold for Discount</label>
            <span className="text-sm font-extrabold text-amber-400">₹{policy.minCartForDiscount}</span>
          </div>
          <input
            type="range"
            min={299}
            max={2999}
            step={100}
            value={policy.minCartForDiscount}
            onChange={(e) => handleNumChange('minCartForDiscount', Number(e.target.value))}
            className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
          <div className="text-[10px] text-slate-500 mt-2">
            No discount offered on carts below this value to prevent negative margin.
          </div>
        </div>

      </div>

      {/* Campaign Budget Progress */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-emerald-400" />
            Active Campaign Discount Budget Pool
          </div>
          <div className="text-xs text-slate-300 font-mono">
            Spent: <span className="text-emerald-400 font-bold">₹{policy.campaignBudgetSpent.toLocaleString('en-IN')}</span> / ₹{policy.campaignBudgetTotal.toLocaleString('en-IN')}
          </div>
        </div>
        
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <div 
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (policy.campaignBudgetSpent / policy.campaignBudgetTotal) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
          <span>{((policy.campaignBudgetSpent / policy.campaignBudgetTotal) * 100).toFixed(1)}% Allocated</span>
          <span>Automatic shutdown when budget ceiling is reached</span>
        </div>
      </div>

      {/* Guardrail Policy Toggles */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Strict Safety & Regulatory Rules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
            policy.preventBlanketDiscountOnPaymentFail
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <input
              type="checkbox"
              checked={policy.preventBlanketDiscountOnPaymentFail}
              onChange={() => handleToggle('preventBlanketDiscountOnPaymentFail')}
              className="mt-1 w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700"
            />
            <div>
              <div className="text-xs font-bold text-white mb-0.5 flex items-center gap-1">
                Prevent Discount on Payment Failure
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">
                Mandatory rule: Never offer coupons when UPI / NetBanking fails. Provide instant payment retry link instead.
              </div>
            </div>
          </label>

          <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
            policy.allowCodOnTier3
              ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <input
              type="checkbox"
              checked={policy.allowCodOnTier3}
              onChange={() => handleToggle('allowCodOnTier3')}
              className="mt-1 w-4 h-4 rounded text-indigo-500 focus:ring-indigo-400 bg-slate-900 border-slate-700"
            />
            <div>
              <div className="text-xs font-bold text-white mb-0.5 flex items-center gap-1">
                Tier 2/3 COD Verification
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">
                Enable OTP-verified Cash on Delivery for high-intent shoppers in Tier 2 & Tier 3 cities.
              </div>
            </div>
          </label>

          <label className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
            policy.requireSelfCheckAudit
              ? 'bg-purple-500/10 border-purple-500/40 text-purple-300'
              : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <input
              type="checkbox"
              checked={policy.requireSelfCheckAudit}
              onChange={() => handleToggle('requireSelfCheckAudit')}
              className="mt-1 w-4 h-4 rounded text-purple-500 focus:ring-purple-400 bg-slate-900 border-slate-700"
            />
            <div>
              <div className="text-xs font-bold text-white mb-0.5 flex items-center gap-1">
                Self-Check Audit Agent
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">
                Executes a second validation pass before firing any live nudge to ensure zero policy breaches.
              </div>
            </div>
          </label>

        </div>
      </div>

    </div>
  );
};
