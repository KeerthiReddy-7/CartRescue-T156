import React, { useState } from 'react';
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Smartphone, 
  Truck, 
  Tag, 
  Clock, 
  RotateCw, 
  Send,
  Sparkles,
  Eye,
  Info,
  ArrowRight,
  ExternalLink,
  Bot
} from 'lucide-react';
import { UserSession, GuardrailPolicy, ActionCategory } from '../types';
import { evaluateSessionFast, evaluateSessionWithGemini } from '../services/geminiAgent';

interface LiveSessionSimulatorProps {
  policy: GuardrailPolicy;
  onSessionEvaluated: (session: UserSession) => void;
  useGeminiAI: boolean;
  onInspectSession: (session: UserSession) => void;
}

export const LiveSessionSimulator: React.FC<LiveSessionSimulatorProps> = ({
  policy,
  onSessionEvaluated,
  useGeminiAI,
  onInspectSession
}) => {
  // Test Session Interactive State
  const [cartValue, setCartValue] = useState<number>(3499);
  const [cityTier, setCityTier] = useState<'Tier 1' | 'Tier 2' | 'Tier 3'>('Tier 2');
  const [paymentAttempts, setPaymentAttempts] = useState<number>(2);
  const [failedPaymentMethod, setFailedPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD_Rejected' | 'None'>('UPI');
  const [shippingFee, setShippingFee] = useState<number>(149);
  const [estimatedDeliveryDays, setEstimatedDeliveryDays] = useState<number>(4);
  const [tabSwitchCount, setTabSwitchCount] = useState<number>(3);
  const [mouseExitIntent, setMouseExitIntent] = useState<boolean>(true);
  const [timeOnPageSec, setTimeOnPageSec] = useState<number>(320);

  // Computed Evaluation State
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [lastScoredSession, setLastScoredSession] = useState<UserSession | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);

    const testSession: UserSession = {
      sessionId: `LIVE-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: 'Karan Mehra',
      customerPhone: '+91 98198 76543',
      customerEmail: 'karan.m@gmail.com',
      cityTier,
      isFirstTimeUser: cityTier !== 'Tier 1',
      cartItems: [
        { id: 'item1', name: 'Fire-Boltt Ninja Smartwatch', category: 'Wearables', price: 2199, quantity: 1 },
        { id: 'item2', name: 'Realme Fast Charging Powerbank', category: 'Accessories', price: cartValue - 2199 > 0 ? cartValue - 2199 : 1299, quantity: 1 }
      ],
      cartValue,
      productMarginPct: 40,
      timeOnPageSec,
      idleTimeSec: 25,
      mouseExitIntent,
      paymentAttempts,
      failedPaymentMethod,
      shippingFee,
      estimatedDeliveryDays,
      tabSwitchCount,
      historicalConversionRate: 0.20,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      status: 'ACTIVE'
    };

    let result;
    if (useGeminiAI) {
      result = await evaluateSessionWithGemini(testSession, policy);
    } else {
      result = evaluateSessionFast(testSession, policy);
    }

    setLastScoredSession(result.session);
    onSessionEvaluated(result.session);
    setIsEvaluating(false);
    setShowToast(true);

    // Auto-dismiss toast after 6s
    setTimeout(() => {
      setShowToast(false);
    }, 6000);
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
      case 'EXIT_INTENT_TRUST_BADGE':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'DO_NOTHING':
        return 'bg-slate-700/60 text-slate-300 border-slate-600';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 md:p-6 mb-8 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Real-Time Cart Session Simulator
            </h2>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold px-2.5 py-0.5 rounded-full">
              Interactive Test Bench
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate real shopper cart behavior, adjust payment friction, delivery charges & competitor tab switches to test AI risk scoring in real time.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isEvaluating}
          className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
        >
          {isEvaluating ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              Scoring Risk...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Run Real-Time Agent Score
            </>
          )}
        </button>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        
        {/* Cart Value Slider */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-300">Cart Total (₹)</label>
            <span className="text-sm font-extrabold text-emerald-400">₹{cartValue.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min={499}
            max={25000}
            step={250}
            value={cartValue}
            onChange={(e) => setCartValue(Number(e.target.value))}
            className="w-full accent-emerald-500 bg-slate-700 h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>₹499 (Low)</span>
            <span>₹25,000 (High)</span>
          </div>
        </div>

        {/* Failed Payment Method Toggle */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
          <label className="text-xs font-semibold text-slate-300 block mb-2">Payment Gateway Status</label>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {(['UPI', 'NetBanking', 'Card', 'None'] as const).map((method) => (
              <button
                key={method}
                onClick={() => {
                  setFailedPaymentMethod(method);
                  setPaymentAttempts(method === 'None' ? 0 : Math.max(1, paymentAttempts));
                }}
                className={`py-1.5 px-2 rounded-lg text-center font-medium border transition-all ${
                  failedPaymentMethod === method
                    ? method === 'None'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:border-slate-600'
                }`}
              >
                {method === 'None' ? 'No Error' : `Failed: ${method}`}
              </button>
            ))}
          </div>
        </div>

        {/* Shipping Fee & Delivery Friction */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-300">Shipping Fee (₹)</label>
            <span className="text-xs font-bold text-amber-400">₹{shippingFee}</span>
          </div>
          <input
            type="range"
            min={0}
            max={299}
            step={25}
            value={shippingFee}
            onChange={(e) => setShippingFee(Number(e.target.value))}
            className="w-full accent-amber-500 bg-slate-700 h-1.5 rounded-lg cursor-pointer mb-2"
          />

          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Est. Delivery:</span>
            <select
              value={estimatedDeliveryDays}
              onChange={(e) => setEstimatedDeliveryDays(Number(e.target.value))}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-0.5 text-xs"
            >
              <option value={1}>1 Day (Express)</option>
              <option value={3}>3 Days (Standard)</option>
              <option value={5}>5 Days (Slow)</option>
              <option value={7}>7 Days (Tier 3 Rural)</option>
            </select>
          </div>
        </div>

        {/* Competitor Price Compare & Exit Intent */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">Tab Switches (Price Compare)</label>
              <span className="text-xs font-bold text-purple-400">{tabSwitchCount} tabs</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              value={tabSwitchCount}
              onChange={(e) => setTabSwitchCount(Number(e.target.value))}
              className="w-full accent-purple-500 bg-slate-700 h-1.5 rounded-lg cursor-pointer mb-2"
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-700/50">
            <span className="text-slate-400">Exit Mouse Intent:</span>
            <button
              onClick={() => setMouseExitIntent(!mouseExitIntent)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-colors ${
                mouseExitIntent
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              {mouseExitIntent ? 'Exit Detected ⚠️' : 'Active Browsing'}
            </button>
          </div>
        </div>

      </div>

      {/* Output Panel when Scored */}
      {lastScoredSession && (
        <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-5 mt-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border shadow-lg ${
                (lastScoredSession.riskScore || 0) > 75
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-rose-900/30'
                  : (lastScoredSession.riskScore || 0) > 40
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-amber-900/30'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-emerald-900/30'
              }`}>
                {lastScoredSession.riskScore}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Abandonment Risk Score
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Diagnosis: <span className="text-amber-300">{lastScoredSession.predictedReason}</span></span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 text-xs font-mono">{lastScoredSession.latencyMs}ms latency</span>
                </div>
              </div>
            </div>

            {/* Recommended Action Pill */}
            <div className="flex items-center gap-2">
              <span className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border ${getActionBadgeColor(lastScoredSession.recommendedAction)} flex items-center gap-1.5 shadow-md`}>
                <Zap className="w-3.5 h-3.5" />
                Action: {lastScoredSession.recommendedAction}
              </span>

              <button
                onClick={() => onInspectSession(lastScoredSession)}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                Inspect XAI Trace
              </button>
            </div>
          </div>

          {/* Reasoning & Guardrail Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                Agent Policy Reasoning
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">
                {lastScoredSession.actionReasoning}
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                Discount & Margin Impact
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Discount Offered:</span>
                  <span className="font-bold text-white">
                    {lastScoredSession.discountOfferedAmount ? `₹${lastScoredSession.discountOfferedAmount} (${lastScoredSession.discountOfferedPct}%)` : '₹0 (No Discount)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Projected Recovery:</span>
                  <span className="font-bold text-emerald-400">
                    {((lastScoredSession.projectedRecoveryProb || 0) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1">
                  <span className="text-slate-400">Net Profit Impact:</span>
                  <span className="font-extrabold text-emerald-400">
                    +₹{lastScoredSession.expectedMarginImpact}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 font-medium mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                Guardrail & Channel Check
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Passed Margin Cap (Max 10%)
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  TRAI / DND Consent Verified
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  AI Decision Cost: <span className="text-slate-300 font-mono">₹{lastScoredSession.aiCostEst}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Live Nudge Preview Toast Banner */}
      {showToast && lastScoredSession && (
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-emerald-500/50 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shrink-0">
              <Smartphone className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1">
                <span>In-Session Nudge Triggered</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 font-normal">Sent to {lastScoredSession.customerName} ({lastScoredSession.customerPhone})</span>
              </div>
              <p className="text-sm font-semibold text-white mt-0.5">
                {lastScoredSession.recommendedAction === 'INSTANT_UPI_RETRY' && "⚡ 'Your ₹3,499 cart is saved! Tap here to complete via PhonePe / Google Pay in 1-click.'" }
                {lastScoredSession.recommendedAction === 'FREE_EXPRESS_SHIPPING' && "🚚 'Special Diwali Offer: We've upgraded your order to FREE Express Delivery!'" }
                {lastScoredSession.recommendedAction === 'TARGETED_MARGIN_DISCOUNT' && `🏷️ 'Exclusive Price Match: Save ₹${lastScoredSession.discountOfferedAmount} instantly on your cart!'` }
                {lastScoredSession.recommendedAction === 'COD_ENABLE_VERIFICATION' && "📦 'Unlock Cash on Delivery with instant OTP verification now!'" }
                {lastScoredSession.recommendedAction === 'EXIT_INTENT_TRUST_BADGE' && "🛡️ '100% Brand Warranty & Easy 7-Day Returns guaranteed on all items in your cart.'" }
                {lastScoredSession.recommendedAction === 'DO_NOTHING' && "Organic checkout continuing smoothly without intrusive popup." }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button 
              onClick={() => setShowToast(false)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
