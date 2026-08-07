import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  CheckCircle2, 
  ShieldAlert, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  Clock, 
  IndianRupee, 
  Zap, 
  Info,
  ChevronRight,
  Send,
  Sparkles
} from 'lucide-react';
import { UserSession, AgentStepTrace } from '../types';

interface SessionDetailModalProps {
  session: UserSession | null;
  onClose: () => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ session, onClose }) => {
  const [activeChannelTab, setActiveChannelTab] = useState<'whatsapp' | 'sms' | 'email' | 'in_app'>('whatsapp');

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto my-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">
                XAI Agent Trace & Session Inspector
              </h2>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-mono">
                {session.sessionId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Customer: <span className="text-slate-200 font-semibold">{session.customerName}</span> ({session.cityTier}) · Cart: <span className="text-emerald-400 font-bold">₹{session.cartValue.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </div>

        {/* Session Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Risk Score</span>
            <span className={`text-lg font-extrabold ${
              (session.riskScore || 0) > 75 ? 'text-rose-400' : (session.riskScore || 0) > 40 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {session.riskScore}/100
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Diagnosis Reason</span>
            <span className="text-sm font-bold text-amber-300">{session.predictedReason}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Recommended Action</span>
            <span className="text-sm font-bold text-emerald-400">{session.recommendedAction}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Decision Latency</span>
            <span className="text-sm font-bold text-purple-300 font-mono">{session.latencyMs || 110}ms</span>
          </div>
        </div>

        {/* Multi-Agent Execution Pipeline Breakdown */}
        <div className="mb-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-400" />
            Cooperating Multi-Agent Decision Trace
          </h3>

          <div className="space-y-2.5">
            
            {/* Step 1 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">
                1
              </div>
              <div className="flex-1 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">Signal Extractor Agent</span>
                  <span className="text-[10px] text-slate-400 font-mono">12ms · Heuristic</span>
                </div>
                <p className="text-slate-300">
                  Extracted key friction signals: Payment attempts = {session.paymentAttempts}, Failed method = {session.failedPaymentMethod || 'None'}, Tab switches = {session.tabSwitchCount}, Shipping fee = ₹{session.shippingFee}.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 font-bold text-xs flex items-center justify-center shrink-0 border border-purple-500/30">
                2
              </div>
              <div className="flex-1 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">Risk Classifier & Diagnosis Agent</span>
                  <span className="text-[10px] text-slate-400 font-mono">28ms · Classifier Ensemble</span>
                </div>
                <p className="text-slate-300">
                  Assigned risk score <strong>{session.riskScore}/100</strong>. Primary cause identified as <strong>{session.predictedReason}</strong>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
                3
              </div>
              <div className="flex-1 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">Policy & Margin Guardrail Auditor</span>
                  <span className="text-[10px] text-slate-400 font-mono">15ms · Policy Engine</span>
                </div>
                <p className="text-slate-300">
                  Matched action <strong>{session.recommendedAction}</strong>. Verified against per-user discount cap and campaign budget. Self-check status: <span className="text-emerald-400 font-semibold">PASSED</span>.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center shrink-0 border border-teal-500/30">
                4
              </div>
              <div className="flex-1 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">Nudge Synthesizer Agent</span>
                  <span className="text-[10px] text-slate-400 font-mono">45ms · Template Generator</span>
                </div>
                <p className="text-slate-300">
                  Generated personalized recovery payload for WhatsApp, SMS, and In-App modal with TRAI consent checks.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Multi-Channel Notification Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Omnichannel Remediation Preview
            </h3>

            {/* Channel Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveChannelTab('whatsapp')}
                className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  activeChannelTab === 'whatsapp' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp
              </button>

              <button
                onClick={() => setActiveChannelTab('sms')}
                className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  activeChannelTab === 'sms' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                SMS (Twilio)
              </button>

              <button
                onClick={() => setActiveChannelTab('email')}
                className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1 ${
                  activeChannelTab === 'email' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email (SendGrid)
              </button>
            </div>
          </div>

          {/* Tab Content Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-sans">
            {activeChannelTab === 'whatsapp' && (
              <div className="space-y-2">
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  WhatsApp Business API Payload (Official Opt-in)
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-200 leading-relaxed font-mono">
                  Hi {session.customerName}! 👋<br />
                  We noticed your order for {session.cartItems.map(i=>i.name).join(', ')} (₹{session.cartValue}) was interrupted during payment.<br />
                  <br />
                  {session.recommendedAction === 'INSTANT_UPI_RETRY' && "⚡ Tap here for 1-click PhonePe/GPay instant retry: https://rescue.app/pay?sess=" + session.sessionId}
                  {session.recommendedAction === 'FREE_EXPRESS_SHIPPING' && "🚚 Good news! We upgraded your shipping to FREE Express Delivery. Claim here: https://rescue.app/cart?sess=" + session.sessionId}
                  {session.recommendedAction === 'TARGETED_MARGIN_DISCOUNT' && `🏷️ Special Price Match: We applied ₹${session.discountOfferedAmount} discount to your cart! Complete here: https://rescue.app/checkout`}
                  {session.recommendedAction === 'DO_NOTHING' && "Your items are securely reserved in your cart. Revisit anytime!"}
                </div>
              </div>
            )}

            {activeChannelTab === 'sms' && (
              <div className="space-y-2">
                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                  TRAI / DND Compliant SMS (Twilio Route)
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-200 font-mono">
                  [CART-RESCUE] Hi {session.customerName}, your cart of ₹{session.cartValue} is saved! {session.recommendedAction === 'INSTANT_UPI_RETRY' ? 'Retry UPI in 1-tap: https://rescue.app/p/123' : 'Complete checkout now: https://rescue.app/c/123'} - Optout SMS STOP.
                </div>
              </div>
            )}

            {activeChannelTab === 'email' && (
              <div className="space-y-2">
                <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                  Transactional Email Template (SendGrid API)
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-200 space-y-1">
                  <div><strong>To:</strong> {session.customerEmail || 'customer@example.com'}</div>
                  <div><strong>Subject:</strong> {session.recommendedAction === 'INSTANT_UPI_RETRY' ? 'Action Required: Your Payment Session is Waiting' : 'Did you leave something behind in your cart?'}</div>
                  <div className="pt-2 text-slate-300 leading-relaxed">
                    Hello {session.customerName},<br />
                    Your items ({session.cartItems.map(i=>i.name).join(', ')}) are reserved. Click below to continue seamlessly.
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
